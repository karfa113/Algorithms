"""
Algorithm Lab — compile-and-run backend.

WebSocket /ws/run:
  Client -> Server:
    {"type": "run",   "lang": "c"|"cpp", "code": "..."}     # first message; required
    {"type": "input", "data": "..."}                         # subsequent stdin lines
    {"type": "kill"}                                         # terminate current run
  Server -> Client:
    {"type": "status",        "phase": "compiling"|"running"}
    {"type": "stdout",        "data": "..."}
    {"type": "stderr",        "data": "..."}
    {"type": "compile_error", "data": "..."}                 # gcc/g++ stderr
    {"type": "error",         "message": "..."}              # server-side problem
    {"type": "exit",          "code": <int>, "time_ms": <int>}

Safety: subprocess runs with rlimit on CPU/memory/processes/file-size (POSIX only)
plus a wall-clock timeout. Not a hardened sandbox — intended for a low-traffic
study site. For a public-facing deploy, wrap in Docker with a seccomp profile.
"""

import asyncio
import json
import logging
import os
import platform
import shutil
import signal
import tempfile
import time
from pathlib import Path

from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s")
log = logging.getLogger("algorun")

IS_POSIX = platform.system() != "Windows"

if IS_POSIX:
    import resource

# ----- Knobs -----
COMPILE_TIMEOUT      = 10                   # seconds for gcc/g++ itself
RUN_WALL_TIMEOUT     = 30                   # seconds the program may run (allows for interactive input)
RUN_CPU_SECONDS      = 15                   # POSIX rlimit on CPU time
RUN_MEM_BYTES        = 256 * 1024 * 1024    # 256 MB virtual memory
# RLIMIT_NPROC is per-UID, not per-process-tree, so it counts every process
# owned by the runtime user — too low a value kills concurrent runs. Set it
# generously; the wall timeout is the real defence against fork bombs.
RUN_MAX_PROCS        = 256
RUN_MAX_FSIZE        = 10 * 1024 * 1024     # 10 MB file write cap
MAX_CODE_BYTES       = 200 * 1024           # 200 KB source cap
MAX_INPUT_LINE_BYTES = 4096                 # 4 KB per stdin line
STREAM_CHUNK         = 512                  # bytes per stdout/stderr read

# GCC-style constructor that forces stdout/stderr into unbuffered mode before
# main() runs. Without this, MinGW (Windows) and even glibc when stdout is a
# pipe will buffer prompts like printf("Enter n: "), so the user never sees
# the prompt and scanf blocks forever. The #line directive resets the
# reported line numbers so compile errors point at the user's source.
_UNBUFFER_PREAMBLE_C = (
    '#include <stdio.h>\n'
    '__attribute__((constructor)) static void _algolab_unbuffer(void){'
    'setvbuf(stdout,(char*)0,_IONBF,0);'
    'setvbuf(stderr,(char*)0,_IONBF,0);'
    '}\n'
    '#line 1 "main.c"\n'
)
_UNBUFFER_PREAMBLE_CPP = (
    # cstdio + iostream so both printf/scanf and cin/cout work unbuffered.
    # ios_base::Init guarantees cout/cerr exist before our object constructs.
    # setf(unitbuf) is needed because cout has its own streambuf separate from
    # stdio — setvbuf alone wouldn't flush it.
    '#include <cstdio>\n'
    '#include <iostream>\n'
    'namespace { struct _algolab_unbuffer_t {\n'
    '  _algolab_unbuffer_t(){\n'
    '    std::cout.setf(std::ios_base::unitbuf);\n'
    '    std::cerr.setf(std::ios_base::unitbuf);\n'
    '    std::setvbuf(stdout,(char*)0,_IONBF,0);\n'
    '    std::setvbuf(stderr,(char*)0,_IONBF,0);\n'
    '  }\n'
    '} _algolab_unbuffer_instance; }\n'
    '#line 1 "main.cpp"\n'
)

LANG_CONFIG = {
    "c": {
        "compiler": "gcc",
        "ext":      ".c",
        "flags":    ["-O0", "-w", "-std=c11", "-lm"],
        "preamble": _UNBUFFER_PREAMBLE_C,
    },
    "cpp": {
        "compiler": "g++",
        "ext":      ".cpp",
        "flags":    ["-O0", "-w", "-std=c++17", "-lm"],
        "preamble": _UNBUFFER_PREAMBLE_CPP,
    },
}

app = FastAPI(title="Algorithm Lab Runner")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],          # tighten to GH Pages origin in production
    allow_methods=["*"],
    allow_headers=["*"],
)


def _apply_limits():
    """preexec_fn — applied inside the forked child before exec."""
    resource.setrlimit(resource.RLIMIT_CPU,   (RUN_CPU_SECONDS, RUN_CPU_SECONDS))
    try:
        resource.setrlimit(resource.RLIMIT_AS, (RUN_MEM_BYTES, RUN_MEM_BYTES))
    except (ValueError, OSError):
        pass  # macOS doesn't always honour RLIMIT_AS — don't block startup
    try:
        resource.setrlimit(resource.RLIMIT_NPROC, (RUN_MAX_PROCS, RUN_MAX_PROCS))
    except (ValueError, OSError):
        pass  # RLIMIT_NPROC unavailable on some POSIX flavours
    resource.setrlimit(resource.RLIMIT_FSIZE, (RUN_MAX_FSIZE, RUN_MAX_FSIZE))
    os.setpgrp()  # own process group so we can kill the whole tree


def _kill_process_tree(proc) -> None:
    """Kill the child *and* its descendants. On POSIX, use the process group
    (we set os.setpgrp() in the preexec so the child anchors its own group).
    On Windows just kill the direct child — asyncio handles the rest."""
    if proc is None or proc.returncode is not None:
        return
    if IS_POSIX:
        try:
            os.killpg(os.getpgid(proc.pid), signal.SIGKILL)
            return
        except (ProcessLookupError, PermissionError, OSError):
            pass  # fall through to direct kill
    try:
        proc.kill()
    except (ProcessLookupError, OSError):
        pass


def _has_cmd(name: str) -> bool:
    return shutil.which(name) is not None


async def _send(ws: WebSocket, msg: dict) -> bool:
    try:
        await ws.send_text(json.dumps(msg))
        return True
    except Exception:
        return False


async def _pump_stream(ws: WebSocket, stream, kind: str):
    """Forward chunks from a subprocess stream to the WebSocket."""
    try:
        while True:
            chunk = await stream.read(STREAM_CHUNK)
            if not chunk:
                return
            ok = await _send(ws, {"type": kind, "data": chunk.decode("utf-8", errors="replace")})
            if not ok:
                return
    except Exception:
        return


async def _client_loop(ws: WebSocket, proc: asyncio.subprocess.Process):
    """Read messages from the client; route input -> stdin, kill -> terminate."""
    try:
        while True:
            raw = await ws.receive_text()
            try:
                msg = json.loads(raw)
            except Exception:
                continue
            t = msg.get("type")
            if t == "input":
                data = msg.get("data", "")
                if not isinstance(data, str):
                    continue
                if len(data.encode("utf-8")) > MAX_INPUT_LINE_BYTES:
                    continue
                if not data.endswith("\n"):
                    data += "\n"
                if proc.stdin and not proc.stdin.is_closing():
                    try:
                        proc.stdin.write(data.encode("utf-8"))
                        await proc.stdin.drain()
                    except (BrokenPipeError, ConnectionResetError, OSError):
                        return
            elif t == "kill":
                _kill_process_tree(proc)
                return
    except WebSocketDisconnect:
        _kill_process_tree(proc)
    except asyncio.CancelledError:
        raise
    except Exception:
        log.exception("client loop crashed")
        return


async def _compile_and_run(ws: WebSocket, lang: str, code: str):
    if lang not in LANG_CONFIG:
        await _send(ws, {"type": "error", "message": f"Unsupported language: {lang!r}"})
        return
    if not code:
        await _send(ws, {"type": "error", "message": "Code is empty."})
        return
    if len(code.encode("utf-8")) > MAX_CODE_BYTES:
        await _send(ws, {"type": "error", "message": "Code is too large."})
        return

    cfg = LANG_CONFIG[lang]
    if not _has_cmd(cfg["compiler"]):
        await _send(ws, {"type": "error", "message": f"{cfg['compiler']} not installed on server."})
        return

    tmp = Path(tempfile.mkdtemp(prefix="algorun_"))
    src = tmp / f"main{cfg['ext']}"
    binp = tmp / ("main.exe" if not IS_POSIX else "main")

    try:
        # Prepend the unbuffering preamble so prompts without trailing \n
        # appear before the program blocks on scanf/cin.
        src.write_text(cfg["preamble"] + code, encoding="utf-8")

        # ---- Compile ----
        await _send(ws, {"type": "status", "phase": "compiling"})
        compile_cmd = [cfg["compiler"], str(src), "-o", str(binp), *cfg["flags"]]
        try:
            cp = await asyncio.create_subprocess_exec(
                *compile_cmd,
                stdout=asyncio.subprocess.PIPE,
                stderr=asyncio.subprocess.PIPE,
            )
        except (OSError, FileNotFoundError) as e:
            await _send(ws, {"type": "error", "message": f"Could not start compiler: {e}"})
            return

        try:
            _, cerr = await asyncio.wait_for(cp.communicate(), timeout=COMPILE_TIMEOUT)
        except asyncio.TimeoutError:
            try:
                cp.kill()
            except (ProcessLookupError, OSError):
                pass
            try:
                await asyncio.wait_for(cp.wait(), timeout=2)  # reap zombie
            except asyncio.TimeoutError:
                pass
            await _send(ws, {"type": "error", "message": "Compilation timed out."})
            return
        if cp.returncode != 0:
            await _send(ws, {
                "type": "compile_error",
                "data": cerr.decode("utf-8", errors="replace"),
            })
            return
        if not binp.exists():
            await _send(ws, {"type": "error", "message": "Compiler produced no binary."})
            return

        # ---- Run ----
        await _send(ws, {"type": "status", "phase": "running"})

        # Use stdbuf on POSIX to force the child's libc into unbuffered mode so
        # printf prompts without a trailing '\n' actually appear before the
        # blocking scanf/cin call. Falls back to direct exec if stdbuf missing.
        if IS_POSIX and _has_cmd("stdbuf"):
            run_argv = ["stdbuf", "-o0", "-e0", str(binp)]
        else:
            run_argv = [str(binp)]

        kwargs = dict(
            stdin=asyncio.subprocess.PIPE,
            stdout=asyncio.subprocess.PIPE,
            stderr=asyncio.subprocess.PIPE,
            cwd=str(tmp),
        )
        if IS_POSIX:
            kwargs["preexec_fn"] = _apply_limits

        t0 = time.monotonic()
        try:
            proc = await asyncio.create_subprocess_exec(*run_argv, **kwargs)
        except (OSError, FileNotFoundError) as e:
            await _send(ws, {"type": "error", "message": f"Could not start program: {e}"})
            return

        stdout_task = asyncio.create_task(_pump_stream(ws, proc.stdout, "stdout"))
        stderr_task = asyncio.create_task(_pump_stream(ws, proc.stderr, "stderr"))
        input_task  = asyncio.create_task(_client_loop(ws, proc))
        tasks = (stdout_task, stderr_task, input_task)

        timed_out = False
        rc = -1
        try:
            try:
                rc = await asyncio.wait_for(proc.wait(), timeout=RUN_WALL_TIMEOUT)
            except asyncio.TimeoutError:
                timed_out = True
                _kill_process_tree(proc)
                try:
                    rc = await asyncio.wait_for(proc.wait(), timeout=2)
                except asyncio.TimeoutError:
                    rc = -9
        finally:
            # Make sure the child is dead before we touch its tempdir.
            _kill_process_tree(proc)
            # Give pump tasks a brief grace period to drain buffered output;
            # wait_for will auto-cancel them on timeout.
            for t in (stdout_task, stderr_task):
                try:
                    await asyncio.wait_for(t, timeout=1.5)
                except (asyncio.TimeoutError, asyncio.CancelledError):
                    pass
                except Exception:
                    pass
            # The input loop has no natural exit while the ws is live; cancel it.
            input_task.cancel()
            try:
                await input_task
            except (asyncio.CancelledError, Exception):
                pass

        if timed_out:
            await _send(ws, {
                "type": "error",
                "message": f"Program ran longer than {RUN_WALL_TIMEOUT}s and was terminated.",
            })

        await _send(ws, {
            "type":    "exit",
            "code":    rc,
            "time_ms": int((time.monotonic() - t0) * 1000),
        })

    finally:
        shutil.rmtree(tmp, ignore_errors=True)


@app.get("/")
async def root():
    return {
        "service":   "algolab-runner",
        "status":    "ok",
        "platform":  platform.system(),
        "languages": sorted(LANG_CONFIG.keys()),
    }


@app.get("/health")
async def health():
    return {"ok": True}


@app.websocket("/ws/run")
async def ws_run(ws: WebSocket):
    await ws.accept()
    try:
        raw = await ws.receive_text()
        msg = json.loads(raw)
        if msg.get("type") != "run":
            await _send(ws, {"type": "error", "message": "First message must be {type:'run', lang, code}."})
            return
        lang = (msg.get("lang") or "").lower()
        code = msg.get("code") or ""
        await _compile_and_run(ws, lang, code)
    except WebSocketDisconnect:
        return
    except Exception as e:
        await _send(ws, {"type": "error", "message": f"Server error: {e}"})
    finally:
        try:
            await ws.close()
        except Exception:
            pass
