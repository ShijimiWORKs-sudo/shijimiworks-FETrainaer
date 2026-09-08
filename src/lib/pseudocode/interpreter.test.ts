import { describe, expect, it } from 'vitest';
import { runTrace } from './interpreter';
import { add, assign, assignAt, forTo, idx, ifStmt, lt, n, output, v, whileStmt } from './dsl';
import type { TraceProgram } from '@/types/trace';

describe('runTrace', () => {
  it('配列の合計を求めるforループをユーザー提示例の通りにトレースする', () => {
    // 配列 [2, 4, 8, 16] の合計を求める
    // i ← 0
    // sum ← 0
    // for i を 0 から 3 まで 1 ずつ増やす
    //   sum ← sum + arr[i]
    const program: TraceProgram = {
      sourceLines: [
        'i ← 0',
        'sum ← 0',
        'for i を 0 から 3 まで 1 ずつ増やす',
        '  sum ← sum + arr[i]',
      ],
      initialVars: { arr: [2, 4, 8, 16] },
      program: [
        assign(1, 'i', n(0)),
        assign(2, 'sum', n(0)),
        forTo(3, 'i', n(0), n(3), [assign(4, 'sum', add(v('sum'), idx('arr', v('i'))))]),
      ],
    };

    const steps = runTrace(program);

    // ステップ0: 初期状態
    expect(steps[0].vars.sum).toBeUndefined();

    // i←0, sum←0 の2ステップ
    expect(steps[1].vars).toMatchObject({ i: 0 });
    expect(steps[2].vars).toMatchObject({ i: 0, sum: 0 });

    // ループ1回目: sum = 0 + arr[0](=2) = 2, iは1に更新
    expect(steps[3].vars).toMatchObject({ i: 1, sum: 2 });
    expect(steps[3].changedKeys.sort()).toEqual(['i', 'sum']);

    // ループ2回目: sum = 2 + arr[1](=4) = 6, iは2に更新
    expect(steps[4].vars).toMatchObject({ i: 2, sum: 6 });

    // ループ3回目: sum = 6 + arr[2](=8) = 14, iは3に更新
    expect(steps[5].vars).toMatchObject({ i: 3, sum: 14 });

    // ループ4回目: sum = 14 + arr[3](=16) = 30, iは4に更新（終了条件）
    expect(steps[6].vars).toMatchObject({ i: 4, sum: 30 });

    const last = steps[steps.length - 1];
    expect(last.finished).toBe(true);
    expect(last.vars.sum).toBe(30);
  });

  it('while文でも1反復ごとに1ステップとして記録する', () => {
    const program: TraceProgram = {
      sourceLines: ['i ← 0', 'while i < 3', '  i ← i + 1'],
      initialVars: {},
      program: [assign(1, 'i', n(0)), whileStmt(2, lt(v('i'), n(3)), [assign(3, 'i', add(v('i'), n(1)))])],
    };
    const steps = runTrace(program);
    const finalVarsStep = steps.find((s) => s.vars.i === 3);
    expect(finalVarsStep).toBeDefined();
    expect(steps[steps.length - 1].finished).toBe(true);
  });

  it('if文はステップ粒度に対して透過的に動作する', () => {
    const program: TraceProgram = {
      sourceLines: ['x ← 5', 'if x > 3', '  y ← 1', 'else', '  y ← 0'],
      initialVars: {},
      program: [
        assign(1, 'x', n(5)),
        ifStmt(2, lt(n(3), v('x')), [assign(3, 'y', n(1))], [assign(5, 'y', n(0))]),
      ],
    };
    const steps = runTrace(program);
    expect(steps[steps.length - 2].vars).toMatchObject({ x: 5, y: 1 });
  });

  it('配列への代入と出力を扱える', () => {
    const program: TraceProgram = {
      sourceLines: ['arr[0] ← 99', 'output arr[0]'],
      initialVars: { arr: [1, 2, 3] },
      program: [assignAt(1, 'arr', n(0), n(99)), output(2, idx('arr', n(0)))],
    };
    const steps = runTrace(program);
    const last = steps[steps.length - 1];
    expect(last.vars.arr).toEqual([99, 2, 3]);
    expect(last.output).toEqual(['99']);
  });

  it('無限ループはステップ上限で強制終了する', () => {
    const program: TraceProgram = {
      sourceLines: ['while 真', '  x ← 1'],
      initialVars: { x: 0 },
      program: [whileStmt(1, { kind: 'bool', value: true }, [assign(2, 'x', n(1))])],
      maxSteps: 20,
    };
    const steps = runTrace(program);
    const last = steps[steps.length - 1];
    expect(last.finished).toBe(true);
    expect(last.note).toMatch(/上限/);
  });
});
