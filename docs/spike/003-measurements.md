# Work order 003: the measuring spike

What `docs/ARCHITECTURE.md` §4 proposes for layers, dates and years was built as three small prototypes in the development build, measured, and stopped. This is the report. Written 2026-11-19 on the branch `task/003-measuring-spike`.

**Nothing here is evidence, and nothing here is the feature.** The placed things are grey shapes, not plants. The second island is today's island as a stand-in, not a model of the eruption. The "years" and "days" a shape stands for are dice.

**Every time in this report is this Mac's** (Apple M4, Chrome 157 headless on the Metal adapter, a 1600 × 812 picture), which flatters. No iPad has been measured. The Mac was also in use while the timings ran (a video call and a browser shared the GPU), so two runs of the same state differ by about a millisecond. Read the tables with that in mind: **a difference under about 1 ms is noise**, and where three runs disagree this report says so and does not pick one.

The pictures are in the private artifact **Thera Spike 003**: <https://claude.ai/artifact/RT8eBH4JC9c7vsxUHJTRbk>.

## 1. The verdicts

| Part of the design (`ARCHITECTURE.md`) | Verdict |
|---|---|
| §4.1 One visibility function: a layer, the years, the days give one number | **Holds.** One 12-line function serves the town and the placed things, in the vertex, fragment and compute stages. Three numbers go to every shader |
| §4.1 A building's tags in a small table, looked up by the number its vertices carry | **Holds with a change.** The vertices carry no building number: they carry a one-byte seed that 463 outlines share. A number has to be added, two bytes a corner. It fits in the corner's 32 bytes if the wall's length is stored as 16 bits |
| §4.1 The fade is a dither, and the shadow uses the same pattern | **Holds with three changes.** (1) Dither on the samples inside a pixel ("coverage"), not pixel by pixel. (2) A shader that may discard must not draw the town at rest: keep an opaque pipeline and switch. (3) The town's shadow map has to be drawn again on every frame of a fade, which is most of what a fade costs. Low detail has one sample a pixel, so it needs the per-pixel dither or the rise |
| §4.1 Collision reads the same table; a viewer on a fading roof is lowered gently | **Holds.** Tested by script |
| §3.3 Hidden things cost nothing | **Holds for the hidden thing, not for the frame.** Showing only Found was not measurably faster than showing everything in any run, and was slower in most: the bare ground costs more to shade than the houses that hid it |
| §4.2 The GPU places everything numerous | **Holds.** No optional WebGPU feature is needed. The pass itself is close to free; drawing what it keeps is the cost |
| §4.3 The later island is stored as a compact difference | **Does not hold as estimated.** The stand-in is 41.3 kB of page as a difference, against an estimate of 15–25 kB with the eruption, and only 28% smaller than storing it whole. What would hold: coarser heights (28.6 kB at 2 m) or a coarser grid (18.8 kB at 80 m cells) |
| §4.3 The later island is a second set of maps, blended by the year | **Holds for speed, with a cost in memory.** Blending is inside the noise at rest and in motion. The second set of maps takes 133 MB of GPU memory on High (37 MB on Medium and Low) and 0.15 s of load |
| §4.4 the sky, §4.5 time as data, §4.6 seasons | Not tested |

## 2. How the prototypes were kept out of the released page

**As files that only the development build includes.** `source/build.mjs` adds `spike.js`, `spike-fade.js`, `spike-place.js`, `spike-island.js`, `spike-year.js` and `spike-go.js` to `dev.html` and never to `index.html`.

The engine's files are not changed by the spike at all. Each spike shader is the engine's own shader text with marked replacements (a replacement that does not find its place stops the page with a message), everything a part adds is in bind group 1 so that group 0 stays the engine's, and `spike-go.js` draws the frame with its own copy of the engine's `render()`. `spk.on = 0` hands the frame back to the engine untouched, which is the baseline every time is compared with.

Why this way and not a build-time switch: it makes "the released page is unchanged" true by construction, and the gate proves it. The price is duplication (the copy of `render()`, the replacement anchors), so **the spike's code sizes below overstate what the real feature will add.**

`index.html` is 169,665 bytes against 169,589 on `main`: **76 bytes more, all of it keeper K2.**

## 3. How it was measured

- `tools/town/shot.mjs` drives the page in headless Chrome on the real GPU. It now waits for the spike, saves PNGs, compares two pictures, reads the JavaScript heap, emulates a touch device and writes what each step returned as JSON. The JSON is in `docs/spike/data/`.
- **GPU time a frame** comes from the engine's own timestamp queries, which bracket the whole frame from the water pass to the final composite. `spk.meas()` takes the mean over 3 s after 0.7 s to settle. The page's resolution scaler is held at full size, so a slower state shows as more milliseconds, not fewer pixels.
- **The baseline** is the engine alone in the same page and view, timed before and after the states. The tables give what each state adds to it.
- Each part was measured in a page built with that part only (`node build.mjs --dev --only fade --out dev-fade.html`), on High, Medium and Low detail.
- The whole set was run twice (`data/run1`, `data/run2`); measurement 1 on High has a third, earlier run (`data/run0`). The tables are the last run.

## 4. Measurement 1: a layer of the town fading

### What was built
`spike-fade.js`. The outlines flagged as excavated are Found (27 of them, with the terraces and the pithos) and the other 436 are Inferred. (The town record counts 19 excavated buildings; some are stored as more than one outline. That count was not checked here.)

1. **One layer value** from 0 (Found) to 2 (Imagined) reaches every shader, with the year and the day.
2. **A table of four numbers a building** (layer, place in the wave, foot, top), 7.5 kB at run time, read in the vertex shader. It costs the page no data: it is worked out at load from the flag each outline already has. The building's number is the part that is missing from the engine (§1): the spike supplies it as a second vertex buffer.
3. **Seven ways of fading**, switchable with key `J` and `N`, in the colour pass and in the town's shadow pass, none with any sorting:
   - dither pixel by pixel; dither by coverage (on the four samples in a pixel); dither fixed to the surface;
   - rise, clipped above a climbing height; rise "with a lid", where everything above the climbing height is pressed down onto it, so no pixel is ever discarded;
   - a wave from the excavated centre outward, with the coverage dither or with the lidded rise.
4. **Collision follows.** A hidden building is not there; one part shown stands part of its height.
5. **The paving and street shading fade too** (the order asked only for a note). A second plan map is made of the Found buildings alone and the ground's shader mixes the two by the layer.

### The numbers

Size: the part is 9,229 bytes of `dev.html` as written (2,774 compressed); minified into the page it would be 5,182 bytes (2,074 compressed).

<!-- BEGIN m1 -->
GPU time a frame added to the engine's own, in milliseconds (means over 3 s; 1600 × 812; H, M, L = High, Medium, Low detail). The first row is the engine alone, in full.

| state | v7 H | v7 M | v7 L | v8 H | v8 M | v8 L | v9 H | v9 M | v9 L |
|---|--:|--:|--:|--:|--:|--:|--:|--:|--:|
| **the engine alone** (ms) | **4.27** | **4.24** | **3.01** | **4.47** | **4.65** | **2.85** | **7.09** | **6.29** | **3.75** |
| rest, all shown, opaque | +0.03 | −0.08 | +0.11 | −0.07 | −0.21 | +0.04 | −0.59 | +0.04 | −0.06 |
| rest, all shown, discarding shader | −0.04 | +0.08 | +0.22 | −0.19 | −0.03 | +0.27 | −0.60 | +0.05 | +0.66 |
| rest, Found only, opaque | +0.55 | +0.75 | +0.37 | +0.20 | +0.17 | +0.10 | −0.44 | +0.25 | +0.62 |
| moving: dither by pixel | +2.23 | +1.90 | +1.48 | +1.41 | +0.77 | +1.06 | +0.02 | +0.56 | +2.25 |
| moving: dither by coverage | +2.09 | +2.17 | +1.41 | +1.20 | +1.13 | +0.88 | +0.25 | +0.68 | +2.19 |
| moving: dither on the surface | +1.68 | +1.47 | +1.25 | +1.18 | +0.63 | +0.85 | −0.44 | +0.25 | +1.64 |
| moving: rise, clipped | +1.03 | +0.86 | +0.80 | +0.88 | +0.55 | +0.60 | −0.67 | +0.17 | +1.43 |
| moving: rise, with a lid | +0.62 | +0.51 | +0.58 | +0.69 | +0.25 | +0.46 | −0.77 | +0.13 | +0.62 |
| moving: wave, dither by coverage | +0.89 | +0.90 | +0.68 | +0.61 | +0.56 | +0.62 | −0.42 | +0.46 | +1.61 |
| moving: wave, rise with a lid | +0.65 | +0.54 | +0.68 | +0.73 | +0.28 | +0.44 | +0.08 | +0.21 | +0.92 |

The same states in full, 95th percentile of the GPU time a frame (ms):

| state | v7 H | v7 M | v7 L | v8 H | v8 M | v8 L | v9 H | v9 M | v9 L |
|---|--:|--:|--:|--:|--:|--:|--:|--:|--:|
| engine (spike off) | 5.18 | 5.37 | 3.67 | 5.05 | 5.18 | 3.21 | 7.14 | 6.88 | 4.13 |
| rest, all shown, opaque | 5.51 | 5.44 | 3.74 | 5.18 | 5.37 | 3.34 | 7.01 | 6.95 | 4.26 |
| rest, all shown, discarding shader | 5.51 | 5.64 | 3.87 | 5.24 | 5.37 | 3.54 | 6.95 | 6.95 | 5.18 |
| rest, Found only, opaque | 6.09 | 6.68 | 3.80 | 5.70 | 5.77 | 3.34 | 7.08 | 7.14 | 5.05 |
| moving: dither by pixel | 8.59 | 8.52 | 6.16 | 7.80 | 6.68 | 4.92 | 7.86 | 7.34 | 6.95 |
| moving: dither by coverage | 8.65 | 8.65 | 5.96 | 7.41 | 6.88 | 4.72 | 8.00 | 7.41 | 7.01 |
| moving: dither on the surface | 7.67 | 7.21 | 5.96 | 7.27 | 6.55 | 4.78 | 7.27 | 7.08 | 6.75 |
| moving: rise, clipped | 7.34 | 6.49 | 4.92 | 6.88 | 6.42 | 4.33 | 7.14 | 7.08 | 6.16 |
| moving: rise, with a lid | 6.42 | 6.16 | 4.78 | 6.49 | 6.09 | 4.06 | 7.21 | 7.27 | 5.11 |
| moving: wave, dither by coverage | 6.75 | 6.62 | 4.98 | 6.49 | 6.16 | 4.26 | 7.73 | 7.80 | 6.75 |
| moving: wave, rise with a lid | 6.49 | 5.96 | 4.59 | 6.09 | 6.09 | 4.13 | 8.78 | 7.01 | 5.57 |

Frame rate, the lowest of all states: high 60 fps, medium 60 fps, low 60 fps. Slowest single frame: high 18.9 ms, medium 21.3 ms, low 21.6 ms.

| the engine alone, ms | v7 H | v7 M | v7 L | v8 H | v8 M | v8 L | v9 H | v9 M | v9 L |
|---|--:|--:|--:|--:|--:|--:|--:|--:|--:|
| earlier run | 5.63 | 5.17 | 3.42 | 4.93 | 4.83 | 3.15 | 8.52 | 7.62 | 4.08 |
| this run | 4.27 | 4.24 | 3.01 | 4.47 | 4.65 | 2.85 | 7.09 | 6.29 | 3.75 |

Three runs of the same states at view 9, High (added ms; the engine alone in bold):

| state | first run | second run | third run (the table above) |
|---|--:|--:|--:|
| **the engine alone** | **6.20** | **8.52** | **7.09** |
| rest, all shown, opaque | −0.04 | +0.17 | −0.59 |
| rest, all shown, discarding shader | +1.14 | +0.68 | −0.60 |
| rest, Found only, opaque | +1.92 | +1.15 | −0.44 |
| moving: dither by pixel | +4.32 | +1.14 | +0.02 |
| moving: dither by coverage | +4.41 | +1.19 | +0.25 |
| moving: dither on the surface | +3.42 | +1.15 | −0.44 |
| moving: rise, clipped | +2.32 | +1.35 | −0.67 |
| moving: rise, with a lid | +1.02 | +0.62 | −0.77 |
| moving: wave, dither by coverage | +2.49 | +1.85 | −0.42 |
| moving: wave, rise with a lid | +1.32 | +1.81 | +0.08 |

Town data: `{"buildings":463,"found":27,"inferred":436,"tableBytes":7456,"idBytes":1715872,"corners":428968,"triangles":214608,"trianglesFound":9814,"trianglesInferred":204794,"buildMs":211.1,"planMapBytes":5592405}`
<!-- END m1 -->

Shimmer, the same picture twice and the first memory readings, as measured:

<!-- BEGIN other -->
How much the picture changes when the camera moves 5 cm sideways (view 9, the fade at a half): the sum over all pixels of the change, in millions of grey levels, and that as a multiple of the same move with nothing fading.

| way of fading | at 100% resolution | × control | at 70% resolution | × control | at 50% resolution | × control |
|---|--:|--:|--:|--:|--:|--:|
| nothing fading (control) | 1.25 |  | 1.06 |  | 0.97 |  |
| dither by pixel | 1.83 | 1.47 | 1.33 | 1.24 | 1.07 | 1.10 |
| dither by coverage | 1.64 | 1.31 | 1.14 | 1.07 | 0.94 | 0.96 |
| dither on the surface | 5.86 | 4.69 | 4.19 | 3.93 | 3.30 | 3.38 |
| rise, clipped | 2.25 | 1.80 | 1.65 | 1.55 | 1.36 | 1.40 |
| rise, with a lid | 1.08 | 0.86 | 0.90 | 0.84 | 0.81 | 0.83 |

The same view twice (measurement 2): `{"pixels":1300800,"differ":4,"greatest":1,"meanOfThoseThatDiffer":1}`

JavaScript heap after a collection, dev-place.html: spike on 1162112 → 1286568 bytes (+124456); spike off 1282544 → 1320828 bytes (+38284).

JavaScript heap after a collection, dev.html: spike on 2082448 → 2209788 bytes (+127340); spike off 2174412 → 2214332 bytes (+39920).
<!-- END other -->

### What the numbers say
- **At rest, with an opaque pipeline, the fade costs nothing measurable.** The spike's page with everything shown is within the noise of the engine in every run.
- **A shader that may discard costs even when it discards nothing.** The likely reason: this kind of GPU removes hidden surfaces for opaque geometry before shading, and a shader that can discard or writes a sample mask loses that. From over the roofs (view 9) it added 1.2 ms in the first run and 0.5 ms in the second on High, and 0.7 ms on Low in the third; elsewhere it was inside the noise. The cure is cheap: draw with an opaque pipeline whenever nothing is fading. The spike does (`spk.restOpaque`).
- **Showing only Found is not cheaper.** With 436 buildings gone the town's own cost falls to almost nothing, yet the frame took the same or more (+1.9 ms at view 9 in the first run; +0.1 to +0.8 ms in the street views in the last, and inside the noise from above). The ground that appears is costlier to shade than the walls that covered it.
- **A fade in motion costs about 1–2 ms, more from above.** In the last run the dithers added 0.8–2.2 ms in the street views; in the first run they added about 4.4 ms from over the roofs. The order is the same in all three runs: the pixel and coverage dithers cost most, the surface dither a little less, the clipped rise less again, and **the lidded rise least (0.1–1.0 ms)**. The lidded rise discards nothing, so what it costs is the town's shadow map being drawn again every frame. That redraw is the floor for any fade.
- **A wave costs about half of an all-at-once fade**, because fewer buildings are part-shown at a time.
- **60 fps in every state on all three detail levels**, on this Mac.

### Shadows, shimmer, collision
- **Shadows follow** in every way of fading. With a dither the shadow is drawn through the same pattern and the engine's 3 × 3 shadow filter softens it into a paler shadow. At a low share and from far off the pattern can be seen as dots on the ground (`m1-v9-wave-coverage-50`).
- **Shimmer** was measured, not only looked at: the same view twice with the camera moved 5 cm sideways, at a half fade (table above). The coverage dither changes the picture 1.3 times as much as the same move with nothing fading; the pixel dither 1.5 times; **the surface dither 4.7 times**, because its holes are smaller than a pixel from any distance and flicker as they cross pixel edges. The lidded rise does not shimmer at all.
- **When the page drops its resolution** the dithers shimmer less by this measure (the stretched picture blurs them) but their holes are larger on screen. On Low there is one sample a pixel, so the coverage dither becomes the pixel dither.
- **Collision** (`data/collision.json`): a walker on a roof 6.0 m above the ground came down with it over 2.5 s, smoothly, and stayed on foot; when the house came back under the walker it carried them up to the roof again. With the house hidden the walker crossed its ground (to 3.3 m from its centre, where the wall had been at 8.25 m); with it shown the wall stopped them at 8.1 m. With the wave the roof holds, then drops faster (6 m in about a second).

### What else belongs to a hidden building
- **The paving, the shade at the foot of the walls and the light the walls throw into the street** all come from the town's plan map. Mixing two plan maps by the layer works and is in the pictures. It takes a second 1024 × 1024 map (5.6 MB of GPU memory) and two more texture reads in the ground's shader inside the town.
- **It does not follow a wave.** The mix is one number for the whole town, so paving appears ahead of the houses when the fade spreads (`m1-v9-wave-coverage-75` shows the street grid waiting for its houses). The plan map would have to carry each place's turn in the wave.
- **Being lifted onto a roof** when a house appears under the viewer is what the spike does. It is the simplest rule that never traps anyone inside a wall; whether it is the right one is a choice.
- The spike builds the town three times at load (207 ms more). That is an artefact: the real build would make both plan maps and the numbers in the one pass.

### What it looks like (Claude's eyes; the choice is Chad's)
The coverage dither reads as clear glass, with no pattern at reading distance. The pixel dither shows a fine diagonal screen over everything that is fading. The surface dither is coarse and torn. The clipped rise shows the houses as hollow shells, open at the top. The lidded rise shows a low solid town growing storey by storey. The wave reads as a town spreading from its excavated centre, with the paving fault above.

## 5. Measurement 2: placing by rule on the GPU

### What was built
`spike-place.js`. A compute pass runs every frame. The ground round the viewer is cut into cells at nine sizes, 256 × 256 cells each, from 1 m to 256 m. A size of cell is a size of thing. For each cell up to K spots come from an integer hash of the cell's number, so the same spots come out every frame, on every GPU. A spot is kept if it is on land, passes a stand-in rule (slope, height and a patchy noise), is shown by its layer, years and days through the same visibility function as the town, and is in view. Kept things go into one of three lists by how large they look (a two-tier box of 60 corners, a box of 30, an upright card of 6), and the counts go straight into the buffer the three indirect draws read. JavaScript does nothing for any one thing, and nothing is stored.

### What it needs of WebGPU
**No optional feature.** The page asks for none; `timestamp-query` is used only to measure. Within the default limits it uses: five storage buffers in the compute stage (8 allowed); one read-only storage buffer in the vertex stage; three bind groups (4 allowed); work groups of 8 × 8, dispatched 32 × 32 × 9; atomic counters; `drawIndirect` with the first instance at 0, so `indirect-first-instance` is not needed. The largest buffer is 8.4 MB and the three lists 13.6 MB together.

Two cautions for the iPad. **With all three parts on, the ground's shader reads 14 textures, and 16 is the default limit**, so two are left. And a storage buffer read in the vertex stage is part of core WebGPU but may not be offered by its reduced "compatibility" mode; an iPad should run core, but nobody has run this there.

### The numbers

Size: the part is 13,671 bytes of `dev.html` as written (4,613 compressed); minified it would be 7,832 bytes (3,230 compressed).

<!-- BEGIN m2 -->
GPU time a frame added to the engine's own, in milliseconds (means over 3 s; 1600 × 812), and how many things were kept.

| view and state | High | kept | Medium | kept | Low | kept |
|---|--:|--:|--:|--:|--:|--:|
| **view 1: the engine alone** (ms) | **9.05** |  | **8.73** |  | **4.00** |  |
| v1 the pass with nothing kept | +1.67 | 0 | +0.02 | 0 | +0.05 | 0 |
| v1 aimed at 10,000 | +0.02 | 10003 | −0.28 | 10002 | +0.27 | 10002 |
| v1 aimed at 10,000, no fade test | +1.27 | 10003 | −0.15 | 10002 | +0.21 | 10002 |
| v1 aimed at 50,000 | +2.20 | 49519 | +0.12 | 49504 | +1.35 | 49504 |
| v1 aimed at 50,000, no fade test | +2.10 | 49519 | +0.04 | 49504 | +0.75 | 49504 |
| v1 aimed at 200,000 | +1.85 | 199916 | +0.96 | 199954 | +6.11 | 199954 |
| v1 aimed at 200,000, no fade test | +0.78 | 199916 | +0.69 | 199954 | +3.79 | 199954 |
| v1 aimed at 200,000, placed but not drawn | −1.33 | 199916 | +0.62 | 199954 | +0.33 | 199954 |
| **view 3: the engine alone** (ms) | **6.89** |  | **8.11** |  | **4.88** |  |
| v3 the pass with nothing kept | −0.36 | 0 | −0.03 | 0 | +0.00 | 0 |
| v3 aimed at 10,000 | −0.15 | 10039 | +0.44 | 10038 | +0.28 | 10038 |
| v3 aimed at 10,000, no fade test | −0.29 | 10039 | +0.42 | 10038 | +0.11 | 10038 |
| v3 aimed at 50,000 | +0.66 | 49852 | +1.64 | 49861 | +2.22 | 49861 |
| v3 aimed at 50,000, no fade test | +0.16 | 49852 | +1.37 | 49861 | +1.68 | 49861 |
| v3 aimed at 200,000 | +1.17 | 82213 | +1.70 | 82206 | +3.38 | 82206 |
| v3 aimed at 200,000, no fade test | +1.29 | 82213 | +2.13 | 82206 | +2.80 | 82206 |
| v3 aimed at 200,000, placed but not drawn | +0.02 | 82213 | +1.25 | 82206 | +1.18 | 82206 |
| **view 9: the engine alone** (ms) | **6.22** |  | **6.27** |  | **3.58** |  |
| v9 the pass with nothing kept | +0.14 | 0 | −0.26 | 0 | +0.21 | 0 |
| v9 aimed at 10,000 | +0.44 | 9952 | −0.64 | 9954 | +0.23 | 9954 |
| v9 aimed at 10,000, no fade test | −0.69 | 9952 | −0.84 | 9954 | +0.10 | 9954 |
| v9 aimed at 50,000 | +0.51 | 50171 | +0.13 | 50149 | +1.18 | 50149 |
| v9 aimed at 50,000, no fade test | +0.29 | 50171 | −0.37 | 50149 | +0.78 | 50149 |
| v9 aimed at 200,000 | +2.38 | 200123 | +2.29 | 200153 | +3.62 | 200153 |
| v9 aimed at 200,000, no fade test | +2.36 | 200123 | +1.37 | 200153 | +3.38 | 200153 |
| v9 aimed at 200,000, placed but not drawn | +0.13 | 200123 | +0.16 | 200153 | −0.00 | 200153 |
| **view 7: the engine alone** (ms) | **3.89** |  | **4.55** |  | **2.87** |  |
| v7 the pass with nothing kept | +0.00 | 0 | +0.33 | 0 | +0.17 | 0 |
| v7 aimed at 10,000 | −0.58 | 10000 | −0.42 | 9997 | −0.40 | 9997 |
| v7 aimed at 10,000, no fade test | −0.70 | 10000 | −0.65 | 9997 | −0.56 | 9997 |
| v7 aimed at 50,000 | +0.92 | 50029 | +1.06 | 50032 | +1.03 | 50032 |
| v7 aimed at 50,000, no fade test | +0.63 | 50029 | +0.64 | 50032 | +0.41 | 50032 |
| v7 aimed at 200,000 | +4.93 | 200893 | +2.75 | 200900 | +4.02 | 200900 |
| v7 aimed at 200,000, no fade test | +5.16 | 200893 | +2.00 | 200900 | +3.85 | 200900 |
| v7 aimed at 200,000, placed but not drawn | +0.20 | 200893 | +0.04 | 200900 | +0.13 | 200900 |

Spots tried a frame, and the dial (tries a cell × the chance each is kept), High: v1/10k 0.59 M (1 × 0.4476); v1/50k 1.77 M (3 × 0.7458); v1/200k 5.90 M (10 × 0.9037); v3/10k 2.36 M (4 × 0.9766); v3/50k 11.80 M (20 × 0.9728); v3/200k 18.87 M (32 × 1); v9/10k 0.59 M (1 × 0.2809); v9/50k 1.18 M (2 × 0.7057); v9/200k 3.54 M (6 × 0.9377); v7/10k 0.59 M (1 × 0.2766); v7/50k 1.18 M (2 × 0.6915); v7/200k 3.54 M (6 × 0.9214).

By form at 200,000 (two-tier box / box / card), High: v1 forms 0/182/199734, 10 tries a cell x 0.904; v3 forms 0/0/82213, 32 tries a cell x 1.000; v9 forms 444/12819/186860, 6 tries a cell x 0.938; v7 forms 1837/22341/176715, 6 tries a cell x 0.921.

Frame rate, the lowest of all states: high 60 fps, medium 60 fps, low 60 fps. Slowest single frame: high 18.7 ms, medium 18.7 ms, low 22.1 ms.

| the engine alone, ms | v1 H | v1 M | v1 L | v3 H | v3 M | v3 L | v9 H | v9 M | v9 L | v7 H | v7 M | v7 L |
|---|--:|--:|--:|--:|--:|--:|--:|--:|--:|--:|--:|--:|
| earlier run | 8.18 | 10.73 | 4.11 | 8.62 | 8.36 | 5.17 | 7.62 | 6.45 | 3.97 | 4.57 | 5.20 | 3.50 |
| this run | 9.05 | 8.73 | 4.00 | 6.89 | 8.11 | 4.88 | 6.22 | 6.27 | 3.58 | 3.89 | 4.55 | 2.87 |

The pass: `{"levels":9,"cellsASide":256,"finestCellMetres":1,"listCaps":[32768,131072,262144],"cornersAForm":[60,30,6],"instanceBytes":32,"listBytes":13631488,"dispatch":[32,32,9]}`
<!-- END m2 -->

### What the numbers say
- **The pass with nothing kept is free**, and so is placing without drawing: 200,000 kept things, placed and not drawn, added 0.0–0.6 ms where 3.5–5.9 million spots were tried. Trying 18.9 million spots a frame (view 3, the dial at its end) added up to 1.3 ms.
- **Drawing is the cost.** About 10,000 kept things are inside the noise. About 50,000 add 0.1–2.2 ms. **About 200,000 add 1–6 ms**, most where the shapes cover the screen: on foot in the town on High (4.9 ms, and 7.1 ms in the earlier run) and from the sea on Low (6.1 ms).
- **Low is not the cheap level for placed things.** It has no multisampling but the same number of shapes, and it was the slowest level at 200,000 in three of four views in the last run.
- **The fade's test costs here as well**: drawing 200,000 without it was up to 2.3 ms cheaper (Low, view 1) and usually within the noise.
- **View 3 did not reach 200,000.** From 9 km up only the two coarsest sizes are in range; with the dial at its end (32 tries a cell) 82,000 were kept.
- **The same view gives the same picture twice**: after going to another view and back, 4 of 1,300,800 pixels differed, each by one grey level (the lists fill in a different order each frame, and two shapes at the same depth can swap).
- **60 fps in every state on all three detail levels**, on this Mac.

### JavaScript's memory over a minute of flying
Engine law 3 says no allocation in the frame. The heap was read after a forced collection, before and after each minute of the scripted flight (key `F`), with about 50,000 shapes kept, in the page with all three parts (`data/run2/heap2.json`):

| | bytes in use | change over the minute |
|---|--:|--:|
| before | 2,079,292 | |
| spike on, first minute | 2,209,588 | +130,296 |
| spike on, second minute | 2,209,396 | −192 |
| spike on, third minute | 2,219,320 | +9,924 |
| spike off (the engine's own frame), fourth minute | 2,204,068 | −15,252 |

**It does not grow.** The first minute adds 0.13 MB once, whichever frame runs it (in an earlier pair of readings the engine's own frame, run second, added 38–40 kB), and after that the heap stays within 15 kB. The pass allocates no JavaScript object per thing or per frame beyond what the engine's own frame already makes (one command encoder, its passes and one promise a frame for the timing).

### What this stand-in does not tell
- **The shapes cast no shadows.** The island's shadow map has texels 6 m wide and cannot hold a shrub's shadow; a second, nearer shadow map would be a new cost, not measured.
- **The shapes are opaque boxes and far too big** (up to 8 m across near the viewer). Real foliage is small, see-through at its edges and overlaps itself, so its cost a pixel is higher and its cost a shape lower. The numbers bound the mechanism, not the plants.
- **The rule does not know the town.** Shapes stand inside houses, and `m2-v7-10k` was taken from inside one. A land-cover map has to say where nothing grows.
- The lists are fixed in size (32,768, 131,072 and 262,144). A count over a list's size is cut to it on the GPU, and the things past it are not drawn. None filled in any run.

## 6. Measurement 3: two islands, blended by the year

### What was built
- `node tools/terrain/build.mjs --second` writes today's island on the page's grid and datum (the surface the build already starts from, after the sea level is set to that of 1628 BCE) as `source/src/spike-island.js`, packed as a difference from the island of 1628 BCE, and `docs/spike/island-report.json`. It leaves the island of 1628 BCE and `terrain-data.js` byte for byte as they were.
- `spike-year.js` reads it, bakes a second set of height, slope and rock maps with the engine's own bake shaders, and mixes the two sets by one number in the ground's shader, the island's shadow (drawn again while the number moves), **the sea's shader** (it reads the depth of the water, so it has to follow or the sea has holes where the old land was) and the height the walker stands on.
- The town is not drawn once the blend leaves 0: it belongs to the first island.

### What a second island costs in the page

Both packings follow the same rule for how far a stored height may be from the true one, so they can be compared.

| How the stand-in is packed | bytes of data | as text in the page |
|---|--:|--:|
| *(the island of 1628 BCE, for scale)* | *54,274* | *72,368* |
| Whole, with the existing coder | 43,053 | 57,404 |
| As a difference, each cell predicted from the plane through its neighbours' differences | 35,168 | 46,892 |
| **As a difference, predicted from the mean of two neighbours' differences (used)** | **30,953** | **41,272** |
| The same, heights to 1 m at best (0.5 m today) | 26,515 | 35,356 |
| The same, heights to 2 m at best | 21,442 | 28,592 |
| Whole, heights to 2 m at best | 34,125 | 45,500 |
| Whole, on a grid of 80 m cells | 14,076 | 18,768 |

Where the difference's 30,953 bytes go: the land outside the caldera 15,425; the caldera side 9,024; the coarse grid 3,430; the sea elsewhere 1,551; the rock classes 1,517.

**Why the difference is not small.** The review took the difference to be smooth and confined to the caldera and the ash blanket. The blanket is the whole island: stripping the eruption's deposits (terrain edit E3) changed every cell of land, by an amount that follows slope and position cell by cell, so half the bytes are spent on land the eruption did not move. The first island's own rounding is also inside every prediction. A plain average of two neighbours' differences beat the usual plane by 12% for that reason.

With its reader and the blend the part is 47,248 bytes minified (35,674 compressed), 41,272 of them the data.

### Speed, load and memory

<!-- BEGIN m3 -->
GPU time a frame added to the engine's own, in milliseconds (means over 3 s; 1600 × 812).

| state | v1 H | v1 M | v1 L | v2 H | v2 M | v2 L | v3 H | v3 M | v3 L |
|---|--:|--:|--:|--:|--:|--:|--:|--:|--:|
| **the engine alone** (ms) | **7.90** | **9.30** | **4.13** | **6.63** | **7.24** | **3.68** | **7.05** | **8.00** | **5.16** |
| rest at 0 (the island of 1628) | +0.96 | +0.01 | −0.01 | +0.05 | +0.06 | +0.00 | −0.25 | +0.23 | −0.19 |
| rest at 1 (the stand-in) | +1.11 | −0.16 | −0.31 | −0.08 | −1.80 | −0.77 | +0.03 | +0.31 | −0.44 |
| held at a half | +0.06 | +0.21 | −0.33 | −0.07 | −1.23 | −0.73 | +0.14 | +0.33 | −0.49 |
| moving | −1.08 | +0.30 | −0.19 | −0.09 | −0.69 | −0.55 | +0.07 | +0.59 | −0.38 |

| load and memory | high | medium | low |
|---|--:|--:|--:|
| read the first island again (an artefact of the spike), ms | 30.6 | 37.1 | 34.8 |
| read the second island, ms | 31.9 | 32 | 30.7 |
| bake the second maps and read the heights back, ms | 120.9 | 87.8 | 78.5 |
| GPU memory of the second maps, MB | 133.3 | 37.3 | 37.3 |
| JavaScript memory of the second heights, MB | 16.1 | 16.1 | 16.1 |
| side of the height and slope maps, texels | 4096 | 2048 | 2048 |

Frame rate, the lowest of all states: high 60 fps, medium 60 fps, low 60 fps. Slowest single frame: high 18.2 ms, medium 18.5 ms, low 23.7 ms.

| the engine alone, ms | v1 H | v1 M | v1 L | v2 H | v2 M | v2 L | v3 H | v3 M | v3 L |
|---|--:|--:|--:|--:|--:|--:|--:|--:|--:|
| earlier run | 7.02 | 9.46 | 4.50 | 7.33 | 7.36 | 4.55 | 7.58 | 7.37 | 5.80 |
| this run | 7.90 | 9.30 | 4.13 | 6.63 | 7.24 | 3.68 | 7.05 | 8.00 | 5.16 |
<!-- END m3 -->

### What the numbers say
- **Blending is inside the noise** (about ±1 ms in these runs), at rest at either end, held half way, and moving, on all three levels. While the number moves, the island's shadow map is drawn again every frame; that did not show either.
- **The memory is the cost.** A second set of maps is 133 MB on High. The engine's first set is the same size, so the island's maps double.
- **The load grows by about 0.15 s** on High: 32 ms to read the second island and 121 ms to bake its maps and read the heights back. The 31 ms spent reading the first island again is the spike's own artefact (the engine does not keep the grid it reads).

### What the stand-in does not tell
- **Half way means nothing.** It is a plain mix of two surfaces: a caldera half full. The eruption is an effect, as the review says, and what is shown between the two islands is still to be designed.
- The real later island may be nearer to or further from the island of 1628 than today's is. Today's island is also the surface the first was made from, which should flatter the difference, and it is still 41 kB.

## 7. The keepers

### K1: where the size goes
`cd source && npm run size`. It changes no byte of the page.

```
  part                 bytes       kB   gzip kB   share
  terrain data         72380     70.7      53.0    42.7%
  town data            14579     14.2      10.0     8.6%
  shaders              31441     30.7      10.9    18.5%
  engine code          40058     39.1      17.6    23.6%
  sound                 2883      2.8       1.6     1.7%
  menu and styles       8359      8.2       3.4     4.9%
  (markers)              -35
  the whole page      169665    165.7      98.0   100.0%
```

The script is minified as one piece, so a marker is put between the source files and the result is cut at the markers; the parts are 35 bytes off the real page in all. `npm run spike:size` prints what each part of the spike adds:

```
  part                                   dev raw   dev gzip   minified raw   minified gzip
  fade (spike-fade.js)                      9229       2774           5182            2074
  place (spike-place.js)                   13671       4613           7832            3230
  year (spike-island.js, spike-year.js)    53805      37081          47248           35674
  shared (spike.js, spike-go.js)           18996       6700           9526            3373
  the whole spike                                                    69807           44387
```

### K2: the stats line on a touch device
A quiet **Stats** button under the touch hint toggles the stats line. It is shown only where the pointer is coarse, so the menu on a computer is as it was. **76 bytes.** It was tapped with an emulated touch at four sizes (iPad lying and upright, phone lying and upright) and the stats line appeared each time; on a computer the button's display is `none`.

Seen in the pictures: on a phone the menu is taller than the screen and scrolls, with Stats at its foot; and **while the menu is open on a phone the stats line runs across the title.** That was already so with the `H` key; in the scene the line is clear.

One reading taken on the way: at an iPad's size and pixel density (2360 × 1640) this Mac's own scaler settled at 91% of full resolution with the GPU at 11 ms. An iPad will not hold full resolution; its scaler will decide what it shows.

## 8. The size table of `ARCHITECTURE.md` §5, again

In kB of page, uncompressed.

| Part | The review's estimate | Now |
|---|--:|---|
| The page today | 166 | **165.7 measured**, by part in §7 |
| Layers, dates and years in the engine, with their controls | 8–12 | **Measured in part.** The fade is 5.2 kB minified and what the parts share 9.5 kB, both overstated by the way the spike is built (§2). The menu's controls were not built. The estimate stands; the lower half looks likelier |
| Plants: forms, rules, land-cover map, seasons | 20–30 | **The placing pass is measured: 7.8 kB** with its three stand-in forms. The species' forms, the rules and the land-cover map are still a guess |
| The sky: ephemeris and stars | 15–25 | Still a guess |
| The island after the eruption, as a difference, and the eruption | 15–25 | **Measured on the stand-in: 41.3 kB of data at today's accuracy**, 28.6 kB at 2 m, 18.8 kB on an 80 m grid, plus about 6 kB of reader and blend. **25–47 kB** before the eruption itself, which is still a guess |
| The harbour and ships | 10–15 | Still a guess |
| People and animals | 25–40 | Still a guess |
| Interiors and wall paintings | 30–60 | Still a guess |
| Labels and the text of what was found | 10–20 | Still a guess |
| **Total** | **about 300–390** | **about 310–410**: the island moves up by 10–20 and nothing measured moves down |

A second budget the review did not have: **memory.** The second island's maps are 133 MB on High and 37 MB on Medium and Low.

## 9. What the work order for layers and time should do differently

1. **Give every corner of the town its building's number**, in the 32 bytes it has (the wall's length as 16 bits, the number as 16). The review assumed it was there.
2. **Keep two pipelines for anything that fades**: an opaque one for when nothing is fading, and the discarding one for the frames of a fade. Do the same for placed things, or route part-shown things to their own lists.
3. **Budget the fade as "the town's shadow map every frame, plus the dither"**: 1–2 ms in a street, more from above, on this Mac. If the iPad cannot afford it, draw the shadow map every second frame during a fade, or use the lidded rise, which costs only the shadow map.
4. **Do not count on Found being cheap.** It is the dearest layer to draw today. If the iPad's floor is tight, the ground's shader is where the time is.
5. **Use the coverage dither where there is multisampling, and decide what Low does** (the pixel dither or the rise). Do not use a dither fixed to the surface: it shimmers nearly five times as much.
6. **Make the plan map carry the layers**: at least a Found map and a whole map, mixed by the layer; and each place's turn in the wave if a wave is chosen. Build them in the town's one pass.
7. **Decide what happens to a viewer where a house appears.** The spike lifts them to the roof.
8. **Do not plan the later island at 15–25 kB.** Choose its accuracy and its grid first (§6), and remember that edit E4 (D29) changes the island of 1628 BCE, so any difference from it has to be made again afterwards.
9. **Bake the second island's maps only when the year comes near them, and free them after**, or bake them smaller. 133 MB should not be paid by a viewer who stays in 1628 BCE.
10. **Keep the grid the page reads** (`decodeTerrain`) if a second surface is predicted from it. The spike had to read it twice.
11. **Watch the texture limit.** The ground's shader is at 14 of 16 with the spike's five extra maps. Pack maps together before adding more.
12. **Take the visibility function as it is** (`S_X` in `spike.js`): `vis(layer, years, days)`, three numbers in one uniform block, the same text in every stage.
13. **Measure on the iPad before the design is fixed.** K2 is in the released page for that. Measure differences against a baseline taken in the same run, on a machine doing nothing else: this spike's totals moved by 1–2 ms from run to run.
14. **Lift the code, do not merge the spike.** Its files are written to stay out of the engine, which is the opposite of what the feature needs.

## 10. What surprised

- **The town's vertices carry no building number.** The work order and the review both say they do.
- **Found is 27 outlines of 463, and it is the slowest layer**, not the fastest.
- **A shader that can discard costs when it discards nothing**, because the GPU's own hidden-surface removal is lost.
- **The island's difference is not small**, and a cruder predictor beat the usual one.
- **The lidded rise.** Pressing the corners down instead of cutting the pixels away gives a fade with no discard, no shimmer and no sorting. It came from asking what the clipped rise would look like from above (hollow).
- **Placing is nearly free; drawing is not.** A million spots tried costs under a tenth of a millisecond.
- **Low detail was the slowest level at 200,000 placed things** in three views of four.
- **A direct `eval()` in one development file stopped the minifier shortening any name in the page**, which inflated the first size readings by 5 kB until it was seen.
- **Timings on a Mac in use are good to about a millisecond**, no better. The first run of measurement 1 gave larger costs from over the roofs than the two later runs (table in §4); all three are kept.

## 11. How to run it again

```sh
cd source && npm run build:dev          # dev.html with all three parts
#   keys in dev.html: K layer · J the way of fading · N wave · Y island · U, I year · O day · G more shapes · P spike off and on
node build.mjs --dev --only fade --out dev-fade.html     # one part by itself (fade, place or year)
npm run size                            # the released page by part
npm run spike:size                      # what each part of the spike adds
cd .. && node tools/terrain/build.mjs --second           # the stand-in island and docs/spike/island-report.json
node tools/town/shot.mjs --page dev-fade.html --steps '[{"key":"Digit9"},{"run":"(spk.set({swing:4,kind:1}),spk.meas(3000))"}]'
```

In the page's console: `spk.set({lay: 0.5, kind: 1, wave: 3})`, `spk.set({isl: 1})`, `spk.place.aim(50000)`, `spk.meas(3000)`, `spk.on = 0`.

## 12. Who looked at what

- **Claude** looked at every picture in Thera Spike 003: eleven at full size (`m1-v9-pixel-50`, `m1-v9-surface-50`, `m1-v9-clip-50`, `m1-v9-wave-coverage-50`, `m1-v7-coverage-50`, `m1-v7-wave-lid-50`, `m2-ground-layer-half-dither`, the iPad-lying, phone-lying and phone-upright menus, and the phone's scene) and the rest on contact sheets at 640 pixels a picture, which is enough to tell the fades apart and not enough to judge fine shimmer. The iPad-upright menu picture was not opened. Shimmer was judged by the measurement in §4, not by eye: no moving picture was looked at by anyone.
- **Nobody looked at the nine pictures of the views check** on the released page. The check passed; the page's scene is the same code as on `main`.
- **Chad has not looked at anything yet.** Which fade is right is his to choose.
