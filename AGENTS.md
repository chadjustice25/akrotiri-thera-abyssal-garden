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
2. Everything procedural: no image, model or sound files. The deliverable is one self-contained `index.html`, built from `source/`. Since D48 one helper file that holds no part of the world may sit beside it, to keep the page on a device for use without a connection; `index.html` must still run by itself. No such file exists yet, and the gate refuses one until the order that builds it changes the gate.
3. No per-frame JavaScript allocations: preallocate buffers.
4. When they conflict: visual quality first, then stable frame pacing, then file size (upstream `prompt.txt`).
5. `index.html` is always a fresh build of `source/`: edit `source/src/*`, run `cd source && npm run build`, and commit both.

## 6. Checks
- **The gate is `checks/build.sh`** (also `cd source && npm run check`). It builds `source/` in a scratch folder, requires the committed `index.html` to match byte for byte, checks the size budget, and refuses anything loaded at run time. Exit 0 PASS, 1 FAIL, 3 ERROR; the last line is the result. Run it before every commit that touches `source/` or `index.html`.
- **The views check is `checks/views.mjs`** (also `cd source && npm run views`, Mac only). It opens the page in headless Chrome on the Mac's real GPU, presses the button that enters the world (it reads "Enter 1628 BCE" since work order 006, and "Dive in" before) and the viewpoint keys (1–6, or 1–N with `--views N`, up to 9: D20), and saves a JPEG of each viewpoint. **The page has nine viewpoints since work order 002, so run it with `--views 9`**, as `npm run views` does; without it the check fails on the menu's count. It saves each JPEG with its stats line in `.harness/views/<time>/` and `.harness/views/latest/` (both ignored by git). It PASSes when the page starts on a hardware adapter, logs no error, loads nothing at run time, every picture has content, the menu lists as many viewpoints as the run was asked for, and every key changed the picture. With `--min-fps N --min-scale P` it also FAILs a view that runs below N fps or below P% render resolution (after a warm-up pass); upstream passes at `--min-fps 55 --min-scale 60`, the floor for visual work orders. Run it after every change that affects what the world looks like, then publish `.harness/views/latest/index.html` with its JPEGs to the **Thera Views** artifact (<https://claude.ai/artifact/EAM2iAgZHr4toJ39qt9C9L>) so Chad can look from the iPad.
- A views PASS proves the page rendered. It does not prove the picture is right. Say who looked at the pictures: an agent's look is not Chad's, and never report a visual pass nobody saw.

## 7. Research
- Deep Research runs on **Gemini Neon** (Chad's Google plan; it replaced Gemini 4 Argon on 2026-11-19, D30) from prompts in `docs/research/prompts/`. Reports land in `docs/research/neon/`; a lane run by a Claude agent (D13) lands in `docs/research/claude/`. `docs/research/README.md` has the steps.
- Every Gemini Deep Research prompt ends with a **Delivery** section (D35). It asks Gemini to save the report to the Google Drive folder `Thera Research` as `<lane>_<Model>.md`, and to say in the report's last line whether it did. `docs/research/prompts/TEMPLATE-site.md` carries the section.
- Argon reports embedded a large base64 image on one line, and Neon's may: read Gemini reports with `grep -v 'data:image'`.
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
| `tools/terrain/`, `docs/terrain/` | How the island is rebuilt from elevation data, and its record. |
| `tools/town/`, `docs/town/` | How the town is traced and laid out, and its record. |
| `docs/HISTORICAL_STANDARD.md` | Evidence rules for every site. |
| `docs/DECISIONS.md` | Numbered decisions and open questions. |
| `docs/ARCHITECTURE.md` | How the engine is built and how it should grow: layers, dates, years, size and speed. |
| `docs/research/` | Research prompts, reports and verifications. |
| `docs/tasks/` | Work orders. |
| `.harness/` | Harness config and evidence logs. |
| `akrotiri-frescoes-sources/` | Local reference images, ignored by git. |
