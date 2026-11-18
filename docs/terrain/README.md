# The terrain record

How the island of Thera in **1615 BCE** (high chronology, D16) is rebuilt from present-day elevation data: the datasets and their licences, every edit with its claims, every liberty, and how to make the data again. Written for work order 001 (`docs/tasks/001-terrain-and-sea.md`).

Claim references are lane and row (`T1#24`, `T1b#40`, `T1c#7`), used only as corrected in `docs/research/verification/`. The numbers come from `docs/terrain/build-report.json`, which `tools/terrain/build.mjs` writes on every run.

**What this is not.** The heights are a model of the past, not a survey. Where a source gives a number, the model uses it. Where no source does, the choice is a liberty, listed below with its reason. The restored land and the island in the bay are grade C at best (modern reconstruction) in shape, whatever the grade of the claims behind them.

## 1. Datasets and licences

Both licences were read before the data was used (2026-11-18). Research lane T1c checked them independently and reached the same reading (`docs/research/verification/T1c.md`, "Licence verdict"). That is research, not legal advice.

| | Land | Sea floor |
|---|---|---|
| Dataset | Copernicus DEM GLO-30 (instance COP-DEM-GLO-30-F), tile N36 E025, 30 m surface model | EMODnet Digital Bathymetry (DTM 2024), mean depth, about 115 m grid |
| Fetched from | `https://copernicus-dem-30m.s3.amazonaws.com/` (open AWS bucket, no account) | EMODnet's own WCS, `https://ows.emodnet-bathymetry.eu/wcs`, coverage `emodnet__mean`, cut to 36.22–36.60 N, 25.18–25.64 E |
| Licence | Licence for the use of the Copernicus WorldDEM-30 (GLO-30-F, "Full, Free & Open") | CC BY 4.0 |
| Terms read at | <https://dataspace.copernicus.eu/sites/default/files/media/files/2025-06/copernicus_contributing_mission_data_access_v2_cop_dem_licenses.pdf> (the GLO-30-F licence is the last three pages), linked from <https://dataspace.copernicus.eu/explore-data/data-collections/copernicus-contributing-missions/collections-description/COP-DEM> | <https://emodnet.ec.europa.eu/en/terms-use-emodnet-online-services-data-and-data-products> and the record <https://sextant.ifremer.fr/record/cf51df64-56f9-4a99-b1aa-36b8d7b743a1> |
| Allows | Reproduction, distribution, communication to the public, adaptation and combination with other data; worldwide, without time limit, free (articles 3–5) | Copying, adaptation and redistribution, with attribution |
| Requires | The notice for adapted data, the no-liability sentence, no impression of endorsement, and that anyone passed the data is bound to the same (article 6) | Credit to the creator, a link to the licence, a statement that the data was changed; EMODnet's acknowledgement sentence; "not for navigation" |
| Height reference | EGM2008 geoid | Lowest astronomical tide |
| File (sha256) | `Copernicus_DSM_COG_10_N36_00_E025_00_DEM.tif` (`5f6c36e7…22aa2fd`) | `emodnet_dtm2024_mean_santorini.tif` (`b608b5b0…a488ed5`) |

**The embedded terrain data is not under the MIT licence** of the engine around it. `source/src/terrain-data.js`, and the copy of it inside `index.html`, are data derived from these two datasets and stay under their terms. Anyone who redistributes the page must keep the notices.

**Attribution texts.** These are the licences' own words, copied from `docs/research/verification/T1c.md` ("Attribution texts each dataset requires"). The same words are in the generated data file, in the page's menu and in `README.md`.

Land, Copernicus DEM GLO-30 (COP-DEM-GLO-30-F), Licence for the use of the Copernicus WorldDEM-30, article 6:
- (b) the notice for adapted or modified data: "produced using Copernicus WorldDEM-30 © DLR e.V. 2010-2014 and © Airbus Defence and Space GmbH 2014-2018 provided under COPERNICUS by the European Union and ESA; all rights reserved".
- (c) the sentence to add in a licence or legal notice: "The organisations in charge of the Copernicus programme by law or by delegation do not incur any liability for any use of the Copernicus WorldDEM-30".
- (d) and (e), in this record's words: nothing here implies endorsement by the Copernicus programme, and anyone who passes the data on must bind those who receive it to the same terms.

Sea floor, EMODnet DTM 2024, EMODnet terms of use:
- "This data product was created by EMODnet ( https://emodnet.ec.europa.eu/en/ ), and is owned by the EU and licensed under the Creative Commons Attribution 4.0 International (CC BY 4.0) license."
- CC BY 4.0 also asks for a link to the licence, <https://creativecommons.org/licenses/by/4.0/>, and a note of the changes: the data was resampled, cropped, joined to the land and reshaped by the edits below.
- Citation (T1c's wording, not EMODnet's): EMODnet Bathymetry Consortium (2024), EMODnet Digital Bathymetry (DTM 2024), https://doi.org/10.12770/cf51df64-56f9-4a99-b1aa-36b8d7b743a1.
- Not for navigation.

**Open points for Chad** (from the T1c licence verdict): whether a heavily edited reconstruction still counts as "Copernicus WorldDEM-30" (this record assumes it does), and whether accepting the licence needs any step beyond downloading.

## 2. How to make the data again

```sh
node tools/terrain/fetch.mjs        # once: downloads both files into tools/terrain/cache/ (ignored by git) and prints their sha256
node tools/terrain/build.mjs        # writes source/src/terrain-data.js and docs/terrain/build-report.json
node tools/terrain/build.mjs --preview some/folder   # the same, plus shaded-relief PNGs of today, the edits and the result
cd source && npm run build          # then rebuild index.html (also: npm run terrain)
```

- The tools need Node 22 and nothing else. `tiff.mjs` reads the two GeoTIFFs, `lib.mjs` holds the grid and filter helpers, `codec.mjs` writes the compact form.
- **The output is deterministic:** the same two input files and the same `edits.json` give the same bytes (checked twice on Node 22.23.1; the data's sha256 is in the build report).
- The build stops with an error if E4's added volume leaves 9.1–17.1 km³, if Pre-Kameni's summit reaches 260 m or its outline touches land, if the bay leaks to the open sea, or if the page's decoder (`source/src/world.js`) does not give back exactly the grid that was written.
- Every parameter is in `tools/terrain/edits.json`. A new research result changes a number there, not the code.

**The grid.** 640 × 640 cells of 40 m, centred on 36.405 N, 25.405 E: a square of 25.6 km. x is east, z is south, y is up, in metres, and y = 0 is the sea level of 1615 BCE. Each cell has a height and a rock class.

**The compact form** (54 kB, 71 kB as text in the page). Heights are stored in steps of 0.25 m, predicted from the cells already stored and written with an adaptive binary range coder. A coarse 160 m grid covers the whole square. The full 40 m cells are stored only where that grid is land or water shallower than 15 m. The step between storable heights grows with the local slope and with depth. On land the stored grid is within 0.35 m (rms) of the model, 3.5 m at worst on the steepest cliffs. Deep water is the coarse grid interpolated. The page decodes it in its own code at start; nothing is fetched.

## 3. The edits

In the order the build applies them. "Changed" is from the build report.

| # | Edit | Claims | Grade / liberty | Parameters | Changed |
|---|---|---|---|---|---|
| E0 | **Surface-model clean-up.** GLO-30 includes buildings. Inside the outlines of Fira–Firostefani–Imerovigli and Oia, a 3 × 3 opening at the source resolution removes narrow highs. | T1#53, T1 correction 11 | dataset handling | two town outlines | 1,271 source cells lowered, by 2.0 m on average |
| E9a | **Summits at their published heights.** The 30 m data reads both basement summits low. They are raised to Profitis Ilias 565 m (the data's highest cell reads 560.4 m) and Mesa Vouno 369 m (359.9 m in the data), both above today's sea. | T1c#53, T1c#54, T1c correction 3 | B (no survey is named) | radius 260 m and 220 m | +10.2 m and +10.3 m at the summits |
| E1 | **Sea level 3.6 m below today's.** | T1#51, T1#52; alternative T1c#37 | C, and T-L13 | `seaLevelBelowPresent: 3.6` | 5.6 km² of today's shallows become land |
| E3 | **Strip the Minoan eruption deposits.** Thickest along the caldera rim and in the coastal fans; close to nothing on the high basement and on west Akrotiri; elsewhere thin on ridges and steep slopes, thicker in hollows. | T1#24, T1c#1, #7, #8, #9, #11, #12, #19; recorded and not used: T1c#22 | the figures are A/B; the surface is **T-L1** | rim 36 m fading over 900 m; fans 30 m; ridges 4 m, hollows 30 m; never over 55 m (T1c#1); five named zones | mean 15.5 m over 96.5 km²; most 36 m; 1.50 km³ |
| E2 | **Remove the Kameni islands** and everything under their outline. | T1#26–T1#29, T1 correction 8 | B | one outline | 4.1 km² of land, 0.17 km³ above today's sea, highest point 121 m |
| E4 | **Restore the ring island on the caldera side.** The south of today's caldera and the gaps between Thera, Aspronisi and Therasia are land again, with a rim crest at about 260 m and an inner wall falling to the bay. | T1#11, T1#14, T1#20, T1b#51 | C, shape **T-L2** | outline, rim crest (205–260 m), south-west crest, outer coast, wall 430 m wide, erosion model | **13.16 km³ added** (range 9.1–17.1), 44.0 km² of land, highest point 259 m |
| E5 | **The northern bay.** Today's caldera water north of the restored land, as a shallow lagoon. Its north, north-east and east walls are today's cliffs. | T1#2–#4, T1#7, T1#19, T1b#46, T1c#24–#26 | B; depth and south shore **T-L3** | depth 5 m, shelving over 260 m | 41.0 km² of bay (Pre-Kameni included) |
| E6 | **The opening to the sea.** Today's strait between Thera and Therasia is low land again, with one narrow channel through it to the north-west. | T1#9–#11, T1b#49, T1b#52 | **T-L4** | channel 280 m wide, 3 m deep; low ground 45–80 m | counted in E4's volume |
| E7 | **Pre-Kameni** (a modern label), the island in the bay: a low dome of black glassy andesite. | T1#13, T1#15, T1b#19, #39, #40, #42, #43, T1b correction 1 | B/C; shape and height **T-L5** | ellipse 5.46 × 3.8 km, long axis to the south-east; h = H(1 − r³); volume fixed at 2.4 km³ | 2.40 km³, summit 231 m, 16.3 km² |
| E8 | **The Akrotiri terrace.** A gentle slope for the town of work order 002, from a rise at 24 m down to the sea. No harbour is cut: both candidates stay open, the embayment south of the site (T1c#17, #34) and Potamos to the east, where seismics found no bay (T1c#16, T1c correction 4). | T1#32, T1#35–#37, T1b#59, T1c#15–#17, #34 | **T-L6** | radius 330 m, slope 5.5% | 0.38 km²; the ground at the site goes from 13.6 m to 24 m |
| E9b | **Profitis Ilias, checked.** The old basement keeps its shape; E3 strips 0.13 m at the summit. | T1#21, T1b#56, T1c#55 | B | — | summit 568.2 m above the 1615 sea (565 m above today's) |
| rock | **Rock classes** per cell. | T1#23, T1b#43, T1#21, T1b#56, T1#12 | outlines **T-L7** | two outlines, two marble heights | land by class, km²: undivided volcanic 103.8; light-grey andesite 7.8; dark-grey andesite 11.0; black glassy andesite 16.3; phyllite and schist 3.0; marble 3.5 |

The island in 1615 BCE: 145.4 km² of land (91.0 km² today), highest point 568.2 m.

### Notes on single edits

**E3.** No thickness map could be opened (T1c, Gaps). The figures are present-day thicknesses at named places, so the surface between them is a liberty.
- The cap is 55 m, the most reported for the whole pile (T1c#1, T1c correction 1). Another source gives 50 m, recorded in `edits.json` as the alternative. No source gives more.
- The rim value (36 m) sits below the 40 m reported for the rim and the 55 m for the caldera wall (T1c#7), because those are maxima.
- The mean (15.5 m) and the volume (1.50 km³) come out close to what the digitised maps imply: 1.43 km³ on land, about 17 m (T1c#18, #19, the latter an inference).
- The strip never takes more than 80% of a cell's height above the sea, so **the coast does not move** (T-L14). The coastal fans are not part of the 1615 BCE ground (T1c correction 6), but where the shore lay under them is not known.
- **At the town:** a 1978 conference report gives a fall of fine pumice of about 1–2 cm, then an ash fall of about 1–2 m over the town, then the main pumice as a base surge (T1c#22, B, to verify; no author is named for the figures). It is recorded in `edits.json` (`E3.atTown`) and does not set the strip depth, because it conflicts with today's description of metres of first-phase pumice (T1c correction 2). The model strips 20.1 m at the town site, which is its own liberty (T-L1); today's ground there is at 26–40 m (T1c#54).
- Not used: Mavrorachidi's ~25 m, which is depth to bedrock at one core (T1 correction 1); the ~32 m average, an inference (T1 correction 2).
- Archangelos hill (T1#43) has no zone: its position was not checked.

**E4.** How the 13.16 km³ is measured: the volume between the restored surface and today's surface (land and sea floor, in the 1615 datum) over the restored area, including the low ground of E6 and the submarine slope outside the new coast. Of that, 4.76 km³ stands above the 1615 sea. **Gap for the reviewer:** T1#14 rests on an abstract, which does not say how Karátson et al. measured their 9.1–17.1 km³. If they counted only rock above sea level, 4.76 km³ is below their range. The raising of today's caldera floor to the bay floor (9.81 km³) is not counted: that ground was bay, not ring island.

**E5.** The bay is found, not drawn: all of today's caldera water (and the Kameni islands) that can be reached from a seed point without crossing E4's land or E6's low ground. The work order's "north part of today's caldera only" is met by where E4's north edge is drawn: on the Thera side the bay ends 1.7 km south of the latitude of Fira and 1.7 km north of Athinios (T1#19, T1#20).

**E7.** The first-phase vent is "1–2 km west of modern Fira" on Pre-Kameni (T1b#39). In this model the point 2 km west of Fira is on the dome (at 0.79 of its radius); the point 1 km west is in the lagoon beside it. A dome reaching further east would touch Skaros. The work order's paraboloid (5 km across, 245 m) fills the bay almost from wall to wall, so the dome here is an ellipse with a flatter top (exponent 3), which keeps open water on every side at the same volume.

**Rock classes: one departure from the work order.** The order lists phyllite and schist at Athinios. T1#21 has that basement cropping out *in the caldera wall* at Athinios, and T1#20 says the eruption's collapse exhumed that wall. In 1615 BCE it lay under the restored land, so no phyllite is drawn there. It is drawn on Profitis Ilias and Mesa Vouno, below the marble.

## 4. Liberties

Departures from the evidence, or choices where there is none. Chad's session records the ones it accepts in `docs/HISTORICAL_STANDARD.md` §6.

| # | Liberty | Why | Where |
|---|---|---|---|
| T-L1 | The thickness of the eruption deposits between the places where it is measured. | No thickness map could be opened; without stripping, the land of 1615 BCE would wear the eruption's ash. | E3 |
| T-L2 | The shape of the restored ring land: a membrane between the surviving land, a rim crest and an outer coast, then a stream-erosion model for gullies. | Its volume range and rim height are sourced (T1#14, T1b#51); its surface is gone. | E4 |
| T-L3 | The bay's depth (5 m), its south shore, and Therasia's east cliffs as its west wall. | "No more than a few metres" (T1b#46) is contested and no outline is published. | E5 |
| T-L4 | The channel's width (280 m), depth (3 m) and course, and the height of the low ground beside it. | Only "low, narrow, if any" and the upper bound of 1 km are sourced. | E6 |
| T-L5 | Pre-Kameni's outline, profile, height (231 m) and lava-flow relief. | Only its volume, rock and rough position are published. Its summit is kept below the rim (T1b correction 1). | E7 |
| T-L6 | The form of the terrace at Akrotiri. | The town needs ground to stand on in work order 002; the buried surface there is not published. | E8 |
| T-L7 | Every rock-class boundary, and marble above 240 m (Profitis Ilias) and 150 m (Mesa Vouno). | The claims name places, not boundaries. | rock map |
| T-L8 | **Every colour:** rock, soil, sand, the pale floor of the bay, the water. The banding of the volcanic cliffs uses the red, blue-black and ochre of the rocks in the Akrotiri miniature frieze. | No source gives a colour. The frieze is grade B (shown, not found), and its banded rocks are also an Aegean painting convention (T1b §3b). | `source/src/shaders.js` |
| T-L9 | The day: late May (the sun at ecliptic longitude 65°), with the Earth's tilt of the time, 23.89°. Time is local solar time. | The season is open between spring and early summer (T3). The tilt is computed from Laskar's 1986 series and is not from a research lane. | `source/src/world.js` |
| T-L10 | Calm mornings and a north breeze that builds through the afternoon. | Today's summer Etesians carried back (T1#50, grade C). | `WIND` in `world.js` |
| T-L11 | The amount of haze. | A clear Aegean summer day was chosen; nothing dates the air. | `BM` in `world.js` |
| T-L12 | The stars are a random field, and there is no moon. | The real sky of 1615 BCE needs a star catalogue and precession: a later order. | `W_SKY` |
| T-L13 | Sea level 3.6 m below today's, and the land and sea-floor data joined with no offset between their height references. | Two estimates disagree (3.6 m and under 0.5 m) and neither is measured on Santorini (T1c sea-level note, correction 12). It stays a parameter. | E1 |
| T-L14 | The coastline is today's, moved only by the sea-level change. The sea floor is today's too. | The pre-eruption coast is not known, and the harbour has not been found. | E3, E8 |
| T-L15 | Detail finer than the 40 m data: gullies and spurs on slopes, ledges on cliffs, blocky lava on Pre-Kameni, sand waves under water. | It has zero mean, stays within a few metres, and fades out at the shore, so it does not contradict the data. | `W_BAKEH` |
| T-L16 | The ground is bare. | Plants come in a later order. The island was not bare: Akrotiri's charcoal shows oak, pine and olive (T1#46, T1#47). | — |
| T-L17 | The night is far brighter than starlight, and the water's clarity, colour and light shafts are the original engine's. | So that the island can be seen at night; the water was tuned for beauty upstream. | `setSun` in `main.js`; `S_G` |

## 5. What was looked at

Claude (Fable 5.2) looked at these pictures on 2026-11-18, from `checks/views.mjs` and from extra screenshots taken the same way. **Chad has not looked yet.** The views are at <https://claude.ai/artifact/EAM2iAgZHr4toJ39qt9C9L>.

| View | What it shows | What was seen |
|---|---|---|
| 1 | The Akrotiri terrace from the sea to its south | Open sea with a light chop and sky reflections; low tan slopes rising from a dark shore, a higher hill to the left. The terrace reads as a gentle slope. Nothing marks the town site yet. |
| 2 | The north bay and Pre-Kameni from the ring rim | Pale turquoise lagoon; the black dome filling its middle, darker water around its shore; the surviving northern walls beyond; the restored wall and a narrow beach below the camera. The dome's surface is plain from here. |
| 3 | High above the whole island, looking north | The whole ring with its bay, the dome and the channel to the north-west; gullied restored land in the south-west; Profitis Ilias pale to the east; deep blue sea, haze at the horizon. The patches of red and dark soil look spotty from this height. |
| 4 | Profitis Ilias summit, looking across the island | Pale marble ground in front, the island falling away to the bay and Pre-Kameni 8 km off, sea glitter to the west. |
| 5 | Sea level inside the bay | Clear green-white water over the pale floor with moving ripples; the black dome low and wide ahead; a tan slope with faint banding to the right. |
| 6 | Under water off the south shore | Dark sand floor with soft relief, light shafts, the rippling surface overhead with the sun broken into bright patches, drifting specks. |

Also looked at: dawn, noon, golden hour, dusk and night from views 1, 2, 4 and 5; the camera just above, at and just below the surface in the bay; the ground from 3 m up; the menu; one set of views each on Low and Medium detail; and nine frames from the 2-minute fly-through in `dev.html`, which ran at 60 fps with no late frame and showed no seam between the terrain's rings.

**Not checked by anyone:** the scene in motion (that the terrain's levels of detail blend without popping was reasoned out and seen only in stills), touch controls on a real device, and the sound.

**Known weaknesses:**
- The land is bare and reads as desert.
- The restored southern wall is a slope with gullies, not a cliff like the surviving walls.
- The low ground of E6 still has some straight edges.
- Shadows come from one map of the whole island (9 m texels), so they are soft up close and shorten by tens of metres at golden hour.
- Terrain above the water is not drawn through the surface when the camera is under it.
