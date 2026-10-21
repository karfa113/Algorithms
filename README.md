<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=0%3A0a0a0a%2C100%3Aff7a18&height=220&section=header&text=DSA%20Lab&fontSize=70&fontColor=ffffff&fontAlignY=38&desc=Data%20Structures%20%26%20Algorithms%20%C2%B7%20C%20%C2%B7%20C%2B%2B%20%C2%B7%20Java&descSize=18&descAlignY=60&animation=fadeIn" alt="DSA Lab banner" />

<p>
  <img src="https://img.shields.io/badge/Data%20Structures-16-FF7A18?style=for-the-badge" alt="16 data structures" />
  <img src="https://img.shields.io/badge/Algorithms-20-FF7A18?style=for-the-badge" alt="20 algorithms" />
  <img src="https://img.shields.io/badge/Languages-C%20%7C%20C%2B%2B%20%7C%20Java-00599C?style=for-the-badge" alt="C, C++, Java" />
</p>

</div>

## ✦ About

**DSA Lab** is a single-page study site for the Data Structures and Algorithms lab at Academy of Technology. Every topic has the concept, step-by-step algorithm, complexity, **runnable C, C++ and Java code**, and viva questions. Code is editable in the page and executes on a small compile-and-run backend; the 20 algorithms also have step-by-step visualizers.

The site is static (no build step). All lesson content lives as **plain files in `content/`** and the website **fetches it live from this GitHub repo** — push a change and the site shows it.

## ✦ What's inside

| Section | Topics |
| --- | --- |
| **Data Structures** (16) | Array · Stack (array) · Circular Queue · Singly / Doubly / Circular Linked List · Stack & Queue (linked list) · Infix→Postfix · Priority Queue (Heap) · BST · AVL · Hash Table · Graph Representation · Trie · Disjoint Set (DSU) |
| **Algorithms** (20) | Binary Search · Merge / Quick / Heap Sort · Max-Min · BFS · DFS · Fractional Knapsack · Job Sequencing · Kruskal · Prim · Dijkstra · Bellman-Ford · Floyd-Warshall · Matrix Chain · N-Queen · M-Coloring · Hamiltonian Cycle · Ford-Fulkerson · TSP (Branch & Bound) |

Data structures got their own section rather than being mixed into the algorithm list: they are menu-driven programs with many operations, while algorithms are single procedures — and each section keeps its own numbering, sidebar list and progress.

### Site features

- Home, section and topic pages with deep links (`#/data-structures/04-singly-linked-list`)
- **C / C++ / Java tabs** (your last choice is remembered), syntax highlighting, editable code with Reset
- Interactive terminal: compile, run, type input; **Sample input** button feeds the example
- Edits are kept only in the open tab — **a refresh brings back the original**
- Sidebar search across both sections (press `/`), progress tracking (“Mark done”, stored in your browser)
- Prev / next navigation, dark / light theme, fully responsive
- “Improve this explanation” and “View source on GitHub” links on every topic

## ✦ Project structure

```
.
├── index.html · viz.html       pages
├── config.js                   ← repo, backend URL, categories, languages
├── content.js                  loads + parses content from GitHub (or local files)
├── script.js                   UI: routing, topic pages, editor, terminal
├── runner.js                   WebSocket client for the backend
├── visualizer.js               algorithm visualizers (keyed by algorithm number)
├── styles.css
├── content/                    ← ALL lesson content (edit these)
│   ├── index.json              topic list (auto-generated)
│   ├── data-structures/NN-name/   info.md  main.c  main.cpp  Main.java  sample.in
│   └── algorithms/NN-name/        info.md  main.c  main.cpp  Main.java  sample.in
├── backend/                    FastAPI + WebSocket runner (gcc, g++, JDK) — deploy on Render
├── tools/
│   ├── validate.py             compile + run + compare every program
│   └── build-index.js          regenerate content/index.json
└── .github/workflows/content.yml   CI: validate, then refresh index.json
```

## ✦ Editing and adding content (no JSON!)

Code lives in real source files, so there is nothing to escape. See **[`content/README.md`](content/README.md)** for the full format. In short:

```bash
cp -r content/algorithms/05-heap-sort content/algorithms/21-my-topic   # copy a topic
# edit info.md, main.c, main.cpp, Main.java, sample.in
python tools/validate.py content/algorithms/21-my-topic --compare      # check it
git add . && git commit -m "Add my topic" && git push                  # done
```

On push, the GitHub Action validates all programs and refreshes `content/index.json`; the site then shows the new topic. (raw.githubusercontent.com caches files for ~5 minutes, so a change can take a few minutes to appear.)

Editing a single file — fixing a typo or a bug in `Main.java` — is just a normal commit, or use the pencil icon on GitHub.

## ✦ How the site finds its content

`config.js → repo` points at `karfa113/Algorithms`, branch `main`. The page fetches `content/index.json` and each topic's files from `raw.githubusercontent.com` (CORS-enabled, no API key, no rate-limit problems).

| Where the site runs | Reads content from |
| --- | --- |
| GitHub Pages / any host | GitHub first, then the files hosted next to the site |
| `localhost` | the local `content/` folder (preview before you push); add `?src=github` to read GitHub instead |

If you rename the repo or branch, change `repo` in `config.js`.

## ✦ Running locally

```bash
python -m http.server 8080          # site → http://localhost:8080
cd backend && ./run.sh              # runner → ws://127.0.0.1:8765 (needs gcc, g++, JDK)
```

On Windows use `backend\run.bat`. `config.js` already points localhost at `ws://127.0.0.1:8765/ws/run`.

## ✦ Deploying

- **Site:** GitHub Pages (Settings → Pages → deploy from `main`, root).
- **Backend:** Render, via `render.yaml` (Docker). The image installs `gcc`, `g++` and a headless JDK. After deploying, put the service URL in `config.js → backend.remote`. See [`backend/README.md`](backend/README.md) for the protocol, limits and tests.

## ✦ Credits

Built by **Monojit Karfa** · Academy of Technology.
