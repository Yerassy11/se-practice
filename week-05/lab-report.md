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
| 1 | | | | | | | |
| 2 | | | | | | | |
| 3 | | | | | | | |
| 4 | | | | | | | |
| 5 | | | | | | | |
| 6 | | | | | | | |
| 7 | | | | | | | |
| 8 | | | | | | | |
| 9 | | | | | | | |
| 10 | | | | | | | |
| 11 | | | | | | | |

---

## 5. Task 4 — debugging with evidence

One row per defect you found — in v1, in a later version, or in your own tests. If v1 passed
everything, the row is the **new edge case you added**, with expected and actual equal, and the
cause column says why no change was needed.

| # | Input (the full call) | Expected | Actual | Cause (quote the line) | Fix | Who proposed the fix |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | | | | | | |

**The debug prompt I sent, and the assistant's answer** (leave the block empty if you did not use it):

```text
```

---

## 6. Task 5 — the critique

**The assistant's critique, pasted unedited:**

```text
(paste here)
```

| # | Suggestion | accept / reject | Reason — cite the AC or the contract line | Suite after the change |
| --- | --- | --- | --- | --- |
| 1 | | accept / reject | | |
| 2 | | accept / reject | | |

---

## 7. Change log — v1 to final

| # | What changed (the line, before → after) | Why | Evidence: the test or check that moved |
| --- | --- | --- | --- |
| 1 | | | |

---

## 8. Evidence — real output

### 8.1 My suite, final run

Paste the **complete** terminal output. For Python: everything `python -m unittest -v` printed.

```text
(paste here)
```

### 8.2 The checker, final run

Paste the **complete** output of `python tests/check_booking.py`. Paste it **last**: if you edit
this file afterwards, run the checker again and paste again.

```text
(paste here)
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
| | |

### 9.2 Outside the contract

The contract says times are integers. It does not say what `can_book` does when one is not —
`600.5`, or the string `"600"`. What does **your** function do, and why is that the right call?

-

### 9.3 A bound that never decides

One of the bounds written in AC1 can never be the *only* reason a request is rejected. Which one,
and why?

-

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
