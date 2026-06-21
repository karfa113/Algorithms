@echo off
REM Algorithm Lab — local backend launcher.
REM Run this from the backend folder by double-clicking, or:
REM     run.bat
REM Stops the server with Ctrl+C.

setlocal
cd /d "%~dp0"

if not exist ".venv\Scripts\python.exe" (
    echo [setup] No venv found. Creating one...
    python -m venv .venv || goto :err
    .venv\Scripts\python -m pip install -q -r requirements.txt || goto :err
)

echo [run] Starting backend at http://127.0.0.1:8765
echo       Health check: http://127.0.0.1:8765/health
echo       Ctrl+C to stop.
.venv\Scripts\python -m uvicorn main:app --host 127.0.0.1 --port 8765
goto :eof

:err
echo.
echo [error] Setup failed. Make sure Python 3.10+ is installed and on PATH.
pause
exit /b 1
