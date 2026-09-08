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
問題数が増えてトレース問題（擬似言語・アルゴリズム）の出現比率が上がったことで、
「今日の10問」E2E（`tests/e2e/daily-and-mock.spec.ts`）でも同種のヒットテスト不安定化が
再発することを確認した。設問が変わるたびに`TraceVisualizer`の有無でカード高さが大きく
変動し、直後の`.quiz-choice`クリックが前フレームの`.trace-source-line`や`.quiz-choices`自体に
奪われてリトライが30秒タイムアウトするケースがある。根本的なアニメーション等はコード上
見当たらず（`overflow-anchor: none`は維持済み）、ヘッドレスChromiumの1フレーム分の
レイアウト確定遅延が原因とみられる。

対処として最初は`.click({ force: true })`を試したが、これは「他要素に隠れていないか」だけでなく
「disabledでないか」のチェックまで一緒にスキップしてしまい、直前の設問がまだ`answered`状態
（=選択肢がdisabled）のうちにクリックが空振りする新たなリグレッションを起こした（繰り返し実行で
逆に失敗率が悪化することを確認済み）。最終的には`locator.dispatchEvent('click')`を使うことで、
座標ベースのヒットテストを完全に回避しつつ、ブラウザ本来のclick()セマンティクス
（disabled要素へのclickは無視される）は維持する形で解決した
（`.quiz-choice`と「次の問題へ／結果を見る」ボタンの両方に適用）。
`--repeat-each=15`程度の連続実行でも安定して全件成功することを確認済み。

**デプロイについて:** リポジトリがPrivateのためGitHub Pagesは使わず、Netlify/Vercel
（`netlify.toml` / `vercel.json`）でホスティングする。どちらもドメイン直下にデプロイされるため
サブパス対応は不要（`vite.config.ts`の`VITE_BASE_PATH`は未設定＝`/`のまま使う）。
将来的にサブパス配下へのデプロイが必要になった場合のために、
`base`をビルド時の`VITE_BASE_PATH`環境変数で切り替えられる仕組みと、
`main.tsx`の`<BrowserRouter basename={import.meta.env.BASE_URL}>`はそのまま残してある。
SPAのルーティング救済（存在しないパスをindex.htmlにフォールバック）は
Netlifyなら`netlify.toml`の`redirects`、Vercelなら`vercel.json`の`rewrites`で行っている。

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
