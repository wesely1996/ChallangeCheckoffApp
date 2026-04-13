import { useState, useRef } from 'react';
import { useStepCounter } from '../../hooks/useStepCounter';
import { StepChart } from './StepChart';
import './StepCounter.css';

const RADIUS = 46;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

function formatNumber(n: number): string {
  return n.toLocaleString();
}

export function StepCounter() {
  const { steps, goal, progressPct, chartData, setSteps, addSteps, setGoal } = useStepCounter();

  const [editingSteps, setEditingSteps] = useState(false);
  const [stepsInput, setStepsInput] = useState('');

  const [editingGoal, setEditingGoal] = useState(false);
  const [goalInput, setGoalInput] = useState('');

  const stepsInputRef = useRef<HTMLInputElement>(null);
  const goalInputRef = useRef<HTMLInputElement>(null);

  const dashOffset = CIRCUMFERENCE * (1 - progressPct / 100);

  function handleStepsClick() {
    setStepsInput(String(steps));
    setEditingSteps(true);
    setTimeout(() => stepsInputRef.current?.select(), 0);
  }

  function commitSteps() {
    const parsed = parseInt(stepsInput, 10);
    if (!isNaN(parsed)) setSteps(parsed);
    setEditingSteps(false);
  }

  function handleStepsKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') commitSteps();
    if (e.key === 'Escape') setEditingSteps(false);
  }

  function handleGoalClick() {
    setGoalInput(String(goal));
    setEditingGoal(true);
    setTimeout(() => goalInputRef.current?.select(), 0);
  }

  function commitGoal() {
    const parsed = parseInt(goalInput, 10);
    if (!isNaN(parsed) && parsed >= 1) setGoal(parsed);
    setEditingGoal(false);
  }

  function handleGoalKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') commitGoal();
    if (e.key === 'Escape') setEditingGoal(false);
  }

  return (
    <div className="step-counter">
      {/* Circular progress ring */}
      <div className="step-counter__ring-wrapper">
        <svg className="step-counter__ring" viewBox="0 0 110 110">
          <circle
            className="step-counter__ring-bg"
            cx="55"
            cy="55"
            r={RADIUS}
          />
          <circle
            className="step-counter__ring-fill"
            cx="55"
            cy="55"
            r={RADIUS}
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={dashOffset}
          />
        </svg>
        <div className="step-counter__ring-pct">{progressPct}%</div>
      </div>

      {/* Info panel */}
      <div className="step-counter__info">
        <span className="step-counter__label">Today's Steps</span>

        <div className="step-counter__value-row">
          {editingSteps ? (
            <input
              ref={stepsInputRef}
              className="step-counter__value-input"
              type="number"
              min="0"
              value={stepsInput}
              onChange={e => setStepsInput(e.target.value)}
              onBlur={commitSteps}
              onKeyDown={handleStepsKeyDown}
              autoFocus
            />
          ) : (
            <>
              <span
                className="step-counter__value"
                onClick={handleStepsClick}
                title="Click to edit"
              >
                {formatNumber(steps)}
              </span>
              <span className="step-counter__value-unit">steps</span>
            </>
          )}
        </div>

        <div className="step-counter__goal-row">
          <span>Goal:</span>
          {editingGoal ? (
            <input
              ref={goalInputRef}
              className="step-counter__goal-input"
              type="number"
              min="1"
              value={goalInput}
              onChange={e => setGoalInput(e.target.value)}
              onBlur={commitGoal}
              onKeyDown={handleGoalKeyDown}
              autoFocus
            />
          ) : (
            <span
              className="step-counter__goal-value"
              onClick={handleGoalClick}
              title="Click to edit goal"
            >
              {formatNumber(goal)}
            </span>
          )}
        </div>

        <div className="step-counter__actions">
          {[100, 500, 1000].map(n => (
            <button
              key={n}
              className="step-counter__add-btn"
              onClick={() => addSteps(n)}
              aria-label={`Add ${n} steps`}
            >
              +{formatNumber(n)}
            </button>
          ))}
        </div>
      </div>

      {/* 7-day bar chart */}
      <div className="step-counter__chart-panel">
        <StepChart data={chartData} goal={goal} />
      </div>
    </div>
  );
}
