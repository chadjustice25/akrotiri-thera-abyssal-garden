# Akrotiri–Thera: rules for every agent

This file is the single rulebook for every agent and model working in this repository. `CLAUDE.md` and `GEMINI.md` only import it, so edit this file and never those.

## 1. What this is
A fork of Noniv's [Abyssal Garden](https://github.com/Noniv/abyssal-garden) (MIT: a procedural WebGPU underwater world in one HTML file), being turned into an archaeologically and historically grounded reconstruction of the island of **Thera and its Bronze Age town at Akrotiri, c. 1650 BCE (give or take 100–150 years), just before the Late Bronze Age eruption.** Thera is the proof of concept. The same world clock and evidence rules will later carry other places at the same moment: Crete, Egypt, Byblos and beyond.

## 2. Startup sequence (every session)
1. Read `HANDOFF.md` (where things stand, what is next), then `LESSONS.md`.
2. Read `docs/HISTORICAL_STANDARD.md` before writing anything a viewer will see, or any data about the past.
3. Read `docs/DECISIONS.md`. Do not re-open a decision; propose a new one that amends it.
4. If you were given a work order (`docs/tasks/NNN-*.md`), read it next. It says which paths you may change and when you are done.
5. Before changing engine code, read the upstream guide to the source (`README.md`, "Make it your own") and the files you will change.

## 3. Ownership and git
- **Chad is the integrator.** His Claude Code session is the only one that edits `HANDOFF.md`, `LESSONS.md` and `docs/DECISIONS.md`, and only Chad merges into `main`.
- **Pushes and any change of the repository's visibility are Chad's own actions** (unghost D99): a session prepares the exact command and Chad runs it. **The fork is public: anything pushed is published.**
- `upstream` is `Noniv/abyssal-garden`. Upstream changes come in by merge, never by rewriting history. Keep upstream's `LICENSE` and its copyright line.
- Reference images in `akrotiri-frescoes-sources/` stay out of git (D6).

## 4. The historical laws (full text: `docs/HISTORICAL_STANDARD.md`)
1. **Evidence first.** Nothing about the past goes into the world, its data or its text without a verified source and a grade (A, B or C).
2. **Shown is not present.** Something painted in a Theran wall painting is at most grade B for Thera until it is found there.
3. **One world clock.** Every date names its chronology and fits `docs/WORLD_CLOCK.md` (written from research lanes W1 and W2).
4. **Never invent an ancient word or name.** Linear A is undeciphered.
5. **Every liberty is written down** in the liberties table of the standard, with its reason.
6. **A research report is not evidence** until its claims are checked against their sources (`docs/research/verification/`).

## 5. The engine laws (inherited from upstream; kept unless a decision amends them)
1. WebGPU, with no game engine or 3D library.
2. Everything procedural: no image, model or sound files. The deliverable is one self-contained `index.html`, built from `source/`.
3. No per-frame JavaScript allocations: preallocate buffers.
4. When they conflict: visual quality first, then stable frame pacing, then file size (upstream `prompt.txt`).
5. `index.html` is always a fresh build of `source/`: edit `source/src/*`, run `cd source && npm run build`, and commit both.

## 6. Checks
- **The gate is `checks/build.sh`** (also `cd source && npm run check`). It builds `source/` in a scratch folder, requires the committed `index.html` to match byte for byte, checks the size budget, and refuses anything loaded at run time. Exit 0 PASS, 1 FAIL, 3 ERROR; the last line is the result. Run it before every commit that touches `source/` or `index.html`.
- WebGPU rendering is not checked automatically yet. Visual changes are verified by looking in Chrome or Edge. Say so in a report; never report a visual pass you did not see.

## 7. Research
- Deep Research runs on **Gemini 4 Argon** (Chad's Google plan) from prompts in `docs/research/prompts/`. Reports land in `docs/research/argon/`. `docs/research/README.md` has the steps.
- Argon reports embed a large base64 image on one line: read them with `grep -v 'data:image'`.
- Claude checks the key claims against their sources and writes `docs/research/verification/<lane>.md` before anything is adopted. Adopted claims enter the data with their lane and claim number (e.g. `T2#14`).
- New research lanes for other places start from `docs/research/prompts/TEMPLATE-site.md`, so every site is graded and reported the same way.

## 8. Harness
This project uses the unghost harness (`~/Developer/agent-lab/unghost/harness/bin/harness`, Python 3.11+, run with `--root` or from inside this checkout): `.harness/project.json`, work orders in `docs/tasks/` (unghost `docs/harness/CONTRACTS.md` §1), and `checks/build.sh` as the gate. It sits outside unghost's D97/D107 pilot order by Chad's choice (D5), so it uses only what the harness already has and asks for no new harness machinery.

## 9. Layout
| Path | What |
|---|---|
| `index.html` | The built page. Never edit by hand. |
| `source/` | The engine source, in upstream's layout (`README.md`, "Make it your own"). |
| `checks/` | Gates. |
| `docs/HISTORICAL_STANDARD.md` | Evidence rules for every site. |
| `docs/DECISIONS.md` | Numbered decisions and open questions. |
| `docs/research/` | Argon prompts, reports and verifications. |
| `docs/tasks/` | Work orders. |
| `.harness/` | Harness config and evidence logs. |
| `akrotiri-frescoes-sources/` | Local reference images, ignored by git. |
