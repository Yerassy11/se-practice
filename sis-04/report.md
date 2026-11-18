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
| A2: "Make availability use the selected room's `blocked` property instead of the independent checkbox." | Rejected | The baseline `App.tsx` already passes `room.blocked` and `room.bookings` to `canBook()`; `data/rooms.ts` stores `blocked` per room. There is no global blocked checkbox to replace. AC3/F3 still need a test for the selected room. |

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
| `evidence/filter-match.png` | Attendees 10; projector and whiteboard required. Only Engineering Hall A and Seminar Room 204 are shown. Engineering Hall A is selected; Current 09:00, Start 10:00, End 11:00; result Available. |
| `evidence/filter-empty.png` | Attendees 140; projector and whiteboard required. No room matches; the page says “No rooms match these requirements” and prompts the user to adjust the requirements. No room or result is displayed. |
| `evidence/switch-a.png` | Attendees 10; no equipment required. All five rooms are shown; Engineering Hall A is selected. Current 09:00, Start 10:00, End 11:00; result Available because its 09:00–10:00 booking only touches the requested start. |
| `evidence/switch-b.png` | Attendees 10; projector required. Engineering Hall A, Newton Auditorium and Seminar Room 204 are shown; Newton Auditorium is selected. Current 09:00, Start 10:00, End 11:00; result Unavailable because its 10:00–12:00 booking overlaps the request. The times match `switch-a.png` but the selected room and result differ. |
| `evidence/narrow.png` | Portrait mobile layout: Attendees 10, no equipment selected, all five room cards stacked above the check form. Engineering Hall A is selected; Current 09:00, Start 11:00, End 12:00; result Available. |

## 5. Refactoring (Task 3)

<!-- The diagrams are diagrams/before.puml and diagrams/after.puml (README section 8). -->

### 5.1 Module responsibilities after

| Module or component | Responsibility |
| --- | --- |
| `app/src/rooms.ts` | Defines the `Room` type and five fictional rooms with capacity, equipment, blocked status and separate bookings. |
| `app/src/booking.ts` | Preserves `canBook()` for AC1–AC5; `checkRoom()` finds a room by ID and delegates its blocked status and bookings to `canBook()`. |
| `app/src/filter.ts` | Pure F1/F2 filtering: capacity at least attendees and every required equipment item present. |
| `app/project/src/App.tsx` | Holds filter, selection, time and result state; imports the catalog, filter and booking functions and coordinates the UI. |
| `app/project/src/components/RoomCard.tsx` | Renders one selectable room card and its capacity, equipment and blocked label. |

### 5.2 Design decisions

<!-- At least two. The alternative is what you could have done instead (often what the assistant
     proposed). The why names an AC, an F-rule, a test or a risk from 3.1. -->

| Decision | Alternative I did not take | Why |
| --- | --- | --- |
| Keep blocked rooms in the filtered list with a visible Blocked label. | Hide blocked rooms from the list. | F1/F2 describe matching by capacity and equipment; F3/AC3 require that a blocked room is never Available. `checkRoom()` enforces that rule even when the room remains visible. |
| Clear the old result when the selected room changes; the next check uses the new room's ID and bookings. | Reuse the displayed decision from the previously selected room. | F5 requires room-specific results. `App.tsx` clears the old result on selection, and `checkRoom()` reads the newly selected room's bookings; the F5 test checks different outcomes for the same interval. |

### 5.3 Duplication removed

<!-- One row per duplicated location that is gone. Count what you can point at, nothing else. -->

| Before (file / function, what was repeated) | After (where it lives now) |
| --- | --- |
| During the UI migration, the unused `app/project/src/lib/checkAvailability.ts` still mapped booking issues into result messages while `App.tsx` mapped the same issue kinds into result messages. | Removed the unused legacy helper; `App.tsx` now owns the visible result messages, while `app/src/booking.ts` owns the booking rules. |

## 6. Automated tests (Task 4)

### 6.1 Test plan

<!-- One row per required ID. A test may carry several IDs in its title,
     e.g. test('T06 B1 AC2: exactly 120 minutes is available', …) covers B1 and AC2. -->

| ID | Test title (as in the file) | Input → expected |
| --- | --- | --- |
| AC1 | `AC1: rejects a start equal to now` | Start 540, now 540 → false. |
| AC2 | `AC2 B1: accepts exactly 120 minutes` | 720–840 → true. |
| AC3 | `AC3 F3: a blocked selected room is unavailable` | Select blocked room for a free interval → false. |
| AC4 | `AC4 B3: touching an existing booking is available` | Existing 600–660, request 660–720 → true. |
| AC5 | `AC5: checking does not modify room bookings` | Check a room, then compare its catalog with a clone → unchanged. |
| F1 | `F1 B5: includes a room whose capacity equals attendees` | Eight attendees and capacity eight → included. |
| F2 | `F2: requires every selected equipment item` | Projector plus whiteboard required → only the room with both is included. |
| F3 | `AC3 F3: a blocked selected room is unavailable` | Select blocked room → false. |
| F4 | `F4: returns no rooms when requirements have no match` | 21 attendees plus projector against the fixed catalog → empty list. |
| F5 | `F5: different selected rooms use their own bookings` | Same 660–720 request, free room → true; busy room → false. |
| B1 | `AC2 B1: accepts exactly 120 minutes` | 720–840 → true. |
| B2 | `AC2 B2: rejects 121 minutes` | 720–841 → false. |
| B3 | `AC4 B3: touching an existing booking is available` | Existing ends at requested start → true. |
| B4 | `AC4 B4: overlapping an existing booking is unavailable` | Request 630–690 overlaps 600–660 → false. |
| B5 | `F1 B5: includes a room whose capacity equals attendees` | Capacity eight, attendees eight → included. |
| B6 | `F1 B6: excludes a room with capacity one below attendees` | Capacity seven, attendees eight → excluded. |
| INT | `INT F1 F2 F5: filters rooms then checks the selected room` | Filter for eight attendees with projector and whiteboard, then check free vs blocked room → true vs false. |

### 6.2 Commands

<!-- The commands exactly as you typed them, from app/. -->

```text
PS C:\Users\Acer\Desktop\SE\sis-04\app> npx vitest run
PS C:\Users\Acer\Desktop\SE\sis-04\app\project> npx vitest run
```

### 6.3 Final run

<!-- The REAL output of the full run on your final code. Every test passes, and the number of
     tests equals what your test files hold (R2). -->

Additional run from `app/project` supplied by the student. It discovers only the 23 Week 08 tests:

```text
PS C:\Users\Acer\Desktop\SE\sis-04\app\project> npx vitest run

 RUN  v3.2.4 C:/Users/Acer/Desktop/SE/sis-04/app/project

 ✓ src/booking.test.ts (23 tests) 5ms
   ✓ BUG-A: allows a 30-minute request touching two bookings at both endpoints (AC4) 1ms
   ✓ BUG-B: an available non-touching request leaves booking data unchanged (AC5) 1ms
   ✓ canBook — AC1: valid interval and future start > AC1: rejects a start before minute zero independently of the current time 0ms
   ✓ canBook — AC1: valid interval and future start > AC1: accepts a request starting one minute afternow 0ms
   ✓ canBook — AC1: valid interval and future start > AC1: accepts a one-minute interval 0ms
   ✓ canBook — AC1: valid interval and future start > T02: rejects a request that starts exactly now 0ms
   ✓ canBook — AC1: valid interval and future start > T03: rejects zero-duration interval 0ms
   ✓ canBook — AC1: valid interval and future start > T04: rejects reversed interval 0ms
   ✓ canBook — AC1: valid interval and future start > T05: rejects an end time after minute 1440 0ms
   ✓ canBook — AC1: valid interval and future start > X1: accepts an interval ending exactly at minute1440 0ms
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
   ✓ canBook — AC5: Boolean result and no input mutation > AC5: leaves booking data unchanged when therequest is rejected 0ms

 Test Files  1 passed (1)
      Tests  23 passed (23)
   Start at  12:02:02
   Duration  609ms (transform 60ms, setup 0ms, collect 65ms, tests 5ms, environment 0ms, prepare 182ms)
```

Final run from `app`, which discovers all three test files:

```text
PS C:\Users\Acer\Desktop\SE\sis-04\app> npx vitest run

 RUN  v3.2.4 C:/Users/Acer/Desktop/SE/sis-04/app

 ✓ src/filter.test.ts (5 tests) 5ms
 ✓ src/booking.test.ts (11 tests) 6ms
 ✓ project/src/booking.test.ts (23 tests) 8ms

 Test Files  3 passed (3)
      Tests  39 passed (39)
   Start at  12:14:32
   Duration  702ms (transform 198ms, setup 0ms, collect 275ms, tests 20ms, environment 1ms, prepare 588ms)
```

## 7. Quality evaluation (Task 5)

<!-- Original = your baseline commit. Final = what you submit. "How I obtained it" says how you
     measured, so someone else could repeat it: "1.1 and 6.3 runs", "counted in 5.3",
     "git ls-files app/src". Do not invent a metric. Tests: write passed/total, e.g. 19/19. -->

| Measure | Original | Final | How I obtained it |
| --- | --- | --- | --- |
| Automated tests passed / total | 23/23 | 39/39 | Read the `Tests` lines in the actual runs in §1.1 and §6.3. |
| Duplicated logic locations removed | 0 | 1 | Counted the one removed message-mapping location in §5.3: the unused legacy `lib/checkAvailability.ts` was deleted after the UI migration. |
| Code structure: modules and their responsibilities | `data/rooms.ts` holds sample data; `booking.ts` holds checks; `lib/checkAvailability.ts` formats decisions; `App.tsx` coordinates UI; no filter module. | `app/src/rooms.ts` holds the five-room catalog; `filter.ts` handles F1/F2; `booking.ts` holds `canBook()` and `checkRoom()`; `App.tsx` coordinates UI and `RoomCard.tsx` renders room choices. | Compared the source tree at baseline commit `d977fbe` with the current `app/src` and `app/project/src` files; responsibilities are listed in §5.1. |
| Remaining limitation | `getBookingIssue()` and `canBook()` check the same booking rules separately. | Those two functions still perform parallel rule checks, and `App.tsx` calls both `checkRoom()` and `getBookingIssue()` to obtain a Boolean result and a detailed message. | Read the two functions in baseline and current `booking.ts` and the calls in current `App.tsx`. |

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

**Tool and model:** ChatGPT / GPT Astra-6 (as recorded in §1)
**Date:** 2026-11-18
**Purpose:** A3 — review the implemented filter and room-specific booking checks against F1–F5 and AC1–AC5.

**Prompt:**

```text
Review ONLY my implementation of filterRooms and checkRoom against F1–F5 and AC1–AC5. Do not rewrite the whole application. Tell me whether equipment filtering uses ALL selected items, capacity includes equality, blocked rooms cannot be Available, and checkRoom uses only the selected room's bookings. Identify any defect with an exact code condition and propose the smallest patch or targeted test. Do not add backend, storage, booking confirmation or unrelated features.\
\
I will paste my actual src/filter.ts, src/booking.ts and two relevant test cases below:\
src.booking.ts:"import type { Room } from "./rooms";\
\
export type Booking = { start: number; end: number };\
\
type BookingInput = {\
  start: number;\
  end: number;\
  now: number;\
  blocked: boolean;\
  bookings: readonly Booking[];\
};\
\
type BookingIssue =\
  | { kind: "interval" | "past" | "duration" | "blocked" }\
  | { kind: "overlap"; conflict: Booking };\
\
// Shared by the boolean API and the UI's detailed error messages.\
// These checks retain the Week 06 order and conditions.\
export function getBookingIssue({\
  start, end, now, blocked, bookings,\
}: BookingInput): BookingIssue | null {\
  if (\
    !Number.isFinite(start) ||\
    !Number.isFinite(end) ||\
    !(start >= 0 && end <= 1440 && start < end)\
  ) {\
    return { kind: "interval" };\
  }\
  if (!(start > now)) return { kind: "past" };\
  if (end - start > 120) return { kind: "duration" };\
  if (blocked) return { kind: "blocked" };\
\
  const conflict = bookings.find((b) => start < b.end && end > b.start);\
  if (conflict) return { kind: "overlap", conflict };\
  return null;\
}\
\
export function canBook({ start, end, now, blocked, bookings }: {\
  start: number;\
  end: number;\
  now: number;\
  blocked: boolean;\
  bookings: { start: number; end: number }[];\
}): boolean {\
  return getBookingIssue({ start, end, now, blocked, bookings }) === null;\
}\
\
export function checkRoom(\
  rooms: Room[],\
  roomId: string,\
  { start, end, now }: { start: number; end: number; now: number },\
): boolean {\
  const room = rooms.find((candidate) => candidate.id === roomId);\
  if (!room) return false;\
  return canBook({ start, end, now, blocked: room.blocked, bookings: room.bookings });\
}\
",filter.ts:"import type { Room } from "./rooms";\
\
export function filterRooms(\
  rooms: Room[],\
  { attendees, equipment }: { attendees: number; equipment: string[] },\
): Room[] {\
  return rooms.filter(\
    (room) =>\
      room.capacity >= attendees &&\
      equipment.every((item) => room.equipment.includes(item)),\
  );\
}\
"
```

**Output used:**

```text
**Verdict: The supplied implementation satisfies F1–F3, F5, and AC1–AC5 under the expected valid-input assumptions.** No confirmed defect exists in the four conditions you specifically asked about.
[…]
One limitation: F4 (clear empty state) cannot be fully verified because it depends on how `App.tsx` renders an empty result. Also, the two mentioned test cases were not included in your message.
[…]
room.capacity >= attendees
[…]
equipment.every((item) => room.equipment.includes(item))
[…]
**Correct.** The selected room's blocked property determines availability, not a detached global checkbox.
[…]
No unconditional defect is visible for the stated requirements. However, there are two input-validation edge cases worth checking.
[…]
`room.capacity >= attendees` can accept zero, negative, or fractional attendees
[…]
`start > now` rejects `NaN` but could accept `now = -Infinity`
[…]
Neither patch is required to fix an observed F1–F5 or AC1–AC5 failure with valid input values.
```

**Problems found:** The prompt promised two test cases but did not include them. The review could not verify F4 from `filter.ts` and `booking.ts` alone. Its attendee-count and non-finite-time concerns were conditional edge cases, not demonstrated failures of F1–F5 or AC1–AC5.
**Changes made:** Kept `>=`, `every()`, strict overlap comparisons and `checkRoom()` delegation unchanged after the review; recorded the actual review and its limits here. No source patch was accepted from this exchange.
**Verified by:** Read `app/src/filter.ts`, `app/src/booking.ts` and `app/project/src/App.tsx`; `App.tsx` renders “No rooms match these requirements” for an empty list, shown in `evidence/filter-empty.png`. The complete run in §6.3 passed 39/39 tests, including F1/F2/B5/B6 and F3/F5/AC1–AC5 cases.

## 9. Checker results and known fails

<!-- Every check still FAIL or ERROR in your last run of python tests/check_sis.py, and why.
     The same IDs go in submission.yml known_fails. None left? Write: none. -->

none

## 10. AI reflection (Task 6)

<!-- 200–300 words, your own words, no assistant. Answer all five:
     What context did you provide the AI assistant? Which generated suggestions were useful or
     incorrect? What did you personally verify? How did tests influence your engineering
     decisions? What would you improve next? -->

I gave the AI assistant a repository map, the existing AC1–AC6 rules, the new F1–F5 requirements, and the constraint that the application uses only fictional, in-memory data. My first map was inaccurate: it said room data and time parsing lived in `App.tsx`, although those responsibilities were already in separate Week 08 files. That mistake mattered because the assistant's first risks were based on the map, not on inspected source code.

The useful suggestions were to make small changes, retain the old tests, check capacity equality with `>=`, require all selected equipment with `every()`, and keep the selected room's bookings in the availability check. The suggestion to replace a global blocked checkbox was incorrect for my starting code: no such checkbox existed, and `App.tsx` already passed the selected room's `blocked` value. I rejected that edit rather than adding work that would not fix a real problem.

I checked the actual files before recording risks. I compared the Week 08 baseline with the current modules, ran the original 23 tests and the full 39-test suite, and inspected screenshots for filtering, the empty state, room switching, and the narrow layout. The tests influenced the order of implementation: I added F1/F2 boundary cases before writing the filter, kept touching-endpoint and blocked-room checks while adding `checkRoom()`, and reran the whole suite after each booking-rule change.

Next I would remove the remaining double evaluation in the UI, where `App.tsx` calls both `checkRoom()` and `getBookingIssue()` for one request. I would also make the root project layout consistent so one package script runs tests, build, and development from the same directory.
