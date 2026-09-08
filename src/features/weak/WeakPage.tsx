import { useMemo, useState } from 'react';
import QuizRunner from '@/components/QuizRunner';
import { useProgress } from '@/state/ProgressContext';
import { ALL_QUESTIONS } from '@/data/questions';
import { pickWeakQuestions } from '@/lib/quizSelection';
import { CATEGORY_LABEL } from '@/types/question';
import './WeakPage.css';

export default function WeakPage() {
  const { progress } = useProgress();
  const [started, setStarted] = useState(false);
  const weak = useMemo(
    () => pickWeakQuestions(ALL_QUESTIONS, progress),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  if (started) {
    return <QuizRunner questions={weak} mode="weak" title="苦手問題" onExit={() => setStarted(false)} />;
  }

  return (
    <div>
      <div className="card">
        <h2>苦手問題</h2>
        <p className="weak-desc">
          正答率が低い問題や、直近で間違えた問題を優先的に集めたリストです（{weak.length}問）。
        </p>
        <button
          type="button"
          className="btn btn-primary btn-block"
          disabled={weak.length === 0}
          onClick={() => setStarted(true)}
        >
          この問題だけ再演習する
        </button>
      </div>

      {weak.length > 0 && (
        <ul className="weak-list">
          {weak.map((q) => {
            const stat = progress.questionStats[q.id];
            const rate = stat ? Math.round((stat.correctCount / stat.attempts) * 100) : 0;
            return (
              <li key={q.id} className="card weak-list-item">
                <div>
                  <span className="badge">{CATEGORY_LABEL[q.category]}</span>
                  <p className="weak-list-title">{q.title ?? q.id}</p>
                </div>
                <span className={`badge ${rate < 40 ? 'badge-danger' : ''}`}>正答率 {rate}%</span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
