import { useState, useEffect, useRef } from "react";
import { saveStepRecord, getStepHistory } from "../api/sheetsApi";

export interface DayRecord {
  date: string;   // "YYYY-MM-DD"
  steps: number;
}

interface StepState {
  date: string;
  steps: number;
  goal: number;
  history: DayRecord[]; // last 7 days excluding today
}

const STORAGE_KEY = "challenge-steps";
const DEFAULT_GOAL = 6000;

function getToday(): string {
  return new Date().toISOString().slice(0, 10);
}

function loadState(): StepState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const data: StepState = JSON.parse(raw);
      const today = getToday();
      if (data.date !== today) {
        // Archive yesterday into history if it had steps
        const history: DayRecord[] = data.history ?? [];
        if (data.steps > 0) {
          history.unshift({ date: data.date, steps: data.steps });
        }
        // Keep only last 7 days
        const trimmed = history.slice(0, 7);
        return { date: today, steps: 0, goal: data.goal ?? DEFAULT_GOAL, history: trimmed };
      }
      return { ...data, history: data.history ?? [] };
    }
  } catch {
    // ignore
  }
  return { date: getToday(), steps: 0, goal: DEFAULT_GOAL, history: [] };
}

function persist(state: StepState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore
  }
}

export function useStepCounter() {
  const [state, setState] = useState<StepState>(loadState);
  const prevStepsRef = useRef(state.steps);
  const syncTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Persist to localStorage on every state change
  useEffect(() => {
    persist(state);
  }, [state]);

  // Debounced sync to Google Sheets when steps change
  useEffect(() => {
    if (state.steps === prevStepsRef.current) return;
    prevStepsRef.current = state.steps;

    if (syncTimeoutRef.current) clearTimeout(syncTimeoutRef.current);
    syncTimeoutRef.current = setTimeout(() => {
      saveStepRecord(state.date, state.steps).catch(() => {
        // Silently fail — localStorage is the source of truth
      });
    }, 1500);

    return () => {
      if (syncTimeoutRef.current) clearTimeout(syncTimeoutRef.current);
    };
  }, [state.steps, state.date]);

  // Load history from Sheets on mount
  useEffect(() => {
    getStepHistory().then((records) => {
      if (records.length === 0) return;
      setState((prev) => {
        // Merge: sheet records for past days (not today), local history for today's prev days
        const today = getToday();
        const sheetsMap = new Map(records.map((r) => [r.date, r.steps]));

        // Build history from sheets (excluding today), take last 7
        const merged: DayRecord[] = records
          .filter((r) => r.date !== today)
          .slice(0, 7);

        // If sheets has today's steps and we have 0 locally, use sheet value
        const todayFromSheets = sheetsMap.get(today);
        const steps = prev.steps > 0 ? prev.steps : (todayFromSheets ?? prev.steps);

        return { ...prev, steps, history: merged };
      });
    }).catch(() => {
      // Ignore — offline or not configured
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const progressPct = Math.min(
    100,
    state.goal > 0 ? Math.round((state.steps / state.goal) * 100) : 0,
  );

  // Today's record for chart
  const todayRecord: DayRecord = { date: state.date, steps: state.steps };

  // Full 7-day window: build last 7 days including today
  const chartData: DayRecord[] = (() => {
    const days: DayRecord[] = [];
    const historyMap = new Map(state.history.map((r) => [r.date, r.steps]));
    historyMap.set(state.date, state.steps);

    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().slice(0, 10);
      days.push({ date: dateStr, steps: historyMap.get(dateStr) ?? 0 });
    }
    return days;
  })();

  function setSteps(n: number) {
    const steps = Math.max(0, Math.round(n));
    setState((prev) => ({ ...prev, steps }));
  }

  function addSteps(n: number) {
    setState((prev) => ({ ...prev, steps: Math.max(0, prev.steps + n) }));
  }

  function setGoal(n: number) {
    const goal = Math.max(1, Math.round(n));
    setState((prev) => ({ ...prev, goal }));
  }

  return {
    steps: state.steps,
    goal: state.goal,
    progressPct,
    chartData,
    todayRecord,
    setSteps,
    addSteps,
    setGoal,
  };
}
