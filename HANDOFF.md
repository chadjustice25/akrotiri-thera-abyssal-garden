# Handoff

As of 2026-11-15, end of session 1 (setup). Only Chad's session edits this file.

## Where things stand
- **Repository:** <https://github.com/chadjustice25/akrotiri-thera-abyssal-garden>, public, forked from `Noniv/abyssal-garden` (MIT). The local clone is `~/Developer/akrotiri-thera-abyssal-garden`, with remotes `origin` (the fork) and `upstream` (Noniv). `main` is upstream's `a596354`. The scene is still upstream's underwater world.
- **Session 1 added these files (uncommitted until Chad commits):** `AGENTS.md` (the rulebook), `CLAUDE.md` and `GEMINI.md` (both import it), this handoff, `LESSONS.md`, `docs/DECISIONS.md` (D1–D7, O1–O6), `docs/HISTORICAL_STANDARD.md`, the research kit in `docs/research/` (W1, W2, T1–T7 and a template for new places), `docs/tasks/README.md`, `.harness/project.json`, the gate `checks/build.sh` (`npm run check` in `source/`), `.gitignore` additions, and a fork note at the top of `README.md`.
- **Checked:** `checks/build.sh` prints PASS on the current tree. It FAILs on a stale page, on going over budget and on a runtime script, and gives ERROR when esbuild is missing. `harness config show project` passes.
- **Not checked:** nothing has been rendered. No WebGPU check runs here, and the scene is unchanged.

## Next
1. **Chad:** review, then commit and push (commands below). The fork is public, so the push publishes it.
2. **Chad:** run **X1** first. It is the length test, added after Google fixed the bug that stalled long prompts. If it finishes, it replaces W1 and W2; if it stalls, run W1 and W2. Then run T1, then T2 and T6, then T3, T4 and T5, then T7 (`docs/research/README.md`).
   - **Working from the iPad:** use the **Thera Research Desk**, <https://claude.ai/artifact/9pEpfRsWWDtP7sKjV4NQoq>. It copies each prompt (and the split parts), tracks lane status, and stores pasted reports. Each report is a Markdown asset whose id is recorded in the `reports` collection; read one with `ArtifactData list reports`, then `Artifact read` with `path` set to the asset id.
   - **Decisions and notes:** use the **Thera Project Board**, <https://claude.ai/artifact/SPwJ88U5JryHybwsjTn7js>, with the `decisions` and `notes` collections. Turn the answers there into D-numbers in `docs/DECISIONS.md`.
3. **Next session:** read the reports without their embedded image. Check W1 and W2, write `docs/WORLD_CLOCK.md`, and put O1 (the anchor year) to Chad. Check T1, then write the first work order: the pre-eruption island's terrain and sea in place of upstream's seabed.
4. **Decisions waiting on Chad:** O1 to O6 in `docs/DECISIONS.md`, and D6 (keeping the reference images out of git) to confirm.

## Commands (Chad runs these)
```sh
cd ~/Developer/akrotiri-thera-abyssal-garden
git status                      # akrotiri-frescoes-sources/ must NOT be listed (it is ignored)
(cd source && npm run check)    # PASS build: ...
git add -A
git commit -m "Set up the Akrotiri–Thera project: rulebook, historical standard, decisions, Argon research lanes, harness config and build gate"
git push origin main
```

## Notes
- `~/.config/harness/secrets.json` has three `TODO` fields (`gemini-api-key.notes`, `open-brain-key.rotate`, `open-brain-key.leak_noticed_by`). `harness config check` fails on them in every project. They were already there before session 1, which did not touch them.
