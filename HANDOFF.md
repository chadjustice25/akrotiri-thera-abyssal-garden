# Handoff

As of 2026-11-19, after work order 002 (the town of Akrotiri) was merged and pushed, and the research for work order 003 (plants and ground cover) was prepared. Only Chad's session edits this file. (Chad's integrator session was closed by accident on 2026-11-18, so he asked the session that built work order 002 to do its integration, as he did for 001. That session wrote this version.)

## Where things stand
- **The world is Thera with its town.** `main` holds the island of 1615 BCE (high chronology, D16) and the town at Akrotiri from the outside, in one `index.html` of 166 kB. There is no plant, animal, person, interior, harbour or ship yet: the ground is bare and the town is empty.
- **The town** (`docs/town/README.md`):
  - Its centre follows the excavated plan, redrawn from Dörrbecker's map on Wikimedia Commons (D22). Everything beyond the edge of the excavated walls is reconstruction by rule, to 9.95 ha.
  - It has 452 buildings: 19 excavated, 13 reconstructed inside the plan, 420 by rule.
  - Key `L`, or the menu, draws the edge of the excavated walls on the ground and shows the reconstruction pale.
  - The viewer can now walk (D12): coming down onto land puts them on foot, walls stop them, `E` or `Space` takes off, and walking out of their depth becomes swimming.
  - The terrace under it (terrain edit E8) was reshaped into the sourced north–south ridge.
- **Repository:** <https://github.com/chadjustice25/akrotiri-thera-abyssal-garden>, public, forked from `Noniv/abyssal-garden` (MIT). Remotes are `origin` (the fork) and `upstream` (Noniv).
- **Pushed.** Chad pushed `main` on 2026-11-18: the public fork now shows the island, the town and every notice (work orders 001 and 002 and the integration after each). `git log --oneline origin/main..main` lists anything committed since.
- **Work order 002** (`docs/tasks/002-town-of-akrotiri.md`) has its Result and Review filled in. Its liberties A-L1 to A-L15 are in `docs/HISTORICAL_STANDARD.md` §6.
- **Checks on `main`:** `checks/build.sh` PASSes at 166 kB of the 256 kB budget. `node checks/views.mjs --views 9 --min-fps 55 --min-scale 60` PASSes with every view at 60 fps and full resolution. **The views check now needs `--views 9`**; `cd source && npm run views` passes it. The latest pictures are in **Thera Views**, <https://claude.ai/artifact/EAM2iAgZHr4toJ39qt9C9L> (version 11).
- **Who looked:** Chad went through each of the nine views and flew over and partly through the town on 2026-11-18, and said: "That's looking excellent for now." He did not report on the views one by one. Claude looked at the nine stills, golden hour, night, the menu, and Medium and Low detail, and tested walking by script. Nobody has tried touch on a device.
- **Decided on 2026-11-18:**
  - Upstream's funding links are gone from the menu and the repository, and the credit stays (D23, closes O4).
  - The two rule-built houses on Telchines Street stay (D24).
  - Marking and labelling what has been found waits for its own order (D25).
  - The next build order is 003, plants and ground cover (D26, closes O9).
  - The project is free and not for sale (D27).
- **Decided on 2026-11-19:**
  - The grades are read for claims about the land as lane T1 read them; the standard's §3 now says so (D28, closes O10).
  - Edit E4 is to put back more land, as the first step of work order 003 (D29, closes O11).
  - Gemini Neon replaces Argon for Deep Research; reports go to `docs/research/neon/` (D30).
  - Chad confirmed how art is graded: Theran art B, art from elsewhere C (D26).
  - The world's year moves earlier than 1615 BCE, to between about 1630 and 1620 BCE; the exact year is open (D32, O16). **The page and the records still say 1615 until it is chosen.**
  - The viewer can move the date and time and jump to astronomical events; the sky is to be computed, and what grows is built with its yearly cycle (D33).
  - The year can be moved as well as the date, so that the world and the sky are seen to change; every thing is to carry the years it stands for (D34).
  - Every Gemini Deep Research prompt ends by asking for the report to be saved to the Google Drive folder `Thera Research` (D35), first tried on the rerun of T3c.
  - The world is shown in three cumulative layers (found; what the evidence points to; what is there for the experience), and changing layer fades things in and out without a reload or a pause (D31, closes O12).
- **Research:** X1, T1, T1b, T1c, T2, T2b and T3–T7 are in `docs/research/claude/`, each checked in `docs/research/verification/`. T1c is applied to the terrain; T2 and T2b to the town.
- **Two kinds of data in the page are not MIT.**
  - The terrain stays under the Copernicus WorldDEM-30 licence and CC BY 4.0 (EMODnet).
  - The town's outlines are under CC BY-SA 4.0.
  - Their notices are in the page's menu, `README.md`, the two generated data files and the two records, and must travel with the page.

## Next
1. **Chad: start the plant research** (D26). Three lanes go to Gemini Neon (D30) and can run at the same time: T3b (what grew where, and how thickly), T3c (how each plant looked, and its state in late May) and T3d (plants in Aegean art, on Thera and elsewhere).
   - The steps are in `docs/research/RUNBOOK-003-plants.md`. The Research Desk (below) lists the three lanes first, with a Copy button each.
   - When the reports are in, Claude checks each against its sources (`docs/research/verification/T3b.md`, `T3c.md`, `T3d.md`) and then drafts `docs/tasks/003-…`. Nothing is built from a report that has not been checked. The order's first step is to raise the land that edit E4 puts back (D29).
   - **Where the lanes stand on 2026-11-19:** T3d is in (`docs/research/neon/T3d_Neon.md`) and checked (`docs/research/verification/T3d.md`): usable with fifteen corrections, no source made up, but 57 of its 153 rows could not be checked because their sources would not open. Its sizes of rooms and friezes are not to be used yet. T3c's first run handed back the prompt and has to be run again, with its prompt as changed on 2026-11-19 (it now asks for each plant's whole year). T3b is not in. Chad reports that Deep Research runs fail fairly often.
   - A second X1 report, from Neon, is also in (`docs/research/neon/X1_Neon.md`). It was compared with the adopted world clock (`docs/research/verification/X1_Neon.md`). They agree on what matters and the clock stays decided, but two points weaken the reason given for 1615 BCE (O15).
   - Art never places a plant on the island by itself: Theran art is grade B for Thera, and art from elsewhere is grade C (D26).
2. **Chad: the touch test.** Nobody has tried the page with fingers. Chad and his husband are to try it on an iPad.
   - The runbook is the **Thera Test Flight** artifact, <https://claude.ai/artifact/PQa2MRqzD4dtzQiUb2DvdE>: twelve missions, three answers each, and a report to copy and paste back. It is private until Chad shares it from its Share menu.
   - **The page must be on the web first.** GitHub Pages is off for the fork. Turning it on is Chad's action (the command is below); the page is then at <https://chadjustice25.github.io/akrotiri-thera-abyssal-garden/>, which is the address the runbook's button opens. `.nojekyll` is in the repository so that Pages serves the files as they are.
   - Read from the code, and not yet tried by anyone: walking on touch is 0.7 of the keyboard's pace; looking up by more than about 34° while on foot takes off; an iPad held upright gets the page turned on its side; and there is no sound above the water yet. The runbook asks about each.
3. **Chad: decisions and actions due.**
   - **O16, the year the world opens in.** Suggested: 1628 BCE, the year of the Aniakchak II eruption, which every place shares, in the reign of Ammisaduqa at Babylon. Once chosen, one sweep changes `docs/WORLD_CLOCK.md` (with the corrections D32 lists), the page's menu, the records and the prompts for lanes not yet run.
   - **O18, how far the year slider reaches**, and whether Thera's passes the end of the living town into the earthquake, the eruption and the buried island, which D19 kept out.
   - **The size budget.** A world with layers, seasons, a year slider, a computed sky, plants, people and interiors is unlikely to fit in one 256 kB page (166 kB are used). D11 says a newer decision changes the law when the work shows this; the engine order for layers and time is the place to measure it.
   - **O13, the layers' names.** Suggested: Found, Inferred, Imagined.
   - **O14, whether the layers are built first**, as their own work order, while the plant research comes in. Leaning: yes. It would make the layers work order 003 and plants 004.
   - **D21, the Copernicus licence questions.** A fresh draft of the message, not sent, is in `docs/terrain/message-to-copernicus.md`, with where to send it. Chad is looking into it (2026-11-19). Rebuilding the land from NASA's NASADEM stays the fallback.
   - **O8, the excavation and the book.** A draft letter to the Akrotiri Excavations, not sent, is in `docs/town/letter-to-the-excavation.md`. Palyvou 2005 is not in Chad's library and can be bought; the same file says where. Chad decides on the letter this weekend.
   - **O5, the layout for several places.** Left open by Chad until a second place is chosen.
   - **Still open from the T1c check:** no thickness map of the eruption deposits could be opened (liberty T-L1), and the Mavro Rachidi cores, the best local test of the sea level (T-L13), are not yet dated.
4. **Later orders, in the order suggested on 2026-11-18** (none is planned yet):
   - **The harbour, the old shore and ships.** It needs research first. The one published sketch of the old shore (T2b#61) disagrees with the terrain's coast (T-L14); `docs/town/README.md` §3 records it.
   - **People and animals** (lanes T4 and T3).
   - **Interiors and wall paintings** (lane T6; image rights, D6). The size budget is the first hard decision here: the page is 166 kB of 256 kB (D11, D17).
   - **Marking and labelling what has been found** (D25).
   - **A second pass on the town**, when the book or the excavation's plan arrives. It would close liberties A-L3, A-L6, A-L7, A-L10 and A-L12, and should add the drain and the cobbles that are sourced and not yet shown (A-L14).
   - **The sky and the calendar** (D33, D34; liberty T-L12): a computed sky, a date, time and year the viewer can move, seasons, and jumps to eclipses and other events. It needs its own research lane first: eclipses visible from Thera in the window, how uncertain they are that far back, and the Venus observations of Ammisaduqa's reign. Chad, 2026-11-18: the sky is to be corrected the way Beyond the Gates of Uruk's is being. That method computes the sky for the date and place (`~/Developer/beyond-gates-uruk/docs/research/2026-10-19-sky-ephemeris.md`); Uruk's work was still in progress when he said this. Thera's one-file law means a star catalogue has to fit inside the page.
   - **Also noted by 001:** sound above the water, and a cliff form for the restored southern wall.
5. **The town's weaknesses, for whoever works on it next** (`docs/town/README.md` §9):
   - The excavated part looks sparser than the reconstruction round it.
   - The town is small from far off.
   - Walls repeat.
   - Street shade is flat.
   - The ridge is gentle where the excavator describes a sheer fall at Xeste 4.

## How to try the page
- Open `index.html` in Chrome or Edge on the Mac and press **Dive in**.
- Mouse to look; `W` `A` `S` `D` to fly, swim or walk; `E` or `Space` up, `Q` or `X` down; `Shift` faster; `1`–`9` viewpoints (`7`, `8` and `9` are the town); `T` time of day; `L` the edge of the excavated walls; `Esc` menu; `M` mute; `H` stats.
- To walk, fly down onto the ground. To take off, go up.
- For a hands-off tour: `cd source && npm run build:dev`, open `dev.html` and press `F`.
- To refresh Thera Views: `cd source && npm run views`, then publish `.harness/views/latest/index.html` with its nine JPEGs to the artifact's URL.
- To take a picture from any place, or to script moves: `node tools/town/shot.mjs` (its header says how).

## Working from the iPad
- **Thera Views** (above) shows the nine stills. The page itself is reachable from the iPad once GitHub Pages is on (Next, step 2).
- **Thera Test Flight**, <https://claude.ai/artifact/PQa2MRqzD4dtzQiUb2DvdE>: the touch test, as twelve missions with a report to copy.
- **Thera Research Desk**, <https://claude.ai/artifact/9pEpfRsWWDtP7sKjV4NQoq>: copies each research prompt, tracks lane status and stores pasted reports. Since 2026-11-18 it lists the three plant lanes first. Each report is a Markdown asset whose id is recorded in the `reports` collection.
- **Thera Project Board**, <https://claude.ai/artifact/SPwJ88U5JryHybwsjTn7js>: the `decisions` and `notes` collections. Answers there become D-numbers in `docs/DECISIONS.md`.

## Commands (Chad runs these)
```sh
cd ~/Developer/akrotiri-thera-abyssal-garden
git status                      # clean; akrotiri-frescoes-sources/ and the tools' cache folders must NOT be listed
(cd source && npm run check)    # PASS build: ...
git log --oneline origin/main..main   # what a push will publish (the fork is public: a push publishes)
git push origin main
git branch -d task/001-terrain-and-sea task/002-town-of-akrotiri   # optional: both are merged
git worktree remove ../akrotiri-thera-002                          # optional; add --force if it refuses over the downloaded caches

# To put the page on the web for the touch test (it publishes the repository's files as a website):
gh api -X POST repos/chadjustice25/akrotiri-thera-abyssal-garden/pages -f 'source[branch]=main' -f 'source[path]=/'
# or on github.com: Settings, Pages, "Deploy from a branch", main, / (root), Save. The first build takes a minute or two.
```

## Notes
- The plant lanes for work order 003 run on Gemini Neon (D26, D30). Other research runs as Claude agents in a session (D13), one named agent per lane and a separate `Verify:` agent for each. If a Neon chat drops to another model, the lane goes back to a Claude agent.
- To rebuild the terrain data: `node tools/terrain/fetch.mjs` once (it downloads the two datasets into `tools/terrain/cache/`, ignored by git), then `node tools/terrain/build.mjs`. **Then rebuild the town**, which reads the ground from the terrain: `node tools/town/build.mjs`. Then `cd source && npm run build`.
- To rebuild the town: `node tools/town/fetch.mjs` once (the plan, into `tools/town/cache/`, ignored by git), `node tools/town/trace.mjs`, `node tools/town/build.mjs`, then `cd source && npm run build`. `tools/town/traced.json` is committed, so the last two steps work without the plan.
- A work order for a worker session runs in its own worktree (`LESSONS.md`). Name the session, so that it can be found again.
- `~/.config/harness/secrets.json` has three `TODO` fields (`gemini-api-key.notes`, `open-brain-key.rotate`, `open-brain-key.leak_noticed_by`). `harness config check` fails on them in every project. They were there before session 1, which did not touch them.
