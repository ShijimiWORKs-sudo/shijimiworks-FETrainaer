import { Link } from 'react-router-dom';
import { useProgress } from '@/state/ProgressContext';
import './MockExamHubPage.css';

export default function MockExamHubPage() {
  const { progress } = useProgress();
  const results = [...progress.mockResults].reverse();

  return (
    <div>
      <div className="card mock-hub-card">
        <h2>科目A 模擬試験</h2>
        <p className="mock-hub-desc">90分・60問相当（出題プールの範囲で構成）</p>
        <Link to="/mock-exam/A" className="btn btn-primary btn-block">
          科目Aの模試をはじめる
        </Link>
      </div>
      <div className="card mock-hub-card">
        <h2>科目B 模擬試験</h2>
        <p className="mock-hub-desc">100分・20問相当（擬似言語のトレースを含む）</p>
        <Link to="/mock-exam/B" className="btn btn-primary btn-block">
          科目Bの模試をはじめる
        </Link>
      </div>

      {results.length > 0 && (
        <>
          <p className="section-title">受験履歴</p>
          <ul className="mock-history-list">
            {results.slice(0, 10).map((r) => (
              <li key={r.id} className="card mock-history-item">
                <span className="badge">{r.subject === 'A' ? '科目A' : '科目B'}</span>
                <span className="mock-history-score">
                  {r.correctCount} / {r.totalQuestions}
                </span>
                <span className="mock-history-date">
                  {new Date(r.finishedAt).toLocaleDateString('ja-JP')}
                </span>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
