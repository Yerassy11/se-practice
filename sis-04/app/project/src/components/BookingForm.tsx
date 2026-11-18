interface BookingFormProps {
  currentTime: string;
  startTime: string;
  endTime: string;
  endAt24: boolean;
  onCurrentTime: (v: string) => void;
  onStartTime: (v: string) => void;
  onEndTime: (v: string) => void;
  onEndAt24: (v: boolean) => void;
  onSubmit: () => void;
  onReset: () => void;
}

export function BookingForm({
  currentTime,
  startTime,
  endTime,
  endAt24,
  onCurrentTime,
  onStartTime,
  onEndTime,
  onEndAt24,
  onSubmit,
  onReset,
}: BookingFormProps) {
  return (
    <form
      className="booking-form"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
    >
      <div className="form-row">
        <label className="field">
          <span className="field-label">Current time</span>
          <input
            type="time"
            value={currentTime}
            onChange={(e) => onCurrentTime(e.target.value)}
            required
          />
        </label>
        <label className="field">
          <span className="field-label">Start</span>
          <input
            type="time"
            value={startTime}
            onChange={(e) => onStartTime(e.target.value)}
            required
          />
        </label>
        <label className="field">
          <span className="field-label">End</span>
          <input
            type="time"
            value={endTime}
            onChange={(e) => onEndTime(e.target.value)}
            required={!endAt24}
            disabled={endAt24}
          />
        </label>
      </div>

      <label className="check-option end-at-24">
        <input type="checkbox" checked={endAt24} onChange={(e) => onEndAt24(e.target.checked)} />
        <span>End at 24:00</span>
      </label>

      <div className="form-actions">
        <button type="submit" className="btn btn-primary">
          Check availability
        </button>
        <button type="button" className="btn btn-ghost" onClick={onReset}>
          Reset
        </button>
      </div>
      <p className="form-hint">
        Max length 120 min. Intervals use a 24-hour clock (00:00–24:00). Touching
        endpoints are allowed.
      </p>
    </form>
  );
}
