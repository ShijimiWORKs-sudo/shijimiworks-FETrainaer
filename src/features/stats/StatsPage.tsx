import { useProgress } from '@/state/ProgressContext';
import { ALL_QUESTIONS } from '@/data/questions';
import { categoryAccuracy } from '@/lib/quizSelection';
import { CATEGORIES_A, CATEGORIES_B, CATEGORY_LABEL } from '@/types/question';
import './StatsPage.css';

export default function StatsPage() {
  const { progress } = useProgress();
  const acc = categoryAccuracy(ALL_QUESTIONS, progress);

  const totalAttempts = progress.attempts.length;
  const totalCorrect = progress.attempts.filter((a) => a.correct).length;
  const overallRate = totalAttempts > 0 ? Math.round((totalCorrect / totalAttempts) * 100) : 0;

  const dailyEntries = Object.entries(progress.dailyLog)
    .sort(([a], [b]) => (a < b ? -1 : 1))
    .slice(-14);
  const maxAttempted = Math.max(1, ...dailyEntries.map(([, v]) => v.attempted));

  return (
    <div>
      <div className="card stats-overview">
        <div>
          <span className="stats-overview-num">{totalAttempts}</span>
          <span className="stats-overview-label">総演習数</span>
        </div>
        <div>
          <span className="stats-overview-num">{overallRate}%</span>
          <span className="stats-overview-label">総合正答率</span>
        </div>
        <div>
          <span className="stats-overview-num">{progress.streak.longest}</span>
          <span className="stats-overview-label">最長連続日数</span>
        </div>
      </div>

      <p className="section-title">科目A カテゴリ別正答率</p>
      <div className="card">
        <BarChart categories={CATEGORIES_A} acc={acc} />
      </div>

      <p className="section-title">科目B カテゴリ別正答率</p>
      <div className="card">
        <BarChart categories={CATEGORIES_B} acc={acc} />
      </div>

      <p className="section-title">直近の学習履歴</p>
      <div className="card">
        {dailyEntries.length === 0 ? (
          <p className="stats-empty">まだ記録がありません。</p>
        ) : (
          <div className="stats-history-chart">
            {dailyEntries.map(([date, v]) => (
              <div key={date} className="stats-history-col" title={`${date}: ${v.attempted}問`}>
                <div
                  className="stats-history-bar"
                  style={{ height: `${Math.max(4, (v.attempted / maxAttempted) * 64)}px` }}
                />
                <span className="stats-history-date">{date.slice(5)}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <p className="section-title">模擬試験のスコア推移</p>
      <div className="card">
        {progress.mockResults.length === 0 ? (
          <p className="stats-empty">まだ模擬試験を受けていません。</p>
        ) : (
          <ul className="stats-mock-list">
            {progress.mockResults
              .slice(-8)
              .reverse()
              .map((r) => (
                <li key={r.id}>
                  <span className="badge">{r.subject === 'A' ? '科目A' : '科目B'}</span>
                  <span className="stats-mock-score">
                    {r.correctCount}/{r.totalQuestions}
                  </span>
                  <span className="stats-mock-date">
                    {new Date(r.finishedAt).toLocaleDateString('ja-JP')}
                  </span>
                </li>
              ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function BarChart({
  categories,
  acc,
}: {
  categories: readonly string[];
  acc: Record<string, { total: number; correct: number; attempted: number }>;
}) {
  return (
    <div className="bar-chart">
      {categories.map((cat) => {
        const stat = acc[cat];
        const rate = stat && stat.attempted > 0 ? Math.round((stat.correct / stat.attempted) * 100) : 0;
        return (
          <div key={cat} className="bar-chart-row">
            <span className="bar-chart-label">{CATEGORY_LABEL[cat as keyof typeof CATEGORY_LABEL]}</span>
            <div className="bar-chart-track">
              <div className="bar-chart-fill" style={{ width: `${rate}%` }} />
            </div>
            <span className="bar-chart-value">{stat?.attempted ? `${rate}%` : '-'}</span>
          </div>
        );
      })}
    </div>
  );
}
