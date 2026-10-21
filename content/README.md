# Content guide — how to add or edit a topic

Everything the website shows lives in this folder as **plain files**: no JSON to
escape, no quotes to worry about. Push to GitHub and the site picks it up.

```
content/
├── index.json                  ← list of topics (auto-generated, don't edit)
├── data-structures/
│   └── 04-singly-linked-list/
│       ├── info.md             ← title, concept, steps, complexity, viva
│       ├── main.c              ← C program
│       ├── main.cpp            ← C++ program
│       ├── Main.java           ← Java program
│       └── sample.in           ← (optional) example input for the terminal
└── algorithms/
    └── 05-heap-sort/ …
```

* A **topic** is a folder called `NN-short-name` (`NN` = its position in the list).
* The category (Data Structures / Algorithms) is the folder it sits in.
* Any language file can be missing — that tab shows “not available yet”.
* **Never** paste code into `info.md`; code goes in its own source file.

## Adding a new topic

1. Copy an existing folder, rename it (`21-my-topic`), edit the files.
2. `python tools/validate.py content/algorithms/21-my-topic --compare`
   (compiles all three languages, runs `sample.in`, checks the outputs match).
3. `git add . && git commit && git push` — the GitHub Action regenerates
   `index.json`. (Locally you can run `node tools/build-index.js` yourself.)

## `info.md` format

```markdown
---
title: Binary Search (Recursive)        # full name, shown as the heading
short: Binary Search                    # name used in the sidebar
tags: Divide & Conquer, Search          # comma separated
visualizer: true                        # only algorithms that have a visualizer
---

## Concept

One or more paragraphs. Inline formatting: **bold**, *italic*, `code`.

## Algorithm

1. **Step 1:** Start.
2. **Step 2:** Read the array `arr[]` …
    - **(a)** sub-steps are indented by four spaces
    - **(b)** …

## Complexity

- Best: O(1)
- Average: O(log n)
- Worst: O(log n)
- Space: O(log n)

## Viva

### What is the precondition for binary search?

The array must be sorted. Answers can use **bold** and `code` too.

### Next question?

Next answer.
```

Rules the site relies on:

| Part | Rule |
| --- | --- |
| Front matter | Between two `---` lines, `key: value` per line. `title`, `short`, `tags` are required. |
| Sections | Start with `## Name`. `Concept`, `Complexity`, `Viva` and one of `Algorithm` / `Operations` are required. Extra sections (e.g. `## Applications`) are shown too. |
| Lists | `1.` numbered or `-` bullet lists; indent 4 spaces for a nested level. |
| Complexity | Bullets of the form `- Label: value`. Algorithms use Best / Average / Worst / Space; data structures can use any labels (`- Push: O(1)`). |
| Viva | Each question is a `### ` heading; everything below it, up to the next `###`, is the answer. Aim for 5–8. |

## Program conventions (all three languages)

* **Interactive console programs.** Print a prompt (`Enter n: `), then read
  with `scanf` / `cin` / `Scanner`. Data-structure programs are **menu driven**
  (`1. Push  2. Pop … 0. Exit`) and loop until the user picks Exit.
* **Same behaviour in every language** — same prompts, same wording, same
  output format — so a student can compare the three side by side.
* **C** (`main.c`) compiles with `gcc -std=c11 -lm`; **C++** (`main.cpp`) with
  `g++ -std=c++17`; **Java** (`Main.java`) runs on JDK 17+. Java programs use a
  `public class Main` and `java.util.Scanner` for input — no packages, no
  third-party libraries, one file.
* Keep programs short and readable; comment the non-obvious lines.
* `sample.in` holds the exact text a user would type, one token per line or
  space-separated. The *Sample input* button in the terminal feeds it to the
  program, and `tools/validate.py` uses it to check every program in CI. It
  must make the program **terminate by itself** (for menu programs, end with
  the Exit option).

## Previewing locally

```bash
python -m http.server 8080        # from the repository root
# open http://localhost:8080  — on localhost the site reads content/ from disk,
# so you see your edits before pushing. Add ?src=github to read from GitHub instead.
```
