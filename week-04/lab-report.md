# Week 04 — Lab report: Modeling the System with UML

> The single worksheet for this lab. Fill in every section. **Do not delete, rename or renumber
> the headings** — the checker and the grader find your work by them.

---

## 1. Setup

| Field | Value |
| --- | --- |
| Name | Yerassyl Khudaibergen |
| Group | Monday 16:00-19:00 |
| AI assistant | ChatGPT |
| Exact model | GPT-5.6 Sol |
| Renderer | Local PNG preview from the PlantUML model; re-render with PlantUML web server or IDE before final push |
| Behaviour diagram | activity |
| Stories used | my Week 03 stories, revised after review |

The Week 03 revised story set is used because Week 03 was completed. For Week 04, the rules in
`models/approved-stories.md` are treated as authoritative where the Week 04 scenario narrows the
behaviour, especially R4 (confirmation after a successful booking).

---

## 2. Prompts as sent

The three diagram prompts and the critique prompt are reproduced unchanged from `README.md`.

### 2.1 Task 1 — use-case prompt

```text
Using the supplied scenario and approved stories, generate PlantUML for a use-case diagram. Include Student and Administrator outside a named system boundary. Model their goals, show justified associations, and list assumptions. Use include or extend only with a clear reason.
```

### 2.2 Task 2 — class prompt

```text
Create a UML domain class diagram in PlantUML for Smart Campus. Start with Student, Room, and Booking. Add attributes, appropriate operations, and association multiplicities. Add other classes only when requirements justify them. Explain each relationship and list assumptions. Avoid unjustified inheritance or composition.
```

### 2.3 Task 3 — behaviour prompt (3A sequence or 3B activity)

```text
Generate a UML activity diagram in PlantUML for Book room. Show the initial node, actions, guarded decisions, and final nodes. Check the time range, blocked-room status, and overlapping bookings. Show confirmation after success and rejection after failure. Use branches rather than parallel paths unless concurrency is required.
```

### 2.4 Focused correction prompts (if you sent any)

```text
none
```

### 2.5 Critique prompt

```text
Compare my diagrams with the requirements. Identify missing rules, inconsistent names, and unjustified elements. Cite each issue and propose a specific correction.
```

---

## 3. Task 1 — use-case review

**Assumptions the AI listed:** touching bookings are allowed because one booking may end exactly
when the next begins; blocking a room prevents new bookings but does not cancel bookings that
already exist.

| # | Element | Problem | Rule or story | Fix |
| --- | --- | --- | --- | --- |
| 1 | Student → Send booking confirmation | The original associated the Student directly with confirmation, but the student does not trigger confirmation as a separate goal. | R4 and US-02 | Removed the actor association and kept confirmation only as included behaviour of Book room. |
| 2 | Administrator → Cancel booking | The original gave the Administrator a cancellation responsibility that the scenario gives only to the Student for their own bookings. | US-03 and scenario | Removed Administrator → Cancel booking. |
| 3 | Book room `<<include>>` Send booking confirmation | The original include had no written justification directly above the relationship. | R4 and PlantUML convention | Added a `' why:` comment stating that R4 requires confirmation after a successful booking. |

---

## 4. Task 2 — class diagram review

### 4.1 Relationships, read both ways

| Association | Read left → right | Read right → left | Multiplicities |
| --- | --- | --- | --- |
| Student — Booking | One Student can make zero or many Bookings. | Each Booking belongs to exactly one Student. | 1 / 0..* |
| Room — Booking | One Room can have zero or many Bookings over time. | Each Booking reserves exactly one Room. | 1 / 0..* |

### 4.2 Constraints the multiplicities cannot show

- R2: a note on `Booking` states that active bookings for the same `Room` must not overlap.
- R1: the `Booking` note states that the start must be in the future and duration must be greater than 0 and at most 2 hours.
- R3: the `Room` note states that a blocked room cannot accept a new booking.

### 4.3 Assumptions

- A1: touching bookings are **allowed**; if one booking ends exactly when another starts, they do not overlap.
- A2: blocking a room **keeps existing bookings**; R3 prevents only new bookings while the room is blocked.

### 4.4 Findings

| # | Element | Problem | Rule or story | Fix |
| --- | --- | --- | --- | --- |
| 1 | Room `*--` Booking with `1..*` at Booking end | Composition says a Booking is a lifecycle-owned part of a Room, and `1..*` says every room must already have a booking. Neither follows from the requirements. | US-01, US-02 and domain meaning | Replaced composition with a plain association and multiplicities `Room 1 — 0..* Booking`. |
| 2 | BookingService in the domain class diagram | `BookingService` is a design component, not a domain concept. | Class-review rule in README §5 | Removed `BookingService` from the class diagram. |
| 3 | Missing R2 constraint in the original | Multiplicity cannot express that active bookings for the same room must not overlap. | R2 | Added an R2 note on `Booking`. |

---

## 5. Task 3 — behaviour diagram review

**Option chosen and why:** 3B activity, because the task is mainly about the validation workflow for
Book room and the three rule decisions can be shown clearly as sequential branches.

**Design components added beyond the domain model:** none — an activity diagram does not require
service or repository lifelines.

| # | Element | Problem | Rule or story | Fix |
| --- | --- | --- | --- | --- |
| 1 | `Create booking` before validation | The original created the booking before checking whether the request was valid, so an invalid request could be persisted. | R1, R2, R3 and US-02 | Moved `Create booking` after all three rule checks succeed. |
| 2 | `All booking rules pass?` decision | A single combined decision hides which rule failed and does not visibly show R1, R3 and R2 separately. | R1, R2, R3 | Replaced it with three guarded decisions: time range, blocked-room status, and overlap. |
| 3 | Generic rejection path | One generic rejection does not show which validation failed. | R1, R2, R3 | Added separate rejection actions for invalid time, blocked room, and overlapping booking. |

---

## 6. AI critique

| # | Issue the AI raised | Element it cited | Verdict | Why |
| --- | --- | --- | --- | --- |
| 1 | `Send booking confirmation` should be removed because it is not a user goal. | Send booking confirmation | reject | R4 explicitly requires confirmation after a successful booking. It is valid as included system behaviour as long as no actor is directly associated with it. |
| 2 | The `Booking.status` attribute should use a domain-specific status type rather than a generic string so R2's word “active” has a clear state meaning. | Booking.status | accept | R2 applies specifically to active bookings, so the final class uses `BookingStatus` as the attribute type. |
| 3 | Rejection in the activity should identify which rule failed instead of using one generic `Reject booking` action. | Activity rejection actions | accept | Rule-specific rejection actions make R1, R3 and R2 visible and make the workflow easier to test. |
| 4 | Administrator should also be linked to `Cancel booking` so staff can intervene. | Administrator → Cancel booking | reject | The supplied scenario says students cancel their own bookings and does not grant this goal to Administrator. Adding it would widen the scope. |

---

## 7. Consistency table

| Requirement / story | Use case | Classes | Behaviour element |
| --- | --- | --- | --- |
| R1 | Book room | Booking.startTime, Booking.endTime and the R1 note | `Valid future start and duration > 0 and <= 2 hours? (R1)` decision |
| R2 | Book room | Booking.status plus the R2 no-overlap note; Room — Booking association | `Overlapping active booking for the same room? (R2)` decision |
| R3 | Book room | Room.blocked plus the R3 note | `Room blocked? (R3)` decision |
| R4 | Book room | Booking represents the successful reservation; Student receives the result | `Send booking confirmation (R4)` action after creation |
| US-01 | View availability | Room, Booking | The Book room flow checks Room.blocked and booking overlap using the same availability state. |
| US-02 | Book room | Student, Room, Booking | Full activity from request through R1/R3/R2 checks, creation and confirmation. |
| US-03 | Cancel booking | Student, Booking | Not executed in the selected Book room activity; represented by `Student.cancelBooking()` and `Booking.cancel()`. |
| US-04 | Block or unblock room | Room | Not executed in the selected Book room activity; Book room reads `Room.blocked` for R3. |
| US-05 | Review usage | Room, Booking | Not executed in the selected Book room activity; usage can be derived from Room and Booking records. |
| US-06 | Send booking confirmation | Student, Booking | `Send booking confirmation (R4)` after a successful booking. |

---

## 8. Change log

| # | Diagram | Before (AI's original) | After (your revision) | Reason |
| --- | --- | --- | --- | --- |
| 1 | use case | Student was directly associated with `Send booking confirmation`. | Removed Student → confirmation and kept confirmation as an include from `Book room`. | R4 is an automatic successful-booking outcome, not a separate Student-triggered goal. |
| 2 | use case | Administrator was associated with `Cancel booking`; include had no reason comment. | Removed Administrator → Cancel booking and added the required `' why:` comment above the include. | Scenario responsibility and PlantUML convention. |
| 3 | class | `Room *-- Booking` used composition and required `1..*` bookings per room. | Plain `Room "1" -- "0..*" Booking` association. | A room may have zero bookings and Booking is not a lifecycle-owned part of Room. |
| 4 | class | `BookingService` appeared in the domain model and R2 had no note. | Removed the service; added R1/R2/R3 notes and typed `Booking.status` as `BookingStatus`. | Domain model must contain domain concepts; R2 cannot be represented by multiplicity. |
| 5 | activity | Booking was created before one combined rule check. | Three separate guarded decisions run before creation; success confirms and every failure rejects with a reason. | R1, R3 and R2 must be visible and validation must precede creation. |

---

## 9. Checker output

The block below is the complete output from `python tests/check_models.py` for the prepared folder.

```text
Week 04 structural check - shape only, never quality

UC1  PASS  Student and Administrator declared
UC2  PASS  named system boundary: "Smart Campus Study Room Booking System"
UC3  PASS  all actors declared outside the boundary
UC4  PASS  all scenario goals present (6 use cases)
UC5  PASS  no actor is associated with a confirmation use case
UC6  PASS  actor responsibilities match the scenario
UC7  PASS  use cases are goals, not screens or components
UC8  PASS  every include / extend / generalization carries a ' why: comment (or there are none)
UC9  PASS  revised diagram differs from the AI's original
CL1  PASS  Student, Room and Booking present
CL2  PASS  Booking is associated with Student and with Room
CL3  PASS  every association has multiplicities at both ends
CL4  PASS  1 student / 1 room per booking, 0..* bookings per student and per room
CL5  PASS  every inheritance / composition / aggregation carries a ' why: comment (or there are none)
CL6  PASS  only domain concepts in the class diagram
CL7  PASS  attributes needed by R1-R3 are present
CL8  PASS  a note states R2 (no overlapping active bookings)
AC1  PASS  initial and final nodes present
AC2  PASS  separate decisions check R1, R3 and R2 (3 decisions)
AC3  PASS  every branch has a labelled guard
AC4  PASS  no parallel paths
AC5  PASS  confirmation on success, rejection on failure
AC6  PASS  creation comes after all rule checks
FI1  PASS  the AI's original output is kept for every diagram
FI2  PASS  a rendered image for every diagram
LR1  PASS  §1 setup filled (tool and model recorded)
LR2  PASS  5 prompts pasted in §2
LR3  PASS  2 use-case findings in §3
LR4  PASS  §4 relationships read both ways, 2 assumption(s) declared
LR5  PASS  3 behaviour-diagram findings in §5
LR6  PASS  4 critique issues with a verdict
LR7  PASS  5 change-log rows covering all three diagrams
CS1  PASS  6 approved stories
CS2  PASS  §7 traces R1-R4 into the diagrams
CS3  PASS  every use case traces to an approved story

SUMMARY pass=35 fail=0 error=0
A FAIL you report and explain in lab-report.md §9 costs you nothing. One you hide costs the criterion.
```

**FAILs I am keeping, and why:** none.

---

## 10. Conclusion (120–180 words)

The class diagram needed the most important correction. The AI originally used composition between
`Room` and `Booking` and placed `1..*` on the Booking end. Read literally, that means every room must
already contain at least one booking and that a booking is a lifecycle-owned part of a room. Neither
claim is supported by the requirements. If this reached implementation, it could lead to incorrect
persistence constraints and make an empty room impossible to represent. The activity diagram also
needed correction because the original created the booking before validating R1, R2 and R3. The
critique usefully pointed out that a generic rejection action hid which rule failed, so I kept
separate rejection actions for invalid time, a blocked room and an overlap. However, I rejected its
suggestion to remove `Send booking confirmation`: R4 explicitly requires that outcome, and the final
use-case diagram models it correctly as included behaviour without a direct actor association. The
main lesson is to read every UML element as a precise claim and trace it back to a rule or story.
