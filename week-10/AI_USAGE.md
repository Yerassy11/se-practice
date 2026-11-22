# AI Usage Disclosure — Week 10

Required by the course academic policy (Generative AI use level **D — AI-integrated**).
You are responsible for the accuracy, testing and integrity of everything you submit,
including anything an AI tool produced.

| Tool | Exact model / plan | Used for | Which files it touched |
| --- | --- | --- | --- |
| ChatGPT | Astra-6 | Read-only review (Task 2), AGENTS.md patch draft (Task 6), and refactor plan (Task 8) | none; its answers were pasted into the report |
| Codex | GPT-6 (exact version not displayed) | Verified claims and commands, applied the approved playbook patch, added the R2 regression test, fixed the formatter, captured UI evidence, and completed the report | `app/AGENTS.md`, `app/project/src/booking.test.ts`, `app/project/src/lib/time.ts`, `lab-report.md`, `evidence/ui-desktop.png`, `evidence/ui-mobile.png` |

**The review in Task 2 ran in a mode where the assistant could not edit, and `git status` showed no
change afterwards:** yes 
<!-- If it edited anything, say what and how you undid it. -->

**I labelled every claim in lab-report.md §3.2 after opening the cited file myself:** yes 

**Every change to `app/` was reviewed by me as a diff before I accepted it:** yes 
<!-- Name anything you rejected in §8; name here anything you accepted without reading. -->

**I used another assistant as well (to explain a risk, to draft text in lab-report.md, …):** yes — Codex (GPT-6; exact version not displayed) helped with the report, tests, code, and screenshots.
<!-- If "yes": which one, the exact model, and for which section. -->

**Every terminal output in lab-report.md was pasted from a real run, unedited:** yes 

**I can explain every score in my register, and why my release decision follows from it, without
the assistant:** yes 

**Anything I accepted from the AI without fully understanding it:**
<!-- Name the file and the part. An honest entry here costs far less than a blank one that turns out to be untrue. -->

Signed: Khudaibergen Yerassyl
Date:2026-11-22
