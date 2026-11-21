# Prompt: Gemini Neon Deep Research, lane T8: the history of the excavation at Akrotiri
**For:** Chad, to paste into Gemini with **Neon**, its highest thinking setting and **Deep Research** on, in its own new chat. Paste everything below the line and add nothing. Steps: `docs/research/README.md`.
**Returns to:** save the report as `docs/research/neon/T8_Neon.md`. Claude checks its key claims against the sources (`docs/research/verification/T8.md`) before anything is built from it.
**Why:** D44. The Found layer is to appear in the order the site was excavated, so that people at the dig can see how it grew. Until this lane is in and checked, the wave runs by distance from the excavated centre (D41), which is a liberty.
**Differs from the other lanes:** its claims are about a modern excavation, not about the Bronze Age. The grades, rule 3, rule 4 and the tables of Section 3 are rewritten for that. The rest is word for word. This reading of the grades is the integrator's; Chad confirms or changes it when the report is checked.

---

I am building a real-time 3D reconstruction of the island of Thera (Santorini) and its Bronze Age town at Akrotiri, as they stood shortly before the Late Bronze Age ("Minoan") eruption, in 1628 BCE on the high (radiocarbon) chronology. One layer of the world shows only what excavation has found. I want that layer to appear in the order in which the site was really excavated, so that a visitor standing at the site can see how the dig grew from its first season to today. So this lane is about the modern excavation itself: which building, street and square was uncovered when, by whom, and how. I need concrete, sourced years and places that code can be built from, and an honest grade of how sure each one is.

## Source rules (important)
1. Cite a source for every claim, with a link where one exists. Prefer the excavators' own publications (the Akrotiri excavation of the Archaeological Society at Athens: Marinatos's reports of each season, Doumas's annual reports, Palyvou and the current team), peer-reviewed journals, conference volumes, museum catalogues and specialists' books. Tourist sites, popular articles and AI-written pages are not sources; use Wikipedia only to find the sources it cites.
2. Grade every claim's confidence:
   - **A:** stated in the excavators' own report of that season or in the excavation's official publications, or shown on a dated plan or photograph they published.
   - **B:** stated in a later account by a member of the excavation, or in a peer-reviewed study that cites the reports; or the excavators' own accounts disagree.
   - **C:** a guidebook, museum label, news report or other second-hand account; or your inference from an undated plan or photograph.
3. Begun is not finished. For every building keep apart the year digging began there, the years it went on, the year it was first reported, and the year it was finished, if it was.
4. Dates: give every event its year, and its month or season where a source states it. Where you mention the age of what was found, give its archaeological phase and say whether the date follows the "high" (radiocarbon) or "low" (Egyptian-linked) chronology.
5. Numbers: whenever a source gives a measurement (size, height, depth, area, count, distance), give the number, its unit and its range as the source states them. If you convert units, say "converted".
6. Never guess. If you cannot find something, write "could not verify". Label your own reasoning INFERENCE. Mark single-source claims [verify]. The names of buildings, streets and squares at Akrotiri are modern labels: say who gave each and when if a source says, and never present one as ancient. Linear A is undeciphered: never invent a Minoan word or name.
7. Read only: no sign-ups, purchases or downloads.
8. Rights: when you cite a plan, map, photograph, 3D model or dataset, state its licence or terms of use if the source states them.

## LANE T8: the history of the excavation at Akrotiri

### Topics
A. **Before the modern dig.** Any excavation or find on the site or beside it before the systematic excavation began: who, when, where it lay relative to today's excavated area, and whether anything of it can still be seen.
B. **Season by season.** For every season from the first to the latest reported: the year, the director, the trenches or areas opened and what they were called, and which buildings, rooms, streets or squares were begun, continued or finished. Say where the first trenches were set and why there, and in which direction and by what method (trench, tunnel, open area) the dig spread and was joined up.
C. **Building by building.** For each of these: the year digging began, the years it went on, whether it is fully excavated, partly excavated or known only from the tops of its walls, and how deep the volcanic deposit over it was. Sector Alpha; the House of the Ladies; the West House; the House of the Anchor; Complex Delta and each of its houses; Xeste 2; Xeste 5; Building Gamma; Complex Beta; Xeste 3; Xeste 4; the South Building; the Porter's Lodge; Telchines Street, Dactyls Street and Curetes Street; Triangle Square, Cenotaph Square, Double Horns Square and Millhouse Square. Add any building these names miss.
D. **Roofs, closures and what a visitor sees.** Each shelter over the site: when it was built and what it covers. The shafts dug for the newer shelter's pillars: when, how many, where, and what they found below the last town. Any collapse, closure and reopening, with dates. Today's visitor route: where the walkway runs, which buildings can be seen from it and which cannot, and any part that has been reburied or closed.
E. **Finds through time.** For the best-known wall paintings and groups of finds: the year each was uncovered, its building and room, and where it is kept or shown today. One row each, with no description.
F. **Dated plans and photographs.** Published plans or air photographs that show the dig at a dated stage: who made each, what it shows, and its licence or terms.

### Assumptions to test
- **T8-1:** The systematic excavation began in 1967 under Spyridon Marinatos, and Christos Doumas has directed it since Marinatos died in 1974.
- **T8-2:** The dig did not spread outward from one centre: it began as separate trenches, which were later joined.
- **T8-3:** Most of the area uncovered today was uncovered in the first eight seasons.
- **T8-4:** Published sources allow each named building to be given the year its excavation began.
- **T8-5:** The shafts dug for the newer shelter's pillars are the main evidence for the town's earlier phases.
- **T8-6:** Part of the newer shelter collapsed in 2005, and the site was closed to visitors until 2012.

## Report format (follow exactly)
- **Section 1, "Summary":** at most 12 bullets, most useful for building the world first, each naming its claim numbers. Lead with three things: the order in which the named buildings were begun; where the first trenches were; and what cannot be dated to the year.
- **Section 2, "Claims":** one Markdown table, one row per claim, numbered:
  `| # | Claim | Confidence | Evidence | Phase and date | Builds | Source URL | Source date | Retrieved |`
  Claim: one sentence. Evidence: excavated, analysed, depicted, textual or inferred. Phase and date: in this lane, the year of the event in the excavation. Builds: what the world could build from it (timeline, label, building, object or event). One source per row; repeat a claim on another row if it has a second source.
- **Section 3, "The dig in tables":** two tables.
  Season by season: `| Year | Director | Area, building or street | What was done | Confidence | Claim # |`.
  Building by building: `| Building or area | Year begun | Later years | State today | Seen from the visitor route? | Confidence | Claim # |`.
- **Section 4, "Assumptions checked":** for each assumption ID above, one line: confirmed, partly confirmed, contradicted (claim numbers), or could not verify.
- **Section 5, "Debates":** where specialists or sources disagree, each position with its sources, a few lines each.
- **Section 6, "Game hooks":** design suggestions, kept apart from the evidence and clearly marked as suggestions.
- **Section 7, "Sources":** the full list with links.

Keep the narrative short. The tables are what will be used.

## Delivery (do this last)
When the report is complete, save a copy to my Google Drive:
- **Folder:** `Thera Research`, in My Drive. Create it if it does not exist.
- **File:** `T8_Neon.md`, a plain Markdown text file (not a Google Doc and not a PDF). If a file of that name is already there, add `_2`, `_3` and so on to the name; never overwrite.
- **Content:** the whole report exactly as given here, with every section and table.

This is the one exception to source rule 7. Then end the report with one line: `DRIVE: saved as <file name>`. If you cannot write to Google Drive, try nothing else and end with the line `DRIVE: not saved`.
