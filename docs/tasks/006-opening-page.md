# 006-opening-page: the opening page as the entrance to a heritage site
**Status:** open · **Branch:** `task/006-opening-page`

Written on 2026-11-21 by the integrator, after Chad asked for it (D53) and picked the design (D54). It needs no research. It is numbered 006 because 005 is kept for plants (D39); it runs before 005.

**Who builds it.** Chad was working remotely and could not start a new session, so the integrator's own session builds this order, on Claude Fable 5.2. That is an exception to D14's "in its own session", made so that neither this order nor work order 004 waits. The branch starts from the tip of `task/004-layers-and-time` and takes in that branch again whenever it moves, because both orders change `source/template.html`.

```harness-spec
{
 "spec_version": 1,
 "id": "006-opening-page",
 "family": "code",
 "task_type": "procedural-world",
 "status": "open",
 "assignee": {"person": "Chad", "agent": "claude-code", "model": "claude-fable-5-2"},
 "branch": "task/006-opening-page",
 "owns": [
  "index.html",
  "source/template.html",
  "source/src/main.js",
  "docs/opening-page/"
 ],
 "forbids": [
  "checks/",
  "docs/tasks/",
  "docs/research/",
  "docs/layers/",
  "docs/terrain/",
  "docs/town/",
  "docs/spike/",
  "docs/WORLD_CLOCK.md",
  "tools/",
  "LICENSE",
  "akrotiri-frescoes-sources/",
  ".harness/project.json"
 ],
 "read_first": [
  "AGENTS.md",
  "HANDOFF.md",
  "LESSONS.md",
  "docs/DECISIONS.md",
  "docs/HISTORICAL_STANDARD.md",
  "docs/research/verification/T6.md",
  "source/template.html",
  "source/src/main.js",
  "source/build.mjs",
  "checks/build.sh",
  "checks/views.mjs"
 ],
 "gate": {"argv": ["checks/build.sh"], "timeout_s": 300},
 "review_tier": "P0",
 "parallel_safe": false,
 "budget": {"max_attempts": 2, "max_tokens": null, "max_budget_usd": null}
}
```

## Goal

The page a visitor first sees looks like the entrance to an archaeological heritage experience, and not like the menu of the underwater game the engine came from. Chad: "it looks nothing like an Archaeological Heritage intro. Keep the same options and interactions but let's make it advertise an amazing archaeological heritage experience that spans a period of the Bronze Age centered on 1628 BCE."

**Every option and every interaction stays.** Only how the opening page looks, what it says first, and where its small print sits change.

## Decisions this order rests on

| | |
|---|---|
| D53 | The opening page is a heritage entrance. It keeps every option and interaction, promises only what is built, names its colours for the wall-painters' materials, and claims no approval from the excavation |
| D54 | The design: the plaster panel, down the side, with the button "Enter 1628 BCE". The designs are on the Thera Intro Designs page, <https://claude.ai/artifact/T5i6P4GfDjMta9RPjRsd9r> |
| D11, D17, D48 | One self-contained page that loads nothing at run time, under 256 kB. So no web font and no picture: the lettering uses fonts already on the visitor's device |
| D27, D46 | The work is free and not for sale, and the page claims no approval, support or link with the excavation |
| D31, D38 | The three layers and their one-line meanings |
| D34, D36, D37 | The world opens in 1628 BCE on the high chronology. The year cannot be moved yet |

## What to build

1. **A panel down the left side**, like lime plaster: pale, with near-black lettering. The world stays sharp and undimmed beside it, so the place itself is seen before anything is pressed. On a narrow or short screen the panel takes the whole width and scrolls.
2. **What it says first, in this order:** a line naming the kind of thing this is; the title; the year, with one line saying what is shown; one or two sentences that invite the visitor in and say how the work is grounded; the three layers, each with its one-line meaning; then the button.
3. **The button reads "Enter 1628 BCE".** It does what "Dive in" did.
4. **Every control that is there today, working as today:** detail, time of day, date with its four marks, layer, the edge of the excavated walls, the key list, the touch hint, Stats on touch devices, the loading bar, the failure message, and the small menu button inside the world.
5. **The long notice moves behind one line, "About, sources and licences".** It opens in place with one tap or click. Every word of the notices and licences stays inside the page, unchanged, because they must travel with it.
6. **Say only what is true.** The page says "centred on 1628 BCE". It says the hour and the season can be moved now, and that the years on either side, through the eruption, are to come. It does not say the work spans a period until the year can be moved.
7. **Colours named for materials, tones by eye.** Lime-plaster white, carbon black, Egyptian blue, red ochre (T6 check: #3, #4, #5, #12, #14). No painted surface at Akrotiri has a measured colour, so every tone on the page is a liberty. Copy no motif from a wall painting.
8. **Keep what the checks and other code read:** the element ids, the body classes `l`, `m`, `g`, `p` and `e`, and the words "1–9 Viewpoints" somewhere in the page's text (`checks/views.mjs` reads them).

## The record

Write `docs/opening-page/README.md`: what changed and why, what each part of the page says and the decision or claim behind it, the liberty of the colours, the fonts asked for and what a device without them shows, the size before and after, and who looked at what.

## Done when
- `checks/build.sh` prints PASS.
- `node checks/views.mjs --views 9 --min-fps 55 --min-scale 60` prints PASS, and its pictures are published to Thera Views.
- A picture of the opening page itself, at a computer's size and at a phone's size held sideways, has been looked at by the builder, and both are published where Chad can see them.
- The page is under 256 kB, and the record gives its size before and after.
- Every control has been pressed once by script or by hand and does what it did before. The record says which, and how.
- `docs/opening-page/README.md` is complete, and everything is committed on `task/006-opening-page`. Nothing is merged into `main`.
- The Result below is filled in. Never report a visual pass nobody saw: say who looked at what (`AGENTS.md` §6).

## Known gaps
- **No phone and no iPad.** The builder sees the page only in Chrome on a Mac, at sizes it sets.
- **The fonts differ by device.** The page asks for fonts that Apple devices and Windows carry, and falls back to the device's own.
- **Chad has not seen the built page.** His pick was made from a mock-up, of which only one combination had been looked at.

## Out of scope
- Any change to the world, its controls' behaviour, or the menu button inside the world.
- A year control, labels, standpoints, the visitor's position, use without a connection.
- Translations.
- Any change to `checks/`.

## Result

Built on 2026-11-21 by the integrator's session on Claude Fable 5.2, as one commit on `task/006-opening-page` (`986a66d`). The record is `docs/opening-page/README.md`.

**What was built.** All eight points of "What to build". A panel like lime plaster down the left side with the world sharp beside it; the title, the year and two sentences first; the three layers with their lines beside their buttons; the button "Enter 1628 BCE"; every control; the notice behind "About, sources and licences", carried over byte for byte; the wording on the period as asked. On a phone or a small window the panel takes the whole window and scrolls.

**What changed in the code.** Only `source/template.html` (markup and CSS) and the rebuilt `index.html`. `source/src/main.js` is unchanged, though the order allowed it.

**Done when, item by item.**
- `checks/build.sh`: PASS, 176 kB of 256 kB.
- `node checks/views.mjs --views 9 --min-fps 55 --min-scale 60`: PASS. **Not republished to Thera Views:** the page there already holds work order 004's nine pictures of the same world (two of the nine files are byte for byte the same as this run's; the others differ by a few bytes, from the moving sea). This order does not change the world.
- Pictures of the opening page at a computer's, an iPad's and a phone's size are on the Thera Intro Designs page, <https://claude.ai/artifact/T5i6P4GfDjMta9RPjRsd9r> (version 2). The builder looked at them.
- Size: 178,790 bytes before, 180,220 after, 1,430 added.
- Every control was pressed by script and read back; the table is in the record.
- The record is complete and everything is committed on the branch. Nothing is merged into `main`.

**Three things done beyond the order's words,** each to make the design work:
- the stats line moves to the far corner, on a dark ground, while the opening page is shown, because its pale lettering could not be read over the panel;
- the switch "Edge of the excavated walls" is labelled "Excavated edge", as the key list already had it, and the first loading message reads "Opening…";
- a small label over the world, "A reconstruction · 1628 BCE", so that a picture of it is not taken for a photograph.

**One liberty**, written into the standard as P-L1: the page's colours are named for the wall-painters' materials, and their tones are chosen by eye.

**Who looked.** Claude looked at five pictures of the built page. **Chad has not seen it built**; he picked from a mock-up. Nobody has seen it on a real phone or iPad, in Safari, on Windows or on Android, or watched the panel slide away.

**To merge.** After work order 004, because this branch contains it.

**Merged and published on 2026-11-21**, with work order 004, by the integrator's session at Chad's word ("Merge it."): the branch was pushed to GitHub's `main`.

### Amended the same day: three looks (D55)

Chad then corrected the reading of his pick: "All three are fine and let people choose which they want and randomly give the first one someone sees." He meant the three looks, not the integrator's three picks. So the order gained one more thing to build, and it is built:

- **A Look row** on the opening page: Plaster, Dark, Red ochre. The first look a visitor sees is drawn by chance and remembered on their device.
- `source/src/main.js` gained `setLook()`, a plain function set before the page is first drawn; `source/template.html` gained the row and one set of colour variables for each look.
- `checks/build.sh` PASS at 177 kB; the nine-view check PASS; 902 bytes added (181,122 in all).
- Each look was switched to by script and read back, and Claude looked at one picture of each. The fuller checks above were made in the plaster look only.
- The record's section "Three looks, the first by chance" has the rest.

## Review
(To be filled in after Chad has looked.)
