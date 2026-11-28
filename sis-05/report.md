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

 report  using a separate ChatGPT chat with the contents of `project/booking.py`, `project/test_booking.py`, `project/README.md`, and `project/AGENTS.md`, following the supplied screenshot.GPT-6 Astra is user




What you sent, exactly:

```text
Act as a read-only code reviewer for my Smart Campus Room Availability project.Review correctness, maintainability, security, dependencies, and agent operations.Identify at least seven concrete candidate findings across at least three categories.For each finding provide:
• Affected file and code evidence
• Category
• Impact
• Reproduction or verification method
• Minimal recommendation
Do not modify any files.
Do not invent test results.
Do not introduce features outside the current project scope.
Distinguish confirmed evidence from hypotheses.Project files and AGENTS.md are provided below.
```

The answer, pasted unedited:

````text
# **Smart Campus Room Availability — Read-Only Code Review**

## **1. Review scope**

The review covers the implementation, unit tests, project documentation, dependencies, and agent operation policies.

| File              | Review scope                                               |
| ----------------- | ---------------------------------------------------------- |
| `booking.py`      | Business logic, input validation, correctness and security |
| `test_booking.py` | Test coverage and reliability                              |
| `README.md`       | Documentation, requirements and reproducibility            |
| `AGENTS.md`       | Agent instructions, operational safety and constraints     |

The review preserves the existing `can_book` signature, acceptance criteria AC1–AC5, and the read-only architecture.

**Review approach:** Static code analysis. Confirmed findings are supported by the supplied source code. Hypotheses describe potential problems whose relevance depends on the intended input contract or execution environment.

## **2. Summary of candidate findings**

| ID  | Finding                                        | Category         | Severity | Status             |
| --- | ---------------------------------------------- | ---------------- | -------- | ------------------ |
| F01 | Invalid input types can cause exceptions       | Correctness      | Medium   | Confirmed behavior |
| F02 | Current time is not validated                  | Correctness      | Medium   | Confirmed behavior |
| F03 | NaN can bypass current-time validation         | Security         | Medium   | Confirmed behavior |
| F04 | Existing booking intervals are not validated   | Correctness      | Medium   | Confirmed behavior |
| F05 | Blocked status accepts non-Boolean values      | Correctness      | Low      | Confirmed behavior |
| F06 | Input contract is insufficiently documented    | Maintainability  | Low      | Confirmed          |
| F07 | Missing tests for malformed inputs             | Testing          | Medium   | Confirmed          |
| F08 | Duplicated test scenarios                      | Maintainability  | Low      | Confirmed          |
| F09 | Python version is insufficiently specified     | Dependencies     | Low      | Confirmed          |
| F10 | Approved commands may create files             | Agent operations | Low      | Conditional risk   |
| F11 | Agent instructions lack a review-only workflow | Agent operations | Low      | Confirmed          |

Severity is based on potential impact. Confirmed behavior does not necessarily mean a confirmed acceptance-criteria violation, particularly when the input contract is unspecified.

## **3. Detailed findings**

### **F01 — Invalid input types can cause exceptions**

Medium

Correctness · Confirmed through static analysis

**Affected file:** `booking.py`, lines 1–3.

**Code evidence:**

```
def can_book(start, end, now, blocked, existing):    if not (0 <= start < end <= 1440):        return False
```

The function performs numeric comparisons without checking input types.&#x20;

booking.py



**Impact:** Invalid input can interrupt the availability check instead of returning a Boolean.

**Reproduction method:**

```
can_book("660", 720, 540, False, [])
```

Predicted behavior: `TypeError`.

**Minimal recommendation:** Clarify the accepted input types and introduce basic validation if malformed inputs are expected to be rejected.

### **F02 — Current time is not validated**

Medium

Correctness · Confirmed through static analysis

**Affected file:** `booking.py`, lines 2–5.

**Code evidence:**

```
if not (0 <= start < end <= 1440):    return Falseif start <= now:    return False
```

The function validates the requested interval but does not validate the range of `now`.&#x20;

booking.py



**Impact:** An invalid current time can result in an incorrect availability decision.

**Reproduction method:**

```
can_book(60, 120, -10, False, [])
```

Predicted result: `True`, despite the negative current time.

**Minimal recommendation:** Validate that `now` belongs to the documented daily time range if the function is responsible for validating all time inputs.

### **F03 — NaN can bypass current-time validation**

Medium

Security / Input validation · Confirmed through static analysis

**Affected file:** `booking.py`, lines 4–5.

**Code evidence:**

```
if start <= now:    return False
```

Comparisons against floating-point NaN evaluate to `False` in this case.&#x20;

booking.py



**Impact:** Invalid numerical data can bypass the current-time restriction. If untrusted input reaches this function, it could produce an incorrect availability decision.

**Reproduction method:**

```
can_book(600, 660, float("nan"), False, [])
```

Predicted result: `True`.

**Minimal recommendation:** Reject non-finite numerical values or restrict time parameters to integers if whole-minute precision is the intended contract.

**Limitation:** The source confirms the validation weakness, but external exploitability is hypothetical because no API or user-input integration was provided.

### **F04 — Existing booking intervals are not validated**

Medium

Correctness · Confirmed through static analysis

**Affected file:** `booking.py`, lines 10–13.

**Code evidence:**

```
for booked_start, booked_end in existing:    if start < booked_end and end > booked_start:        return Falsereturn True
```

The overlap calculation assumes that every existing booking contains two valid, correctly ordered time values.&#x20;

booking.py



**Impact:** Malformed booking records may cause exceptions or incorrect availability decisions.

**Reproduction method:**

```
can_book(600, 660, 540, False, [(700,)])
```

Predicted behavior: `ValueError` because the booking cannot be unpacked into two values.

Another example:

```
can_book(600, 660, 540, False, [(650, 610)])
```

Predicted result: `False`, even though the existing interval is invalid.

**Minimal recommendation:** Document that existing bookings must be validated by the caller, or introduce minimal validation within `can_book` if required by the input contract.

### **F05 — Blocked status accepts non-Boolean values**

Low

Correctness · Confirmed through static analysis

**Affected file:** `booking.py`, lines 8–9.

**Code evidence:**

```
if blocked:    return False
```

Python evaluates the truthiness of the supplied value rather than requiring an actual Boolean.&#x20;

booking.py



**Impact:** Incorrectly formatted blocked status values may produce unexpected results.

**Reproduction method:**

```
can_book(600, 660, 540, "False", [])
```

Predicted result: `False`, because a non-empty string is truthy.

```
can_book(600, 660, 540, None, [])
```

Predicted result: `True`.

**Minimal recommendation:** Document that `blocked` must be a Boolean and enforce this requirement if inputs are not validated elsewhere.

### **F06 — Input contract is insufficiently documented**

Low

Maintainability · Confirmed

**Affected files:** `booking.py`, line 1; `README.md`, lines 15–20.

**Code evidence:**

```
def can_book(start, end, now, blocked, existing):
```

The function has no docstring or type annotations. The README describes the booking rules but does not explicitly define the accepted parameter types or handling of malformed inputs.&#x20;

booking.py

README(2).md



**Impact:** Developers and AI agents may make different assumptions about valid input, especially regarding fractional minutes, Boolean values and malformed booking records.

**Verification method:** Inspect the function declaration and README parameter documentation.

**Minimal recommendation:** Add a short docstring or README section defining the five existing parameters and their accepted values without changing the function signature.

### **F07 — Missing tests for malformed inputs**

Medium

Testing · Confirmed coverage gap

**Affected file:** `test_booking.py`, lines 7–169.

**Code evidence:**

The existing tests cover valid intervals, overlapping bookings, blocked rooms, duration restrictions, daily boundaries and non-mutation.

For example:

```
def test_negative_start_rejected(self):    result = can_book(-1, 30, 540, False, [(600, 660)])    self.assertIs(result, False)
```

However, no test explicitly verifies malformed parameter types, negative `now`, NaN or invalid existing booking structures.&#x20;

test_booking(1).py



**Impact:** The test suite cannot detect regressions related to these input-validation scenarios.

**Verification method:** Inspect all test methods and compare their input scenarios with F01–F05.

Potential regression inputs include:

```
can_book(600, 660, -1, False, [])can_book(600, 660, float("nan"), False, [])can_book("600", 660, 540, False, [])can_book(600, 660, 540, False, [(600,)])
```

**Minimal recommendation:** Establish the expected behavior for malformed inputs and add targeted tests for confirmed requirements.

### **F08 — Duplicated test scenarios**

Low

Maintainability · Confirmed

**Affected file:** `test_booking.py`, lines 7–15 and 147–155.

**Code evidence:**

```
def test_touching_end_is_allowed(self):    result = can_book(660, 720, 540, False, [(600, 660)])    self.assertIs(result, True)
```

```
def test_return_bool_true(self):    result = can_book(660, 720, 540, False, [(600, 660)])    self.assertIs(result, True)
```

Both tests execute identical inputs and assertions. The same duplication exists between `test_partial_overlap_rejected` and `test_return_bool_false`.&#x20;

test_booking(1).py

test_booking(1).py



**Impact:** Increases the test count without increasing behavioral coverage and introduces minor maintenance overhead.

**Verification method:** Compare the function arguments and assertions in both pairs of tests.

**Minimal recommendation:** Retain explicit AC4 and AC5 traceability, but consider using distinct scenarios for the Boolean-return tests. Do not remove required acceptance-criteria evidence.

### **F09 — Python version is insufficiently specified**

Low

Dependencies / Reproducibility · Confirmed

**Affected files:** `README.md`, lines 11–13; `AGENTS.md`, lines 11–13.

**Evidence:**

```
Python 3. No third-party packages are required.
```

Neither document specifies a minimum supported or verified Python version.&#x20;

README(2).md

AGENTS(1).md



**Impact:** Developers and agents may use different Python versions, reducing environment reproducibility.

**Verification method:**

```
py --version
```

Compare the installed interpreter version with the documented requirements.

**Minimal recommendation:** Document the minimum supported or actually verified Python version.

No third-party dependencies need to be introduced.

### **F10 — Approved commands may create files**

Low

Agent operations · Conditional risk

**Affected file:** `AGENTS.md`, lines 15–18.

**Evidence:**

```
## Safe Commands
Run from the project directory:
- py -m unittest -v
- py -m py_compile booking.py
```

The instructions classify both commands as safe. However, `py_compile` normally generates bytecode files, while running unit tests may also generate `__pycache__` files during imports.&#x20;

AGENTS(1).md



**Impact:** An agent performing a strictly read-only review may unintentionally create or update filesystem artifacts.

**Verification method:** Inspect the commands and their bytecode-generation behavior. In a separately authorized environment, compare filesystem contents before and after execution.

**Minimal recommendation:** Distinguish non-destructive commands from strictly read-only commands. For example, a future read-only test execution could use:

```
py -B -m unittest -v
```

The `-B` option prevents normal bytecode-cache writes during imports. Explicit compilation should be excluded from strictly read-only reviews.

### **F11 — Agent instructions lack a review-only workflow**

Low

Agent operations · Confirmed documentation gap

**Affected file:** `AGENTS.md`, lines 26–37.

**Evidence:**

```
- Run all unit tests after each change.
- Preserve AC1–AC5.
- Add a regression test when fixing a confirmed defect.
- Review the diff before accepting any AI-generated change.
```

The document provides instructions for implementing and reviewing changes but does not explicitly distinguish review-only tasks from modification tasks.&#x20;

AGENTS(1).md



**Impact:** An insufficiently controlled agent could interpret an identified defect as authorization to modify the implementation or add regression tests.

This is a potential operational risk, not evidence that an agent has already performed unauthorized modifications.

**Verification method:** Inspect `AGENTS.md` for an explicit review-only procedure and file-modification restrictions applicable to review tasks.

**Minimal recommendation:** Add a short instruction such as:

```
During read-only reviews, report findings and verification
methods without modifying files. Apply fixes only after
explicit human approval.
```

## **4. Positive review findings**

The following aspects of the implementation are correctly designed based on static inspection.

| Aspect                     | Assessment                                                                                |
| -------------------------- | ----------------------------------------------------------------------------------------- |
| AC1 — Time validation      | Correct for valid numeric inputs                                                          |
| AC2 — Maximum duration     | Correctly permits exactly 120 minutes                                                     |
| AC3 — Blocked rooms        | Correct for Boolean inputs                                                                |
| AC4 — Overlapping bookings | Correct interval-overlap logic                                                            |
| AC4 — Touching endpoints   | Correctly permitted                                                                       |
| AC5 — Read-only behavior   | No explicit mutation of existing booking lists                                            |
| Dependencies               | Standard-library-only implementation                                                      |
| Performance                | O(n) time and O(1) auxiliary space for ordinary booking lists                             |
| Architecture               | Simple separation of implementation and tests                                             |
| Agent safety               | Explicit restrictions on secrets, deployment, destructive commands and dependency changes |

In particular, the overlap condition is correct and should be preserved:

```
if start < booked_end and end > booked_start:    return False
```

Using strict inequalities allows bookings to touch at their endpoints without being classified as overlapping.&#x20;

booking.py



## **5. Findings distribution**

Correctness

4

Maintainability

2

Agent operations

2

Security

1

Testing

1

Dependencies

1

Total findings

# **11**

Categories

# **6**

High severity

# **0**

## **6. Review limitations and compliance**

| Requirement                                    | Status                   |
| ---------------------------------------------- | ------------------------ |
| Identify at least seven candidate findings     | Satisfied — 11 findings  |
| Cover at least three categories                | Satisfied — 6 categories |
| Provide code evidence                          | Satisfied                |
| Explain impact                                 | Satisfied                |
| Provide reproduction or verification methods   | Satisfied                |
| Provide minimal recommendations                | Satisfied                |
| Distinguish confirmed evidence from hypotheses | Satisfied                |
| Preserve project scope                         | Satisfied                |
| Do not modify files                            | Satisfied                |
| Do not invent test results                     | Satisfied                |
| Do not install dependencies                    | Satisfied                |

**Execution status:** All four supplied files were inspected. No tests, compilation, dependency installation or deployment commands were executed. The reproduction outcomes are static predictions, not observed execution results.

The full repository, Git history, proposed diff and upstream input-validation mechanisms were not provided. Therefore, repository-wide compliance and external exploitability cannot be verified.

## **7. Conclusion**

The Smart Campus Room Availability project demonstrates a simple and maintainable implementation of its documented booking rules. No definite violation of AC1–AC5 was identified for valid inputs.

The review identified 11 candidate findings across six categories. The most significant concerns relate to input validation, malformed booking records and missing regression coverage. Additional improvements concern documentation, reproducibility and agent operational safety.

Before implementing validation changes, the intended input contract should be clarified to avoid expanding the project beyond its current requirements.

**No files were modified, and no test execution results were fabricated.**
````

### 5.2 The findings, investigated

At least **five**, across at least **three** categories: `correctness`, `maintainability`, `security`,
`dependency`, `agent operations`. **Label:** `confirmed`, `plausible` or `unsupported`.

The labels below come from local verification, not the reviewer's labels. A confirmed behavior on malformed input does not establish a violation for valid inputs. The malformed-input contract needs agreement before implementing stricter validation.

| # | Finding (short) | Category | What I opened or ran | Label | Evidence or why not |
| --- | --- | --- | --- | --- | --- |
| 1 | F01: a string start raises an exception. | correctness | Read `project/booking.py:2`; ran the string-start probe below. | confirmed | Observed `TypeError` instead of a Boolean. Caller validation and supported malformed-input behavior are not documented. |
| 2 | F02: negative current time is accepted. | correctness | Read `project/booking.py:2–5`; called `can_book(60, 120, -10, False, [])`. | confirmed | Observed `True`; no range check on `now`. This confirms missing validation, not a valid-input regression. |
| 3 | F03: NaN could bypass a time gate exposed to untrusted callers. | security | Read `project/booking.py:4`; ran the NaN probe; inspected the supplied project files. | plausible | The call returned `True`, confirming the numerical behavior. No API or untrusted input path exists in the supplied project, so external exploitability remains unverified. |
| 4 | F04: malformed existing records are not validated. | correctness | Read `project/booking.py:10–12`; ran both existing-record probes. | confirmed | `[(700,)]` raised `ValueError`; reversed `[(650, 610)]` returned `False` without distinguishing malformed data from a real overlap. |
| 5 | F05: blocked status uses truthiness rather than a Boolean check. | correctness | Read `project/booking.py:8`; ran string and None probes. | confirmed | String `'False'` returned `False`; `None` returned `True`. These inputs are not specified by the current contract. |
| 6 | F06: parameter types and invalid-input behavior are undocumented. | maintainability | Read all of `project/booking.py` and `project/README.md`. | confirmed | No docstring or annotations at `booking.py:1`. README describes rules and minute units but not all five parameter types or exception/rejection behavior. |
| 7 | F07: no regression coverage for malformed inputs. | correctness | Inspected every method in `project/test_booking.py:7–169`. | confirmed | The 32 tests cover boundaries and normal rules, but not strings, negative/NaN `now`, or malformed booking tuples. Add expectations only after agreeing the input contract. |
| 8 | F08: two pairs of tests repeat identical calls and assertions. | maintainability | Compared `project/test_booking.py:7–15` with lines 147–155. | confirmed | Touching-end and Boolean-true tests use the same arguments and `assertIs(..., True)`; partial-overlap and Boolean-false tests likewise duplicate each other. This is minor duplication, not missing AC4/AC5 coverage. |
| 9 | F09: verified Python version is not documented. | dependency | Read README Requirements and AGENTS Setup; printed the running interpreter version below. | confirmed | Both say Python 3; the actual interpreter was 3.13.5. No incompatibility was reproduced and there are no third-party dependencies to pin. |
| 10 | F10: approved commands could write cache files during a strict read-only review. | agent operations | Inspected `project/AGENTS.md` → Safe Commands; local probes used `py -B`. | plausible | Normal tests and explicit compilation are listed without a read-only distinction. No before/after filesystem experiment with those commands was performed in this review; Git alone does not prove absence of ignored-file writes. |
| 11 | F11: instructions lack a review-only procedure. | agent operations | Read the complete `project/AGENTS.md`, especially Test Expectations and Forbidden Actions. | confirmed | No explicit review-only mode or rule to defer fixes until authorized. No actual unauthorized edit was observed; that consequence is hypothetical. |

The reviewer did not claim touching-endpoint tests were absent. They exist at `project/test_booking.py:7`, `:112`, and `:132`; a missing-touching-test claim would be unsupported.

Local reproduction evidence (2026-11-28): run from `sis-05/project/`. The script was passed to `py -B -c $verificationCode` using a PowerShell literal here-string; it was not saved as a project file. The exceptions are caught to report each probe, so exit code 0 means the probe script completed, not that malformed-input behavior passed an agreed contract.

```python
import sys
from booking import can_book
print('Python: ' + sys.version.split()[0])
cases = [
    ('F01 string start', ('660', 720, 540, False, [])),
    ('F02 negative now', (60, 120, -10, False, [])),
    ('F03 NaN now', (600, 660, float('nan'), False, [])),
    ('F04 short record', (600, 660, 540, False, [(700,)])),
    ('F04 reversed record', (600, 660, 540, False, [(650, 610)])),
    ('F05 string False', (600, 660, 540, 'False', [])),
    ('F05 None', (600, 660, 540, None, [])),
]
for label, args in cases:
    try:
        print(label + ': ' + repr(can_book(*args)))
    except Exception as exc:
        print(label + ': ' + type(exc).__name__ + ': ' + str(exc))
```

Full observed output:

```text
Python: 3.13.5
F01 string start: TypeError: '<=' not supported between instances of 'int' and 'str'
F02 negative now: True
F03 NaN now: True
F04 short record: ValueError: not enough values to unpack (expected 2, got 1)
F04 reversed record: False
F05 string False: False
F05 None: True
```

---

## 6. Task 5 — risk register

### 6.1 The register

At least five risks, at least two `confirmed`. **Component:** a path in `project/`, or
`missing: <check>`. **Score = L × I.**

These scores are proposed prioritization for this small local library, for the student developer to review. L is likelihood of the event (1 unlikely, 2 possible, 3 likely); I is impact (1 minor, 2 moderate, 3 serious). They are judgments, not measured probabilities. A confirmed status refers to the observed condition; the consequence is a possible future event. No public service, secret exposure, or real booking mutation was demonstrated.

| ID | Category | Cause → event → consequence | Component | Evidence | Status | L | I | Score | Mitigation | Owner | Verification plan |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| R1 | correctness | Scalar inputs lack a defined validation boundary → a caller supplies a string time, invalid now, or non-Boolean blocked value → the check raises or gives an unintended decision. | `project/booking.py:1–9`; `project/test_booking.py` | §5.2 F01/F02/F03/F05: TypeError for string start, True for negative/NaN now, truthiness for blocked; F07 has no malformed-input tests. | confirmed | 2 | 2 | 4 | Agree and document scalar types/ranges and invalid-input behavior; validate at the function boundary without changing its signature or valid-input rules. | Student developer | Add R1 regressions for the agreed invalid scalar cases; record FAIL before the fix and PASS after; run all 32 baseline tests for AC1–AC5. |
| R2 | correctness | Existing records are unpacked and compared without validation → malformed upstream booking data reaches the function → an exception or misleading availability decision occurs. | `project/booking.py:10–12`; `project/test_booking.py` | §5.2 F04: one-element tuple raised ValueError; reversed tuple was treated as an overlap. | confirmed | 2 | 2 | 4 | Define the existing-booking record contract and reject malformed records consistently; preserve touching-endpoint logic and input immutability. | Student developer | Add R2 tests for wrong tuple length, reversed records, and invalid endpoint types; show FAIL then PASS; rerun overlap, touching, and non-mutation tests. |
| R3 | maintainability | Parameter and failure contracts are missing from documentation → a maintainer or agent makes a different input assumption → changes become inconsistent with callers. | `project/booking.py:1`; `project/README.md` | §5.2 F06: no docstring, parameter specification, or invalid-input policy. | confirmed | 2 | 1 | 2 | Document all five parameters and agreed invalid-input handling, keeping documentation consistent with R1/R2. | Student developer | Review the docstring/README against implementation and regression expectations; retain the existing signature and AC1–AC5. |
| R4 | dependency | Requirements only say Python 3 → a contributor uses an unverified interpreter → results may be harder to reproduce or diagnose. | `project/README.md` → Requirements; `project/AGENTS.md` → Setup | §5.2 F09: locally verified version is 3.13.5, absent from both documents; no version failure was observed. | confirmed | 1 | 1 | 1 | Record the tested Python version; claim minimum-version support only after testing it. No new dependency is needed. | Student developer | Compare documented tested version with interpreter output and run the suite on that version. |
| R5 | agent operations | Agent instructions do not distinguish review from editing → an agent treats a review finding as permission to fix → the reviewed tree changes before human acceptance. | `project/AGENTS.md` → Test Expectations / Forbidden Actions | §5.2 F11: no explicit review-only workflow. Current verification left Git clean; unauthorized edits were not observed. | confirmed | 1 | 2 | 2 | Add a review-only procedure with permitted inspections, no file changes, before/after status, and explicit authorization before fixes. Distinguish safe commands from strictly read-only commands. | Student developer | Inspect the updated instructions and perform a review-only dry run; compare Git status and relevant file contents before and after. |

### 6.2 The top two for action

Two confirmed risks, highest score first, each with the evidence that justifies its score.

1. **R1** — L=2, I=2, score 4. The probes reproduced an exception and acceptance of invalid current times. A malformed caller value is possible, and losing a Boolean decision or accepting invalid time is a moderate functional impact. There is no deployed interface to justify a higher security impact. Scalar inputs affect every call, so R1 comes first.
2. **R2** — L=2, I=2, score 4. Malformed records caused an unpacking exception or an ambiguous rejection. Future caller-supplied records could trigger this, with a moderate impact on availability checking. It ties with R1 but concerns the existing-bookings collection specifically; keep its mitigation and regression evidence separate.

---

## 7. Task 6 — agent-readiness audit

### 7.1 The rows

`yes` or `no`, and the evidence (README §10).

| Row | What | yes / no | Evidence |
| --- | --- | --- | --- |
| 1a | Tests, one command | yes | `py -m unittest -v` passed 32 baseline tests (§2.3); `py -B -m unittest -v` also passes after R1 (§8.1). |
| 1b | Lint or type check | no | No configured lint/type command. `py_compile` only checks syntax. |
| 1c | Build or run from a clean copy | yes | Copied only `booking.py` into a new temporary directory and ran the touching-endpoint call with Python 3.13.5: `Clean-copy run: True`, `Exit: 0`. |
| 1d | Pinned dependencies | yes | `booking.py` has no external imports; tests use standard-library `unittest`. No third-party dependencies need pinning. |
| 2a | README accurate | yes | `project/README.md` describes the actual files and booking rules; its test command passed (§2.3). |
| 2b | Reproducible setup | no | README says only Python 3; verified version 3.13.5 and an interpreter setup procedure are not documented (R4). |
| 2c | `AGENTS.md` with safe commands and forbidden actions | yes | `project/AGENTS.md` contains all seven headings and prohibitions on secrets, deployment, destructive commands, and unreviewed dependency changes. |
| 3a | CI | no | `Test-Path -LiteralPath '.github/workflows'` returned `False`; no automatic push checks demonstrated. |
| 3b | Logging an agent can read | no | `can_book` returns only a Boolean and has no diagnostic messages. Verbose test output exists, but does not explain a rejected runtime request. |
| 3c | Security safeguards | yes | Local function has no network, credential, or persistence operations; `AGENTS.md` forbids committing secrets and production deployment. These are limited local safeguards, not a security certification. |
| 3d | Review gate before merge | no | `AGENTS.md` asks for diff review but does not require human approval before merge; no enforced repository gate was verified. |

### 7.2 The level and the missing evidence

**Level:** 0

**Missing evidence for the next level:**

<!-- Name the rows and what would have to exist. -->
- Level 1: 3/4 yes; ceil(0.8 × 4) = 4 required. Row 1b needs a configured, passing linter or type checker.
- Level 2: 2/3 yes; 3 required, after Level 1. Row 2b lacks a documented reproducible interpreter setup.
- Level 3: 1/4 yes; 4 required, after Level 2. Rows 3a, 3b, and 3d lack CI, runtime diagnostics, and a verified human merge gate.

---

## 8. Task 7 — two mitigations and verification

### 8.1 The first mitigation

**Risk:** R1

**What I changed, and what I rejected from the assistant's proposal:**

Added scalar validation: integer minute values (excluding Boolean values), now within 0–1440, and a Boolean blocked flag. Invalid inputs return False. The docstring records this policy; three `test_R1_` methods cover the malformed inputs. Chose function-boundary validation instead of leaving it to unspecified callers. No coercion, new dependencies, or signature changes.

The test that fails before the fix (or why a test is not feasible):

```text
test_R1_blocked_must_be_boolean (test_booking.BookingTests.test_R1_blocked_must_be_boolean) ... 
  test_R1_blocked_must_be_boolean (test_booking.BookingTests.test_R1_blocked_must_be_boolean) (blocked=None) ... FAIL
  test_R1_blocked_must_be_boolean (test_booking.BookingTests.test_R1_blocked_must_be_boolean) (blocked=0) ... FAIL
  test_R1_blocked_must_be_boolean (test_booking.BookingTests.test_R1_blocked_must_be_boolean) (blocked=[]) ... FAIL
  test_R1_blocked_must_be_boolean (test_booking.BookingTests.test_R1_blocked_must_be_boolean) (blocked={}) ... FAIL
test_R1_now_outside_day_rejected (test_booking.BookingTests.test_R1_now_outside_day_rejected) ... 
  test_R1_now_outside_day_rejected (test_booking.BookingTests.test_R1_now_outside_day_rejected) (now=-1) ... FAIL
test_R1_time_types_rejected (test_booking.BookingTests.test_R1_time_types_rejected) ... 
  test_R1_time_types_rejected (test_booking.BookingTests.test_R1_time_types_rejected) (field=0, value='600') ... ERROR
  test_R1_time_types_rejected (test_booking.BookingTests.test_R1_time_types_rejected) (field=0, value=None) ... ERROR
  test_R1_time_types_rejected (test_booking.BookingTests.test_R1_time_types_rejected) (field=0, value=600.5) ... FAIL
  test_R1_time_types_rejected (test_booking.BookingTests.test_R1_time_types_rejected) (field=1, value='600') ... ERROR
  test_R1_time_types_rejected (test_booking.BookingTests.test_R1_time_types_rejected) (field=1, value=None) ... ERROR
  test_R1_time_types_rejected (test_booking.BookingTests.test_R1_time_types_rejected) (field=1, value=600.5) ... FAIL
  test_R1_time_types_rejected (test_booking.BookingTests.test_R1_time_types_rejected) (field=2, value='600') ... ERROR
  test_R1_time_types_rejected (test_booking.BookingTests.test_R1_time_types_rejected) (field=2, value=None) ... ERROR
  test_R1_time_types_rejected (test_booking.BookingTests.test_R1_time_types_rejected) (field=2, value=True) ... FAIL
  test_R1_time_types_rejected (test_booking.BookingTests.test_R1_time_types_rejected) (field=2, value=nan) ... FAIL

======================================================================
ERROR: test_R1_time_types_rejected (test_booking.BookingTests.test_R1_time_types_rejected) (field=0, value='600')
----------------------------------------------------------------------
Traceback (most recent call last):
  File "C:\Users\Acer\Desktop\SE\sis-05\project\test_booking.py", line 13, in test_R1_time_types_rejected
    self.assertIs(can_book(*args), False)
                  ~~~~~~~~^^^^^^^
  File "C:\Users\Acer\Desktop\SE\sis-05\project\booking.py", line 2, in can_book
    if not (0 <= start < end <= 1440):
            ^^^^^^^^^^^^^^^^^^^^^^^^
TypeError: '<=' not supported between instances of 'int' and 'str'

======================================================================
ERROR: test_R1_time_types_rejected (test_booking.BookingTests.test_R1_time_types_rejected) (field=0, value=None)
----------------------------------------------------------------------
Traceback (most recent call last):
  File "C:\Users\Acer\Desktop\SE\sis-05\project\test_booking.py", line 13, in test_R1_time_types_rejected
    self.assertIs(can_book(*args), False)
                  ~~~~~~~~^^^^^^^
  File "C:\Users\Acer\Desktop\SE\sis-05\project\booking.py", line 2, in can_book
    if not (0 <= start < end <= 1440):
            ^^^^^^^^^^^^^^^^^^^^^^^^
TypeError: '<=' not supported between instances of 'int' and 'NoneType'

======================================================================
ERROR: test_R1_time_types_rejected (test_booking.BookingTests.test_R1_time_types_rejected) (field=1, value='600')
----------------------------------------------------------------------
Traceback (most recent call last):
  File "C:\Users\Acer\Desktop\SE\sis-05\project\test_booking.py", line 13, in test_R1_time_types_rejected
    self.assertIs(can_book(*args), False)
                  ~~~~~~~~^^^^^^^
  File "C:\Users\Acer\Desktop\SE\sis-05\project\booking.py", line 2, in can_book
    if not (0 <= start < end <= 1440):
            ^^^^^^^^^^^^^^^^^^^^^^^^
TypeError: '<' not supported between instances of 'int' and 'str'

======================================================================
ERROR: test_R1_time_types_rejected (test_booking.BookingTests.test_R1_time_types_rejected) (field=1, value=None)
----------------------------------------------------------------------
Traceback (most recent call last):
  File "C:\Users\Acer\Desktop\SE\sis-05\project\test_booking.py", line 13, in test_R1_time_types_rejected
    self.assertIs(can_book(*args), False)
                  ~~~~~~~~^^^^^^^
  File "C:\Users\Acer\Desktop\SE\sis-05\project\booking.py", line 2, in can_book
    if not (0 <= start < end <= 1440):
            ^^^^^^^^^^^^^^^^^^^^^^^^
TypeError: '<' not supported between instances of 'int' and 'NoneType'

======================================================================
ERROR: test_R1_time_types_rejected (test_booking.BookingTests.test_R1_time_types_rejected) (field=2, value='600')
----------------------------------------------------------------------
Traceback (most recent call last):
  File "C:\Users\Acer\Desktop\SE\sis-05\project\test_booking.py", line 13, in test_R1_time_types_rejected
    self.assertIs(can_book(*args), False)
                  ~~~~~~~~^^^^^^^
  File "C:\Users\Acer\Desktop\SE\sis-05\project\booking.py", line 4, in can_book
    if start <= now:
       ^^^^^^^^^^^^
TypeError: '<=' not supported between instances of 'int' and 'str'

======================================================================
ERROR: test_R1_time_types_rejected (test_booking.BookingTests.test_R1_time_types_rejected) (field=2, value=None)
----------------------------------------------------------------------
Traceback (most recent call last):
  File "C:\Users\Acer\Desktop\SE\sis-05\project\test_booking.py", line 13, in test_R1_time_types_rejected
    self.assertIs(can_book(*args), False)
                  ~~~~~~~~^^^^^^^
  File "C:\Users\Acer\Desktop\SE\sis-05\project\booking.py", line 4, in can_book
    if start <= now:
       ^^^^^^^^^^^^
TypeError: '<=' not supported between instances of 'int' and 'NoneType'

======================================================================
FAIL: test_R1_blocked_must_be_boolean (test_booking.BookingTests.test_R1_blocked_must_be_boolean) (blocked=None)
----------------------------------------------------------------------
Traceback (most recent call last):
  File "C:\Users\Acer\Desktop\SE\sis-05\project\test_booking.py", line 23, in test_R1_blocked_must_be_boolean
    self.assertIs(can_book(600, 660, 540, blocked, []), False)
    ~~~~~~~~~~~~~^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
AssertionError: True is not False

======================================================================
FAIL: test_R1_blocked_must_be_boolean (test_booking.BookingTests.test_R1_blocked_must_be_boolean) (blocked=0)
----------------------------------------------------------------------
Traceback (most recent call last):
  File "C:\Users\Acer\Desktop\SE\sis-05\project\test_booking.py", line 23, in test_R1_blocked_must_be_boolean
    self.assertIs(can_book(600, 660, 540, blocked, []), False)
    ~~~~~~~~~~~~~^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
AssertionError: True is not False

======================================================================
FAIL: test_R1_blocked_must_be_boolean (test_booking.BookingTests.test_R1_blocked_must_be_boolean) (blocked=[])
----------------------------------------------------------------------
Traceback (most recent call last):
  File "C:\Users\Acer\Desktop\SE\sis-05\project\test_booking.py", line 23, in test_R1_blocked_must_be_boolean
    self.assertIs(can_book(600, 660, 540, blocked, []), False)
    ~~~~~~~~~~~~~^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
AssertionError: True is not False

======================================================================
FAIL: test_R1_blocked_must_be_boolean (test_booking.BookingTests.test_R1_blocked_must_be_boolean) (blocked={})
----------------------------------------------------------------------
Traceback (most recent call last):
  File "C:\Users\Acer\Desktop\SE\sis-05\project\test_booking.py", line 23, in test_R1_blocked_must_be_boolean
    self.assertIs(can_book(600, 660, 540, blocked, []), False)
    ~~~~~~~~~~~~~^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
AssertionError: True is not False

======================================================================
FAIL: test_R1_now_outside_day_rejected (test_booking.BookingTests.test_R1_now_outside_day_rejected) (now=-1)
----------------------------------------------------------------------
Traceback (most recent call last):
  File "C:\Users\Acer\Desktop\SE\sis-05\project\test_booking.py", line 18, in test_R1_now_outside_day_rejected
    self.assertIs(can_book(600, 660, now, False, []), False)
    ~~~~~~~~~~~~~^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
AssertionError: True is not False

======================================================================
FAIL: test_R1_time_types_rejected (test_booking.BookingTests.test_R1_time_types_rejected) (field=0, value=600.5)
----------------------------------------------------------------------
Traceback (most recent call last):
  File "C:\Users\Acer\Desktop\SE\sis-05\project\test_booking.py", line 13, in test_R1_time_types_rejected
    self.assertIs(can_book(*args), False)
    ~~~~~~~~~~~~~^^^^^^^^^^^^^^^^^^^^^^^^
AssertionError: True is not False

======================================================================
FAIL: test_R1_time_types_rejected (test_booking.BookingTests.test_R1_time_types_rejected) (field=1, value=600.5)
----------------------------------------------------------------------
Traceback (most recent call last):
  File "C:\Users\Acer\Desktop\SE\sis-05\project\test_booking.py", line 13, in test_R1_time_types_rejected
    self.assertIs(can_book(*args), False)
    ~~~~~~~~~~~~~^^^^^^^^^^^^^^^^^^^^^^^^
AssertionError: True is not False

======================================================================
FAIL: test_R1_time_types_rejected (test_booking.BookingTests.test_R1_time_types_rejected) (field=2, value=True)
----------------------------------------------------------------------
Traceback (most recent call last):
  File "C:\Users\Acer\Desktop\SE\sis-05\project\test_booking.py", line 13, in test_R1_time_types_rejected
    self.assertIs(can_book(*args), False)
    ~~~~~~~~~~~~~^^^^^^^^^^^^^^^^^^^^^^^^
AssertionError: True is not False

======================================================================
FAIL: test_R1_time_types_rejected (test_booking.BookingTests.test_R1_time_types_rejected) (field=2, value=nan)
----------------------------------------------------------------------
Traceback (most recent call last):
  File "C:\Users\Acer\Desktop\SE\sis-05\project\test_booking.py", line 13, in test_R1_time_types_rejected
    self.assertIs(can_book(*args), False)
    ~~~~~~~~~~~~~^^^^^^^^^^^^^^^^^^^^^^^^
AssertionError: True is not False

----------------------------------------------------------------------
Ran 3 tests in 0.018s

FAILED (failures=9, errors=6)
```

Before: `py -B -m unittest -v -k test_R1_`, exit 1. Subtests produced 9 failures and 6 errors across three test methods.

The diff (`git diff`):

```text
diff --git a/sis-05/project/booking.py b/sis-05/project/booking.py
index 051ed6d..d1734a7 100644
--- a/sis-05/project/booking.py
+++ b/sis-05/project/booking.py
@@ -1,4 +1,13 @@
 def can_book(start, end, now, blocked, existing):
+    """Check availability using integer minutes and a Boolean blocked flag.
+
+    start/end describe a same-day interval; now must be within 0..1440.
+    Invalid scalar inputs return False. Existing bookings are not mutated.
+    """
+    if any(type(value) is not int for value in (start, end, now)):
+        return False
+    if type(blocked) is not bool or not 0 <= now <= 1440:
+        return False
     if not (0 <= start < end <= 1440):
         return False
     if start <= now:
@@ -10,4 +19,4 @@ def can_book(start, end, now, blocked, existing):
     for booked_start, booked_end in existing:
         if start < booked_end and end > booked_start:
             return False
-    return True
\ No newline at end of file
+    return True
diff --git a/sis-05/project/test_booking.py b/sis-05/project/test_booking.py
index 81e712e..2c8d65d 100644
--- a/sis-05/project/test_booking.py
+++ b/sis-05/project/test_booking.py
@@ -4,6 +4,24 @@ from booking import can_book
 
 class BookingTests(unittest.TestCase):
 
+    def test_R1_time_types_rejected(self):
+        for field in range(3):
+            for value in ("600", None, True, 600.5, float("nan"), float("inf")):
+                args = [600, 660, 540, False, []]
+                args[field] = value
+                with self.subTest(field=field, value=value):
+                    self.assertIs(can_book(*args), False)
+
+    def test_R1_now_outside_day_rejected(self):
+        for now in (-1, 1441):
+            with self.subTest(now=now):
+                self.assertIs(can_book(600, 660, now, False, []), False)
+
+    def test_R1_blocked_must_be_boolean(self):
+        for blocked in (None, 0, 1, "False", [], {}):
+            with self.subTest(blocked=blocked):
+                self.assertIs(can_book(600, 660, 540, blocked, []), False)
+
     def test_touching_end_is_allowed(self):
         # AC4: expected result follows the specification, not code output.
         result = can_book(660, 720, 540, False, [(600, 660)])
```

After: `py -B -m unittest -v`, exit 0; all 32 original tests and three R1 tests passed.

```text
test_119_minutes_allowed (test_booking.BookingTests.test_119_minutes_allowed) ... ok
test_121_minutes_rejected (test_booking.BookingTests.test_121_minutes_rejected) ... ok
test_R1_blocked_must_be_boolean (test_booking.BookingTests.test_R1_blocked_must_be_boolean) ... ok
test_R1_now_outside_day_rejected (test_booking.BookingTests.test_R1_now_outside_day_rejected) ... ok
test_R1_time_types_rejected (test_booking.BookingTests.test_R1_time_types_rejected) ... ok
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
Ran 35 tests in 0.001s

OK
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
