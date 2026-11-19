# The town record

How the town at Akrotiri in **1615 BCE** (high chronology, D16) is built: the plan it follows and that plan's licence, where the evidence ends, every rule with its claims, every liberty, how to make the town again, how walking was tested, and what was looked at. Written for work order 002 (`docs/tasks/002-town-of-akrotiri.md`).

Claim references are lane and row (`T2#30`, `T2b#45`, `T1c#15`), used only as corrected in `docs/research/verification/`. The numbers come from `docs/town/build-report.json`, which `tools/town/build.mjs` writes on every run. Every rule and number is a parameter in `tools/town/town.json`.

**What this is not.** It is not a survey of the site and not the excavators' plan. The centre of the town follows a simplified public map of the excavation; everything else is built by rule. It shows the town from outside only, whole and lived in (D15, D19), and empty: nobody is in it yet.

**Names.** No ancient name is known for the town, a street, a square or a building (T2, "Names"). Akrotiri is the modern village's name. Every label here and in the data (West House, Xeste 3, Telchines Street, Triangle Square and the rest) is a modern excavation label, or the plan's own where it has no other. The page shows none of them in the world and says so in its menu.

## 1. The plan and its licence

Recorded before use (standard §5). Research lane T2b checked the plan and its terms (`docs/research/verification/T2b.md`, §4 and §6). That is research, not legal advice.

| | |
|---|---|
| Plan | "Akrotiri in the Bronze Age, about 1600 B.C.", file "Map Akrotiri 1600 BC-en.png" on Wikimedia Commons (T2b#1–T2b#5) |
| Author | Maximilian Dörrbecker (Commons user Chumwa), 2007 |
| Page | <https://commons.wikimedia.org/wiki/File:Map_Akrotiri_1600_BC-en.png> |
| File | 2,075 × 3,345 px, 541,796 bytes, SHA-1 `cd0dbc4a0107e624b511b7351d8d50497dc55eff`. `tools/town/fetch.mjs` downloads it into `tools/town/cache/` (ignored by git) and refuses any other file. |
| Licence | Creative Commons Attribution-ShareAlike 2.5 Generic, <https://creativecommons.org/licenses/by-sa/2.5/> |
| Allows | Copying and adapting, with credit |
| Requires | Credit to the author, the title and the link; a note of how the work was used; and that an adaptation goes out under the same licence or a later version of it (T2b#7, T2b#8) |
| What is taken from it | The positions of its yellow wall shapes, and nothing else: no label, colour or drawing |
| Licence of what is made from it | **CC BY-SA 4.0**, <https://creativecommons.org/licenses/by-sa/4.0/>. This covers `tools/town/traced.json`, `source/src/town-data.js` and the copy of that data inside `index.html`. They are **not under the MIT licence** of the engine. |

**The credit**, word for word from the T2b check (§6, answer 1). It is in the page's menu, in `README.md`, at the top of `source/src/town-data.js` and in `tools/town/traced.json`:

> Excavated walls of Akrotiri digitised, rescaled, georeferenced and reinterpreted from "Akrotiri in the Bronze Age, about 1600 B.C." (File:Map Akrotiri 1600 BC-en.png) by Maximilian Dörrbecker, Wikimedia Commons, https://commons.wikimedia.org/wiki/File:Map_Akrotiri_1600_BC-en.png, licensed CC BY-SA 2.5 (https://creativecommons.org/licenses/by-sa/2.5/). Dörrbecker drew it from a Thera Foundation web map (2005) and other sources. This derived data is licensed CC BY-SA 4.0 (https://creativecommons.org/licenses/by-sa/4.0/).

**The plan's position** comes from one point of OpenStreetMap: the centre of the modern shelter over the site (way 299988161). No OpenStreetMap geometry is copied. The credit, also in the menu and `README.md`: "The plan is placed on the centre of the modern shelter over the site, measured from OpenStreetMap (way 299988161), © OpenStreetMap contributors, Open Database License (https://www.openstreetmap.org/copyright)."

**The doubts, which stay open** (T2b verification, §4):
- **The chain of rights has a gap.** Dörrbecker's walls are a tracing of a Thera Foundation web map of 2005 that carries no terms, and that map looks drawn from the excavators' own plan, which is copyright. D22 accepts the map for this free public page, with full credit. **Before any sale**, the Akrotiri Excavations are to be asked for permission and for their own plan.
- **How far share-alike reaches.** The outlines are kept in their own generated file with their notice, and the engine's code sits beside them. Whether the whole built page must then be under CC BY-SA is not settled by the licence's text.
- **Greek law on images of monuments** (Law 4858/2021, art. 46) matters only before a sale (T2b verification, §4).

The licence could be met inside one self-contained page: the data is its own block with its own notice, and the credit travels in the menu.

**How far to trust the plan.** It is a simplification of a simplification: right to about 1 m within a building and about 5 m across the site. **Each wall drawn from it is grade A that it exists and grade C in its exact line.** It has no scale bar and no north arrow, so its scale and north are the T2b check's own measurements (corrections 3 and 4):

| | Value | Source |
|---|---|---|
| Scale, east–west | 20.4 px per metre (20.0–20.9) | T2b verification, correction 3 |
| Scale, north–south | 22.0 px per metre (21.6–22.4): the plan is stretched | the same |
| North | up on the plan, within 3° | correction 4 |
| Centre of the drawn walls | 36.35170 N, 25.40345 E, within 10 m; in the world's metres x −139, z 5914 | correction 1; OpenStreetMap |
| The drawn walls span | 87.8 m east–west by 143.4 m north–south (measured by `trace.mjs`; the check gives about 88 by 143) | T2b#30 |

## 2. How to make the town again

```sh
node tools/town/fetch.mjs      # once: downloads the plan into tools/town/cache/ and checks its SHA-1
node tools/town/trace.mjs      # the plan and town.json -> tools/town/traced.json
node tools/town/build.mjs      # town.json, traced.json and the terrain -> source/src/town-data.js and docs/town/build-report.json
cd source && npm run build     # then rebuild index.html (also: npm run town)
```

- The tools need Node 22 and nothing else. `png.mjs` reads the plan, `lib.mjs` holds the geometry, `--preview DIR` on either tool writes pictures to look at.
- **The output is deterministic.** The same plan and the same `town.json` give the same `traced.json`; the same `town.json`, `traced.json` and terrain give the same `town-data.js`, byte for byte (checked by running both tools again and comparing; the data's sha256 is in the build report). The page then builds each house from the data with the house's own fixed dice, so the same data gives the same town.
- `traced.json` is committed, so the town can be rebuilt without the plan. The plan itself is never committed.
- The town depends on the terrain: `build.mjs` reads the ground from `source/src/terrain-data.js`. Rebuild the town after any change to the terrain.
- `tools/town/shot.mjs` drives `dev.html` in headless Chrome: development pictures, and the scripted moves that test walking (§8). It is not a check.

**What is automatic and what is by hand.**
- *Automatic:* `trace.mjs` finds the plan's yellow wall shapes (the exact colour 245, 211, 103, with its black outline; the legend's own yellow box is left out), separates the thick strokes (building walls) from the thin double lines (terrace edges and drains), turns them into outlines, and derives the edge of the excavated walls (§3).
- *By hand, and recorded in `town.json`:* which walls belong to one building. Each building has a **region** (`buildings[].regionPx`, in plan pixels). **A building's outline is the convex hull of the plan's walls inside its region**, plus any points added where the plan draws no wall (`addPx`). The script then measures every edge of every outline against the traced walls: an edge counts as standing on a drawn wall where a wall lies within 0.8 m of it. The share of each outline on drawn walls is in `traced.json`, in the build report and in the table of §4.
- A building is **`excavated`** when at least half of its outline stands on drawn walls, and **`reconstructed`** otherwise, or where the work order or the record fixes it (`masses[].status`).
- The tools stop if two outlines overlap, if a region is not convex, or if an added point lies outside its region.

**Corrections made by hand to what the plan draws** (all in `town.json`):
- **The "Pylon".** The plan draws it as a free-standing painted box in Triangle Square. It is a porch added to protect Delta West's entrance, with a room above it (T2b#45, T2#54), so it is placed against the row of blocks at that entrance, as a small two-storey mass open to the square.
- **The Cenotaph.** The plan draws a block. It is a small cairn holding objects a thousand years older (T2b#46). The open space is kept and nothing is built.
- **"Terrace 3"** is unexplained and is left open ground. "Terrace 1" and "Terrace 2" are the terraces of Double Horns Square (T2b#47) and are built as two low paved platforms.
- **Modern things are not built:** the visitor path, both border lines and the "Tunnels" (T2b#54).
- **"Porter's Lodge", "South Building" and "Xeste 5"** are built as ordinary houses and marked `reconstructed`, as the work order says (T2b#50, grade C).
- **My first reading of coordinates off the plan by eye was wrong in places by 2–5 m.** That is why outlines are now taken from the plan's own walls inside a region, and not typed in.

## 3. Where the evidence ends

**The edge of the excavated walls** is a line in the data (`edge` in `traced.json`, 97 points; also in `town-data.js`). It is the outline of the walls the plan draws, joined across gaps narrower than 14 m. It encloses 4,638 m².
- It starts at Sector Alpha in the north (z about 5848), runs down the east side past the wall stubs on Dactyls Street, Complex Delta's east house and Xeste 2's north front (the easternmost point, x about −95), and reaches Xeste 4 in the south-east (the southernmost, z about 5986).
- It comes back west along the "South Building" and the buildings south of Curetes Street, crosses to Xeste 3 (the westernmost, x about −183), and goes north up the west side: Building Gamma, the east side of Telchines Street, the front of the House of the Anchor, the West House and the House of the Ladies, to Alpha.
- **Nothing measured exists beyond it in any direction** (T2b verification, §6, answer 4): no trench, core or survey fixes the town's edge, and no source reports a town wall (T2b#70).

**How the viewer is told.** The menu says that the centre follows the excavated plan and the rest is reconstruction. Key `L`, or the menu's switch, **draws the edge on the ground** as an orange line and shows every reconstructed building pale and plain, while the excavated ones keep their materials.

**Beyond the edge** (D22; T2b verification, §6, answers 4 and 5):

| Direction | What is built | Why |
|---|---|---|
| South | Nothing beyond the walls | The one published sketch of the old shore, "indicative" by its author's word, puts the sea 35–55 m away (T2b#61, grade C) |
| West | Nothing beyond the walls | The same sketch puts a bay 10–40 m away (T2b#61, grade C) |
| East | Eight houses, where the ground allows | The ground falls at Xeste 4 (T2b#38) |
| North and north-east | The town runs on, thinning towards its edge | The excavator's estimate and the lie of the land only (T2b#66, T2b#67, grade C) |

**The whole town is 9.95 ha** by the build report (aim: about 10 ha, D22). Both published sizes are grade C: about 10 ha (T2#2) and about 20 ha (T2#3, T2b#66). The 20 ha figure is recorded in `town.json` beside the one used.

**A disagreement, recorded for the harbour order.** The sketch that puts the sea a few tens of metres from the walls (T2b#61) disagrees with the terrain, which keeps today's coast, moved only by the sea-level change: about 350 m south of the walls (terrain liberty T-L14). This order does not move the coast. No harbour, quay or ship is built (D19; T1c#16, T1c#17, T1c#34).

## 4. The excavated part

43 masses stand on the plan, making 32 buildings (a building may be several masses: Complex Delta's north house is three, Xeste 3 and Xeste 4 two each, Complex Beta four). "On drawn walls" is the share of the outline within 0.8 m of a wall the plan draws. Areas are of the outlines here. Where a source gives a plot, it is beside it and is a different measure (T2 correction 9).

| Mass | Modern label | Status | On drawn walls | m² | Storeys | Claims |
|---|---|---|---|---|---|---|
| `alpha` | Sector Alpha (Pithoi Storeroom) | excavated | 87% | 146 | 2 | T2#58, T2#59, T2#60, T2b#49 |
| `eta` | "Porter's Lodge" (the plan's label; Building Eta on the excavators' plan) | reconstructed | 54% | 174 | 2 | T2b#50 |
| `nhol` | unnamed, north of the House of the Ladies | reconstructed | 50% | 136 | 2 | T2b#52 |
| `ladies` | House of the Ladies | excavated | 86% | 226 (plot 184) | 3 | T2#44, T2#45 |
| `de1`, `de2` | unnamed, east side of Dactyls Street | reconstructed | 23%, 25% | 72, 77 | 2 | T2b#52, T2b#53 |
| `de3` | unnamed, east side of Dactyls Street | reconstructed | 2% | 110 | 2 | T2b#53 |
| `w1` | unnamed, between the House of the Ladies and the West House | excavated | 86% | 82 | 2 | the plan |
| `w2` | unnamed, south of the House of the Ladies | excavated | 72% | 31 | 2 | the plan |
| `west` | West House | excavated | 87% | 143 | 2, and part of a third (B) | T2#30, T2#32, T2#34, T2#38, T2#42, T2#43, T2#111 |
| `anchor` | House of the Anchor | reconstructed | 34% | 89 | 2 | T2b#44, T2#58 |
| `tw1`, `tw2` | unnamed, west side of Telchines Street | reconstructed | 0%, 12% | 94, 83 | 2 | T2b#35; liberty A-L11 |
| `porch` | "Pylon" (the plan's label): the porch at Delta West's entrance | reconstructed | 4% | 8 | 2 | T2b#45, T2#54 |
| `delta_w` | Complex Delta, West house | excavated | 76% | 166 | 2 | T2#48, T2#54, T2b#37, T2b#51 |
| `delta_n1`, `delta_n2`, `delta_c` | Complex Delta, North house | excavated | 90%, 84%, 65% | 39, 38, 46 | 2 | T2#48, T2#52, T2b#37 |
| `delta_e` | Complex Delta, East house | excavated | 95% | 56 | 2 | T2#48, T2#49, T2b#47 |
| `delta_e_n` | Complex Delta, East house (north part) | reconstructed | 66% | 34 | 2 | T2b#53 |
| `delta_s` | Complex Delta, South house | excavated | 93% | 89 | 2 | T2#48, T2#55 |
| `delta_s16` | Complex Delta, South house (Delta 16) | excavated | 97% | 72 | 1, low | T2#56, T2#57, T2#58 |
| `xeste5` | "Xeste 5" (a label only) | reconstructed | 29% | 178 | 2 | T2b#50 |
| `dhe` | unnamed, east of Double Horns Square | reconstructed | 41% | 97 | 2 | the plan |
| `xeste2` | Xeste 2 | excavated | 50% | 342 | 3 (B) | T2b#41, T2b#42, T2b#43, T2#110 |
| `x2s` | unnamed, south of Xeste 2 | reconstructed | 21% | 87 | 2 | the plan |
| `gamma_n`, `gamma_s` | Building Gamma (Sector Gamma) | excavated | 61%, 96% | 61, 95 | 2 | T2#63 |
| `beta_n`, `beta_w`, `beta_m` | Complex Beta (Sector Beta) | excavated | 100%, 92%, 76% | 21, 148, 53 | 2 | T2#61, T2#62 |
| `beta_e` | Complex Beta, east wing | reconstructed | 81% | 58 | 2 | T2b#53 |
| `bs` | unnamed, south of Complex Beta | reconstructed | 45% | 91 | 2 | the plan |
| `xeste3_w`, `xeste3_e` | Xeste 3, west and east parts | excavated | 97%, 92% | 142 + 150 = 292 (plot 283) | 3 | T2#19, T2#20, T2#22 |
| `se_b1`, `se_b2`, `se_a` | unnamed, north and north-west of Xeste 4 | excavated | 92%, 87%, 94% | 108, 42, 72 | 2 | the plan |
| `xeste4_w`, `xeste4_e` | Xeste 4 | excavated | 70%, 54% | 182 + 217 = 399 (plot about 367) | 3 | T2#24, T2#25, T2#110, T2b#38, T2b#51 |
| `south` | "South Building" (the plan's label) | reconstructed | 65% | 66 | 2 | T2b#50, T2b#38 |
| `swx_w`, `swx_e` | unnamed, south of Curetes Street | excavated | 71%, 78% | 56, 57 | 2 | T2b#38 |

Notes:
- **A share can flatter.** `nhol`, `eta`, `beta_e` and `south` have high shares partly because their outlines run beside a neighbour's drawn wall. Their status is fixed by the record, not by the share.
- **Gaps filled by rule inside the excavation** (work order; T2b#53): the torrent that cut through the site damaged the buildings on both sides of Dactyls Street. `de1`, `de2`, `de3`, `delta_e_n` and `beta_e` fill those strips. The open ground between the House of the Ladies and Complex Delta, where the modern visitor path loops, is left open: the plan draws no wall stub there to build from.
- **What the record adds to named buildings** (`masses[].features`), each with its claim:
  - *Xeste 3:* three storeys; the east part in dressed ignimbrite with large windows, the west part in rubble (T2#19, T2#20); the entrance in the east wing with stone benches outside it (T2#22).
  - *Xeste 4:* three storeys, in courses of whitish dressed tuff, entered from Curetes Street (T2#24, T2#25). "Probably more than three" in its east wing is grade B and is not shown.
  - *West House:* two storeys; a room standing above the roof at the north-east corner for the inferred partial third (T2#38, **grade B, shown**); a very large first-floor window to Triangle Square (T2#32); walls of piers and windows, four openings each, on the west and north of its corner room (T2#34, T2#42); the entrance at a corner with its window beside it (T2#111).
  - *House of the Ladies:* three storeys (T2#44); its light-well, the town's one known, drawn as a square opening in its roof (T2#45).
  - *Complex Delta:* four houses (T2#48). Delta 16 is one low storey on Telchines Street with its large window's sill 10 cm above the paving (T2#56). Stone horns over the East house's entrance on Double Horns Square (T2#49: they "seem to have crowned" it, **grade B, shown**). The porch at the West house's entrance (T2b#45).
  - *Xeste 2:* three storeys (official summary, **grade B**); its north front in dressed tuff with a row of stone standing out at each floor (T2b#42, T2b#43), facing the large public square (T2b#41).
  - *Pithoi Storeroom, House of the Anchor, Delta 16:* a large ground-floor window under 1 m above the street (T2#58).
  - *Cenotaph Square:* the stone pithos, 1.30 m high (T2#53).
- **No palace** (T2#18, T2#64).

## 5. The rules

Each rule is in `town.json` (`rules`, `town`) with its numbers. "Page" means the number travels to the page in `town-data.js` (`TOWNR`) and the house generator in `source/src/world.js` (`buildTown`) reads it there.

| Rule | Numbers | Claims | Grade, or liberty |
|---|---|---|---|
| **The moment** | 1615 BCE: whole and lived in, no damage, rubble or repairs | D15, D16, D19 | T2#93–T2#96 belong to the last weeks and are left out |
| **Fabric** | Dense, no courtyards, no animal enclosures; streets, alleys and blind alleys roughly north–south and east–west; fronts step in and out | T2#8, T2#9, T2#102 | A for the excavated part. Beyond it: A-L1 |
| **Footprint** of a house by rule | 96–187 m² of ground; built: 97–187, median 150. No large building (300–370 m²) is invented | T2#6 | A, to verify against Palyvou 2005 |
| **Storeys** | Two or three | T2#86 | A for two or three; which house has which: A-L4 |
| **Storey height** | 2.8 m floor to floor (page) | none published; the report infers 2.5–3 m | C; A-L3 |
| **Ground floor below the street** | 0.3–0.7 m; 1.0 m at Delta 16 (page). Seen from outside as low ground-floor windows | T2#11, T2#14, T2#56; T2 correction 2 | A at Delta 16; "a few steps" elsewhere, so the range is A-L5 |
| **Walls** | Fieldstone and earth in a timber frame; 0.60–0.80 m thick. An opening sits 0.3 m into the wall (page) | T2#65, T2#67; T2#39–T2#42, T2 correction 1 | A (axes to verify); the 0.3 m: A-L6 |
| **Dressed stone** | Off-white tuff round every opening, flush with the wall; hard-stone corner blocks; timbers in the wall at sill and lintel height | T2#68, T2#69, T2#43 | A that these were the practice; on every house: A-L8 |
| **Timber in openings** | The reveal is lined with timber | T2#39, T2#41 | A for one door and one window |
| **Entrance** | One per house, at an end of the wall with most free ground before it, with a window beside it. Door 1.05 × 1.95 m on a threshold of dark stone showing 0.13 m; window 0.66 × 0.80 m (page) | T2#14, T2#111; T2#39, T2#40, T2#41 | A (the norm, not every house; sizes to verify). The window's sill at 1.05 m: A-L6 |
| **Ground-floor windows** | Small and low: 0.50 × 0.45 m, sill 0.55 m above the street (page) | T2#61 | A that they are small; sizes: A-L6 |
| **Upper windows** | 0.95 × 1.15 m, sill 0.85 m above the floor, about every 2.9 m, fewer on an alley (page) | none | A-L6 |
| **Walls of piers and windows** | 3.95 m long with four openings (page), where the record puts them | T2#34, T2#42 | A (West House) |
| **Large low window** | 1.9 × 1.1 m, sill 0.6 m above the street, 0.1 m at Delta 16 (page) | T2#56, T2#58 | A for the sill; width: A-L6 |
| **Roofs** | Flat terraces of earth with pebbles, 0.2 m thick, inside a parapet 0.55 m high and 0.4 m thick, with one terracotta spout 0.45 m long (page) | T2#70, T2#71, T2#73; T2 correction 6 | A for earth roofs, parapets and spouts. Both earth figures are recorded (10–15 cm, and about 20 cm); the rest: A-L7 |
| **Streets of the excavated part** | Where the plan leaves them. Telchines Street 1.2–2.2 m between wall faces, Triangle Square 8–12 m across | T2#7, T2b#35 | C (read off the plan, not re-measured) |
| **Paving** | Large flagstones wherever houses stand close | T2#11 | A for the rebuilt streets; elsewhere and its look: A-L14 |
| **Streets by rule** | Main streets 2.4–3.2 m, streets 1.6–2.2 m, alleys 1.1–1.5 m, some of them blind | T2#9, T2#10 | The 1.1 m is the one measured alley (A); the rest: A-L1 |
| **The ground** | The terrace of the terrain's edit E8, reshaped by this order into a ridge: 23.2 m under Xeste 3 (sourced: 23.1), 23.6 m at the east edge by Xeste 2 (sourced there: a basement floor at 21.7–21.8 m) | T2#19, T2#80, T2b#36, T2b#37, T2b#38 | The form: terrain liberty T-L6 (`docs/terrain/README.md`) |
| **Walking** | Eye 1.5 m above the ground, 1.6 m a second, 3.2 times faster with Shift, steps up to 0.5 m (page) | T2#35; T2 correction 4 | B at best for the eye height; A-L9 |

**How a house is built from its outline** (`buildTown`):
1. The free ground before each wall is measured. A wall with less than 0.9 m before it is a party wall and has no openings.
2. The entrance goes where the record puts it, or else on the wall with most room before it. The street level at the door is the house's datum.
3. Levels follow: ground floor below the street, floors every 2.8 m, the roof, the parapet.
4. Each wall is built storey by storey round its openings, down to 2 m below the lowest ground at its feet.
5. The roof, its parapet and its spout are added, then what the record adds (benches, horns, the light-well, the room above the West House).

**How the rest of the town is laid out** (`build.mjs`): each of three districts is cut in two again and again. A cut through a large piece leaves a main street, through a smaller one a street, then an alley (four in ten of them blind), and through a block a party wall, until every piece is a house's lot. Streets are then taken out of the lots, nearly half of the street fronts are set back by 0.3–1.1 m, and the whole is bent a little so that no street runs ruler-straight. A lot that comes within 1.5 m of the excavated part is cut back or dropped; a lot outside 96–187 m² is trimmed or dropped; the town thins over the last 55 m towards its northern and eastern edge.

## 6. Liberties

Departures from the evidence, or choices where there is none. They are numbered for `docs/HISTORICAL_STANDARD.md` §6, which only Chad's session edits: **they are not in the standard until they are entered there.**

| # | Liberty | Why | Where |
|---|---|---|---|
| A-L1 | **The town beyond the edge of the excavated walls**: that it is about 10 ha and runs north and north-east; its three districts and their outlines; every street, alley and blind alley there and their widths; every lot; its 420 houses; how it thins. | Nothing is measured beyond the edge. Both published sizes are grade C (D22). | `town.json` (`town`); `build.mjs` |
| A-L2 | **Every colour** of wall, roof, paving, timber and stone; and the outside of the rubble walls, shown as fieldstone bound with earth under what is left of an earth render. | No colour is sourced, and whether the rubble was plastered outside is not known. | `W_TOWN` and `flags` in `shaders.js` |
| A-L3 | The storey height, 2.8 m. | None is published; 2.5–3 m is the report's own inference (C). | `rules.storeyHeightMetres` |
| A-L4 | Which house has two storeys and which three: three in ten near the centre, fewer towards the edge; two for every unnamed building of the plan; three for Xeste 4. | Only "two or three" is sourced. | `rules.storeys`; `masses[].storeys` |
| A-L5 | How far a ground floor lies below the street: 0.3–0.7 m. | "A few steps"; only Delta 16's 1 m is measured. | `rules.groundFloorBelowStreetMetres` |
| A-L6 | **Openings:** how many and where, beyond those the record places; every size and sill the sources do not give (upper windows, ground windows, the width of the large low window, the 2.4 × 1.45 m "very large" window, Xeste 3's 1.5 × 1.55 m windows); the 0.3 m reveal and the 0.2 m frame; that only a wall with 0.9 m of free ground before it has openings. | Not published. | `rules.*Window`; `buildTown` |
| A-L7 | **Roofs:** the parapet's height and thickness; the earth taken as 0.2 m; one spout a house, over its widest street; every roof level. | Not published. One preserved roof slopes 25% to its spout (T2#72): that is one small roof, and it is not applied to all. | `rules.roof` |
| A-L8 | Tuff frames round every opening, corner blocks at every free corner and timbers on every rubble wall, on every house. String courses on Xeste 2 only. | The sources describe the practice, and one reinforced corner; how general each was is not stated. | `buildTown`; `W_TOWN` |
| A-L9 | **Walking:** eye height, pace, the hurry, the height of a step, a body 40 cm across; that touching down on land puts the viewer on foot. | For the experience. The eye height uses the one figure a source gives (T2#35, grade B). | `rules.walking`; `frame()` in `main.js` |
| A-L10 | **Readings of the plan made by hand:** which walls make one building; how an outline closes where no wall is drawn; the division of Complex Delta into four houses; Xeste 2's depth; where Xeste 3's dressed front ends; Xeste 4 as two parts; the places of Millhouse Square and of the pithos; the outlines and levels of the two terraces; where the porch stands; where a recorded entrance or window sits along its wall. | The plan is fragmentary and marks none of these. | `town.json` (`buildings`, `masses`, `open`) |
| A-L11 | **Two houses by rule on the west side of Telchines Street**, between the House of the Anchor and Building Gamma. | That side of the street is unexcavated (T2b#35), though it lies inside the plan's "limits of the excavation site". Without them the main street would have one side. They stand no further west than the buildings to their north and south. **This is a reading of "nothing west of the walls" that Chad may want to overrule:** removing `tw1` and `tw2` from `town.json` removes them. | `masses.tw1`, `masses.tw2` |
| A-L12 | **Every outline is convex.** A stepped front, such as Xeste 2's (T2b#41), is not shown; a building that is not convex is several convex parts. | It lets the outline be taken from the plan's own walls by rule. | `trace.mjs` |
| A-L13 | **The town is empty, silent and dark at night.** No people, animals, plants, vessels, awnings or lamps; every door shut; every window a dark opening. | D19: outsides only in this order. Lamps exist (T2#88) but belong to interiors and people. | whole town |
| A-L14 | **Paving** is drawn wherever houses stand close, in the reconstruction as in the excavated part, squares included. The covered drain under the streets, the houses' drains and the cobbles of the side street by the Pithoi Storeroom are not shown. | Flagstones are sourced for the rebuilt streets (T2#11); the drain (T2#12, T2#13, T2#74) and the cobbles (T2#60) are sourced and wait for a later order. | terrain shader |
| A-L15 | **The forms of the few things added:** the pithos's profile; the benches (2.4 × 0.45 × 0.42 m); the horns' shape and size; the light-well as a 2.2 m square; the West House's third storey as one room of 4.4 × 4 m; the porch as a mass of about 2.2 × 3.7 m. | Their existence is sourced; their sizes are not. | `buildTown` |

**The ground under the town** is terrain liberty T-L6 (`docs/terrain/README.md`): this order reshaped edit E8.

**Sourced and not shown,** besides the drain and the cobbles: the awning sockets and the gap in the parapet at Delta 16 (T2#56, T2#73); the pipe down the West House's wall (T2#74); Curetes Street's steep fall and the sheer slope at Xeste 4 (T2b#38: the terrain's 40 m grid cannot hold them); more than three storeys in Xeste 4's east wing (B).

## 7. What stands in the data

| | |
|---|---|
| Town | 9.95 ha inside its outline; 6.8 ha of it built on |
| Buildings | **452**: 19 excavated, 13 reconstructed inside the plan, 420 reconstructed by rule (157 north, 255 far north, 8 east) |
| Masses | 463 (some buildings are several), with 2 terraces and the pithos |
| Storeys | 332 buildings of two, 120 of three; Delta 16 is one low storey |
| Lots | 485 cut, 420 kept; 7 dropped for their size, 58 thinned out, none on steep ground |
| Data | 10,744 bytes, 14.0 kB as text in the page |
| Page | `index.html` is 166.7 kB of the 256 kB budget (132 kB before this order) |

## 8. Walking, and how it was tested

The viewer swims, flies and walks (D12). Flying down onto land on purpose (`Q` or `X`, or flying forwards and downwards) puts the viewer on foot: the camera follows the ground, the terraces and the roofs at eye height, and anything higher than a step stops it. `E` or `Space` takes off. Walking out of one's depth becomes swimming, and a swimmer who touches bottom in the shallows walks out. In the air the houses are solid from every side: a wall stops the camera and a roof carries it. On a touch screen: fly down onto the ground to walk, and look well up while moving to take off.

**Tested by Claude on 2026-11-18** in `dev.html`, in headless Chrome on this Mac's GPU, with `tools/town/shot.mjs` pressing the page's own keys and reading the camera's state after each step. Whether Chad walked it by hand in his review is not recorded.

| Step | Keys | What the state showed |
|---|---|---|
| Lands | Placed 8 m above Double Horns Square; `X` held 2.5 s | On foot; feet at 25.17 m, the top of the upper terrace (the ground under it is at 24.75 m) |
| Walks | `W` held 4 s, facing south | Moved 6.4 m (1.6 m a second); stepped down the terraces to 24.99 m |
| Is stopped by a wall | `W` held 9 s more | Stopped at z 5927.8, at the foot of Xeste 2's north front; still on foot, eye at ground + 1.5 m |
| Takes off | `E` held 1.5 s | Flying; 17 m above the ground |
| Walks a street | Viewpoint 7; `W` held 12 s | Walked 8.7 m down Telchines Street where it is about 1 m wide, sliding along its walls |
| Roofs are solid | Placed over a roof; `X` held 3 s; `W` held 6 s | Landed on the roof at 30.81 m (the ground is at 24.85 m); walked off its edge and fell to the street |
| Walks into the sea | Placed on the south shore on foot; `W` + `Shift` held 3 s | Moved 15.3 m (5.1 m a second) down the beach; still on foot in the shallows |
| Swims | `W` + `Shift` held 9 s more, then `W` 3 s | Swimming: 3.6 m, then 4.1 m, below the surface; 7.3 m a second without Shift, the engine's swimming pace |

The touch controls were kept and extended, and **nobody has tried them on a device**.

## 9. What was looked at

**Claude (Fable 5.2) looked at these pictures on 2026-11-18.** They are from `node checks/views.mjs --views 9 --min-fps 55 --min-scale 60`, which PASSed with every view at 60 fps and full resolution, and from extra pictures taken with `tools/town/shot.mjs`. The nine views are at <https://claude.ai/artifact/EAM2iAgZHr4toJ39qt9C9L>.

**Chad reviewed the branch later the same day,** before any merge, and said: "That's looking excellent for now." He was given the stills, the page itself and the record to review from; he did not say which he used, and did not report on the views one by one. The table below is Claude's look, not his.

| View | What it shows | What was seen |
|---|---|---|
| 1 | The Akrotiri terrace from the sea to its south (unchanged) | Open sea with a light chop. On the low tan terrace, about 900 m off, the town is a thin dark band of walls a few pixels high, clearly a settlement and no more than that. The ridge under it shows only as a slight swell. |
| 2 | The north bay and Pre-Kameni from the ring rim | As in work order 001: the pale lagoon, the black dome, the far walls. |
| 3 | High above the whole island, looking north | The whole ring with its bay. The town is a small dark speck on the south coast, about eight pixels across: it can be found, not read. |
| 4 | Profitis Ilias summit, looking across the island | As in work order 001: pale marble ground, the island falling away to the bay. |
| 5 | Sea level inside the bay | As in work order 001: clear green-white water, the dome low ahead. |
| 6 | Under water off the south shore | As in work order 001: the sand floor, the rippling surface overhead, drifting specks. |
| 7 | On foot in Telchines Street, looking south past Complex Delta | A paved street about 3 m wide in shadow between two-storey walls: plain earth-rendered walls with dark timber lines on the left (the two houses of liberty A-L11), Delta's wall on the right with corner blocks and small tuff-framed windows. Sunlight falls across the street ahead, and Complex Beta's rubble wall closes the view. |
| 8 | On foot in Double Horns Square, facing Xeste 2's north front | Three storeys of dressed tuff in courses, with a thin row of stone standing out at one floor, two rows of windows, a small low window and a plank door. Flagstones underfoot, half in a sharp shadow. Delta's east house in earth render to the left. |
| 9 | Over the roofs from the town's north edge | A carpet of flat earth roofs inside their parapets, of slightly different heights and tones, running south to the sea; walls with rows of small windows; the bare slope beside the town on the right. |

Also looked at: Xeste 3's dressed front with its bench, Telchines Street looking north and south, and the stone pithos in Cenotaph Square, on foot; the West House with its large window and the room above its roof, the horns over Delta East's entrance, and the light-well in the roof of the House of the Ladies, from the air; the excavated part from the air, with and without the edge of the evidence shown; golden hour over the roofs, and night in the square; the menu. The views check also PASSed on Medium and on Low detail, every view at 60 fps and full resolution (run to a scratch folder, not published); view 8 on Medium and view 9 on Low were looked at. The fly-through in `dev.html` ran at 60 fps with nothing logged; its frames were saved and not looked at.

**Not checked by anyone:** touch controls on a real device; popping while moving (none shows in the stills, and no level of detail is switched: the whole town is drawn at every distance, and its fine patterns fade out with distance); any machine but this Mac.

**Known weaknesses:**
- **The excavated part looks sparser than the reconstruction around it.** Its buildings are convex hulls of the walls a simplified plan draws, with open ground between them wherever that plan draws nothing. From the air it reads as a cluster in front of a denser town.
- **The town is small from far off** (views 1 and 3): it is low, earth-coloured and seen through a wide lens.
- **Walls repeat.** Every window of a kind is the same size, every door is the same door, and nothing hangs, leans or stands in the streets.
- **Street shade is flat.** The light thrown back between walls is a rule of thumb, and a wall's share of sky is one value along its whole length.
- **Shadows** of the town are one map of about 0.15 m a texel on High and 0.3 m on Medium and Low: soft at arm's length.
- **The ridge is gentle** where the excavator describes a sheer fall at Xeste 4.
- **Walking** uses a 0.25 m grid: a walker can stand within a hand of a wall, and the narrowest street is tight.
