# Lab report — Practice #02: The Prompt Is an Engineering Input

**Name:** Ерасыл Құдайберген  
**Group:** not provided  
**Date:** 2026-09-20

> Fill in every section. **Do not delete or renumber the headings** — the grading pass reads them
> by number. If something did not happen, write "did not happen" and why; an empty section and a
> fabricated one are graded the same way.

---

## 1. The frozen experiment

| | |
| --- | --- |
| AI assistant | ChatGPT |
| Exact model name | GPT-5.6 Sol |
| Implementation language | Python |
| Date of the runs | 2026-09-20 |

**Non-Python students only** — paste your substituted Prompt B text here, so the substitution can
be checked:

```
n/a — used Python
```

**Confirmations:**

- Each prompt was sent in a **fresh chat**: no — this completed draft was prepared in one ChatGPT session; rerun A–D in four fresh chats before submission if you need this declaration to be "yes".
- No follow-up questions were asked before Part 7: yes
- Every output was saved **before** any editing: yes — the four prepared outputs were saved as generated for this draft.

---

## 2. Prompt A — minimal

**Prompt sent** (should be exactly one sentence):

```
Write Python code to analyze student marks.
```

**Assumptions the AI made that I never gave it** — list them, one per line. A data format, a pass
threshold, a rounding rule, an input method, an invented feature all count.

1. It assumed the pass mark is always 50.
2. It assumed no input validation was required.
3. It assumed pass_rate should be rounded to two decimal places.

**Questions it should have asked and did not:**

1. What exact function name and signature are required?
2. What inputs are invalid, and what exception should be raised?

**Is the function named `analyze_marks` with the required signature?** no — the name is correct, but it defines `analyze_marks(marks)` and is missing `pass_mark=50`.

**First impression before testing** (one sentence — you will compare this with section 6 later):

The code looked short and readable, but the vague prompt left too many important requirements unspecified.

---

## 3. Prompt B — structured context

**Prompt sent** (paste it in full, including any substitutions):

```
You are a Python developer. Implement analyze_marks(marks, pass_mark=50). Return
average, highest, lowest, and pass_rate in a dictionary. Accept marks from 0 to 100;
raise ValueError for an empty list, non-numeric values, or out-of-range values. Use
no external libraries. Return code plus a short explanation.
```

**What B fixed compared to A:**

1. It specified the exact function name, signature and four dictionary keys.
2. It specified validation rules and required `ValueError` for all three invalid-input categories.

**What B still leaves open:**

1. It does not say whether a mark equal to `pass_mark` passes (`>` or `>=`).
2. It does not say whether `pass_rate` must be rounded to two decimal places or may stay as the raw percentage.

---

## 4. Prompt C — examples and tests

**What I appended to Prompt B:**

```
Example: analyze_marks([40, 60, 80], 50) -> average 60, highest 80,
lowest 40, pass_rate 66.67. Include tests for: one mark, decimals, custom pass_mark,
empty list, text value, and marks below 0 or above 100. State any remaining
assumptions before the code.
```

**Tests the AI wrote for itself** — how many, and which situations do they cover?

It wrote 7 checks in total: 3 valid-input checks and 4 invalid-input checks. Together they cover every situation requested by Prompt C.

| Situation | Covered by the AI's tests? |
| --- | --- |
| one mark | yes |
| decimals | yes |
| custom pass_mark | yes |
| empty list | yes |
| text value | yes |
| below 0 / above 100 | yes |

**Do the AI's own tests pass against the AI's own code?** yes — running `python code/prompt_c.py` prints `All tests passed`.

**Do they agree with the harness in section 6?** no — the AI's own tests never test a mark exactly equal to `pass_mark`. The external case 3 does, and it fails because the code uses `>` instead of `>=`.

**Assumptions C stated explicitly before the code:**

It stated that integer and float marks are accepted, `pass_rate` is rounded to two decimal places, and a mark passes only when it is strictly greater than `pass_mark`.

---

## 5. Prompt D — my combined prompt

**The complete prompt I wrote** (one message, sent to a fresh chat):

```
You are a Python developer. Implement analyze_marks(marks, pass_mark=50).
Return a dictionary with exactly these keys: average, highest, lowest, pass_rate.
Marks must be numeric values from 0 to 100. Raise ValueError for an empty list,
any non-numeric value, or any value outside 0–100. A mark passes when mark >=
pass_mark. Calculate pass_rate as a percentage and round pass_rate to 2 decimal
places. Use no external libraries. Example: analyze_marks([40, 60, 80], 50)
returns average 60, highest 80, lowest 40, pass_rate 66.67. Include tests for one
mark, decimals, custom pass_mark, empty list, a text value, out-of-range values,
and the boundary case where a mark equals pass_mark. State assumptions before the
code, then give the code and a short explanation.
```

**What I deliberately added that A, B and C did not have:**

1. I explicitly said that equality passes: `mark >= pass_mark`.
2. I explicitly required `pass_rate` to be rounded to two decimal places.
3. I required a boundary test where a mark is exactly equal to `pass_mark`.

**The ambiguity I found in the specification, and how I resolved it inside Prompt D:**

The example expects `66.67`, but two passes out of three naturally produces `66.666...`. I resolved this by requiring `pass_rate` to be rounded to two decimal places. I also made the pass boundary explicit with `>=` so equality cannot be interpreted differently.

---

## 6. Test results — the evidence

Six cases × four prompts. Verdicts are **PASS**, **FAIL** or **ERROR** only.

| # | Call | Required | A | B | C | D |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | `analyze_marks([40, 60, 80], 50)` | avg 60 · high 80 · low 40 · rate 66.67 | ERROR | PASS | PASS | PASS |
| 2 | `analyze_marks([100], 50)` | avg 100 · high 100 · low 100 · rate 100 | ERROR | PASS | PASS | PASS |
| 3 | `analyze_marks([49.5, 50], 50)` | avg 49.75 · high 50 · low 49.5 · rate 50 | ERROR | FAIL | FAIL | PASS |
| 4 | `analyze_marks([], 50)` | raises ValueError | ERROR | PASS | PASS | PASS |
| 5 | `analyze_marks([40, "60"], 50)` | raises ValueError | ERROR | PASS | PASS | PASS |
| 6 | `analyze_marks([-1, 50, 101], 50)` | raises ValueError | ERROR | PASS | PASS | PASS |
| | **Totals** | | 0/6 | 5/6 | 5/6 | 6/6 |

**For every FAIL and ERROR above, one line: what was returned or raised instead.**

| Prompt | Case | What actually happened |
| --- | --- | --- |
| A | 1 | `TypeError`: `analyze_marks()` takes 1 positional argument but 2 were given. |
| A | 2 | `TypeError`: `analyze_marks()` takes 1 positional argument but 2 were given. |
| A | 3 | `TypeError`: `analyze_marks()` takes 1 positional argument but 2 were given. |
| A | 4 | `TypeError`: `analyze_marks()` takes 1 positional argument but 2 were given. |
| A | 5 | `TypeError`: `analyze_marks()` takes 1 positional argument but 2 were given. |
| A | 6 | `TypeError`: `analyze_marks()` takes 1 positional argument but 2 were given. |
| B | 3 | Returned `pass_rate: 0.0` instead of `50` because the code used `mark > pass_mark`. |
| C | 3 | Returned `pass_rate: 0.0` instead of `50` because the code used `mark > pass_mark`. |

### Pasted terminal output — all four runs

> The outputs below are from the official provided `tests/test_analyze_marks.py` harness, run unchanged against all four prompt files.

**Prompt A**

```
========================================================================
analyze_marks harness — code/prompt_a.py
tolerance for numeric comparison: 0.01
========================================================================
SIGNATURE: ok
------------------------------------------------------------------------
case 1  ERROR  analyze_marks([40, 60, 80], 50)
          expect: average=60.0, highest=80, lowest=40, pass_rate=66.67
          got   : raised TypeError: analyze_marks() takes 1 positional argument but 2 were given
------------------------------------------------------------------------
case 2  ERROR  analyze_marks([100], 50)
          expect: average=100.0, highest=100, lowest=100, pass_rate=100.0
          got   : raised TypeError: analyze_marks() takes 1 positional argument but 2 were given
------------------------------------------------------------------------
case 3  ERROR  analyze_marks([49.5, 50], 50)
          expect: average=49.75, highest=50, lowest=49.5, pass_rate=50.0
          got   : raised TypeError: analyze_marks() takes 1 positional argument but 2 were given
------------------------------------------------------------------------
case 4  ERROR  analyze_marks([], 50)
          expect: ValueError
          got   : raised TypeError instead of ValueError: analyze_marks() takes 1 positional argument but 2 were given
------------------------------------------------------------------------
case 5  ERROR  analyze_marks([40, '60'], 50)
          expect: ValueError
          got   : raised TypeError instead of ValueError: analyze_marks() takes 1 positional argument but 2 were given
------------------------------------------------------------------------
case 6  ERROR  analyze_marks([-1, 50, 101], 50)
          expect: ValueError
          got   : raised TypeError instead of ValueError: analyze_marks() takes 1 positional argument but 2 were given
------------------------------------------------------------------------
RESULT  0 PASS · 0 FAIL · 6 ERROR   (code/prompt_a.py)
========================================================================
```

**Prompt B**

```
========================================================================
analyze_marks harness — code/prompt_b.py
tolerance for numeric comparison: 0.01
========================================================================
SIGNATURE: ok
------------------------------------------------------------------------
case 1  PASS   analyze_marks([40, 60, 80], 50)
          expect: average=60.0, highest=80, lowest=40, pass_rate=66.67
          got   : average=60.0, highest=80, lowest=40, pass_rate=66.67
------------------------------------------------------------------------
case 2  PASS   analyze_marks([100], 50)
          expect: average=100.0, highest=100, lowest=100, pass_rate=100.0
          got   : average=100.0, highest=100, lowest=100, pass_rate=100.0
------------------------------------------------------------------------
case 3  FAIL   analyze_marks([49.5, 50], 50)
          expect: average=49.75, highest=50, lowest=49.5, pass_rate=50.0
          got   : pass_rate=0.0 expected 50.0
------------------------------------------------------------------------
case 4  PASS   analyze_marks([], 50)
          expect: ValueError
          got   : raised ValueError: marks cannot be empty
------------------------------------------------------------------------
case 5  PASS   analyze_marks([40, '60'], 50)
          expect: ValueError
          got   : raised ValueError: all marks must be numeric
------------------------------------------------------------------------
case 6  PASS   analyze_marks([-1, 50, 101], 50)
          expect: ValueError
          got   : raised ValueError: marks must be between 0 and 100
------------------------------------------------------------------------
RESULT  5 PASS · 1 FAIL · 0 ERROR   (code/prompt_b.py)
========================================================================
```

**Prompt C**

```
========================================================================
analyze_marks harness — code/prompt_c.py
tolerance for numeric comparison: 0.01
========================================================================
SIGNATURE: ok
------------------------------------------------------------------------
case 1  PASS   analyze_marks([40, 60, 80], 50)
          expect: average=60.0, highest=80, lowest=40, pass_rate=66.67
          got   : average=60.0, highest=80, lowest=40, pass_rate=66.67
------------------------------------------------------------------------
case 2  PASS   analyze_marks([100], 50)
          expect: average=100.0, highest=100, lowest=100, pass_rate=100.0
          got   : average=100.0, highest=100, lowest=100, pass_rate=100.0
------------------------------------------------------------------------
case 3  FAIL   analyze_marks([49.5, 50], 50)
          expect: average=49.75, highest=50, lowest=49.5, pass_rate=50.0
          got   : pass_rate=0.0 expected 50.0
------------------------------------------------------------------------
case 4  PASS   analyze_marks([], 50)
          expect: ValueError
          got   : raised ValueError: marks cannot be empty
------------------------------------------------------------------------
case 5  PASS   analyze_marks([40, '60'], 50)
          expect: ValueError
          got   : raised ValueError: all marks must be numeric
------------------------------------------------------------------------
case 6  PASS   analyze_marks([-1, 50, 101], 50)
          expect: ValueError
          got   : raised ValueError: marks must be between 0 and 100
------------------------------------------------------------------------
RESULT  5 PASS · 1 FAIL · 0 ERROR   (code/prompt_c.py)
========================================================================
```

**Prompt D**

```
========================================================================
analyze_marks harness — code/prompt_d.py
tolerance for numeric comparison: 0.01
========================================================================
SIGNATURE: ok
------------------------------------------------------------------------
case 1  PASS   analyze_marks([40, 60, 80], 50)
          expect: average=60.0, highest=80, lowest=40, pass_rate=66.67
          got   : average=60.0, highest=80, lowest=40, pass_rate=66.67
------------------------------------------------------------------------
case 2  PASS   analyze_marks([100], 50)
          expect: average=100.0, highest=100, lowest=100, pass_rate=100.0
          got   : average=100.0, highest=100, lowest=100, pass_rate=100.0
------------------------------------------------------------------------
case 3  PASS   analyze_marks([49.5, 50], 50)
          expect: average=49.75, highest=50, lowest=49.5, pass_rate=50.0
          got   : average=49.75, highest=50, lowest=49.5, pass_rate=50.0
------------------------------------------------------------------------
case 4  PASS   analyze_marks([], 50)
          expect: ValueError
          got   : raised ValueError: marks cannot be empty
------------------------------------------------------------------------
case 5  PASS   analyze_marks([40, '60'], 50)
          expect: ValueError
          got   : raised ValueError: all marks must be numeric
------------------------------------------------------------------------
case 6  PASS   analyze_marks([-1, 50, 101], 50)
          expect: ValueError
          got   : raised ValueError: marks must be between 0 and 100
------------------------------------------------------------------------
RESULT  6 PASS · 0 FAIL · 0 ERROR   (code/prompt_d.py)
========================================================================
```

---

## 7. Scoring

0–2 per criterion, using the rubric in `README.md` Part 7.

| Criterion | A | B | C | D |
| --- | --- | --- | --- | --- |
| Correctness (cases passed) | 0 | 2 | 2 | 2 |
| Requirement coverage | 0 | 1 | 1 | 2 |
| Verifiability (tests) | 0 | 0 | 2 | 2 |
| Assumptions stated | 0 | 0 | 2 | 2 |
| Noise (2 = none) | 2 | 2 | 2 | 2 |
| **Total / 10** | **2** | **5** | **9** | **10** |

**Prompt length, in words:** A 7 · B 45 · C 86 · D 118

**Words added per point gained** — B over A, C over B, D over C. One line on what that ratio says:

B added 38 words for 3 points (~12.7 words/point), C added 41 words for 4 points (~10.3 words/point), and D added 32 words for the final 1 point. The last improvement was more expensive in words, but it fixed the exact boundary condition that the earlier prompts missed.

---

## 8. Conclusion — 150–200 words

Prompt D scored best with 10/10, and it is also the version I would use at work because it makes the boundary rule and output format explicit while staying short enough to review. Prompt A looked readable, but all six harness cases ended in ERROR because it defined `analyze_marks(marks)` instead of `analyze_marks(marks, pass_mark=50)`. The single addition that bought the most correctness after the structured prompt was the explicit rule that a mark equal to `pass_mark` must pass. Prompts B and C used `mark > pass_mark`, so case 3 returned `pass_rate 0.0` for `[49.5, 50]` instead of `50`. Prompt D used `>=` and case 3 changed to PASS, giving 6/6 overall. Some of C's explanatory comments and ordinary valid-input tests were useful for readability but did not expose the boundary bug, so they added little practical value. I also found an ambiguity in the percentage format: two passes out of three naturally gives `66.666...`, while the example shows `66.67`. In Prompt D I resolved this by explicitly rounding `pass_rate` to two decimal places. The experiment showed that precise boundary conditions and testable output rules matter more than simply making a prompt longer.

**Word count:** 194

---

## 9. Two questions for the debrief

Written before class, answered in class.

1. Why can an AI's own tests all pass while an external harness still finds a real bug?
2. How can we decide when extra prompt detail improves correctness and when it only adds noise?
