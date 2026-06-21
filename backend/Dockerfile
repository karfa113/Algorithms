# Algorithm Lab — compile-and-run backend
# Render's native Python image ships without a C/C++ toolchain, so we use a
# Docker runtime and install gcc/g++ explicitly. coreutils (stdbuf) lets us
# force unbuffered output so interactive printf-then-scanf prompts arrive
# before the program blocks on input.

FROM python:3.11-slim

# Build tools + coreutils (for stdbuf). procps gives us ps for debugging.
RUN apt-get update \
 && apt-get install -y --no-install-recommends \
        gcc \
        g++ \
        coreutils \
        procps \
        libc6-dev \
 && rm -rf /var/lib/apt/lists/*

# Non-root runtime user so a stray rm -rf can't touch the system.
RUN useradd --system --create-home --shell /usr/sbin/nologin runner
WORKDIR /app

COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY main.py ./

USER runner

ENV PYTHONUNBUFFERED=1

# Render injects $PORT; default to 10000 for local docker runs.
ENV PORT=10000
EXPOSE 10000

CMD ["sh", "-c", "uvicorn main:app --host 0.0.0.0 --port ${PORT}"]
