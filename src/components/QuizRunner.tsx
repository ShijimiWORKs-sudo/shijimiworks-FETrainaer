import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { AttemptMode } from '@/types/progress';
import type { Question } from '@/types/question';
import { CATEGORY_LABEL } from '@/types/question';
import { useProgress } from '@/state/ProgressContext';
import MarkdownLite from './MarkdownLite';
import TraceVisualizer from '@/features/subjectB/TraceVisualizer';
import './QuizRunner.css';

interface Props {
  questions: Question[];
  mode: AttemptMode;
  title: string;
  onExit?: () => void;
}

interface QuizResult {
  correct: number;
  wrongQuestions: Question[];
}

export default function QuizRunner({ questions, mode, title, onExit }: Props) {
  const navigate = useNavigate();
  const { recordAttempt, toggleReviewFlag, progress } = useProgress();
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [answered, setAnswered] = useState(false);
  const [result, setResult] = useState<QuizResult>({ correct: 0, wrongQuestions: [] });
  const [finished, setFinished] = useState(false);

  const question = questions[index];
  const isFlagged = question ? Boolean(progress.questionStats[question.id]?.flaggedForReview) : false;

  const progressPercent = useMemo(
    () => Math.round(((index + (answered ? 1 : 0)) / Math.max(questions.length, 1)) * 100),
    [index, answered, questions.length],
  );

  if (questions.length === 0) {
    return (
      <div className="card">
        <p>出題できる問題がありません。</p>
        <button className="btn btn-secondary" onClick={() => navigate('/')}>
          ホームに戻る
        </button>
      </div>
    );
  }

  if (finished) {
    const total = questions.length;
    const accuracy = total > 0 ? Math.round((result.correct / total) * 100) : 0;
    return (
      <div className="card quiz-summary">
        <h2>結果</h2>
        <p className="quiz-summary-score">
          {result.correct} / {total} 問正解（正答率 {accuracy}%）
        </p>
        {result.wrongQuestions.length > 0 && (
          <>
            <p className="section-title">間違えた問題</p>
            <ul className="quiz-summary-list">
              {result.wrongQuestions.map((q) => (
                <li key={q.id}>
                  <span className="badge">{CATEGORY_LABEL[q.category]}</span> {q.title ?? q.id}
                </li>
              ))}
            </ul>
          </>
        )}
        <div className="quiz-summary-actions">
          <button className="btn btn-primary btn-block" onClick={() => (onExit ? onExit() : navigate('/'))}>
            ホームに戻る
          </button>
        </div>
      </div>
    );
  }

  function handleSelect(choiceId: string) {
    if (answered) return;
    const correct = choiceId === question.answerId;
    setSelected(choiceId);
    setAnswered(true);
    recordAttempt(question.id, correct, mode);
    setResult((r) => ({
      correct: r.correct + (correct ? 1 : 0),
      wrongQuestions: correct ? r.wrongQuestions : [...r.wrongQuestions, question],
    }));
  }

  function handleNext() {
    if (index + 1 >= questions.length) {
      setFinished(true);
      return;
    }
    setIndex((i) => i + 1);
    setSelected(null);
    setAnswered(false);
  }

  return (
    <div>
      <div className="quiz-progress-bar" aria-hidden>
        <div className="quiz-progress-fill" style={{ width: `${progressPercent}%` }} />
      </div>
      <div className="quiz-header">
        <span className="badge badge-accent">{title}</span>
        <span className="quiz-counter">
          {index + 1} / {questions.length}
        </span>
      </div>

      <div className="card quiz-question">
        <div className="quiz-question-meta">
          <span className="badge">{CATEGORY_LABEL[question.category]}</span>
          {question.title && <span className="quiz-question-title">{question.title}</span>}
          <button
            type="button"
            className={`quiz-flag-btn${isFlagged ? ' is-flagged' : ''}`}
            onClick={() => toggleReviewFlag(question.id, !isFlagged)}
            aria-pressed={isFlagged}
          >
            {isFlagged ? '★ 復習中' : '☆ 復習に追加'}
          </button>
        </div>

        <MarkdownLite text={question.body} />

        {question.trace && <TraceVisualizer key={question.id} trace={question.trace} />}

        <ul className="quiz-choices">
          {question.choices.map((choice) => {
            const isCorrect = choice.id === question.answerId;
            const isSelected = choice.id === selected;
            let stateClass = '';
            if (answered) {
              if (isCorrect) stateClass = 'is-correct';
              else if (isSelected) stateClass = 'is-wrong';
            } else if (isSelected) {
              stateClass = 'is-selected';
            }
            return (
              <li key={choice.id}>
                <button
                  type="button"
                  className={`quiz-choice ${stateClass}`}
                  onClick={() => handleSelect(choice.id)}
                  disabled={answered}
                >
                  <span className="quiz-choice-id">{choice.id}</span>
                  <span>{choice.text}</span>
                </button>
              </li>
            );
          })}
        </ul>

        {answered && (
          <div className={`quiz-feedback ${selected === question.answerId ? 'is-correct' : 'is-wrong'}`}>
            <p className="quiz-feedback-title">
              {selected === question.answerId ? '正解！' : `不正解（正解: ${question.answerId}）`}
            </p>
            <p className="quiz-feedback-body">{question.explanation}</p>
            <button type="button" className="btn btn-primary btn-block" onClick={handleNext}>
              {index + 1 >= questions.length ? '結果を見る' : '次の問題へ'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
