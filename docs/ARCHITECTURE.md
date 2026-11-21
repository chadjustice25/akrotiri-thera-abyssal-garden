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

Added on 2026-11-20: the world is also to be usable on the real site and in a headset (D42, D43). §12 says what that asks of the engine.

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
2. **Work order 004, layers and time** (written 2026-11-20): the three tags, the fade, the controls for the layer and the date, the town retagged, shadows and collision following, and the change to edit E4 (D29). The year gets its plumbing and no control until something is dated (O20).
3. **Work order 005, plants**, placed by the GPU, with seasons.
4. **The sky and the calendar**, after its own research lane.
5. **The end of the town**, from lane T7.

Then the harbour and ships, people and animals, interiors, and labels. Labels matter more since D42: they are how a viewer finds out how each thing is known.

Augmented and virtual use (D43) runs beside this list, in the steps §12 gives: standpoints once the layers and the date are in, then a measuring spike for a headset, then augmented reality.

## 9. Decisions this needs from Chad

| # | Question | Leaning |
|---|---|---|
| 1 | The size budget, when a work order's numbers pass 256 kB | Keep one file and raise the budget (§5, option 1) |
| 2 | Whether the layers and time are built first (O14) | Decided: yes, as work order 004, after the measuring spike (D39) |
| 3 | Which iPad is the slowest device the world must run well on | The one used in the touch test, until a slower one matters |
| 4 | Whether to study Formosa Forest's source and credit what is learned | Yes |
| 5 | Which way a layer fades (§11) | Decided: a per-pixel dither that spreads as a wave from the excavated centre (D41) |
| 6 | How coarsely the later island is stored | Decide when the end of the town is planned: heights to 2 m, or a grid of 80 m cells |
| 7 | Whether Found should appear in the order the site was dug (O22) | Decided: yes, once research lane T8 on the history of the excavation is in and checked (D44) |
| 8 | Which device and which use come first for augmented and virtual use (O23, §12) | Standpoints first; a headset spike once Chad has a headset (the integrator's pick is a Meta Quest 3, §12); augmented reality last |
| 9 | Whether the viewer can also move through the dig's own years (O24) | Decide when the T8 report has been checked |

## 10. What this kind of work is called

There is no single name. Four names each cover part of it. They were checked by web search on 2026-11-19, not against the primary texts.

| Name | What it covers | Where it comes from |
|---|---|---|
| **Procedural generation** | The technique: the world is worked out by code from rules and seeds, not stored as images and models | General |
| **The demoscene; size-coding** | The tradition and the discipline of staying small: whole animated worlds with music in tiny programs ("4k" and "64k intros") | [.kkrieger](https://www.guinnessworldrecords.com/world-records/421923-fewest-bytes-for-a-first-person-shooter-fps-videogame), by .theprodukkt (part of the group Farbrausch), won the 96k game competition at Breakpoint in April 2004: a 3D shooter in 97,280 bytes, with its textures and models made by recipe at load |
| **Single-file, real-time WebGPU** | The delivery: one self-contained HTML page, drawn live on the graphics card, with no engine and nothing to download | Abyssal Garden (97 kB), Voidstruck (299 kB), this project (166 kB) |
| **Virtual archaeology; procedural modelling; 4D reconstruction** | What this project adds: reconstruction of the past by rule, with its evidence shown, and soon in time as well as space | The [London Charter](https://www.londoncharter.org/) and the [Seville Principles](https://vwhl.luddy.indiana.edu/sevillePrinciples/index.html); [Müller and others, 2006](https://peterwonka.net/Publications/pdfs/2006.VAST.Mueller.Xkipche.pdf), who rebuilt Maya buildings at Xkipché from a shape grammar |

In one line: **a procedural, real-time 4D reconstruction in virtual archaeology, built in the demoscene's single-file tradition.**

A fifth name, added on 2026-11-20 with the project's goal (D42): **virtual heritage**, the wider field that applies computing to cultural heritage, of which virtual archaeology is a part. It has no single agreed definition. Reconstructions shown on site in augmented reality are one of its common uses ([Virtual heritage](https://en.wikipedia.org/wiki/Virtual_heritage), Wikipedia; [Champion, *Virtual Heritage: A Guide*, 2021](https://library.oapen.org/handle/20.500.12657/53516)). Checked by web search, not against the texts.

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

**Five ways of fading were built.** Chad chose the pixel dither, spreading as a wave (D41), on every detail level.
- **Coverage dither:** reads as clear glass. Low detail cannot use it, because it has one sample a pixel.
- **Pixel dither (chosen):** a fine diagonal screen shows over whatever is fading. Its cost and the coverage dither's are the same within the noise, and both cost more than the rises. It has not been seen in a headset (§12).
- **Surface dither:** coarse, and it shimmers nearly five times as much. Not to be used.
- **Clipped rise:** the houses show as hollow shells, open at the top.
- **Lidded rise:** a low solid town growing storey by storey. It is the cheapest and does not shimmer.

Any of them can also **spread as a wave** from the excavated centre, at about half the cost. That was measured with the coverage dither and the lidded rise only. The paving then appears ahead of its houses unless the town's plan map is made to carry the wave.

**What the next order must do that this review did not foresee:**
1. Give every corner of the town its building's number.
2. Keep two pipelines for anything that fades: an opaque one for rest, a discarding one for the frames of a fade.
3. Make the town's plan map carry the layers, so that paving and street shade fade with their houses.
4. Decide what happens to a viewer standing where a house appears. The spike lifts them to its roof.
5. Watch the texture limit: the ground's shader is at 14 of 16.
6. Lift the ideas from the spike's code, and do not merge that code into the engine: it was written to stay out of it.
7. Take a reading on an iPad, with the Stats button, before the design is fixed.

## 12. Augmented and virtual use (D42, D43)

Added on 2026-11-20. Chad: "One of the top goals of this project is to help citizen scientists and scientists understand the information at the actual archaeological sites", and "I can see people using this in an augmented and virtual way so let's make sure that is in the plan."

**Nothing here is built or measured.** The facts about browsers were checked twice on 2026-11-20. The first check rested on a search's summaries and was out of date on the main point. The second read Apple's and Meta's own pages, and "What browsers can do today" below is the corrected text. They change quickly: check them again, at the makers' pages, before any order is written.

### Three uses, simplest first

| Use | What the viewer does | What it needs |
|---|---|---|
| **Standpoints** | Stands at a marked place on the real site, opens the page there on a tablet or phone, and sees the same place in 1628 BCE. Turning the device can turn the view | No new browser feature. A link that opens the page at a place, a layer and a date; the real site's visitor route, from a source; the device's motion sensors for turning |
| **Virtual reality** | Wears a headset and stands in the town at true scale, or looks down on the island as a model | WebXR drawing with WebGPU; two eyes at 72–90 frames a second; a menu inside the world |
| **Augmented reality** | Sees the reconstruction laid over the real ruins, or set on a table as a model | WebXR's augmented mode, or a native app; the town placed on the real walls to within centimetres; the real scene hiding what stands behind it |

The layers suit augmented reality: on site, Found is what the visitor sees with their own eyes, and Inferred and Imagined are what the device adds.

**Added the same day (D45): the visitor's own position.** Chad asked that a phone on the island can put the viewer where its owner stands. It belongs with standpoints, since both put the viewer at a real place. It is planned in "The visitor's own position" below.

### What browsers can do today

- **The page draws with WebGPU, and WebXR was made for WebGL.** WebXR is the browser's interface to headsets and augmented reality. The part that joins it to WebGPU is still a draft ([WebXR/WebGPU Binding](https://immersive-web.github.io/WebXR-WebGPU-Binding/)), but two headsets' browsers now carry it.
  - **Apple Vision Pro.** "Now with Safari 26.2 on visionOS, WebXR supports WebGPU" ([WebKit's own post, 12 December 2025](https://webkit.org/blog/17640/webkit-features-for-safari-26-2/), read on 2026-11-20). The post names no flag and no limit. It does not say which kinds of session.
  - **Meta Quest.** Quest Browser 156.0, of 13 November 2026, "added WebGPU in WebXR" ([Meta's release notes](https://developers.meta.com/horizon/documentation/web/browser-release-notes/), read on 2026-11-20; the page says its descriptions are summarised by AI). Earlier entries call their WebGPU features experimental, and this one does not. The page does not say whether a flag is still needed. On version 154, in October, one developer's test still needed the experimental flags ([the test](https://github.com/Mandalorian007/quest-webgpu-webxr-experiment), seen only in a search's summary).
  - **Chrome on Windows and Android**, which Samsung's Galaxy XR runs: for testing since version 135 ([Chrome's notes](https://developer.chrome.com/blog/new-in-webgpu-135)), and still called experimental in May 2026 ([a three.js issue](https://github.com/mrdoob/three.js/issues/32858), seen only in a search's summary). Nothing later was found.
- **Safari has no WebXR on iPad, iPhone or Mac** ([WebKit's tracking bug](https://webkit.org/b/208988)). On the Vision Pro, whether it offers augmented sessions is not settled: Apple's developer forum says it does not ([the thread](https://developer.apple.com/forums/thread/743655)), and later guides found by search say it does in part.
- **Chrome on Android offers augmented reality** through ARCore ([Google's comparison](https://developers.google.com/ar/develop/webxr/arcore-comparison)), for pages that draw with WebGL.

So a headset's browser no longer stands in the way of the virtual use. By their makers' own notes a Vision Pro can show a WebGPU page in WebXR, and a Quest can since November 2026, perhaps still behind a flag. Nobody on this project has tried either, and the page has no code that starts a session. An iPad still cannot do augmented reality in a browser at all. Standpoints work wherever the page already works.

### Which headset

Chad asked on 2026-11-20, having none: which one to buy, so that it suits the augmented and virtual devices coming to market. Prices and dates below are from news and shop pages, seen through a search's summaries on that day and not opened one by one. Only the two browser facts above were read at the maker's page. No device has been tried.

| Headset | Price in the US | A WebGPU page in its browser | For this project |
|---|---|---|---|
| **Meta Quest 3** | $599.99 with 512 GB, since a rise in April 2026 ([Forbes](https://www.forbes.com/sites/andrewwilliams/2026/04/17/meta-quest-3-hit-with-100-price-increase/)) | Listed as added in Browser 156 | The integrator's pick |
| Meta Quest 3S | $349.99 or $449.99 | The same browser | Cheaper; a coarser screen and lenses (general knowledge, not checked) |
| Apple Vision Pro | $3,699, since a rise in June 2026 ([UploadVR](https://www.uploadvr.com/apple-raises-the-price-of-most-products-including-vision-pro/)) | Yes, since Safari 26.2 | The best picture by report; six times the price; few visitors will own one |
| Samsung Galaxy XR | about $1,800 ([Road to VR](https://roadtovr.com/samsung-galaxy-xr-headset-price-specs-release-date/)) | Chrome with WebXR; WebGPU in it not confirmed past "experimental" | Wait |
| Valve Steam Frame | $1,059 or $1,299 | One review: "seemingly no WebXR support yet" ([Road to VR](https://roadtovr.com/valve-steam-frame-review/)) | No |
| Meta VR Glasses | $1,299.99, announced for spring 2027 ([a report of Meta's Connect 2026](https://vr.org/meta-connect-2026)) | Reported to run the Quest's system | The one to watch |

**The integrator's opinion: a Meta Quest 3.**
- It is the cheapest headset whose browser is listed as able to show this page.
- By general report it is the headset most people own, so it is the one most visitors would bring. No sales figure was checked.
- Its browser has offered passthrough augmented sessions for years (the integrator's knowledge, not checked on that day), so one device can try both the virtual and the augmented use.
- Meta's next device is reported to run the same system, so work tried on a Quest 3 should carry over. A Quest 4 is not reported before late 2027 ([a report of leaked plans](https://the-gadgeteer.com/2026/05/21/meta-quest-4-leak/)), and no new Vision Pro before late 2028 ([MacRumors](https://www.macrumors.com/roundup/apple-vision-pro/)).
- Nobody can say which maker's devices will lead. The page's protection is that it is built on web standards and not for one headset; a $600 device to test with keeps the larger purchase for when the devices of 2027 can be compared.

No headset suits the dig itself: the on-site use is a tablet or phone at a standpoint.

### The visitor's own position (D45)

Added on 2026-11-20. Chad: "We need to allow for geo-location if a person is actually on the island with a cell phone or mobile device so it is even more impressively a part of the exploration experience."

**What it is.** A visitor on Thera opens the page on a phone or tablet and taps a button. The view goes to the spot where they stand, as it was in 1628 BCE, at eye height. It follows them as they walk and turns as they turn the device. **Nothing is built, and nobody has opened the page on a phone.**

**What a phone's browser gives.** Read on 2026-11-20. The two W3C pages came back partly word for word and partly as a tool's summary, and each line says which.

| Need | What gives it | Read where |
|---|---|---|
| Where the device is | The Geolocation interface: latitude, longitude, and how sure the device is, in metres. It "requires express permission from an end-user", and a page not served securely is refused (both word for word). Its `heading` is the direction of travel, not the way the device points (summary only) | [W3C Geolocation](https://www.w3.org/TR/geolocation/), the draft of 18 November 2026 |
| Which way it points | The device orientation event, on secure pages only. The page asks with `requestPermission()`, which needs a tap the first time; the draft marks that method "at risk". Where the readings are absolute, the compass heading is 360° less `alpha` (all word for word). iPhones have given the heading in a field of their own, `webkitCompassHeading` (the integrator's knowledge, not checked) | [W3C Device Orientation](https://www.w3.org/TR/orientation-event/), the draft of 18 November 2026 |
| Drawing the world | WebGPU "is now shipping in Safari 26.0 for macOS, iOS, iPadOS, and visionOS". In Chrome it is "enabled by default in Chrome 121 on devices running Android 12 and greater powered by Qualcomm and ARM GPUs" | [WebKit, 15 September 2025](https://webkit.org/blog/17333/webkit-features-in-safari-26-0/); [Chrome's notes](https://developer.chrome.com/blog/new-in-webgpu-121) |
| A secure address | GitHub Pages sites on `github.io` "are served over HTTPS automatically". Pages is still off for the fork, and turning it on is Chad's action | [GitHub's documentation](https://docs.github.com/en/pages/getting-started-with-github-pages/securing-your-github-pages-site-with-https) |

**What the world already has.** Its true place (D42). A position becomes a place in the world by two multiplications: x = (longitude − 25.405) × 89,706 and z = (36.405 − latitude) × 110,966, in metres (`tools/terrain/lib.mjs`). The centre of the shelter, 36.3517° N 25.40345° E, comes out at x −139, z 5,914, where the town stands.

**What it can show, and how far to trust it.**

| Where the visitor stands | What the page can show | The limit |
|---|---|---|
| In the open, anywhere on the island | The same spot in 1628 BCE: a slope, a shore, open water, or land that is gone | A phone in the open is usually right to within 5 to 10 m (general knowledge, not measured here). That is enough for the landscape |
| At the dig, outside the shelter | That they are at the town, with the town round them | The town is placed only to within about 10 m (D22), so the page cannot say which street they are in |
| Inside the shelter | Probably not their place | Under a roof a phone's position is usually poor (general knowledge, not checked at this site). Here the visitor picks a standpoint on the route, and the compass still turns the view |

**Today's ground is not the ground of 1628.** The eruption buried the land under ash, 15 m deep on average in this model (liberty T-L1), and it broke down the ring of land round the bay. So the page takes from the device only where the visitor is, never how high. It sets them on the ground of 1628, or above the water where there was sea. A visitor on a boat in today's caldera may find land under them. That is the point: it is what the eruption did. Where the model's ground is a liberty, the page must not present it as measured.

**One function, three callers.** Position and standpoints are one feature. One function puts the viewer at a latitude, a longitude and a direction. A standpoint calls it with numbers kept in a link, such as `#at=36.3517,25.4035,180`. The button calls it with the device's own. A headset can call it later. The link also lets the feature be tested from anywhere, with no need to be on Thera, and lets a guide send a visitor to an exact view.

**Its rules.** Proposed by the integrator and approved by Chad on 2026-11-20 ("All approved").
1. The page asks for the position only after a tap, never when it loads. It works in full without it. If the visitor says no, or the device is not on the island, it says so in a line and changes nothing.
2. The position stays in the page. The page sends nothing and loads nothing at run time, which the gate checks, and it stores nothing. (A phone may itself use a network service to work out where it is. That is the phone's doing, not the page's.)
3. The page shows how sure the device says it is, and says that the town itself is placed only to within about 10 m.
4. The page makes no claim from position alone that the placing cannot bear: not "you are standing in the West House".

**What stands in the way.**
- **Nobody has opened the page on a phone.** Frame rate, heat, battery and a screen in sunlight are all unmeasured. The touch test (`HANDOFF.md`) is the first step.
- **A signal at the site.** Not known. The page is one file of 170 kB and needs no network once it is open, but nothing yet keeps it on a phone for use without a signal. Chad has decided that it must work without one (D47); how is "Use without a connection" below.
- **The plan's place on the Earth**, as for augmented reality below. Two or three surveyed points from the excavation would settle it (O8; the draft letter now asks for them).
- **The site's own wishes.** A tool for use at the site should be shown to the excavation first (O8).

A guess at its size: 1 to 2 kB.

### Use without a connection (D47)

Added on 2026-11-20. Chad: "We will want it to be downloadable for those that may not be online but have enough connection to be able to determine their location to note on the maps."

**What it is.** A visitor opens the page once where they have a connection, at home or at their hotel. After that it opens with no signal at all, and it can still show where they are, because a device finds its position from satellites and not from the network (general knowledge, not tested). The position is shown in two ways: standing in the world, and as a mark on a view from above with a ring as wide as the device's doubt. The second is the integrator's reading of "to note on the maps". On a view from above a doubt of 10 m is honest, where a view from eye height pretends to more.

**Decided on 2026-11-21 (D48): both ways below, with instructions for the Home Screen.** Chad: "I agree, both. We can give instructions for adding to the Home Screen in that case."

**Three ways to keep the page on a device.**

| Way | What the visitor does | Where it works | What it costs |
|---|---|---|---|
| **A keeper file** beside the page (a service worker) | Opens the address once. On an iPhone or iPad, also adds it to the Home Screen | Phones, tablets and computers. The page keeps its secure address, so position still works | A second small file, which the one-file law does not allow as it stands. It holds no part of the world |
| **A plain download** of `index.html` | Saves the file and opens it later | Computers. On a phone a saved page is awkward to open, and it has no secure address, so position is probably refused (the integrator's knowledge, not checked) | Nothing: the page is already one file |
| **Both** | Either | Everywhere one of them works | The same second file |

The integrator recommended both, and Chad chose both.

**What was read, on 2026-11-20.**
- A service worker exists for this. Its specification speaks of "allowing the service worker to provide content for documents, even while offline", shows it registered from a file of its own, and marks it for secure pages only (word for word; [W3C Service Workers](https://www.w3.org/TR/service-workers/), the draft of 17 November 2026). That it cannot be written inside the page itself is the integrator's knowledge; the part of the specification that would say so was not reached.
- **Safari clears what a page has kept** "after seven days of Safari use without user interaction on the site", and names "Service Worker registrations and cache". Pages added to the Home Screen are apart: "We do not expect the first-party in such a web application to have its website data deleted" ([WebKit, 24 March 2020](https://webkit.org/blog/10218/full-third-party-cookie-blocking-and-more/); an old post, and nothing later was looked for). So on an iPhone the visitor should add the page to the Home Screen, or have opened it within the week.
- **Chrome** "may evict site data at its discretion, for example, when device storage is low", and a page can ask for storage that is not cleared that way ([web.dev](https://web.dev/articles/storage-for-the-web)).

**What it asks.**
- The world stays whole in `index.html`, and that file runs by itself with no keeper file present. The gate goes on checking that the page loads nothing but the keeper file, and that the keeper file holds no part of the world. Work orders may not change `checks/`, so the order says who changes the gate.
- The keeper file must fetch the newer page whenever there is a connection, or visitors keep an old world.
- The page says plainly when it is kept: "Saved for use offline", and on an iPhone how to add it to the Home Screen.
- A test nobody can do yet: a phone with Wi-Fi and mobile data off, position on. It can be done at home, with a link that stands in for Thera.

### What it asks of the engine now

These cost little while things are being built and a great deal afterwards. From work order 004 on, every order keeps them.

1. **True scale and true place.** The world is in metres, x east and z south, with its origin at 36.405° N, 25.405° E (`source/src/world.js`). That stays.
2. **One camera, read by every drawing pass.** A headset draws each frame once for each eye. Passes that do not depend on the eye (the shadow maps, the baked ground, the placing of things) run once. The rest take a view and a projection, and can run twice.
3. **Nothing that works only on a flat screen, without a note.** An effect worked out from a pixel's place on the screen has to be thought through for two eyes: the dither of a fade (D41), light shafts, haze, the resolution scaler. The pixel dither has not been seen in a headset, where each eye gets its own pattern and it may sparkle.
4. **Controls that can be called without the menu.** The page's menu cannot be seen inside a headset. The layer, the date, the year and the viewpoints are set by plain functions that any kind of input can call.
5. **A town that can be drawn without its surroundings.** Augmented reality shows the town's layers over the real scene: no sky and no sea, the land as an unseen shape that hides what is behind it, and the sun at the real hour. The date control of work order 004 gives the last.
6. **A frame budget far below today's.** Two eyes at 72–90 frames a second on a headset's chip is several times the work of one view at 60 on this Mac. A detail level below Low will probably be needed. This is a guess.

### What stands in the way

- **Placing the town on the real walls.** The plan was traced from a published map and placed on the centre of the modern shelter, measured from OpenStreetMap (D22). How far that is from the truth is not known, and augmented reality needs centimetres. The excavation's own survey would settle it (O8).
- **Finding the viewer under the shelter.** The site is roofed, and a device's sense of its own position is usually poor indoors. That is general knowledge, not checked for this site. The viewer would be placed by a standpoint they choose, or by markers.
- **The visitor route is modern data the project does not hold.** It needs a source like anything else.
- **Size.** WebXR needs no library, so the one-file law holds. A guess: a few kB for a headset session, and less for standpoints.

### Order

1. Keep the six points above in every order, starting with 004.
2. **Standpoints, the visitor's own position and use without a connection** (D45, D47), as one small order once the layers and the date are in. They serve D42 on the devices people already carry. The page must be on GitHub Pages first, and someone must have opened it on a phone. All but the last test can be done from anywhere with links; the last test needs someone on the island.
3. **A measuring spike for a headset**, as work order 003 was for the layers: two eyes in the development build, on a real device, with numbers. Its first question is whether the device's browser shows the page at all without a flag. It can follow work order 004 as soon as a headset is at hand.
4. **Augmented reality**, after the excavation's survey and the labels.

Which device, and which use first, is O23.
