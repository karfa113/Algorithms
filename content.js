/* ============================================================
   DSA Lab — content loader
   Fetches the topic index, info.md and source files from the
   GitHub repo (or the local folder) and turns Markdown into HTML.
   Shared by index.html and viz.html.
   ============================================================ */
(function () {
  "use strict";
  const CFG = window.DSA_CONFIG;
  const R = CFG.repo;

  /* ----- Where to read from ------------------------------------------- */
  const GITHUB_RAW = `https://raw.githubusercontent.com/${R.owner}/${R.name}/${R.branch}/${R.path}`;
  const LOCAL      = R.path;                       // relative to the page
  const host = location.hostname;
  const isLocalHost = host === "localhost" || host === "127.0.0.1" || host === "[::1]";
  const forced = new URLSearchParams(location.search).get("src");   // ?src=github | local

  const sources = (() => {
    const gh = { name: "github", base: GITHUB_RAW };
    const lo = { name: "local",  base: LOCAL };
    if (forced === "github") return [gh];
    if (forced === "local")  return [lo];
    if (location.protocol === "file:") return [gh];          // file:// can't fetch siblings
    return isLocalHost ? [lo, gh] : [gh, lo];
  })();
  let active = 0;                                // index of the source that last worked
  let usedSource = null;

  async function getText(rel, opts) {
    const optional = opts && opts.optional;
    let lastErr;
    for (let k = 0; k < sources.length; k++) {
      const s = sources[(active + k) % sources.length];
      try {
        const res = await fetch(`${s.base}/${rel}`, { cache: "no-cache" });
        if (res.ok) {
          active = (active + k) % sources.length;
          usedSource = s.name;
          return await res.text();
        }
        lastErr = new Error(`${res.status} ${rel}`);
        if (res.status === 404 && optional) continue;      // try other source, else null
      } catch (e) { lastErr = e; }
    }
    if (optional) return null;
    throw lastErr || new Error("Could not load " + rel);
  }

  /* ----- Inline Markdown -> safe HTML ---------------------------------- */
  const esc = s => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  function inline(src) {
    const codes = [];
    let s = src.replace(/`([^`]+)`/g, (_, c) => { codes.push(esc(c)); return `\u0000${codes.length - 1}\u0000`; });
    s = esc(s);
    s = s.replace(/&lt;(\/?)(sub|sup|br)&gt;/g, "<$1$2>");                     // tiny whitelist
    s = s.replace(/\*\*(\S(?:.*?\S)?)\*\*/g, "<strong>$1</strong>");
    s = s.replace(/(^|[^*\w])\*(\S(?:.*?\S)?)\*(?![*\w])/g, "$1<em>$2</em>");
    s = s.replace(/\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
    return s.replace(/\u0000(\d+)\u0000/g, (_, i) => `<code>${codes[+i]}</code>`);
  }

  /* ----- Block Markdown: paragraphs, nested lists, code fences --------- */
  function blocks(lines) {
    const out = [];
    let i = 0;
    const listRe = /^(\s*)(\d+\.|[-*])\s+(.*)$/;
    while (i < lines.length) {
      const line = lines[i];
      if (!line.trim()) { i++; continue; }
      if (/^```/.test(line)) {                       // fenced block
        const buf = []; i++;
        while (i < lines.length && !/^```/.test(lines[i])) buf.push(lines[i++]);
        i++;
        out.push({ type: "pre", text: buf.join("\n") });
        continue;
      }
      if (listRe.test(line)) {
        const items = [], indents = [];                 // indents: stack of indentation widths
        while (i < lines.length) {
          const m = listRe.exec(lines[i]);
          if (m) {
            const w = m[1].replace(/\t/g, "    ").length;
            while (indents.length && indents[indents.length - 1] > w) indents.pop();
            if (!indents.length || indents[indents.length - 1] < w) indents.push(w);
            items.push({ level: indents.length - 1, ordered: /\d/.test(m[2]), text: m[3] });
            i++;
          } else if (lines[i].trim() && /^\s{2,}\S/.test(lines[i]) && items.length) {
            items[items.length - 1].text += " " + lines[i].trim(); i++;      // wrapped line
          } else break;
        }
        out.push({ type: "list", items });
        continue;
      }
      const buf = [];
      while (i < lines.length && lines[i].trim() && !listRe.test(lines[i]) && !/^```/.test(lines[i])) buf.push(lines[i++].trim());
      out.push({ type: "p", text: buf.join(" ") });
    }
    return out;
  }

  function listHtml(items) {
    let html = "", stack = [];                       // stack of {level, tag}
    const open  = (tag, lvl) => { html += `<${tag}${lvl ? ' class="sub"' : ""}>`; stack.push({ level: lvl, tag }); };
    const close = () => { html += `</li></${stack.pop().tag}>`; };
    items.forEach(it => {
      const lvl = it.level;
      const tag = it.ordered ? "ol" : "ul";
      while (stack.length && stack[stack.length - 1].level > lvl) close();
      if (stack.length && stack[stack.length - 1].level === lvl) html += "</li>";
      else open(tag, lvl);
      html += `<li>${inline(it.text)}`;
    });
    while (stack.length) close();
    return html;
  }

  function blocksHtml(bl) {
    return bl.map(b =>
      b.type === "p"    ? `<p>${inline(b.text)}</p>` :
      b.type === "pre"  ? `<pre class="md-pre">${esc(b.text)}</pre>` :
      listHtml(b.items)).join("");
  }

  /* ----- info.md parser ------------------------------------------------- */
  function parseInfo(text) {
    text = text.replace(/\r\n?/g, "\n");
    const meta = {};
    const fm = /^---\n([\s\S]*?)\n---\n?/.exec(text);
    if (fm) {
      fm[1].split("\n").forEach(l => {
        const m = /^([A-Za-z_]+)\s*:\s*(.*)$/.exec(l);
        if (m) meta[m[1].toLowerCase()] = m[2].trim();
      });
      text = text.slice(fm[0].length);
    }
    const sections = [];
    let cur = null;
    text.split("\n").forEach(line => {
      const h = /^##\s+(.+?)\s*$/.exec(line);
      if (h && !/^###/.test(line)) { cur = { title: h[1], lines: [] }; sections.push(cur); }
      else if (cur) cur.lines.push(line);
    });

    const out = { meta, concept: "", steps: [], extras: [], complexity: [], viva: [], stepsTitle: "Algorithm / Process" };
    sections.forEach(sec => {
      const key = sec.title.toLowerCase();
      if (key === "viva") {
        let q = null;
        sec.lines.forEach(line => {
          const m = /^###\s+(.+?)\s*$/.exec(line);
          if (m) { q = { q: inline(m[1]), lines: [] }; out.viva.push(q); }
          else if (q) q.lines.push(line);
        });
        out.viva.forEach(v => { v.a = blocksHtml(blocks(v.lines)); delete v.lines; });
      } else if (key === "complexity") {
        sec.lines.forEach(l => {
          const m = /^\s*[-*]\s+([^:]+):\s*(.+)$/.exec(l);
          if (m) out.complexity.push({ label: m[1].trim(), value: m[2].trim() });
        });
      } else if (key === "concept") {
        out.concept = blocksHtml(blocks(sec.lines));
      } else if (key === "algorithm" || key === "operations") {
        out.stepsTitle = key === "algorithm" ? "Algorithm / Process" : "Operations";
        out.steps = blocksHtml(blocks(sec.lines));
      } else {
        out.extras.push({ title: sec.title, html: blocksHtml(blocks(sec.lines)) });
      }
    });
    return out;
  }

  /* ----- Index (topic list) --------------------------------------------- */
  async function loadIndex() {
    try {
      const idx = JSON.parse(await getText("index.json"));
      if (idx && idx.categories) return idx.categories;
    } catch (e) { /* fall through to the Trees API */ }
    // Fallback: ask GitHub for the folder listing (60 requests/hour/IP, so only a backup)
    const url = `https://api.github.com/repos/${R.owner}/${R.name}/git/trees/${R.branch}?recursive=1`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("Could not load content/index.json or the GitHub tree");
    const tree = (await res.json()).tree || [];
    const cats = {};
    CFG.categories.forEach(c => {
      const re = new RegExp(`^${R.path}/${c.id}/(\\d+-[^/]+)/info\\.md$`);
      cats[c.id] = tree.map(t => re.exec(t.path)).filter(Boolean).map(m => m[1])
        .sort((a, b) => parseInt(a, 10) - parseInt(b, 10));
    });
    return cats;
  }

  const prettify = f => f.replace(/^\d+-/, "").replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase());

  /* ----- Load everything the sidebar/home needs ------------------------ */
  async function loadAll() {
    const index = await loadIndex();
    const cats = CFG.categories.map(c => ({ ...c, topics: [] }));
    const jobs = [];
    cats.forEach(cat => {
      (index[cat.id] || []).forEach(folder => {
        const t = {
          cat: cat.id, folder, num: parseInt(folder, 10),
          path: `${cat.id}/${folder}`,
          title: prettify(folder), short: prettify(folder), tags: [],
          info: null, ok: false,
        };
        cat.topics.push(t);
        jobs.push(getText(`${t.path}/info.md`).then(txt => {
          const info = parseInfo(txt);
          t.info = info; t.ok = true;
          t.title = info.meta.title || t.title;
          t.short = info.meta.short || t.title;
          t.tags  = (info.meta.tags || "").split(",").map(s => s.trim()).filter(Boolean);
          t.visualizer = /^(true|yes|1)$/i.test(info.meta.visualizer || "");
        }).catch(() => { t.ok = false; }));
      });
    });
    await Promise.all(jobs);
    cats.forEach(c => { c.topics = c.topics.filter(t => t.ok); });
    return cats;
  }

  /* ----- Source files + sample input ------------------------------------ */
  const codeCache = new Map();
  function loadCode(topic, lang) {
    const key = topic.path + "|" + lang.id;
    if (!codeCache.has(key)) {
      codeCache.set(key, getText(`${topic.path}/${lang.file}`, { optional: true })
        .then(t => t == null ? null : t.replace(/\r\n?/g, "\n").replace(/\n+$/, "\n")));
    }
    return codeCache.get(key);
  }
  const sampleCache = new Map();
  function loadSample(topic) {
    if (!sampleCache.has(topic.path))
      sampleCache.set(topic.path, getText(`${topic.path}/sample.in`, { optional: true }));
    return sampleCache.get(topic.path);
  }

  /* ----- GitHub links ---------------------------------------------------- */
  const ghBase = `https://github.com/${R.owner}/${R.name}`;
  const links = {
    repo: ghBase,
    edit: (topic, file) => `${ghBase}/edit/${R.branch}/${R.path}/${topic.path}/${file}`,
    tree: topic => `${ghBase}/tree/${R.branch}/${R.path}/${topic.path}`,
    newFile: cat => `${ghBase}/new/${R.branch}/${R.path}/${cat}`,
  };

  window.DSAContent = {
    loadAll, loadCode, loadSample, parseInfo, links, prettify,
    get source() { return usedSource; },
    sources: sources.map(s => s.name),
  };
})();
