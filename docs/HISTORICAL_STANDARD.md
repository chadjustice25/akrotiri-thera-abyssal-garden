# Historical standard

The evidence rules for every place in this world: Thera now, and Crete, Egypt, Byblos and the rest later. A place that follows them can sit beside any other and agree with it on what year it is, what is known and how well. Adopted 2026-11-15 (D3, D4); change it only by a new decision.

## 1. The moment
- **Window:** c. 1650 BCE, give or take 100–150 years, so about 1800–1500 BCE. Evidence from outside the window can be used only as grade C, with its distance from the window stated.
- **Each place shows the same moment.** For Thera that moment is the living town in its final phase: after its rebuilding from the earthquake of c. 1650 BCE and before the final earthquake and evacuation, under the high chronology (D15). The year is **1615 BCE** (D16); `docs/WORLD_CLOCK.md` gives the details. Every other place takes its "now" from that file.

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

## 4. Rules
1. **Evidence first.** A thing a viewer will see or read needs a source, a grade and a claim reference (lane and number, e.g. `T2#14`), once data files exist to hold them.
2. **Shown is not present.** A plant, animal, object or landscape known only from art is grade B at most for the place, and the world says so where it matters (the monkeys of the Akrotiri paintings are the test case, T3-1).
3. **Numbers keep their source.** A measurement keeps its unit, its range and its claim reference. A number chosen for the experience, not taken from evidence, is a liberty (§6).
4. **Names and words.** Modern names (Akrotiri, Thera, Santorini) are used and are marked as modern where a viewer could mistake them. An ancient name or word is used only if attested, with its grade. Linear A is undeciphered: no invented Minoan words, names or readings.
5. **People.** Faces, bodies, dress and skin colour follow the evidence and say where they follow an artistic convention (T4-3).
6. **Reports are not evidence.** An Argon report becomes usable only claim by claim, after `docs/research/verification/<lane>.md` checks it against the sources.

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
| T-L1 | The thickness of the eruption deposits between the places where it is measured. | No thickness map could be opened. Without stripping, the land of 1615 BCE would wear the eruption's ash. | terrain edit E3 | work order 001 |
| T-L2 | The shape of the restored ring land on the caldera side. | Its volume range and rim height are sourced (T1#14, T1b#51); its surface is gone. | E4 | work order 001 |
| T-L3 | The bay's depth (5 m), its south shore, and Therasia's east cliffs as its west wall. | "No more than a few metres" (T1b#46) is contested, and no outline is published. | E5 | work order 001 |
| T-L4 | The channel's width (280 m), depth (3 m) and course, and the height of the low ground beside it. | Only "low, narrow, if any" and an upper bound of 1 km are sourced. | E6 | work order 001 |
| T-L5 | The outline, profile, height (231 m) and lava-flow relief of the island in the bay (Pre-Kameni, a modern label). | Only its volume, rock and rough position are published. | E7 | work order 001 |
| T-L6 | The form of the terrace at Akrotiri. | The town needs ground to stand on; the buried surface there is not published. | E8 | work order 001 |
| T-L7 | Every rock-class boundary, and the heights above which marble is drawn. | The claims name places, not boundaries. | rock map | work order 001 |
| T-L8 | Every colour of rock, soil, sand and water. The banding of the volcanic cliffs uses the red, blue-black and ochre of the rocks in the miniature frieze. | No source gives a colour. The frieze is grade B (shown, not found), and its banded rocks are also a painting convention. | terrain shading | work order 001 |
| T-L9 | The day shown: late May, with the Earth's tilt of the time (23.89°), in local solar time. | The season is open between spring and early summer (T3). The tilt is computed, not from a research lane. | sun | work order 001 |
| T-L10 | Calm mornings and a north breeze that builds through the afternoon. | Today's summer Etesians carried back (T1#50, grade C). | sea state | work order 001 |
| T-L11 | The amount of haze. | A clear Aegean summer day was chosen; nothing dates the air. | sky | work order 001 |
| T-L12 | The stars are a random field, and there is no moon. | The real sky of 1615 BCE needs a star catalogue and precession: a later order. | night sky | work order 001 |
| T-L13 | Sea level 3.6 m below today's, and the land and sea-floor data joined with no offset between their height references. | Two estimates disagree (3.6 m and under 0.5 m), and neither is measured on Santorini. It stays a parameter. | E1 | work order 001 |
| T-L14 | The coastline is today's, moved only by the sea-level change. The sea floor is today's too. | The pre-eruption coast is not known, and the harbour has not been found. | E3, E8 | work order 001 |
| T-L15 | Ground detail finer than the 40 m data. | It has zero mean, stays within a few metres and fades out at the shore, so it does not contradict the data. | terrain detail | work order 001 |
| T-L16 | The ground is bare. | Plants come in a later order. The island was not bare: Akrotiri's charcoal shows oak, pine and olive (T1#46, T1#47). | whole island | work order 001, until plants are in |
| T-L17 | The night is far brighter than starlight, and the water's clarity, colour and light shafts are the original engine's. | So that the island can be seen at night; the water was tuned for beauty upstream. | light, water | work order 001 |
