# Week 05 — Lab report

**Name:** Khudaibergen Yerassyl
**Group:** Monday 16:00-19:00
**Date:** 11.10.2026

Fill in every section. **Do not delete, rename or renumber the headings** — the checker and the
grader find your answers by them. Add rows to any table; never remove its header.

---

## 1. Setup

| | |
| --- | --- |
| Assistant (tool) | ChatGPT |
| **Exact** model name |GPT-6 Astra|
| Language and version |Python 3 (standard library only)|
| Path | A |
| My Week 04 declaration for touching bookings | allowed |

<!-- If your Week 04 model said touching bookings are NOT allowed: AC4 now says they are.
     One sentence here on what that changes in your Week 04 diagrams. This is a finding, not a penalty. -->
Week 04 used `allowed` for touching bookings. Week 05 AC4 confirms that decision. A meeting endpoint, such as one booking ending at 660 and another starting at 660, is not an overlap.

---

## 2. Task 1 — the plan

**The assistant's plan, pasted unedited:**

```text
1. Check AC1: enforce 0 <= start < end <= 1440 and require start > now.
2. Check AC2: reject when end - start exceeds 120 minutes; exactly 120 is valid.
3. Check AC3: reject immediately if blocked is True.
4. Check AC4: for each (booked_start, booked_end), reject only when start < booked_end AND end > booked_start. Touching intervals pass because intervals are half-open.
5. Return False for any failed check and True only if all checks succeed (AC5). Do not append, sort, save, or otherwise change existing.
Assumptions: now and the existing bookings are valid as specified; only one room is considered; start and end are integers; the complete system performs saving and confirmation.
Suggested boundary tests: start == now, start == now + 1, start == end, reversed endpoints, end == 1440, end == 1441, 120 vs 121 minutes, blocked rooms, partial/contained/containing overlaps, both kinds of touching, empty and unsorted existing, and input immutability.
```

**What the plan invented or changed.** One row for every rule in the plan that is not in the
contract or in AC1–AC5, or that says something different from them. If you found none, write one
row saying which lines of the plan you checked against which AC.

| # | What the plan said | What the contract or the AC says | What I did |
| --- | --- | --- | --- |
| 1 | Validate 0 <= start < end <= 1440 and start > now | AC1 says exactly this. | Kept both validations; no extra rule was introduced. |
| 2 | Permit duration 120 and reject 121 | AC2 says duration is at most 120 minutes. | Kept an inclusive 120-minute maximum. |
| 3 | Use two strict inequalities for interval overlap | AC4 permits touching endpoints; the intervals exclude their ends. | Verified the inequalities by hand against both touching directions. |
| 4 | Do not save, sort, or change the booking collection | AC5 requires all inputs unchanged; storing and confirmation are outside this feature. | Did not introduce persistence, sorting or confirmation. |
**Boundary cases the assistant suggested that I kept as tests:**

- `test_touching_end_is_allowed`, `test_touch_existing_start_allowed`, and `test_touch_both_neighbours_allowed` (AC4).
- `test_exactly_120_minutes_allowed` and `test_121_minutes_rejected` (AC2).
- `test_end_at_1440_allowed`, `test_end_after_1440_rejected`, and `test_start_equal_now_rejected` (AC1).
- `test_unsorted_existing_second_overlap_rejected` and the two unchanged-input tests (AC4, AC5).


---

## 3. Task 2 — the first version (v1), read before it was run

v1 is saved as `code/original/booking_v1.<ext>`, exactly as the assistant returned it: yes 

**AC map.** One row per condition in v1. Quote the line.

| # | Line in v1 | AC it implements | Correct as written? If not, why |
| --- | --- | --- | --- |
| 1 | `if not (0 <= start < end <= 1440):` | AC1 | Yes: checks valid order and date bounds. |
| 2 | `if start <= now:` | AC1 | Yes: disallows starting now or earlier. |
| 3 | `if end - start > 120:` | AC2 | Yes: permits exactly 120 minutes. |
| 4 | `if blocked:` | AC3 | Yes: rejects a blocked room. |
| 5 | `for booked_start, booked_end in existing:` | AC4 | Yes: examines every active booking for the selected room. |
| 6 | `if start <= booked_end and end >= booked_start:` | AC4 | **No:** `<=` and `>=` also reject endpoints that merely touch; AC4 explicitly allows those requests. |
| 7 | `return False` (on each failed condition) / `return True` (after the loop) | AC5 | Yes: returns Booleans, has no saving side effect; the faulty AC4 condition can still produce the wrong decision. |

**Anything in v1 that no AC asks for** (extra validation, a buffer between bookings, logging,
saving the booking, a different return type):

- None: the extra function contains no persistence, notification, sorting, waiting, or additional room checks. The issue is an incorrect AC4 inequality, not an invented feature.


---

## 4. Task 3 — my tests

Base input for every row unless the row says otherwise: `now=540, blocked=False, existing=[(600, 660)]`.

| # | Test name | Request (start, end) | What differs from the base input | Expected | AC | Result on v1 | Result on final |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | `test_touching_end_is_allowed` | `(660, 720)` | base | `True` | AC4 | FAIL (False) | PASS |
| 2 | `test_partial_overlap_rejected` | `(630, 690)` | base | `False` | AC4 | PASS | PASS |
| 3 | `test_blocked_room_rejected` | `(660, 720)` | blocked=True | `False` | AC3 | PASS | PASS |
| 4 | `test_exactly_120_minutes_allowed` | `(720, 840)` | base | `True` | AC2 | PASS | PASS |
| 5 | `test_121_minutes_rejected` | `(720, 841)` | base | `False` | AC2 | PASS | PASS |
| 6 | `test_start_equal_now_rejected` | `(540, 570)` | base | `False` | AC1 | PASS | PASS |
| 7 | `test_zero_length_rejected` | `(700, 700)` | base | `False` | AC1 | PASS | PASS |
| 8 | `test_reversed_times_rejected` | `(720, 700)` | base | `False` | AC1 | PASS | PASS |
| 9 | `test_end_at_1440_allowed` | `(1380, 1440)` | base | `True` | AC1 | PASS | PASS |
| 10 | `test_end_after_1440_rejected` | `(1380, 1441)` | base | `False` | AC1 | PASS | PASS |
| 11 | `test_negative_start_rejected` | `(-1, 30)` | base; start <= now also fails | `False` | AC1 | PASS | PASS |
| 12 | `test_start_at_zero_now_zero_rejected` | `(0, 60)` | now=0; existing=[] | `False` | AC1 | PASS | PASS |
| 13 | `test_one_minute_after_now_allowed` | `(541, 571)` | base | `True` | AC1 | PASS | PASS |
| 14 | `test_start_one_now_zero_allowed` | `(1, 61)` | now=0; existing=[] | `True` | AC1 | PASS | PASS |
| 15 | `test_past_start_rejected` | `(500, 530)` | base | `False` | AC1 | PASS | PASS |
| 16 | `test_one_minute_duration_allowed` | `(720, 721)` | base | `True` | AC2 | PASS | PASS |
| 17 | `test_119_minutes_allowed` | `(720, 839)` | base | `True` | AC2 | PASS | PASS |
| 18 | `test_blocked_with_empty_bookings_rejected` | `(660, 720)` | blocked=True; existing=[] | `False` | AC3 | PASS | PASS |
| 19 | `test_empty_existing_allowed` | `(600, 660)` | existing=[] | `True` | AC4 | PASS | PASS |
| 20 | `test_overlap_second_booking_rejected` | `(720, 780)` | existing has two intervals | `False` | AC4 | PASS | PASS |
| 21 | `test_unsorted_existing_second_overlap_rejected` | `(610, 650)` | existing unsorted | `False` | AC4 | PASS | PASS |
| 22 | `test_touch_both_neighbours_allowed` | `(660, 720)` | existing has two touching intervals | `True` | AC4 | FAIL (False) | PASS |
| 23 | `test_entirely_inside_rejected` | `(615, 645)` | base | `False` | AC4 | PASS | PASS |
| 24 | `test_contains_existing_rejected` | `(570, 690)` | base | `False` | AC4 | PASS | PASS |
| 25 | `test_identical_interval_rejected` | `(600, 660)` | base | `False` | AC4 | PASS | PASS |
| 26 | `test_touch_existing_start_allowed` | `(570, 600)` | base | `True` | AC4 | FAIL (False) | PASS |
| 27 | `test_partial_overlap_on_start_rejected` | `(570, 630)` | base | `False` | AC4 | PASS | PASS |
| 28 | `test_free_gap_among_three_allowed` | `(760, 800)` | existing has three intervals | `True` | AC4 | FAIL (False) | PASS |
| 29 | `test_return_bool_true` | `(660, 720)` | base | `True` | AC5 | FAIL (False) | PASS |
| 30 | `test_return_bool_false` | `(630, 690)` | base | `False` | AC5 | PASS | PASS |
| 31 | `test_accepted_existing_list_unchanged` | `(780, 840)` | `existing=[(900, 960), (600, 660), (700, 760)]`; compare snapshot after call | `True` and unchanged | AC5 | PASS | PASS |
| 32 | `test_rejected_existing_list_unchanged` | `(610, 650)` | `existing=[(900, 960), (600, 660), (700, 760)]`; compare snapshot after call | `False` and unchanged | AC5 | PASS | PASS |

---

## 5. Task 4 — debugging with evidence

One row per defect you found — in v1, in a later version, or in your own tests. If v1 passed
everything, the row is the **new edge case you added**, with expected and actual equal, and the
cause column says why no change was needed.

The initial implementation was run using an isolated copy of the same 32-test suite. Five tests failed, all because AC4 used inclusive comparisons. The unchanged first draft remains in `code/original/booking_v1.py`.


| # | Input (the full call) | Expected | Actual | Cause (quote the line) | Fix | Who proposed the fix |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | `can_book(660, 720, 540, False, [(600, 660)])` | `True` | `False` | v1: `if start <= booked_end and end >= booked_start:` treats equality as overlap. | Use `start < booked_end and end > booked_start`. | Derived from AC4 and the half-open interval definition, with AI assistance. |
| 2 | `can_book(570, 600, 540, False, [(600, 660)])` | `True` | `False` | The same v1 line rejects a request whose end equals an existing start. | Both comparisons must be strict. | Derived from AC4; confirmed by `test_touch_existing_start_allowed`. |
| 3 | `can_book(660, 720, 540, False, [(600, 660), (720, 780)])` | `True` | `False` | The same v1 line rejects both touching neighbours. | Keep the strict comparison inside the loop. | Derived from AC4; confirmed by `test_touch_both_neighbours_allowed`. |
| 4 | `can_book(760, 800, 540, False, [(600, 660), (700, 760), (800, 860)])` | `True` | `False` | v1 rejects touching on each side of the free gap. | Same strict overlap formula. | Derived from AC4; confirmed by `test_free_gap_among_three_allowed`. |

`test_return_bool_true` also failed on v1 because that test uses the same touching request as row 1; it is not a separate underlying defect.

**The debug prompt I sent, and the assistant's answer** (leave the block empty if you did not use it):

```text
```

---

## 6. Task 5 — the critique

**The assistant's critique, pasted unedited:**

```text
1. `if start < booked_end and end > booked_start:` is correct for AC4, but its half-open meaning is easy to misread. Add a one-line explanatory comment immediately above the loop; do not change the comparisons.
2. `if not (0 <= start < end <= 1440):` repeats a lower-bound condition that follows from `start > now` and valid `now >= 0` (AC1). Consider removing `0 <= start` to reduce redundancy.
3. `for booked_start, booked_end in existing:` relies on valid (start, end) tuples and does not sort them. Consider sorting first for predictable processing, but note the contract guarantees valid tuples and AC5 forbids input mutation.
4. `if start <= now:` checks the future-start requirement separately from the day bounds (AC1). This is correct. Do not relax it to `start < now`, which would allow a booking that starts now.
5. `return True` follows the loop, so all existing intervals are checked before acceptance (AC4 and AC5). Keep the return where it is; returning after the first non-overlap would be incorrect.
```

| # | Suggestion | accept / reject | Reason — cite the AC or the contract line | Suite after the change |
| --- | --- | --- | --- | --- |
| 1 | Clarify the strict overlap comparisons with a short source comment. | accept | AC4 and the half-open interval definition permit equality at endpoints. A comment makes that decision reviewable without changing behavior. | Final 32/32 pass. |
| 2 | Remove the logically redundant `0 <= start` term. | reject | Although `start > now` and a valid `now` imply it, AC1 writes this bound explicitly; retaining it is easier to review against the specification. | Final 32/32 pass; no edit. |
| 3 | Sort or validate `existing` before scanning. | reject | The contract already guarantees valid tuples for one room, while AC5 says leave all inputs unchanged. Sorting is unnecessary and could mutate or complicate the implementation. | Final 32/32 pass; no edit. |
| 4 | Keep `start <= now` rather than changing it to `<`. | accept | AC1 requires `start > now`, so equality must fail; `test_start_equal_now_rejected` checks it. | Final 32/32 pass; retained as written. |
| 5 | Keep `return True` after the loop. | accept | AC4 requires checking **every** existing booking; `test_unsorted_existing_second_overlap_rejected` ensures later entries count. | Final 32/32 pass; retained as written. |

---

## 7. Change log — v1 to final

| # | What changed (the line, before → after) | Why | Evidence: the test or check that moved |
| --- | --- | --- | --- |
| 1 | `if start <= booked_end and end >= booked_start:` → `if start < booked_end and end > booked_start:` | AC4 excludes touching endpoints from overlaps, so equality must be permitted. | Five v1 tests failed; all 32 final tests pass; F7 checks both touching directions. |
| 2 | Added `# Half-open intervals overlap only if both strict inequalities hold.` above the loop. | Accepted focused critique: make the exclusive end semantics explicit without altering the contract. | `test_touching_end_is_allowed`, `test_touch_existing_start_allowed`, `test_touch_both_neighbours_allowed` stay green. |

No sorting, saving, input mutation, new return type, or additional feature was introduced.

---

## 8. Evidence — real output

### 8.1 My suite, final run

Paste the **complete** terminal output. For Python: everything `python -m unittest -v` printed.

This is the complete output of `python -m unittest -v` from inside `code/`.

```text
test_119_minutes_allowed (test_booking.BookingTests.test_119_minutes_allowed) ... ok
test_121_minutes_rejected (test_booking.BookingTests.test_121_minutes_rejected) ... ok
test_accepted_existing_list_unchanged (test_booking.BookingTests.test_accepted_existing_list_unchanged) ... ok
test_blocked_room_rejected (test_booking.BookingTests.test_blocked_room_rejected) ... ok
test_blocked_with_empty_bookings_rejected (test_booking.BookingTests.test_blocked_with_empty_bookings_rejected) ... ok
test_contains_existing_rejected (test_booking.BookingTests.test_contains_existing_rejected) ... ok
test_empty_existing_allowed (test_booking.BookingTests.test_empty_existing_allowed) ... ok
test_end_after_1440_rejected (test_booking.BookingTests.test_end_after_1440_rejected) ... ok
test_end_at_1440_allowed (test_booking.BookingTests.test_end_at_1440_allowed) ... ok
test_entirely_inside_rejected (test_booking.BookingTests.test_entirely_inside_rejected) ... ok
test_exactly_120_minutes_allowed (test_booking.BookingTests.test_exactly_120_minutes_allowed) ... ok
test_free_gap_among_three_allowed (test_booking.BookingTests.test_free_gap_among_three_allowed) ... ok
test_identical_interval_rejected (test_booking.BookingTests.test_identical_interval_rejected) ... ok
test_negative_start_rejected (test_booking.BookingTests.test_negative_start_rejected) ... ok
test_one_minute_after_now_allowed (test_booking.BookingTests.test_one_minute_after_now_allowed) ... ok
test_one_minute_duration_allowed (test_booking.BookingTests.test_one_minute_duration_allowed) ... ok
test_overlap_second_booking_rejected (test_booking.BookingTests.test_overlap_second_booking_rejected) ... ok
test_partial_overlap_on_start_rejected (test_booking.BookingTests.test_partial_overlap_on_start_rejected) ... ok
test_partial_overlap_rejected (test_booking.BookingTests.test_partial_overlap_rejected) ... ok
test_past_start_rejected (test_booking.BookingTests.test_past_start_rejected) ... ok
test_rejected_existing_list_unchanged (test_booking.BookingTests.test_rejected_existing_list_unchanged) ... ok
test_return_bool_false (test_booking.BookingTests.test_return_bool_false) ... ok
test_return_bool_true (test_booking.BookingTests.test_return_bool_true) ... ok
test_reversed_times_rejected (test_booking.BookingTests.test_reversed_times_rejected) ... ok
test_start_at_zero_now_zero_rejected (test_booking.BookingTests.test_start_at_zero_now_zero_rejected) ... ok
test_start_equal_now_rejected (test_booking.BookingTests.test_start_equal_now_rejected) ... ok
test_start_one_now_zero_allowed (test_booking.BookingTests.test_start_one_now_zero_allowed) ... ok
test_touch_both_neighbours_allowed (test_booking.BookingTests.test_touch_both_neighbours_allowed) ... ok
test_touch_existing_start_allowed (test_booking.BookingTests.test_touch_existing_start_allowed) ... ok
test_touching_end_is_allowed (test_booking.BookingTests.test_touching_end_is_allowed) ... ok
test_unsorted_existing_second_overlap_rejected (test_booking.BookingTests.test_unsorted_existing_second_overlap_rejected) ... ok
test_zero_length_rejected (test_booking.BookingTests.test_zero_length_rejected) ... ok

----------------------------------------------------------------------
Ran 32 tests in 0.001s

OK```

### 8.2 The checker, final run

Paste the **complete** output of `python tests/check_booking.py`. Paste it **last**: if you edit
this file afterwards, run the checker again and paste again.


This is the complete output of `python tests/check_booking.py` from inside `week-05/

```text
Week 05 - can_book: the function, your tests, the evidence   (Path A)

PASS   F1   the six cases from the task table           6 of 6 cases
PASS   F2   AC1 time order and day bounds               5 of 5 cases
PASS   F3   AC1 the start is in the future              5 of 5 cases
PASS   F4   AC2 at most 120 minutes                     3 of 3 cases
PASS   F5   AC3 a blocked room accepts nothing          2 of 2 cases
PASS   F6   AC4 every kind of overlap is rejected       5 of 5 cases
PASS   F7   AC4 touching endpoints are allowed          3 of 3 cases
PASS   F8   AC4 every existing booking is checked       4 of 4 cases
PASS   F9   AC5 the result is a real Boolean            3 of 3 cases
PASS   F10  AC5 the inputs are left unchanged           2 of 2 cases
PASS   O1   the assistant's first version is kept       v1 kept (13 lines)
PASS   S1   your suite has at least 11 tests            32 tests
PASS   S2   your suite is green on your own code        32 tests, OK
PASS   M1   your tests catch a fault in AC1             caught by test_start_at_zero_now_zero_rejected, test_start_equal_now_rejected
PASS   M2   your tests catch a fault in AC1             caught by test_end_after_1440_rejected
PASS   M3   your tests catch a fault in AC1             caught by test_zero_length_rejected
PASS   M4   your tests catch a fault in AC2             caught by test_exactly_120_minutes_allowed
PASS   M5   your tests catch a fault in AC3             caught by test_blocked_room_rejected, test_blocked_with_empty_bookings_rejected
PASS   M6   your tests catch a fault in AC4             caught by test_free_gap_among_three_allowed, test_return_bool_true, test_touch_both_neighbours_allowed and 2 more
PASS   M7   your tests catch a fault in AC4             caught by test_overlap_second_booking_rejected, test_rejected_existing_list_unchanged, test_unsorted_existing_second_overlap_rejected
PASS   M8   your tests catch a fault in AC4             caught by test_contains_existing_rejected
PASS   M9   your tests catch a fault in AC5             caught by test_accepted_existing_list_unchanged
PASS   M10  your tests catch a fault in AC5             caught by test_accepted_existing_list_unchanged, test_rejected_existing_list_unchanged
PASS   L1   report 1: tool, model and language          tool, model and language recorded
PASS   L2   report 2: the plan, and what you corrected  plan pasted, 4 row(s) on what you corrected or verified
PASS   L3   report 3: v1 mapped to AC1-AC4              7 conditions mapped, AC1-AC4 all present
PASS   L4   report 4: at least 11 of your tests listed  32 tests listed
PASS   L5   report 5: debugging evidence                4 row(s) of input / expected / actual
PASS   L6   report 6: the critique, each point judged   critique pasted, 5 points judged
PASS   L7   report 7: change log                        2 change-log row(s)
PASS   L8   report 8.1: real output of your suite       suite output pasted
PASS   L9   report 10: conclusion of 120-180 words      174 words
------------------------------------------------------------------------------
v1 (code/original/booking_v1.py): passes F2 F3 F4 F5 F6 F9 F10 - fails F1 F7 F8 - identical to your final: no
SUMMARY pass=32 fail=0 error=0   (32 checks)
Behaviour and shape are clean. This says nothing about the quality of your review.
```

### 8.3 Path B only — three faults I planted myself

Break your own function on purpose, one line at a time, run your suite, restore the line.

| # | Line I changed (before → after) | AC it breaks | Test that failed |
| --- | --- | --- | --- |
| 1 | | | |
| 2 | | | |
| 3 | | | |

The three failing runs (Path A students leave this block empty):

```text
```

---

## 9. What still fails, and what the contract does not say

### 9.1 Checks I am keeping as FAIL or ERROR

The same IDs as `known_fails` in `submission.yml`. Write `none` if the run is clean.

| Check | Why it stays |
| --- | --- |
| none | No known failing checks in the final prepared run. |

### 9.2 Outside the contract

The contract says times are integers. It does not say what `can_book` does when one is not —
`600.5`, or the string `"600"`. What does **your** function do, and why is that the right call?

- **Draft answer for student review:** The implementation does not explicitly handle non-integer time values; this behavior is classified as `not-handled`. With `start=600.5`, Python can compare a float with integers and may return a Boolean. With `start="600"`, Python raises `TypeError` when comparing a string with an integer. Neither case is an obligation under the supplied contract, which restricts times to integer minutes. Adding arbitrary rounding or exception rules would change behavior outside the assignment's specified inputs. The system calling this function should guarantee integer inputs, as the contract assumes.


### 9.3 A bound that never decides

One of the bounds written in AC1 can never be the *only* reason a request is rejected. Which one,
and why?

- **Draft answer for student review:** `0 <= start` can never be the only failed condition. The contract guarantees `now` is in 0–1439, so `now >= 0`. Any request meeting the required `start > now` automatically has `start > 0`. A negative start violates both requirements at once; removing the explicit lower-bound term would not change decisions for valid `now`. Keeping it is still helpful because AC1 writes the complete bound and a reviewer can compare the implementation directly with the requirement.


---

## 10. Conclusion (120–180 words)

<!-- Answer all three, in your own words, without the assistant:
     (a) Explain the overlap condition in your final code — why those two comparisons, and why
         they let touching bookings through.
     (b) Which fault did your tests miss the longest, and what did the missing test have in common
         with the ones you already had?
     (c) What did you have to decide that neither the contract nor the assistant decided for you?
     Worthless: "the AI made a mistake and I fixed it."
     Worth everything: "F7 failed on can_book(570, 600, ...): v1 compared with <= on the start
     side, so a booking that ends exactly when another begins was rejected." -->

<!-- Write your conclusion below this line -->
The final function uses two strict comparisons to detect overlap: the new start must be earlier than an existing end, and the new end must be later than an existing start. Both conditions must hold. With half-open intervals, equality means two bookings only touch, so both touching cases are accepted. The first implementation used inclusive comparisons and rejected those boundaries incorrectly. The hardest gap to notice was an otherwise free slot that touched bookings on both sides. Most earlier tests checked overlapping or clearly separated intervals, which would not distinguish inclusive from strict comparisons. The extra tests made this difference measurable. I also had to decide how to discuss values outside the input contract. Integer minutes are required, but the contract gives no policy for a float or string. The solution does not silently round either value and does not promise a uniform outcome for invalid types. The tests, rather than the generated explanation, established which booking decisions were correct
