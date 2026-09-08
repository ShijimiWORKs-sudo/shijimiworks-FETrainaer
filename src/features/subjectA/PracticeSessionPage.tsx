import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import QuizRunner from '@/components/QuizRunner';
import { QUESTIONS_BY_CATEGORY } from '@/data/questions';
import { CATEGORY_LABEL, type Category } from '@/types/question';

function shuffle<T>(arr: T[]): T[] {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

export default function PracticeSessionPage() {
  const { category } = useParams<{ subject: string; category: string }>();
  const [count, setCount] = useState<number | null>(null);
  const cat = category as Category;
  const pool = QUESTIONS_BY_CATEGORY[cat] ?? [];

  const questions = useMemo(() => {
    if (count === null) return [];
    return shuffle(pool).slice(0, Math.min(count, pool.length));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count]);

  if (!pool.length) {
    return <p>カテゴリが見つかりません。</p>;
  }

  if (count === null) {
    return (
      <div className="card">
        <h2>{CATEGORY_LABEL[cat]}</h2>
        <p className="practice-session-desc">全{pool.length}問から出題数を選んでください。</p>
        <div className="practice-session-options">
          {[5, 10, 20].map((c) => (
            <button
              key={c}
              type="button"
              className="btn btn-secondary"
              disabled={c > pool.length}
              onClick={() => setCount(c)}
            >
              {c}問
            </button>
          ))}
        </div>
      </div>
    );
  }

  return <QuizRunner questions={questions} mode="practice" title={CATEGORY_LABEL[cat]} onExit={() => setCount(null)} />;
}
