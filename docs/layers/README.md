# The layers and the date

How the world shows what is known and what is added, and how its date moves. Written for work order 004 (`docs/tasks/004-layers-and-time.md`) on 2026-11-21. The decisions behind it are D31, D38 and D41 (the layers and their fade), D33, D34 and D36 (the date and the year), and D42 and D43 (who it is for, and the door kept open for use at the site and in a headset).

**What this is not.** The layers sort what the world already holds; they add no evidence. The Found layer is not a picture of the excavation as it stands today: it draws the excavated buildings whole (liberty L-L1). The wave a change spreads as is a way of showing, not history (L-L2).

## 1. What each layer shows

Three layers, each adding to the one before (D31). Their names and lines are Chad's (D38).

| | Found | Inferred | Imagined |
|---|---|---|---|
| The menu's line | "Only what was dug up, where it was found" | "Adds what the evidence points to" | "Adds what brings the place to life" |
| The land's form: every terrain edit, and the ground detail | shown | shown | shown |
| The land's colours: rock, soil, sand, the banded cliffs, the sea floor (T-L7, T-L8) | plain | shown | shown |
| The sea, the sky, the sun, the weather | shown | shown | shown |
| The excavated buildings, the two terraces and the pithos | shown whole, plain | coloured | coloured |
| The paving and the street shade beside them | shown, plain | shown | shown |
| The buildings reconstructed inside the plan, and the town built by rule (A-L1, A-L11) | hidden | shown | shown |
| The paving and the street shade beside those | hidden | shown | shown |
| Things made for the experience | hidden | hidden | nothing exists yet |

- **The world opens in Inferred**, which is the world as it was before this order.
- **Imagined holds nothing yet.** Its button is in the menu, greyed and marked "to come", and the `K` key passes it by. The engine carries the value 2 all the same, and the page was run in it: it draws what Inferred draws.
- **Plain** is unpainted: the convention of a plaster model on its base. Since Chad's first look (2026-11-21) there are two plain tones, one for buildings and a deeper one for the land and the sea floor (§6); the order had asked for one. They replace every colour that is a liberty: rock, soil, sand, the sea floor seen through the water, walls, roofs, timber, stone. The patterns that go with those colours go too: joints, courses, render, the sheen of lava and of wet shingle. Light, shadow, haze, the sky's reflection and the ground's fine relief stay, so the form still reads. The light the ground throws back onto walls takes the plain tone as well.
- **Paving in Found.** That the rebuilt streets were paved with flagstones is sourced (T2#11); the look of the flagstones is not (A-L2, A-L14). So in Found the paved ground has the land's plain tone, a fifth darker, with no joints: enough to tell a street from the open ground.
- **The edge of the excavated walls** (key `L`) works in every layer.
- **The sea, the sky and the weather** are conditions of seeing, not things, and are in every layer.

## 2. How a thing gets its layer

A thing's layer follows from what it already carries. Nothing is picked by hand.

| Thing | What it carries | Layer |
|---|---|---|
| A building | Its status in the town's data, `excavated` or `reconstructed` (`docs/town/README.md` §2: from the share of its outline that stands on walls the plan draws, or fixed by the record) | excavated: Found. reconstructed: Inferred |
| The two terraces, the pithos | Drawn on the plan (T2b#47, T2#53) | Found |
| The land's form | The terrain edits, each with its claims (`docs/terrain/README.md`) | every layer (D31) |
| A colour, a material's pattern | Liberties T-L8 and A-L2: no source gives one | Inferred; plain in Found |
| The paving and shade of a street | The buildings beside it | with those buildings |

In the page a building's layer is one bit of its data (`exc`), and the table below is built from it at load.

## 3. How it works

**Three numbers.** Every shader gets the layer (0 Found, 1 Inferred, 2 Imagined, moving smoothly during a change), the year BCE, and the day of the year (`g.ly` in the per-frame block, with how sharply the wave spreads). JavaScript holds the same three in `F[LAY]`, `F[YEAR]` and `F[DAY]`.

**One visibility function**, the same text in every shader stage (`vis()` in `source/src/shaders.js`): a thing's layer with its turn in the wave, the first and last year it stands for, and its first and last day of the year give one number, 0 hidden to 1 shown. JavaScript has the same sum for the buildings (`showAll()` in `main.js`), worked out only when a number has moved, and collision reads it.

**Every corner of the town carries its building's number**, in the 32 bytes it already had: the wall's length went from a 32-bit number to 16 bits (in 2048ths of a metre; the longest wall is 26.5 m, and the greatest error is 0.24 mm) and the number took the other 16. **A table has a row a building**: its layer, its turn in the wave, the first and last year it stands for (a uniform block of 8 kB; nothing is stored in the page for it but the turns). The vertex shader reads the row; a hidden building is dropped there, before any pixel of it is worked out.

**The fade is a per-pixel dither** (D41): a thing shown by the share *v* is drawn in the pixels where a fixed pattern over the screen is below *v*, and leaves holes elsewhere. Nothing is sorted or blended. It is the same on High, Medium and Low. The pattern is fixed to the screen, not to the surface.

**The wave.** Each thing has a turn, 0 first to 1 last. While the layer moves from 0 to 1, a thing with turn *t* is shown by the share `clamp(4 × layer − 3 × t)`: each thing takes a quarter of the change, and the later its turn, the later it starts. Going down a layer is the same movement backwards, and a change can be turned round at any point with no jump, because every thing is shown by where the one number is.
- **A building's turn is data**: one byte a building in the town's data, written by `tools/town/build.mjs` from the rule in `tools/town/town.json` (`layers.wave`). Today the rule is distance from the excavated centre (x −131.9, z 5935, the centre of the excavated buildings' ground), the same for every part of one building; the furthest building, 462 m off, has turn 0.8. When the order of the excavation is known (D44, research lane T8), the turns change and the page does not.
- **The land's turn** is worked out in the shader from the same distance. Beyond the town it runs from 0.8 towards 1, so the colours reach the far end of the island as the change ends.
- **The colours** of the land, the sea floor and the excavated buildings come with the wave, each place by its turn. They are mixed in smoothly, not dithered: nothing appears or disappears there, so there is nothing to draw holes in.
- **The paving and the shade of a street arrive with its houses.** The town's plan is two maps now. The second holds where the found buildings stand, how far their nearest wall is, and for every place the turn of the nearest building; the ground's shader mixes the found-only plan into the whole one by that turn.

**Two pipelines.** The town is drawn by an opaque pipeline whenever nothing is fading, and by one whose shader may discard only for the frames of a fade; its shadow map likewise. A shader that may discard costs the GPU its hidden-surface removal even when it discards nothing (work order 003). At rest in Found only the found things are drawn at all: their triangles come first in the index buffer.

**Shadows follow** through the same pattern: the town's shadow map is drawn again on every frame of a fade, and a fading building's shadow is drawn through the holes, which the shadow filter turns into a paler shadow. Low detail reads the shadow map once a pixel, which showed the holes as blotches on the paving; so for the frames of a fade only, Low reads it nine times as the other levels do.

**Collision follows what is shown.** A hidden building is not there. One that is part shown stands part of its height: a viewer on its roof is let down as it goes, and one standing where it comes is lifted with it (choice 3 below).

**The controls are functions**: `setLayer(n)`, `setDay(d)` and `setYear(y)` in `main.js`. The menu's rows and the keys call the first two; nothing in the released page calls the third. Another kind of input (a link, a headset's controller) can call them the same way.

**The year** has its plumbing and no control (O20). Every building's row stands for the whole span, so nothing changes with the year. In the development build only, four buildings are given years by dice and the `U` and `I` keys move the year, to show that it works: they fade out and in as the year passes their dates.

## 3a. The date

**A day of the year the viewer can move** (D33): the menu's Date row is a slider that a finger can drag, with the date it stands at and four marks to jump to, the two equinoxes and the two solstices; the `[` and `]` keys step a week back and on, and keep going while held.

- **Which calendar.** The day is counted from the spring equinox, 0 to 364, and named as today's calendar names that time of year: day 0 is "20 Mar", and the world opens on "25 May" (the sun 65° along its yearly path, as before the date could be moved: T-L9). **These are seasonal dates, not dates in any calendar of the time.** The page shows no Julian date and names no ancient month; the menu's notes say so. The computed calendar belongs to the sky order.
- **The sun follows the day**: its height at noon and the length of the day, with the tilt the engine already used (23.89°, T-L9), in local solar time. At Thera's latitude the day runs from 9.5 hours at the winter solstice to 14.5 at the summer one.
- **The named moments follow the sun.** Dawn, Golden and Dusk were fixed solar hours, set for late May. Each is now the hour at which the sun stands as high as it did at that hour in late May: 1.6° up for Dawn, 8.6° up for Golden, 4.0° below the horizon for Dusk. So each has the same light all year, and in late May each is the hour it was (5.02, 18.35, 19.5). Afternoon keeps its share of the time from noon to sunset (15.7 in late May, 14.5 at midwinter). Noon and Night stay at 12 and 23.5. If the hour is at a named moment when the date moves, it stays with that moment.
- **The date glides**, the short way round the year, and the shadow maps are drawn again while it does, as they are when the hour moves.
- **Only the sun follows the date.** The wind (T-L10), the haze (T-L11) and the sea do not, and the ground is bare all year (T-L16). No winter is invented: no rain, no cloud, no green. The day of the year reaches every shader with the layer and the year, and the visibility function takes a thing's days, so that what grows can follow it when plants come (work order 005).
- **The year** is beside it in the same block, with no control (§3).

## 4. Liberties

New with this order. The integrator enters them in `docs/HISTORICAL_STANDARD.md` §6.

| # | Liberty | Why | Where |
|---|---|---|---|
| L-L1 | **The excavated buildings stand whole in the Found layer**: full height, with roofs, parapets and every opening the town's rules give them. | The height each wall survives to is not published (O8), so what was found cannot be told from what was restored above it. Found is "what was dug up, where it was found" in plan, not in elevation. | every excavated building |
| L-L2 | **The wave.** A change of layer spreads outward from the excavated centre by distance, the town first and then the land. | A way of showing, chosen by Chad (D41). It is not the order in which the site was dug (D44 will replace it with that order, once lane T8 is checked) and not a claim about how the town was built. | `tools/town/town.json` (`layers.wave`); `turn()` in `shaders.js` |
| L-L4 | **The sun goes round its yearly path at an even pace**, counted from the spring equinox. | The true pace is uneven (the Earth's orbit is not a circle), so the true sun is ahead of or behind this one: by today's orbit by up to about four days, at the autumn equinox. The orbit of 1628 BCE differed again. The sky order computes the sun's place for the date and ends this liberty. | `declAt()` in `world.js` |
| L-L3 | **The plain tones**: one for buildings, a deeper one for the land and the sea floor, and paved ground a fifth darker than the land. | Tones have to be chosen; none is evidence. Two, because one pale tone over land and sea floor washed out the water (Chad, 2026-11-21). The darker paving keeps a sourced thing (flagstones, T2#11) visible without its unsourced look. | `TONE`, `TONEB` in `main.js` |

## 5. Flat-screen effects (D43)

The world is to be used in a headset later (`docs/ARCHITECTURE.md` §12). Everything this order added or touched that is worked out from a pixel's place on the screen:

| Effect | Where | In a headset |
|---|---|---|
| **The dither of a fade** | `holes()` in `shaders.js`: the one place a fade reads the pixel's place | Each eye would get its own pattern, and the holes would not line up between the eyes. It needs a look on a device before it is relied on |
| The same dither in the town's shadow map | `fsS`, through `holes()` | Not a screen effect: it reads the shadow map's own texels, which are the same for both eyes |

Nothing else new reads the screen. The plain tone, the wave and the colours are worked out in the world's own metres. New shader code takes its view and projection from the engine's one camera block (`g.vp`, `g.cam`). True scale and place are untouched: nothing moves the origin or the metres.

## 6. The choices put to Chad

Three choices are Chad's (work order 004, "Choices for Chad"). They are on one page, each defined, with its options side by side, its cost, its drawback and a recommendation: **Thera Layers 004**, <https://claude.ai/artifact/3iJQ1P5ceCnhF53g5kmEJB> (private). The recommendation is built into the released page, so nothing waits on the answer.

| Choice | Options | Built | Where |
|---|---|---|---|
| 1. The plain tones of Found | Plaster buildings on stone (a warm grey land, a third deeper than Plaster); on card (a darker neutral); or on slate (a blue-grey) | Plaster on stone | `TONE` (land and sea floor), `TONEB` (buildings) in `main.js` |
| 2. How long the wave takes to cross the town | 3, 5 or 10 seconds (the whole change, to the far end of the island: 5.0, 8.3 or 16.7 s; timed at 5.3, 8.7 and 17.0 s with its last shadow map) | 5 seconds | `CROSS` |
| 3. A viewer standing where a house appears | lifted to its roof; or left inside it, the house not solid for them until they walk out | lifted | `LIFT` |

**Choice 1 was put twice.** The first three options were single tones: Plaster (a warm off-white), Clay (a pale earth) and Grey. Chad set all three aside on 2026-11-21: "I like the Plaster but that makes the water and land looked washed out and my husband likes the Clay but it's so much like the regular ground." The three options in the table answer that: the buildings keep Plaster, and the land and sea floor get a deeper tone of their own, so the shallows are not milky and the ground is not a colour the regular ground has. Nine candidates were looked at from the air, from over the coast and from high above the island; a green-grey was dropped because it reads as plants, and terracotta buildings because they read as painted. Choices 2 and 3 are not answered yet.

**Three clips of the wave**, at 3, 5 and 10 seconds, are on the chooser page under choice 2 since 2026-11-21, because Chad was away from the Mac and could not run the page. Each is the page itself, recording its own canvas while the layer changed from Found to Inferred at view 9 (the browser's MediaRecorder; 960 × 488 pixels and 30 frames a second, so that the files are 0.7 to 1.5 MB). The page ran at 60 frames a second during each, with no frame over 19 ms. Claude checked that each plays from start to end and looked at single frames from them; it cannot judge the motion. They are not in the repository.

In `dev.html` (`cd source && npm run build:dev`) a panel at the foot of the screen names each choice and the option in force, in words; a click on a line, or the key shown beside it (`Z`, `V`, `C`), goes to the next option.

What each option costs, as far as it could be measured: the tones and the two rules for a viewer make **no measurable difference** (a tone is three numbers in a uniform block; the rule is one comparison in JavaScript). The three durations were timed once, from over the roofs (view 9) on High: the 3-second wave averaged 9.3 ms of GPU time a frame against 7.0 ms for 5 seconds and 6.8 ms for 10, with the page at rest at 6.1 to 7.9 ms. A brisk wave has more houses part shown at once; between 5 and 10 seconds there is no measurable difference.

## 7. Measurements

**Every time is this Mac's** (Apple M4, Chrome 157 headless on the Metal adapter, a picture of 1600 × 812), which flatters. **No iPad has been measured**, and no fallback for slower devices was built. The Mac was in use by other sessions while these ran, and its GPU changes speed with load, so two runs of the same state differ by a millisecond or more: **a difference under about 1 ms is noise**, and where runs disagree both are given.

How: `tools/town/layers.mjs` drives the development page built without work order 003's prototypes (`node build.mjs --dev --only none --out dev-none.html`), once for each detail level. The page's resolution scaler is held at full size, so a slower state shows as more milliseconds and not as fewer pixels. GPU time is the engine's own timestamp queries, from the water pass to the final composite. It was run three times on 2026-11-21. The first run is set aside for the tables: other commands were running on the Mac beside it. Its stalls are listed below with the rest.

### At rest

The frame rate was 60 in every state of every run (the lowest mean over 2.5 s was 58.1). The first column is the page of `main` before this order, timed the same day in the same way, twice (it has a little less land: Part A).

**High detail** (GPU ms a frame; two runs each)

| view | `main`, before this order | Found | Inferred | Imagined |
|---|--:|--:|--:|--:|
| 1 | 8.38 / 8.71 | 10.32 / 7.22 | 9.66 / 6.86 | 9.59 / 8.13 |
| 2 | 8.14 / 8.25 | 6.35 / 6.99 | 6.77 / 7.30 | 6.69 / 7.08 |
| 3 | 8.39 / 8.91 | 8.48 / 7.90 | 8.76 / 8.32 | 8.65 / 8.45 |
| 4 | 6.69 / 6.97 | 6.28 / 6.27 | 6.61 / 6.56 | 6.59 / 6.84 |
| 5 | 9.10 / 9.00 | 7.90 / 8.10 | 8.68 / 8.31 | 7.15 / 8.14 |
| 6 | 8.20 / 8.28 | 6.63 / 7.60 | 6.76 / 7.91 | 6.71 / 8.30 |
| 7 | 3.92 / 3.92 | 4.71 / 4.27 | 4.41 / 3.96 | 4.19 / 4.01 |
| 8 | 3.75 / 3.79 | 4.15 / 4.17 | 4.17 / 4.15 | 4.08 / 4.03 |
| 9 | 6.23 / 6.43 | 8.06 / 8.80 | 6.02 / 6.76 | 6.44 / 6.88 |

**Medium detail** (GPU ms a frame; two runs each)

| view | `main`, before this order | Found | Inferred | Imagined |
|---|--:|--:|--:|--:|
| 1 | 9.96 / 7.38 | 8.13 / 9.22 | 8.46 / 9.56 | 8.56 / 9.40 |
| 2 | 7.49 / 6.75 | 6.74 / 7.04 | 7.35 / 7.62 | 7.20 / 7.46 |
| 3 | 8.79 / 6.95 | 8.47 / 8.90 | 9.07 / 9.43 | 9.10 / 9.08 |
| 4 | 6.64 / 6.55 | 6.34 / 6.97 | 6.82 / 7.32 | 6.56 / 7.23 |
| 5 | 9.90 / 6.76 | 9.35 / 10.01 | 9.45 / 10.12 | 10.08 / 9.88 |
| 6 | 7.68 / 6.56 | 7.17 / 8.01 | 7.36 / 8.20 | 7.68 / 8.29 |
| 7 | 4.30 / 4.44 | 4.54 / 5.02 | 4.11 / 4.84 | 4.16 / 4.78 |
| 8 | 4.05 / 4.35 | 4.58 / 5.06 | 4.55 / 4.80 | 4.35 / 5.06 |
| 9 | 6.03 / 6.61 | 6.74 / 6.67 | 6.36 / 6.40 | 6.44 / 6.43 |

**Low detail** (GPU ms a frame; two runs each)

| view | `main`, before this order | Found | Inferred | Imagined |
|---|--:|--:|--:|--:|
| 1 | 4.64 / 5.41 | 4.92 / 3.84 | 5.22 / 4.32 | 5.21 / 4.35 |
| 2 | 4.33 / 4.23 | 3.60 / 3.10 | 4.27 / 3.46 | 4.42 / 3.46 |
| 3 | 5.51 / 5.59 | 5.97 / 4.67 | 6.20 / 5.10 | 6.05 / 4.99 |
| 4 | 3.52 / 3.27 | 2.89 / 2.95 | 3.34 / 3.26 | 3.23 / 3.37 |
| 5 | 4.48 / 4.19 | 3.85 / 4.14 | 4.25 / 4.43 | 4.41 / 4.30 |
| 6 | 4.47 / 4.14 | 3.89 / 3.98 | 4.33 / 4.24 | 4.25 / 4.50 |
| 7 | 2.93 / 2.77 | 2.55 / 3.06 | 2.80 / 3.46 | 2.78 / 3.38 |
| 8 | 2.72 / 2.50 | 2.21 / 2.78 | 2.60 / 3.18 | 2.55 / 3.18 |
| 9 | 3.29 / 3.08 | 3.96 / 3.88 | 3.20 / 3.64 | 3.50 / 3.48 |

- **At rest the layers cost nothing measurable.** Inferred and Imagined are within the noise of `main` at every view and level.
- **Found is not cheaper, and from over the roofs it is dearer**: 8.1 to 8.8 ms against 6.0 to 6.8 on High at view 9. Work order 003 found the same: the bare ground costs more to shade than the houses that covered it. Elsewhere Found is the same or a little less.
- **Imagined draws what Inferred draws**, as it should: it holds nothing yet.

### During a change of layer

Every frame from the change to its end, 8.6 to 8.7 s, at the three town views.

| view, change | detail | GPU ms added to the two layers' mean at rest | highest GPU ms of a frame | frames a second | lowest over any half second | slowest frame, ms |
|---|---|--:|--:|--:|--:|--:|
| 7, Inferred to Found | High | +0.70 / +0.65 | 8.1 / 9.0 | 60.0 / 60.0 | 59.7 / 59.7 | 18.8 / 20.0 |
| 7, Inferred to Found | Medium | +0.42 / +0.59 | 7.6 / 10.6 | 60.0 / 60.0 | 59.8 / 59.7 | 18.5 / 18.9 |
| 7, Inferred to Found | Low | +0.76 / +0.55 | 6.8 / 6.2 | 60.0 / 60.0 | 59.8 / 59.9 | 18.6 / 17.6 |
| 7, Found to Inferred | High | +0.66 / +0.81 | 7.6 / 8.1 | 60.0 / 60.0 | 59.7 / 59.7 | 18.8 / 18.9 |
| 7, Found to Inferred | Medium | +0.38 / +0.71 | 7.4 / 9.8 | 60.0 / 60.0 | 59.9 / 59.8 | 17.7 / 18.8 |
| 7, Found to Inferred | Low | +0.72 / +0.47 | 6.8 / 5.2 | 60.0 / 60.0 | 59.7 / 59.9 | 18.9 / 17.6 |
| 8, Inferred to Found | High | +0.42 / +1.13 | 7.5 / 8.7 | 60.0 / 60.0 | 59.7 / 59.9 | 18.7 / 17.6 |
| 8, Inferred to Found | Medium | +0.27 / +0.69 | 9.4 / 9.2 | 60.0 / 60.0 | 59.7 / 59.7 | 18.8 / 19.0 |
| 8, Inferred to Found | Low | +0.63 / +0.60 | 5.8 / 6.0 | 60.0 / 60.0 | 59.7 / 59.7 | 19.0 / 18.9 |
| 8, Found to Inferred | High | +0.44 / +0.72 | 7.3 / 8.8 | 60.0 / 60.0 | 59.8 / 59.8 | 17.9 / 18.3 |
| 8, Found to Inferred | Medium | +0.27 / +0.65 | 7.3 / 8.5 | 60.0 / 60.0 | 59.7 / 59.7 | 18.8 / 18.9 |
| 8, Found to Inferred | Low | +0.67 / +0.59 | 4.8 / 5.5 | 60.0 / 60.0 | 59.7 / 59.7 | 18.9 / 19.4 |
| 9, Inferred to Found | High | +1.30 / +2.02 | 11.1 / 14.5 | 60.0 / 60.0 | 59.8 / 59.8 | 18.2 / 18.1 |
| 9, Inferred to Found | Medium | +0.17 / +1.22 | 9.4 / 12.0 | 60.0 / 60.0 | 59.7 / 59.8 | 18.7 / 18.3 |
| 9, Inferred to Found | Low | +0.96 / +1.19 | 7.3 / 7.5 | 60.0 / 60.0 | 59.8 / 59.7 | 18.4 / 19.1 |
| 9, Found to Inferred | High | +0.91 / +1.90 | 10.7 / 14.1 | 60.0 / 60.0 | 59.9 / 59.9 | 18.0 / 17.6 |
| 9, Found to Inferred | Medium | +0.21 / +0.79 | 9.0 / 10.2 | 60.0 / 60.0 | 59.8 / 59.7 | 18.8 / 19.1 |
| 9, Found to Inferred | Low | +0.95 / +0.97 | 7.1 / 7.0 | 60.0 / 42.0 | 59.9 / 1.2 | 17.9 / 842.9 |

- **A change adds about 0.2 to 1.3 ms of GPU time a frame in the streets, and up to 2.0 ms from over the roofs**, on this Mac. The highest GPU time of any single frame was 14.5 ms (view 9, High), inside the 16.7 ms a frame has.
- **The frame rate held 60, with no half second below 59, in 50 of the 54 changes of the three runs, and in all 18 of the second run.**
- **But single frames stalled, rarely, and the cause was not found.** In the three full runs, 5 of 54 changes had one frame far over the rest, 4 of them at view 9: 353 ms and 247 ms (High) and 270 ms (Medium) in the first run, while other commands ran beside it; 25 ms (view 8, High) in the first; and **843 ms (view 9, Low, Found to Inferred) in the third, with nothing of this session's running beside it**. That last change is the 42 frames a second in the table. Against that: 38 further changes at view 9, run by themselves on High and Low, had no frame over 30 ms; and at rest one frame of 98 ms turned up in 243 windows (view 6, High, second run). So stalls happen on this Mac with and without a fade, and were seen more often during one from above. Whether the page causes them cannot be told from these runs. **It is the first thing to look for on the iPad**, and when Chad watches a change at view 9.
- **Done-when asks that a change hold 55 frames a second at views 7, 8 and 9 on the three levels.** The second run does, throughout. The third does in 17 of 18 changes, and the first in 15 of 18.

### JavaScript's memory

The heap after a forced collection, at view 9 on High, with the layer changed every two seconds (so every change is turned round part way) and the date sent to a new day every two seconds:

| | bytes in use | change over the minute |
|---|--:|--:|
| before | 1,189,452 | |
| after the first minute of changing | 1,358,816 | +169,364 |
| after the second | 1,361,944 | +3,128 |
| after the third | 1,372,060 | +10,116 |
| after a fourth minute with nothing changing | 1,381,380 | +9,320 |

**It does not grow with the changing.** The first minute adds 0.17 MB once, as work order 003 saw with the engine alone; after that the heap moves by 3 to 10 kB a minute, the same whether the layer and date are changing or not. A change of layer or date allocates nothing in the frame: `showAll()` writes into one fixed array.

### The page's size

`cd source && npm run size`, in bytes of `index.html`.

| | whole page | gzipped | what the part added |
|---|--:|--:|---|
| Before this order | 169,665 | 98.0 kB | |
| After Part A, the land | 171,049 | 99.0 kB | +1,384: terrain data (the larger island packs 1,039 bytes larger) |
| After Part B, the layers | 176,908 | 101.5 kB | +5,859: engine code 2,696; shaders 1,674; menu and styles 861; town data 651 (the turns) |
| After Part C, the date | 178,726 | 102.3 kB | +1,818: engine code 976; menu and styles 842 |
| After the second set of tones (a tone for buildings beside the land's) | 178,790 | 102.3 kB | +64 |

**The three parts add 9,061 bytes, and the second tone 64 more** (the order's limit before stopping to report: 20 kB). The page is 174.6 kB of the 256 kB budget.

### Load

The world builds in 0.42 to 0.48 s before and after (three loads each of `main`, Part A and Part B, timed to 20 ms). The views check reports "1 s" where it reported "0.5 s", because it looks every half second.

### The same picture as before, in the layer the world opens in

Time frozen, resolution held, the engine's own frame, each of the nine views saved without loss and compared pixel by pixel outside the chooser's panel (1,103,800 pixels a view):

- **Views 1 to 6** (land, sea, sky): after Parts B and C against Part A, 0 to 12 pixels differ, by one grey level (two pixels by 12 at view 3).
- **Views 7 to 9** (the town): 160 to 467 pixels differ by more than four grey levels (34 to 37 at most). They lie along the 4 mm strips where a window's stone frame and its wall overlap in the same plane: two surfaces tie in depth there, and the last bit of the arithmetic decides which is drawn. The town's mesh was compared value by value and is the same (`docs/town/README.md` §7a). Some thousands more differ by one level.
- **Part C against Part B**: no pixel differs by more than one level in any view.

## 8. What was tested, and who looked

**Tested by script** (`tools/town/shot.mjs`, reading the camera's state after each step):

| Test | What the state showed |
|---|---|
| A walker on a roof that fades (Inferred to Found) | Stayed on the roof at 39.65 m until its house began to go, came down with it to the ground at 30.73 m in about two seconds, and stayed on foot |
| The same walker, the house coming back (lifted) | Rose with it from 30.73 m to the roof at 39.65 m in about two seconds, on foot |
| With the other rule (left inside) | Stayed on the ground inside the house; walked west out of it; walking back, was stopped by its wall |
| A change turned round part way | The layer went 1, 0.94, 0.86, 0.79, 0.72, then 0.77, 0.84, 0.91, 0.98, 1, half a second apart: no jump |
| The date | Named moments by day: Golden at 18.47 at midsummer and 15.86 at midwinter; Afternoon 14.45 at midwinter; the date glided from day 91 to day 274 the short way; `[` and `]` stepped a week |
| The menu with a finger (emulated, iPad lying and phone upright) | A tap on the slider's middle gave "18 Sep"; a tap on "Winter solstice" gave "19 Dec"; a tap on Found lit it and changed the line |
| The development build | `dev.html` shows the chooser's panel; with `P` the placing and second-island prototypes of work order 003 run, and follow the layer and the year |

**Claude (Fable 5.2) looked at**, on 2026-11-21: the nine views of the views check, as a sheet (they are in Thera Views, version 13); Found at rest from views 8 and 9 and from the air; the fade held part way from above, from the north edge and in Telchines Street, on High, Medium and Low; the island from view 3 part way through a change; the first three tones, and then nine candidates for the second set from the air, the coast and high above; midwinter noon and golden hour in the square; the menu at a desktop's size and at an iPad's and a phone's, lying and upright (the upright iPad's picture was not opened); and the pictures of the chooser, eleven at first and twelve after choice 1 was put again.

Seen and worth knowing:
- **The dither shows, as chosen.** A fading house is drawn through a fine screen. At a low share and from far off, the leading edge of the wave is a sprinkle of dots (view 9 on Medium, a tenth of the way).
- **The shadow of a fading house** is a paler, smooth shadow on High and Medium. On Low it was blotchy until Low was given the nine-reading filter for the frames of a fade; it is softer now and still a little mottled.
- **In Found the shaded side of a building is dark**, and its windows are hard to see there: with one tone, only light tells surfaces apart.
- **The menu is taller.** On a desktop window of 1600 × 813 the key list ends at the foot of the window and the notes are below it, reached by scrolling; on an iPad lying down everything fits; on a phone it scrolls, as it did. Nothing was shrunk. If it is to fit a desktop window again without scrolling, the candidate to leave is the row of four marks under the date slider.

**Nobody has watched a change of layer, or the date gliding, in motion**: every look above is at stills, and the timings say only how long frames took. **Chad has looked at the chooser's first page, in stills** (2026-11-21), and set aside its three tones; he has not yet seen a change in motion. Nobody has tried touch on a device: the slider on a phone held upright sits in a page turned on its side, and worked only under emulation.

## 9. Known gaps

- **No iPad.** Every number here is one Mac's.
- **The rare stalled frames** (§7) are unexplained.
- **Found is not the excavation as it stands** (L-L1).
- **Nothing but the sun changes with the date, and nothing changes with the year.**
- **The order of the excavation** (D44) is not in the wave: the turns are by distance until research lane T8 is checked.
- **Imagined is empty.**
