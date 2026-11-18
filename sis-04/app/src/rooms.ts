export type Room = {
  id: string;
  name: string;
  capacity: number;
  equipment: string[];
  blocked: boolean;
  bookings: { start: number; end: number }[];
};

export const ROOMS: Room[] = [
  {
    id: "r-001",
    name: "Engineering Hall A",
    capacity: 120,
    equipment: ["projector", "whiteboard", "microphone"],
    blocked: false,
    bookings: [{ start: 540, end: 600 }, { start: 720, end: 840 }],
  },
  {
    id: "r-002",
    name: "Thermodynamics Lab",
    capacity: 40,
    equipment: ["whiteboard", "lab equipment"],
    blocked: true,
    bookings: [],
  },
  {
    id: "r-003",
    name: "Newton Auditorium",
    capacity: 300,
    equipment: ["projector", "microphone"],
    blocked: false,
    bookings: [{ start: 600, end: 720 }, { start: 900, end: 1020 }],
  },
  {
    id: "r-004",
    name: "Seminar Room 204",
    capacity: 25,
    equipment: ["projector", "whiteboard"],
    blocked: false,
    bookings: [{ start: 480, end: 540 }],
  },
  {
    id: "r-005",
    name: "Robotics Lab",
    capacity: 35,
    equipment: ["whiteboard", "lab equipment"],
    blocked: false,
    bookings: [{ start: 780, end: 840 }, { start: 1140, end: 1200 }],
  },
];
