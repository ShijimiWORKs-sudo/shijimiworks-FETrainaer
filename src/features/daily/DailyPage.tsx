import { useMemo } from 'react';
import QuizRunner from '@/components/QuizRunner';
import { useProgress } from '@/state/ProgressContext';
import { ALL_QUESTIONS } from '@/data/questions';
import { pickDailyQuestions } from '@/lib/quizSelection';

export default function DailyPage() {
  const { progress } = useProgress();
  // progress.attempts.length を依存に含め、再挑戦のたびに新しい組み合わせを引けるようにする
  const questions = useMemo(
    () => pickDailyQuestions(ALL_QUESTIONS, progress, 10),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  return <QuizRunner questions={questions} mode="daily" title="今日の10問" />;
}
