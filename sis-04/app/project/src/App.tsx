import { useMemo, useState } from "react";
import { ROOMS } from "../../src/rooms";
import { filterRooms } from "../../src/filter";
import { checkRoom, getBookingIssue } from "../../src/booking";
import type { CheckResult } from "./types";
import { fmtTime, nowHHMM, parseTime } from "./lib/time";
import { BookingForm } from "./components/BookingForm";
import { RoomCard } from "./components/RoomCard";
import { RoomTimeline } from "./components/RoomTimeline";
import { DecisionPanel } from "./components/DecisionPanel";

const EQUIPMENT = [...new Set(ROOMS.flatMap((room) => room.equipment))].sort();

function App() {
  const [attendees, setAttendees] = useState(1);
  const [equipment, setEquipment] = useState<string[]>([]);
  const [selectedId, setSelectedId] = useState(ROOMS[0].id);
  const [currentTime, setCurrentTime] = useState(nowHHMM());
  const [startTime, setStartTime] = useState("10:00");
  const [endTime, setEndTime] = useState("11:00");
  const [endAt24, setEndAt24] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState<CheckResult | null>(null);

  const matchingRooms = useMemo(
    () => filterRooms(ROOMS, { attendees, equipment }),
    [attendees, equipment],
  );
  const room = matchingRooms.find((candidate) => candidate.id === selectedId) ?? matchingRooms[0] ?? null;

  const candidate = useMemo(() => {
    const start = parseTime(startTime);
    const end = endAt24 ? 1440 : parseTime(endTime);
    if (Number.isNaN(start) || Number.isNaN(end)) return null;
    return { start, end };
  }, [startTime, endTime, endAt24]);

  const clearResult = () => {
    setResult(null);
    setSubmitted(false);
  };

  const handleSubmit = () => {
    if (!room) return;
    const now = parseTime(currentTime);
    const start = parseTime(startTime);
    const end = endAt24 ? 1440 : parseTime(endTime);
    const available = checkRoom(ROOMS, room.id, { start, end, now });
    const issue = getBookingIssue({ start, end, now, blocked: room.blocked, bookings: room.bookings });

    let next: CheckResult;
    if (available) {
      next = { decision: "available", reason: `Interval ${fmtTime(start)}–${endAt24 ? "24:00" : fmtTime(end)} is available.` };
    } else if (issue?.kind === "interval") {
      next = { decision: "invalid", reason: "Enter a valid interval: start must be before end, between 00:00 and 24:00." };
    } else if (issue?.kind === "past") {
      next = { decision: "invalid", reason: "Start time must be after the current time." };
    } else if (issue?.kind === "duration") {
      next = { decision: "unavailable", reason: "The maximum duration is 120 minutes." };
    } else if (issue?.kind === "blocked") {
      next = { decision: "unavailable", reason: "This room is blocked and cannot be booked." };
    } else if (issue?.kind === "overlap") {
      next = { decision: "unavailable", reason: `Overlaps an existing booking (${fmtTime(issue.conflict.start)}–${fmtTime(issue.conflict.end)}).`, conflict: issue.conflict };
    } else {
      next = { decision: "unavailable", reason: "This room is unavailable for the selected interval." };
    }
    setResult(next);
    setSubmitted(true);
  };

  const handleReset = () => {
    setCurrentTime(nowHHMM());
    setStartTime("10:00");
    setEndTime("11:00");
    setEndAt24(false);
    clearResult();
  };

  const toggleEquipment = (item: string) => {
    setEquipment((selected) => selected.includes(item)
      ? selected.filter((value) => value !== item)
      : [...selected, item]);
    clearResult();
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="brand">
          <div className="brand-mark" aria-hidden="true"><span className="brand-dot" /></div>
          <div><h1>Smart Campus</h1><p className="brand-sub">Room Availability Checker</p></div>
        </div>
        <p className="tagline">Check a fictional campus room's availability. No booking is created.</p>
      </header>

      <main className="layout">
        <section className="panel left-panel" aria-label="Room requirements and selection">
          <h2 className="panel-title">Room requirements</h2>
          <label className="field attendees-field">
            <span className="field-label">Attendees</span>
            <input type="number" min="1" step="1" value={attendees} onChange={(event) => {
              setAttendees(Math.max(1, Number(event.target.value) || 1));
              clearResult();
            }} />
          </label>
          <fieldset className="equipment-fieldset">
            <legend className="field-label">Required equipment</legend>
            <div className="equipment-options">
              {EQUIPMENT.map((item) => (
                <label className="check-option" key={item}>
                  <input type="checkbox" checked={equipment.includes(item)} onChange={() => toggleEquipment(item)} />
                  <span>{item}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <h2 className="panel-title rooms-heading">Select a room</h2>
          {matchingRooms.length === 0 ? (
            <p className="no-rooms" role="status">No rooms match these requirements</p>
          ) : (
            <div className="room-cards">
              {matchingRooms.map((item) => (
                <RoomCard key={item.id} room={item} selected={item.id === room?.id} onSelect={(id) => {
                  setSelectedId(id);
                  clearResult();
                }} />
              ))}
            </div>
          )}
        </section>

        <section className="panel right-panel" aria-label="Availability check">
          {room ? (
            <>
              <div className="room-summary">
                <div>
                  <h2 className="room-summary-name">{room.name}</h2>
                  <p className="room-summary-meta">Capacity {room.capacity} · {room.equipment.join(", ")}</p>
                </div>
                {room.blocked && <span className="blocked-tag">Blocked</span>}
              </div>

              <BookingForm
                currentTime={currentTime} startTime={startTime} endTime={endTime} endAt24={endAt24}
                onCurrentTime={(value) => { setCurrentTime(value); clearResult(); }}
                onStartTime={(value) => { setStartTime(value); clearResult(); }}
                onEndTime={(value) => { setEndTime(value); clearResult(); }}
                onEndAt24={(value) => { setEndAt24(value); clearResult(); }}
                onSubmit={handleSubmit} onReset={handleReset}
              />

              <div className="timeline-section">
                <h3 className="section-title">Today's schedule</h3>
                <RoomTimeline bookings={room.bookings} candidate={candidate} blocked={room.blocked} />
              </div>
              <DecisionPanel result={result} submitted={submitted} />
              {room.bookings.length > 0 && (
                <ul className="booking-list">
                  {room.bookings.map((booking, index) => (
                    <li key={index}><span className="booking-list-time">{fmtTime(booking.start)}–{fmtTime(booking.end)}</span></li>
                  ))}
                </ul>
              )}
            </>
          ) : (
            <p className="no-rooms" role="status">Adjust the requirements to select a room.</p>
          )}
        </section>
      </main>

      <footer className="app-footer">Fictional sample data · Read-only availability check</footer>
    </div>
  );
}

export default App;
