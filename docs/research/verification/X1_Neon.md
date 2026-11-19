Comparison of a second X1 report (docs/research/neon/X1_Neon.md, written by Gemini Neon Deep Research) with the adopted world clock, by a separate Claude verification agent on 2026-11-19 (D13).

Method: the Neon report was read in full and compared, row by row, with `docs/WORLD_CLOCK.md`, decisions D15 and D16, and the first check (`verification/X1.md`). Sources were re-opened only where the two differ, or where the Neon report adds something that would change the clock. Every URL in "Works cited" was also fetched once with `curl` to see whether it opens and is the work cited. Where a site refused automated reading, the work was identified through Crossref, Europe PMC, PubMed Central or the publisher's DOI page instead. PDFs were read with `pdftotext`. Quotations are under 15 words; everything else is paraphrase. No visual or engine work was involved.

## 1. Verdict

**On what matters, the Neon report agrees with the clock.** Both put Thera's eruption in the later 17th or earliest 16th century BCE on the radiocarbon evidence, and both keep the c. 1561 BCE and the Egyptian-linked low readings as live alternatives. They agree on the following:
- **The eruption.** Manning 2022 (IntCal20): 1606–1589 BCE at 68.3%, 1609–1560 BCE at 95.4%. Manning's 2024 ranges (via Bruins & van der Plicht 2025) peak near 1608 BCE.
- **The ice cores.** The 1628 BCE layer is Aniakchak II. The remaining candidates are 1611, 1561/1558/1555 and c. 1538 BCE.
- **The Aegean phases.** LH I is 1700/1675–1635/1600 under the high chronology.
- **Egypt.** The Hyksos (Dynasty 15) ruled at Avaris and a Theban line ruled at Thebes.
- **Babylon.** The First Dynasty ends in 1595 BCE (Middle Chronology, which is the clock's hMC), and Kültepe's tree rings confirm the Middle Chronology to within about eight years.
- **Hatti.** Hattusili I reigned c. 1650–1620 BCE and Mursili I after him.
- **Nubia.** Classic Kerma.
- **Crete.** No ruler names; Linear A is undeciphered.

**Neon does not name 1615 BCE.** Its anchor is c. 1650, as the prompt asked. Read at 1615 BCE, its own tables give the same world as the clock: LC I / LM IA on Thera and Crete, LH I on the mainland, the Hyksos at Avaris, a Theban dynasty at Thebes, the last king of Babylon's First Dynasty, the Old Hittite kingdom and Classic Kerma.

**It does not overturn D15 or D16, but two points bear on D16's reasoning:**
- **When the living town ends** (row D1 below). Manning 2022, a paper the clock already relies on, reports soil and plant growth on the earthquake debris that suggests "a period of several years" before the first eruptive phase. It summarises expert estimates of the whole sequence, from earthquake to eruption, as months to several years. The clock instead ends the living town about 20–90 days before the eruption, from the T7 check's reading of the Ministry's wording. The T7 check did not weigh the soil evidence.
- **Whether 1615 is "safely" before the eruption** (row D2). Manning's newest model, opened here in Radiocarbon 66 (2024), gives 1613–1602 BC at 68.3% and 1618–1584 BC at 95.4% (IntCal20). So 1615 lies outside the 68.3% range but inside the 95.4% range. D16's rationale says 1615 falls "safely inside every high-chronology estimate". That holds at 68.3%, not at 95.4%.

**The Neon report is thinner than the X1 report.** It has 65 claims against 91. It could not verify Byblos, Ugarit, Ebla, Hazor, Cyprus's dates and centres, the Khyan lid, Kaptara, calendars outside Egypt and Babylonia, speleothems, Nile floods or museum wording. For Byblos it adds nothing. For Avaris and Babylon it adds a little that is useful (section 3).

**No fabricated source was found.** Every work it cites exists. Its errors are of four kinds:
- **One reversed claim.** In #28 it turns Rutter's account of Marthari's pottery study upside down.
- **One superseded date.** In #63 it dates the Porsuk tree-ring anomaly to 1628 BC; it has since been re-dated to c. 1681–1673 BCE.
- **Two wrong numbers or attributions.** #23 gives LM IB as 1500–1450 where the source has 1530–1450, and #35 swaps two scholars' chronologies.
- **Citation errors.** The author list it gives for Manning et al. 2014 names two people who are not authors and leaves out three who are. One paper is dated 2016 instead of 2012. Several Section 12 titles are descriptions the model made up for real works.

Every number checked otherwise matches its source.

### The world in 1615 BCE: the clock against the Neon report

| Region | Clock (D16, `WORLD_CLOCK.md` §4) | Neon report, read at 1615 BCE | Agree? |
|---|---|---|---|
| Thera | LC I, the living town (high chronology) | LC I / LM IA; eruption 1609–1560 (Manning 2022, IntCal20, 95.4%) or 1618–1584 (Manning 2024, 2σ) | Yes; but see D1, D2 |
| Crete | Neopalatial, LM IA; no rulers known | Neopalatial (Rutter, ca. 1750/1720–1490/1470); no rulers | Yes |
| Mainland | LH I, Shaft Grave era | LH I, 1700/1675–1635/1600 (high) | Yes |
| Egypt, north | Dynasty 15 (Hyksos) at Avaris, 1640–1532 (UEE/Schneider) | Dynasty 15 at Avaris, 1650–1550 or c. 1630–1530 (no Egyptian scheme named) | Yes on who; no on the scheme (D4) |
| Egypt, south | Dynasty 17 at Thebes, 1690–1548 (UEE) | "16th/17th Dynasties at Thebes" plus an Abydos dynasty | Same people, different labels (D4) |
| Babylon | Last decades of the First Dynasty (hMC); king in 1615 not named | Samsu-ditana 1625–1595 (Middle Chronology) | Neon adds the king (A1) |
| Hatti | Mursili I, early in his reign (c. 1620–1590, hMC) | Hattusili I to c. 1620; Mursili I next (no years given) | Yes |
| Northern Levant | Yamhad / Alalakh VII; Byblos autonomous | Aleppo (Yamhad) and Alalakh VII; Byblos, Ugarit and Ebla "could not verify" | Yes, where Neon has data |
| Southern Levant | MB II–III | Middle Bronze Age (LBA from c. 1500 on the conventional scheme) | Yes |
| Cyprus | MC III to LC I | "Could not verify exact dates" | Neon silent |
| Nubia | Classic Kerma, c. 1750–1480 | Classic Kerma, 1750–1480 (kerma.ch) or 1750–1550 (BM via Khan Academy) | Yes |

## 2. Where they disagree

Grades follow `HISTORICAL_STANDARD.md` §3. "Opened" means opened in this run.

| # | Point | Clock (its source) | Neon (its source) | What the sources say | Grade | Proposal for Chad |
|---|---|---|---|---|---|---|
| D1 | **How long before the eruption the town was damaged** | The living town ends with a final earthquake about 20–90 days before the eruption (§1; T7 check's reading of the Ministry's "a few tens of days") | #29: humus and plant colonisation over the earthquake debris suggest "a period of several years"; the whole sequence takes months to several years (Manning 2022) | Manning 2022 (opened, PMC9488803) confirms Neon #29 word for word. It lists five stages: major earthquake; clearance and repair; abandonment; four thin precursory pumice falls; the main eruption. It says the soil and plant growth on the stage-one debris "likely indicates" several years before the precursors, citing Doumas 1990 (elsewhere Limbrey 1990, soil studies). His model's prior for abandonment-to-eruption has a mode of about 2 years, 68.3% between under 1 and 5 years. Rutter (Lesson 17, opened) also has one earthquake, with repairs still under way at the burial, years or decades earlier. The Ministry's tens of days may run from renewed tremors or the abandonment, not from the destructive quake. Doumas 1990 and Limbrey 1990: **could not check** (not online). | B (second-hand; debated among excavators) | Amend §1 "End": the destructive earthquake whose debris was being cleared came months to several years before the eruption (Manning 2022, after Doumas 1990 and Limbrey 1990); the "few tens of days" may measure only the last warning. Add Doumas 1990 and Limbrey 1990 to gap G8. |
| D2 | **Is 1615 BCE safely before the eruption?** | D16: 1615 "falls safely inside every high-chronology estimate". §1 quotes Manning 2022 (1606–1589 at 68.3%, 1609–1560 at 95.4%, IntCal20) and says Manning 2024 calls c. 1611 "more likely" | #11: Manning 2024, as summarised in Bruins & van der Plicht 2025: 1612–1602 or 1613–1602 BCE (1σ), 1616–1589 or 1618–1584 BCE (2σ), peak c. 1608 BCE | Bruins 2025 (opened, PMC12422448) gives these figures exactly. Their source, Manning 2024, Radiocarbon 66:341–370 (opened), gives for the combined models 1613–1602 BC (68.3% hpd) and 1618–1584 BC (95.4% hpd), OxCal 4.4.4, IntCal20. It calls these compatible with the 1611 BC ice-core event. So 1615 is before the eruption in every 68.3% range, but inside Manning 2024's 95.4% range. With D1's months to years of damage, an eruption early in that range would put 1615 in the damaged town, not the living one. | B | Add Manning 2024 (Radiocarbon) ranges to §1 and §3; it is the numerical source behind "c. 1611 more likely". Reword D16's reason: 1615 is before the eruption at 68.3% in every Manning model, but inside the 95.4% range of the newest. **Option (a), my lean:** keep 1615, because the most likely date (c. 1611–1602) still leaves the living town standing. **Option (b):** move the year to c. 1620–1625 for margin at 95.4%. This moves Hatti to the Hattusili I / Mursili I boundary (c. 1620) and Babylon to Samsuditana's accession (1625). |
| D3 | **When LC I began at Akrotiri** | LC I 1700/1675 – 1625/1600 (high), from the Manning 2010 table (X1#26). LM IA lasted 50–120 years. | #27: radiocarbon on Akrotiri samples puts the start of LMC at c. 1820–1790, the start of LC I at c. 1775–1722 and the final destruction at c. 1622–1548 BCE. X1-4: LC I lasted over a century. | Neon's source is Maniatis, Y. 2012, *European Physical Journal Plus* 127:9 (Neon names neither author nor journal). Its abstract (opened at Springer) gives exactly these three ranges. It says LC I began about 100 years earlier than the Egyptian-linked dates. It gives no probability or curve; its reference list cites OxCal 4.1.5 and Reimer 2009, so IntCal09 is likely (INFERENCE). It is a direct radiocarbon estimate on Theran samples, but on a superseded curve. | B | Record Maniatis 2012 beside §2's LC I row as an alternative start, with its curve marked "probably IntCal09". Add that LC I at Akrotiri may be longer than 120 years on Maniatis's dates. No effect on 1615. |
| D4 | **Which Egyptian scheme, and what to call the Theban kings** | UEE/Schneider: Dyn 15 1640–1532; Dyn 17 at Thebes 1690–1548 | Mixes schemes without choosing one. SIP ca. 1750–1550 (Forstner-Müller & Moeller 2018). Hyksos 1650–1550 (a palynology paper) or c. 1630–1530 (Britannica). "16th/17th Dynasties at Thebes" and an Abydos dynasty (#32, #33, #34; Section 5) | The UEE chronology page (opened) lists a 16th Dynasty only as minor Hyksos rulers alongside Dyn 15, with no dates. Bruins 2025 Table 1 (opened) sets out Ryholt's 1997 reconstruction: the Theban kings of the Turin list form a **16th** Dynasty (e.g. Nebiriau I, accession 1627 on Ryholt's dates). Ryholt's 17th Dynasty starts in 1580. The Khyan volume (Forstner-Müller & Moeller 2018, opened) discusses the Abydos dynasty of Senebkay. PMC5802438 (opened) gives the SIP as c. 1650–1550 BC, citing others; it is a pollen study, not a source for dynasty dates. Britannica: **could not check** (403). | B | Keep UEE (D15). In §4, Egypt-south, add a note. In Ryholt's widely used reconstruction the Theban kings of 1615 are the 16th Dynasty, and the 17th begins c. 1580. An Abydos dynasty is also attested. UEE's "Dynasty 16" (minor Hyksos) is the older reading. The label is UEE's; the people are the same. |
| D5 | **Khyan's date** | "Khian's sealings date to c. 1600 (Schneider 2008)" | #36, #37: Bietak places Khyan's seals at Tell el-Dab'a c. 1600–1580. Sealings found with Sobekhotep IV's at Tell Edfu pull Khyan earlier (Section 11, debate 2). | Kutschera et al. 2012 (opened) puts Khayan's seals in late E/1 – early D/3, c. 1600–1580 BC in Bietak's historical phasing. The Khyan volume (opened) confirms the Edfu find. It also gives D. Ben-Tor's reply: the Sobekhotep IV sealings came from older scarabs that were reused, so the two kings cannot be moved closer together. Neon reports the Edfu argument without this reply (Partly). | B (debated) | In §4, Egypt-north, add: Khyan's place in Dyn 15 is disputed (Edfu); attach no year of the window to him. |
| D6 | **The Porsuk tree-ring anomaly** | Not in the clock. X1#80 and the first check: c. 1681–1673 BCE (68.2%), not Thera | #63 and Section 8: 62 logs from Porsuk grew 240% (up to 740%) of normal in 1628 BC, listed under Aniakchak II | Wiener's White Slip paper (opened) says exactly this, citing Kuniholm et al. 1996. Manning et al. 2016 (abstract opened via Europe PMC) re-dates the anomaly to c. 1681–1673 BCE (68.2% hpd), about 20 years earlier than previous estimates, and finds no likely link to Thera. Curve not in the abstract. Neon's figure is faithful to its source, but the date is superseded. | B | None for the clock. Do not use Neon #63. |
| D7 | **Marthari's pottery comparison** | The first check (#29) and T7: Marthari argues for years, perhaps two or three decades | #28: the pottery of the earthquake debris "matches" the destruction horizon (grade A) | Rutter, Lesson 17 (opened): Marthari found significant *differences* between the two groups, suggesting years rather than months. Neon reverses the source. **Not supported.** | — | None. Do not use Neon #28. |
| D8 | **The Çeşme seed** | "Çeşme gives no earlier than 1612 BCE" (§3) | #5: the seed by the victim, 1612–1573 cal BCE, "19.4% partial distribution" | Şahoğlu et al. 2022 (opened, PMC8740722): sample OxA-38858 at 95% is 1612–1573 (19.4%) and 1565–1501 cal BCE (76.1%). The authors say it limits the age to no older than 1612 and also gives ample support to the low chronology. The curve is not named in the main text. Pearson 2022 quotes the second range as "1665 to 1501", apparently a slip. | B | In §3, give the whole distribution, so that the 1612 limit is not read as support for the high date. |
| D9 | **The low reading's figures** | c. 1525–1490 BC (Warren 2010, Wiener 2010, via Cherubini 2014) | #15: c. 1530 BCE (Warren 2009) or c. 1500 BCE (Bietak & Höflmayer 2007). The opening paragraph says a c. 1500 date is "eliminated". | Kutschera et al. 2012, *Radiocarbon* 54:407–422 (opened) gives both figures as stated. It also says none of over 400 pumice samples is Theran before the 18th Dynasty, and that the site's radiocarbon dates run about 120 years older than its historical dates. Neon's own Section 3 keeps the low position as active, so "eliminated" in its opening is an overstatement. | B | Optional: cite Kutschera 2012 beside §3's low row. No change of substance. |
| D10 | **Crete's handbook boundaries** | MM III / LM IA 1700/1675 (high), 1600 (low) | #23 and Section 4: the CUP handbook gives MM III–LM I 1700–1450 and LM IB 1500–1450, and no LM IA boundary | Poursat & Knappett (CUP; publisher's preview opened), in figure captions: MM III 1700–1630, LM IA 1630–1530, LM IB 1530–1450 BC. No chronology is named; this is an intermediate scheme. Neon has LM IB's start wrong and missed the LM IA boundary. | B | None. If wanted, record it as a third, conventional scheme. |
| D11 | **Hittite dates and their labels** | Mursili I c. 1620–1590 (hMC); Hattusili I c. 1650–1620 | #43: Hattusili I c. 1650–1620, Hantili I c. 1585–1560, labelled Middle Chronology. Section 5 says Mursili I reigned in the "early 16th c." | Livius, Hittites (opened) gives Hattusili c. 1650–1620 and Hantili I c. 1585–1560. It puts Mursili's sack of Babylon in 1587 BCE, "according to the low middle chronology". Bryce 2005 (opened copy) has Hattusili I to c. 1620 and Mursili I from c. 1620. Neon's "early 16th c." for Mursili is loose; its labels mix hMC and lMC. Gilan 2018 (opened) confirms the Old Hittite text: Mursili, grandson of Hattusili, destroyed Aleppo. | B | None. Hantili I (c. 1585–1560) can be added to G3 for later use. |
| D12 | **Classic Kerma's end** | c. 1750–1480 (kerma.ch) | 1750–1550 (BM via Khan Academy) or 1750–1480 (kerma.ch) | kerma.ch (opened): Classic Kerma 1750–1480. Global Egyptian Museum (opened): c. 1750–1600 BC. Khan Academy: **could not check** (script wall). None names its chronology. | B | None; all include 1615. |
| D13 | **The southern Levant's MB/LB boundary** | Radiocarbon puts the end of the MBA at c. 1600 | LBA from c. 1500 (#50) | The AJA review of Martin (opened) takes c. 1500 as a conventional start and says it is disputed. These are two schemes; 1615 is in the MBA in both. | B | None. |
| D14 | **What "Low" means for Mesopotamia** | Low Middle Chronology: Babylon falls 1587 | "Low": Babylon falls 1531 (#47; Venus-tablet solutions) | Livius, Mesopotamian chronology (opened), gives High 1651, Middle 1595, Low 1531, Ultra-low 1499; Ammisaduqa 1702–1682 / 1646–1626 / 1582–1562 / 1550–1530. Different schemes, not a conflict. The Cornell release (opened) quotes Manning: only the Middle Chronology is possible, with about eight years left in debate. That fits the clock's hMC/lMC pair. | B | None. |

## 3. What it adds

Only what matters for Thera in 1615 or for Avaris and Byblos.

| # | Addition | Source (opened) | Grade | Use |
|---|---|---|---|---|
| A1 | **The king of Babylon in 1615 BCE: Samsu-ditana**, who reigned 1625–1595, after Ammi-ṣaduqa (1646–1626), on the Middle Chronology (the clock's hMC). The clock says only "the years of the kings between are not verified". | ORACC, "Mesopotamian history: the basics", which states it uses the Middle Chronology. Also the time chart of *The Oxford History of the Ancient Near East*, vol. 2 (Radner, Moeller & Potts, OUP 2022), Neon's source 54: Ammi-ditana 1683–1647, Ammi-ṣaduqa 1646–1626, Samsu-ditana 1625–1595. | B | Add to §4, Mesopotamia: in 1615, Samsuditana (1625–1595, hMC); before 1626, Ammisaduqa. |
| A2 | **The Sealand dynasty, c. 1720–c. 1480,** with Gulkišar at c. 1595. Neon lists the Sealand as "unverified", but its own source 54 has it. | The Oxford History time chart (as A1). Its Babylon dates (1894–1595) show it uses the Middle Chronology. | B | Fill §4's Sealand row: c. 1720–c. 1480 (Middle Chronology); king in 1615 not established. This partly closes G3. |
| A3 | **A cuneiform fragment at Avaris** in 15th-Dynasty levels, pointing to contact with late Old Babylonian Babylonia, c. 1600–1550 BC in Bietak's historical phasing | Kutschera et al. 2012, citing Bietak et al. 2009 | B (one fragment; its reading is the excavators') | Add to §5 as a Babylon–Avaris link. Its date is on Tell el-Dab'a's historical phasing, which runs about 120 years younger than the site's radiocarbon dates. |
| A4 | **Avaris, the late Hyksos precinct (phase D/2):** a mud-brick fortification wall (A), 6.2 m wide, along the Pelusiac branch; a citadel; a stela of Ianassy, son of Khayan. Proto White Slip appears only from D/2. The early-18th-Dynasty platform with Minoan paintings cuts into wall A (#51, #64). | auaris.at, Ezbet Helmi (Bietak) | B | For a future Avaris lane. Phase D/2 is late Hyksos and may postdate 1615 (date it under UEE before use). |
| A5 | **Erdil et al. 2026,** *Radiocarbon* 68:264–280: about 90 annual radiocarbon measurements, 1660–1507 BCE, including oak from Northern Ireland. No compelling evidence of a sudden jump in radiocarbon production; small offsets between species, regions or laboratories. | Cambridge Core, open access (Neon's #7 calls it a "University of Groningen manuscript") | B | Newer than anything in the clock. It does not move the date. Record it in §3's notes. |
| A6 | **A bipolar sulfate event at 1678 BCE** (20 ± 7 Tg S), beside the 1658 BCE event the first check already proposed | Pearson et al. 2022, Table 2 (PMC9802406) | B | Optional, for §4's shared events. It is before the living town. |

Neon's other additions were checked or compared and are true but not needed for the clock:
- the Tell el-Yahudiyeh ware chemistry;
- Kamares ware in Egypt;
- the second Kabri fresco, dated to the 17th century BCE (MB II);
- White Slip above the tephra at Trianda (Wiener, citing a personal communication);
- the Ritner–Moeller reading of the Tempest Stela.

## 4. Sources check

**Fetch results.** Of the 63 "Works cited" URLs, 42 returned HTTP 200 to `curl`, one returned 202 with an empty page, and 20 returned 403. Three of the 200s were bot-check pages, not the work: Khan Academy (18), Scribd (31) and CDLI (40). Source 50 is a scanned printout with no text layer.

| Outcome | Sources (Works cited numbers) |
|---|---|
| **Opened, and it is the work cited** | 3 Manning 2022 (PLOS); 4 Bruins & van der Plicht 2025; 6 Wiener, White Slip volume; 8 Wiener, "A point in time" (Warren Festschrift); 11 Poursat & Knappett, CUP preview; 12 Forstner-Müller & Moeller (eds) 2018, the Khyan volume; 13 PMC5802438 (a palynology paper, not "geology and chronology" as Section 12 says); 14 Livius, Hittites; 15 Bryce 2005; 16 Cornell Chronicle; 17 ORACC; 19 kerma.ch; 23, 24, 49 Rutter (Dartmouth); 25 Manning 2022 (PMC); 29 Livius, chronology; 30 Gilan 2018, *Anatolia* 44; 32 ISAC; 33 Global Egyptian Museum; 35 auaris.at; 36 BAS; 37 Cline & Yasur-Landau, BAR article; 38 AJA field report (2011); 39 Belmonte & Shaltout (opens, but its text layer is garbled); 41 "Babylonian Calendars" (lecture slides); 44 Oxford Handbook pages; 45 Cherubini et al. 2014; 47 and 62 Manning 2024, *Radiocarbon* 66; 51 Mathioudaki 2014; 52 Bronk Ramsey et al. 2010; 54 Oxford History of the ANE vol. 2; 55 Levantine Ceramics Project; 56 AJA review; 57 Kaplan et al. (OSTI); 58 ime.gr; 61 Manning 2024, JGA |
| **Refused automated reading; the work was identified and opened elsewhere** | 1 Pearson et al. 2022, via PMC9802406; 2 Şahoğlu et al. 2022, via PMC8740722; 7 Kutschera et al. 2012, via Cambridge (DOI 10.1017/S0033822200047172); 9 Maniatis 2012, via its Springer abstract (DOI 10.1140/epjp/i2012-12009-y); 26 Bronk Ramsey et al. 2010, via the Vienna PDF (52); 28 Manning et al. 2014, via the Cambridge abstract (paywalled, so the numbers could not be read); 48 Erdil et al. 2026, via Cambridge |
| **Refused; the work was identified through Crossref, but its content could not be checked** | 10 Erdil et al. 2024, *JAS: Reports* 55:104457; 20 Sterba et al. 2009, *JAS* 36:1738–1744; 21 Ritner & Moeller 2014, *JNES* 73:1–19; 43 Alberti, Dionisio & Jasink (eds), *Meaningful Practices* (Firenze UP 2025) |
| **Could not check** | 5 Pearson et al. 2023 (ResearchGate; the work was confirmed in the first check); 18 Khan Academy; 22 Klontza-Jaklova figure (ResearchGate); 27, 42, 53, 59, 60 Britannica; 31 Scribd; 34 ÖAW; 40 CDLI; 46 Semantic Scholar (empty page, then rate-limited); 50 scanned PDF of Rutter, Lesson 18; 63 "Nomads at the Nile" (ResearchGate; listed but never cited in the text) |

**Problems found:**
- **Wrong author list (source 28).** Manning et al. 2014, *Antiquity* 88:1164–1179, is by Manning, Höflmayer, Moeller, Dee, Bronk Ramsey, Fleitmann, Higham, Kutschera and Wild (Crossref; the Cambridge page). Neon's Section 12 adds Kromer and Friedrich and leaves out Höflmayer, Moeller and Fleitmann.
- **Wrong year (source 7).** Neon dates Kutschera et al. to 2016, which is Cambridge's online-posting date. The paper is from 2012.
- **Made-up titles in Section 12 for real works.** Sources 9, 10, 11, 12, 13, 20, 30, 37, 41 and 43 are given descriptions as titles. Two examples: "Comparative Helladic High and Low Chronology Table" for Erdil et al. 2024, and "Old Hittite Historiography and Aleppo" for Gilan 2018. The "Works cited" titles are correct.
- **Broken links in Sections 2 and 12.** These URLs carry the footnote number fused onto their end; the PLOS link, for example, ends "pone.02748353". Copied literally, many break. The "Works cited" list is clean.
- **Copies of copyrighted books on third-party hosts.** Bryce 2005 (15), Burney's dictionary on Scribd (31, its file name points to a pirate library), course-server excerpts from the Oxford Handbook (44) and a scan of Rutter (50). The works are real; the project should cite the published editions, not these copies.
- **Weak sources for dates.** A pollen study (13) and lecture slides (41) are used as authorities for dynasty dates and month names.

**Fabrication: none found.** Every cited work exists. The one quotation that could be checked, "a period of several years", is in Manning 2022 as given. The Britannica headline Neon quotes, "[about 1500 BCE]", could not be checked (403). Every number checked matches its source, apart from these:
- #23: LM IB starts in 1530, not 1500.
- #35: Neon gives Sobekemsaf I at 1619 "after Allen" and Sobekhotep VIII at 1645 "after Franke". In Bruins's Table 1, 1619 is Franke's date and 1645 is Ryholt's; Allen's column has no dates.
- #5: the 76.1% part of the range is left out.
- #63: faithful to Wiener, but superseded.
- #28: the claim reverses its source.

**Chronology labels.** These dates in the report do not name a chronology, or name the wrong kind:
- **Egyptian dates with no Egyptian scheme named:** #20 Ahmose c. 1550/1530; #32 SIP ca. 1750–1550; #33 Hyksos 1650–1550; Section 5's Egypt rows, whose "chronology" column names a pollen paper and Britannica.
- **Nubian dates:** #38, #39, #40.
- **Radiocarbon dates without curve or probability:** #4 and #5 Çeşme (the source's main text names no curve either); #27 Maniatis.
- **Section 4's low LC I start** of "~1675–1622" is the model's own INFERENCE, with no source.
- **#43** labels Livius's dates "Middle Chronology", though Livius uses the low Middle Chronology for the sack of Babylon.

The radiocarbon ranges in #8, #9 and #11 and the ice-core dates (MB19, WD2014, GICC05) are properly labelled.

**Grades.** Neon gives grade A to several second-hand or interpreted claims: #17 (a personal communication relayed by Wiener), #28 (reversed), #29 (Manning's summary of Doumas) and #36 (the interpretation of the Edfu sealings). Under the standard's §3 these are B at best.

## 5. The length test (D8)

- **The prompt and the report.** The pasted prompt is about 9.5 KB and asks for 12 sections. The report is 116,599 bytes, finishes cleanly and ends with a complete "Works cited" list of 63 entries. **All 12 sections are present, in order, and none is cut off mid-way.**
- **Section 2 (Claims): 93 table rows, holding 65 numbered claims** (1–65, none missing). Twenty claims are repeated on extra rows for a second source, as the prompt asked (one source per row). Every row has a URL. The pass mark, "well over 60 rows, each with a source link", is met on rows (93), but only just on distinct claims (65; the X1 report had 91).
- **Section 1** has 15 bullets, the limit.
- **Data rows in the other tables:** Section 3, 13; Section 4, 12; Section 5, 21, with a row for every region of topic C; Section 6, 10; Section 7, 7; Section 8, 9. Section 10 answers all 14 assumptions.
- **Thin or empty parts:**
  - Section 9 gives Byblos one line, "could not verify".
  - In Section 5, the Byblos/Ugarit/Ebla row and the Cyprus row are "could not verify".
  - In Section 6, 3 of 10 rows are "could not verify": the Khyan lid, Kaptara, and Aegean imports.
  - In Section 7, 3 of 7 rows are blank (the Levant, Cyprus, Kerma). Egypt's third season is "truncated", and four Babylonian month names are said to be missing, though source 41 lists all twelve.
  - Section 8 has no speleothem or Nile-flood data.
  - Topic H, museum presentation, is reduced to one Britannica row.
- **Result:** Neon finished the long prompt and the long report with every section, so **on form the length test is passed**. On substance it is thinner than the X1 report. It gives "could not verify" for most of the Levant, Cyprus, the calendars and the environment, and it misses data that sat in its own sources: the Sealand dates, Crete's LM IA boundaries, and the full Babylonian month list.

## 6. Coverage

**Checked against a source opened in this run** (Neon claim numbers):

| Result | Claims |
|---|---|
| Confirmed | 2, 4, 6, 7, 8, 10, 11, 12, 13, 15, 17, 21, 25, 27 (abstract only), 30, 32, 33, 37, 39, 40, 41, 44, 45, 47, 48, 51, 53, 54, 55, 62, 64 (the parts on auaris.at and PMC5802438) |
| Partly | 5 (76.1% omitted); 14 (the abstract's "below 14 ± 5 Tg S" holds, but Table 2 gives V5 as 22 ± 7 Tg S on its default assumption); 16 (the waterborne-pumice caveat is confirmed in Wiener; ">350 samples, a few in SIP contexts" could not be checked); 18 (Proto White Slip from phase D/2 is confirmed on auaris.at; "six examples" was not found); 23; 29 (confirmed as Manning's words; second-hand); 31 (the model used Shaw's reign lengths and gives 1570–1544 BCE; "agrees closest with Shaw" overstates); 35; 36; 43; 50 (the conventional LBA start of c. 1500 and some of the sites are confirmed; the list was not checked site by site); 52 (Aegean-style painting at Tel Kabri, Tell el-Dab'a, Alalakh and Qatna is confirmed. But in the BAR article the bull-leapers and maze are at **Tell el-Dab'a**, from a dump of probably Thutmose III's time (1450 B.C. as printed), not at Kabri. Kabri has a checkerboard floor with Aegean plants. Neon puts the motif in the wrong place.) |
| Not supported | 28 |
| Superseded | 63 |

**Clock rows checked again here:**
- the Manning 2022 ranges;
- Manning 2024, from its own *Radiocarbon* text;
- UEE's Dynasty 15 to 17 rows;
- Manning 2016 on Porsuk and the Middle Chronology;
- the Livius and Bryce dates for Hatti.

**Compared only, not re-opened:** 1, 9, 19, 20, 22, 24, 26, 34, 38, 42, 46, 49, 56, 57, 58, 59, 60, 61, 65. Rows 1, 9 and 26 match figures the first check confirmed.

**Could not check:**
- #3 (the Manning et al. 2014 figures; the full text is paywalled);
- #19 (Ritner & Moeller, *JNES*, 403);
- #20 and #22 (ResearchGate);
- #24 (Erdil et al. 2024, 403);
- #34, #60 and the Britannica parts of #43, #59 and #65 (Britannica, 403);
- #38 (Khan Academy);
- #49 (Scribd);
- #56 (the calendar chapter's text layer is unreadable);
- #58 (CDLI bot wall);
- the >350-sample count in #16 (Sterba 2009, 403);
- the primary sources behind D1: Doumas 1990 and Limbrey 1990, *Thera and the Aegean World III* (not online).

Nothing in this file was adopted. Every proposal above is for the project owner to accept or refuse; neither `WORLD_CLOCK.md` nor any decision was edited.
