# SIS #05 — Report

**Name:** Khudaibergen Yerassyl
**Group:** Monday 16:00-19:00
**Date:** 2026-11-27

Fill in every section. **Do not delete, rename or renumber the headings.** The checker and the
grader find your answers by them. You can add rows to any table, but never remove its header.

---

## 1. Setup and the project

| | |
| --- | --- |
| Project (name, and what it does in one line) | Smart Campus Room Availability — a Python function that checks whether a room is available for a requested time interval. |
| Language and stack | Python 3; standard library; `unittest` for automated tests. |
| Where it comes from (my own / Smart Campus / other: say what) | Smart Campus, adapted from Practice 05. |
| Baseline commit — the project brought in unchanged (§3 of the README) | fab6995 |
| Assistant (tool) | ChatGPT |
| Exact model (with its version, or `not displayed`) | `gpt-6-astra` (the model used for this baseline/context update). |
| Where I ran the commands (my computer / Codespace / Bolt terminal / …) | Local Windows computer, PowerShell through ChatGPT/Codex; working directory: `C:\Users\Acer\Desktop\SE\sis-05\project`. |

---

## 2. Task 1 — baseline and context

### 2.1 Repository map

Real paths in `project/`.

| Part | Where (paths) and what it does |
| --- | --- |
| Entry points | `project/booking.py` exposes `can_book(start, end, now, blocked, existing)`. It is an importable function; there is no command-line interface or application UI. |
| Modules | `project/booking.py` checks the requested interval, current time, 120-minute limit, blocked status, and overlaps. `project/README.md` documents the purpose, rules, requirements, and test command. |
| Dependencies (and where they are declared) | Python standard library only: `project/test_booking.py` imports `unittest` and the local `booking` module. No third-party runtime dependencies or dependency manifest; Python 3 is documented in `project/README.md`. |
| Tests | `project/test_booking.py` contains 32 `unittest` cases covering boundaries, duration, blocked rooms, overlaps, boolean results, and unchanged booking data. |
| Build / run scripts | No separate build or run scripts. From `project/`: `py -m unittest -v` runs tests; `py -m py_compile booking.py` checks syntax (not a packaged build). A direct Python import and function call runs an availability check. |

### 2.2 Commands

At least three. **Kind:** `test`, `lint`, `type`, `build` or `run`. **Exists:** `yes` / `no`.
**Result:** `pass`, `fail`, `missing` or `not run` (say why in the note).

| Command | Kind | Exists | Result | Note |
| --- | --- | --- | --- | --- |
| `py -m unittest -v` | test | yes | pass | 32 tests, all OK. Full output below. |
| `py -m py_compile booking.py` | build | yes | pass | Syntax compilation only; exit code 0 and no output. The project has no separate build pipeline. |
| `py -c "from booking import can_book; print(can_book(660, 720, 540, False, [(600, 660)]))"` | run | yes | pass | Printed `True`: a request from 11:00 to 12:00 can touch an existing booking ending at 11:00. |
| No configured lint command | lint | no | missing | No lint script or configuration in the project baseline. |

The first sandboxed test attempt returned `No installed Python found!`. The same command was rerun with permission outside the sandbox, where the installed Python was available. The results above refer to the successful local runs. `git diff fab6995 -- sis-05/project` was empty: the source, tests, and README still match the baseline.

### 2.3 Baseline output

The **real** output of the baseline test run (or of running the program, if there were no tests):

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

OK
```

### 2.4 Weaknesses and missing checks

At least three. **Evidence:** a file and line, or a command and its output. **Kind:** `fact` (you saw
it) or `assumption` (not yet shown).

| # | Weakness or missing check | Evidence | Kind |
| --- | --- | --- | --- |
| 1 | No configured linter or lint command for this project. | `Get-ChildItem -LiteralPath sis-05/project -Force` showed only `booking.py`, `test_booking.py`, and `README.md` before test execution. The README documents tests but no lint command; no lint configuration appears in the repository file inventory. `py_compile` checks syntax, not lint rules or types. | fact |
| 2 | No GitHub Actions workflow in this checkout to run the booking tests on push. | From the repository root, `Test-Path -LiteralPath '.github/workflows'` returned `False`. This confirms the missing repository workflow; externally configured CI services were not inspected. | fact |
| 3 | Limited diagnostic output: callers cannot distinguish rejection reasons from the return value. | `project/booking.py:2–12` returns the same `False` for invalid intervals, past starts, excessive duration, blocked rooms, and overlap; line 13 returns `True`. This is a diagnostic limitation of the current Boolean API, not proof of an incorrect booking decision. | fact |

A missing boundary test was not selected: `project/test_booking.py` already covers 120/121 minutes (lines 22/27), start equal to now (line 32), end at/after 1440 (lines 47/52), and touching endpoints (lines 7/112/132).

### 2.5 Acceptance criteria

Three to five things that must still be true after every change, and how you check each one.

| ID | Must remain true | How I check it (a test, a command, a step) |
| --- | --- | --- |
| AC1 | Reject invalid time intervals, intervals outside 0–1440, and starts at or before the current time. | Run `py -m unittest -v`; inspect the zero-length, reversed, negative-start, end-after-1440, past-start, and start-equal-now cases. |
| AC2 | Allow a duration of exactly 120 minutes and reject longer requests. | `test_exactly_120_minutes_allowed` and `test_121_minutes_rejected`. |
| AC3 | Reject blocked rooms, including when there are no existing bookings. | `test_blocked_room_rejected` and `test_blocked_with_empty_bookings_rejected`. |
| AC4 | Reject overlapping bookings while allowing intervals that only touch endpoints. | Overlap tests plus `test_touching_end_is_allowed`, `test_touch_existing_start_allowed`, and `test_touch_both_neighbours_allowed`. |
| AC5 | Return a boolean without changing or reordering existing booking data. | `test_return_bool_true`, `test_return_bool_false`, `test_accepted_existing_list_unchanged`, and `test_rejected_existing_list_unchanged`. |

AC1–AC5 are the acceptance contract throughout SIS-05. Run the same booking tests after each refactoring or mitigation to verify that these rules still hold.

---

## 3. Task 2 — agent instructions

### 3.1 The file and how the assistant reads it

| | |
| --- | --- |
| File (`project/AGENTS.md` or `project/CLAUDE.md`) | `project/AGENTS.md` |
| Created or improved? | Created for SIS-05; the file was absent from the baseline. |
| Does the assistant load it by itself? (`yes` / `no, I pasted it` / `not sure, I pasted it`) | no, I pasted it |

### 3.2 What it covers

Where each topic is in the file (the heading, or the line).

| Topic | Where in the file |
| --- | --- |
| Purpose | `project/AGENTS.md` → `Purpose` |
| Architecture | `project/AGENTS.md` → `Architecture` |
| Setup | `project/AGENTS.md` → `Setup` |
| Safe commands | `project/AGENTS.md` → `Safe Commands` |
| Coding conventions | `project/AGENTS.md` → `Coding Conventions` |
| Test expectations | `project/AGENTS.md` → `Test Expectations` |
| Forbidden actions | `project/AGENTS.md` → `Forbidden Actions` |

---

## 4. Task 3 — a focused pattern decision

### 4.1 The maintainability problem

<!-- One problem: the file and lines, and why it makes the code harder to change. Write below this line -->

`project/booking.py` centralizes all booking policies in `can_book`: interval bounds at lines 2–3, the future-start rule at lines 4–5, the 120-minute limit at lines 6–7, blocked status at lines 8–9, and overlap checks at lines 10–12. Changing any policy requires editing the same function. This is a potential maintenance problem if different room types later need independent policy sets; the current code does not demonstrate that requirement. The function is only 13 lines long, and no duplicated implementation was found in this project.

### 4.2 The pattern I evaluated

<!-- Strategy, Adapter, or another you can name; what it would change for this problem. Write below this line -->

Strategy could move an entire booking policy into an interchangeable callable or implementation, allowing a caller to select different rule sets. In Python this would not require classes, but it would still introduce a policy interface, a selection point, and additional tests. The current project has one fixed set of acceptance criteria, AC1–AC5, and no caller that needs to switch policies. Splitting each condition into a separate strategy would also make the order and combination of checks harder to follow without solving an existing variation problem.

### 4.3 My decision, before and after

**Decision:** not warranted

<!-- Why, and the structure before and after (functions, modules, or a diagram in a code block). Write below this line -->

Keep the existing function. Its short sequence of early returns makes the rejection rules easy to inspect together. A Strategy refactoring would add indirection and parameters without removing duplication or supporting a current requirement. Even a small extraction is not justified solely by a possible future policy change. Revisit this decision if the project actually gains multiple interchangeable policy sets.

Before and after are identical: `booking.py` exports one `can_book(start, end, now, blocked, existing)` function, and `test_booking.py` imports it directly. No classes, modules, dependencies, signatures, or booking rules were changed.

### 4.4 The acceptance criteria still hold

The real output of the same checks, run after the decision:

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

OK
```

Command: `py -m unittest -v`, run from `sis-05/project/`; exit code 0. All 32 original tests passed, including the interval and future-start checks (AC1), duration checks (AC2), blocked-room checks (AC3), overlap and touching checks (AC4), and Boolean-result and input-integrity checks (AC5).

---

## 5. Task 4 — read-only AI risk review

### 5.1 The review

How you made sure the assistant could not modify files, and what it was given:

<!-- Write below this line -->

What you sent, exactly:

```text
(paste here)
```

The answer, pasted unedited:

```text
(paste here)
```

### 5.2 The findings, investigated

At least **five**, across at least **three** categories: `correctness`, `maintainability`, `security`,
`dependency`, `agent operations`. **Label:** `confirmed`, `plausible` or `unsupported`.

| # | Finding (short) | Category | What I opened or ran | Label | Evidence or why not |
| --- | --- | --- | --- | --- | --- |
| 1 | | | | | |
| 2 | | | | | |
| 3 | | | | | |
| 4 | | | | | |
| 5 | | | | | |

---

## 6. Task 5 — risk register

### 6.1 The register

At least five risks, at least two `confirmed`. **Component:** a path in `project/`, or
`missing: <check>`. **Score = L × I.**

| ID | Category | Cause → event → consequence | Component | Evidence | Status | L | I | Score | Mitigation | Owner | Verification plan |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| R1 | | | | | | | | | | | |
| R2 | | | | | | | | | | | |
| R3 | | | | | | | | | | | |
| R4 | | | | | | | | | | | |
| R5 | | | | | | | | | | | |

### 6.2 The top two for action

Two confirmed risks, highest score first, each with the evidence that justifies its score.

1. **R?** —
2. **R?** —

---

## 7. Task 6 — agent-readiness audit

### 7.1 The rows

`yes` or `no`, and the evidence (README §10).

| Row | What | yes / no | Evidence |
| --- | --- | --- | --- |
| 1a | Tests, one command | | |
| 1b | Lint or type check | | |
| 1c | Build or run from a clean copy | | |
| 1d | Pinned dependencies | | |
| 2a | README accurate | | |
| 2b | Reproducible setup | | |
| 2c | `AGENTS.md` with safe commands and forbidden actions | | |
| 3a | CI | | |
| 3b | Logging an agent can read | | |
| 3c | Security safeguards | | |
| 3d | Review gate before merge | | |

### 7.2 The level and the missing evidence

**Level:** (0, 1, 2 or 3 — by the 80% rule)

**Missing evidence for the next level:**

<!-- Name the rows and what would have to exist. -->
-

---

## 8. Task 7 — two mitigations and verification

### 8.1 The first mitigation

**Risk:** R?

**What I changed, and what I rejected from the assistant's proposal:**

The test that fails before the fix (or why a test is not feasible):

```text
(paste here)
```

The diff (`git diff`):

```text
(paste here)
```

### 8.2 The second mitigation

**Risk:** R?

**What I changed, and what I rejected from the assistant's proposal:**

The test that fails before the fix (or why a test is not feasible):

```text
(paste here)
```

The diff (`git diff`):

```text
(paste here)
```

### 8.3 The final checks

The real output of the final test run (and any other check you ran):

```text
(paste here)
```

Tests and checks I did not run, and why:

<!-- Write below this line. "None" only if it is true. -->

### 8.4 Updated scores and what remains

| ID | L before | I before | Score before | L after | I after | Score after | Evidence |
| --- | --- | --- | --- | --- | --- | --- | --- |
| | | | | | | | |
| | | | | | | | |

**Remaining limitations and trade-offs:**

<!-- Write below this line -->

---

## 9. Tasks 8–9 — background-agent safeguards and the release decision

### 9.1 A hypothetical background-agent task

| Safeguard | For this project |
| --- | --- |
| The task | |
| Isolation (branch or worktree) | |
| Allowed files | |
| Commands | |
| Time limit | |
| Prohibited operations | |
| Required artifacts | |
| Human approval, failure and rollback | |

### 9.2 Release decision

**Decision:** GO / CONDITIONAL / NO-GO

<!-- Keep one word above. GO is not allowed while any confirmed risk still scores 6 or more.
     Then 80-150 words: the test evidence, the register, the readiness level. Name at least two
     risk IDs. -->

<!-- Write your justification below this line -->

---

## 10. AI reflection

<!-- 200-300 words, in your own words, without the assistant. Answer all four:
     1. Which assistant and model did you use, and what context did it receive?
     2. One useful AI suggestion, and one inaccurate, weak or unverified one.
     3. What did you personally check, and how did the tests change your decisions?
     4. Did AGENTS.md improve the process? What should improve next?
     Worthless: "The AI was very helpful and saved me a lot of time."
     Worth everything: "Claude (claude-sonnet-5-5) got the README, AGENTS.md and the diff. Its R1,
     eval on the shares field, was right: test_R1 failed before the fix. Its claim that the tests
     were flaky was unsupported: ten runs, ten passes." -->

<!-- Write your reflection below this line -->

---

## 11. AI evidence appendix

At least **three** complete exchanges.

### 11.1 Exchange 1

| | |
| --- | --- |
| Tool and date | |
| Exact model | |
| Prompt (summary) | |
| Output I used | |
| Problems I found in it | |
| Changes I made | |
| How I verified it | |

### 11.2 Exchange 2

| | |
| --- | --- |
| Tool and date | |
| Exact model | |
| Prompt (summary) | |
| Output I used | |
| Problems I found in it | |
| Changes I made | |
| How I verified it | |

### 11.3 Exchange 3

| | |
| --- | --- |
| Tool and date | |
| Exact model | |
| Prompt (summary) | |
| Output I used | |
| Problems I found in it | |
| Changes I made | |
| How I verified it | |

### 11.4 Checks I am keeping as FAIL or ERROR

Use the same IDs as `known_fails` in `submission.yml`. Write `none` if the run is clean.

| Check | Why it stays |
| --- | --- |
| | |
