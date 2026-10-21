# DSA Lab — Backend

A FastAPI + WebSocket service that compiles and runs **C, C++ and Java** snippets sent from
the static DSA Lab front-end. Each program runs as a real `gcc` / `g++` / `javac` + `java`
subprocess, with `stdout` / `stderr` streamed back to the browser and `stdin`
piped in from the user as they type — i.e. a real interactive terminal.

## Endpoints

| Method | Path        | Purpose                                              |
| ------ | ----------- | ---------------------------------------------------- |
| GET    | `/`         | Service info + supported languages.                  |
| GET    | `/health`   | Liveness probe (used by Render).                     |
| WS     | `/ws/run`   | One run per connection. See `main.py` for protocol.  |

## WebSocket protocol

Client → server:

```jsonc
{ "type": "run",   "lang": "c" | "cpp" | "java", "code": "<source>" }  // first message
{ "type": "input", "data": "5\n" }                             // subsequent stdin
{ "type": "kill" }                                             // abort current run
```

Server → client:

```jsonc
{ "type": "status",        "phase": "compiling" | "running" }
{ "type": "stdout",        "data": "..." }
{ "type": "stderr",        "data": "..." }
{ "type": "compile_error", "data": "<gcc / javac stderr>" }
{ "type": "error",         "message": "..." }
{ "type": "exit",          "code": 0, "time_ms": 123 }
```

## Local development (Windows / macOS / Linux)

```bash
cd backend
python -m venv .venv
# Windows:
.venv\Scripts\activate
# macOS/Linux:
source .venv/bin/activate

pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

Then open <http://localhost:8000/> — you should see a JSON status response.

> **Windows note:** `setrlimit` and `stdbuf` are POSIX-only. On Windows we skip
> them — runs still work, but resource limits and unbuffered output are not
> enforced. Always deploy to a POSIX host (Render's default Linux image).

### Manual WebSocket test with `wscat`

```bash
npm install -g wscat
wscat -c ws://localhost:8000/ws/run
# then paste:
{"type":"run","lang":"c","code":"#include <stdio.h>\nint main(){int n;printf(\"n? \");scanf(\"%d\",&n);printf(\"got %d\\n\",n*2);return 0;}"}
# wait for {"type":"status","phase":"running"}, then:
{"type":"input","data":"21"}
```

## Deploy to Render (free tier)

1. Push this repo to GitHub.
2. In Render → **New +** → **Blueprint** → point at the repo root.
   Render reads `backend/render.yaml` automatically.
3. First deploy takes ~3 min. Render gives you a URL like
   `https://algolab-runner.onrender.com`.
4. Copy that URL into `config.js` (`backend.remote`, using `wss://…/ws/run`).

### Free-tier caveat

Render free instances auto-sleep after ~15 min of inactivity. The first
request after sleep takes ~30 s to cold-start. The front-end pings `/health`
on page load to keep things warm during a study session.

## Safety knobs (in `main.py`)

| Knob                   | Default        | Effect                                      |
| ---------------------- | -------------- | ------------------------------------------- |
| `COMPILE_TIMEOUT`      | 10 s           | Kill `gcc` / `g++` if it stalls.            |
| `JAVA_COMPILE_TIMEOUT` | 40 s           | Same for `javac` (it boots a JVM, slower).  |
| `RUN_WALL_TIMEOUT`     | 30 s           | Kill the program after 30 s of wall-clock.  |
| `RUN_CPU_SECONDS`      | 15 s           | POSIX `RLIMIT_CPU`.                         |
| `RUN_MEM_BYTES`        | 256 MB         | POSIX `RLIMIT_AS` (C/C++ only).             |
| `JAVA_FLAGS`           | `-Xmx128m` …   | JVM heap/stack caps (Java ignores RLIMIT_AS). |
| `RUN_MAX_PROCS`        | 256            | `RLIMIT_NPROC` — blocks fork bombs.         |
| `RUN_MAX_FSIZE`        | 10 MB          | `RLIMIT_FSIZE` — blocks disk fill.          |
| `MAX_CODE_BYTES`       | 200 KB         | Reject oversize source.                     |
| `MAX_INPUT_LINE_BYTES` | 4 KB           | Reject oversize stdin frames.               |

> **This is not a hardened sandbox.** It's adequate for a personal study site.
> For a public-facing deploy with untrusted traffic, wrap the run step in a
> Docker container with a seccomp profile, drop network capabilities, and run
> as a dedicated unprivileged user.

## CORS

`allow_origins=["*"]` for now. Tighten to your GitHub Pages origin in
`main.py` before going public:

```python
allow_origins=["https://<your-username>.github.io"],
```

## Java notes

* The Docker image installs `default-jdk-headless`, so `javac` and `java` are on the PATH.
* `javac` needs the file to be named after the **public class**. The runner reads the
  source, picks the `public class X` (or the first class that has `main`), writes `X.java`,
  compiles with `javac -d <tmp>` and runs `java -cp <tmp> X`. Any class name works, helper
  classes in the same file are fine.
* Free-tier Render instances have 0.1 CPU, so the first Java run can take 5–10 s
  (JVM start + `javac`). Later runs are quicker.
* Output is unbuffered automatically (`System.out.print` flushes), so prompts appear
  before `Scanner` blocks.

## Testing

```bash
pip install websockets
uvicorn main:app --port 8765        # terminal 1
python test_backend.py              # terminal 2 — runs C, C++ and Java scenarios
```
