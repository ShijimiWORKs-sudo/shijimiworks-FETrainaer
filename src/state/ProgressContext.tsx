import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import type { AttemptMode, MockExamResult, UserProgress } from '@/types/progress';
import { progressRepository } from '@/data/repository';

interface ProgressContextValue {
  progress: UserProgress;
  recordAttempt: (questionId: string, correct: boolean, mode: AttemptMode) => void;
  toggleReviewFlag: (questionId: string, flagged: boolean) => void;
  recordMockResult: (result: MockExamResult) => void;
  refresh: () => void;
}

const ProgressContext = createContext<ProgressContextValue | null>(null);

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [progress, setProgress] = useState<UserProgress>(() => progressRepository.load());

  const recordAttempt = useCallback((questionId: string, correct: boolean, mode: AttemptMode) => {
    const next = progressRepository.recordAttempt(questionId, correct, mode);
    setProgress(next);
  }, []);

  const toggleReviewFlag = useCallback((questionId: string, flagged: boolean) => {
    const next = progressRepository.toggleReviewFlag(questionId, flagged);
    setProgress(next);
  }, []);

  const recordMockResult = useCallback((result: MockExamResult) => {
    const next = progressRepository.recordMockResult(result);
    setProgress(next);
  }, []);

  const refresh = useCallback(() => {
    setProgress(progressRepository.load());
  }, []);

  const value = useMemo(
    () => ({ progress, recordAttempt, toggleReviewFlag, recordMockResult, refresh }),
    [progress, recordAttempt, toggleReviewFlag, recordMockResult, refresh],
  );

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}

export function useProgress(): ProgressContextValue {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error('useProgress must be used within ProgressProvider');
  return ctx;
}
