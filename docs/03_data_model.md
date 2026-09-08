# データモデル・詳細設計

## 1. 問題データ (Question)

```ts
type Subject = "A" | "B";

type CategoryA = "technology" | "management" | "strategy";
type CategoryB = "pseudocode" | "algorithm" | "datastructure" | "security";
type Category = CategoryA | CategoryB;

interface Choice {
  id: string;        // "1" | "2" | "3" | "4"
  text: string;
}

interface Question {
  id: string;               // 例: "A-TECH-001"
  subject: Subject;
  category: Category;
  difficulty: 1 | 2 | 3;    // 1=易 2=標準 3=難（本試験相当）
  title?: string;           // 出題テーマの短い見出し
  body: string;             // 設問文（Markdown可、コードは```で囲む）
  choices: Choice[];        // 4択
  answerId: string;         // 正解の choice.id
  explanation: string;      // 解説
  trace?: TraceProgram;     // 擬似言語トレース対象の問題のみ
  tags?: string[];
}
```

## 2. 擬似言語トレース (TraceProgram)

ステップ実行ビジュアライザ用に、擬似言語を簡易パーサで解釈可能な中間表現として保持する。
本文表示用の擬似言語テキストと、実行エンジンが解釈するASTを両方持たせる。

```ts
interface TraceProgram {
  sourceLines: string[];      // 画面表示用（行番号付きで表示）
  initialVars: Record<string, number | string | (number | string)[]>;
  program: Stmt[];            // 実行対象AST（sourceLinesと行番号で対応付け）
}

type Expr =
  | { kind: "num"; value: number }
  | { kind: "var"; name: string }
  | { kind: "index"; array: string; index: Expr }
  | { kind: "bin"; op: "+"|"-"|"*"|"/"|"%"|"<"|"<="|">"|">="|"=="|"!="|"and"|"or"; left: Expr; right: Expr }
  | { kind: "not"; expr: Expr };

type Stmt =
  | { kind: "assign"; line: number; target: string; index?: Expr; expr: Expr }
  | { kind: "if"; line: number; cond: Expr; then: Stmt[]; else?: Stmt[] }
  | { kind: "while"; line: number; cond: Expr; body: Stmt[] }
  | { kind: "forTo"; line: number; varName: string; from: Expr; to: Expr; step?: Expr; body: Stmt[] }
  | { kind: "output"; line: number; expr: Expr };
```

実行エンジン（`src/lib/pseudocode/interpreter.ts`）は `program` をステップ単位（1文の評価完了ごと）で
実行し、以下のスナップショットを返すジェネレータとして実装する。

```ts
interface TraceStep {
  stepIndex: number;
  currentLine: number;          // ハイライト対象行
  vars: Record<string, number | string | (number | string)[]>;
  changedKeys: string[];        // 直前ステップから変化した変数名（ハイライト用）
  output: string[];             // その時点までの出力（output文がある場合）
  finished: boolean;
}
```

UIは `steps: TraceStep[]` を事前に全計算して保持し、「次のステップ／ひとつ戻る」は
配列インデックスの前後移動のみで実現する（無限ループ対策として最大ステップ数の上限を設ける）。

## 3. 学習記録データ（localStorage永続化）

```ts
interface AttemptRecord {
  questionId: string;
  timestamp: number;
  correct: boolean;
  mode: "daily" | "practice" | "mock" | "weak" | "review";
}

interface QuestionStat {
  questionId: string;
  attempts: number;
  correctCount: number;
  lastAttemptAt: number;
  lastCorrect: boolean;
  flaggedForReview: boolean;
  nextReviewAt?: number;        // 簡易間隔反復用
  intervalDays?: number;
}

interface MockExamResult {
  id: string;
  subject: Subject | "both";
  startedAt: number;
  finishedAt: number;
  totalQuestions: number;
  correctCount: number;
  byCategory: Record<string, { total: number; correct: number }>;
}

interface UserProgress {
  attempts: AttemptRecord[];         // 直近N件のみ保持（例: 2000件でローテーション）
  questionStats: Record<string, QuestionStat>;
  mockResults: MockExamResult[];
  streak: { current: number; longest: number; lastActiveDate: string };
  dailyLog: Record<string, { attempted: number; correct: number }>; // key: "YYYY-MM-DD"
}
```

### localStorageキー

- `fetrainer:progress:v1` — `UserProgress` のJSONシリアライズ
- `fetrainer:settings:v1` — 表示設定（フォントサイズ等）

スキーマバージョンをキーに含め、将来的なマイグレーションに備える。

## 4. リポジトリ層

```ts
interface ProgressRepository {
  load(): UserProgress;
  save(progress: UserProgress): void;
  recordAttempt(record: AttemptRecord): void;
  toggleReviewFlag(questionId: string, flagged: boolean): void;
}
```

`LocalStorageProgressRepository` を既定実装とし、テスト時は `InMemoryProgressRepository` に
差し替える（Vitestでの単体テスト容易化、将来のサーバ同期実装への差し替え容易化）。

## 5. ディレクトリ構成

```
src/
  app/                 # ルーティング, レイアウト, ボトムタブ
  components/          # 共通UIコンポーネント
  features/
    home/
    daily/
    subjectA/
    subjectB/
      TraceVisualizer.tsx
    mockExam/
    weak/
    review/
    stats/
  data/
    questions/
      subjectA.technology.ts
      subjectA.management.ts
      subjectA.strategy.ts
      subjectB.pseudocode.ts
      subjectB.algorithm.ts
      subjectB.datastructure.ts
      subjectB.security.ts
    repository.ts
  lib/
    pseudocode/
      interpreter.ts
      parseTrace.ts (必要な場合の補助)
    srs.ts             # 簡易間隔反復ロジック
    quizSelection.ts   # 出題選択ロジック（今日の10問・苦手優先等）
  state/
    ProgressContext.tsx
  types/
    question.ts
    trace.ts
    progress.ts
```
