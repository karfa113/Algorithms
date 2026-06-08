# Algorithm Lab — DAA (PCC-CS494)

A modern, fully responsive single-page reference site for the **Design and Analysis of Algorithm Lab** at Academy of Technology. Every algorithm in the official syllabus is covered with its concept, step-by-step process, time & space complexity, **C** and **C++** implementations, and viva-style questions with answers.

Built as a static site — no framework, no build step. Just open `index.html` in any modern browser.

---

## ✦ Features

- **17 algorithms** from the PCC-CS494 syllabus, each with:
  - Plain-English concept explanation
  - Numbered algorithmic / pseudocode steps
  - Best / average / worst time complexity + space complexity
  - Working **C** implementation
  - Working **C++** implementation
  - 5–7 frequently asked viva questions with detailed answers
- **Glassmorphism UI** — frosted-glass panels with orange-accent borders on a static black/white background
- **Dark + Light themes** with one-click toggle, persisted to `localStorage`
- **Fully responsive** — adapts cleanly down to 360 px-wide phones (mobile drawer sidebar, single-column layouts, fluid type)
- **Searchable sidebar** to jump to any algorithm instantly
- **Scroll-spy navigation** — sidebar highlights the algorithm currently in view
- **Code tabs** to switch between C and C++ versions
- **Copy-to-clipboard** button on every code block, with a toast confirmation
- **Accordion viva section** — questions expand on click
- **Custom syntax highlighter** written from scratch for C/C++ (no external libraries)

---

## ✦ Algorithms Covered

| #   | Algorithm                              | Category                  |
| --- | -------------------------------------- | ------------------------- |
| 01  | Binary Search (Recursive)              | Divide & Conquer          |
| 02  | Merge Sort                             | Divide & Conquer, Sorting |
| 03  | Randomized Quick Sort                  | Divide & Conquer, Sorting |
| 04  | Max-Min using Divide & Conquer         | Divide & Conquer          |
| 05  | Heap Sort                              | Sorting, Heap             |
| 06  | BFS (Adjacency Matrix, no STL)         | Graph, Traversal          |
| 07  | DFS — Recursive & Iterative            | Graph, Traversal          |
| 08  | Fractional Knapsack                    | Greedy                    |
| 09  | Job Sequencing with Deadlines          | Greedy, Scheduling        |
| 10  | Kruskal's Algorithm                    | Greedy, MST               |
| 11  | Prim's Algorithm                       | Greedy, MST               |
| 12  | Dijkstra's Algorithm                   | Greedy, Shortest Path     |
| 13  | Bellman-Ford Algorithm                 | DP, Shortest Path         |
| 14  | Floyd-Warshall Algorithm               | DP, All-Pairs SP          |
| 15  | Matrix Chain Multiplication            | Dynamic Programming       |
| 16  | N-Queen Problem                        | Backtracking              |
| 17  | M-Coloring (Graph Coloring)            | Backtracking, Graph       |

---

## ✦ Tech Stack

| Layer            | Choice                                                              |
| ---------------- | ------------------------------------------------------------------- |
| Markup           | HTML5 (semantic landmarks)                                          |
| Styles           | Plain CSS — Custom Properties, CSS Grid, Flexbox, `backdrop-filter` |
| Behavior         | Vanilla JavaScript (ES6+) — no framework, no bundler                |
| Fonts            | Google Fonts — Inter (UI) + JetBrains Mono (code)                   |
| Syntax highlight | Custom single-pass tokenizer (built in `script.js`)                 |

Zero npm dependencies. Zero build tools.

---

## ✦ Project Structure

```
Algo lab/
├── index.html      Markup, layout, asset links
├── styles.css      Glass theme, responsive breakpoints, syntax tokens
├── data.js         All 17 algorithms: concept, steps, complexity, C, C++, viva
├── script.js       Renders sections, tabs, copy, viva accordion, scroll-spy,
│                    search, mobile menu, theme toggle, syntax highlighter
└── README.md       This file
```

### File responsibilities

- **`index.html`** — defines the page shell (topbar, sidebar, hero, syllabus, footer). The algorithm cards are rendered dynamically by `script.js`.
- **`data.js`** — exposes a single global `window.ALGORITHMS` array; each entry is an object with `id`, `name`, `tags`, `concept`, `process`, `complexity`, `c`, `cpp`, and `viva` fields.
- **`script.js`** — wraps everything in an IIFE; reads from `window.ALGORITHMS`, renders the DOM, then wires up all interactivity.
- **`styles.css`** — drives the theme via CSS custom properties. Dark is the default; light is enabled by `[data-theme="light"]` on `<html>`.

---

## ✦ Running the Site

### Option 1 — Just open it

Double-click `index.html`. It works directly from the file system; no server needed.

### Option 2 — Quick local server (recommended)

A static server prevents the few browser quirks that affect `file://` URLs and gives you auto-reload if you wish to add tooling later.

```bash
# Python 3
cd "E:\Algo lab"
python -m http.server 8000
# then open http://localhost:8000
```

```bash
# Node (with npx)
npx serve "E:\Algo lab"
```

---

## ✦ Customizing the Content

### Add a new algorithm

Append a new entry to the `ALGORITHMS` array in `data.js`:

```js
{
  id: 18,
  name: "Your Algorithm Name",
  short: "Short Name",                // shown in the sidebar
  tags: ["Greedy", "Graph"],          // free-form tags
  concept: `<p>HTML-safe paragraph explaining the idea.</p>`,
  process: [
    "Step 1 description (HTML allowed).",
    "Step 2 description."
  ],
  complexity: { best: "O(n)", avg: "O(n log n)", worst: "O(n²)", space: "O(n)" },
  c:   `/* C implementation as a backtick string */`,
  cpp: `/* C++ implementation as a backtick string */`,
  viva: [
    { q: "Question one?", a: "Answer one." },
    { q: "Question two?", a: "Answer two." }
  ]
}
```

The sidebar, syllabus grid, and content section update automatically.

### Change the accent color

The whole site is themed via CSS custom properties in `styles.css`. Edit the `:root` block and every border, badge, button and code accent updates in one shot:

```css
:root {
  --orange:        #ff7a18;    /* primary accent */
  --orange-soft:   #ff9a4d;
  --orange-bright: #ffb347;
  --orange-glow:   rgba(255, 122, 24, 0.45);
}
```

Swap these for any other hue (`#22d3ee` cyan, `#a855f7` purple, `#22c55e` green, etc.) to retheme the whole UI.

### Tweak themes

Dark mode is the default. Light mode lives under `[data-theme="light"]`. To force one or the other, set `document.documentElement.setAttribute("data-theme", "light")` — or simply use the theme toggle in the top bar (it's persisted in `localStorage`).

---

## ✦ Responsive Breakpoints

| Width    | Behavior                                                                     |
| -------- | ---------------------------------------------------------------------------- |
| ≥ 980 px | Fixed sidebar + content grid                                                 |
| ≤ 980 px | Sidebar collapses to slide-in drawer with backdrop; topbar shows menu button |
| ≤ 560 px | Brand tagline hidden; tighter card padding; smaller code font                |
| ≤ 400 px | Syllabus drops to single column; hero CTA buttons stack vertically           |

---

## ✦ Keyboard / UX Niceties

- **Hash links** — every algorithm has a permanent anchor (`#algo-1`, `#algo-2`, …). Bookmarkable.
- **Search** — the sidebar input filters the algorithm list live.
- **Scroll-spy** — the sidebar highlights the algorithm currently in the viewport using `IntersectionObserver`.
- **Copy toast** — a 1.5 s pill notification confirms successful copy.

---

## ✦ Browser Support

Works in any modern Chromium, Firefox, or Safari (last 2 versions). The glass effect uses `backdrop-filter` which has full support in current evergreen browsers.

---

## ✦ Built By

**Monojit Karfa**
B.Tech CSE · Academy of Technology
Design & Analysis of Algorithm Lab — PCC-CS494

---

## ✦ License

This project is intended as study material for academic submissions. Feel free to clone, fork, and adapt for your own coursework.
