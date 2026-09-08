import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// GitHub Pagesなど、ドメイン直下ではなくサブパス配下（例: /shijimiworks-FETrainaer/）に
// デプロイする場合は VITE_BASE_PATH でルートパスを指定する（末尾スラッシュ必須）。
// 未指定時（ローカル開発・プレビュー・E2E）は従来通り '/' のまま。
const base = process.env.VITE_BASE_PATH || '/'

// https://vite.dev/config/
export default defineConfig({
  base,
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'icons.svg'],
      manifest: {
        name: '基本情報技術者 Trainer',
        short_name: 'FEトレーナー',
        description: '基本情報技術者試験(FE)対策アプリ — 科目B擬似言語のステップ実行トレース機能つき',
        theme_color: '#1b2a4a',
        background_color: '#f4f6fb',
        display: 'standalone',
        orientation: 'portrait',
        start_url: base,
        scope: base,
        lang: 'ja',
        icons: [
          { src: `${base}pwa-192.png`, sizes: '192x192', type: 'image/png' },
          { src: `${base}pwa-512.png`, sizes: '512x512', type: 'image/png' },
          { src: `${base}pwa-512.png`, sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,ico}'],
      },
    }),
  ],
  resolve: {
    alias: {
      '@': new URL('./src', import.meta.url).pathname,
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    exclude: ['node_modules', 'tests/e2e/**'],
  },
})
