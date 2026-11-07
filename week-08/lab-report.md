# Week 08 — Lab report

**Name:**
**Group:**
**Date:** 2026-11-07

**Work in progress:** Codex is assisting with setup, real test execution and recording evidence. Personal hypotheses, manual skill entry and the two fresh-chat experiments are still pending. The existing Week 07 layout is retained: commands run from `week-08/app/`, sources are in `project/src/`.

Fill in every section. **Do not delete, rename or renumber the headings.** The checker and the
grader find your answers by them. You can add rows to any table, but never remove its header.

---

## 1. Setup

| | |
| --- | --- |
| Assistant I debugged with (tool) | Codex (preparation and test execution; comparison chats pending) |
| Exact model (with its version, or `not displayed`) | gpt-6-astra (this Codex session) |
| Where the skill was installed (ChatGPT / Claude web / Claude Code / prompt-only simulation) | Not installed yet |
| Where I ran the tests (Bolt terminal / my computer / Codespace) | My computer, Windows PowerShell; Codex ran commands in C:/Users/Acer/Desktop/SE/week-08/app |
| Vitest version (the `RUN  v…` line of a run) | 3.2.4 |
| Language of my booking module (`ts` or `js`) — the file I copied from `buggy/` | ts |

---

## 2. Task 1 — baseline, buggy code, failing tests

### 2.1 My Week 07 suite on my own code

The **real** output of your Week 07 suite, run in `week-08/app/` **before** you replace
anything. It should be green. If it is not, say why under the block.

```text

 RUN  v3.2.4 C:/Users/Acer/Desktop/SE/week-08/app

 ✓ project/src/booking.test.ts (21 tests) 6ms

 Test Files  1 passed (1)
      Tests  21 passed (21)
   Start at  23:04:50
   Duration  760ms (transform 93ms, setup 0ms, collect 97ms, tests 6ms, environment 0ms, prepare 248ms)
```

Command: `npx.cmd --no-install vitest run` with `NO_COLOR=1`. Exit code: 0. Both `booking.ts` and `booking.test.ts` matched the Week 07 branch before the run; all 21 original tests passed.

### 2.2 The same suite on the provided canBook

You copied the whole `canBook` function from `buggy/booking.ts` (or `.js`) over yours and changed
nothing else. This is the real output:

```text

 RUN  v3.2.4 C:/Users/Acer/Desktop/SE/week-08/app

 ❯ project/src/booking.test.ts (21 tests | 4 failed) 16ms
   ✓ canBook — AC1: valid interval and future start > AC1: rejects a start before minute zero independently of the current time 2ms
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
   × canBook — AC4: overlap detection > T01: accepts touching after an existing booking 8ms
     → expected false to be true // Object.is equality
   × canBook — AC4: overlap detection > T08: accepts touching before an existing booking 1ms
     → expected false to be true // Object.is equality
   ✓ canBook — AC4: overlap detection > T09: rejects partial overlap 0ms
   ✓ canBook — AC4: overlap detection > T10: rejects a request containing an existing booking 0ms
   ✓ canBook — AC4: overlap detection > T11: rejects a request fully inside an existing booking 0ms
   ✓ canBook — AC4: overlap detection > T12: rejects an interval identical to an existing booking 0ms
   ✓ canBook — AC4: overlap detection > T14: accepts the request when there are no existing bookings 0ms
   × canBook — AC4: overlap detection > X2: accepts an interval touching two bookings at both endpoints 0ms
     → expected false to be true // Object.is equality
   × canBook — AC5: Boolean result and no input mutation > AC5: returns true and leaves booking data unchanged for an available request 0ms
     → expected false to be true // Object.is equality
   ✓ canBook — AC5: Boolean result and no input mutation > AC5: leaves booking data unchanged when the request is rejected 0ms

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 4 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  project/src/booking.test.ts > canBook — AC4: overlap detection > T01: accepts touching after an existing booking
AssertionError: expected false to be true // Object.is equality

- Expected
+ Received

- true
+ false

 ❯ project/src/booking.test.ts:156:7
    154|         bookings,
    155|       }),
    156|     ).toBe(true);
       |       ^
    157|   });
    158| 

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/4]⎯

 FAIL  project/src/booking.test.ts > canBook — AC4: overlap detection > T08: accepts touching before an existing booking
AssertionError: expected false to be true // Object.is equality

- Expected
+ Received

- true
+ false

 ❯ project/src/booking.test.ts:170:7
    168|         bookings,
    169|       }),
    170|     ).toBe(true);
       |       ^
    171|   });
    172| 

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[2/4]⎯

 FAIL  project/src/booking.test.ts > canBook — AC4: overlap detection > X2: accepts an interval touching two bookings at both endpoints
AssertionError: expected false to be true // Object.is equality

- Expected
+ Received

- true
+ false

 ❯ project/src/booking.test.ts:257:7
    255|         bookings,
    256|       }),
    257|     ).toBe(true);
       |       ^
    258|   });
    259| });

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[3/4]⎯

 FAIL  project/src/booking.test.ts > canBook — AC5: Boolean result and no input mutation > AC5: returns true and leaves booking data unchanged for an available request
AssertionError: expected false to be true // Object.is equality

- Expected
+ Received

- true
+ false

 ❯ project/src/booking.test.ts:278:20
    276|     });
    277| 
    278|     expect(result).toBe(true);
       |                    ^
    279|     expect(typeof result).toBe("boolean");
    280|     expect(bookings).toEqual(before);

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[4/4]⎯


 Test Files  1 failed (1)
      Tests  4 failed | 17 passed (21)
   Start at  23:06:19
   Duration  693ms (transform 67ms, setup 0ms, collect 72ms, tests 16ms, environment 0ms, prepare 173ms)
```

Command: `npx.cmd --no-install vitest run` with `NO_COLOR=1`. Exit code: 1. This is the unchanged Week 07 suite on the exact provided function, before any repairs.

### 2.3 One failing test per bug

Add the two regression tests from README Part 1, step 5: one named `BUG-A` and one named `BUG-B`.
Run them **on the buggy code**. Both must fail here. That is the evidence that each test can see
its bug.

```text
(paste here)
```

---

## 3. Defect log

One row per defect. At least **BUG-A and BUG-B**. "Suspected cause" is your hypothesis
**before** you ask any assistant: the line and why.

| Defect | Test ID | Input | Expected | Actual | Suspected cause (line and why) |
| --- | --- | --- | --- | --- | --- |
| BUG-A | | | | | |
| BUG-B | | | | | |

---

## 4. Tasks 2–3 — the skill

**The checks from the deck, before you zip it.** Answer each one yes / no:

| Check | yes / no |
| --- | --- |
| The file is plain UTF-8 text, named exactly `SKILL.md` (not `SKILL.md.txt`) | yes / no |
| The first and the closing YAML delimiter are exactly three hyphens: `---` | yes / no |
| `name` is lowercase with hyphens, and `description` says WHEN to use it | yes / no |
| I read the whole file once: no passwords, API keys or private student data | yes / no |

**The contents of `skills/bug-detector.zip`.** Paste the listing (Windows: open the ZIP and copy
the paths; macOS/Linux: `unzip -l skills/bug-detector.zip`):

```text
(paste here)
```

**Installation.** Where you uploaded it, what the upload said, and whether a new chat showed the
skill as enabled. If upload was not available, write `prompt-only simulation` and say why.
Screenshot of the result: `evidence/install.png`.

<!-- Write below this line -->

---

## 5. Task 4 — without the skill

A **fresh chat, with no skill enabled**. Paste exactly what you sent: the deck's question, then
the same input you will use in section 6 (AC1–AC6, the failing test output, the code of
`canBook`):

```text
(paste here)
```

**The assistant's answer, pasted unedited:**

```text
(paste here)
```

---

## 6. Task 5 — with the skill

**Another fresh chat, with `bug-detector` enabled.** Send exactly the same input as in section 5.
Only the question changes, to the deck's skill question:

```text
(paste here)
```

**The assistant's answer, pasted unedited:**

```text
(paste here)
```

Did the environment show that the skill was invoked? yes / no / not shown

---

## 7. Comparison — judged against the actual code

Do not assume the skill did better. Judge both answers against the code and against what your
tests showed. Write a short verdict in each cell, and give a reason where they differ.

| Criterion | No skill | With skill |
| --- | --- | --- |
| Correct root cause | | |
| Reproducible test | | |
| Minimal proposed patch | | |
| Unsupported claims | | |
| Clarity of explanation | | |

**Which bugs did each answer find?** (BUG-A, BUG-B, both, neither)

-

---

## 8. Task 6 — repair and regression

Review the proposed patch yourself, then make **one minimal change per bug**, one commit each.
Rerun the test that was failing, then the full suite.

### 8.1 The BUG-A patch

The change as a diff (`git diff`, or the old and the new line), then the real run:

```text
(paste here)
```

### 8.2 The BUG-B patch and the final run

The change as a diff, then the real output of the **full** suite. Every test must pass.

```text
(paste here)
```

---

## 9. What still fails, and what AI-assisted debugging cannot do

### 9.1 Checks I am keeping as FAIL or ERROR

Use the same IDs as `known_fails` in `submission.yml`. Write `none` if the run is clean.

| Check | Why it stays |
| --- | --- |
| | |

### 9.2 One limitation of AI-assisted debugging

<!-- Use something that actually happened in sections 5-8. 20 words or more. -->
-

---

## 10. Conclusion (80–150 words)

<!-- Answer both, in your own words, without the assistant (3-5 sentences, as the deck asks):
     (a) Did the skill help? Show it with one row of section 7.
     (b) What did your tests actually prove - and what did they not?
     Worthless: "The skill made the AI much better at debugging."
     Worth everything: "Both answers found BUG-A from the T01 failure. Only the skill answer
     separated BUG-B as a hypothesis instead of a fact, because step 4 told it to. BUG-B was only
     visible after the BUG-A patch: the AC5 test had been failing for the wrong reason." -->

<!-- Write your conclusion below this line -->
