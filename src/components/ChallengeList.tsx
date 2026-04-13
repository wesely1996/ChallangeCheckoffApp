import type { Challenge } from '../types/challenge';
import { ChallengeCard } from './ChallengeCard';
import './ChallengeList.css';

interface ChallengeListProps {
  challenges: Challenge[];
  loading: boolean;
  error: string | null;
  onSelect: (id: string) => void;
  onNewChallenge: () => void;
  onRetry: () => void;
}

export function ChallengeList({
  challenges,
  loading,
  error,
  onSelect,
  onNewChallenge,
  onRetry,
}: ChallengeListProps) {
  if (loading) {
    return (
      <div className="challenge-list">
        <div className="challenge-list__top">
          <h1 className="challenge-list__heading">Your Challenges</h1>
        </div>
        <div className="challenge-list__grid">
          {[1, 2, 3].map(i => (
            <div key={i} className="challenge-list__skeleton" aria-hidden="true" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="challenge-list">
        <div className="challenge-list__top">
          <h1 className="challenge-list__heading">Your Challenges</h1>
        </div>
        <div className="challenge-list__error">
          <p>{error}</p>
          <button className="btn btn--primary" onClick={onRetry} style={{ marginTop: '12px' }}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="challenge-list">
      <div className="challenge-list__top">
        <h1 className="challenge-list__heading">Your Challenges</h1>
        <button className="btn btn--primary challenge-list__new-btn" onClick={onNewChallenge}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          New Challenge
        </button>
      </div>

      {challenges.length === 0 ? (
        <div className="challenge-list__empty">
          <div className="challenge-list__empty-icon" aria-hidden="true">✦</div>
          <h2 className="challenge-list__empty-title">No challenges yet</h2>
          <p className="challenge-list__empty-text">
            Start your first challenge and track your progress day by day.
          </p>
          <button className="btn btn--primary" onClick={onNewChallenge}>
            Create your first challenge
          </button>
        </div>
      ) : (
        <div className="challenge-list__grid">
          {challenges.map(c => (
            <ChallengeCard key={c.id} challenge={c} onClick={onSelect} />
          ))}
        </div>
      )}
    </div>
  );
}
