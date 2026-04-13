import type { Challenge } from '../types/challenge';
import './ChallengeCard.css';

interface ChallengeCardProps {
  challenge: Challenge;
  onClick: (id: string) => void;
}

export function ChallengeCard({ challenge, onClick }: ChallengeCardProps) {
  const completed = challenge.completedDays.length;
  const progressPct = Math.round((completed / challenge.duration) * 100);

  // Show mini grid preview — up to 30 days
  const previewCount = Math.min(challenge.duration, 30);

  return (
    <button
      className="challenge-card"
      onClick={() => onClick(challenge.id)}
      aria-label={`Open ${challenge.title} challenge`}
    >
      <div className="challenge-card__top">
        <h2 className="challenge-card__title">{challenge.title}</h2>
        <span className="challenge-card__badge">{challenge.duration}d</span>
      </div>

      <div className="challenge-card__progress-row">
        <div className="challenge-card__progress-bar">
          <div
            className="challenge-card__progress-fill"
            style={{ width: `${progressPct}%` }}
          />
        </div>
        <span className="challenge-card__progress-text">
          {completed}/{challenge.duration}
        </span>
      </div>

      <div className="challenge-card__mini-grid" aria-hidden="true">
        {Array.from({ length: previewCount }, (_, i) => i + 1).map(day => (
          <div
            key={day}
            className={`challenge-card__mini-dot ${challenge.completedDays.includes(day) ? 'challenge-card__mini-dot--checked' : ''}`}
          />
        ))}
        {challenge.duration > previewCount && (
          <span className="challenge-card__mini-more">+{challenge.duration - previewCount}</span>
        )}
      </div>
    </button>
  );
}
