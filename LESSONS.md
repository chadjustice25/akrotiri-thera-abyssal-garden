# Lessons

Durable lessons for this project, newest first. Only Chad's session edits this file. Lessons carried in from unghost and Beyond the Gates of Uruk on 2026-11-15 say where they came from.

- **2026-11-15: The gate relies on a deterministic build.** Upstream's `index.html` rebuilds byte for byte from `source/` (Node 22.23, esbuild 0.28.2). If a toolchain change ever breaks that, fix the determinism before trusting `checks/build.sh`, rather than loosening the comparison.
- **From unghost (RL1) and Uruk (historian brief): Argon Deep Research stalls on long prompts.** Keep each lane to about 7 KB or less, one lane per new chat, and split before running rather than after a stall.
- **From unghost: Argon reports embed one base64 PNG of 150–215 KB on a single line.** Read reports with `grep -v 'data:image'`, or that image is read as about 50k tokens of text.
- **From unghost: export through Google Docs, then File → Download → Markdown.** This keeps the claims tables intact. Copying from the chat view can flatten them.
- **From Uruk: grade evidence by its distance in time, not only by whether it exists.** State how far each piece of evidence is from the target moment. A text or image made centuries later is grade C, even when it is famous.
- **From Uruk and unghost: reports carry errors that only a check against the sources catches.** Nothing from a report is adopted until its claim is checked (`docs/research/verification/`).

## Rendering checks (2026-11-16)
- Headless Chrome 157 on this Mac (`--headless=new`, no GPU flags) gives the real Apple `metal-3` WebGPU adapter with timestamp queries. The Chromium doc says headless needs `--enable-gpu` for hardware rendering; on macOS it did not. `checks/views.mjs` fails if it ever gets a software fallback, so a change in Chrome shows up.
- `navigator.gpu` is missing on `about:blank` (not a secure context). Serve the page from `http://127.0.0.1`.
- `Page.captureScreenshot` captures the WebGPU canvas correctly on macOS. Reports say Linux and Windows headless capture black, so check each picture's pixel spread rather than trusting a screenshot that "succeeded".

## Research agents (2026-11-18)
- Running each lane as its own named Claude agent worked. All nine reports came back complete, and the separate checks found no invented sources. Every check found real corrections: misread numbers, grades set too high, and the wrong scholar credited. Checking with a separate agent is worth what it costs.
- **A verification agent saved 30 downloaded PDFs and text copies (about 54 MB) into `docs/research/claude/`, and a commit picked them up.** They were caught before the push. `.gitignore` now ignores PDFs and `.txt` files under `docs/research/`. Every research or check prompt must say: "Save downloads only in your scratchpad, never in the repo."
