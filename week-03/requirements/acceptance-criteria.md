# Acceptance criteria — three selected stories

## Assumptions

- **Overlap:** a booking that ends exactly when another begins is **allowed** under R3, because the two time intervals touch but do not overlap.
- **Duration:** a booking of exactly two hours is **allowed** under R2, because "at most two hours" includes the two-hour boundary.
- A Student can cancel only a booking that the same Student made.

---

## US-01 — View room availability

### AC-01
- **Given** a room is not blocked and has no booking for a future time slot
- **When** the Student views availability for that time slot
- **Then** the room is shown as available for that time slot.

### AC-02
- **Given** a room is blocked
- **When** the Student views availability
- **Then** the blocked room is not shown as available for booking.

### AC-03
- **Given** a room already has a booking for a time slot
- **When** the Student views availability for an overlapping time slot
- **Then** that overlapping time is shown as unavailable.

---

## US-02 — Book a room

### AC-04
- **Given** an unblocked room is free, the requested start is in the future, and the requested duration is exactly two hours
- **When** the Student books the room
- **Then** the booking is created and a booking confirmation is sent.

### AC-05
- **Given** an unblocked room is free but the requested booking does not start in the future
- **When** the Student tries to book the room
- **Then** the booking is rejected.

### AC-06
- **Given** an unblocked room is free and the requested start is in the future, but the requested duration is more than two hours
- **When** the Student tries to book the room
- **Then** the booking is rejected.

### AC-07
- **Given** the room already has a booking that overlaps the requested time
- **When** the Student tries to book that room for the overlapping time
- **Then** the booking is rejected.

### AC-08
- **Given** the requested room is blocked
- **When** the Student tries to book that room
- **Then** the booking is rejected.

---

## US-03 — Cancel a booking

### AC-09
- **Given** the Student has an existing booking that the same Student made
- **When** the Student cancels that booking
- **Then** the reservation is released and a cancellation confirmation is sent.

### AC-10
- **Given** a booking was made by a different Student
- **When** the Student tries to cancel that booking
- **Then** the booking is not cancelled.

### AC-11
- **Given** there is no active booking made by the Student for the specified room and time
- **When** the Student requests a cancellation
- **Then** no booking is cancelled and no cancellation confirmation is sent.
