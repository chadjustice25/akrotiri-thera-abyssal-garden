# Historical standard

The evidence rules for every place in this world: Thera now, and Crete, Egypt, Byblos and the rest later. A place that follows them can sit beside any other and agree with it on what year it is, what is known and how well. Adopted 2026-11-15 (D3, D4); change it only by a new decision.

## 1. The moment
- **Window:** c. 1650 BCE, give or take 100–150 years, so about 1800–1500 BCE. Evidence from outside the window can be used only as grade C, with its distance from the window stated.
- **Each place shows the same moment.** For Thera the opening moment is the living town in its final phase: after its rebuilding from the earthquake of c. 1650 BCE and before the final earthquake and evacuation, under the high chronology (D15). The world opens in **1628 BCE** (D36); `docs/WORLD_CLOCK.md` gives the details. The viewer can move the date and the year (D33, D34), and every place moves with them: at any setting, all places show the same date. Every other place takes its "now" from that file.

## 2. One world clock
- `docs/WORLD_CLOCK.md` (to be written from W1 and W2) lists every region's period, dates, rulers and main centres in the window, plus the objects and texts that link regions.
- **Every absolute date names its chronology:** the Aegean high (radiocarbon) or low (Egyptian-linked) chronology; the Egyptian chronology and its source; the Mesopotamian Middle or Low Chronology; for radiocarbon, the calibration curve and the probability of the range.
- When chronologies disagree, the world clock states the project's choice once. Every place uses that choice, and the alternative stays recorded beside it.

## 3. Grades
Every claim that reaches the world gets one grade. For a new place, read "Thera" as that place and "Late Cycladic I" as its phases in the window.

| Grade | Meaning |
|---|---|
| **A** | Found on Thera in a pre-eruption context (Late Cycladic I), or a scientific analysis of such material (pollen, charcoal, seeds, bone, residue, pigment, radiocarbon). For a place with texts: a text of the time. |
| **B** | Shown in the place's art of the time; found at a contemporary site elsewhere in the region and reasonably carried over; or found at the place but its interpretation is debated. |
| **C** | Later evidence, analogy (later periods, other regions, ethnography), a modern reconstruction, or a hypothesis. |

**For claims about the land** (D28; the table above was written for objects, and a mountain is not found in a dated layer):

| Grade | Meaning for landscape |
|---|---|
| **A** | A physical observation at the place of something from before the moment shown, or a laboratory analysis of such material: on Thera, the eruption's deposits themselves, charcoal from Late Cycladic I floors, the olive tree buried in the tephra, an excavated site. |
| **B** | A present-day measurement of a landform that already existed, carried back unchanged; a physical finding at the place whose interpretation is debated; a record of the time from elsewhere in the region, carried over; or something shown in the place's art. |
| **C** | A modern reconstruction or model (the restored caldera, a modelled sea level), an analogy from another period or place, later evidence, or a hypothesis. |

**For art** (D26): a plant, animal or thing shown only in the art of another place in the region is grade C for this place.

**For claims about the modern excavation** (D50; when a place was dug, by whom and in what order, which is what the Found layer's order is built from):

| Grade | Meaning for the history of a dig |
|---|---|
| **A** | Stated in the excavators' own report of that season or in the excavation's official publications, or shown on a dated plan or photograph they published. |
| **B** | Stated in a later account by a member of the excavation, or in a peer-reviewed study that cites the reports; or the excavators' own accounts disagree. |
| **C** | A guidebook, museum label, news report or other second-hand account; or an inference from an undated plan or photograph. |

Chad confirmed this reading on 2026-11-21, to be looked at again as more is learned.

## 4. Rules
1. **Evidence first.** A thing a viewer will see or read needs a source, a grade and a claim reference (lane and number, e.g. `T2#14`), once data files exist to hold them.
2. **Shown is not present.** A plant, animal, object or landscape known only from art is grade B at most for the place, and the world says so where it matters (the monkeys of the Akrotiri paintings are the test case, T3-1).
3. **Numbers keep their source.** A measurement keeps its unit, its range and its claim reference. A number chosen for the experience, not taken from evidence, is a liberty (§6).
4. **Names and words.** Modern names (Akrotiri, Thera, Santorini) are used and are marked as modern where a viewer could mistake them. An ancient name or word is used only if attested, with its grade. Linear A is undeciphered: no invented Minoan words, names or readings.
5. **People.** Faces, bodies, dress and skin colour follow the evidence and say where they follow an artistic convention (T4-3).
6. **Reports are not evidence.** A research report, whoever wrote it (Gemini or a Claude agent), becomes usable only claim by claim, after `docs/research/verification/<lane>.md` checks it against the sources.

## 5. Images and rights
- Photographs of the wall paintings and objects stay out of the repository (D6). The world re-creates motifs in code from checked descriptions and measurements, never by tracing a photograph.
- Whether even a code re-creation of a motif needs permission under Greek law is research lane T6, topic F. Until it is checked, a release for sale is not planned around fresco motifs.
- Every dataset the world is built from (elevation models, bathymetry, plans) is recorded with its licence before use.

## 6. Liberties
Departures from the evidence, made for the experience. One row each; nothing is a liberty until it is written here.

| # | Liberty | Why | Where | Decision |
|---|---|---|---|---|
| L1 | *Ended 2026-11-18.* The scene was underwater swimming until the Thera terrain replaced it. | It was still upstream's world; nothing was Theran yet. | whole scene | D1; ended by work order 001 |

**The terrain's liberties** (work order 001, recorded 2026-11-18). The numbers are the terrain record's (`docs/terrain/README.md` §4), which gives each one in full, and `tools/terrain/edits.json` holds the parameters.

| # | Liberty | Why | Where | Decision |
|---|---|---|---|---|
| T-L1 | The thickness of the eruption deposits between the places where it is measured. | No thickness map could be opened. Without stripping, the land of 1628 BCE would wear the eruption's ash. | terrain edit E3 | work order 001 |
| T-L2 | The shape of the restored ring land on the caldera side. | Its volume range and rim height are sourced (T1#14, T1b#51); its surface is gone. | E4 | work order 001 |
| T-L3 | The bay's depth (5 m), its south shore, and Therasia's east cliffs as its west wall. | "No more than a few metres" (T1b#46) is contested, and no outline is published. | E5 | work order 001 |
| T-L4 | The channel's width (280 m), depth (3 m) and course, and the height of the low ground beside it. | Only "low, narrow, if any" and an upper bound of 1 km are sourced. | E6 | work order 001 |
| T-L5 | The outline, profile, height (231 m) and lava-flow relief of the island in the bay (Pre-Kameni, a modern label). | Only its volume, rock and rough position are published. | E7 | work order 001 |
| T-L6 | The form of the terrace at Akrotiri: the line of its crest, the width of its top, the 3.5% fall along it, the 6% fall to each side and where that fall ends. | The town needs ground to stand on; the buried surface there is not published. Only the ridge, the fall to the east and two levels are sourced (T2b#37, T2b#38, T2#19, T2#80). | E8 | work order 001; reshaped by work order 002 |
| T-L7 | Every rock-class boundary, and the heights above which marble is drawn. | The claims name places, not boundaries. | rock map | work order 001 |
| T-L8 | Every colour of rock, soil, sand and water. The banding of the volcanic cliffs uses the red, blue-black and ochre of the rocks in the miniature frieze. | No source gives a colour. The frieze is grade B (shown, not found), and its banded rocks are also a painting convention. | terrain shading | work order 001 |
| T-L9 | The day shown: late May, with the Earth's tilt of the time (23.89°), in local solar time. | The season is open between spring and early summer (T3). The tilt is computed, not from a research lane. | sun | work order 001 |
| T-L10 | Calm mornings and a north breeze that builds through the afternoon. | Today's summer Etesians carried back (T1#50, grade C). | sea state | work order 001 |
| T-L11 | The amount of haze. | A clear Aegean summer day was chosen; nothing dates the air. | sky | work order 001 |
| T-L12 | The stars are a random field, and there is no moon. | The real sky of 1628 BCE needs a star catalogue and precession: a later order. | night sky | work order 001 |
| T-L13 | Sea level 3.6 m below today's, and the land and sea-floor data joined with no offset between their height references. | Two estimates disagree (3.6 m and under 0.5 m), and neither is measured on Santorini. It stays a parameter. | E1 | work order 001 |
| T-L14 | The coastline is today's, moved only by the sea-level change. The sea floor is today's too. | The pre-eruption coast is not known, and the harbour has not been found. | E3, E8 | work order 001 |
| T-L15 | Ground detail finer than the 40 m data. | It has zero mean, stays within a few metres and fades out at the shore, so it does not contradict the data. | terrain detail | work order 001 |
| T-L16 | The ground is bare. | Plants come in a later order. The island was not bare: Akrotiri's charcoal shows oak, pine and olive (T1#46, T1#47). | whole island | work order 001, until plants are in |
| T-L17 | The night is far brighter than starlight, and the water's clarity, colour and light shafts are the original engine's. | So that the island can be seen at night; the water was tuned for beauty upstream. | light, water | work order 001 |

**The town's liberties** (work order 002, recorded 2026-11-18). The numbers are the town record's (`docs/town/README.md` §6), which gives each one in full, and `tools/town/town.json` holds the parameters. The ground under the town is T-L6 above.

| # | Liberty | Why | Where | Decision |
|---|---|---|---|---|
| A-L1 | The town beyond the edge of the excavated walls: that it is about 10 ha and runs north and north-east, its streets, alleys and lots, its 420 houses, and how it thins. | Nothing is measured beyond the edge. Both published sizes (about 10 ha and about 20 ha) are grade C. | the reconstruction | D18, D22; work order 002 |
| A-L2 | Every colour of wall, roof, paving, timber and stone, and the outside of the rubble walls, shown as fieldstone bound with earth under what is left of an earth render. | No colour is sourced, and whether the rubble was plastered outside is not known. | every house | work order 002 |
| A-L3 | The storey height, 2.8 m. | None is published; 2.5–3 m is a research report's own inference (grade C). | every house | work order 002 |
| A-L4 | Which house has two storeys and which three. | Only "two or three" is sourced (T2#86). | every house without a recorded height | work order 002 |
| A-L5 | Ground floors 0.3–0.7 m below the street. | "A few steps"; only Delta 16's 1 m is measured (T2#56). | every house | work order 002 |
| A-L6 | Openings: how many and where, beyond those the record places, and every size and sill the sources do not give. | Not published. | every house | work order 002 |
| A-L7 | Roofs: the parapet's height and thickness, the earth taken as 0.2 m, one spout a house, every roof level. | Not published. One preserved roof slopes 25% (T2#72); it is not applied to all. | every roof | work order 002 |
| A-L8 | Tuff frames, hard-stone corner blocks and wall timbers on every house; string courses on Xeste 2 only. | The sources describe the practice and one reinforced corner, not how general each was (T2#43, T2#68, T2#69). | every house | work order 002 |
| A-L9 | Walking: eye height 1.5 m, pace, the height of a step, and that touching down on land puts the viewer on foot. | For the experience. The eye height is the one figure a source gives (T2#35, grade B). | movement | D12; work order 002 |
| A-L10 | Readings of the plan made by hand: which walls make one building, how an outline closes where no wall is drawn, the division of Complex Delta, Xeste 2's depth, the places of Millhouse Square, the pithos, the terraces and the porch. | The plan is fragmentary and marks none of these. | the excavated part | work order 002 |
| A-L11 | Two houses by rule on the west side of Telchines Street, between the House of the Anchor and Building Gamma. | That side of the street is unexcavated (T2b#35). Without them the main street would have one side. | the excavated part | D24 |
| A-L12 | Every building outline is convex. A stepped front, such as Xeste 2's (T2b#41), is not shown. | It lets each outline be taken from the plan's own walls by rule. | the excavated part | work order 002 |
| A-L13 | The town is empty, silent and dark at night: no people, animals, plants, vessels or lamps; every door shut. | Outsides only in this order (D19). Lamps exist (T2#88) but belong to interiors and people. | whole town | D19, until people and plants are in |
| A-L14 | Paving is drawn wherever houses stand close. The covered drain, the houses' drains and the cobbles of one side street are not shown. | Flagstones are sourced for the rebuilt streets (T2#11). The drain (T2#12, T2#13) and the cobbles (T2#60) are sourced and wait for a later order. | streets and squares | work order 002 |
| A-L15 | The forms of the few things added: the pithos's profile, the benches, the horns, the light-well, the West House's upper room, the porch. | Their existence is sourced; their sizes and shapes are not. | named buildings | work order 002 |

**The opening page's liberty** (work order 006, recorded 2026-11-21). The record is `docs/opening-page/README.md`.

| # | Liberty | Why | Where | Decision |
|---|---|---|---|---|
| P-L1 | The opening page's colours are named for the wall-painters' materials found at Akrotiri (the white of lime plaster, carbon black, red ochre, Egyptian blue: T6 check #3, #4, #5, #12, #14), and their tones on screen are chosen by eye. | No painted surface at Akrotiri has a measured colour. The page is not part of the world, and it copies no motif from a wall painting. | the opening page | D53, D54; work order 006 |

## 7. Layers, dates and years
How the world shows what is known and what is added (D31, D38), and how it moves in time (D33, D34, D36, D37).
- **Three layers, each adding to the one before.**
  - **Found:** only what was dug up, where it was found (grade A, in its place).
  - **Inferred:** adds what the evidence points to (grades B and C, and every liberty whose reason is evidence).
  - **Imagined:** adds what brings the place to life (liberties made for the experience, and things known only from paintings).
- A thing's layer follows from the grade or liberty it already carries. The land is drawn in every layer, and in Found a colour or form with no source is drawn plain.
- **The date and the year can be moved.** The world opens in late May of 1628 BCE. Everything that grows carries its yearly cycle. Every thing carries the years it stands for, with a grade for that dating; a thing with no dated beginning or end stands for the whole span.
- **Thera's years run through the end:** the damaged town, the eruption and the island it left are shown when the year reaches them.
- **Changing layer, date or year never reloads or pauses the world.** Things fade in and fade out.

## 8. Where this standard sits in the field
A note, not a rule (D40). It names the standards that virtual archaeology already has, so that this one can be read against them. The facts below were checked by web search on 2026-11-19, not against the primary texts.

**Who the work is for (D42):** citizen scientists and scientists. One of the project's top goals is to help them understand what is at the real archaeological sites. So the test of this standard is practical: a viewer, on a screen or standing at the site, must be able to tell what was found from what was added, and to find out how each thing is known.

- **The London Charter** for the computer-based visualisation of cultural heritage (<https://www.londoncharter.org/>) asks for "intellectual transparency": a reconstruction must let its users see how it was arrived at.
- **The Seville Principles** (the International Principles of Virtual Archaeology; written in 2011, ratified by ICOMOS in 2017) build on the Charter. Their principles include interdisciplinarity, authenticity, historical rigour and scientific transparency.
- **Paradata** is the field's word for the record of how interpretive choices were made (the term was proposed by Drew Baker).

How this project answers them:

| The field asks for | Here |
|---|---|
| Evidence told apart from conjecture | The grades A, B and C (§3), and the three layers a viewer can switch between (§7) |
| A record of every interpretive choice (paradata) | The liberties table (§6), `docs/DECISIONS.md`, the claim reference kept with every number, and the check of every research report |
| Historical rigour | Claims are used only after they are checked against their sources (§4.6) |

**Not yet done:** the standard has not been checked against the Charter or the Principles clause by clause. That audit should come before the project is shown as an example of either.
