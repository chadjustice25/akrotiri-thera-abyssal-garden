# Research: how to run it

Fourteen files are in `prompts/`. Ten are lanes for Gemini 4 Argon Deep Research, written 2026-11-15 (X1, the length test, later the same day); `TEMPLATE-site.md` is the starting point for later places; and three plant lanes for work order 003 were added on 2026-11-18 (see "The plant lanes" below). Each lane is one self-contained prompt, run in its own new chat. Prompts are kept to about 7 KB or less, because Argon has stalled on longer ones (`LESSONS.md`); X1 (9.7 KB) tests whether that limit is gone. Every lane shares the same context, source rules, A/B/C grades and report format. That shared shape is what lets Egypt, Byblos and later places line up with Thera.

**Neon replaced Argon on 2026-11-19 (D30).** Gemini removed Argon from Chad's list of models. New lanes run on Neon, and their reports go to `neon/<lane>_Neon.md`. Where this file names Argon for the first ten lanes, it is the plan as it was written. Those lanes were in the end researched by Claude agents (D13), and their reports are in `claude/`. What was learned about Argon (stalls on long prompts, a picture embedded in each report) is assumed to hold for Neon until a run shows otherwise.

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
| **T3b** What grew where on Thera, and how thickly | `prompts/T3b-vegetation-cover.md` | `neon/T3b_Neon.md` | Where fields, groves, scrub and bare ground go, and how dense each is |
| **T3c** How each plant looked: size, form, colour and season | `prompts/T3c-plant-forms-and-seasons.md` | `neon/T3c_Neon.md` | The shape and colour of every plant to be built, through the whole year, and which modern plants must not appear |
| **T3d** Plants in Aegean art, on Thera and elsewhere | `prompts/T3d-plants-in-aegean-art.md` | `neon/T3d_Neon.md` | What the painters and potters show, and what that can and cannot prove |

They follow lane T3 and its check, share its source rules and report format word for word, and add one line to the grades: a plant shown only in the art of another Aegean place is grade C for Thera. T3b and T3d are under 7 KB; T3c, changed on 2026-11-19 to ask for the whole year (D33), is 7.3 KB.

## The history of the excavation (D44)

Added 2026-11-20. One lane, in its own chat; it can run beside the plant lanes. The Research Desk lists it under "Now: the history of the dig".

| Lane | Prompt | Save the report as | What it settles |
|---|---|---|---|
| **T8** The history of the excavation at Akrotiri | `prompts/T8-excavation-history.md` | `neon/T8_Neon.md` | Which building, street and square was uncovered when, so that the Found layer can appear in the order of the dig; the shelters and the visitor route; when the best-known finds came to light |

Its claims are about a modern excavation, not about the Bronze Age. So its grades are read by how close a source stands to the season it describes (A: the excavators' own report of that season; B: a later account by the excavation, or a study that cites the reports; C: second-hand), rule 3 reads "begun is not finished", and Section 3 of its report is two tables of the dig. Everything else is word for word as in the other lanes. That reading of the grades is the integrator's, and Chad confirms or changes it when the report is checked. It is 7.9 kB below its line.

## Steps (Chad), for each lane

1. Open the lane's prompt file in any editor and copy everything **below the `---` line**.
2. In Gemini (gemini.google.com), start a **new chat**, choose **Neon** with its highest thinking setting, and turn on **Deep Research**.
3. Paste the prompt, add nothing, and send.
4. Gemini shows a research plan. Click **Start research** without editing it.
5. Wait for the report. You can leave the tab.
   - Since 2026-11-19 a prompt ends by asking Gemini to save the report to the Google Drive folder `Thera Research` under the lane's file name (D35). The report's last line says `DRIVE: saved as …` or `DRIVE: not saved`. If it was saved, download it from Drive into the folder in step 6; if not, carry on with step 6 by hand.
6. Save it as the file named in the table, in `docs/research/neon/`:
   - **Preferred:** export the report to Google Docs, then in Docs choose **File → Download → Markdown (.md)**. Move the file here and rename it. This keeps the tables intact.
   - **Quicker:** use the report's copy option, then in Terminal:
     `pbpaste > ~/Developer/akrotiri-thera-abyssal-garden/docs/research/neon/T3b_Neon.md` (with the lane's own name).
7. Check that it is not empty and has links:
   `grep -c http ~/Developer/akrotiri-thera-abyssal-garden/docs/research/neon/T3b_Neon.md` should print a number well above 0.
8. Tell the next session which lanes are in.

## If a lane stalls

Run its topics in two halves instead, each in its own new chat. Copy the context paragraph, the source rules and the report format unchanged, keep topics A–C in one and D–E (or D–F) in the other, and save the reports as `<lane>a_Neon.md` and `<lane>b_Neon.md`. The check treats the two halves as one lane.

## For the session that reads a report

- **Reading cost:** Argon reports embedded one base64 PNG of 150–215 KB on a single line, and Neon's may do the same. Read without it (`grep -v 'data:image' neon/T3b_Neon.md`), or about 50k tokens of image get read as text.
- Check every claim marked `contradicted` in "Assumptions checked", every grade-A claim the world will be built from, and every number in "Numbers for the builder" against its primary source. Write `verification/<lane>.md`: claim by claim, `checked`, `wrong` (with the right reading and source) or `could not check`.
- Adopted claims keep their reference (`T2#14`) wherever they are used. Nothing changes the standard or a decision without Chad.
- W1 and W2 are checked first and turned into `docs/WORLD_CLOCK.md`. Chad then decides O1.

## A new place

Copy `prompts/TEMPLATE-site.md`, fill in the place, and split it into lanes the way Thera is split. Keep the rules and the report format word for word.
