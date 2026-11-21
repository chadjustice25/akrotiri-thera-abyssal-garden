Verification of lane T3c (docs/research/neon/T3c_Neon.md, written by Gemini Neon Deep Research), by a separate Claude verification agent on 2026-11-21 (D13).

**Amended on 2026-11-21 by the check of the Claude report, `T3c_Claude.md`** (note added by the integrator). That check read Sarpaki 1987's Table 1.24 again as a page image at 400 dpi and found two misreadings below, in the row for assumption T3c-1 and in Gaps:
- *Lathyrus clymenum* is sown from October to January and harvested in May to June. "Or in March" and a harvest "in May" belong to the row above it in the table, millet.
- Only pea is harvested in April. The row for *L. cicera* is blank, so it has no month.

`T3c_Claude.md` §3, corrections 1 and 2, has the readings. The rest of this check stands.

**The report answers an older version of its prompt.** It follows the text of `docs/research/prompts/T3c-plant-forms-and-seasons.md` as it stood before commit ac827fa (D32, D33): one moment, late May of 1615 BCE, topic C "Late May", five assumptions and no Delivery section. It does not answer the current prompt's topic C ("Through the year": each plant month by month, sowing and harvest, budburst and leaf fall) or its assumption T3c-4 (bare months and green ground). The report ends without a `DRIVE:` line. Its Section 4 labels T3c-4 and T3c-5 are the current prompt's T3c-5 and T3c-6; this check uses the current numbering.

Every cited URL was requested during this run, with a plain download first and then, where refused, a second fetcher. PDFs were read as text with `pdftotext`. One rotated scanned table (Sarpaki 1987, Table 1.24) was read as a page image. Numbers in brackets, such as [28], are the report's own "Works cited" numbers. Sources are paraphrased; short quoted phrases are under 15 words. The verdicts are: **checked** (the source says it), **checked in part**, **wrong**, **could not check**. A grade change is shown as "A → B".

## Verdict

- **Counts.** The report has 34 claim numbers on 62 rows (one source per row).
  - **Checked: 39** (5 of them only in part).
  - **Wrong: 7** (rows of claims 19 [twice], 21, 23, 26, 32, 34).
  - **Regraded: 9** (8 too high, 1 too low; these overlap the other counts).
  - **Could not check: 16** (ResearchGate, SciSpace, BioOne, encyclopedia.pub, the USGS fact sheet and CIHEAM refused or failed; Scribd and dokumen.pub copies were not requested because they are unofficial copies of copyrighted works).
  - Section 3 has 38 numbers: **25 checked, 4 checked in part, 9 could not check.**
- **No fabricated source, quotation or number was found.** Every source that opened is real and says what the report puts on that row, with the exceptions in the table. Several are misnamed in Section 7 (see Sources check). One number has a second, different published value: the buried Santorini olive trees stood at 172 m above sea level in Friedrich et al. 2014, but at 150 m in Friedrich 2013.
- **The report delivers almost nothing of what the lane asked for.** It gives no height, spread, bark, leaf, flower, fruit or month for olive, fig, vine, oak, pine, tamarisk, pear, any cereal, any pulse but one, flax, coriander, or any scrub plant but *Satureja thymbra*. It says these "could not be verified". Modern floras were allowed at grade C, and it used almost none. Of the painted plants, only crocus, white lily, sea daffodil and the modern reed *Phragmites* get numbers, all from modern descriptions (C).
- **Its own sources held more than it reported.** The Sarpaki thesis it cites [10] contains a calendar of crop work on Santorini from village informants (1982–83) and the island's monthly rainfall. Its tomato source [20] names the tomato. Its West House charcoal source [5] calls eucalyptus "certainly … a recent acquisition".
- **What the opened sources add for the build question** (details in the plants table):
  - Fig wood is attested as building timber at Akrotiri (Mavromati 2021). This amends T3d Corrections 2.
  - Doumas reports vine-wood charcoal as well as grape pips.
  - The reed with physical remains at Akrotiri is the giant reed *Arundo donax*, as impressions in buildings, not *Phragmites*.
  - Almond is grade A.
  - Pomegranate wood is attested, but from a context before the window (C).
- **Shown is not present is mostly respected.** No painted plant is graded A. The report does wrongly count grape among plants that are only painted (claim 21), and it treats its two olive finds as two "growth forms" (Summary 2), which is its own inference.
- **The year.** The report uses 1615 BCE and infers a rebuilding at "c. 1665 BCE". The world now opens in 1628 BCE. The world clock puts the rebuilding at c. 1650 and the living town from c. 1645. For plants the shift changes nothing, but the dates in claims 2 and 11 must be restated.
- **Usable for building plants: only in small part.** Use the checked olive numbers (claims 8, 9), the fig, timber and charcoal taxa (claims 5, 11, 18), the exclusions of prickly pear, agave, citrus and tomato (claims 29, 30, with corrections), and the modern sizes of crocus, white lily, sea daffodil and *S. thymbra* (C). For the yearly cycle a new lane is needed; Gaps lists what it must cover.

### Plants with physical pre-eruption evidence on Thera (the build question)

Compared with `docs/research/verification/T3.md` and `T3d.md`. "Grade for 1628 BCE" follows `docs/HISTORICAL_STANDARD.md` §1 and §3.

| Plant | Report | What the opened sources support | Grade for 1628 BCE |
|---|---|---|---|
| Olive | trees at 172 m by a Bronze Age wall; Therasia shrub with stems ≤ 2.5 cm; EBA cultivation | Two trees buried alive in living position (Friedrich 2014: 172 m asl; Friedrich 2013: 150 m, second stem 183 cm long, 9 m away). Branch moulds 1–3 m above the pumice base (Friedrich 2006). Therasia shrub between terrace stones, stems 8 mm–2.5 cm (Pearson 2023). Dominant West House charcoal (Bottema). Main timber of Xeste 3 and the House of the Ladies (Mavromati). | A; EBA part C |
| Fig | structural wood | Mavromati 2021 abstract: *Ficus carica* among the construction timbers, "taxa with poor quality wood". Seeds in pots and sewers (T3 #1, #4; Doumas). | A as wood and fruit. A local tree is likely: poor timber is not imported. |
| Grape vine | listed as art only (claim 21) | Pips and stalks (T3 #1, #4); Doumas: "charcoal from vine wood" and a grape press. Bottema found no vine wood in her samples. | A as fruit; vine on Thera A [verify] (Doumas does not cite the charcoal report) |
| Almond | "unverified" (claim 34) | Bottema: domesticated almond grew on the island, cultivated from the Middle Cycladic. Doumas: almond imprints inside a storage jar. | A |
| Pomegranate | "unverified" (claim 34) | Doumas: wood from a context of the early second millennium BC; *Punica* in Asouti's list (via Bottema), phases not split. | C (before the window) |
| Oak | "open oak woodland (probably *Q. macrolepis*)" | Deciduous and evergreen *Quercus* in Asouti's list and in Mavromati's timbers. "Open oak woodland" is Asouti's reading. *Macrolepis* is in no opened source. Kermes oak grows on Santorini today (Bottema). | A as wood (both kinds); woodland B; species unknown |
| Pine | gap (claim 19) | Bottema (sewer and outside the West House); Mavromati (*P. brutia/halepensis* floor beams, "scarcely present"); kitchen fuel (T3 #6). | A as wood; growing locally B |
| Juniper, tamarisk, pear, *Pistacia* | partly | Bottema; Mavromati (juniper, tamarisk timbers); T3 #6. | A as wood |
| Chestnut, alder | maquis and stream | Bottema: earliest chestnut wood in Greece; alder implies a stream only "supposing" it grew locally (T3d). | A as wood; trees on Thera B |
| Barley (six-row and two-row), einkorn, free-threshing wheat | two-row from Crete only; einkorn "unverified" | Thesis abstract: *Hordeum vulgare*, *H. distichum*, *Triticum monococcum*; kitchen: free-threshing wheat (T3 #4). | A |
| Lentil, pea, chickpea, bitter vetch, faba, *L. clymenum*, lupin | most "unverified" | Thesis abstract; kitchen (T3 #4); pure lots of *L. clymenum* (PMC12956113). | A (bitter vetch, lupin: crop status B) |
| Flax, coriander, garlic | attested | Thesis abstract ("possible crop plants"); garlic: Sarpaki 2021 abstract. | A as seeds; crop status B for flax and coriander |
| Thyme, savory, lavender, thorny burnet, *Thymelaea*, asphodel, *Juncus* | "could not be verified" (claim 19) | Kitchen remains (T3 #7). | A as taxa; species of savory and thyme unknown |
| Reed | *Phragmites* as model | Sarpaki 1987: "numerous impressions of the giant reed *Arundo donax*" in buildings. Asouti's list has "Poaceae (reeds?)". No *Phragmites* remains. | *Arundo* A as material; growing on Thera B |
| Cypress | "unverified" | Sarpaki 1987 lists cypress among early charcoal identifications; Asouti has "Cupressaceae (cypress or juniper)"; Mavromati 2019 calls cypress non-local (T3 #10). | Timber B at most; not a tree on Thera |
| Lilies, crocus, sea daffodil, papyrus, sedge, myrtle, ivy, palm | art only | Agreed. No palm wood (Bottema). | B at most (art) |

## Table

"Opens" names the cited URL's result. Grades are judged against `docs/HISTORICAL_STANDARD.md` §1, §3 and D26.

| # | Claim (short) | Opens | Verdict | Number | Grade | Fix |
|---|---|---|---|---|---|---|
| 1 | Eruption around 1615 BCE (Doumas) | [28] yes | checked ("around 1615 BC") | — | B ok | The world clock uses 1613–1602 BC at 68.3% (Manning 2024); the world opens in 1628. |
| 1 | 72 X-ray rings in 4 sections; 1627–1600 BCE | [34] yes | checked ("72 rings", "four consecutive groups") | exact | B ok as an eruption date (debated); the measurement is A | Add "2σ, 95%" as the source gives it (T3 #12). |
| 1 | Ordered sequence without ring counts: 1656–1609 at 95.4% | [3] no (ResearchGate 403); the reply opened inside [32] | checked ("95.4% range is 1656–1609 cal BC") | exact | B ok | Calibrated with IntCal13. |
| 1 | Calibration plateau c. 1600–1530; single-year data reach c. 1540 | [31] no (403); same text at PMC7183194 | checked ("plateau … from ∼1600 BCE to ∼1530 BCE") | exact | B ok | [31] is Kutschera 2020, a commentary, not "Manning et al." (Debates). |
| 1 | Olive rings unreliable; 1525–1490 not excluded | [33] yes | checked | exact | B ok | The file is Cherubini and Lev-Yadun's 2014 reply, not the 2013 PLoS ONE study. |
| 1 | Therasia shrub slightly younger; mid-16th century | [4] yes | checked (abstract) | — | B ok | — |
| 2 | Final city stood about half a century | [28] yes | checked ("about half a century later") | — | **A → B** (excavator's estimate, as T3d #2) | Replace "c. 1665 BCE" with the world clock: rebuilt c. 1650, town from c. 1645. |
| 2 | Structural charcoal reflects emergency repairs after the quake, 50 years before | [7] no (403); abstract at AGRIS | checked ("might be the result of the emergency repair work") | 50 yr | A for the charcoal; **repair reading A → B** | Author: Mavromati 2021, *Quaternary International* 593: 71–84. |
| 3 | Not treeless; moist, cool climate; open oak woodland | [1] yes | checked (abstract) | — | **A → B** for the climate and woodland reading (T3 #9: phases not split) | — |
| 4 | Deciduous oak probably *Q. macrolepis* | [2] no (403) | could not check; *macrolepis* is not in Asouti's abstract, Bottema or Mavromati | — | unsupported | Drop it. Evergreen oak is equally attested. |
| 5 | West House: cattle-grazed maquis, tamarisk, alder, earliest chestnut wood | [5] yes | checked ("earliest registered find of wood of *Castanea* in Greece") | — | A for the taxa; **"cattle-grazed maquis" A → B** (Bottema's reading) | Chestnut and alder as trees on Thera: B (T3d). |
| 6 | Alder and tamarisk suggest a stream (INFERENCE) | [5] yes | checked ("may indicate that a stream") | — | B ok | — |
| 7 | Olive cultivation from the EBA | [1] yes | checked (abstract) | — | **A → C** (outside the window; T3 #11) | — |
| 7 | Olive c. 50% of EBA charcoal, prunings | [22] no (challenge page) | could not check; T3 #11 checked the same article ("some 50%") | 50% | **A → C** (T3 #11) | Bottema's summary of Asouti: olive 50%, pine 20%, samples spanning EBA to LBA. |
| 8 | Olive remains from Late Neolithic to LBA | [9] no (403) | could not check; not in the article's abstract | — | LN to MC parts C | [9] is Sarpaki 2001, BSA 96: 27–40, not 2013. |
| 8 | Two olive trees buried alive at 172 m asl by a Bronze Age wall; a stem 9 m away | [3] no; opened inside [32] | checked (Fig. 1: "172m asl"; Fig. 2: "only 9m away") | exact | A ok | Friedrich 2013 gives 150 m asl and a 183 cm stem. Record both heights. |
| 9 | Therasia shrub: stems 8 mm, c. 1, 1.5, 2.5 cm; bark 2–3 mm; bands < 400–500 µm; c. 3–81 bands | [4] yes | checked (Table 2) | exact | A ok | The 2–3 mm bark is on stem 88-2 only. Site at 196 m (T3 #13). CC BY 4.0. |
| 10 | Modern Santorini olives: 44% deviation, 40–104 for 72 rings | [32] yes | checked | exact | C ok | — |
| 10 | Winters around 10 °C cause false rings | [33] yes | checked ("low winter temperatures are around 10◦ C") | exact | C ok | — |
| 11 | Fig wood in structural elements, from emergency repairs | [7] no; abstract at AGRIS | checked (*Ficus carica* among poor-quality timbers) | — | A as timber; repair reading B | The buildings are Xeste 3 and the House of the Ladies. |
| 12 | c. 20 ha town; clean grain in town; Balos jars of grain in chaff by a sheep and goat pen | [11] no (403) | could not check (book chapter, paywalled) | 20 ha | **20 ha A → C** (A-L1: both published sizes are C) | Sarpaki 2019, in Garcia et al. (eds), *Country in the City*, pp. 72–87. |
| 12 | Processed barley, wheat, probably legume flour; charred, mineralised, silicified; weeds | [9] no; abstract via Crossref | checked in part ("barley, wheat and probably legume flour"; the rest is from [10]) | — | A ok | — |
| 13 | Two-row barley at EM Chrysokamino | [35] no (403) | could not check | — | B for Crete | Two-row barley (*H. distichum*) is A at Akrotiri itself ([10] abstract). |
| 13 | Straight grains at LM II Knossos; free-threshing wheat on Crete | [36] abstract only | could not check (body paywalled) | — | LM II is after the window: C | Authors: Livarda and Kotzamani 2013, BSA 108: 1–29. |
| 14 | West House: bitter vetch, cf. *L. clymenum*, *Lupinus* cf. *albus*, split legumes, cracked barley | [10] yes | checked (abstract) | — | A ok | Bitter vetch and lupin are "possible crop plants" there (T3 #1). |
| 14 | Akrotiri's *L. clymenum* is the only prehistoric Greek find outside Crete | [36] | could not check | — | — | — |
| 14 | *L. clymenum* (and *L. ochrus*) stored in pure lots | [37] yes | checked ("stored in pure concentrations", citing Sarpaki 1992) | — | **B → A** for *L. clymenum*; *L. ochrus* B (disputed) | — |
| 14 | Sewer pit; wheat, broad bean, *L. clymenum* | [6] not requested (unofficial copy of Megaloudi 2006) | could not check | — | — | Faba (cf.) is A from the kitchen (T3 #4). |
| 15 | *L. clymenum* form; pods 52–80 × 8–9 mm (Israel) | [23] no (403) | could not check (Melamed et al. 2009, *Israel J. Plant Sci.* 57: 125–130) | unchecked | C ok | A modern Israeli population describes the species today, not the Theran crop. |
| 16 | Flax and coriander in West House stores | [10] yes | checked (abstract) | — | A as seeds; crop status B | — |
| 16 | Garlic at Akrotiri | [8] no; abstract via Crossref | checked ("Recent finds of garlic from Late Bronze Age Akrotiri") | — | A ok | Sarpaki 2021, *Documenta Praehistorica* 48: 432–445. |
| 16 | Flax as oil and fibre on Crete | [36] | could not check | — | B ok | — |
| 17 | *S. thymbra*: much-branched dome, 20–40 cm | [25] yes | checked (citing Davis, *Flora of Turkey*) | exact | C ok | A modern species. |
| 17 | *S. thymbra* 0.4 × 0.4 m, flowers May–June | [24] yes | checked | exact | C ok | PFAF is a horticultural database; its months are not Aegean field records. T3 #7 names savory at Akrotiri without a species; *S. thymbra* is the report's choice. |
| 18 | Cedar, yew and beech imported | [1] yes | checked (abstract) | — | A as timber, not trees on Thera (T3 #9) | — |
| 19 | No remains or data for pine, pear/hawthorn, einkorn, lentil, pea, chickpea, thyme, lavender, thorny burnet, *Thymelaea*, asphodel, *Juncus* | [36] | **wrong**: all are attested at Akrotiri (T3 #4, #6, #7; Bottema; [10] abstract) | — | — | Say "attested (A); form and months not given". |
| 19 | No dimensions or months for olive, fig, vine, oak, tamarisk, cereals, flax, coriander, garlic, pulses | [10] | **wrong in part**: the cited thesis gives Santorini sowing and harvest months (Table 1.24) and monthly rainfall (Table 1.12) | — | — | See Gaps. |
| 20 | Knossos pigments: lime plaster, haematite, iron hydroxide, mineral black, Egyptian blue; brown = haematite over blue | [15] yes | checked in part (black is "apparently carbon"; glaucophane also found) | — | B ok (Knossos, c. 1700–1400 BC) | — |
| 20 | Yellow for light green (myrtle); deep blue for deep green (ivy, papyrus, lily, reeds, palm) | [12] yes | checked (Wikipedia's text) | — | C as a pointer; B once Doumas 1992: 18 is read | — |
| 21 | Painted plants listed; lilies … grape lack macro-remains | [13] yes | **wrong in part**: the list is Nugent's, but grape has pips and stalks (A) and vine-wood charcoal (Doumas); giant reed left impressions (Sarpaki 1987) | — | — | Take grape and reed off the art-only list. |
| 21 | Wall-painting fragments with myrtle branches | [28] yes | checked | — | B ok | — |
| 22 | Crocus: *C. cartwrightianus* or *C. sativus*; leaves to 40 cm; autumn; pale to dark purple; 3 stamens, 3 stigmas | [13] yes | checked | exact | B (art) / C (botany) ok | Nugent is a secondary paper citing Huxley and Taylor 1977. |
| 22 | Saffron from the dried branched style of autumn crocuses; spring or summer readings were wrong | [14] yes | checked ("dried branched style") | — | **B → C** (a botanical fact) | Day: saffron crocuses bloom "for only a few days". |
| 23 | Delta 2 and West House red lilies, mostly 3 stems, buds with blooms; *L. candidum* to 1 m, scaly bulb, drooping stems; white "unverified" | [13] yes | **wrong in part**: Nugent calls *L. candidum* "This pure white variety"; the rest checked | 1 m; 3 | B / C ok | — |
| 24 | Sea daffodil 40–60 cm, 2–20 stems, peak bloom late August; triads in the House of the Ladies | [13] yes | checked | exact | B / C ok | Nugent also: a "night-blooming summer flower" of dunes and shores. |
| 24 | Papyrus hybridized with Aegean flowers, hence the confusion | [38] yes | checked ("This form of hybridization accounts for the common confusion") | — | B ok | Debates marks it [13]; it is [38]. |
| 25 | *Phragmites*: 1–6 m, leaves 20–60 cm × 8–32 mm, panicles 15–50 × 6–20 cm | [26] page served without its text; second fetcher refused | could not check | unchecked | C | Not the attested reed: Akrotiri's reed impressions are *Arundo donax*. |
| 25 | *Phragmites*: 2–4 m, culm to 2.5 cm, leaves 25–50 × 1–5 cm, 30 cm panicle, 8 mm seed, stolons 10.8 cm/day | [27] yes | checked | exact | C ok | A modern species. |
| 26 | No data for myrtle, ivy, palm; Cycladic occurrence unverifiable for sea daffodil, papyrus, *Phragmites* | [13] | **wrong** for sea daffodil: the cited source says it grows on dunes and shores "of most islands" | — | — | Papyrus is absent from the Greek flora (T3d #55); *Phragmites* on Andros (T3d #57); dwarf fan palm grows on Santorini today (Bottema). |
| 27 | Amorgos and Karpathos: sickles and uprooting; 1.5 and 1 man-days per stremma | [16] not requested (unofficial upload of *JHS* 109: 41–55) | could not check | unchecked | C ok | On Thera itself crops were uprooted until a sickle came about 20 years before 1987 (Sarpaki 1987). |
| 28 | Modern Thira c. 80% cultivated; 7.6 species/km²; therophytes dominant | [39] no (bot challenge; the Refubium copy too) | could not check | unchecked | C ok | Raus, Karadimou and Dimopoulos 2019, *Willdenowia* 49: 363–381 (details from a search listing). |
| 29 | Prickly pear, agave, maize: Mexican, pre-Hispanic | [19] yes | checked ("oldest cultivated plants in Mexico") | — | C ok | — |
| 29 | Agave and *Opuntia* reached the Mediterranean in the 16th century | [20] yes | checked ("introduced into the Mediterranean basin in the 16th century") | exact | C ok | The same abstract names *Solanum lycopersicon* (tomato) among American plants brought to Europe. |
| 29 | *O. ficus-indica* to Spain with Columbus, 1493 | [29] no (403) | could not check | — | C | — |
| 30 | Citrus arrivals: citron and lemon in antiquity; sour orange, lime, pummelo 10th c. AD; sweet orange late 15th; mandarin early 19th | [17] no (403); same abstract at the Israel CRIS record | checked | exact | C ok | Citron: Persian garden near Jerusalem, 5th–4th c. BC. |
| 30 | Citron a later introduction in Israel, not a Bronze Age Aegean crop | [40] yes | checked in part (earliest citron growing in Israel, 5th–4th c. BCE; the Aegean is not mentioned) | — | C ok | Langgut 2015, *Israel J. Plant Sci.* |
| 31 | *Pistacia vera*: Central Asia; after Alexander; grown in Greece from the 19th century | [18] no (404; the new host did not resolve) | could not check | — | C | The arrival date stays unverified. |
| 31 | Wild Greek *Pistacia* differ from *P. vera* | [41] yes | checked in part (names *P. palaestina*, *terebinthus*, *lentiscus*; no date) | — | C ok | — |
| 32 | No arrival evidence for eucalyptus, tomato, tobacco, bougainvillea | [19] | **wrong** for tomato ([20] abstract) and eucalyptus (Bottema: "certainly is a recent acquisition") | — | — | Tobacco and bougainvillea still need a source. |
| 33 | Carob unattested on Thera; westward spread perhaps 2nd millennium BCE; Grove and Rackham doubt it | [21] no (403) | could not check | — | C | Absent from every Akrotiri charcoal and seed list opened. |
| 33 | Carob origin debated; spread by Greeks and Arabs | [42] yes | checked in part ("disseminated by the Greeks in Greece and Italy"; no date for Greece) | — | C ok | Bottema saw carob on modern Santorini and thinks such trees recent. |
| 34 | Cypress, *P. brutia*, *Q. pubescens* in Cretan buildings; cypress, pomegranate, almond, date palm unverified on Thera | [30] no (403) | **wrong** for almond (Bottema, Doumas) and pomegranate (wood, early 2nd millennium BC, Doumas; *Punica* in Asouti's list) | — | almond A; pomegranate C; cypress timber B; date palm B (art) | — |

### Section 3, "Numbers for the builder"

| Quantity | Report | Check |
|---|---|---|
| Eruption, high (Doumas) | 1615 BCE; B | Checked. The world clock's figure is 1613–1602 BC at 68.3%. |
| Olive-branch date | 1627–1600; B | Checked (2σ, 95%). |
| Unconstrained sequence | 1656–1609 (95.4%); B | Checked (IntCal13). |
| Plateau / low date | 1600–1530 / 1525–1490; B | Checked (Kutschera 2020; Cherubini and Lev-Yadun 2014). |
| Quake-to-eruption interval | 50 years; A | Checked (Doumas, Mavromati). **Grade B.** |
| Town area | 20 ha; A | Could not check. **Grade C** (A-L1). |
| Ash over Akrotiri | up to 6 m; A; claim 1 | Checked (Nugent: "up to 6 metres of ash", a secondary paper). No claim row carries it. Cite a primary source. |
| EBA olive share | 50%; A | Could not check here; T3 #11 confirmed it. **Grade C.** |
| Buried olive trees | 172 m asl; A | Checked (Friedrich 2014). Friedrich 2013 gives 150 m. |
| Second stem distance | 9 m; A | Checked. |
| Therasia stems | 0.8–2.5 cm; A | Checked. |
| Bark (88-2) | 2–3 mm; A | Checked. |
| Band width | < 400–500 µm; A | Checked. |
| Band counts | 3–81; A | Checked. |
| Ring count and deviation | 72; 40–104; 44%; B/C | Checked. |
| Winter low | about 10 °C; C | Checked. |
| *L. clymenum* pod | 52–80 × 8–9 mm; C | Could not check (both rows). |
| *S. thymbra* | 20–40 cm; 0.4 × 0.4 m; C | Checked (both rows). |
| Crocus leaf | up to 40 cm; C | Checked. |
| Crocus parts | 3 stamens, 3 stigmas; B/C | Checked. |
| *L. candidum* | up to 1 m; C | Checked. |
| Delta 2 lily stems | 3; B | Checked. |
| Sea daffodil | 40–60 cm; 2–20 stems; C | Checked (both rows). |
| *Phragmites* height, leaf length, leaf width, panicle length | 1–6 m; 20–60 cm; 8–50 mm; 15–50 cm; C | Checked in part: the IUCN values (2–4 m; 25–50 cm; 1–5 cm; 30 cm) are confirmed, the USGS values are not. The "8–50 mm" width merges two sources. |
| *Phragmites* culm, seed, stolon | 2.5 cm; 8 mm; 10.8 cm/day; C | Checked. |
| *Phragmites* panicle width, ligule | 6–20 cm; 0.2–0.6 mm; C | Could not check (USGS). |
| Sickle and uprooting labour | 1.5 / 1.0 man-days per stremma; C | Could not check. |
| Modern Thira | 80% cultivated; 7.6 species/km²; C | Could not check. |

Totals for the 38 rows: checked 25, checked in part 4, could not check 9. Every plant size in this table is a modern description of a living species (grade C). None measures a Bronze Age plant except the olive rows.

### Section 4, "Assumptions checked" (current prompt numbering)

| Assumption | Report | Check |
|---|---|---|
| T3c-1: barley ripe in May, golden or being cut in late May; wheat follows | could not verify | **Partly** (C). Sarpaki 1987, Table 1.24 (Santorini informants, 1982–83): barley sown in October and harvested in June; *L. clymenum* harvested in May or May–June; pea and *L. cicera* in April. So in late May barley stands ripe, before the cut. Sarpaki also cites Hesiod: wheat in Boeotia harvested c. 15 May. No Theran wheat date was found. |
| T3c-2: olives in flower, grapes small and green, figs unripe in late May | could not verify | **Could not verify**, agreed. Table 1.24 gives only the grape harvest (September). |
| T3c-3: Bronze Age cereals about 1 m or more | could not verify | **Could not verify**, agreed. Modern Theran barley is cut near the ear; no straw height. |
| T3c-4: fig, vine and deciduous oak bare December–March; ground green from autumn rain to April or May | not asked (older prompt) | **Not addressed.** Santorini's monthly rainfall (Sarpaki 1987, Table 1.12, after Biel and Alt, 1894–1914) is in mm: Jan 62, Feb 46, Mar 32, Apr 20, May 16, Jun–Aug 2 each, Sep 15, Oct 21, Nov 68, Dec 73 (year 362). That fits green ground from November to April (C), but no source on leaf fall was opened. |
| T3c-5: prickly pear, agave, eucalyptus, citrus, tomato absent | partly (eucalyptus and tomato "could not verify") | **Confirmed** for prickly pear, agave, citrus and tomato (claims 29, 30; [20] names the tomato). For eucalyptus Bottema calls it recent on Santorini but gives no date. |
| T3c-6: grasses and annuals straw-coloured by late May; thyme coming into flower | could not verify | **Could not verify**, agreed. PFAF's May–June for *S. thymbra* is a horticultural record. |

### Summary bullets

| Bullet | Check |
|---|---|
| 1 Ecology | **Partly.** *Macrolepis* unsupported; woodland, climate and "cattle-grazed maquis" are readings (B); chestnut as a local tree B; EBA olive C. |
| 2 Two olive forms | **Partly.** The numbers are right. The two "forms" are the report's inference from two finds: trees with crowns reaching 1–3 m and more, and a shrub. |
| 3 Town and outlying farms | **Could not check** (Sarpaki 2019 not opened). The 20 ha is C. |
| 4 *L. clymenum*, *S. thymbra* | **Partly.** The *S. thymbra* numbers are checked, the pod size is not. "Other crops could not be verified" is wrong (claim 19). |
| 5 Painted flora | **Partly.** Grape and reed have remains; barley and vetch are found as seeds as well as painted. |
| 6 Colour substitutions | **Checked** as Wikipedia's summary of Doumas 1992 (C until read). |
| 7 *Phragmites* | **Partly.** A modern model species; the attested reed is *Arundo donax*. |
| 8 Repair timber and imports | **Checked**; the repair reading is B and "c. 1665" should read c. 1650 (world clock). |
| 9 Exclusions | **Checked** for *Opuntia*, *Agave*, citrus; maize by origin only; *P. vera* date unverified. |
| 10 Carob and doubtful trees | **Partly.** Almond A; pomegranate C; cypress timber B. |
| 11 Chronology and Linear A | **Partly.** [31] is Kutschera 2020, not Manning; no invented names, as required. |

**Debates (Section 5).** The chronology paragraph names "Manning et al." for [31]; [31] is Kutschera's commentary, which reports the plateau and the pull toward c. 1540. The lily, sea daffodil and crocus positions match Nugent and Day. The Morgan hybrid point is right but carries marker [13] instead of [38]. The *L. ochrus* dispute could not be settled (Livarda and Kotzamani not opened). The carob details (Jericho, Mount Carmel, Egypt, Grove and Rackham) could not be checked.

**Game hooks (Section 6).** These are suggestions, not evidence. "Wind-pruned" shrubs and the *Phragmites* stream are not in any source. The stream is B, and the reed with remains is *Arundo*. Locking crocus and sea daffodil as "flowerless leaf-clump meshes" in late May assumes they are in leaf then; no source opened gives their leaf cycle (see Gaps).

## Sources check (Section 7 and Works cited)

- **Open, the work cited (23):**
  - Asouti 2003 [1]: abstract.
  - Pearson et al. 2023 [4]: CC BY 4.0, stated.
  - Bottema-Mac Gillavry 2004 [5]: article page and PDF.
  - Sarpaki 1987 thesis [10]: record and both PDFs.
  - Wikipedia [12]; Nugent [13]; Day 2011 [14]; Profi et al. 1976 [15]; FAO [19].
  - The *Revista del Jardín Botánico Nacional* abstract [20]: opened only over HTTP/1.1.
  - PFAF [24]; Useful Temperate Plants [25]; IUCN GISD [27]; Doumas e-book [28].
  - Cherubini et al. 2014 [32]: the PDF also holds the replies, including Friedrich et al. 2014.
  - Cherubini and Lev-Yadun 2014 [33]; Friedrich et al. 2006 [34].
  - Livarda and Kotzamani 2013 [36]: abstract and references only.
  - PMC12956113 [37]; Morgan 1988 [38]; Langgut 2015 [40]; ISHS [41]; PMC10537686 [42].
- **Opened elsewhere (6):**
  - [3] inside [32].
  - [7] at AGRIS (Mavromati 2021, abstract).
  - [8] and [9] as Crossref abstracts.
  - [17] at the Israel CRIS record (Langgut 2017 abstract).
  - [31] at PMC7183194.
- **Would not open (13):**
  - ResearchGate [2], [11], [21], [23], [30], [35] (all 403).
  - SciSpace [22] (challenge page); USGS [26] (served without content); encyclopedia.pub [29] (403).
  - CIHEAM [18]: 404 at the old address; the new host did not resolve.
  - BioOne [39]: bot challenge, and the Refubium copy too.
  - Not requested, as unofficial copies of copyrighted works: dokumen.pub [6] (Megaloudi 2006) and Scribd [16] (Halstead and Jones 1989).
- **Wrong or missing details in Section 7.**
  - §3 conflates three works: Cherubini et al. 2014 (*Antiquity* 88), Cherubini and Lev-Yadun 2014 (a reply in the same issue, the DORA file), and Cherubini et al. 2013 (*PLoS ONE* 8: e54730, whose title the report borrows).
  - §8 is Day, J. 2011, "Crocuses in Context", *Hesperia* 80: 337–379.
  - §10 is Livarda and Kotzamani 2013, BSA 108: 1–29.
  - §12 is Melamed, Plitmann, Shmida and Golan 2009.
  - §14 is Nugent, M., "Seasonal Flux—Three Flowers for Three Seasons: Seasonal Ritual at Akrotiri, Thera". It is a secondary paper; its botany cites Huxley and Taylor 1977, Diapoulis and Porter 2000.
  - §16 is Kutschera, W. 2020, *PNAS* 117: 8677–8679, a commentary.
  - §18 is Mavromati, A. 2021, *Quaternary International* 593: 71–84; the report omits the author.
  - §20 is Sarpaki 2001, BSA 96: 27–40, not "2013".
  - §21 is a chapter in *Country in the City* (Archaeopress 2019), pp. 72–87.
  - §22 is Sarpaki 2021, *Documenta Praehistorica* 48: 432–445.
  - §23 is Riley 2004, *Akroterion* 49 (T3).
  - The ResearchGate "2015-01 (Asouti 2003 reprint)" is an upload, not a reprint.
- **Rights.**
  - Pearson et al. 2023 states CC BY 4.0. No other licence was checked in this run (T3d found PMC12956113 CC BY).
  - Morgan 1988 on the Internet Archive, the Scribd upload and dokumen.pub are unofficial copies. Cite the published works and keep the files out of the repository (standard §5; D6).
  - The thesis PDFs are distributed by White Rose eTheses; their reuse terms were not read.
- **Images in the report.** The file holds no image data and no image placeholders.

## Corrections to apply before building

1. **Remains wrongly called unverified (claims 19, 21, 34; Summary 4, 5, 10).**
   - Pine, pear or hawthorn, einkorn, two-row barley, lentil, pea, chickpea, almond and the scrub taxa are A (T3 #4, #6, #7; Bottema; thesis abstract).
   - Grape is A as fruit; vine wood is reported by Doumas.
   - Pomegranate wood is attested, but before the window (C).
2. **Fig (claim 11).** Fig wood is A as building timber in Xeste 3 and the House of the Ladies (Mavromati 2021). This replaces T3d Corrections 2's "no fig wood". The emergency-repair reading is B.
3. **Oak (claims 3, 4; Summary 1; intro).**
   - Drop *Quercus macrolepis*.
   - Deciduous and evergreen oak are both A as wood; the species are unknown.
   - "Open oak woodland" and the "moist, cool climate" are B, as readings.
4. **Reed (claims 21, 25, 26; Summary 7; Game hooks).**
   - The attested reed is the giant reed *Arundo donax*, from impressions in buildings (Sarpaki 1987).
   - *Phragmites* is a modern model (C) with no Theran remains.
   - Use *Arundo* if a reed is built, and grade its growing on Thera B.
5. **Lily colour (claim 23).** The cited source says *L. candidum* is pure white. Strike "white petal colour unverified".
6. **Sea daffodil (claim 26).** It grows wild on Greek island shores, by the cited source and Englera (T3d #54).
7. **Exclusions (claims 29, 32; T3c-5).**
   - Tomato is excluded by [20]; eucalyptus by Bottema, as a recent tree on Santorini.
   - *Pistacia vera*'s arrival date and tobacco and bougainvillea still need a source.
   - Prickly pear, agave, maize and citrus stand as written.
8. **Grades.**
   - "Half a century" A → B (claim 2).
   - "Cattle-grazed maquis" A → B (claim 5).
   - EBA olive A → C (claim 7, both rows; T3 #11).
   - 20 ha A → C (claim 12; A-L1).
   - *L. clymenum* pure lots B → A (claim 14).
   - Crocus botany B → C (claim 22).
   - The timber imports are A as timber, not as trees (claim 18).
9. **Olive (claim 8; Section 3).**
   - Record both site heights: 172 m (Friedrich 2014) and 150 m (Friedrich 2013).
   - Add the second tree's 183 cm stem (Friedrich 2013).
   - Add that the branch moulds lay 1–3 m above the pumice base (Friedrich 2006). INFERENCE: one tree's crown reached at least 3 m.
   - The 2–3 mm bark belongs to one stem.
10. **Dates (claims 2, 11; Summary 8, 11).** Replace 1615 and "c. 1665" with the world clock: the world opens in 1628 BCE; rebuild c. 1650; living town from c. 1645; eruption 1613–1602 BC at 68.3%.
11. **Ash depth (Section 3).** "Up to 6 m" has no claim row and rests on a secondary paper. Cite a primary measurement before use.
12. **Sources list.** Fix §3, §8, §10, §12, §14, §16, §18, §20–§23 as in the Sources check. Debates: [31] is Kutschera, not Manning; the Morgan marker is [38], not [13].
13. **Section 4 IDs.** Renumber the report's T3c-4 and T3c-5 to T3c-5 and T3c-6, and add T3c-4 as "not addressed".

## Gaps

**The yearly cycle is missing for every plant.** The report answered late May only. Each plant below still needs its month-by-month states and their colours. A modern Aegean flora or phenology source (grade C) is the expected source, run as a new lane against the current prompt.

- **Usable now from sources opened in this check (all C unless marked):**
  - **Crop calendar.** Sarpaki 1987, Table 1.24, from informants at Akrotiri village, 1982–83:
    - Vines are ploughed three times (January or November, February to March, April to May) and picked in September.
    - *L. clymenum* is sown from October to January (or in March) and harvested in May to June. It is grown among vines, and its shoot tips are picked about 15 March as greens.
    - Barley is manured in late August, sown in October and harvested in June.
    - Pea and *L. cicera* are harvested in April. A vetch (?*Vicia articulata*) is sown in November and ploughed in green in February.
    - Barley was uprooted until about the 1960s and is now cut near the ear, with the stubble grazed by sheep and goats.
  - **Climate.** Santorini monthly rainfall (Table 1.12, above). Mean monthly temperature at the 229 m station, January to December, in °C: 10.4, 10.8, 12.2, 14.6, 18.4, 22.1, 24.6, 24.7, 22.3, 19.2, 15.0, 12.3 (Table 1.2, after Biel 1944 and Alt 1938, for 1894–1915).
  - **Olive (A).** A buried tree's branch moulds lay 1–3 m above the pumice base (Friedrich 2006), and a second tree's stem was 183 cm long (Friedrich 2013).
  - **Painted palms (B).** Morgan 1988 counts 19 palms in the West House river frieze: 10 with pinnate leaves and a segmented trunk, 2 with smooth leaves and a trunk, 7 with smooth leaves and no trunk.
- **Gaps, plant by plant** (what the builder needs that no checked source gives):
  - **Olive:** height and spread of a grown tree; leaf size and both leaf colours; month of flowering (the T3c-2 test); fruit size and colour by month; harvest month; wild versus cultivated form.
  - **Fig:** form, leaf size and lobing; months of leafing and leaf fall; the two fruit crops. T3d notes Morgan's June–July and autumn crops; they were not checked here.
  - **Vine:** how vines were grown (on the ground or trained); budburst, flowering and leaf fall; leaf colour in autumn.
  - **Oak:** which deciduous oak, and which evergreen one (kermes oak grows on the island today); form, height and leaf of each.
  - **Pine, juniper, tamarisk, pear, *Pistacia*, almond:** form, height, leaf, and flowering month.
  - **Barley, einkorn, wheat:** straw height and ear form of ancient landraces (T3c-3); colour by month; which wheat was free-threshing.
  - **Pulses, flax, coriander, garlic:** plant height, flower colour (no source opened gives one), and the field's look by month.
  - **Scrub** (thyme, savory, lavender, thorny burnet, *Thymelaea*, asphodel, *Juncus*): species most likely on Santorini; cushion size; flower colour and month; summer leaf drop. Thyme's flowering month is needed for T3c-6.
  - **Grasses and annual herbs:** greening after the first rains and drying in spring (T3c-4, T3c-6); no source.
  - **Painted plants:** the leaf cycle of crocus and sea daffodil (whether leaves show in late May); real sea daffodil flower colour; red lily season (*L. chalcedonicum*: Nugent says late spring, T3 #30 June–July, Englera July); myrtle, ivy, papyrus, sedge and palm forms. Nothing on these was opened.
  - **Giant reed:** height, leaf and plume for *Arundo donax*, now the attested reed.
  - **Exclusions:** arrival dates for tobacco, bougainvillea, *Pistacia vera*, eucalyptus and maize in Greece; carob's date in the Aegean.
- **Not opened:** Sarpaki 2019 (town and farmsteads, Balos), Livarda and Kotzamani 2013 (body), Melamed et al. 2009, Halstead and Jones 1989, Raus et al. 2019 (Santorini's modern flora), Megaloudi 2006, Grove and Rackham 2001, the USGS reed sheet, and the CIHEAM pistachio paper.
- **Phase.** As in T3d, no opened source separates final-phase LC I charcoal from earlier phases, except Mavromati's construction timbers, which belong to the standing buildings.
