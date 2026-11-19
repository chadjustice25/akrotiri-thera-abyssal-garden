# A letter to the Akrotiri Excavations: draft, not sent

Drafted on 2026-11-18 after work order 002, when Chad asked whether data could be requested from the excavation itself. **Nothing has been sent.** Whether to send it is open question O8 in `docs/DECISIONS.md`. D22 and the T2b check already name this as the remedy for the gap in the plan's chain of rights (`docs/research/verification/T2b.md`, §4 and §6).

## Who to ask, and what each answer would close

The liberty numbers are those of `docs/town/README.md` §6.

| Ask | Whom | Closes |
|---|---|---|
| Permission to draw outlines from the excavation's general plan, and a scaled copy | The Akrotiri Excavations (Archaeological Society at Athens; Christos Doumas has directed them since 1974: T2b#24) | A-L10, A-L12, most of A-L11, and the gap in the plan's rights |
| Street and square widths; street levels or gradients | the same | the grade-C street widths; terrain liberty T-L6 |
| Storey heights, parapet heights, upper-window sizes | the same, or Palyvou 2005 | A-L3, A-L6, A-L7 |
| Whether the outer rubble walls were plastered, and in what colour | the same | part of A-L2 |
| The West House timber records | TiMMA, hosted by the French School at Athens; its data need the director's agreement (T2#108) | the "axes to verify" marks on the door and window |
| The terms for consulting the laser scan of 2013 | the excavation, the Ephorate of Antiquities of the Cyclades, or the University of Vienna, where the data were deposited (T2#103) | measured wall heights, as a check on all of the above |

Nothing they hold is likely to close A-L1, the town beyond the dig: no one has measured its edge.

**What is not known.** No contact address was found or checked: get one from the Archaeological Society at Athens. How the excavation will answer cannot be predicted. Excavations rarely hand out unpublished plans or scan data, but they often answer a specific question or say where a number is published, so the letter asks for both. Any use for profit would also need the Ministry of Culture's permission (Law 4858/2021, art. 46; research, not legal advice).

## The book

Palyvou, C. 2005. *Akrotiri Thera: An Architecture of Affluence 3,500 Years Old.* INSTAP Academic Press (Prehistory Monographs 15). It is not in Chad's library. It would settle most of the "to verify" marks of lane T2 and several liberties (T2 verification, §4). A web search on 2026-11-18 found three lawful ways to get it; **the pages themselves were not opened, so check the prices:**
- INSTAP Academic Press lists the paperback at $45 and says PDF files are available: <https://instappress.com/product/akrotiri-thera-an-architecture-of-affluence-3500-years-old/>
- ISD, its distributor, lists a PDF at $36: <https://www.isdistribution.com/BookDetail.aspx?aId=164022>
- It is on JSTOR's ebook platform, so an interlibrary request may work.

A claim from the book enters the data only after it is checked against the page it cites (`AGENTS.md` §4.6).

## The draft

> **Subject:** Request to use the general plan of the Akrotiri excavation in a free, non-commercial reconstruction
>
> Dear Professor Doumas and colleagues,
>
> I am [name, affiliation]. I am building a free, non-commercial reconstruction of Thera and the town at Akrotiri shortly before the eruption, which runs in a web browser: [link]. Every wall, roof and street in it is tied to a published source and graded, and everything that is a guess is listed as one.
>
> At present the excavated part follows a simplified public map (Dörrbecker, Wikimedia Commons, 2007), good to about a metre within a building. I would much rather it followed your own plan. May I ask:
>
> 1. For permission to derive building outlines and street lines from the excavation's general plan (as printed in *Prehistoric Thera*, 2016, pp. 21 and 23), with full credit, for this non-commercial use; and for a scaled copy, if one can be shared.
> 2. Whether these are published anywhere, or could be told to me: storey heights; the widths of streets and squares and their levels; parapet heights; and whether the outer rubble walls were plastered, and in what colour.
> 3. On what terms the 2013 laser-scan data may be consulted.
>
> I would credit the excavation as you direct, and send you the reconstruction for comment before its next release. I understand that any use for profit would need the Ministry's permission; none is planned.
>
> With thanks, [name]

Whatever comes back changes numbers in `tools/town/town.json`, not code.
