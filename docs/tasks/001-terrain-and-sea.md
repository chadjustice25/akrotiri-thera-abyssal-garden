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
- **T1c's first findings (unverified until `docs/research/verification/T1c.md` exists):**
  - **The Copernicus DEM may be included in a derived, compressed form, but that data is not MIT.** The generated `source/src/terrain-data.js` must carry the Copernicus licence notice, its no-liability sentence and its pass-on terms. `README.md` and `docs/terrain/README.md` must say that this file is under the Copernicus licence, not MIT.
  - EMODnet DTM 2024 is CC BY 4.0, with depths relative to the lowest astronomical tide (LAT).
  - The eruption tuffs are thickest on the caldera rim (up to about 55 m) and in the coastal fans (up to about 40 m). They are close to 0 m on the flanks of Profitis Ilias, on Kokkino Vouno and on west Akrotiri. Mavro Rachidi has 3–4 m of ash over marine sand.
  - Profitis Ilias is about 565 m; the DEM's highest cell is 560.4 m.
  - Sea level is still open: −3.6 m against "<0.5 m". Keep it as a parameter.
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
By the worker session (Claude Fable 5.2, effort high), 2026-11-18. Branch `task/001-terrain-and-sea`, seven commits, `6231aba` to `46faef4`. The full record is `docs/terrain/README.md`; the numbers are in `docs/terrain/build-report.json`.

**What was built**
- **Data:** `tools/terrain/fetch.mjs` and `build.mjs` turn Copernicus GLO-30 and EMODnet DTM 2024 into the island of 1615 BCE through edits E0–E9 in `edits.json`. Both licences were read before the data was used. The output is a 640 × 640 grid of 40 m cells with a rock class per cell, 54 kB in its compact form.
- **Engine:** the underwater garden is replaced by the island at real scale: a continuous ring-mesh terrain, six rock classes, a scattering sky with six times of day (key `T` and a menu row), a wave-sum sea with depth colour and foam, a seamless crossing of the surface, and fly and swim with terrain collision.
- **T1c:** its verification landed during the build. Its checked figures are in `edits.json`, and the licences' exact attribution texts are in `terrain-data.js`, `README.md`, `docs/terrain/README.md` and the page's menu.
- **Added after Chad tried the page:** `Space` flies up (the same as `E`) and `X` flies down (the same as `Q`).

**Checks**

| Check | Output |
|---|---|
| `checks/build.sh` | `PASS build: index.html matches a fresh build of source/, 130 kB of a 256 kB budget, nothing loaded at run time` |
| `node checks/views.mjs --min-fps 55 --min-scale 60` (last run 18:59 UTC) | `PASS views: six viewpoints rendered on apple metal-3 at high detail, 1600x900, world built in 0.5 s, every view at least 55 fps and 60% resolution` |
| Each view | 60 fps, 100% resolution, no late frame, GPU 4.7–9.8 ms |
| `node tools/terrain/build.mjs`, run twice | the same `terrain-data.js` byte for byte |
| Size of `index.html` | 132,496 bytes, of which about 71 kB is terrain data |
| Published | Thera Views, version 6 |

**Numbers**

| Edit | Result |
|---|---|
| E4 volume added | **13.16 km³** (allowed 9.1–17.1), of which 4.76 km³ stands above the 1615 sea; 44.0 km² of restored land; rim to 259 m |
| E3 deposits stripped | mean 15.5 m, most 36 m, 1.50 km³; 20.1 m at the town site |
| E7 Pre-Kameni | 2.40 km³, summit 231 m, 16.3 km² |
| E5 bay | 41.0 km², 5 m deep |
| E9 Profitis Ilias | 568.2 m above the 1615 sea (565 m above today's) |
| Island | 145.4 km² of land (91.0 km² today) |

**Liberties:** T-L1 to T-L17, each with its reason in `docs/terrain/README.md` §4, now also in `docs/HISTORICAL_STANDARD.md` §6.

**What was seen** by Claude in the views-check pictures:

| View | Seen |
|---|---|
| 1 Akrotiri terrace from the sea | Choppy open sea, low tan slopes rising from a dark shore; the terrace reads as a gentle slope |
| 2 Bay and Pre-Kameni from the rim | Pale turquoise lagoon, the black dome filling its middle, the northern walls beyond, a narrow beach below |
| 3 High above, looking north | The whole ring with its bay and dome, gullied restored land, Profitis Ilias pale to the east, deep blue sea |
| 4 Profitis Ilias summit | Pale marble ground, the island falling away to the bay 8 km off, sea glitter to the west |
| 5 Sea level in the bay | Clear green-white water with moving ripples, the dome low and wide ahead |
| 6 Under water off the south shore | Dark sand floor, light shafts, the rippling surface overhead, drifting specks |

Claude also looked at all six times of day, the camera crossing the surface, Low and Medium detail, the menu at three widths, and nine frames of the dev fly-through (60 fps, no late frame, no seams).

**Departures from the order, and open points**
- **E4's volume measure is ambiguous.** T1#14 rests on an abstract that does not say how the 9.1–17.1 km³ was measured. The 13.16 km³ here is restored surface minus today's surface. If the source counted only rock above sea level, the comparable figure is 4.76 km³, which is below the range.
- **Athinios phyllite is not drawn**, against the order's material list: T1#20 says the eruption exhumed that wall, so in 1615 BCE it lay under the restored land.
- **Pre-Kameni is a flat-topped ellipse, not the suggested paraboloid**, which filled the bay from wall to wall. The point 2 km west of Fira is on the dome; the point 1 km west is in the lagoon beside it.
- **The town's first-reported deposits** (about 1–2 cm of pumice, then about 1–2 m of ash, T1c#22) are recorded and do not set the strip depth (T1c correction 2).
- **Upstream's whale calls are removed** (no animals in this order). The sound is silent above the water.
- **Weaknesses that show:** the bare land reads as desert, the restored southern wall is a gullied slope and not a cliff, and shadows are soft up close.
- **Not checked by anyone:** touch controls on a real device.

## Review
Recorded on 2026-11-18 in the worker session, which Chad asked to do the integration.

- **What Chad saw:** Chad ran `index.html` in the browser on the Mac, not only the stills in Thera Views. His words: "I see a completely barren island and I don't see any buildings, town or manmade structures", which is the expected state after this order, and then "OK, looks great and the controls are pretty intuitive."
- **What Chad asked for:** `Space` to fly up and `X` to descend, as in World of Warcraft. Both were added and tested.
- **What Chad did not report on:** the six stills one by one, popping in motion, each time of day, the sound, and touch on a device. No problem was reported; none of these is recorded as checked.
- **Decision:** merge. `task/001-terrain-and-sea` was merged into `main` locally as `7651a39`. The push is Chad's.
