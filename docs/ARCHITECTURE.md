# Architecture: where the engine stands, and what the bigger world needs

A review, written on 2026-11-19 at Chad's request and corrected on 2026-11-20 from the measurements of work order 003 (§11), after the project's scope grew in one day from one moment to a world with layers, seasons and a year the viewer can move. **It proposes; it decides nothing.** The decisions it needs are in §9. Sizes and frame times under "measured" were measured; everything called an estimate is the session's estimate and has to be measured before it is relied on.

## 1. What changed

| Before 2026-11-19 | Now |
|---|---|
| One moment: late May of one year | A date, a season and a year the viewer moves, about 1800–1500 BCE (D33, D34), opening in 1628 BCE (D36) |
| One state of the island | The living island, then the damaged town, the eruption and the island it left (D37) |
| Evidence and reconstruction told apart by one switch, for the town only | Three layers over everything: Found, Inferred, Imagined (D31, D38) |
| A random night sky | A sky computed for the date and place, with eclipses and the planets (D33) |
| Changes might reload or rebuild | Changing layer, date or year never reloads or pauses: things fade in and out (D31) |

Still to come, as before: plants, the harbour and ships, people and animals, interiors and wall paintings, labels for what was found, and other places.

Chad's four words for the result: **high performing, efficient, small and fluid.**

## 2. Where the engine stands (measured)

| | |
|---|---|
| The page | 165.6 kB, 97.9 kB gzipped, of a 256 kB budget (D17) |
| What it is made of, as source text | terrain data 74 kB; shaders 50 kB; `main.js` 43 kB; `world.js` 35 kB; town data 16 kB; menu and styles 10 kB; sound 6 kB |
| Frame rate | 60 fps at full resolution in all nine views, High detail, on this Mac (Apple GPU). GPU time 5.6–12.7 ms a frame in work order 002's run |
| Load | The world builds in about half a second |
| Other devices | **Not measured.** Nobody has run it on an iPad yet |

How it works today:
- **The ground is already nested grids over a height map** (work order 001). The island's data is baked at load into height, slope and rock textures. One square grid is drawn as a set of rings round the viewer, each with cells twice as wide as the one inside it, and neighbouring rings are blended so nothing pops. The sea is drawn the same way.
- The town is one fixed mesh, built at load. The island and the town each have a shadow map.
- JavaScript does almost nothing each frame, and allocates nothing (engine law 3).
- The town's mesh already marks each vertex as excavated or reconstructed. That flag, and the pale wash the `L` key applies, are the seed of the layers.

Nearly half the page is terrain data. The engine itself is small.

## 3. What the new scope asks of the engine

Every thing in the world now carries three tags: its **layer**, the **years** it stands for, and, if it grows, its **season**. Six requirements follow.

1. **Nothing is rebuilt when a tag's control moves.** Whether a thing shows is worked out on the GPU from three numbers: the layer, the year, the day of the year.
2. **Numerous things are placed by rule, not stored one by one.** A field of barley is a rule and a patch on a map, not ten thousand positions in the page.
3. **Hidden things cost nothing.** What a layer or a year hides is culled before it is drawn. *Measured:* true of the hidden thing, but the frame does not get cheaper. With the Inferred town hidden, the bare ground costs more to shade than the houses that covered it.
4. **Fades need no sorting.** Sorting transparent things is slow and fragile.
5. **Shadows and collision follow what is shown.** A house that has faded away casts no shadow and stops nobody.
6. **The evidence stays attached.** Each rule and each tag keeps its claim reference in the tools' data, as now. The page carries only numbers.

## 4. Proposed design

### 4.1 One visibility function
A thing's visibility is one number from 0 to 1: its layer's fade, times its years' fade, times its season's state. Three values go to every shader: the layer (0 to 2, moving smoothly during a change), the year, and the day of the year.

- **Fixed meshes such as the town** keep one mesh. Each building's tags live in a small table, looked up by a building number, so tags cost a few bytes a building. *Measured:* the vertices carry no such number today, only a one-byte seed that many buildings share. It has to be added, and it fits in the 32 bytes each corner already has.
- **The fade is a dither**, not transparency: a fading thing is drawn through a fine pattern of holes that closes or opens. It needs no sorting, and the shadow pass uses the same pattern, so shadows fade with their owners. *Measured:* this holds, with three changes. Dither on the samples inside a pixel, where there is multisampling. Draw with an opaque pipeline whenever nothing is fading, because a shader that may discard costs even when it discards nothing. And budget for the town's shadow map being drawn again on every frame of a fade, which is most of what a fade costs. A second way to fade, pressing a building flat and letting it rise, needs no dither at all.
- **Collision** reads the same table, and a viewer standing on something that fades is lowered gently (D31).

### 4.2 The GPU places everything numerous
For plants, and later people and animals, a compute pass runs each frame. It scatters instances from a land-cover map and the rules, drops what is hidden or out of view, chooses a level of detail, and writes the draw lists itself. The CPU does no per-instance work, and the page stores no instance.

This is the design of the Formosa Forest fork (§7), which draws a forested island this way. The three tags become three more inputs to the same pass.

### 4.3 The island through time
Two whole islands would cost 74 kB each. The island after the eruption is today's island, which is the data the tools already start from. So the page would hold the island of 1628 BCE, as now, and a compact **difference** to the later one. *Measured:* the difference is not small. The ash blanket covers the whole island, so every cell of land differs, and a stand-in for the later island costs 41 kB at today's accuracy. It has to be stored more coarsely: 29 kB with heights to 2 m, or 19 kB on a grid of 80 m cells. Because the ground is already drawn from baked height maps (§2), the later island is a second set of maps, and the shader blends the two by the year. The eruption itself is an effect, not data.

### 4.4 The sky
An ephemeris inside the page, by the method of Beyond the Gates of Uruk: short series for the Sun, Moon and planets fitted to NASA's ephemeris over the window, a catalogue of bright stars with their own motion, and precession. It is worked out when the date changes, not every frame.

### 4.5 Time as data
Each place gets a timeline in the tools: what begins and ends when, each entry with its claim and its grade. The build turns it into the year tags. A thing with no dated beginning or end stands for the whole span.

### 4.6 Seasons
Each plant species gets a few numbers from lane T3c: when it leafs, flowers, fruits and dries, and the colour of each state. The day of the year picks the state.

## 5. The size budget

Estimates only, in kB of page, uncompressed.

| Part | First estimate | After work order 003 |
|---|--:|---|
| The page today | 166 | **165.7, measured.** Terrain data 70.7; engine code 39.1; shaders 30.7; town data 14.2; menu and styles 8.2; sound 2.8 |
| Layers, dates and years in the engine, with their controls | 8–12 | Measured in part: the fade is about 5 kB and what the parts share about 9.5 kB, both overstated by how the spike was built. The estimate stands, and its lower half looks likelier |
| Plants: forms, rules, land-cover map, seasons | 20–30 | The placing pass is **7.8 kB, measured.** The species, the rules and the map are still a guess |
| The sky: ephemeris and stars | 15–25 | Still a guess |
| The island after the eruption, and the eruption | 15–25 | **25–47 kB** on a stand-in, depending on how coarsely it is stored, before the eruption itself |
| The harbour and ships | 10–15 | Still a guess |
| People and animals | 25–40 | Still a guess |
| Interiors and wall paintings | 30–60 | Still a guess |
| Labels and the text of what was found | 10–20 | Still a guess |
| **Total** | **about 300–390** | **about 310–410** |

There is a second budget the first draft did not have: **GPU memory.** A second island's maps take 133 MB on High and 37 MB on Medium and Low, so they should be made only when the year comes near them.

So one 256 kB page will not hold the whole plan. Three ways to answer that:

1. **Keep one file and raise the budget when a work order's numbers require it** (recommended). The page stays one file that needs nothing else and works offline. What travels is the compressed size, 98 kB today.
2. **One page plus data files loaded when needed.** The first load is smaller, but it gives up "nothing loaded at run time", the gate's rule, and offline use from a single file. It is the natural shape once there is a second place (O5).
3. **Keep 256 kB and cut scope.**

There is also room to recover: the terrain data is 45% of the page. A coarser grid away from the town and the caldera could return an estimated 15–25 kB.

## 6. Performance

A frame has 16.7 ms at 60 fps. On this Mac the GPU uses 5.6–12.7 ms of it today.

Measured in work order 003, on this Mac, where a difference under 1 ms is noise:

| | Added to a frame |
|---|---|
| A layer at rest | nothing measurable |
| A layer fading | about 1–2 ms in a street, more from above |
| Placing things on the GPU, without drawing them | under 0.6 ms for 200,000 kept |
| Drawing about 10,000 placed things | inside the noise |
| Drawing about 50,000 | 0.1–2.2 ms |
| Drawing about 200,000 | 1–6 ms |
| Two islands blended by the year | inside the noise |

Still not measured: real foliage, shadows for placed things, and anything at all on an iPad.

Rules proposed:
- No per-frame allocation in JavaScript (kept).
- Everything numerous is placed and culled on the GPU.
- A fade costs nothing while nothing is fading.
- A change of date or year recomputes only small tables: the sky, the season, three numbers.
- **The floor is set on a real iPad, not on this Mac**, whose numbers flatter. The touch test will give the first reading.

## 7. What others have built on Abyssal Garden

Upstream has 2,499 stars and 375 forks (GitHub, 2026-11-19). **Only READMEs were read for this review; no fork's source has been read yet.**

| Fork | What it is | What is worth taking |
|---|---|---|
| `emersonliuuu/forest` (Formosa Forest) | A walkable island modelled on Taiwan, with six forest zones by altitude and 25 plant and animal meshes, in one HTML file | A compute pass that scatters, culls and picks detail for every plant and animal into indirect draw lists. Distant trees as impostors baked on the GPU. Foliage drawn with alpha-to-coverage under 4× multisampling. A leaf atlas made by code. Two shadow cascades. Address parameters for fixed test poses and a scripted benchmark that prints frame times |
| `fofrem/manhattan-at-dusk` | 36 city blocks at dusk, with lit windows and moving cabs | A browser test that checks shader compilation, the controls, the touch interface and the missing-GPU message. Window lights for the town at night |
| `JNobleA/15-Eunomia` | Walking and flying round a small asteroid | Another take on walking over terrain |
| `yiroutesu/abyssal-garden-editor` | An editor | Not read |

Others include a space scene, a mine, an extended sea and a Godot port.

**Voidstruck** (`vitaminclaude/voidstruck`, playable at <https://voidstruck.com/>), which Chad pointed to, is not a fork of Abyssal Garden but is built the same way: a whole galaxy, with planets to land and walk on, in one HTML file of 299 kB (about 114 kB compressed), on WebGPU with no libraries. Its README describes five things this project should learn from:

| Voidstruck's way | What it means here |
|---|---|
| **A function, not data.** Every star and planet is worked out from a seed and its coordinates, and nothing is stored | The same rule as §3.2. Only what evidence fixes (the terrain, the excavated plan) is data; everything else is a rule |
| **The ground is a mesh of seven nested grids**, each twice as coarse as the last, over a surface baked into a small map | Thera's ground is already drawn this way (§2), which confirms the choice. Because the heights come from maps, blending two islands by the year (§4.3) is cheap |
| **Plants and animals are recipes**: a family with a handful of dials | How species are built in §4.6, with the dials set from lane T3c and not from a seed |
| **The rules are separate from the picture**: plain functions stepped at a fixed rate, with 192 automated tests that run outside the browser | The layer, date and year logic and the sky are written this way, so the sky can be tested against a reference ephemeris, as Uruk's is |
| **Staying small was planned**: a budget of 300 kB from the start, a build that shortens shaders and numbers, a table of where every kB goes, and the real size shown on the title screen | A per-part size report in the build, and a precedent for a single file of about 300 kB |

**We learn how Voidstruck does it and build what this world needs; we do not use its code** (Chad, 2026-11-19). Its repository holds only the built page, so its README and the game itself are what there is to study, and its licence (PolyForm Strict 1.0.0) forbids changing or redistributing it in any case.

One more lesson from its size table: its planets' terrain, plants, animals and cities together take 50 kB, because all of them are rules. **Rules are cheap, and data is what costs.** Here the costly part is what evidence fixes: the measured island (74 kB) and the excavated plan. The estimates for plants, people and animals in §5 may therefore be high.

### How the techniques work, in this project's terms

These are standard methods, described here as they would be built for Thera. Nothing below is taken from another project's source.

**Ground as nested grids over a height map** (known as geometry clipmaps). **The engine already does this.**
- The island's heights are baked into a texture. The ground is drawn as rings of one square grid centred on the viewer, each ring with cells twice as wide as the one inside it, so the triangle count is set by the grid and not by the island.
- Neighbouring rings are blended, so no crack or pop shows. Each corner reads its height from the texture in the shader.
- **What it still has to give Thera:**
  - The island before and after the eruption as two sets of maps, blended by the year.
  - A second, finer height map under the town, where the 40 m data cannot hold the steep drop at Xeste 4 (a known weakness of work order 002).

**Placing by rule on the GPU.**
- Round the viewer, the ground is cut into cells. For each cell a compute pass makes a few candidate spots from a hash of the cell's number, so the same spots come out every frame and nothing is stored.
- A candidate is kept if the land-cover map says that kind of plant grows there, as thickly as the rule says, and if it is in view. The pass picks a form by distance (full, simple, or a flat picture of the tree for the far ones) and writes the kept instances and their counts straight into the lists the GPU draws from.
- **What it gives Thera:** the layer, the year and the season are three more tests in the same pass. A forest that is cut down in a given year is a land-cover map that changes with the year.

**Things as recipes.** A species is a short list of numbers that a shared routine turns into a form: height, spread, branching, leaf, colour by season. Voidstruck rolls those numbers from a seed. Here they come from lane T3c and carry its claim references.

**Baking once.** Whatever is costly to work out and does not change every frame is drawn once into a small texture and reused: the land-cover map, the flat pictures of distant trees, the sky's stars for a date.

**Rules apart from the picture.** The clock, the layers, the seasons, the sky's positions and the timeline are plain functions with no drawing in them. They run under Node as well as in the page, so the build can test them: the sky against a reference ephemeris, the timeline against the world clock.

**Knowing where the size goes.** The build prints the page's size part by part, and fails a part that passes its share, so growth is seen when it happens and not at the end.

**Before borrowing code from any fork:** read its licence. Upstream is MIT and forks usually keep it, but each has to be checked, and what is taken is credited in `README.md`. A technique is free to learn from.

**Next:** read Formosa Forest's placement pass and its impostor baking in full, before the work order for layers and time is written.

## 8. Order of work proposed

1. **A measuring spike** (done: work order 003, §11), before any other work order: a dithered fade on the town with a layer value; a placement pass drawing fifty thousand plain instances on the island; two sets of height maps blended by a year value; and the size of the island's difference. Its numbers replace the estimates above.
2. **Work order 003, layers and time:** the three tags, the fades, the controls (layer, date, year), the town retagged, shadows and collision following, and the change to edit E4 (D29).
3. **Work order 004, plants**, placed by the GPU, with seasons.
4. **The sky and the calendar**, after its own research lane.
5. **The end of the town**, from lane T7.

Then the harbour and ships, people and animals, interiors, and labels.

## 9. Decisions this needs from Chad

| # | Question | Leaning |
|---|---|---|
| 1 | The size budget, when a work order's numbers pass 256 kB | Keep one file and raise the budget (§5, option 1) |
| 2 | Whether the layers and time are built first, as work order 003 (O14) | Yes, after the measuring spike |
| 3 | Which iPad is the slowest device the world must run well on | The one used in the touch test, until a slower one matters |
| 4 | Whether to study Formosa Forest's source and credit what is learned | Yes |
| 5 | Which way a layer fades (§11) | Chad's choice, from the pictures and from `dev.html` in motion |
| 6 | How coarsely the later island is stored | Decide when the end of the town is planned: heights to 2 m, or a grid of 80 m cells |

## 10. What this kind of work is called

There is no single name. Four names each cover part of it. They were checked by web search on 2026-11-19, not against the primary texts.

| Name | What it covers | Where it comes from |
|---|---|---|
| **Procedural generation** | The technique: the world is worked out by code from rules and seeds, not stored as images and models | General |
| **The demoscene; size-coding** | The tradition and the discipline of staying small: whole animated worlds with music in tiny programs ("4k" and "64k intros") | [.kkrieger](https://www.guinnessworldrecords.com/world-records/421923-fewest-bytes-for-a-first-person-shooter-fps-videogame), by .theprodukkt (part of the group Farbrausch), won the 96k game competition at Breakpoint in April 2004: a 3D shooter in 97,280 bytes, with its textures and models made by recipe at load |
| **Single-file, real-time WebGPU** | The delivery: one self-contained HTML page, drawn live on the graphics card, with no engine and nothing to download | Abyssal Garden (97 kB), Voidstruck (299 kB), this project (166 kB) |
| **Virtual archaeology; procedural modelling; 4D reconstruction** | What this project adds: reconstruction of the past by rule, with its evidence shown, and soon in time as well as space | The [London Charter](https://www.londoncharter.org/) and the [Seville Principles](https://vwhl.luddy.indiana.edu/sevillePrinciples/index.html); [Müller and others, 2006](https://peterwonka.net/Publications/pdfs/2006.VAST.Mueller.Xkipche.pdf), who rebuilt Maya buildings at Xkipché from a shape grammar |

In one line: **a procedural, real-time 4D reconstruction in virtual archaeology, built in the demoscene's single-file tradition.**

## 11. What the measuring spike found (work order 003)

The full report is `docs/spike/003-measurements.md`. Its pictures are in the private artifact Thera Spike 003. The prototypes are in the development build and can be run: `cd source && npm run build:dev`, open `dev.html`, and use the keys `K` (layer), `J` (the way of fading), `N` (wave), `Y` (island), `U` and `I` (year), `O` (day), `G` (more shapes) and `P` (spike off and on).

| Part of the design | Verdict |
|---|---|
| One visibility function for layer, years and days (§4.1) | Holds |
| A building's tags in a small table (§4.1) | Holds, once each corner of the town carries its building's number |
| A fade by dither, with shadows following (§4.1) | Holds, with the three changes noted in §4.1 |
| Collision follows what is shown (§4.1) | Holds |
| Hidden things cost nothing (§3) | True of the thing, not of the frame |
| The GPU places everything numerous (§4.2) | Holds. Placing is nearly free; drawing is the cost |
| The later island as a compact difference (§4.3) | Does not hold as estimated: 41 kB, not 15–25 |
| Two islands blended by the year (§4.3) | Holds for speed; costs 133 MB of GPU memory on High |
| The sky, time as data, seasons (§4.4–4.6) | Not tested |

**Five ways of fading were built**, and the choice among them is Chad's:
- **Coverage dither:** reads as clear glass. It costs the most, and Low detail cannot use it.
- **Pixel dither:** a fine diagonal screen shows over whatever is fading.
- **Surface dither:** coarse, and it shimmers nearly five times as much. Not to be used.
- **Clipped rise:** the houses show as hollow shells, open at the top.
- **Lidded rise:** a low solid town growing storey by storey. It is the cheapest and does not shimmer.

Any of them can also **spread as a wave** from the excavated centre, at about half the cost. The paving then appears ahead of its houses unless the town's plan map is made to carry the wave.

**What the next order must do that this review did not foresee:**
1. Give every corner of the town its building's number.
2. Keep two pipelines for anything that fades: an opaque one for rest, a discarding one for the frames of a fade.
3. Make the town's plan map carry the layers, so that paving and street shade fade with their houses.
4. Decide what happens to a viewer standing where a house appears. The spike lifts them to its roof.
5. Watch the texture limit: the ground's shader is at 14 of 16.
6. Lift the ideas from the spike's code, and do not merge that code into the engine: it was written to stay out of it.
7. Take a reading on an iPad, with the Stats button, before the design is fixed.
