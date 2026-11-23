# Week 11 — Lab report

**Name:** Khudaibergen Yerassyl
**Group:** Monday 16:00-19:00
**Date:** 2026-11-23

Fill in every section. **Do not delete, rename or renumber the headings.** The checker and the
grader find your answers by them. You can add rows to any table, but never remove its header.

---

## 1. Setup

| | |
| --- | --- |
| Assistant I built the feature with (tool) | ChatGPT |
| Its exact model (with its version, or `not displayed`) | Astra-6 |
| Assistant I reviewed with (tool) |  |
| Its exact model (with its version, or `not displayed`) | |
| Starting point (`week-10` or `week-08`) |week-10 |
| Baseline commit — the checkpoint of Part 0 | 98f5d9e |
| Where I ran the tests (Bolt terminal / my computer / Codespace) | my computer |
| Vitest version (the `RUN  v…` line of a run) | 4.1.12 |

---

## 2. Task 1 — the baseline

### 2.1 The project's commands

Run each command in `week-11/app/project/` before any change. **Exists:** `yes` or `no`. **Result:**
`pass`, `fail`, `missing` or `not run`.

| Command | Exists | Result | Note |
| --- | --- | --- | --- |
| `npx vitest run` | yes | pass | 24 tests passed; Vitest was fetched by `npx` because it is absent from `package.json`. |
| `npm run build` | yes | fail | `src/booking.test.ts(1,38): error TS2307: Cannot find module 'vitest' or its corresponding type declarations.` |
| `npm run lint` | no | missing | `npm pkg get scripts` lists only `dev`, `build`, and `preview`. |

### 2.2 The baseline test run

The **real** output of `npx vitest run` in `week-11/app/project/`, before any change:

```text
20:07:22 [vite] warning: `esbuild` option was specified by "vite:react-babel" plugin. This option is deprecated, please use `oxc` instead.
20:07:22 [vite] warning: `optimizeDeps.esbuildOptions` option was specified by "vite:react-babel" plugin. This option is deprecated, please use `optimizeDeps.rolldownOptions` instead.
Both esbuild and oxc options were set. oxc options will be used and esbuild options will be ignored. The following esbuild options were set: `{ jsx: 'automatic', jsxImportSource: undefined }`

 RUN  v4.1.12 C:/Users/Acer/Desktop/SE/week-11/app/project


 Test Files  1 passed (1)
      Tests  24 passed (24)
   Start at  20:07:22
   Duration  314ms (transform 58ms, setup 0ms, import 80ms, tests 9ms, environment 0ms)

```

The default reporter did not print the suites. I ran `npx vitest run --reporter=verbose` to capture their complete list:

```text
20:20:18 [vite] warning: `esbuild` option was specified by "vite:react-babel" plugin. This option is deprecated, please use `oxc` instead.
20:20:18 [vite] warning: `optimizeDeps.esbuildOptions` option was specified by "vite:react-babel" plugin. This option is deprecated, please use `optimizeDeps.rolldownOptions` instead.
Both esbuild and oxc options were set. oxc options will be used and esbuild options will be ignored. The following esbuild options were set: `{ jsx: 'automatic', jsxImportSource: undefined }`

 RUN  v4.1.12 C:/Users/Acer/Desktop/SE/week-11/app/project

 ✓ src/booking.test.ts > R2 AC6: displays an accepted end-of-day boundary as 24:00 2ms
 ✓ src/booking.test.ts > BUG-A: allows a 30-minute request touching two bookings at both endpoints (AC4) 0ms
 ✓ src/booking.test.ts > BUG-B: an available non-touching request leaves booking data unchanged (AC5) 1ms
 ✓ src/booking.test.ts > canBook — AC1: valid interval and future start > AC1: rejects a start before minute zero independently of the current time 0ms
 ✓ src/booking.test.ts > canBook — AC1: valid interval and future start > AC1: accepts a request starting one minute after now 0ms
 ✓ src/booking.test.ts > canBook — AC1: valid interval and future start > AC1: accepts a one-minute interval 0ms
 ✓ src/booking.test.ts > canBook — AC1: valid interval and future start > T02: rejects a request that starts exactly now 0ms
 ✓ src/booking.test.ts > canBook — AC1: valid interval and future start > T03: rejects zero-duration interval 0ms
 ✓ src/booking.test.ts > canBook — AC1: valid interval and future start > T04: rejects reversed interval 0ms
 ✓ src/booking.test.ts > canBook — AC1: valid interval and future start > T05: rejects an end time after minute 1440 0ms
 ✓ src/booking.test.ts > canBook — AC1: valid interval and future start > X1: accepts an interval ending exactly at minute 1440 0ms
 ✓ src/booking.test.ts > canBook — AC2: maximum duration is 120 minutes > T06: accepts exactly 120 minutes 0ms
 ✓ src/booking.test.ts > canBook — AC2: maximum duration is 120 minutes > T07: rejects 121 minutes 0ms
 ✓ src/booking.test.ts > canBook — AC3: blocked rooms > T13: rejects an otherwise available request when room is blocked 0ms
 ✓ src/booking.test.ts > canBook — AC4: overlap detection > T01: accepts touching after an existing booking 0ms
 ✓ src/booking.test.ts > canBook — AC4: overlap detection > T08: accepts touching before an existing booking 0ms
 ✓ src/booking.test.ts > canBook — AC4: overlap detection > T09: rejects partial overlap 0ms
 ✓ src/booking.test.ts > canBook — AC4: overlap detection > T10: rejects a request containing an existing booking 0ms
 ✓ src/booking.test.ts > canBook — AC4: overlap detection > T11: rejects a request fully inside an existing booking 0ms
 ✓ src/booking.test.ts > canBook — AC4: overlap detection > T12: rejects an interval identical to an existing booking 0ms
 ✓ src/booking.test.ts > canBook — AC4: overlap detection > T14: accepts the request when there are no existing bookings 0ms
 ✓ src/booking.test.ts > canBook — AC4: overlap detection > X2: accepts an interval touching two bookings at both endpoints 0ms
 ✓ src/booking.test.ts > canBook — AC5: Boolean result and no input mutation > AC5: returns true and leaves booking data unchanged for an available request 0ms
 ✓ src/booking.test.ts > canBook — AC5: Boolean result and no input mutation > AC5: leaves booking data unchanged when the request is rejected 0ms

 Test Files  1 passed (1)
      Tests  24 passed (24)
   Start at  20:20:18
   Duration  311ms (transform 57ms, setup 0ms, import 81ms, tests 10ms, environment 0ms)

```

### 2.3 What I located

| What | Where (file, and the function or component name) |
| --- | --- |
| The availability function | `app/project/src/booking.ts` → `canBook` |
| The UI component | `app/project/src/App.tsx` → `App` |
| The repository instructions | `app/AGENTS.md` |

---

## 3. Task 2 — the feature, defined before the code

### 3.1 The user story

As a student, I want a short explanation of room availability so I understand the decision.

### 3.2 The contract

One row per field. **Validation** is what you reject, and how.

| Field | Direction | Type / format | Validation |
| --- | --- | --- | --- |
| `roomLabel` | input | string | Trimmed length 1–60; reject blank and longer labels |
| `start` | input | string `HH:MM` | Reject malformed time; use actual requested clock time |
| `end` | input | string `HH:MM` | Reject malformed; `24:00` permitted if an end-of-day option exists |
| `isAvailable` | input | boolean | Determined only by `canBook`; cannot be overridden by LLM |
| `reasonCode` | input | enum | Exactly `available`, `invalid_time`, `past_time`, `too_long`, `room_blocked`, `overlap` |
| `explanation` | output | string | Nonempty, ≤280 chars, ≤2 sentences; must agree with status; cannot invent clock times |

### 3.3 Acceptance criteria and failure behaviour

F1–F5 (README §3.4), then what the student sees in each failure:

F1. Keep the existing availability and overlap rules unchanged.

F2. Make the explanation agree with the deterministic result and include no invented booking details.

F3. Reject empty, malformed, and overly long input.

F4. Use a safe fallback when the adapter times out, fails, or has no available key.

F5. Show the generated explanation separately from the confirmed availability status so the student can tell them apart.

| Failure | What the student sees |
| --- | --- |
| Invalid input (empty, malformed, too long) | Understandable input feedback. Reject before calling the adapter; keep the booking result unchanged. |
| The model times out | A short deterministic fallback derived from `reasonCode`; the availability status stays the same. |
| The model fails (error, no key) | The same fallback, without a crash or a new booking. |
| The model's answer contradicts the decision, or invents a detail | Reject the model output and show the fallback; keep `isAvailable` unchanged. |

### 3.4 The flow

A written flow with arrows (`->`), or a diagram in a code block. Name your checker function and the
adapter, and say which one decides availability.

```text
Student enters input → validation → canBook(request) + availabilityReason(request)
    → {isAvailable, reasonCode} [DETERMINISTIC SOURCE OF TRUTH]
    → student clicks Explain availability → explainAvailability(input, mockAdapter, timeoutMs)
    → validate adapter output → generated explanation OR fallback
    → display separate from Available/Unavailable, without changing bookings.
```

---

## 4. Task 3 — build it with an AI assistant

### 4.1 The implementation prompt and the answer

What you sent, exactly (the deck's prompt, and the contract if you sent it):

```text
Act as a software engineer. Extend the existing Smart Campus checker with an optional explanation feature. Preserve all booking rules and tests. The deterministic checker must remain authoritative. First, implement a mock adapter, validate inputs and outputs, handle failures gracefully, and describe each changed file. Do not add login, a database, real personal data, or client-side API secrets.
```

The contract was not included in the initial Bolt.new message. It was sent in the follow-up message below, before implementation.

The assistant's answer, pasted unedited (its description of each changed file is enough if the code
is long):

```text
Thoughts
I’ll review the current checker, result display, and project structure so the explanation feature can be planned without changing the authoritative booking logic.


0123456789
files read
Plan: Optional Availability Explanation Feature

1\. Preserve the Deterministic Checker

Keep the existing availability checker as the only authority for available, unavailable, and invalid decisions.
Ensure the explanation feature receives the completed checker result rather than making its own booking decision.
Preserve all existing rules, including maximum duration, blocked rooms, current-time validation, and touching endpoints.
2\. Add a Safe Mock Explanation Adapter

Add a local mock explanation service that creates a plain-language explanation from the checker result.
Validate the explanation request before it is processed.
Validate the returned explanation before displaying it.
Keep the adapter entirely local, with no database, login, personal data, network calls, or client-side secrets.
Make failures return a friendly fallback message instead of affecting the availability result.
3\. Add the Optional User Experience

Add an “Explain this result” action after a completed availability check.
Show a loading state while the mock explanation is being prepared.
Display the explanation separately from the authoritative availability decision.
Label the explanation as supporting information so users can distinguish it from the checker’s result.
Clear the explanation whenever the room or any time field changes, preventing outdated guidance from remaining visible.
Keep the feature optional so the existing checker works normally without requesting an explanation.
4\. Update Validation and Failure Handling

Reject missing, malformed, or mismatched explanation data.
Prevent explanations from appearing when there is no current checker result.
Handle simulated adapter failures without hiding or changing the deterministic result.
Keep the existing form behavior and booking rules unchanged.
5\. Expected File Changes

src/types.ts
Add the shared shapes used for explanation requests and validated explanation results.
src/lib/explanation/mockExplanationAdapter.ts
Provide the local mock explanation behavior and controlled failure handling.
src/lib/explanation/validateExplanation.ts
Validate explanation inputs and outputs before they reach the screen.
src/App.tsx
Connect the optional explanation action to the current authoritative result and clear stale explanations when inputs change.
src/components/DecisionPanel.tsx
Add the optional explanation control and supporting information display while keeping the decision prominent.
src/index.css
Add styling for the explanation action, loading state, fallback message, and supporting-information panel.
Existing checker files
Preserve their behavior and only adjust them if needed to expose information safely to the explanation feature.
No database or authentication files will be added.
6\. Verification

Confirm touching endpoints remain available.
Confirm real overlaps remain unavailable.
Confirm blocked rooms, invalid intervals, and overlong requests retain their current results.
Confirm editing any input removes the previous explanation and decision display.
Confirm mock adapter failures leave the deterministic result visible.
Confirm the project still builds successfully.
This approach adds helpful context without allowing the explanation feature to override booking decisions or introduce external data risks. Switch back to build mode using the “Implement this plan” button or by clicking the Plan button again when you want these changes applied.
```

Follow-up message sent to Bolt.new, unchanged:

```text
Implement your proposed plan in the existing Smart Campus project. Use the contract below. The application is in app/project/; the repository instructions are in app/AGENTS.md. Do not create a new project.

Contract:
- roomLabel: input string; trim it and require 1–60 characters.
- start: input string in HH:MM format; reject malformed time and use the actual requested time.
- end: input string in HH:MM format; reject malformed time; permit 24:00 as an end-of-day value.
- isAvailable: input boolean determined only by canBook. The adapter must never override it.
- reasonCode: input enum with exactly these values: available, invalid_time, past_time, too_long, room_blocked, overlap.
- explanation: output string; nonempty, at most 280 characters and two sentences. It must agree with the deterministic result and must not invent clock times or booking details.

Requirements:
F1. Preserve all existing availability and overlap rules and tests.
F2. The explanation must agree with the deterministic result and contain no invented booking details.
F3. Reject empty, malformed, or overly long input before calling the adapter.
F4. On timeout or adapter failure, show a short deterministic fallback derived from reasonCode. Keep the availability status unchanged.
F5. Show the explanation separately from the confirmed Available/Unavailable status and label it as generated.

Use canBook(request) and availabilityReason(request) as the deterministic source of truth. Add explainAvailability(input, mockAdapter, timeoutMs) in src/explain.ts. The adapter must be local: no network call, API key, login, database, or personal data. Add an “Explain availability” button, clear stale explanations when inputs change, and provide a way to simulate adapter failure.

After implementing, describe every file you changed and why. Do not change the booking rules.
```

Bolt.new implementation response, pasted unedited:

```text
I’ll inspect the project instructions and current checker interfaces, then add the explanation contract without changing the deterministic booking rules.
Plan4/4completed
Implemented the optional explanation feature without changing booking rules.
Changed files:
- src/types.ts — Added explanation input, adapter, reason-code, and result types.
- src/lib/checkAvailability.ts — Added canBook() and availabilityReason() while preserving the existing checker behavior.
- src/explain.ts — Added explainAvailability() with input validation, output validation, timeout handling, and deterministic fallbacks.
- src/mockExplanationAdapter.ts — Added the local mock adapter and simulated failure mode.
- src/components/ExplanationPanel.tsx — Added the separate generated-explanation panel and failure simulation control.
- src/App.tsx — Connected explanations to the authoritative checker and cleared stale or delayed results safely.
- src/index.css — Styled the new explanation panel, controls, loading state, and fallback state.
The explanation never overrides availability, invents times, or exposes external data. The project builds successfully.
```

### 4.2 Every changed file, decided

**Decision:** `accept`, `modify` or `reject`.

I compared every source-file difference in the Bolt.new ZIP with the local baseline and applied only the accepted parts. The ZIP omitted `src/booking.ts` and `src/booking.test.ts`; both remain in the project with all 24 baseline tests. The archive had no direct provider fetch, `VITE_...KEY` read, API key, login, or database.

| File | What the assistant changed | Decision | Why |
| --- | --- | --- | --- |
| `src/types.ts` | Added the six reason codes and explanation input, adapter, and result types. | accept | The types match the §3.2 contract and do not change booking decisions. |
| `src/lib/checkAvailability.ts` | Removed the call to `booking.ts` and introduced a second `canBook` and `availabilityReason` with copied booking rules. | modify | Rejected the duplicate `canBook`; kept the original checker and derived reason codes from its existing `getBookingIssue` logic. |
| `src/explain.ts` | Added input/output validation, `explainAvailability`, a timeout, and reason-code fallbacks. | modify | Fixed the output check so contradictory status claims fall back; cleared the timeout after completion. |
| `src/mockExplanationAdapter.ts` | Added `createMockExplanationAdapter` with deterministic text and simulated failure. | accept | It is local and uses no provider call, key, or external data. |
| `src/components/ExplanationPanel.tsx` | Added the Explain availability button, generated label, loading state, and failure toggle. | accept | The explanation is visually separate from the confirmed status and the button requires a current result. |
| `src/App.tsx` | Connected the explanation UI, result clearing, and delayed-result guard; imported Bolt's new `canBook` from `lib/checkAvailability.ts`. | modify | Kept the UI behavior but used the original `booking.ts → canBook` once when showing the decision; the Explain button uses the stored result and never decides again. |
| `src/index.css` | Styled the explanation panel, button, loading, and fallback text. | accept | Styling changes do not affect AC1–AC6 or expose external services. |
| `src/lib/time.ts` | Allowed parsing `24:00`, but changed `fmtTime(1440)` to `00:00`. | modify | Kept the parser support for end-of-day and rejected the formatting change, preserving the AC6 `24:00` result. |
| `src/booking.ts` and `src/booking.test.ts` (omitted from ZIP) | The Bolt export did not include the authoritative function or its 24 baseline tests. | reject | Do not delete or replace these files; preserving their rules and tests is required by F1. |
| `src/explain.test.ts` | Added E1–E9 and a contradictory-output regression test during local integration. | accept | The tests exercise validation, timeout, failure fallback, and result agreement. |
| `src/vite-env.d.ts` | Added Vite client types during local integration. | accept | Required for the dev-only failure toggle to type-check in the build. |
| `package.json`, `package-lock.json` | Added Vitest as a dev dependency during local integration. | accept | The baseline build failed because the existing booking test imported undeclared `vitest`; the declared dependency makes tests and TypeScript build reproducible. |

### 4.3 The adapter

| | |
| --- | --- |
| The mock adapter (its name in `explain.ts`) | `mockAdapter` parameter; supplied by `createMockExplanationAdapter` from `src/mockExplanationAdapter.ts` |
| The timeout (milliseconds) | 1200 (`DEFAULT_EXPLANATION_TIMEOUT_MS`) |
| A real-model adapter too? (`no`, or `yes` and where it runs, and where its key lives) | no |

---

## 5. Task 4 — prompt engineering

### 5.1 Three instructions

```text
A: (paste here)
```

```text
B: (paste here)
```

```text
C: (paste here)
```

### 5.2 The three inputs and the answers

The same three JSON inputs (`available`, `overlap`, `room_blocked`), sent after each prompt in a fresh
chat, and the answers, unedited:

```text
(paste here)
```

### 5.3 The comparison

**Clarity** and **consistency:** 1 (poor) to 3 (good). **Agrees with the facts:** `yes` or `no`.
**Invented:** what it made up (a time, a booking, a person), or `nothing`.

| Prompt | Clarity | Consistency | Agrees with the facts | Invented |
| --- | --- | --- | --- | --- |
| A | | | | |
| B | | | | |
| C | | | | |

### 5.4 The one I chose

**Chosen:** A / B / C

<!-- Why, from the table above. Then confirm it is in explain.ts as SYSTEM_INSTRUCTION. -->

---

## 6. Task 5 — tests

### 6.1 The test cases

**Verdict:** `pass`, `fail` or `not run`. **How:** the Vitest test title, or `manual` and what you did.

| ID | Case | Expected | Observed | Verdict | How |
| --- | --- | --- | --- | --- | --- |
| E1 | available | | | | |
| E2 | overlap | | | | |
| E3 | blocked room | | | | |
| E4 | invalid time | | | | |
| E5 | past time | | | | |
| E6 | empty input | | | | |
| E7 | long input | | | | |
| E8 | timeout | | | | |
| E9 | simulated API failure | | | | |
| UI | the UI never changes the deterministic decision | | | | |

### 6.2 The run after the feature

The real output of `npx vitest run` with `explain.test.ts` in place (before the review fixes):

```text
(paste here)
```

### 6.3 Screenshots

| File | What it shows |
| --- | --- |
| `evidence/explain-available.png` | |
| `evidence/explain-fallback.png` | |

---

## 7. Task 6 — the agentic code review

### 7.1 The reviewer and its context

Where it ran, how you made sure it could not edit, and what you gave it (the diff, README,
`AGENTS.md`, the criteria):

<!-- Write below this line -->

### 7.2 The review prompt and the answer

What you sent, exactly (the deck's prompt):

```text
(paste here)
```

The reviewer's answer, pasted unedited:

```text
(paste here)
```

### 7.3 The findings, verified

At least **three**; at least **two** `confirmed`. **Category:** `correctness`, `security`,
`maintainability`, `performance` or `tests`. **Severity:** `high`, `medium` or `low`. **Found by:**
`reviewer`, `me` or `both`.

| ID | Finding (short) | Category | Severity | File | How I verified it | Label | Found by |
| --- | --- | --- | --- | --- | --- | --- | --- |
| V1 | | | | | | | |
| V2 | | | | | | | |
| V3 | | | | | | | |

### 7.4 My own inspection, and the linter

What you checked by hand that the reviewer did not, and which of these findings a linter would have
caught and which it could not:

<!-- Write below this line -->

---

## 8. Task 7 — repair and regression-test

### 8.1 The first fix

**Finding:** V?

**Why it is necessary:**

**What I rejected from the assistant's proposal, and why:**

The diff (`git diff`):

```text
(paste here)
```

### 8.2 The second fix

**Finding:** V?

**Why it is necessary:**

**What I rejected from the assistant's proposal, and why:**

The diff (`git diff`):

```text
(paste here)
```

### 8.3 The final run

The real output of the **full** suite after both fixes: the old booking tests and the feature tests
together. Every test must pass.

```text
(paste here)
```

### 8.4 Ready for demonstration?

**Ready:** yes / no

**What remains unresolved:**

<!-- Write below this line -->

---

## 9. Checks I am keeping as FAIL or ERROR

Use the same IDs as `known_fails` in `submission.yml`. Write `none` if the run is clean.

| Check | Why it stays |
| --- | --- |
| | |

---

## 10. Reflection

<!-- 80-150 words, in your own words, without the assistant: what the AI generated, what you
     verified, and what you changed. Name at least one finding ID (V1...) and one test ID (E1...).
     Worthless: "AI helped me build the feature faster and the review was useful."
     Worth everything: "Bolt wrote explain.ts and put a fetch to the OpenAI API in App.tsx with a
     VITE_ key; I rejected that file and kept the mock (X4). The reviewer's V3, 'prompt injection
     through roomLabel', was unsupported: the label comes from a fixed list. E8 failed at first
     because the timeout was never armed; V1 was confirmed by a test that failed before the fix." -->

<!-- Write your reflection below this line -->
