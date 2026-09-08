import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import BottomNav from '@/components/BottomNav';
import './Layout.css';

export default function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const isRoot = location.pathname === '/';

  return (
    <div className="app-shell">
      <header className="app-header">
        {isRoot ? (
          <span className="app-header-spacer" />
        ) : (
          <button
            type="button"
            className="app-header-back"
            onClick={() => navigate(-1)}
            aria-label="戻る"
            data-testid="header-back"
          >
            ‹
          </button>
        )}
        <span className="app-header-title">基本情報技術者 Trainer</span>
        <span className="app-header-spacer" />
      </header>
      <main className="app-main">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
}
