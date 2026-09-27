# User stories — Smart Campus study room booking

### US-01
**Story:** As a Student, I want to view room availability, so that I can choose a free room and time for study.
**Priority:** High
**Assumption:** Availability reflects existing bookings and blocked rooms.

### US-02
**Story:** As a Student, I want to book a free room for a time slot, so that I can secure a place for individual or group study.
**Priority:** High
**Assumption:** The requested start is in the future, lasts at most two hours, does not overlap another booking, and the room is not blocked.

### US-03
**Story:** As a Student, I want to cancel a booking I made, so that the room can become available again.
**Priority:** High
**Assumption:** A student can cancel only a reservation that the same student made.

### US-04
**Story:** As an Administrator, I want to block or unblock a room, so that rooms can be taken out of service and returned to use when appropriate.
**Priority:** High
**Assumption:** A blocked room remains unavailable for booking until an Administrator unblocks it.

### US-05
**Story:** As an Administrator, I want to review room usage over a period, so that I can understand how the study rooms are being used.
**Priority:** Medium
**Assumption:** Usage information is based on room bookings within the period being reviewed.

### US-06
**Story:** As a Student, I want to receive confirmation after a booking or cancellation, so that I know the requested action was completed.
**Priority:** Medium
**Assumption:** A confirmation is sent only after a booking or cancellation succeeds.
