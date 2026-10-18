# SIS #02 — AI-Assisted UML Modeling: University Course Registration

<!--
  This is the only file you write your report in. README.md tells you what goes where.

  Rules the checker relies on:
  - Do not delete, rename or renumber the ## headings, the ### headings, or the **Label:** words.
  - Replace every "(write here)" and "(paste here)". None may be left when you submit.
  - Comments like this one are ignored by the checker and the word counter. Delete them or leave them.
-->

## 1. Scope and assumptions

<!-- Your FINAL scope statement and assumptions, after reviewing Prompt A's output. Say here
     what is out of scope (payments, prerequisites, timetable clashes, waiting lists,
     cancellation) — section 2 must not mention them. Section 10 keeps your first version. -->

**Scope:** (write here)

**Assumptions:**

1. (write here)
2. (write here)

## 2. User stories and acceptance criteria

<!-- Your APPROVED requirements: Prompt A's draft after your review. Keep the IDs, the three
     story headings and the bullet shape. Every criterion names the rule(s) it maps to,
     e.g. (R2, R4). Two criteria per story. Nothing out of scope.
     Format of a criterion, on one bullet:
     - **AC-03** (R2, R4): Given ..., When ..., Then ... -->

### US-01 — Browse offerings

**US-01:** As a student, I want to view available course offerings for one semester, so that I can select an offering for registration.

- **AC-01** (R1): Given the student is signed in and course offerings exist for the semester, When the student opens the course catalog, Then the system displays each course code, title, offering, and number of available places.
- **AC-02** (R1,R2): Given the student has viewed the catalog and the available places may have changed, When the student selects an offering and requests registration, Then the system checks current availability instead of treating the catalog information as a reserved place.

### US-02 — Register for an offering

**US-02:** As a student, I want to register for a course offering with available places, so that my enrollment is recorded and confirmed.

- **AC-03** (R2, R3, R4): Given the selected offering has available places and the student is not already enrolled, When the student submits a registration request, Then the system atomically checks capacity and duplicates, creates exactly one Enrollment linking the student and offering, updates availability, and returns a confirmation
- **AC-04** (R2, R4): Given the selected offering has exactly one available place and the student is not already enrolled, When the student submits a registration request, Then the system creates exactly one Enrollment, fills the last place, updates availability to zero, and confirms registration without exceeding capacity

### US-03 — Receive a clear rejection

**US-03:** As a student, I want to receive a clear explanation when registration fails, so that I understand why my request was rejected.

- **AC-05** (R2, R5): Given the selected offering is full, When a student who is not already enrolled requests registration, Then the system returns "course full", creates no Enrollment, and leaves the enrollment count unchanged.
- **AC-06** (R3, R5): Given the student is already enrolled in the selected offering, When the student submits another registration request for the same offering, Then the system returns "already enrolled", creates no additional Enrollment, and leaves the enrollment count unchanged.

## 3. Sequence diagram

<!-- The FINAL diagram, rendered. Change .png to .svg if that is what you exported. -->

![Final sequence diagram](models/img/sequence.png)

**Participants:** Student: The main actor who browses the course catalog and requests registration for a selected course offering.

Course Registration UI: Displays course information, accepts registration requests, and shows confirmation or rejection messages.

Registration Service: Handles catalog requests and registration operations, communicates with the database, and returns results to the UI.

Database: Stores course offerings and Enrollment records, performs availability and duplicate checks, and creates Enrollment records when registration succeeds.


**Atomic operation:** The atomic operation begins with Service -> DB: Begin atomic registration. Inside this operation, the database performs Check current availability (AC-02) and Check existing Enrollment. If the student is not already enrolled and the offering has available places, it executes Create exactly one Enrollment. These checks and the creation must be atomic so two students cannot register for the same last available place.Browsing the catalog only retrieves information about offerings and available places. It does not create an Enrollment or reserve a place because availability may change before the registration request.

**Where the Enrollment is created:** The Enrollment is created by the message DB -> DB: Create exactly one Enrollment inside the else Eligible for registration (AC-03) branch. The Database lifeline performs this operation, creating an instance of the Enrollment class shown in Section 4. Each new Enrollment links exactly one Student to one CourseOffering. Confirmation is returned only after successful creation.



**Technical lifelines:** The technical lifelines are Course Registration UI, Registration Service, and Database. They represent interface, application logic, and data storage responsibilities rather than domain concepts. These elements do not appear as classes in the domain class diagram because the two diagrams describe different abstraction levels. The Student appears in both models as an actor in the sequence diagram and a domain class in the class diagram

## 4. Class diagram

<!-- The FINAL diagram, rendered. -->

![Final class diagram](models/img/classes.png)

<!-- One row per association in classes.puml, read in both directions. -->

| Association | Read left to right | Read right to left |
| --- | --- | --- |
| `Course "1" -- "0..*" CourseOffering : has` | One Course can have zero or many CourseOffering instances. | Each CourseOffering belongs to exactly one Course. |
| `Student "1" -- "0..*" Enrollment : makes` | One Student can have zero or many Enrollment records. | Each Enrollment belongs to exactly one Student. |
| `CourseOffering "1" -- "0..*" Enrollment : receives` | One CourseOffering can have zero or many Enrollment records. | Each Enrollment belongs to exactly one CourseOffering. |

**How an Enrollment links a student to an offering:** The Enrollment class connects a Student to a specific CourseOffering through two associations. Every Enrollment belongs to exactly one Student and exactly one CourseOffering. The enrollmentId identifies the enrollment record, while studentId and offeringId identify the related student and offering in their respective classes. This structure allows students to enroll in different offerings while preventing duplicate registration for the same pair.

**Capacity constraint:** Each CourseOffering has a positive integer capacity. Its /enrollmentCount represents the number of associated Enrollment records, while /availablePlaces is calculated as capacity - enrollmentCount. The enrollment count must never exceed capacity.

**Uniqueness constraint:** For every Student–CourseOffering pair, at most one Enrollment can exist. A student may have enrollments in different offerings but cannot register twice for the same offering.
Multiplicity alone cannot enforce this condition because both Student and CourseOffering can participate in multiple Enrollment relationships. A separate uniqueness note is required to restrict repeated records for the same pair.

## 5. Traceability

<!-- Every rule, including the catalog fields and availability (R1). Column 1: the rule and
     the criteria that cover it, e.g. "R2 + AC-03, AC-04". Column 2: the message, guard,
     class or constraint that shows the rule in YOUR diagrams. Column 3: the T-ID that
     exercises it, or the extra check you did instead (R1 has no T case). -->

| Rule and criterion | Model evidence | Validation case |
| --- | --- | --- |
| R1 + AC-01, AC-02 | Sequence: `getOfferings(semesterId)`, `Display catalog (AC-01)`. Class: `Course.courseCode`, `Course.title`, `CourseOffering.semester` and `/availablePlaces`. Browsing creates no Enrollment. | Additional R1 catalog inspection and T1 catalog browsing. |
| R2 + AC-02, AC-03, AC-04, AC-05 | Sequence: `Begin atomic registration`, `Check current availability (AC-02)`. Class: `capacity`, `/enrollmentCount`, `/availablePlaces` and the R2 capacity constraint. | T1, T2, T3 |
| R3 + AC-03, AC-06 | Sequence: `Check existing Enrollment` and `Already enrolled (AC-06)`. Class: R3 uniqueness note for the Student and CourseOffering pair. | T4 |
| R4 + AC-03, AC-04 | Sequence: `Create exactly one Enrollment`, `Recalculate availability from Enrollment records` and `Registration confirmed, updated availability`. | T1, T2 |
| R5 + AC-05, AC-06 | Sequence: `Course full (AC-05)` and `Already enrolled (AC-06)`. Both rejection branches create no Enrollment and preserve the enrollment count. | T3, T4 |

## 6. Walkthroughs

<!-- Walk each case through YOUR final sequence diagram, message by message. Column 2: the
     actual steps and the state change (count before → after). Column 3 starts with Pass or
     Fail, then the location: the message, guard or note where you saw it. A Fail you
     report honestly is a finding, not a penalty. -->

| Case | Observed path and state change | Judgment and evidence |
| --- | --- | --- |
| T1. Available | The student opens the semester catalog and sends a registration request. The database begins atomic registration and checks current availability and existing Enrollment records. With capacity 2 and enrollment count 0, the eligible branch creates exactly one Enrollment. The count changes from 0 to 1, leaving one available place. Registration is confirmed. | Pass — else Eligible for registration (AC-03); Create exactly one Enrollment; Registration confirmed, updated availability. |
| T2. Last place | With capacity 2 and enrollment count 1, a new student requests registration. The database performs both checks inside the atomic operation. The eligible branch creates one Enrollment, increasing the count from 1 to 2. |Pass — alt Last available place (AC-04); note Available places = 0 and Capacity not exceeded |
| T3. Full |The catalog previously showed availability, but the current count is already 2 of 2. After the request, the database checks the latest availability instead of trusting the catalog. The request follows the course-full rejection branch. No Enrollment is created, the count remains 2, and the student receives the rejection reason. | Pass — Check current availability (AC-02); else Course full (AC-05); "course full"; note Enrollment count unchanged |
| T4. Duplicate | The student already has one Enrollment in an offering with capacity 2. A second registration request triggers the current availability and existing Enrollment checks. The already-enrolled alternative rejects the request without creating another record. The enrollment count remains 1, available places remain 1, and the student receives an explanation | Pass — Check existing Enrollment; alt Already enrolled (AC-06); "already enrolled"; note No new Enrollment |

## 7. Review decisions

<!-- At least three substantive decisions about Prompt C's critique or your own inspection.
     Decision: accepted / rejected / modified — and what you did. Reason: why, in a full
     sentence. Rule: R1–R5. Do not invent an error to fill the table; a justified rejection
     of advice counts. -->

| AI suggestion or model element | Decision | Reason | Rule |
| --- | --- | --- | --- |
| D1 — Begin atomic registration and database row locking | Modified — retain atomic note | The sequence already describes atomic checks and Enrollment creation. Database row locking is one possible implementation, but the assignment does not require a specific locking mechanism. | R2, R4 |
| D2 — Derived enrollment count and availability | Accepted — recalculate availability | The class diagram defines enrollment count and available places as derived values. The sequence now recalculates availability from Enrollment records instead of updating a separate stored counter. | R2, R4 |
| C1 — Change the order of duplicate and capacity checks | Rejected — preserve existing checks | Both checks occur after the registration request and before Enrollment creation. The existing guarded alternatives already prioritize the already-enrolled rejection when both conditions apply. | R3, R5 |
| C2 — Add database foreign-key attributes for uniqueness | Modified — use domain constraint note | The class associations already connect each Enrollment to one Student and one CourseOffering. A separate uniqueness note expresses the pairwise constraint without implementation-specific attributes. | R3 |

## 8. Modeling explanation

<!-- 200–300 words. Your main design choices; how the class diagram and the sequence diagram
     complement each other; why an activity diagram could also help explain the workflow. -->

The university course registration system is represented using two UML diagrams: a sequence diagram and a domain class diagram. These diagrams describe the same requirements from different perspectives.

The sequence diagram focuses on the order of interactions between the Student, Course Registration UI, Registration Service, and Database. First, the student opens the catalog for a semester. The system retrieves course offerings and displays their codes, titles, and available places. This operation does not reserve any places.

When the student requests registration, the system starts an atomic operation. The database checks the current availability and existing Enrollment records. These checks are important because the information shown in the catalog may already be outdated. The sequence diagram uses three alternatives: already enrolled, course full, and eligible for registration. Only the successful alternative creates a new Enrollment. After successful creation, availability is recalculated and confirmation is returned.

The class diagram describes the main domain entities: Student, Course, CourseOffering, and Enrollment. The associations and multiplicities show how these entities relate to each other. Each Enrollment links one student with one specific offering. Separate constraint notes define capacity and uniqueness because multiplicities alone cannot fully express these business rules.

The two diagrams complement each other. The class diagram explains the structure of the information, while the sequence diagram explains how the system uses that information during registration.

An activity diagram could also help by showing the workflow as actions and decisions. It would make the successful and rejected registration paths easier to compare, especially for users who are unfamiliar with sequence diagrams.

## 9. Reflection

<!-- 150–200 words. Written by you, not by the assistant: where AI helped, one decision you
     made yourself, one remaining limitation. Specific beats flattering. -->

AI assistance was useful during the university course registration modeling task because it helped generate the first versions of the sequence and class diagrams. It also suggested acceptance criteria and provided feedback about possible inconsistencies between the models. This reduced the time needed to prepare the initial UML structure.

However, the AI recommendations still needed independent review. One important decision was to keep the atomic registration note without adding database-specific locking operations. The assignment required atomic behavior, but it did not require a particular database implementation. Another decision was to clarify how available places are calculated from Enrollment records instead of treating the enrollment count as an unrelated stored value.

The review also showed a limitation of AI-generated diagrams. A model can look complete while leaving important behavior unclear, especially around concurrent registration requests and uniqueness constraints. Therefore, the diagrams had to be checked against R1–R5 and the four validation cases.

This task demonstrates that AI can support UML modeling, but responsibility for requirements consistency and final design decisions remains with the person reviewing the models

## 10. Appendix A — Before AI

<!-- Written BEFORE you run Prompt A, committed and pushed in your first commit, and never
     edited afterwards. This is what you paste into Prompt A as "My initial assumptions". -->

**Scope:** The system allows students to view available courses and register for a specific course offering. It checks the number of available places and prevents duplicate registrations. If registration is successful, the system creates one enrollment and sends a confirmation. If registration is rejected, it explains the reason without changing enrollment data

**Initial assumptions:**

1. The student is already signed in, and the selected course offering exists in the system
2. Every course offering has a positive capacity, and the number of enrollments cannot exceed this limit
3. The available places shown in the catalogs that may change before registration, so the system checks availability again when the studentt submits a requests 

## 11. Appendix B — AI exchanges

<!-- Complete prompts and complete responses, as text — never screenshots. Paste each inside
     the ~~~~ block that follows its label: AI responses contain ``` PlantUML blocks, and
     ~~~~ keeps them from breaking this file. Prompts B and C: the prompt text first, then
     the material it refers to ("below", "these two") pasted under it, in the same block.
     You may add B5, B6 … after B4 if you ran more. -->

### B1 — Requirements (Prompt A)

- **Tool:** ChatGPT
- **Model:** GPT-6 Astra
- **Date:** 2026-10-18
- **Purpose:** draft 3 user stories and 6 acceptance criteria

<!-- Model: the exact model with its version, as the tool shows it (e.g. "GPT-5 Thinking",
     "Claude Sonnet 4.5"). If the tool does not show it, write: not displayed
     Date: YYYY-MM-DD -->

**Prompt:**

~~~~text
Act as a requirements analyst. Use only this course registration scenario and rules R1–R5: **\*\*R1. Catalog\*\*** | Show the course code, title, offering and available places for one semester. |
\| **\*\*R2. Capacity\*\*** | Recheck current availability when registering. Enrollment must never exceed the offering's capacity. |
\| **\*\*R3. Duplicates\*\*** | A student may have at most one enrollment in the same offering. Reject a repeat request. |
\| **\*\*R4. Success\*\*** | Create exactly one Enrollment linking the student and offering, update availability and return a confirmation. |
\| **\*\*R5. Rejection\*\*** | Explain "course full" or "already enrolled". Create no enrollment and leave the enrollment count unchanged. |. My initial assumptions are 1. The student is already signed in, and the selected course offering exists in the system\
2\. Every course offering has a positive capacity, and the number of enrollments cannot exceed this limit\
3\. The available places shown in the catalogs that may change before registration, so the system checks availability again when the studentt submits a requests \
Draft 3 user stories and 2 Given / When / Then acceptance criteria for each. Use IDs US-01 to US-03 and AC-01 to AC-06. Map each criterion to rule IDs.\
Cover normal and rejection behavior. List uncertainty separately. Do not add excluded features or invent university policies.
~~~~

**Response:**

~~~~text
## 1. User Stories

### US-01 — View Course Catalog

As a student, I want to view course offerings and available places for one semester, So that I can choose a course offering for registration.

AC-01 — Display Course Information (R1)

- Given the student is signed in and course offerings exist for the selected semester,
- When the student opens the course catalog,
- Then the system displays each offering's course code, title, offering, and available places.

AC-02 — Display Updated Availability (R1, R2)

- Given the student has viewed the catalog and the available places have changed,
- When the student submits a registration request,
- Then the system rechecks the current availability instead of relying on the previously displayed number.

### US-02 — Register for a Course

As a student, I want to register for a course offering with available places, So that my enrollment is recorded successfully.

AC-03 — Successful Registration (R2, R3, R4)

- Given the student is signed in, the selected offering has available places, and the student is not already enrolled,
- When the student submits a registration request,
- Then the system creates exactly one Enrollment linking the student and offering, updates availability, and returns a confirmation.

AC-04 — Prevent Exceeding Capacity (R2, R5)

- Given the selected offering has no available places,
- When the student submits a registration request,
- Then the system rejects the request with "course full", creates no Enrollment, and leaves the enrollment count unchanged.

### US-03 — Prevent Duplicate Enrollment

As a student, I want to be prevented from registering twice for the same course offering, So that my enrollment records do not contain duplicates.

AC-05 — Reject Duplicate Registration (R3, R5)

- Given the student already has an Enrollment for the selected offering,
- When the student submits another registration request for the same offering,
- Then the system rejects the request with "already enrolled", creates no additional Enrollment, and leaves the enrollment count unchanged.

AC-06 — Allow Registration for a Different Offering (R2, R3, R4)

- Given the student is enrolled in one offering but is not enrolled in another offering that has available places,
- When the student submits a registration request for the other offering,
- Then the system creates exactly one new Enrollment for that offering, updates its availability, and returns a confirmation.

## 2. Requirements Traceability Matrix

| Criterion | Rule IDs   | Behavior                      |
| --------- | ---------- | ----------------------------- |
| AC-01     | R1         | Display catalog               |
| AC-02     | R1, R2     | Recheck availability          |
| AC-03     | R2, R3, R4 | Successful registration       |
| AC-04     | R2, R5     | Reject full course            |
| AC-05     | R3, R5     | Reject duplicate              |
| AC-06     | R2, R3, R4 | Register for another offering |

All five rules (R1–R5) are covered.

## 3. Initial Assumptions

1. The student is already signed in, and the selected course offering exists in the system.
2. Every course offering has a positive capacity, and the enrollment count cannot exceed that capacity.
3. Available places shown in the catalog may change before registration, so the system rechecks availability when the student submits a request.

## 4. Uncertainties

1. Semester selection: It is unclear whether the semester is predefined or selected by the student.
2. Simultaneous requests: The rules do not specify how the system handles multiple students registering for the last available place at the same time.
3. Conflicting rejection conditions: If an offering is full and the student is already enrolled, it is unclear which rejection message takes priority.
4. Availability updates: The rules do not specify whether the catalog updates automatically or only when reopened.

These uncertainties require clarification and are not treated as additional requirements.
~~~~

### B2 — UML drafts (Prompt B)


- **Tool:** ChatGPT
- **Model:** GPT-6 Astra
- **Date:** 2026-10-18
- **Purpose:** draft the sequence and class diagrams

**Prompt:**

~~~~text
Using my approved scenario, R1–R5, stories and criteria below, return separate PlantUML code blocks for a sequence diagram and a domain class diagram.\
Sequence: include catalog browsing and guarded success, full-course and duplicate outcomes. Model final checks and creation as one atomic operation.\
Class: show domain concepts, useful attributes and multiplicities. State the capacity and uniqueness constraints. Explain assumptions and any technical lifelines.**### US-01 — Browse offerings**

**\*\*US-01:\*\*** As a student, I want to view available course offerings for one semester, so that I can select an offering for registration.

\- **\*\*AC-01\*\*** (R1): Given the student is signed in and course offerings exist for the semester, When the student opens the course catalog, Then the system displays each course code, title, offering, and number of available places.
\- **\*\*AC-02\*\*** (R1,R2): Given the student has viewed the catalog and the available places may have changed, When the student selects an offering and requests registration, Then the system checks current availability instead of treating the catalog information as a reserved place.

**### US-02 — Register for an offering**

**\*\*US-02:\*\*** As a student, I want to register for a course offering with available places, so that my enrollment is recorded and confirmed.

\- **\*\*AC-03\*\*** (R2, R3, R4): Given the selected offering has available places and the student is not already enrolled, When the student submits a registration request, Then the system atomically checks capacity and duplicates, creates exactly one Enrollment linking the student and offering, updates availability, and returns a confirmation
\- **\*\*AC-04\*\*** (R2, R4): Given the selected offering has exactly one available place and the student is not already enrolled, When the student submits a registration request, Then the system creates exactly one Enrollment, fills the last place, updates availability to zero, and confirms registration without exceeding capacity

**### US-03 — Receive a clear rejection**

**\*\*US-03:\*\*** As a student, I want to receive a clear explanation when registration fails, so that I understand why my request was rejected.

\- **\*\*AC-05\*\*** (R2, R5): Given the selected offering is full, When a student who is not already enrolled requests registration, Then the system returns "course full", creates no Enrollment, and leaves the enrollment count unchanged.
\- **\*\*AC-06\*\*** (R3, R5): Given the student is already enrolled in the selected offering, When the student submits another registration request for the same offering, Then the system returns "already enrolled", creates no additional Enrollment, and leaves the enrollment count unchanged.
~~~~

**Response:**

~~~~text
## 1. Sequence Diagram — PlantUML

This diagram covers catalog browsing (US-01), successful registration (US-02), and rejection cases (US-03). Registration checks and enrollment creation occur within one atomic transaction.

```

@startuml
title Course Registration - Sequence Diagram

actor Student
boundary "Course Registration UI" as UI
control "Registration Service" as Service
database "Database" as DB

== Browse Catalog (US-01) ==

Student -> UI: Open catalog for semester
UI -> Service: getOfferings(semesterId)
Service -> DB: Get offerings and enrollment counts
DB --> Service: Course codes, titles, offerings, counts
Service --> UI: Offerings with available places
UI --> Student: Display catalog (AC-01)

== Register for Offering (US-02 / US-03) ==

Student -> UI: Request registration(offeringId)
UI -> Service: register(studentId, offeringId)

note over Service, DB
Atomic transaction:
Recheck capacity and duplicates.
Create Enrollment and update count
only if both checks pass.
end note

Service -> DB: Begin atomic registration
activate DB

DB -> DB: Check current availability (AC-02)
DB -> DB: Check existing Enrollment

alt Already enrolled (AC-06)
    DB --> Service: "already enrolled"
    note right of DB
    No new Enrollment
    Count unchanged
    end note

else Course full (AC-05)
    DB --> Service: "course full"
    note right of DB
    No new Enrollment
    Count unchanged
    end note

else Eligible for registration (AC-03)
    DB -> DB: Create exactly one Enrollment
    DB -> DB: Update enrollment count

    alt Last available place (AC-04)
        note right of DB
        Available places = 0
        Capacity not exceeded
        end note
    end

    DB --> Service: Registration confirmed
end

deactivate DB

Service --> UI: Registration result
UI --> Student: Show confirmation or rejection

@enduml

```

Rule coverage: R1–R5, AC-01–AC-06.

The database operation is atomic: concurrent requests cannot both take the last available place, provided the capacity and uniqueness checks are enforced within the same transaction. The diagram shows duplicate rejection before capacity rejection; this ordering is a modeling assumption, not an additional university policy.

## 2. Domain Class Diagram — PlantUML

The diagram contains four domain classes: Student, Course, CourseOffering, and Enrollment.

```

@startuml
title Course Registration - Domain Class Diagram

skinparam classAttributeIconSize 0
hide empty methods

class Student {
    +studentId: Integer
}

class Course {
    +courseCode: String
    +title: String
}

class CourseOffering {
    +offeringId: Integer
    +semester: String
    +capacity: Integer
    +/enrollmentCount: Integer
    +/availablePlaces: Integer
}

class Enrollment {
    +enrollmentId: Integer
}

Course "1" -- "0..*" CourseOffering : has
Student "1" -- "0..*" Enrollment : makes
CourseOffering "1" -- "0..*" Enrollment : receives

note right of CourseOffering
R2 - Capacity constraint:
capacity > 0
enrollmentCount <= capacity
availablePlaces =
  capacity - enrollmentCount

/ denotes a derived attribute.
end note

note bottom of Enrollment
R3 - Uniqueness constraint:
UNIQUE(studentId, offeringId)

One student can have at most
one Enrollment per offering.
end note

note bottom of Course
R1 - Catalog:
Display courseCode, title,
offering and availablePlaces
for one semester.
end note

@enduml

```

### Multiplicities

| Relationship                | Multiplicity | Meaning                                      |
| --------------------------- | ------------ | -------------------------------------------- |
| Course → CourseOffering     | 1 to 0..\*   | A course can have multiple offerings         |
| Student → Enrollment        | 1 to 0..\*   | A student can have multiple enrollments      |
| CourseOffering → Enrollment | 1 to 0..\*   | An offering can contain multiple enrollments |
| Enrollment → Student        | 1 to 1       | Each enrollment belongs to one student       |
| Enrollment → CourseOffering | 1 to 1       | Each enrollment refers to one offering       |

## 3. Constraints

Capacity constraint (R2)

\\[ 0 \leq enrollmentCount \leq capacity \\]

\\[ availablePlaces = capacity - enrollmentCount \\]

Registration must never increase `enrollmentCount` beyond `capacity`.

Uniqueness constraint (R3)

```
UNIQUE(student_id, offering_id)
```

A student cannot register twice for the same course offering.

Atomic registration (R2–R5)

Capacity validation, duplicate validation, Enrollment creation, and count updates must occur as one atomic operation. Rejected operations leave the enrollment count unchanged.

## 4. Assumptions and Technical Lifelines

Assumptions

1. The student is already authenticated.
2. The selected course offering exists.
3. Course offerings have positive capacity.
4. Available places are calculated using current enrollment data.
5. Duplicate requests are checked before full-course rejection when both conditions apply.

Technical lifelines (sequence diagram)

| Lifeline               | Purpose                                                 |
| ---------------------- | ------------------------------------------------------- |
| Student                | Initiates browsing and registration                     |
| Course Registration UI | Displays offerings and registration results             |
| Registration Service   | Coordinates catalog and registration requests           |
| Database               | Stores domain entities and enforces atomic registration |

The UI, Registration Service, and Database are technical components, not additional domain classes. No payment, prerequisites, waitlists, approval process, or other university policies have been introduced.

Both diagrams are aligned with US-01–US-03, AC-01–AC-06, and R1–R5.
~~~~

### B3 — Model critique (Prompt C)

- **Tool:** ChatGPT
- **Model:** GPT-6 Astra
- **Date:** 2026-10-18
- **Purpose:** review both models against R1–R5 and T1–T4

**Prompt:**

~~~~text
Review these two UML models against R1–R5 and my acceptance criteria. Check message order, guards, state changes, multiplicities and naming.\
Inspect the four validation cases: available places, exactly one place, full course after a stale catalog view, and duplicate registration.\
For each issue, cite the affected rule and model element. Explain the impact and propose a focused correction. Separate genuine defects from optional design choices.sequence.pml:"\
@startuml\
title Course Registration - Sequence Diagram\
\
actor Student\
boundary "Course Registration UI" as UI\
control "Registration Service" as Service\
database "Database" as DB\
\
\== Browse Catalog (US-01) ==\
\
Student -> UI: Open catalog for semester\
UI -> Service: getOfferings(semesterId)\
Service -> DB: Get offerings and enrollment counts\
DB --> Service: Course codes, titles, offerings, counts\
Service --> UI: Offerings with available places\
UI --> Student: Display catalog (AC-01)\
\
\== Register for Offering (US-02 / US-03) ==\
\
Student -> UI: Request registration(offeringId)\
UI -> Service: register(studentId, offeringId)\
\
note over Service, DB\
Atomic transaction:\
Recheck capacity and duplicates.\
Create Enrollment and update count\
only if both checks pass.\
end note\
\
Service -> DB: Begin atomic registration\
activate DB\
\
DB -> DB: Check current availability (AC-02)\
DB -> DB: Check existing Enrollment\
\
alt Already enrolled (AC-06)\
&#x20;   DB --> Service: "already enrolled"\
&#x20;   note right of DB\
&#x20;   No new Enrollment\
&#x20;   Count unchanged\
&#x20;   end note\
\
else Course full (AC-05)\
&#x20;   DB --> Service: "course full"\
&#x20;   note right of DB\
&#x20;   No new Enrollment\
&#x20;   Count unchanged\
&#x20;   end note\
\
else Eligible for registration (AC-03)\
&#x20;   DB -> DB: Create exactly one Enrollment\
&#x20;   DB -> DB: Update enrollment count\
\
&#x20;   alt Last available place (AC-04)\
&#x20;       note right of DB\
&#x20;       Available places = 0\
&#x20;       Capacity not exceeded\
&#x20;       end note\
&#x20;   end\
\
&#x20;   DB --> Service: Registration confirmed\
end\
\
deactivate DB\
\
Service --> UI: Registration result\
UI --> Student: Show confirmation or rejection\
\
@enduml\
",classes.puml:"\
@startuml\
title Course Registration - Domain Class Diagram\
\
skinparam classAttributeIconSize 0\
hide empty methods\
\
class Student {\
&#x20;   +studentId: Integer\
}\
\
class Course {\
&#x20;   +courseCode: String\
&#x20;   +title: String\
}\
\
class CourseOffering {\
&#x20;   +offeringId: Integer\
&#x20;   +semester: String\
&#x20;   +capacity: Integer\
&#x20;   +/enrollmentCount: Integer\
&#x20;   +/availablePlaces: Integer\
}\
\
class Enrollment {\
&#x20;   +enrollmentId: Integer\
}\
\
Course "1" -- "0..\*" CourseOffering : has\
Student "1" -- "0..\*" Enrollment : makes\
CourseOffering "1" -- "0..\*" Enrollment : receives\
\
note right of CourseOffering\
R2 - Capacity constraint:\
capacity > 0\
enrollmentCount <= capacity\
availablePlaces =\
&#x20; capacity - enrollmentCount\
\
/ denotes a derived attribute.\
end note\
\
note bottom of Enrollment\
R3 - Uniqueness constraint:\
UNIQUE(studentId, offeringId)\
\
One student can have at most\
one Enrollment per offering.\
end note\
\
note bottom of Course\
R1 - Catalog:\
Display courseCode, title,\
offering and availablePlaces\
for one semester.\
end note\
\
@enduml\
",**### US-01 — Browse offerings**

**\*\*US-01:\*\*** As a student, I want to view available course offerings for one semester, so that I can select an offering for registration.

\- **\*\*AC-01\*\*** (R1): Given the student is signed in and course offerings exist for the semester, When the student opens the course catalog, Then the system displays each course code, title, offering, and number of available places.
\- **\*\*AC-02\*\*** (R1,R2): Given the student has viewed the catalog and the available places may have changed, When the student selects an offering and requests registration, Then the system checks current availability instead of treating the catalog information as a reserved place.

**### US-02 — Register for an offering**

**\*\*US-02:\*\*** As a student, I want to register for a course offering with available places, so that my enrollment is recorded and confirmed.

\- **\*\*AC-03\*\*** (R2, R3, R4): Given the selected offering has available places and the student is not already enrolled, When the student submits a registration request, Then the system atomically checks capacity and duplicates, creates exactly one Enrollment linking the student and offering, updates availability, and returns a confirmation
\- **\*\*AC-04\*\*** (R2, R4): Given the selected offering has exactly one available place and the student is not already enrolled, When the student submits a registration request, Then the system creates exactly one Enrollment, fills the last place, updates availability to zero, and confirms registration without exceeding capacity

**### US-03 — Receive a clear rejection**

**\*\*US-03:\*\*** As a student, I want to receive a clear explanation when registration fails, so that I understand why my request was rejected.

\- **\*\*AC-05\*\*** (R2, R5): Given the selected offering is full, When a student who is not already enrolled requests registration, Then the system returns "course full", creates no Enrollment, and leaves the enrollment count unchanged.
\- **\*\*AC-06\*\*** (R3, R5): Given the student is already enrolled in the selected offering, When the student submits another registration request for the same offering, Then the system returns "already enrolled", creates no additional Enrollment, and leaves the enrollment count unchanged.
~~~~

**Response:**

~~~~text
UML Model Review — Course Registration
Overall assessment: Both UML models are largely consistent with R1–R5 and AC-01–AC-06. The sequence diagram covers all four validation cases and uses the correct rejection priority. However, several details require correction or clarification before final approval.
Review summary
Minor corrections needed

2
Defects

2
Clarifications

4/4
Cases represented



1. Genuine defects
Issue and affected element	Impact	Focused correction
D1 — R2, R4; Sequence: Begin atomic registration. Atomicity is stated, but concurrency protection and transaction completion are not explicit.	Two concurrent requests might both see one available place and oversubscribe the offering if the implementation does not serialize or otherwise protect the check-and-insert operation.	Specify a transactional row lock or equivalent atomic capacity enforcement, followed by commit on success and rollback on failure.
D2 — R2, R3, R4; Class: derived /enrollmentCount and /availablePlaces versus Sequence: Update enrollment count.	The models disagree about whether the count is calculated from Enrollment records or stored and updated independently. This could cause inconsistent availability.	Prefer derived values: calculate enrollmentCount from Enrollment records and availablePlaces = capacity - enrollmentCount. Remove the explicit count update from the sequence diagram.
These defects concern implementation semantics and cross-model consistency, not missing user stories.
2. Clarifications and optional design choices
Issue and affected element	Assessment	Recommendation
C1 — R3, R5; Sequence: order of database checks	The sequence checks availability before duplicates, but the alt branches prioritize Already enrolled. This is not necessarily incorrect because both checks occur before the response.	Check duplicates first to make the message order match the rejection priority, especially when a student is already enrolled in a full offering.
C2 — R3; Class: UNIQUE(studentId, offeringId)	The uniqueness rule is correct, but studentId and offeringId are not declared as Enrollment attributes. UML associations can represent these references, so this is not a modeling defect.	Express the uniqueness constraint using the Student–CourseOffering association pair, or identify these as implementation-level foreign keys.
Naming and multiplicities
The main class relationships are correct:
- One Course has zero or more CourseOffering instances; each offering belongs to exactly one course.
- One Student has zero or more Enrollment records; each enrollment belongs to exactly one student.
- One CourseOffering has zero or more Enrollment records; each enrollment belongs to exactly one offering.
The names Student, Course, CourseOffering, Enrollment, Registration Service, and register(studentId, offeringId) are consistent and understandable. No renaming is required.
3. Four validation cases
Validation case	Expected behavior	Review
Available places	Create exactly one Enrollment, reduce availability by one, confirm.	Pass  AC-03
Exactly one place	Create one Enrollment, availability becomes zero, confirm.	Pass  AC-04
Full after stale catalog view	Recheck current capacity, return "course full", no state change.	Pass  AC-02, AC-05
Duplicate registration	Return "already enrolled", no additional Enrollment or count change.	Pass  AC-06
The four cases are represented correctly at the business-logic level. The two defects identified above must be addressed to ensure those behaviors remain correct during concurrent execution.
4. Recommended focused changes
Sequence diagram
Replace the registration operation with a transaction whose internal sequence is:
Service -> DB: registerAtomically(studentId, offeringId)
activate DB

DB -> DB: Begin transaction and lock offering
DB -> DB: Check existing Enrollment

alt Already enrolled (AC-06)
    DB --> Service: "already enrolled"
else Not enrolled
    DB -> DB: Check current availability

    alt Course full (AC-05)
        DB --> Service: "course full"
    else Available places > 0 (AC-03, AC-04)
        DB -> DB: Create exactly one Enrollment
        DB -> DB: Commit transaction
        DB --> Service: Registration confirmed
    end
end

deactivate DB


Add a note specifying that rejected operations close the transaction without any state change and that availability is derived from committed Enrollment records. The actual implementation must also enforce a unique student–offering pair.
Class diagram
Keep the existing associations and derived attributes. Clarify the constraints with:
note right of CourseOffering
R2 - Capacity:
capacity > 0
/enrollmentCount = number of Enrollments
/availablePlaces = capacity - /enrollmentCount
0 <= /enrollmentCount <= capacity
end note

note bottom of Enrollment
R3 - Uniqueness:
At most one Enrollment exists
for each (Student, CourseOffering) pair.
end note


5. Final verdict
Criterion	Result
R1 — Catalog information	Satisfied
R2 — Capacity and availability	Satisfied conceptually; concurrency mechanism needs clarification
R3 — Enrollment uniqueness	Satisfied; enforcement should be explicit
R4 — Atomic registration	Partially specified
R5 — Clear rejection outcomes	Satisfied
AC-01 through AC-06	All represented
Multiplicities	Correct
Naming	Consistent
Cross-model state semantics	Needs correction
Conclusion: The models do not need major restructuring. Correct the derived-count inconsistency, make transaction and concurrency behavior explicit, and align the duplicate-check order with the rejection branches. The remaining observations are optional modeling improvements rather than requirements violations.
~~~~

### B4 — Focused revision (Prompt D)

- **Tool:** ChatGPT
- **Model:** GPT-6 Astra
- **Date:** 2026-10-18
- **Purpose:** apply my accepted review decisions

**Prompt:**

~~~~text
Revise the UML sources using only my accepted review decisions:&#x20;

1. D1 — Clarify the existing atomic registration note to explain that concurrent requests cannot take the same last place. Do not require database-specific locking or rollback messages.
2. D2 — Preserve derived enrollmentCount and availablePlaces. Replace any misleading stored-count update message with recalculation of availability from Enrollment records after successful creation.
3. C1 — Keep both final checks before Enrollment creation. Preserve the required rejection branch order. Duplicate-first checking is optional, not a functional defect.
4. C2 — Express uniqueness as a constraint on each Student–CourseOffering pair. Do not introduce unnecessary foreign-key attributes.
5. Preserve correct catalog browsing, class names, associations, and multiplicities. Keep both rejection paths free of Enrollment creation and state changes.



&#x20;Copy decisions

. Keep justified existing elements and explain each change.\
Preserve the agreed scope and rule IDs. Return both updated PlantUML blocks and a concise change log. Flag any unresolved issue.\
Approved requirements: **### US-01 — Browse offerings**



**\*\*US-01:\*\*** As a student, I want to view available course offerings for one semester, so that I can select an offering for registration.



\- **\*\*AC-01\*\*** (R1): Given the student is signed in and course offerings exist for the semester, When the student opens the course catalog, Then the system displays each course code, title, offering, and number of available places.

\- **\*\*AC-02\*\*** (R1,R2): Given the student has viewed the catalog and the available places may have changed, When the student selects an offering and requests registration, Then the system checks current availability instead of treating the catalog information as a reserved place.



**### US-02 — Register for an offering**



**\*\*US-02:\*\*** As a student, I want to register for a course offering with available places, so that my enrollment is recorded and confirmed.



\- **\*\*AC-03\*\*** (R2, R3, R4): Given the selected offering has available places and the student is not already enrolled, When the student submits a registration request, Then the system atomically checks capacity and duplicates, creates exactly one Enrollment linking the student and offering, updates availability, and returns a confirmation

\- **\*\*AC-04\*\*** (R2, R4): Given the selected offering has exactly one available place and the student is not already enrolled, When the student submits a registration request, Then the system creates exactly one Enrollment, fills the last place, updates availability to zero, and confirms registration without exceeding capacity



**### US-03 — Receive a clear rejection**



**\*\*US-03:\*\*** As a student, I want to receive a clear explanation when registration fails, so that I understand why my request was rejected.



\- **\*\*AC-05\*\*** (R2, R5): Given the selected offering is full, When a student who is not already enrolled requests registration, Then the system returns "course full", creates no Enrollment, and leaves the enrollment count unchanged.

\- **\*\*AC-06\*\*** (R3, R5): Given the student is already enrolled in the selected offering, When the student submits another registration request for the same offering, Then the system returns "already enrolled", creates no additional Enrollment, and leaves the enrollment count unchanged.. Original sources:classes.uml:"\
@startuml\
title Course Registration - Domain Class Diagram\
\
skinparam classAttributeIconSize 0\
hide empty methods\
\
class Student {\
&#x20;   +studentId: Integer\
}\
\
class Course {\
&#x20;   +courseCode: String\
&#x20;   +title: String\
}\
\
class CourseOffering {\
&#x20;   +offeringId: Integer\
&#x20;   +semester: String\
&#x20;   +capacity: Integer\
&#x20;   +/enrollmentCount: Integer\
&#x20;   +/availablePlaces: Integer\
}\
\
class Enrollment {\
&#x20;   +enrollmentId: Integer\
}\
\
Course "1" -- "0..\*" CourseOffering : has\
Student "1" -- "0..\*" Enrollment : makes\
CourseOffering "1" -- "0..\*" Enrollment : receives\
\
note right of CourseOffering\
R2 - Capacity constraint:\
capacity > 0\
enrollmentCount <= capacity\
availablePlaces =\
&#x20; capacity - enrollmentCount\
\
/ denotes a derived attribute.\
end note\
\
note bottom of Enrollment\
R3 - Uniqueness constraint:\
UNIQUE(studentId, offeringId)\
\
One student can have at most\
one Enrollment per offering.\
end note\
\
note bottom of Course\
R1 - Catalog:\
Display courseCode, title,\
offering and availablePlaces\
for one semester.\
end note\
\
@enduml\
",sequence:"\
@startuml\
title Course Registration - Sequence Diagram\
\
actor Student\
boundary "Course Registration UI" as UI\
control "Registration Service" as Service\
database "Database" as DB\
\
\== Browse Catalog (US-01) ==\
\
Student -> UI: Open catalog for semester\
UI -> Service: getOfferings(semesterId)\
Service -> DB: Get offerings and enrollment counts\
DB --> Service: Course codes, titles, offerings, counts\
Service --> UI: Offerings with available places\
UI --> Student: Display catalog (AC-01)\
\
\== Register for Offering (US-02 / US-03) ==\
\
Student -> UI: Request registration(offeringId)\
UI -> Service: register(studentId, offeringId)\
\
note over Service, DB\
Atomic transaction:\
Recheck capacity and duplicates.\
Create Enrollment and update count\
only if both checks pass.\
end note\
\
Service -> DB: Begin atomic registration\
activate DB\
\
DB -> DB: Check current availability (AC-02)\
DB -> DB: Check existing Enrollment\
\
alt Already enrolled (AC-06)\
&#x20;   DB --> Service: "already enrolled"\
&#x20;   note right of DB\
&#x20;   No new Enrollment\
&#x20;   Count unchanged\
&#x20;   end note\
\
else Course full (AC-05)\
&#x20;   DB --> Service: "course full"\
&#x20;   note right of DB\
&#x20;   No new Enrollment\
&#x20;   Count unchanged\
&#x20;   end note\
\
else Eligible for registration (AC-03)\
&#x20;   DB -> DB: Create exactly one Enrollment\
&#x20;   DB -> DB: Update enrollment count\
\
&#x20;   alt Last available place (AC-04)\
&#x20;       note right of DB\
&#x20;       Available places = 0\
&#x20;       Capacity not exceeded\
&#x20;       end note\
&#x20;   end\
\
&#x20;   DB --> Service: Registration confirmed\
end\
\
deactivate DB\
\
Service --> UI: Registration result\
UI --> Student: Show confirmation or rejection\
\
@enduml\
". My review decisions and evidence: | AI suggestion or model element | Decision | Reason | Rule |\
\| --- | --- | --- | --- |\
\| D1 — Sequence: Begin atomic registration, transaction and row locking | Modified — clarify atomicity; reject mandatory row-lock implementation details | The assignment requires the final checks and Enrollment creation to be atomic. An atomic note is sufficient for the UML model, so a specific database locking mechanism is not necessary. The note should clearly explain that concurrent requests cannot take the same last place. | R2, R4 |\
\| D2 — Sequence: Update enrollment count versus Class: /enrollmentCount and /availablePlaces | Modified — clarify that availability is recalculated from Enrollment records | availability is recalculated from Enrollment records\
\
The class diagram defines enrollment count and available places as derived values. The sequence should not imply that an independent stored counter is updated. After creating one Enrollment, the available places must be recalculated and the new value returned | R2, R4 |\
\| C1 — Sequence: capacity check before duplicate check | Rejected as a defect; optional clarification accepted | Both checks can occur before the final decision without violating the rules. The important requirement is that a duplicate request receives the correct rejection message and creates no Enrollment. Checking duplicates first may improve clarity, but it is not mandatory. | R3, R5 |\
|C2 — Class: UNIQUE(studentId, offeringId) constraint|Modified — describe uniqueness using the Student–CourseOffering pair|The Enrollment associations already identify the related student and offering. Adding foreign-key attributes is not required in a conceptual class diagram. A clear note stating that each Student–CourseOffering pair can have at most one Enrollment is sufficient. | R3 |\
.
~~~~

**Response:**

~~~~text
Both UML models have been revised according to your accepted review decisions. The original structure, naming, associations, multiplicities, rule IDs, and acceptance criteria are preserved. Only the necessary corrections have been made.

## 1. Updated Sequence Diagram — `sequence.puml`

```

@startuml
title Course Registration - Sequence Diagram

actor Student
boundary "Course Registration UI" as UI
control "Registration Service" as Service
database "Database" as DB

== Browse Catalog (US-01) ==

Student -> UI: Open catalog for semester
UI -> Service: getOfferings(semesterId)
Service -> DB: Get offerings and enrollment counts
DB --> Service: Course codes, titles, offerings, counts
Service --> UI: Offerings with available places
UI --> Student: Display catalog (AC-01)

== Register for Offering (US-02 / US-03) ==

Student -> UI: Request registration(offeringId)
UI -> Service: register(studentId, offeringId)

note over Service, DB
Atomic transaction:
Recheck current capacity and duplicates.
Create exactly one Enrollment only if
both checks pass.
Concurrent requests cannot register
for the same last available place.
Availability is derived from
Enrollment records, not a stored counter.
end note

Service -> DB: Begin atomic registration
activate DB

DB -> DB: Check current availability (AC-02)
DB -> DB: Check existing Enrollment

alt Already enrolled (AC-06)
    DB --> Service: "already enrolled"
    note right of DB
    No new Enrollment
    Enrollment count unchanged
    Available places unchanged
    end note

else Course full (AC-05)
    DB --> Service: "course full"
    note right of DB
    No new Enrollment
    Enrollment count unchanged
    Available places unchanged
    end note

else Eligible for registration (AC-03)
    DB -> DB: Create exactly one Enrollment
    DB -> DB: Recalculate availability from Enrollment records

    alt Last available place (AC-04)
        note right of DB
        Available places = 0
        Capacity not exceeded
        end note
    end

    DB --> Service: Registration confirmed, updated availability
end

deactivate DB

Service --> UI: Registration result
UI --> Student: Show confirmation or rejection

@enduml

```

### Changes explained

- D1 (R2, R4): The atomic transaction note now explicitly states that concurrent registrations cannot claim the same last available place. No database-specific locking or rollback implementation was introduced.
- D2 (R2, R4): Replaced `Update enrollment count` with `Recalculate availability from Enrollment records`. The successful response also returns updated availability.
- C1 (R3, R5): Preserved capacity-first checking and the original rejection branch order: `Already enrolled`, `Course full`, then `Eligible for registration`.
- AC-05 and AC-06: Both rejection branches explicitly preserve Enrollment records, enrollment count, and availability.

## 2. Updated Class Diagram — `classes.puml`

```

@startuml
title Course Registration - Domain Class Diagram

skinparam classAttributeIconSize 0
hide empty methods

class Student {
    +studentId: Integer
}

class Course {
    +courseCode: String
    +title: String
}

class CourseOffering {
    +offeringId: Integer
    +semester: String
    +capacity: Integer
    +/enrollmentCount: Integer
    +/availablePlaces: Integer
}

class Enrollment {
    +enrollmentId: Integer
}

Course "1" -- "0..*" CourseOffering : has
Student "1" -- "0..*" Enrollment : makes
CourseOffering "1" -- "0..*" Enrollment : receives

note right of CourseOffering
R2 - Capacity constraint:
capacity > 0
enrollmentCount <= capacity
enrollmentCount = number of
associated Enrollment records
availablePlaces =
  capacity - enrollmentCount

/ denotes a derived attribute.
end note

note bottom of Enrollment
R3 - Uniqueness constraint:
Each Student-CourseOffering pair
can have at most one Enrollment.

One student cannot register
twice for the same offering.
end note

note bottom of Course
R1 - Catalog:
Display courseCode, title,
offering and availablePlaces
for one semester.
end note

@enduml

```

### Changes explained

- D2 (R2, R4): Clarified that `enrollmentCount` is calculated from associated Enrollment records. Both derived attributes remain unchanged.
- C2 (R3): Replaced `UNIQUE(studentId, offeringId)` with a conceptual uniqueness constraint on each Student–CourseOffering pair.
- Preserved: All four classes, their attributes, three associations, multiplicities, and the R1 catalog note.
- No foreign-key attributes or additional classes were introduced.

## 3. Concise change log

| Decision | Applied change                                                       | Status |
| -------- | -------------------------------------------------------------------- | ------ |
| D1       | Clarified atomicity under concurrent registration                    |        |
| D2       | Replaced stored-count update with derived availability recalculation |        |
| C1       | Preserved both final checks and original branch priority             |        |
| C2       | Expressed uniqueness by Student–CourseOffering pair                  |        |
| R1       | Preserved semester catalog browsing                                  |        |
| R5       | Preserved both rejection messages and unchanged state                |        |

## 4. Validation against acceptance criteria

| Acceptance criterion                               | Result |
| -------------------------------------------------- | ------ |
| AC-01 — Browse semester offerings                  | Pass   |
| AC-02 — Recheck availability after stale catalog   | Pass   |
| AC-03 — Successful atomic registration             | Pass   |
| AC-04 — Register for the last available place      | Pass   |
| AC-05 — Reject full offering without state changes | Pass   |
| AC-06 — Reject duplicate without state changes     | Pass   |

Unresolved issues: None within the approved conceptual modeling scope. The exact concurrency-control mechanism remains an implementation decision, as requested.

Final result: Both revised models are consistent with R1–R5 and AC-01–AC-06 at the specified modeling level, without adding unnecessary technical details or expanding the agreed scope.
~~~~

## 12. Appendix C — Original diagrams

<!-- The AI's first output from Prompt B, rendered unedited from models/original/. -->

![Original sequence diagram](models/img/original-sequence.png)

![Original class diagram](models/img/original-classes.png)

## 13. Appendix D — References and source checks

### References

<!-- Full references, one per line, each starting with "- ". Only sources you actually opened.
     Every URL used in the source checks must also appear here. Example:
     - Sommerville, I. (2016). Software Engineering, 10th ed., Global Edition. Pearson. Ch. 5. -->

- PlantUML. (2026). Sequence Diagram — Syntax and Features. Official PlantUML Documentation. https://plantuml.com/sequence-diagram (Accessed: 2026-10-18).

- PlantUML. (2026). Class Diagram — Syntax and Features. Official PlantUML Documentation. https://plantuml.com/class-diagram (Accessed: 2026-10-18).

### Source checks

<!-- At least two modeling decisions you verified. Source and locator: title + slide, page,
     section, chapter or figure — or title + URL + access date (YYYY-MM-DD). Slide numbers
     refer to the decks posted in our Teams. -->

| Modeling decision | Source and locator | What the source says | How it supports or changed your model |
| --- | --- | --- | --- |
| Use alt/else branches to represent successful and rejected registration outcomes. | PlantUML, Sequence Diagram, section Grouping message. https://plantuml.com/sequence-diagram (Accessed: 2026-10-18). | The documentation explains that alt, else, and end are used to represent alternative interaction paths in sequence diagrams. | The sequence diagram uses three alternatives: Already enrolled, Course full, and Eligible for registration. This makes the different outcomes clear and ensures Enrollment creation appears only in the success branch (R3–R5). |
| Specify multiplicities on both ends of the associations. | PlantUML, Class Diagram, section Label on relations. https://plantuml.com/class-diagram (Accessed: 2026-10-18). | The documentation shows that cardinality labels can be written in quotation marks at both ends of an association. | The class diagram uses 1 and 0..* for the Course–CourseOffering, Student–Enrollment, and CourseOffering–Enrollment relationships. This shows that every Enrollment belongs to exactly one Student and one CourseOffering |
