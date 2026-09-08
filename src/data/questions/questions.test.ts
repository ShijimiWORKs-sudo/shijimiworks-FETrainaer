import { describe, expect, it } from 'vitest';
import { ALL_QUESTIONS } from './index';
import { runTrace } from '@/lib/pseudocode/interpreter';

describe('問題データの整合性', () => {
  it('全問題のIDが一意である', () => {
    const ids = ALL_QUESTIONS.map((q) => q.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('全問題が4択で、正解IDが選択肢の中に存在する', () => {
    for (const q of ALL_QUESTIONS) {
      expect(q.choices.length, `${q.id}: 選択肢数`).toBe(4);
      const choiceIds = q.choices.map((c) => c.id);
      expect(new Set(choiceIds).size, `${q.id}: 選択肢IDの重複なし`).toBe(4);
      expect(choiceIds, `${q.id}: 正解IDが選択肢に含まれる`).toContain(q.answerId);
    }
  });

  it('本文・解説が空でない', () => {
    for (const q of ALL_QUESTIONS) {
      expect(q.body.trim().length, `${q.id}: 本文`).toBeGreaterThan(0);
      expect(q.explanation.trim().length, `${q.id}: 解説`).toBeGreaterThan(0);
    }
  });

  it('トレース付き問題は例外を投げず、上限に達せず正常終了する', () => {
    const traceQuestions = ALL_QUESTIONS.filter((q) => q.trace);
    expect(traceQuestions.length).toBeGreaterThan(0);
    for (const q of traceQuestions) {
      const steps = runTrace(q.trace!);
      const last = steps[steps.length - 1];
      expect(last.finished, `${q.id}: 実行が正常終了する`).toBe(true);
      expect(last.note, `${q.id}: ステップ上限に達していない`).not.toMatch(/上限/);
      expect(steps.length, `${q.id}: 最低限のステップ数がある`).toBeGreaterThan(1);
    }
  });

  it('カテゴリごとに最低10問は存在する', () => {
    const byCategory = new Map<string, number>();
    for (const q of ALL_QUESTIONS) {
      byCategory.set(q.category, (byCategory.get(q.category) ?? 0) + 1);
    }
    for (const [category, count] of byCategory) {
      expect(count, `カテゴリ ${category} の問題数`).toBeGreaterThanOrEqual(10);
    }
  });
});
