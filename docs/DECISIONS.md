# Decisions

Numbered decisions for this project. A decision is changed only by a newer one that names it. Open questions are listed at the end until they are decided. Only Chad's session edits this file (`AGENTS.md` §3).

| # | Decision | Who, when | Why |
|---|---|---|---|
| D1 | **Fork Noniv/abyssal-garden as `chadjustice25/akrotiri-thera-abyssal-garden`.** `origin` is the fork and `upstream` is Noniv's repo. Upstream's MIT `LICENSE`, with its copyright line, stays as it is, and the README credits upstream. The scene stays upstream's until the first Thera work order replaces it. | Chad 2026-11-15 | A working procedural WebGPU world (terrain, water, light, plants, animals, sound) in one file is the fastest start. A fork of a public repo is public on GitHub. |
| D2 | **Scope: Thera is the proof of concept.** Akrotiri and the island as they stood just before the Late Bronze Age eruption. Later the same world expands to other places at the same moment (Egypt, Byblos, Crete and more). | Chad 2026-11-15 | Thera is the best-preserved Bronze Age town in the Aegean, and its date problem forces the cross-site clock to be settled first. |
| D3 | **The moment: c. 1650 BCE, give or take 100–150 years (1800–1500 BCE), with one world clock for every place** (`docs/HISTORICAL_STANDARD.md` §1–2). Thera's exact anchor year is open (O1). | Chad 2026-11-15 | Places added later must agree with Thera on what year it is. The eruption date itself is disputed between about 1630 and 1500 BCE (to be checked by W1). |
| D4 | **Research runs on Gemini 4 Argon Deep Research, one lane per chat, and is checked by Claude before use.** Prompts are in `docs/research/prompts/` and reports in `docs/research/argon/`; checks go to `docs/research/verification/`. The grades and report format follow Beyond the Gates of Uruk's historian briefs and unghost's research lanes. | Chad 2026-11-15 | Long cited reports at no cost to Claude usage. Both earlier projects found that reports carry errors a check against the sources catches. |
| D5 | **The project uses the unghost harness as it stands:** `.harness/project.json`, work orders in `docs/tasks/`, and `checks/build.sh` as the gate. It sits outside unghost's D97/D107 pilot order, and it asks for no new harness machinery. | Chad 2026-11-15 ("I know this project isn't in the plan and that is OK") | The work-order, gate and log discipline costs little to adopt now, and it keeps the history comparable with the pilots. |
| D6 | **Reference images (`akrotiri-frescoes-sources/`) stay out of git.** | Session 1 default, 2026-11-15, for Chad to confirm | The fork is public. Reproducing images of Greek antiquities is regulated, and photographs carry their own copyright. Research lane T6 (topic F) checks both. |
| D7 | **Gate `build`:** `checks/build.sh` passes only if `source/` builds, the committed `index.html` is that build byte for byte, nothing is loaded at run time, and the page is within a size budget. The budget is **256 kB, provisional**; upstream's page is 98 kB. | Session 1, 2026-11-15 | Upstream's `index.html` rebuilds byte-identically (checked 2026-11-15, Node 22.23, esbuild 0.28.2), so drift between the source and the page is detectable. The control cases (stale page, over budget, runtime script, missing esbuild) each fail for their own reason. |

## Open

| # | Question | Needed by | Leaning |
|---|---|---|---|
| O1 | Thera's anchor year: the "now" of the world. | Before any other place is added | Wait for W1 and W2. One choice is a year in the last LC I season under the chronology the evidence favours most, with the other recorded beside it. |
| O2 | Keep upstream's "single self-contained HTML, everything procedural" law for the Thera world? | Before the first terrain work order | Keep. It also settles the image-rights question for the build, since there are no images. Revisit if real elevation data needs more room than the budget allows. |
| O3 | How the viewer moves: swim, walk, fly, or switch between them (for example, swim in the flooded caldera and walk in the town). | Before the first terrain work order | Keep upstream's free camera at first, and add walking with the town. |
| O4 | Upstream's Ko-fi `FUNDING.yml` and the menu links to Noniv's GitHub and Ko-fi. | Before the page is shown to anyone | Keep a credit to upstream in the menu, and drop the funding link from the fork. |
| O5 | Layout for several places (e.g. `sites/<id>/` data with one shared engine, as in Uruk's `games/<id>/`). | Before the second place | Decide after the Thera data shape exists. |
| O6 | The final size budget for `index.html` (D7). | When terrain data lands | Set it from the first real terrain build. |
