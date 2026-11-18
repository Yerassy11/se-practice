import type { Room } from "../../../src/rooms";

type RoomCardProps = {
  room: Room;
  selected: boolean;
  onSelect: (id: string) => void;
};

export function RoomCard({ room, selected, onSelect }: RoomCardProps) {
  return (
    <button
      type="button"
      className={`room-card ${selected ? "selected" : ""}`}
      aria-pressed={selected}
      onClick={() => onSelect(room.id)}
    >
      <span className="room-card-head">
        <strong>{room.name}</strong>
        {room.blocked && <span className="blocked-tag">Blocked</span>}
      </span>
      <span className="room-card-meta">Capacity {room.capacity} · {room.equipment.join(", ")}</span>
    </button>
  );
}
