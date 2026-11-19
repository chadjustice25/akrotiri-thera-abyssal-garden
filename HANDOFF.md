# Handoff

As of 2026-11-18, after work order 001 was merged and work order 002 was drafted. Only Chad's session edits this file. (On 2026-11-18 Chad asked the session that built work order 001 to do its integration, so that session wrote this version.)

## Where things stand
- **The world is now Thera.** `main` holds the island of 1615 BCE (high chronology, D16): land, sea, sky and light, at real scale, in one `index.html` of 132 kB. There is no town, plant, animal or person yet, so the ground is bare. Upstream's underwater garden is gone.
- **Repository:** <https://github.com/chadjustice25/akrotiri-thera-abyssal-garden>, public, forked from `Noniv/abyssal-garden` (MIT). Remotes are `origin` (the fork) and `upstream` (Noniv).
- **Not pushed.** Local `main` is ahead of `origin/main` (`abbdf21`) by work order 001 (merge `7651a39`) and the integration commits after it. The branch `task/001-terrain-and-sea` still exists locally.
- **Work order 001** (`docs/tasks/001-terrain-and-sea.md`) has its Result and Review filled in. The terrain record is `docs/terrain/README.md`: datasets and licences, edits E0–E9 with their claims, liberties T-L1 to T-L17, and how to rebuild the data.
- **Checks on `main`:** `checks/build.sh` PASSes at 130 kB of the 256 kB budget. `node checks/views.mjs --min-fps 55 --min-scale 60` PASSes with every view at 60 fps and full resolution. The latest pictures are in **Thera Views**, <https://claude.ai/artifact/EAM2iAgZHr4toJ39qt9C9L> (version 6).
- **Who looked:** Chad ran the page on the Mac on 2026-11-18 and said it "looks great and the controls are pretty intuitive". Claude looked at the six stills, the six times of day and the surface crossing. Nobody has tried touch on a device.
- **Research:** X1, T1, T1b, T1c, T2, T2b and T3–T7 are in `docs/research/claude/`, each checked in `docs/research/verification/`. T1c (deposits, harbour, sea level, licences) is applied to the terrain.
- **The terrain data is not MIT.** It stays under the Copernicus WorldDEM-30 licence and CC BY 4.0 (EMODnet). The notices are in the page's menu, `README.md`, `source/src/terrain-data.js` and the terrain record, and must travel with the page.

## Next
1. **Chad: push** (command below). The fork is public, so the push publishes the island and the data notices.
2. **Chad: decisions now due.**
   - **O4, upstream's funding link.** The menu still shows Noniv's GitHub and Ko-fi buttons. It is due "before the page is shown to anyone", and the push shows it.
   - **The reading of grade A for landscape claims** (T1 check, correction 15): still waiting to become a decision.
   - **E4's volume: the measure is settled, the size is open.** The full paper was read (`docs/research/verification/T1.md`, addendum): the source measures its 9.1–17.1 km³ the way the build does, against today's surface with the sea floor included. The build's 13.16 km³ is inside the range but below the source's preferred 17.1 km³ and its rock-fragment estimate of 14.4 ± 0.8 km³. Raising it means a smaller bay or higher restored ground: Chad's call.
   - **The two licence questions go to the licensor (D21).** Chad sends the drafted message through the Copernicus Data Space help centre (it needs a free account). Rebuilding the land from NASA's NASADEM is the fallback. Neither blocks the push.
3. **Next build: work order 002, the town of Akrotiri** (`docs/tasks/002-town-of-akrotiri.md`; it passes harness lint). It builds the town from outside on the E8 terrace and adds walking (D12).
   - **Chad's decisions are in (D18–D20, D22):** the excavated part follows the excavated plan; where the evidence ends is recorded and shown, and the rest is reconstruction; outsides only, thriving, no harbour yet; the six views stay and three are added.
   - **Research lane T2b is back and checked** (`docs/research/verification/T2b.md`: 86 of 89 rows checked, none unsupported, no invented source). The order is finished from it.
   - **Chad confirmed both open points (D22):** the plan is Maximilian Dörrbecker's Commons map, used with full credit for this free page (before any sale, ask the Akrotiri Excavations for their plan); and the whole town is drawn at about 10 ha, running north and north-east, with nothing built south or west of the excavated walls. **The order is ready to run.**
   - The town's outlines will be under CC BY-SA 4.0, not MIT. Whether share-alike reaches the whole built page is not settled (T2b verification, §4).
   - Then: run it in a fresh session on Fable 5.2 at effort high (D14), in its own worktree, with `--views 9` on the views check.
   - Chad is looking for Palyvou's 2005 book on Akrotiri's architecture through his university library. It would settle most of the order's "to verify" numbers (T2 verification, §4).
4. **Later orders, noted by 001:** plants (the bare ground is liberty T-L16), the real night sky (T-L12), sound above the water, a cliff form for the restored southern wall, and sharper shadows up close.

## How to try the page
- Open `index.html` in Chrome or Edge on the Mac and press **Dive in**.
- Mouse to look; `W` `A` `S` `D` to fly or swim; `E` or `Space` up, `Q` or `X` down; `Shift` faster; `1`–`6` viewpoints; `T` time of day; `Esc` menu; `M` mute; `H` stats.
- For a hands-off tour: `cd source && npm run build:dev`, open `dev.html` and press `F`.
- To refresh Thera Views: run the views check, then publish `.harness/views/latest/index.html` with its six JPEGs to the artifact's URL.

## Working from the iPad
- **Thera Views** (above) shows the six stills. The page itself is not reachable from the iPad until it is hosted somewhere.
- **Thera Research Desk**, <https://claude.ai/artifact/9pEpfRsWWDtP7sKjV4NQoq>: copies each research prompt, tracks lane status and stores pasted reports. Each report is a Markdown asset whose id is recorded in the `reports` collection.
- **Thera Project Board**, <https://claude.ai/artifact/SPwJ88U5JryHybwsjTn7js>: the `decisions` and `notes` collections. Answers there become D-numbers in `docs/DECISIONS.md`.

## Commands (Chad runs these)
```sh
cd ~/Developer/akrotiri-thera-abyssal-garden
git status                      # clean; akrotiri-frescoes-sources/ and tools/terrain/cache/ must NOT be listed
(cd source && npm run check)    # PASS build: ...
git log --oneline origin/main..main   # what the push will publish
git push origin main
git branch -d task/001-terrain-and-sea   # optional: the branch is merged
```

## Notes
- Research runs as Claude agents in a session (D13), one named agent per lane and a separate `Verify:` agent for each. The Gemini Argon steps in `docs/research/README.md` still apply if Gemini recovers.
- To rebuild the terrain data: `node tools/terrain/fetch.mjs` once (it downloads the two datasets into `tools/terrain/cache/`, ignored by git), then `node tools/terrain/build.mjs`, then `cd source && npm run build`.
- `~/.config/harness/secrets.json` has three `TODO` fields (`gemini-api-key.notes`, `open-brain-key.rotate`, `open-brain-key.leak_noticed_by`). `harness config check` fails on them in every project. They were there before session 1, which did not touch them.
