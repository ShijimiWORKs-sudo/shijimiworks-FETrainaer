import { describe, expect, it } from 'vitest';
import { runTrace } from '@/lib/pseudocode/interpreter';
import { pseudocodeQuestions } from './subjectB.pseudocode';
import { algorithmQuestions } from './subjectB.algorithm';

// 正解の選択肢テキストと、実際にトレース実行した結果が一致するかを機械的に検証する。
// これにより「手計算で作った正解」と「インタプリタの実行結果」の食い違い（作問ミス）を検出する。

function finalVars(id: string) {
  const q = [...pseudocodeQuestions, ...algorithmQuestions].find((x) => x.id === id);
  if (!q || !q.trace) throw new Error(`question not found or no trace: ${id}`);
  const steps = runTrace(q.trace);
  return steps[steps.length - 1].vars;
}

describe('トレース問題の正解検証', () => {
  it('B-PSE-001: 配列の合計値 sum=18', () => {
    expect(finalVars('B-PSE-001').sum).toBe(18);
  });
  it('B-PSE-002: 配列の最大値 max=9', () => {
    expect(finalVars('B-PSE-002').max).toBe(9);
  });
  it('B-PSE-003: 出現回数 count=4', () => {
    expect(finalVars('B-PSE-003').count).toBe(4);
  });
  it('B-PSE-004: 配列の反転', () => {
    expect(finalVars('B-PSE-004').arr).toEqual([5, 4, 3, 2, 1]);
  });
  it('B-PSE-005: 平均値 avg=25', () => {
    expect(finalVars('B-PSE-005').avg).toBe(25);
  });
  it('B-PSE-006: 線形探索 found=3', () => {
    expect(finalVars('B-PSE-006').found).toBe(3);
  });
  it('B-PSE-007: フィボナッチ b=13', () => {
    expect(finalVars('B-PSE-007').b).toBe(13);
  });
  it('B-PSE-008: 階乗 result=120', () => {
    expect(finalVars('B-PSE-008').result).toBe(120);
  });
  it('B-PSE-009: 最小値のインデックス minIdx=3', () => {
    expect(finalVars('B-PSE-009').minIdx).toBe(3);
  });
  it('B-PSE-010: 文字の出現回数 count=3', () => {
    expect(finalVars('B-PSE-010').count).toBe(3);
  });

  it('B-ALG-001: 選択ソート結果', () => {
    expect(finalVars('B-ALG-001').arr).toEqual([1, 2, 3, 4, 5]);
  });
  it('B-ALG-002: バブルソート結果', () => {
    expect(finalVars('B-ALG-002').arr).toEqual([1, 2, 4, 5, 8]);
  });
  it('B-ALG-003: 二分探索 found=4', () => {
    expect(finalVars('B-ALG-003').found).toBe(4);
  });
  it('B-ALG-004: 挿入ソート結果', () => {
    expect(finalVars('B-ALG-004').arr).toEqual([1, 2, 3, 4, 5]);
  });
  it('B-ALG-005: ユークリッドの互除法 a=6', () => {
    expect(finalVars('B-ALG-005').a).toBe(6);
  });
  it('B-ALG-006: 素数判定 isPrime=false', () => {
    expect(finalVars('B-ALG-006').isPrime).toBe(false);
  });
  it('B-ALG-007: スタックPUSH/POP top=0', () => {
    expect(finalVars('B-ALG-007').top).toBe(0);
  });
  it('B-ALG-008: キューENQUEUE/DEQUEUE remaining=1', () => {
    expect(finalVars('B-ALG-008').remaining).toBe(1);
  });
  it('B-ALG-009: べき乗 result=81', () => {
    expect(finalVars('B-ALG-009').result).toBe(81);
  });
  it('B-ALG-010: 2番目に大きい値 second=7', () => {
    expect(finalVars('B-ALG-010').second).toBe(7);
  });
});

describe('正解選択肢のテキストとトレース結果の整合性（数値問題のみ抽出検証）', () => {
  const checks: Array<{ id: string; varName: string }> = [
    { id: 'B-PSE-001', varName: 'sum' },
    { id: 'B-PSE-002', varName: 'max' },
    { id: 'B-PSE-003', varName: 'count' },
    { id: 'B-PSE-005', varName: 'avg' },
    { id: 'B-PSE-006', varName: 'found' },
    { id: 'B-PSE-007', varName: 'b' },
    { id: 'B-PSE-008', varName: 'result' },
    { id: 'B-PSE-009', varName: 'minIdx' },
    { id: 'B-PSE-010', varName: 'count' },
    { id: 'B-ALG-003', varName: 'found' },
    { id: 'B-ALG-005', varName: 'a' },
    { id: 'B-ALG-007', varName: 'top' },
    { id: 'B-ALG-008', varName: 'remaining' },
    { id: 'B-ALG-009', varName: 'result' },
    { id: 'B-ALG-010', varName: 'second' },
  ];

  for (const { id, varName } of checks) {
    it(`${id}: 正解選択肢の数値が実行結果(${varName})と一致する`, () => {
      const q = [...pseudocodeQuestions, ...algorithmQuestions].find((x) => x.id === id)!;
      const correctChoice = q.choices.find((c) => c.id === q.answerId)!;
      const expectedNum = Number(correctChoice.text.match(/-?\d+/)?.[0]);
      expect(Number.isNaN(expectedNum), `${id}: 選択肢から数値を抽出できる`).toBe(false);
      expect(finalVars(id)[varName]).toBe(expectedNum);
    });
  }
});
