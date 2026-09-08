import { useMemo, useState } from 'react';
import QuizRunner from '@/components/QuizRunner';
import { useProgress } from '@/state/ProgressContext';
import { ALL_QUESTIONS } from '@/data/questions';
import { pickReviewQueue } from '@/lib/quizSelection';
import { CATEGORY_LABEL } from '@/types/question';
import '../weak/WeakPage.css';

export default function ReviewPage() {
  const { progress, toggleReviewFlag } = useProgress();
  const [started, setStarted] = useState(false);
  const queue = useMemo(
    () => pickReviewQueue(ALL_QUESTIONS, progress),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  if (started) {
    return <QuizRunner questions={queue} mode="review" title="復習" onExit={() => setStarted(false)} />;
  }

  return (
    <div>
      <div className="card">
        <h2>復習</h2>
        <p className="weak-desc">
          復習フラグを付けた問題と、誤答してから間隔反復のタイミングが来た問題です（{queue.length}問）。
          解き直して正解すると次の復習までの間隔が延び、間違えると翌日に再度出題されます。
        </p>
        <button
          type="button"
          className="btn btn-primary btn-block"
          disabled={queue.length === 0}
          onClick={() => setStarted(true)}
        >
          今日の復習をはじめる
        </button>
      </div>

      {queue.length > 0 && (
        <ul className="weak-list">
          {queue.map((q) => (
            <li key={q.id} className="card weak-list-item">
              <div>
                <span className="badge">{CATEGORY_LABEL[q.category]}</span>
                <p className="weak-list-title">{q.title ?? q.id}</p>
              </div>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => toggleReviewFlag(q.id, false)}
              >
                外す
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
