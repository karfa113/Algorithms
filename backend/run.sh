#!/usr/bin/env bash
# Algorithm Lab — local backend launcher (macOS/Linux/WSL).
# Run from this folder:  ./run.sh
set -e
cd "$(dirname "$0")"

if [ ! -x ".venv/bin/python" ]; then
  echo "[setup] No venv found. Creating one..."
  python3 -m venv .venv
  .venv/bin/python -m pip install -q -r requirements.txt
fi

echo "[run] Starting backend at http://127.0.0.1:8765"
echo "      Health check: http://127.0.0.1:8765/health"
echo "      Ctrl+C to stop."
exec .venv/bin/python -m uvicorn main:app --host 127.0.0.1 --port 8765
