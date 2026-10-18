# Week 06 — Lab report

**Name:** Khudaibergen Yerassyl
**Group:** Monday 16:00-19:00
**Date:** 17.10.2026

Fill in every section. **Do not delete, rename or renumber the headings** — the checker and the
grader find your answers by them. Add rows to any table; never remove its header.

---

## 1. Setup

| | |
| --- | --- |
| Tool | Bolt.new |
| Exact model (as Bolt shows it, or `not displayed`) | GLM 5.3 FLASH |
| Bolt project link (or `not shared`, and why) | https://bolt.new/p/72144600 |
| Browser and version | Chrome 155.0.8059.82|
| If you could not use Bolt.new: the tool you used instead, and why | |

---

## 2. Task 1 — define before generating

**Two predictions, written BEFORE you send the first prompt.** Where do you expect v1 to go wrong?
Fill the first three columns now; fill the last one after Task 3.

| # | What I expect to go wrong | AC it concerns | Was I right? (after Task 3) |
| --- | --- | --- | --- |
| 1 | The initial overlap condition may reject a booking whose start is exactly the prior booking's end. | AC4 | Yes in the local v1: T1, T8 and T9 returned Unavailable. |
| 2 | A reversed interval might be rejected without explaining *why*. | AC1, AC6 | Yes in the local v1: T7 returned Unavailable but only said "This time slot is unavailable." |

**The initial prompt exactly as I sent it** — the deck's prompt with AC1–AC6 pasted in place of
`[paste AC1–AC6]`, nothing else changed:

```text
Build a small responsive Smart Campus Room Availability Checker. Requirements: Requirements: AC1: Accept a candidate interval only when 0 ≤ start < end ≤ 1440 and start is after the supplied current time.
AC2: Reject a booking longer than 120 minutes.
AC3: Reject the request when the selected room is blocked.
AC4: Reject any interval that overlaps an existing booking; touching endpoints are allowed.
AC5: Show a clear Available / Unavailable decision without changing the existing booking data.
AC6: The page remains usable at desktop and narrow/mobile width and gives understandable validation feedback.
Use fictional sample data only. Keep the implementation simple and within one-page scope. Do not add authentication, backend services, analytics, or unrelated features. After building, briefly list the main files/components you created.. Use fictional sample data only. Keep the implementation simple and within one-page scope. Do not add authentication, backend services, analytics, or unrelated features. After building, briefly list the main files/components you created.
```

---

## 3. Task 2 — prototype v1

v1 export saved in `original/` and screenshot saved as `evidence/v1.png` **before** any cleanup
prompt: yes 

**Bolt's list of the files/components it created, pasted unedited:**

```text

- src/lib/checkAvailability.ts — pure rule engine implementing AC1–AC5.
- src/App.tsx — page wiring: room selection, form state, runs the check, renders results.
- src/lib/time.ts — HH:MM ↔ minutes-from-midnight helpers.
- src/components/RoomSelector.tsx — selectable room list with status tags.
- src/components/BookingForm.tsx — current/start/end time inputs and buttons.
- src/components/RoomTimeline.tsx — visual schedule with existing bookings + candidate interval.
- src/components/DecisionPanel.tsx — Available / Unavailable / invalid result panel.
- src/data/rooms.ts — fictional sample rooms with bookings and blocked flags.
- src/types.ts — shared types.

```

**What v1 does — one line per thing that works, or visibly does not:**

- The page displays a Smart Campus Room Availability Checker.

- Users can select different rooms from the list.

- The page provides current time, start time, and end time inputs.

- The selected room shows its name, location, capacity, and blocked status.

- The page displays a daily schedule with existing bookings.

- The Check availability and Reset buttons are present.

- The page includes information about the maximum booking duration and touching endpoints.

- The initial version includes multiple selectable rooms, although the required scope is one selected room.

- The availability decisions and validation messages still need to be tested against AC1–AC6.

**Repair prompt** (only if the first build did not run — the deck allows one, then the result is
v1). Leave empty if you did not need it:

```text
```

---

## 4. Task 3 — the nine cases

Base for every case unless the row says otherwise: **current time 09:00**, room **not blocked**,
the room's **only booking 10:00–11:00**. The Expected column comes from AC1–AC6 — do not change it.
Write each result exactly as **Available**, **Unavailable** or **Not testable** (the page gives you
no way to set up the case). Save each final run as `evidence/final-T<n>.png`.

| # | Case | What you set up and request | Expected | AC | Result on v1 | Result on final | Final screenshot |
| --- | --- | --- | --- | --- | --- | --- | --- |
| T1 | Touching | 11:00–12:00 | Available | AC4 | Available  | Available  | final-T1.png |
| T2 | Overlap | 10:30–11:30 | Unavailable | AC4 |  Unavailable  | Unavailable | final-T2.png |
| T3 | Blocked | 11:00–12:00, room blocked | Unavailable | AC3 |  Unavailable  |Unavailable| final-T3.png |
| T4 | Exactly 2 hours | 12:00–14:00 | Available | AC2 | Available  | Available | final-T4.png |
| T5 | Over 2 hours | 12:00–14:01 | Unavailable | AC2 |  Unavailable | Unavailable | final-T5.png |
| T6 | Starts now | 09:00–09:30 (current time 09:00) | Unavailable | AC1 |  Unavailable |  Unavailable | final-T6.png |
| T7 | Reversed times | 12:00–11:00, and the page says why | Unavailable | AC1, AC6 |  Unavailable  |  Unavailable | final-T7.png |
| T8 | Same check twice | T1, then T1 again without reloading | Available | AC5 | Available | Available  | final-T8.png |
| T9 | Narrow screen | T1 at about 375 px wide | Available | AC6 | Available | Available | final-T9.png |

---

## 5. Issue log — cleanup targets

One row per issue you chose to act on (or deliberately not act on). At least **two**: one
functional and one usability or code-quality issue when you have them. If v1 passed every case,
log a justified cleanup that preserves behaviour. Save a screenshot of each as
`evidence/issue-<n>.png`.

| # | Issue | Evidence: steps → expected → observed | Priority | Decision |
| --- | --- | --- | --- | --- |
| 1 | Unclear variable names and complex logic|Inspect the availability validation code | Medium |Reject|
| 2 |Extra room selection (scope)| One selected room|  Low |  Reject |

---

## 6. Task 4 — cleanup with focused prompts

One issue per prompt. Paste every prompt **as sent** (every `[bracketed field]` and `AC#` filled
in) and Bolt's answer, unedited.

**Functional fix prompt, as sent, and Bolt's answer:**

```text
In the current prototype, opening the room availability checker produces a list of multiple selectable rooms, but AC6 requires a responsive checker for the selected room and the specified scope is one selected room only. Make the smallest change that fixes this behavior. Preserve the other acceptance criteria. Explain which file/component you changed and why.

626f6c742d63632d6167656e74The issue: `RoomSelector` renders a list of multiple selectable room cards, but the scope is one selected room. The smallest fix is to change that component from a list of buttons into a single dropdown — the app already tracks one `selectedId`, so only the presentation changes.Now update the CSS — replace the multi-card styling with single-select styling.Also update the responsive rule that referenced the old selector's max-height.Build passes. The checker now opens showing one selected room, not a multi-room list.

**What changed:** `src/components/RoomSelector.tsx` — replaced the list of selectable room cards (a `radiogroup` of buttons) with a single dropdown `<select>`. The component keeps the same props (`rooms`, `selectedId`, `onSelect`), so `App.tsx` needed no changes. I also updated the matching styles in `src/index.css` and removed a now-unused responsive rule.

**Why:** The app already tracked one `selectedId` and ran the availability check against that single room; only the picker presentation was wrong. A dropdown makes the "one selected room" scope visually unambiguous while preserving AC1–AC5 (the check logic is untouched) and AC6 (the dropdown works at desktop and mobile widths).
```

**Cleanup prompt, as sent, and Bolt's answer:**

```text
Review only the room availability validation component for unnecessary duplication, confusing naming, or UI feedback problems. Suggest one small cleanup. Do not add features or redesign the whole application. Implement it only if it preserves AC1–AC6.

I'll review the validation path: checkAvailability.ts, DecisionPanel.tsx, BookingForm.tsx, and App.tsx.


0123456789
 files read
I found one UI feedback problem worth fixing.

Issue: App.tsx parses startTime/endTime into minutes in handleSubmit, and separately parses them again inside the candidate useMemo (lines 22–27). The form's required attribute only guards against empty fields — if a user types a valid-looking but out-of-range value (e.g. end before start, or a 200-minute interval), there's no inline feedback until they submit. More importantly, the handleSubmit path passes raw parsed values to checkAvailability but doesn't clear a stale result if the user edits the form after a previous check — the old decision stays visible, which is misleading.

The smallest cleanup that preserves AC1–AC6: clear the displayed decision whenever the user changes any form input or the selected room (already done for room changes, not for form edits). This prevents a stale Available/Unavailable from confusing the user while they adjust times — a direct AC6 improvement ("understandable validation feedback").


0123456789
 file edits
Now wire the form-edit handlers to clear a stale result too.


0123456789
 actions taken
Now simplify handleReset to reuse clearResult.


0123456789
 actions taken
Build passes.

Review findings: The validation logic in checkAvailability.ts is clean — no duplication, clear AC comments, correct ordering. DecisionPanel is fine. The one real issue was a UI feedback problem in App.tsx: after a check produced an Available/Unavailable decision, editing any form field left the stale decision on screen, which is misleading (AC6 wants understandable validation feedback).

Cleanup applied (one file: src/App.tsx): Extracted a clearResult() helper and called it from every input change handler, the room selector, and reset — so the decision clears the moment the user starts editing, then reappears (fresh) only after they press Check availability again. This also removed the duplicated setResult(null); setSubmitted(false) pair that was written inline in three places. No rules logic touc
```

Add further blocks for further prompts.

**Every change or suggestion Bolt made, judged.** Accepting is a decision; so is rejecting. Cite
the AC (or the scope) that justifies it.

| # | What Bolt changed or suggested | accept / reject | Reason — cite the AC or the scope | Retest: which cases, result |
| --- | --- | --- | --- | --- |
| 1 | | accept  |Simplifies the interface and supports AC6, but still allows switching between multiple rooms. It does not fully remove the scope concern.|Check room selection, T3 and T9; record actual results|
| 2 | | accept Required to keep the revised selector usable at desktop and mobile widths (AC6).|T9 at 375 px|

---

## 7. Change log — v1 to final

Two to four concrete changes, each one retested.

| # | Issue | Decision | Change (file or component) | Result after retest |
| --- | --- | --- | --- | --- |
| 1 |Multiple room cards made the one-room scope unclear|Accept |src/components/RoomSelector.tsx: replaced cards with dropdown |Record whether the selector works and whether the scope concern remains|
| 2 |Selector styling needed updating | Accept |src/index.css: added dropdown styling and updated responsive rules |Record T9 result at 375 px |

---

## 8. One generated component, in my own words

Pick one file or component Bolt generated that matters for AC1–AC5 — the one that decides
availability is the best choice. Name its path in backticks, then explain in your own words, without
the assistant, what it does and how it decides. 60 words or more.

**File:** `C:\Users\Acer\Downloads\se-practice\week-06\prototype\project\src\lib\checkAvailability.ts`

<!-- Write your explanation below this line -->
The `checkAvailability.ts` file is responsible for checking whether a requested time interval is valid. It receives the selected room information, the requested start and end times, and the current time. First, it checks if the time interval is valid and starts in the future (AC1). It also checks that the duration does not exceed 120 minutes (AC2). Then it checks whether the room is blocked (AC3). After that, it compares the requested interval with existing bookings to prevent overlapping reservations while allowing touching endpoints (AC4). Finally, it returns an availability decision without modifying the existing bookings (AC5). The application uses this result to display feedback to the user.
---

## 9. What still fails, and what the criteria do not say

### 9.1 Checks I am keeping as FAIL or ERROR

The same IDs as `known_fails` in `submission.yml`. Write `none` if the run is clean.

| Check | Why it stays |
| --- | --- |
| | |

### 9.2 The end of the day

AC1 allows `end ≤ 1440` — a booking may end at 24:00. Can a user of your final page ask for
23:00–24:00? How — and if not, why is that acceptable or not? (This is the value you declare in
`submission.yml` under `assumptions.end_of_day`.)

-The final page does not provide a way to select 24:00 using the standard time input. The latest selectable time is 23:59. Therefore, a user cannot request 23:00–24:00 directly, even though AC1 allows an end time of 1440 minutes. This is a limitation of the current interface and should be addressed by an explicit end-of-day option. The prototype should not interpret 00:00 as the end of the same day without a clear rule.

### 9.3 Which "now"?

AC1 says "after the supplied current time". What did **v1** use as the current time, and what did
that mean for testing case T6?

-In v1, the current time was shown in the Current time input and could be changed manually. The page initially displayed a clock time, but the availability decision used the supplied input value. For T6, the current time must be set to 09:00 and the booking start must also be 09:00. The expected result is Unavailable because AC1 requires the start time to be strictly after the current time.

---

## 10. Conclusion (120–180 words)

<!-- Answer all three, in your own words, without the assistant:
     (a) Which of your two predictions in section 2 was right, and what did v1 actually get wrong?
     (b) Which AI suggestion did you reject, or would have been wrong to accept, and why?
     (c) What is the difference between "the prototype looks finished" and "the prototype meets
         AC1-AC6" - shown with one case from section 4?
     Worthless: "Bolt made some mistakes and I fixed them."
     Worth everything: "T8 failed on v1: the Check button also added the booking to the list, so
     checking 11:00-12:00 a second time said Unavailable. AC5 says the check must not change the
     booking data." -->

<!-- Write your conclusion below this line -->
The Smart Campus prototype demonstrated that AI can quickly generate a functional and responsive web page. The initial version already handled several validation rules correctly, including rejecting booking requests that started before the supplied current time. However, the review identified areas that required improvement.

One issue concerned the room selector. Bolt replaced multiple room cards with a dropdown, which simplified the interface but did not fully remove the possibility of selecting different rooms. Another improvement involved clearing an outdated availability result after the user changed an input. This change was important for understandable feedback under AC6.

The main lesson is that a visually complete prototype is not necessarily a fully verified application. Each acceptance criterion must be checked with specific inputs and observable results. Testing the required scenarios, reviewing generated code, and documenting the limitations are necessary before accepting AI-generated software.
