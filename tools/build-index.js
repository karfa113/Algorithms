#!/usr/bin/env node
/* Regenerates content/index.json — the list of topic folders the website loads.
 *
 *   node tools/build-index.js
 *
 * A topic is any folder named "NN-something" (e.g. 07-dfs) inside one of the
 * category folders listed in CATEGORIES below. The GitHub Action in
 * .github/workflows/content-index.yml runs this on every push, so you normally
 * never need to run it yourself.
 */
const fs = require("fs"), path = require("path");
const CONTENT = path.join(__dirname, "..", "content");
const CATEGORIES = ["data-structures", "algorithms"];   // must match config.js

const index = { generated: "auto — do not edit by hand; run tools/build-index.js", categories: {} };
for (const cat of CATEGORIES) {
  const dir = path.join(CONTENT, cat);
  if (!fs.existsSync(dir)) { index.categories[cat] = []; continue; }
  index.categories[cat] = fs.readdirSync(dir, { withFileTypes: true })
    .filter(d => d.isDirectory() && /^\d+-/.test(d.name) && fs.existsSync(path.join(dir, d.name, "info.md")))
    .map(d => d.name)
    .sort((a, b) => parseInt(a, 10) - parseInt(b, 10) || a.localeCompare(b));
}
fs.writeFileSync(path.join(CONTENT, "index.json"), JSON.stringify(index, null, 2) + "\n");
const counts = Object.entries(index.categories).map(([k, v]) => `${k}: ${v.length}`).join(", ");
console.log("content/index.json updated —", counts);
