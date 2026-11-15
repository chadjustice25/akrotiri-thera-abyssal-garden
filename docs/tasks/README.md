# Work orders

One file per task: `docs/tasks/NNN-slug.md`, numbered from 001. A work order is the whole brief for the agent who does the task. Nothing from a chat is assumed.

**Format:** unghost's task spec (`~/Developer/agent-lab/unghost/docs/harness/CONTRACTS.md` §1). It has a `harness-spec` JSON block (id, `owns`, `forbids`, `read_first`, `gate`, `review_tier`, budget), followed by Goal, Read first, You may change, Build, Done when, and Known gaps. `~/Developer/agent-lab/unghost/docs/tasks/004-normalize-mutation.md` is a worked example.

**Gate:** `checks/build.sh` (D7), named in the header as `"gate": {"argv": ["checks/build.sh"], "timeout_s": 300}`. The harness runs it from this checkout with the task's worktree as the working directory, so a worker cannot edit its own gate. Give a fresh worktree its dependencies first: `(cd source && npm ci)`.

**Visual work:** the gate does not render anything. A work order that changes what the viewer sees also lists the viewpoints to look at in Chrome or Edge. The person reviewing it records what they saw.

**History:** a work order that puts anything about the past into the world names the checked claims it builds from (e.g. `T1#7`) in Read first (`docs/HISTORICAL_STANDARD.md` §4).

**Check before a worker sees it:**
```sh
~/Developer/agent-lab/unghost/harness/bin/harness lint docs/tasks/NNN-slug.md
```

None exist yet. The first one comes after T1 is checked: replace upstream's seabed with the pre-eruption island's terrain and sea (`HANDOFF.md`, Next).
