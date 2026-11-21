# Lessons

Durable lessons for this project, newest first. Only Chad's session edits this file. Lessons carried in from unghost and Beyond the Gates of Uruk on 2026-11-15 say where they came from.

- **2026-11-15: The gate relies on a deterministic build.** Upstream's `index.html` rebuilds byte for byte from `source/` (Node 22.23, esbuild 0.28.2). If a toolchain change ever breaks that, fix the determinism before trusting `checks/build.sh`, rather than loosening the comparison.
- **From unghost (RL1) and Uruk (historian brief): Argon Deep Research stalls on long prompts.** Keep each lane to about 7 KB or less, one lane per new chat, and split before running rather than after a stall.
- **From unghost: Argon reports embed one base64 PNG of 150–215 KB on a single line.** Read reports with `grep -v 'data:image'`, or that image is read as about 50k tokens of text.
- **From unghost: export through Google Docs, then File → Download → Markdown.** This keeps the claims tables intact. Copying from the chat view can flatten them.
- **From Uruk: grade evidence by its distance in time, not only by whether it exists.** State how far each piece of evidence is from the target moment. A text or image made centuries later is grade C, even when it is famous.
- **From Uruk and unghost: reports carry errors that only a check against the sources catches.** Nothing from a report is adopted until its claim is checked (`docs/research/verification/`).

## Work order 003, the measuring spike (2026-11-19)
- **Measure before the design is fixed.** One short order found that the later island costs twice the estimate, that the town's vertices carry no building number (the review and the order both said they did), and that showing less of the town is not cheaper.
- **A shader that may discard costs even when it discards nothing.** The GPU loses its own hidden-surface removal. Keep an opaque pipeline for when nothing is fading.
- **Timings on a Mac in use are good to about a millisecond.** Take the baseline in the same run, run the set more than once, and report the runs that disagree.
- **A prototype kept in files only the development build includes cannot change the released page**, and the gate proves it. The price is duplicated code, so its size overstates the real feature.
- **A direct `eval()` in any file stops the minifier shortening names in the whole page.** It inflated the first size readings by 5 kB.
- **Ask what a thing looks like from every view.** The cheapest fade, the lidded rise, came from seeing that the clipped rise looked hollow from above.
- **Put a choice to Chad as one small chooser, not a gallery** (Chad, 2026-11-20). Name each option in plain words, define it in a sentence, show options that combine in every combination he could pick, and put the cost and the drawback beside each. The spike published dozens of pictures and still had no number for one of the two pairings he was choosing between, the wave with the pixel dither.
- **When two options cost the same, say so.** The integrator's summary called the coverage dither the costliest. It and the pixel dither differ by less than the noise, and Chad had to ask.
- **Say what an effect shows and what it does not.** The wave spreads by distance from the excavated centre. Chad read it as showing how the site was excavated, which it does not. A viewer will take a good-looking effect as a claim about the past unless the page says otherwise, so each such effect is written down as a liberty.
- **Check what a browser can do before planning on it.** Asked to plan for headsets and augmented reality, a search found that WebXR cannot yet draw with WebGPU without flags, and that iPads have no WebXR at all. The plan starts from what works today.

## The architecture review (2026-11-19)
- **Check a statement about the engine against the source before it goes into a record.** A first draft of `docs/ARCHITECTURE.md` said the ground was one fixed mesh and proposed nested grids as an improvement. The ground has been nested grids over baked height maps since work order 001. The session was working from its memory of earlier work, not from the code; one `grep` showed the truth.
- **A project that publishes no source can still teach.** Voidstruck's repository holds only its built page, but its README says how it is made and where each kB goes. Read what the author chose to explain before reaching for the code.

## Research on Gemini Neon (2026-11-19)
- **A Deep Research run can hand back your own prompt.** Lane T3c's first "report" was 7 KB: the prompt, under the line "I have all the information to proceed for meta planning", with no link and no table row. Before saving a report, look for links and numbered rows. The Research Desk counts both.
- **Deep Research runs fail fairly often** (Chad). Plan for a lane to need a second run, and never let a build wait on a single one.
- **Neon finished the long X1 prompt** (9.5 KB, 12 sections) that was written to test Argon's limit. It passed on form (all 12 sections, 93 table rows) but was thinner than the Claude agent's report from the same prompt: 65 distinct claims against 91, and "could not verify" for much of the Levant, Cyprus and the calendars. The plant prompts were kept under 7 KB all the same.
- **A second report from a different researcher is worth having.** No source in Neon's X1 was made up, but it reversed one claim and used one superseded date; and it also turned up two points the first report and its check had passed over (O15).
- **A report belongs in the folder named after the model that wrote it** (`docs/research/neon/`). The first Neon reports were saved in `argon/` because the new folder had not yet been merged into Chad's checkout: merge the instructions before the work they describe is started.

## Work order 002 (2026-11-18)
- **A coordinate read by eye off a picture is not data.** The first outlines were typed in from crops of the plan and were wrong by 2–5 m in places, some by a whole grid square. Take geometry from the source by rule (here: the hull of the plan's own walls inside a marked region), and have the tool print what it measured.
- **A simplified plan gives wall fragments, not buildings.** Turning fragments into buildings is interpretation. Budget for it, and record which edges stand on a drawn wall and which are inferred.
- **A number can flatter.** A building's share of outline "on drawn walls" was high where it merely ran beside a neighbour's wall, and a cut building had its two parts' names the wrong way round. Both showed only in the printed table. Print what the tool decided, and read it.
- **Build the picture-taker on the first day of a visual order.** `tools/town/shot.mjs` drives `dev.html` in headless Chrome, takes a picture from any place and presses keys. It made each change visible in seconds and let walking be tested by script.
- **Every order adds text to the menu.** It overflowed the window and hid its own title. The menu now scrolls; look at it in a picture after every change to its text.
- **A worktree kept other sessions out of the commits**, as work order 001's lesson said it would. A Claude Code session inside a worktree refuses compound shell commands, so scripts go in the scratchpad and are run with one plain command.
- **Wikimedia Commons answered Node's HTTP/1.1 requests with 429 and HTTP/2 with 200.** `tools/town/fetch.mjs` uses `node:http2`.
- **Check a relayed instruction before acting on it.** A note about the T1c corrections reached the building session a day late; all of it had been done in work order 001. Checking took a minute and changed nothing.
- **Name a long-running session.** The integrator session was closed by mistake and could not be told apart from the others afterwards, so the building session did the integration again.

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
