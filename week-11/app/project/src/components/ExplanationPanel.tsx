import type { ExplanationResult } from "../types";

interface ExplanationPanelProps {
  result: ExplanationResult | null;
  canExplain: boolean;
  isExplaining: boolean;
  simulateFailure: boolean;
  onExplain: () => void;
  onSimulateFailure: (value: boolean) => void;
}

export function ExplanationPanel({
  result,
  canExplain,
  isExplaining,
  simulateFailure,
  onExplain,
  onSimulateFailure,
}: ExplanationPanelProps) {
  return (
    <section className="explanation-panel" aria-label="Generated explanation">
      <div className="explanation-heading">
        <div>
          <p className="explanation-eyebrow">Generated explanation</p>
          <h2 className="explanation-title">Why this result?</h2>
        </div>
        <span className="generated-tag">Mock</span>
      </div>

      <div className="explanation-actions">
        <button
          type="button"
          className="btn btn-secondary"
          onClick={onExplain}
          disabled={!canExplain || isExplaining}
        >
          {isExplaining ? "Generating…" : "Explain availability"}
        </button>
        {import.meta.env.DEV && <label className="failure-toggle">
          <input
            type="checkbox"
            checked={simulateFailure}
            onChange={(event) => onSimulateFailure(event.target.checked)}
          />
          Simulate API failure
        </label>}
      </div>

      {result?.explanation && (
        <p className={`explanation-copy explanation-${result.status}`}>{result.explanation}</p>
      )}
      {result?.message && <p className="explanation-error">{result.message}</p>}
    </section>
  );
}
