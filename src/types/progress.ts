export type AttemptMode = 'daily' | 'practice' | 'mock' | 'weak' | 'review';

export interface AttemptRecord {
  questionId: string;
  timestamp: number;
  correct: boolean;
  mode: AttemptMode;
}

export interface QuestionStat {
  questionId: string;
  attempts: number;
  correctCount: number;
  lastAttemptAt: number;
  lastCorrect: boolean;
  flaggedForReview: boolean;
  nextReviewAt?: number;
  intervalDays?: number;
}

export interface MockExamResult {
  id: string;
  subject: 'A' | 'B';
  startedAt: number;
  finishedAt: number;
  totalQuestions: number;
  correctCount: number;
  byCategory: Record<string, { total: number; correct: number }>;
}

export interface StreakInfo {
  current: number;
  longest: number;
  lastActiveDate: string; // YYYY-MM-DD
}

export interface DailyLogEntry {
  attempted: number;
  correct: number;
}

export interface UserProgress {
  version: 1;
  attempts: AttemptRecord[];
  questionStats: Record<string, QuestionStat>;
  mockResults: MockExamResult[];
  streak: StreakInfo;
  dailyLog: Record<string, DailyLogEntry>;
}

export function createEmptyProgress(): UserProgress {
  return {
    version: 1,
    attempts: [],
    questionStats: {},
    mockResults: [],
    streak: { current: 0, longest: 0, lastActiveDate: '' },
    dailyLog: {},
  };
}
