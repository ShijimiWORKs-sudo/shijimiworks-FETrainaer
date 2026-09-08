import fs from 'node:fs';
import { defineConfig, devices } from '@playwright/test';

// 開発・CI環境によってはPlaywrightの既定のChromiumビルド(headless shell)が
// 用意されていないことがあるため、フルビルドのChromium実行ファイルが
// 存在する場合はそちらを優先して使う（このリポジトリのサンドボックス環境向けの互換対応）。
function findChromiumExecutable(): string | undefined {
  const candidates = [
    process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE,
    '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
    '/opt/pw-browsers/chromium/chrome-linux/chrome',
  ].filter((p): p is string => Boolean(p));
  return candidates.find((p) => fs.existsSync(p));
}

const executablePath = findChromiumExecutable();

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  retries: 0,
  reporter: [['list']],
  use: {
    baseURL: 'http://127.0.0.1:4173',
    trace: 'retain-on-failure',
  },
  webServer: {
    // --host 127.0.0.1 を明示しないと、'localhost'指定時にNode/ViteがIPv6(::1)に
    // バインドすることがあり（特にGitHub Actionsのubuntuランナー）、baseURL/webServer.url
    // で明示的にIPv4(127.0.0.1)を指定しているPlaywrightからの接続が届かずタイムアウトする。
    command: 'npm run preview -- --port 4173 --host 127.0.0.1',
    url: 'http://127.0.0.1:4173',
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
  projects: [
    {
      name: 'iphone-chromium',
      use: {
        ...devices['iPhone 14'],
        // iPhoneのビューポート/UAはそのままにブラウザエンジンはChromiumに固定する
        // （WebKitが未インストールの環境でも動作させるため）。
        defaultBrowserType: undefined,
        browserName: 'chromium',
        ...(executablePath ? { launchOptions: { executablePath } } : {}),
      },
    },
  ],
});
