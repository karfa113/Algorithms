#!/usr/bin/env python3
"""
DSA Lab content validator.

Checks every topic folder under content/ :
  * info.md has the required front-matter + sections (lint)
  * main.c, main.cpp and Main.java compile
  * each program runs against sample.in (if present) without crashing/timeouts
  * (--compare) all languages print the same thing, ignoring whitespace

Usage:
  python tools/validate.py                      # everything under content/
  python tools/validate.py content/algorithms/05-heap-sort
  python tools/validate.py content/data-structures --compare
  python tools/validate.py --lang java --compare content/data-structures/03-*

Needs gcc, g++, and a JDK (javac + java) on PATH.
Exit code is 1 if anything fails, so it works as a CI check.
"""
import argparse, os, re, shutil, subprocess, sys, tempfile
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
CONTENT = ROOT / "content"

LANGS = {
    "c":    {"file": "main.c",    "label": "C"},
    "cpp":  {"file": "main.cpp",  "label": "C++"},
    "java": {"file": "Main.java", "label": "Java"},
}

def sh(cmd, cwd=None, stdin=None, timeout=30):
    try:
        p = subprocess.run(cmd, cwd=cwd, input=stdin, capture_output=True, text=True,
                           timeout=timeout, errors="replace")
        return p.returncode, p.stdout, p.stderr
    except subprocess.TimeoutExpired as e:
        return 124, (e.stdout or "") if isinstance(e.stdout, str) else "", "TIMEOUT"

def java_main_class(code):
    m = re.search(r"public\s+(?:final\s+|abstract\s+)*class\s+(\w+)", code)
    if m: return m.group(1)
    for m in re.finditer(r"\bclass\s+(\w+)", code):
        body = code[m.end():]
        if re.search(r"static\s+void\s+main\s*\(", body): return m.group(1)
    return "Main"

# ---------------------------------------------------------------- lint
def lint_info(path: Path):
    errs = []
    t = path.read_text(encoding="utf-8")
    m = re.match(r"---\n(.*?)\n---\n", t, re.S)
    if not m:
        return ["info.md: missing --- front matter ---"]
    fm = dict(l.split(":", 1) for l in m.group(1).splitlines() if ":" in l)
    for k in ("title", "short", "tags"):
        if not fm.get(k, "").strip(): errs.append(f"info.md: front matter '{k}' missing")
    body = t[m.end():]
    secs = re.findall(r"^## (.+)$", body, re.M)
    names = [s.strip() for s in secs]
    for need in ("Concept", "Complexity", "Viva"):
        if need not in names:
            errs.append(f"info.md: missing '## {need}' section")
    if "Algorithm" not in names and "Operations" not in names:
        errs.append("info.md: needs a '## Algorithm' (or '## Operations') section")
    viva = len(re.findall(r"^### ", body, re.M))
    if viva < 5: errs.append(f"info.md: only {viva} viva questions (want 5+)")
    cx = re.search(r"^## Complexity\n(.*?)(?=^## |\Z)", body, re.M | re.S)
    if cx and not re.search(r"^- [^:]+: .+", cx.group(1), re.M):
        errs.append("info.md: Complexity needs bullets like '- Best: O(1)'")
    return errs

# ---------------------------------------------------------------- build + run
def build_and_run(topic: Path, lang: str, timeout: int):
    """returns (status, detail, stdout)  status in ok|missing|compile|runtime|timeout"""
    f = topic / LANGS[lang]["file"]
    if not f.exists(): return "missing", "", ""
    tmp = Path(tempfile.mkdtemp(prefix="dsa_val_"))
    try:
        if lang == "c":
            rc, _, err = sh(["gcc", str(f), "-o", str(tmp / "a.out"), "-O0", "-w", "-std=c11", "-lm"], timeout=60)
            run = [str(tmp / "a.out")]
        elif lang == "cpp":
            rc, _, err = sh(["g++", str(f), "-o", str(tmp / "a.out"), "-O0", "-w", "-std=c++17", "-lm"], timeout=60)
            run = [str(tmp / "a.out")]
        else:
            code = f.read_text(encoding="utf-8")
            cls = java_main_class(code)
            (tmp / f"{cls}.java").write_text(code, encoding="utf-8")
            rc, _, err = sh(["javac", "-nowarn", "-d", str(tmp), str(tmp / f"{cls}.java")], timeout=90)
            run = ["java", "-Xss16m", "-cp", str(tmp), cls]
        if rc != 0: return "compile", err.strip()[:800], ""
        sample = topic / "sample.in"
        stdin = sample.read_text(encoding="utf-8") if sample.exists() else ""
        rc, out, err = sh(run, cwd=tmp, stdin=stdin, timeout=timeout)
        if rc == 124: return "timeout", f"no exit within {timeout}s", out
        if rc != 0: return "runtime", f"exit {rc}: {err.strip()[:500]}", out
        return "ok", "", out
    finally:
        shutil.rmtree(tmp, ignore_errors=True)

def norm(s): return re.sub(r"\s+", " ", s).strip()

def check_topic(topic: Path, langs, compare, timeout):
    problems, notes, outs = [], [], {}
    problems += lint_info(topic / "info.md") if (topic / "info.md").exists() else ["info.md missing"]
    if not (topic / "sample.in").exists():
        notes.append("no sample.in (programs compiled but not run with input)")
    for lg in langs:
        st, detail, out = build_and_run(topic, lg, timeout)
        if st == "missing": problems.append(f"{LANGS[lg]['file']} missing")
        elif st != "ok":    problems.append(f"{LANGS[lg]['label']} {st}: {detail}")
        else:               outs[lg] = out
    if compare and len(outs) > 1:
        ref_lang = next(iter(outs)); ref = norm(outs[ref_lang])
        for lg, o in outs.items():
            if norm(o) != ref:
                problems.append(f"output of {LANGS[lg]['label']} differs from {LANGS[ref_lang]['label']}\n"
                                f"      {LANGS[ref_lang]['label']}: {ref[:200]!r}\n      {LANGS[lg]['label']}: {norm(o)[:200]!r}")
    return topic, problems, notes

def find_topics(paths):
    out = []
    for p in paths:
        p = Path(p)
        if (p / "info.md").exists() or any((p / v["file"]).exists() for v in LANGS.values()):
            out.append(p)
        elif p.is_dir():
            out += sorted(d for d in p.iterdir() if d.is_dir() and re.match(r"\d+-", d.name))
    seen, res = set(), []
    for t in out:
        if t not in seen: seen.add(t); res.append(t)
    return res

def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("paths", nargs="*", help="topic folders or category folders (default: all of content/)")
    ap.add_argument("--lang", default="c,cpp,java", help="comma list (default c,cpp,java)")
    ap.add_argument("--compare", action="store_true", help="require identical output across languages")
    ap.add_argument("--timeout", type=int, default=10, help="seconds per program run (default 10)")
    ap.add_argument("-j", "--jobs", type=int, default=4)
    a = ap.parse_args()
    langs = [l.strip() for l in a.lang.split(",") if l.strip()]
    for l in langs:
        if l not in LANGS: sys.exit(f"unknown language {l!r}")
    paths = a.paths or [CONTENT / "data-structures", CONTENT / "algorithms"]
    topics = find_topics(paths)
    if not topics: sys.exit("no topic folders found")
    bad = 0
    with ThreadPoolExecutor(a.jobs) as ex:
        for topic, problems, notes in ex.map(lambda t: check_topic(t, langs, a.compare, a.timeout), topics):
            name = f"{topic.parent.name}/{topic.name}"
            if problems:
                bad += 1
                print(f"FAIL  {name}")
                for p in problems: print("   -", p)
            else:
                print(f"ok    {name}" + (f"   ({'; '.join(notes)})" if notes else ""))
    print(f"\n{len(topics) - bad}/{len(topics)} topics passed")
    sys.exit(1 if bad else 0)

if __name__ == "__main__":
    main()
