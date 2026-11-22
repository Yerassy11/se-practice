# Week 10 — Lab report

**Name:** Khudaibergen Yerassyl
**Group:** Monday 16:00-19:00
**Date:** 2026-11-22

Fill in every section. **Do not delete, rename or renumber the headings.** The checker and the
grader find your answers by them. You can add rows to any table, but never remove its header.

---

## 1. Setup

| | |
| --- | --- |
| Assistant I reviewed with (tool) | ChatGPT |
| Exact model (with its version, or `not displayed`) | Astra-6 |
| Where the assistant read the project (Bolt.new / Claude Code / Cursor / Copilot / chat with pasted files) | Bolt.new |
| Starting point (`week-08` or `week-07`) | week-08 |
| Baseline commit — the checkpoint of Part 0 | 5b41756 |
| Where I ran the tests (Bolt terminal / my computer / Codespace) | my computer |
| Vitest version (the `RUN  v…` line of a run) | 3.2.4 |

---

## 2. Task 1 — the baseline

### 2.1 The project's commands

Run each command in `week-10/app/project/` before any change (the source and tests are in this nested package). **Exists:** `yes` or `no` (is there such a
script, or such a tool in `package.json`?). **Result:** `pass`, `fail`, `missing` or `not run`.

| Command | Exists | Result | Note |
| --- | --- | --- | --- |
| `npx vitest run` | no | pass | `project/package.json` does not declare Vitest; `npx` used the parent `app/node_modules` installation. After an initial sandbox access error before tests, the unrestricted baseline run passed 23/23 tests (Vitest 3.2.4). |
| `npm test` | no | missing | `npm pkg get scripts` lists only `dev`, `build`, and `preview`; npm reported `Missing script: "test"`. The parent package has a `test` script, but this package does not. |
| `npm run test:unit` (the test command in `AGENTS.md`) | no | missing | npm reported `Missing script: "test:unit"`; the command in `AGENTS.md` is stale. |
| `npm run build` | yes | pass | `tsc -b && vite build` completed; Vite 5.4.21 transformed 39 modules and built in 754 ms after the same sandbox access error on the first attempt. |
| `npm run lint` | no | missing | npm reported `Missing script: "lint"`. |

### 2.2 The baseline test run

The **real** output of the first completed `npx vitest run` in `week-10/app/project/`, before any source change. The earlier sandboxed attempt stopped while loading `vite.config.ts` with `Access is denied`, before tests could run:

```text

 RUN  v3.2.4 C:/Users/Acer/Desktop/SE/week-10/app/project

 ✓ src/booking.test.ts (23 tests) 6ms

 Test Files  1 passed (1)
      Tests  23 passed (23)
   Start at  23:04:06
   Duration  753ms (transform 52ms, setup 0ms, collect 54ms, tests 6ms, environment 0ms, prepare 133ms)



```

### 2.3 The agent reads the playbook

What you sent, exactly (the Practice #09 prompt):

```text
Read the root AGENTS.md before making changes. Summarize the project constraints and the exact test commands you found. Do not edit anything yet. If you cannot read AGENTS.md, tell me, and I will paste its content. Do not claim that AGENTS.md was automatically loaded.
```

The assistant's answer, pasted unedited:

````text
I have read the AGENTS.md content you pasted and reviewed the four uploaded project files. I did not independently access an AGENTS.md file from the repository root, and I have not modified any files.
1. Project overview
Project: Smart Campus Room Availability Checker
Technology: React, TypeScript, Vite, Vitest.
File
Responsibility
src/booking.ts
Booking validation using canBook()
src/App.tsx
User interface and availability checking
src/booking.test.ts
Unit tests for acceptance criteria
package.json
Project scripts and dependencies
The application checks whether a campus room is available for a requested time. It is intended to be read-only.
2. Acceptance criteria
Criterion
Requirement
AC1
Reject start >= end and requests in the past
AC2
Maximum duration: 120 minutes
AC3
Reject blocked rooms
AC4
Reject overlapping bookings, including endpoint touching
AC5
Return Available / Unavailable without modifying booking data
3. Exact commands from AGENTS.md
Install dependencies
 Copy
```
npm install
```
Start development server
 Copy
```
npm run dev
```
Run unit tests
 Copy
```
npm run test:unit
```
Production build
 Copy
```
npm run build
```
Production deployment after successful build
 Copy
```
npx netlify deploy --prod
```
Important discrepancy: The uploaded package.json contains only this script:
```
"scripts": {
  "test": "vitest run"
}
```
Therefore, the test command actually defined in the provided package is:
```
npm test
```
The prescribed npm run test:unit is not defined in that uploaded package.json. Neither are dev or build. I have not executed any commands.
4. Additional project instructions
The supplied AGENTS.md also states that:
- 
Real KBTU room names and timetables should be used.
- 
Project files may be edited when necessary.
- 
Packages may be added when required.
- 
Supabase persistence and a login page are permitted if persistent bookings are needed.
- 
The page must still load before completion.
- 
A successful build should be followed by a Netlify production deployment.
These permissions do not make database integration or deployment necessary for every task.
5. Issues identified without editing
AC4 conflict: AGENTS.md requires endpoint touching to be rejected. However, booking.ts currently uses:
```
start < b.end && end > b.start
```
This allows touching intervals. Several uploaded tests explicitly expect touching to be allowed, contradicting AGENTS.md.
AC5: The uploaded canBook() implementation returns a Boolean and does not visibly mutate the supplied bookings array. Its returned Boolean is translated into an availability decision by App.tsx.
Sample data: App.tsx currently identifies its data as fictional, whereas AGENTS.md requests real KBTU room names and timetable information.
6. Current status
AGENTS.md pasted content reviewed
Four uploaded files reviewed
Acceptance criteria and commands identified
No modifications, tests, builds, or deployments performed
Conclusion: Before future changes, the key issues to resolve are the conflicting AC4 expectations and the mismatch between AGENTS.md commands and the uploaded package.json. The supplied AGENTS.md explicitly requires endpoint touching to count as an overlap, so that is the documented project contract, even though existing tests disagree.
````

Which rules in its summary are wrong for this project, and how you know:

The summary repeated the stale playbook: `README.md` §3 allows touching endpoints under AC4, requires fictional bookings, and excludes login, databases, secrets, and external deployments. The playbook also omitted AC6. The assistant treated the parent `app/package.json` as the whole project: the source package in `app/project/package.json` has `dev` and `build`, but neither `test` nor `test:unit`. The actual baseline test command was `npx vitest run` in `app/project/`, using Vitest from the parent installation.

---

## 3. Tasks 2–3 — the read-only review and the challenge

### 3.1 The review prompt and the answer

Where it ran, and how you made sure it could not edit:

The review ran in a separate ChatGPT chat with four uploaded project files and the text of `AGENTS.md` pasted into the chat. The reviewer had no repository connection or write access; its answer explicitly says it did not modify files. For my read-only verification, `git status --short` before and after inspecting files showed the same pre-existing line: ` M week-10/lab-report.md`. No project file changed during the review.

What you sent, exactly (the deck's prompt):

```text
Act as a cautious software reviewer. Inspect this Smart Campus Room Availability Checker WITHOUT editing files. Identify risks in correctness, security, privacy, reliability, maintainability, and agent operations. For each risk, cite the exact file/function or missing check, explain the impact, suggest a way to verify it, and state uncertainty. Do not invent test results.
```

The assistant's answer, pasted unedited:

````text
I have read the **AGENTS.md content you pasted** and reviewed the four uploaded project files. I did not independently access an `AGENTS.md` file from the repository root, and I have not modified any files.

## **1. Project overview**

**Project:** Smart Campus Room Availability Checker



**Technology:** React, TypeScript, Vite, Vitest.

|   |
| - |

File

|   |
| - |

Responsibility

|   |
| - |

`src/booking.ts`

|   |
| - |

Booking validation using `canBook()`

|   |
| - |

`src/App.tsx`

|   |
| - |

User interface and availability checking

|   |
| - |

`src/booking.test.ts`

|   |
| - |

Unit tests for acceptance criteria

|   |
| - |

`package.json`

|   |
| - |

Project scripts and dependencies

The application checks whether a campus room is available for a requested time. It is intended to be read-only.

## **2. Acceptance criteria**

|   |
| - |

Criterion

|   |
| - |

Requirement

|   |
| - |

AC1

|   |
| - |

Reject `start >= end` and requests in the past

|   |
| - |

AC2

|   |
| - |

Maximum duration: 120 minutes

|   |
| - |

AC3

|   |
| - |

Reject blocked rooms

|   |
| - |

AC4

|   |
| - |

Reject overlapping bookings, **including endpoint touching**

|   |
| - |

AC5

|   |
| - |

Return Available / Unavailable without modifying booking data

## **3. Exact commands from AGENTS.md**

**Install dependencies**

&#x20;Copy
```
npm install
```

**Start development server**

&#x20;Copy
```
npm run dev
```

**Run unit tests**

&#x20;Copy
```
npm run test:unit
```

**Production build**

&#x20;Copy
```
npm run build
```

**Production deployment after successful build**

&#x20;Copy
```
npx netlify deploy --prod
```

**Important discrepancy:** The uploaded `package.json` contains only this script:
```json
"scripts": {
  "test": "vitest run"
}
```

Therefore, the test command actually defined in the provided package is:
```
npm test
```

The prescribed `npm run test:unit` is not defined in that uploaded `package.json`. Neither are `dev` or `build`. I have not executed any commands.

## **4. Additional project instructions**

The supplied AGENTS.md also states that:

- Real KBTU room names and timetables should be used.
- Project files may be edited when necessary.
- Packages may be added when required.
- Supabase persistence and a login page are permitted if persistent bookings are needed.
- The page must still load before completion.
- A successful build should be followed by a Netlify production deployment.

These permissions do not make database integration or deployment necessary for every task.

## **5. Issues identified without editing**

**AC4 conflict:** AGENTS.md requires endpoint touching to be rejected. However, `booking.ts` currently uses:
```arduino
start < b.end && end > b.start
```

This allows touching intervals. Several uploaded tests explicitly expect touching to be allowed, contradicting AGENTS.md.



**AC5:** The uploaded `canBook()` implementation returns a Boolean and does not visibly mutate the supplied bookings array. Its returned Boolean is translated into an availability decision by `App.tsx`.



**Sample data:** `App.tsx` currently identifies its data as fictional, whereas AGENTS.md requests real KBTU room names and timetable information.

## **6. Current status**

AGENTS.md pasted content reviewed

Four uploaded files reviewed

Acceptance criteria and commands identified

No modifications, tests, builds, or deployments performed

**Conclusion:** Before future changes, the key issues to resolve are the conflicting AC4 expectations and the mismatch between AGENTS.md commands and the uploaded `package.json`. The supplied AGENTS.md explicitly requires endpoint touching to count as an overlap, so that is the documented project contract, even though existing tests disagree.
````

### 3.2 Challenging the AI's claims

At least **five** claims from the answer, across at least **three** categories. **What I
inspected** is what you opened or ran yourself. **Label:** `confirmed`, `plausible` or
`unsupported`.

| # | The AI's claim (short) | Category | What I inspected | Label | Why |
| --- | --- | --- | --- | --- | --- |
| 1 | `canBook()` allows bookings that only touch at endpoints. | Correctness | Opened `app/project/src/booking.ts`: `start < b.end && end > b.start`; opened `booking.test.ts` cases T01, T08, X2. | confirmed | Equality at either endpoint makes the overlap expression false, and those tests expect `true`. This agrees with `README.md` AC4, so it is a conflict with `AGENTS.md`, not a proven correctness defect. |
| 2 | `canBook()` returns a Boolean without mutating bookings; `App.tsx` uses it for the decision. | Correctness | Opened `booking.ts` `canBook`, `booking.test.ts` AC5 cases, and `App.tsx` `handleSubmit`. | confirmed | The function only reads bookings and returns `true` or `false`; `handleSubmit` uses that Boolean for `decision`. The tests assert unchanged fixtures. |
| 3 | The uploaded `package.json` only has `test`, with no `dev` or `build`. | Reliability | Opened both `app/package.json` and `app/project/package.json`; ran `npm pkg get scripts` in `app/project`. | unsupported | True of the parent helper package, but the actual source package has `dev`, `build`, and `preview`. The AI applied the wrong manifest to the source package. |
| 4 | `npm run test:unit` is prescribed but undefined. | Reliability | Opened `app/AGENTS.md` and `app/project/package.json`; the baseline `npm run test:unit` returned `Missing script`. | confirmed | The command in the agent instructions cannot run in the source package. |
| 5 | `AGENTS.md` makes endpoint touching an overlap under the documented project contract. | Maintainability | Compared `app/AGENTS.md` AC4 with `README.md` §3 AC4 and `app/project/src/booking.test.ts`. | unsupported | `AGENTS.md` says touching is rejected, but `README.md` explicitly allows it and the tests encode that rule. The AI did not inspect the controlling README. |
| 6 | The agent instructions call for a Netlify production deploy after a passing build. | Agent operations | Opened `app/AGENTS.md`, final line under “Before you finish”; compared `README.md` §3 constraints. | confirmed | The literal command `npx netlify deploy --prod` is present, while the lab scope excludes external production services. No deploy was attempted. |
| 7 | The UI labels its sample data fictional, while `AGENTS.md` asks for real KBTU data. | Maintainability | Opened `app/project/src/App.tsx` footer, `src/data/rooms.ts` comment/data, `app/AGENTS.md` project paragraph, and `README.md` §3. | confirmed | The file and UI explicitly say fictional, and the README requires fictional bookings. The real-data instruction is stale. |

The AI gave no specific Security or Privacy risk with file evidence, impact, verification, and uncertainty. Its omission is not evidence that those categories are risk-free. Rows 3 and 5 are not confirmed risks for the register.

---

## 4. Task 4 — the risk register

### 4.1 The register

At least five risks, each `confirmed` or `plausible`; at least two `confirmed`; at least three
categories. **Score = L × I.** **Component** is a path inside `app/` or `missing: <check>`.

| ID | Category | Cause → event → consequence | Component | Evidence | Status | L | I | Score | Mitigation | Owner | Verification |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| R1 | Agent operations | The playbook orders `netlify deploy --prod` after a build → an agent follows it → an unapproved external production deployment violates project scope. | `AGENTS.md` | The final “Before you finish” line contains `npx netlify deploy --prod`; `README.md` §3 forbids external production services. No deployment was made. | confirmed | 3 | 3 | 9 | Replace the deployment instruction with an explicit no-deploy rule and a human review gate. | Project maintainer | Inspect the approved `AGENTS.md` diff; confirm no deploy command remains; review the final status and evidence before release. |
| R2 | Correctness | `fmtTime` wraps minute 1440 to `00:00` → a valid end-of-day result displays the start of a day → the availability message can mislead a user about the requested interval. | `project/src/lib/time.ts` | Direct Node call returned `fmtTime(1440)=00:00`; `project/src/booking.ts` accepts `end <= 1440`; the UI hint says `00:00–24:00`. | confirmed | 3 | 2 | 6 | Add a regression test expecting `fmtTime(1440)` to be `24:00`, record it failing, then special-case that boundary in the formatter. | Project maintainer | Capture the red test before the edit, then a green full Vitest run and a build; inspect the end-of-day message. |
| R3 | Privacy | The playbook requests real KBTU names and timetable → an agent replaces fictional fixtures with real schedule information → the project may disclose real operational data and break the fictional-data constraint. | `AGENTS.md` | The Project paragraph asks for “real room names and the real timetable”; `README.md` §3 requires fictional bookings and `project/src/data/rooms.ts` labels its data fictional. | confirmed | 2 | 2 | 4 | Change the playbook to require fictional room names and bookings only. | Project maintainer | Inspect the `AGENTS.md` diff and search project data for real timetable references. |
| R4 | Reliability | `AGENTS.md` names `npm run test:unit` → an agent runs a missing script → it cannot verify a change using its own instructions. | `project/package.json` | `npm pkg get scripts` in `app/project` listed only `dev`, `build`, `preview`; the baseline `npm run test:unit` returned `Missing script`. | confirmed | 2 | 2 | 4 | Correct the playbook to name the working directory and the actual Vitest command. | Project maintainer | Compare `AGENTS.md` with `npm pkg get scripts` and run the documented test command. |
| R5 | Maintainability | No lint command or linter dependency is configured → hook or style regressions can escape routine local checks → review effort and repair cost increase. | `missing: lint script in project/package.json` | `npm pkg get scripts` has no `lint`; `npm run lint` returned `Missing script`; `project/package.json` has no ESLint dependency. | confirmed | 2 | 1 | 2 | Add a real linter configuration and script when static checks are adopted, rather than a placeholder command. | Project maintainer | Verify that `npm run lint` executes actual rules and returns a meaningful result. |

### 4.2 The top two for action

Two confirmed risks, highest score first, each with the evidence that justifies its score.

1. **R1 — 3 × 3 = 9.** Likelihood is 3 because the final line of `AGENTS.md` tells an agent to deploy whenever the build passes, making the action a normal playbook step. Impact is 3 because `--prod` publishes externally without review and violates the explicit no-external-services rule in `README.md`. The instruction is confirmed; no deployment has occurred.
2. **R2 — 3 × 2 = 6.** Likelihood is 3 for an end-of-day boundary because the direct call reproducibly returns `00:00` for minute 1440, which `booking.ts` accepts. Impact is 2 because that message obscures whether the interval ends tonight or begins at midnight. A failing regression test can pin the expected `24:00` before a small formatter fix.

---

## 5. Task 5 — the agent-readiness audit

### 5.1 The rows

`yes` or `no` for each row (README Part 5), and the evidence: the file or script that shows it, or
what is missing.

| Row | What | yes / no | Evidence |
| --- | --- | --- | --- |
| 1a | Formatter | no | No `.prettierrc*` or `prettier.config.*` under `app/`; neither `app/package.json` nor `app/project/package.json` declares Prettier. |
| 1b | Linter | no | No `eslint.config.*` or `.eslintrc*` under `app/`; neither package declares ESLint or a `lint` script. |
| 1c | Type checks | no | The `app/` package has no `tsconfig.json` or TypeScript dependency. Both exist only in the separate `app/project/` package, whose build runs `tsc -b`. |
| 1d | Unit tests | yes | `app/project/src/booking.test.ts` imports Vitest and contains unit tests; the parent `app/package.json` declares `vitest: ^3.2.4`. The split packages make setup fragile, but both pieces exist under `app/`. |
| 1e | Pinned dependencies (lockfile) | yes | `app/package-lock.json` exists; the nested source package also has `app/project/package-lock.json`. |
| 2a | `.env.example` | no | No `app/.env.example` or `app/project/.env.example` beside either package manifest. |
| 2b | Architecture notes | yes | The “Project” paragraph in `app/AGENTS.md` names `booking.ts`, `App.tsx`, and `booking.test.ts` and their roles. Its `src/` paths omit the actual `project/` folder, so the note needs correction. |
| 2c | `AGENTS.md` | yes | `app/AGENTS.md` exists; it is the copied agent playbook, with conflicts recorded in §3 and §4. |
| 3a | CI | no | No repository `.github/workflows/` directory or workflow running checks on each push. |
| 3b | Pre-commit hooks | no | No `.husky/` or `.pre-commit-config.yaml`, and no `lint-staged` or `simple-git-hooks` dependency in either package. |
| 3c | Integration checks | no | The only project test file is `app/project/src/booking.test.ts`; it imports `canBook` only. No page or multi-module test exists. |
| 3d | Reviewable evidence | no | No CI log or PR template requiring test output for an agent change; `week-10/evidence/` currently contains only `.gitkeep`. |

### 5.2 The level and the gaps

**Level:** 0

**Missing evidence for the next level:**

Level 1 has 2/5 yes rows (1d, 1e), below the required 4/5. To reach it, the `app/` package needs a real Prettier setup (1a), a real ESLint setup (1b), and a `tsconfig.json` with TypeScript declared in that same package (1c), or the source package must become the unambiguous project root. Level 2 has 2/3 (2b, 2c), but cannot be reached before Level 1; an `.env.example` is missing (2a). Level 3 has 0/4: CI, hooks, integration checks, and required review evidence are absent.

The `week-10/README.md` layout shows `app/src`, but the actual source is under `app/project/src` and there are two manifests. `app/AGENTS.md` also omits `project/` from its paths and names a missing test script, so the documentation is only partly accurate.

---

## 6. Task 6 — the agent playbook

### 6.1 The playbook prompt and the answer

What you sent, exactly (the deck's prompt):

```text
Review AGENTS.md and project documentation only. Compare them with these constraints: one fictional room; no login/database; preserve AC1–AC6; no secrets; no external deployments; run tests before proposing acceptance. Report missing or conflicting rules. Draft a minimal patch to AGENTS.md, but wait for my approval before applying it.
```

The assistant's answer, pasted unedited:

```text
I reviewed the AGENTS.md text provided in this conversation against your six constraints. I also used the previously supplied project structure for context. No files have been changed, and no commands have been executed.

1. Documentation review
Constraint

Current AGENTS.md

Status

One fictional room

Requires real KBTU room names and timetable

Conflict

No login/database

Explicitly permits Supabase and login

Conflict

Preserve AC1–AC6

Defines only AC1–AC5

Missing AC6

No secrets

No rule about credentials or environment variables

Missing

No external deployments

Requires npx netlify deploy --prod

Conflict

Run tests before proposing acceptance

Requires page and build checks, but not tests

Missing

Additional findings
AC4 needs clarification. AGENTS.md currently states that endpoint touching counts as an overlap. The supplied unit tests expect touching intervals to be accepted. The proposed patch preserves the existing AGENTS.md requirement for now, rather than silently changing the acceptance contract.

AC6 is undefined. The earlier project context describes AC6 as clear UI feedback, but the supplied AGENTS.md does not define it. The patch below uses that definition provisionally.

Test command mismatch. AGENTS.md specifies npm run test:unit, while the uploaded package.json defines npm test (vitest run). The patch uses the command supported by that package file.

2. Proposed minimal AGENTS.md patch
This is a draft only. It is not applied.

Proposed AGENTS.md patch
Project
Replace:

For realism, use real room names and the real timetable from the KBTU portal.

With:

Use exactly one fictional campus room with fictional booking data. Do not introduce additional rooms or retrieve real university timetables.

Acceptance contract
Keep AC1–AC5 as currently written.

Add:

AC6 Provide clear UI feedback explaining whether a requested time slot is Available, Unavailable, or invalid, including the reason when rejected.

Commands
Replace:

Tests: npm run test:unit

With:

Tests: npm test (vitest run)

Keep the install, development, and build commands documented, but verify that their scripts exist in package.json before invoking them.

You may
Remove:

If bookings need to persist, add a small Supabase table and a login page.

Add:

Keep the application read-only and limited to one fictional room.

Do not add login, authentication, databases, Supabase, or persistent storage.

Do not introduce, expose, or commit secrets, credentials, API keys, or tokens.

Do not add external services or deployments.

Before you finish
Replace:

Make sure the page still loads.

When the build passes, publish a preview with npx netlify deploy --prod so the team can see it.

With:

Run npm test and report the results before proposing acceptance.

Verify that the application still loads.

Run npm run build if the script is available.

Report any failing tests, unresolved acceptance-criteria conflicts, or unavailable commands.

Do not claim acceptance when required tests fail or have not been executed.

Do not deploy externally or publish the application.

3. Rules requiring confirmation
Two details remain unresolved:

AC4: Should touching intervals be rejected as the current AGENTS.md requires, or accepted as the existing tests require?

AC6: Is clear UI feedback the exact intended sixth acceptance criterion?

The patch deliberately avoids changing AC4 until its intended behavior is established.

Status: Proposed patch only. Awaiting your approval before modifying AGENTS.md or any other project file.
```

### 6.2 Findings and my decisions

One row per missing or conflicting rule the answer reported, plus any it missed. **Decision:**
`approve`, `reject` or `modify`.

| # | Rule or line in AGENTS.md | Missing / conflicting | Decision | Why |
| --- | --- | --- | --- | --- |
| 1 | Project: “For realism, use real room names and the real timetable” | conflicting | approve | `README.md` §3 requires one fictional room and fictional bookings; real KBTU data is outside scope. |
| 2 | “If bookings need to persist, add a small Supabase table and a login page” | conflicting | approve | The project is a read-only checker; `README.md` §3 excludes login, database, and external production services. Replace this permission with a prohibition. |
| 3 | AC4: touching endpoints count as overlap; AI proposed keeping AC1–AC5 unchanged | conflicting | reject | `README.md` §3 explicitly allows touching, and `project/src/booking.test.ts` cases T01, T08, and X2 agree. Change AC4 to the documented rule. |
| 4 | AC6 missing; AI proposed detailed Available/Unavailable/invalid feedback | missing | modify | Add AC6 using the exact `README.md` requirement: clear UI feedback on desktop and mobile. The extra wording is not the stated acceptance contract. |
| 5 | No rule forbidding secrets or credentials | missing | approve | `README.md` §3 forbids real keys and personal information; add a direct prohibition on secrets and credentials. |
| 6 | Final instruction requires `npx netlify deploy --prod` | conflicting | approve | Remove the production deployment command and forbid external publishing; `README.md` §3 excludes external services. |
| 7 | No requirement to run tests before proposing acceptance | missing | approve | Add a rule to run and report tests before proposing acceptance, including failures or unavailable commands. |
| 8 | Tests command `npm run test:unit`; AI proposed `npm test` | conflicting | modify | `npm pkg get scripts` in the source package `app/project` has no `test` or `test:unit`. The baseline `npx vitest run` passed there using Vitest installed by the parent `app/package.json`. Document both installs; run dev/build through `npm --prefix project run ...` from `app/` and Vitest from `app/project/`. |

### 6.3 The approved patch

`git diff 5b41756 -- week-10/app/AGENTS.md`, showing the full approved patch against the baseline checkpoint:

```text
diff --git a/week-10/app/AGENTS.md b/week-10/app/AGENTS.md
index b786d88..6d6a8fb 100644
--- a/week-10/app/AGENTS.md
+++ b/week-10/app/AGENTS.md
@@ -9,30 +9,32 @@ A React + TypeScript page (Vite) that tells a student whether a campus room is f
 requested time. The booking rule lives in `src/booking.ts` (`canBook`); the page is `src/App.tsx`;
 the tests are in `src/booking.test.ts`.
 
-For realism, use real room names and the real timetable from the KBTU portal.
+Use exactly one fictional room with fictional bookings; do not use real names or timetables.
 
 ## Acceptance contract
 
 - AC1 Reject start ≥ end and requests in the past.
 - AC2 Enforce the maximum allowed duration (120 minutes).
 - AC3 Reject a blocked room.
-- AC4 Reject overlaps. A request that touches a booking at an endpoint also counts as an overlap.
+- AC4 Reject overlaps; allow bookings that only touch at endpoints.
 - AC5 Return Available / Unavailable without changing booking data.
+- AC6 Preserve clear UI feedback on desktop and mobile.
 
 ## Commands
 
-- Install: `npm install`
-- Dev server: `npm run dev`
-- Tests: `npm run test:unit`
-- Build: `npm run build`
+- Install: from `app/` run `npm install` and `npm --prefix project install`; run dev/build there and tests from `app/project/`.
+- Dev server: `npm --prefix project run dev`
+- Tests: `npx vitest run`
+- Build: `npm --prefix project run build`
 
 ## You may
 
 - Edit any file in the project.
 - Add packages when a task needs them.
-- If bookings need to persist, add a small Supabase table and a login page.
+- Do not add login, databases, persistence, secrets, credentials, personal data, or external services.
 
 ## Before you finish
 
 - Make sure the page still loads.
-- When the build passes, publish a preview with `npx netlify deploy --prod` so the team can see it.
+- Run and report tests before proposing acceptance; disclose failures or unavailable checks.
+- Do not deploy or publish externally; require human approval before release.
```

---

## 7. Task 7 — verify safely

### 7.1 The regression test fails before the mitigation

The risk it covers: **R2**. The real run of `npx vitest run` in `app/project/`, after adding `R2 AC6` and before any source change:

```text

 RUN  v3.2.4 C:/Users/Acer/Desktop/SE/week-10/app/project

 ❯ src/booking.test.ts (24 tests | 1 failed) 15ms
   × R2 AC6: displays an accepted end-of-day boundary as 24:00 10ms
     → expected '00:00' to be '24:00' // Object.is equality
   ✓ BUG-A: allows a 30-minute request touching two bookings at both endpoints (AC4) 0ms
   ✓ BUG-B: an available non-touching request leaves booking data unchanged (AC5) 0ms
   ✓ canBook — AC1: valid interval and future start > AC1: rejects a start before minute zero independently of the current time 0ms
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
   ✓ canBook — AC4: overlap detection > T01: accepts touching after an existing booking 0ms
   ✓ canBook — AC4: overlap detection > T08: accepts touching before an existing booking 0ms
   ✓ canBook — AC4: overlap detection > T09: rejects partial overlap 0ms
   ✓ canBook — AC4: overlap detection > T10: rejects a request containing an existing booking 0ms
   ✓ canBook — AC4: overlap detection > T11: rejects a request fully inside an existing booking 0ms
   ✓ canBook — AC4: overlap detection > T12: rejects an interval identical to an existing booking 0ms
   ✓ canBook — AC4: overlap detection > T14: accepts the request when there are no existing bookings 0ms
   ✓ canBook — AC4: overlap detection > X2: accepts an interval touching two bookings at both endpoints 0ms
   ✓ canBook — AC5: Boolean result and no input mutation > AC5: returns true and leaves booking data unchanged for an available request 0ms
   ✓ canBook — AC5: Boolean result and no input mutation > AC5: leaves booking data unchanged when the request is rejected 0ms

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  src/booking.test.ts > R2 AC6: displays an accepted end-of-day boundary as 24:00
AssertionError: expected '00:00' to be '24:00' // Object.is equality

Expected: "24:00"
Received: "00:00"

 ❯ src/booking.test.ts:7:25
      5| it("R2 AC6: displays an accepted end-of-day boundary as 24:00", () => {
      6|   expect(canBook({ start: 1380, end: 1440, now: 1200, blocked: false, …
      7|   expect(fmtTime(1440)).toBe("24:00");
       |                         ^
      8| });
      9| 

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯


 Test Files  1 failed (1)
      Tests  1 failed | 23 passed (24)
   Start at  23:42:24
   Duration  678ms (transform 59ms, setup 0ms, collect 64ms, tests 15ms, environment 0ms, prepare 197ms)
```

### 7.2 The manual UI check

| View | Width | What I checked | Result | Screenshot |
| --- | --- | --- | --- | --- |
| Desktop | 1280 px viewport | Opened the local Vite page, submitted the default 10:00–11:00 interval while current time was 23:47, and inspected the full-page screenshot. The form, timeline, room list, and “Check your input” reason are readable without overlap. | pass for this invalid-time scenario; end-of-day formatting remains R2 | `evidence/ui-desktop.png` |
| Mobile | 375 px portrait viewport | Repeated the same submitted state at 375 px. Inputs stack vertically; the warning and reason are readable, the room selector remains available below the main panel, and measured `scrollWidth=375`, so there is no horizontal overflow. | pass for this invalid-time scenario; end-of-day formatting remains R2 | `evidence/ui-mobile.png` |

### 7.3 Tests and checks I did not run

<!-- Name each one and why. "None" only if it is true. -->
- A green Vitest run was not possible in Part 7: the new R2 regression test is intentionally failing until the source is fixed in Part 8.
- The build was not rerun after adding the test; the baseline build had passed, and a final build belongs after mitigation.
- `npm run lint` was not run again because the source package has no `lint` script or linter.
- No integration or CI check ran: the repository has only unit tests for `canBook` and no CI workflow.
- The manual UI check exercised invalid-time feedback only; Available/Unavailable feedback and a 24:00 input were not exercised in the browser. The R2 boundary was verified directly in the failing unit test.

---

## 8. Task 8 — mitigate two risks

### 8.1 The first mitigation

**Risk:** R1

**If this is the refactor** — the prompt you sent (README Part 8), then the problem → pattern → benefit
line. Otherwise leave both empty.

```text
```

**Problem → pattern → benefit:**

**What I rejected from the agent's patch, and why:** The AI's proposed `npm test` command and unchanged AC4 rule were rejected in §6.2 because the source package has no `test` script and README §3 allows touching endpoints. The approved R1 change removed the production deployment instruction without changing application code.

The diff I approved (`git diff`):

```text
diff --git a/week-10/app/AGENTS.md b/week-10/app/AGENTS.md
index b786d88..6d6a8fb 100644
--- a/week-10/app/AGENTS.md
+++ b/week-10/app/AGENTS.md
@@ -9,30 +9,32 @@ A React + TypeScript page (Vite) that tells a student whether a campus room is f
 requested time. The booking rule lives in `src/booking.ts` (`canBook`); the page is `src/App.tsx`;
 the tests are in `src/booking.test.ts`.
 
-For realism, use real room names and the real timetable from the KBTU portal.
+Use exactly one fictional room with fictional bookings; do not use real names or timetables.
 
 ## Acceptance contract
 
 - AC1 Reject start ≥ end and requests in the past.
 - AC2 Enforce the maximum allowed duration (120 minutes).
 - AC3 Reject a blocked room.
-- AC4 Reject overlaps. A request that touches a booking at an endpoint also counts as an overlap.
+- AC4 Reject overlaps; allow bookings that only touch at endpoints.
 - AC5 Return Available / Unavailable without changing booking data.
+- AC6 Preserve clear UI feedback on desktop and mobile.
 
 ## Commands
 
-- Install: `npm install`
-- Dev server: `npm run dev`
-- Tests: `npm run test:unit`
-- Build: `npm run build`
+- Install: from `app/` run `npm install` and `npm --prefix project install`; run dev/build there and tests from `app/project/`.
+- Dev server: `npm --prefix project run dev`
+- Tests: `npx vitest run`
+- Build: `npm --prefix project run build`
 
 ## You may
 
 - Edit any file in the project.
 - Add packages when a task needs them.
-- If bookings need to persist, add a small Supabase table and a login page.
+- Do not add login, databases, persistence, secrets, credentials, personal data, or external services.
 
 ## Before you finish
 
 - Make sure the page still loads.
-- When the build passes, publish a preview with `npx netlify deploy --prod` so the team can see it.
+- Run and report tests before proposing acceptance; disclose failures or unavailable checks.
+- Do not deploy or publish externally; require human approval before release.
```

### 8.2 The second mitigation

**Risk:** R2

**If this is the refactor** — the prompt you sent (README Part 8), then the problem → pattern → benefit
line. Otherwise leave both empty.

```text
Refactor the availability logic into a small, pure module, keeping the existing function inputs, outputs, and UI behavior. Use a pattern only if the identified design problem justifies it. Do not add new features or dependencies. Show the files you plan to edit before making changes.
```

The assistant's answer, pasted unedited:

```text
1. Refactoring plan
The main design problem is duplicated availability validation in src/booking.ts. Both canBook() and getBookingIssue() independently check intervals, duration, blocked status, and overlapping bookings.

I recommend a minimal refactor using a single shared validation function, rather than introducing a Strategy, Factory, or other design pattern. This keeps the logic pure and avoids unnecessary abstraction.

Files planned for modification
File

Planned action

src/booking.ts

Refactor the duplicated validation into one shared implementation

src/booking.test.ts

Keep existing tests unchanged and use them to check for regressions

src/App.tsx

No changes

package.json

No changes

AGENTS.md

No changes

The existing public functions will remain available with the same inputs and outputs. The refactor will preserve the current UI behavior, including the existing endpoint-touching rule, without adding features or dependencies.
```

**Problem → pattern → benefit:** The confirmed R2 problem is that `fmtTime(1440)` wraps a valid end-of-day boundary to `00:00`. No new pattern is justified: simplify the existing pure formatter by removing the modulo, preserving other times and displaying `24:00` correctly.

**What I rejected from the agent's patch, and why:** The AI proposed refactoring duplicate validation in `booking.ts`, but that does not address R2's failing test and would enlarge this mitigation. I am changing only `project/src/lib/time.ts`; `booking.ts`, `App.tsx`, tests, and dependencies remain as they were after Part 7.

The diff I approved (`git diff`):

```text
diff --git a/week-10/app/project/src/lib/time.ts b/week-10/app/project/src/lib/time.ts
index b29ef3d..cb947cc 100644
--- a/week-10/app/project/src/lib/time.ts
+++ b/week-10/app/project/src/lib/time.ts
@@ -1,7 +1,7 @@
 /** Convert minutes-from-midnight to "HH:MM" (24h). */
 export function fmtTime(min: number): string {
   const clamped = Math.max(0, Math.min(1440, Math.round(min)));
-  const h = Math.floor(clamped / 60) % 24;
+  const h = Math.floor(clamped / 60);
   const m = clamped % 60;
   return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
 }
```

### 8.3 The residual risk

| ID | L before | I before | Score before | L after | I after | Score after | Evidence |
| --- | --- | --- | --- | --- | --- | --- | --- |
| R1 | 3 | 3 | 9 | 1 | 3 | 3 | The approved `AGENTS.md` diff removes `netlify deploy --prod` and forbids external publishing; the earlier checker reported C5 PASS. A human could still deploy outside this playbook. |
| R2 | 3 | 2 | 6 | 1 | 2 | 2 | The R2 test failed before the one-line formatter change, then the full 24-test suite and TypeScript/Vite build passed. Another formatter regression remains possible. |

### 8.4 The final run

The real output of the **full** suite after both mitigations. Every test must pass.

```text

 RUN  v3.2.4 C:/Users/Acer/Desktop/SE/week-10/app/project

 ✓ src/booking.test.ts (24 tests) 6ms

 Test Files  1 passed (1)
      Tests  24 passed (24)
   Start at  23:52:13
   Duration  635ms (transform 55ms, setup 0ms, collect 64ms, tests 6ms, environment 0ms, prepare 185ms)
```

Build verification (`npm --prefix project run build` from `app/`):

```text

> smart-campus-room-availability@1.0.0 build
> tsc -b && vite build

vite v5.4.21 building for production...
transforming...
✓ 39 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                   0.93 kB │ gzip:  0.47 kB
dist/assets/index-DRAPpyg3.css    8.03 kB │ gzip:  2.45 kB
dist/assets/index-Dt1OUJaz.js   152.11 kB │ gzip: 48.95 kB
✓ built in 757ms
```

---

## 9. Task 9, and what still fails

### 9.1 A background agent on this project

Rules for an agent working asynchronously on a separate branch. Be specific to this project: name
its files and its commands.

| Rule | What I require |
| --- | --- |
| Isolation | Work only in a separate `week-10-agent` branch or worktree; never edit `main` or the submitted `week-10` branch directly. |
| Permitted files | Propose a reviewed diff limited to `app/project/src/booking.ts`, `app/project/src/lib/time.ts`, `app/project/src/App.tsx`, relevant tests, and `app/AGENTS.md`. |
| Commands | Inspect files read-only; install from `app/`, run `npx vitest run` from `app/project/`, and run `npm --prefix project run build` from `app/`. |
| Prohibited actions | Never deploy, publish, open `.env` files, upload data, add real personal information, or introduce external services or credentials. |
| Required evidence | Attach the exact diff, full Vitest output, build output, updated risk scores, and a written review note explaining every change. |
| Before merging or deploying | A human reviews every diff and actual test/build evidence before merge; deployment remains prohibited even after human review. |

### 9.2 Optional — the deck's checklist prompt (not graded)

<!-- If you sent it: the answer, and one thing it has that your rules in 9.1 do not, or the reverse. -->

### 9.3 Checks I am keeping as FAIL or ERROR

Use the same IDs as `known_fails` in `submission.yml`. Write `none` if the run is clean.

| Check | Why it stays |
| --- | --- |
| none | The latest checker run reported pass=31, fail=0, error=0. |

---

## 10. Release decision and conclusion

**Decision:** CONDITIONAL

<!-- Keep one word above. GO is not allowed while any confirmed risk still scores 6 or more.
     Then 80-150 words, in your own words, without the assistant: why this decision, from the
     register, the tests and what you are still unsure about. Name at least two risk IDs.
     Worthless: "The project is mostly fine, so GO."
     Worth everything: "CONDITIONAL. R2 (the deploy line in AGENTS.md, 3 x 3 = 9) is closed by the
     approved patch, now 1 x 3. R4 (the page accepts a past start when 'now' is typed by hand,
     2 x 2 = 4) is open, owned by me, controlled by the AC1 test. The UI was checked at two widths,
     but no test covers App.tsx, so a regression there would be invisible." -->

R1 was the playbook's production deployment instruction, initially 3 × 3 = 9. The approved patch removed it and forbids external publishing, reducing its score to 1 × 3 = 3. R2 was the end-of-day formatter error, initially 3 × 2 = 6. Its regression test failed before the one-line fix, then the full suite passed 24/24 and the build passed; its residual score is 1 × 2 = 2. Desktop and 375 px mobile screenshots show clear invalid-time feedback. Release is conditional because R5 has no linter, and the project still lacks CI and integration checks. I own those gaps and will require the recorded test/build outputs and human diff review for each change. The 24:00 browser-input path was not tested.
