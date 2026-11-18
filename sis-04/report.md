# SIS #04 — Report: Evolving the Smart Campus Room Availability Checker

<!-- The ONLY file you write prose in. Keep every numbered heading (## 1. … ## 10.), every
     ### sub-heading and every **Label:** word — the checker finds your answers by them.
     Replace every "(write here)" and "(paste here)". Delete these <!-- --> comments if you like. -->

## 1. Setup and starting point

<!-- Model: the exact model with its version, as the tool shows it ("ChatGPT" is a tool, not a
     model). If the tool does not show it, write: not displayed
     Starting point: week-08 | week-07 | sis-03 | starter   (README section 3)
     Baseline commit: the commit that brings your starting point into sis-04/app/ UNCHANGED —
     git rev-parse --short HEAD right after that commit. It is your "initial version". -->

| Item | Value |
| --- | --- |
| Assistant (tool) | ChatGPT |
| Assistant model | GPT Astra-6 |
| Starting point | week-08 |
| Baseline commit | d977fbe |
| Language (ts or js) | ts |
| Vitest version | 3.2.4 |
| Where I ran the tests | Windows PowerShell, `C:\Users\Acer\Desktop\SE\sis-04\app` |

### 1.1 Baseline run

<!-- Before you change anything: run the tests of your starting point inside app/ and paste the
     REAL output. No tests yet (starter, sis-03)? Paste the run anyway: Vitest prints
     "No test files found". That is your honest "original" number, 0/0. -->

```text
PS C:\Users\Acer\Desktop\SE\sis-04\app> npx vitest run

 RUN  v3.2.4 C:/Users/Acer/Desktop/SE/sis-04/app

 ✓ project/src/booking.test.ts (23 tests) 7ms
   ✓ BUG-A: allows a 30-minute request touching two bookings at both endpoints (AC4) 1ms
   ✓ BUG-B: an available non-touching request leaves booking data unchanged (AC5) 1ms
   ✓ canBook — AC1: valid interval and future start > AC1: rejects a start before minute zero independently of the current time 0ms
   ✓ canBook — AC1: valid interval and future start > AC1: accepts a request starting one minute after now 0ms
   ✓ canBook — AC1: valid interval and future start > AC1: accepts a one-minute interval 0ms
   ✓ canBook — AC1: valid interval and future start > T02: rejects a request that starts exactly now 0ms
   ✓ canBook — AC1: valid interval and future start > T03: rejects zero-duration interval 0ms
   ✓ canBook — AC1: valid interval and future start > T04: rejects reversed interval 0ms
   ✓ canBook — AC1: valid interval and future start > T05: rejects an end time after minute 1440 0ms
   ✓ canBook — AC1: valid interval and future start > X1: accepts an interval ending exactly at minute 1440 0ms
   ✓ canBook — AC2: maximum duration is 120 minutes > T06: accepts exactly 120 minutes 0ms
   ✓ canBook — AC2: maximum duration is 120 minutes > T07: rejects 121 minutes 0ms
   ✓ canBook — AC3: blocked rooms > T13: rejects an otherwise available request when room is blocked 0ms
   ✓ canBook — AC4: overlap detection > T01: accepts touching after an existing booking 0ms
   ✓ canBook — AC4: overlap detection > T08: accepts touching before an existing booking 0ms
   ✓ canBook — AC4: overlap detection > T09: rejects partial overlap 0ms
   ✓ canBook — AC4: overlap detection > T10: rejects a request containing an existing booking 0ms
   ✓ canBook — AC4: overlap detection > T11: rejects a request fully inside an existing booking 0ms
   ✓ canBook — AC4: overlap detection > T12: rejects an interval identical to an existing booking 0ms
   ✓ canBook — AC4: overlap detection > T14: accepts the request when there are no existing bookings 0ms
   ✓ canBook — AC4: overlap detection > X2: accepts an interval touching two bookings at both endpoints 0ms
   ✓ canBook — AC5: Boolean result and no input mutation > AC5: returns true and leaves booking data unchanged for an available request 0ms
   ✓ canBook — AC5: Boolean result and no input mutation > AC5: leaves booking data unchanged when the request is rejected 0ms

 Test Files  1 passed (1)
      Tests  23 passed (23)
   Start at  10:35:30
   Duration  656ms (transform 72ms, setup 0ms, collect 76ms, tests 7ms, environment 0ms, prepare 185ms)
```

## 2. Context for the assistant

### 2.1 Repository map

<!-- The concise map you gave the assistant: the files that matter and one line each on what
     they do. A tree is fine:  src/App.tsx — the page, holds the rooms and the form … -->

```text
app/package.json — runs Vitest 3.2.4 from app/; the Vite/React project is nested in project/.
app/project/src/App.tsx — holds the selected room, time inputs and result; calls canBook and checkAvailability, then renders the selector, form, timeline and feedback.
app/project/src/booking.ts — getBookingIssue and canBook implement interval, past-time, 120-minute, blocked-room and overlap checks.
app/project/src/data/rooms.ts — SAMPLE_ROOMS: eight fictional rooms with capacity, blocked status and individual bookings; no equipment field yet.
app/project/src/types.ts — Room, Booking, CheckInput and CheckResult types shared by the page and availability code.
app/project/src/lib/checkAvailability.ts — turns booking issues into a decision and explanatory message for the UI.
app/project/src/lib/time.ts — parses and formats HH:MM times and reads the local current time.
app/project/src/components/ — RoomSelector, BookingForm, RoomTimeline and DecisionPanel render the room list, inputs, schedule and result.
app/project/src/booking.test.ts — 23 baseline Vitest tests for canBook and AC1–AC5 boundaries.
```

### 2.2 The context message as sent

<!-- The whole first message of your analysis chat: the map, AC1–AC6, F1–F5 and the constraints
     (no login, payments, live APIs or database; fictional data only). Unedited. -->

```text
I am evolving an existing Smart Campus room availability checker. Repository map:\
\- src/App.tsx currently combines fictional room data, time parsing, selected room state, UI and availability decisions.\
\- src/main.tsx mounts the React application.\
\- src/index.css contains layout styles.\
\- package.json defines Vite and Vitest scripts.\
\
Preserve the exact old rules:\
AC1 0 <= start < end <= 1440 and start strictly after supplied now.\
AC2 The maximum duration is 120 minutes, including exactly 120.\
AC3 Blocked rooms are never Available.\
AC4 Reject actual overlap but permit intervals that only touch endpoints.\
AC5 A check returns Available or Unavailable without modifying bookings.\
AC6 Validation messages and layout must be understandable on desktop and mobile.\
New F1 capacity >= attendees; F2 room must contain ALL selected equipment;\
F3 blocked room never available; F4 show a clear empty state on zero matches;\
F5 changing the room updates the decision based on the chosen room's own bookings.\
\
Four or more fictional rooms, each with id, name, capacity, equipment, blocked and bookings.\
No login, payment, live API, backend, database, persistence or unrelated features.\
\
Identify at least three maintainability risks in these specific files, say what code evidence would verify each, and propose a short incremental improvement plan. Do not generate or rewrite source code yet.
```

## 3. Codebase analysis (Task 1)

### 3.1 Maintainability risks

<!-- At least three, found in YOUR starting code. "Where" names a file or a function(),
     e.g. src/App.tsx, check(). Evidence is what you saw, not what the assistant said.
     Priority: High / Medium / Low. -->

| # | Risk | Where (file / function) | Evidence | Priority |
| --- | --- | --- | --- | --- |
| 1 | Availability is decided through two paths, so a later change could make the Boolean result and explanation disagree. | `app/project/src/App.tsx`, `handleSubmit()` | `handleSubmit()` calls both `canBook()` and `checkAvailability()`, then replaces `res.decision` with a conditional based on `isAvailable`. | High |
| 2 | Booking rules are duplicated and can drift apart. | `app/project/src/booking.ts`, `getBookingIssue()` and `canBook()` | Both functions separately check interval bounds, `start > now`, the 120-minute limit, `blocked` and strict overlap. | High |
| 3 | The existing room catalog cannot support equipment filtering without changing its data model. | `app/project/src/data/rooms.ts`, `SAMPLE_ROOMS`; `app/project/src/types.ts`, `Room` | All eight sample rooms have capacity, blocked status and bookings, but none has `equipment`; the `Room` interface has no `equipment` property. | High |

### 3.2 Improvement plan — before editing

<!-- Numbered, in the order you will do it, smallest safe step first. Written BEFORE you change
     code: the commit that adds this section comes before the commit that changes app/src. -->

1. Preserve the 23-test baseline; add focused tests for F1/F2 and capacity boundaries B5/B6. Check: the new tests fail for the missing filter while the baseline still passes.
2. Add `equipment` to the existing `Room` type and eight-room catalog, then implement pure `filterRooms()` for F1/F2. Check: run the full suite; verify a room at exact capacity is included and one missing any required equipment is excluded.
3. Add `checkRoom()` in the existing `booking.ts` using the selected room's `blocked` value and bookings, while retaining `canBook()` and strict overlap comparisons. Check: AC3/AC4 and F3/F5 tests pass; compare bookings before and after for AC5.
4. Connect attendee/equipment filters and `checkRoom()` to `App.tsx`, remove its two-path decision, and preserve clearing the result on room change. Check: a zero-match filter displays the F4 empty state; switching rooms uses the new room's bookings; inspect desktop and mobile feedback for AC6.
5. Consolidate duplicated checks in `booking.ts` only after the new feature tests are green. Check: rerun all baseline and new tests after each edit, especially the 120-minute and touching-endpoint cases, and review the diff for booking mutations.

### 3.3 One AI suggestion I rejected or modified

| Suggestion (as the assistant made it) | Decision | Why — with the AC, F-rule, test or file behind it |
| --- | --- | --- |
| A2: "Make availability use the selected room's `blocked` property instead of the independent checkbox." | Rejected as an edit | The baseline `App.tsx` already passes `room.blocked` and `room.bookings` to `canBook()`; `data/rooms.ts` stores `blocked` per room. There is no global blocked checkbox to replace. AC3/F3 still need a test for the selected room. |

## 4. Feature extension (Task 2)

### 4.1 What I added

<!-- Short: the catalog (how many rooms, which equipment), how the filter is chosen on the page,
     what the empty state says, what happens to an old result when the room changes. -->

(write here)

### 4.2 Demonstration

<!-- One row per screenshot in evidence/. Say what is on it: the filter values, the rooms shown,
     the room selected, the times entered and the result. -->

| Screenshot | What it shows |
| --- | --- |
| `evidence/filter-match.png` | (write here) |
| `evidence/filter-empty.png` | (write here) |
| `evidence/switch-a.png` | (write here) |
| `evidence/switch-b.png` | (write here) |
| `evidence/narrow.png` | (write here) |

## 5. Refactoring (Task 3)

<!-- The diagrams are diagrams/before.puml and diagrams/after.puml (README section 8). -->

### 5.1 Module responsibilities after

| Module or component | Responsibility |
| --- | --- |
| `src/rooms.ts` | (write here) |
| `src/booking.ts` | (write here) |
| `src/filter.ts` | (write here) |
| (write here) | (write here) |

### 5.2 Design decisions

<!-- At least two. The alternative is what you could have done instead (often what the assistant
     proposed). The why names an AC, an F-rule, a test or a risk from 3.1. -->

| Decision | Alternative I did not take | Why |
| --- | --- | --- |
| (write here) | (write here) | (write here) |
| (write here) | (write here) | (write here) |

### 5.3 Duplication removed

<!-- One row per duplicated location that is gone. Count what you can point at, nothing else. -->

| Before (file / function, what was repeated) | After (where it lives now) |
| --- | --- |
| (write here) | (write here) |

## 6. Automated tests (Task 4)

### 6.1 Test plan

<!-- One row per required ID. A test may carry several IDs in its title,
     e.g. test('T06 B1 AC2: exactly 120 minutes is available', …) covers B1 and AC2. -->

| ID | Test title (as in the file) | Input → expected |
| --- | --- | --- |
| AC1 | (write here) | (write here) |
| AC2 | (write here) | (write here) |
| AC3 | (write here) | (write here) |
| AC4 | (write here) | (write here) |
| AC5 | (write here) | (write here) |
| F1 | (write here) | (write here) |
| F2 | (write here) | (write here) |
| F3 | (write here) | (write here) |
| F4 | (write here) | (write here) |
| F5 | (write here) | (write here) |
| B1 | (write here) | (write here) |
| B2 | (write here) | (write here) |
| B3 | (write here) | (write here) |
| B4 | (write here) | (write here) |
| B5 | (write here) | (write here) |
| B6 | (write here) | (write here) |
| INT | (write here) | (write here) |

### 6.2 Commands

<!-- The commands exactly as you typed them, from app/. -->

```text
(paste here)
```

### 6.3 Final run

<!-- The REAL output of the full run on your final code. Every test passes, and the number of
     tests equals what your test files hold (R2). -->

```text
(paste here)
```

## 7. Quality evaluation (Task 5)

<!-- Original = your baseline commit. Final = what you submit. "How I obtained it" says how you
     measured, so someone else could repeat it: "1.1 and 6.3 runs", "counted in 5.3",
     "git ls-files app/src". Do not invent a metric. Tests: write passed/total, e.g. 19/19. -->

| Measure | Original | Final | How I obtained it |
| --- | --- | --- | --- |
| Automated tests passed / total | (write here) | (write here) | (write here) |
| Duplicated logic locations removed | (write here) | (write here) | (write here) |
| Code structure: modules and their responsibilities | (write here) | (write here) | (write here) |
| Remaining limitation | (write here) | (write here) | (write here) |

## 8. AI evidence appendix

<!-- At least three exchanges, one ### 8.N block each: the analysis (Task 1), the plan, and at
     least one implementation, refactoring or test exchange. Copy the block for more.
     The prompt as you sent it; the output may be cut to the part you used, with "[…]" where
     you cut. Verified by: the test, run, file or check that confirmed it — not "it looked right". -->

### 8.1 Exchange 1

**Tool and model:** ChatGPT / GPT Astra-6 (as recorded in §1)
**Date:** 2026-11-18
**Purpose:** A1 — request potential maintainability risks and an incremental plan before source edits.

**Prompt:**

```text
I am evolving an existing Smart Campus room availability checker. Repository map:\
\- src/App.tsx currently combines fictional room data, time parsing, selected room state, UI and availability decisions.\
\- src/main.tsx mounts the React application.\
\- src/index.css contains layout styles.\
\- package.json defines Vite and Vitest scripts.\
\
Preserve the exact old rules:\
AC1 0 <= start < end <= 1440 and start strictly after supplied now.\
AC2 The maximum duration is 120 minutes, including exactly 120.\
AC3 Blocked rooms are never Available.\
AC4 Reject actual overlap but permit intervals that only touch endpoints.\
AC5 A check returns Available or Unavailable without modifying bookings.\
AC6 Validation messages and layout must be understandable on desktop and mobile.\
New F1 capacity >= attendees; F2 room must contain ALL selected equipment;\
F3 blocked room never available; F4 show a clear empty state on zero matches;\
F5 changing the room updates the decision based on the chosen room's own bookings.\
\
Four or more fictional rooms, each with id, name, capacity, equipment, blocked and bookings.\
No login, payment, live API, backend, database, persistence or unrelated features.\
\
Identify at least three maintainability risks in these specific files, say what code evidence would verify each, and propose a short incremental improvement plan. Do not generate or rewrite source code yet.
```

**Output used:**

```text
The following risks are based on the repository map provided. They are **potential risks, not confirmed defects**, because the actual source files have not been inspected.
[…]
R2: Duplicated or inconsistent validation
[…]
R3: Incorrect room-specific decisions
[…]
Introduce a testable function in `src/utils/availability.ts` that evaluates time validity, blocked status, booking conflicts, capacity, and required equipment.
[…]
Existing tests should be preserved rather than moved unnecessarily.
```

**Problems found:** The sent map said room data and time parsing were in `App.tsx`. The baseline actually stores rooms in `data/rooms.ts`, time helpers in `lib/time.ts`, and booking rules in `booking.ts`; the answer explicitly treated its risks as unconfirmed.
**Changes made:** Recorded three confirmed risks in §3.1 and adapted the proposed plan to the existing modules in §3.2. No source code was changed in this exchange.
**Verified by:** Read baseline `App.tsx`, `booking.ts`, `data/rooms.ts`, `types.ts`, `lib/time.ts` and `lib/checkAvailability.ts`; the baseline Vitest run in §1.1 passed 23/23 tests.

### 8.2 Exchange 2

**Tool and model:** ChatGPT / GPT Astra-6 (as recorded in §1)
**Date:** 2026-11-18
**Purpose:** A2 — review the located risks, prioritize small edits and identify AC/F regression risks.

**Prompt:**

```text
Review the following maintainability risks and suggest a prioritized sequence of small source edits, with one test or observable check after each step. Do not rewrite App.tsx or add features. In particular, retain AC4 touching endpoints, AC5 read-only behavior and F2 requiring ALL equipment items. Tell me which suggested steps might violate the fixed requirements.\
   \
   My located risks:\
   1\) App.tsx: room catalog lacks capacity/equipment fields.\
   2\) App.tsx/check(): time and booking rules are mixed with UI event handling.\
   3\) App.tsx: a global blocked checkbox is detached from each room's blocked status.\
   4\) App.tsx room selection can leave a stale availability decision.
```

**Output used:**

```text
The sequence below is based on the reported code structure. The exact implementation should be confirmed against `App.tsx` before editing.
[…]
Add `capacity` and `equipment` properties to each existing room object, without changing its bookings or identifiers.
[…]
Extract existing time and booking checks into a pure function. Keep `check()` as the UI event handler.
[…]
Make availability use the selected room's `blocked` property instead of the independent checkbox.
[…]
Invalidate the previous availability decision whenever the selected room changes.
[…]
Using `some()` instead would violate F2 by accepting a room that contains only one of several requested items.
[…]
The room-selection edit also requires careful attention to F5.
```

**Problems found:** A2's risk list did not match the baseline: capacity is already present, there is no global blocked checkbox or `check()` handler, and `App.tsx` already calls `clearResult()` when room selection changes. The answer relied on that inaccurate list and did not inspect the files.
**Changes made:** Revised §3.2 to keep the existing modules and include a check after each step; rejected the proposed checkbox replacement in §3.3. No source code was changed in this exchange.
**Verified by:** `types.ts` and `data/rooms.ts` have capacity but no equipment; `App.tsx` passes `room.blocked` and `room.bookings` to `canBook()` and calls `clearResult()` on selection; `booking.ts` uses strict overlap checks. The §1.1 baseline run passed 23/23 tests.

### 8.3 Exchange 3

**Tool and model:** (write here)
**Date:** (write here)
**Purpose:** (write here)

**Prompt:**

```text
(paste here)
```

**Output used:**

```text
(paste here)
```

**Problems found:** (write here)
**Changes made:** (write here)
**Verified by:** (write here)

## 9. Checker results and known fails

<!-- Every check still FAIL or ERROR in your last run of python tests/check_sis.py, and why.
     The same IDs go in submission.yml known_fails. None left? Write: none. -->

| Check | Why it still fails |
| --- | --- |
| (write here) | (write here) |

## 10. AI reflection (Task 6)

<!-- 200–300 words, your own words, no assistant. Answer all five:
     What context did you provide the AI assistant? Which generated suggestions were useful or
     incorrect? What did you personally verify? How did tests influence your engineering
     decisions? What would you improve next? -->

(write here)
