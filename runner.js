/* ============================================================
   Algorithm Lab — backend runner (WebSocket client)
   Streams gcc/g++ compile + run through ws://.../ws/run.
   ============================================================ */

(function () {
  "use strict";

  // ---- Where the Python backend lives -------------------------------------
  // Local dev:   ws://127.0.0.1:8765
  // Render:      wss://<your-service>.onrender.com
  // The runner picks based on hostname so you can deploy the static site to
  // GitHub Pages without editing this for every push.
  const BACKEND_URL = (() => {
    const host = location.hostname;
    if (host === "" || host === "localhost" || host === "127.0.0.1") {
      return "ws://127.0.0.1:8765/ws/run";
    }
    // EDIT THIS once Render gives you a URL:
    return "wss://algorithms-zph7.onrender.com/ws/run";
  })();

  // Warm the Render free-tier dyno (cuts the first-run cold start) by hitting
  // /health on page load. Best-effort; failures are silent.
  (function warmBackend() {
    const httpUrl = BACKEND_URL.replace(/^ws/, "http").replace(/\/ws\/run$/, "/health");
    try { fetch(httpUrl, { mode: "cors", cache: "no-store" }).catch(() => {}); } catch {}
  })();

  /* ----- TerminalSession: one ws + one terminal pane -------------------- */
  class TerminalSession {
    /**
     * @param {object} ui
     * @param {(text:string, cls?:string) => void} ui.write     append text to output
     * @param {(phase:string) => void}             ui.status    update status pill
     * @param {() => void}                         ui.onReady   show input prompt
     * @param {() => void}                         ui.onEnd     hide input prompt, re-enable Run
     */
    constructor(ui) {
      this.ui = ui;
      this.ws = null;
    }

    start(lang, code) {
      if (this.ws) this.stop();

      this.ui.status("connecting");
      let ws;
      try {
        ws = new WebSocket(BACKEND_URL);
      } catch (e) {
        this.ui.write("Could not open WebSocket: " + (e.message || e), "err");
        this.ui.onEnd();
        return;
      }
      this.ws = ws;

      ws.addEventListener("open", () => {
        ws.send(JSON.stringify({ type: "run", lang, code }));
      });

      ws.addEventListener("message", (ev) => {
        let msg;
        try { msg = JSON.parse(ev.data); } catch { return; }
        switch (msg.type) {
          case "status":
            this.ui.status(msg.phase);
            if (msg.phase === "running") this.ui.onReady();
            break;
          case "stdout":
            this.ui.write(msg.data, "out");
            break;
          case "stderr":
            this.ui.write(msg.data, "err");
            break;
          case "compile_error":
            this.ui.status("compile error");
            this.ui.write(msg.data, "err");
            break;
          case "error":
            this.ui.write("\n[error] " + msg.message + "\n", "err");
            break;
          case "exit":
            this.ui.status("exited " + msg.code + " · " + msg.time_ms + " ms");
            this.ui.write(
              "\n[program exited with code " + msg.code +
              " · " + msg.time_ms + " ms]\n",
              "meta"
            );
            this.ui.onEnd();
            try { ws.close(); } catch {}
            this.ws = null;
            break;
        }
      });

      ws.addEventListener("close", () => {
        this.ui.onEnd();
        if (this.ws === ws) this.ws = null;
      });

      ws.addEventListener("error", () => {
        this.ui.write(
          "\n[connection failed — is the backend running at " + BACKEND_URL + "?]\n",
          "err"
        );
        this.ui.status("disconnected");
        this.ui.onEnd();
      });
    }

    sendInput(line) {
      if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return false;
      this.ws.send(JSON.stringify({ type: "input", data: line }));
      return true;
    }

    stop() {
      if (!this.ws) return;
      try { this.ws.send(JSON.stringify({ type: "kill" })); } catch {}
      try { this.ws.close(); } catch {}
      this.ws = null;
    }

    isLive() {
      return !!this.ws && this.ws.readyState === WebSocket.OPEN;
    }
  }

  window.AlgoRunner = { TerminalSession, BACKEND_URL };
})();
