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

  it('B-PSE-011: 偶数の個数 count=4', () => {
    expect(finalVars('B-PSE-011').count).toBe(4);
  });
  it('B-PSE-012: 総乗 product=24', () => {
    expect(finalVars('B-PSE-012').product).toBe(24);
  });
  it('B-PSE-013: 全要素が正か allPositive=false', () => {
    expect(finalVars('B-PSE-013').allPositive).toBe(false);
  });
  it('B-PSE-014: 偶数インデックスの合計 sum=19', () => {
    expect(finalVars('B-PSE-014').sum).toBe(19);
  });
  it('B-PSE-015: 閾値より大きい要素数 count=3', () => {
    expect(finalVars('B-PSE-015').count).toBe(3);
  });
  it('B-PSE-016: 最大値と最小値の差 range=13', () => {
    expect(finalVars('B-PSE-016').range).toBe(13);
  });
  it('B-PSE-017: 成績判定 grade="B"', () => {
    expect(finalVars('B-PSE-017').grade).toBe('B');
  });
  it('B-PSE-018: 各桁の合計 sum=18', () => {
    expect(finalVars('B-PSE-018').sum).toBe(18);
  });
  it('B-PSE-019: 隣接差の最大値 maxDiff=12', () => {
    expect(finalVars('B-PSE-019').maxDiff).toBe(12);
  });
  it('B-PSE-020: 範囲内の要素数 count=4', () => {
    expect(finalVars('B-PSE-020').count).toBe(4);
  });

  it('B-ALG-011: 配列の左回転', () => {
    expect(finalVars('B-ALG-011').arr).toEqual([2, 3, 4, 5, 1]);
  });
  it('B-ALG-012: 選択ソート（降順）結果', () => {
    expect(finalVars('B-ALG-012').arr).toEqual([9, 7, 4, 3, 1]);
  });
  it('B-ALG-013: バブルソート（早期終了）結果', () => {
    expect(finalVars('B-ALG-013').arr).toEqual([1, 2, 3, 4, 5]);
  });
  it('B-ALG-014: 整列済み判定 isSorted=false', () => {
    expect(finalVars('B-ALG-014').isSorted).toBe(false);
  });
  it('B-ALG-015: 線形探索の比較回数 comparisons=5', () => {
    expect(finalVars('B-ALG-015').comparisons).toBe(5);
  });
  it('B-ALG-016: 内積 sum=32', () => {
    expect(finalVars('B-ALG-016').sum).toBe(32);
  });
  it('B-ALG-017: 最頻値 mode=2', () => {
    expect(finalVars('B-ALG-017').mode).toBe(2);
  });
  it('B-ALG-018: 二分探索の繰り返し回数 iterations=3', () => {
    expect(finalVars('B-ALG-018').iterations).toBe(3);
  });
  it('B-ALG-019: 最大連続run長 maxRun=4', () => {
    expect(finalVars('B-ALG-019').maxRun).toBe(4);
  });
  it('B-ALG-020: グループ合計の差 diff=93', () => {
    expect(finalVars('B-ALG-020').diff).toBe(93);
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
    { id: 'B-PSE-011', varName: 'count' },
    { id: 'B-PSE-012', varName: 'product' },
    { id: 'B-PSE-014', varName: 'sum' },
    { id: 'B-PSE-015', varName: 'count' },
    { id: 'B-PSE-016', varName: 'range' },
    { id: 'B-PSE-018', varName: 'sum' },
    { id: 'B-PSE-019', varName: 'maxDiff' },
    { id: 'B-PSE-020', varName: 'count' },
    { id: 'B-ALG-015', varName: 'comparisons' },
    { id: 'B-ALG-016', varName: 'sum' },
    { id: 'B-ALG-017', varName: 'mode' },
    { id: 'B-ALG-018', varName: 'iterations' },
    { id: 'B-ALG-019', varName: 'maxRun' },
    { id: 'B-ALG-020', varName: 'diff' },
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
