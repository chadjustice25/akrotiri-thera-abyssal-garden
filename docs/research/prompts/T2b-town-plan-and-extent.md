# Prompt: lane T2b, the plan of the excavated town, the edges of the evidence, and the town's extent
**For:** a Claude research agent (D13). This is a follow-up to T2. It was added on 2026-11-18 after Chad pointed to a published plan of the excavated town ("Akrotiri in the Bronze Age, about 1600 B.C.", kept locally in `akrotiri-frescoes-sources/map-of-bronze-age-akrotiri-754.png`) and said two things: the street plan of the excavated part is archaeological evidence and the world should follow it; and the world needs to know where that evidence ends, so that everything beyond it can be marked as reconstruction. He also asked that the size of the whole town be based on the available archaeological data, not on a default.
**Returns to:** `docs/research/claude/T2b_Claude.md`, checked in `docs/research/verification/T2b.md`.
**Report format:** the same as T2 (`T2-town-buildings.md`): Summary, Claims table, Numbers for the builder, Assumptions checked, Debates, Game hooks, Sources (and Sources not opened).

---

This lane follows T2 (`docs/research/claude/T2_Claude.md` and its check, `docs/research/verification/T2.md`; read both first) and fills the gap its check names as the largest: usable plan geometry, and the town's layout beyond the dig. The project builds the town at Akrotiri on Thera in a real-time 3D world, as it stood in 1615 BCE on the high chronology (`docs/WORLD_CLOCK.md`): the living town, before the final earthquake. The aim is concrete, sourced shapes, sizes and positions, each with an honest grade under `docs/HISTORICAL_STANDARD.md`, and a plain statement of where the evidence stops.

## Rules
- The source rules, grades and report format of `docs/research/prompts/T2-town-buildings.md` apply unchanged. Number the claims from 1 and cite earlier lanes as `T2#n`, `T1c#n`.
- Cite only sources you opened in this run. A work you could not open goes under "Sources not opened" and grades nothing. Do not open copies of copyrighted books that look unlicensed.
- Save downloads only in your scratchpad, never in the repository. Write nothing in the repository except the report file.
- Quote at most 15 words from any source; paraphrase the rest.
- Put nothing about this project or its owner in any request to an outside service.
- For every plan, map, image or dataset: who made it, from what, under which licence (name and version), and what that licence asks of someone who redraws or adapts it. State it from the licence page or file page itself, not from a site that re-hosts the image.

## Topics
A. **Plans of the excavated town that may lawfully be used.**
   - Start with the plan Chad supplied. It appears to be Maximilian Dörrbecker's map on Wikimedia Commons ("Map Akrotiri 1600 BC", English version). Open its Commons file page and confirm: author, licence and version, date, the sources the author says he drew it from, and whether an SVG with a scale bar or north arrow exists. You may look at the local file to describe what it shows.
   - Find any other plan of the excavated area under an open licence: other Commons files, OpenStreetMap (which maps the site under ODbL: say what it maps, the modern shelter or the ancient walls), and figures in open-access papers under CC BY or similar.
   - For each: how faithful is it to the excavators' plans (Marinatos; Doumas; Palyvou 2005), and how can a reader tell?
   - T2's check found that the excavators' own plans are copyright, that the TiMMA records need the director's agreement, and that the 2013 laser scan is not public. Say whether anything has changed, and what a formal request for permission would involve.
B. **Scale, north and position.**
   - The plan's scale and orientation: a scale bar or stated scale on any version; true north; checks against published dimensions (for example Xeste 3's 283 m² plot, Xeste 4's length of over 30 m, West House Room 3 at 6.10 × 5.70 m, the alley 1.10 m wide).
   - Where the excavation sits on the ground: coordinates of the site or of its shelter, its length and width, the distance to today's shore, and how the plan's axes lie relative to true north.
   - Levels: street or floor levels above sea level across the site from north to south, and the direction the streets fall.
C. **What the plan evidences, feature by feature.**
   - Streets and squares: name (always a modern label), course, width and length where any source measures them, paving, and which stretches are excavated and which are inferred.
   - Buildings and sectors on the plan that T2 did not cover or covered thinly: Xeste 5, Xeste 2, the House of the Anchor, the Porter's Lodge, the South Building, Sector Alpha, and anything the plan labels "Pylon", "Tunnels", "Cenotaph" or "Terrace". For each, say whether it is a building of the last town (Late Cycladic I), an earlier feature, or something modern (a memorial, an excavation tunnel, a visitor path, a roof support).
   - Which buildings are fully excavated, which partly, and which are known only from the tops of their walls.
D. **The edges of the evidence, and the town beyond them.**
   - What is known outside the excavated area, in each direction: trial trenches, the shafts dug for the shelter's pillars, boreholes and cores, geophysical survey, chance finds, quarry faces, and finds in the ravine towards the sea.
   - The basis of each published estimate of the town's size (about 10 ha, about 20 ha, and any other) and of its population. What observation does each rest on?
   - Any evidence for where the town ended in any direction, for a town wall or its absence, for how dense the building was away from the centre, and for whether the excavated part is the town's centre or its seaward edge.
   - What lay around the town: other Late Cycladic I sites on the Akrotiri peninsula, fields or terraces, workshops, burials, roads.
E. **How others have filled the gap.** Published reconstructions of the whole town (drawings, models, digital), who made them, on what basis, and under what terms. These are grade C at best; the lane reports them so the project can say how its own filling-in differs.

## Assumptions to test
- **T2b-1:** The plan Chad supplied is by Maximilian Dörrbecker, is on Wikimedia Commons under a Creative Commons Attribution-ShareAlike licence, and may be redrawn and adapted if the author is credited and the adaptation carries the same licence.
- **T2b-2:** That plan is a faithful simplification of the excavators' published plan and can be scaled from published dimensions to within a metre or two.
- **T2b-3:** The excavated area is about 1.2 ha, long from north to south, with Telchines Street as its main street.
- **T2b-4:** The excavated area lies in the seaward (southern) part of a town that ran further inland and to both sides.
- **T2b-5:** No town wall has been found.
- **T2b-6:** Nothing measured fixes the town's edge in any direction, so 10 ha and 20 ha are both estimates from indirect evidence.

In the Summary, lead with three things: which plan may be used and on what terms; its scale and position; and a list, direction by direction, of where the evidence ends.
