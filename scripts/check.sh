#!/usr/bin/env bash
# 開発・CIで使う一括チェックスクリプト。
# Lint → 単体テスト → 型チェック+ビルド → E2Eテストの順に実行し、
# いずれかが失敗した時点で停止する。
set -euo pipefail

cd "$(dirname "$0")/.."

echo "== oxlint =="
npx oxlint

echo "== vitest =="
npx vitest run

echo "== tsc -b && vite build =="
npm run build

echo "== playwright test =="
npx playwright test

echo "全チェックが完了しました。"
