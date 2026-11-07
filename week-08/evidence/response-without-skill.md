## Bug Detector — Week 07 Room Availability Checker

Result: Two defects are identifiable in the supplied `canBook` implementation: incorrect endpoint-overlap detection (AC4) and unintended mutation of booking data (AC5).

### 1. Defect | Evidence | Root cause | Fix | Test

| Field           | Finding                                                                  |
| --------------- | ------------------------------------------------------------------------ |
| Defect          | T01 fails: touching bookings are rejected                                |
| Affected AC     | AC4                                                                      |
| Evidence        | Expected `true`, received `false`                                        |
| Root cause      | The overlap condition uses inclusive comparisons (`<=`, `>=`)            |
| Minimal fix     | Replace inclusive comparisons with strict comparisons (`<`, `>`)         |
| Regression test | Verify that a booking beginning exactly when another ends returns `true` |

### 2. Reproduce the failure

Use the smallest deterministic input:

```
const bookings = [{ start: 600, end: 660 }];

const result = canBook({
  start: 660,
  end: 720,
  now: 540,
  blocked: false,
  bookings,
});
```

Expected: `true`

Actual: `false`

The existing booking ends at minute `660`, exactly when the requested booking starts. There is no time overlap.

The incorrect condition:

```
if (start <= b.end && end >= b.start) return false;
```

Evaluates as:

```
660 <= 660  // true
720 >= 600  // true
```

Therefore, the function incorrectly returns `false`.

### 3. Minimal patch — proposal only

Replace:

```
if (start <= b.end && end >= b.start) return false;
```

With:

```
if (start < b.end && end > b.start) return false;
```

This correctly rejects genuine overlaps while allowing bookings that touch at endpoints.

### 4. Second confirmed defect — AC5

The following line violates AC5:

```
bookings.push({ start, end });
```

Root cause: `canBook` is supposed to be a read-only availability checker, but `push()` modifies the original booking array.

Minimal fix: Remove this line.

The function should return `true` when the requested interval is available without adding a booking.

This is a confirmed code defect, although it is not the cause of the reported T01 failure.

### 5. Regression tests

```
import { expect, it } from "vitest";
import { canBook } from "./booking";

it("AC4: allows touching endpoints", () => {
  const bookings = [{ start: 600, end: 660 }];

  expect(canBook({
    start: 660,
    end: 720,
    now: 540,
    blocked: false,
    bookings,
  })).toBe(true);
});

it("AC4: rejects genuine overlap", () => {
  const bookings = [{ start: 600, end: 660 }];

  expect(canBook({
    start: 650,
    end: 720,
    now: 540,
    blocked: false,
    bookings,
  })).toBe(false);
});

it("AC5: does not mutate booking data", () => {
  const bookings = [{ start: 600, end: 660 }];
  const original = structuredClone(bookings);

  expect(canBook({
    start: 660,
    end: 720,
    now: 540,
    blocked: false,
    bookings,
  })).toBe(true);

  expect(bookings).toEqual(original);
});
```

### 6. Confirmed defects vs. hypotheses

| Finding                                      | Status                               |
| -------------------------------------------- | ------------------------------------ |
| AC4: Touching endpoints incorrectly rejected | Confirmed                            |
| AC5: Booking array mutated using `push()`    | Confirmed                            |
| AC1–AC3: Validation defects                  | Not demonstrated by supplied failure |
| AC6: Desktop/mobile feedback issues          | Cannot assess without UI code        |

### 7. Final verification

After applying the two proposed changes, the expected results are:

- T01 touching endpoints: PASS
- Genuine overlapping interval: PASS
- No mutation of booking data: PASS

Conclusion: The primary root cause is the inclusive overlap comparison. A secondary independent defect is the mutation of the bookings array. Both can be corrected with two minimal changes, without modifying the public function signature, acceptance criteria, or existing booking records.

No code or files have been edited.