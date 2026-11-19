# Research: how to run it

Fourteen files are in `prompts/`. Ten are lanes for Gemini 4 Argon Deep Research, written 2026-11-15 (X1, the length test, later the same day); `TEMPLATE-site.md` is the starting point for later places; and three plant lanes for work order 003 were added on 2026-11-18 (see "The plant lanes" below). Each lane is one self-contained prompt, run in its own new chat. Prompts are kept to about 7 KB or less, because Argon has stalled on longer ones (`LESSONS.md`); X1 (9.7 KB) tests whether that limit is gone. Every lane shares the same context, source rules, A/B/C grades and report format. That shared shape is what lets Egypt, Byblos and later places line up with Thera.

## Lanes and run order

| Order | Lane | Prompt | Save the report as | What it settles |
|---|---|---|---|---|
| 0 | **X1** The world clock, complete (**length test**, added 2026-11-15) | `prompts/X1-world-clock-full.md` | `argon/X1_Argon.md` | Whether Argon now finishes long prompts and reports. If it finishes, it replaces W1 and W2; if it stalls, run W1 and W2 |
| 1 | **W1** The eruption's date and the Aegean phases | `prompts/W1-eruption-date.md` | `argon/W1_Argon.md` | The anchor year (O1) |
| 1 | **W2** Who was where, 1800–1500 BCE, and the links between regions | `prompts/W2-who-was-where.md` | `argon/W2_Argon.md` | The world clock every place reads from |
| 1 | **T1** Thera's land, sea and climate before the eruption | `prompts/T1-land-sea-climate.md` | `argon/T1_Argon.md` | The terrain, the first thing built |
| 2 | **T2** The town of Akrotiri: plan, buildings and rooms | `prompts/T2-town-buildings.md` | `argon/T2_Argon.md` | The buildings |
| 2 | **T6** The wall paintings, their colours, and the look of things | `prompts/T6-art-colour.md` | `argon/T6_Argon.md` | The palette, and image rights (D6) |
| 3 | **T3** Plants and animals, found and painted | `prompts/T3-plants-animals.md` | `argon/T3_Argon.md` | What grows and moves |
| 3 | **T4** The people: appearance, work, food, belief, sound and names | `prompts/T4-people.md` | `argon/T4_Argon.md` | People and sound |
| 3 | **T5** Ships, sea travel and trade | `prompts/T5-ships-trade.md` | `argon/T5_Argon.md` | Boats and the harbour |
| 4 | **T7** The end: earthquake, abandonment and eruption | `prompts/T7-the-end.md` | `argon/T7_Argon.md` | The ending |

Lanes with the same order number can run at the same time, in separate chats. Order 1 matters most: W1 and W2 fix the year, and T1 fixes the ground.

## The plant lanes (work order 003, D26)

Added 2026-11-18. **The step-by-step runbook is `RUNBOOK-003-plants.md`**, and the Research Desk lists these three first. All three run at the same time, each in its own chat.

| Lane | Prompt | Save the report as | What it settles |
|---|---|---|---|
| **T3b** What grew where on Thera, and how thickly | `prompts/T3b-vegetation-cover.md` | `argon/T3b_Argon.md` | Where fields, groves, scrub and bare ground go, and how dense each is |
| **T3c** How each plant looked: size, form, colour and season | `prompts/T3c-plant-forms-and-seasons.md` | `argon/T3c_Argon.md` | The shape and colour of every plant to be built, as it stands in late May, and which modern plants must not appear |
| **T3d** Plants in Aegean art, on Thera and elsewhere | `prompts/T3d-plants-in-aegean-art.md` | `argon/T3d_Argon.md` | What the painters and potters show, and what that can and cannot prove |

They follow lane T3 and its check, share its source rules and report format word for word, and add one line to the grades: a plant shown only in the art of another Aegean place is grade C for Thera. Each is under 7 KB.

## Steps (Chad), for each lane

1. Open the lane's prompt file in any editor and copy everything **below the `---` line**.
2. In Gemini (gemini.google.com), start a **new chat**, choose **Argon** with thinking **high**, and turn on **Deep Research**.
3. Paste the prompt, add nothing, and send.
4. Gemini shows a research plan. Click **Start research** without editing it.
5. Wait for the report. You can leave the tab.
6. Save it as the file named in the table, in `docs/research/argon/`:
   - **Preferred:** export the report to Google Docs, then in Docs choose **File → Download → Markdown (.md)**. Move the file here and rename it. This keeps the tables intact.
   - **Quicker:** use the report's copy option, then in Terminal:
     `pbpaste > ~/Developer/akrotiri-thera-abyssal-garden/docs/research/argon/T1_Argon.md` (with the lane's own name).
7. Check that it is not empty and has links:
   `grep -c http ~/Developer/akrotiri-thera-abyssal-garden/docs/research/argon/T1_Argon.md` should print a number well above 0.
8. Tell the next session which lanes are in.

## If a lane stalls

Run its topics in two halves instead, each in its own new chat. Copy the context paragraph, the source rules and the report format unchanged, keep topics A–C in one and D–E (or D–F) in the other, and save the reports as `<lane>a_Argon.md` and `<lane>b_Argon.md`. The check treats the two halves as one lane.

## For the session that reads a report

- **Reading cost:** Argon reports have embedded one base64 PNG of 150–215 KB on a single line. Read without it (`grep -v 'data:image' argon/T1_Argon.md`), or about 50k tokens of image get read as text.
- Check every claim marked `contradicted` in "Assumptions checked", every grade-A claim the world will be built from, and every number in "Numbers for the builder" against its primary source. Write `verification/<lane>.md`: claim by claim, `checked`, `wrong` (with the right reading and source) or `could not check`.
- Adopted claims keep their reference (`T2#14`) wherever they are used. Nothing changes the standard or a decision without Chad.
- W1 and W2 are checked first and turned into `docs/WORLD_CLOCK.md`. Chad then decides O1.

## A new place

Copy `prompts/TEMPLATE-site.md`, fill in the place, and split it into lanes the way Thera is split. Keep the rules and the report format word for word.
