import { useState, useRef, useEffect } from 'react';
import './CreateChallengeModal.css';

interface CreateChallengeModalProps {
  onClose: () => void;
  onCreate: (title: string, duration: number) => Promise<void>;
}

export function CreateChallengeModal({ onClose, onCreate }: CreateChallengeModalProps) {
  const [title, setTitle] = useState('');
  const [duration, setDuration] = useState('30');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const titleRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    titleRef.current?.focus();
  }, []);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmedTitle = title.trim();
    const dur = parseInt(duration, 10);
    if (!trimmedTitle) {
      setError('Please enter a challenge title.');
      return;
    }
    if (isNaN(dur) || dur < 1 || dur > 365) {
      setError('Duration must be between 1 and 365 days.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await onCreate(trimmedTitle, dur);
      onClose();
    } catch (err) {
      setError('Failed to create challenge. Please try again.');
      setLoading(false);
    }
  }

  const QUICK_DURATIONS = [7, 14, 21, 30, 60, 100];

  return (
    <div
      className="modal-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
      role="dialog"
      aria-modal="true"
      aria-label="Create new challenge"
    >
      <div className="modal">
        <div className="modal__header">
          <h2 className="modal__title">New Challenge</h2>
          <button className="modal__close" onClick={onClose} aria-label="Close">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <form className="modal__form" onSubmit={handleSubmit}>
          <div className="modal__field">
            <label className="modal__label" htmlFor="challenge-title">
              Challenge Title
            </label>
            <input
              ref={titleRef}
              id="challenge-title"
              className="modal__input"
              type="text"
              placeholder="e.g. Cold showers, No sugar, Daily walk…"
              value={title}
              onChange={e => setTitle(e.target.value)}
              maxLength={80}
              disabled={loading}
            />
          </div>

          <div className="modal__field">
            <label className="modal__label" htmlFor="challenge-duration">
              Duration (days)
            </label>
            <div className="modal__quick-durations">
              {QUICK_DURATIONS.map(d => (
                <button
                  key={d}
                  type="button"
                  className={`modal__quick-btn ${duration === String(d) ? 'modal__quick-btn--active' : ''}`}
                  onClick={() => setDuration(String(d))}
                  disabled={loading}
                >
                  {d}d
                </button>
              ))}
            </div>
            <input
              id="challenge-duration"
              className="modal__input modal__input--number"
              type="number"
              min="1"
              max="365"
              value={duration}
              onChange={e => setDuration(e.target.value)}
              disabled={loading}
            />
          </div>

          {error && (
            <div className="modal__error" role="alert">
              {error}
            </div>
          )}

          <div className="modal__actions">
            <button
              type="button"
              className="btn btn--ghost"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn--primary"
              disabled={loading || !title.trim()}
            >
              {loading ? 'Creating…' : 'Create Challenge'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
