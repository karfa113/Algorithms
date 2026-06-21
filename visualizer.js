/* ============================================================
   Algorithm Lab — Visualizer
   Per-algorithm SVG animation pane.

   How it works
   ------------
   Each algorithm registers a factory:
     register(id, {
       inputs:  [{ name, label, default, placeholder? }],
       presets: [{ name, values }],     // values keyed by input name
       build({ ...values }) -> { frames, render } | { error }
     })

   A "frame" is any plain object; the algorithm's own render(frame, svgHost)
   draws it. The framework only owns the playback controls, input editor,
   and DOM scaffold.
   ============================================================ */

(function () {
  "use strict";

  /* ----- SVG helpers ----------------------------------------------------- */
  const NS = "http://www.w3.org/2000/svg";
  function el(tag, attrs, kids) {
    const n = document.createElementNS(NS, tag);
    if (attrs) for (const k in attrs) n.setAttribute(k, attrs[k]);
    if (kids) for (const c of kids) n.appendChild(c);
    return n;
  }
  function txt(x, y, s, cls, anchor = "middle") {
    const t = el("text", { x, y, "text-anchor": anchor, class: "v-t " + (cls || "") });
    t.textContent = s;
    return t;
  }
  function clear(svg) { while (svg.firstChild) svg.removeChild(svg.firstChild); }

  /* ----- Palette --------------------------------------------------------- */
  const COL = {
    base:    "#ff7a18",
    soft:    "#ff9a4d",
    bright:  "#ffb347",
    dim:     "rgba(255,122,24,0.25)",
    win:     "#22c55e",
    cmp:     "#facc15",
    pivot:   "#a855f7",
    miss:    "#ef4444",
    accent:  "#22d3ee",
    edge:    "rgba(255,122,24,0.55)",
    edgeOn:  "#22c55e",
    edgeBad: "#ef4444",
    edgeHi:  "#facc15",
    text:    "#ededed",
    muted:   "rgba(237,237,237,0.55)",
  };

  /* ----- Parsing helpers ------------------------------------------------- */
  const P = {
    nums(s) {
      const a = String(s).split(/[\s,]+/).map(x => x.trim()).filter(Boolean).map(Number);
      if (a.some(n => Number.isNaN(n))) throw new Error("Expected comma-separated numbers");
      return a;
    },
    int(s) {
      const v = parseInt(String(s).trim(), 10);
      if (Number.isNaN(v)) throw new Error("Expected an integer");
      return v;
    },
    edges(s) {
      // "0-1, 1-2:5, 2-3" — weight after ':' is optional (default 1)
      return String(s).split(/[,\n]+/).map(p => p.trim()).filter(Boolean).map(p => {
        const m = p.match(/^(\d+)\s*-\s*(\d+)(?::(-?\d+(?:\.\d+)?))?$/);
        if (!m) throw new Error("Edge syntax: u-v or u-v:w");
        return { u: +m[1], v: +m[2], w: m[3] === undefined ? 1 : +m[3] };
      });
    },
    matrix(s) {
      // Rows separated by ';' or newline, cells by ',' or whitespace
      const rows = String(s).split(/[;\n]+/).map(r => r.trim()).filter(Boolean);
      const m = rows.map(r => r.split(/[\s,]+/).filter(Boolean).map(Number));
      const w = m[0].length;
      if (m.some(r => r.length !== w)) throw new Error("Matrix rows must be equal length");
      if (m.some(r => r.some(Number.isNaN))) throw new Error("Matrix cells must be numbers");
      return m;
    },
    pairs(s) {
      // "w,v ; w,v ; ..." → [[w,v], ...]
      return String(s).split(/[;\n]+/).map(p => p.trim()).filter(Boolean).map(p => {
        const a = p.split(/[\s,]+/).filter(Boolean).map(Number);
        if (a.some(Number.isNaN)) throw new Error("Pair must be numeric");
        return a;
      });
    },
  };

  /* ----- Reusable drawers ------------------------------------------------ */
  function drawArrayBars(svg, arr, opts = {}) {
    clear(svg);
    const n = arr.length || 1;
    const W = 720, H = 220, pad = 24;
    const maxV = Math.max(1, ...arr.map(v => Math.abs(v)));
    const minV = Math.min(0, ...arr);
    const range = (Math.max(1, maxV) - Math.min(0, minV)) || 1;
    const bw = (W - pad * 2) / n;
    const bh = H - pad * 2 - 28;        // leave space for labels
    svg.setAttribute("viewBox", `0 0 ${W} ${H}`);

    const hl = opts.highlights || {};
    const labels = opts.labels || {};

    arr.forEach((v, i) => {
      const h = ((Math.abs(v) - 0) / Math.max(1, maxV)) * bh;
      const x = pad + i * bw + 3;
      const y = H - pad - h;
      const fill =
        hl[i] === "win"   ? COL.win   :
        hl[i] === "cmp"   ? COL.cmp   :
        hl[i] === "pivot" ? COL.pivot :
        hl[i] === "miss"  ? COL.miss  :
        hl[i] === "lo"    ? COL.accent :
        hl[i] === "hi"    ? COL.accent :
        hl[i] === "mid"   ? COL.bright :
        hl[i] === "done"  ? COL.dim   :
        COL.base;
      svg.appendChild(el("rect", {
        x, y, width: Math.max(2, bw - 6), height: Math.max(2, h),
        rx: 4, fill, opacity: hl[i] === "done" ? 0.45 : 0.95,
      }));
      svg.appendChild(txt(x + (bw - 6) / 2, y - 4, String(v), "v-num"));
      svg.appendChild(txt(x + (bw - 6) / 2, H - pad + 14, String(i), "v-idx"));
      const lab = labels[i];
      if (lab) svg.appendChild(txt(x + (bw - 6) / 2, H - 4, lab, "v-tag"));
    });
  }

  function nodeXY(i, n, cx, cy, r) {
    const a = -Math.PI / 2 + (2 * Math.PI * i) / n;
    return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
  }
  function drawGraph(svg, g, opts = {}) {
    // g: { n, edges:[{u,v,w?}], directed? }
    clear(svg);
    const W = 720, H = 360;
    svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
    const cx = W / 2, cy = H / 2, r = Math.min(W, H) / 2 - 50;
    const pos = [];
    for (let i = 0; i < g.n; i++) pos.push(nodeXY(i, g.n, cx, cy, r));

    const ec = opts.edgeColors || {};   // key "u-v" → color
    const el2 = opts.edgeLabel || {};   // key "u-v" → string
    const ns = opts.nodeStates || {};   // i → "visited" | "current" | "frontier" | "done"
    const nl = opts.nodeLabels || {};   // i → label override (e.g. distance)

    // arrow marker
    const defs = el("defs", null, []);
    function marker(id, color) {
      const m = el("marker", {
        id, viewBox: "0 0 10 10", refX: 10, refY: 5,
        markerWidth: 6, markerHeight: 6, orient: "auto-start-reverse",
      });
      m.appendChild(el("path", { d: "M 0 0 L 10 5 L 0 10 z", fill: color }));
      return m;
    }
    defs.appendChild(marker("arr-base",   COL.edge));
    defs.appendChild(marker("arr-on",     COL.edgeOn));
    defs.appendChild(marker("arr-bad",    COL.edgeBad));
    defs.appendChild(marker("arr-hi",     COL.edgeHi));
    svg.appendChild(defs);

    (g.edges || []).forEach((e, k) => {
      const key = `${e.u}-${e.v}`;
      const key2 = `${e.v}-${e.u}`;
      const c = ec[key] || ec[key2] || COL.edge;
      const arrowId =
        c === COL.edgeOn  ? "arr-on"  :
        c === COL.edgeBad ? "arr-bad" :
        c === COL.edgeHi  ? "arr-hi"  : "arr-base";
      const [x1, y1] = pos[e.u], [x2, y2] = pos[e.v];
      svg.appendChild(el("line", {
        x1, y1, x2, y2, stroke: c,
        "stroke-width": c === COL.edge ? 2 : 3.5,
        opacity: c === COL.edge ? 0.7 : 1,
        ...(g.directed ? { "marker-end": `url(#${arrowId})` } : {}),
      }));
      const lab = el2[key] || el2[key2] || (e.w !== undefined && e.w !== 1 ? String(e.w) : "");
      if (lab) {
        const mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
        // backing pill so label is readable across the line
        svg.appendChild(el("rect", {
          x: mx - 14, y: my - 10, width: 28, height: 18,
          rx: 4, fill: "#0a0a0a", "fill-opacity": 0.8,
        }));
        svg.appendChild(txt(mx, my + 4, lab, "v-w"));
      }
    });

    for (let i = 0; i < g.n; i++) {
      const [x, y] = pos[i];
      const st = ns[i] || "idle";
      const fill =
        st === "current"  ? COL.bright :
        st === "visited"  ? COL.win    :
        st === "frontier" ? COL.cmp    :
        st === "done"     ? COL.dim    :
        st === "bad"      ? COL.miss   :
        "#0a0a0a";
      svg.appendChild(el("circle", {
        cx: x, cy: y, r: 22, fill, stroke: COL.base, "stroke-width": 2,
      }));
      svg.appendChild(txt(x, y + 5, String(i), "v-node"));
      const lab = nl[i];
      if (lab !== undefined) svg.appendChild(txt(x, y - 30, String(lab), "v-nlab"));
    }
  }

  function drawMatrix(svg, m, opts = {}) {
    clear(svg);
    const rows = m.length, cols = m[0] ? m[0].length : 0;
    const cell = Math.min(54, Math.floor(640 / Math.max(rows, cols)));
    const W = cols * cell + 60, H = rows * cell + 60;
    svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
    const hl = opts.highlights || {};   // "r,c" → "active" | "done" | "k"
    const fmt = opts.fmt || (v => (v === Infinity ? "∞" : String(v)));

    // headers
    for (let j = 0; j < cols; j++)
      svg.appendChild(txt(40 + j * cell + cell / 2, 22, String(j), "v-idx"));
    for (let i = 0; i < rows; i++)
      svg.appendChild(txt(20, 40 + i * cell + cell / 2 + 4, String(i), "v-idx"));

    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        const k = `${i},${j}`;
        const tag = hl[k];
        const fill =
          tag === "active" ? COL.bright :
          tag === "k"      ? COL.pivot  :
          tag === "done"   ? COL.win    :
          tag === "row"    ? COL.cmp    :
          tag === "col"    ? COL.accent :
          "rgba(255,122,24,0.10)";
        svg.appendChild(el("rect", {
          x: 40 + j * cell, y: 30 + i * cell,
          width: cell - 2, height: cell - 2, rx: 4,
          fill, stroke: COL.edge, "stroke-width": 1,
          opacity: tag === "done" ? 0.55 : 0.95,
        }));
        svg.appendChild(txt(
          40 + j * cell + cell / 2,
          30 + i * cell + cell / 2 + 4,
          fmt(m[i][j]), "v-mc",
        ));
      }
    }
  }

  function drawBoard(svg, n, queens, attempt, conflicts) {
    clear(svg);
    const cell = Math.min(56, Math.floor(420 / Math.max(n, 4)));
    const W = n * cell + 20, H = n * cell + 20;
    svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
    for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) {
      const dark = (r + c) % 2 === 1;
      svg.appendChild(el("rect", {
        x: 10 + c * cell, y: 10 + r * cell, width: cell, height: cell,
        fill: dark ? "#1a1a1a" : "#0a0a0a",
        stroke: COL.edge, "stroke-width": 0.5,
      }));
    }
    if (attempt && attempt.row !== -1) {
      svg.appendChild(el("rect", {
        x: 10 + attempt.col * cell, y: 10 + attempt.row * cell,
        width: cell, height: cell, fill: COL.cmp, "fill-opacity": 0.4,
      }));
    }
    (conflicts || []).forEach(([r, c]) => {
      svg.appendChild(el("rect", {
        x: 10 + c * cell, y: 10 + r * cell,
        width: cell, height: cell, fill: COL.miss, "fill-opacity": 0.35,
      }));
    });
    (queens || []).forEach(([r, c], i) => {
      const cx = 10 + c * cell + cell / 2, cy = 10 + r * cell + cell / 2;
      svg.appendChild(el("circle", { cx, cy, r: cell * 0.32, fill: COL.win }));
      svg.appendChild(txt(cx, cy + 5, "♛", "v-q"));
    });
  }

  function drawTree(svg, arr, hl) {
    clear(svg);
    const n = arr.length;
    if (n === 0) return;
    const depth = Math.floor(Math.log2(Math.max(1, n))) + 1;
    const W = 720, H = Math.min(360, 80 + depth * 70);
    svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
    const pos = [];
    for (let i = 0; i < n; i++) {
      const d = Math.floor(Math.log2(i + 1));
      const idxInRow = i - (Math.pow(2, d) - 1);
      const rowCount = Math.pow(2, d);
      const x = ((idxInRow + 0.5) / rowCount) * W;
      const y = 40 + d * 70;
      pos.push([x, y]);
    }
    // edges
    for (let i = 1; i < n; i++) {
      const p = Math.floor((i - 1) / 2);
      const [x1, y1] = pos[p], [x2, y2] = pos[i];
      svg.appendChild(el("line", {
        x1, y1, x2, y2, stroke: COL.edge, "stroke-width": 1.5,
      }));
    }
    // nodes
    arr.forEach((v, i) => {
      const [x, y] = pos[i];
      const tag = (hl || {})[i];
      const fill =
        tag === "cmp"  ? COL.cmp   :
        tag === "win"  ? COL.win   :
        tag === "miss" ? COL.miss  :
        tag === "done" ? COL.dim   :
        "#0a0a0a";
      svg.appendChild(el("circle", {
        cx: x, cy: y, r: 22, fill, stroke: COL.base, "stroke-width": 2,
      }));
      svg.appendChild(txt(x, y + 5, String(v), "v-node"));
      svg.appendChild(txt(x, y + 38, String(i), "v-idx"));
    });
  }

  /* ----- Registry -------------------------------------------------------- */
  const REG = new Map();
  function register(id, factory) { REG.set(id, factory); }

  /* ----- DOM scaffold + player ------------------------------------------ */
  function buildScaffold(host, factory, algoId) {
    host.classList.add("visualizer");
    host.dataset.algoId = String(algoId);

    const head = document.createElement("div");
    head.className = "viz-head";
    head.innerHTML = `
      <span class="viz-title">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12h4l3-9 4 18 3-9h4"/></svg>
        Visualization
      </span>
      <span class="viz-status">idle</span>`;
    host.appendChild(head);

    const inputs = document.createElement("div");
    inputs.className = "viz-inputs";

    const fields = document.createElement("div");
    fields.className = "viz-fields";
    factory.inputs.forEach(inp => {
      const wrap = document.createElement("label");
      wrap.className = "viz-field";
      wrap.innerHTML = `<span>${inp.label}</span>`;
      const ctl = document.createElement(inp.long ? "textarea" : "input");
      if (!inp.long) ctl.type = "text";
      ctl.dataset.field = inp.name;
      ctl.value = inp.default || "";
      ctl.placeholder = inp.placeholder || "";
      ctl.spellcheck = false;
      ctl.autocomplete = "off";
      wrap.appendChild(ctl);
      fields.appendChild(wrap);
    });
    inputs.appendChild(fields);

    const presets = document.createElement("div");
    presets.className = "viz-presets";
    (factory.presets || []).forEach(p => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "viz-preset";
      b.textContent = p.name;
      b.dataset.preset = p.name;
      presets.appendChild(b);
    });
    if ((factory.presets || []).length) inputs.appendChild(presets);

    const load = document.createElement("button");
    load.type = "button";
    load.className = "viz-load";
    load.textContent = "Build";
    inputs.appendChild(load);
    host.appendChild(inputs);

    const stage = document.createElement("div");
    stage.className = "viz-stage";
    const svg = document.createElementNS(NS, "svg");
    svg.setAttribute("class", "viz-svg");
    stage.appendChild(svg);
    host.appendChild(stage);

    const msg = document.createElement("div");
    msg.className = "viz-message";
    msg.textContent = "Press Build to load input, then Play to animate.";
    host.appendChild(msg);

    const ICON = {
      back:  '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M6 5h2v14H6zM20 5L10 12l10 7z"/></svg>',
      play:  '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>',
      pause: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M7 4h4v16H7zM13 4h4v16h-4z"/></svg>',
      fw:    '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M16 5h2v14h-2zM4 5l10 7L4 19z"/></svg>',
      reset: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 12a9 9 0 1 0 3-6.7"/><path d="M3 4v5h5"/></svg>',
    };
    const controls = document.createElement("div");
    controls.className = "viz-controls";
    controls.innerHTML = `
      <button type="button" class="viz-btn viz-bw"    title="Step back">${ICON.back}</button>
      <button type="button" class="viz-btn viz-play"  title="Play / pause">${ICON.play}</button>
      <button type="button" class="viz-btn viz-fw"    title="Step forward">${ICON.fw}</button>
      <button type="button" class="viz-btn viz-reset" title="Reset to frame 0">${ICON.reset}</button>
      <span class="viz-frame">0 / 0</span>
      <label class="viz-speed">
        <span>Speed</span>
        <input type="range" min="60" max="2000" step="20" value="600" />
      </label>`;
    host.appendChild(controls);
    // Expose icons so the player can swap play↔pause without rebuilding the button
    host._vizIcons = ICON;

    return {
      head, svg, msg, status: head.querySelector(".viz-status"),
      fields, presets, load, controls,
      btnPlay: controls.querySelector(".viz-play"),
      btnBw:   controls.querySelector(".viz-bw"),
      btnFw:   controls.querySelector(".viz-fw"),
      btnReset: controls.querySelector(".viz-reset"),
      frameLabel: controls.querySelector(".viz-frame"),
      speed: controls.querySelector(".viz-speed input"),
    };
  }

  function readValues(fields, inputs) {
    const v = {};
    inputs.forEach(inp => {
      const el = fields.querySelector(`[data-field="${inp.name}"]`);
      v[inp.name] = el ? el.value : (inp.default || "");
    });
    return v;
  }
  function writeValues(fields, vals) {
    Object.keys(vals).forEach(k => {
      const el = fields.querySelector(`[data-field="${k}"]`);
      if (el) el.value = vals[k];
    });
  }

  function mount(host, algoId) {
    const factory = REG.get(algoId);
    if (!factory) {
      host.classList.add("visualizer", "viz-empty");
      host.innerHTML = `<div class="viz-head"><span class="viz-title">Visualization</span></div>
        <div class="viz-soon">Visualizer for this algorithm is coming soon.</div>`;
      return;
    }
    const ui = buildScaffold(host, factory, algoId);

    let frames = [];
    let render = null;
    let i = 0;
    let timer = null;

    function setStatus(s) { ui.status.textContent = s; host.dataset.state = s; }
    function setMessage(s) { ui.msg.innerHTML = s || ""; }
    function updateFrameLabel() {
      ui.frameLabel.textContent = `${frames.length ? i + 1 : 0} / ${frames.length}`;
    }
    function show(k) {
      if (!frames.length || !render) return;
      i = Math.max(0, Math.min(frames.length - 1, k));
      const f = frames[i];
      try { render(f, ui.svg); } catch (e) { setMessage("Render error: " + e.message); return; }
      setMessage(f.message || "");
      updateFrameLabel();
    }
    function pause() {
      if (timer) { clearInterval(timer); timer = null; }
      ui.btnPlay.innerHTML = host._vizIcons.play;
      ui.btnPlay.title = "Play";
      setStatus("paused");
    }
    function play() {
      if (!frames.length) return;
      if (i >= frames.length - 1) i = -1;
      ui.btnPlay.innerHTML = host._vizIcons.pause;
      ui.btnPlay.title = "Pause";
      setStatus("playing");
      const tick = () => {
        if (i >= frames.length - 1) { pause(); setStatus("done"); return; }
        show(i + 1);
      };
      tick();
      timer = setInterval(() => {
        if (i >= frames.length - 1) { pause(); setStatus("done"); return; }
        show(i + 1);
      }, parseInt(ui.speed.value, 10));
    }
    function reset(buildNew) {
      pause();
      if (buildNew) {
        const vals = readValues(ui.fields, factory.inputs);
        let result;
        try { result = factory.build(vals); }
        catch (e) { setStatus("input error"); setMessage("Input error: " + e.message); frames = []; render = null; clear(ui.svg); updateFrameLabel(); return; }
        if (result && result.error) {
          setStatus("input error");
          setMessage("Input error: " + result.error);
          frames = []; render = null; clear(ui.svg); updateFrameLabel();
          return;
        }
        frames = result.frames || [];
        render = result.render;
        if (!frames.length) {
          setStatus("ready"); setMessage("No frames produced.");
          clear(ui.svg); updateFrameLabel(); return;
        }
      }
      i = 0;
      setStatus("ready");
      show(0);
    }

    // Wire controls
    ui.load.addEventListener("click", () => reset(true));
    ui.btnPlay.addEventListener("click", () => { if (timer) pause(); else play(); });
    ui.btnBw.addEventListener("click", () => { pause(); show(i - 1); });
    ui.btnFw.addEventListener("click", () => { pause(); show(i + 1); });
    ui.btnReset.addEventListener("click", () => { pause(); show(0); });
    ui.speed.addEventListener("input", () => {
      if (timer) { clearInterval(timer); timer = setInterval(() => {
        if (i >= frames.length - 1) { pause(); setStatus("done"); return; }
        show(i + 1);
      }, parseInt(ui.speed.value, 10)); }
    });

    // Preset chips
    ui.presets.addEventListener("click", (e) => {
      const b = e.target.closest(".viz-preset");
      if (!b) return;
      const p = (factory.presets || []).find(x => x.name === b.dataset.preset);
      if (!p) return;
      const vals = typeof p.values === "function" ? p.values() : p.values;
      writeValues(ui.fields, vals);
      reset(true);
    });

    // Build on first mount (so user sees something immediately)
    reset(true);
  }

  /* ====================================================================== */
  /* === Visualizers (1-20) ============================================== */
  /* ====================================================================== */

  /* --- 1. Binary Search ------------------------------------------------- */
  register(1, {
    inputs: [
      { name: "arr", label: "Sorted array", default: "1,3,5,7,9,11,13,15,17,19" },
      { name: "key", label: "Key", default: "13" },
    ],
    presets: [
      { name: "Found mid",  values: { arr: "2,4,6,8,10,12,14,16", key: "10" } },
      { name: "Not found",  values: { arr: "1,2,3,4,5,6,7,8",     key: "9"  } },
      { name: "Found edge", values: { arr: "5,9,11,13,17,21,25",  key: "5"  } },
    ],
    build({ arr, key }) {
      const a = P.nums(arr).slice().sort((x, y) => x - y);
      const k = P.int(key);
      const frames = [];
      let lo = 0, hi = a.length - 1, found = -1;
      frames.push({ a, lo, hi, mid: -1, message: `Search for <b>${k}</b> in [${a.join(", ")}]. Start: lo=0, hi=${hi}.` });
      while (lo <= hi) {
        const mid = lo + Math.floor((hi - lo) / 2);
        frames.push({ a, lo, hi, mid, message: `mid = ${lo} + (${hi}-${lo})/2 = ${mid}. Compare a[${mid}]=${a[mid]} with key=${k}.` });
        if (a[mid] === k) { found = mid; frames.push({ a, lo, hi, mid, ok: true, message: `a[${mid}] = ${k}. <b>Found at index ${mid}.</b>` }); break; }
        if (k < a[mid]) { hi = mid - 1; frames.push({ a, lo, hi, mid, message: `${k} &lt; ${a[mid]} → search left. hi = ${hi}.` }); }
        else            { lo = mid + 1; frames.push({ a, lo, hi, mid, message: `${k} &gt; ${a[mid]} → search right. lo = ${lo}.` }); }
      }
      if (found === -1) frames.push({ a, lo, hi, mid: -1, miss: true, message: `lo &gt; hi. Key <b>${k}</b> not present.` });
      return {
        frames,
        render(f, svg) {
          const hl = {};
          for (let i = 0; i < f.a.length; i++) {
            if (i < f.lo || i > f.hi) hl[i] = "done";
          }
          if (f.lo >= 0 && f.lo < f.a.length) hl[f.lo] = "lo";
          if (f.hi >= 0 && f.hi < f.a.length) hl[f.hi] = "hi";
          if (f.mid >= 0) hl[f.mid] = f.ok ? "win" : (f.miss ? "miss" : "mid");
          const labels = {};
          if (f.lo >= 0 && f.lo < f.a.length) labels[f.lo] = "lo";
          if (f.hi >= 0 && f.hi < f.a.length) labels[f.hi] = (labels[f.hi] ? labels[f.hi] + "/hi" : "hi");
          if (f.mid >= 0) labels[f.mid] = (labels[f.mid] ? labels[f.mid] + "/mid" : "mid");
          drawArrayBars(svg, f.a, { highlights: hl, labels });
        },
      };
    },
  });

  /* --- 2. Merge Sort ---------------------------------------------------- */
  register(2, {
    inputs: [{ name: "arr", label: "Array", default: "8,3,5,4,7,6,1,2" }],
    presets: [
      { name: "Reverse", values: { arr: "9,8,7,6,5,4,3,2,1" } },
      { name: "Random",  values: () => ({ arr: Array.from({ length: 8 }, () => Math.floor(Math.random() * 99) + 1).join(",") }) },
      { name: "Sorted",  values: { arr: "1,2,3,4,5,6,7,8" } },
    ],
    build({ arr }) {
      const a = P.nums(arr);
      const frames = [];
      const snapshot = (cur, range, msg, hl) => frames.push({ a: cur.slice(), lo: range[0], hi: range[1], hl: hl || {}, message: msg });
      function ms(arr, l, r) {
        if (l >= r) return;
        const m = (l + r) >> 1;
        snapshot(arr, [l, r], `Split [${l}..${r}] → [${l}..${m}] | [${m + 1}..${r}]`, { split: [l, m, r] });
        ms(arr, l, m); ms(arr, m + 1, r);
        const L = arr.slice(l, m + 1), R = arr.slice(m + 1, r + 1);
        let i = 0, j = 0, k = l;
        while (i < L.length && j < R.length) {
          snapshot(arr, [l, r], `Merge: compare ${L[i]} and ${R[j]}.`, { cmp: [l + i, m + 1 + j] });
          if (L[i] <= R[j]) arr[k++] = L[i++];
          else              arr[k++] = R[j++];
        }
        while (i < L.length) arr[k++] = L[i++];
        while (j < R.length) arr[k++] = R[j++];
        snapshot(arr, [l, r], `Merged subarray [${l}..${r}].`, { merged: [l, r] });
      }
      const cp = a.slice();
      snapshot(cp, [0, cp.length - 1], `Input: [${cp.join(", ")}].`, {});
      ms(cp, 0, cp.length - 1);
      snapshot(cp, [0, cp.length - 1], `<b>Sorted.</b>`, { done: true });
      return {
        frames,
        render(f, svg) {
          const hl = {};
          for (let i = 0; i < f.a.length; i++) {
            if (i < f.lo || i > f.hi) hl[i] = "done";
          }
          if (f.hl.cmp) f.hl.cmp.forEach(i => hl[i] = "cmp");
          if (f.hl.split) { hl[f.hl.split[1]] = "mid"; }
          if (f.hl.done) for (let i = 0; i < f.a.length; i++) hl[i] = "win";
          drawArrayBars(svg, f.a, { highlights: hl });
        },
      };
    },
  });

  /* --- 3. Quick Sort ---------------------------------------------------- */
  register(3, {
    inputs: [{ name: "arr", label: "Array", default: "7,2,1,6,8,5,3,4" }],
    presets: [
      { name: "Random", values: () => ({ arr: Array.from({ length: 8 }, () => Math.floor(Math.random() * 99) + 1).join(",") }) },
      { name: "Worst (sorted)", values: { arr: "1,2,3,4,5,6,7,8" } },
      { name: "Duplicates", values: { arr: "5,3,5,1,5,3,1,5" } },
    ],
    build({ arr }) {
      const a = P.nums(arr);
      const frames = [];
      const snap = (cur, lo, hi, p, i, j, msg, extra) =>
        frames.push({ a: cur.slice(), lo, hi, p, i, j, ...(extra || {}), message: msg });
      function qs(arr, lo, hi) {
        if (lo >= hi) {
          if (lo === hi) snap(arr, lo, hi, -1, -1, -1, `Single element [${lo}] is sorted.`, { single: lo });
          return;
        }
        // Randomized: swap arr[hi] with a random index in [lo..hi]
        const r = lo + Math.floor(Math.random() * (hi - lo + 1));
        snap(arr, lo, hi, r, -1, -1, `Pick random pivot index ${r} (value ${arr[r]}). Swap to end.`);
        [arr[r], arr[hi]] = [arr[hi], arr[r]];
        const pivot = arr[hi];
        snap(arr, lo, hi, hi, -1, -1, `Pivot = ${pivot} (at index ${hi}). Partition [${lo}..${hi - 1}].`);
        let i = lo - 1;
        for (let j = lo; j < hi; j++) {
          snap(arr, lo, hi, hi, i, j, `Compare a[${j}]=${arr[j]} with pivot ${pivot}.`);
          if (arr[j] <= pivot) {
            i++;
            [arr[i], arr[j]] = [arr[j], arr[i]];
            snap(arr, lo, hi, hi, i, j, `${arr[i]} ≤ ${pivot} → swap a[${i}] ⇄ a[${j}].`);
          }
        }
        [arr[i + 1], arr[hi]] = [arr[hi], arr[i + 1]];
        snap(arr, lo, hi, i + 1, -1, -1, `Place pivot at index ${i + 1}.`, { fixed: i + 1 });
        qs(arr, lo, i);
        qs(arr, i + 2, hi);
      }
      const cp = a.slice();
      snap(cp, 0, cp.length - 1, -1, -1, -1, `Input: [${cp.join(", ")}].`);
      qs(cp, 0, cp.length - 1);
      snap(cp, 0, cp.length - 1, -1, -1, -1, `<b>Sorted.</b>`, { done: true });
      return {
        frames,
        render(f, svg) {
          const hl = {};
          for (let i = 0; i < f.a.length; i++) if (i < f.lo || i > f.hi) hl[i] = "done";
          if (f.p >= 0) hl[f.p] = "pivot";
          if (f.i >= 0) hl[f.i] = "cmp";
          if (f.j >= 0) hl[f.j] = "cmp";
          if (f.fixed !== undefined) hl[f.fixed] = "win";
          if (f.done) for (let i = 0; i < f.a.length; i++) hl[i] = "win";
          const labels = {};
          if (f.p >= 0) labels[f.p] = "pivot";
          if (f.i >= 0) labels[f.i] = "i";
          if (f.j >= 0) labels[f.j] = "j";
          drawArrayBars(svg, f.a, { highlights: hl, labels });
        },
      };
    },
  });

  /* --- 4. Max-Min (Divide & Conquer) ----------------------------------- */
  register(4, {
    inputs: [{ name: "arr", label: "Array", default: "70,25,99,4,38,82,11,57" }],
    presets: [
      { name: "Random",  values: () => ({ arr: Array.from({ length: 8 }, () => Math.floor(Math.random() * 99) + 1).join(",") }) },
      { name: "Sorted",  values: { arr: "1,2,3,4,5,6,7,8" } },
      { name: "Same",    values: { arr: "5,5,5,5,5,5,5,5" } },
    ],
    build({ arr }) {
      const a = P.nums(arr);
      const frames = [];
      const snap = (lo, hi, mn, mx, msg) =>
        frames.push({ a: a.slice(), lo, hi, mn, mx, message: msg });
      function mm(l, r) {
        if (l === r) {
          snap(l, r, a[l], a[l], `Single element a[${l}] = ${a[l]}. min = max = ${a[l]}.`);
          return [a[l], a[l]];
        }
        if (r === l + 1) {
          const [mn, mx] = a[l] < a[r] ? [a[l], a[r]] : [a[r], a[l]];
          snap(l, r, mn, mx, `Pair (a[${l}], a[${r}]) = (${a[l]}, ${a[r]}) → min=${mn}, max=${mx}.`);
          return [mn, mx];
        }
        const mid = (l + r) >> 1;
        snap(l, r, undefined, undefined, `Split [${l}..${r}] at mid=${mid}.`);
        const [lmn, lmx] = mm(l, mid);
        const [rmn, rmx] = mm(mid + 1, r);
        const mn = Math.min(lmn, rmn), mx = Math.max(lmx, rmx);
        snap(l, r, mn, mx, `Combine: min(${lmn},${rmn})=${mn}, max(${lmx},${rmx})=${mx}.`);
        return [mn, mx];
      }
      mm(0, a.length - 1);
      return {
        frames,
        render(f, svg) {
          const hl = {};
          for (let i = 0; i < f.a.length; i++) if (i < f.lo || i > f.hi) hl[i] = "done";
          // mark min/max
          if (f.mn !== undefined) {
            for (let i = f.lo; i <= f.hi; i++) {
              if (f.a[i] === f.mn) hl[i] = "lo";
              if (f.a[i] === f.mx) hl[i] = "win";
            }
          }
          drawArrayBars(svg, f.a, { highlights: hl });
        },
      };
    },
  });

  /* --- 5. Heap Sort ----------------------------------------------------- */
  register(5, {
    inputs: [{ name: "arr", label: "Array", default: "4,10,3,5,1,8,7,2" }],
    presets: [
      { name: "Random",  values: () => ({ arr: Array.from({ length: 7 }, () => Math.floor(Math.random() * 99) + 1).join(",") }) },
      { name: "Reverse", values: { arr: "9,8,7,6,5,4,3,2" } },
    ],
    build({ arr }) {
      const a = P.nums(arr);
      const frames = [];
      const snap = (cur, hl, msg, sorted) =>
        frames.push({ a: cur.slice(), hl: { ...hl }, sorted: sorted || 0, message: msg });
      const n = a.length;
      const heapify = (size, i) => {
        let largest = i;
        const l = 2 * i + 1, r = 2 * i + 2;
        snap(a, { [i]: "cmp" }, `heapify(${size}, ${i}): root=${a[i]}, left=${l < size ? a[l] : "—"}, right=${r < size ? a[r] : "—"}.`);
        if (l < size && a[l] > a[largest]) largest = l;
        if (r < size && a[r] > a[largest]) largest = r;
        if (largest !== i) {
          [a[i], a[largest]] = [a[largest], a[i]];
          snap(a, { [i]: "win", [largest]: "miss" }, `Swap a[${i}] ⇄ a[${largest}]. Continue heapify on ${largest}.`);
          heapify(size, largest);
        }
      };
      snap(a, {}, `Build max-heap from input [${a.join(", ")}].`);
      for (let i = Math.floor(n / 2) - 1; i >= 0; i--) heapify(n, i);
      snap(a, {}, `Max-heap built.`);
      for (let i = n - 1; i > 0; i--) {
        [a[0], a[i]] = [a[i], a[0]];
        snap(a, { 0: "miss", [i]: "win" }, `Move root ${a[i]} to sorted region (index ${i}).`, n - i);
        heapify(i, 0);
      }
      snap(a, {}, `<b>Sorted.</b>`, n);
      return {
        frames,
        render(f, svg) {
          // Show tree on top half, array on bottom — use combined SVG
          const W = 720, H = 460;
          svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
          clear(svg);
          // Tree (top)
          const tsvg = el("svg", { x: 0, y: 0, width: W, height: 260, viewBox: `0 0 ${W} 260` });
          svg.appendChild(tsvg);
          const treeArr = f.a.slice(0, f.a.length - (f.sorted || 0));
          drawTree(tsvg, treeArr, f.hl);
          // Array (bottom)
          const asvg = el("svg", { x: 0, y: 240, width: W, height: 220, viewBox: `0 0 ${W} 220` });
          svg.appendChild(asvg);
          const hl = { ...f.hl };
          for (let i = f.a.length - (f.sorted || 0); i < f.a.length; i++) hl[i] = "win";
          drawArrayBars(asvg, f.a, { highlights: hl });
        },
      };
    },
  });

  /* ----- Graph helpers shared by 6-7, 10-13, 17-19 --------------------- */
  function buildGraph(edgeStr, undirected) {
    const edges = P.edges(edgeStr);
    const n = edges.reduce((m, e) => Math.max(m, e.u, e.v), 0) + 1;
    const adj = Array.from({ length: n }, () => []);
    edges.forEach(e => {
      adj[e.u].push({ to: e.v, w: e.w });
      if (undirected) adj[e.v].push({ to: e.u, w: e.w });
    });
    return { n, edges, adj, directed: !undirected };
  }

  /* --- 6. BFS ----------------------------------------------------------- */
  register(6, {
    inputs: [
      { name: "edges", label: "Edges (u-v, ...)", default: "0-1,0-2,1-3,1-4,2-5,3-6,4-6,5-6" },
      { name: "src",   label: "Source", default: "0" },
    ],
    presets: [
      { name: "Tree-like", values: { edges: "0-1,0-2,1-3,1-4,2-5,2-6", src: "0" } },
      { name: "Cycle",     values: { edges: "0-1,1-2,2-3,3-0,1-3", src: "0" } },
      { name: "Star",      values: { edges: "0-1,0-2,0-3,0-4,0-5", src: "0" } },
    ],
    build({ edges, src }) {
      const g = buildGraph(edges, true);
      const s = P.int(src);
      if (s < 0 || s >= g.n) return { error: "Source out of range" };
      const frames = [];
      const dist = Array(g.n).fill(-1);
      const parent = Array(g.n).fill(-1);
      const ns = {};
      const ec = {};
      const visited = new Array(g.n).fill(false);
      const queue = [s];
      visited[s] = true; dist[s] = 0;
      ns[s] = "frontier";
      frames.push({ ns: { ...ns }, ec: { ...ec }, q: [...queue], dist: dist.slice(), message: `Start BFS from ${s}. Queue: [${queue.join(", ")}].` });
      while (queue.length) {
        const u = queue.shift();
        ns[u] = "current";
        frames.push({ ns: { ...ns }, ec: { ...ec }, q: [...queue], dist: dist.slice(), message: `Dequeue ${u}. Explore neighbours.` });
        for (const { to: v } of g.adj[u]) {
          if (!visited[v]) {
            visited[v] = true; dist[v] = dist[u] + 1; parent[v] = u;
            ec[`${u}-${v}`] = COL.edgeOn;
            ns[v] = "frontier";
            queue.push(v);
            frames.push({ ns: { ...ns }, ec: { ...ec }, q: [...queue], dist: dist.slice(), message: `Visit ${v} via ${u}. dist[${v}]=${dist[v]}. Enqueue.` });
          } else {
            frames.push({ ns: { ...ns }, ec: { ...ec, [`${u}-${v}`]: COL.edgeBad }, q: [...queue], dist: dist.slice(), message: `${v} already visited — skip.` });
            delete ec[`${u}-${v}`];
          }
        }
        ns[u] = "visited";
      }
      frames.push({ ns: { ...ns }, ec: { ...ec }, q: [], dist: dist.slice(), message: `<b>BFS complete.</b> Distances: [${dist.join(", ")}].` });
      return {
        frames, g,
        render(f, svg) {
          drawGraph(svg, g, {
            edgeColors: f.ec, nodeStates: f.ns,
            nodeLabels: Object.fromEntries(f.dist.map((d, i) => [i, d < 0 ? "∞" : d])),
          });
        },
      };
    },
  });

  /* --- 7. DFS ----------------------------------------------------------- */
  register(7, {
    inputs: [
      { name: "edges", label: "Edges (u-v, ...)", default: "0-1,0-2,1-3,1-4,2-5,3-6,4-6,5-6" },
      { name: "src",   label: "Source", default: "0" },
    ],
    presets: [
      { name: "Tree-like", values: { edges: "0-1,0-2,1-3,1-4,2-5,2-6", src: "0" } },
      { name: "Cycle",     values: { edges: "0-1,1-2,2-3,3-0,1-3", src: "0" } },
      { name: "Path",      values: { edges: "0-1,1-2,2-3,3-4,4-5", src: "0" } },
    ],
    build({ edges, src }) {
      const g = buildGraph(edges, true);
      const s = P.int(src);
      if (s < 0 || s >= g.n) return { error: "Source out of range" };
      const frames = [];
      const ns = {}, ec = {};
      const visited = new Array(g.n).fill(false);
      const stack = [];
      function dfs(u, from) {
        visited[u] = true;
        stack.push(u);
        ns[u] = "current";
        if (from !== -1) ec[`${from}-${u}`] = COL.edgeOn;
        frames.push({ ns: { ...ns }, ec: { ...ec }, st: [...stack], message: `Visit ${u}. Stack: [${stack.join(", ")}].` });
        for (const { to: v } of g.adj[u]) {
          if (!visited[v]) dfs(v, u);
        }
        ns[u] = "visited";
        stack.pop();
        frames.push({ ns: { ...ns }, ec: { ...ec }, st: [...stack], message: `Backtrack from ${u}. Stack: [${stack.join(", ")}].` });
      }
      dfs(s, -1);
      frames.push({ ns: { ...ns }, ec: { ...ec }, st: [], message: `<b>DFS complete.</b>` });
      return {
        frames, g,
        render(f, svg) {
          drawGraph(svg, g, {
            edgeColors: f.ec, nodeStates: f.ns,
            nodeLabels: Object.fromEntries((f.st || []).map((v, i) => [v, "#" + (i + 1)])),
          });
        },
      };
    },
  });

  /* --- 8. Fractional Knapsack ------------------------------------------ */
  register(8, {
    inputs: [
      { name: "items", label: "Items (w,v ; w,v ; ...)", default: "10,60 ; 20,100 ; 30,120" },
      { name: "cap",   label: "Capacity", default: "50" },
    ],
    presets: [
      { name: "Classic", values: { items: "10,60 ; 20,100 ; 30,120", cap: "50" } },
      { name: "Heavy",   values: { items: "5,30 ; 10,40 ; 15,45 ; 22,77 ; 25,90", cap: "60" } },
    ],
    build({ items, cap }) {
      const raw = P.pairs(items).map(([w, v], i) => ({ id: i, w, v, r: v / w }));
      const C = P.int(cap);
      const sorted = raw.slice().sort((a, b) => b.r - a.r);
      const frames = [];
      let rem = C, profit = 0;
      const taken = Array(raw.length).fill(0);
      const snap = (msg, hl, extra) => frames.push({
        items: raw, sorted, taken: taken.slice(),
        rem, profit, cap: C, hl: hl === undefined ? -1 : hl,
        ...(extra || {}), message: msg,
      });
      snap(`Sort items by value/weight ratio. Capacity = ${C}.`);
      for (const it of sorted) {
        if (rem <= 0) { snap(`No capacity left. Stop.`, it.id); break; }
        if (it.w <= rem) {
          taken[it.id] = 1;
          profit += it.v; rem -= it.w;
          snap(`Take item ${it.id} fully (w=${it.w}, v=${it.v}). Profit=${profit.toFixed(2)}, remaining=${rem}.`, it.id);
        } else {
          const frac = rem / it.w;
          taken[it.id] = frac;
          profit += it.v * frac;
          rem = 0;
          snap(`Take ${(frac * 100).toFixed(1)}% of item ${it.id}. Profit=${profit.toFixed(2)}.`, it.id, { frac });
        }
      }
      snap(`<b>Max profit = ${profit.toFixed(2)}.</b>`, -1, { done: true });
      return {
        frames,
        render(f, svg) {
          clear(svg);
          const W = 720, H = 340;
          svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
          const cols = ["id", "w", "v", "v/w", "taken"];
          const colX = [40, 110, 180, 260, 360];
          cols.forEach((c, i) => svg.appendChild(txt(colX[i], 20, c, "v-idx", "start")));
          f.sorted.forEach((it, i) => {
            const y = 44 + i * 26;
            const hl = it.id === f.hl;
            svg.appendChild(el("rect", { x: 30, y: y - 18, width: 440, height: 24, rx: 4,
              fill: hl ? COL.bright : "rgba(255,122,24,0.07)", opacity: hl ? 0.85 : 0.95 }));
            svg.appendChild(txt(colX[0], y, String(it.id), "v-mc", "start"));
            svg.appendChild(txt(colX[1], y, String(it.w), "v-mc", "start"));
            svg.appendChild(txt(colX[2], y, String(it.v), "v-mc", "start"));
            svg.appendChild(txt(colX[3], y, it.r.toFixed(2), "v-mc", "start"));
            const tk = f.taken[it.id];
            svg.appendChild(txt(colX[4], y, tk === 1 ? "full" : tk > 0 ? (tk * 100).toFixed(0) + "%" : "—", "v-mc", "start"));
          });
          // Capacity bar (right)
          const used = f.cap - f.rem;
          const bx = 510, by = 36, bw = 170, bh = 230;
          svg.appendChild(el("rect", { x: bx, y: by, width: bw, height: bh, fill: "transparent", stroke: COL.base, "stroke-width": 2, rx: 6 }));
          const ratio = f.cap > 0 ? Math.max(0, Math.min(1, used / f.cap)) : 0;
          svg.appendChild(el("rect", { x: bx + 1, y: by + 1 + bh * (1 - ratio), width: bw - 2, height: Math.max(0, bh * ratio - 2), fill: COL.win, opacity: 0.55 }));
          svg.appendChild(txt(bx + bw / 2, by - 10, "Knapsack", "v-tag"));
          svg.appendChild(txt(bx + bw / 2, by + bh + 18, `profit  ${f.profit.toFixed(2)}`, "v-tag"));
          svg.appendChild(txt(bx + bw / 2, by + bh + 34, `${used.toFixed(1)} / ${f.cap} used`, "v-tag"));
        },
      };
    },
  });

  /* --- 9. Job Sequencing with Deadlines -------------------------------- */
  register(9, {
    inputs: [
      { name: "jobs", label: "Jobs (id,deadline,profit ; ...)", default: "1,2,100 ; 2,1,19 ; 3,2,27 ; 4,1,25 ; 5,3,15" },
    ],
    presets: [
      { name: "Classic", values: { jobs: "1,2,100 ; 2,1,19 ; 3,2,27 ; 4,1,25 ; 5,3,15" } },
      { name: "Tight",   values: { jobs: "A,1,50 ; B,1,40 ; C,1,30 ; D,2,20" } },
    ],
    build({ jobs }) {
      const rows = String(jobs).split(/[;\n]+/).map(s => s.trim()).filter(Boolean).map(s => {
        const p = s.split(/[\s,]+/).filter(Boolean);
        if (p.length !== 3) throw new Error("Job format: id,deadline,profit");
        return { id: p[0], d: P.int(p[1]), p: P.int(p[2]) };
      });
      const sorted = rows.slice().sort((a, b) => b.p - a.p);
      const dmax = Math.max(...rows.map(r => r.d));
      const slot = Array(dmax).fill(null);   // slot[i] = job at time i (0-indexed → t=i+1)
      const frames = [];
      const status = {};
      frames.push({ sorted, slot: slot.slice(), hl: -1, status: { ...status }, message: `Sort jobs by profit descending. Deadlines up to ${dmax}.` });
      for (const j of sorted) {
        let placed = -1;
        for (let t = Math.min(dmax, j.d) - 1; t >= 0; t--) {
          frames.push({ sorted, slot: slot.slice(), hl: j.id, try: t, status: { ...status }, message: `Try job ${j.id} at slot ${t + 1}.` });
          if (slot[t] === null) { slot[t] = j.id; placed = t; status[j.id] = "ok"; break; }
        }
        if (placed === -1) {
          status[j.id] = "skip";
          frames.push({ sorted, slot: slot.slice(), hl: j.id, status: { ...status }, message: `No free slot ≤ deadline ${j.d}. Skip job ${j.id}.` });
        } else {
          frames.push({ sorted, slot: slot.slice(), hl: j.id, status: { ...status }, message: `Place job ${j.id} at slot ${placed + 1}.` });
        }
      }
      const total = slot.reduce((s, id) => s + (id ? rows.find(r => String(r.id) === String(id)).p : 0), 0);
      frames.push({ sorted, slot: slot.slice(), hl: -1, status: { ...status }, done: true, message: `<b>Schedule: ${slot.map((x, i) => `t${i + 1}:${x || "—"}`).join(", ")}. Profit = ${total}.</b>` });
      return {
        frames,
        render(f, svg) {
          clear(svg);
          const W = 720, H = 320;
          svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
          // Sorted jobs table (left)
          svg.appendChild(txt(80, 20, "Jobs (sorted by profit)", "v-tag", "start"));
          f.sorted.forEach((j, i) => {
            const y = 44 + i * 26;
            const hl = String(j.id) === String(f.hl);
            const st = f.status[j.id];
            const fill = hl ? COL.bright : st === "ok" ? "rgba(34,197,94,0.25)" : st === "skip" ? "rgba(239,68,68,0.25)" : "rgba(255,122,24,0.07)";
            svg.appendChild(el("rect", { x: 30, y: y - 18, width: 270, height: 24, rx: 4, fill }));
            svg.appendChild(txt(40,  y, String(j.id), "v-mc", "start"));
            svg.appendChild(txt(100, y, "d=" + j.d, "v-mc", "start"));
            svg.appendChild(txt(170, y, "p=" + j.p, "v-mc", "start"));
            svg.appendChild(txt(240, y, st || "", "v-mc", "start"));
          });
          // Slots (right)
          svg.appendChild(txt(360 + (f.slot.length * 50) / 2, 20, "Timeline", "v-tag"));
          for (let i = 0; i < f.slot.length; i++) {
            const x = 360 + i * 60, y = 44;
            const fill = f.try === i ? COL.cmp : f.slot[i] ? COL.win : "rgba(255,122,24,0.07)";
            svg.appendChild(el("rect", { x, y, width: 54, height: 54, rx: 6, fill, stroke: COL.base, "stroke-width": 1.5 }));
            svg.appendChild(txt(x + 27, y + 32, f.slot[i] || "—", "v-num"));
            svg.appendChild(txt(x + 27, y + 70, `t=${i + 1}`, "v-idx"));
          }
        },
      };
    },
  });

  /* --- 10. Kruskal's Algorithm ----------------------------------------- */
  register(10, {
    inputs: [
      { name: "edges", label: "Weighted edges (u-v:w ; ...)", default: "0-1:4, 0-2:3, 1-2:1, 1-3:2, 2-3:4, 3-4:2, 4-5:6, 2-4:5" },
    ],
    presets: [
      { name: "Small",  values: { edges: "0-1:1, 1-2:2, 2-3:3, 0-3:4, 0-2:5" } },
      { name: "Classic",values: { edges: "0-1:4, 0-2:3, 1-2:1, 1-3:2, 2-3:4, 3-4:2, 4-5:6, 2-4:5" } },
    ],
    build({ edges }) {
      const g = buildGraph(edges, true);
      const sorted = g.edges.slice().sort((a, b) => a.w - b.w);
      const dsu = Array.from({ length: g.n }, (_, i) => i);
      const find = x => dsu[x] === x ? x : (dsu[x] = find(dsu[x]));
      const frames = [];
      const ec = {};
      let total = 0, picked = 0;
      frames.push({ ec: { ...ec }, dsu: dsu.slice(), message: `Sort ${sorted.length} edges by weight: ${sorted.map(e => `${e.u}-${e.v}(${e.w})`).join(", ")}.` });
      for (const e of sorted) {
        const ru = find(e.u), rv = find(e.v);
        if (ru !== rv) {
          dsu[ru] = rv;
          ec[`${e.u}-${e.v}`] = COL.edgeOn;
          total += e.w; picked++;
          frames.push({ ec: { ...ec }, dsu: dsu.slice(), pick: e, message: `Accept ${e.u}-${e.v} (w=${e.w}). Union. MST weight=${total}. (${picked}/${g.n - 1} edges)` });
          if (picked === g.n - 1) break;
        } else {
          frames.push({ ec: { ...ec, [`${e.u}-${e.v}`]: COL.edgeBad }, dsu: dsu.slice(), reject: e, message: `Reject ${e.u}-${e.v} (w=${e.w}) — creates cycle.` });
        }
      }
      frames.push({ ec: { ...ec }, dsu: dsu.slice(), done: true, total, message: `<b>MST complete. Total weight = ${total}.</b>` });
      return {
        frames, g,
        render(f, svg) { drawGraph(svg, g, { edgeColors: f.ec }); },
      };
    },
  });

  /* --- 11. Prim's Algorithm -------------------------------------------- */
  register(11, {
    inputs: [
      { name: "edges", label: "Weighted edges (u-v:w ; ...)", default: "0-1:2, 0-3:6, 1-2:3, 1-3:8, 1-4:5, 2-4:7, 3-4:9" },
      { name: "src",   label: "Start node", default: "0" },
    ],
    presets: [
      { name: "Classic", values: { edges: "0-1:2, 0-3:6, 1-2:3, 1-3:8, 1-4:5, 2-4:7, 3-4:9", src: "0" } },
      { name: "Triangle",values: { edges: "0-1:1, 1-2:2, 0-2:3, 2-3:4, 3-0:5", src: "0" } },
    ],
    build({ edges, src }) {
      const g = buildGraph(edges, true);
      const s = P.int(src);
      if (s < 0 || s >= g.n) return { error: "Start node out of range" };
      const inT = new Array(g.n).fill(false);
      const key = new Array(g.n).fill(Infinity);
      const parent = new Array(g.n).fill(-1);
      key[s] = 0;
      const frames = [];
      const ec = {}, ns = {};
      ns[s] = "frontier";
      frames.push({ ec: { ...ec }, ns: { ...ns }, key: key.slice(), message: `Start Prim from ${s}. key[${s}]=0.` });
      let total = 0;
      for (let i = 0; i < g.n; i++) {
        let u = -1, best = Infinity;
        for (let v = 0; v < g.n; v++) if (!inT[v] && key[v] < best) { best = key[v]; u = v; }
        if (u === -1) break;
        inT[u] = true;
        ns[u] = "visited";
        if (parent[u] !== -1) {
          ec[`${parent[u]}-${u}`] = COL.edgeOn;
          total += key[u];
        }
        frames.push({ ec: { ...ec }, ns: { ...ns }, key: key.slice(), message: `Pick node ${u} (key=${key[u]}). MST weight=${total}.` });
        for (const { to: v, w } of g.adj[u]) {
          if (!inT[v] && w < key[v]) {
            key[v] = w; parent[v] = u;
            ns[v] = "frontier";
            frames.push({ ec: { ...ec }, ns: { ...ns }, key: key.slice(), message: `Relax ${u}→${v}. key[${v}]=${w}, parent=${u}.` });
          }
        }
      }
      frames.push({ ec: { ...ec }, ns: { ...ns }, key: key.slice(), total, done: true, message: `<b>MST complete. Weight = ${total}.</b>` });
      return {
        frames, g,
        render(f, svg) {
          drawGraph(svg, g, {
            edgeColors: f.ec, nodeStates: f.ns,
            nodeLabels: Object.fromEntries(f.key.map((k, i) => [i, k === Infinity ? "∞" : k])),
          });
        },
      };
    },
  });

  /* --- 12. Dijkstra ---------------------------------------------------- */
  register(12, {
    inputs: [
      { name: "edges", label: "Weighted edges (u-v:w ; ...)", default: "0-1:4, 0-2:1, 2-1:2, 1-3:1, 2-3:5, 3-4:3" },
      { name: "src",   label: "Source", default: "0" },
      { name: "dir",   label: "Directed? (0/1)", default: "0" },
    ],
    presets: [
      { name: "Undirected", values: { edges: "0-1:4, 0-2:1, 2-1:2, 1-3:1, 2-3:5, 3-4:3", src: "0", dir: "0" } },
      { name: "Directed",   values: { edges: "0-1:10, 0-2:5, 2-1:3, 2-3:2, 1-3:1, 3-4:4", src: "0", dir: "1" } },
    ],
    build({ edges, src, dir }) {
      const directed = P.int(dir) === 1;
      const g = buildGraph(edges, !directed);
      const s = P.int(src);
      if (s < 0 || s >= g.n) return { error: "Source out of range" };
      const dist = new Array(g.n).fill(Infinity);
      const done = new Array(g.n).fill(false);
      dist[s] = 0;
      const frames = [];
      const ec = {}, ns = {};
      ns[s] = "frontier";
      frames.push({ ec: { ...ec }, ns: { ...ns }, dist: dist.slice(), message: `Start Dijkstra from ${s}. dist[${s}]=0.` });
      for (let i = 0; i < g.n; i++) {
        let u = -1, best = Infinity;
        for (let v = 0; v < g.n; v++) if (!done[v] && dist[v] < best) { best = dist[v]; u = v; }
        if (u === -1) break;
        done[u] = true; ns[u] = "visited";
        frames.push({ ec: { ...ec }, ns: { ...ns }, dist: dist.slice(), message: `Settle node ${u} (dist=${dist[u]}).` });
        for (const { to: v, w } of g.adj[u]) {
          if (w < 0) continue;
          if (dist[u] + w < dist[v]) {
            const old = dist[v];
            dist[v] = dist[u] + w;
            ns[v] = "frontier";
            // mark this edge as the current tree edge to v
            Object.keys(ec).forEach(k => { if (k.endsWith("-" + v)) delete ec[k]; });
            ec[`${u}-${v}`] = COL.edgeOn;
            frames.push({ ec: { ...ec }, ns: { ...ns }, dist: dist.slice(), message: `Relax ${u}→${v}: ${old === Infinity ? "∞" : old} → ${dist[v]}.` });
          } else {
            frames.push({ ec: { ...ec, [`${u}-${v}`]: COL.edgeHi }, ns: { ...ns }, dist: dist.slice(), message: `${u}→${v}: ${dist[u]}+${w} ≥ ${dist[v]} — no update.` });
          }
        }
      }
      frames.push({ ec: { ...ec }, ns: { ...ns }, dist: dist.slice(), done: true, message: `<b>Done. dist = [${dist.map(d => d === Infinity ? "∞" : d).join(", ")}].</b>` });
      return {
        frames, g,
        render(f, svg) {
          drawGraph(svg, g, {
            edgeColors: f.ec, nodeStates: f.ns,
            nodeLabels: Object.fromEntries(f.dist.map((d, i) => [i, d === Infinity ? "∞" : d])),
          });
        },
      };
    },
  });

  /* --- 13. Bellman-Ford ------------------------------------------------ */
  register(13, {
    inputs: [
      { name: "edges", label: "Weighted edges (u-v:w ; ...)", default: "0-1:6, 0-2:7, 1-2:8, 1-3:-4, 1-4:5, 2-3:9, 2-4:-3, 3-1:7, 4-3:7" },
      { name: "src",   label: "Source", default: "0" },
    ],
    presets: [
      { name: "Classic", values: { edges: "0-1:6, 0-2:7, 1-2:8, 1-3:-4, 1-4:5, 2-3:9, 2-4:-3, 3-1:7, 4-3:7", src: "0" } },
      { name: "Negative cycle", values: { edges: "0-1:1, 1-2:-1, 2-0:-1", src: "0" } },
    ],
    build({ edges, src }) {
      const g = buildGraph(edges, false);   // directed
      const s = P.int(src);
      if (s < 0 || s >= g.n) return { error: "Source out of range" };
      const dist = new Array(g.n).fill(Infinity);
      dist[s] = 0;
      const frames = [];
      const ec = {};
      frames.push({ ec: { ...ec }, dist: dist.slice(), pass: 0, message: `Init: dist[${s}]=0, others=∞. Run ${g.n - 1} passes.` });
      let negCycle = false;
      for (let i = 1; i <= g.n - 1; i++) {
        let any = false;
        for (const e of g.edges) {
          if (dist[e.u] !== Infinity && dist[e.u] + e.w < dist[e.v]) {
            const old = dist[e.v];
            dist[e.v] = dist[e.u] + e.w;
            ec[`${e.u}-${e.v}`] = COL.edgeOn;
            frames.push({ ec: { ...ec }, dist: dist.slice(), pass: i, message: `Pass ${i}: relax ${e.u}→${e.v} (w=${e.w}). dist[${e.v}]: ${old === Infinity ? "∞" : old} → ${dist[e.v]}.` });
            any = true;
          }
        }
        if (!any) {
          frames.push({ ec: { ...ec }, dist: dist.slice(), pass: i, message: `Pass ${i}: no changes — converged early.` });
          break;
        }
      }
      // Detect negative cycle
      for (const e of g.edges) {
        if (dist[e.u] !== Infinity && dist[e.u] + e.w < dist[e.v]) { negCycle = true; break; }
      }
      frames.push({ ec: { ...ec }, dist: dist.slice(), pass: g.n - 1, done: true, message: negCycle ? `<b>Negative cycle detected.</b>` : `<b>Done. dist = [${dist.map(d => d === Infinity ? "∞" : d).join(", ")}].</b>` });
      return {
        frames, g,
        render(f, svg) {
          drawGraph(svg, g, {
            edgeColors: f.ec,
            nodeLabels: Object.fromEntries(f.dist.map((d, i) => [i, d === Infinity ? "∞" : d])),
          });
        },
      };
    },
  });

  /* --- 14. Floyd-Warshall ---------------------------------------------- */
  register(14, {
    inputs: [
      { name: "mat", label: "Cost matrix (use 9 for ∞)", long: true,
        default: "0,3,9,7\n9,0,2,9\n9,9,0,1\n6,9,9,0" },
    ],
    presets: [
      { name: "4-node", values: { mat: "0,3,9,7\n9,0,2,9\n9,9,0,1\n6,9,9,0" } },
      { name: "5-node", values: { mat: "0,2,9,9,9\n9,0,3,9,9\n9,9,0,1,9\n9,9,9,0,4\n7,9,9,9,0" } },
    ],
    build({ mat }) {
      const m0 = P.matrix(mat).map(r => r.map(x => x >= 9 ? Infinity : x));
      const n = m0.length;
      for (let i = 0; i < n; i++) m0[i][i] = 0;
      const frames = [];
      const m = m0.map(r => r.slice());
      frames.push({ m: m.map(r => r.slice()), k: -1, i: -1, j: -1, message: `Initial cost matrix (∞ = no edge).` });
      for (let k = 0; k < n; k++) {
        frames.push({ m: m.map(r => r.slice()), k, i: -1, j: -1, message: `Try k = ${k} as intermediate vertex.` });
        for (let i = 0; i < n; i++) {
          for (let j = 0; j < n; j++) {
            if (m[i][k] + m[k][j] < m[i][j]) {
              const old = m[i][j];
              m[i][j] = m[i][k] + m[k][j];
              frames.push({ m: m.map(r => r.slice()), k, i, j, message: `(i=${i},k=${k},j=${j}): ${old === Infinity ? "∞" : old} → ${m[i][j]} via k.` });
            }
          }
        }
      }
      frames.push({ m: m.map(r => r.slice()), k: n - 1, i: -1, j: -1, done: true, message: `<b>All-pairs shortest paths computed.</b>` });
      return {
        frames,
        render(f, svg) {
          const hl = {};
          if (f.k >= 0) {
            for (let i = 0; i < f.m.length; i++) { hl[`${i},${f.k}`] = "col"; hl[`${f.k},${i}`] = "row"; }
          }
          if (f.i >= 0) hl[`${f.i},${f.j}`] = "active";
          drawMatrix(svg, f.m, { highlights: hl });
        },
      };
    },
  });

  /* --- 15. Matrix Chain Multiplication --------------------------------- */
  register(15, {
    inputs: [
      { name: "dims", label: "Dimensions (p0,p1,...,pn)", default: "30,35,15,5,10,20,25" },
    ],
    presets: [
      { name: "Classic", values: { dims: "30,35,15,5,10,20,25" } },
      { name: "Small",   values: { dims: "10,20,30,40,30" } },
      { name: "Tiny",    values: { dims: "5,10,3,12,5,50,6" } },
    ],
    build({ dims }) {
      const p = P.nums(dims);
      const n = p.length - 1;
      if (n < 1) return { error: "Need at least two dimensions." };
      const m = Array.from({ length: n }, () => Array(n).fill(0));
      const frames = [];
      frames.push({ m: m.map(r => r.slice()), i: -1, j: -1, k: -1, message: `${n} matrices. Diagonal m[i][i] = 0.` });
      for (let len = 2; len <= n; len++) {
        for (let i = 0; i <= n - len; i++) {
          const j = i + len - 1;
          m[i][j] = Infinity;
          let bestK = -1;
          for (let k = i; k < j; k++) {
            const q = m[i][k] + m[k + 1][j] + p[i] * p[k + 1] * p[j + 1];
            frames.push({ m: m.map(r => r.slice()), i, j, k, q, message: `m[${i}][${j}] try k=${k}: ${m[i][k]} + ${m[k + 1][j]} + ${p[i]}·${p[k + 1]}·${p[j + 1]} = ${q}.` });
            if (q < m[i][j]) { m[i][j] = q; bestK = k; }
          }
          frames.push({ m: m.map(r => r.slice()), i, j, k: bestK, message: `m[${i}][${j}] = ${m[i][j]} (best k=${bestK}).` });
        }
      }
      frames.push({ m: m.map(r => r.slice()), i: -1, j: -1, k: -1, done: true, message: `<b>Minimum cost = ${m[0][n - 1]}.</b>` });
      return {
        frames,
        render(f, svg) {
          const hl = {};
          if (f.i >= 0) hl[`${f.i},${f.j}`] = "active";
          if (f.k >= 0 && f.i >= 0) {
            hl[`${f.i},${f.k}`] = "row";
            hl[`${f.k + 1},${f.j}`] = "col";
          }
          drawMatrix(svg, f.m, { highlights: hl, fmt: v => v === Infinity ? "∞" : v === 0 ? "0" : String(v) });
        },
      };
    },
  });

  /* --- 16. N-Queens ---------------------------------------------------- */
  register(16, {
    inputs: [{ name: "n", label: "N", default: "5" }],
    presets: [
      { name: "4-Queens", values: { n: "4" } },
      { name: "5-Queens", values: { n: "5" } },
      { name: "6-Queens", values: { n: "6" } },
      { name: "8-Queens", values: { n: "8" } },
    ],
    build({ n }) {
      const N = P.int(n);
      if (N < 1 || N > 10) return { error: "N must be between 1 and 10" };
      const frames = [];
      const queens = [];        // [row, col]
      const cols = new Array(N).fill(false);
      const d1 = new Array(2 * N).fill(false);
      const d2 = new Array(2 * N).fill(false);
      function safe(r, c) {
        return !cols[c] && !d1[r + c] && !d2[r - c + N];
      }
      let solved = false;
      function solve(r) {
        if (solved) return;
        if (r === N) {
          solved = true;
          frames.push({ queens: queens.slice(), attempt: { row: -1, col: -1 }, sol: 1, message: `<b>Solution found!</b>` });
          return;
        }
        for (let c = 0; c < N; c++) {
          if (solved) return;
          frames.push({ queens: queens.slice(), attempt: { row: r, col: c }, message: `Try placing Q at (${r}, ${c}).` });
          if (safe(r, c)) {
            queens.push([r, c]);
            cols[c] = d1[r + c] = d2[r - c + N] = true;
            frames.push({ queens: queens.slice(), attempt: { row: -1, col: -1 }, message: `Place Q at (${r}, ${c}). Recurse.` });
            solve(r + 1);
            if (solved) return;
            queens.pop();
            cols[c] = d1[r + c] = d2[r - c + N] = false;
            frames.push({ queens: queens.slice(), attempt: { row: r, col: c }, backtrack: true, message: `Backtrack: remove Q at (${r}, ${c}).` });
          } else {
            const confl = queens.filter(([qr, qc]) => qc === c || qr + qc === r + c || qr - qc === r - c);
            frames.push({ queens: queens.slice(), attempt: { row: r, col: c }, conflicts: confl, message: `(${r}, ${c}) attacks an existing queen.` });
          }
        }
      }
      solve(0);
      if (!solved) frames.push({ queens: [], attempt: { row: -1, col: -1 }, message: `<b>No solution for N=${N}.</b>` });
      return {
        N,
        frames,
        render(f, svg) {
          drawBoard(svg, N, f.queens, f.attempt, f.conflicts);
        },
      };
    },
  });

  /* --- 17. M-Coloring -------------------------------------------------- */
  register(17, {
    inputs: [
      { name: "edges", label: "Edges (u-v, ...)", default: "0-1,0-2,0-3,1-2,1-3,2-3" },
      { name: "m",     label: "Number of colors", default: "3" },
    ],
    presets: [
      { name: "K4 (4 colors)", values: { edges: "0-1,0-2,0-3,1-2,1-3,2-3", m: "4" } },
      { name: "K4 (3 colors — fails)", values: { edges: "0-1,0-2,0-3,1-2,1-3,2-3", m: "3" } },
      { name: "Cycle (2 colors)", values: { edges: "0-1,1-2,2-3,3-0", m: "2" } },
    ],
    build({ edges, m }) {
      const g = buildGraph(edges, true);
      const M = P.int(m);
      const color = new Array(g.n).fill(0);
      const palette = ["#ef4444", "#3b82f6", "#22c55e", "#facc15", "#a855f7", "#22d3ee"];
      const frames = [];
      function ok(u, c) {
        for (const { to: v } of g.adj[u]) if (color[v] === c) return false;
        return true;
      }
      let solved = false;
      function solve(u) {
        if (solved) return;
        if (u === g.n) {
          solved = true;
          frames.push({ color: color.slice(), u: -1, message: `<b>Solution found! Colors: [${color.join(", ")}].</b>` });
          return;
        }
        for (let c = 1; c <= M; c++) {
          frames.push({ color: color.slice(), u, tryC: c, message: `Try color ${c} for node ${u}.` });
          if (ok(u, c)) {
            color[u] = c;
            frames.push({ color: color.slice(), u, tryC: c, message: `Assign color ${c} to ${u}. Recurse.` });
            solve(u + 1);
            if (solved) return;
            color[u] = 0;
            frames.push({ color: color.slice(), u, tryC: c, backtrack: true, message: `Backtrack ${u}.` });
          } else {
            frames.push({ color: color.slice(), u, tryC: c, bad: true, message: `Color ${c} conflicts at ${u}.` });
          }
        }
      }
      solve(0);
      if (!solved) frames.push({ color: color.slice(), u: -1, message: `<b>No solution with ${M} colors.</b>` });
      return {
        frames, g,
        render(f, svg) {
          const ns = {};
          for (let i = 0; i < g.n; i++) {
            ns[i] = f.color[i] ? "visited" : "idle";
          }
          if (f.u >= 0) ns[f.u] = f.bad ? "bad" : "current";
          // override fill via nodeStates won't carry color; use nodeLabels for color number
          const ec = {};
          for (const e of g.edges) {
            if (f.color[e.u] && f.color[e.u] === f.color[e.v]) ec[`${e.u}-${e.v}`] = COL.edgeBad;
          }
          // custom redraw with color fills
          clear(svg);
          const W = 720, H = 360;
          svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
          const cx = W / 2, cy = H / 2, r = Math.min(W, H) / 2 - 50;
          const pos = [];
          for (let i = 0; i < g.n; i++) pos.push(nodeXY(i, g.n, cx, cy, r));
          for (const e of g.edges) {
            const [x1, y1] = pos[e.u], [x2, y2] = pos[e.v];
            const bad = f.color[e.u] && f.color[e.u] === f.color[e.v];
            svg.appendChild(el("line", { x1, y1, x2, y2,
              stroke: bad ? COL.edgeBad : COL.edge,
              "stroke-width": bad ? 3 : 2, opacity: bad ? 1 : 0.7 }));
          }
          for (let i = 0; i < g.n; i++) {
            const [x, y] = pos[i];
            const c = f.color[i];
            const fill = c ? palette[(c - 1) % palette.length] : "#0a0a0a";
            const stroke = f.u === i ? COL.bright : COL.base;
            svg.appendChild(el("circle", { cx: x, cy: y, r: 22, fill, stroke, "stroke-width": f.u === i ? 3 : 2 }));
            svg.appendChild(txt(x, y + 5, String(i), "v-node"));
            if (c) svg.appendChild(txt(x, y - 30, "c" + c, "v-nlab"));
          }
        },
      };
    },
  });

  /* --- 18. Hamiltonian Cycle ------------------------------------------- */
  register(18, {
    inputs: [
      { name: "edges", label: "Edges (u-v, ...)", default: "0-1,0-3,1-2,1-3,1-4,2-4,3-4" },
    ],
    presets: [
      { name: "Has cycle", values: { edges: "0-1,0-3,1-2,1-3,1-4,2-4,3-4" } },
      { name: "K4",        values: { edges: "0-1,0-2,0-3,1-2,1-3,2-3" } },
      { name: "No cycle",  values: { edges: "0-1,1-2,2-3" } },
    ],
    build({ edges }) {
      const g = buildGraph(edges, true);
      const adjSet = Array.from({ length: g.n }, () => new Set());
      for (const e of g.edges) { adjSet[e.u].add(e.v); adjSet[e.v].add(e.u); }
      const path = [0];
      const inP = new Array(g.n).fill(false);
      inP[0] = true;
      const frames = [];
      let solved = false;
      function solve() {
        if (solved) return;
        const u = path[path.length - 1];
        if (path.length === g.n) {
          if (adjSet[u].has(0)) {
            solved = true;
            frames.push({ path: [...path, 0], message: `<b>Hamiltonian cycle: ${[...path, 0].join(" → ")}.</b>` });
          } else {
            frames.push({ path: path.slice(), bad: true, message: `Path complete but last node ${u} not adjacent to start 0.` });
          }
          return;
        }
        for (let v = 0; v < g.n; v++) {
          if (inP[v] || !adjSet[u].has(v)) continue;
          path.push(v); inP[v] = true;
          frames.push({ path: path.slice(), message: `Extend path with ${v}. Path: ${path.join(" → ")}.` });
          solve();
          if (solved) return;
          path.pop(); inP[v] = false;
          frames.push({ path: path.slice(), backtrack: true, message: `Backtrack from ${v}.` });
        }
      }
      frames.push({ path: path.slice(), message: `Start from node 0.` });
      solve();
      if (!solved) frames.push({ path: [], message: `<b>No Hamiltonian cycle exists.</b>` });
      return {
        frames, g,
        render(f, svg) {
          const ec = {};
          for (let i = 0; i + 1 < f.path.length; i++) ec[`${f.path[i]}-${f.path[i + 1]}`] = COL.edgeOn;
          const ns = {};
          for (const v of f.path) ns[v] = "visited";
          if (f.path.length) ns[f.path[f.path.length - 1]] = "current";
          if (f.bad) ns[f.path[f.path.length - 1]] = "bad";
          drawGraph(svg, g, { edgeColors: ec, nodeStates: ns,
            nodeLabels: Object.fromEntries(f.path.map((v, i) => [v, "#" + (i + 1)])) });
        },
      };
    },
  });

  /* --- 19. Ford-Fulkerson (Max Flow) ----------------------------------- */
  register(19, {
    inputs: [
      { name: "edges", label: "Directed weighted edges (u-v:cap ; ...)", default: "0-1:16, 0-2:13, 1-2:10, 2-1:4, 1-3:12, 3-2:9, 2-4:14, 4-3:7, 3-5:20, 4-5:4" },
      { name: "src",   label: "Source", default: "0" },
      { name: "snk",   label: "Sink",   default: "5" },
    ],
    presets: [
      { name: "Classic 6-node", values: { edges: "0-1:16, 0-2:13, 1-2:10, 2-1:4, 1-3:12, 3-2:9, 2-4:14, 4-3:7, 3-5:20, 4-5:4", src: "0", snk: "5" } },
      { name: "Simple 4-node",  values: { edges: "0-1:3, 0-2:2, 1-2:5, 1-3:2, 2-3:3", src: "0", snk: "3" } },
    ],
    build({ edges, src, snk }) {
      const eList = P.edges(edges);
      const n = eList.reduce((m, e) => Math.max(m, e.u, e.v), 0) + 1;
      const cap = Array.from({ length: n }, () => Array(n).fill(0));
      for (const e of eList) cap[e.u][e.v] += e.w;
      const flow = Array.from({ length: n }, () => Array(n).fill(0));
      const s = P.int(src), t = P.int(snk);
      if (s < 0 || s >= n || t < 0 || t >= n) return { error: "Source/sink out of range" };
      const g = { n, edges: eList, directed: true, adj: [] };
      const frames = [];
      function bfs() {
        const parent = new Array(n).fill(-1);
        parent[s] = s;
        const q = [s];
        while (q.length) {
          const u = q.shift();
          for (let v = 0; v < n; v++) {
            if (parent[v] === -1 && cap[u][v] - flow[u][v] > 0) {
              parent[v] = u;
              if (v === t) return parent;
              q.push(v);
            }
          }
        }
        return null;
      }
      let total = 0;
      while (true) {
        const par = bfs();
        if (!par) break;
        let path = [t]; let v = t;
        while (v !== s) { v = par[v]; path.push(v); }
        path.reverse();
        let bottleneck = Infinity;
        for (let i = 0; i + 1 < path.length; i++) {
          const u = path[i], v2 = path[i + 1];
          bottleneck = Math.min(bottleneck, cap[u][v2] - flow[u][v2]);
        }
        const ec = {};
        for (let i = 0; i + 1 < path.length; i++) ec[`${path[i]}-${path[i + 1]}`] = COL.edgeHi;
        frames.push({ flow: flow.map(r => r.slice()), ec, path: path.slice(), bottleneck, total, message: `Augmenting path: ${path.join(" → ")}. Bottleneck = ${bottleneck}.` });
        for (let i = 0; i + 1 < path.length; i++) {
          const u = path[i], v2 = path[i + 1];
          flow[u][v2] += bottleneck;
          flow[v2][u] -= bottleneck;
        }
        total += bottleneck;
        const ec2 = {};
        for (let i = 0; i + 1 < path.length; i++) ec2[`${path[i]}-${path[i + 1]}`] = COL.edgeOn;
        frames.push({ flow: flow.map(r => r.slice()), ec: ec2, path: path.slice(), total, message: `Push ${bottleneck} along path. Total flow = ${total}.` });
      }
      frames.push({ flow: flow.map(r => r.slice()), ec: {}, path: [], total, done: true, message: `<b>Max flow from ${s} to ${t} = ${total}.</b>` });
      return {
        frames, g,
        render(f, svg) {
          const labels = {};
          for (const e of eList) {
            const used = Math.max(0, f.flow[e.u][e.v]);
            labels[`${e.u}-${e.v}`] = `${used}/${e.w}`;
          }
          const ns = {};
          (f.path || []).forEach(v => ns[v] = "frontier");
          ns[s] = "current"; ns[t] = "visited";
          drawGraph(svg, g, { edgeColors: f.ec, edgeLabel: labels, nodeStates: ns });
        },
      };
    },
  });

  /* --- 20. TSP (Branch & Bound, simplified) ---------------------------- */
  register(20, {
    inputs: [
      { name: "mat", label: "Cost matrix (use 9 for ∞)", long: true,
        default: "0,10,15,20\n10,0,35,25\n15,35,0,30\n20,25,30,0" },
    ],
    presets: [
      { name: "4-city", values: { mat: "0,10,15,20\n10,0,35,25\n15,35,0,30\n20,25,30,0" } },
      { name: "5-city", values: { mat: "0,3,1,5,8\n3,0,6,7,9\n1,6,0,4,2\n5,7,4,0,3\n8,9,2,3,0" } },
    ],
    build({ mat }) {
      const m = P.matrix(mat).map(r => r.map(x => x >= 9 ? Infinity : x));
      const n = m.length;
      if (n > 6) return { error: "Keep N ≤ 6 for visualization." };
      const frames = [];
      const visited = new Array(n).fill(false);
      const path = [0];
      visited[0] = true;
      let best = Infinity, bestPath = [];
      function snap(curCost, msg, extra) {
        const ec = {};
        for (let i = 0; i + 1 < path.length; i++) ec[`${path[i]}-${path[i + 1]}`] = COL.edgeHi;
        frames.push({ path: path.slice(), best, bestPath: bestPath.slice(), ec, curCost, ...(extra || {}), message: msg });
      }
      function solve(cost) {
        if (path.length === n) {
          const total = cost + (m[path[path.length - 1]][0] || Infinity);
          if (total < best) {
            best = total; bestPath = [...path, 0];
            snap(total, `Found tour: ${bestPath.join(" → ")} cost=${total}. <b>New best.</b>`, { improved: true });
          } else {
            snap(total, `Tour ${[...path, 0].join(" → ")} cost=${total} ≥ best ${best}. Discard.`);
          }
          return;
        }
        const u = path[path.length - 1];
        for (let v = 0; v < n; v++) {
          if (!visited[v] && m[u][v] !== Infinity) {
            const newCost = cost + m[u][v];
            if (newCost >= best) {
              snap(newCost, `Bound: cost ${newCost} ≥ best ${best === Infinity ? "∞" : best}. Prune ${u}→${v}.`, { prune: true });
              continue;
            }
            visited[v] = true; path.push(v);
            snap(newCost, `Visit ${v}. Path cost = ${newCost}.`);
            solve(newCost);
            visited[v] = false; path.pop();
            snap(cost, `Backtrack from ${v}.`);
          }
        }
      }
      snap(0, `Start TSP from city 0.`);
      solve(0);
      const g = {
        n,
        edges: (() => {
          const out = [];
          for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) if (m[i][j] !== Infinity) out.push({ u: i, v: j, w: m[i][j] });
          return out;
        })(),
        directed: false,
      };
      frames.push({ path: bestPath, best, bestPath, ec: Object.fromEntries(bestPath.slice(0, -1).map((u, i) => [`${u}-${bestPath[i + 1]}`, COL.edgeOn])), done: true, message: `<b>Best tour: ${bestPath.join(" → ")}. Cost = ${best}.</b>` });
      return {
        frames, g,
        render(f, svg) {
          const ns = {};
          (f.path || []).forEach((v, i) => ns[v] = i === f.path.length - 1 ? "current" : "visited");
          drawGraph(svg, g, { edgeColors: f.ec, nodeStates: ns });
        },
      };
    },
  });

  /* ====================================================================== */
  window.AlgoVisualizer = { register, mount };
})();
