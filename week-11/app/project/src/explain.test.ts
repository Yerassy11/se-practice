import { expect, test } from "vitest";
import { canBook } from "./booking";
import { explainAvailability } from "./explain";
import { availabilityReason } from "./lib/checkAvailability";
import { createMockExplanationAdapter } from "./mockExplanationAdapter";
import type { ExplanationInput, Room } from "./types";

const mockAdapter = createMockExplanationAdapter();

function room(blocked = false, bookings: Room["bookings"] = []): Room {
  return {
    id: "test-room", name: "Study Room A", building: "Test Building",
    floor: 1, capacity: 4, type: "Study Room", blocked, bookings,
  };
}

async function checkedExplanation(
  selectedRoom: Room, startMin: number, endMin: number, currentTimeMin: number,
  start: string, end: string,
) {
  const isAvailable = canBook({
    start: startMin, end: endMin, now: currentTimeMin,
    blocked: selectedRoom.blocked, bookings: selectedRoom.bookings,
  });
  const reasonCode = availabilityReason({
    room: selectedRoom, startMin, endMin, currentTimeMin,
  });
  const explanation = await explainAvailability({
    roomLabel: selectedRoom.name, start, end, isAvailable, reasonCode,
  }, mockAdapter);
  return { isAvailable, reasonCode, explanation };
}

const availableInput: ExplanationInput = {
  roomLabel: "Study Room A", start: "11:00", end: "12:00",
  isAvailable: true, reasonCode: "available",
};

test("E1: 11–12 touches a 10–11 booking and stays available", async () => {
  const selectedRoom = room(false, [{ start: 600, end: 660 }]);
  const originalBookings = structuredClone(selectedRoom.bookings);
  const result = await checkedExplanation(selectedRoom, 660, 720, 540, "11:00", "12:00");
  expect(result.isAvailable).toBe(true);
  expect(result.reasonCode).toBe("available");
  expect(result.explanation.status).toBe("success");
  expect(result.explanation.explanation).toContain("Available");
  expect(selectedRoom.bookings).toEqual(originalBookings);
});

test("E2: 10:30–11:30 overlaps a 10–11 booking", async () => {
  const result = await checkedExplanation(room(false, [{ start: 600, end: 660 }]),
    630, 690, 540, "10:30", "11:30");
  expect(result.isAvailable).toBe(false);
  expect(result.reasonCode).toBe("overlap");
  expect(result.explanation.status).toBe("success");
  expect(result.explanation.explanation).toMatch(/unavailable/i);
  expect(result.explanation.explanation).toMatch(/overlap/i);
});

test("E3: blocked room stays unavailable", async () => {
  const result = await checkedExplanation(room(true), 660, 720, 540, "11:00", "12:00");
  expect(result.isAvailable).toBe(false);
  expect(result.reasonCode).toBe("room_blocked");
  expect(result.explanation.explanation).toMatch(/blocked.*unavailable/i);
});

test("E4: reversed 12:30–12:00 gives invalid_time", async () => {
  const result = await checkedExplanation(room(), 750, 720, 540, "12:30", "12:00");
  expect(result.isAvailable).toBe(false);
  expect(result.reasonCode).toBe("invalid_time");
  expect(result.explanation.explanation).toContain("invalid");
});

test("E5: 08:00–08:30 at 09:00 gives past_time", async () => {
  const result = await checkedExplanation(room(), 480, 510, 540, "08:00", "08:30");
  expect(result.isAvailable).toBe(false);
  expect(result.reasonCode).toBe("past_time");
  expect(result.explanation.explanation).toContain("invalid");
});

test("E6: blank room label is rejected before the adapter", async () => {
  let called = false;
  const result = await explainAvailability({ ...availableInput, roomLabel: "  " },
    () => { called = true; return "Available."; });
  expect(result.status).toBe("rejected");
  expect(called).toBe(false);
});

test("E7: a 500-character room label is rejected before the adapter", async () => {
  let called = false;
  const result = await explainAvailability({ ...availableInput, roomLabel: "x".repeat(500) },
    () => { called = true; return "Available."; });
  expect(result.status).toBe("rejected");
  expect(called).toBe(false);
});

test("E8: a never-settling fake adapter times out to fallback", async () => {
  const result = await explainAvailability(availableInput, () => new Promise(() => {}), 10);
  expect(result.status).toBe("fallback");
  expect(result.explanation).toContain("checker");
});

test("E9: a throwing fake adapter returns fallback", async () => {
  const result = await explainAvailability(availableInput, async () => {
    throw new Error("simulated API failure");
  });
  expect(result.status).toBe("fallback");
});

test("E1 F2: an invented clock time is rejected", async () => {
  const result = await explainAvailability(availableInput,
    () => "Available at 13:00 because the room is free.");
  expect(result.status).toBe("fallback");
});

test("E2 F2: a contradictory availability claim is rejected", async () => {
  const input: ExplanationInput = { ...availableInput, isAvailable: false, reasonCode: "overlap" };
  const result = await explainAvailability(input,
    () => "The room is Unavailable due to overlap. It is Available.");
  expect(result.status).toBe("fallback");
});

test("E1 F2: an explanation longer than 280 characters is rejected", async () => {
  const result = await explainAvailability(availableInput,
    () => `Available. ${"Extra text ".repeat(30)}`);
  expect(result.status).toBe("fallback");
});

test("V1 F2: a false blocked reason alongside overlap falls back", async () => {
  const input: ExplanationInput = { ...availableInput, isAvailable: false, reasonCode: "overlap" };
  const result = await explainAvailability(input,
    () => "The room is unavailable because there is overlap and the room is blocked.");
  expect(result.status).toBe("fallback");
});

test("V2 F2: returned explanation remains within 280 characters", async () => {
  const result = await explainAvailability(availableInput,
    () => `${" ".repeat(300)}Available.`);
  expect(result.status).toBe("success");
  expect(result.explanation?.length).toBeLessThanOrEqual(280);
});
