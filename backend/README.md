# Algorithm Lab — Backend

A FastAPI + WebSocket service that compiles and runs C / C++ snippets sent from
the static Algorithm Lab front-end. Each program runs as a real `gcc` / `g++`
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
{ "type": "run",   "lang": "c" | "cpp", "code": "<source>" }  // first message
{ "type": "input", "data": "5\n" }                             // subsequent stdin
{ "type": "kill" }                                             // abort current run
```

Server → client:

```jsonc
{ "type": "status",        "phase": "compiling" | "running" }
{ "type": "stdout",        "data": "..." }
{ "type": "stderr",        "data": "..." }
{ "type": "compile_error", "data": "<gcc stderr>" }
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
4. Copy that URL into the front-end runner (`script.js`, look for `BACKEND_URL`).

### Free-tier caveat

Render free instances auto-sleep after ~15 min of inactivity. The first
request after sleep takes ~30 s to cold-start. The front-end pings `/health`
on page load to keep things warm during a study session.

## Safety knobs (in `main.py`)

| Knob                   | Default        | Effect                                      |
| ---------------------- | -------------- | ------------------------------------------- |
| `COMPILE_TIMEOUT`      | 10 s           | Kill `gcc` if it stalls.                    |
| `RUN_WALL_TIMEOUT`     | 30 s           | Kill the program after 30 s of wall-clock.  |
| `RUN_CPU_SECONDS`      | 15 s           | POSIX `RLIMIT_CPU`.                         |
| `RUN_MEM_BYTES`        | 256 MB         | POSIX `RLIMIT_AS`.                          |
| `RUN_MAX_PROCS`        | 16             | `RLIMIT_NPROC` — blocks fork bombs.         |
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
