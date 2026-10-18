export type RoomStatus = "available" | "occupied" | "reserved";

export type RoomType = "Lecture Hall" | "Lab" | "Seminar Room" | "Study Room" | "Auditorium";

export interface Room {
  id: string;
  name: string;
  building: string;
  floor: number;
  capacity: number;
  type: RoomType;
  /** Minutes from now (local clock) until the next status change. */
  nextChangeInMin: number;
  /** Status the room will transition to when nextChangeInMin elapses. */
  nextStatus: RoomStatus;
}
