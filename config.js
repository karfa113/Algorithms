/* ============================================================
   DSA Lab — site configuration  (the only file you normally edit)
   ============================================================ */
window.DSA_CONFIG = {

  /* ---- Where the lesson content lives --------------------------------
     The site fetches  content/…  straight from this GitHub repo, so a
     `git push` is all it takes to update a topic — no JSON, no rebuild.
       • On localhost it reads the local  content/  folder instead, so you
         can preview edits before pushing (add ?src=github to override).
       • If GitHub can't be reached it falls back to the files that are
         hosted next to the site (e.g. GitHub Pages).                      */
  repo: {
    owner:  "karfa113",
    name:   "Algorithms",
    branch: "main",
    path:   "content",
  },

  /* ---- Code-runner backend (backend/main.py, deployed on Render) ----- */
  backend: {
    local:  "ws://127.0.0.1:8765/ws/run",                    // used on localhost
    remote: "wss://algorithms-zph7.onrender.com/ws/run",     // used everywhere else
  },

  /* ---- Sections of the site.  `id` is also the folder name in content/.
          Order here = order in the sidebar.                              */
  categories: [
    { id: "data-structures", label: "Data Structures", short: "DS",
      blurb: "Arrays, lists, stacks, queues, trees, heaps, hashing and graphs — built from scratch.",
      icon: "layers" },
    { id: "algorithms",      label: "Algorithms",      short: "Algo",
      blurb: "Divide & conquer, greedy, dynamic programming, backtracking and graph algorithms.",
      icon: "route",
      course: "PCC-CS494" },
  ],

  /* ---- Languages.  `file` is the file name inside every topic folder.
          `monaco`-style ids are also what the backend expects.           */
  languages: [
    { id: "c",    label: "C",    file: "main.c"    },
    { id: "cpp",  label: "C++",  file: "main.cpp"  },
    { id: "java", label: "Java", file: "Main.java" },
  ],
};
