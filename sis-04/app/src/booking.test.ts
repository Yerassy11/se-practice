import { describe, expect, it } from "vitest";
import { canBook, checkRoom } from "./booking";
import { filterRooms } from "./filter";
import type { Room } from "./rooms";

const rooms: Room[] = [
  { id: "free", name: "Free", capacity: 8, equipment: ["projector", "whiteboard"], blocked: false, bookings: [{ start: 600, end: 660 }] },
  { id: "busy", name: "Busy", capacity: 8, equipment: ["projector"], blocked: false, bookings: [{ start: 660, end: 720 }] },
  { id: "blocked", name: "Blocked", capacity: 12, equipment: ["projector", "whiteboard"], blocked: true, bookings: [] },
];

const request = { start: 660, end: 720, now: 540 };

describe("checkRoom and canBook", () => {
  it("AC1: rejects a start equal to now", () => {
    expect(checkRoom(rooms, "free", { start: 540, end: 600, now: 540 })).toBe(false);
  });

  it("AC1: accepts an end at minute 1440", () => {
    expect(canBook({ start: 1380, end: 1440, now: 540, blocked: false, bookings: [] })).toBe(true);
  });

  it("AC2 B1: accepts exactly 120 minutes", () => {
    expect(checkRoom(rooms, "free", { start: 720, end: 840, now: 540 })).toBe(true);
  });

  it("AC2 B2: rejects 121 minutes", () => {
    expect(checkRoom(rooms, "free", { start: 720, end: 841, now: 540 })).toBe(false);
  });

  it("AC3 F3: a blocked selected room is unavailable", () => {
    expect(checkRoom(rooms, "blocked", request)).toBe(false);
  });

  it("AC4 B3: touching an existing booking is available", () => {
    expect(checkRoom(rooms, "free", request)).toBe(true);
  });

  it("AC4 B4: overlapping an existing booking is unavailable", () => {
    expect(checkRoom(rooms, "free", { start: 630, end: 690, now: 540 })).toBe(false);
  });

  it("AC5: checking does not modify room bookings", () => {
    const before = structuredClone(rooms);
    expect(checkRoom(rooms, "free", request)).toBe(true);
    expect(rooms).toEqual(before);
  });

  it("F5: different selected rooms use their own bookings", () => {
    expect(checkRoom(rooms, "free", request)).toBe(true);
    expect(checkRoom(rooms, "busy", request)).toBe(false);
  });

  it("F5: an unknown room ID is unavailable", () => {
    expect(checkRoom(rooms, "missing", request)).toBe(false);
  });

  it("INT F1 F2 F5: filters rooms then checks the selected room", () => {
    const matches = filterRooms(rooms, { attendees: 8, equipment: ["projector", "whiteboard"] });
    expect(matches.map((room) => room.id)).toEqual(["free", "blocked"]);
    expect(checkRoom(matches, "free", request)).toBe(true);
    expect(checkRoom(matches, "blocked", request)).toBe(false);
  });
});
