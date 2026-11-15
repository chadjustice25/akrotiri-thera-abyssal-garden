# Lessons

Durable lessons for this project, newest first. Only Chad's session edits this file. Lessons carried in from unghost and Beyond the Gates of Uruk on 2026-11-15 say where they came from.

- **2026-11-15: The gate relies on a deterministic build.** Upstream's `index.html` rebuilds byte for byte from `source/` (Node 22.23, esbuild 0.28.2). If a toolchain change ever breaks that, fix the determinism before trusting `checks/build.sh`, rather than loosening the comparison.
- **From unghost (RL1) and Uruk (historian brief): Argon Deep Research stalls on long prompts.** Keep each lane to about 7 KB or less, one lane per new chat, and split before running rather than after a stall.
- **From unghost: Argon reports embed one base64 PNG of 150–215 KB on a single line.** Read reports with `grep -v 'data:image'`, or that image is read as about 50k tokens of text.
- **From unghost: export through Google Docs, then File → Download → Markdown.** This keeps the claims tables intact. Copying from the chat view can flatten them.
- **From Uruk: grade evidence by its distance in time, not only by whether it exists.** State how far each piece of evidence is from the target moment. A text or image made centuries later is grade C, even when it is famous.
- **From Uruk and unghost: reports carry errors that only a check against the sources catches.** Nothing from a report is adopted until its claim is checked (`docs/research/verification/`).
