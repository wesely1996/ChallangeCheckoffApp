import { ThemeToggle } from './ThemeToggle';
import './Layout.css';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="layout">
      <header className="layout__header">
        <div className="layout__header-inner">
          <div className="layout__brand">
            <span className="layout__brand-icon">✦</span>
            <span className="layout__brand-title">Challenge Checkoff</span>
          </div>
          <ThemeToggle />
        </div>
      </header>
      <main className="layout__main">
        <div className="layout__container">
          {children}
        </div>
      </main>
    </div>
  );
}
