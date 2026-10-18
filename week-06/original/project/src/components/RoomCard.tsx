import type { Room, RoomStatus } from "../types";

interface RoomCardProps {
  room: Room;
  status: RoomStatus;
}

const STATUS_LABEL: Record<RoomStatus, string> = {
  available: "Available",
  occupied: "Occupied",
  reserved: "Reserved",
};

export function RoomCard({ room, status }: RoomCardProps) {
  const changeText =
    status === "available"
      ? `Free for ~${room.nextChangeInMin} min`
      : `Frees in ~${room.nextChangeInMin} min`;

  return (
    <article className={`room-card status-${status}`}>
      <div className="room-card-head">
        <div>
          <h3 className="room-name">{room.name}</h3>
          <p className="room-loc">
            {room.building} · Floor {room.floor}
          </p>
        </div>
        <span className={`status-badge ${status}`}>{STATUS_LABEL[status]}</span>
      </div>

      <div className="room-meta">
        <span className="meta-chip">{room.type}</span>
        <span className="meta-chip">Cap. {room.capacity}</span>
      </div>

      <p className="room-change">{changeText}</p>
    </article>
  );
}
