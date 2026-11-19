Verification of lane T2b (docs/research/claude/T2b_Claude.md), by a separate Claude verification agent on 2026-11-18 (D13).

Method: I re-opened every source I could during this run. Commons file pages and their histories were read through the Commons API (wikitext, upload and deletion logs, SHA-1). Licence texts were read from creativecommons.org and opendatacommons.org. PDFs were downloaded into a scratch folder outside the repository and read with `pdftotext`. Their figures were extracted with `pdfimages` or rendered with `pdftoppm` and inspected. OpenStreetMap was queried through its public API (api.openstreetmap.org, version 0.6). HTML pages were read with WebFetch or as text. The Greek law was read in the Government Gazette PDF.

I re-did the report's measurements independently with Python (Pillow and NumPy) on the local plan `akrotiri-frescoes-sources/map-of-bronze-age-akrotiri-754.png`:
- walls are the yellow (245, 211, 103) pixels and painted rooms the grey (211, 211, 211) pixels, with the legend block masked out;
- areas and extents are pixel counts and bounding boxes;
- room axes come from a principal-component fit;
- the overlap between plans is pixel coincidence after scaling, with a tolerance band.

Grades are judged against `docs/HISTORICAL_STANDARD.md` §3 and the window rule in §1. Quotations are under 15 words. The licence and law sections are **research, not legal advice**.

## 1. Verdict summary

- **Claims checked: 86 of 89 rows** against their sources. That covers every row with a number, every licence, rights and authorship row, every grade-A row, every INFERENCE row and every surprising row. Three rows could not be checked:
  - #22 and #23: Springer served a bot challenge, so Markellou 2023 could not be opened (I checked the law's own text instead, §4).
  - #35: the street widths were not re-measured.
- **Confirmed 79. Partly 7** (#6, #20, #26, #31, #32, #61, #71). **Not supported 0. Could not check 3** (#22, #23, #35).
- **No fabrication found.** All the sources I could open exist, are the works cited, and say what the report says. The report's identification of the plan is exactly right: its SHA-1 matches, and so do its author, licence and date. Its own measurements are honest and mostly reproduce. Three numbers do not:
  - the shelter's "175 × 122 m along its own axes" is wrong (158 × 119 m);
  - the Xeste 3 hull area does not reproduce (about 133,000 px², not 157,900);
  - the indicative-coastline distances to the west and east start lower than the report says.
- **Counts as printed:** 89 claim rows. Rows #22 and #23 rest on a source I could not open. The law's own text reads more narrowly than the report's summary of it (§4).
- **Usable for the build? Yes, for the excavated part's layout, with the corrections in §3 and the terms in §6.**
  - The Commons plan is a usable source of building shapes, at about ±1 m per building and about ±5 m across the site.
  - Its scale, orientation and position can be fixed independently, and I have tightened them (§6, answer 2).
  - The chain of rights behind the plan has a real gap (§4). The cautious course is set out in §6.
  - Everything beyond the excavation stays grade C, except two outlying sites that are grade B.

## 2. Table

Opens: does the cited source open this run. Supports: Confirmed / Partly / Not supported / Could not check. Number: is it exactly the source's (or, for INFERENCE rows, does it reproduce). Grade: is it right under the standard.

Short names: Commons-en / -de = the two Commons file pages; CC = the CC BY-SA 2.5 legal code; TF = the archived Thera Foundation page and its map image; OSM = the OpenStreetMap API; Doumas = Doumas 2016 (Latsis PDF; page numbers are the printed ones); P86 = Palyvou 1986 landing page; T15 / T17 = Trinks et al. 2015 / 2017; Birtacha = Birtacha 2008; Sarpaki = Sarpaki 1987; Fint = Fintikakis 2014; Eph = Ephorate page; KV = Kokkino Vouno project pages.

| # | Claim (short) | Opens | Supports | Number | Grade | Fix |
|---|---|---|---|---|---|---|
| 1 | Local file byte-identical to Commons "Map Akrotiri 1600 BC-en.png" | yes | Confirmed: API SHA-1 and local `shasum` are both cd0dbc4a…5eff | 2,075 × 3,345 exact | data ok | — |
| 2 | Author Dörrbecker; date 2007-05-20; current file uploaded 2007-09-02 on rename; one revision | yes | Confirmed (Commons-en) | exact | licence ok | Add: the current file was uploaded by the renamer (Bibi Saint-Pol). The original, "Akrotiri (English Version).png", was uploaded by the author himself (user Chumwa) on 2007-05-20 with a self-licence, then deleted as a duplicate on 2007-09-05 (upload and deletion logs). |
| 3 | Self-published under CC BY-SA 2.5 Generic, no "or later" of its own | yes | Confirmed: {{self\|cc-by-sa-2.5}}; the page reads "I, the copyright holder of this work, hereby publish it" | — | licence ok | — |
| 4 | Source field: digitised from two maps supplied by h-stt plus five websites | yes | Confirmed: the sites are therafoundation.org, jfbradu.free.fr, santorini-culture.gr, ou.edu (two pages) and appearfr.english-heritage.org.uk | — | licence ok | — |
| 5 | No scale bar, north arrow or SVG; English legend has five entries | yes | Confirmed (page, image and the Other-versions template, which lists only PNGs) | — | data ok | — |
| 6 | German version adds room numbers, a polythyron symbol and labels; ca and fr versions exist; INFERENCE: walls overlap about 70%, so not the same drawing | yes | **Partly.** Labels and versions are confirmed. The 70% exact overlap reproduces (69.6%), but 90% of wall pixels lie within 3 px (about 0.14 m) of each other, and room numbers and polythyron symbols overlie walls. | 70% reproduces | data ok | Say: the same drawing, locally edited. |
| 7 | CC BY-SA 2.5 §4(c) credit requirements | yes | Confirmed (CC) | — | licence ok | — |
| 8 | §4(b): an adaptation goes under the same licence, a later version with the same elements, or an iCommons port | yes | Confirmed (CC). CC's compatibility page agrees: the original or a later BY-SA. | — | licence ok | — |
| 9 | A Collective Work containing the adaptation need not itself be under the licence | yes | Confirmed as text (CC §4(b), last sentence) | — | licence ok | Under 2.5, a "Collective Work" means separate works assembled. Whether a generated world is that or a Derivative Work is a doubt (§4). |
| 10 | TF page (by akuehne, modified 2005-10-20, archived 2007-02-08), 723 × 1077 map, labels; no scale, north or terms; INFERENCE: Dörrbecker follows it line for line | yes | Confirmed, and stronger than stated. The TF and Dörrbecker wall boxes have identical proportions (×3.373 on both axes). After that uniform scale and a shift, 88% of Dörrbecker's wall pixels fall on TF walls, and 93% fall within 5 px (about 0.2 m). | all exact | licence ok | The archived footer links a "disclaimer" page, which is empty in the archive. The live therafoundation.org is now an unrelated travel site. |
| 11 | Category holds seven files; none a vector of the site | yes | Confirmed (API) | 7 exact | data ok | — |
| 12 | "PrehistoricAkrotiriMap.jpg" 800 × 1329, PD-author, Klearchoskapoutsis 2007; geometry looks like the excavators' plan | yes | Confirmed: transferred to Commons 2010 from el.wikipedia (first uploaded there 2007-07-06). The image's labels and room numbers match the excavators' plans. | exact | licence ok | — |
| 13 | West House crop: "Genordete Lage" is a user's description | yes | Confirmed (Oltau, 2015, from the de version) | — | data ok | — |
| 14 | Photo of the bilingual site plan, CC BY-SA 4.0 (2019); plan rights unstated | yes | Confirmed: photo dated 2019-06-18, uploaded 2020; labels as listed | — | licence ok | The photo shows the site's plan with the north–south axis running across the picture. |
| 15 | OSM way 299988161: building=roof, historic=archaeological_site, v17, 2026-01-28, source "unknown;Mapbox"; inside, only modern features | yes | Confirmed: 35 nodes plus the closing reference. Inside are wooden and dirt indoor footways, steps, two indoor walls, doors and rope barriers. No ancient feature is mapped. | exact | data ok | — |
| 16 | ODbL; credit OSM; share-alike for altered data | yes | Confirmed (copyright page) | — | licence ok | ODbL 1.0 §6.2 leaves extraction of **insubstantial** parts free (§4). |
| 17 | Doumas p. 23 topographical plan: north arrow up, stepped shelter, pillars, walls by period | yes | Confirmed (rendered) | — | A for walls; plan © | The caption says it shows growth "indicatively". The plan is a 72-ppi raster. |
| 18 | p. 21 plan: unreadable small bar at lower right; p. 34 Xeste 3 plan: north arrow, no bar | yes | Confirmed (rendered) | — | data ok | — |
| 19 | Birtacha Fig. 35.1: excavators' plan with pillar grid Δ1–Δ14, numbered shafts, north symbol, Greek legend | yes | Confirmed (extracted figure) | — | data ok | The report did not use this figure for orientation. Its grid gives the best independent check (§3, correction 4). |
| 20 | T17 is CC BY 3.0; Fig. 6 shows the whole site with a 0–50 m bar; "slightly oblique"; only open scaled image | yes | **Partly.** The licence is confirmed on the landing page; the PDF prints none. Fig. 6 is **clearly oblique**: the side faces of the scan block show, and the site is turned about 90° with its long axis left to right. It has no north arrow. Walls cannot be reliably traced (§5). | bar exists | licence ok | Call it oblique, not usable for tracing. |
| 21 | T17 3D model of the West House and Triangle Square; Figs 10–12 suggestions and artist's impression | yes | Confirmed | — | C ok | — |
| 22 | Law 4858/2021 art. 46 §§4–5: permission and fee for depictions; artistic, educational and scientific uses pay too | no (Springer bot challenge) | **Could not check** in Markellou. The law's text (Gazette A' 220, 19 Nov 2021) is narrower (§4). | — | licence | Rewrite from the law text (§3, correction 8). |
| 23 | Markellou: §4A brings laser-scan and photogrammetric 3D models in; Parthenon drawing case; later decision covering sketches | no | **Could not check.** §4A ββ in the law does name laser scanning and photogrammetry for 3D models. The Parthenon case and the later decision are unverified. | — | licence | Keep [verify]. |
| 24 | Excavation of the Archaeological Society at Athens; Marinatos 1967; Doumas since 1974 (Sarpaki: resumed 1976); shelter opened April 2012 | yes | Confirmed (Fint; Sarpaki for 1976) | exact | B ok | — |
| 25 | Ephorate: 36.3517952 N, 25.403447 E; "some 3 acres"; Telchines Street through the centre | yes | Confirmed (Eph directions link and text) | exact | B ok | — |
| 26 | OSM roof: about 12,220 m², 167 × 121 m, about 175 × 122 m along own axes, widest about 110 m at south, 45 m at north; centroid; edges about 5° anticlockwise | yes | **Partly.** Area 12,220 m², extent 167.3 × 120.5 m, edges at bearings 84.9° and 174.9° (5.1° anticlockwise), widths about 113 m at south and 45 m at north: all reproduce. **"175 × 122 m along its own axes" is wrong.** Rotated to its own axes the box is **158.4 × 118.5 m**. The "centroid" given is the mean of the vertices (36.35178, 25.40346). The area centroid is 36.35170 N, 25.40345 E, about 8 m further south. | see Supports | data ok | Fix both numbers. |
| 27 | Nearest OSM coastline about 198 m from the roof's SW corner, about 220 m from its SE corner | yes | Confirmed: 197.6 m and 219.8 m, measured to the coastline's segments as well as its nodes | exact | data ok | The segment distance equals the node distance, so "upper bound" is unnecessary. |
| 28 | Doumas p. 23 shelter about 1,000 × 1,482 px at 150 dpi; 8.4–8.8 px/m; walls about 86–88 × 136–143 m | yes | Confirmed approximately (I get about 1,004 × 1,510 px) | close | C ok | — |
| 29 | T15 citing Doumas 1983: 3 complete, about 7 partly excavated, in some 90 × 120 m | yes | Confirmed (T15 p. 518) | exact | "A" should read data | It is an old (1983) modern measurement, smaller than today's dig. |
| 30 | Plan walls span x 134–1925, y 48–3202; dashed limits about 3.76 Mpx², about 7,800 m²; not the new shelter | yes | Confirmed: identical box; 3,755,755 px² non-white inside the limits gives 7,760 m² at 22 px/m (6,740–9,020) | exact | C ok | — |
| 31 | Scale from West House Room 5 (89 × 81 px), Xeste 4 (about 710 px vs "over 30 m"), Xeste 3 hull (157,900 px² vs 283 m²); adopt 22 (20.4–23.6) | yes (Doumas p. 42 for Xeste 4) | **Partly.** Room 5 reproduces (about 90 × 84 px). Note that the drawing has the West House turned about 28°, and its pier-and-window walls are dotted lines, so ±0.3 m on a 4 m room means ±15%. Xeste 4: 709 px is the NW–SE diagonal of the complex; "over 30 m" (Doumas p. 42) gives only an upper bound. The **Xeste 3 hull does not reproduce:** walls and painted rooms give 133,000 px² (≤21.7 px/m), and the box is 497 × 321 px, not 514 × 337. | see Supports | C ok | Use the scale in §6, answer 2. |
| 32 | Bearing Xeste 3 to House of the Ladies 23° on Dörrbecker, 25° on Doumas p. 23; agree within about 2°; plan-up = true north ±5° | yes | **Partly.** Dörrbecker reproduces at 22.5° (centroids of the wall masses). On Birtacha Fig. 35.1, whose own plan-up I tied to true north (correction 4), the same line bears 20.2°. Agreement is therefore 2–3°, and the true value is within about ±3°. | close | C ok | See correction 4. |
| 33 | Dörrbecker may be stretched N–S up to about 10% | yes | Confirmed independently against Birtacha's plan: about 20.0–20.7 px/m E–W against 21.6–22.4 px/m N–S. The stretch is inherited from the TF map (#10). | close | C ok | — |
| 34 | Walls drawn as uniform strokes about 11–13 px | yes | Confirmed by inspection | close | C ok | — |
| 35 | Telchines Street 1.2–2.2 m between drawn faces; 4.8–5.9 m strip; Triangle Square 8–12 m | yes | **Could not check** (not re-measured) | — | C | Low confidence; it is a tracing of a simplification. |
| 36 | PS 65N same row as 1B, at the east end; floor 18.10–18.20, wall top 21.15, hearths 19.24 m asl; protruded about 1 m above road; 1B near west boundary | yes | Confirmed (Birtacha) | exact | A ok | Summary's "at the east edge" means the row's east end (row Δ6, beside Xeste 2 on Fig. 35.1). |
| 37 | Shafts traced growth on the ridge; Delta West on the crest; Delta North entrance on the crest | yes | Confirmed (Doumas pp. 25, 62, 66) | — | A ok | — |
| 38 | Xeste 4: "sheer eastward slope"; Curetes Street steep, cul-de-sac; two unexcavated buildings to its south | yes | Confirmed (Doumas p. 42) | — | A/B ok | — |
| 39 | Torrent through terraced vineyards; first trenches on the lowest terrace | yes | Confirmed (Doumas p. 18) | — | A ok | — |
| 40 | Marinatos's eight buildings; none complete by 1974 | yes | Confirmed (Doumas p. 19) | 8 exact | A ok | — |
| 41 | P86 n. 38: 1984–85 seasons revealed a large public square before Xeste 2's dentated north façade | yes | Confirmed | — | A ok | — |
| 42 | Ephorate: Xeste 2 three storeys, worked stones protruding on the north side; East Building of Sector D north of Xeste 2, on the Double Horns square | yes | Confirmed | — | B ok | — |
| 43 | Doumas caption: Xeste 2's "prominent string courses" | yes | Confirmed (p. 33) | — | A ok | — |
| 44 | House of the Anchor "still unexplored"; part of its façade with tuff door and window frames | yes | Confirmed (pp. 31, 80) | — | A ok | — |
| 45 | "Pylon" a later porch at Delta West's entrance, with a room above; Dörrbecker draws it as a grey free-standing box | yes | Confirmed (Doumas p. 66). The TF map already has that grey box (#10), and the Greek plan puts ΠΥΛΩΝ against Delta's west side. | — | A ok | — |
| 46 | Cenotaph a small cairn with EC figurines and vessels laid out like a grave; gathered after the EC cemetery was abolished; cairn's phase unknown | yes | Confirmed (Doumas pp. 100, 103) | — | A / phase unknown ok | — |
| 47 | Double Horns square terraced from quake debris; entrance on its first terrace; Terraces 1–2 = this square (INFERENCE) | yes | Confirmed (Doumas p. 54); the inference fits the site plan photo (#14) | — | B ok | Terrace 3 is still unknown. See Gaps on a Greek label near it. |
| 48 | Terrace with the bed casts before Delta 15/16; = "Ανδηρο Κλινών" | yes | Confirmed (Doumas p. 85; ΑΝΔΗΡΟ ΚΛΙΝΩΝ is on the Greek plan beside Δ15) | — | A ok | — |
| 49 | Pithoi Storeroom at the "northernmost point" of the roofed site; cross walls kept the torrent off its floor | yes | Confirmed (p. 80) | — | A ok | — |
| 50 | "Tunnels", "Porter's Lodge", "South Building", "Xeste 5" undescribed; INFERENCE: Tunnels modern, Porter's Lodge = Building Eta | yes | Confirmed (no source opened describes them). The Greek plan does put ΚΤΙΡΙΟ Η΄ where Dörrbecker writes "Porter's Lodge". | — | C ok | See §5 on "South Building". |
| 51 | Only Delta 1a, 9, 9.1 explored in Delta West; Xeste 4 "hardly been explored", outline uncovered | yes | Confirmed (pp. 42, 66) | — | A ok | — |
| 52 | House of the Ladies faces unexcavated buildings; only excavated building of a complex of at least two | yes | Confirmed (pp. 48–49) | — | A ok | — |
| 53 | Torrent damaged all buildings on both sides of Dactyls Street; Beta's east wing destroyed; Delta East cut in two; only Delta North's lower rooms survive | yes | Confirmed (pp. 49, 54, 60, 62, 72) | — | A ok | The Summary's "destroying … the east side of Dactyls Street" should read "damaging both sides". |
| 54 | INFERENCE: the green visitor path is the old shelter's route; modern | yes | Confirmed as reasoning (map 2007; shelter opened 2012) | — | C ok | — |
| 55 | "Over 100" shafts (Fint) against 91 (Doumas); geologists reconstructed the relief; first settlement at the tip of a low promontory | yes | Confirmed (Fint p. 142) | exact | B ok | Fint dates that first settlement to the mid-5th millennium BC. |
| 56 | Indented shoreline, coves between headlands; first settlers chose a promontory's tip | yes | Confirmed (p. 21) | — | B ok | — |
| 57 | Largest flat land; sheltered from north winds | yes | Confirmed (p. 22) | — | B ok | — |
| 58 | Xeste 3 "at the southwest end", Xeste 4 "the southeast edge"; both a short distance from the coast | yes | Confirmed (pp. 34, 42) | — | B ok | — |
| 59 | Excavated area a small sector that "seems to coincide with its centre" | yes | Confirmed (p. 132, citing Part I) | — | C ok | — |
| 60 | p. 22 map after Palyvou: present and "indicative prehistoric" coastlines; place names | yes | Confirmed (rendered) | — | C ok | — |
| 61 | INFERENCE from p. 22: shore 35–55 m S, 15–40 m W, 30–50 m E; tongue 130–200 m wide; today's shore 125–145 m S | yes | **Partly.** My closest distances are about 36–43 m S, **12–15 m W**, **25–29 m E**, a tongue about 120–145 m wide at the site, and today's shore about 133–156 m (scale 1.07–1.26 m/px, site drawn 131 px tall). | lower W and E | C ok | Widen to W 10–40 m, E 25–50 m. |
| 62 | MC northern limit near Cenotaph Square; rebuilt "with minor changes in the basic urban tissue" | yes | Confirmed (pp. 27, 30) | — | B ok | — |
| 63 | Neolithic sherds between Xeste 3 and the south-gate ticket booths | yes | Confirmed (p. 22) | — | C ok (outside window) | — |
| 64 | Not known where the EC cemetery was moved; no LC I cemetery reported | yes | Confirmed (p. 25) | — | B ok | — |
| 65 | No exploration north of the shelter reported | yes | Confirmed as an absence in Doumas | — | C ok | — |
| 66 | P86 n. 10: Doumas's tentative 200,000 m²; limits sea S, Mesovouna W, Potamos E, north "half-way to the caldera"; "strikingly large" | yes | Confirmed | exact | C ok | — |
| 67 | Sarpaki quoting Doumas 1983:45: concave plateau, subsidence over collapsed houses | yes | Confirmed (Sarpaki pp. 105–106) | — | C ok | — |
| 68 | Zahn 1899 at Kamaras, about 600 m away, "probably part of the town" | yes | Confirmed | 600 m exact | B/C ok | — |
| 69 | T17: Zahn's site "some 500 m to the north-east", relocated to 1–2 m, 22 photos; now a potato field | yes | Confirmed (T17 pp. 635–636; Fig. 13) | exact | B ok | T17 also says Zahn's finds lay under thick Minoan pumice, so they are pre-eruption. |
| 70 | "No tangible evidence" where the city stopped; Balos and Mavromati Quarry possible suburbs, unconfirmed; no wall mentioned | yes | Confirmed (Sarpaki p. 106) | — | C ok | P86 mentions no wall either. Its only fortification references (n. 37) are to other sites. |
| 71 | Balos: three rooms, straw, barley, lentils, peas ("arakas"), aniseed, coriander; a stable; Mamet 1867 possibly at Favatas | yes | **Partly.** All are in Sarpaki except "peas": Sarpaki identifies arakas as *Lathyrus clymenum*. "Stable" is Fouqué's guess as Sarpaki reports it (p. 115). | — | B ok | Write "arakas (*Lathyrus clymenum*)". |
| 72 | About 12,000 m² uncovered, "not thoroughly excavated" (1987) | yes | Confirmed | exact | "A" should read data | — |
| 73 | 290–580 people per excavated 10,000 m² (about 16 m²/person); 5,890–11,700 for 20 ha; 2,000–18,000 across models; 172–274 ha "extremely unlikely" | yes | Confirmed (Sarpaki pp. 113–115) | exact | C ok | — |
| 74 | No animal spaces; stables on the periphery (Balos) | yes | Confirmed (p. 115) | — | C ok | — |
| 75 | 2014 GPR and ERT on Kokkino Vouno: two buildings (anomalies of three); circular structure about 12 m, date uncertain | yes | Confirmed (T15 p. 520) | 12 m exact | B ok | — |
| 76 | Magnetometry 1967 failed; GPR 1996 2–3 m; Russell and Stasiuk reflectors to 22 m; ERT resistive layer at 6 m | yes | Confirmed (T15 pp. 518–519) | exact | B ok | The 22 m reflectors are volcanic layers, not walls. |
| 77 | Prehistoric graves exposed in the Potamos valley; ERT near "a known grave"; spoil dumped in Potamos; pumice removed for a car park | yes | Confirmed (T17 p. 633) | — | B/A ok | — |
| 78 | Vlachopoulos: two bays, possibly two harbours, eastern maybe at Potamos; fill read as eruption deposit | yes | Confirmed (KV page; the fill reading is conditional, "εφόσον") | — | C ok | The article's title calls Kokkino Vouno a settlement **around** the town (πέριξ του άστεως). |
| 79 | Trench 15 Sep 1968, "extensive, dense" poorly preserved walls; surface finds 1999, 2003, 2010–13; quarry scars | yes | Confirmed (KV) | exact | B ok | — |
| 80 | 2025: quarry cuts, wedge and toothing marks, undated phases; enclosure walls of fields worked until the 1970s, partly reused stone | yes | Confirmed (KV 2025) | — | B/A ok | — |
| 81 | INFERENCE from p. 22: Kokkino Vouno 0.55–0.7 km WSW, Mesovouna 0.35–0.4 km NW, Potamos 0.25–0.3 km E | yes | Confirmed (I get about 0.59–0.69, 0.35–0.41 and 0.27–0.32 km to the labels) | reproduces | C ok | These are distances to labels, not to features. |
| 82 | Surroundings laser-scanned over about 1,500 × 800 m; 29 positions georeferenced | yes | Confirmed: 114 outdoor positions, 29 of them georeferenced | exact | data ok | Add the 114. |
| 83 | Up to 60 m of pumice, tephra and bombs near Akrotiri | yes | Confirmed (T17 p. 633) | 60 exact | B ok | — |
| 84 | Ruins "several metres below" today's ground; walkways around the perimeter | yes | Confirmed (Fint) | — | A ok | — |
| 85 | Makeshift camp "on the outskirts of the city"; no place given | yes | Confirmed (Eph) | — | B ok | — |
| 86 | Townsend painting: two- and three-storey houses, jagged streets; no basis | yes | Confirmed (credit "Lloyd Townsend/National Geographic"; site © notice) | — | C ok | — |
| 87 | Museum shows the general plan and a model of the uncovered part only | yes | Confirmed (Doumas p. 132) | — | C ok | — |
| 88 | LBI ArchPro and Duke Dig@Lab aim at a photorealistic copy of the excavated site; no licence | yes | Confirmed | — | C ok | No data-access statement on the page either. |
| 89 | Aegeus listing (2014): LBI ArchPro tour, 7reasons reconstructions, hosted by NG Germany; no terms | yes | Confirmed (dated 3 Sep 2014) | — | C ok | "Hosted by" is inferred from a nationalgeographic.de link. |

### Sources (Section 7)

| Source | Opens | Is it the work cited? |
|---|---|---|
| 1 Commons, Map Akrotiri 1600 BC-en.png | yes (page, API, logs) | yes |
| 2 Commons, …-de.png | yes (file downloaded) | yes; SHA-1 7bcae3f8… |
| 3 Commons category and Other-versions template | yes | yes |
| 4 Commons, PrehistoricAkrotiriMap.jpg | yes | yes |
| 5 Commons, West House crop | yes | yes |
| 6 Commons, Plánek … detail.jpg | yes | yes |
| 7 CC BY-SA 2.5 legal code (and deed) | yes | yes |
| 8 Thera Foundation map page, Wayback 2007-02-08, and image | yes | yes; disclaimer page empty in the archive |
| 9 OSM way 299988161 (API) | yes | yes |
| 10 OSM copyright page | yes | yes |
| 11 Doumas 2016, Latsis PDF | yes (331 pp.) | yes |
| 12 Palyvou 1986, *BSA* 81, landing page | yes (notes) | yes |
| 13 Trinks et al. 2015, *Archaeologia Polona* 53 | yes (4 pp.) | yes; it has no licence line and only two figures, both of Kokkino Vouno |
| 14 Trinks et al. 2017, ISPRS Archives XLII-2/W3 | yes (PDF 52 MB; landing page) | yes; CC BY 3.0 on the landing page only |
| 15 Birtacha 2008, Aegeus copy | yes (28 pp.) | yes |
| 16 Sarpaki 1987, White Rose PDF | yes (334 pp., OCR) | yes |
| 17 Ephorate page | yes | yes; it links a Terms of Use page (not opened by the report or by me) |
| 18 Kokkino Vouno project page | yes | yes; Vlachopoulos, *ΑΛΣ* 8, 154–170 |
| 19 Kokkino Vouno 2025 report | yes | yes |
| 20 Fintikakis 2014, *Project Baikal* 42 | yes (6 pp., Russian and English) | yes; it credits the text to Fintikakis and Doumas |
| 21 Markellou 2023, *IJSL* 36 | **no**: the Springer PDF and the article page served a bot challenge, so I did not work around it | Crossref confirms the title, author, vol. 36, pp. 1945–1969 and a **CC BY 4.0** licence (not "© the author") |
| 22 Duke Dig@Lab page | yes | yes |
| 23 Aegeus Society listing | yes | yes |
| 24 Biblical Archaeology Society image page | yes | yes |

Also opened by this check, not cited by the report: Law 4858/2021, Government Gazette A' 220, 19 Nov 2021 (https://diadikasies.gov.gr/assets/Ν.4858.pdf); ODbL 1.0 (https://opendatacommons.org/licenses/odbl/1-0/); CC compatible-licences page; Crossref record for Markellou 2023.

## 3. Corrections

Apply these before any number enters the data.

1. **Shelter along its own axes (#26, Summary, Numbers):** 158.4 × 118.5 m, not 175 × 122. Give the position as the area centroid, **36.35170 N, 25.40345 E**. The vertex mean (the report's figure) is 36.35178, 25.40346, and the Ephorate point is 36.3517952, 25.403447. All three lie within about 10 m of each other.
2. **Xeste 3 hull (#31):** about 133,000 px² of walls and painted rooms, not 157,900; box 497 × 321 px. If the hull equalled the 283 m² plot, the scale would be at most 21.7 px/m, not 23.6.
3. **Scale (Summary 2, #31–#33, Numbers):** the plan is not isotropic. Use **about 20.4 px/m east–west and about 22.0 px/m north–south** on the 2,075-px file. If one number is needed, use **21.5 px/m ±5%** (20.4–22.6), not 22 (20.4–23.6). Room 5 alone fixes the scale only to ±15%, because its pier-and-window walls are drawn as dotted lines. The best single baseline is Xeste 3 to the House of the Ladies: 2,123 px on Dörrbecker against about 99–103 m on the excavators' plan, which gives 20.7–21.4 px/m.
4. **North (Summary 2, #26, #32):** the pillar rows Δ1–Δ14 on Birtacha's Fig. 35.1 (the excavators' plan) run 5.7° anticlockwise of the plan's horizontal (±0.3°, by projection). The OSM shelter's long edges lie 5.1° anticlockwise of true east. So **the excavators' plan-up is true north to within about 1°**. Dörrbecker's plan then agrees with it to within 2–3° on the Xeste 3 to House of the Ladies line. Use **plan-up = true north, ±3°**, not ±5°.
5. **German and English versions (#6):** they are the same drawing, locally edited (90% of walls within 3 px), not two drawings.
6. **Thera Foundation (#10, Summary caveat 1, T2b-1, T2b-2):** Dörrbecker's walls are a uniform ×3.37 enlargement of the TF map (88% pixel coincidence, 93% within about 0.2 m). Say "traced from", not "follows". This also means the plan's north–south stretch (#33) is the TF map's.
7. **Fig. 6 of Trinks 2017 (#20, Summary "Other plans", Game hooks):** the figure is an oblique render, rotated, with no north arrow. It cannot be traced (§5). Remove "scaled laser-scan image of the whole excavated site" as an alternative source of geometry.
8. **Greek law (#22, #23, Summary caveat 2, Game hooks):** replace the Markellou summary with what the law's text says (§4). Keep [verify] on the Parthenon case and the later ministerial decision until Markellou is read. Correct the source line: Markellou 2023 is CC BY 4.0.
9. **Indicative coastline (#61, Numbers):** west 10–40 m, east 25–50 m, south 35–55 m; tongue about 120–200 m wide.
10. **Balos (#71):** "arakas" is *Lathyrus clymenum* (Sarpaki), not peas.
11. **Wording:** Summary "Inside the dig": the torrent **damaged** both sides of Dactyls Street. #29 and #72 are modern measurements of the dig; mark them "data", not A. #82: add "114 outdoor scan positions". #89: "linked to nationalgeographic.de", not "hosted by". #2/#3: the original upload was by the author himself.

## 4. Licences and the law (research, not legal advice)

**The Commons map, from its file page (opened this run).**
- File: "File:Map Akrotiri 1600 BC-en.png", 2,075 × 3,345 px, 541,796 bytes, PNG. It is byte-identical to the local file.
- Description: "Map of Akrotiri in the Bronze Age, ca. 1600 BC". The image's own title reads "Akrotiri in the Bronze Age, about 1600 B.C."
- Author: Maximilian Dörrbecker (Commons and Wikipedia user Chumwa).
- Date: 2007-05-20. He uploaded the original himself that day as "Akrotiri (English Version).png" with {{self|cc-by-sa-2.5}}. A renamed copy was re-uploaded on 2007-09-02 by another user, and the original was deleted as a duplicate.
- Licence: **Creative Commons Attribution-ShareAlike 2.5 Generic (CC BY-SA 2.5)**, https://creativecommons.org/licenses/by-sa/2.5/. There is no "or later" clause on the page.
- Sources he lists: two maps supplied by user h-stt, and five websites: therafoundation.org/akrotiri/map, jfbradu.free.fr, santorini-culture.gr/map.htm, two ou.edu teaching pages, and an English Heritage APPEAR photo.
- **No SVG, no scale bar, no north arrow** in any of the four language versions (ca, de, en, fr).

**What CC BY-SA 2.5 asks of someone who redraws and adapts it** (legal code §4(b)–(c), §8):
- Credit the original author by name and give the work's title. Where reasonably practicable, give the URI that points to its licensing information.
- For a Derivative Work, add a credit saying how the work was used, for example "based on …".
- Keep intact all copyright notices and notices referring to the licence.
- Distribute the Derivative Work only under BY-SA 2.5, **a later version with the same elements (so BY-SA 4.0 is allowed)**, or an iCommons port. Include the licence or its URI.
- Add no further terms or technical restrictions.
- A Collective Work that *contains* the adaptation need not be under the licence, apart from the adaptation itself. CC's compatibility page lists no non-CC licence for 2.5. GPLv3 one-way compatibility exists only for BY-SA 4.0, so it would apply only after relicensing the adaptation to 4.0.

**The doubts, plainly.**
1. **Chain of title.** Dörrbecker's walls are a scaled tracing of the Thera Foundation's 2005 web map (#10, measured above). That map carries no terms. Its foundation's old site shows only an empty disclaimer page in the archive, and the domain now belongs to an unrelated travel site. The TF map in turn looks like a simplification of the excavators' general plan, which is copyright (T2#106). A CC licence can only license what its licensor holds. Whether the positions of excavated walls, redrawn as coordinates, take any protected expression from those drawings is a legal question this check cannot settle.
2. **Collective or derivative.** Under 2.5, a "Collective Work" assembles separate works unmodified. A world generated from the plan's geometry is more naturally an adaptation of that geometry. The safe reading: the geometry data file, and any rendered plan or overlay drawn directly from it, stay BY-SA. The engine code is a separate work beside it. Whether the whole built `index.html` must then be BY-SA is not settled by the text. Keeping the data in its own file, loaded by the build and shipped with its licence notice, is the cleanest separation available.

**Trinks et al. 2017 (the coordinator's question 1).**
- The landing page states twice: "This work is distributed under the Creative Commons Attribution 3.0 License", with "© Author(s) 2017".
- **The PDF prints no licence:** the text and the raw file contain no licence string. That resolves the T2 check's remark: both readings are right, and the landing page governs.
- I could not open the journal's own licence policy page (404 at the URL tried). A search summary, not opened, says the series moved to CC BY 4.0 in June 2017. That would not affect this February–March 2017 paper.
- No figure carries its own credit line or reserved-rights notice. Fig. 11's caption says the human figures were requested by National Geographic. Fig. 13 (top) is a 1899 photograph of Zahn's excavation with no credit line. Trinks 2015, which is not part of the licence question, credits its Fig. 1 to "LBI ArchPro, Klaus Löcker".
- Under CC BY 3.0, derived data needs attribution, a licence link and a note of changes, with no share-alike.
- On the data (question 4): the raw scan data were deposited with the site archaeologists and the Ephorate of the Cyclades and archived at the University of Vienna. The paper states no terms of access. The Duke Dig@Lab page states none either.

**OpenStreetMap.**
- ODbL 1.0: credit OpenStreetMap and make clear the data are under the ODbL.
- Altered or extended data may be shared only under the same licence.
- §6.2 leaves extraction of **insubstantial** parts free. Taking one centroid and one rotation from one polygon is very likely insubstantial, but say so in the credits anyway.
- A Produced Work (an image or world) needs a notice only when it is used publicly (§4.3).

**Greek Law 4858/2021, art. 46 (read in the Gazette text of 19 Nov 2021, not in Markellou).**
- §4 makes the minister set the terms, bodies and procedure for permission to produce, reproduce and disseminate depictions and copies of monuments, for a fee to ODAP (HOCRED).
- §4A says **prior permission is required** in two cases:
  - (a) for monuments under special access conditions;
  - (b) when made with complex equipment, **"μέσω σάρωσης με χρήση laser, με φωτογραμμετρικές μεθόδους"** (by laser scanning or photogrammetry) to make a 3D model, or under special production conditions.
- §4B: permission is required **in every case** for producing or reproducing depictions for public dissemination **"με σκοπό το κέρδος"** (for profit).
- §4Δ(b) defines a depiction as the **faithful rendering of the monument's existing image**, by any means, including digital applications. A rendering that starts from the existing image but **goes beyond it, for example by scientific interpretation or artistic creation, needs permission only in the §4A cases**.
- For monuments, §4Δ(a) means state-owned immovable monuments in archaeological sites.

What this means for the report's reading:
- The report's version ("permission and a fee" for any depiction, with scientific uses paying too) is broader than this text.
- On this text, a reconstruction of the living town in 1615 BCE is plausibly a creative or scientific rendering (§4Δ(b)). Redrawing a published plan is not laser scanning by the project.
- **A for-profit release that disseminates faithful depictions of the site as it is today** would need permission under §4B. That would include a rendered image or 3D model of the present ruins, or a traced point cloud.
- Laser-scan imagery such as Trinks's Fig. 6 is a faithful depiction of the existing state, and was itself produced by the method §4A names. Reusing it for profit falls under §4B just as the map would, and arguably more clearly.
- This text may since have been amended or implemented by ministerial decisions (Markellou reports one), and I could not check later versions. Lane T6 still owns the question.

**The excavation's own plans.** Nothing found in this run changes T2's finding. They are copyright. A request would go to the Akrotiri Excavations (Archaeological Society at Athens; Doumas director since 1974). Any for-profit depiction would also go to the Ministry of Culture through the Ephorate of the Cyclades.

## 5. Fig. 6 of Trinks et al. 2017 (the coordinator's questions 2 and 3)

- **What it is:** a 1,669 × 932 px raster, placed at 249 ppi on PDF page 3 (printed p. 633). It is an oblique, perspective-like render of the reduced point cloud. The block's side faces show along its lower and right edges, so it is **not top-down**.
- **Orientation and scale:** the site's long (north–south) axis runs roughly left to right, and there is **no north arrow**. There is a 0–50 m bar, about 606 px long, which is about 12 px/m at the bar. Across the image, the scan of a site about 158 m long spans about 1,650 px. That is about 10.5 px/m, so the bar does not hold uniformly.
- **Can it be traced?** No, not reliably. At about 12 px/m a 0.6 m wall would be about 7 px wide, but the cloud is noisy. Floors, debris, timber props and modern walkways mix with wall tops. Holes mark the pillars, and the caption notes rooms not scanned in Delta and the West House. Some building outlines (Delta, the West House) can be made out at full size. Streets and most wall lines cannot be followed with confidence.
- **Other figures (question 3):**
  - Trinks 2017 has none better. Fig. 7 is one room of Beta; Figs 8–9 are models of Beta; Figs 10–12 are reconstructions.
  - Trinks 2015 has only two figures, both of Kokkino Vouno.
  - No other openly licensed top-down publication of the scan was found.
  - The best top-down plans seen in this run are the excavators': Doumas pp. 21 and 23, and Birtacha Fig. 35.1. All are copyright and usable only as references, not for tracing.

## 6. What the build may use

**1. May the plan be redrawn into data for the excavated part, and on what terms?**

Yes, with attribution, share-alike on the derived data, and one stated doubt.

| | Commons map (Dörrbecker) | Trinks 2017 Fig. 6 |
|---|---|---|
| Licence | CC BY-SA 2.5 (adaptation may go out under BY-SA 4.0) | CC BY 3.0 (landing page) |
| Derived data must be | BY-SA, in its own file | any licence, with attribution |
| Rights doubt | Traced from the Thera Foundation's 2005 map (terms unknown), which looks traced from the excavators' copyright plan | None on the licence. It is a faithful depiction of today's ruins (art. 46 §4B if released for profit). |
| Usable geometry | Building shapes to about ±1 m per building | Coarse outline only; oblique; not traceable |
| Verdict | **The basis for shapes** | **A cross-check only** |

- **Credit text for the map-derived data** (and a NOTICE beside the data file):
  > Excavated walls of Akrotiri digitised, rescaled, georeferenced and reinterpreted from "Akrotiri in the Bronze Age, about 1600 B.C." (File:Map Akrotiri 1600 BC-en.png) by Maximilian Dörrbecker, Wikimedia Commons, https://commons.wikimedia.org/wiki/File:Map_Akrotiri_1600_BC-en.png, licensed CC BY-SA 2.5 (https://creativecommons.org/licenses/by-sa/2.5/). Dörrbecker drew it from a Thera Foundation web map (2005) and other sources. This derived data is licensed CC BY-SA 4.0 (https://creativecommons.org/licenses/by-sa/4.0/).
- **Licence of the derived data:** CC BY-SA 4.0, kept in its own file. The MIT engine code sits beside it.
- **Caveat:** the plan is a simplification of a simplification. Every wall from it is "A in existence, C in exact line".
- **Cautious course:** use it now for the public prototype with the credit above. Before any sale or commercial release:
  - write to the Akrotiri Excavations for permission to use their general plan, which would also give a better plan;
  - have lane T6 settle art. 46 §4B.
- **Scale, position and orientation** come from separate controls (answer 2), so no OSM geometry need be copied.

**2. Scale, orientation, position.**
- **Scale on the 2,075 × 3,345 file:** east–west about **20.4 px/m** (20.0–20.9), north–south about **22.0 px/m** (21.6–22.4). As one number, 21.5 px/m ±5%. Uncertainty: about ±1 m within a building, and about ±5 m across the whole site.
- **Orientation:** plan-up = true north, **±3°**.
- **Position:** centre the excavated walls on the shelter's area centroid, **36.35170 N, 25.40345 E (±10 m)**. The walls span about 143 m north–south and about 88 m east–west, inside a shelter 158 × 119 m along its own axes. The shelter's axes lie at 5.1° anticlockwise of true north. Today's shore is about 198–220 m south of the shelter's south edge (OSM).
- **Better fit:** register the walls to the shelter outline as drawn on the excavators' plans (Doumas p. 23; Birtacha Fig. 35.1), used as a reference only. Credit OSM for the centroid.

**3. Which labels are what.**
- **Last town (LC I)**, each A in existence:
  - Sector Alpha (Pithoi Storeroom), House of the Ladies, West House, Delta Complex, Sector Beta, Sector Gamma, Xeste 2, Xeste 3, Xeste 4;
  - House of the Anchor (façade only, unexcavated);
  - "Pylon": an LC I porch, misdrawn as a free-standing painted box;
  - Triangle Square and Telchines (Telchinon) Street;
  - Terrace 1 and Terrace 2: the terraced Square of the Double Horns, made from the debris of the c. 1650 BCE quake (B as a label match).
- **Probably LC I, unexcavated** (C, label matching):
  - "Porter's Lodge" = Building Eta on the Greek plan;
  - "South Building": probably one of the two unexcavated buildings south of Curetes Street (Doumas p. 42; Κτίριο ΙΒ΄ on the Greek plan). Do not confuse it with the Ephorate's "South Building of Sector D", which is Delta South (Delta 15–16).
  - "Xeste 5": a label only; nothing describes it.
- **Earlier:**
  - the Cenotaph's contents are Early Cycladic (c. 3000–2700 BC, outside the window, C). The cairn's date is unknown; its square is an LC I open space.
  - Nothing else on this plan is drawn as earlier. The Middle Cycladic, Early Cycladic and Neolithic remains appear only on Doumas p. 23.
- **Modern:**
  - the visitor path (green, the pre-2012 route);
  - the excavation border (grey line);
  - the dashed "limits of the excavation site" (about 7,800 m², not the 2012 shelter);
  - "Tunnels" (outside the border near Alpha; probably modern, unverified);
  - the empty strips cut by the modern torrent;
  - roof supports are not drawn.
- **Unknown:** "Terrace 3".

**4. Where the evidence ends, and what supports going beyond.**
- **South:** walls stop at Xeste 3, Xeste 4 and the South Building. Palyvou's indicative shore lies 35–55 m beyond (C), and Neolithic sherds reach the ticket booths (C, outside the window). Draw no town south of the walls.
- **West:** walls stop at the West House, the House of the Anchor and Xeste 3. The indicative bay lies 10–40 m away (C). Buildings on Kokkino Vouno, 0.55–0.7 km west-southwest, are B; their own excavator calls it a settlement around the town. Draw no continuous town west.
- **East:** walls stop at Xeste 2, Xeste 5 and the east end of Xeste 4, on a steep slope (A). The indicative bay lies 25–50 m away (C). Zahn's buried pre-eruption buildings, about 500 m north-east (B), and graves in the Potamos valley (B, undated) are known. Doumas's "concave plateau" towards Potamos is C.
- **North:** walls stop at Sector Alpha and the Porter's Lodge. **No trench, core, survey or find north of the shelter** appears in any source opened. Only Doumas's estimate and the plateau argument (C) support the town running on north and north-east.
- **Where to draw:** the town beyond the dig may run north and north-east as C, thinning, towards the Potamos side. Kokkino Vouno and Zahn's site can be separate clusters (B for existence, C for any link). No town wall: none is reported.

**5. Size of the whole town.**
- **10–20 ha, grade C.** Neither figure rests on an excavated edge.
- Palyvou's 10 ha ("most modest", T2#2) sits more easily with the indicative coastline hemming the southern half.
- Doumas's 20 ha runs north about halfway to the caldera.
- Record whichever is chosen as a liberty, with the other beside it.
- Population on the same footing (C): about 2,000 for 10 ha (Palyvou); 5,890–11,700 for 20 ha (Sarpaki's preferred density), with 2,000–18,000 across all his models.

## 7. Gaps

- **Unread books that would settle most of the layout:** Palyvou 2005 (street and square widths, the basis of the 10 ha estimate); Doumas 1983, p. 45 (the basis of the 20 ha estimate); McCoy, Papamarinopoulos, Doumas and Palyvou 1992 (GPR and the buried extent of the town).
- **Markellou 2023** (CC BY 4.0) could not be opened. Neither could any later amendment or ministerial decision under art. 46. I did not open the Ephorate's Terms of Use page.
- **The Thera Foundation map's terms**, and who drew it, remain unknown.
- **A georeferenced excavators' plan** would replace the scale-and-rotation fit. Asking the excavation is the shortest route to one.
- **Labels still unexplained:** "Terrace 3", "Xeste 5", "Tunnels". The Greek plan also labels a north–south way by the Cenotaph "ΟΔΟΣ ΔΑΙΜΟΝΩΝ", which the report does not mention. Whether it is the strip Dörrbecker calls "Terrace 3" is uncertain.
- **Ground levels:** only two absolute points survive: about 19.50 m at Xeste 3 (south-west) and 18.10–18.20 m floor at PS 65N (east). No street gradient is measured.
- **The scan data:** they exist with the excavators, the Ephorate and the University of Vienna, under no stated public terms.
