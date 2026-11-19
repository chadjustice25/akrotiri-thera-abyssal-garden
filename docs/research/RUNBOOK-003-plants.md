# Runbook: the plant research for work order 003

For Chad. Three research lanes go to **Gemini 4 Argon Deep Research**, and they can all run at the same time. When the three reports are saved, Claude checks them against their sources, and work order 003 (plants and ground cover, D26) is written from what survives the check.

Allow about ten minutes of your time to start them, then the wait while Argon works.

## The three lanes

| Lane | It answers | Prompt file | Save the report as |
|---|---|---|---|
| **T3b** | What grew where on the island, and how thickly: fields, terraces, groves, scrub, bare ground | `prompts/T3b-vegetation-cover.md` | `argon/T3b_Argon.md` |
| **T3c** | How each plant looked: size, form, colour, and its state in late May. Also which modern plants must not appear | `prompts/T3c-plant-forms-and-seasons.md` | `argon/T3c_Argon.md` |
| **T3d** | Plants in Aegean art, on Thera and elsewhere, and how far the painters can be trusted | `prompts/T3d-plants-in-aegean-art.md` | `argon/T3d_Argon.md` |

Each prompt is under 7 KB, the size above which Argon has stalled before.

## The easy way: the Research Desk (iPad or Mac)

Open the **Thera Research Desk**: <https://claude.ai/artifact/9pEpfRsWWDtP7sKjV4NQoq>. The three lanes are at the top, under "Now: plants, for work order 003".

For each lane:

1. Tap **Copy prompt**.
2. Tap **Open Gemini**. Start a **new chat**. Choose **Argon**, thinking **high**, and turn on **Deep Research**.
3. **Check that the chat says Argon before you send.** Paste, add nothing, and send.
4. When the research plan appears, tap **Start research** without editing it.
5. Back on the Desk, mark the lane **Running**.
6. Do the same for the other two lanes, each in its own new chat.

When a report is finished:

7. **Check that the chat still says Argon.** If it has dropped to another model, see "If something goes wrong".
8. Copy the whole report (the report's copy button, or Share then Copy).
9. On the Desk, open **Save the report** on that lane, paste, and tap **Save**. The Desk counts the links and table rows so you can see that the whole report arrived.

When all three are saved, tell Claude: **"T3b, T3c and T3d are in the Research Desk."**

## The Mac way: Terminal

Run these from the repository (`cd ~/Developer/akrotiri-thera-abyssal-garden`). Each `pbcopy` line puts one prompt on the clipboard, without the header above its `---` line.

```sh
sed '1,/^---$/d' docs/research/prompts/T3b-vegetation-cover.md | pbcopy
sed '1,/^---$/d' docs/research/prompts/T3c-plant-forms-and-seasons.md | pbcopy
sed '1,/^---$/d' docs/research/prompts/T3d-plants-in-aegean-art.md | pbcopy
```

Paste each into its own new Gemini chat, as in steps 2 to 4 above. When a report is finished, copy all of it and save it with the matching line:

```sh
pbpaste > docs/research/argon/T3b_Argon.md
pbpaste > docs/research/argon/T3c_Argon.md
pbpaste > docs/research/argon/T3d_Argon.md
```

Then check that each one arrived whole. Every count should be well above 10:

```sh
grep -c http docs/research/argon/T3[bcd]_Argon.md
```

Tell Claude: **"T3b, T3c and T3d are in `docs/research/argon/`."**

## What a good report looks like

- Seven sections, named "Section 1" to "Section 7": Summary, Claims, Numbers for the builder, Assumptions checked, Debates, Game hooks, Sources.
- A claims table with dozens of numbered rows, each with a grade (A, B or C) and a link.
- "could not verify" where Argon found nothing. That is a good sign, not a failure.

## If something goes wrong

| What happened | What to do |
|---|---|
| **Argon stalls** or stops partway | Mark the lane **Stalled** on the Desk and open **If it stalls: run it in two parts**. Run each part in its own new chat and save them as the Desk says (`T3ba`, `T3bb`, and so on). |
| **The chat dropped from Argon to another model** (the fault that stopped the first round, D13) | Do not save that report as Argon's. Tell Claude which lane, and Claude runs it as a research agent in the session, as lanes T1 to T7 were. |
| **The report is short, or has no links** | Ask once in the same chat: "Please give the full report in the format the prompt asks for, with every table." If it is still thin, treat it as a stall. |
| **Gemini asks to edit the plan** | Start the research without editing. The prompt already says what is wanted. |

## What happens next

1. Claude reads each report and checks its claims against the sources it cites, one by one, and writes `docs/research/verification/T3b.md`, `T3c.md` and `T3d.md`. A report is not evidence until this is done (`AGENTS.md` §4.6).
2. Claude drafts work order 003 from the checked claims and brings you the decisions it needs, such as how much of the island was farmed where the evidence is silent.
3. Nothing is built from a painting alone. Art from Thera is grade B for Thera, and art from elsewhere is grade C (D26).
