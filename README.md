# 基本情報技術者 Trainer

iPhone中心のレスポンシブWeb（PWA）で動作する、基本情報技術者試験（FE）対策アプリです。
ShijimiWORKsが運用する [ProgrammingTrainer](https://github.com/ShijimiWORKs-sudo/shijimiworks-programmingtrainer)
とは別プロダクトとして開発しています。

## 差別化ポイント

科目Bの擬似言語・アルゴリズム問題を、**1行ずつステップ実行して変数の状態変化を可視化するトレース機能**
（`src/features/subjectB/TraceVisualizer.tsx`）を搭載しています。「最初から」「ひとつ戻る」「次のステップ」
「自動実行」で、配列の合計値計算やソート、二分探索、スタック/キュー操作などのアルゴリズムが
どのように変数を書き換えていくかを、実際に手を動かして確認できます。

## 機能

- ホーム（学習状況ダッシュボード）
- 今日の10問（苦手優先の重み付け出題）
- 科目A演習（テクノロジ／マネジメント／ストラテジ）
- 科目B演習（擬似言語／アルゴリズム／データ構造／セキュリティ、トレースビジュアライザつき）
- 模擬試験（科目A: 90分60問 / 科目B: 100分20問、タイマー・採点つき）
- 苦手問題（誤答傾向を自動集計）
- 復習（簡易間隔反復）
- 成績（カテゴリ別正答率・学習履歴・模試スコア推移）

詳細な要件定義・画面設計・データモデルは `docs/` を参照してください。

## 技術スタック

- React 19 + TypeScript + Vite
- react-router-dom（クライアントサイドルーティング）
- vite-plugin-pwa（Service Worker・マニフェスト生成）
- Vitest（単体テスト。擬似言語インタプリタと問題データの整合性を検証）
- Playwright（E2Eテスト。iPhoneビューポートでの主要導線を検証）
- oxlint（Lint）
- データ永続化はすべてブラウザの`localStorage`（サーバ不要）

## セットアップ

```bash
npm install
npm run dev       # 開発サーバ
npm run build     # 本番ビルド（dist/に出力、PWAアセット込み）
npm run preview   # ビルド済みアプリをプレビュー
```

## テスト

```bash
npx vitest run          # 単体テスト（擬似言語インタプリタ・問題データ検証）
npx playwright test     # E2Eテスト（iPhoneビューポート、要 npm run build 済みのdist）
npx oxlint               # Lint
```

Playwrightは`playwright.config.ts`の`webServer`設定により、`npm run preview`を自動起動してテストします。
このリポジトリのサンドボックス環境ではPlaywright標準のheadless shellではなくフルビルドのChromiumを
使う設定になっています（`PLAYWRIGHT_CHROMIUM_EXECUTABLE`環境変数で上書き可能）。

## ディレクトリ構成

`docs/03_data_model.md` の「ディレクトリ構成」を参照してください。問題データは
`src/data/questions/subjectA.*.ts` / `subjectB.*.ts` にカテゴリ別に定義されており、
擬似言語トレース付き問題は `src/lib/pseudocode/dsl.ts` のビルダー関数でASTを組み立てます。

## iPhoneでの利用方法（PWAとしてインストール）

このアプリはPWA（Progressive Web App）です。ネイティブアプリのようにホーム画面に追加して、
オフラインでも起動できます。

### 1. GitHub Pagesへのデプロイ（初回のみ設定）

`main`ブランチへのpush時に`.github/workflows/deploy.yml`が自動でビルド・デプロイします。
初回のみ、GitHubリポジトリの **Settings → Pages → Build and deployment → Source** を
「GitHub Actions」に設定してください。設定後、pushするたびに
`https://<組織名>.github.io/<リポジトリ名>/`（例:
`https://shijimiworks-sudo.github.io/shijimiworks-FETrainaer/`）に最新版が公開されます。

サブパス配下（ドメイン直下ではない）へのデプロイに対応するため、ビルド時に
`VITE_BASE_PATH=/<リポジトリ名>/` 環境変数でルートパスを指定しています
（`vite.config.ts`参照）。ローカル開発・プレビュー・E2Eテストでは指定不要（`/`のまま）。

GitHub Pagesは静的ホスティングのため、SPA内の任意パスへの直接アクセスやリロードは
そのままでは404になります。`public/404.html`と`index.html`冒頭のスクリプトで
（spa-github-pages方式の）リダイレクト救済を行っています。

### 2. iPhoneのSafariでインストール

1. iPhoneのSafariで、上記のGitHub PagesのURLを開く
2. 共有ボタン（□に↑）をタップ
3. 「ホーム画面に追加」を選択

ホーム画面のアイコンから起動すると、アドレスバーのないアプリらしい見た目（standalone表示）で
動作し、一度読み込んだ内容はオフラインでも利用できます（Service Workerによるキャッシュ）。
学習データは端末のlocalStorageに保存されるため、この方法でインストールしたiPhone上でのみ
記録が保持されます（端末間同期は非対応）。

## 継続開発

`AGENTS.md` と `.codex/skills/fe-trainer-autonomous-dev/SKILL.md` に、このアプリの開発を
別セッションで継続する際の指針をまとめています。問題を追加する場合は
`src/data/questions/questions.test.ts` と `src/data/questions/trace-answers.test.ts` が
自動でデータ整合性（4択の妥当性・トレース問題の実行結果と正解の一致）を検証するので、
必ず `npx vitest run` を通してからコミットしてください。
