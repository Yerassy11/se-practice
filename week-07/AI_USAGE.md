# AI Usage Disclosure — Week 07

Required by the course academic policy (Generative AI use level **D — AI-integrated**).
You are responsible for the accuracy, testing and integrity of everything you submit,
including anything an AI tool produced.

| Tool | Exact model / plan | Used for | Which files it touched |
| --- | --- | --- | --- |
| ChatGPT | GPT 5.6 Sol | Generated the first test suite (Task 3); its response was included in the report. | `suites/first/booking.test.ts` (previously `app/src/suites/first/booking.test.ts`); `lab-report.md` §4. |
| ChatGPT | GPT 5.6 Sol | Reviewed the suite using the improvement prompt (Task 5) and proposed additional boundary tests. | `lab-report.md` §6.2; the proposed tests were later implemented with Codex assistance. |
| Codex | GPT-6 (exact variant/version not displayed) | Diagnosed test and checker results, ran and restored M1–M3, added three boundary tests, corrected suite locations, checked the invalid existing booking, and drafted report text using actual runs and saved UI screenshots. | `app/project/src/booking.test.ts`; moved the first suite to `suites/first/booking.test.ts`; `app/project/src/booking.ts` (temporary mutations, fully restored); `lab-report.md` §§1, 6–10; `submission.yml`; `AI_USAGE.md`; repository `.gitignore`. |

**I used an assistant to extract `canBook` (Task 1), or to fix a defect in it:**  no
<!-- If "yes": which change, in which file, and how you checked that the behaviour did not change. -->

**I used another assistant as well (to explain a failure, to draft text in lab-report.md, …):** yes 
<!-- If "yes": which one, the exact model, and for which section. -->

I also used Codex, based on GPT-6; its exact model variant/version was not displayed. It helped fill the setup details in §1, diagnosetest runs in §6, perform and document the temporary mutations in §7

**`suites/first/` holds the assistant's first test file exactly as it generated it:** yes 

**Every terminal output in lab-report.md was pasted from a real run, unedited:** yes 

**I can explain every test in my final suite — its input, its expected result and the AC behind
it — without the assistant:** yes 

**Anything I accepted from the AI without fully understanding it:**
<!-- Name the file and the part. An honest entry here costs far less than a blank one that turns out to be untrue. -->

Signed: Khudaibergen Yerassyl
Date: 2026.11.02
