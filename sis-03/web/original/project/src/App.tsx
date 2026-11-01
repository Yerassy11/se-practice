import { useEffect, useMemo, useState } from "react";
import type { Room, RoomStatus } from "./types";
import { SAMPLE_ROOMS } from "./data/rooms";
import { Header } from "./components/Header";
import { FilterBar, type StatusFilter } from "./components/FilterBar";
import { RoomCard } from "./components/RoomCard";

const ALL_BUILDINGS = Array.from(
  new Set(SAMPLE_ROOMS.map((r) => r.building))
).sort();

function App() {
  const [rooms] = useState<Room[]>(SAMPLE_ROOMS);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [buildingFilter, setBuildingFilter] = useState("all");
  const [clock, setClock] = useState(new Date());

  // Live clock — drives the "time until free" display.
  useEffect(() => {
    const id = window.setInterval(() => setClock(new Date()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const statuses = useMemo<Record<string, RoomStatus>>(() => {
    const map: Record<string, RoomStatus> = {};
    for (const room of rooms) {
      // Deterministic pseudo-status from the room id + current minute,
      // so availability visibly shifts over time without a backend.
      const minute = clock.getMinutes();
      const seed =
        room.id.charCodeAt(2) + room.id.charCodeAt(4) + room.capacity + minute;
      const idx = seed % 3;
      map[room.id] = idx === 0 ? "available" : idx === 1 ? "occupied" : "reserved";
    }
    return map;
  }, [rooms, clock]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return rooms.filter((r) => {
      if (statusFilter !== "all" && statuses[r.id] !== statusFilter) return false;
      if (buildingFilter !== "all" && r.building !== buildingFilter) return false;
      if (q) {
        const hay = `${r.name} ${r.building} ${r.type}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [rooms, search, statusFilter, buildingFilter, statuses]);

  const availableCount = rooms.filter(
    (r) => statuses[r.id] === "available"
  ).length;

  return (
    <div className="app">
      <Header
        clock={clock}
        availableCount={availableCount}
        totalCount={rooms.length}
      />

      <main className="content">
        <FilterBar
          search={search}
          onSearch={setSearch}
          status={statusFilter}
          onStatus={setStatusFilter}
          building={buildingFilter}
          onBuilding={setBuildingFilter}
          buildings={ALL_BUILDINGS}
        />

        {filtered.length === 0 ? (
          <div className="empty-state">
            <p>No rooms match your filters.</p>
            <button
              className="reset-btn"
              onClick={() => {
                setSearch("");
                setStatusFilter("all");
                setBuildingFilter("all");
              }}
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="room-grid">
            {filtered.map((room) => (
              <RoomCard key={room.id} room={room} status={statuses[room.id]} />
            ))}
          </div>
        )}
      </main>

      <footer className="app-footer">
        Fictional sample data · Updates every second
      </footer>
    </div>
  );
}

export default App;
