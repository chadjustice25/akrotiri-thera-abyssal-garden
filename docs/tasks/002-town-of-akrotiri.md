# 002-town-of-akrotiri: the town at Akrotiri in 1615 BCE, from outside, and walking
**Status:** open · **Branch:** `task/002-town-of-akrotiri`

**Not to be run yet.** This is a draft: Chad first confirms the three decisions under "Decisions this order rests on".

```harness-spec
{
 "spec_version": 1,
 "id": "002-town-of-akrotiri",
 "family": "code",
 "task_type": "procedural-world",
 "status": "open",
 "assignee": {"person": "Chad", "agent": "claude-code", "model": "claude-fable-5-2"},
 "branch": "task/002-town-of-akrotiri",
 "owns": [
  "index.html",
  "source/src/",
  "source/template.html",
  "source/build.mjs",
  "source/package.json",
  "source/package-lock.json",
  "tools/town/",
  "tools/terrain/",
  "docs/town/",
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
  "HANDOFF.md",
  "LESSONS.md",
  "docs/HISTORICAL_STANDARD.md",
  "docs/WORLD_CLOCK.md",
  "docs/DECISIONS.md",
  "docs/research/verification/T2.md",
  "docs/research/claude/T2_Claude.md",
  "docs/research/verification/T1c.md",
  "docs/terrain/README.md",
  "tools/terrain/edits.json",
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
Put **the town at Akrotiri** on the terrace that work order 001 prepared, as it stood in **1615 BCE** (D16): the living town at its fullest, rebuilt after the earthquake of about 1650 and not yet struck by the final one (D15). Build it **from the outside**: streets, squares and buildings, seen from the sea, from the air and on foot. Add **walking** (D12), so the viewer can come down out of the air and go through the streets.

The bar is the same as for the island (D14): visually engrossing and smooth, with every wall, roof and street traceable to a checked claim or a recorded liberty. A viewer who knows the site should recognise how Akrotiri was built. A viewer who does not should not be misled about what is known.

**How to run it:** a fresh Claude Code session on **Claude Fable 5.2**, at effort **`high`** (D14). Raise it to `xhigh` only for the hardest shader and lighting passes, and only when the views check shows a gain. Nothing from any chat is assumed.

**Work in your own worktree**, so that other sessions writing in the main checkout cannot get into your commits (`LESSONS.md`, work order 001):
```sh
git worktree add ../akrotiri-thera-002 -b task/002-town-of-akrotiri main
cd ../akrotiri-thera-002 && (cd source && npm ci)
```
Stage files by path, never with `git add -A`. Commit as you go. Do not push or merge: both are Chad's.

**The Result comes back in your final report**, under the headings the Result section names. The work-order folder is closed to you, this order included, so that no worker can change its own gate; Chad's session pastes the Result in.

## Decisions this order rests on
Chad confirms these before the run. If one changes, the order changes with it.

1. **The street plan is drawn for this world and recorded as a liberty.** No plan of the town may be traced or digitised: the published plans are copyright, the TiMMA records need the director's agreement, and the 2013 laser scan is not public (T2 verification, §4; standard §5). The layout follows what the checked claims say in words and is otherwise invented. The other course, asking the excavation for permission, stays open for later.
2. **The town covers about 10 ha**, the more modest of the two published estimates (`T2#2`, grade C; the other is about 20 ha, `T2#3`). Its edges are unknown and are a liberty.
3. **Outsides only, and nobody in them.** No interiors, wall paintings, furniture, people, animals, plants or ships in this order. The empty town is a liberty and the page says so.

## Read first
- `AGENTS.md`: the rulebook. The engine laws in §5 hold.
- `HANDOFF.md` and `LESSONS.md`: where things stand, and what work order 001 learned about this engine and this checkout.
- `docs/HISTORICAL_STANDARD.md`: grades, "shown is not present", names (§4.4), liberties (§6).
- `docs/WORLD_CLOCK.md` and `docs/DECISIONS.md`. These decisions shape this order:
  - D11: one file, everything procedural;
  - D12: swim, walk and fly;
  - D15 and D16: the living town, 1615 BCE;
  - D17: the budget is 256 kB. The page is 132 kB now.
- `docs/research/verification/T2.md`: the checked claims about the town, **its corrections (§3) and its gaps (§4)**. A claim is used only as corrected there. Four regrades matter: `T2#15` is B, `T2#16` is C, and the storey parts of `T2#24` and `T2#110` are B.
- `docs/research/claude/T2_Claude.md`: the claims themselves. Cite them as `T2#30`.
- `docs/research/verification/T1c.md`, rows 15–17 and 34 and correction 4: the ground under the town and the harbour question.
- `docs/terrain/README.md` and `tools/terrain/edits.json`: how the island is built, and edit E8, the terrace.
- `README.md` ("Make it your own"), `source/src/main.js`, `source/src/world.js` and `source/src/shaders.js`: the engine you are changing.
- `checks/build.sh` (the gate) and `checks/views.mjs` (the views check). You may not change either.

## You may change
- `index.html` (rebuilt from the source folder, never edited by hand)
- `source/src/` (engine code, and generated town data if you generate any)
- `source/template.html` (menu text)
- `source/build.mjs`, `source/package.json`, `source/package-lock.json` (build scripts; no runtime dependencies)
- `tools/town/` (the town's rules and parameters, and any script that turns them into data)
- `tools/terrain/` and `docs/terrain/` (**only** to adjust edit E8, the terrace, and to record that change)
- `docs/town/` (the record of the town: rules, claims, liberties)
- `README.md` (the fork note only; keep upstream's text below it)
- `.gitignore`

## Build
1. **The town's rules, as data.** Write `tools/town/town.json`: every rule and number the town is built from, each with its claim references and grade, or a liberty number. A later research result should change a number there, not the code. Generation must be deterministic: the same rules give the same town, byte for byte if you bake it into `source/src/`.
   - Use **no published plan**: not traced, not digitised, not redrawn from memory. What a checked claim says in words about where things stand may be used. Anything about the arrangement that no checked claim states is a liberty, and the record says so.
   - No ancient name exists for the town, a street or a building (`T2`, "Names"). Every name in the data is a modern excavation label. Nothing a viewer can read may suggest otherwise (standard §4.4).
2. **The ground** (edit E8, liberty T-L6). The terrace is at x −135, z 5937, with a rise at 24 m falling about 5.5% towards the sea.
   - Two levels are sourced, both above today's sea: about 19.5 m at Xeste 3 (`T2#19`) and 18.1–18.2 m for a basement floor (`T2#80`). The 1615 sea is 3.6 m lower (E1), so they stand at about 23.1 m and 21.7–21.8 m in the world.
   - You may reshape the terrace in `tools/terrain/edits.json` so the streets have gentle gradients to drain along (`T2#11`, `T2#12`). If you do, rebuild the terrain data, check that it still rebuilds byte for byte, and update `docs/terrain/README.md` and its build report.
   - The pre-eruption surface rises towards the south-east coast, up to 30 m above today's sea (`T1c#15`, B). Do not flatten the surroundings to suit the town.
   - **Build no harbour, quay or ship.** The harbour is not located, and two candidates stay open (`T1c#16`, `T1c#17`, `T1c#34`, T1c correction 4).
3. **The layout**, in `tools/town/town.json` (the largest liberty: T2 verification, §4).
   - **Extent:** about 10 ha (`T2#2`, C). About 35 houses stand in the excavated hectare (`T2#1`, `T2#5`), which suggests some 350 for the whole town. That count is an inference and a liberty.
   - **Fabric:** dense, with no courtyards and no animal enclosures (`T2#8`, `T2#102`). Main streets, narrow alleys and blind alleys run roughly north–south and east–west, and the house walls step in and out along them (`T2#9`).
   - **Streets:** paved with large flagstones on gradients, over a covered drain that the houses empty into (`T2#11`–`T2#13`, `T2#74`). At least one side street is cobbled (`T2#60`). One alley is about 1.10 m wide (`T2#10`). No other street or square width is published, so the rest are liberties.
   - **Raised streets:** the rebuilding after the earthquake of about 1650 spread the rubble in the streets, so old ground floors lie below street level: about 1 m at Delta 16, "a few steps" elsewhere (`T2#11`, `T2#14`, `T2#56`; T2 correction 2). From outside this shows as low ground-floor windows and doors with steps down behind them.
   - **Not this scene:** debris heaped in the streets, propped walls, walled-up doors and beds carried outside (`T2#93`–`T2#96`) belong to the last weeks, after the final earthquake. The world shows 1615 BCE. Leave them out.
   - **Squares** (modern labels): Triangle Square, Cenotaph Square, Double Horns Square and Millhouse Square (`T2#7`). A stone pithos 1.30 m high stood in Cenotaph Square (`T2#53`).
4. **Houses by rule** (`tools/town/` for the rules, `source/src/world.js` for the generator). The ordinary house is the town's substance. Build a generator, not 350 hand-made models.
   - **Footprint:** 96–187 m² of ground (`T2#6`, to verify). Larger buildings cover 300–370 m².
   - **Storeys:** two or three (`T2#86`). No floor-to-floor height is published. 2.5–3 m is the report's own inference (C), so the height you choose is a liberty.
   - **Walls:** fieldstone and earth in a timber frame (`T2#65`, `T2#67`), 0.60–0.80 m thick at ground and first floor (T2 correction 1, axes to verify). Whether the rubble was plastered outside, and in what colour, is not known: your choice is a liberty.
   - **Dressed stone:** off-white tuff frames round doors and windows, tuff string courses, and hard-stone corner blocks (`T2#68`, `T2#69`). Timbers run in the wall at three levels at one reinforced corner, with lintel and sill timbers carried to the corner (`T2#43`).
   - **Entrance:** one per house, usually at a corner, with a window beside it (`T2#14`, `T2#111`; the norm, not every house). One door record is 1.05 wide and 1.95 high as preserved, on an andesite threshold 1.20 × 0.60 × 0.30 m (`T2#39`, `T2#40`, axes to verify). The window beside it is 0.66 × 0.80 (`T2#41`, to verify).
   - **Windows:** small at ground level where the claims describe them (`T2#61`). Upstairs, large windows and walls of piers and windows: two of these at the West House are 3.90 and 4.00 m long with four openings each (`T2#34`, `T2#42`). "Special function" ground floors have one large window under 1 m above the street (`T2#58`).
   - **Roofs:** flat terraces of rammed earth on timber, 10–15 cm thick or about 20 cm (both recorded: T2 correction 6), some with pebbles (`T2#70`). They have parapets and projecting U-shaped terracotta spouts (`T2#73`). One preserved roof slopes 25% to its spout (`T2#72`). At the West House a pipe runs down the wall into the street drain (`T2#74`).
5. **Named buildings**, in `tools/town/town.json`. Give these their sourced footprint, height and stone, placed as the claims say in words. Their exact positions are liberties.
   - **Xeste 3:** three storeys on a 283 m² plot. Its east part has a façade of dressed ignimbrite with large windows; its west part is rubble (`T2#19`, `T2#20`). Benches stand outside its entrance (`T2#22`).
   - **Xeste 4:** about 367 m², over 30 m long from north-west to south-east, in courses of whitish dressed tuff, entered from Curetes Street (`T2#24`, `T2#25`). Build three storeys. "Probably more" in its east wing is grade B.
   - **West House:** free-standing on the north side of Triangle Square (`T2#30`). Two storeys are certain and a partial third is inferred, grade B (T2 correction 3). It has a very large south window on the first floor (`T2#32`) and pier-and-window walls on the west and north of its corner room (`T2#34`, `T2#42`).
   - **House of the Ladies:** three storeys on 184 m², on the west side of Dactyls Street (`T2#44`). It has the town's one known light-well (`T2#45`).
   - **Complex Delta:** four separate houses with their own entrances and double walls between them (`T2#48`). Delta 15 has a door-and-window front on Millhouse Square (`T2#55`). Delta 16 is one low storey on the street, with its window sill 10 cm above the paving (`T2#56`). Stone horns "seem to have crowned" the entrance of Delta East, by Double Horns Square: grade B, so add them only if the record says so (`T2#49`).
   - **Also named, with less known:** the Pithoi Storeroom, long from north to south and entered from a cobbled side street (`T2#59`, `T2#60`); Complex Beta (`T2#61`); Building Gamma, oblong, on Telchines Street (`T2#63`). Xeste 2 has no published plan or size.
   - **No palace.** None has been found (`T2#18`, `T2#64`). Do not build one.
6. **Materials and light** (`source/src/shaders.js`, `source/src/main.js`). No colour of any wall, roof or paving is sourced, so **every colour is a liberty**. Let the materials carry the look: grey-brown rubble and earth, off-white tuff, dark hard stone, earth roofs, stone paving.
   - Streets about a metre wide between three-storey walls need local shadow. The island's single shadow map (about 9 m per texel) cannot give it, so add shadows that hold at street scale near the camera.
   - Keep all six times of day working. Night is unlit: lamps exist (`T2#88`) but belong to interiors and people.
7. **Level of detail** (`source/src/main.js`, `source/src/shaders.js`). The town must read from 10 km in the air (view 3), from a boat's distance (view 1) and at arm's length on foot, with no visible popping between them. No per-frame allocations. Low, Medium and High all work.
8. **Walking** (`source/src/main.js`; D12).
   - Coming down onto the ground puts the viewer on foot: the camera follows the ground and the paving at eye height, and walls stop it. Going up (`E` or `Space`) takes off again. Walking into the sea becomes swimming. Chad's keys stay: `Space` and `E` up, `X` and `Q` down.
   - Eye height and walking pace are liberties. A horizon of about 1.50 m was read from one room's paintings, but that is an architect's analysis, grade B (`T2#35`, T2 correction 4).
   - Buildings are solid from every side, roofs included. There is no going indoors.
   - Keep the touch controls working, and show the mode's keys in the menu.
9. **Viewpoints 1–6** (`POSES`): what `checks/views.mjs` photographs.
   1. the town from the sea to its south;
   2. the north bay and Pre-Kameni from the ring rim (unchanged: it guards the island against regressions);
   3. high above the whole island, looking north (unchanged);
   4. on foot in a main street;
   5. on foot in a square, facing a dressed-stone front;
   6. over the roofs from the town's north edge, looking across it to the sea.

   The old views 4 (Profitis Ilias) and 6 (under water) leave the six. Take a picture of each with the dev tools and say in the Result what you saw. Rework the `FLY` path to tour the town.
10. **What the page says** (`source/template.html`). The menu tells the viewer that the town's street plan is a reconstruction drawn for this world and not the excavated plan, and that people, plants and interiors are still to come. No ancient-looking name appears anywhere.
11. **The record**, `docs/town/README.md`:
    - each rule, with its numbers, claim references and grade;
    - every liberty, numbered A-L1, A-L2 and so on, with its reason. The layout is the first;
    - how to regenerate the town;
    - what you looked at and what you saw at each viewpoint, and who looked.

## Known gaps
- **No plan geometry may be used**, and no street or square width is published beyond one alley. See decision 1.
- **Not published in any source opened:** storey heights; the thickness of upper walls and partitions; parapet heights; outside plaster and its colour; upper-window sizes and sill heights; the spacing of roof spouts; a unit of length (`T2#105` gives none). Each choice is a liberty.
- **Three books would settle most of these** and several "to verify" marks: Palyvou 1999, 2005 and 2019. None could be opened. If one is obtained and checked while you work, the parameters change, not the code.
- **The lamp counts** in `T2#89` do not add up. Use no number from that row (T2 correction 7).
- **Footprints:** Xeste 3's 283 m² is the excavator's "plot" and the 96–187 and 300–370 m² bands are another author's "ground covered". Do not mix them in one rule without a note (T2 correction 9).
- **The harbour** is not located. The town simply ends; it has no waterfront works.
- **Sound** above the water is still a later order. The town is silent.

## Done when
- `checks/build.sh` prints PASS: `index.html` matches a fresh build, is within 256 kB, and loads nothing at run time.
- `node checks/views.mjs --min-fps 55 --min-scale 60` prints PASS on this Mac: all six viewpoints, each at 55 fps or more and 60% resolution or more. Views 4 and 5 are the test of the town at its densest.
- The views are published to the **Thera Views** artifact (`https://claude.ai/artifact/EAM2iAgZHr4toJ39qt9C9L`) after each run of the views check.
- Walking is shown to work in `dev.html` (`cd source && npm run build:dev`): the viewer lands, walks a street, is stopped by a wall, takes off again, and walks into the sea and swims. Say how you tested each.
- The town regenerates from `tools/town/town.json` to the same result. If E8 changed, `node tools/terrain/build.mjs` still gives the same `terrain-data.js` twice.
- `docs/town/README.md` lists every rule with its claims and every liberty with its reason.
- The final report gives the Result. Never report a visual pass nobody saw: say who looked at what (`AGENTS.md` §6).

If the page cannot stay within the budget at a quality worth showing, or the town cannot be built without a published plan, **stop and report** instead of working around it.

## Out of scope
Interiors and wall paintings; furniture and other objects, apart from the one stone pithos; people, animals and plants; ships, a harbour or quay; fields, terraces, roads and other settlements outside the town; lamps and fires; sound above the water; the final earthquake, the abandonment and the eruption.

## Result
(Given by the worker in its final report and pasted in by Chad's session: what was built, the gate and views outputs, the size of `index.html`, the number of buildings, the liberties list, how walking was tested, and what was seen at each viewpoint and by whom.)

## Review
(Filled in by Chad's session: what Chad saw, and the decision to merge or not.)
