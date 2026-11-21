Verification of lane T3b (docs/research/neon/T3b_Neon.md, written by Gemini Neon Deep Research), by a separate Claude verification agent on 2026-11-21 (D13).

Every cited URL that a row relies on was requested during this run, first with a plain download and then, where refused, through a second fetcher. PDFs were read as text with `pdftotext`. One scanned volume with no text layer (Marinatos 1968) was read as page images at pp. 4–6. Where the cited page refused (ResearchGate, Taylor & Francis, Emerald, MDPI's article pages), the same work was read from MDPI's file server, an author's postprint, or its abstract in OpenAlex, Europe PMC, AGRIS or the Aegeus Society. A row checked only against an abstract is checked against that text only. Three cited files are unofficial copies of copyrighted books and were not opened ([9] Foxhall, [68] Walsh, [79] Halstead). Numbers in brackets, such as [24], are the report's own "Works cited" numbers. Sources are paraphrased; short quoted phrases are under 15 words.

## Verdict

- **Rows: 124** (claims 1–48 with their lettered rows). **Checked: 76. Wrong: 7** (#9, #10a, #29, #34e, #41c, #44a, #47a). **Regraded: 5** (#17a, #17b, #24a, #37b, #43c, all down). **Could not check: 36.** Most of the 36 sit behind three walls: the full text of Asouti 2003 (paywalled; rows 19, 20, 22, 23, 24b, 25, 26a, 42c), Sarpaki 2019 (a paid chapter on ResearchGate; rows 1, 2, 4a, 5a, 6b), and papers held only on ResearchGate.
- **Coverage.** All three assumptions the report marks "partly confirmed" (T3b-2, -3, -5) and the three others were checked. All 41 rows of Section 3 were checked (table below). All 62 grade-A rows were attempted: 41 assessed, 21 could not be checked. Every row that places a kind of cover or gives a density was attempted.
- **Sources: 60 of 95 Works-cited entries opened** as the work cited (51 at the cited URL, 9 from another copy of the same work). 15 more were read as abstracts only, 12 would not open, 3 were not opened by choice, and 5 are duplicates or cited by no row. **No fabricated source was found.** Several entries carry wrong authors, titles or dates (Sources check). One citation is mismatched: row 14a cites Davidson 1978 with the URL of a different paper.
- **Number misreadings:**
  - "~380 mm" for Santorini's rain (Section 3) is the lower bound for Extremadura and Pafos in the cited paper.
  - "100–250 trees/ha" (#41c) is not in its source, an Algerian mountain study.
  - "172–54 ka" (#44a) is not in the field guide.
  - The other numbers that could be opened match their sources.
- **The report missed the two most useful findings in its own sources.**
  - **A ploughed soil under the pumice.** Friedrich et al. 2017 [25], cited by the report for other rows, describe at the buried-olive site near Fira a ca. 30 cm top layer "with clear traces of human activity―ploughing", sherds, obsidian, and moulds of roots and twigs, along an outcrop several hundred metres long. The report says plough marks "could not be verified" (#10a).
  - **What the buried soil was like.** Marinatos 1968 (p. 6): the pre-eruption surface was "a dark coloured lava" with "a thin layer of cultivable humus". Davidson 1978, as summarised by Sarpaki 1987: the palaeosol was mostly sand, almost no clay, organic matter "negligible", like today's soils, with bare rock or poor soils on steep high slopes. The report instead builds its ground from humid-climate analogues (brown Cambisols, Messenian red soils, Javan Andisols).
- **Woodland: the reading the report leans on is the weaker one.** Asouti's "open oak woodland" comes from an abstract that does not split the Bronze Age phases. Mavromati 2017, also cited by the report, says that from the Middle Cycladic on the island shows "a shift towards open maquis vegetation", with tree crops (olive, pomegranate, almond) predominant. The LC I percentages the report gives for shaft 63A could not be checked.
- **Shown is not present is mostly handled well.** Every painted plant is B, and the Pleistocene floras are kept apart, though wrongly graded A. Two slips:
  - The painted stone pine is taken as attested by charcoal of another pine (#29).
  - Today's rivers and springs are graded A as if they were Bronze Age facts (#24a).
- **No ancient word is invented.** *we-je-we* (Linear B, later) is cited as a term, and the report says no Linear A term is known. *aspa*, *kouloura* and *haimasiai* are modern or later Greek words: mark them so if a viewer sees them.
- **Usable for building cover: yes, with the corrections below.** Use it for:
  - The geology of the exposed ground.
  - The rural sites (Raos, Balos, Ftellos, Alaphouzos).
  - The buried olives.
  - The ruled-out defaults: no kouloura, no Pleistocene palms, no pumice blanket.

  Do not use its Section 3 woodland and scrub densities as more than grade-C analogues, and do not use its soil colours.
- **Delivery.** The report does not end with the `DRIVE:` line the prompt asks for (D35), so whether Gemini saved it to Drive is unknown.

### Where cover stood and how thick (the build question)

Compared with `docs/research/verification/T3.md` and `T3d.md`. "Report" is what the T3b Summary and claims say.

| Cover | Report | What the opened sources support | Grade for 1628 BCE |
|---|---|---|---|
| Arable land on the gentle ground round Akrotiri | intensive farmland on the peninsula | Doumas: the site was "the largest area of flat land on the island", suited to farming. Sotiropoulou 2021: Raos lies on the route to "extensive tracts of arable land". Friedrich 2017: a ploughed top layer ca. 30 cm thick under the pumice near Fira, with olive trees standing in it. Crops are A (T3 #1, #4). | crops A; where the fields lay B; field shapes and shares liberty |
| Olive groves | 60–150 trees/ha, open-centred, 3–6 m | Olive is the dominant fuel (T3 #6; Bottema in T3d). Olive trees and shrubs were buried standing at Fira, on Therasia, and as a trunk at Balos (Tzachili 2005 n. 6). Mavromati 2017: tree crops "predominated" from MC on. No Bronze Age spacing exists; 40–250 trees/ha is modern Greek (C). The olives at Fira stood in a ploughed field, so trees and crops shared ground (B). | olive A; spacing C; "150/ha" in Game hooks has no source |
| Vines | low bush or staked vines, 2,000–2,800/ha | Grape pips A (T3 #4). One press in Trench 58B (A object, B use). Sarpaki 2012: treading probably "near the vineyards", outside the town (B). Training unknown. Linear B *we-je-we* means vines grown up trees (later, C). Kouloura is modern (C). | vine on Thera B; training and density: liberty |
| Grazed scrub (phrygana, low maquis) | steep volcanic slopes, <50 cm, 30–40% cover | Wild scrub taxa in the LC IA kitchen (T3 #7: *Thymelaea*, thorny burnet, thyme, savory, lavender, asphodel). Mavromati 2017: open maquis from MC on. Davidson (via Sarpaki 1987): steep high slopes were "either bare rock faces or poorly developed soils". Modern analogues: Antikythera's 13 quadrats have 60–100% total cover; Marathon's phrygana class is under 15% shrub canopy. | taxa A; placement B; cover C |
| Open woodland (oak, pine, juniper) | gullies, north slopes, Profitis Ilias; 50–120 oaks/ha | Oak, pine and juniper timber in LC I houses (Mavromati 2021, A as timber). Evergreen oak is a moisture-demanding local species (Mavromati 2017, B). Pine was "scarcely present" by the repairs. Asouti: "open oak woodland" (abstract; phases not split, B). **No opened source puts trees in gullies, on north slopes or on Profitis Ilias**: that zoning is the report's own inference. | trees present B; where they stood C; density C |
| Wet ground and water | seasonal torrents, cave springs, tamarisk, reeds | Tamarisk is A (LC IA kitchen fuel, T3 #6; LC I repairs, #24c). Reeds: the cited sources did not open. "No rivers", winter torrents and the springs round Profitis Ilias are today's island (Sørensen 2013), so B. The Potamos torrent is modern: it flowed through the site "in recent times" (Doumas). | tamarisk A; water courses B; Potamos: do not build |
| Shore | coves, pebbles, beachrock | Coves between small headlands (Doumas, from geotechnical work). Beachrock and pebbles: source refused. | coves B; beach material unchecked |
| Bare ground and soil | brown Cambisol, terra rossa, Andisol colours | Marinatos: "dark coloured lava" with a thin humus layer. Decadevolcano: "the dark Minoan paleosoil" at Megalochori. Davidson: sandy, almost no clay, negligible organic matter. Friedrich 1977: 0.5 m at Fira, 3–4 m at Millo (Therasia); Davidson 3–4 m at Akrotiri. The red Cape Riva ignimbrite crops out under it. No Munsell value exists. | texture and thickness A/B; colour liberty T-L8 |

## Table

Grades are judged against `docs/HISTORICAL_STANDARD.md` §1 and §3 (including the landscape table, D28) and D26. Verdicts: **checked** (the source says it), **wrong** (part of the row is not what the source says; the Fix gives the right reading), **grade too high / too low**, **could not check** (with the reason).

| # | Claim (short) | Opens | Verdict | Number | Grade | Fix |
|---|---|---|---|---|---|---|
| 1 | 18 LBA sites on Thera and Therasia, ≥7 near Akrotiri | [24] no (ResearchGate; paid chapter) | could not check | — | A → C if found (a modern site count) | T1b #12 has Karátson 2020's "at least 15". |
| 2 | Town c. 20 ha; ~1 ha dug, 35 houses; no gardens; 813 m² built, 912 m² open of 1,725 m² | [24] no | could not check | ~1 ha: Doumas, Sarpaki 2012; 35 houses: T2 #5; 813/912 unchecked (47.1/52.9% is right arithmetic) | 20 ha A → C (Doumas's estimate; T2b, liberty A-L1) | — |
| 3 | Raos: LC I villa with upper storey, courtyard and enclosure wall, <1 km NW of Akrotiri, on the route to arable land | [5] via MDPI file server | checked ("a robust stone-built enclosure wall"; "less than 1 km") | exact | A ok | Add: "atop a long crest", south side of the caldera. |
| 4a | Balos: jars of barley and legumes in chaff; stone pen with sheep and goat bones in straw; a vessel of barley fodder | [24] no; Sarpaki 1987 yes | could not check | — | finds A; "stable" B | Sarpaki 1987, after Fouqué 1879: three rooms, "a thick bed of straw", barley, lentils, *arakas*, aniseed, coriander, some chaff. The stable is Fouqué's guess (as T2b #71). Pen, bones and fodder vessel unverified. |
| 4b | Balos three-room house under 22 m of pumice | [17] yes | checked ("a pumice layer 22 m thick") | exact | A ok | Found in 1870 (Fouqué 1879). |
| 4c | Balos platform at 62 m a.s.l. below Loumaravi | [25] yes | checked ("A platform at 62 m above sea level") | exact | A ok | — |
| 5a | Town grain cleaned of chaff, glumes and weeds; processing outside the town | [24] no | could not check | — | — | T3 #2: crops at the last stage before eating. Sarpaki 1987 also has rachis segments and awns, "a semi-cleaned crop". No threshing floor found. |
| 5b | One wine-press set (Trench 58B) in ~1 ha; treading outside the town | [7] yes | checked ("only one such wine-pressing installation") | 1; ~1 ha | installation A; use for grapes B ("It is possible"); vineyards' place C | — |
| 6a | Ftellos: house with a circular pen | [17] yes | checked (n. 16: "a circular pen was excavated in connection with a house") | — | A ok | "Near Fira" is not in the source. |
| 6b | Other LBA sites (Chalarovounia, Potamos-Kamaras, Kokkino Vouno, etc.) | [24] no | could not check | — | — | Sarpaki 1987 names Balos and Mavromati Quarry as possible suburbs. |
| 6c | Alaphouzos Quarry, Therasia: many-roomed building on pre-eruption bedrock | [58] yes | checked ("down to its natural bedrock, which was the pre-eruption level") | — | A ok | Source is Tzachili 2005 (*JMA*), not "n.d.". Add Fouqué's finds (correction 15). |
| 7a | Koimisis: charred olive shrub ≤ 2.5 cm, bands 80–500 µm, juvenile bark, burnt terraced stones, ~90 cm tephra, 5–7 cm burnt soil; 1602–1502 BCE | [1] yes | checked ("between some terraced stones"; "5-7 cms") | exact | A ok | 1610–1510 BCE without the regional offset (T3 #13). The 90 cm is the eruption layers' surviving depth. |
| 7b | Burnt wood on the rubble across Koimisis: scrub on the ruins | [26] abstract only | could not check | — | — | Pearson: the shrub "started life sometime after the settlement was abandoned" (one plant). |
| 8a | Koimisis S and SE terraces: an EC–MC hilltop settlement abandoned at the end of MC | [26] abstract | checked ("definitively abandoned") | — | A ok | — |
| 8b | No LC I pottery; ≤100 years before the eruption; the terraced stones are house terraces (INFERENCE) | [1] yes | checked ("no traces of Late Cycladic I pottery"; "not more than c.100 years") | — | A ok; terrace reading B | — |
| 9 | Caldera-wall terraces are natural benches, used in the Bronze Age as paths and shelters | [25] yes | **wrong** | — | B ok | The paper explains them as caldera-collapse and erosion terraces on resistant layers. "Paths and shelters" is not in it; its caves are a later monastery's, dug into the Minoan pumice. |
| 10a | No terrace walls, field walls, tracks or plough marks under the tephra can be verified | [59] yes | **wrong** | — | C | Price and Nixon do not mention Thera, so the absence of walls holds. But [25] reports a ploughed layer ca. 30 cm thick under the pumice (correction 1). |
| 10b | Terrace-dating review: Pseira dated by tephra; nothing on Santorini | [30] via MDPI | checked ("Bronze Age terraces on Pseira, Crete") | — | C ok | Real title: "Dating Agricultural Terraces in the Mediterranean Using Luminescence: Recent Progress and Challenges". |
| 11a | Kythera Bronze Age terraces; 1.46 m fill, 40 cm A horizon, 17–18 m gully | [27] no; abstract (OpenAlex) | checked (abstract: earlier terracing "some dating to the early second millennium B.C.") | numbers unchecked | B ok | — |
| 11b | Pseira terrace soils analysed for manuring lipids | [60] [61] no | could not check | — | B | The title alone matches. |
| 11c | Pseira Dam M9 3.62 × 3.00 × 15.5 m, with check-dams and uphill terrace walls | [29] yes | checked ("3.62m high, 3.00m wide, and 15.5m long each wall") | exact | B ok | No "uphill terrace walls" in the chapter, only check-dams. Authors: Ferrence, Giumlia-Mair and Betancourt (citing Betancourt 2012). |
| 11d | Choiromandres main dam >3.10 m high, 27 m long; irrigated terraces | [28] via MDPI | checked ("may have exceeded the 3.10 m height") | as a maximum | B (Protopalatial, 1900–1700 BC, mostly before the window) | Rebuilt in Classical–Hellenistic times. |
| 11e | 2024 talk: grapevine phytoliths on the Choiromandres terraces | [62] yes | checked (programme title) | — | B ok | Speakers: Kriti, Livarda, Orengo, Ninou, Mylonas; not Vokotopoulos. |
| 12a | Kythera GIS: terraces on >12°, 657.8 ha, 27.7% | [27] no | could not check | — | C | — |
| 12b | Keos: slopes >10° need terraces; Didyma walls 1.18 m × 88.5 cm | [59] yes | checked ("only if they are terraced"; "up to 1.18 m high") | exact | C ok | The 10° is Whitelaw's assumption, not a measurement. The Didyma walls line a road. |
| 13a | Minoan palaeosol across Thera and Therasia, 0.5 m at Fira, locally 3–4 m | [11] yes | checked ("spread all over Thera and Therasia"; table: 0.5 m) | exact | A ok | The 3–4 m is at Millo, Therasia. Davidson gives 3–4 m at Akrotiri (via Sarpaki 1987). |
| 13b | Metaxas Quarry: palaeosol with sherds on Riva deposits, under phases 0 and 1a | [13] yes | checked (Fig. 20 caption) | the 10 cm is phase 0's island-wide total | A ok | — |
| 14a | Davidson 1978: soils poorly developed, eroded, poor | [4] wrong URL; Sarpaki 1987 yes | checked (via Sarpaki 1987: "still poorly developed"; organic content "negligible") | — | A ok (a laboratory analysis), read second-hand | [4] is Sarpaki 1992's ResearchGate page. Cite Davidson, *Nature* 272: 243–244. |
| 14b | Fira quarries: thin humus on pre-eruption lava under 4–5 m of basal pumice | [51] yes (scan, p. 6) | checked ("a thin layer of cultivable humus") | 4–5 m exact | A ok (a general description) | Add the colour: "a dark coloured lava". |
| 14c | Southern Thera, 6–9 km from the vent: 45 sherds (1–4 cm) on the palaeosol, reheated to 160–260 °C | [63] no; EGU 2013 abstract by the same authors yes | checked (sherds "laying on the pre-Minoan palaeosoil surface"; 160–260 °C; 6–9 km) | 45 and 1–4 cm unchecked | A ok | Tema 2015: 160–230 °C outside the town, 130–200 °C inside Akrotiri. |
| 14d | Megalochori Quarry: sherds 1–4 cm (to 6 cm) at the palaeosol contact | [64] no | could not check | — | A | Tema 2015 abstract: sherds from the palaeosol surface "at six different sites". |
| 15a | Olive buried alive on the caldera top; 7 branch moulds 1–3 m up; leaves, twigs; 72 rings; 1627–1600 BCE (95%) | [65] yes | checked ("seven molds of branches"; "1 to 3 m above its base") | exact; ">60 m" from Pearson | A ok | Sørensen gives about 40 m of pumice at the two olive trees (correction 16). |
| 15b | IntCal20: 1621–1598 (23.2%) or 1593–1540 BCE (72.3%) | [1] yes | checked | exact | A ok | — |
| 15c | Karageorghis Quarry: dated olive in place above a down-faulted terrace with Cycladic pottery | [25] yes | checked (Fig. 2 and Fig. 6 captions) | — | A ok | The 1978 charcoal there gave about 1700 BC; the pottery lay below the tree; human bones suggest a cemetery. |
| 16a | Tree roots in buried soils (Asouti 2003a, via Walsh) | [68] not opened (unofficial copy) | could not check | — | A | Friedrich 2017: root and twig moulds in the top 30 cm at the olive site. |
| 16b | Two olive trees under ~40 m of pumice | [17] yes | checked ("two olive trees were found under a pumice layer") | 40 m | A ok | — |
| 16c | Athinios: trunk and branch holes in ~5 m of first-phase pumice | [14] yes | checked ("holes ... that once were the trunk and branches of a tree") | ~5 m | A ok | A personal website (page of 2004); its C-14 "around 1700-1600 BC" was preliminary. |
| 17a | Fira Pleistocene horizons: dwarf fan palm moulds 2–3 m tall, 30–40 cm; date palm, olive, mastic, tamarisk, cypress family; ~37 ka | [11] yes | **grade too high** | 2–3 m, 30–40 cm exact; stratum 14 dated ">37,000" and "44,500 ± 5,250" BP | A → C (Pleistocene) | Palms in strata 7 and 13; olive and mastic leaves "transported by water", not in place. |
| 17b | Fossil olive leaves 50–60 ka (Friedrich 1978) | [16] yes | **grade too high** | exact | A → C | — |
| 18a | No pre-eruption pollen from Thera; one modern vineyard sample near Akrotiri | [69] yes | checked | — | an absence, not graded | — |
| 18b | Dry archaeological deposits keep pollen poorly | [70] no; abstract | could not check | — | — | — |
| 19 | Shaft 63A olive 43.2 / 42.3 / 68.0% (EBA / MBA / LBA); pruned groves | [2] abstract only (paywall) | could not check | Riley (T3 #11): "some 50%" in EBA | LBA A if checked; EBA C; MBA B | Abstract: olive cultivation "back to the Early Bronze Age". |
| 20 | LC I pine 7.0%, Cupressaceae 7.0%, oak 5.5% + 3.9%; open oak woodland, moist and cool | [2] abstract | could not check (percentages) | — | taxa A if checked; woodland reading B (T3 #9) | The abstract has "open oak woodland" without phases. See correction 3. |
| 21a | Thermophilous vegetation from EC to the eruption (Mavromati) | [71] a profile page; abstract (Aegeus Society) | checked ("thermophilous vegetation on the island") | — | A ok | Cite Mavromati 2017, *Quat. Int.* 458: 44–55. Same abstract: EC open pine forest, then "open maquis" from MC. |
| 21b | LC I timbers: pine and deciduous oak beams, juniper and evergreen oak ceilings; olive, scarce pine, tamarisk, fig in repairs ~50 years before the eruption | [15] no; abstract (AGRIS) | checked ("Tamarix sp. and Ficus carica"; "the scarcely present Pinus") | — | A ok | Buildings: Xeste 3 and House of the Ladies. Amends T3d (correction 4). |
| 22 | Cedar, yew, beech in 63A (MBA %) imported | [2] abstract | could not check (percentages) | — | A as timber; MBA B/C | Abstract: imports "from Lebanon, Cyprus and Anatolia"; "mainland Greece/Crete" is not in it. |
| 23 | 63A shrubs: *Arbutus*, *Punica*, *Lonicera*, Fabaceae, *Rhamnus*, *Capparis*, Maloideae, Lamiaceae | [2] abstract | could not check | — | — | Mavromati 2017's abstract names pomegranate and almond as tree crops from MC on. |
| 24a | No permanent rivers; winter and spring torrents (Potamos Kamaras); cave springs on Profitis Ilias | [17] yes | **grade too high** | — | A → B (today's island carried back) | Sørensen writes in the present tense and warns present conditions "can, however, not be applied" to the Bronze Age. Potamos is modern; Zoodochos Pigi is on Mesa Vouno. |
| 24b | Tamarisk 1.5% EBA/MBA, reeds 0.2% MBA; Profitis Ilias 566 m | [2] abstract | could not check | — | — | Tamarisk in LC I is A by #24c and T3 #6. |
| 24c | Tamarisk used in LC I repairs | [15] abstract | checked | — | A ok | — |
| 24d | Reed or cane culms printed in Akrotiri ceiling plaster | [20] PDF truncated on three tries | could not check | — | A | The chapter is about Tell el-Dab'a and cites Palyvou 1999 for Akrotiri. |
| 25 | A cave-dwelling weevil at Akrotiri implies damp leaf litter | [2] abstract | could not check | — | — | — |
| 26a | Seeds: barley, fig, almond, fava, lentil, chickpea, lupin | [2] abstract | could not check | — | A | The taxa are A from T3 #1, #4 and Doumas (almond imprints in a jar). |
| 26b | West House: crops, field weeds, ruderals | [73] abstract | checked ("weeds of cultivation (segetal), and ruderal plants") | — | A ok | — |
| 26c | *L. clymenum* is the same variety as modern Thera's | [74] abstract | checked ("It is suggested that they are both the same variety") | — | find A; identity B (as T3 #3) | — |
| 26d | *L. clymenum* stored pure | [4] no | could not check | — | A | T3d: pure *Lathyrus* stores per PMC12956113 and Kislev 1993. |
| 26e | Pea and grass pea in the West House | [75] yes | checked (both in the "LC West House at Akrotiri") | — | A ok | — |
| 26f | Crushed olive stones imply oil pressing | [19] yes | checked ("crushed olive stones suggest that olive oil was produced") | — | A ok | — |
| 27a | A sheep-rearing assemblage and a deposit of horns | [50] host refused | could not check | — | — | — |
| 27b | Pigs kept by households (Gamble) | [76] no; abstract | could not check | — | — | Authors: Slim, Çakırlar and Roosevelt. |
| 28a | Saffron crocus: no remains on Thera; flowers only in autumn | [18] yes | checked ("only those that bloom in the autumn produce saffron") | — | B ok | — |
| 28b | Painted red lilies blend *L. candidum* and *L. chalcedonicum* | [22] yes | checked ("blend the characteristics of white madonna lilies") | — | B ok | — |
| 28c | Papyrus and palms painted, no remains | [21] yes | checked | — | B ok | — |
| 28d | *Phoenix theophrasti* virtually absent among plant remains | [23] no; abstract | checked ("a virtual absence ... in the archaeobotanical record") | — | B ok | — |
| 28e | Myrtle painted, no remains | [19] yes | checked | — | B ok | — |
| 29 | West House frieze: reeds, stone pines, figs, a river; reeds, pine and fig also found | [21] yes | **wrong** | — | B | Morgan names stone pine and Aleppo pine. The charcoal pine is *P. halepensis/brutia* type, so the painted stone pine is not attested. Fig is attested by seeds (T3) and wood (#21b). |
| 30 | No published shares of land use | [5] yes | checked (only "extensive tracts of arable land") | — | C ok | — |
| 31 | Ancient groves 100 trees/ha (olives alone), ~60/ha with wheat | [9] not opened | could not check | 60/ha → 12.9 m is right arithmetic | C | The cited file is an unofficial copy of an OUP book. |
| 32a | Lesvos traditional groves 40–250 trees/ha | [37] yes | checked ("from 40 to 250 per ha") | exact | C ok | — |
| 32b | Dry groves 100–200/ha, rarely >300, 5–7 × 6–8 m; crowns >5 m | [8] no; MDPI copy yes | checked | exact | C ok | — |
| 32c | Unirrigated olives 3–6 m tall, 6–7 m apart | [38] yes | checked ("3–6 m tall and 6–7 m apart") | exact; 204–278/ha converted right | C ok | The groves are in western Crete. |
| 33a | Olive wood grows April–September | [31] yes | checked | — | C ok | — |
| 33b | Olives flower April–June | [35] yes | checked ("between April and June") | — | C ok | — |
| 34a | Vines on trellises, on the ground, as bushes or up trees; kouloura is modern | [7] yes | checked | — | C ok | — |
| 34b | Kouloura 10–20 cm high, 4–6 canes of 8–12 buds, 1,800–2,200 vines/ha | [40] yes | checked | exact | C ok | — |
| 34c | Oia kouloura at 2.3 × 2.3 m, 1,900/ha; 2.86 m², 0.53, 0.93 m³ | [10] yes | checked | exact | C ok | — |
| 34d | A weeded basket vineyard near Akrotiri, vines 4–5 m apart, 2.3% vine pollen | [69] yes | checked | exact | C ok | — |
| 34e | Linear B *we-je-we* with a sketch of a trellis and vine | [39] yes | **wrong** | — | C | *we-je-we* are vines "trained to climb up trees" (Palmer 1994). The trellis sketch is the wine ideogram (Cretan Hieroglyphic E116; Linear A AB 131), a separate sign. |
| 35a | Rainfed rows 2,500–3,333 vines/ha; ~43% less water | [41] via MDPI | checked | exact | C ok | — |
| 35b | Santorini bud differentiation 15 May–15 June; harvest late July–late August | [36] yes | checked | exact | C ok | — |
| 36a | Aegean islands: fewer cereals, more pulses than northern Greece | [78] no; abstract | could not check | — | B | The abstract does not state this contrast. |
| 36b | Fallow vs rotation (Sarpaki) vs maslin (Sallares) | [75] yes | checked | — | C ok | Halstead is not in this source. |
| 36c | An ox pair tills 5–6 ha; a reaper 0.1 ha a day | [79] not opened (a Scribd upload) | could not check | — | C | — |
| 36d | Lesvos: two- or three-year cycles | [80] yes | checked ("biennial or 3-year cycles") | — | C ok | — |
| 37a | Amorgos: harvest starts in late May with pulses, then barley, then wheat | [32] no | could not check | — | C | — |
| 37b | Bean weevils show a summer eruption after harvest | [34] no (401); Europe PMC abstract | **grade too high** | — | insects A; season A → B | "we argue for a summer eruption" (as T3 #14). |
| 38a | Grazed thorny-burnet phrygana <50 cm, ~30% cover | [42] no (403); abstract | could not check | — | C | The abstract gives no cover or height. |
| 38b | Psiloritis: woody cover >30% in phrygana, <10% in grassland | [47] no; abstract | could not check | — | C | A mountain rangeland at 1,200 m. |
| 38c | Marathon classes: phrygana <15%, shrubland 15–25%, forest >25% | [48] via MDPI | checked | exact | C ok | — |
| 38d | Naxos height classes and scrub taxa | [82] yes | checked | — | C ok | Naxos phrygana is "the product of millennia of livestock grazing". |
| 38e | Grazing lowers phrygana height (Lesvos) | [83] yes | checked | — | C ok | A volcanic site in western Lesvos. |
| 38f | *Cistus incanus* changes leaves in May–June and Nov–Dec | [33] no; abstract | could not check | — | C | Abstract (S Italy): small summer leaves, large winter leaves; no months. |
| 39a | Antikythera: maquis >1 m grades into phrygana <1 m | [84] no; UCL postprint | checked ("tall or true maquis is above 1 m") | — | C ok | Its quadrats give total cover 60–100% (correction 11). |
| 39b | Maquis up to 3 m; open <10%, closed 11–100% | [45] yes | checked | — | C ok | — |
| 39c | Goat-grazed shrubland 47.26%; kermes oak 28.90% at 1.3 m | [49] yes | checked | exact | C ok | Western Turkey. |
| 40a | Valonia oak 50–60 trees/ha, canopy 0.4–0.5; soils 76 / 16.9 / 7.1% | [44] yes | checked | exact | C ok | — |
| 40b | Kea 160 trees/ha, 3–10 m; Rethymno 235/ha, 2–15 m | [43] yes | checked ("low density (160 trees / Ha)") | Kea heights only in figures | C ok | — |
| 40c | Lesvos oak woodland 135.21/ha, cover 45.2% | [85] host refused | could not check | — | C | The paper is Plieninger, Schaich and Kizos 2010. |
| 40d | Xeromero 25–50/ha | [86] no | could not check | — | C | — |
| 41a | *P. brutia* cover classes 1–10% and 11–40% | [45] yes | checked | — | C ok | — |
| 41b | Open *P. brutia* stands (<40%) have dense maquis beneath | [87] yes | checked | — | C ok | Istanbul. |
| 41c | Semi-arid Aleppo pine 369/ha (50–2,575); best regrowth at 100–250/ha, 25–50% cover, north slopes | [46] yes | **wrong** | 369, 50–2,575, 25–50% exact | C | "100–250/ha" is not in the paper. The site is the Saharan Atlas, Algeria, 1,190–1,450 m, ~310 mm rain. |
| 41d | Greek natural resin stands 400/ha | [88] via MDPI | checked | 400 | C ok | An assumed density in a carbon model, not a survey. |
| 41e | *P. brutia* 20–35 m, trunk to 1 m | [89] yes | checked | exact | C ok | — |
| 42a | White Minoan tuffs mantle Thera, Therasia and Aspronisi | [6] yes | checked ("an essentially continuous mantle") | — | A ok | — |
| 42b | 316 mm (1974–2019), rain October–April; *aspa* soils | [36] yes | checked (316 mm; Oct–Apr) | exact | C ok | "*aspa*" is not in the source. |
| 42c | Today's Santorini nearly treeless but for pines, cypresses and olives on Profitis Ilias | [2] abstract | could not check | — | a modern fact, not A | — |
| 43a | SE basement: crystalline limestone and ~250 m of phyllite and schist; 2 km at Athinios | [6] yes | checked | exact | A ok | — |
| 43b | Phyllites, green schists, limestone at Athinios, Profitis Ilias, Mesa Vouno | [13] yes | checked | — | A ok | — |
| 43c | Caldera bay from Cape Riva; Pre-Kameni 1.6–3.0 km³, growing from ~20 ka | [90] no; abstract (OpenAlex) | **grade too high** | exact | volume A → C (a scaled model; T1 #14) | — |
| 44a | Akrotiri domes 650–580 ka; Mavrorachidi 522 ± 104 ka; up to 200 m of southern pyroclastics (172–54 ka); northern lavas | [6] yes | **wrong** | "172–54 ka" not in the guide | A | The pyroclastic succession spans both cycles, from ~360 ka to 3.6 ka. |
| 44b | Cinder and spatter cones at Balos, Kokkinopetra, Mavrorachidi, ~350–520 ka | [13] yes | checked | exact | A ok | — |
| 44c | Red Cape Riva ignimbrite under the Minoan base at Megalochori | [14] yes | checked ("the red Cape Riva ignimbrite") | — | A ok | The same page has "the dark Minoan paleosoil". |
| 44d | Strata under the palaeosol: dark grey to black scoria, grey to brown ash, on cliffs and gullies | [11] yes | checked (colours) | — | A ok | "On cliffs and gullies" is the report's inference: in the Fira section they lie under the palaeosol. |
| 45a | South shore indented with coves between headlands | [19] yes | checked | — | A ok | — |
| 45b | Pillar Shaft 19: EC paving of beachrock slabs and sea pebbles | [50] host refused | could not check | — | — | — |
| 46 | No Munsell for the palaeosol; Eutric Luvisol on maps | [53] no | could not check | — | C | — |
| 47a | Limestone terra rossa analogue: 5YR 3/3 over 2.5YR 3/4 | [52] yes | **wrong** | numbers exact | C | Those colours belong to a soil on Pleistocene calcarenite dunes in Messenia, not a limestone terra rossa. |
| 47b | Terra rossa hues 5YR–10R; moist 2.5YR 4–5/3–8 | [54] yes | checked | exact | C ok | Bursa, NW Turkey, under forest. |
| 47c | Cambisol analogue colours | [56] host refused | could not check | — | C | — |
| 48a | Volcanic soils 7.5YR–10YR | [55] no | could not check | — | C | — |
| 48b | Andisol 10YR 3/3–4/4 over 10YR 4/6–6/8 and 7.5YR 5/8 | [57] yes | checked | exact | C, a poor analogue | West Java, humid tropics. |
| 48c | Distal Minoan ash 5Y 7/1 (Palaikastro) | [12] yes | checked ("light grey color (Munsell 5Y 7/1)") | exact | A ok | — |
| 48d | Phase 4 ignimbrite tan to pink | [13] yes | checked | — | A ok | — |

### Section 3, "Numbers for the builder"

| Quantity | Report | Check |
|---|---|---|
| LBA sites | 18; ≥7 near Akrotiri; A | Could not check (Sarpaki 2019). Karátson 2020 has at least 15 (T1b #12). |
| Town area | c. 20 ha; ~1 ha dug (35 houses); A | **Regrade.** ~1 ha (Doumas; Sarpaki 2012) and 35 houses (T2 #5) are A. 20 ha is Doumas's estimate, grade C (T2b; A-L1). |
| Built vs open | 47.1 / 52.9% (813 / 912 of 1,725 m²); A | Could not check. The arithmetic is right. |
| Raos distance | <1 km; A | Checked. |
| Balos | 62 m; 22 m of pumice; A | Checked. |
| Wine presses | 1 in ~1 ha; A | Checked. Its use is B. |
| Koimisis | 196 m; ~90 cm; A | Checked. |
| Koimisis shrub | ≤2.5 cm; 80–500 µm; 5–7 cm; A | Checked. |
| Palaeosol | 0.5 m (Fira) to 3–4 m; A | Checked (Friedrich 1977; Davidson via Sarpaki 1987). |
| Sherds on the palaeosol | 1–4 cm (to 6 cm); 160–260 °C; A | Partly: 160–260 °C checked (EGU 2013); Tema 2015 gives 160–230 °C outside and 130–200 °C inside Akrotiri. Sizes unchecked. |
| Fira olive | 7 moulds; 1–3 m above the base of >60 m; 72 rings; A | Checked. Sørensen gives ~40 m at the two trees. |
| 63A olive, pine, cypress family, oak, shrubs | 68.0%, 7.0%, 7.0%, 9.4%, 5.5%; A | Could not check (five rows; paywall). The sums are right. |
| Profitis Ilias | 566 m; A | Could not check in the cited source. A present-day height: B. |
| Basement | ~250 m; 2 km; A | Checked. |
| Pre-Kameni | 1.6–3.0 km³; A | **Regrade** to C (T1 #14). |
| Kythera terrace | 1.46 m; 17–18 m; 40 cm; B | Could not check. |
| Pseira Dam M9 | 3.62 × 3.00 × 15.5 m; B | Checked. |
| Choiromandres dam | >3.10 × 27 m; B | Checked, as "may have exceeded"; Protopalatial. |
| Terracing slope | >10–12°; C | Partly: 10° is Whitelaw's assumption; 12° unchecked. |
| Olive, alone | 100 trees/ha; C | Could not check. |
| Olive with wheat | ~60 trees/ha; C | Could not check. 12.9 m is right. |
| Traditional groves | 40–250; 100–200; 5–7 × 6–8 m; C | Checked. |
| Unirrigated olives | 3–6 m tall, 6–7 m apart; C | Checked. |
| Kouloura density | 1,800–2,200; Oia 1,900; Akrotiri 400–625; C | Checked (400–625 converted right). |
| Kouloura form | 10–20 cm; 2.86 m²; 0.93 m³; C | Checked. |
| Row vineyards | 2,500–3,333; 2,666; C | Checked. |
| Ox and sickle | 5–6 ha; 0.1 ha a day; C | Could not check. |
| Phrygana | <50 cm; >30%; <15% canopy; C | Partly: <15% (Marathon) and the height classes (Naxos) checked; 30% unchecked. |
| Maquis | 1–3 m; 15–47.3%; C | Checked. |
| Valonia oak | 50–60/ha; 40–50%; 25–50; 160; 135.2; 235; C | Partly: 50–60, 0.4–0.5, 160, 235 checked; 135.2 and 25–50 unchecked. |
| Pine | 100–250/ha; 11–40%; 400; 20–35 m; C | Partly: 11–40%, 25–50% and 20–35 m checked; **100–250/ha is not in the source**; 400 is a model assumption. |
| Rainfall | 316 mm (~380 mm older cite); C | **Wrong in part.** 316 mm checked. The 380 mm is the lower bound for Extremadura and Pafos in [10], not for Santorini. |
| Terra rossa | 5YR 3/3 to 2.5YR 3/4; 5YR–10R; C | Partly: the hue range checked (Bursa). The first pair is a Messenian dune soil. |
| Cambisol | 5YR 4/4, 7.5YR 4/3; C | Could not check. |
| Andisol | 10YR 3/3–4/4; C | Checked (West Java). |
| Minoan ash | 5Y 7/1; tan to pink; A | Checked. 5Y 7/1 is distal ash at Palaikastro, not the pumice on Thera. |
| Pleistocene palm moulds | 2–3 m; 30–40 cm; A | Checked; **regrade** to C. |

Totals for the 41 rows: checked 18, partly 6, wrong 1, regraded 3, could not check 13.

### Section 4, "Assumptions checked"

| ID | Report | Check |
|---|---|---|
| T3b-1 (terraces existed) | could not verify | **Agreed for terrace walls**: none is published on Thera. But the report misses Friedrich 2017's ploughed field under the pumice. The Koimisis "terraced stones" are house terraces of a settlement abandoned before LC I (Pearson; Sbonias). |
| T3b-2 (a buried soil shows what grew where) | partly confirmed | **Partly, agreed.** The soil is real and widespread (Friedrich 1977). It held a ploughed field with olives near Fira (Friedrich 2017), olive trees at Fira and Balos, and a shrub on the Koimisis ruins. Davidson found it sandy and poor at six exposures. Too few points to map zones. |
| T3b-3 (gentle ground farmed, steep ground grazed) | partly confirmed | **Partly, agreed.** Doumas (the largest flat land), Raos's arable hinterland and Davidson's bare or thin-soiled steep slopes support it. The grazing is inferred from the bones (T3 #37), not found on slopes. B overall. |
| T3b-4 (scattered trees, not closed forest) | confirmed | **Partly.** "Not closed forest" is supported (Asouti, Mavromati 2017). But the opened sources describe open maquis with tree crops from MC on, not open oak woodland in LC I. The modern stand densities (#40–#41) do not test the assumption. |
| T3b-5 (no pre-eruption pollen from Thera) | partly confirmed | **Confirmed as far as searched**, as in T3 and T3d. |
| T3b-6 (kouloura not for the Bronze Age) | confirmed | **Confirmed.** The modern papers' "thousands of years" and "centuries" are unsupported. |

### Summary bullets

| Bullet | Check |
|---|---|
| 1, strip the pumice | **Partly.** The geology checks out. 5Y 7/1 is distal ash on Crete. Add Marinatos's "dark coloured lava" and Davidson's sandy, organic-poor soil. |
| 2, charcoal percentages | **Could not check** (Asouti). Mavromati 2017: open maquis from MC on. |
| 3, imports and fossil palms | **Partly.** The palms and olive leaves are C, dated >37,000–60,000 years. The import routes beyond Asouti's abstract are unverified. |
| 4, no fresco-only plants, no rivers | **Partly.** "No rivers" is today's island (B). The painted pine is stone pine, unattested. Fig wood is now attested (#21b). |
| 5, farmland and rural sites | **Partly.** Raos, Balos, Ftellos and Alaphouzos check out. 20 ha is C. The Balos "livestock complex" rests on Fouqué's guess of a stable. |
| 6, terraces unverified | **Partly.** Add the ploughed field (Friedrich 2017). |
| 7, late-May phenology | **Partly.** Olive flowering (April–June) and vine bud differentiation (15 May–15 June) checked, both modern (C). The pulse harvest (Amorgos) and *Cistus* leaf change are unchecked. |
| 8, olive density | **Partly.** The ancient figures (Foxhall) are unchecked; the modern ones check out (C). |
| 9, no kouloura | **Confirmed.** |
| 10, woodland and scrub density | **Partly.** Oak 50–60/ha and Kea's 160/ha checked; pine 100–250/ha is not in its source. The zoning by slope and exposure is the report's own. |
| 11, shore and torrent strips | **Partly.** Tamarisk is A. Reeds, pebbles and beachrock are unchecked. The Potamos torrent is modern. |
| 12, Munsell analogues | **Partly.** As C analogues they are labelled honestly, but two are misdescribed (#47a) or from the tropics (#48b). Davidson's results argue against dark brown, humus-rich soils. |

**Debates (Section 5).**
- **Chronology.** Confirmed: Friedrich 2006, Manning 2024 (via Bruins and van der Plicht 2025: peak about 1608 BCE; 1618–1584 BCE at 2σ), Cherubini 2014's 44%, Ehrlich 2021's nearly 30 masked years, Raj 2023 and Pearson 2023. The "~20-year" and "~40-year" offsets were not checked.
- **Woodland versus scrub.** Mavromati 2021 ties poor-quality woods (tamarisk, fig) to emergency repairs and calls pine "scarcely present". That pine scarcity pushed builders to repairs is the report's own causal reading.
- **Rotation.** Flint-Hamilton gives Sarpaki (rotation) and Sallares (maslin). Halstead is not in that source.
- **Crocus.** The attributions follow Day 2011, with T3 #21's corrections.
- **Kouloura.** Matches its sources.

**Game hooks (Section 6).** These are suggestions, not evidence. Their problems:
- "150 trees/ha" olive groves and "0.5–0.8 m" staked or bush vines at "2,000–2,800/ha" have no source.
- The woodland zoning (oak and pine in gullies, on north slopes and on Profitis Ilias) is unsourced.
- The "dark brown to reddish-brown Cambisol" and "deep red terra rossa" grounds conflict with Davidson and Marinatos.
- The "dry, cobble-lined" Potamos and the cave springs are today's.
- The "1615 BCE Strict Evidence View" should say 1628.

## Sources check (Section 7 and Works cited)

- **Open as the work cited (51):** [1] Pearson et al. 2023 (CC BY 4.0, confirmed); [2] [72] Asouti 2003 (abstract and references only); [3] Bruins and van der Plicht 2025; [6] Druitt et al. 2015 field guide; [7] Sarpaki 2012; [10] Xyrafis et al. 2023; [11] Friedrich, Pichler and Kussmaul 1977 (second fetcher); [12] Bruins et al. 2008; [13] Nomikou et al. 2019; [14] Pfeiffer's web page; [16] Fabbri 2023; [17] Højen Sørensen et al. 2013; [18] Day 2011; [19] Doumas (Latsis e-book); [21] Morgan 1988 (Internet Archive text); [22] Day 2013 (second fetcher); [25] Friedrich et al. 2017 (CC BY 4.0, confirmed); [26] Sbonias et al. 2020 (abstract); [29] Ferrence, Giumlia-Mair and Betancourt (chapter); [31] Ehrlich et al. 2021 (CC BY 4.0, confirmed); [35] Osborne et al. 2000; [36] Xyrafis et al. 2022; [37] Kizos and Koulouri; [38] the Cretan pesticide study (PMC7760811); [39] the oil-and-wine dissertation; [40] Xyrafis et al. 2021; [43] the Valonia oak stand poster; [44] AGFORWARD; [45] Tüfekcioğlu and Tavşanoğlu; [46] Daoudi et al. 2022; [49] Parlak et al.; [51] Marinatos 1968 (scan); [52] the Pylos project soils article; [54] Aydinalp and FitzPatrick 2009; [57] Devnita et al. 2022; [58] Tzachili 2005; [59] Price and Nixon 2005; [62] the EFA programme; [65] Friedrich et al. 2006; [69] Bottema and Sarpaki 2003; [73] [74] Sarpaki 1992 and Sarpaki and Jones 1990 (abstracts); [75] Flint-Hamilton 1999; [80] Kizos and Koulouri 2006; [82] [83] the Naxos and Lesvos grazing papers; [87] Kucuk et al.; [89] the *P. brutia* pattern paper; [91] Manning 2022; [92] Cherubini et al. 2014.
- **Opened from another copy (9):** [5] [8] [28] [30] [41] [48] [88] [95] from MDPI's file server (the article pages refuse automated requests); [84] Palmer et al. 2010 from the UCL postprint.
- **Abstract only, from an index (15):** [15] (AGRIS), [71] (Aegeus Society), [34] (Europe PMC), [63] (the authors' EGU 2013 abstract), and [23] [27] [33] [42] [47] [64] [70] [76] [78] [90] [93] (OpenAlex).
- **Would not open (12):** ResearchGate [4] [24] [32] [53] [55] [60] [86]; Semantic Scholar [61]; Sidestone [20] (truncated three times); refused connections at [50] (a school blog), [56] and [85] (the German National Library).
- **Not opened by choice (3):**
  - [9] is a full OUP book on a college server, with a Library Genesis-style file name.
  - [68] is a dokumen.pub copy.
  - [79] is a Scribd upload.

  Cite the published works instead.
- **Not requested (5):** duplicates [66] [67] [77] [81]; [94] is cited by no row.
- **Wrong or missing details.**
  - §7 #3 is Ferrence, Giumlia-Mair and Betancourt (citing Betancourt 2012), in *Water Supply and Water Management in the Metal Ages*.
  - §7 #6 is Bruins and van der Plicht 2025, *PLOS ONE* 20(9): e0330702.
  - §7 #9: the URL is Sarpaki 1992's page. Davidson 1978 is *Nature* 272: 243–244.
  - §7 #10 is *Hesperia* 80 (2011).
  - §7 #28 is Tzachili 2005, "Excavations on Thera and Therasia in the 19th Century: A Chronicle", *JMA*.
  - §7 #40: the URL is Mavromati's profile page, not the 2017 paper.
  - §7 #59 is Slim, Çakırlar and Roosevelt 2020.
  - §7 #68 has the wrong title (see #10b).
  - §7 #75 is a 2020 pesticide study from Crete.
  - §7 #77 names the wrong speaker (see #11e).
  - §7 #35 is Plieninger, Schaich and Kizos 2010, *Regional Environmental Change*.
  - §7 #74 is Daoudi et al. 2022, Djelfa, Algeria.
- **Sources that do not say what the row claims:**
  - [17] describes today's water, not the Bronze Age's (#24a).
  - [29] has no "uphill terrace walls".
  - [52] is not a limestone soil.
  - [46] has no "100–250/ha".
  - [6] has no "172–54 ka".
  - [10] has no 380 mm for Santorini.
  - [39] has no trellis beside *we-je-we*.
  - [25] has no "paths and shelters".
- **Rights.** CC BY 4.0 is confirmed for [1], [25], [31] and [88] (CC BY). [63]'s "CC BY-NC 4.0" is unverified; the companion EGU abstract is CC BY 3.0. The report makes no other licence claims that matter for building: no plan or map from these sources is to be traced (standard §5).
- **Images in the report.** Three embedded images (Markdown lines 411, 413 and 415, about 136,000, 201,000 and 411,000 characters of base64). By the report's own text they are its own charts of the charcoal and cover figures. They are not sources and were not opened. Do not use them.

## Corrections to apply before building

1. **A ploughed field under the pumice (#10a, #16a, T3b-1, T3b-2, Summary 6).**
   - Friedrich et al. 2017 [25] studied "the cultivated field in which the trees grew" at the buried-olive site near Fira.
   - They found a ca. 30 cm top layer "with clear traces of human activity―ploughing", sherds, obsidian, and moulds of roots and twigs, along an outcrop several hundred metres long.
   - Grade B: it is the authors' reading, with no published section drawing.
   - Build tilled ground with olive trees standing in it near Fira. Do not build terrace walls: none is attested.
2. **The ground (#14a, #14b, #46–#48b, Summary 1 and 12, Game hooks).**
   - Marinatos 1968 (p. 6): "a dark coloured lava" with "a thin layer of cultivable humus".
   - Davidson 1978 (via Sarpaki 1987), six exposures: mostly sand, little silt, almost no clay, organic matter "negligible", much like today's soils. Steep high slopes were bare rock or thin soils.
   - Thickness: 0.5 m at Fira, 3–4 m at Akrotiri and Millo.
   - Replace the Cambisol, terra rossa and Andisol defaults. Colour stays a liberty (T-L8), but texture and thinness are sourced: thin, sandy, dark over dark lava, with red Cape Riva ignimbrite exposed beneath.
3. **Woodland (#19, #20, #23, T3b-4, Summary 2 and 10, Game hooks).**
   - The shaft 63A percentages are unverified (the article is paywalled).
   - Mavromati 2017: an open pine forest with maquis in the EC; "open maquis" from the MC on, with olive, pomegranate and almond predominant. Evergreen oak points to wetter conditions.
   - For 1628, build open maquis and tree crops with scattered oak, pine and juniper (B).
   - No source places trees in gullies, on north slopes or on Profitis Ilias. Record that zoning as a liberty (C).
4. **Fig and oak wood (#21b, #29; amends T3d corrections 1 and 2).**
   - Mavromati 2021 (abstract): the LC I houses Xeste 3 and the House of the Ladies used pine and deciduous oak for floor beams, juniper and evergreen oak in ceilings, and olive widely.
   - They used tamarisk and *Ficus carica* in repairs after the late MC or early LC I earthquake.
   - Fig wood and oak wood are therefore A at Akrotiri. T3d's "no fig wood" and "oak not in the West House" are both Bottema's West House only.
   - Fig used as poor-quality repair wood suggests local fig trees (INFERENCE, B).
5. **Water (#24a, Summary 4 and 11, Game hooks).**
   - "No rivers; winter and spring torrents; springs round Profitis Ilias" describes today's island (Sørensen 2013). Grade B.
   - The Potamos torrent is modern: Doumas says it flowed through the site "in recent times", and villagers built terraced vineyards from the ruins' stones.
   - Do not build a pre-eruption Potamos. Zoodochos Pigi is on Mesa Vouno.
6. **Pines (#29).** The pines in the West House frieze are stone and Aleppo pines (Morgan). The charcoal is *P. halepensis/brutia* type. Outdoors, draw Aleppo or brutia pines, not umbrella pines.
7. **Pleistocene floras (#17a, #17b, Section 3).**
   - Grade C.
   - The Fira palaeosol (stratum 14) is dated ">37,000" and "44,500 ± 5,250" BP. The palm moulds are in strata 7 and 13. The olive and mastic leaves were water-borne. The olive leaves of Friedrich 1978 are 50–60 ka.
   - This settles T3d's open date question: the 37,000 is Friedrich 1977's radiocarbon floor.
8. **Pre-Kameni (#43c).** The volume is C, a scaled model (T1 #14).
9. **Season and press (#37b, #5b).** The summer eruption is the authors' argument (B). The Trench 58B press's use for grapes is B.
10. **Pine and oak densities (#41c, Section 3).**
    - Delete "100–250 trees/ha"; the study is from the Algerian Saharan Atlas. 400/ha is a model assumption.
    - Use the Valonia oak figures (50–60/ha; Kea 160/ha) and the Turkish cover classes only as C analogues.
11. **Scrub cover (Section 3, Summary 10).**
    - Add the Antikythera quadrats (Palmer et al. 2010): total cover 60–100%, bare ground 0–40% (13 quadrats), with scrub closing over abandoned fields within 20–60 years (C).
    - That pace also fits the shrub that grew on the Koimisis ruins.
12. **Rainfall.** Delete "~380 mm older cite": that figure is Extremadura's and Pafos's.
13. **Smaller misreadings.**
    - #9: no "paths and shelters".
    - #34e: the trellis is the wine ideogram.
    - #44a: no "172–54 ka".
    - #47a: a dune soil, not limestone.
    - #11c: check-dams, not terrace walls.
    - #29: as correction 6.
14. **Town size (#2, Section 3).** 20 ha is C (T2b; A-L1). The ~1 ha dug and 35 houses are A.
15. **Balos and Therasia (#4a, #6c, Summary 5).**
    - What is supported (Sarpaki 1987, after Fouqué 1879): three rooms at Balos, a thick bed of straw, barley, lentils, *arakas* (*L. clymenum*), aniseed, coriander and some chaff. The "stable" is Fouqué's guess (B).
    - The pen, bones and fodder vessel are unverified.
    - Add, from the same page: at Alaphouzos on Therasia, mostly barley, other cereals and peas, and what Fouqué took for a beam olive press (B).
    - Tzachili 2005 (n. 6) records an olive trunk kept in the ashes at Balos, since lost.
16. **Pumice over the buried olives (#15a, #16b).** Sørensen gives about 40 m (Friedrich 2009); Pearson gives more than 60 m. Record both.
17. **EBA and MBA charcoal (#19, #22–#24b).** Grade by phase. EBA is C (T3 #11). MBA (c. 2000–1700) is B at best, and C where it is before 1800.
18. **Sources list.** Fix the authors, titles and dates in the Sources check. Do not rely on [9], [68] or [79].
19. **The year.** Change "1615" to 1628 in Section 2's distances and in the Game hooks (see the next section).

## The year and the season

The report's title and text assume **late May, 1615 BCE**, the year its prompt gave before the world moved to **1628 BCE** (D36).
- **Distances.** On the high chronology the eruption falls about 1613–1602 BCE (Manning 2024, 68.3%) or 1618–1584 BCE (95.4%), so 1628 is about 15–28 years before it, not 0–15. On Pearson's 1602–1502 BCE it is about 25–125 years before.
- **The earthquake repairs.** The repairs Mavromati dates to about 50 years before the eruption follow the rebuild from c. 1645 (`docs/WORLD_CLOCK.md`). In 1628 they are less than twenty years old.
- **No claim changes grade or content.** The plants and the ground are the same in both years.
- **Late May is unchanged.** Every phenology row is a modern analogue (C): olives within their April–June flowering, vine buds differentiating from 15 May, pulses coming in first.
- **One open question.** 1628 is the year of Aniakchak II, with frost rings in 1627 (`WORLD_CLOCK` §4). Whether a cold summer reached the Aegean, and whether it delayed the harvest, is not known. No source here speaks to it.

## Gaps

- **The charcoal by phase.**
  - Asouti 2003 (*Antiquity* 77: 471–484) is paywalled. Its shaft 63A table carries every percentage in claims 19–25, the cave weevil, and the modern-vegetation remark.
  - Mavromati 2017 and 2021 (*Quaternary International*) were read as abstracts only. Their counts by phase and the oak species are not known.
  - A library copy of these three papers would settle the woodland question.
- **Sarpaki 2019** (*Country in the City*, Archaeopress, pp. 72–87; paid e-book) carries the rural-site list, the Balos details and the grain-cleaning argument.
- **Davidson 1978 and Limbrey 1990.** The six exposures, their places, and grain-size and organic values were read only through Sarpaki 1987's summary.
- **The ploughed field.** Friedrich 2017 gives no section, depth of plough marks or extent beyond "several hundred meters long". Friedrich 2009 (*Santorini: Volcano, Natural History, Mythology*) may have more.
- **Where things grew.** No opened source maps land use, places woodland, or gives a Bronze Age spacing for olives, vines or fields. Every zone and density in the world will be a liberty or a C analogue.
- **Colour.** No Munsell value exists for the palaeosol. Marinatos's colour plate A 2–4 (1968) shows the "dark coloured lava" and could be described from the scan.
- **Shore and reeds.** Beachrock and pebbles (Georgaki) and the ceiling reed impressions (Palyvou 1999, via Sidestone) did not open.
- **Bronze Age terraces near Thera.** Turner et al. 2021 date Naxos terraces by luminescence (12 ages, in the table of [30]). The report does not use them.
- **Pollen.** There is still no pre-eruption pollen record from Thera (as T3, T3d).
- **Today's flora of Santorini** (Flora of Greece portal) is still unread (T3d).
