# Prompt: Gemini 4 Argon Deep Research, lane X1: the world clock, complete (length test)
**For:** Chad, to paste into Gemini with **Argon**, thinking **high** and **Deep Research** on, in its own new chat. Paste everything below the line and add nothing. Steps: `docs/research/README.md`.
**Returns to:** save the report as `docs/research/argon/X1_Argon.md`. Claude checks its key claims against the sources (`docs/research/verification/X1.md`) before anything is built from it.
**Run order:** round 0, before everything else. It tests whether Argon now finishes a long prompt and a long report: the pasted part is about 9.7 KB, and the report it asks for is about twice as long as any other lane's, against the 8.9 KB prompt that stalled in October (unghost RL1). It covers everything in W1 and W2 plus calendars and climate events. **If it finishes with every section, W1 and W2 are not needed. If it stalls, run W1 and W2 instead,** and the lesson about short prompts stands.
**Pass, for the test:** the report finishes; it has all 12 sections listed under "Report format"; the Claims table has well over 60 rows, each with a source link; and the World clock table has a row for every region in topic C.

---

I am building a real-time 3D reconstruction of the ancient world at one moment: c. 1650 BCE, give or take 100–150 years (about 1800–1500 BCE). The first place is the island of Thera (Santorini) and its Bronze Age town at Akrotiri, just before the Late Bronze Age ("Minoan") eruption. Later places will include Crete, mainland Greece, Egypt, Byblos and the Levant, Cyprus, Anatolia and Mesopotamia. Every place must agree on what year it is, so this lane builds the project's whole world clock in one report: the date of the Thera eruption, the periods, rulers and calendars of every region in the window, the links between regions, and the datable events that every place would have shared.

This lane replaces two shorter ones, so it is long on purpose. Cover every topic fully. A long, complete report is expected and wanted; do not shorten tables or merge rows to save space.

## Source rules (important)
1. Cite a source for every claim, with a link where one exists. Prefer peer-reviewed papers, published dating datasets, standard chronological handbooks, excavation reports and museum catalogues. Popular articles and AI-written pages are not sources; use Wikipedia only to find the sources it cites.
2. Grade every claim's confidence:
   - **A:** direct dating or a contemporary link: a radiocarbon or tree-ring result on securely contexted material, a text of the time, or an object from one region found in a dated context in another.
   - **B:** a date that depends on a model, a calibration or a choice of chronology, or a link whose reading is debated.
   - **C:** later tradition, a hypothesis, or a date carried over by analogy.
3. Name the chronology behind every absolute date: the Aegean "high" or "low" chronology, the Egyptian chronology used and its source, the Mesopotamian Middle or Low Chronology, and for radiocarbon the calibration curve (e.g. IntCal20) and the probability of the range (68% or 95%).
4. Give dates and ranges exactly as the source states them.
5. Never guess. If you cannot find something, write "could not verify". Label your own reasoning INFERENCE. Mark single-source claims [verify]. Never invent an ancient word, name or month name; say plainly when none is known.
6. Read only: no sign-ups, purchases or downloads.

## LANE X1: the world clock, complete (c. 1800–1500 BCE)

### Topics
A. **The date of the Thera eruption today.** The radiocarbon evidence (for example the olive branch buried on Thera, short-lived samples from Akrotiri, IntCal20 and the newer annual tree-ring calibration work), ice cores and tree rings (and whether any ice-core tephra has been chemically matched to Thera), the Çeşme-Bağlararası evidence in western Anatolia, the archaeological synchronisms (Theran pumice at Tell el-Dab'a and other Egyptian and Levantine contexts, Cypriot White Slip I at Akrotiri, links to the Egyptian 18th Dynasty) and the debate over Ahmose's "Tempest Stela". Give each current estimate with its range and its authors, and say where the "high" and "low" positions stand now.
B. **The Aegean phases.** Middle Minoan III, Late Minoan IA and IB, Late Cycladic I, and Middle and Late Helladic (including the Mycenae Shaft Graves): their absolute dates under the high and the low chronology, and how long Akrotiri's final phase lasted before the eruption, including the earthquake that came before it.
C. **Who was where.** For each region give the period names with their dates, the dynasties or rulers known for about 1700–1550 BCE, and the main centres:
   - Crete (the Neopalatial palaces and towns) and mainland Greece (the Shaft Grave period);
   - Egypt: the 13th Dynasty, the Second Intermediate Period, the 15th ("Hyksos") Dynasty at Avaris (Tell el-Dab'a), the 16th and 17th Dynasties at Thebes, and the start of the 18th Dynasty; with the Egyptian chronology used;
   - the northern Levant (Byblos, Ugarit, Alalakh, Qatna, Ebla) and the southern Levant (e.g. Hazor, Tel Kabri, Ashkelon);
   - Cyprus (Middle Cypriot III to Late Cypriot I);
   - Anatolia (the end of the Assyrian colony period, the Old Hittite kingdom);
   - Mesopotamia (the late Old Babylonian period, the Sealand dynasty, the fall of Babylon) with Middle and Low Chronology dates;
   - Nubia (Kerma).
D. **Links between regions in the window.** Objects and texts that tie two regions together, for example the Khyan lid from Knossos, the Minoan-style wall paintings at Tell el-Dab'a, Tel Kabri, Alalakh and Qatna, Kaptara and Caphtor in the Mari and other texts, Aegean pottery in Egypt and the Levant, and Levantine and Egyptian goods in the Aegean. For each: what it is, where it was found, the date of its context, and what it does and does not prove.
E. **Calendars and timekeeping.** How each region counted years, months and days in the window: the Egyptian civil calendar, its seasons and regnal-year dating; the Babylonian lunar calendar, intercalation and year names; whatever is known for the Hittites, the Levantine cities (e.g. Ugarit, Byblos) and Cyprus; and whether anything of a calendar is known for Crete and the Cyclades. Which solar, lunar or star events marked seasons and festivals (for example the heliacal rising of Sirius in Egypt, and whether it can date reigns in this window). What a reconstruction could honestly show as "today's date" in each place.
F. **Datable events every place shared.** Climate and environmental signals from c. 1800–1500 BCE in tree rings, ice cores, speleothems and sediments: volcanic eruptions other than Thera, droughts, cold or wet spells, and Nile flood levels where recorded. Which are dated well enough to place on the clock, and which are disputed or wrongly linked to Thera.
G. **Two likely next places.** What Byblos and Avaris were like about 1650 BCE (extent, main buildings, rulers, harbours, trade), in a few lines each with sources.
H. **How it is presented.** How current handbooks, major museums (for example the Museum of Prehistoric Thera, the British Museum, the Metropolitan Museum) and recent syntheses state the eruption date, and how they handle the high/low disagreement in public.

### Assumptions to test
- **X1-1:** The eruption happened between about 1630 and 1500 BCE: radiocarbon has favoured the later 17th century BCE, and Egyptian-linked archaeology about 1530–1500 BCE.
- **X1-2:** Recent tree-ring-based radiocarbon calibration has narrowed the gap and points to the 16th century BCE.
- **X1-3:** Akrotiri's final phase (Late Cycladic I / Late Minoan IA) falls within 1800–1500 BCE under either chronology.
- **X1-4:** Late Minoan IA lasted several decades at least, and the earthquake that damaged Akrotiri came months to a few years before the eruption.
- **X1-5:** No ice-core tephra has been securely matched to the Thera eruption.
- **X1-6:** About 1650 BCE, Egypt was in the Second Intermediate Period, with the 15th ("Hyksos") Dynasty ruling the north from Avaris.
- **X1-7:** In the Middle Chronology, Hammurabi reigned 1792–1750 BCE and Babylon fell to the Hittite king Mursili I in 1595 BCE.
- **X1-8:** About 1650 BCE, Byblos was a Middle Bronze Age city-state with close ties to Egypt.
- **X1-9:** The Minoan-style wall paintings at Tell el-Dab'a date to the early 18th Dynasty, not the Hyksos period.
- **X1-10:** The Khyan lid found at Knossos ties a 15th Dynasty king to Middle Minoan III Crete.
- **X1-11:** The Old Hittite kingdom was founded by Hattusili I in the mid 17th century BCE (Middle Chronology).
- **X1-12:** Egypt's civil calendar had 365 days and no leap day, so its months drifted against the seasons by about one day every four years.
- **X1-13:** No calendar from Bronze Age Crete or the Cyclades has been reconstructed.
- **X1-14:** No well-dated climate event in the window other than the eruption itself is securely tied to Thera.

## Report format (follow exactly)
- **Section 1, "Summary":** at most 15 bullets, most decision-relevant first, each naming its claim numbers.
- **Section 2, "Claims":** one Markdown table, one row per claim, numbered:
  `| # | Claim | Confidence | Evidence | Region(s) | Date and chronology | Source URL | Source date | Retrieved |`
  Claim: one sentence. Evidence: dated sample, text, object in context, model, or inferred. One source per row; repeat a claim on another row if it has a second source.
- **Section 3, "The eruption date":** `| Method or evidence | Estimate | Range (and probability) | Authors and year | Claim # |`.
- **Section 4, "Aegean phases":** `| Region | Phase | Start BCE (high) | End BCE (high) | Start BCE (low) | End BCE (low) | Claim # |`.
- **Section 5, "World clock":** one row per region and period: `| Region | Period or phase | Start BCE | End BCE | Chronology | Rulers or dynasties c. 1700–1550 BCE | Main centres | Claim # |`.
- **Section 6, "Links between regions":** `| Object or text | Found at | Context date | Regions linked | What it shows | Confidence | Claim # |`.
- **Section 7, "Calendars":** `| Region | How years were counted | Months and days | Season and festival markers | Confidence | Claim # |`.
- **Section 8, "Shared events":** `| Event | Evidence | Date and range | Regions affected | Confidence | Claim # |`.
- **Section 9, "Byblos and Avaris c. 1650 BCE":** a few lines each, with claim numbers.
- **Section 10, "Assumptions checked":** for each assumption ID above, one line: confirmed, partly confirmed, contradicted (claim numbers), or could not verify.
- **Section 11, "Debates and could not verify":** where specialists disagree, each position with its sources; then the questions you could not answer from a primary source.
- **Section 12, "Sources":** the full list with links.

Keep the narrative short. The tables are what will be used.
