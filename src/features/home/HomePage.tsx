import { Link } from 'react-router-dom';
import { useProgress } from '@/state/ProgressContext';
import { ALL_QUESTIONS } from '@/data/questions';
import { categoryAccuracy, pickReviewQueue, pickWeakQuestions } from '@/lib/quizSelection';
import { CATEGORIES_A, CATEGORIES_B, CATEGORY_LABEL } from '@/types/question';
import './HomePage.css';

export default function HomePage() {
  const { progress } = useProgress();
  const acc = categoryAccuracy(ALL_QUESTIONS, progress);
  const weakCount = pickWeakQuestions(ALL_QUESTIONS, progress).length;
  const reviewCount = pickReviewQueue(ALL_QUESTIONS, progress).length;
  const today = new Date();
  const todayKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(
    today.getDate(),
  ).padStart(2, '0')}`;
  const todayLog = progress.dailyLog[todayKey];
  const lastMock = progress.mockResults[progress.mockResults.length - 1];

  return (
    <div className="home-page">
      <section className="home-hero card">
        <p className="home-hero-eyebrow">今日の学習</p>
        <div className="home-hero-stats">
          <div>
            <span className="home-hero-num">{progress.streak.current}</span>
            <span className="home-hero-unit">日連続</span>
          </div>
          <div>
            <span className="home-hero-num">{todayLog?.attempted ?? 0}</span>
            <span className="home-hero-unit">問演習</span>
          </div>
          <div>
            <span className="home-hero-num">
              {todayLog && todayLog.attempted > 0
                ? Math.round((todayLog.correct / todayLog.attempted) * 100)
                : '-'}
            </span>
            <span className="home-hero-unit">% 正答率</span>
          </div>
        </div>
        <Link to="/daily" className="btn btn-primary btn-block home-hero-cta">
          今日の10問をはじめる
        </Link>
      </section>

      <div className="home-badges">
        <Link to="/weak" className="home-badge-card card">
          <span className="home-badge-num">{weakCount}</span>
          <span>苦手問題</span>
        </Link>
        <Link to="/review" className="home-badge-card card">
          <span className="home-badge-num">{reviewCount}</span>
          <span>復習待ち</span>
        </Link>
      </div>

      <p className="section-title">科目A（テクノロジ・マネジメント・ストラテジ）</p>
      <div className="card home-progress-card">
        {CATEGORIES_A.map((cat) => (
          <ProgressRow key={cat} label={CATEGORY_LABEL[cat]} stat={acc[cat]} to={`/practice/A/${cat}`} />
        ))}
      </div>

      <p className="section-title">科目B（擬似言語・アルゴリズム・データ構造・セキュリティ）</p>
      <div className="card home-progress-card">
        {CATEGORIES_B.map((cat) => (
          <ProgressRow key={cat} label={CATEGORY_LABEL[cat]} stat={acc[cat]} to={`/practice/B/${cat}`} />
        ))}
      </div>

      <p className="section-title">模擬試験</p>
      <div className="card">
        {lastMock ? (
          <p className="home-mock-result">
            前回スコア: {lastMock.correctCount} / {lastMock.totalQuestions}（
            {Math.round((lastMock.correctCount / lastMock.totalQuestions) * 100)}%）
          </p>
        ) : (
          <p className="home-mock-result home-mock-empty">まだ模擬試験を受けていません。</p>
        )}
        <Link to="/mock-exam" className="btn btn-secondary btn-block">
          模擬試験へ
        </Link>
      </div>
    </div>
  );
}

function ProgressRow({
  label,
  stat,
  to,
}: {
  label: string;
  stat?: { total: number; correct: number; attempted: number };
  to: string;
}) {
  const rate = stat && stat.attempted > 0 ? Math.round((stat.correct / stat.attempted) * 100) : 0;
  return (
    <Link to={to} className="home-progress-row">
      <span className="home-progress-label">{label}</span>
      <div className="home-progress-bar">
        <div className="home-progress-fill" style={{ width: `${rate}%` }} />
      </div>
      <span className="home-progress-pct">{stat?.attempted ? `${rate}%` : '未着手'}</span>
    </Link>
  );
}
