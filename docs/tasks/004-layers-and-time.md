# 004-layers-and-time: the three layers, a date the viewer can move, and more land in the ring
**Status:** open · **Branch:** `task/004-layers-and-time`

Written on 2026-11-20 by the integrator, after work order 003 measured the design and Chad chose the way a layer fades (D41). It needs no research. Two questions about it are still open, O20 and O21: the order is written to their leanings, which are marked **(leaning)** below, and Chad may change them before he starts the session.

```harness-spec
{
 "spec_version": 1,
 "id": "004-layers-and-time",
 "family": "code",
 "task_type": "procedural-world",
 "status": "open",
 "assignee": {"person": "Chad", "agent": "claude-code", "model": "claude-fable-5-2"},
 "branch": "task/004-layers-and-time",
 "owns": [
  "index.html",
  "source/src/",
  "source/template.html",
  "source/build.mjs",
  "source/package.json",
  "source/package-lock.json",
  "tools/terrain/",
  "tools/town/",
  "docs/terrain/",
  "docs/town/",
  "docs/layers/",
  ".gitignore"
 ],
 "forbids": [
  "checks/",
  "docs/tasks/",
  "docs/research/",
  "docs/spike/",
  "docs/ARCHITECTURE.md",
  "docs/DECISIONS.md",
  "docs/HISTORICAL_STANDARD.md",
  "docs/WORLD_CLOCK.md",
  "README.md",
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
  "docs/spike/003-measurements.md",
  "docs/DECISIONS.md",
  "docs/HISTORICAL_STANDARD.md",
  "docs/terrain/README.md",
  "docs/town/README.md",
  "README.md",
  "source/build.mjs",
  "source/template.html",
  "source/src/spike.js",
  "source/src/spike-fade.js",
  "source/src/quality.js",
  "source/src/world.js",
  "source/src/shaders.js",
  "source/src/main.js",
  "source/src/dev.js",
  "tools/terrain/edits.json",
  "tools/terrain/build.mjs",
  "tools/town/build.mjs",
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

Three things, built in this order and committed apart, so that one can be kept if another has to wait:

- **Part A, the land:** edit E4 puts back more of the ring island (D29).
- **Part B, the layers:** the viewer moves between **Found**, **Inferred** and **Imagined**, and what a layer adds fades into being as a wave from the excavated centre (D31, D38, D41).
- **Part C, the date:** the viewer moves the day of the year, and the sun follows the season (D33). The year is given its plumbing and no control (D34, O20).

The hard requirement is Chad's: a viewer moves between layers "fluidly and seamlessly… without experience interruption", and new things "fade into existence in a beautiful additive progression". **Changing layer or date never reloads, rebuilds or pauses the world.**

The world a viewer meets on opening the page looks as it does on `main`, except where Part A changed the land.

## Decisions this order rests on

| | |
|---|---|
| D11, D17 | One self-contained page, nothing loaded at run time, 256 kB. The page is 169,665 bytes today |
| D14, D39 | Build work runs on Claude Fable 5.2, effort high, in its own session and worktree |
| D29 | Edit E4 is to add at least 14.4 km³, and towards 17.1 km³ as far as the sourced outline of the bay and the 260 m rim allow |
| D31, D38 | Three cumulative layers. **Found:** "Only what was dug up, where it was found". **Inferred:** "Adds what the evidence points to". **Imagined:** "Adds what brings the place to life". The land is drawn in every layer, and in Found a colour with no source is drawn plain |
| D33, D34, D36, D37 | The viewer can move the date and, later, the year. The world opens in late May of 1628 BCE |
| D41 | A layer fades as a per-pixel dither that spreads as a wave from the excavated centre, the same on every detail level |
| D42, D43 | The project is for citizen scientists and scientists at the real sites, and augmented and virtual use is planned. Every order keeps the door open for it: "Keep the door open" below |
| O20 | **(leaning)** The menu gets a layer control and a date control. The year gets no control until something in the world is dated |
| O21 | **(leaning)** What each layer shows today, and which layer the world opens in: the table in Part B |

## Read first
- `AGENTS.md`: the rulebook. The engine laws in §5 hold, and law 3 (no per-frame JavaScript allocations) is tested here.
- `HANDOFF.md` and `LESSONS.md`: where things stand, and what three orders learned. The lessons of work order 003 are about this work.
- `docs/ARCHITECTURE.md`: the design. Read §4.1 and §11 closely.
- `docs/spike/003-measurements.md`: **what was measured.** §4 is the fade, and §9 is fourteen things this order should do differently from the first design. Take them as requirements unless this order says otherwise.
- `docs/DECISIONS.md`: the decisions in the table above.
- `docs/HISTORICAL_STANDARD.md`, §6 and §7: the liberties each thing carries, and the layers.
- `docs/terrain/README.md`: how the island is built, edit by edit, and how E4's volume is measured.
- `docs/town/README.md`: how the town is built, and which buildings are excavated.
- `README.md` ("Make it your own") and `source/build.mjs`: how the page is put together.
- `source/template.html`: the menu. It overflowed once (`LESSONS.md`).
- `source/src/spike.js` and `source/src/spike-fade.js`: the prototype of the fade. **Lift its ideas; do not merge its code.** It was written to stay out of the engine, which is the opposite of what the feature needs.
- `source/src/quality.js`, `source/src/world.js`, `source/src/shaders.js`, `source/src/main.js` and `source/src/dev.js`: the engine.
- `tools/terrain/edits.json` and `tools/terrain/build.mjs`: edit E4 and the build that checks its volume.
- `tools/town/build.mjs`: it writes the town's data, which has to give each building a number.
- `tools/town/shot.mjs`: it drives `dev.html`, takes pictures and presses keys.
- `checks/build.sh` (the gate) and `checks/views.mjs` (the views check). You may not change either.

## You may change
- `index.html` (rebuilt from the source folder, never edited by hand)
- `source/src/` (the engine, and the prototypes of work order 003)
- `source/template.html` (the menu)
- `source/build.mjs`, `source/package.json`, `source/package-lock.json` (build scripts; no runtime dependencies)
- `tools/terrain/` (edit E4 only; no other edit changes)
- `tools/town/` (building numbers, and whatever the plan map needs)
- `docs/terrain/` (the record of the change to E4)
- `docs/town/` (the record of what changed in the town's data)
- `docs/layers/` (new: the record of the layers and the date)
- `.gitignore`

Everything else belongs to the integrator. If this work shows that one of those files is wrong, say so in the Result. The integrator updates the project's front page and the standard's liberties table from your Result.

## Build

### Part A: more land in the ring (edit E4)

E4 adds 13.16 km³ today. The source's range is 9.1–17.1 km³; its authors prefer 17.1 km³, the largest land that fits, and give 14.4 ± 0.8 km³ from rock fragments (`docs/terrain/README.md`, E4).

- Raise E4's added volume to **at least 14.4 km³**, and towards 17.1 km³ as far as two sourced limits allow: the rim crest stays at about 260 m and no higher, and the bay keeps the outline its sources give (T1#19, T1#20). Do not buy volume with a shape the sources do not support. If 14.4 km³ cannot be reached inside those limits, stop at what can be and report it.
- The build's own guards stay: it still fails outside 9.1–17.1 km³, if the bay leaks, or if the page's decoder does not give back the grid that was written.
- **Nothing else moves.** The ground under the town (edit E8) and every other edit give the same heights as before. Show it with a comparison of the old and new grids outside E4's area.
- Run the build twice and show that it writes the same `terrain-data.js` both times.
- Report the volume reached, the land area, the highest point, and the page's size before and after.
- Update `docs/terrain/README.md` (E4's row, its paragraph, and liberty T-L2 if the shape's description changed).
- Take the nine views again and look at the ones that show the bay and the ring. Commit Part A by itself, with the gate and the views check passing.

### Part B: the layers

#### What each layer shows today (leaning, O21)

| | Found | Inferred | Imagined |
|---|---|---|---|
| The land's form: every terrain edit and the ground detail | shown | shown | shown |
| The land's colours: rock, soil, sand, the banded cliffs (T-L7, T-L8) | plain | shown | shown |
| The sea, the sky, the sun, the weather | shown | shown | shown |
| The excavated buildings, the terraces and the pithos (the outlines flagged as excavated) | shown whole, plain | coloured | coloured |
| The paving and street shade beside them | shown | shown | shown |
| Buildings reconstructed inside the plan, and the town built by rule beyond the edge (A-L1, A-L11) | hidden | shown | shown |
| The paving and street shade beside those | hidden | shown | shown |
| Things made for the experience | hidden | hidden | nothing exists yet |

- **Plain** means one unpainted tone: no invented colour, banding or material pattern. Light, shadow, haze and reflection stay, so the form still reads. It is the convention of a plaster model.
- The sea, the sky and the weather are conditions of seeing, not things, and stay in every layer.
- **Imagined adds nothing today.** People and animals will be its first content. Show its button as present and not yet usable, marked "to come" **(leaning)**. The engine still carries all three values, so nothing has to change when it gains content.
- **The world opens in Inferred (leaning)**, the highest layer with content, which is the world of `main`.
- A thing's layer comes from the flag or the liberty it already carries. Do not hand-pick buildings.

#### The fade (D41)

- **One visibility function** in every shader stage: `vis(layer, years, days)`, as §9 point 12 of the spike's report. The layer value moves smoothly between 0 (Found) and 2 (Imagined).
- **Every corner of the town carries its building's number**, in the 32 bytes it already has, and a small table holds each building's layer, its turn in the wave, and the first and last year it stands for.
- **The wave** starts at the excavated centre and moves outward. Colour comes to the land and to the excavated buildings in the same movement as the houses appear, and the paving and street shade arrive with their houses, not ahead of them: the town's plan map has to carry each place's turn. Going down a layer is the same movement in reverse.
- **The dither** is per pixel, on High, Medium and Low alike. Chad chose it knowing that it shows a fine screen over what is fading. Not the dither on the samples in a pixel, and never a dither fixed to the surface.
- **Two pipelines:** an opaque one whenever nothing is fading, and one that may discard for the frames of a fade. At rest the layers must cost nothing measurable.
- **Shadows follow** through the same pattern. The spike saw the pattern as dots on the ground at a low share from far off (`m1-v9-wave-coverage-50`): look for it, and soften it if it shows.
- **A change can be interrupted.** Choosing another layer in the middle of a fade turns the movement round from where it is, with no jump.
- **Collision follows what is shown.** A viewer on a roof that fades is let down gently. A viewer standing where a house appears is lifted to its roof, as in the spike, unless Chad chooses otherwise from the chooser below.
- **Mind the texture limit.** The ground's shader was at 14 of 16 with the spike's maps. Pack maps together before adding one.
- **Take the fade's prototype out of the development build** once the engine does the job. Leave the spike's other two prototypes (placing, the second island) working in `dev.html`, or say why they could not be kept.

#### The control

- A **Layer** row in the menu with the three names, and under it the one line of the layer in force (the lines are in the table of decisions above, word for word).
- A key that steps through the layers, added to the menu's key list. `K` is free.
- The switch for the edge of the excavated walls (key `L`) keeps working in every layer.
- The menu's notes say in one sentence what the layers are.
- Look at the menu in pictures at desktop, iPad and phone sizes, lying and upright. If it no longer fits, say so and propose what leaves; do not shrink the type.

### Part C: the date

- **A day of the year the viewer can move**, opening in late May as now. The sun's height and the length of the day follow it, with the tilt the engine already uses (23.89°, T-L9), in local solar time.
- **Say which calendar.** The control counts from the spring equinox and names the date as today's calendar names the season ("21 May"), and the menu's notes say so in one sentence: these are seasonal dates, not dates in any calendar of the time. Show no Julian date, and name no ancient month. The computed calendar belongs to the sky order.
- The sun moves along its yearly path at an even rate in this order, which is up to about two days from the truth. Record it in `docs/layers/README.md` as a liberty that the sky order ends.
- **The named moments follow the sun.** Dawn, Golden and Dusk are fixed solar hours today, set for late May. Work them out from sunrise and sunset on the chosen day.
- The date glides, as the hour does. Shadows are redrawn as they are when the hour moves.
- **Only the sun follows the date.** The wind (T-L10), the haze and the sea do not, and the ground is bare all year. Say so in the record, and do not invent a winter.
- A **Date** row in the menu that works with a finger, and two keys that step it back and forward. If the menu has room, mark the two solstices and the two equinoxes.
- **The year:** the same uniform block carries the year, and every building's row holds a first and last year, set to the whole span. Nothing is dated, so the released page has no year control. In the development build only, date a few buildings and move the year with a key, to show that the plumbing works.

### Keep the door open (D43)

The world is to be used on the real site and in a headset later (`docs/ARCHITECTURE.md` §12). **Build none of it here:** no WebXR, no camera, no motion sensors. Keep four things true, and say in the Result where any could not be:

- **One camera.** New shader code takes its view and projection from the engine's one camera block. Nothing new assumes a single eye, the shape of the canvas, or that the sky and the land are always drawn.
- **Flat-screen effects are named.** The pixel dither reads the pixel's place on the screen. Keep that in one place in the shader text, and list in `docs/layers/README.md` every effect you add or touch that is worked out from the screen.
- **Controls are functions.** The layer and the date are set by plain functions that the menu and the keys call, so that another kind of input can call them later.
- **True scale and place stay.** Nothing moves the world's origin or its metres.

### Choices for Chad: one small chooser, not a gallery

Chad asked for this after work order 003 (2026-11-20): fewer tests and views, and "a more understandable interface with design choices clearly defined".

- In `dev.html`, show a small panel on screen that names each choice and the option in force in plain words. No choice is hidden behind an unlabelled key.
- Offer at most three choices, with at most three options each:
  1. **The plain tone** of Found.
  2. **How long the wave takes** to cross the town.
  3. **What happens to a viewer where a house appears** (lifted to the roof, or another rule you can defend).
- Publish one page to a new private artifact named **Thera Layers 004**: each choice named and defined in one sentence, its options side by side, the cost and the drawback beside each, and your recommendation. Where two options cannot be told apart by measurement, say "no measurable difference". **Twelve pictures at most.** The page goes up first, then four or five pictures a call (a single large call times out).
- Build your recommendation into the released page, so that the order is finished whether or not Chad changes a choice.

### The record

Write `docs/layers/README.md`: what each layer shows and why; how a thing gets its layer; how the fade, the wave and the date work, in a page; every new liberty, with its reason; and the measurements below. Three liberties are known already, and the integrator writes them into the standard from your Result:
- the excavated buildings stand whole in Found, though their upper storeys, roofs and openings were not all found;
- the wave runs outward from the excavated centre by distance, as a way of showing. It is not the order in which the site was dug, and not a claim about how the town was built (O22 asks whether a later order should follow the true order of the excavation);
- the sun's even pace through the year.

## Measure

Every time is this Mac's. Take the baseline in the same run, run each set twice, and report runs that disagree (`LESSONS.md`).

- At rest in each layer, on High, Medium and Low: the frame rate and GPU time at the nine views.
- During a change of layer, up and down, at views 7, 8 and 9 on all three detail levels: the added GPU time, the lowest frame rate and the slowest single frame.
- JavaScript's memory over a minute of changing layer and date back and forth: it must not grow.
- The page's size by part, before and after each of Parts A, B and C (`npm run size`).

**Do not build a fallback for slower devices on a guess.** Chad takes the iPad reading on the hosted page after the merge, with the Stats button. If a fade is too slow there, that is its own small order.

## Known gaps

- **No iPad.** Say so beside every number.
- **Nobody has watched a fade in motion.** You cannot either: say what you measured and what you saw in stills, and leave the judgement of the movement to Chad.
- **Found is not the excavation as it stands.** The preserved height of each wall is not published (O8), so the excavated buildings are drawn whole.
- **Nothing but the sun changes with the date**, and nothing changes with the year.

## Done when
- `checks/build.sh` prints PASS after each of Parts A, B and C, and each part is its own commit.
- `node checks/views.mjs --views 9 --min-fps 55 --min-scale 60` prints PASS on the released page, and its pictures are published to Thera Views.
- `node tools/terrain/build.mjs` reports E4's added volume at 14.4 km³ or more (or the most the limits allow, with the reason), and writes the same file twice.
- `cd source && npm run size` shows the page under 256 kB, with what each part added. If the three parts together add more than 20 kB, stop and report before going on.
- `node tools/town/shot.mjs` (or a script beside it) shows a change of layer, up and down, holding 55 frames a second at views 7, 8 and 9 on High, Medium and Low, with the numbers in `docs/layers/README.md`.
- `cd source && npm run build:dev` builds a `dev.html` with the chooser panel, and with the spike's placing and second-island prototypes still working.
- `docs/layers/README.md`, `docs/terrain/README.md` and `docs/town/README.md` are complete (`git status` shows nothing uncommitted).
- The chooser page is published to a private artifact named **Thera Layers 004**, and its link is in `docs/layers/README.md` (`grep -n "claude.ai/artifact" docs/layers/README.md`).
- Everything is committed on `task/004-layers-and-time` (`git log --oneline main..HEAD`). Nothing is pushed or merged.
- The final report gives the Result. Never report a visual pass nobody saw: say who looked at what (`AGENTS.md` §6).

If a part cannot be done inside its limits, **stop and report** instead of working around it. A finished Part A with Parts B and C reported as blocked is a good result.

## Out of scope

- Plants, people, animals, interiors, the harbour, labels.
- The sky: stars, the moon, planets, eclipses, and any calendar of the time.
- The eruption, the damaged town and the later island. Nothing in the world is given a real date.
- A year control in the released page.
- Weather, sea or ground that changes with the season.
- Drawing the excavated buildings as ruins.
- Any change to the town's plan, its rules or its look in the opening layer.
- A fallback for slower devices.
- Anything for augmented or virtual reality beyond "Keep the door open".
- The order in which the site was excavated (O22).

## Result
(To be filled in by the worker's report and the integrator.)

## Review
(To be filled in after Chad has looked.)
