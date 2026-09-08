import type { Question } from '@/types/question';
import type { QuestionStat, UserProgress } from '@/types/progress';

function statFor(progress: UserProgress, id: string): QuestionStat | undefined {
  return progress.questionStats[id];
}

/** 問題の「優先度」を計算する。値が大きいほど優先的に出題する。 */
function priority(stat: QuestionStat | undefined): number {
  if (!stat) return 100; // 未回答は最優先
  const accuracy = stat.attempts > 0 ? stat.correctCount / stat.attempts : 0;
  const staleness = Math.min((Date.now() - stat.lastAttemptAt) / 86_400_000, 30);
  return (1 - accuracy) * 80 + staleness + (stat.flaggedForReview ? 20 : 0);
}

function shuffle<T>(arr: T[], seed = Math.random()): T[] {
  const out = [...arr];
  let s = seed * 10000;
  for (let i = out.length - 1; i > 0; i--) {
    s = (s * 9301 + 49297) % 233280;
    const j = Math.floor((s / 233280) * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/** 今日の10問: 全カテゴリから優先度重み付けでランダムに抽出する */
export function pickDailyQuestions(
  pool: Question[],
  progress: UserProgress,
  count = 10,
): Question[] {
  const weighted = pool.map((q) => ({ q, w: priority(statFor(progress, q.id)) + Math.random() * 10 }));
  weighted.sort((a, b) => b.w - a.w);
  return weighted.slice(0, count).map((x) => x.q);
}

/** 苦手問題: 正答率が低い、または誤答直後の問題を正答率の低い順に並べる */
export function pickWeakQuestions(pool: Question[], progress: UserProgress): Question[] {
  return pool
    .filter((q) => {
      const stat = statFor(progress, q.id);
      if (!stat || stat.attempts === 0) return false;
      const accuracy = stat.correctCount / stat.attempts;
      return accuracy < 0.7 || (!stat.lastCorrect && stat.attempts > 0);
    })
    .sort((a, b) => {
      const sa = statFor(progress, a.id)!;
      const sb = statFor(progress, b.id)!;
      const accA = sa.correctCount / sa.attempts;
      const accB = sb.correctCount / sb.attempts;
      return accA - accB;
    });
}

/** 復習キュー: 復習フラグが立っている、または次回復習日を過ぎている問題 */
export function pickReviewQueue(pool: Question[], progress: UserProgress): Question[] {
  const now = Date.now();
  return pool.filter((q) => {
    const stat = statFor(progress, q.id);
    if (!stat) return false;
    if (stat.flaggedForReview) return true;
    if (stat.nextReviewAt && stat.nextReviewAt <= now && !stat.lastCorrect) return true;
    return false;
  });
}

/** 模擬試験用の出題セットを作成する（本番相当の問題数、カテゴリ配分をなるべく維持） */
export function assembleMockExam(pool: Question[], totalCount: number): Question[] {
  const byCategory = new Map<string, Question[]>();
  for (const q of pool) {
    const list = byCategory.get(q.category) ?? [];
    list.push(q);
    byCategory.set(q.category, list);
  }
  const categories = [...byCategory.keys()];
  const perCategory = Math.max(1, Math.floor(totalCount / categories.length));
  let selected: Question[] = [];
  for (const cat of categories) {
    const shuffled = shuffle(byCategory.get(cat) ?? []);
    selected = selected.concat(shuffled.slice(0, perCategory));
  }
  if (selected.length < totalCount) {
    const remaining = shuffle(pool.filter((q) => !selected.includes(q)));
    selected = selected.concat(remaining.slice(0, totalCount - selected.length));
  }
  return shuffle(selected).slice(0, totalCount);
}

export function categoryAccuracy(
  pool: Question[],
  progress: UserProgress,
): Record<string, { total: number; correct: number; attempted: number }> {
  const result: Record<string, { total: number; correct: number; attempted: number }> = {};
  for (const q of pool) {
    const stat = statFor(progress, q.id);
    const bucket = result[q.category] ?? { total: 0, correct: 0, attempted: 0 };
    bucket.total++;
    if (stat && stat.attempts > 0) {
      bucket.attempted++;
      bucket.correct += stat.lastCorrect ? 1 : 0;
    }
    result[q.category] = bucket;
  }
  return result;
}
