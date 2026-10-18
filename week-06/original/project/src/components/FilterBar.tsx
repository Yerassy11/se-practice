import type { RoomStatus } from "../types";

export type StatusFilter = "all" | RoomStatus;

interface FilterBarProps {
  search: string;
  onSearch: (value: string) => void;
  status: StatusFilter;
  onStatus: (value: StatusFilter) => void;
  building: string;
  onBuilding: (value: string) => void;
  buildings: string[];
}

const STATUS_OPTIONS: { value: StatusFilter; label: string }[] = [
  { value: "all", label: "All Status" },
  { value: "available", label: "Available" },
  { value: "occupied", label: "Occupied" },
  { value: "reserved", label: "Reserved" },
];

export function FilterBar({
  search,
  onSearch,
  status,
  onStatus,
  building,
  onBuilding,
  buildings,
}: FilterBarProps) {
  return (
    <section className="filter-bar" aria-label="Filter rooms">
      <div className="search-field">
        <svg
          className="search-icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="7" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          type="search"
          placeholder="Search room name or building…"
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          aria-label="Search rooms"
        />
      </div>

      <div className="select-field">
        <select
          value={status}
          onChange={(e) => onStatus(e.target.value as StatusFilter)}
          aria-label="Filter by status"
        >
          {STATUS_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>

      <div className="select-field">
        <select
          value={building}
          onChange={(e) => onBuilding(e.target.value)}
          aria-label="Filter by building"
        >
          <option value="all">All Buildings</option>
          {buildings.map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </select>
      </div>
    </section>
  );
}
