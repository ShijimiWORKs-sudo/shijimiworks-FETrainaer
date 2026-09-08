import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getQuestionsBySubject } from '@/data/questions';
import { assembleMockExam } from '@/lib/quizSelection';
import { useProgress } from '@/state/ProgressContext';
import type { MockExamResult } from '@/types/progress';
import { CATEGORY_LABEL } from '@/types/question';
import MarkdownLite from '@/components/MarkdownLite';
import TraceVisualizer from '@/features/subjectB/TraceVisualizer';
import './MockExamSessionPage.css';

const CONFIG = {
  A: { durationSec: 90 * 60, count: 60, label: '科目A' },
  B: { durationSec: 100 * 60, count: 20, label: '科目B' },
} as const;

function formatTime(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export default function MockExamSessionPage() {
  const { subject } = useParams<{ subject: 'A' | 'B' }>();
  const navigate = useNavigate();
  const { recordAttempt, recordMockResult } = useProgress();
  const cfg = CONFIG[subject === 'B' ? 'B' : 'A'];

  const questions = useMemo(() => {
    const pool = getQuestionsBySubject(subject === 'B' ? 'B' : 'A');
    return assembleMockExam(pool, Math.min(cfg.count, pool.length));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subject]);

  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [index, setIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(cfg.durationSec);
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState<MockExamResult | null>(null);
  const submittedRef = useRef(false);

  useEffect(() => {
    if (submittedRef.current) return;
    const timer = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timer);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (timeLeft === 0 && !submittedRef.current) {
      handleSubmit();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft]);

  function handleSubmit() {
    if (submittedRef.current) return;
    submittedRef.current = true;
    const byCategory: MockExamResult['byCategory'] = {};
    let correctCount = 0;
    questions.forEach((q, i) => {
      const chosen = answers[i];
      const correct = chosen === q.answerId;
      if (correct) correctCount++;
      const bucket = byCategory[q.category] ?? { total: 0, correct: 0 };
      bucket.total++;
      if (correct) bucket.correct++;
      byCategory[q.category] = bucket;
      recordAttempt(q.id, correct, 'mock');
    });
    const mockResult: MockExamResult = {
      id: `mock-${Date.now()}`,
      subject: subject === 'B' ? 'B' : 'A',
      startedAt: Date.now() - (cfg.durationSec - timeLeft) * 1000,
      finishedAt: Date.now(),
      totalQuestions: questions.length,
      correctCount,
      byCategory,
    };
    recordMockResult(mockResult);
    setResult(mockResult);
    setSubmitted(true);
  }

  if (questions.length === 0) {
    return <p>出題できる問題がありません。</p>;
  }

  if (submitted && result) {
    return (
      <div className="card mock-result">
        <h2>{cfg.label} 模擬試験 結果</h2>
        <p className="mock-result-score">
          {result.correctCount} / {result.totalQuestions}（
          {Math.round((result.correctCount / result.totalQuestions) * 100)}%）
        </p>
        <table className="mock-result-table">
          <thead>
            <tr>
              <th>分野</th>
              <th>正答数</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(result.byCategory).map(([cat, v]) => (
              <tr key={cat}>
                <td>{CATEGORY_LABEL[cat as keyof typeof CATEGORY_LABEL]}</td>
                <td>
                  {v.correct} / {v.total}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button type="button" className="btn btn-primary btn-block" onClick={() => navigate('/mock-exam')}>
          模試トップに戻る
        </button>
      </div>
    );
  }

  const q = questions[index];
  const dangerTime = timeLeft < 300;

  return (
    <div className="mock-session">
      <div className={`mock-timer ${dangerTime ? 'is-danger' : ''}`}>
        <span>{cfg.label} 模擬試験</span>
        <span className="mock-timer-clock">残り {formatTime(timeLeft)}</span>
      </div>

      <div className="mock-palette" aria-label="設問一覧">
        {questions.map((_, i) => (
          <button
            key={i}
            type="button"
            className={`mock-palette-btn${i === index ? ' is-current' : ''}${
              answers[i] ? ' is-answered' : ''
            }`}
            onClick={() => setIndex(i)}
          >
            {i + 1}
          </button>
        ))}
      </div>

      <div className="card">
        <p className="badge">{CATEGORY_LABEL[q.category]}</p>
        <p className="mock-question-index">
          問{index + 1} / {questions.length}
        </p>
        <MarkdownLite text={q.body} />
        {q.trace && <TraceVisualizer key={q.id} trace={q.trace} />}
        <ul className="quiz-choices">
          {q.choices.map((choice) => (
            <li key={choice.id}>
              <button
                type="button"
                className={`quiz-choice${answers[index] === choice.id ? ' is-selected' : ''}`}
                onClick={() => setAnswers((a) => ({ ...a, [index]: choice.id }))}
              >
                <span className="quiz-choice-id">{choice.id}</span>
                <span>{choice.text}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="mock-nav">
        <button
          type="button"
          className="btn btn-secondary"
          disabled={index === 0}
          onClick={() => setIndex((i) => i - 1)}
        >
          ← 前へ
        </button>
        <button
          type="button"
          className="btn btn-secondary"
          disabled={index === questions.length - 1}
          onClick={() => setIndex((i) => i + 1)}
        >
          次へ →
        </button>
      </div>

      <button type="button" className="btn btn-primary btn-block mock-submit" onClick={handleSubmit}>
        採点する（試験を終了）
      </button>
    </div>
  );
}
