Verification of lane T3c (docs/research/claude/T3c_Claude.md), by a separate Claude verification agent on 2026-11-21 (D13). The existing `T3c.md` in this folder checks the earlier Neon report; this file checks the Claude report.

Method: I re-opened the sources myself during this run. Every file was downloaded fresh into a scratch folder; none was taken from an earlier run.
- **Sarpaki 1987** (White Rose eTheses 2979), both PDFs. Text taken with `pdftotext`. Where a number, a month or a row decides a claim, I rendered the page and read the image. Each row below says "page image" when I did.
  - Page images read: thesis p. 54 (Fouqué's olive trunk); Tables 1.24 and 1.25 (the Santorini crop calendar and yields, rotated); Table 5.22 (flax seeds).
- **The Theran finds:** Friedrich et al. 2006 (*Science*); the *Antiquity* 2014 debate file (Cherubini et al. with the replies of Friedrich et al. and Bietak); Pearson et al. 2023 (PMC); Bottema-Mac Gillavry 2003/2004; the Mavromati 2021 and 2019 abstracts; Birtacha 2008 (Table 35.8).
- **Floras:** the *Flora Europaea* treatments on Plazi (27 pages, plus the cultivated-vine page the report did not cite); the European Atlas of Forest Tree Species chapters; Halácsy's *Conspectus* vols I–III (Latin, Internet Archive text); the Greek checklist (*Englera* 31, catalogue rows and Appendix notes); Kew GrassBase; USDA FEIS.
- **Phenology and trials:** Grillakis et al. 2022 (olive; grape); Kafkaletou et al. 2021; Ayar et al. 2025 (Table 2 read as page image, because its rows are offset in the text layer); Marcotuli et al. 2020; the Aydın fig specification; OENO One 3129 and 4843; Prudencio et al. 2020; Bergmeier and Matthäs 1996 (German, read in full); Katsileros et al. 2025; Protonotariou et al. 2023; Bradová et al. 2005; the Hohenheim einkorn report; Nassi o Di Nasso et al. 2011; Margaris 1977.
- **Crops, painted plants and exclusions:** Feedipedia; Cretan Flora pages; Melamed et al. 2009; the EC fava page and the 2010 PDO text; Hesiod and Theophrastus (public-domain translations); Day 2011; Nugent; Doumas 2016 (Latsis PDF); Baumann 2006; Pouris et al. 2020; the crocus review (Frontiers 2022); FAO; López-Pujol et al. 2025 (abstract); Mocarelli and Panjek 2020; Aydın (tobacco); NC State; the carob review (Europe PMC).

Grades follow `docs/HISTORICAL_STANDARD.md` §3 and the report's own reading of them: a measured find from Thera is A, a specialist's reading of it is B, a painting is B at most, and every modern description, flora month, ethnography and ancient text is C. Quotations are short. German, Latin and Greek are quoted with a translation.

Four requests were refused or served nothing, and I did not work around them: the *Journal of Experimental Botany* page (bot check), the Schweizerbart abstract of Raus 1994, the FloraVeg factsheet, and the first Plazi requests (rate limit; retried slowly and then served).

## 1. Verdict summary

- **Counts (318 claim rows):**
  - **Checked 270**: all 65 openable grade-A and grade-B rows, and a sample of **205** grade-C rows (listed in §7).
    - **5 wrong** (#64, #112, #114, #217, and #224 in part).
    - **2 regraded**, both too high in part (#8, #10).
  - **Could not check 5** (#232, #258, #259, #260, #300): the pages would not serve.
  - **Not attempted 43** (listed in §7). These include every remaining `[snippet only]` row; a snippet cannot be checked by rule.
- **No fabrication found.** Every source I opened exists, is the work cited, and says what the report puts on the row, with these exceptions:
  - **#112 and #114 misread the crop calendar** (Table 1.24, page image).
    - The "March" sowing and "May" harvest given for *L. clymenum* belong to the millet row above it.
    - The April harvest belongs to pea only. The *L. cicera* row is blank.
    - The earlier `T3c.md` made the same two misreadings in its Gaps; this check amends it.
  - **#64:** both of Bottema's pine samples fit *P. brutia* better. The compression wood is in the sample from the square, not the sewer.
  - **#217:** the Pisa giant-reed stand was in its "seventh year of growth", not young.
  - **#224:** the yellow April aspect of the Cretan phrygana comes "in erster Linie" (first of all) from the broom *Calicotome villosa*, not mainly from annuals. *Calicotome* is not attested at Akrotiri.
  - **#47** cites the wild-vine page for the cultivated-grape figures. The figures are right, but they are on the *subsp. vinifera* page.
  - **#144:** the einkorn height the report calls a conflict is a slip in its source. The paper's own Table 1 gives a mean of 85 cm (68–100 cm).
- **The page image reads "2 m."** Fouqué's olive trunk is "an olive trunk discovered 2 m. in length (Fouqué 1879:120)" (thesis p. 54, page image at 500 dpi). The text layer's "2 in." is an OCR error.
  - The thesis does not say "under the pumice". The same thesis places Fouqué 1879: 118–120 at Balos (p. 107).
- **The Theran finds hold, number for number.**
  - Seven branch moulds "1 to 3 m above its base"; 72 rings; 172 m asl; the second stem "only 9m away".
  - Therasia stems of 8 mm, c. 1, c. 1.5 and c. 2.5 cm; 2–3 mm of bark on one stem; bands c. 500–80 µm.
  - Olive charcoal "more than 500 fragments"; 18 branch pieces of "1.5–5 cm Ø".
  - Sickle "length 21.8; breadth 2.1" cm; flax seeds 3.2 × 1.7 and 3.6 × 2.0 mm (page image).
- **Region named, grade C: respected.** Every modern description or month I checked is graded C and names its region in the Claims, except #154 (bitter vetch trial sowings: Córdoba, Spain, not named).
- **Against the earlier checks.** The report keeps the presence grades of `T3.md`, `T3b.md`, `T3c.md` and `T3d.md`, including the T3d amendment that fig is A as timber. Two points differ:
  - `T3c.md` misread Table 1.24 the same way as #112 and #114 (corr. 1, 2). This check corrects that file's Gaps too.
  - Vine wood: `T3c.md` cites Doumas for vine charcoal and the report did not reopen it. Sarpaki 1987 p. 129 also lists vine among the identified charcoal, against Bottema 2004 (corr. 23). A vine growing on Thera stays B, as T3d graded it.
- **The twelve-month tables carry unmarked inference.** The tables say inferred cells are marked "inf." or "?", but several cells in the olive, almond, barley, wheat, pulse, flax and *Thymelaea* rows are inferences with no mark. A few cells rest on a snippet or a weak source without saying so (§8).
- **Usable for building?** Yes, for most plants, with the corrections in §3. The form numbers of the trees, the cereals, the main pulses, giant reed and the scrub are checked. Their months are checked for olive, fig, vine, thyme, savory, rush, terebinth, the crocuses and sea daffodil. Months are not usable yet for tamarisk, pear, prickly juniper, most pulses, flax, coriander, garlic and henbane (§2).

## 2. Usable for building, plant by plant

"Form" is height, habit, leaf, flower and fruit. "Months" is the plant's row in the report's Section 3.2. Classes:
- **(a)** checked and usable;
- **(b)** usable with the corrections listed (numbers refer to §3);
- **(c)** not usable yet.

Every figure in this table is C (a modern plant in a named region) unless the row says A or B. "Grade on Thera" is the grade of the plant's presence, from T3, T3b, T3c and T3d.

| Plant | Grade on Thera | Form | Months | Why |
|---|---|---|---|---|
| Olive (cultivated) | A | **b** | **b** | Form: FE and the forest atlas check ("Tree up to 15 m"; "8-15 m"; leaves "(10-)20-80 x (3-)5-15(-20) mm"; drupe "10-35 x 6-20 mm"). Drop "lance-shaped" from the leaf: neither source gives a shape. Months: flowering is checked (Crete, Koroneiki, median 28 April at 45 m). The May–October cells are unmarked inference (corr. 19). The December "harvest" is an experimental sampling schedule near Athens (5 Nov–22 Dec), not a farm harvest. Buried trees: "alive" is B (corr. 10). |
| Olive (wild form / Therasia shrub) | A as a shrub | **b** | as cultivated | Only the find's stems (≤ 2.5 cm) and the FE note ("spiny lower branches and small leaves and drupes") are checked. No height for a wild tree. |
| Fig | A (wood, seeds) | **a** | **a** | FE ("Leaves 10-20 cm long and wide"; "Syncarp 5-8 cm"). Every month checks against the Aydın orchard table (Aegean Turkey, 60 m, cv. Sarılop; page image) and Marcotuli (breba May–June). Spread not given (gap). |
| Grape vine | A (pips); vine B | **a** | **a** (Jan–Sep) | FE ("reduced by annual pruning to 1-3 m"; leaves 5–15 cm; petals pale green). Cultivated berry figures are right, but on another page (corr. 14). Months check (Crete Sultana; Santorini harvest 10 August; village memory September). October–December and leaf fall: no source (gap). |
| Almond | A | **a** | **b** | FE checks in full. April bloom and August "late types ripe" rest on Tardona, a modern bred cultivar on drip-irrigated trees in Spain (corr. 9). May–July cells are unmarked inference. |
| Deciduous oak (as *Q. pubescens*) | A as wood; species unknown | **b** | **b** | FE and atlas check (15–20 m; leaves 4–12 cm; flowering March–May; acorns September–November, Europe-wide). Usable only as a named stand-in. March leaf-out is inferred from "catkins which grow up along with new leaves". |
| Kermes oak | A as evergreen-oak wood; grows on Santorini today | **a** | **a** (evergreen only) | FE ("Evergreen shrub up to 2 m (rarely small tree)"). Flowering and acorn months: no source (gap). |
| Pine (*P. brutia* or *P. halepensis*) | A as wood; growing B | **b** | **b** | FE and atlas check. Correct the charcoal note (corr. 3). Pollen months rest on a student field-course report from northern Cyprus (March–May; weak). |
| Phoenician juniper | A as charcoal; growing B | **a** | **b** | FE and atlas check. Pollen month and cone colour depend on subspecies; *turbinata* (autumn pollen) is the likelier one in the Aegean (corr. 16). |
| Prickly juniper | A as charcoal type | **a** | **c** | FE and atlas check. No months. |
| Tamarisk | A | **a** (genus) | **c** | Atlas checks (4–15 m; scale leaves 1.5–3.5 mm; pink or white). The months rest on one snippet (#79), not marked as such in the table. |
| Pear (*P. amygdaliformis*) | A as charcoal | **b** | **c** | Only Davis via Bottema: "up to 6 m", "little pears (2–3 cm)". No leaf, flower or month. |
| Terebinth | A as *Pistacia* charcoal | **a** | **a** | FE and the Cyprus leaflet (in Greek: flowers "from March to April", fruit "red at first, blue-green when ripe", ripening September–December). Region: Cyprus. |
| Mastic | A as *Pistacia* charcoal; fossil native | **a** | **b** | FE checks. Flowering February–June is Iberian (Valencia project page); fruit months "?". |
| Six-row barley | A | **b** | **b** | Heights check (Thera today "barely reaches 30-40 cm"; Attic landraces 66.3–80.6 cm). Spike length: landraces 11.1–12.8 cm, not 10.5–13.8 (corr. 6). Months check (Thera 1982–83: manured 15–30 August, sown October, harvested June; Attica: end of May). April and September cells are unmarked inference. |
| Two-row barley | A (minor) | **b** | **b** | As six-row. Its chaff evidence is partly Middle Cycladic (corr. 21). |
| Einkorn | A | **b** | **b** | Height: 85 cm (68–100) in Prague, not 73 (corr. 5); 106.7 cm (64.1–120.0) at Hohenheim. Spike 5.5 cm. Months only by analogy with wheat. |
| Free-threshing wheat | A (one grain) | **b** | **b** | Attic landraces 118–159 cm are bread, durum, emmer and Polish wheat, not the compact Akrotiri type. Ear emergence 107–138 days after November sowing checks. Harvest after barley: Theophrastus. |
| Emmer | A (traces) | **a** | — | Prague mean 107 cm (88–135). |
| *Lathyrus clymenum* | A | **a** | **b** | Form checks (Crete wild: stem 30–80 cm; corolla 16–20 mm, crimson standard, lilac-blue wings; pod 30–70 × 5–12 mm, brown). Months: sown October–January, ploughed December, harvested May–June, tips picked c. 15 March (Thera 1982–83). Strike "March" sowing and "May" harvest (corr. 1). |
| Pea | A | **b** | **b** | Feedipedia gives no height; the 2 m is a UK horticultural record. Harvest April on Thera (one informant) checks. Other months: no source. |
| *L. cicera* / grass pea | A (crop status B) | **a** (grass pea) | **c** | Feedipedia checks ("up to 60 cm"). No harvest month on Thera: the calendar row is blank (corr. 2). |
| Lentil | A | **a** | **c** | Feedipedia checks (60–75 cm; white to purple). May harvest is Sarpaki's expectation ("lentils to ripen first"), not a dated month. |
| Chickpea | A (one seed) | **a** | **c** | Feedipedia checks (20–60 cm, to 1 m). Kabuli types of the Mediterranean have white flowers. No months. |
| Faba bean | A (cf., one seed) | **a** (modern large plant) | **c** | Feedipedia checks (1.5–2 m; white with black spots). No months. |
| Bitter vetch | A (one seed) | **a** (height); flower **c** | **c** | Height 20–90 cm checks. Flower colour is a snippet. Sowing dates are a Spanish trial (corr. 18). |
| Lupin | A (one sample, possibly MBA) | **a** | **c** | Feedipedia ("1.2 m high"); autumn sowing (Mediterranean). No months on Thera. |
| Flax | A (seeds; phase B) | **c** | **b** | Seed size checks (page image). Plant form rows #164–#168 not checked. Sown late October; pulled before the summer heat (general agronomy); "May" is inference. |
| Coriander | A (46 fruits) | **c** | **c** | Form rows not checked; only Theophrastus for sowing (not checked). |
| Garlic | A | **c** | **c** | Find confirmed (abstract). No form. |
| Thyme (*Thymbra capitata*) | taxon A; species C | **a** | **a** | FE checks. Halácsy: on Thera ("chlor. Thera p. 19"), "Maio, Sept" (May to September), "corollae roseae" (rose corolla). Crete: peak 10–30 June, stands "braunviolett oder rötlich" (brown-violet or reddish) from a distance; leaf fall mid-August to mid-September. |
| Savory (*Satureja thymbra*) | taxon A; species C | **a** | **a** (May–Jul) | FE checks (20–35 cm). Halácsy: Thera (Heldr.), "Maio, Jul." Other months: no source. |
| Lavender | taxon A; species open | **b** | **b** | *L. stoechas* figures check (FE; Halácsy, March–July). It is not the only lowland lavender in Halácsy (corr. 7). Not recorded on Thera. |
| Thorny burnet | taxon A; species C | **a** | **b** | FE checks. Crete phases check (peak mid-February to early March; summer leaves in the 2nd–3rd week of May; fruits ripen late May–June, often shed in autumn). Halácsy: Thera, April–June. The red fruit in June needs the [weak source] mark (§8). |
| *Thymelaea hirsuta* | A (leaves) | **a** | **b** | FE checks. Halácsy: Thera (Weiss; Heldr.), yellowish perigon, "Oct. Maio". June–September "leafy" is unmarked inference. |
| Asphodel (*A. aestivus*) | taxon A; species C | **a** | **b** | FE checks (scape 100–200 cm). Halácsy: Thera (Heldr.), white, "Jan. Apr." May–December rest on a snippet; November and December lack the mark. |
| Sharp rush (*J. acutus*) | A (cf.) | **a** | **a** (Apr–Jul) | FE checks. Halácsy: var. *heldreichianus* on Thera, April–July, brownish perigon, rust-coloured capsule. Other months: no source. |
| Henbane | A (cf. *H. niger*) | **c** | **c** | Rows #210–#211: the find checks; the form and months of *H. albus* were not checked. |
| Giant reed | A as material; growing B | **a** | **b** | GrassBase (culms 200–600 cm; blades 20–80 × 1–7 cm; panicle 30–60 cm) and FEIS (2–8 m; culms 1–4 cm) check. Halácsy: flowers August–October in Greece. Pisa heights are from a seventh-year stand in a year of 1,032 mm of rain (corr. 4). |
| Grasses and annual herbs (the ground) | taxa A in part | — | **b** | Every Cretan phase checks (greenest December–January; peak end of March–20 April; summer-dry by the 2nd–3rd week of May; rest July–mid-September). The April yellow is mostly a broom absent from Thera (corr. 8). |
| Crocus (*C. laevigatus*, *C. cartwrightianus*) | B (art); C as plants | **a** | **a** | Cretan Flora (corms 8–15 and 10–15 mm; tepals 14–32 mm; *C. laevigatus* October–February, *C. cartwrightianus* late October–early January) and *Englera* (both in the Kiklades) check. |
| White lily | B; C as a plant | **a** | **b** | Cretan Flora (stem 90–120 cm; tepals 55–70 mm; May–June) and Nugent ("pure white") check. Kandeler could not be opened. |
| Red lily | B; not Cycladic | **b** | **b** | *Englera*: "generally in July", not in the Kiklades. Keep in paintings. |
| Sea daffodil | B; C as a plant | **a** | **a** | Nugent (40–60 cm, 2–20 stems) and Pouris (Evvia: flowering June–August; leaves expanded December–June, senescent July) check. |
| Myrtle | B; C as a plant | **a** | **a** | Cretan Flora (1–3 m; leaves 15–40 mm; petals 7–10 mm; "(Apr-)June-Sept"); Sicilian phenology abstract (berries ripen October–January). |
| Papyrus; date palm; Cretan palm; dwarf fan palm; ivy; common reed (*Phragmites*) | B (art) at most | **c** | **c** | Their form rows were not attempted (#278, #286–#293, #299, #303–#304); #300 could not be opened. Keep inside paintings, as the report says. |
| Chestnut, alder | A as wood; trees B at most | not checked | not checked | Not to be built as growing trees unless decided. |

## 3. Corrections

Apply these before any plant enters the data.

1. **#112: *L. clymenum* months on Thera** (Summary, Section 3.2 row, Section 3.3).
   - Table 1.24 (page image) gives for *L. clymenum*: ploughing "December b"; "no manure a & b"; planting "Oct–Jan a & b"; harvesting "May–Jun b"; intercropping "in fields b"; eaten as "seeds & greens e".
   - The "March" and "May" in the report come from the row above it, *Panicum* (millet): planted "March a", harvested "May a".
   - Strike "(one informant: March)" and "harvested in May or". Write "harvested May–June".
   - Informant a's note says the best arakas grows in vineyards, planted only one year at a time. So "grown among the vines" stands.
   - This also amends `T3c.md` Gaps ("or in March").
2. **#114: no April harvest for *L. cicera*** (Summary, the "Pea and *L. cicera*" row, Section 3.3).
   - In Table 1.24 the *L. cicera* row is dashes in every column. Only *P. sativum* has a harvest: "April c" (page image at 400 dpi).
   - Write "pea harvested in April (one informant)", and "*L. cicera*: no month".
   - This also amends `T3c.md` Gaps.
3. **#64: both pine samples fit *P. brutia* better** (form table, pine row; Debates).
   - Bottema: two samples "both answer better to P. brutia than to P. halepensis".
   - Sample 1 is from the sewer; sample 2, with the compression wood, is from "the square between the West House and a disturbed layer" (her n. 9).
4. **#217: the Pisa giant-reed stand was not young** (Section 3, months row).
   - 2009 was "the crops seventh year of growth", with 1,032 mm of rain at Pisa, about three times Thera's 362 mm.
   - The heights (92 cm on day 132, 236 on day 194, 276 on day 240, 286 on day 322) and the basal stems (10.5–11.6 mm) check.
   - Treat the curve as an upper bound for Thera.
5. **#144: einkorn at Prague is 85 cm (68–100)** (Section 3 "73 (Prague) 71–88"; Debates "Einkorn's height").
   - Table 1 of the paper gives the einkorn mean as 85 cm, the ten accessions running from 68 to 100 cm.
   - The text's "71–88 cm by mean value 73 cm" matches the next column, days to flowering (67–81, mean 73): a slip in the source.
   - Spike 5.5 cm checks. The debate is closed: use 85 (68–100) and Hohenheim's 106.7 (64.1–120.0).
6. **#139: barley landrace spikes are 11.1–12.8 cm** (Section 3; form table, six-row barley).
   - In the trial's table, 10.46 cm is the modern cultivar Triptolemos and 13.77 cm the two-row cultivar Thessaloniki.
   - The eight landraces run 11.09–12.82 cm, measured "from spike base to tip, excluding awns".
7. **Lavender: not "the only wild lavender of the Greek lowlands in Halácsy"** (form table; #181).
   - Halácsy also lists *L. spica*: "In locis petrosis regionis inferioris" (in stony places of the lower region), "Cyclades (Chaub.)", "saepe colitur" (often cultivated), "corolla coerulea" (blue corolla), June–August.
   - The species of the Akrotiri lavender stays open between the two (C). Neither was recorded on Thera.
8. **#224, #228: the April yellow is a broom, not mainly annuals** (Summary, grasses row, Game hooks "flecked yellow").
   - Bergmeier and Matthäs: the "vorwiegend gelben Eindruck" (mainly yellow impression) comes "in erster Linie" (first of all) from *Calicotome villosa*. Then come *Euphorbia acanthothamnos* and numerous annual legumes and composites, led by *Crepis cretica*.
   - Neither shrub is attested at Akrotiri. The peak itself ("fast 50 %", almost 50% of species, "zwischen Ende März und dem 20. April", between the end of March and 20 April, mostly therophytes) checks.
   - For Thera, the yellow is the annuals' share only. How strong it is, is a liberty.
9. **#55: April almond bloom is a modern bred cultivar** (Summary; almond row; Section 3).
   - Tardona is "a new release from the CEBAS-CSIC breeding program". It flowers 60 days after traditional early cultivars, on drip-irrigated trees in Murcia.
   - Use the traditional Desmayo Largueta for unimproved almonds: flowering about 1 February; field ripening in the first week of September.
   - Strike "late types bloom" (April) and "late types ripe" (August), or mark them "modern bred cultivar".
10. **#8, #10: "buried alive" is B; the measurements stay A** (grade too high in part).
    - The same PDF holds Bietak's reply: "no proof could be produced that this branch was alive", and the leaves came from "an underlying horizon" with "no connection to the branch".
    - Pearson et al. 2023 hold that the stratified leaves show the tree was alive, but that it is uncertain whether the sampled branch was still growing.
    - The trees' standing position, the moulds 1–3 m up, the leaves, 172 m and 9 m remain A. No change to what gets built.
11. **#33: Fouqué's trunk** (Summary "reported under the pumice").
    - The page image reads "2 m." The thesis says only "an olive trunk discovered 2 m. in length (Fouqué 1879:120)".
    - It places Fouqué 1879: 118–120 at Balos (p. 107), which lay under 22 m of pumice (T3b #4b). So "under the pumice" is INFERENCE. Keep B.
12. **#56, wording.** The abstract calls pine "scarcely present" in general. It says its use, with olive, tamarisk and fig, "might be the result of the emergency repair work". Not "scarcely present in the repairs".
13. **#18, wording.** The management sentence of the thesis abstract covers Akrotiri and Heraion (Samos) together ("In both cases"), as T3 #10 found. Write "at Akrotiri and Heraion".
14. **#47, citation.** The cultivated-grape figures are on the FE *subsp. vinifera* treatment: "Fruit 6-22 mm, ellipsoid to globose, green, yellow, red or purplish-black" (Plazi 03B0402CFEC9E260FEBBF3DAD3ACF122). The sylvestris page cited gives only the wild vine.
15. **#70: add two records of Phoenician juniper on Thera.**
    - Sarpaki 1987 p. 53: "a few stands of Juniperus phoenicea were discovered on Thera" at a place called "vides" (unpublished, 1982).
    - Bottema n. 6: the cliff tree was not found again in 1996.
16. **Phoenician juniper months: pick the subspecies.**
    - The forest atlas says subsp. *phoenicea* sheds pollen in spring and *turbinata* in autumn.
    - It reports recent studies that confine *phoenicea* "to the eastern Iberian Peninsula and South France", with *turbinata* "widespread throughout the whole range".
    - For Thera, autumn pollen is the likelier. The atlas gives *turbinata* "ochre-brown" cones; FE gives the species "dark red when ripe". Record the conflict.
17. **#117, wording.** Sickles were bought "to speed up the harvesting" (thesis p. 41), not threshing.
18. **#154: name the region.** The bitter-vetch trial sowings (11 November 2016; 22 December 2017) were at Córdoba, Spain. The "sown (Nov–Dec trial)" cells are Spanish.
19. **Mark every inferred cell in Section 3.2** (§8 lists them). Use "inf." as the report's own key says.
20. **#190 and Section 3, thorny burnet.**
    - The abstract says ramets "between 12 and 17 years old often dominated stand cover", separating after 7 years.
    - "Mostly 17 years old or less" is a loose paraphrase. The "9–11 mean" in Section 3 is not in the abstract: strike it.
21. **#92, a note on the phases.**
    - The chaff evidence for two-row barley (2-row lemma base and rachis internodes) is in sample 24, which the thesis dates "M.B.A. phase, (well 23, room 4)".
    - LC I sample 2 adds six "2-row/lax eared" grains, and sample 71 has 38 symmetric grains (Table 5.11). Grade A stands.
22. **#103, #104, the flax phase.**
    - The text labels sample 40 "M.B.A." twice (in the *L. clymenum* crop description and in the discussion of seed sizes), not once.
    - Table 5.22's title reads "Linum seeds from Akrotiri (L.B.A.)" (page image).
    - The thesis contradicts itself, which supports grade B for the phase.
23. **The vine debate (Section 5).** Sarpaki 1987 p. 129 lists vine among the few identified charcoal pieces ("pine, cypress, olive, vine, and tamarix"). Bottema found no vine wood and read the early "vine branches" as juniper. Vine growing on Thera stays B.

## 4. Gaps

What a builder needs that neither the report nor this check could give:

- **Spread.** No opened source gives the crown width of any tree or the cushion width of any shrub.
- **Months from Thera or the Cyclades.** Only two:
  - the Santorini crop calendar of 1982–83: barley, *L. clymenum*, pea, vines, millet, the vetch "faki";
  - Raus's January flowering on Thera, known only through Bergmeier and Matthäs; his abstract would not open.
  - Every other month is from Crete, Attica, Aegean Turkey, Spain, Italy, Cyprus, Iran or the United States.
- **Leaf fall and autumn colour** for vine, almond, the deciduous oak, terebinth and tamarisk. Only fig is dated.
- **Flowering and fruiting months** for kermes oak, pear, both junipers and tamarisk. Tamarisk has a snippet; the junipers have only the subspecies rule (corr. 16).
- **Pulse months on Thera** for lentil, chickpea, faba, bitter vetch, lupin and *L. cicera*. Only pea (April) and *L. clymenum* (May–June) are dated.
- **Ancient sizes.** No straw height or ear form from Akrotiri. No olive stone, fig seed or grape pip measured in any opened source. The small, deformed barley of two West House samples (#98) is the only size hint.
- **Which species.** The deciduous oak, the evergreen oak (kermes oak is today's), the tamarisk, the lavender (*stoechas* or *spica*) and the juniper subspecies.
- **How vines were grown.** No Bronze Age source on training.
- **The ground without the broom.** No Cycladic phrygana phenology. The Cretan colour curve includes a shrub absent from Thera.
- **Henbane, coriander, flax and garlic forms**, and the painted palms, papyrus, ivy and common reed: not checked here (rows not attempted).
- **Who looked.** Nothing here was looked at by Chad. All page images were read by this agent.

## 5. Assumptions checked (T3c-1 to T3c-6)

| Assumption | Report | Verdict | Why |
|---|---|---|---|
| T3c-1: barley ripe in May, golden or cut in late May; wheat follows | partly confirmed (C) | **agreed** | Thera 1982–83: barley harvested "June c" (Table 1.24, page image); threshing "May and early June" (thesis p. 203). Attica: "harvest at the end of May" (Katsileros). Theophrastus: "the barley harvest is in the seventh month, or in most parts in the eighth, and wheat requires an even longer time". Boeotia: wheat harvest "(c. May 15)", said to be unchanged since Hesiod (thesis p. 45). The folk calendar (#170) is a snippet. |
| T3c-2: olives in flower, grapes small and green, figs unripe in late May | partly contradicted (C) | **agreed** | Crete, Koroneiki, median flowering day 118 at 45 m (28 April), 140 at 340 m, 145 at 624 m. Crete Sultana flowering days 135–154 (15 May–3 June); berry development from day 158. Aegean Turkey: first main-crop figs 18–30 May; brebas ripen May–June (Apulia). The report's caveat (#91, warming of 0.36–0.40 °C a decade) is fair as INFERENCE. |
| T3c-3: Bronze Age cereals about 1 m or more | partly confirmed for wheat, not barley | **agreed**, with corr. 5 | Wheat landraces 118–159 cm against cultivars 83.88–103.87 cm, the difference due to *Rht* genes. Barley landraces 66.3–80.6 cm; Thera today 30–40 cm. Einkorn 85 cm (Prague) and 106.7 cm (Hohenheim). |
| T3c-4: fig, vine, deciduous oak bare December–March; low ground green from autumn rain to April or May | partly confirmed (C) | **agreed** | Fig: all leaves fallen 20 November–18 December; first leaves 12 March–12 April. Vine budburst days 86–92; leaf fall undated. Downy oak: flowering with new leaves March–May (Europe); leaf fall undated. Cretan phrygana: rains from the second half of October; greenest December–January; summer-dry by mid-May. |
| T3c-5: prickly pear, agave, eucalyptus, citrus, tomato absent | confirmed (C) | **agreed** | See §6. Citrus rests on `T3c.md` claim 30 (not reopened). |
| T3c-6: by late May most low grasses and annuals straw-coloured; thyme coming into flower | confirmed (C), with a caveat | **agreed** | "Insgesamt aber herrscht schon der sommerlich dürre Aspekt" (overall the summer-dry aspect already prevails) in the 2nd–3rd week of May. Early-May rain sets off late flowering. Thyme: Halácsy "Maio, Sept"; Crete peak 10–30 June. North-facing phrygana on Anafi stays green "at least 1-2 months later" (thesis p. 104). |

## 6. What must not appear

| Plant | Report's date and verdict | Check |
|---|---|---|
| Prickly pear, agave | 16th century AD; must not appear | **checked.** López-Pujol et al. 2025 (abstract): "introduced into the Mediterranean basin in the 16th century". FAO: opuntias and agaves "the oldest cultivated plants in Mexico". *Englera*: both aliens ([neotrop.], [N-Am.]). |
| Tomato | after 1492; no Greek date | **checked.** The same abstract names *Solanum lycopersicon* among American plants brought to Europe. No Greek date found. |
| Maize | 1559 in Carinthia; not established in Greece | **checked.** "its first appearance can be documented as early as 1559" (Carinthia, not Greece); *Englera* Appendix: "Cereal crop … not established". |
| Tobacco | Istanbul 1598–1606; Serres by 1632 | **checked.** Aydın: introduced to Istanbul "between 1598 and 1606", by European sailors; the ban of Murat IV in 1632. *Englera*: "Formerly cultivated industrial crop … not established". |
| Eucalyptus | no date; recent | **checked.** Bottema: "certainly is a recent acquisition"; *Englera*: [Austr.], "Widely planted and locally naturalized". |
| Bougainvillea | no date | **checked.** NC State: "a genus of 18 flowering plants, native to South America". Not in *Englera*. |
| Pistachio | 19th century [snippet only] | **not attempted** (snippet; the host does not resolve, as `T3c.md` also found). *Englera*: "Widely cultivated in S Greece, but not established" (checked). |
| Carob | doubt open | **checked.** *Englera* counts it native, and "native" includes archaeophytes present before "the end of the 15th century". The 2023 review: "disseminated by the Greeks in Greece and Italy", no date. Absent from every Akrotiri list. |
| Italian cypress | not outdoors on Thera | **checked.** *Englera*: "Native only in Kriti and some of the East Aegean islands … Widely cultivated and naturalized elsewhere, usually in the tall columnar form". |
| Pomegranate | do not build | **checked.** *Englera*: "Doubtfully native, probably mostly feral from abandoned cultivation", [SW-As.]. |
| Date palm, dwarf fan palm | not outdoors | **checked.** *Englera* lists the date palm among non-established plants; its note 8 gives *Chamaerops* as the W Mediterranean palm. *P. theophrasti*: "?" for the Kiklades, native in Kriti. |

## 7. Claims table

Short names: S87 = Sarpaki 1987 (m = main text, t = tables); B04 = Bottema-Mac Gillavry 2003/2004; FE = *Flora Europaea* on Plazi; JRC = European Atlas of Forest Tree Species; H I–III = Halácsy, *Conspectus*; BM96 = Bergmeier and Matthäs 1996; E31 = *Englera* 31.

**Every grade-A and grade-B row (66):**

| # | Claim (short) | Verdict | Evidence | Grade | Fix |
|---|---|---|---|---|---|
| 8 | Buried olive, >60 m pumice, 7 branch moulds 1–3 m up, leaves and twigs | checked; **grade too high in part** | Friedrich 2006: "seven molds of branches in the pumice 1 to 3 m above its base" | A (moulds, leaves); **B** ("alive") | Corr. 10 |
| 9 | 72 rings in a section with bark; olive rings irregular | checked | Friedrich 2006: "72 rings in a section of the branch with preserved bark" | A ok | — |
| 10 | Site 172 m asl by a Bronze Age wall; two trees in living position; leaves under each | checked; **grade too high in part** | Friedrich reply, fig. 1: "172m asl"; "under each tree, olive leaves were found" | A; "alive" **B** | Corr. 10 |
| 11 | Second stem 9 m away | checked | fig. 2: "only 9m away" | A ok | — |
| 12 | Therasia shrub between terraced stones; stems 8 mm, 1, 1.5, 2.5 cm; twisted trunk | checked | Pearson 2023: "in between some terraced stones"; Table 2 | A ok | — |
| 13 | 2–3 mm bark; juvenile bark; bands 80–500 µm; 3–10 to 76–81 bands | checked | Table 2: "2–3mm bark"; "c.3-10 growth bands" | A ok | — |
| 14 | Olive >500 fragments; room 5 first floor 18 branches 1.5–5 cm | checked | B04 App.: "18 fragments: parts of branches of 1.5–5 cm Ø" | A ok | — |
| 15 | Gnarled olive wood read as pruned, coppiced or pollarded; firewood | checked | B04: "pruned or coppiced"; "pollarded or pruned on a regular basis" | B ok | — |
| 16 | Miniature Frieze trees at an enclosure seem pollarded | checked | B04 fig. 1 caption | B ok | — |
| 17 | Olive wood for upper floors, doors, walls (Xeste 3, House of the Ladies) | checked | Mavromati 2021 abstract | A ok | — |
| 18 | Olive and almond managed from the MBA | checked | Mavromati 2019 abstract | B ok | Corr. 13 (both sites) |
| 33 | Fouqué: olive trunk 2 m; beam press on Therasia | checked (page image) | S87m p. 54: "2 m. in length" | B ok | Corr. 11 |
| 34 | Fig and tamarisk timbers; repairs c. 50 years before | checked | Mavromati 2021: "Tamarix sp. and Ficus carica" | A; repair B ok | — |
| 35 | Fig seeds in pots, sewer; 30.0% in Xeste 3 room 7 | checked | S87m p. 154: "very high (30.0%)" | A ok | — |
| 36 | No fig, vine or palm wood; fruit could be imported | checked | B04 §5.4 | B ok | Corr. 23 |
| 44 | Grape pips 2.9% (Xeste 3 room 7); one possible wild pip (room 10) | checked | S87m p. 155: "small, short and broad with a short stalk" | A ok | — |
| 45 | No vine wood; "vine branches" read as juniper; grapes maybe imported | checked | B04 §5.4 | B ok | Corr. 23 |
| 52 | Almond charcoal 3–7-seriate; MC room 3C and sewer; jar imprints | checked | B04 §4.7 | A ok | — |
| 56 | Pine and deciduous oak beams; juniper and evergreen oak over the main beams; pine "scarcely present" | checked | Mavromati 2021 abstract | A ok | Corr. 12 |
| 57 | Evergreen and deciduous oak in shaft 63A, none near the West House | checked | B04 §5.4 | A ok | — |
| 64 | Pine *halepensis/brutia* type; "one sewer sample" nearer *brutia*; compression wood | **wrong** in part | B04: "both answer better to P. brutia" | A; local B ok | Corr. 3 |
| 69 | Juniper *phoenicea/oxycedrus* type; branch wood; import possible | checked | B04 §4.1, §5.5–5.6 | A; local B ok | — |
| 75 | Tamarisk not separable; Aegean species on river banks | checked | B04 §4.9 | A ok | — |
| 80 | Pear (Maloideae, *Pyrus*), probably *P. amygdaliformis* | checked | B04 §4.8 | A; species B ok | — |
| 82 | *Pistacia* fits terebinth best; mastic fossil on Santorini | checked | B04 §4.3 | A; fossil C ok | — |
| 88 | Earliest *Castanea* wood in Greece; grown or imported | checked | B04 §4.5 | A; tree B ok | — |
| 89 | Alder outside the West House; stream only "supposing" | checked | B04 §4.4 | B ok | — |
| 92 | Six-row and two-row barley; two-row fewer (samples 2, 24, 71) | checked | S87m p. 152; Table 5.11 | A ok | Corr. 21 |
| 93 | Xeste 3 barley 23.2%; probably six-row | checked | S87m p. 166 | A/B ok | — |
| 94 | Maslin sample 78: lentil 62.4%, einkorn 26.4% | checked | S87m p. 153 | A ok | — |
| 95 | Emmer only in small quantities | checked | S87m p. 154 | A ok | — |
| 96 | One grain of *T.* cf. *aestivo-compactum* in Pillar Shaft 65N | checked | Birtacha 2008, Table 35.8 | A ok | — |
| 97 | Kitchen pulses; one seed each of bitter vetch, chickpea, cf. faba | checked | Table 35.8 | A ok | — |
| 98 | Small deformed barley; milk-ripe or green crop; Xeste 3 grains larger | checked | S87m p. 153 | A/B ok | — |
| 99 | Few culm bases; uprooting "inconclusive" | checked | S87m p. 202: "the evidence either way is inconclusive" | B ok | — |
| 100 | Short weeds in pulse crops imply uprooting | checked | S87m p. 202 | B ok | — |
| 101 | Six bronze sickles, none in the West House; 21.8 × 2.1 cm | checked | S87m p. 201; S87t Pl. 3: "length 21.8; breadth 2.1" | A ok | — |
| 102 | *Thymelaea* leaves in barley and pulse samples; brushing at winnowing | checked | S87m p. 203 | A/B ok | — |
| 103 | Flax seeds 3.2 × 1.7 and 3.6 × 2.0 mm; add 12–15% | checked (page image) | S87t Table 5.22; S87m p. 164 | A ok | Corr. 22 |
| 104 | Flax only in Delta Δ1a; crop status unknown; sample 40 MBA | checked | S87m p. 162 and the two sample-40 passages | phase B ok | Corr. 22 |
| 105 | 46 coriander fruits, all split, in one sample | checked | S87m p. 164 | A ok | — |
| 106 | Lupin only in sample 40, 7.3% contaminant | checked | S87m p. 162 | A/B ok | — |
| 107 | Garlic at LBA Akrotiri | checked | abstract: "Recent finds of garlic from Late Bronze Age Akrotiri" | A ok | — |
| 108 | Hearth 1 mostly barley awns; chaff as tinder | checked | Birtacha 2008 App. D, n. 7 | A/B ok | — |
| 196 | *Thymelaea* leaves in West House pots; probably seeds in Xeste 3 | checked | S87m p. 170: "we also seem to have seeds" | A ok | — |
| 197 | Leaves read as brushing at winnowing | checked | S87m p. 203 | B ok | — |
| 207 | *Juncus* cf. *subulatus*, cf. *acutus* and wet-ground plants | checked | S87m p. 169 | A ok | — |
| 208 | Fields on water-retentive soils or near a winter stream | checked | S87m p. 198 | B ok | — |
| 211 | cf. *Hyoscyamus niger* in Xeste 3 floor samples | checked | S87m p. 169 | A ok | — |
| 212 | Numerous *Arundo donax* impressions, e.g. shelves, to save wood | checked | S87m pp. 129–130 | A ok | — |
| 244 | Painted crocus: tuft, three petals, purple or red, stigmas 2–4 | checked | Day 2011 pp. 340–341 | B ok | — |
| 245 | Xeste 3 petals faded to brown stalks and red styles | checked | Day 2011: "once-purple petals of the flowers have faded" | B ok | — |
| 246 | *C. sativus* or *C. cartwrightianus* debated | checked | Day 2011 pp. 341–343 | B ok | — |
| 247 | Red stigmas over dark violet petals; Xeste 3 c. 1600 BCE | checked | crocus review: "overtopping the dark violet petals" | B ok | — |
| 260 | Red painted lilies with white-lily buds; early summer | **could not check** | the journal page served a bot check; T3 #29 confirmed the same article on 2026-11-18 | B | — |
| 264 | Delta 2 lilies: mostly three stems; upright stems | checked | Nugent: "in most cases, have three flowering stems"; real stems "usually droop" | B ok | — |
| 265 | Lilies in a veined marble vase on the jambs; white lilies on a pithos | checked | Doumas 2016: "a veined marble flower vase with lilies" | B ok | — |
| 267 | House of the Ladies: clumps of three; blue heads; yellow anthers; mustard ground | checked | Nugent: "a rocky mustard ground line" | B ok | — |
| 268 | Sea daffodils painted over life-size (120 cm), blue, seven stamens | checked | Baumann: "mit 120 cm übernatürliche" (at 120 cm, larger than nature) | B ok | — |
| 274 | "Papyri": clusters of three on an ochre-brown wavy ground line | checked | Doumas 2016: "papyrus plants sprout in clusters of threes" | B ok | — |
| 275 | Venerating monkeys either side of a papyrus-shaped column | checked | Doumas 2016 | B ok | — |
| 280 | Pruned palms in the river frieze | checked | Doumas 2016: "the pruned palm trees" | B ok | — |
| 281 | Palms like date palm or *P. theophrasti*; no palm wood | checked | B04 §1.3.1, §5.4 | B ok | — |
| 294 | Myrtle on fresco fragments and pots | checked | Doumas 2016 | B ok | — |
| 298 | Ivy as a frieze zone and on pots | checked | Doumas 2016: "the fourth with an ivy branch" | B ok | — |
| 302 | Reeds: Xeste 3 "Reed Bed"; most popular wild plant on pots | checked | Doumas 2016: "the most popular are the reeds" | B ok | The same page says some of these vases may be Middle Cycladic survivals. |

**Grade-C rows checked (205).** All are grade C and the grade stands. "checked" unless the Verdict says otherwise.

| # | Verdict | Evidence |
|---|---|---|
| 1, 3, 4 | checked | S87t Table 1.1 (Santorini 229 m), Table 1.2 (temperatures, all 12 match), Table 1.6 (0.9 / 34.2), Tables 1.3–1.4 (Naxos 4.4–20.6; 18.3–32.2) |
| 2 | checked | S87t Table 1.12: "Santorini 62 46 32 20 16 2 2 2 15 21 68 73 362" |
| 5 | checked | S87m pp. 44–45: "a possible warmer air temperature of c.1°C, at most" |
| 19–22 | checked | FE *Olea* (p. 55): every figure as stated |
| 23 | checked | JRC: "8-15 m"; "15-30 small"; "drupe 2-2.5 cm long, black when ripe" |
| 24, 25 | checked | Grillakis 2022 Table 1 "Observed 118 129 140 145"; sites at "45, 315, 340, and 624 m"; "0.36 and 0.40 °C per decade" |
| 26, 27 | checked | Kafkaletou 2021: "MIs ~1, ~4 and ~7 corresponded to green, red and dark purple"; "80 olives corresponding to approximately 100 g"; "4 × 2.5 m … vase" |
| 28–31 | checked | S87m p. 27 (yields; "once or more very 5 years"; "15-18 trees per stremma"); p. 41 ("Olive trees were also very few") |
| 32 | checked | B04 §1.2 |
| 37 | checked | FE *Ficus*: "Spreading, deciduous shrub or small tree" |
| 38–41 | checked (page image) | Ayar 2025 Table 2, Erbeyli rows. The Erbeyli row of each stage sits at the foot of the previous stage's box; read by date order against the other two sites |
| 42 | checked | Marcotuli 2020: breba "ripening in May-June"; main crop "July-September"; profichi, mammoni, mamme |
| 43 | checked | Aydın specification: caprifigs hung "5th-20th June"; "Summer and winter pruning" |
| 46 | checked | FE *Vitis*: "Stems up to 35 m"; "Petals c. 5 mm, pale green" |
| 47 | checked | corr. 14 (right figures, other page) |
| 48 | checked | Grillakis 2022 (grape): "Historical Period 86 92 … 135 154 158 184 192 240" |
| 49 | checked | OENO One 3129, Table 1: "Assyrtiko … Santorini 10 August (5.2) … 1993-2017" |
| 50 | checked | OENO One 4843: "from end of August to early August (1920–2019)"; buds "May 15 to June 15"; kouloura, kladeftiko |
| 51 | checked (page image) | S87t Table 1.24, vines: "3 times … September" |
| 53, 54 | checked | B04 §4.7 (after Davis); FE *Prunus dulcis* (every figure) |
| 55 | checked | Prudencio 2020: "February 1 … April 1"; ripening "first week of September", "August 17". See corr. 9 |
| 58–63 | checked | FE *Q. coccifera*, *Q. ilex*, *Q. pubescens*, *Q. macrolepis*; JRC *Q. ilex* ("blossoming in May-June"; acorns fall "November-January"), *Q. pubescens* ("from March to May"; "September to November") |
| 65–67 | checked | FE *P. halepensis*, *P. brutia*; JRC (20 and 35 m; 6–12 and 10–18 cm; cones 5–12 cm) |
| 68 | checked | Hohenheim report: "12 to 25 metres. Flowering time is from March till Mai" (a student report) |
| 70 | checked | B04 n. 6. See corr. 15 |
| 71–74 | checked | FE *J. phoenicea*, *J. oxycedrus*; JRC (5–8 m; pollen spring or autumn by subspecies; "shaped by the wind"; 10–15 m) |
| 76–78 | checked | JRC *Tamarix* ("4 to 15 m"; "pink or white"); FE *T. smyrnensis*, *T. parviflora* |
| 81 | checked | B04 §4.8 |
| 83 | checked | Cyprus leaflet (Greek): leaves "10-20(-25) cm"; "Ανθίζει από τον Μάρτιο μέχρι τον Απρίλιο" (flowers from March to April) |
| 84, 85 | checked | FE *P. terebinthus*, *P. lentiscus* |
| 86 | checked | Valencia project page: "4-5 m"; "February-June" |
| 109, 110 | checked | S87m p. 38: "barely reaches 30-40 cm"; two barleys before WWII |
| 111 | checked (page image) | Table 1.24, *Hordeum*: "October a"; "manure a (15-30 August)"; "June c"; "in vineyards a" |
| 112 | **wrong** in part (page image) | Table 1.24. Corr. 1 |
| 113 | checked (page image) | Table 1.24 note e: tips "collected around the 15th March and were eaten boiled as greens" |
| 114 | **wrong** in part (page image) | Table 1.24. Corr. 2 |
| 115, 116 | checked | S87m pp. 40–41: "As recently as twenty years ago, the sickle was introduced"; "80-100 sq.m. per hour"; "fairly near the ear"; handle "10 cm. long"; Anafi "nearer the base" |
| 117 | checked | S87m p. 41. Wording, corr. 17 |
| 118 | checked | S87m p. 42: arakas first, then "faki", then wheat, "lastly barley" |
| 119 | checked | S87m p. 203: "…ly May and early June is the time of threshing at Thera today" |
| 120, 121 | checked | S87m pp. 38–39 (crop lists; rotation "tomato/barley/arakas"; barley "in five consecutive years") |
| 122 | checked (page image) | S87t Table 1.25: arakas "c.15 Kg.", "c.10 Kg. if in hot position", "600-300 Kg.", "20-40 times"; barley "c.40 Kg.", "260-780 Kg.", "6.5-19.5 times" |
| 123 | checked | S87m p. 154 (Brumfield: "50% more than wheat") |
| 125, 126 | checked | S87m pp. 162–163 ("sown in late October"; "300-350 mm") |
| 127 | checked | S87m p. 45: wheat "(October 20 to November 25)", harvest "(c. May 15)" |
| 128 | checked in part | S87m pp. 39–40: "when sowing cereals and pulses, a single ploughing is adequate". The fallow clause was not seen |
| 129, 130 | checked | Hesiod (Perseus): "When the Pleiades … are rising, begin your harvest"; "mattock … hiding the seed" |
| 131–135 | checked | Theophrastus VIII.1.2–4, VIII.2.6–7 (Hort): "Lupin is also sown early … straight from the threshing-floor"; "lentil tare pea"; "about forty days"; "in Hellas the barley harvest is in the seventh month, or in most parts in the eighth" |
| 137, 138 | checked | Katsileros 2025: "eleven were classified as six-row barley and one … two-row"; "altitude 24 m"; "mid-November … end of May"; Table 3 heights |
| 139 | checked | Table 3 spike lengths. See corr. 6 |
| 140–143 | checked | Protonotariou 2023 Table 2 and text: landraces 118–159.04 cm; cultivars 83.88–103.87 cm; *Rht* genes; "need straw for their animals"; 107–138 days; ears 7.57–12.27 / 12.67–29.17 cm |
| 144 | checked | Bradová 2005; the source's text slips. See corr. 5 |
| 145 | checked | Hohenheim einkorn: mean 106.71, max 120.03; "very long straw and thus tends to lodging" |
| 146 | checked in part | Feedipedia barley: "up to 50 to 120 cm high"; leaves "up to 25 cm"; grain "0.7-0.9 cm". "Winter crop" not seen |
| 148, 149, 151, 152 | checked | Feedipedia lentil ("60-75 cm"), pea, chickpea ("20 and 60 cm, even up to 1 m"), faba ("1.5-2 m"; flowers "white or white with black/dark purple spots") |
| 153, 154 | checked | Useful Temperate Plants: "20 - 90cm tall"; PMC7697931: sowings 11 November 2016 and 22 December 2017 at Córdoba. See corr. 18 |
| 156 | checked | Cretan Flora: "30-80 cm tall … winged"; corolla "16-20 mm"; pod "30-70 x 5-12 mm, brown"; "Apr-May" |
| 157, 158 | checked | Melamed 2009: "Corolla crimson with violet, lilac"; "March–May (–June)"; pods 52–80 × 8–9 mm; seeds 7.13 × 6.02 × 4.51 mm; Thera, Anafi, Karpathos |
| 159, 160 | checked | EC page: "the first seeds on the 21 December"; PDO text: "approximately 2 mm"; "370 millimetres"; "17,5 °C" |
| 161–163 | checked | Feedipedia grass pea ("up to 60 cm"), white lupin ("1.2 m high"); PMC8619254 ("winter crop and sowing takes place in autumn"; Leros, Crete) |
| 171, 172 | checked | FE *Thymus capitatus* (every figure) |
| 173, 174 | checked | H II pp. 567–568: "copiosissime per totam Graeciam" (most abundantly throughout Greece); "Maio, Sept"; "chlor. Thera p. 19" |
| 175, 176 | checked | BM96 phases 9–11: "vom 10. Juni bis zum Monatsende" (from 10 June to the end of the month); leaf fall mid-August to mid-September |
| 178–180 | checked | FE *S. thymbra*, *L. stoechas*; H II p. 550: "Thera (Heldr.) … Maio, Jul." |
| 181 | checked | H II: *L. stoechas* in Tenos, Kimolos, Melos, Naxos; "Mart. Jul." But see corr. 7 for the form table |
| 182, 183 | checked | FE *Sarcopoterium*; H I pp. 537–538: "chlor. Thera p. 12"; "Apr. Jun." |
| 184–186 | checked | BM96 phases 3, 7, 8 |
| 187 | checked | AGRIS abstract: "seasonally dimorphic subshrub" |
| 188 | checked | Margaris 1977: "a 15% fraction (ORSHAN 1954)"; minimum "in the middle of September" |
| 189 | checked | Cretan Flora: "red, little fleshy berries"; "Mar-May" (weak source, as the report says) |
| 190 | checked in part | AGRIS abstract. See corr. 20 |
| 191 | checked | S87m p. 202 |
| 192–195 | checked | FE *T. hirsuta*, *T. tartonraira*; H III pp. 80–81: *T. hirsuta* "Thera (Weiss)", "chlor. Thera p. 20", "Oct. Maio"; *T. tartonraira* "argenteo-sericeis, persistentibus" (silvery-silky, persistent), "Apr. Maio" |
| 198 | checked | S87m p. 203 (Amorgos thyme rake) |
| 199–202 | checked | FE *Asphodelus*, *A. aestivus*, *A. ramosus*; H III pp. 214–215: *A. microcarpus* "chlor. Thera p. 22", "Jan. Apr." |
| 205, 206 | checked | FE *J. acutus*; H III pp. 280–281: var. *Heldreichianus*, "chlor. Thera p. 23", "Apr. Jul." |
| 209 | checked | H III p. 281: *J. subulatus* "perigonii pallidi" (pale perigon), "Maio, Jul." |
| 213 | checked | GrassBase: culms "200–600 cm"; blades "20–80 cm long; 10–70 mm wide"; panicle "30–60 cm" |
| 214, 215 | checked | FEIS: "2-8 m"; "1-4 cm"; walls "2 to 7 mm"; "12-30 cm"; California and Carolinas months |
| 216 | checked | H III: "In humidis, ad ripas … saepe quoque colitur" (in damp places, on banks … often also planted); "Aug. Oct." |
| 217 | **wrong** in part | Nassi 2011 Table 3 and text. Corr. 4 |
| 222, 223 | checked | BM96 phases 1–2: "Die Winterregen setzen in der zweiten Oktoberhälfte, oft aber erst im Laufe des Novembers ein" (the winter rains begin in the second half of October, often only in November) |
| 224 | **wrong** in part | BM96 §5.1. Corr. 8 |
| 225–227 | checked | BM96 phases 6, 7, 10 |
| 228 | checked | BM96 §5.1 (colours). See corr. 8 for the cause of the yellow |
| 229 | checked | BM96 plot of 9 May 1994: "Höhe der Vegetation 60 cm" (height of vegetation 60 cm); 87 taxa |
| 230 | checked | BM96 §5.3: 1994 "nur wenig", 1995 "gar kein Regen" (little; no rain at all) |
| 231 | checked in part | BM96: *Stipa capensis* "Massenbestände" (mass stands); species list of the plot |
| 233 | checked | BM96 phases 2, 4 (Raus on Thira) |
| 234–237 | checked | S87m pp. 24, 53, 104, 41 |
| 238 | checked | BM96 §2.3 |
| 241–243 | checked | Day 2011 p. 339: "Eighteen of these species are found in Greece"; "bloom in the autumn for only a few days"; "still gathered from the wild, as on Santorini" |
| 248, 249 | checked | crocus review: "*Crocus laevigatus* (Greece mainland and Santorini)"; "daughter corms" |
| 250, 256, 257 | checked | Nugent pp. 4–5: "pure white variety"; *L. chalcedonicum* "flowers in late spring, grows up to one metre" |
| 251, 252 | checked | Cretan Flora: corms "10-15 mm" and "8-15 mm"; "Late Oct to early Jan"; "Oct-Feb" |
| 253, 254 | checked | E31 rows (Kik column) and Appendix: *C. sativus* "Non-established spice crop … Kozani" |
| 255 | checked | Rastegari 2022: "real dormancy … (early May to the middle of January)"; flowering "October-November" |
| 261 | checked | Cretan Flora: tepals "55-70 mm"; "May-June" |
| 262, 263 | checked | E31 Appendix: "native populations are found at least in Pe, NPi, EC and NC"; plate note: "generally in July"; Kik "." |
| 266 | checked | Nugent: "40-60cm high with usually between two and 20 stems"; "late August" |
| 269 | checked | Baumann: "Juli bis September" (July to September) |
| 270, 271 | checked in part | Pouris 2020: "flowering period (June–August)"; leaves "from December to June"; "senescent leaves in July". The 38.6° N not seen |
| 273, 277 | checked | E31 rows: *Pancratium* all regions but NPi; *Cyperus longus* all regions; no *C. papyrus* entry |
| 276 | checked | Nugent: "Papyrus is not native to Greece, but Warren argues…" |
| 282, 283 | checked | B04 §1.2, §1.3.1 |
| 284, 285 | checked | E31: *P. theophrasti* "?" Kik, x KK; note 8 (Vai; "Some additional small groups") |
| 295 | checked | Cretan Flora *Myrtus*: leaves "15-40 mm"; petals "7-10 mm"; berry "8-10 mm"; "(Apr-)June-Sept" |
| 296 | checked | Melito abstract: berries ripen "from November to February" in later populations |
| 297, 301, 305 | checked | E31 rows (*Myrtus*, *Hedera*, *Phragmites*: all regions) |
| 306–313 | checked | §6 |
| 315–318 | checked | §6 |

**Could not check (5):** #232 (Schweizerbart page served nothing), #258 and #259 (the *J. Exp. Bot.* page served a bot check; T3 #30 confirmed them on 2026-11-18), #260 (above), #300 (the FloraVeg factsheet served nothing).

**Not attempted (43):** #6, #7, #79, #87, #90, #91, #124, #136, #147, #150, #155, #164–#170, #177, #203, #204, #210, #218–#221, #239, #240, #272, #278, #279, #286–#293, #299, #303, #304, #314.
- Of these, #79, #155, #169, #170, #204, #218, #279, #292, #293 and #314 are the report's own `[snippet only]` rows.

## 8. Inferred, queried and snippet cells: are they marked in the tables?

The claims mark every snippet row `[snippet only]` and every inference `INFERENCE`: confirmed for every row I read. The tables do less well.

- **Marked in the tables, as in the claims (good):**
  - Form table: thorny burnet's styles and fruit "[weak source]"; giant reed's colour "[snippet only]"; asphodel's leaf cycle "[snippet only]"; bitter vetch's flower "[snippet only]"; the Cretan palm's fruit "[snippet only]"; *Chamaerops* height "[snippet only]".
  - Month table: vine January–February "(inferred)"; barley January–March, November–December "(inf.)"; wheat January, February, December "(inf.)"; thyme January–April "(inferred)"; asphodel May–October "[snippet]"; crocus April "(INFERENCE)"; white lily March–April "(INFERENCE)"; date palm May–June "(INFERENCE)".
  - Section 3: *Cyperus longus* and *Chamaerops* "C [snippet only]".
- **Not marked in the tables (fix: corr. 19):**
  - Olive May–October: no source dates fruit set or the colour by month. Inferred from flowering on 28 April and the November harvest colours.
  - Almond May–July: inferred from FE's fruit description.
  - Barley April ("green ears filling") and September ("stubble or bare, brown").
  - Wheat July–September; and June "cut after barley" rests partly on #170, a snippet.
  - *L. clymenum* July–September "bare or stubble".
  - Pea May–September "bare".
  - Lentil May ("ripe first, pods yellow; pulled") and June–September: the month is Sarpaki's expectation (#124), not a record.
  - Flax May ("pulled before summer heat").
  - *Thymelaea* June–September "leafy, no flowers".
- **Snippet or weak source not said in the table:**
  - Tamarisk February–April and August–October rest on #79 `[snippet only]`. The cells say "?" but not "snippet".
  - Thorny burnet June "fruits ripen, red": the red is from #189, a weak web flora. The form table marks it; the month table does not.
  - Asphodel November and December "leaf clump" rest on the same snippet as October; only October is marked.
- **Section 3 values to fix:** "Einkorn height 73 (Prague)" (corr. 5); "Barley spike length 10.46–13.77" (corr. 6); "Thorny burnet ramet age … 9–11 mean" (corr. 20); "Giant reed … (Pisa, young stand)" (corr. 4); "Almond bloom … 1 Feb–1 Apr" (corr. 9).

## 9. Sources

- **Open, the work cited:** every source named in the Method, at the URL the report gives, except as below.
- **Opened elsewhere:**
  - the FE cultivated-vine treatment (Plazi 03B0402CFEC9E260FEBBF3DAD3ACF122), which the report should cite for #47;
  - the López-Pujol abstract, which opened only over HTTP/1.1.
- **Would not open in this run:** the *J. Exp. Bot.* page (bot check), the Schweizerbart abstract (empty), the FloraVeg factsheet (empty).
- **Not requested:** the report's snippet-only URLs, and the unofficial copy of Morgan 1988, as the report itself declined.
- **Rights:**
  - Plazi treatments: "No known copyright restrictions apply".
  - Pearson et al. 2023 and the Pouris, Zafeiriou and González-Verdejo papers: CC BY.
  - The thesis PDFs are distributed by White Rose eTheses; their reuse terms were not read.
  - The Theran informants named in Table 1.24 are private persons; this check refers to them by letter only.
