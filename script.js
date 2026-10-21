/* ============================================================
   DSA Lab — UI
   Hash-routed single page app:
     #/                       home
     #/<category>             category overview
     #/<category>/<folder>    one topic (concept, steps, code, viva)
   All content comes from content.js (GitHub or local files).
   ============================================================ */
(function () {
  "use strict";

  const CFG   = window.DSA_CONFIG;
  const C     = window.DSAContent;
  const LANGS = CFG.languages;

  const $ = id => document.getElementById(id);
  const view      = $("view");
  const sidebar   = $("sidebar");
  const topicList = $("topicList");
  const searchEl  = $("search");

  /* ----- Safe storage ---------------------------------------------------- */
  const store = {
    get(k, d) { try { const v = localStorage.getItem(k); return v == null ? d : v; } catch { return d; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch {} },
  };
  const loadDone = () => { try { return new Set(JSON.parse(store.get("dsa.done", "[]"))); } catch { return new Set(); } };

  const state = {
    cats: [],
    activeCat: CFG.categories[0].id,
    query: "",
    done: loadDone(),
    edits: new Map(),            // "path|lang" -> edited source (in memory only — gone on refresh)
    session: null,               // live terminal session of the visible topic
  };

  /* ----- Small helpers ---------------------------------------------------- */
  const esc = s => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  const pad = n => String(n).padStart(2, "0");
  const catById = id => state.cats.find(c => c.id === id);
  const topicBy = (catId, folder) => { const c = catById(catId); return c && c.topics.find(t => t.folder === folder); };
  const go = hash => { location.hash = hash; };
  const topicHash = t => `#/${t.cat}/${t.folder}`;
  const ICON = {
    layers: '<path d="M12 2 2 7l10 5 10-5-10-5z"/><path d="m2 17 10 5 10-5"/><path d="m2 12 10 5 10-5"/>',
    route:  '<circle cx="6" cy="19" r="3"/><path d="M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15"/><circle cx="18" cy="5" r="3"/>',
    check:  '<polyline points="20 6 9 17 4 12"/>',
    play:   '<polygon points="6 4 20 12 6 20 6 4"/>',
    github: '<path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.4 5.4 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/>',
    arrowL: '<path d="M19 12H5M12 19l-7-7 7-7"/>',
    arrowR: '<path d="M5 12h14M12 5l7 7-7 7"/>',
    copy:   '<rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>',
    reset:  '<path d="M3 12a9 9 0 1 0 3-6.7"/><path d="M3 4v5h5"/>',
    edit:   '<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/>',
  };
  const svg = (name, cls) => `<svg class="${cls || ""}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICON[name]}</svg>`;

  let toastTimer;
  function showToast(msg) {
    const t = $("toast");
    t.textContent = msg; t.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove("show"), 1700);
  }

  /* ======================================================================
     Syntax highlighter (C / C++ / Java) — single pass, no libraries
     ====================================================================== */
  const C_KW = "auto break case char const continue default do double else enum extern float for goto if inline int long register restrict return short signed sizeof static struct switch typedef union unsigned void volatile while";
  const CPP_KW = C_KW + " bool true false class public private protected new delete using namespace template typename virtual this try catch throw nullptr operator friend explicit constexpr override final";
  const JAVA_KW = "abstract assert boolean break byte case catch char class const continue default do double else enum extends final finally float for goto if implements import instanceof int interface long native new package private protected public return short static strictfp super switch synchronized this throw throws transient try void volatile while var true false null record";
  const KW = { c: new Set(C_KW.split(" ")), cpp: new Set(CPP_KW.split(" ")), java: new Set(JAVA_KW.split(" ")) };
  const TY = {
    c:    new Set("size_t NULL INT_MAX INT_MIN LONG_MAX LLONG_MAX INF MAX FILE EOF".split(" ")),
    cpp:  new Set("vector pair string map set queue stack size_t NULL INT_MAX INT_MIN LONG_MAX LLONG_MAX INF MAX cout cin cerr endl array list deque priority_queue unordered_map unordered_set".split(" ")),
    java: new Set("String Integer Long Double Boolean Character Object Math System Scanner Arrays List ArrayList LinkedList Map HashMap Set HashSet Queue Deque ArrayDeque PriorityQueue Stack Collections Random StringBuilder Comparator Exception".split(" ")),
  };

  const isAlpha = c => (c >= "a" && c <= "z") || (c >= "A" && c <= "Z") || c === "_" || c === "$";
  const isDigit = c => c >= "0" && c <= "9";
  const isWord  = c => isAlpha(c) || isDigit(c);

  function highlight(src, lang) {
    const code = esc(src).replace(/&quot;/g, '"');          // keep " literal for string scanning
    const kw = KW[lang] || KW.c, ty = TY[lang] || TY.c;
    const n = code.length;
    const wrap = (cls, t) => `<span class="tok-${cls}">${t}</span>`;
    let out = "", i = 0;
    while (i < n) {
      const ch = code[i], nx = code[i + 1];
      if (ch === "/" && nx === "*") {
        const end = code.indexOf("*/", i + 2), j = end === -1 ? n : end + 2;
        out += wrap("cmt", code.substring(i, j)); i = j; continue;
      }
      if (ch === "/" && nx === "/") {
        let j = i; while (j < n && code[j] !== "\n") j++;
        out += wrap("cmt", code.substring(i, j)); i = j; continue;
      }
      if (ch === '"' || ch === "'") {
        let j = i + 1;
        while (j < n && code[j] !== ch && code[j] !== "\n") { if (code[j] === "\\" && j + 1 < n) j += 2; else j++; }
        j = Math.min(j + 1, n);
        out += wrap("str", code.substring(i, j)); i = j; continue;
      }
      if (ch === "#" && lang !== "java") {
        let j = i + 1; while (j < n && isAlpha(code[j])) j++;
        out += wrap("key", code.substring(i, j)); i = j; continue;
      }
      if (ch === "@" && lang === "java") {
        let j = i + 1; while (j < n && isWord(code[j])) j++;
        out += wrap("key", code.substring(i, j)); i = j; continue;
      }
      if (isDigit(ch)) {
        let j = i; while (j < n && (isWord(code[j]) || code[j] === ".")) j++;
        out += wrap("num", code.substring(i, j)); i = j; continue;
      }
      if (isAlpha(ch)) {
        let j = i; while (j < n && isWord(code[j])) j++;
        const word = code.substring(i, j);
        let k = j; while (k < n && code[k] === " ") k++;
        if (kw.has(word))                  out += wrap("key", word);
        else if (ty.has(word))             out += wrap("typ", word);
        else if (code[k] === "(")          out += wrap("fn", word);
        else                               out += word;
        i = j; continue;
      }
      out += ch; i++;
    }
    return out + (src.endsWith("\n") ? " " : "");       // keep the last empty line visible
  }

  /* ======================================================================
     Sidebar + top nav
     ====================================================================== */
  function renderTopnav(route) {
    const links = [`<a href="#/" class="${route.type === "home" ? "active" : ""}">Home</a>`]
      .concat(state.cats.map(c =>
        `<a href="#/${c.id}" class="${route.cat === c.id ? "active" : ""}">${esc(c.label)}</a>`));
    $("topnav").innerHTML = links.join("");
  }

  function renderSidebar(route) {
    // segmented control
    $("catSeg").innerHTML = state.cats.map(c =>
      `<button type="button" role="tab" data-cat="${c.id}" class="${c.id === state.activeCat ? "active" : ""}" aria-selected="${c.id === state.activeCat}">
         ${esc(c.label)} <span class="count">${c.topics.length}</span></button>`).join("");

    const q = state.query.trim().toLowerCase();
    const cur = route.topic;
    const item = t => {
      const done = state.done.has(t.path);
      return `<li><a href="${topicHash(t)}" data-path="${esc(t.path)}" class="${cur && cur.path === t.path ? "active" : ""}">
          <span class="num">${pad(t.num)}</span>
          <span class="name">${esc(t.short)}</span>
          ${done ? `<span class="done-dot" title="Marked as done">${svg("check")}</span>` : ""}
        </a></li>`;
    };

    let html = "";
    if (q) {
      const match = t => (t.title + " " + t.short + " " + t.tags.join(" ")).toLowerCase().includes(q);
      state.cats.forEach(c => {
        const hits = c.topics.filter(match);
        if (hits.length) html += `<li class="group">${esc(c.label)}</li>` + hits.map(item).join("");
      });
      if (!html) html = `<li class="empty">No topics match “${esc(state.query)}”.</li>`;
    } else {
      const c = catById(state.activeCat);
      html = c && c.topics.length ? c.topics.map(item).join("") : `<li class="empty">No topics yet.</li>`;
    }
    topicList.innerHTML = html;

    const total = state.cats.reduce((n, c) => n + c.topics.length, 0);
    const doneN = state.cats.reduce((n, c) => n + c.topics.filter(t => state.done.has(t.path)).length, 0);
    $("sidebarFoot").innerHTML =
      `<div class="progress"><span style="width:${total ? (doneN / total) * 100 : 0}%"></span></div>
       <small>${doneN} of ${total} topics done · C, C++ &amp; Java</small>`;

    const a = topicList.querySelector("a.active");
    if (a) a.scrollIntoView({ block: "nearest" });
  }

  /* ======================================================================
     Views
     ====================================================================== */
  function topicCard(t) {
    const done = state.done.has(t.path);
    return `<a class="topic-card ${done ? "is-done" : ""}" href="${topicHash(t)}">
        <span class="tc-num">${pad(t.num)}</span>
        <span class="tc-body">
          <strong>${esc(t.short)}</strong>
          <small>${esc(t.tags.slice(0, 3).join(" · "))}</small>
        </span>
        ${done ? `<span class="tc-done">${svg("check")}</span>` : ""}
      </a>`;
  }

  function catSection(c, withLink) {
    return `<section class="cat-block glass" id="cat-${c.id}">
        <div class="cat-head">
          <div class="cat-ico">${svg(c.icon || "layers")}</div>
          <div class="cat-title">
            <h3>${esc(c.label)}${c.course ? ` <span class="tag">${esc(c.course)}</span>` : ""}</h3>
            <p class="muted">${esc(c.blurb || "")}</p>
          </div>
          ${withLink ? `<a class="btn ghost small" href="#/${c.id}">View all ${c.topics.length}</a>` : ""}
        </div>
        ${c.topics.length
          ? `<div class="topic-grid">${c.topics.map(topicCard).join("")}</div>`
          : `<p class="muted pad">Nothing here yet — add a folder under <code>content/${c.id}/</code>.</p>`}
      </section>`;
  }

  function renderHome() {
    const nTopics = state.cats.reduce((n, c) => n + c.topics.length, 0);
    const nViva = state.cats.reduce((n, c) => n + c.topics.reduce((m, t) => m + t.info.viva.length, 0), 0);
    const last = topicBy(...String(store.get("dsa.last", "")).split("/"));
    const first = state.cats[0] && state.cats[0].topics[0];
    const cta = last
      ? `<a class="btn primary" href="${topicHash(last)}">Continue: ${esc(last.short)}</a>`
      : first ? `<a class="btn primary" href="${topicHash(first)}">Start learning</a>` : "";

    view.innerHTML = `
      <div class="hero glass">
        <div class="hero-inner">
          <span class="badge">B.Tech CSE · Academy of Technology</span>
          <h2>Learn <strong>Data Structures</strong> &amp; <strong>Algorithms</strong> by running real code.</h2>
          <p>${nTopics} topics, each with the concept, step-by-step algorithm, complexity, runnable <strong>C</strong>, <strong>C++</strong> &amp; <strong>Java</strong> programs and <strong>viva questions</strong>. Edit the code right in the page and press <em>Run</em>.</p>
          <div class="hero-cta">${cta}
            ${state.cats.map(c => `<a class="btn ghost" href="#/${c.id}">${esc(c.label)}</a>`).join("")}
          </div>
          <div class="hero-stats">
            ${state.cats.map(c => `<div class="stat"><span>${c.topics.length}</span><small>${esc(c.label)}</small></div>`).join("")}
            <div class="stat"><span>${LANGS.length}</span><small>Languages</small></div>
            <div class="stat"><span>${nViva}</span><small>Viva Q&amp;A</small></div>
          </div>
        </div>
      </div>
      ${state.cats.map(c => catSection(c, true)).join("")}
      ${footerHtml()}`;
  }

  function renderCategory(c) {
    view.innerHTML = `
      <div class="crumbs"><a href="#/">Home</a><span>/</span><span>${esc(c.label)}</span></div>
      ${catSection(c, false)}
      ${footerHtml()}`;
  }

  function footerHtml() {
    const src = C.source === "local" ? "local files" : "GitHub";
    return `<footer class="footer glass">
        <p>Academy of Technology · Data Structures &amp; Algorithms Lab</p>
        <p class="muted"><small>Content loaded from ${src} ·
          <a href="${C.links.repo}" target="_blank" rel="noopener">${CFG.repo.owner}/${CFG.repo.name}</a> ·
          <a href="${C.links.newFile(state.activeCat)}" target="_blank" rel="noopener">Add a topic</a></small></p>
        <p class="credit">Built by <strong>Monojit Karfa</strong></p>
      </footer>`;
  }

  /* ----- Topic page ------------------------------------------------------- */
  function renderTopic(c, t) {
    const info = t.info;
    const idx = c.topics.indexOf(t);
    const prev = c.topics[idx - 1], next = c.topics[idx + 1];
    const done = state.done.has(t.path);
    const hasCx = info.complexity.length > 0;
    const complexity = hasCx ? `
      <div class="subsection" id="sec-complexity">
        <h3>Time &amp; Space Complexity</h3>
        <div class="complexity-grid">
          ${info.complexity.map(x => `<div class="cx"><small>${esc(x.label)}</small><code>${esc(x.value)}</code></div>`).join("")}
        </div>
      </div>` : "";
    const extras = info.extras.map(x => `
      <div class="subsection"><h3>${esc(x.title)}</h3>${x.html}</div>`).join("");
    const viva = info.viva.map((v, i) => `
      <div class="viva-item">
        <button class="viva-q" type="button">
          <span class="q-num">Q${pad(i + 1)}</span>
          <span class="q-text">${v.q}</span>
          <svg class="chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
        </button>
        <div class="viva-a"><div class="viva-a-inner">${v.a}</div></div>
      </div>`).join("");

    const lastLang = store.get("dsa.lang", LANGS[0].id);
    const startLang = LANGS.some(l => l.id === lastLang) ? lastLang : LANGS[0].id;

    view.innerHTML = `
      <div class="crumbs">
        <a href="#/">Home</a><span>/</span><a href="#/${c.id}">${esc(c.label)}</a><span>/</span><span>${esc(t.short)}</span>
      </div>

      <article class="algo-section glass" id="topic">
        <div class="algo-header">
          <div class="algo-num">${pad(t.num)}</div>
          <div class="algo-title">
            <h2>${esc(t.title)}</h2>
            <div class="tags">${t.tags.map(x => `<span class="tag">${esc(x)}</span>`).join("")}</div>
          </div>
          <div class="algo-actions">
            ${t.visualizer ? `<a class="viz-launch" href="viz.html?algo=${t.num}" target="_blank" rel="noopener" title="Open interactive visualizer">${svg("play")}<span>Visualize</span></a>` : ""}
            <button class="chip-btn ${done ? "on" : ""}" id="doneBtn" type="button" aria-pressed="${done}">${svg("check")}<span>${done ? "Done" : "Mark done"}</span></button>
          </div>
        </div>

        <nav class="jump" aria-label="On this page">
          <a href="#" data-jump="sec-concept">Concept</a>
          ${info.steps ? `<a href="#" data-jump="sec-steps">${esc(info.stepsTitle.split(" / ")[0])}</a>` : ""}
          ${hasCx ? `<a href="#" data-jump="sec-complexity">Complexity</a>` : ""}
          <a href="#" data-jump="sec-code">Code</a>
          ${info.viva.length ? `<a href="#" data-jump="sec-viva">Viva</a>` : ""}
        </nav>

        <div class="subsection" id="sec-concept"><h3>Concept</h3>${info.concept}</div>
        ${info.steps ? `<div class="subsection" id="sec-steps"><h3>${esc(info.stepsTitle)}</h3>${info.steps}</div>` : ""}
        ${complexity}
        ${extras}

        <div class="subsection" id="sec-code">
          <h3>Implementation</h3>
          <div class="code-runtime">
            <div class="code-block" id="codeBlock">
              <div class="code-tabs">
                <div class="tab-group" role="tablist" aria-label="Language">
                  ${LANGS.map(l => `<button class="tab-btn ${l.id === startLang ? "active" : ""}" role="tab" data-lang="${l.id}">${esc(l.label)}</button>`).join("")}
                </div>
                <div class="code-tools">
                  <span class="file-name" id="fileName"></span>
                  <span class="mod-badge" id="modBadge" hidden>edited</span>
                  <button class="tool-btn" id="resetBtn" type="button" hidden title="Discard your edits">${svg("reset")}Reset</button>
                  <button class="copy-btn" id="copyBtn" type="button">${svg("copy")}Copy</button>
                </div>
              </div>
              ${LANGS.map(l => `
                <div class="code-pane ${l.id === startLang ? "active" : ""}" data-lang="${l.id}">
                  <div class="pane-msg"><div class="spinner sm"></div> Loading ${esc(l.file)}…</div>
                </div>`).join("")}
              <div class="edit-hint">✎ Editable — changes live only in this tab and are lost on refresh.</div>
            </div>

            <div class="terminal" id="terminal" data-state="idle">
              <div class="terminal-head">
                <span class="terminal-title">
                  <span class="t-dot t-dot-r"></span><span class="t-dot t-dot-y"></span><span class="t-dot t-dot-g"></span>
                  <span class="t-name">${esc(t.folder)} · terminal</span>
                </span>
                <span class="terminal-status">idle</span>
                <div class="terminal-actions">
                  <button class="sample-btn clear-btn" id="sampleBtn" type="button" hidden title="Send the example input to the running program">Sample input</button>
                  <button class="run-btn" id="runBtn" type="button" title="Compile and run (Ctrl+Enter)">
                    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>Run
                  </button>
                  <button class="clear-btn" id="clearBtn" type="button" title="Stop & clear terminal">Clear</button>
                </div>
              </div>
              <div class="terminal-body" id="termBody">
                <div class="terminal-output" id="termOut" aria-live="polite"></div>
                <div class="terminal-input-line" id="termLine" hidden>
                  <span class="prompt">&gt;</span>
                  <input class="terminal-input" id="termIn" type="text" spellcheck="false" autocomplete="off" autocorrect="off" autocapitalize="off" />
                </div>
              </div>
            </div>
          </div>
        </div>

        ${info.viva.length ? `<div class="subsection" id="sec-viva"><h3>Viva Questions</h3><div class="viva-list">${viva}</div></div>` : ""}

        <div class="gh-row">
          <a href="${C.links.tree(t)}" target="_blank" rel="noopener">${svg("github")} View source files on GitHub</a>
          <a href="${C.links.edit(t, "info.md")}" target="_blank" rel="noopener">${svg("edit")} Improve this explanation</a>
        </div>
      </article>

      <nav class="pager">
        ${prev ? `<a class="pager-btn glass" href="${topicHash(prev)}">${svg("arrowL")}<span><small>Previous</small>${esc(prev.short)}</span></a>` : "<span></span>"}
        ${next ? `<a class="pager-btn glass right" href="${topicHash(next)}"><span><small>Next</small>${esc(next.short)}</span>${svg("arrowR")}</a>` : "<span></span>"}
      </nav>
      ${footerHtml()}`;

    mountTopic(t, startLang);
  }

  /* ----- Behaviour of one topic page -------------------------------------- */
  function mountTopic(t, startLang) {
    const $q = sel => view.querySelector(sel);
    const block = $q("#codeBlock");
    const panes = {};            // lang id -> {el, ta, pre, original}
    let activeLang = startLang;

    const key = lang => t.path + "|" + lang;
    const langObj = id => LANGS.find(l => l.id === id);

    // jump links
    view.querySelectorAll("[data-jump]").forEach(a => a.addEventListener("click", e => {
      e.preventDefault();
      const el = $(a.dataset.jump) || view.querySelector("#" + a.dataset.jump);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }));

    // mark done
    $q("#doneBtn").addEventListener("click", () => {
      state.done.has(t.path) ? state.done.delete(t.path) : state.done.add(t.path);
      store.set("dsa.done", JSON.stringify([...state.done]));
      const on = state.done.has(t.path);
      const b = $q("#doneBtn");
      b.classList.toggle("on", on); b.setAttribute("aria-pressed", on);
      b.querySelector("span").textContent = on ? "Done" : "Mark done";
      renderSidebar(currentRoute);
      if (on) showToast("Nice! Marked as done ✔");
    });

    // viva accordion
    view.querySelectorAll(".viva-q").forEach(q => q.addEventListener("click", () => {
      const item = q.parentElement, a = item.querySelector(".viva-a");
      const open = item.classList.toggle("open");
      a.style.maxHeight = open ? a.scrollHeight + "px" : "0px";
    }));

    /* ---- code panes ---- */
    function updateToolbar() {
      const p = panes[activeLang];
      const lang = langObj(activeLang);
      $q("#fileName").textContent = lang.file;
      const edited = !!(p && p.ta && p.ta.value !== p.original);
      $q("#modBadge").hidden = !edited;
      $q("#resetBtn").hidden = !edited;
      $q("#copyBtn").disabled = !(p && p.ta);
    }

    function fillPane(lang, code) {
      const el = block.querySelector(`.code-pane[data-lang="${lang.id}"]`);
      if (code == null) {
        el.innerHTML = `<div class="pane-msg missing">
            <strong>${esc(lang.label)} version not available yet.</strong>
            <span>Add <code>${esc(lang.file)}</code> to <code>content/${esc(t.path)}/</code> on GitHub and it will appear here.</span>
            <a class="btn ghost small" href="${C.links.newFile(t.path)}?filename=${encodeURIComponent(lang.file)}" target="_blank" rel="noopener">Add ${esc(lang.file)}</a>
          </div>`;
        panes[lang.id] = { el, original: null };
        updateToolbar();
        return;
      }
      const saved = state.edits.get(key(lang.id));
      el.innerHTML = `<div class="code-edit-wrap">
          <pre class="code-highlight"></pre>
          <textarea class="code-textarea" spellcheck="false" autocomplete="off" autocorrect="off" autocapitalize="off" wrap="off" aria-label="${esc(lang.label)} source code"></textarea>
        </div>`;
      const ta = el.querySelector("textarea"), pre = el.querySelector("pre");
      ta.value = saved != null ? saved : code;
      pre.innerHTML = highlight(ta.value, lang.id);
      const p = { el, ta, pre, original: code };
      panes[lang.id] = p;

      const sync = () => {
        pre.innerHTML = highlight(ta.value, lang.id);
        if (ta.value === code) state.edits.delete(key(lang.id)); else state.edits.set(key(lang.id), ta.value);
        updateToolbar();
      };
      ta.addEventListener("input", sync);
      ta.addEventListener("keydown", e => {
        if (e.key === "Tab") {                                   // Tab inserts 4 spaces
          e.preventDefault();
          const s = ta.selectionStart, en = ta.selectionEnd;
          ta.value = ta.value.slice(0, s) + "    " + ta.value.slice(en);
          ta.selectionStart = ta.selectionEnd = s + 4; sync();
        } else if (e.key === "Enter" && !e.ctrlKey && !e.metaKey) {   // keep indentation on Enter
          e.preventDefault();
          const s = ta.selectionStart, en = ta.selectionEnd;
          const lineStart = ta.value.lastIndexOf("\n", s - 1) + 1;
          const indent = /^[ \t]*/.exec(ta.value.slice(lineStart, s))[0];
          const extra = /[{(]\s*$/.test(ta.value.slice(lineStart, s)) ? "    " : "";
          const ins = "\n" + indent + extra;
          ta.value = ta.value.slice(0, s) + ins + ta.value.slice(en);
          ta.selectionStart = ta.selectionEnd = s + ins.length; sync();
        } else if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
          e.preventDefault(); $q("#runBtn").click();
        }
      });
      updateToolbar();
    }

    LANGS.forEach(l => {
      C.loadCode(t, l).then(code => fillPane(l, code))
        .catch(() => fillPane(l, null));
    });

    // tabs
    block.querySelectorAll(".tab-btn").forEach(btn => btn.addEventListener("click", () => {
      activeLang = btn.dataset.lang;
      store.set("dsa.lang", activeLang);
      block.querySelectorAll(".tab-btn").forEach(b => b.classList.toggle("active", b === btn));
      block.querySelectorAll(".code-pane").forEach(p => p.classList.toggle("active", p.dataset.lang === activeLang));
      updateToolbar();
    }));

    // reset
    $q("#resetBtn").addEventListener("click", () => {
      const p = panes[activeLang];
      if (!p || !p.ta) return;
      p.ta.value = p.original;
      p.pre.innerHTML = highlight(p.original, activeLang);
      state.edits.delete(key(activeLang));
      updateToolbar(); showToast("Restored the original code");
    });

    // copy
    $q("#copyBtn").addEventListener("click", () => {
      const p = panes[activeLang];
      if (!p || !p.ta) return;
      const btn = $q("#copyBtn"), text = p.ta.value;
      const ok = () => {
        btn.classList.add("copied"); const orig = btn.innerHTML;
        btn.innerHTML = svg("check") + "Copied"; showToast("Code copied to clipboard");
        setTimeout(() => { btn.classList.remove("copied"); btn.innerHTML = orig; }, 1500);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(ok).catch(() => fallbackCopy(text, ok));
      else fallbackCopy(text, ok);
    });

    /* ---- terminal ---- */
    const terminal = $q("#terminal"), outEl = $q("#termOut"), lineEl = $q("#termLine"),
          inputEl = $q("#termIn"), statusEl = terminal.querySelector(".terminal-status"),
          runBtn = $q("#runBtn"), body = $q("#termBody"), sampleBtn = $q("#sampleBtn");
    let sample = null;

    function append(text, cls) {
      if (!text) return;
      text = text.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
      const span = document.createElement("span");
      if (cls) span.className = "t-" + cls;
      span.textContent = text;
      outEl.appendChild(span);
      body.scrollTop = body.scrollHeight;
    }
    const ui = {
      write: append,
      status(phase) { terminal.dataset.state = phase; statusEl.textContent = phase; },
      onReady() {
        lineEl.hidden = false; runBtn.disabled = true; runBtn.classList.add("loading");
        if (sample) sampleBtn.hidden = false;
        setTimeout(() => inputEl.focus({ preventScroll: true }), 0);
      },
      onEnd() { lineEl.hidden = true; sampleBtn.hidden = true; runBtn.disabled = false; runBtn.classList.remove("loading"); },
    };
    const session = new window.AlgoRunner.TerminalSession(ui);
    state.session = session;

    C.loadSample(t).then(s => { sample = s && s.trim() ? s.replace(/\r\n?/g, "\n").trim() : null; }).catch(() => {});

    inputEl.addEventListener("keydown", e => {
      if (e.key !== "Enter") return;
      e.preventDefault();
      const line = inputEl.value;
      append(line + "\n", "in");
      if (!session.sendInput(line)) append("[not connected]\n", "err");
      inputEl.value = "";
    });
    body.addEventListener("click", () => {
      if (lineEl.hidden) return;
      if (window.getSelection && window.getSelection().toString()) return;
      inputEl.focus({ preventScroll: true });
    });

    sampleBtn.addEventListener("click", () => {
      if (!sample || !session.isLive()) return;
      const lines = sample.split("\n");
      append("▶ sending sample input (" + lines.length + " lines)\n", "meta");
      lines.forEach(l => session.sendInput(l));
    });

    runBtn.addEventListener("click", () => {
      const p = panes[activeLang];
      if (!p || !p.ta) { showToast(langObj(activeLang).label + " code isn't available for this topic yet"); return; }
      outEl.textContent = "";
      ui.status("connecting");
      session.start(activeLang, p.ta.value);
    });
    $q("#clearBtn").addEventListener("click", () => {
      session.stop(); outEl.textContent = ""; ui.status("idle"); ui.onEnd();
    });
  }

  function fallbackCopy(text, cb) {
    const ta = document.createElement("textarea");
    ta.value = text; ta.style.position = "fixed"; ta.style.opacity = "0";
    document.body.appendChild(ta); ta.select();
    try { document.execCommand("copy"); cb(); } catch {}
    document.body.removeChild(ta);
  }

  /* ======================================================================
     Router
     ====================================================================== */
  let currentRoute = { type: "home" };

  function parseRoute() {
    let h = location.hash.replace(/^#\/?/, "");
    // legacy links: #algo-5
    const legacy = /^algo-(\d+)$/.exec(h);
    if (legacy) {
      const c = catById("algorithms"), t = c && c.topics.find(x => x.num === +legacy[1]);
      if (t) return { type: "topic", cat: c.id, topic: t, redirect: topicHash(t) };
    }
    const parts = h.split("/").filter(Boolean);
    if (!parts.length) return { type: "home" };
    const c = catById(parts[0]);
    if (!c) return { type: "missing" };
    if (parts.length === 1) return { type: "cat", cat: c.id };
    const t = topicBy(c.id, parts[1]);
    return t ? { type: "topic", cat: c.id, topic: t } : { type: "missing", cat: c.id };
  }

  function route() {
    const r = parseRoute();
    if (r.redirect) { history.replaceState(null, "", r.redirect); }
    currentRoute = r;
    if (state.session) { state.session.stop(); state.session = null; }
    if (r.cat) state.activeCat = r.cat;

    if (r.type === "home") { document.title = "DSA Lab — Data Structures & Algorithms"; renderHome(); }
    else if (r.type === "cat") { const c = catById(r.cat); document.title = c.label + " · DSA Lab"; renderCategory(c); }
    else if (r.type === "topic") {
      document.title = r.topic.short + " · DSA Lab";
      store.set("dsa.last", r.topic.path);
      renderTopic(catById(r.cat), r.topic);
    } else {
      document.title = "Not found · DSA Lab";
      view.innerHTML = `<div class="glass loading-card"><h3>Topic not found</h3>
        <p class="muted">That page doesn't exist (yet).</p><a class="btn primary" href="#/">Back to home</a></div>`;
    }
    renderTopnav(r);
    renderSidebar(r);
    window.scrollTo({ top: 0 });
    closeMenu();
  }

  /* ======================================================================
     Chrome: search, theme, mobile menu, shortcuts
     ====================================================================== */
  let backdrop;
  function closeMenu() { sidebar.classList.remove("open"); backdrop && backdrop.classList.remove("show"); }

  function bindChrome() {
    $("repoLink").href = C.links.repo;

    // category switch in the sidebar
    $("catSeg").addEventListener("click", e => {
      const b = e.target.closest("button[data-cat]");
      if (!b) return;
      state.activeCat = b.dataset.cat; state.query = ""; searchEl.value = "";
      renderSidebar(currentRoute);
    });
    searchEl.addEventListener("input", () => { state.query = searchEl.value; renderSidebar(currentRoute); });
    searchEl.addEventListener("keydown", e => {
      if (e.key === "Enter") { const a = topicList.querySelector("a[data-path]"); if (a) { a.click(); searchEl.blur(); } }
      if (e.key === "Escape") { searchEl.value = ""; state.query = ""; renderSidebar(currentRoute); searchEl.blur(); }
    });
    document.addEventListener("keydown", e => {
      if (e.key === "/" && !e.target.matches("input, textarea, select")) { e.preventDefault(); openMenu(); searchEl.focus(); }
    });

    // mobile drawer
    backdrop = document.createElement("div");
    backdrop.className = "backdrop"; document.body.appendChild(backdrop);
    $("menuToggle").addEventListener("click", openMenu);
    backdrop.addEventListener("click", closeMenu);
    topicList.addEventListener("click", e => { if (e.target.closest("a")) closeMenu(); });

    // theme
    $("themeToggle").addEventListener("click", () => {
      const next = document.documentElement.getAttribute("data-theme") === "light" ? "" : "light";
      if (next) document.documentElement.setAttribute("data-theme", next);
      else document.documentElement.removeAttribute("data-theme");
      store.set("theme", next);
    });
  }
  function openMenu() { if (window.matchMedia("(max-width: 980px)").matches) { sidebar.classList.add("open"); backdrop.classList.add("show"); } }

  /* ======================================================================
     Boot
     ====================================================================== */
  async function boot() {
    bindChrome();
    try {
      state.cats = await C.loadAll();
    } catch (err) {
      view.innerHTML = `<div class="glass loading-card error">
          <h3>Couldn't load the content</h3>
          <p class="muted">${esc(err.message || err)}</p>
          <p class="muted"><small>The site reads <code>content/index.json</code> from
          <a href="${C.links.repo}" target="_blank" rel="noopener">${CFG.repo.owner}/${CFG.repo.name}</a>
          (branch <code>${CFG.repo.branch}</code>). Check <code>config.js</code>, that the repo is public and that the
          <code>content/</code> folder has been pushed.</small></p>
          <button class="btn primary" onclick="location.reload()">Retry</button></div>`;
      $("sidebarFoot").innerHTML = "<small>Offline</small>";
      return;
    }
    if (!state.cats.some(c => c.id === state.activeCat && c.topics.length)) {
      const firstFull = state.cats.find(c => c.topics.length);
      if (firstFull) state.activeCat = firstFull.id;
    }
    window.addEventListener("hashchange", route);
    route();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
