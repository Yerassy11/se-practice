import type { Room } from "./rooms";

export function filterRooms(
  rooms: Room[],
  { attendees, equipment }: { attendees: number; equipment: string[] },
): Room[] {
  return rooms.filter(
    (room) =>
      room.capacity >= attendees &&
      equipment.every((item) => room.equipment.includes(item)),
  );
}
