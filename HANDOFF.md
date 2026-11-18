# Handoff

As of 2026-11-18, after work order 001 was merged. Only Chad's session edits this file. (On 2026-11-18 Chad asked the session that built work order 001 to do its integration, so that session wrote this version.)

## Where things stand
- **The world is now Thera.** `main` holds the island of 1615 BCE (high chronology, D16): land, sea, sky and light, at real scale, in one `index.html` of 132 kB. There is no town, plant, animal or person yet, so the ground is bare. Upstream's underwater garden is gone.
- **Repository:** <https://github.com/chadjustice25/akrotiri-thera-abyssal-garden>, public, forked from `Noniv/abyssal-garden` (MIT). Remotes are `origin` (the fork) and `upstream` (Noniv).
- **Not pushed.** Local `main` is ahead of `origin/main` (`abbdf21`) by work order 001 (merge `7651a39`) and the integration commit after it. The branch `task/001-terrain-and-sea` still exists locally.
- **Work order 001** (`docs/tasks/001-terrain-and-sea.md`) has its Result and Review filled in. The terrain record is `docs/terrain/README.md`: datasets and licences, edits E0–E9 with their claims, liberties T-L1 to T-L17, and how to rebuild the data.
- **Checks on `main`:** `checks/build.sh` PASSes at 130 kB of the 256 kB budget. `node checks/views.mjs --min-fps 55 --min-scale 60` PASSes with every view at 60 fps and full resolution. The latest pictures are in **Thera Views**, <https://claude.ai/artifact/EAM2iAgZHr4toJ39qt9C9L> (version 6).
- **Who looked:** Chad ran the page on the Mac on 2026-11-18 and said it "looks great and the controls are pretty intuitive". Claude looked at the six stills, the six times of day and the surface crossing. Nobody has tried touch on a device.
- **Research:** X1, T1, T1b, T1c and T2–T7 are in `docs/research/claude/`, each checked in `docs/research/verification/`. T1c (deposits, harbour, sea level, licences) is applied to the terrain.
- **The terrain data is not MIT.** It stays under the Copernicus WorldDEM-30 licence and CC BY 4.0 (EMODnet). The notices are in the page's menu, `README.md`, `source/src/terrain-data.js` and the terrain record, and must travel with the page.

## Next
1. **Chad: push** (command below). The fork is public, so the push publishes the island and the data notices.
2. **Chad: decisions now due.**
   - **O6, the size budget.** The first real figure is 132 kB, of which about 71 kB is terrain data. The town, plants and people come on top of that.
   - **O4, upstream's funding link.** The menu still shows Noniv's GitHub and Ko-fi buttons. It is due "before the page is shown to anyone", and the push shows it.
   - **The reading of grade A for landscape claims** (T1 check, correction 15): still waiting to become a decision.
   - **E4's volume measure.** The restored land adds 13.16 km³ measured against today's surface, inside T1#14's 9.1–17.1 km³. Only 4.76 km³ of it stands above the sea. The source's abstract does not say which measure it used; reading the full paper would settle it.
   - **Licence questions for a lawyer before any release** (T1c licence verdict): whether a heavily edited reconstruction still counts as "Copernicus WorldDEM-30" (the project assumes it does), and whether accepting the licence needs any step beyond downloading.
3. **Next build: work order 002, the town of Akrotiri.** It is not written yet.
   - The ground is ready: edit E8 made a terrace at the excavation site (x −135, z 5937 in the world's metres; a rise at 24 m falling to the sea), and key `1` looks at it.
   - It builds from T2 (plan, buildings, rooms) and T6 (colour), as checked. It should also add walking (D12): flying and swimming are in, and walking waits for ground with buildings to collide with.
   - The harbour is not located. Two candidates stay open: the embayment south of the site, and Potamos (T1c#16, #17, #34).
   - Like 001, it runs in a fresh session on Fable 5.2 at effort high (D14). Lint it before a worker sees it.
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
