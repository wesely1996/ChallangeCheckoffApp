import { useState } from 'react';
import type { Challenge } from '../../types/challenge';
import { DayBox } from './DayBox';
import { toggleDay, deleteChallenge } from '../../api/sheetsApi';
import './ChallengeDetail.css';

interface ChallengeDetailProps {
  challenge: Challenge;
  onBack: () => void;
  onUpdate: (updated: Challenge) => void;
  onDelete: (id: string) => void;
}

export function ChallengeDetail({ challenge, onBack, onUpdate, onDelete }: ChallengeDetailProps) {
  const [loadingDay, setLoadingDay] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const completedCount = challenge.completedDays.length;
  const progressPct = Math.round((completedCount / challenge.duration) * 100);

  async function handleToggle(day: number) {
    setLoadingDay(day);
    setError(null);

    // Optimistic update
    const prevDays = challenge.completedDays;
    const isChecked = prevDays.includes(day);
    const optimistic = isChecked
      ? prevDays.filter(d => d !== day)
      : [...prevDays, day].sort((a, b) => a - b);
    onUpdate({ ...challenge, completedDays: optimistic });

    try {
      const updated = await toggleDay(challenge.id, day);
      onUpdate({ ...challenge, completedDays: updated });
    } catch (err) {
      // Revert
      onUpdate({ ...challenge, completedDays: prevDays });
      setError('Failed to update. Please try again.');
    } finally {
      setLoadingDay(null);
    }
  }

  async function handleDelete() {
    setDeleting(true);
    setError(null);
    try {
      await deleteChallenge(challenge.id);
      onDelete(challenge.id);
    } catch (err) {
      setError('Failed to delete. Please try again.');
      setDeleting(false);
      setShowDeleteConfirm(false);
    }
  }

  return (
    <div className="challenge-detail">
      <div className="challenge-detail__header">
        <button className="challenge-detail__back" onClick={onBack}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Back
        </button>
        <button
          className="challenge-detail__delete-btn"
          onClick={() => setShowDeleteConfirm(true)}
          aria-label="Delete challenge"
          title="Delete challenge"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6l-1 14H6L5 6" />
            <path d="M10 11v6M14 11v6" />
            <path d="M9 6V4h6v2" />
          </svg>
        </button>
      </div>

      <div className="challenge-detail__title-row">
        <h1 className="challenge-detail__title">{challenge.title}</h1>
        <p className="challenge-detail__subtitle">
          {completedCount} of {challenge.duration} days completed
        </p>
      </div>

      <div className="challenge-detail__progress-bar">
        <div
          className="challenge-detail__progress-fill"
          style={{ width: `${progressPct}%` }}
          aria-label={`${progressPct}% complete`}
        />
        <span className="challenge-detail__progress-label">{progressPct}%</span>
      </div>

      {error && (
        <div className="challenge-detail__error" role="alert">
          {error}
        </div>
      )}

      <div
        className="challenge-detail__grid"
        role="group"
        aria-label="Day completion grid"
      >
        {Array.from({ length: challenge.duration }, (_, i) => i + 1).map(day => (
          <DayBox
            key={day}
            day={day}
            checked={challenge.completedDays.includes(day)}
            onToggle={handleToggle}
            loading={loadingDay === day}
          />
        ))}
      </div>

      {showDeleteConfirm && (
        <div className="challenge-detail__overlay" role="dialog" aria-modal="true" aria-label="Confirm delete">
          <div className="challenge-detail__confirm">
            <h2 className="challenge-detail__confirm-title">Delete challenge?</h2>
            <p className="challenge-detail__confirm-text">
              "{challenge.title}" and all progress will be permanently deleted.
            </p>
            <div className="challenge-detail__confirm-actions">
              <button
                className="btn btn--ghost"
                onClick={() => setShowDeleteConfirm(false)}
                disabled={deleting}
              >
                Cancel
              </button>
              <button
                className="btn btn--danger"
                onClick={handleDelete}
                disabled={deleting}
              >
                {deleting ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
