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
| Bolt project link (or `not shared`, and why) | |
| Assistant that generated the tests (tool) | |
| Exact model (with its version, or `not displayed`) | |
| Where I ran the tests (Bolt terminal / my computer / Codespace) | |
| Vitest version (the `RUN  v…` line of a run) | |
| Test command | |

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
| 1 | | | accept / revise / reject | |
| 2 | | | accept / revise / reject | |

---

## 6. Task 5 — running, diagnosing, improving

### 6.1 The first run

The **real** terminal output of the first run of the first suite, pasted unedited. Include the
`RUN  v…` line and the `Tests` summary line. A build message or the assistant saying "tests pass"
is not a run.

```text
(paste here)
```

**Each failure, diagnosed** (the deck's table: import/runner error · assertion mismatch · result
changing per run · no tests discovered). Write `none` in the first row if nothing failed.

| Failing test | Observed failure | First check | Test repair or implementation fix? | Action taken |
| --- | --- | --- | --- | --- |
| | | | | |

### 6.2 The improvement prompt

The deck's improvement prompt exactly as sent, followed by the actual output from 6.1. Then
paste the assistant's answer, unedited:

```text
(paste here)
```

### 6.3 The final run

The **real** output of the final suite (`booking.test.*` beside your module), after every
change and after restoring the correct code from section 7. Every test must pass. If a real defect
is still open, leave its test failing and explain it in 9.1.

```text
(paste here)
```

---

## 7. Task 6 — deliberate defects

You need a reviewed, passing suite first. Then introduce **one** defect at a time in your booking
module, leave the tests unchanged, run, record, and **restore** the code. A syntax or import
error does not count as detection.

| Trial | Intentional change | Detected / Survived | Failing test ID(s) | If it survived: why, and what you added |
| --- | --- | --- | --- | --- |
| M1 | Reject duration >= 120 instead of > 120 | Detected / Survived | | |
| M2 | Treat touching endpoints as an overlap | Detected / Survived | | |
| M3 | Remove the blocked-room rejection | Detected / Survived | | |

**The run of each mutant, pasted unedited.** Paste the `Tests` summary line and the failing test
names at least:

```text
(paste here)
```

All three changes reverted, and the full suite run again (section 6.3): yes / no

---

## 8. Task 7 — manual UI checks

Use `now = 09:00` and an existing `10:00–11:00` booking. Do them in the page in a browser. Save a
screenshot of each as `evidence/ui-1.png` … `evidence/ui-5.png`. Take **ui-4 at phone width**
(about 375 px, portrait).

| # | Action | Expected observation | AC | What I observed | Pass / Fail / Not testable |
| --- | --- | --- | --- | --- | --- |
| U1 | Check 11:00–12:00, unblocked | Available, with the fixed sample booking | AC5 | | Pass / Fail / Not testable |
| U2 | Enable blocked, then check again | Unavailable replaces the earlier result | AC3, AC5 | | Pass / Fail / Not testable |
| U3 | Clear a required input and submit | Understandable validation feedback | AC6 | | Pass / Fail / Not testable |
| U4 | Use a narrow (phone) width | Controls and result remain usable | AC6 | | Pass / Fail / Not testable |
| U5 | Repeat the checks on the same data | Existing bookings remain unchanged | AC5 | | Pass / Fail / Not testable |

---

## 9. Comparison and what still fails

### 9.1 Checks I am keeping as FAIL or ERROR

Use the same IDs as `known_fails` in `submission.yml`. Write `none` if the run is clean.

| Check | Why it stays |
| --- | --- |
| | |

### 9.2 Original and improved suites

| Measure | First suite | Improved suite |
| --- | --- | --- |
| Executed / passed / failed | | |
| Requirements with meaningful tests (AC IDs and gaps) | | |
| Selected mutants detected | | |
| Accepted / revised / rejected tests | | |
| Remaining limitations | | |

### 9.3 What no AC decides

Call your function with `bookings = [{ start: 700, end: 650 }]` (a reversed existing booking)
and a request of 660–720. What does it return? Does any AC say what it should return? (This is
the value you declare in `submission.yml` under `assumptions.invalid_existing_booking`.)

-

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
