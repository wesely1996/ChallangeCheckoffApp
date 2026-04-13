import './DayBox.css';

interface DayBoxProps {
  day: number;
  checked: boolean;
  onToggle: (day: number) => void;
  loading?: boolean;
}

export function DayBox({ day, checked, onToggle, loading }: DayBoxProps) {
  return (
    <button
      className={`day-box ${checked ? 'day-box--checked' : ''} ${loading ? 'day-box--loading' : ''}`}
      onClick={() => !loading && onToggle(day)}
      aria-label={`Day ${day} ${checked ? '(completed)' : '(not completed)'}`}
      aria-pressed={checked}
      disabled={loading}
    >
      <span className="day-box__number">{day}</span>
      {checked && (
        <span className="day-box__check" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </span>
      )}
    </button>
  );
}
