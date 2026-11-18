Verification of lane T1c (docs/research/claude/T1c_Claude.md), by a separate Claude verification agent on 2026-11-18 (D13).

Every row was checked by re-opening the cited source during this run. PDFs were downloaded into a scratch folder outside the repository and read as text with `pdftotext`. Web pages were read as text or with WebFetch. Springer and PMC pages that refused a plain request were read through WebFetch. The Greek pages of the Kokkino Vouno project were read in the original. Row #54 was re-measured: the GLO-30 Santorini tile was downloaded and decoded, and the same cells were sampled. The ERDDAP test request in #48 was repeated. Sources are paraphrased. Quoted phrases are under 15 words, except the attribution texts in their own section, which are given in full.

**The licence sections are research, not legal advice.** They report what the licence texts say and how they read against this project's plan. Before release, a person qualified in EU and Greek law should confirm them.

## Verdict

- **Claims: 56 of 56 checked** against their sources. Every A-graded row, every row with a number, every licence and data row, every fifth row and every surprising row was covered, which here means all of them.
- **Confirmed: 53. Partly: 3** (#7, #12, #22). **Not supported: 0. Could not check: 0.**
- **Sources: all 31 entries in Section 5 open, and each is the work it is cited as.** No fabricated source, quotation or number was found. Every number checked matches its source. The two measurements made from the data (#45, #54) and the ERDDAP test value (#48) reproduce exactly.
- **Deposit thicknesses are attributed to the right unit.** Every figure in #1–#11 is a Minoan unit (Phases 0–4). The one older-pumice figure, ">25 m near Fira to <1 m on the Akrotiri peninsula", is correctly flagged in #21 as Lower Pumice 2 (c. 172 ka). Every thickness in #1–#13 is on land, at outcrops or in cores. The offshore figures (#20: 80 m and 14–15.7 km³; #23; #32) are marked as offshore or in the caldera. Two Section 3 entries go beyond their sources (corrections 1 and 2).
- **The licence rows are accurate.** The Copernicus GLO-30-F and GLO-90-F texts and the EMODnet terms say what the report says. Its reading of the licences is sound (see "Licence verdict").
- **The sea-level conflict is real and correctly reported.** Druitt (2015) does give "less than 0.5 m" below present 3,600 years ago, after Fleming and Webb (1986). Kolaiti and Mourtzas give −3.60 ± 0.20 m (T1#51, confirmed in the T1 check). Neither is a Santorini measurement. No Santorini-specific Holocene sea-level or uplift record was found by the report or by this check.
- **Profitis Ilias:** 565 m (SwissEduc) and 560.4 m (the highest GLO-30 cell) are confirmed. Popular sources also give 564 and 567 m, none with a named survey. The report leaves out SwissEduc's 369 m for Mesa Vouno, which matters because the surface model reads 359.9 m there (correction 3).
- **Usable for the terrain work order (`tools/terrain/edits.json`): yes, with the corrections below.** Each figure must go in with its claim number, unit and grade. The thicknesses are present-day thicknesses at named places, not an isopach map. Any strip-off surface built from them is still a liberty (§6 of the standard). The datasets may be used once the attribution texts below travel with the page.

## Table

Grades are judged against `docs/HISTORICAL_STANDARD.md` §3 and the landscape reading of the grades used in T1 (an A-grade row is a physical observation of the deposits or of the pre-eruption ground). The T1 check (correction 15) asked for that reading to become a decision. Until it does, A on a deposit row means "an observed Minoan deposit", not an LC I find.

| # | Claim (short) | Opens | Supports | Number | Grade | Fix |
|---|---|---|---|---|---|---|
| 1 | Minoan tuffs cover Thera, Therasia, Aspronisi, up to 55 m | yes (PDF) | Confirmed (Druitt 2015, p. 19) | 55 m exact | A ok | Pfeiffer's page gives "up to 50 m"; note it as the alternative. |
| 2 | Phase 0: two lapilli layers + phreatomagmatic ash, ~10 cm; SSE only | yes | Confirmed (Druitt p. 19, after Cioni et al. 2000) | 10 cm exact | A ok | — |
| 3 | Phase 1 up to 5.5 m; SE dispersal axis; vent between Nea Kameni and Fira; SSE fallout | yes | Confirmed (Druitt p. 19) | 5.5 m exact | A ok | — |
| 4 | Phase 1 from 6 m to <10 cm across Santorini, Therasia, Aspronisi | yes (PDF) | Confirmed (Nomikou et al. 2019 guide) | exact | A ok | — |
| 5 | Phase 1 50–500 cm (P&F) or 10–600 cm (H&M); mantles evenly; thickest, pumice to 30 cm, S of Fira; ~5 m near Athinios | yes (HTTP) | Confirmed (Pfeiffer web page) | all exact | B ok | The ~5 m at Athinios is a photo caption. |
| 6 | Phase 2 0.1–12, 0.5–7, "up to 10", "up to c. 12" m; thickest Fira–Athinios; climbs 10–30° slopes to 200–400 m | yes | Confirmed (Pfeiffer; Karátson 2020 p. 4; Nomikou 2019) | all exact | A/B ok | — |
| 7 | Phase 3 to 55 m at caldera wall; 40 m rim (P&F), 55 m S Thera (H&M); thickens into lows; lithic blocks to ~10 m | yes | **Partly.** Thicknesses confirmed (Druitt p. 20; Pfeiffer). Druitt says blocks of a metre or more are common. The ~10 m blocks come from Pfeiffer ("10 m or more") and Karátson 2020 (glassy andesite to 10 m), not Druitt. | 55/40 m exact | A/B ok | Attribute the 10 m blocks to Pfeiffer and Karátson 2020. |
| 8 | Phase 4 thin on rim (0.7–2 m); fans to 40 m on coastal plains; three fans NW, E, S; distal thickening, most volume offshore | yes | Confirmed (Pfeiffer; Druitt p. 20; Karátson 2020 p. 4) | exact | A/B ok | Add: Karátson 2020 names the fans N, E and SE. Pfeiffer reports a minority view (Pichler and Kussmaul; Friedrich) that Phase 4 is reworked Phase 3, which affects stripping (correction 6). |
| 9 | Phase 4 S fan cliff 40 m high at Vlychada | yes | Confirmed (Nomikou 2019, Fig. 28 caption) | 40 m exact | A ok | — |
| 10 | P4 capped by 1–3 m fluvial gravels, up to 1 m wind-reworked ash; gravels to 40 m asl; margins of high ground | yes | Confirmed (Druitt p. 20) | exact | A ok | — |
| 11 | Tuff virtually gone from outer flanks of Profitis Ilias, Mikro Profitis Ilias, Megalo Vouno; redeposited on plains | yes | Confirmed (Pfeiffer, in the Phase 4 debate) | — | B ok | The same page puts Phase 1 pumice on the Profitis Ilias summit under a Phase 2 block, and Phase 3 on 30° upper flanks of Mikro Profitis and Megalo Vouno (correction 5). |
| 12 | Marinatos 1968: no ash above Agios Nikolaos or around "Loumaravas" height; Kokkino Vouno bare, keeps its pre-eruption form | yes (Greek) | **Partly.** All observations confirmed. The source's name is Λουμαράδων (Loumarades), not "Loumaravas". | — | B ok | Use "Loumarades (Λουμαράδες)" or quote the Greek. |
| 13 | Earlier Mavro Rachidi cores: ~1 m soil; post-eruption flood deposits; ash ~3–4 m, partly washed seaward; ~1 m black marine sand; ignimbrite | yes (Greek) | Confirmed (2025 report, expected sequence) | ~1, 3–4, ~1 m exact | B ok | The source says "volcanic ash" and names no unit; it is Minoan by position only. No elevations. |
| 14 | 22–23 Sep 2025, two cores, ~200 m and ~130 m from shore, ~20 m of core each; valley formerly marine; OSL and ¹⁴C pending | yes (Greek) | Confirmed | all exact | B ok | — |
| 15 | Seismics: pre-Minoan surface (Cape Riva ignimbrite) rises from site to SE coast, up to 30 m asl | yes (Springer preview via WebFetch) | Confirmed | 30 m exact | B ok | — |
| 16 | Potamos has roughly its Minoan shape, minor infill, floor above sea level; no bay there | yes | Confirmed | — | B ok | Vlachopoulos (2019) still places an eastern harbour at Potamos (correction 4). |
| 17 | Basement (andesitic lava) ~25 m in Mavrorachidi; south of site the better harbour; possible buried former cliff | yes | Confirmed (preview and S2 abstract) | 25 m exact | B/C ok | — |
| 18 | Onshore thickness maps (H&M 1984) digitised: 0.28, 0.34, 0.45, 0.36 = 1.43 km³ | yes (PDF) | Confirmed (Karstens et al. 2023, ref. 4 is H&M 1984) | all exact | B ok | — |
| 19 | INFERENCE: 1.43 km³ ÷ 85.2 km² ≈ 17 m mean | n/a | Arithmetic checked: 16.8 m | ok | C ok | Areas are T1#26 (confirmed in T1). |
| 20 | Minoan ignimbrite to 80 m offshore; offshore bulk at most 14–15.7 km³ | yes | Confirmed (Druitt p. 20; Karstens) | exact | B ok | Karstens calls 14–15.7 km³ a maximum estimate. |
| 21 | ">25 m near Fira to <1 m on Akrotiri peninsula" is Lower Pumice 2 (172 ka), not Minoan | yes | Confirmed (Druitt p. 14) | exact | B ok | Correct caution; keep. |
| 22 | 1978 Nature report: pumice fall ~1–2 cm then ash fall ~1–2 m over the town (Doumas); near room-temperature emplacement (Tarling) | yes (PDF) | **Partly.** The numbers are right. The Doumas credit closes the earthquake sentence; the ash-fall sentence carries no name. The report omits the next sentence: the main pumice came as a base surge. | 1–2 cm; 1–2 m exact | B ok | Reword the attribution. Fix Section 3a (correction 2). |
| 23 | Low-T flows outside caldera need a filled caldera, since downfaulted; infill 18–26 km³ DRE | yes (OpenAlex) | Confirmed (Johnston et al. 2014 abstract) | exact | B ok | — |
| 24 | Composite caldera, >100 ka; S, SE, NW cliffs fresh, landslides; N, NE, E walls three cliff generations, two pre-Minoan; tephra plastered | yes (Springer abstract via WebFetch) | Confirmed (D&F 1992) | — | B ok | — |
| 25 | Flooded caldera ~21 ka, excellent harbour; 5–8 km³ ponded; collapse ~25 km³ | yes | Confirmed (D&F 1992 abstract) | all exact | B ok | — |
| 26 | ³⁶Cl CRE: old caldera over at least the northern half of today's; no ages, depth or opening in abstract | yes (Springer abstract; Crossref) | Confirmed (Athanassas et al. 2016, 78(5): 35) | — | B ok | — |
| 27 | Collapsed volume vs water depth hard to assess; seismics and drilling needed; sunken on-land part ≤ ~2.7 km³ | yes (PDF) | Confirmed (Karátson 2020 p. 11) | 2.7 km³ exact | C ok | Karátson 2020 also calls the initial northern bay "shallow, small" (correction 8). |
| 28 | Karátson 2020 method: arc rim, hand contours at equal intervals to "former sea level"; no depth or datum | yes | Confirmed (p. 10) | — | C ok | — |
| 29 | Karátson 2018: combined DEM 10 m off / 15 m on (Nomikou 2016); no data statement; 212.5 KB supplement | yes (PMC) | Confirmed | exact | data ok | The supplement is a .doc file. |
| 30 | Nomikou 2016: data "available on request"; DEM degraded to 125 m; entry channels 20–300 m are post-eruption scenarios | yes (PMC via WebFetch) | Confirmed | exact | data/C ok | — |
| 31 | Karátson 2020 CC BY-NC-ND 4.0; Karátson 2018 CC BY 4.0 | yes | Confirmed (licence lines in both) | — | licence ok | — |
| 32 | IODP 398 caldera Sites U1594–U1597: one unit, thin biogenic mud over volcaniclastics; fill post-Minoan; U1596B sea floor 381.9 mbsl | yes | Confirmed (weekly reports 7 and 8) | 381.9 exact | B ok | — |
| 33 | Karstens open data: PANGAEA.937928 (cores), PANGAEA.956579 (seismics); licences unchecked | yes | Confirmed (data statement) | IDs exact | data ok | — |
| 34 | Vlachopoulos: fill S of site is eruptive; Mesovouna–Mavro Rachidi embayment probably the harbour; Kokkino Vouno its western arm; boat cove near Red Beach | yes (Greek) | Confirmed (the argument is explicitly conditional) | — | C ok | — |
| 35 | Doumas identified the two-hilled peninsula of the miniature frieze with Kokkino Vouno and Mesovouna; T1#36's "Mesavouno" is probably Mesovouna | yes | Confirmed (identification). The inference fits: T1#36's "between Mesavouno and Mavrorachidi" matches Vlachopoulos's embayment. | — | C ok | Keep [verify] until Doumas 1983 is read. |
| 36 | 1968 one-day trench on Kokkino Vouno, ~4 m long, 0.8–1.0 m deep; walls, fine pottery, metal, painted plaster; red ignimbrite, building stone | yes (Greek) | Confirmed | exact | B ok | Also found: a rim piece of a veined-marble vessel. |
| 37 | Aegean 3,600 years ago <0.5 m below present (Fleming and Webb 1986) | yes | Confirmed (Druitt p. 29) | exact | C ok | — |
| 38 | S Nea Kameni subsided ~6 mm/yr 1993–2010, inflated 2011–12 (Parks 2015); Kameni shores sank in historical eruptions | yes | Confirmed (Druitt; Nomikou 2019, 1866 and 1925 accounts) | exact | C ok | — |
| 39 | Akrotiri centres uplifted as two fault blocks, complete by Mavrorachidi cones (522 ± 104 ka); no Holocene rate | yes | Confirmed (Nomikou 2019 p. 16) | exact | C ok | — |
| 40 | Copernicus WorldDEM-30 licence (GLO-30-F): reproduce, distribute, communicate, adapt; worldwide, perpetual, free | yes (PDF, 3 pp., created 29 Oct 2020) | Confirmed (Arts. 3–5) | — | licence ok | — |
| 41 | Art. 6 obligations (a)–(e) | yes | Confirmed, wording checked against the text | — | licence ok | — |
| 42 | GLO-90-F same terms with "WorldDEM™-90"; ESA doc issued 21 Feb 2025 also holds the restricted GLO-30-R/EEA-10-R licence | yes (PDF, 24 pp.) | Confirmed | — | licence ok | — |
| 43 | GEE GLO-30 2024_1: surface model; EGM2008, so 0 m is not mean sea level; repeats notices | yes | Confirmed | — | data ok | — |
| 44 | AWS: "GLO-30 Public" and GLO-90 COGs, 2021 release; no account; no ocean tiles (0 m); some 30 m tiles withheld; licence links to Copernicus | yes | Confirmed (registry and readme) | — | data ok | — |
| 45 | Santorini tiles exist; GLO-30 3,373,505 bytes, 3600 × 3600 at 1″; GLO-90 tile present | yes (HTTP 200 for both) | Confirmed (size from headers; dimensions from the file) | exact | data ok | — |
| 46 | EMODnet terms: EU-owned products, CC BY 4.0 unless stated; set acknowledgement; originators' restrictions; as is | yes | Confirmed | — | licence ok | — |
| 47 | DTM 2024 record: CC BY 4.0; "DO NOT USE FOR NAVIGATION"; LAT; 1/16′ (~115 m); 59 tiles; surveys not distributed | yes | Confirmed | exact | licence/data ok | — |
| 48 | ERDDAP `bathymetry_dtm_2024`, no account; −244.77 m at 36.4109 N 25.3797 E; ERDDAP licence attribute is NOAA boilerplate; DOI cited | yes | Confirmed; request repeated, same value | exact | data ok | — |
| 49 | EMODnet World Base Layer: land for viewing only; EU-DEM credit needed | yes | Confirmed | — | licence ok | — |
| 50 | No open Ktimatologio elevation model found; project used Cadastre data under a special permit | yes (Greek) | Confirmed (2024 report: data given after a special permit for university research) | — | licence ok | The data type is not stated (it underlies the contour map). |
| 51 | FABDEM CC BY-NC-SA 4.0 [verify on FABDEM site] | yes (wiki); Bristol data page also opened | Confirmed. The University of Bristol data page states the same licence. | — | licence ok | Drop [verify]. |
| 52 | Sonny's LiDAR DTMs CC BY 4.0, no Greece | yes | Confirmed (Greece not in the country list) | — | licence ok | — |
| 53 | Profitis Elias 565 m; Mesozoic limestone and marble | yes | Confirmed (SwissEduc, updated 2021-06-18) | 565 exact | B ok | The same page gives Mesa Vouno as 369 m (correction 3). |
| 54 | GLO-30 samples: max 560.4 m at 36.3685 N 25.4640 E; Mesa Vouno 359.9 m at 36.3635 N 25.4776 E; Akrotiri peninsula W of 25.42 E 208.1 m at 36.3588 N 25.3893 E; excavation 26–40 m | yes (tile decoded) | Confirmed: all values and coordinates reproduce | exact | data ok | — |
| 55 | PI and Mesa Vouno weakly metamorphosed calcitic/dolomitic marble; megalodons to 30 cm; stromatolitic laminae; metaflysch syncline; Tripolitza vs Sub-Pelagonian | yes (thesis PDF via WebFetch) | Confirmed (Lion 2018, PDF p. 20, after Schneider et al. 2018) | 30 cm exact | B ok | — |
| 56 | Athinios basement: mica schists, metabasites, marble interlayers, relict blueschist minerals (CBU); outcrop N of Emporio | yes (PDF) | Confirmed (EGU2018-5191) | — | B ok | — |

## Corrections to apply before building

1. **Section 3a, caldera rim, "up to ~55–65 m":** no source gives 65 m. Adding the phase maxima (5.5 + 12 + 55 + 2) does not give a thickness at any one place, which the report itself says. Use "up to ~55 m for the whole Minoan pile (Druitt 2015, #1); 50 m in Pfeiffer". Record the thickness at any modelled point as a liberty.
2. **Section 3a, "Town of Akrotiri ≥1–2 (pumice fall)":** wrong unit and wrong layer. The 1978 report gives a pumice fall of about 1–2 **cm**, then an ash fall of about 1–2 **m** over the town, then the main pumice as a base surge. Reword as "initial ash fall ~1–2 m, after ~1–2 cm of fine pumice (1978 conference report, old, unnamed author)". Keep [verify]. It conflicts with today's description of metres of Phase 1 Plinian pumice and should not set a strip depth.
3. **Section 3f, Mesa Vouno:** add SwissEduc's 369 m beside the GLO-30 359.9 m. Both GLO-30 summits read low against the published heights (560.4 against 564–567 m; 359.9 against 369 m), even though the model includes buildings. So 30 m cells shave peaks by several metres. Pin summits to published heights (grade B, survey unstated) rather than to the DEM.
4. **Harbour (Summary 3, Section 3c, Debates 3):** "Potamos is now ruled out by seismics" is too strong. Theodorakopoulou et al. found no evidence of a bay there. Vlachopoulos (2019), on the same project page used for #34, still describes two bays on either side of the town and places the eastern harbour at Potamos. Record both views.
5. **Section 3a, high basement "~0 m":** this holds for the outer flanks (#11). The same source puts Phase 1 pumice on the Profitis Ilias summit (under a Phase 2 ballistic block). It also places Phase 3 on 30° upper flanks of Mikro Profitis Ilias and Megalo Vouno. Use "~0 m on outer flanks; thin Minoan patches may remain on summits and upper flanks".
6. **Row #8:** add the debate that Pfeiffer reports. Pichler and Kussmaul and Friedrich read Phase 4 as reworked Phase 3, laid down during and after the collapse. Bond and Sparks, Heiken and McCoy, and Sparks and Wilson read it as primary hot ignimbrite. Either way, the coastal fans are not part of the 1615 BCE ground, but the reworked reading makes some fan material post-eruption.
7. **Row #13:** state that the source's "volcanic ash" names no unit and gives no elevations. The sequence is the project's *expected* one, from earlier cores.
8. **Section 3b, bay depth:** the value stays "could not verify", but add three qualitative statements: Karátson 2020 ("shallow, small northern flooded caldera"), Karátson 2018 Fig. 4 caption ("smaller and shallower caldera harbour"), and Nomikou 2016 ("shallow", lagoonal). All are B/C. None gives a number.
9. **Row #7:** credit the ~10 m lithic blocks to Pfeiffer and Karátson 2020; Druitt says blocks of a metre or more are common.
10. **Row #12:** the place name is Λουμαράδες (Loumarades), not "Loumaravas".
11. **Row #22:** the Doumas credit attaches to the earthquake sentence, not clearly to the ash-fall figures.
12. **Section 3e, a missing step:** GLO-30 heights are on EGM2008 (#43). EMODnet depths are on LAT (#47). Joining them at the coast needs a stated vertical offset, and that offset is a liberty until sourced. Neither source gives it.
13. **Row #51:** drop [verify]; the FABDEM data page confirms CC BY-NC-SA 4.0.
14. **Source 16 (Theodorakopoulou et al.):** Crossref records a CC BY 4.0 licence for this chapter, but the Springer page shows only a paywalled preview. The full chapter may be legally open somewhere (see Gaps).

## Licence verdict (research, not legal advice)

**Copernicus DEM GLO-30-F and GLO-90-F.**
- **What the licence allows:** Article 4 allows reproduction, distribution, communication to the general public, and adaptation, modification and combination with other data. Articles 3 and 5 make this worldwide, without time limit and free of charge. There is no non-commercial or share-alike condition.
- **Is the project's use allowed?** A derived, edited and compressed height field inside a public web page is "adapted or modified" data that is distributed and communicated to the public, and the licence allows that. A later sale is not excluded by any clause read here.
- **What must travel with it** (Article 6):
  - (b) the "produced using …" notice for adapted data;
  - (a) the plain source notice, if unmodified tiles are ever redistributed;
  - (c) the no-liability sentence, placed in "a licence or any legal warning or notice" covering the distribution;
  - (d) nothing that implies endorsement by Airbus, ESA, the EU or anyone else running the programme;
  - (e) because the project's MIT licence lets anyone redistribute, the project must ensure those subsequent users are bound by (a)–(d).
- **Practical consequence:** MIT alone cannot cover the embedded height data. The page and the repository should say that the elevation-derived data stays under the Copernicus licence and carry the notices below. The report's reading is correct.
- **Other clauses:** Airbus keeps its intellectual property (Article 9). The licence grants no trademark use beyond naming "WorldDEM" in context. A breach can end the licence.
- **Which instances:** use only the -F instances. The ESA document of 21 Feb 2025 also contains a restricted GLO-30-R/EEA-10-R licence, and that one excludes the general public.
- **Open questions for a lawyer:** whether a heavily edited reconstruction still counts as the "Copernicus WorldDEM-30" (the safe course is to assume it does), and whether licence acceptance (Article 1) needs any step beyond downloading.

**EMODnet DTM 2024.**
- **What the licence allows:** the product is CC BY 4.0 (record and terms page). Copying, adaptation and redistribution, including commercial use, are allowed with attribution. CC BY has no share-alike clause, so the data can sit in an MIT-licensed repository and page.
- **What must travel with it:** CC BY 4.0 requires credit to the creator, a link to the licence, and a statement that the data was changed. EMODnet asks for its set acknowledgement sentence (below).
- **Other conditions:** underlying survey data keep their originators' terms, but the gridded product is what the project uses. The record warns the data is not for navigation. Depths are referred to LAT.
- **ERDDAP:** the ERDDAP "license" attribute is NOAA's generic text. EMODnet's terms govern.

**Not usable:** FABDEM (non-commercial), Karátson 2020 figures (NC-ND), the Hellenic Cadastre model (permit only), and the EMODnet World Base Layer land data (viewing only). **Usable:** Karátson 2018 Fig. 4 (CC BY 4.0, credit the article; it is a figure, not data).

## Attribution texts each dataset requires

Copied from the licence texts opened in this run. The quotation marks around (b) are in the source.

**Copernicus DEM GLO-30 (COP-DEM-GLO-30-F), Licence for the use of the Copernicus WorldDEM-30, Article 6:**
- (a) source notice, when distributing or communicating the data: © DLR e.V. 2010-2014 and © Airbus Defence and Space GmbH 2014-2018 provided under COPERNICUS by the European Union and ESA; all rights reserved.
- (b) notice for adapted or modified data: "produced using Copernicus WorldDEM-30 © DLR e.V. 2010-2014 and © Airbus Defence and Space GmbH 2014-2018 provided under COPERNICUS by the European Union and ESA; all rights reserved".
- (c) sentence to add in a licence or legal notice: "The organisations in charge of the Copernicus programme by law or by delegation do not incur any liability for any use of the Copernicus WorldDEM-30".

**Copernicus DEM GLO-90 (COP-DEM-GLO-90-F), ESA licence document issued 21/02/2025, Article 6:**
- (a) © DLR e.V. 2010-2014 and © Airbus Defence and Space GmbH 2014-2018 provided under COPERNICUS by the European Union and ESA; all rights reserved.
- (b) "produced using Copernicus WorldDEM™-90 © DLR e.V. 2010-2014 and © Airbus Defence and Space GmbH 2014-2018 provided under COPERNICUS by the European Union and ESA; all rights reserved".
- (c) "The organisations in charge of the Copernicus programme by law or by delegation do not incur any liability for any use of the Copernicus WorldDEM™-90".

**EMODnet DTM 2024, EMODnet terms of use, statement for EMODnet data products:**
- "This data product was created by EMODnet ( https://emodnet.ec.europa.eu/en/ ), and is owned by the EU and licensed under the Creative Commons Attribution 4.0 International (CC BY 4.0) license."
- CC BY 4.0 also requires: a link to https://creativecommons.org/licenses/by/4.0/ and a note that the data was modified (e.g. "resampled, cropped and edited for this project").
- Suggested dataset citation (the DOI is from the record and ERDDAP; the wording is this check's, not EMODnet's): EMODnet Bathymetry Consortium (2024), EMODnet Digital Bathymetry (DTM 2024), https://doi.org/10.12770/cf51df64-56f9-4a99-b1aa-36b8d7b743a1.
- Not for navigation.

## Sea-level note

- Druitt's "<0.5 m" (after Fleming and Webb 1986) is an older Aegean-wide estimate.
- Kolaiti and Mourtzas's −3.60 ± 0.20 m is measured on beachrock and archaeological markers in the northern and central Cyclades (Mykonos–Delos–Rheneia). It includes a local tectonic part of 1–1.20 m (T1#52).
- INFERENCE: the non-tectonic part of −3.6 m would be about −2.4 to −2.6 m, still well below Druitt's figure.
- Santorini lies on the volcanic arc in the south Aegean, outside both datasets. Its own vertical movement since c. 1615 BCE is unknown.
- The report's handling stands: keep −3.6 m as a grade-C liberty and record 0 to −0.5 m as the alternative. The Mavro Rachidi cores (#14), once their marine sand is dated and levelled, are the best local test.

## Gaps

- **No isopach map was opened**, so stripping rests on point thicknesses. Bond and Sparks 1976, Heiken and McCoy 1984 and Druitt et al. 1999 remain unopened. Karstens et al. digitised the Heiken and McCoy maps but did not publish the grid; asking the authors for it is the shortest route to a real strip-off surface.
- **Theodorakopoulou et al. 2018:** Crossref lists CC BY 4.0. A legal open copy (Unpaywall, the publisher's open-access version, or the authors) should be sought; its body may give core logs and elevations near the town.
- **Bay depth and channel:** still no number in any source opened. The qualitative statements say "shallow" (correction 8).
- **Santorini relative sea level and land movement:** none found (a further search by this check also failed).
- **Mavro Rachidi core results:** dates and levels are pending (#14).
- **Vertical datum join** between EGM2008 and LAT around Santorini: not sourced (correction 12).
- **Summit heights:** no Hellenic Military Geographical Service trigonometric value was found for Profitis Ilias or Mesa Vouno.
- **PANGAEA licences** for the Karstens data (#33): not checked. Both datasets are offshore and not needed for the land build.
- **Doumas 2014** (*Aegaeum* 37) on the pre-eruption south coast, and Eriksen et al. 1990 (stromatolite elevations): still unread.
