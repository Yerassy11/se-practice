interface HeaderProps {
  clock: Date;
  availableCount: number;
  totalCount: number;
}

export function Header({ clock, availableCount, totalCount }: HeaderProps) {
  const timeStr = clock.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  const dateStr = clock.toLocaleDateString([], {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <header className="app-header">
      <div className="header-top">
        <div className="brand">
          <div className="brand-mark" aria-hidden="true">
            <span className="brand-dot" />
          </div>
          <div>
            <h1>Smart Campus</h1>
            <p className="brand-sub">Room Availability Checker</p>
          </div>
        </div>
        <div className="clock">
          <div className="clock-time">{timeStr}</div>
          <div className="clock-date">{dateStr}</div>
        </div>
      </div>
      <div className="summary-bar">
        <span className="summary-pill available">
          <span className="pill-dot" />
          {availableCount} Available
        </span>
        <span className="summary-pill total">{totalCount} Rooms Total</span>
      </div>
    </header>
  );
}
