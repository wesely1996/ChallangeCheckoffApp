import { useTheme } from '../context/ThemeContext';
import './ThemeToggle.css';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      className={`theme-toggle theme-toggle--${theme}`}
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === 'pink' ? 'blue' : 'pink'} theme`}
      title={`Switch to ${theme === 'pink' ? 'blue' : 'pink'} theme`}
    >
      <span className="theme-toggle__option theme-toggle__option--pink">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 5.281-5.191 1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447 2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402z"/>
        </svg>
      </span>
      <span className="theme-toggle__knob" />
      <span className="theme-toggle__option theme-toggle__option--blue">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
        </svg>
      </span>
    </button>
  );
}
