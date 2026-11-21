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
- **Plain** is one unpainted tone, the convention of a plaster model. It replaces every colour that is a liberty: rock, soil, sand, the sea floor seen through the water, walls, roofs, timber, stone. The patterns that go with those colours go too: joints, courses, render, the sheen of lava and of wet shingle. Light, shadow, haze, the sky's reflection and the ground's fine relief stay, so the form still reads. The light the ground throws back onto walls takes the plain tone as well.
- **Paving in Found.** That the rebuilt streets were paved with flagstones is sourced (T2#11); the look of the flagstones is not (A-L2, A-L14). So in Found the paved ground has the plain tone, a fifth darker, with no joints: enough to tell a street from the open ground.
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
| L-L3 | **The plain tone**, and that paved ground is drawn a fifth darker in it. | A tone has to be chosen; none is evidence. The darker paving keeps a sourced thing (flagstones, T2#11) visible without its unsourced look. | `TONE` in `main.js` |

## 5. Flat-screen effects (D43)

The world is to be used in a headset later (`docs/ARCHITECTURE.md` §12). Everything this order added or touched that is worked out from a pixel's place on the screen:

| Effect | Where | In a headset |
|---|---|---|
| **The dither of a fade** | `holes()` in `shaders.js`: the one place a fade reads the pixel's place | Each eye would get its own pattern, and the holes would not line up between the eyes. It needs a look on a device before it is relied on |
| The same dither in the town's shadow map | `fsS`, through `holes()` | Not a screen effect: it reads the shadow map's own texels, which are the same for both eyes |

Nothing else new reads the screen. The plain tone, the wave and the colours are worked out in the world's own metres. New shader code takes its view and projection from the engine's one camera block (`g.vp`, `g.cam`). True scale and place are untouched: nothing moves the origin or the metres.
