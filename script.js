/* ============================================================
   Algorithm Lab — UI logic
   Renders algorithms, manages tabs, sidebar, theme, search, viva
   ============================================================ */

(function () {
  "use strict";

  const algos = window.ALGORITHMS || [];
  const sidebar      = document.getElementById("sidebar");
  const algoList     = document.getElementById("algoList");
  const syllabusList = document.getElementById("syllabusList");
  const container    = document.getElementById("algoContainer");
  const searchInput  = document.getElementById("search");
  const menuBtn      = document.getElementById("menuToggle");
  const themeBtn     = document.getElementById("themeToggle");
  const toast        = document.getElementById("toast");

  /* ----- Render Sidebar + Syllabus list ----- */
  function buildLists() {
    const sideFrag = document.createDocumentFragment();
    const sylFrag  = document.createDocumentFragment();

    algos.forEach(a => {
      const li = document.createElement("li");
      li.innerHTML = `<a href="#algo-${a.id}" data-id="${a.id}">
                        <span class="num">${String(a.id).padStart(2, "0")}</span>
                        <span class="name">${a.short || a.name}</span>
                      </a>`;
      sideFrag.appendChild(li);

      const sylLi = document.createElement("li");
      sylLi.innerHTML = `<a href="#algo-${a.id}">${a.name}</a>`;
      sylFrag.appendChild(sylLi);
    });

    algoList.appendChild(sideFrag);
    syllabusList.appendChild(sylFrag);
  }

  /* ----- Single-pass tokenizer for C/C++ ----- */
  const KEYWORDS = new Set([
    "auto","break","case","char","const","continue","default","do","double",
    "else","enum","extern","float","for","goto","if","inline","int","long",
    "register","restrict","return","short","signed","sizeof","static","struct",
    "switch","typedef","union","unsigned","void","volatile","while","bool",
    "true","false","class","public","private","protected","new","delete",
    "using","namespace","template","typename","virtual","this","try","catch",
    "throw","nullptr"
  ]);
  const TYPES = new Set([
    "vector","pair","string","map","set","queue","stack","Edge","Item","Job",
    "Pair","size_t","INT_MAX","INT_MIN","LONG_MAX","LLONG_MAX","INF","MAX",
    "NULL","cout","cin","endl"
  ]);

  function escapeHtml(s) {
    return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  const isAlpha = c => (c >= "a" && c <= "z") || (c >= "A" && c <= "Z") || c === "_";
  const isWord  = c => isAlpha(c) || (c >= "0" && c <= "9");
  const isDigit = c => c >= "0" && c <= "9";

  function highlight(src) {
    const code = escapeHtml(src);
    const n = code.length;
    const wrap = (cls, text) => `<span class="tok-${cls}">${text}</span>`;
    let out = "";
    let i = 0;

    while (i < n) {
      const ch = code[i], nx = code[i + 1];

      if (ch === "/" && nx === "*") {
        const end = code.indexOf("*/", i + 2);
        const j = end === -1 ? n : end + 2;
        out += wrap("cmt", code.substring(i, j));
        i = j; continue;
      }
      if (ch === "/" && nx === "/") {
        let j = i;
        while (j < n && code[j] !== "\n") j++;
        out += wrap("cmt", code.substring(i, j));
        i = j; continue;
      }
      if (ch === '"') {
        let j = i + 1;
        while (j < n && code[j] !== '"') {
          if (code[j] === "\\" && j + 1 < n) j += 2;
          else j++;
        }
        j = Math.min(j + 1, n);
        out += wrap("str", code.substring(i, j));
        i = j; continue;
      }
      if (ch === "'") {
        let j = i + 1;
        while (j < n && code[j] !== "'") {
          if (code[j] === "\\" && j + 1 < n) j += 2;
          else j++;
        }
        j = Math.min(j + 1, n);
        out += wrap("str", code.substring(i, j));
        i = j; continue;
      }
      if (ch === "#") {
        let j = i + 1;
        while (j < n && isAlpha(code[j])) j++;
        out += wrap("key", code.substring(i, j));
        i = j; continue;
      }
      if (isDigit(ch)) {
        let j = i;
        while (j < n && (isDigit(code[j]) || code[j] === ".")) j++;
        out += wrap("num", code.substring(i, j));
        i = j; continue;
      }
      if (isAlpha(ch)) {
        let j = i;
        while (j < n && isWord(code[j])) j++;
        const word = code.substring(i, j);
        if (KEYWORDS.has(word))      out += wrap("key", word);
        else if (TYPES.has(word))    out += wrap("typ", word);
        else                          out += word;
        i = j; continue;
      }

      out += ch;
      i++;
    }

    return out;
  }

  /* ----- Render an algorithm section ----- */
  function renderAlgo(a) {
    const tagsHtml = (a.tags || []).map(t => `<span class="tag">${t}</span>`).join("");
    const stepsHtml = (a.process || []).map(s => `<li>${s}</li>`).join("");

    const vivaHtml = (a.viva || []).map((v, i) => `
      <div class="viva-item">
        <button class="viva-q" type="button">
          <span class="q-num">Q${String(i + 1).padStart(2, "0")}</span>
          <span class="q-text">${v.q}</span>
          <svg class="chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
        </button>
        <div class="viva-a"><div class="viva-a-inner">${v.a}</div></div>
      </div>`).join("");

    return `
      <section id="algo-${a.id}" class="algo-section glass">
        <div class="algo-header">
          <div class="algo-num">${String(a.id).padStart(2, "0")}</div>
          <div class="algo-title">
            <h2>${a.name}</h2>
            <div class="tags">${tagsHtml}</div>
          </div>
        </div>

        <div class="subsection">
          <h3>Concept</h3>
          <p>${a.concept}</p>
        </div>

        <div class="subsection">
          <h3>Algorithm / Process</h3>
          <ol>${stepsHtml}</ol>
        </div>

        <div class="subsection">
          <h3>Time &amp; Space Complexity</h3>
          <div class="complexity-grid">
            <div class="cx"><small>Best</small><code>${a.complexity.best}</code></div>
            <div class="cx"><small>Average</small><code>${a.complexity.avg}</code></div>
            <div class="cx"><small>Worst</small><code>${a.complexity.worst}</code></div>
            <div class="cx"><small>Space</small><code>${a.complexity.space}</code></div>
          </div>
        </div>

        <div class="subsection">
          <h3>Implementation</h3>
          <div class="code-block">
            <div class="code-tabs">
              <div class="tab-group" role="tablist">
                <button class="tab-btn active" data-lang="c">C</button>
                <button class="tab-btn" data-lang="cpp">C++</button>
              </div>
              <button class="copy-btn" type="button">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                Copy
              </button>
            </div>
            <div class="code-pane active" data-lang="c"><pre>${highlight(a.c)}</pre></div>
            <div class="code-pane"          data-lang="cpp"><pre>${highlight(a.cpp)}</pre></div>
          </div>
        </div>

        <div class="subsection">
          <h3>Viva Questions</h3>
          <div class="viva-list">${vivaHtml}</div>
        </div>
      </section>`;
  }

  function renderAll() {
    container.innerHTML = algos.map(renderAlgo).join("");
  }

  /* ----- Tabs C / C++ ----- */
  function bindTabs() {
    container.addEventListener("click", e => {
      const btn = e.target.closest(".tab-btn");
      if (!btn) return;
      const tabs = btn.closest(".code-tabs");
      const block = tabs.parentElement;
      const lang = btn.dataset.lang;

      tabs.querySelectorAll(".tab-btn").forEach(b => b.classList.toggle("active", b === btn));
      block.querySelectorAll(".code-pane").forEach(p =>
        p.classList.toggle("active", p.dataset.lang === lang));
    });
  }

  /* ----- Copy buttons ----- */
  function bindCopy() {
    container.addEventListener("click", e => {
      const btn = e.target.closest(".copy-btn");
      if (!btn) return;
      const block = btn.closest(".code-block");
      const active = block.querySelector(".code-pane.active pre");
      if (!active) return;
      const text = active.innerText;
      const ok = () => {
        btn.classList.add("copied");
        const original = btn.innerHTML;
        btn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg> Copied`;
        showToast("Code copied to clipboard");
        setTimeout(() => { btn.classList.remove("copied"); btn.innerHTML = original; }, 1500);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(ok).catch(() => fallbackCopy(text, ok));
      } else {
        fallbackCopy(text, ok);
      }
    });
  }
  function fallbackCopy(text, cb) {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed"; ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand("copy"); cb(); } catch {}
    document.body.removeChild(ta);
  }

  /* ----- Viva accordion ----- */
  function bindViva() {
    container.addEventListener("click", e => {
      const q = e.target.closest(".viva-q");
      if (!q) return;
      const item = q.parentElement;
      const answer = item.querySelector(".viva-a");
      const open = item.classList.toggle("open");
      answer.style.maxHeight = open ? answer.scrollHeight + "px" : "0px";
    });
  }

  /* ----- Sidebar active link via IntersectionObserver ----- */
  function bindScrollSpy() {
    const links = algoList.querySelectorAll("a");
    const io = new IntersectionObserver(entries => {
      entries.forEach(en => {
        if (en.isIntersecting) {
          const id = en.target.id.replace("algo-", "");
          links.forEach(l => l.classList.toggle("active", l.dataset.id === id));
        }
      });
    }, { rootMargin: "-40% 0px -55% 0px", threshold: 0 });

    document.querySelectorAll(".algo-section").forEach(s => io.observe(s));
  }

  /* ----- Search filter ----- */
  function bindSearch() {
    searchInput.addEventListener("input", () => {
      const q = searchInput.value.trim().toLowerCase();
      algoList.querySelectorAll("li").forEach(li => {
        const txt = li.textContent.toLowerCase();
        li.style.display = txt.includes(q) ? "" : "none";
      });
    });
  }

  /* ----- Mobile sidebar ----- */
  function bindMobileMenu() {
    const backdrop = document.createElement("div");
    backdrop.className = "backdrop";
    document.body.appendChild(backdrop);

    const open  = () => { sidebar.classList.add("open");  backdrop.classList.add("show"); };
    const close = () => { sidebar.classList.remove("open"); backdrop.classList.remove("show"); };

    menuBtn.addEventListener("click", open);
    backdrop.addEventListener("click", close);
    sidebar.addEventListener("click", e => {
      if (e.target.closest("a")) close();
    });
  }

  /* ----- Theme toggle ----- */
  function bindTheme() {
    const saved = localStorage.getItem("theme");
    if (saved) document.documentElement.setAttribute("data-theme", saved);

    themeBtn.addEventListener("click", () => {
      const cur = document.documentElement.getAttribute("data-theme");
      const next = cur === "light" ? "" : "light";
      if (next) document.documentElement.setAttribute("data-theme", next);
      else      document.documentElement.removeAttribute("data-theme");
      localStorage.setItem("theme", next);
    });
  }

  /* ----- Toast ----- */
  let toastTimer;
  function showToast(msg) {
    toast.textContent = msg;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 1600);
  }

  /* ----- Init ----- */
  function init() {
    buildLists();
    renderAll();
    bindTabs();
    bindCopy();
    bindViva();
    bindScrollSpy();
    bindSearch();
    bindMobileMenu();
    bindTheme();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
