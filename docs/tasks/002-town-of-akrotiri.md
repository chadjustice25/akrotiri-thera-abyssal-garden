# 002-town-of-akrotiri: the town at Akrotiri in 1615 BCE, from outside, and walking
**Status:** open · **Branch:** `task/002-town-of-akrotiri`

**Ready to run.** Research lane T2b is back and checked, this order is finished from it, and Chad confirmed its decisions on 2026-11-18 (D18–D20, D22).

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
  "docs/research/verification/T2b.md",
  "docs/research/claude/T2b_Claude.md",
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
Chad's, of 2026-11-18 (D18–D20 and D22 in `docs/DECISIONS.md`).

1. **The excavated part of the town follows the excavated plan.** The streets, squares and buildings that have been dug are archaeological evidence, and the world puts them where they were found. The plan it is drawn from must be one whose licence allows that, and its credit and licence terms travel with the page (standard §5).
   - **The plan is Maximilian Dörrbecker's map on Wikimedia Commons** (D22), the file Chad supplied, under CC BY-SA 2.5. T2b's check clears it for building shapes, with one stated doubt: it is a tracing of a 2005 Thera Foundation web map that carries no terms, which itself looks drawn from the excavators' copyright plan. The check's cautious course is to use it for this public, free page with full credit, and to ask the Akrotiri Excavations for permission before any sale. Their own plan would also be a better one.
2. **Where the evidence ends is recorded and shown.** About 1.2 ha has been excavated, of a town several times that size. Everything outside the excavated walls is reconstruction: built by the same rules as the excavated houses, recorded as a liberty, and marked so that nobody takes it for the excavated town.
   - **The whole town is drawn at about 10 ha, running on to the north and north-east** (D22). The research found no measured edge in any direction. Both published sizes, about 10 ha and about 20 ha, are grade C. The 10 ha figure sits better with the one published sketch of the old shoreline, which puts the sea close on the south, west and east. The 20 ha figure is recorded beside it.
3. **Outsides only, and nobody in them**, in this order. No interiors, wall paintings, furniture, people, animals, plants or ships. The empty town is a liberty and the page says so.
4. **The town is whole and thriving**: 1615 BCE, before the final earthquake (D15, D16). No damage, no rubble, no repairs.
5. **The harbour waits.** None is built in this order.

## Read first
- `AGENTS.md`: the rulebook. The engine laws in §5 hold.
- `HANDOFF.md` and `LESSONS.md`: where things stand, and what work order 001 learned about this engine and this checkout.
- `docs/HISTORICAL_STANDARD.md`: grades, "shown is not present", names (§4.4), liberties (§6).
- `docs/WORLD_CLOCK.md` and `docs/DECISIONS.md`. These decisions shape this order:
  - D11: one file, everything procedural;
  - D12: swim, walk and fly;
  - D15 and D16: the living town, 1615 BCE;
  - D17: the budget is 256 kB. The page is 132 kB now.
- `docs/research/verification/T2b.md`: the plan of the excavated town, its licence, scale and position, and where the evidence ends. Start with its §3 (corrections), §4 (licences) and §6 ("What the build may use"). The claims are in `docs/research/claude/T2b_Claude.md`; cite them as `T2b#45`, only as corrected.
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
   - **The plan.** Draw the excavated part from one file and no other: "File:Map Akrotiri 1600 BC-en.png" on Wikimedia Commons, by Maximilian Dörrbecker, CC BY-SA 2.5 (2,075 × 3,345 px, SHA-1 `cd0dbc4a0107e624b511b7351d8d50497dc55eff`; `T2b#1`–`T2b#5`). Not a copyright plan, and not your memory of one. Write `tools/town/fetch.mjs` to download it into an ignored cache and check that checksum, and a script that turns its yellow wall shapes into outlines, so the tracing can be repeated. Record every correction made by hand.
   - **Its licence** (T2b verification, §4 and §6; standard §5). Record it in `docs/town/README.md` before use. The outlines taken from the map are an adaptation of it, so they are under **CC BY-SA 4.0**, not the engine's MIT licence. Keep them in their own generated file with the notice at its top, and put the credit in the menu and in `README.md`, as for the terrain data. The credit text is in the check's §6, answer 1: use it word for word.
   - **How far to trust it.** It is a simplification of a simplification: right to about 1 m within a building and about 5 m across the site. Each wall from it is grade A that it exists and grade C in its exact line. Say so in the record.
   - **Every building and street in the data says which it is:** `excavated` (drawn from the plan) or `reconstructed` (outside the limit of the excavation, or filled in where the plan has a gap).
   - No ancient name exists for the town, a street or a building (`T2`, "Names"). Every name in the data is a modern excavation label. Nothing a viewer can read may suggest otherwise (standard §4.4).
2. **The ground** (edit E8, liberty T-L6). The terrace is at x −135, z 5937, with a rise at 24 m falling about 5.5% towards the sea.
   - Two levels are sourced, both above today's sea: about 19.5 m at Xeste 3 (`T2#19`) and 18.1–18.2 m for a basement floor (`T2#80`). The 1615 sea is 3.6 m lower (E1), so they stand at about 23.1 m and 21.7–21.8 m in the world.
   - The town grew along the crest of a ridge running north–south, with Delta West and Delta North's entrance on the crest and a sheer slope down to the east at Xeste 4 (`T2b#37`, `T2b#38`).
   - You may reshape the terrace in `tools/terrain/edits.json` to give that ridge, the two sourced levels and streets with gentle gradients to drain along (`T2#11`, `T2#12`). If you do, rebuild the terrain data, check that it still rebuilds byte for byte, and update `docs/terrain/README.md` and its build report.
   - The pre-eruption surface rises towards the south-east coast, up to 30 m above today's sea (`T1c#15`, B). Do not flatten the surroundings to suit the town.
   - **Build no harbour, quay or ship.** The harbour is not located, and two candidates stay open (`T1c#16`, `T1c#17`, `T1c#34`, T1c correction 4).
3. **The layout**, in `tools/town/town.json`.
   - **Scale and north** (T2b verification, corrections 3 and 4). The map is stretched: about 20.4 pixels per metre east–west and about 22.0 north–south. Up on the map is true north, within 3°. It has no scale bar and no north arrow, so both figures are the check's own measurements.
   - **Position.** Centre the excavated walls on 36.35170 N, 25.40345 E, within 10 m (the centre of the modern shelter, from OpenStreetMap: credit it). In the world's metres that is about x −139, z 5914, a little north of the E8 terrace's centre. The walls span about 143 m north–south and 88 m east–west.
   - **What is on the map** (T2b verification, §6, answer 3).
     - Buildings and spaces of the last town: Sector Alpha, the House of the Ladies, the West House, the Delta Complex, Sectors Beta and Gamma, Xeste 2, Xeste 3, Xeste 4, the House of the Anchor (only its front is excavated), Triangle Square and Telchines Street. "Terrace 1" and "Terrace 2" are the terraced Double Horns Square. The "Pylon" is a porch at Delta West's entrance with a room above it, which the map misdraws as a free-standing box (`T2b#45`).
     - Probably of the last town but not excavated (grade C): the "Porter's Lodge" and the "South Building". "Xeste 5" is only a label. Build them as ordinary houses and mark them `reconstructed`.
     - The Cenotaph is a small cairn in an open space of the last town. Its contents are a thousand years older (`T2b#46`). Keep the open space and build no monument.
     - **Modern, and not built:** the visitor path, both border lines and the "Tunnels". "Terrace 3" is unexplained: leave it open ground.
   - **Gaps inside the excavation.** A modern torrent cut through the site from north to south and damaged the buildings on both sides of Dactyls Street (`T2b#53`). The empty strips on the map there are lost evidence, not open ground. Fill them with houses by rule, marked `reconstructed`.
   - **The edge of the evidence.** Record the outline of the excavated walls as a line in the data. Nothing measured exists beyond it in any direction (T2b verification, §6, answer 4).
     - **South and west: build nothing beyond the walls.** A published sketch of the old shoreline, called "indicative" by its author, puts the sea 35–55 m to the south and a bay 10–40 m to the west (`T2b#61`, grade C, as corrected).
     - **East:** the ground falls steeply at Xeste 4 (`T2b#38`). Build little, and only where the ground allows.
     - **North and north-east:** the town may run on, thinning, as grade C. Only the excavator's estimate and the lie of the land support it (`T2b#66`, `T2b#67`).
     - **The whole town is about 10 ha** (decision 2). Its extent beyond the walls, its streets there and its number of houses are liberties.
     - No town wall: no source reports one (`T2b#70`). The outlying finds at Kokkino Vouno and in the Potamos valley are not part of this order.
   - **Mark the difference for the viewer.** The menu says that the centre of the town follows the excavation and the rest is reconstruction. Add a key and a menu switch that draws the edge of the excavated walls on the ground, so anyone can see where the evidence stops.
   - **Fabric:** dense, with no courtyards and no animal enclosures (`T2#8`, `T2#102`). Main streets, narrow alleys and blind alleys run roughly north–south and east–west, and the house walls step in and out along them (`T2#9`). A large public square lies before Xeste 2's stepped north front (`T2b#41`).
   - **Streets:** paved with large flagstones on gradients, over a covered drain that the houses empty into (`T2#11`–`T2#13`, `T2#74`). At least one side street is cobbled (`T2#60`). One alley is about 1.10 m wide (`T2#10`). Widths read off the map are rough: Telchines Street 1.2–2.2 m between wall faces and Triangle Square 8–12 m across (`T2b#35`, grade C, not re-measured by the check). No street gradient is measured.
   - **Raised streets:** the rebuilding after the earthquake of about 1650 spread the rubble in the streets, so old ground floors lie below street level: about 1 m at Delta 16, "a few steps" elsewhere (`T2#11`, `T2#14`, `T2#56`; T2 correction 2). From outside this shows as low ground-floor windows and doors with steps down behind them.
   - **Not this scene:** debris heaped in the streets, propped walls, walled-up doors and beds carried outside (`T2#93`–`T2#96`) belong to the last weeks, after the final earthquake. The world shows a thriving town. Leave them out.
   - **Squares** (modern labels): Triangle Square, Cenotaph Square, Double Horns Square and Millhouse Square (`T2#7`). A stone pithos 1.30 m high stood in Cenotaph Square (`T2#53`).
4. **Houses by rule** (`tools/town/` for the rules, `source/src/world.js` for the generator). The ordinary house is the town's substance. Build a generator, not hundreds of hand-made models.
   - **Footprint:** 96–187 m² of ground (`T2#6`, to verify). Larger buildings cover 300–370 m².
   - **Storeys:** two or three (`T2#86`). No floor-to-floor height is published. 2.5–3 m is the report's own inference (C), so the height you choose is a liberty.
   - **Walls:** fieldstone and earth in a timber frame (`T2#65`, `T2#67`), 0.60–0.80 m thick at ground and first floor (T2 correction 1, axes to verify). Whether the rubble was plastered outside, and in what colour, is not known: your choice is a liberty.
   - **Dressed stone:** off-white tuff frames round doors and windows, tuff string courses, and hard-stone corner blocks (`T2#68`, `T2#69`). Timbers run in the wall at three levels at one reinforced corner, with lintel and sill timbers carried to the corner (`T2#43`).
   - **Entrance:** one per house, usually at a corner, with a window beside it (`T2#14`, `T2#111`; the norm, not every house). One door record is 1.05 wide and 1.95 high as preserved, on an andesite threshold 1.20 × 0.60 × 0.30 m (`T2#39`, `T2#40`, axes to verify). The window beside it is 0.66 × 0.80 (`T2#41`, to verify).
   - **Windows:** small at ground level where the claims describe them (`T2#61`). Upstairs, large windows and walls of piers and windows: two of these at the West House are 3.90 and 4.00 m long with four openings each (`T2#34`, `T2#42`). "Special function" ground floors have one large window under 1 m above the street (`T2#58`).
   - **Roofs:** flat terraces of rammed earth on timber, 10–15 cm thick or about 20 cm (both recorded: T2 correction 6), some with pebbles (`T2#70`). They have parapets and projecting U-shaped terracotta spouts (`T2#73`). One preserved roof slopes 25% to its spout (`T2#72`). At the West House a pipe runs down the wall into the street drain (`T2#74`).
5. **Named buildings**, in `tools/town/town.json`. Give these their sourced height and stone, on the outlines and at the positions the plan gives. Where a sourced footprint and the plan disagree, record both.
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
9. **Viewpoints 1–9** (`POSES` in `source/src/world.js`, the number keys in `source/src/main.js`): what `checks/views.mjs` photographs. **The six island views stay as they are**, and three are added:
   1. the Akrotiri terrace from the sea to its south (unchanged: it now shows the town);
   2. the north bay and Pre-Kameni from the ring rim;
   3. high above the whole island, looking north;
   4. Profitis Ilias summit, looking across the island;
   5. sea level inside the bay;
   6. under water off the south shore;
   7. on foot in the main street of the excavated part;
   8. on foot in a square, facing a dressed-stone front;
   9. over the roofs from the town's north edge, looking across it to the sea.

   Keys `7`, `8` and `9` jump to the new views, and the menu's key list reads "1–9". The views check compares that number with what it was asked for. Rework the `FLY` path to tour the town.
10. **What the page says** (`source/template.html`). The menu tells the viewer that the centre of the town follows the excavated plan and the rest is reconstruction, and that people, plants and interiors are still to come. It carries the credit the plan's licence asks for. No ancient-looking name appears anywhere.
11. **The record**, `docs/town/README.md`:
    - each rule, with its numbers, claim references and grade;
    - every liberty, numbered A-L1, A-L2 and so on, with its reason. The town beyond the limit of the excavation is the first;
    - how to regenerate the town;
    - what you looked at and what you saw at each viewpoint, and who looked.

## Known gaps
- **The plan's chain of rights has a gap** (T2b verification, §4). The Commons map is traced from a Thera Foundation map with no stated terms. Whether share-alike then reaches the whole built page, and not only the outlines, is not settled by the licence's text. Both are questions for before any sale, with a request to the Akrotiri Excavations for their own plan as the remedy. If you find the licence cannot be met inside one self-contained page, stop and report.
- **The laser scan of 2013** (Trinks et al. 2017) is no substitute: its one overview figure is an oblique view that cannot be traced, and the scan data are not public (T2b verification, §5).
- **The old shoreline.** The sketch that puts the sea a few tens of metres from the walls (`T2b#61`) disagrees with the terrain, which keeps today's coast about 200 m to the south (liberty T-L14). Do not move the coast in this order. Record the disagreement; the harbour order will settle it.
- **Greek law on images of monuments** (Law 4858/2021, art. 46) asks for a permit when a faithful image of a monument is spread for profit. A reconstruction that goes beyond the ruins' present state by interpretation falls outside that rule, on the check's reading of the text (research, not legal advice). It matters only before a sale.
- **Not published in any source opened:** storey heights; the thickness of upper walls and partitions; parapet heights; outside plaster and its colour; upper-window sizes and sill heights; the spacing of roof spouts; a unit of length (`T2#105` gives none). Each choice is a liberty.
- **Three books would settle most of these** and several "to verify" marks: Palyvou 1999, 2005 and 2019. None could be opened. Chad is looking for the 2005 book through his university library. If it is obtained and checked while you work, the parameters change, not the code.
- **The lamp counts** in `T2#89` do not add up. Use no number from that row (T2 correction 7).
- **Footprints:** Xeste 3's 283 m² is the excavator's "plot" and the 96–187 and 300–370 m² bands are another author's "ground covered". Do not mix them in one rule without a note (T2 correction 9).
- **The harbour** is not located and waits for a later order (decision 5). The town has no waterfront works.
- **Sound** above the water is still a later order. The town is silent.

## Done when
- `checks/build.sh` prints PASS: `index.html` matches a fresh build, is within 256 kB, and loads nothing at run time.
- `node checks/views.mjs --views 9 --min-fps 55 --min-scale 60` prints PASS on this Mac: all nine viewpoints, each at 55 fps or more and 60% resolution or more. Views 7 and 8 are the test of the town at its densest.
- The views are published to the **Thera Views** artifact (`https://claude.ai/artifact/EAM2iAgZHr4toJ39qt9C9L`) after each run of the views check.
- Walking is shown to work in `dev.html` (`cd source && npm run build:dev`): the viewer lands, walks a street, is stopped by a wall, takes off again, and walks into the sea and swims. Say how you tested each.
- The town regenerates from `tools/town/town.json` to the same result. If E8 changed, `node tools/terrain/build.mjs` still gives the same `terrain-data.js` twice.
- `docs/town/README.md` lists every rule with its claims and every liberty with its reason, names the plan with its licence and its credit, and says where the edge of the excavated walls runs.
- The final report gives the Result. Never report a visual pass nobody saw: say who looked at what (`AGENTS.md` §6).

If the page cannot stay within the budget at a quality worth showing, or the plan's licence cannot be met, **stop and report** instead of working around it.

## Out of scope
Interiors and wall paintings; furniture and other objects, apart from the one stone pithos; people, animals and plants; ships, a harbour or quay; fields, terraces, roads and other settlements outside the town; lamps and fires; sound above the water; the final earthquake, the abandonment and the eruption.

## Result
(Given by the worker in its final report and pasted in by Chad's session: what was built, the gate and views outputs, the size of `index.html`, the number of buildings, the liberties list, how walking was tested, and what was seen at each viewpoint and by whom.)

## Review
(Filled in by Chad's session: what Chad saw, and the decision to merge or not.)
