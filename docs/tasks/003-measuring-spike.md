# 003-measuring-spike: measure the design for layers and time before it is built
**Status:** open · **Branch:** `task/003-measuring-spike`

**Ready to run.** It needs no research. Chad asked for the architecture to be looked at before anything more is built (2026-11-19), and approved this spike as the next step ("Let's continue as you suggested", D39).

```harness-spec
{
 "spec_version": 1,
 "id": "003-measuring-spike",
 "family": "code",
 "task_type": "procedural-world",
 "status": "open",
 "assignee": {"person": "Chad", "agent": "claude-code", "model": "claude-fable-5-2"},
 "branch": "task/003-measuring-spike",
 "owns": [
  "index.html",
  "source/src/",
  "source/template.html",
  "source/build.mjs",
  "source/package.json",
  "source/package-lock.json",
  "tools/terrain/",
  "tools/town/shot.mjs",
  "docs/spike/",
  ".gitignore"
 ],
 "forbids": [
  "checks/",
  "docs/tasks/",
  "docs/research/",
  "docs/town/",
  "docs/terrain/",
  "docs/ARCHITECTURE.md",
  "docs/DECISIONS.md",
  "docs/HISTORICAL_STANDARD.md",
  "docs/WORLD_CLOCK.md",
  "tools/town/town.json",
  "tools/terrain/edits.json",
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
  "HANDOFF.md",
  "LESSONS.md",
  "docs/ARCHITECTURE.md",
  "docs/DECISIONS.md",
  "docs/HISTORICAL_STANDARD.md",
  "docs/terrain/README.md",
  "docs/town/README.md",
  "README.md",
  "source/build.mjs",
  "source/src/quality.js",
  "source/src/world.js",
  "source/src/shaders.js",
  "source/src/main.js",
  "source/src/dev.js",
  "tools/terrain/build.mjs",
  "tools/town/shot.mjs",
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

Replace the estimates in `docs/ARCHITECTURE.md` with measurements, and say whether its design holds.

The world is about to gain three things at once: layers (Found, Inferred, Imagined), a date and season, and a year the viewer can move, which runs through the eruption (D31, D33, D34, D37, D38). The review proposes how to build that so the page stays fast, small and fluid. Every size and frame time in it beyond today's is a guess. This order builds four small prototypes, measures them, and reports. **It is a spike: it measures and stops. It does not build the feature.**

The released page must look and behave exactly as it does on `main`. The prototypes live in the development build only.

## Decisions this order rests on

| | |
|---|---|
| D11, D17 | One self-contained page, no files loaded at run time, 256 kB. A work order that cannot fit stops and reports the numbers |
| D14 | Build work runs on Claude Fable 5.2, effort high, in its own session |
| D31, D38 | Three cumulative layers, Found, Inferred and Imagined. Changing layer never reloads, rebuilds or pauses the world: things fade in and out |
| D33, D34 | The viewer can move the date and the year |
| D36, D37 | The world opens in 1628 BCE. Thera's years run through the end of the town |
| D39 | This spike is work order 003. Layers and time are 004, with the change to edit E4 (D29). Plants are 005 |

## Read first
- `AGENTS.md`: the rulebook. The engine laws in §5 hold.
- `HANDOFF.md` and `LESSONS.md`: where things stand, and what the first two orders learned. Three lessons matter most here: build the picture-taker first; print what a tool decided and read it; a Claude Code session in a worktree refuses compound shell commands.
- `docs/ARCHITECTURE.md`: **what you are testing.** Read §3 (what the engine must do), §4 (the proposed design) and §5 (the size estimates) closely.
- `docs/DECISIONS.md`: the decisions in the table above.
- `docs/HISTORICAL_STANDARD.md`, §4 and §7: nothing in this spike is evidence, and the layers are named there.
- `docs/terrain/README.md` and `docs/town/README.md`: how the island and the town are built today.
- `README.md` ("Make it your own") and `source/build.mjs`: how the page is put together, and what the development build adds.
- `source/src/quality.js`, `source/src/world.js`, `source/src/shaders.js`, `source/src/main.js` and `source/src/dev.js`: the engine. **The ground is already nested grids over baked height maps. Do not rebuild it.**
- `tools/terrain/build.mjs`: it already computes today's island as its starting point, which measurement 3 uses.
- `tools/town/shot.mjs`: it drives `dev.html`, takes pictures and presses keys.
- `checks/build.sh` (the gate) and `checks/views.mjs` (the views check). You may not change either.

## You may change
- `index.html` (rebuilt from the source folder, never edited by hand; see "The released page" below)
- `source/src/` (engine code and the prototypes)
- `source/template.html` (keeper K2 only)
- `source/build.mjs`, `source/package.json`, `source/package-lock.json` (build scripts; no runtime dependencies)
- `tools/terrain/` (**only** to write out a second surface for measurement 3; the island of 1628 BCE and its settings do not change)
- `tools/town/shot.mjs` (to drive and measure the prototypes)
- `docs/spike/` (new: the report)
- `.gitignore`

Everything else belongs to the integrator. If the spike shows that one of those files is wrong, say so in the Result.

## Build

### The released page

`index.html` must stay a fresh build of `source/` (the gate), and **a viewer of it must see and feel no difference from `main`.**

- Put the prototypes in files that only the development build includes (`npm run build:dev`, `dev.html`), or behind a build-time switch that the release build removes. Say in the Result which you chose and why.
- `index.html` may change only through the two keepers below, and by no more than 1.5 kB in all.
- If a prototype cannot be kept out of the release build, stop and report. Do not ship it.

### Stand-ins, not content

Nothing in this spike is evidence, and nothing in it may look like a finding about the past.

- Placed instances are plain grey shapes, never plants.
- The second island is today's island, used as a stand-in. It is not a model of the eruption.
- Add no text that a viewer of the released page will read, apart from keeper K2's one word.

### Measurement 1: fading a layer of the town

The town's mesh already marks each vertex as excavated or reconstructed. Treat the excavated buildings as Found and every other building as Inferred.

1. Give the shaders one layer value that moves smoothly between 0 (Found only) and 1 (Found and Inferred).
2. Make each building's layer a few bytes in a small table, looked up by the building number its vertices carry, not a new attribute on every vertex.
3. Fade the Inferred buildings in and out, in the colour pass and in the town's shadow pass, with no sorting. Try at least three ways and keep them switchable in `dev.html`:
   - a dither that opens and closes;
   - a rise from the ground, by clipping above a climbing height;
   - either of those spreading outward from the excavated centre as a wave.
4. Make collision follow: where a building is hidden, the viewer walks over the ground it stood on, and a viewer standing on a roof that fades is lowered gently.
5. Note what else in the picture belongs to the hidden buildings and would have to fade with them (the paving and street shading come from the town's plan map), and say what that would take. You need not build it.

**Measure:** bytes added to the development page, raw and compressed; GPU time a frame at views 7, 8 and 9 with the fade at rest and in motion, on High, Medium and Low; whether shadows follow; whether the dither shimmers when the viewer moves or when the page drops its resolution.

**Show:** for each way of fading, pictures at a quarter, a half and three quarters of the fade, from views 7 and 9.

### Measurement 2: placing by rule on the GPU

A compute pass that places instances round the viewer each frame, with nothing stored and no work on the CPU for each instance.

1. Cut the ground round the viewer into cells. For each cell make a few candidate spots from a hash of the cell's number, so the same spots come out every frame.
2. Keep a candidate if it is on land, passes a stand-in density rule (height and slope will do), and is in view.
3. Choose one of three forms by distance: a box, a simpler box, a flat upright card.
4. Write the kept instances and their counts straight into the buffers the GPU draws from (indirect draws).
5. Add one value each for layer, year and day of the year to the test that keeps a candidate, to show that the three tags fit in the same pass. Move them in `dev.html` and show instances fading by the same means as in measurement 1.

**Measure:** GPU time a frame with about 10,000, 50,000 and 200,000 instances kept, at views 1, 3 and 9 and on foot in the town, on High, Medium and Low; bytes added; that the same view gives the same picture twice; and that JavaScript's memory does not grow over a minute of flying (engine law 3).

**Record:** which WebGPU features and limits the pass needs beyond the defaults, since the iPad has to run it too.

### Measurement 3: two islands, blended by the year

1. In `tools/terrain/`, write out a second surface on the page's grid and datum: today's island, which the build already computes as its starting point. This is the stand-in for the island after the eruption.
2. Measure its cost two ways: packed whole with the existing coder, and packed as a **difference** from the island of 1628 BCE. Give both in bytes, raw and as text in the page.
3. In `dev.html`, bake a second set of height, slope and rock maps, and blend the two sets by one year value: in the ground's shader, in its shadow, and in the height the walker stands on.

**Measure:** bytes; time added to the load; GPU time a frame at views 1, 2 and 3 with the blend at rest and in motion; the memory the second set of maps takes.

**Show:** pictures at 0, a half and 1 from views 1, 2 and 3.

### Keeper K1: where the size goes

Make `source/build.mjs` print the released page's size part by part: terrain data, town data, shaders, engine code, menu and styles, sound, and the whole, raw and compressed. Add it as `npm run size`. This changes no byte of the page.

### Keeper K2: the stats line on a touch device

The stats line (frames a second, GPU time, resolution) is behind the `H` key, which a touch screen does not have. Add one small way to show it without a keyboard, so that the frame rate can be read on an iPad. Keep it under 400 bytes, and look at the menu in a picture at iPad and phone sizes afterwards (`LESSONS.md`: the menu overflowed once).

If K2 cannot be done that small, leave it out and say so.

### The report

Write `docs/spike/003-measurements.md`:

- For each measurement: what was built, how it was measured, a table of the numbers, and the pictures by name.
- **A verdict on each part of the design in `docs/ARCHITECTURE.md` §4 that you tested:** it holds; it holds with a change (say which); or it does not hold (say what would).
- The table of §5 again, with every estimate you can now replace, and what is still a guess.
- What the work order for layers and time should do differently from what the review proposes.
- Anything that surprised you.

Publish the pictures as one page to a new private artifact named **Thera Spike 003** and give its link in the Result. `.harness/` is ignored by git, so the pictures stay out of the repository.

## Known gaps

- **No iPad.** Every frame time here is this Mac's, which flatters. Say so beside every number. K2 is how the first iPad reading will be taken.
- **The stand-in island is not the island after the eruption.** Its size is a first reading, not the answer.
- **Fade quality is a matter of taste.** Report what you saw, and leave the choice of fade to Chad.

## Done when
- `checks/build.sh` prints PASS, and `index.html` differs from the one on `main` only by the keepers, by 1.5 kB or less.
- `node checks/views.mjs --views 9 --min-fps 55 --min-scale 60` prints PASS on the released page.
- Measurements 1, 2 and 3 run in `dev.html` (`cd source && npm run build:dev`), each with its numbers and pictures.
- `cd source && npm run size` prints the page's size by part.
- `docs/spike/003-measurements.md` is complete, with a verdict on each part of the design that was tested.
- The pictures are published to a private artifact named **Thera Spike 003**, and its link is in `docs/spike/003-measurements.md`.
- Everything is committed on `task/003-measuring-spike`. Nothing is pushed or merged.
- The final report gives the Result. Never report a visual pass nobody saw: say who looked at what (`AGENTS.md` §6).

If a prototype cannot be kept out of the released page, or a measurement cannot be taken, **stop and report** instead of working around it.

## Out of scope

- Layers, dates or years in the released page, and their controls in the menu.
- Plants, the sky, the eruption, people.
- The change to edit E4 (D29): it belongs to work order 004.
- Any change to the island of 1628 BCE or to the town.
- Polishing a prototype beyond what its measurement needs.

## Result
(Given by the worker in its final report and pasted in by the integrator: which way the prototypes were kept out of the released page; the gate and views outputs; the size of `index.html` and what changed it; for each of the three measurements, the numbers and a verdict; the size-by-part table; the link to Thera Spike 003; what the layers and time order should do differently; and who looked at each picture.)

## Review
(Filled in by the integrator: what Chad saw, which fade he chose, and the decisions that follow.)
