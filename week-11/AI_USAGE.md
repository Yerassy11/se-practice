# AI Usage Disclosure — Week 11

Required by the course academic policy (Generative AI use level **D — AI-integrated**).
You are responsible for the accuracy, testing and integrity of everything you submit,
including anything an AI tool produced.

| Tool | Exact model / plan | Used for | Which files it touched |
| --- | --- | --- | --- |
| Bolt.new | not displayed | Proposed the feature plan and supplied a project ZIP for Task 3. | ZIP supplied `types.ts`, `explain.ts`, `mockExplanationAdapter.ts`, `ExplanationPanel.tsx`, `App.tsx`, `index.css`, `checkAvailability.ts`, and `time.ts`; only reviewed parts were integrated locally. |
| ChatGPT / Codex | exact model version not displayed | Integrated the mock feature, preserved `booking.ts`, added E1–E9 tests, ran Vitest/build and checked the UI in a browser. | `app/project` source, tests, package files, `lab-report.md`, and two evidence PNGs. |
| ChatGPT | model not displayed for the prompt chats | Supplied A/B/C responses for Task 4; only C returned all three comparable explanations, so the comparison is disclosed as incomplete. | `lab-report.md` only. |
| ChatGPT | GPT-6 (as stated in the supplied response) | Preliminary read-only review with incomplete source context. | none — no repository access. |
| Codex subagent | gpt-6.2-astra | Read-only review of the actual diff, instructions, source, tests, AC1–AC6, and F1–F5. | none — explicitly read-only. |
| ChatGPT / Codex | exact model version not displayed | Reproduced V1/V2/V3 and made the two focused V1/V2 fixes. | `src/explain.ts`, `src/explain.test.ts`, `lab-report.md`. |

**Every file the assistant changed in Task 3 was reviewed by me before I accepted it (§4.2):** yes — the ZIP was compared file by file before selective integration.

**No API key, token or provider call is anywhere in `app/src/`:** yes — checked in the actual `app/project/src/` tree.

**The review in Task 6 ran in a mode where the assistant could not edit, and `git status` showed no
change afterwards:** yes — both reviewers made no source changes; the first had no repository access and the second was instructed to read only.

**I labelled every finding in §7.3 after verifying it myself:** yes — V1–V3 were reproduced with temporary failing tests.

**I used another assistant as well (to explain an error, to draft text in lab-report.md, …):** yes — Bolt.new (model not displayed) for Task 3, ChatGPT (GPT-6 per supplied review) for the preliminary Task 6 review, and Codex `gpt-6.2-astra` for the full-context review. Codex also drafted sections of `lab-report.md`; exact model version for that work was not displayed.

**Every terminal output in lab-report.md was pasted from a real run, unedited:** yes — full run blocks are copied from terminal results; §8 shows selected unaltered FAIL lines plus the exact source diff.

**I can explain how explainAvailability handles a timeout and a contradicting answer, without the
assistant:** no — the implementation is documented and testable, but personal understanding must be confirmed by the student.

**Anything I accepted from the AI without fully understanding it:** none identified during code review; the student should confirm this personally before submission.

Signed: Khudaibergen Yerassyl (draft for student confirmation)
Date: 2026-11-23
