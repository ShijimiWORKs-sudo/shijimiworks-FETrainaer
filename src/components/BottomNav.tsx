import { NavLink } from 'react-router-dom';
import './BottomNav.css';

const items = [
  { to: '/', label: 'ホーム', icon: '🏠', end: true },
  { to: '/practice', label: '演習', icon: '📘' },
  { to: '/mock-exam', label: '模試', icon: '📝' },
  { to: '/stats', label: '成績', icon: '📊' },
  { to: '/more', label: 'もっと', icon: '☰' },
];

export default function BottomNav() {
  return (
    <nav className="bottom-nav" aria-label="メインナビゲーション">
      {items.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.end}
          className={({ isActive }) => `bottom-nav-item${isActive ? ' is-active' : ''}`}
        >
          <span className="bottom-nav-icon" aria-hidden>
            {item.icon}
          </span>
          <span className="bottom-nav-label">{item.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
