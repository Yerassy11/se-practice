import { describe, expect, it } from "vitest";
import { filterRooms } from "./filter";
import type { Room } from "./rooms";

const rooms: Room[] = [
  { id: "small", name: "Small", capacity: 7, equipment: ["projector"], blocked: false, bookings: [] },
  { id: "exact", name: "Exact", capacity: 8, equipment: ["projector", "whiteboard"], blocked: false, bookings: [] },
  { id: "large", name: "Large", capacity: 20, equipment: ["whiteboard"], blocked: false, bookings: [] },
];

describe("filterRooms", () => {
  it("F1 B5: includes a room whose capacity equals attendees", () => {
    expect(filterRooms(rooms, { attendees: 8, equipment: [] }).map((room) => room.id)).toEqual(["exact", "large"]);
  });

  it("F1 B6: excludes a room with capacity one below attendees", () => {
    expect(filterRooms(rooms, { attendees: 8, equipment: [] }).map((room) => room.id)).not.toContain("small");
  });

  it("F2: requires every selected equipment item", () => {
    expect(filterRooms(rooms, { attendees: 8, equipment: ["projector", "whiteboard"] }).map((room) => room.id)).toEqual(["exact"]);
  });

  it("F2: accepts a room when no equipment is required", () => {
    expect(filterRooms(rooms, { attendees: 7, equipment: [] }).map((room) => room.id)).toEqual(["small", "exact", "large"]);
  });

  it("F4: returns no rooms when requirements have no match", () => {
    expect(filterRooms(rooms, { attendees: 21, equipment: ["projector"] })).toEqual([]);
  });
});
