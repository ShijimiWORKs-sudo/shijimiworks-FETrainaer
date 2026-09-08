---
name: fe-trainer-autonomous-dev
description: 基本情報技術者Trainerアプリの自律開発（要件定義〜実装〜テスト〜検証）を止めずに進めるための手順
---

# FE Trainer 自律開発スキル

このスキルは、`shijimiworks-FETrainaer`（基本情報技術者 Trainer）リポジトリで、要件定義から
実装・テスト・検証までを一気通貫で進めるためのチェックリストです。
[ProgrammingTrainer](https://github.com/ShijimiWORKs-sudo/shijimiworks-programmingtrainer)の
`.codex/skills/programming-trainer-autonomous-dev/`に相当するものです。

## 起動条件

- ユーザーが「FE Trainer」「基本情報技術者Trainer」の機能追加・修正・問題追加を依頼したとき
- `docs/`配下の要件定義・設計ドキュメントを更新しながら開発を進めたいとき

## 手順

### 1. 現状把握

- `docs/01_requirements.md`（要件定義）、`docs/02_screen_design.md`（画面設計）、
  `docs/03_data_model.md`（データモデル）を読み、既存の設計方針と矛盾しない変更か確認する。
- `AGENTS.md`の「開発の原則」「既知の落とし穴」に目を通す。
- `npx vitest run`と`npx oxlint`を実行し、着手前の状態がグリーンであることを確認する。

### 2. 設計 → 実装

- 新機能・新画面を追加する場合は、`docs/02_screen_design.md`に画面遷移とURLルーティングを
  追記してから`src/app/App.tsx`にルートを追加する。
- 新しいデータ構造が必要な場合は`docs/03_data_model.md`を更新してから
  `src/types/`に型定義を追加する。
- 問題データを追加する場合は、AGENTS.mdの「問題データを追加する際の手順」に従う
  （特にトレース問題は必ず`trace-answers.test.ts`で実行結果と正解の一致を機械検証する）。

### 3. テスト

止めるべきでない自動チェックの最小セット：

```bash
npx vitest run       # 単体テスト（インタプリタ・問題データ整合性）
npm run build          # 型チェック + 本番ビルド
npx playwright test    # E2E（要ビルド済みdist、iPhoneビューポート）
npx oxlint              # Lint（エラーゼロを維持）
```

Playwrightがヘッドレスブラウザの実行ファイルを見つけられない場合は、
`playwright.config.ts`の`findChromiumExecutable()`のフォールバックパスを確認し、
必要なら`PLAYWRIGHT_CHROMIUM_EXECUTABLE`環境変数を設定する。

### 4. アプリ上での簡易テスト（手動確認に相当する自動チェック）

Playwrightの`tests/e2e/`配下に、以下の主要導線を最低限カバーするテストを維持する：

- ボトムナビの全タブ遷移
- 科目Bカテゴリでのトレースビジュアライザ操作（次のステップ／最初から）
- 今日の10問を最後まで解いて結果画面に到達する
- 模擬試験を開始し、採点して結果を確認する
- 苦手問題・復習・成績ページの表示

新機能を追加したら、対応するe2eテストをこのディレクトリに追加する。

### 5. 完了の判断

`docs/01_requirements.md`の「成功基準（Definition of Done）」を満たしているか確認する。
満たしていれば、変更内容を簡潔にコミットメッセージにまとめてコミットする
（このスキル自身やCIワークフローを変更した場合はその旨も明記する）。

## やってはいけないこと

- `interpreter.ts`のステップ粒度規約（AGENTS.md参照）を、既存問題データを全て見直さずに変更する
- `and`/`or`の短絡評価を削除する（配列範囲外アクセスで例外になる問題データが存在する）
- テストが失敗した状態のままコミットする
- 学習データの保存先をlocalStorage以外に変更する（要件定義で明示的にスコープ外としている）
