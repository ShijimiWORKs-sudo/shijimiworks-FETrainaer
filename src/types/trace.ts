// 擬似言語トレース実行のための型定義

export type TraceValue = number | string | boolean | (number | string)[];

export type Expr =
  | { kind: 'num'; value: number }
  | { kind: 'str'; value: string }
  | { kind: 'bool'; value: boolean }
  | { kind: 'var'; name: string }
  | { kind: 'index'; array: string; index: Expr }
  | {
      kind: 'bin';
      op: '+' | '-' | '*' | '/' | '%' | '<' | '<=' | '>' | '>=' | '==' | '!=' | 'and' | 'or';
      left: Expr;
      right: Expr;
    }
  | { kind: 'not'; expr: Expr }
  | { kind: 'len'; array: string };

export type Stmt =
  | { kind: 'assign'; line: number; target: string; index?: Expr; expr: Expr }
  | { kind: 'if'; line: number; cond: Expr; then: Stmt[]; else?: Stmt[] }
  | { kind: 'while'; line: number; cond: Expr; body: Stmt[] }
  | {
      kind: 'forTo';
      line: number;
      varName: string;
      from: Expr;
      to: Expr;
      step?: Expr;
      body: Stmt[];
    }
  | { kind: 'output'; line: number; expr: Expr };

export interface TraceProgram {
  /** 画面表示用の擬似言語ソース（行番号はこの配列のindex+1に対応） */
  sourceLines: string[];
  /** 実行開始時点の変数初期値 */
  initialVars: Record<string, TraceValue>;
  /** 実行対象のAST */
  program: Stmt[];
  /** ステップ数の上限（無限ループ対策） */
  maxSteps?: number;
}

export interface TraceStep {
  stepIndex: number;
  /** ハイライト対象の行番号（1始まり）。プログラム終了時は null */
  currentLine: number | null;
  vars: Record<string, TraceValue>;
  changedKeys: string[];
  output: string[];
  finished: boolean;
  /** このステップで何が起きたかの短い説明（UI表示用） */
  note: string;
}
