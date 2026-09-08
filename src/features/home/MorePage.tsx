import { Link } from 'react-router-dom';
import { useProgress } from '@/state/ProgressContext';
import './MorePage.css';

export default function MorePage() {
  const { refresh } = useProgress();

  function handleReset() {
    if (!window.confirm('学習データをすべて削除します。よろしいですか？')) return;
    window.localStorage.removeItem('fetrainer:progress:v1');
    refresh();
  }

  return (
    <div>
      <ul className="more-list">
        <li>
          <Link to="/daily" className="more-list-item card">
            <span>📅 今日の10問</span>
            <span className="more-list-arrow">›</span>
          </Link>
        </li>
        <li>
          <Link to="/weak" className="more-list-item card">
            <span>⚠️ 苦手問題</span>
            <span className="more-list-arrow">›</span>
          </Link>
        </li>
        <li>
          <Link to="/review" className="more-list-item card">
            <span>🔁 復習</span>
            <span className="more-list-arrow">›</span>
          </Link>
        </li>
      </ul>

      <p className="section-title">設定</p>
      <div className="card">
        <p className="more-settings-desc">
          学習データはこの端末のブラウザ内（localStorage）にのみ保存されています。
        </p>
        <button type="button" className="btn btn-secondary btn-block" onClick={handleReset}>
          学習データをリセット
        </button>
      </div>
    </div>
  );
}
