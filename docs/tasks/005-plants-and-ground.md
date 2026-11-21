# 005-plants-and-ground: what grew on Thera, through the year
**Status:** open · **Branch:** `task/005-plants-and-ground`

Written on 2026-11-21 by the integrator, when the last of the three plant lanes had been checked. Three questions about it are still open (O27): the order is written to their leanings, which are marked **(leaning)** below, and Chad may change them before he starts the session.

```harness-spec
{
 "spec_version": 1,
 "id": "005-plants-and-ground",
 "family": "code",
 "task_type": "procedural-world",
 "status": "open",
 "assignee": {"person": "Chad", "agent": "claude-code", "model": "claude-fable-5-2"},
 "branch": "task/005-plants-and-ground",
 "owns": [
  "index.html",
  "source/src/",
  "source/template.html",
  "source/build.mjs",
  "source/package.json",
  "source/package-lock.json",
  "tools/plants/",
  "docs/plants/",
  ".gitignore"
 ],
 "forbids": [
  "checks/",
  "docs/tasks/",
  "docs/research/",
  "docs/spike/",
  "docs/layers/",
  "docs/opening-page/",
  "docs/terrain/",
  "docs/town/",
  "tools/terrain/",
  "tools/town/",
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
  "docs/layers/README.md",
  "docs/opening-page/README.md",
  "docs/research/verification/T3.md",
  "docs/research/verification/T3b.md",
  "docs/research/verification/T3c_Claude.md",
  "docs/research/verification/T3c.md",
  "docs/research/verification/T3d.md",
  "docs/research/claude/T3c_Claude.md",
  "source/build.mjs",
  "source/template.html",
  "source/src/world.js",
  "source/src/shaders.js",
  "source/src/main.js",
  "source/src/spike-place.js",
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

The island stops being bare. Its ground, its fields and its plants are built from what was found on Thera, and they change through the year as the date is moved.

Three parts, built in this order and committed apart, so that one can be kept if another has to wait:

- **Part A, the ground:** soil, bare rock, and the yearly greening and drying of grass and herbs.
- **Part B, the fields and the trees:** tilled ground and crops near the town and near Fira, and the tree crops and wild trees.
- **Part C, the scrub:** the low shrubs and herbs of the slopes.

A fourth part is offered and may be left out: **Part D, the painted plants**, which would give the Imagined layer its first content.

**The hard requirement is honesty about what is known.** Almost nothing here was measured on a Bronze Age plant. Every size, colour and month is a living plant in today's climate, and where things grew is not recorded anywhere. So each plant and each rule carries its claim and its grade, or is written down as a liberty, and the page's notice says so in plain words.

## Decisions this order rests on

| | |
|---|---|
| D11, D17, D48 | One self-contained page, nothing loaded at run time, 256 kB. The page is 181,122 bytes today |
| D14, D39 | Build work runs on Claude Fable 5.2, effort high, in its own session and worktree. This is the plant order D39 names |
| D26 | Art never places a plant on the island by itself: Theran art is grade B for Thera, and art from elsewhere is grade C |
| D31, D38 | The three layers. A thing's layer follows from the grade or liberty it carries (`docs/HISTORICAL_STANDARD.md` §7) |
| D33 | What grows is built with its yearly cycle, and the date the viewer moves drives it |
| D36 | The world opens in late May of 1628 BCE |
| D42, D43, D46 | The work is for people at the real site, in a headset later, and is to be shown to the excavation's archaeologists. Everything a viewer sees must be fit for them to read |
| O27 | **(leaning)** Which plants are built first, how thick the cover is, and whether the painted plants come now: "Choices for Chad" below |

## Read first
- `AGENTS.md`: the rulebook. Engine law 3 (no per-frame JavaScript allocations) is tested here.
- `HANDOFF.md` and `LESSONS.md`: where things stand, and what five orders learned.
- `docs/ARCHITECTURE.md`: the design. Read §4.2, §4.6, §5, §6, §7 and §11 closely.
- `docs/spike/003-measurements.md`: what placing things on the GPU cost when it was measured.
- `docs/DECISIONS.md`: the decisions in the table above.
- `docs/HISTORICAL_STANDARD.md`, §3, §6 and §7: the grades, the liberties, and how a thing gets its layer.
- `docs/layers/README.md`: the layers, the wave and the date, as work order 004 built them.
- `docs/opening-page/README.md`: the opening page and its notice, as work order 006 left them.
- **The five checks, which are the evidence:** `docs/research/verification/T3.md`, `docs/research/verification/T3b.md`, `docs/research/verification/T3c.md`, `docs/research/verification/T3c_Claude.md` and `docs/research/verification/T3d.md`.
- `docs/research/claude/T3c_Claude.md`, Section 3: the tables of each plant's form and months, to be read only through its check.
- `source/build.mjs`, `source/template.html`, `source/src/world.js`, `source/src/shaders.js`, `source/src/main.js`: the engine.
- `source/src/spike-place.js`: the prototype of placing things on the GPU. **Lift its ideas; do not merge its code.**
- `tools/town/shot.mjs`: it drives `dev.html`, takes pictures and presses keys.
- `checks/build.sh` (the gate) and `checks/views.mjs` (the views check). You may not change either.

## You may change
- `index.html` (rebuilt from the source folder, never edited by hand)
- `source/src/` (the engine)
- `source/template.html` (one sentence of the notice, and a control only if a choice needs one)
- `source/build.mjs`, `source/package.json`, `source/package-lock.json` (build scripts; no runtime dependencies)
- `tools/plants/` (new: the one file of rules and numbers, and its build)
- `docs/plants/` (new: the record)
- `.gitignore`

Everything else belongs to the integrator. If this work shows that one of those files is wrong, say so in the Result. The integrator updates the project's front page and the standard's liberties table from your Result.

## Build

### The evidence to build from

Use the checks, not the reports. Where a check corrects a report, the check wins.

- **Which plants, and at what grade:** `docs/research/verification/T3.md`, `T3b.md`, `T3c.md`, `T3d.md`.
- **Each plant's form and months: `docs/research/verification/T3c_Claude.md` §2, "Usable for building, plant by plant".** Apply its 23 corrections (§3) first. Its classes: (a) usable, (b) usable with the corrections named, (c) not usable yet. **Build nothing from a class (c) cell.** The report's own tables (`docs/research/claude/T3c_Claude.md`, Section 3) hold the numbers; some of their cells are guesses with no mark (the check's §8), and a guess is built only as a recorded liberty.
- **Where cover stood:** `docs/research/verification/T3b.md`, "Where cover stood and how thick" and "Corrections to apply before building".

What that evidence fixes, in short:

| | What is known | Grade |
|---|---|---|
| The soil | Thin, sandy and dark, over dark lava, with red rock exposed beneath it in places. Bare rock or thin soil on steep high slopes | texture A/B; colour a liberty |
| Arable land | The gentle ground round the town was farmland. Near Fira a ploughed layer about 30 cm thick lay under the pumice, with olive trees standing in it | crops A; where the fields lay B; their shapes a liberty |
| The cover | Open scrub with tree crops (olive, almond, pomegranate before the window), and scattered oak, pine and juniper | plants A; "open maquis" B; where each stood C |
| Water | Winter torrents and springs are today's island carried back (B). **The Potamos torrent is modern: do not build it** | B |
| The year | Greenest in December and January, in flower from late March to mid-April, dry by the third week of May, at rest from July to mid-September (lowland Crete) | C |
| Late May | Barley ripe and uncut; vines in flower with no grapes; early figs near ripe; olives past flowering on low ground | C |

**Not known at all:** the spacing of olives, vines or fields; any map of land use; the spread of any tree or shrub; any Bronze Age straw height or fruit size; how vines were trained.

### Part A: the ground
- **The soil the checks describe**, in place of today's bare tone: thin, sandy, dark. Its colour is a liberty (T-L8 already covers the ground's colour; say what changed).
- **Bare rock on steep high slopes** (Davidson, by way of Sarpaki 1987: B).
- **A yearly curve for grass and herbs** on the ground itself, driven by the day of the year: green from November, peak in spring, dry by late May, at rest in high summer. It is the Cretan curve (C), and Thera is drier, so say which way you leaned. The yellow of the Cretan April comes mostly from a broom not known on Thera (the check's correction 8): do not copy it.
- **The Found layer keeps its plain tones.** Plants and living ground belong to Inferred, because none was found growing in its place. If a find spot of the buried olive trees can be placed on the map from an opened source, say so in the Result; do not place them by guess.

### Part B: the fields and the trees
- **Tilled ground and crops** on the gentle ground round the town, and a ploughed field with olive trees standing in it near Fira (B). Crops that are class (a) or (b): six-row barley, the wheats, *Lathyrus clymenum*, pea. Sown in autumn; in late May the barley stands ripe and uncut.
- **Tree crops:** olive, fig, almond.
- **Wild trees, scattered:** kermes oak, a deciduous oak (as a named stand-in), an Aleppo or brutia pine (not an umbrella pine), Phoenician juniper, terebinth, mastic, tamarisk, and giant reed on wet ground.
- **Vines (leaning):** low free-standing bushes, as a recorded liberty, because how they were trained is unknown. No basket-trained vines: that way of training is modern.
- **No terrace walls, no field walls and no check-dams**: none is attested.

### Part C: the scrub
- The low shrubs and herbs of the slopes that are class (a) or (b): thyme, savory, thorny burnet, *Thymelaea*, asphodel, lavender (its species is open), sharp rush on wet ground.
- Each follows its own months: thyme flowers in June and drops its leaves in late summer; asphodel flowers from January to April.

### Part D, offered: the painted plants
Crocus, white lily, sea daffodil and myrtle have checked forms and months, and are known on Thera only from wall paintings (B). By the standard they belong to the **Imagined** layer. Building them would give that layer its first content, so its button would no longer read "to come". **(leaning)** Build Parts A to C first; build D only if they are done inside the budget, and say plainly in the page that these four are shown in paintings and were not found.

### How it is built
- **Rules, not data** (`docs/ARCHITECTURE.md` §4.2 and §7). Where a thing grows is a rule over the land the page already holds: slope, height, the lie of the ground, distance from the shore and from the town. Store no map of plants.
- **One file holds every rule and every plant's numbers**, in `tools/plants/`, each with its claim (`T3c_Claude#…`, as corrected) or its liberty number, as `tools/terrain/edits.json` and `tools/town/town.json` do. A later research result changes a number there, not the code.
- **The GPU places everything numerous.** The spike measured it (`docs/spike/003-measurements.md`; `source/src/spike-place.js`, which runs in the development build with key `P`). Lift its ideas, not its code. Placing is nearly free and drawing is the cost: 50,000 drawn things cost 0.1 to 2.2 ms, 200,000 cost 1 to 6 ms.
- **Each plant is a recipe with a few dials** (height, spread, habit, leaf, the colour of each state), not a stored model.
- **The year:** the same day of the year that moves the sun moves every plant and the ground. It glides, as the hour does. Nothing is rebuilt or paused when the date changes.
- **Layers:** plants fade in and out with their layer by the same visibility function, and take their turn in the wave.
- **Take no code from any fork** of the engine unless its licence has been read and recorded in `docs/plants/README.md`. The methods are standard; write them fresh.
- **The texture limit:** the ground's shader is at 14 of 16 (`docs/ARCHITECTURE.md` §11).

### Keep the door open (D43)
As in work order 004: one camera, read by every pass; flat-screen effects named in the record; controls as plain functions; true scale and place.

### The page's words
- The notice says today that plants "are still to come". Change that sentence, and add what a viewer must know: that the plants are modern stand-ins for what was found as seeds, wood and charcoal; that where they grow is a rule, not a record; and which liberties were taken. Change no other sentence of the notice, and no licence text.
- Use modern plant names only. No ancient name of any plant is known.

### Choices for Chad: one small chooser, not a gallery
In `dev.html`, a small panel names each choice and the option in force. Publish one page to a new private artifact named **Thera Plants 005**: each choice defined in one sentence, its options side by side, the cost and the drawback beside each, and your recommendation. Twelve pictures at most. Build your recommendation into the released page.

1. **How thick the cover is.** No source gives a density. The analogues range from under 15% shrub cover (Marathon) to 60–100% total cover (Antikythera). Offer three.
2. **How the ground looks in late May**, the opening day: how dry and how gold.
3. **A viewer and a tree:** walk through it, or be stopped by its trunk.

## Measure
Every time is this Mac's. Take the baseline in the same run, run each set twice, and report runs that disagree.
- The nine views on High, Medium and Low, at rest: frame rate and GPU time, against `main`.
- A change of layer and a sweep of the date through the year, at views 1, 4 and 9: the slowest frame and the lowest frame rate.
- How many things are placed and how many drawn, at each view and detail level.
- JavaScript's memory over a minute of changing date and layer: it must not grow.
- The page's size by part, before and after each of Parts A, B and C.

## Known gaps
- **No iPad and no phone.** Say so beside every number.
- **Every form and month is a modern stand-in** (C). Say so in the record, plant by plant, with the region each figure is from.
- **Where things grow is a liberty**, as is every density.
- **No spread is sourced** for any tree or shrub: each is a liberty.

## Done when
- `checks/build.sh` prints PASS after each part, and each part is its own commit.
- `node checks/views.mjs --views 9 --min-fps 55 --min-scale 60` prints PASS on the released page, and its pictures are published to Thera Views.
- `cd source && npm run size` shows the page under 256 kB, with what each part added. **If Parts A to C together add more than 30 kB, stop and report before going on.**
- `tools/plants/` holds the one file of rules and numbers, and a build that writes the same output twice.
- `docs/plants/README.md` is complete: every plant built, with its grade on Thera, the claim behind each number, and the region it comes from; every rule of where things grow, with its claim or liberty; every new liberty, with its reason; the measurements; and who looked at what.
- The chooser page is published to a private artifact named **Thera Plants 005**, and its link is in `docs/plants/README.md`.
- Everything is committed on `task/005-plants-and-ground`. Nothing is pushed or merged.
- The final report gives the Result. Never report a visual pass nobody saw: say who looked at what (`AGENTS.md` §6).

If a part cannot be done inside its limits, **stop and report** instead of working around it. A finished Part A with the others reported as blocked is a good result.

## Out of scope
- Animals, people, interiors, the harbour, labels.
- Any plant whose cell in the check is class (c): flax, coriander, garlic, henbane, papyrus, palms, ivy, common reed; and the months of most pulses, pear and tamarisk.
- Chestnut and alder as growing trees: their wood may have been brought in.
- The plants that arrived later and must not appear: prickly pear, agave, citrus, tomato, eucalyptus, maize.
- Terraces, field walls, threshing floors, presses, and anything else built by people in the fields.
- Wind in the leaves, beyond what the engine already does; weather; a sea or a sky that changes with the season.
- The Found layer appearing in the order of the dig (D44, D49), the visitor's position (D45), use without a connection (D47).
- Any change to the land, the town, the layers' rules or the opening page.

## Result
(To be filled in by the worker's report and the integrator.)

## Review
(To be filled in after Chad has looked.)
