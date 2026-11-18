# 001-terrain-and-sea: Thera's land, sea and sky in 1615 BCE
**Status:** open · **Branch:** `task/001-terrain-and-sea`

```harness-spec
{
 "spec_version": 1,
 "id": "001-terrain-and-sea",
 "family": "code",
 "task_type": "procedural-world",
 "status": "open",
 "assignee": {"person": "Chad", "agent": "claude-code", "model": "claude-fable-5-2"},
 "branch": "task/001-terrain-and-sea",
 "owns": [
  "index.html",
  "source/src/",
  "source/template.html",
  "source/build.mjs",
  "source/package.json",
  "source/package-lock.json",
  "tools/terrain/",
  "docs/terrain/",
  "README.md",
  ".gitignore"
 ],
 "forbids": [
  "checks/",
  "docs/tasks/",
  "docs/research/",
  "docs/DECISIONS.md",
  "docs/HISTORICAL_STANDARD.md",
  "docs/WORLD_CLOCK.md",
  "AGENTS.md",
  "CLAUDE.md",
  "GEMINI.md",
  "HANDOFF.md",
  "LESSONS.md",
  "LICENSE",
  "akrotiri-frescoes-sources/",
  ".harness/project.json"
 ],
 "read_first": [
  "AGENTS.md",
  "docs/HISTORICAL_STANDARD.md",
  "docs/WORLD_CLOCK.md",
  "docs/DECISIONS.md",
  "docs/research/verification/T1.md",
  "docs/research/verification/T1b.md",
  "docs/research/claude/T1_Claude.md",
  "docs/research/claude/T1b_Claude.md",
  "README.md",
  "source/src/main.js",
  "source/src/world.js",
  "source/src/shaders.js",
  "checks/build.sh",
  "checks/views.mjs"
 ],
 "gate": {"argv": ["checks/build.sh"], "timeout_s": 300},
 "review_tier": "P0",
 "parallel_safe": false,
 "budget": {"max_attempts": 2, "max_tokens": null, "max_budget_usd": null}
}
```

## Goal
Replace upstream's underwater garden with **the island of Thera as it stood in 1615 BCE** (D16): its land, its sea, its sky and its light, at real scale. This is the first world the project shows, and the bar is the frontier of what runs in a browser (D14). The result should be visually engrossing and smooth, with every landform traceable to a checked claim or a recorded liberty.

**How to run it:** a fresh Claude Code session on **Claude Fable 5.2**, at effort **`high`** (D14). Raise it to `xhigh` only for the hardest shader and lighting passes, and only when the views check shows a gain. Start the session in this repository, then read this order and everything in Read first. Nothing from any chat is assumed.

## Read first
- `AGENTS.md`: the rulebook. The engine laws in §5 hold: WebGPU only, no per-frame allocations, one self-contained page built from `source/`.
- `docs/HISTORICAL_STANDARD.md`: grades, "shown is not present", liberties (§6), and data licences (§5).
- `docs/WORLD_CLOCK.md` and `docs/DECISIONS.md`. These decisions shape this order:
  - D11: one file, everything procedural, unless that becomes impossible;
  - D12: swim, walk and fly;
  - D14: Fable 5.2 for the build;
  - D16: the year is 1615 BCE;
  - D7 and O6: the size budget.
- `docs/research/verification/T1.md` and `docs/research/verification/T1b.md`: the checked claims, **and their "Corrections to apply before building"**. A claim is used only as corrected there.
- `docs/research/claude/T1_Claude.md` and `docs/research/claude/T1b_Claude.md`: the claims themselves. Cite them as `T1#24` and `T1b#40`.
- `README.md` ("Make it your own"), `source/src/main.js`, `source/src/world.js` and `source/src/shaders.js`: the engine you are changing.
- `checks/build.sh` (the gate) and `checks/views.mjs` (the views check). You may not change either.

## You may change
- `index.html` (rebuilt from the source folder, never edited by hand)
- `source/src/` (engine code and generated terrain data)
- `source/template.html` (menu text and the data credits)
- `source/build.mjs` (only if embedding the terrain data needs it)
- `source/package.json` and `source/package-lock.json` (build scripts; no runtime dependencies)
- `tools/terrain/` (the scripts that fetch the elevation data and rebuild the 1615 BCE island, with their own dependencies if needed)
- `docs/terrain/` (the record of the data, its licences and every edit)
- `README.md` (the fork note and credits only; keep upstream's text below it)
- `.gitignore` (to ignore the downloaded data cache)

## Build
1. **Data, licences first.** Write `tools/terrain/fetch.mjs`. It downloads the Copernicus DEM GLO-30 tiles covering Santorini (from the open AWS bucket; no account) and EMODnet Bathymetry for the surrounding sea, into an ignored cache, `tools/terrain/cache/`. **Before using either dataset, record its licence, attribution text and redistribution terms in `docs/terrain/README.md`, with the URL of the terms.**
   - If a licence does not allow a derived, compressed copy inside a public MIT-licensed page, stop and report rather than work around it.
   - T1 correction 11: GLO-30 is a surface model, so the cliff-top towns of Fira and Oia, and the vegetation, are in it. Smooth them out.
2. **The 1615 BCE island.** Write `tools/terrain/build.mjs`. It turns the modern elevation and depth data into the island before the eruption, through named edits kept in `tools/terrain/edits.json`. Each edit carries its claim references or a liberty number, and its parameters, so a later research result changes a number, not the code. The output must be deterministic, so the same inputs give the same bytes. The edits:
   - **E1, sea level −3.6 m**: `T1#51`, `T1#52`, grade C. Santorini's own land movement is unknown.
   - **E2, remove the Kameni islands**, which formed after the eruption: `T1#26`–`T1#29`. 4.85 km³ (DRE) and 3.2 km³ are different measures; do not average them (T1 correction 8).
   - **E3, strip the Minoan eruption deposits from the land.** No sourced thickness map exists yet, so this is a **liberty**. Make the cover thin on ridges and on the old basement (Profitis Ilias, Mesa Vouno), thick in valleys, and keep it within the unit ranges of `T1#24`. **Do not** use Mavrorachidi's "~25 m" as a valley floor (T1 correction 1), and keep the "~32 m" figure only as the inference it is (T1 correction 2).
   - **E4, restore the ring island on the caldera side.**
     - The southwest rim (Thera, Aspronisi and Therasia) is continuous land (`T1#11`, C).
     - The rim height is about 260 m above sea level, the preferred value (`T1b#51`, C).
     - The added volume must fall within 9.1–17.1 km³ (`T1#14`). Report the volume you added.
   - **E5, the northern bay.** A flooded caldera in the north part of today's caldera only (`T1#2`–`T1#4`, `T1#7`, B), shallow and lagoonal. "No more than a few metres" is `T1b#46`, B [verify]; it is contested.
   - **E6, the opening to the sea.** At most a narrow, low channel to the north or northwest. Its width is a **liberty** under 1 km (today's channel, `T1#10`, is the upper bound).
   - **E7, Pre-Kameni**, the island in the caldera (a modern label: say so wherever a viewer could read it).
     - A **low dome** of about 2.4 km³ (`T1b#40`, `T1b#42`, B/C), with its eruption vent 1–2 km west of modern Fira (`T1b#19`, `T1b#39`).
     - **Keep its summit below the ring rim.** The scaled heights of 340–420 m are above the bay floor, and would stand above the rim (T1b correction 1). A paraboloid of about 5 km base and about 245 m height fits both constraints.
     - Its shape and height are a **liberty**. Its rock is black glassy andesite (`T1b#43`, A).
     - **Put no buildings on it.** No source supports them (T1b gap; `T1b-4`).
   - **E8, Akrotiri and the south coast.** The town site is about 1 km south of the caldera (`T1b#59`). Leave a gently sloping terrace there for the town, which comes in work order 002. The harbour has not been found (`T1#36`, `T1#37`), so do not invent one.
   - **E9, Profitis Ilias** stays as the old non-volcanic basement: about 567 m (`T1b#55`, B [verify]; sample the DEM), with marble-type carbonate rock (`T1b#56`).

   The output is a compact, quantised height grid plus a rock-class map, at the resolution that fits the budget, written as `source/src/terrain-data.js`. It is generated and committed, and decoded at start with built-in browser APIs (e.g. `DecompressionStream`). Nothing is fetched while the page runs.
3. **Terrain in the engine**: `source/src/world.js`, `source/src/main.js` and `source/src/shaders.js`.
   - Replace the upstream seabed volume with island-scale terrain, roughly 16 × 12 km plus the surrounding sea floor.
   - Give it continuous level of detail (for example clipmaps or CDLOD): no visible popping, sharp underfoot and clean at 15 km.
   - Add procedural detail on top of the data (rock strata on the cliffs, scree, gullies, weathering) that never contradicts the data.
   - **Materials by rock class:**
     - light-grey andesite on the Akrotiri peninsula (`T1#23`);
     - dark-grey andesite on Therasia (`T1#23`);
     - black glassy andesite on Pre-Kameni (`T1b#43`);
     - phyllite and schist basement at Athinios, Profitis Ilias and Mesa Vouno (`T1#21`);
     - marble on Profitis Ilias.

     No colour for any of them is sourced, so **every colour value is a liberty**.

     The painted rocks of the frieze (red, blue-black, ochre; T1b §3b) are grade B. They may guide the caldera-cliff banding only as a recorded liberty.
   - No vegetation, buildings, people or animals in this order.
4. **Sky and light** (`source/src/shaders.js`, `source/src/main.js`).
   - A physically based atmosphere, with the sun placed for Thera (36.4° N, 25.4° E) on a date in 1615 BCE. The season is open (spring or early summer are the readings, T3), so use **late May as the default**, recorded as a liberty.
   - A time-of-day control (a key, plus a menu setting) running through dawn, noon, golden hour, dusk and night with stars.
   - Aegean haze over distance.
   - Light in water: depth colour, light shafts and caustics, carried over from upstream's strengths.
5. **The sea** (`source/src/shaders.js`, `source/src/world.js`).
   - Open-water waves (an FFT ocean or a well-tuned wave sum), with a calm-to-breezy sea state.
   - Colour by depth over the bathymetry: the shallow lagoon in the north bay reads differently from the open sea.
   - Shoreline foam, and a seamless crossing above and below the surface.
   - Underwater keeps upstream's look, adapted to Aegean water.
6. **Movement** (`source/src/main.js`; D12, first step). **Fly** (the free camera, with no height clamp) and **swim** (below the surface, upstream's feel). Walking comes with the town.
   - Remove upstream's depth clamp and its collision with the old seabed, and collide with the new terrain.
   - Keep the touch and keyboard controls working.
7. **Viewpoints 1–6** (`POSES` in `source/src/main.js`). These are what `checks/views.mjs` photographs:
   1. the Akrotiri terrace from the sea to its south;
   2. the north bay and Pre-Kameni from the ring rim;
   3. high above the whole island, looking north;
   4. Profitis Ilias summit, looking across the island;
   5. sea level inside the bay;
   6. underwater off the south shore.

   Also rework the `FLY` path (dev tools) to tour them.
8. **Keep upstream's engine laws:**
   - no per-frame allocations;
   - all three detail levels (Low, Medium, High) work;
   - the loading screen reports progress;
   - one self-contained `index.html`, built with `cd source && npm run build`, committed with `source/`.

   If the page cannot stay within the build gate's budget (256 kB, D7) at a quality worth showing, **stop and report** the numbers instead of raising it (D11, O6).
9. **Credits.** Put the data attribution required by the licences in the menu (`source/template.html`) and in the fork note of `README.md`. Remove nothing of upstream's credit.
10. **The record**, `docs/terrain/README.md`:
    - the datasets and their licences;
    - each edit, with its parameters, claim references, grade or liberty, and the volume or extent it changed;
    - every liberty, numbered T-L1, T-L2 and so on, with its reason;
    - how to regenerate the data;
    - what you looked at and what you saw, per viewpoint.

## Known gaps
- **Research lane T1c is running** on the five blockers: deposit thickness on land, the full papers on the caldera's outline and bay depth, the harbour cores, Santorini's own sea level, and the dataset licences.
  - If `docs/research/verification/T1c.md` exists when you start, read it and use its corrected figures in `tools/terrain/edits.json`.
  - If it lands later, the parameters change, not the code.
- Unsourced, and therefore liberties: the shape and height of Pre-Kameni, the bay's exact depth, the width of the channel, the deposit-thickness model, every rock and soil colour, and the season.
- The harbour of Akrotiri is unlocated.
- Upstream's sound is underwater ambience. Keep it for swimming. Sound above the water is a later order.

## Done when
- `checks/build.sh` prints PASS: `index.html` matches a fresh build, is within the budget, and loads nothing at run time.
- `node checks/views.mjs --min-fps 55 --min-scale 60` prints PASS on this Mac. All six viewpoints render on the hardware GPU with no logged error, each at 55 fps or more and 60% resolution or more. Upstream passes the same limits.
- The views are published to the **Thera Views** artifact (`https://claude.ai/artifact/EAM2iAgZHr4toJ39qt9C9L`), from `.harness/views/latest/`, for Chad to look at on the iPad.
- `node tools/terrain/build.mjs` regenerates `source/src/terrain-data.js` byte for byte.
- `docs/terrain/README.md` lists every edit and every liberty, with its claim references and the volume added for E4.

## Out of scope
The town and its buildings (order 002), walking, plants and animals, people, ships, weather events, the eruption itself, and sound above water.

## Result
(Filled in by the worker: what was built, the gate and views outputs, the size of `index.html`, the volume added in E4, the liberties list, and what was seen at each viewpoint.)

## Review
(Filled in by Chad's session: what Chad saw in Thera Views, and the decision to merge or not.)
