# Approved stories — Smart Campus study room booking

**Source of this set:** my Week 03 stories, revised after review.

## Scenario (from the Lesson 04 practice deck, slide 7)

Students view room availability, book a room, and cancel their own bookings. Administrators block
or unblock rooms and review usage.

- **R1** Future start, with duration greater than 0 and at most 2 hours.
- **R2** Active bookings for the same room cannot overlap.
- **R3** A blocked room cannot accept a new booking.
- **R4** A successful booking produces a confirmation.

## Approved Week 03 stories

| ID | Story | Rules used in Week 04 |
| --- | --- | --- |
| US-01 | As a Student, I want to view room availability, so that I can choose a free room and time for study. | R2, R3 |
| US-02 | As a Student, I want to book a free room for a time slot, so that I can secure a place for individual or group study. | R1, R2, R3, R4 |
| US-03 | As a Student, I want to cancel a booking I made, so that the room can become available again. | — |
| US-04 | As an Administrator, I want to block or unblock a room, so that rooms can be taken out of service and returned to use when appropriate. | R3 |
| US-05 | As an Administrator, I want to review room usage over a period, so that I can understand how the study rooms are being used. | — |
| US-06 | As a Student, I want to receive confirmation after a booking or cancellation, so that I know the requested action was completed. | R4 applies to successful booking in Week 04 |

**Out of scope:** payments, equipment in rooms, recurring bookings, waiting lists, notifications
other than the booking confirmation, and user registration.

**Week 04 scope note:** the Week 04 scenario explicitly requires confirmation after a successful
booking (R4). The diagrams therefore model booking confirmation only; they do not add a separate
cancellation-notification flow.
