import type { DayRecord } from '../../hooks/useStepCounter';
import './StepChart.css';

interface StepChartProps {
  data: DayRecord[];
  goal: number;
}

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function shortLabel(dateStr: string): string {
  const d = new Date(dateStr + 'T12:00:00');
  return DAY_LABELS[d.getDay()];
}

function formatK(n: number): string {
  if (n >= 1000) return (n / 1000).toFixed(n % 1000 === 0 ? 0 : 1) + 'k';
  return String(n);
}

export function StepChart({ data, goal }: StepChartProps) {
  const today = new Date().toISOString().slice(0, 10);
  const maxSteps = Math.max(goal, ...data.map((d) => d.steps), 1);

  return (
    <div className="step-chart">
      <div className="step-chart__header">
        <span className="step-chart__title">7-Day History</span>
        <span className="step-chart__goal-line-label">Goal: {formatK(goal)}</span>
      </div>

      <div className="step-chart__bars-wrapper">
        {/* Goal line */}
        <div
          className="step-chart__goal-line"
          style={{ bottom: `${(goal / maxSteps) * 100}%` }}
          aria-hidden="true"
        />

        <div className="step-chart__bars">
          {data.map((record) => {
            const pct = maxSteps > 0 ? (record.steps / maxSteps) * 100 : 0;
            const isToday = record.date === today;
            const metGoal = record.steps >= goal;

            return (
              <div key={record.date} className="step-chart__bar-col">
                <div className="step-chart__bar-track">
                  <div
                    className={[
                      'step-chart__bar-fill',
                      isToday ? 'step-chart__bar-fill--today' : '',
                      metGoal ? 'step-chart__bar-fill--goal' : '',
                    ].filter(Boolean).join(' ')}
                    style={{ height: `${pct}%` }}
                    title={`${record.date}: ${record.steps.toLocaleString()} steps`}
                  />
                </div>
                <div className={`step-chart__bar-label ${isToday ? 'step-chart__bar-label--today' : ''}`}>
                  {shortLabel(record.date)}
                </div>
                {record.steps > 0 && (
                  <div className="step-chart__bar-value">{formatK(record.steps)}</div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
