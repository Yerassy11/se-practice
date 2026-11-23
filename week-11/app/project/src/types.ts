export interface Booking {
  start: number; // minutes from midnight, [0, 1440)
  end: number; // minutes from midnight, (0, 1440]
  label?: string;
}

export interface Room {
  id: string;
  name: string;
  building: string;
  floor: number;
  capacity: number;
  type: string;
  blocked: boolean;
  bookings: Booking[];
}

export type Decision = "available" | "unavailable" | "invalid";

export type AvailabilityReasonCode =
  | "available"
  | "invalid_time"
  | "past_time"
  | "too_long"
  | "room_blocked"
  | "overlap";

export interface CheckInput {
  room: Room;
  currentTimeMin: number;
  startMin: number;
  endMin: number;
}

export interface CheckResult {
  decision: Decision;
  reason: string;
  /** Conflict details when unavailable due to overlap (AC4). */
  conflict?: Booking;
}

export interface ExplanationInput {
  roomLabel: string;
  start: string;
  end: string;
  isAvailable: boolean;
  reasonCode: AvailabilityReasonCode;
}

export type ExplanationAdapter = (input: ExplanationInput) => Promise<unknown> | unknown;

export type ExplanationStatus = "success" | "fallback" | "rejected";

export interface ExplanationResult {
  status: ExplanationStatus;
  explanation?: string;
  message?: string;
}
