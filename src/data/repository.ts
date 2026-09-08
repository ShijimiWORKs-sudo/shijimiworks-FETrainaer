import type { AttemptMode, AttemptRecord, MockExamResult, UserProgress } from '@/types/progress';
import { createEmptyProgress } from '@/types/progress';

export interface ProgressRepository {
  load(): UserProgress;
  save(progress: UserProgress): void;
  recordAttempt(questionId: string, correct: boolean, mode: AttemptMode): UserProgress;
  toggleReviewFlag(questionId: string, flagged: boolean): UserProgress;
  recordMockResult(result: MockExamResult): UserProgress;
}

const STORAGE_KEY = 'fetrainer:progress:v1';
const MAX_ATTEMPTS_KEPT = 2000;

function todayKey(date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function dayDiff(a: string, b: string): number {
  const da = new Date(`${a}T00:00:00`);
  const db = new Date(`${b}T00:00:00`);
  return Math.round((db.getTime() - da.getTime()) / 86_400_000);
}

function updateStreak(progress: UserProgress): void {
  const today = todayKey();
  if (progress.streak.lastActiveDate === today) return; // 本日すでに記録済み
  if (progress.streak.lastActiveDate === '') {
    progress.streak.current = 1;
  } else {
    const diff = dayDiff(progress.streak.lastActiveDate, today);
    progress.streak.current = diff === 1 ? progress.streak.current + 1 : 1;
  }
  progress.streak.longest = Math.max(progress.streak.longest, progress.streak.current);
  progress.streak.lastActiveDate = today;
}

/** 簡易間隔反復: 正解なら間隔を伸ばす、誤答なら翌日に戻す */
function nextInterval(prevDays: number | undefined, correct: boolean): number {
  if (!correct) return 1;
  if (!prevDays) return 1;
  if (prevDays < 1) return 1;
  if (prevDays < 3) return 3;
  if (prevDays < 7) return 7;
  if (prevDays < 14) return 14;
  return Math.min(prevDays * 2, 60);
}

export function applyAttempt(
  progress: UserProgress,
  questionId: string,
  correct: boolean,
  mode: AttemptMode,
): UserProgress {
  const next: UserProgress = {
    ...progress,
    attempts: [...progress.attempts],
    questionStats: { ...progress.questionStats },
    dailyLog: { ...progress.dailyLog },
    streak: { ...progress.streak },
  };

  const record: AttemptRecord = { questionId, timestamp: Date.now(), correct, mode };
  next.attempts.push(record);
  if (next.attempts.length > MAX_ATTEMPTS_KEPT) {
    next.attempts.splice(0, next.attempts.length - MAX_ATTEMPTS_KEPT);
  }

  const prevStat = next.questionStats[questionId];
  const intervalDays = nextInterval(prevStat?.intervalDays, correct);
  next.questionStats[questionId] = {
    questionId,
    attempts: (prevStat?.attempts ?? 0) + 1,
    correctCount: (prevStat?.correctCount ?? 0) + (correct ? 1 : 0),
    lastAttemptAt: record.timestamp,
    lastCorrect: correct,
    flaggedForReview: prevStat?.flaggedForReview ?? false,
    intervalDays,
    nextReviewAt: Date.now() + intervalDays * 86_400_000,
  };

  const today = todayKey();
  const log = next.dailyLog[today] ?? { attempted: 0, correct: 0 };
  next.dailyLog[today] = {
    attempted: log.attempted + 1,
    correct: log.correct + (correct ? 1 : 0),
  };

  updateStreak(next);
  return next;
}

export function applyToggleReviewFlag(
  progress: UserProgress,
  questionId: string,
  flagged: boolean,
): UserProgress {
  const prevStat = progress.questionStats[questionId];
  const stat = prevStat ?? {
    questionId,
    attempts: 0,
    correctCount: 0,
    lastAttemptAt: 0,
    lastCorrect: false,
    flaggedForReview: false,
  };
  return {
    ...progress,
    questionStats: {
      ...progress.questionStats,
      [questionId]: { ...stat, flaggedForReview: flagged },
    },
  };
}

export function applyMockResult(progress: UserProgress, result: MockExamResult): UserProgress {
  const MAX_MOCK_RESULTS_KEPT = 100;
  const mockResults = [...progress.mockResults, result];
  if (mockResults.length > MAX_MOCK_RESULTS_KEPT) {
    mockResults.splice(0, mockResults.length - MAX_MOCK_RESULTS_KEPT);
  }
  return { ...progress, mockResults };
}

export class LocalStorageProgressRepository implements ProgressRepository {
  load(): UserProgress {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return createEmptyProgress();
      const parsed = JSON.parse(raw) as UserProgress;
      if (parsed.version !== 1) return createEmptyProgress();
      return parsed;
    } catch {
      return createEmptyProgress();
    }
  }

  save(progress: UserProgress): void {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch {
      // 保存に失敗しても致命的ではないため無視する（プライベートブラウズ等）
    }
  }

  recordAttempt(questionId: string, correct: boolean, mode: AttemptMode): UserProgress {
    const next = applyAttempt(this.load(), questionId, correct, mode);
    this.save(next);
    return next;
  }

  toggleReviewFlag(questionId: string, flagged: boolean): UserProgress {
    const next = applyToggleReviewFlag(this.load(), questionId, flagged);
    this.save(next);
    return next;
  }

  recordMockResult(result: MockExamResult): UserProgress {
    const next = applyMockResult(this.load(), result);
    this.save(next);
    return next;
  }
}

export class InMemoryProgressRepository implements ProgressRepository {
  private progress: UserProgress = createEmptyProgress();

  load(): UserProgress {
    return this.progress;
  }

  save(progress: UserProgress): void {
    this.progress = progress;
  }

  recordAttempt(questionId: string, correct: boolean, mode: AttemptMode): UserProgress {
    this.progress = applyAttempt(this.progress, questionId, correct, mode);
    return this.progress;
  }

  toggleReviewFlag(questionId: string, flagged: boolean): UserProgress {
    this.progress = applyToggleReviewFlag(this.progress, questionId, flagged);
    return this.progress;
  }

  recordMockResult(result: MockExamResult): UserProgress {
    this.progress = applyMockResult(this.progress, result);
    return this.progress;
  }
}

export const progressRepository: ProgressRepository = new LocalStorageProgressRepository();
export { todayKey };
