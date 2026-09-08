import { expect, test } from '@playwright/test';

test.describe('ナビゲーション', () => {
  test('ホーム画面が表示され、ボトムナビで各タブに遷移できる', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText('基本情報技術者 Trainer')).toBeVisible();
    await expect(page.getByText('今日の10問をはじめる')).toBeVisible();

    await page.getByRole('link', { name: '演習' }).click();
    await expect(page.getByRole('tab', { name: '科目A' })).toBeVisible();
    await expect(page.getByText('テクノロジ')).toBeVisible();

    await page.getByRole('tab', { name: '科目B' }).click();
    await expect(page.getByText('擬似言語').first()).toBeVisible();
    await expect(page.getByText('アルゴリズム').first()).toBeVisible();

    await page.getByRole('link', { name: '模試' }).click();
    await expect(page.getByText('科目A 模擬試験')).toBeVisible();

    await page.getByRole('link', { name: '成績' }).click();
    await expect(page.getByText('総演習数')).toBeVisible();

    await page.getByRole('link', { name: 'もっと' }).click();
    await expect(page.getByText('📅 今日の10問')).toBeVisible();

    await page.getByRole('link', { name: 'ホーム' }).click();
    await expect(page.getByText('今日の10問をはじめる')).toBeVisible();
  });
});
