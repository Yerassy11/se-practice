# Week 07 — Lab report

**Name:** Khudaibergen Yerassyl
**Group:** Monday 16L00-19:00
**Date:** 2026-11-01


Fill in every section. **Do not delete, rename or renumber the headings.** The checker and the
grader find your answers by them. You can add rows to any table, but never remove its header.

---

## 1. Setup

| | |
| --- | --- |
| Project I continue (`week-06` = my Week 06 Bolt project, `starter` = the provided starter) | week-06 |
| Bolt project link (or `not shared`, and why) | not shared — no share URL was recorded for this local export. |
| Assistant that generated the tests (tool) | ChatGPT, as declared in `AI_USAGE.md`; Codex performed the documented review and checker fixes. |
| Exact model (with its version, or `not displayed`) | GPT 5.6 Sol, as declared in `AI_USAGE.md` for the original generation. |
| Where I ran the tests (Bolt terminal / my computer / Codespace) | My computer, PowerShell, `C:/Users/Acer/Desktop/SE/week-07/app`. |
| Vitest version (the `RUN  v…` line of a run) | 3.2.4 |
| Test command | `npx vitest run --reporter=verbose` |

---

## 2. Task 1 — baseline and the booking function

**Before editing:** where did the booking decision live in the project you started from?

| | |
| --- | --- |
| File and function (or "inside the page component") | `checkAvailability(input: CheckInput): CheckResult` in `week-07/app/project/src/lib/checkAvailability.ts`. Week 06 already had this separate function in `week-06/prototype/project/src/lib/checkAvailability.ts` , it was copied unchanged, not extracted from the page component in Week 07. |
| Its inputs | One `CheckInput` object: `room: Room` (the decision uses `room.blocked` and `room.bookings`, with each booking's `start` and `end`), `currentTimeMin`, `startMin`, and `endMin`. All three time values are numbers in minutes from midnight. |
| What it returned | A `CheckResult` object with `decision` (`"available"`, `"unavailable"`, or `"invalid"`), a `reason` string, and an optional `conflict: Booking` when an existing booking overlaps. Invalid interval bounds/order, non-finite start/end, or a start at/before the current time produce `"invalid"`. Duration over 120 minutes, a blocked room, or overlap (`startMin < b.end && endMin > b.start`) produce `"unavailable"`; otherwise it returns `"available"`. Touching endpoints are allowed. The function does not modify bookings. |
| How the page used it | In `week-07/app/project/src/App.tsx`, `BookingForm` receives `onSubmit={handleSubmit}`. Submitting via "Check availability" calls `handleSubmit`, which converts the three time strings using `parseTime`, calls `checkAvailability({ room, currentTimeMin: current, startMin: start, endMin: end })`, then calls `setResult(res)` and `setSubmitted(true)`. `DecisionPanel` receives `result` and `submitted` and maps the decision to "Available", "Unavailable", or "Check your input", displaying the reason. This calling code also already existed in Week 06. |

**What I changed to extract `canBook`.** Say which file it now lives in, what you moved, and why
the behaviour did not change. Also say which file of the page now calls it. 40 words or more.

<!-- Write below this line -->

I added `week-07/app/project/src/booking.ts` beside `App.tsx`. Week 06 already had a separate `checkAvailability` function; I moved its existing decision rules into the shared `getBookingIssue` helper and exposed `canBook` as a boolean wrapper. I preserved the finite-number checks, validation order, 120-minute limit, blocked-room rejection, and strict overlap comparisons. The old `Room` input is adapted to `blocked` and `bookings`; `currentTimeMin`, `startMin`, and `endMin` become `now`, `start`, and `end`. Existing bookings already use numeric minutes and may retain their optional labels; the new `Booking` type only requires `start` and `end`, and the input array is readonly. No additional conversion or data mutation is needed. `App.tsx` still parses the form's time strings with `parseTime`, then calls `canBook` directly from `handleSubmit`. Its boolean controls the final availability decision, while the diagnostic adapter preserves the reason and distinguishes invalid input from an unavailable room. `checkAvailability` now uses the shared rules to preserve the original invalid/unavailable messages and conflict details. The form, result panel, and reset logic remain in place.

---

## 3. Task 2 — the test plan

Default fixture: `now = 540`, `blocked = false`, `bookings = [{ start: 600, end: 660 }]`, fresh
for every test. **The Expected column comes from AC1–AC4, never from the code.** Write the
**reason** for each expected result **before** you send the generation prompt.

| ID | Candidate / changed input | Expected | AC | Reason (in your words) |
| --- | --- | --- | --- | --- |
| T01 | 660–720 (touching after) | true | AC4 | The previous booking ends at 660, which is excluded from that interval; touching at 660 is allowed. |
| T02 | 540–570 (starts now) | false | AC1 | The request starts at minute 540, exactly equal to now, while AC1 requires a strictly later start. |
| T03 | 720–720 (zero duration) | false | AC1 | A candidate with equal start and end has no duration and violates start < end. |
| T04 | 750–720 (reversed) | false | AC1 | The proposed start 750 is later than end 720, so the interval is reversed. |
| T05 | 1380–1441 (past day end) | false | AC1 | Minute 1441 falls after the permitted end-of-day limit of 1440. |
| T06 | 720–840 (120 minutes) | true | AC2 | The candidate lasts exactly 120 minutes, which AC2 expressly allows. |
| T07 | 720–841 (121 minutes) | false | AC2 | The candidate lasts 121 minutes, one minute over the allowed maximum. |
| T08 | 570–600 (touching before) | true | AC4 | This request ends exactly where the existing booking begins, so it does not overlap. |
| T09 | 630–690 (partial overlap) | false | AC4 | The request starts inside the existing 600–660 interval and continues past its end. |
| T10 | 570–690 (contains booking) | false | AC4 | The request covers the entire existing 600–660 booking; an overlap is unavoidable. |
| T11 | 615–645 (inside booking) | false | AC4 | The request is entirely within the existing booking and shares actual occupied minutes. |
| T12 | 600–660 (identical interval) | false | AC4 | The requested interval equals an existing interval, producing complete overlap. |
| T13 | 660–720, blocked = true | false | AC3 | The room is blocked; AC3 denies an otherwise valid touching request. |
| T14 | 630–690, bookings = [] | true | AC4 | There are no existing bookings, so no interval can overlap the proposed request. |
| AC5 | an Available request — the bookings after the call equal the bookings before | true, data unchanged | AC5 | For a valid available request the function must return true and preserve the original bookings array without any mutation. |
| X1 | 1380–1440 (ends at midnight, 60 min) | true | AC1 | End equals the permitted boundary of 1440, and duration is within the limit. |
| X2 | 660–720, bookings = [{start:600,end:660},{start:720,end:780}] | true | AC4 | The new interval touches the earlier booking at its end and the later booking at its start; neither is overlap. |

X1 and X2 are **your own two cases**: a boundary or a state that T01–T14 do not reach. Fill all
five columns.

---

## 4. Task 3 — the generation prompt and the first suite

**The prompt exactly as I sent it.** Use the deck's prompt with `[our test framework]` replaced by
`Vitest`, followed by the case table from section 3:

```text
Generate tests for the existing booking function using Vitest. Use AC1–AC6 and the reviewed case table below.

Import the real function used by the page. Keep its code unchanged. Use fixed time and fresh fixtures. Assert exact decisions and unchanged booking data.

Return the test file, run command, and AC mapping. Flag unclear requirements. We will run the tests ourselves.| ID | Candidate / changed input | Expected | AC | Reason (in your words) |
| --- | --- | --- | --- | --- |
| T01 | 660–720 (touching after) | true | AC4 | The previous booking ends at 660, which is excluded from that interval; touching at 660 is allowed. |
| T02 | 540–570 (starts now) | false | AC1 | The request starts at minute 540, exactly equal to now, while AC1 requires a strictly later start. |
| T03 | 720–720 (zero duration) | false | AC1 | A candidate with equal start and end has no duration and violates start < end. |
| T04 | 750–720 (reversed) | false | AC1 | The proposed start 750 is later than end 720, so the interval is reversed. |
| T05 | 1380–1441 (past day end) | false | AC1 | Minute 1441 falls after the permitted end-of-day limit of 1440. |
| T06 | 720–840 (120 minutes) | true | AC2 | The candidate lasts exactly 120 minutes, which AC2 expressly allows. |
| T07 | 720–841 (121 minutes) | false | AC2 | The candidate lasts 121 minutes, one minute over the allowed maximum. |
| T08 | 570–600 (touching before) | true | AC4 | This request ends exactly where the existing booking begins, so it does not overlap. |
| T09 | 630–690 (partial overlap) | false | AC4 | The request starts inside the existing 600–660 interval and continues past its end. |
| T10 | 570–690 (contains booking) | false | AC4 | The request covers the entire existing 600–660 booking; an overlap is unavoidable. |
| T11 | 615–645 (inside booking) | false | AC4 | The request is entirely within the existing booking and shares actual occupied minutes. |
| T12 | 600–660 (identical interval) | false | AC4 | The requested interval equals an existing interval, producing complete overlap. |
| T13 | 660–720, blocked = true | false | AC3 | The room is blocked; AC3 denies an otherwise valid touching request. |
| T14 | 630–690, bookings = [] | true | AC4 | There are no existing bookings, so no interval can overlap the proposed request. |
| AC5 | an Available request — the bookings after the call equal the bookings before | true, data unchanged | AC5 | For a valid available request the function must return true and preserve the original bookings array without any mutation. |
| X1 | 1380–1440 (ends at midnight, 60 min) | true | AC1 | End equals the permitted boundary of 1440, and duration is within the limit. |
| X2 | 660–720, bookings = [{start:600,end:660},{start:720,end:780}] | true | AC4 | The new interval touches the earlier booking at its end and the later booking at its start; neither is overlap. |  booking.ts:"export type Booking = { start: number; end: number };

type BookingInput = {
  start: number;
  end: number;
  now: number;
  blocked: boolean;
  bookings: readonly Booking[];
};

type BookingIssue =
  | { kind: "interval" | "past" | "duration" | "blocked" }
  | { kind: "overlap"; conflict: Booking };

// Shared by the boolean API and the UI's detailed error messages.
// These checks retain the Week 06 order and conditions.
export function getBookingIssue({
  start, end, now, blocked, bookings,
}: BookingInput): BookingIssue | null {
  if (
    !Number.isFinite(start) ||
    !Number.isFinite(end) ||
    !(start >= 0 && end <= 1440 && start < end)
  ) {
    return { kind: "interval" };
  }
  if (start <= now) return { kind: "past" };
  if (end - start > 120) return { kind: "duration" };
  if (blocked) return { kind: "blocked" };

  const conflict = bookings.find((b) => start < b.end && end > b.start);
  if (conflict) return { kind: "overlap", conflict };
  return null;
}

export function canBook({
  start, end, now, blocked, bookings,
}: BookingInput): boolean {
  return getBookingIssue({ start, end, now, blocked, bookings }) === null;
}
"
```

**The assistant's answer: run command, AC mapping and any unclear requirements it flagged,
pasted unedited.** Its test file goes to `suites/first/` and is not pasted here:

```text
Below is a Vitest unit-test file that keeps `booking.ts` unchanged and tests the exported `canBook` function directly.

Assuming the test file is placed next to `booking.ts`, for example:

```text
src/
├── booking.ts
└── booking.test.ts
```

### `booking.test.ts`

```ts
import { describe, expect, it } from "vitest";
import { canBook, type Booking } from "./booking";

const NOW = 540;

/**
 * Creates a fresh bookings fixture for every test.
 * The default existing booking is 600–660.
 */
function makeBookings(): Booking[] {
  return [{ start: 600, end: 660 }];
}

describe("canBook — AC1: valid interval and future start", () => {
  it("T02: rejects a request that starts exactly now", () => {
    const bookings = makeBookings();

    expect(
      canBook({
        start: 540,
        end: 570,
        now: NOW,
        blocked: false,
        bookings,
      }),
    ).toBe(false);
  });

  it("T03: rejects zero-duration interval", () => {
    const bookings = makeBookings();

    expect(
      canBook({
        start: 720,
        end: 720,
        now: NOW,
        blocked: false,
        bookings,
      }),
    ).toBe(false);
  });

  it("T04: rejects reversed interval", () => {
    const bookings = makeBookings();

    expect(
      canBook({
        start: 750,
        end: 720,
        now: NOW,
        blocked: false,
        bookings,
      }),
    ).toBe(false);
  });

  it("T05: rejects an end time after minute 1440", () => {
    const bookings = makeBookings();

    expect(
      canBook({
        start: 1380,
        end: 1441,
        now: NOW,
        blocked: false,
        bookings,
      }),
    ).toBe(false);
  });

  it("X1: accepts an interval ending exactly at minute 1440", () => {
    const bookings = makeBookings();

    expect(
      canBook({
        start: 1380,
        end: 1440,
        now: NOW,
        blocked: false,
        bookings,
      }),
    ).toBe(true);
  });
});

describe("canBook — AC2: maximum duration is 120 minutes", () => {
  it("T06: accepts exactly 120 minutes", () => {
    const bookings = makeBookings();

    expect(
      canBook({
        start: 720,
        end: 840,
        now: NOW,
        blocked: false,
        bookings,
      }),
    ).toBe(true);
  });

  it("T07: rejects 121 minutes", () => {
    const bookings = makeBookings();

    expect(
      canBook({
        start: 720,
        end: 841,
        now: NOW,
        blocked: false,
        bookings,
      }),
    ).toBe(false);
  });
});

describe("canBook — AC3: blocked rooms", () => {
  it("T13: rejects an otherwise available request when room is blocked", () => {
    const bookings = makeBookings();

    expect(
      canBook({
        start: 660,
        end: 720,
        now: NOW,
        blocked: true,
        bookings,
      }),
    ).toBe(false);
  });
});

describe("canBook — AC4: overlap detection", () => {
  it("T01: accepts touching after an existing booking", () => {
    const bookings = makeBookings();

    expect(
      canBook({
        start: 660,
        end: 720,
        now: NOW,
        blocked: false,
        bookings,
      }),
    ).toBe(true);
  });

  it("T08: accepts touching before an existing booking", () => {
    const bookings = makeBookings();

    expect(
      canBook({
        start: 570,
        end: 600,
        now: NOW,
        blocked: false,
        bookings,
      }),
    ).toBe(true);
  });

  it("T09: rejects partial overlap", () => {
    const bookings = makeBookings();

    expect(
      canBook({
        start: 630,
        end: 690,
        now: NOW,
        blocked: false,
        bookings,
      }),
    ).toBe(false);
  });

  it("T10: rejects a request containing an existing booking", () => {
    const bookings = makeBookings();

    expect(
      canBook({
        start: 570,
        end: 690,
        now: NOW,
        blocked: false,
        bookings,
      }),
    ).toBe(false);
  });

  it("T11: rejects a request fully inside an existing booking", () => {
    const bookings = makeBookings();

    expect(
      canBook({
        start: 615,
        end: 645,
        now: NOW,
        blocked: false,
        bookings,
      }),
    ).toBe(false);
  });

  it("T12: rejects an interval identical to an existing booking", () => {
    const bookings = makeBookings();

    expect(
      canBook({
        start: 600,
        end: 660,
        now: NOW,
        blocked: false,
        bookings,
      }),
    ).toBe(false);
  });

  it("T14: accepts the request when there are no existing bookings", () => {
    const bookings: Booking[] = [];

    expect(
      canBook({
        start: 630,
        end: 690,
        now: NOW,
        blocked: false,
        bookings,
      }),
    ).toBe(true);
  });

  it("X2: accepts an interval touching two bookings at both endpoints", () => {
    const bookings: Booking[] = [
      { start: 600, end: 660 },
      { start: 720, end: 780 },
    ];

    expect(
      canBook({
        start: 660,
        end: 720,
        now: NOW,
        blocked: false,
        bookings,
      }),
    ).toBe(true);
  });
});

describe("canBook — AC5: Boolean result and no input mutation", () => {
  it("returns true and leaves booking data unchanged for an available request", () => {
    const bookings: Booking[] = [
      { start: 600, end: 660 },
      { start: 800, end: 850 },
    ];

    const before = structuredClone(bookings);

    const result = canBook({
      start: 660,
      end: 720,
      now: NOW,
      blocked: false,
      bookings,
    });

    expect(result).toBe(true);
    expect(typeof result).toBe("boolean");
    expect(bookings).toEqual(before);
  });

  it("leaves booking data unchanged when the request is rejected", () => {
    const bookings: Booking[] = [
      { start: 600, end: 660 },
      { start: 800, end: 850 },
    ];

    const before = structuredClone(bookings);

    const result = canBook({
      start: 630,
      end: 690,
      now: NOW,
      blocked: false,
      bookings,
    });

    expect(result).toBe(false);
    expect(typeof result).toBe("boolean");
    expect(bookings).toEqual(before);
  });
});
```

Run it with:

```bash
npx vitest run
```

Or only this file:

```bash
npx vitest run src/booking.test.ts
```

If Vitest is not installed yet:

```bash
npm install -D vitest
```

### AC mapping

| AC | Tests | What is verified |
|---|---|---|
| **AC1** | T02, T03, T04, T05, X1 | `start > now`, `start < end`, day boundary `end <= 1440` |
| **AC2** | T06, T07 | 120 minutes accepted; 121 rejected |
| **AC3** | T13 | Blocked room is rejected |
| **AC4** | T01, T08–T12, T14, X2 | Overlap logic and allowed endpoint touching |
| **AC5** | AC5 tests | Boolean result and bookings remain unchanged |
| **AC6** | Not covered by this unit file | UI validation feedback and mobile layout |

There is one important unclear point: **AC6 cannot be properly tested through `canBook()`**. `canBook()` only returns a Boolean. AC6 concerns the separate page's validation feedback and responsive/mobile layout, so it requires a component/browser test against the actual Bolt page rather than a unit test of `booking.ts`.

Also, your implementation checks `Number.isFinite(start)` and `Number.isFinite(end)`, but the stated AC1 says **integer minutes**. It does **not** currently reject fractional values such as `660.5`. If “integer minutes” is a fixed requirement, that is a requirement/implementation mismatch worth flagging rather than silently changing the existing function.

Finally, if `booking.test.ts` is not next to `booking.ts`, change only this import:

```ts
import { canBook, type Booking } from "./booking";
```

to the actual path used by your project. The production `booking.ts` itself does not need to be modified.
```

The first suite was saved to `suites/first/` **before** I changed anything in it: yes 

---

## 5. Task 4 — review of the first suite

Review it **before** you run it. Look at the imports, the expected values, isolation, duplicates
and skipped tests. Make one row per decision. At least **two** rows, and each one names the kind of
weakness (the deck's table: *no exception occurred* · *expected = current output* · *only valid
requests* · *mocked booking function*, or your own) and the AC that decides it.

| # | Test or part of the suite | What is weak or wrong | Decision: accept / revise / reject | AC or reason |
| --- | --- | --- | --- | --- |
| 1 | Import of `canBook` | Checked for a mocked booking function or wrong module. The current import `../../../project/src/booking` resolves to the real application module from `app/src/suites/first/booking.test.ts`; `./booking` would point to a nonexistent sibling. There is no `vi.mock`. | accept | AC1–AC5 must exercise the actual booking rules. |
| 2 | Boolean assertions in all 18 tests | Checked for "no exception occurred" and "expected = current output" weaknesses. Every test asserts a literal `.toBe(true)` or `.toBe(false)`; expected values are not computed by calling the implementation. | accept | AC1–AC4 define acceptance/rejection; AC5 checks the Boolean result and unchanged data. |
| 3 | T02–T07, T13 and X1 | Checked for "only valid requests" and missing boundary coverage. Tests reject starts at now, zero/reversed intervals, an end of 1441, a duration of 121, and blocked rooms; they accept exactly 120 minutes and an end of 1440. | accept | AC1: interval and future start; AC2: maximum 120 minutes; AC3: blocked rooms. |
| 4 | T01, T08–T12, T14 and X2 | Checked for incomplete overlap coverage. Touching before/after is accepted, partial overlap/containment/identical intervals are rejected, an empty schedule is accepted, and X2 checks touching two bookings. These are distinct cases rather than duplicate requests. | accept | AC4 allows touching endpoints and rejects overlapping intervals. |
| 5 | Time and fixture setup | Checked for time-dependent results and shared mutable fixtures. Every call uses fixed `NOW = 540`; there is no `Date.now()` or `new Date()`. Each test calls `makeBookings()` or creates its own array literal, including fresh booking objects. | accept | AC1 requires a controlled current time; AC4–AC5 require isolated booking data. |
| 6 | Both AC5 tests | Checked for mutation assertions that only compare an object with itself. Each test saves a `structuredClone(bookings)` before the call and checks equality afterwards, for both an accepted and a rejected request. The extra `typeof` assertion is redundant but harmless. | accept | AC5: checking availability must not change bookings. |
| 7 | Suite structure and count | Checked for omitted or disabled cases. There are 18 explicit `it` tests: T01–T14, X1, X2, and two AC5 tests. No `.skip`, `.only`, or `test.each` occurs. | accept | AC1–AC5 coverage; the task requires at least 17 tests. |

This is a static review of `app/src/suites/first/booking.test.ts`; the suite was not run during this review. No test changes are required by these checks. AC6 still requires separate browser checks.

---

## 6. Task 5 — running, diagnosing, improving

### 6.1 The first run

The **real** terminal output of the first run of the first suite, pasted unedited. Include the
`RUN  v…` line and the `Tests` summary line. A build message or the assistant saying "tests pass"
is not a run.

```text
 RUN  v3.2.4 C:/Users/Acer/Desktop/SE/week-07/app

 ✓ src/suites/first/booking.test.ts (18 tests) 7ms
   ✓ canBook — AC1: valid interval and future start > T02: rejects a request that starts exactly now 2ms
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
   ✓ canBook — AC5: Boolean result and no input mutation > returns true and leaves booking data unchanged for an available request 1ms
   ✓ canBook — AC5: Boolean result and no input mutation > leaves booking data unchanged when the request is rejected 0ms

 Test Files  1 passed (1)
      Tests  18 passed (18)
   Start at  11:25:25
   Duration  1.19s (transform 166ms, setup 0ms, collect 195ms, tests 7ms, environment 0ms, prepare 473ms)
```

**Each failure, diagnosed** (the deck's table: import/runner error · assertion mismatch · result
changing per run · no tests discovered). Write `none` in the first row if nothing failed.

| Failing test | Observed failure | First check | Test repair or implementation fix? | Action taken |
| --- | --- | --- | --- | --- |
| none | No failures: 18 tests passed in 1 test file. | Checked the Vitest summary: `Test Files 1 passed (1)` and `Tests 18 passed (18)`. | Neither required for this run. | No failure-related changes made; proceed to review coverage and missing boundaries. |

### 6.2 The improvement prompt

The deck's improvement prompt exactly as sent, followed by the actual output from 6.1. Then
paste the assistant's answer, unedited:

```text
Review this test suite against AC1–AC6 and our case table. Identify incorrect expectations, weak assertions, duplicated cases, and missing boundaries.

For each proposed change, explain the requirement and the defect it could detect. Improve the tests without changing correct expectations to match buggy behavior.

Use the actual failure output below. Separate test repairs from implementation fixes.     RUN  v3.2.4 C:/Users/Acer/Desktop/SE/week-07/app

 ✓ src/suites/first/booking.test.ts (18 tests) 7ms
   ✓ canBook — AC1: valid interval and future start > T02: rejects a request that starts exactly now 2ms
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
   ✓ canBook — AC5: Boolean result and no input mutation > returns true and leaves booking data unchanged for an available request 1ms
   ✓ canBook — AC5: Boolean result and no input mutation > leaves booking data unchanged when the request is rejected 0ms

 Test Files  1 passed (1)
      Tests  18 passed (18)
   Start at  11:25:25
   Duration  1.19s (transform 166ms, setup 0ms, collect 195ms, tests 7ms, environment 0ms, prepare 473ms)  Что в текущих тестах правильно
Все ожидания из вашей case table сейчас выставлены корректно. Их не нужно менять ради того, чтобы тесты оставались зелёными.

Например:
660–720 touching after -> true
570–600 touching before -> true
720–840 exactly 120 -> true
720–841 121 minutes -> false
1380–1440 -> true
1380–1441 -> false

Это соответствует AC1–AC4.

Overlap condition в production-коде тоже соответствует таблице:
start < b.end && end > b.start

Именно строгие < / > позволяют touching endpoints.
1. Test repairs / improvements
A. Добавить нижнюю границу дня: start < 0
Requirement: AC1 требует:
0 <= start < end <= 1440

Сейчас проверяется только верхняя граница через T05/X1. Нижняя 0 вообще не тестируется.

Добавить:
it("AC1: rejects a start before minute 0", () => {
  const bookings = makeBookings();

  expect(
    canBook({
      start: -1,
      end: 60,
      now: -10,
      blocked: false,
      bookings,
    }),
  ).toBe(false);
});

Почему now: -10: иначе тест мог бы пройти из-за start <= now, а не из-за границы дня. Нам нужен изолированный тест именно start >= 0.

Какой дефект обнаружит: случайное удаление или изменение:
start >= 0

B. Добавить минимально допустимый момент после now
Сейчас есть:
T02 start = now -> false

Но нет второй стороны boundary:
start = now + 1 -> true

Добавить:
it("AC1: accepts a request starting one minute after now", () => {
  const bookings: Booking[] = [];

  expect(
    canBook({
      start: 541,
      end: 542,
      now: NOW,
      blocked: false,
      bookings,
    }),
  ).toBe(true);
});

Requirement:
start > now

Boundary testing должно проверять обе стороны:
540 -> false
541 -> true

Какой дефект обнаружит: неправильное условие вроде:
start <= now + 1

или другое off-by-one поведение.
C. Добавить минимальную допустимую длительность
T03 проверяет:
720–720 -> false

Но нет соседнего валидного значения:
720–721 -> true

Добавить:
it("AC1: accepts a one-minute interval", () => {
  const bookings: Booking[] = [];

  expect(
    canBook({
      start: 720,
      end: 721,
      now: NOW,
      blocked: false,
      bookings,
    }),
  ).toBe(true);
});

Какой дефект обнаружит: ошибочную минимальную длительность либо неправильное start < end.
D. Обязательно протестировать integer requirement
Это самый важный отсутствующий тест.

AC1 говорит:
integer minutes

Но текущий код проверяет только:
Number.isFinite(start)
Number.isFinite(end)

Поэтому:
start: 660.5
end: 720

сейчас может быть принят.
```

### 6.3 The final run

The **real** output of the final suite (`booking.test.*` beside your module), after every
change and after restoring the correct code from section 7. Every test must pass. If a real defect
is still open, leave its test failing and explain it in 9.1.

```text

 RUN  v3.2.4 C:/Users/Acer/Desktop/SE/week-07/app

 ✓ project/src/booking.test.ts > canBook — AC1: valid interval and future start > AC1: rejects a start before minute zero independently of the current time 4ms
 ✓ project/src/booking.test.ts > canBook — AC1: valid interval and future start > AC1: accepts a request starting one minute after now 1ms
 ✓ project/src/booking.test.ts > canBook — AC1: valid interval and future start > AC1: accepts a one-minute interval 1ms
 ✓ project/src/booking.test.ts > canBook — AC1: valid interval and future start > T02: rejects a request that starts exactly now 0ms
 ✓ project/src/booking.test.ts > canBook — AC1: valid interval and future start > T03: rejects zero-duration interval 0ms
 ✓ project/src/booking.test.ts > canBook — AC1: valid interval and future start > T04: rejects reversed interval 0ms
 ✓ project/src/booking.test.ts > canBook — AC1: valid interval and future start > T05: rejects an end time after minute 1440 0ms
 ✓ project/src/booking.test.ts > canBook — AC1: valid interval and future start > X1: accepts an interval ending exactly at minute 1440 0ms
 ✓ project/src/booking.test.ts > canBook — AC2: maximum duration is 120 minutes > T06: accepts exactly 120 minutes 1ms
 ✓ project/src/booking.test.ts > canBook — AC2: maximum duration is 120 minutes > T07: rejects 121 minutes 1ms
 ✓ project/src/booking.test.ts > canBook — AC3: blocked rooms > T13: rejects an otherwise available request when room is blocked 0ms
 ✓ project/src/booking.test.ts > canBook — AC4: overlap detection > T01: accepts touching after an existing booking 0ms
 ✓ project/src/booking.test.ts > canBook — AC4: overlap detection > T08: accepts touching before an existing booking 0ms
 ✓ project/src/booking.test.ts > canBook — AC4: overlap detection > T09: rejects partial overlap 0ms
 ✓ project/src/booking.test.ts > canBook — AC4: overlap detection > T10: rejects a request containing an existing booking 0ms
 ✓ project/src/booking.test.ts > canBook — AC4: overlap detection > T11: rejects a request fully inside an existing booking 0ms
 ✓ project/src/booking.test.ts > canBook — AC4: overlap detection > T12: rejects an interval identical to an existing booking 0ms
 ✓ project/src/booking.test.ts > canBook — AC4: overlap detection > T14: accepts the request when there are no existing bookings 0ms
 ✓ project/src/booking.test.ts > canBook — AC4: overlap detection > X2: accepts an interval touching two bookings at both endpoints 0ms
 ✓ project/src/booking.test.ts > canBook — AC5: Boolean result and no input mutation > AC5: returns true and leaves booking data unchanged for an available request 2ms
 ✓ project/src/booking.test.ts > canBook — AC5: Boolean result and no input mutation > AC5: leaves booking data unchanged when the request is rejected 1ms

 Test Files  1 passed (1)
      Tests  21 passed (21)
   Start at  12:00:35
   Duration  1.26s (transform 119ms, setup 0ms, collect 154ms, tests 17ms, environment 0ms, prepare 441ms)

```

The final suite is now `app/project/src/booking.test.ts`. The previously executed first suite was moved unchanged to `suites/first/booking.test.ts` as a historical snapshot. The final suite corrects the import for its location, names both AC5 tests explicitly, and adds the three boundary tests proposed in §6.2: a negative start isolated from the time rule, a start one minute after now, and a one-minute interval. Expected results of the original 18 tests are unchanged. Fractional-minute validation remains an open implementation limitation.

---

## 7. Task 6 — deliberate defects

You need a reviewed, passing suite first. Then introduce **one** defect at a time in your booking
module, leave the tests unchanged, run, record, and **restore** the code. A syntax or import
error does not count as detection.

| Trial | Intentional change | Detected / Survived | Failing test ID(s) | If it survived: why, and what you added |
| --- | --- | --- | --- | --- |
| M1 | Reject duration >= 120 instead of > 120 | Detected | T06: accepts exactly 120 minutes | N/A: detected by the existing test; tests unchanged. |
| M2 | Treat touching endpoints as an overlap | Detected | T01, T08, X2; AC5: returns true and leaves booking data unchanged for an available request | N/A: detected by existing assertions; tests unchanged. |
| M3 | Remove the blocked-room rejection | Detected | T13: rejects an otherwise available request when room is blocked | N/A: detected by the existing assertion; tests unchanged. |

**The run of each mutant, pasted unedited.** Paste the `Tests` summary line and the failing test
names at least:

M1 — `npx vitest run` from `week-07/app`. The baseline passed all 18 tests and matched commit `c2ec4e8`. Changed only `>` to `>=` in the duration check in `project/src/booking.ts`, then restored the original file after the run. Actual failure and summary excerpts:

```text
 RUN  v3.2.4 C:/Users/Acer/Desktop/SE/week-07/app

 FAIL  src/suites/first/booking.test.ts > canBook — AC2: maximum duration is 120 minutes > T06: accepts exactly 120 minutes
AssertionError: expected false to be true // Object.is equality

- Expected
+ Received

- true
+ false

 ❯ src/suites/first/booking.test.ts:98:7
     96|         bookings,
     97|       }),
     98|     ).toBe(true);
       |       ^
     99|   });
    100| 

 Test Files  1 failed (1)
      Tests  1 failed | 17 passed (18)
   Start at  11:36:08
   Duration  951ms (transform 101ms, setup 0ms, collect 119ms, tests 14ms, environment 0ms, prepare 358ms)
```

M2 — `npx vitest run` from `week-07/app`. Changed only the overlap comparisons to `start <= b.end && end >= b.start` in `project/src/booking.ts`. Detected by assertion failures in T01, T08, X2, and the AC5 available-request test. Restored the original file after the run; tests unchanged.

```text

 RUN  v3.2.4 C:/Users/Acer/Desktop/SE/week-07/app

 ❯ src/suites/first/booking.test.ts (18 tests | 4 failed) 14ms
   ✓ canBook — AC1: valid interval and future start > T02: rejects a request that starts exactly now 1ms
   ✓ canBook — AC1: valid interval and future start > T03: rejects zero-duration interval 0ms
   ✓ canBook — AC1: valid interval and future start > T04: rejects reversed interval 0ms
   ✓ canBook — AC1: valid interval and future start > T05: rejects an end time after minute 1440 0ms
   ✓ canBook — AC1: valid interval and future start > X1: accepts an interval ending exactly at minute 1440 0ms
   ✓ canBook — AC2: maximum duration is 120 minutes > T06: accepts exactly 120 minutes 0ms
   ✓ canBook — AC2: maximum duration is 120 minutes > T07: rejects 121 minutes 0ms
   ✓ canBook — AC3: blocked rooms > T13: rejects an otherwise available request when room is blocked 0ms
   × canBook — AC4: overlap detection > T01: accepts touching after an existing booking 7ms
     → expected false to be true // Object.is equality
   × canBook — AC4: overlap detection > T08: accepts touching before an existing booking 1ms
     → expected false to be true // Object.is equality
   ✓ canBook — AC4: overlap detection > T09: rejects partial overlap 0ms
   ✓ canBook — AC4: overlap detection > T10: rejects a request containing an existing booking 0ms
   ✓ canBook — AC4: overlap detection > T11: rejects a request fully inside an existing booking 0ms
   ✓ canBook — AC4: overlap detection > T12: rejects an interval identical to an existing booking 0ms
   ✓ canBook — AC4: overlap detection > T14: accepts the request when there are no existing bookings 0ms
   × canBook — AC4: overlap detection > X2: accepts an interval touching two bookings at both endpoints 1ms
     → expected false to be true // Object.is equality
   × canBook — AC5: Boolean result and no input mutation > returns true and leaves booking data unchanged for an available request 1ms
     → expected false to be true // Object.is equality
   ✓ canBook — AC5: Boolean result and no input mutation > leaves booking data unchanged when the request is rejected 1ms

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 4 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  src/suites/first/booking.test.ts > canBook — AC4: overlap detection > T01: accepts touching after an existing booking
AssertionError: expected false to be true // Object.is equality

- Expected
+ Received

- true
+ false

 ❯ src/suites/first/booking.test.ts:144:7
    142|         bookings,
    143|       }),
    144|     ).toBe(true);
       |       ^
    145|   });
    146| 

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/4]⎯

 FAIL  src/suites/first/booking.test.ts > canBook — AC4: overlap detection > T08: accepts touching before an existing booking
AssertionError: expected false to be true // Object.is equality

- Expected
+ Received

- true
+ false

 ❯ src/suites/first/booking.test.ts:158:7
    156|         bookings,
    157|       }),
    158|     ).toBe(true);
       |       ^
    159|   });
    160| 

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[2/4]⎯

 FAIL  src/suites/first/booking.test.ts > canBook — AC4: overlap detection > X2: accepts an interval touching two bookings at both endpoints
AssertionError: expected false to be true // Object.is equality

- Expected
+ Received

- true
+ false

 ❯ src/suites/first/booking.test.ts:245:7
    243|         bookings,
    244|       }),
    245|     ).toBe(true);
       |       ^
    246|   });
    247| });

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[3/4]⎯

 FAIL  src/suites/first/booking.test.ts > canBook — AC5: Boolean result and no input mutation > returns true and leaves booking data unchanged for an available request
AssertionError: expected false to be true // Object.is equality

- Expected
+ Received

- true
+ false

 ❯ src/suites/first/booking.test.ts:266:20
    264|     });
    265| 
    266|     expect(result).toBe(true);
       |                    ^
    267|     expect(typeof result).toBe("boolean");
    268|     expect(bookings).toEqual(before);

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[4/4]⎯


 Test Files  1 failed (1)
      Tests  4 failed | 14 passed (18)
   Start at  11:38:00
   Duration  992ms (transform 105ms, setup 0ms, collect 119ms, tests 14ms, environment 0ms, prepare 383ms)

```

M3 — `npx vitest run` from `week-07/app`. Commented out only `if (blocked) return { kind: "blocked" };` in `project/src/booking.ts`. Detected by the assertion failure in T13. Restored the original file after the run; tests unchanged.

```text

 RUN  v3.2.4 C:/Users/Acer/Desktop/SE/week-07/app

 ❯ src/suites/first/booking.test.ts (18 tests | 1 failed) 13ms
   ✓ canBook — AC1: valid interval and future start > T02: rejects a request that starts exactly now 1ms
   ✓ canBook — AC1: valid interval and future start > T03: rejects zero-duration interval 0ms
   ✓ canBook — AC1: valid interval and future start > T04: rejects reversed interval 0ms
   ✓ canBook — AC1: valid interval and future start > T05: rejects an end time after minute 1440 0ms
   ✓ canBook — AC1: valid interval and future start > X1: accepts an interval ending exactly at minute 1440 0ms
   ✓ canBook — AC2: maximum duration is 120 minutes > T06: accepts exactly 120 minutes 0ms
   ✓ canBook — AC2: maximum duration is 120 minutes > T07: rejects 121 minutes 0ms
   × canBook — AC3: blocked rooms > T13: rejects an otherwise available request when room is blocked 8ms
     → expected true to be false // Object.is equality
   ✓ canBook — AC4: overlap detection > T01: accepts touching after an existing booking 0ms
   ✓ canBook — AC4: overlap detection > T08: accepts touching before an existing booking 0ms
   ✓ canBook — AC4: overlap detection > T09: rejects partial overlap 0ms
   ✓ canBook — AC4: overlap detection > T10: rejects a request containing an existing booking 0ms
   ✓ canBook — AC4: overlap detection > T11: rejects a request fully inside an existing booking 0ms
   ✓ canBook — AC4: overlap detection > T12: rejects an interval identical to an existing booking 0ms
   ✓ canBook — AC4: overlap detection > T14: accepts the request when there are no existing bookings 0ms
   ✓ canBook — AC4: overlap detection > X2: accepts an interval touching two bookings at both endpoints 0ms
   ✓ canBook — AC5: Boolean result and no input mutation > returns true and leaves booking data unchanged for an available request 0ms
   ✓ canBook — AC5: Boolean result and no input mutation > leaves booking data unchanged when the request is rejected 0ms

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  src/suites/first/booking.test.ts > canBook — AC3: blocked rooms > T13: rejects an otherwise available request when room is blocked
AssertionError: expected true to be false // Object.is equality

- Expected
+ Received

- false
+ true

 ❯ src/suites/first/booking.test.ts:128:7
    126|         bookings,
    127|       }),
    128|     ).toBe(false);
       |       ^
    129|   });
    130| });

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯


 Test Files  1 failed (1)
      Tests  1 failed | 17 passed (18)
   Start at  11:38:12
   Duration  984ms (transform 110ms, setup 0ms, collect 117ms, tests 13ms, environment 0ms, prepare 386ms)

```

All three changes reverted, and the full suite run again (section 6.3): yes — the final suite passed all 21 tests after restoration. The three mutant outputs above are historical runs of the original 18-test suite, whose assertions are retained in the final suite.

---

## 8. Task 7 — manual UI checks

Use `now = 09:00` and an existing `10:00–11:00` booking. Do them in the page in a browser. Save a
screenshot of each as `evidence/ui-1.png` … `evidence/ui-5.png`. Take **ui-4 at phone width**
(about 375 px, portrait).

| # | Action | Expected observation | AC | What I observed | Pass / Fail / Not testable |
| --- | --- | --- | --- | --- | --- |
| U1 | Check 11:00–12:00, unblocked | Available, with the fixed sample booking | AC5 | `ui-1.png` shows Available for 10:00–11:00 with existing bookings at 09:00–10:00 and 12:00–14:00. This supports availability for touching endpoints, but does not document the exact requested fixture and interval. | Not testable |
| U2 | Enable blocked, then check again | Unavailable replaces the earlier result | AC3, AC5 | `ui-2.png` shows Thermodynamics Lab marked Blocked and an Unavailable message explaining the room cannot be booked. It is a different room from ui-1, so the screenshot does not establish the same-room toggle and replacement sequence. | Not testable |
| U3 | Clear a required input and submit | Understandable validation feedback | AC6 | `ui-3.png` shows an empty Start field and the browser validation message “Заполните это поле.” (Fill out this field). | Pass |
| U4 | Use a narrow (phone) width | Controls and result remain usable | AC6 | `ui-4.png` is a 750×2526 portrait image. Inputs and buttons stack vertically; the room selector, timeline, and result panel fit within the card. The screenshot does not independently establish CSS viewport width. | Pass |
| U5 | Repeat the checks on the same data | Existing bookings remain unchanged | AC5 | Comparing `ui-1.png` and `ui-5.png`, Engineering Hall A still lists Calculus I at 09:00–10:00 and Physics 201 at 12:00–14:00 after a different request, 11:00–12:00, returns Available. The displayed schedule is unchanged. | Pass |

---

## 9. Comparison and what still fails

### 9.1 Checks I am keeping as FAIL or ERROR

Use the same IDs as `known_fails` in `submission.yml`. Write `none` if the run is clean.

| Check | Why it stays |
| --- | --- |
| none | All 33 checker checks pass after correcting suite locations, report fields, and the export layout. This static result does not close the fractional-minute coverage gap or prove the unverified UI sequences. |

### 9.2 Original and improved suites

| Measure | First suite | Improved suite |
| --- | --- | --- |
| Executed / passed / failed | 18 / 18 / 0 — actual first run in §6.1, 11:25:25. | 21 / 21 / 0 — actual final run in §6.3, 12:00:35, from `project/src/booking.test.ts`. |
| Requirements with meaningful tests (AC IDs and gaps) | AC1–AC5 cover interval validity, duration, blocked rooms, overlap, Boolean results, and unchanged data. Negative starts, immediately-after-now starts, and minimum valid duration lack dedicated tests. | AC1–AC5 retained; three added AC1 boundary tests cover those gaps. Both AC5 tests now name AC5 explicitly. Fractional-minute inputs and automated AC6 coverage remain missing. |
| Selected mutants detected | Actual §7 trials detected 3/3: M1 by T06; M2 by T01, T08, X2 and the AC5 available-request assertion; M3 by T13. | All detecting assertions retained unchanged. The mutation trials were not rerun against the expanded 21-test file; §7 records the original trials. |
| Accepted / revised / rejected tests | 18 retained, 0 rejected; seven accepted review decisions in §5. | 18 original cases retained, 3 added, 0 rejected; 2 AC5 titles revised and the import corrected. No original expected decision changed. |
| Remaining limitations | Fractional-minute and several integer-boundary gaps; no automated UI tests or defined response to invalid existing bookings. | Integer-boundary gaps above addressed; fractional-minute validation remains open. UI screenshots support visible states, but U1/U2 do not establish the exact requested sequences. |

### 9.3 What no AC decides

Call your function with `bookings = [{ start: 700, end: 650 }]` (a reversed existing booking)
and a request of 660–720. What does it return? Does any AC say what it should return? (This is
the value you declare in `submission.yml` under `assumptions.invalid_existing_booking`.)

Executed a separate Node.js call importing the real `canBook` from `app/project/src/booking.ts`:

```ts
canBook({ start: 660, end: 720, now: 540, blocked: false,
          bookings: [{ start: 700, end: 650 }] })
```

Actual output: `true`; the declaration is `returns-true`. The malformed interval is an existing booking, not the candidate request. The overlap condition `start < b.end && end > b.start` is false because `660 < 650` is false. AC1–AC6 do not specify validation of malformed existing bookings. This behavior therefore assumes existing data is valid; it is observed behavior, not a requirement established by the ACs.

---

## 10. Conclusion (120–180 words)

<!-- Answer all three in your own words, without the assistant:
     (a) Which mistake in the FIRST suite would have let a wrong canBook pass, and how did you find it?
     (b) What does your final green run prove, and what does it NOT prove? Use a mutant or a UI check.
     (c) One testing limitation that remains.
     Worthless: "The AI wrote good tests and they all passed."
     Worth everything: "The first suite expected T06 (exactly 120 minutes) to be rejected. That
     contradicts AC2, and it failed on a correct canBook. If I had changed the code to make it
     pass, M1 would have become the real behaviour." -->

<!-- Write your conclusion below this line -->

The first AI suite risked creating false confidence: all 18 tests passed, although negative starts, the first minute after now, and minimum valid duration lacked dedicated checks. Review found no incorrect expected decisions. The final suite retains those decisions and adds three boundary tests; its actual run passed all 21 tests.

A green run establishes that the implementation satisfies the assertions executed on those inputs. It does not prove complete AC coverage or correct behavior for every malformed value. The earlier mutation trials detected M1 through T06, M2 through endpoint and AC5 assertions, and M3 through T13. Those assertions remain in the final suite.

The screenshots show availability, a blocked-room rejection, required-field feedback, and vertically arranged mobile controls. However, U1 and U2 do not demonstrate the exact prescribed sequences. Fractional-minute validation still lacks a test. The reversed existing booking returns true, but no AC defines that response; it remains an explicit assumption rather than proven correctness.
