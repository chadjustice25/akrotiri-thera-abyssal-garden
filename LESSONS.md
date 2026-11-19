# Lessons

Durable lessons for this project, newest first. Only Chad's session edits this file. Lessons carried in from unghost and Beyond the Gates of Uruk on 2026-11-15 say where they came from.

- **2026-11-15: The gate relies on a deterministic build.** Upstream's `index.html` rebuilds byte for byte from `source/` (Node 22.23, esbuild 0.28.2). If a toolchain change ever breaks that, fix the determinism before trusting `checks/build.sh`, rather than loosening the comparison.
- **From unghost (RL1) and Uruk (historian brief): Argon Deep Research stalls on long prompts.** Keep each lane to about 7 KB or less, one lane per new chat, and split before running rather than after a stall.
- **From unghost: Argon reports embed one base64 PNG of 150–215 KB on a single line.** Read reports with `grep -v 'data:image'`, or that image is read as about 50k tokens of text.
- **From unghost: export through Google Docs, then File → Download → Markdown.** This keeps the claims tables intact. Copying from the chat view can flatten them.
- **From Uruk: grade evidence by its distance in time, not only by whether it exists.** State how far each piece of evidence is from the target moment. A text or image made centuries later is grade C, even when it is famous.
- **From Uruk and unghost: reports carry errors that only a check against the sources catches.** Nothing from a report is adopted until its claim is checked (`docs/research/verification/`).

## Work order 001 (2026-11-18)
- **Stage by path, never `git add -A`.** The integrator session and its research agents wrote into the same checkout while the worker built. One `git add -A` swept two of their files into the worker's commit, and it had to be redone. Give a worker its own worktree, or have it add only the paths its order owns.
- **A work order's Result section sat in a path the order forbade** (`docs/tasks/`), so the worker could only give the Result in its report. The harness means it that way: lint refuses an order that owns its own file (`owns-spec`), so that no worker can change its gate. Say in each order that the Result comes back in the final report and the integrator pastes it in.
- **Keeping every figure as a parameter paid off.** The T1c check landed in the middle of the build, and its corrections went into `tools/terrain/edits.json` without a change to the method.
- **The build strips comments, so a licence notice in a source file never reaches `index.html`.** Notices that must travel with the page go in the menu text. Copy them character for character from the checked source: the first pass wrote "(c)" for "©" and reworded a sentence.
- **Tell the range a source gives from the measure behind it.** E4's volume fits T1#14's range by one measure (against today's surface) and misses it by another (above sea level only), and the abstract does not say which it used.
- **Shader text is squeezed by the build.** Write no `- -` in WGSL, and take every texture sample before a branch on a varying. Chrome reports both only when the page runs, which the gate does not do, so run the views check after any shader change.
- **Headless Chrome will not go narrower than 500 px**, so a phone-width look at the menu needs a real device or device emulation.

## Rendering checks (2026-11-16)
- Headless Chrome 157 on this Mac (`--headless=new`, no GPU flags) gives the real Apple `metal-3` WebGPU adapter with timestamp queries. The Chromium doc says headless needs `--enable-gpu` for hardware rendering; on macOS it did not. `checks/views.mjs` fails if it ever gets a software fallback, so a change in Chrome shows up.
- `navigator.gpu` is missing on `about:blank` (not a secure context). Serve the page from `http://127.0.0.1`.
- `Page.captureScreenshot` captures the WebGPU canvas correctly on macOS. Reports say Linux and Windows headless capture black, so check each picture's pixel spread rather than trusting a screenshot that "succeeded".

## Research agents (2026-11-18)
- Running each lane as its own named Claude agent worked. All nine reports came back complete, and the separate checks found no invented sources. Every check found real corrections: misread numbers, grades set too high, and the wrong scholar credited. Checking with a separate agent is worth what it costs.
- **A verification agent saved 30 downloaded PDFs and text copies (about 54 MB) into `docs/research/claude/`, and a commit picked them up.** They were caught before the push. `.gitignore` now ignores PDFs and `.txt` files under `docs/research/`. Every research or check prompt must say: "Save downloads only in your scratchpad, never in the repo."
