import type { Expr, Stmt, TraceProgram, TraceStep, TraceValue } from '@/types/trace';

/**
 * 擬似言語トレース実行エンジン。
 *
 * 設計方針（IPA基本情報のトレース表に合わせた粒度）:
 * - ループ(while / forTo)の外側にある代入・出力文は「1文 = 1ステップ」で記録する。
 * - ループの中身は1回のループ本体をまとめて実行し、「1回の反復 = 1ステップ」として
 *   反復後の状態（ループ変数の更新後の値を含む）を記録する。
 *   これは基本情報技術者試験のトレース表（1行 = 1回のループ）の慣習に合わせたもの。
 * - if文はステップの粒度に対して透過的（ifで分岐した先の文がそのままの粒度で記録される）。
 *
 * 無限ループ対策として maxSteps を超えたら強制終了する。
 */

export const DEFAULT_MAX_STEPS = 500;

class TraceLimitError extends Error {}

export function runTrace(program: TraceProgram): TraceStep[] {
  const maxSteps = program.maxSteps ?? DEFAULT_MAX_STEPS;
  const vars: Record<string, TraceValue> = cloneVars(program.initialVars);
  const output: string[] = [];
  const steps: TraceStep[] = [];
  let prevSnapshot: Record<string, TraceValue> = cloneVars(program.initialVars);

  // ステップ0: 初期状態
  steps.push({
    stepIndex: 0,
    currentLine: null,
    vars: cloneVars(vars),
    changedKeys: [],
    output: [],
    finished: false,
    note: '初期状態',
  });

  function snapshot(line: number, note: string) {
    if (steps.length > maxSteps) {
      throw new TraceLimitError('ステップ数の上限に達しました（無限ループの可能性があります）');
    }
    const changedKeys = diffKeys(prevSnapshot, vars);
    steps.push({
      stepIndex: steps.length,
      currentLine: line,
      vars: cloneVars(vars),
      changedKeys,
      output: [...output],
      finished: false,
      note,
    });
    prevSnapshot = cloneVars(vars);
  }

  function evalExpr(e: Expr): TraceValue {
    switch (e.kind) {
      case 'num':
        return e.value;
      case 'str':
        return e.value;
      case 'bool':
        return e.value;
      case 'var': {
        if (!(e.name in vars)) throw new Error(`未定義の変数です: ${e.name}`);
        return vars[e.name];
      }
      case 'index': {
        const arr = vars[e.array];
        if (!Array.isArray(arr)) throw new Error(`配列ではありません: ${e.array}`);
        const idx = Number(evalExpr(e.index));
        if (idx < 0 || idx >= arr.length) {
          throw new Error(`配列の範囲外アクセスです: ${e.array}[${idx}]`);
        }
        return arr[idx];
      }
      case 'len': {
        const arr = vars[e.array];
        if (!Array.isArray(arr)) throw new Error(`配列ではありません: ${e.array}`);
        return arr.length;
      }
      case 'not':
        return !evalExpr(e.expr);
      case 'bin': {
        // and/or は短絡評価する（例: j >= 0 and arr[j] > key で j=-1 のとき arr[-1] を評価しない）
        if (e.op === 'and') {
          const l = evalExpr(e.left);
          if (!l) return false;
          return Boolean(evalExpr(e.right));
        }
        if (e.op === 'or') {
          const l = evalExpr(e.left);
          if (l) return true;
          return Boolean(evalExpr(e.right));
        }
        const l = evalExpr(e.left);
        const r = evalExpr(e.right);
        return evalBin(e.op, l, r);
      }
    }
  }

  function assignTo(target: string, index: Expr | undefined, value: TraceValue) {
    if (index) {
      const arr = vars[target];
      if (!Array.isArray(arr)) throw new Error(`配列ではありません: ${target}`);
      const idx = Number(evalExpr(index));
      if (idx < 0 || idx >= arr.length) {
        throw new Error(`配列の範囲外アクセスです: ${target}[${idx}]`);
      }
      const next = [...arr];
      next[idx] = value as number | string;
      vars[target] = next;
    } else {
      vars[target] = value;
    }
  }

  function describeAssign(s: Extract<Stmt, { kind: 'assign' }>, value: TraceValue): string {
    const label = s.index ? `${s.target}[${formatValue(evalIndexSafely(s.index))}]` : s.target;
    return `${label} ← ${formatValue(value)}`;
  }

  function evalIndexSafely(index: Expr): TraceValue {
    try {
      return evalExpr(index);
    } catch {
      return '?';
    }
  }

  // ループ内部を「静かに」（ステップを刻まずに）実行する
  function execSilently(stmts: Stmt[]) {
    for (const s of stmts) {
      execOneSilently(s);
    }
  }

  function execOneSilently(s: Stmt) {
    switch (s.kind) {
      case 'assign': {
        const value = evalExpr(s.expr);
        assignTo(s.target, s.index, value);
        return;
      }
      case 'output': {
        output.push(formatValue(evalExpr(s.expr)));
        return;
      }
      case 'if': {
        const branch = evalExpr(s.cond) ? s.then : s.else ?? [];
        execSilently(branch);
        return;
      }
      case 'while': {
        let guard = 0;
        while (evalExpr(s.cond)) {
          execSilently(s.body);
          guard++;
          if (guard > maxSteps) throw new TraceLimitError('ステップ数の上限に達しました');
        }
        return;
      }
      case 'forTo': {
        runForLoop(s, () => {});
        return;
      }
    }
  }

  function runForLoop(s: Extract<Stmt, { kind: 'forTo' }>, onIteration: (line: number) => void) {
    const from = Number(evalExpr(s.from));
    const to = Number(evalExpr(s.to));
    const step = s.step ? Number(evalExpr(s.step)) : 1;
    if (step === 0) throw new Error('forループの増分に0は指定できません');
    let cur = from;
    const ascending = step > 0;
    while (ascending ? cur <= to : cur >= to) {
      vars[s.varName] = cur;
      execSilently(s.body);
      cur += step;
      vars[s.varName] = cur;
      onIteration(s.line);
    }
  }

  // トップレベル（ループの外）は文ごとにステップを刻む。ifは透過的。
  function execTopLevel(stmts: Stmt[]) {
    for (const s of stmts) {
      switch (s.kind) {
        case 'assign': {
          const value = evalExpr(s.expr);
          const note = describeAssign(s, value);
          assignTo(s.target, s.index, value);
          snapshot(s.line, note);
          break;
        }
        case 'output': {
          const value = evalExpr(s.expr);
          output.push(formatValue(value));
          snapshot(s.line, `出力: ${formatValue(value)}`);
          break;
        }
        case 'if': {
          const branch = evalExpr(s.cond) ? s.then : s.else ?? [];
          execTopLevel(branch);
          break;
        }
        case 'while': {
          let guard = 0;
          while (evalExpr(s.cond)) {
            execSilently(s.body);
            snapshot(s.line, `while反復 (${guard + 1}回目) 終了時点`);
            guard++;
            if (guard > maxSteps) throw new TraceLimitError('ステップ数の上限に達しました');
          }
          break;
        }
        case 'forTo': {
          let iteration = 0;
          runForLoop(s, (line) => {
            iteration++;
            snapshot(line, `forループ (${iteration}回目) 終了時点`);
          });
          break;
        }
      }
    }
  }

  try {
    execTopLevel(program.program);
  } catch (err) {
    if (err instanceof TraceLimitError) {
      steps.push({
        stepIndex: steps.length,
        currentLine: null,
        vars: cloneVars(vars),
        changedKeys: [],
        output: [...output],
        finished: true,
        note: `⚠ ${err.message}`,
      });
      return steps;
    }
    throw err;
  }

  steps.push({
    stepIndex: steps.length,
    currentLine: null,
    vars: cloneVars(vars),
    changedKeys: [],
    output: [...output],
    finished: true,
    note: '実行終了',
  });

  return steps;
}

function evalBin(op: string, l: TraceValue, r: TraceValue): TraceValue {
  switch (op) {
    case '+':
      if (typeof l === 'string' || typeof r === 'string') return String(l) + String(r);
      return Number(l) + Number(r);
    case '-':
      return Number(l) - Number(r);
    case '*':
      return Number(l) * Number(r);
    case '/':
      return Math.trunc(Number(l) / Number(r));
    case '%':
      return Number(l) % Number(r);
    case '<':
      return Number(l) < Number(r);
    case '<=':
      return Number(l) <= Number(r);
    case '>':
      return Number(l) > Number(r);
    case '>=':
      return Number(l) >= Number(r);
    case '==':
      return l === r;
    case '!=':
      return l !== r;
    case 'and':
      return Boolean(l) && Boolean(r);
    case 'or':
      return Boolean(l) || Boolean(r);
    default:
      throw new Error(`未対応の演算子です: ${op}`);
  }
}

function cloneVars(vars: Record<string, TraceValue>): Record<string, TraceValue> {
  const out: Record<string, TraceValue> = {};
  for (const [k, v] of Object.entries(vars)) {
    out[k] = Array.isArray(v) ? [...v] : v;
  }
  return out;
}

function diffKeys(prev: Record<string, TraceValue>, next: Record<string, TraceValue>): string[] {
  const keys = new Set<string>([...Object.keys(prev), ...Object.keys(next)]);
  const changed: string[] = [];
  for (const k of keys) {
    if (!valueEquals(prev[k], next[k])) changed.push(k);
  }
  return changed;
}

function valueEquals(a: TraceValue | undefined, b: TraceValue | undefined): boolean {
  if (Array.isArray(a) && Array.isArray(b)) {
    return a.length === b.length && a.every((v, i) => v === b[i]);
  }
  return a === b;
}

export function formatValue(v: TraceValue): string {
  if (Array.isArray(v)) return `[${v.join(', ')}]`;
  if (typeof v === 'boolean') return v ? '真' : '偽';
  return String(v);
}
