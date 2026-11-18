# Handoff

As of 2026-11-15, end of session 1 (setup). Only Chad's session edits this file.

## Where things stand
- **Repository:** <https://github.com/chadjustice25/akrotiri-thera-abyssal-garden>, public, forked from `Noniv/abyssal-garden` (MIT). The local clone is `~/Developer/akrotiri-thera-abyssal-garden`, with remotes `origin` (the fork) and `upstream` (Noniv). `main` is upstream's `a596354`. The scene is still upstream's underwater world.
- **Session 1 added these files (uncommitted until Chad commits):** `AGENTS.md` (the rulebook), `CLAUDE.md` and `GEMINI.md` (both import it), this handoff, `LESSONS.md`, `docs/DECISIONS.md` (D1–D16; O4–O6 open), `docs/HISTORICAL_STANDARD.md`, the research kit in `docs/research/` (W1, W2, T1–T7 and a template for new places), `docs/tasks/README.md`, `.harness/project.json`, the gate `checks/build.sh` (`npm run check` in `source/`), the views check `checks/views.mjs` (`npm run views`), `.gitignore` additions, and a fork note at the top of `README.md`.
- **Checked:** `checks/build.sh` prints PASS on the current tree. It FAILs on a stale page, on going over budget and on a runtime script, and gives ERROR when esbuild is missing. `harness config show project` passes.
- **Rendering (2026-11-16):** `checks/views.mjs` (D10) photographs the six viewpoints in headless Chrome on the Mac's GPU. It PASSes on upstream's scene, and the pictures are in the **Thera Views** artifact, <https://claude.ai/artifact/EAM2iAgZHr4toJ39qt9C9L>. To refresh it, run the check and publish `.harness/views/latest/index.html` with its six JPEGs to that URL. The scene is still upstream's.

## Next
1. **Chad:** review, then commit and push (commands below). The fork is public, so the push publishes it.
2. **Research now runs as Claude agents in this session (D13, 2026-11-18), because Gemini was dropping Argon sessions to Hydrogen.** X1 and T1 are running as the pilot; reports go to `docs/research/claude/`, and a separate `Verify:` agent checks each one. The Argon steps below still apply if Gemini recovers.
   Previously: **Chad:** run **X1** first. It is the length test, added after Google fixed the bug that stalled long prompts. If it finishes, it replaces W1 and W2; if it stalls, run W1 and W2. Then run T1, then T2 and T6, then T3, T4 and T5, then T7 (`docs/research/README.md`).
   - **Working from the iPad:** use the **Thera Research Desk**, <https://claude.ai/artifact/9pEpfRsWWDtP7sKjV4NQoq>. It copies each prompt (and the split parts), tracks lane status, and stores pasted reports. Each report is a Markdown asset whose id is recorded in the `reports` collection; read one with `ArtifactData list reports`, then `Artifact read` with `path` set to the asset id.
   - **Decisions and notes:** use the **Thera Project Board**, <https://claude.ai/artifact/SPwJ88U5JryHybwsjTn7js>, with the `decisions` and `notes` collections. Turn the answers there into D-numbers in `docs/DECISIONS.md`.
3. **Research is done and checked (2026-11-18):** X1, T1, T1b and T2–T7 are in `docs/research/claude/`, each checked in `docs/research/verification/`, with no invented sources. The world clock is written, and the year is 1615 BCE (D16). T1c (the terrain blockers) is running. **Next:** work order `docs/tasks/001-terrain-and-sea.md` (it passes harness lint), run by Chad in a fresh Claude Code session on Fable 5.2 at effort high (D14). When it reports back, review it here: look at Thera Views, apply T1c, and record the liberties in the standard's §6.
4. **Decisions waiting on Chad:** O4–O6 in `docs/DECISIONS.md` (O1 became D15 and D16, O2 D11, O3 D12; D6 confirmed 2026-11-18).

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
