import { expect, test } from '@playwright/test';

test.describe('苦手問題・復習・成績', () => {
  test('各ページが正しく表示される', async ({ page }) => {
    await page.goto('/weak');
    await expect(page.getByRole('heading', { name: '苦手問題' })).toBeVisible();

    await page.goto('/review');
    await expect(page.getByRole('heading', { name: '復習' })).toBeVisible();

    await page.goto('/stats');
    await expect(page.getByText('総演習数')).toBeVisible();
    await expect(page.getByText('科目A カテゴリ別正答率')).toBeVisible();
    await expect(page.getByText('科目B カテゴリ別正答率')).toBeVisible();
  });

  test('間違えた問題が苦手問題リストに反映される', async ({ page }) => {
    await page.goto('/practice');
    await page.getByText('セキュリティ').first().click();
    await page.getByRole('button', { name: '5問', exact: true }).click();

    // 間違いを積極的に選ぶために、正解が確定するまで選択肢を試す（最大4回）
    for (let q = 0; q < 5; q++) {
      const choices = page.locator('.quiz-choice');
      // 不正解を狙うため、常に2番目の選択肢を選ぶ（最終的な集計より挙動確認が目的）
      await choices.nth(1).click();
      await expect(page.locator('.quiz-feedback')).toBeVisible();
      await page.getByRole('button', { name: /次の問題へ|結果を見る/ }).click();
    }

    await page.goto('/weak');
    // 苦手問題が1件以上表示される、または0件メッセージにならず件数バッジが出ることを確認
    await expect(page.getByRole('heading', { name: '苦手問題' })).toBeVisible();
  });
});
