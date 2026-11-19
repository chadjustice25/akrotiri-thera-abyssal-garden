# Handoff

As of 2026-11-18, after work order 002 (the town of Akrotiri) was merged and pushed. Only Chad's session edits this file. (Chad's integrator session was closed by accident on 2026-11-18, so he asked the session that built work order 002 to do its integration, as he did for 001. That session wrote this version.)

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
- **Decided on 2026-11-18:** upstream's funding links are gone from the menu and the repository, and the credit stays (D23, closes O4); the two rule-built houses on Telchines Street stay (D24); marking and labelling what has been found waits for its own order (D25).
- **Research:** X1, T1, T1b, T1c, T2, T2b and T3–T7 are in `docs/research/claude/`, each checked in `docs/research/verification/`. T1c is applied to the terrain; T2 and T2b to the town.
- **Two kinds of data in the page are not MIT.**
  - The terrain stays under the Copernicus WorldDEM-30 licence and CC BY 4.0 (EMODnet).
  - The town's outlines are under CC BY-SA 4.0.
  - Their notices are in the page's menu, `README.md`, the two generated data files and the two records, and must travel with the page.

## Next
1. **Chad: decisions and actions due.**
   - **The reading of grade A for landscape claims** (T1 check, correction 15): still waiting to become a decision.
   - **E4's volume: the measure is settled, the size is open.** The build's 13.16 km³ is inside the source's range but below its preferred 17.1 km³ (`docs/research/verification/T1.md`, addendum). Raising it means a smaller bay or higher restored ground.
   - **Still open from the T1c check:**
     - The two licence questions go to the licensor (D21): Chad sends the drafted message through the Copernicus Data Space help centre. Rebuilding the land from NASA's NASADEM is the fallback.
     - Its gaps: no thickness map of the eruption deposits could be opened (liberty T-L1), and the Mavro Rachidi cores, the best local test of the sea level (T-L13), are not yet dated.
   - **The excavation and the book (O8).** A draft letter to the Akrotiri Excavations, not sent, is in `docs/town/letter-to-the-excavation.md`, with what each answer would close. Palyvou 2005 is not in Chad's library and can be bought; the same file says where.
2. **Next build order: not chosen (O9).** The candidates:
   - **Plants.** The bare ground (liberty T-L16) is now the largest thing wrong with the picture, on the island and round the town. Research lane T3 is checked. This is the building session's recommendation.
   - **The harbour.** It needs research first. The one published sketch of the old shore (T2b#61) disagrees with the terrain's coast (T-L14); `docs/town/README.md` §3 records it.
   - **People** (lane T4), **interiors and wall paintings** (lane T6; image rights, D6), and **marking and labelling what has been found** (D25).
   - **A second pass on the town**, when the book or the excavation's plan arrives. It would close liberties A-L3, A-L6, A-L7, A-L10 and A-L12, and should add the drain and the cobbles that are sourced and not yet shown (A-L14).
   - **Noted by 001:** the real night sky (T-L12), sound above the water, and a cliff form for the restored southern wall.
3. **The town's weaknesses, for whoever works on it next** (`docs/town/README.md` §9):
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
- **Thera Views** (above) shows the nine stills. The page itself is not reachable from the iPad until it is hosted somewhere.
- **Thera Research Desk**, <https://claude.ai/artifact/9pEpfRsWWDtP7sKjV4NQoq>: copies each research prompt, tracks lane status and stores pasted reports. Each report is a Markdown asset whose id is recorded in the `reports` collection.
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
```

## Notes
- Research runs as Claude agents in a session (D13), one named agent per lane and a separate `Verify:` agent for each. The Gemini Argon steps in `docs/research/README.md` still apply if Gemini recovers.
- To rebuild the terrain data: `node tools/terrain/fetch.mjs` once (it downloads the two datasets into `tools/terrain/cache/`, ignored by git), then `node tools/terrain/build.mjs`. **Then rebuild the town**, which reads the ground from the terrain: `node tools/town/build.mjs`. Then `cd source && npm run build`.
- To rebuild the town: `node tools/town/fetch.mjs` once (the plan, into `tools/town/cache/`, ignored by git), `node tools/town/trace.mjs`, `node tools/town/build.mjs`, then `cd source && npm run build`. `tools/town/traced.json` is committed, so the last two steps work without the plan.
- A work order for a worker session runs in its own worktree (`LESSONS.md`). Name the session, so that it can be found again.
- `~/.config/harness/secrets.json` has three `TODO` fields (`gemini-api-key.notes`, `open-brain-key.rotate`, `open-brain-key.leak_noticed_by`). `harness config check` fails on them in every project. They were there before session 1, which did not touch them.
