import { ThemeToggle } from './ThemeToggle';
import bowImg from '../../assets/bow.png';
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
            <img src={bowImg} alt="" className="layout__brand-icon" width={24} height={24} />
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
