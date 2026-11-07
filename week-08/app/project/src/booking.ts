export type Booking = { start: number; end: number };

type BookingInput = {
  start: number;
  end: number;
  now: number;
  blocked: boolean;
  bookings: readonly Booking[];
};

type BookingIssue =
  | { kind: "interval" | "past" | "duration" | "blocked" }
  | { kind: "overlap"; conflict: Booking };

// Shared by the boolean API and the UI's detailed error messages.
// These checks retain the Week 06 order and conditions.
export function getBookingIssue({
  start, end, now, blocked, bookings,
}: BookingInput): BookingIssue | null {
  if (
    !Number.isFinite(start) ||
    !Number.isFinite(end) ||
    !(start >= 0 && end <= 1440 && start < end)
  ) {
    return { kind: "interval" };
  }
  if (start <= now) return { kind: "past" };
  if (end - start > 120) return { kind: "duration" };
  if (blocked) return { kind: "blocked" };

  const conflict = bookings.find((b) => start < b.end && end > b.start);
  if (conflict) return { kind: "overlap", conflict };
  return null;
}

export function canBook({ start, end, now, blocked, bookings }: {
  start: number;
  end: number;
  now: number;
  blocked: boolean;
  bookings: { start: number; end: number }[];
}): boolean {
  if (!(0 <= start && start < end && end <= 1440)) return false;
  if (!(start > now)) return false;
  if (end - start > 120) return false;
  if (blocked) return false;
  for (const b of bookings) {
    if (start < b.end && end > b.start) return false;
  }
  // keep the room's list current with the slot that was just found free
  return true;
}
