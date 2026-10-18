import type { CheckInput, CheckResult } from "../types";
import { fmtTime } from "./time";

/**
 * Pure availability check implementing AC1–AC5.
 * Never mutates the room's bookings (AC5).
 */
export function checkAvailability(input: CheckInput): CheckResult {
  const { room, currentTimeMin, startMin, endMin } = input;

  // AC1: 0 ≤ start < end ≤ 1440, and start must be after current time.
  if (
    !Number.isFinite(startMin) ||
    !Number.isFinite(endMin) ||
    !(startMin >= 0 && endMin <= 1440 && startMin < endMin)
  ) {
    return {
      decision: "invalid",
      reason:
        "Enter a valid interval: 0 ≤ start < end ≤ 1440 minutes (00:00–24:00).",
    };
  }
  if (startMin <= currentTimeMin) {
    return {
      decision: "invalid",
      reason: `Start time must be after the current time (${fmtTime(currentTimeMin)}).`,
    };
  }

  // AC2: reject bookings longer than 120 minutes.
  if (endMin - startMin > 120) {
    return {
      decision: "unavailable",
      reason: `Requested length is ${endMin - startMin} min, but the maximum is 120 min.`,
    };
  }

  // AC3: reject when the room is blocked.
  if (room.blocked) {
    return {
      decision: "unavailable",
      reason: "This room is blocked and cannot be booked.",
    };
  }

  // AC4: reject overlap with existing bookings; touching endpoints allowed.
  // Intervals [a,b) and [c,d) overlap iff a < d && c < b.
  const conflict = room.bookings.find(
    (b) => startMin < b.end && endMin > b.start
  );
  if (conflict) {
    return {
      decision: "unavailable",
      reason: `Overlaps an existing booking (${fmtTime(conflict.start)}–${fmtTime(conflict.end)}). Touching endpoints are allowed.`,
      conflict,
    };
  }

  return {
    decision: "available",
    reason: `Interval ${fmtTime(startMin)}–${fmtTime(endMin)} is available (${endMin - startMin} min).`,
  };
}
