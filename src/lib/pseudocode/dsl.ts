// トレース問題を書きやすくするための小さなビルダー関数群。
// 問題データ（src/data/questions/*）はこれらのヘルパーを使って擬似言語ASTを組み立てる。

import type { Expr, Stmt } from '@/types/trace';

export const n = (value: number): Expr => ({ kind: 'num', value });
export const str = (value: string): Expr => ({ kind: 'str', value });
export const bool = (value: boolean): Expr => ({ kind: 'bool', value });
export const v = (name: string): Expr => ({ kind: 'var', name });
export const idx = (array: string, index: Expr): Expr => ({ kind: 'index', array, index });
export const len = (array: string): Expr => ({ kind: 'len', array });
export const not = (expr: Expr): Expr => ({ kind: 'not', expr });

type BinOp = Extract<Expr, { kind: 'bin' }>['op'];
const bin =
  (op: BinOp) =>
  (left: Expr, right: Expr): Expr => ({ kind: 'bin', op, left, right });

export const add = bin('+');
export const sub = bin('-');
export const mul = bin('*');
export const div = bin('/');
export const mod = bin('%');
export const lt = bin('<');
export const lte = bin('<=');
export const gt = bin('>');
export const gte = bin('>=');
export const eq = bin('==');
export const neq = bin('!=');
export const and = bin('and');
export const or = bin('or');

export const assign = (line: number, target: string, expr: Expr): Stmt => ({
  kind: 'assign',
  line,
  target,
  expr,
});

export const assignAt = (line: number, target: string, index: Expr, expr: Expr): Stmt => ({
  kind: 'assign',
  line,
  target,
  index,
  expr,
});

export const ifStmt = (line: number, cond: Expr, then: Stmt[], elseBranch?: Stmt[]): Stmt => ({
  kind: 'if',
  line,
  cond,
  then,
  else: elseBranch,
});

export const whileStmt = (line: number, cond: Expr, body: Stmt[]): Stmt => ({
  kind: 'while',
  line,
  cond,
  body,
});

export const forTo = (
  line: number,
  varName: string,
  from: Expr,
  to: Expr,
  body: Stmt[],
  step?: Expr,
): Stmt => ({
  kind: 'forTo',
  line,
  varName,
  from,
  to,
  body,
  step,
});

export const output = (line: number, expr: Expr): Stmt => ({ kind: 'output', line, expr });
