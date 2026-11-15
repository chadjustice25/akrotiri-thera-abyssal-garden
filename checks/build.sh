#!/usr/bin/env bash
# Gate "build" (docs/DECISIONS.md D7): the checkout in the current directory builds, its
# committed index.html is exactly what source/ builds, the page loads nothing at run time,
# and it stays under the size budget.
#
# Exit codes and result line follow the harness gate contract (unghost
# docs/harness/CONTRACTS.md section 2): 0 PASS, 1 FAIL, 3 ERROR (the setup is broken, so
# the work is not judged); the last line printed is "PASS|FAIL|ERROR build: <text>".
# `harness gate` runs this with the task's worktree as the working directory; run by hand,
# it checks the checkout you are in (`cd source && npm run check` does the same).
set -u
NAME=build
BUDGET_KB="${BUILD_BUDGET_KB:-256}"   # provisional budget, DECISIONS.md D7

err()  { echo "ERROR $NAME: $*"; exit 3; }
fail() { echo "FAIL $NAME: $*"; exit 1; }

command -v node >/dev/null 2>&1 || err "node is not on PATH"
command -v git  >/dev/null 2>&1 || err "git is not on PATH"
tree="$(git -C "$PWD" rev-parse --show-toplevel 2>/dev/null)" || err "$PWD is not inside a git checkout"
[ -f "$tree/source/build.mjs" ] || err "$tree has no source/build.mjs"
[ -f "$tree/index.html" ]       || fail "index.html is missing: run (cd source && npm run build)"
mods="$tree/source/node_modules"
[ -d "$mods/esbuild" ] || err "esbuild is not installed in $tree/source: run (cd source && npm ci)"

tmp="$(mktemp -d)" || err "mktemp failed"
trap 'rm -rf "$tmp"' EXIT
mkdir "$tmp/source"
cp -R "$tree/source/src" "$tree/source/build.mjs" "$tree/source/template.html" "$tree/source/package.json" "$tmp/source/" \
  || err "could not copy source/ to a scratch folder"
ln -s "$mods" "$tmp/source/node_modules"

if ! (cd "$tmp/source" && node build.mjs >"$tmp/build.log" 2>&1); then
  tail -n 20 "$tmp/build.log" | sed 's/^/  /'
  fail "the build failed (output above)"
fi
[ -f "$tmp/index.html" ] || err "the build reported success but wrote no index.html"

if ! cmp -s "$tmp/index.html" "$tree/index.html"; then
  fail "index.html is not what source/ builds: run (cd source && npm run build) and commit both"
fi

bytes=$(wc -c <"$tree/index.html" | tr -d ' ')
kb=$(( (bytes + 1023) / 1024 ))
[ "$kb" -le "$BUDGET_KB" ] || fail "index.html is ${kb} kB, over the ${BUDGET_KB} kB budget"

hits="$(grep -n -o -E '<script[^>]+src=|<link[^>]+stylesheet|fetch\(|import\(|new Worker\(|XMLHttpRequest|<img[^>]+src="?https?:' "$tree/index.html" | head -n 5)"
if [ -n "$hits" ]; then
  echo "$hits" | sed 's/^/  /'
  fail "index.html loads something at run time; everything must be inline and procedural"
fi

echo "PASS $NAME: index.html matches a fresh build of source/, ${kb} kB of a ${BUDGET_KB} kB budget, nothing loaded at run time"
