# AGENTS.md — 基本情報技術者 Trainer

このファイルは、このリポジトリで作業するAIエージェント（Claude Code / Codex等）向けの指針です。
[ProgrammingTrainer](https://github.com/ShijimiWORKs-sudo/shijimiworks-programmingtrainer) の
`AGENTS.md`と同様の役割を持ちます。

## プロジェクトの目的

基本情報技術者試験（FE）対策アプリ。iPhoneでのPWA利用を主眼としたレスポンシブWeb。
最大の差別化要素は、科目Bの擬似言語問題を1行ずつステップ実行して変数の変化を可視化する
トレースビジュアライザ（`src/features/subjectB/TraceVisualizer.tsx`
＋ `src/lib/pseudocode/interpreter.ts`）である。この機能を壊す変更は特に慎重にテストすること。

## 開発の原則

1. **要件定義 → 設計 → 実装 → テストの順を飛ばさない。** 大きな機能追加は `docs/` に設計メモを
   残してから着手する。
2. **問題データの正しさは自動テストで担保する。** `src/data/questions/questions.test.ts`
   （構造検証：4択・ID一意性・トレース実行が例外を投げないこと）と
   `src/data/questions/trace-answers.test.ts`（トレース実行結果と正解選択肢の数値が一致すること）
   を必ずパスさせる。新しいトレース問題を追加したら、`trace-answers.test.ts`に対応する
   アサーションを追加する。
3. **擬似言語インタプリタの粒度規約を守る。**
   `src/lib/pseudocode/interpreter.ts`の冒頭コメントの通り、ループの外側は「1文=1ステップ」、
   ループの内側は「1反復=1ステップ」で状態を記録する（IPAのトレース表の慣習に合わせている）。
   この粒度を変えると既存の全トレース問題のステップ数・表示が変わるため、変更する場合は
   `interpreter.test.ts`と`trace-answers.test.ts`を全て見直すこと。
4. **`and`/`or`は短絡評価する。** 配列境界外アクセスを伴う条件式（例: `j >= 0 and arr[j] > key`）が
   複数の問題データで使われているため、短絡評価を外すとランタイムエラーになる。
5. **データ永続化はlocalStorageのみ。** サーバサイドは持たない前提。`src/data/repository.ts`の
   `ProgressRepository`インタフェースを通して行い、直接`localStorage`を叩くコードを増やさない。
6. **UIは iPhone幅（375〜430px）を primary target とする。** `#root`に`max-width:560px`を
   設定しているため、PC幅で見ても中央寄せの縦長レイアウトになる。横幅を前提にした実装をしない。

## テストの実行方法

```bash
npx vitest run       # 単体テスト（インタプリタ・問題データ整合性）
npm run build         # 型チェック(tsc -b) + 本番ビルド
npx playwright test   # E2E（要: 事前に npm run build 実行、dist/を配信してテストする）
npx oxlint             # Lint
```

Playwright E2Eは`playwright.config.ts`の`webServer`設定で`npm run preview`を自動起動する。
このサンドボックス環境ではPlaywright標準のheadless shellバイナリが用意されていないことがあるため、
`/opt/pw-browsers/chromium-*/chrome-linux/chrome`のフルビルドChromiumを`launchOptions.executablePath`
で指定するフォールバックを組み込んである。別環境で動かす場合は`PLAYWRIGHT_CHROMIUM_EXECUTABLE`
環境変数で上書きするか、`npx playwright install`で標準バイナリを導入すること。

**既知の落とし穴:** ヘッダーに`backdrop-filter`やbody要素にスクロールアンカリングを効かせたままにすると、
コンテンツの高さが動的に変わる画面（解答直後のフィードバック表示など）でヘッドレスChromiumの
ヒットテストが不安定になり、Playwrightのクリックが延々とリトライされることがある
（`body { overflow-anchor: none }`で回避済み。安易に削除しない）。

**既知の落とし穴（GitHub Pagesデプロイ）:** このアプリはGitHub Pagesの
`/<リポジトリ名>/`というサブパス配下にデプロイされる（`.github/workflows/deploy.yml`が
ビルド時に`VITE_BASE_PATH`環境変数を設定する）。新しくアセットやリンクを追加する際、
`/pwa-192.png`のようなドメイン直下決め打ちの絶対パスを増やさないこと
（`public/`配下のファイルはVercelが自動でbaseを付与するが、コード内で組み立てる文字列URLは
`import.meta.env.BASE_URL`を使う）。ルーティングは`main.tsx`の
`<BrowserRouter basename={import.meta.env.BASE_URL}>`で吸収している。
また、GitHub Pagesは静的ホスティングのためSPA内パスへの直接アクセス/リロードは404になるので、
`public/404.html`（リダイレクト）と`index.html`冒頭のURL復元スクリプト
（spa-github-pages方式）をセットで維持すること。

## 問題データを追加する際の手順

1. `src/data/questions/subjectA.*.ts` または `subjectB.*.ts` に`Question`オブジェクトを追加する
   （IDの命名規則: `A-TECH-XXX`, `B-PSE-XXX`など、既存のパターンに合わせる）。
2. トレース付き問題（擬似言語・アルゴリズム）は`src/lib/pseudocode/dsl.ts`のビルダー関数で
   ASTを組み立てる。**必ず自分で最終状態を手計算し、`trace-answers.test.ts`に
   アサーションを追加して、正解選択肢と実行結果が一致することを機械的に検証する。**
   手計算だけに頼ると（このプロジェクトの初回実装でも実際に発生したが）短絡評価の考慮漏れ等で
   簡単に間違える。
3. `npx vitest run`で`questions.test.ts`（カテゴリごと最低10問等の構造チェック）が通ることを確認する。
4. 可能であれば`npx playwright test`でUIからも到達可能なことを確認する。

## 今後の拡張候補

`docs/01_requirements.md`の「非スコープ」を参照。特に以下は優先度が高い：

- IPA公開問題の最新傾向分析に基づく問題バンクの拡充（現状は各カテゴリ最低10〜15問）
- サーバサイド同期（現状はlocalStorageのみで端末間共有不可）
- 模擬試験の一時中断・再開（現状はタブを閉じるとタイマーがリセットされる）
