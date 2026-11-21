# The opening page

Work order 006 (`docs/tasks/006-opening-page.md`), built on 2026-11-21 on `task/006-opening-page`, which starts from work order 004's branch.

## What changed, and why

Chad (D53): "it looks nothing like an Archaeological Heritage intro. Keep the same options and interactions but let's make it advertise an amazing archaeological heritage experience that spans a period of the Bronze Age centered on 1628 BCE." He picked the design from a page of mock-ups (D54): the plaster panel, down the side, with the button "Enter 1628 BCE".

The page had the menu of the underwater world the engine came from: a glossy title in sea colours over a blurred, dimmed scene, with a long notice in small print under it. Now:

- **A panel like lime plaster runs down the left side**, 42% of the window wide. The world beside it is sharp and undimmed, and it is moved a little to the right so that its middle is clear of the panel. When the visitor enters, the panel slides away and the world slides back to the middle.
- **On a phone, or a window under 800 px wide or 416 px high, the panel takes the whole window** and scrolls, as the old menu did.
- **Every control is where a visitor would look for it, and works as before.** Nothing in `source/src/main.js` changed. The markup keeps every element id the script reads, the order of the buttons in each row, and the words "1–9 Viewpoints" that `checks/views.mjs` looks for.
- **The long notice sits behind one line, "About, sources and licences".** It opens in place. Its text is carried over byte for byte by a script, and it can now be selected and copied.
- **The stats line** moves to the far corner while the opening page is shown, on a dark ground, because its pale lettering could not be read over the panel.

## Three looks, the first by chance (D55)

Added later the same day. The integrator had read Chad's "All three are great and use them" as its three recommended picks, and built the plaster panel alone. Chad corrected it: "All three are fine and let people choose which they want and randomly give the first one someone sees." He meant the three looks.

- **The page has three looks**, and a row of the opening page, **Look**, chooses between them:
  - **Plaster:** a pale panel with near-black lettering, and Egyptian blue for what is chosen.
  - **Dark:** a dark glass over the world, with pale lettering and yellow ochre for what is chosen. The world stays where it is behind the glass, where the other two move it aside.
  - **Red ochre:** a deep red wall with pale lettering.
- **The first look a visitor sees is drawn by chance**, one in three each. The look in force is remembered on the visitor's device, so the page they come back to is the page they left.
- It is set before the page is first drawn, so no look flashes and changes.
- `setLook(0|1|2)` in `source/src/main.js` is a plain function, like the other controls (D43). It adds 902 bytes to the page.

Checked by script at 1440 by 900: a fresh visit got a look by chance and remembered it; each of the three buttons changed the look, lit itself and was remembered; and 3,000 draws came out 976, 1,024 and 1,000. Claude looked at one picture of each look. The gate and the nine-view check pass again. The other checks on this page were made in the plaster look only.

## What the page says, and what each line rests on

| On the page | Rests on |
|---|---|
| "Virtual heritage · a reconstruction · the Bronze Age Aegean" | D40, D42: what kind of thing this is. "A reconstruction" was on the old page and stays |
| "Thera" | The old page's title. The notice still says first that it is the island's later name |
| "1628 BCE", "The island and its town at Akrotiri, before the eruption" | D32, D36; the old page's own line |
| "Walk the streets of a Bronze Age town before the eruption that buried it." | The viewer can walk (D12). That the eruption buried the town is the reason there is a site |
| "Everything here is either tied to published evidence and graded, or listed as a guess." | Historical laws 1 and 5. It does not say that every wall has a source: the town beyond the excavated walls is built by rule, and is listed as that |
| "Centred on 1628 BCE, on the high (radiocarbon) chronology. The hour and the season can be moved now. The years on either side, through the eruption, are to come." | D36; work order 004's date control; D34 and D37, not built. The page does not say the work spans a period, because the year cannot be moved yet |
| The three layers, each with its line | D31, D38, in their own words |
| "Enter 1628 BCE", and "Resume" after the first entry | D54. `main.js` already wrote "Resume" |
| "A reconstruction · 1628 BCE", over the world | So that a picture of the world beside the panel is never taken for a photograph or a survey |

The label of the last switch was shortened from "Edge of the excavated walls" to "Excavated edge", the words the key list already used. The first loading message reads "Opening…" where it read "Diving…".

The page claims no approval, support or link with the excavation (D46).

## A liberty: the colours

The page's colours are named for materials the wall-painters of Akrotiri used, as lane T6's check established them (`docs/research/verification/T6.md`): the white of bare lime plaster (#3), carbon black (#4), red and yellow ochre (#5) and Egyptian blue (#12, #14).

**The tones on screen are chosen by eye.** No painted surface at Akrotiri has a measured colour (T6 check, §"What it cannot give"), so `#ecebe5`, `#1b1a17`, `#8a2b20`, `#c4932b` and `#1d4b9e` are this page's choices and not evidence. The same holds for the dark look's ground and for the paler tones each look uses for small lettering. Nothing on the page copies a motif from a wall painting. The integrator records this in the standard's table of liberties.

## Lettering

The page loads nothing, so it uses fonts already on the visitor's device and names several in order.

| Used for | Asked for, in order | What a device without them shows |
|---|---|---|
| The title, labels and buttons | Optima, Candara, Gill Sans, Segoe UI | Its own plain sans-serif |
| Sentences and the notice | Iowan Old Style, Palatino Linotype, Palatino, Book Antiqua, Georgia | Its own serif |

So the page looks a little different on an Apple device, a Windows computer and an Android phone. The pictures below are all from Chrome on a Mac.

## Size

| | Bytes |
|---|---|
| `index.html` on work order 004's branch | 178,790 |
| `index.html` with this order, one look | 180,220 |
| `index.html` with the three looks | 181,122 |
| Added in all | 2,332 |

The budget is 256 kB (262,144 bytes).

## What was checked, and who looked

- `checks/build.sh`: PASS, 176 kB, nothing loaded at run time.
- `node checks/views.mjs --views 9 --min-fps 55 --min-scale 60`: PASS, every view at 55 frames a second or more at full resolution.
- **Every control was pressed by script** (`tools/town/shot.mjs`, in the development build, at 1440 by 900), and the page's own state was read back:

| Control | What the script did | What came back |
|---|---|---|
| Enter 1628 BCE | clicked | the page entered the world; the button then read "Resume" |
| The menu button in the world | clicked | the opening page came back |
| Layer | Found, then Inferred | the lit button changed, and the world reported a fade under way |
| The third layer | read | still disabled, marked "to come" |
| Time | Night, then Afternoon | the lit button changed, and the world's hour moved |
| Date, a mark | Summer solstice | "25 May" became "19 Jun" |
| Date, the slider | set to day 64 | "23 May" |
| Excavated edge | Shown | the world reported the edge shown |
| Detail | read | High lit; Low and Medium set to reload the page with their level |
| About, sources and licences | opened | the notice showed, 575 px tall, ending "Engine: Abyssal Garden by Noniv (MIT)." |

- With the world sharp beside the panel, the page held 60 frames a second in that run.
- **Who looked.** Claude looked at five pictures: the opening page at 1440 by 900 and at 1440 by 1250, its foot with the notice open, a phone held sideways (844 by 390) and an iPad held sideways (1180 by 820), the last two as Chrome imitates them. **Chad has not seen the built page.** He picked from a mock-up.

## Not checked

- No phone and no iPad was used: the two device pictures are Chrome on a Mac pretending.
- Stats on a touch device, and the keys, were not pressed in this run. Neither was changed.
- A device held upright, where the whole page is turned on its side, was not looked at.
- Safari, Firefox, Windows and Android were not tried.
- The slide of the panel and the world when entering was not watched in motion.
- A visitor who prefers reduced motion gets no slide; that was not tried.
