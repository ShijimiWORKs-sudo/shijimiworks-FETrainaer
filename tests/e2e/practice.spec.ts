import { expect, test } from '@playwright/test';

test.describe('演習フロー', () => {
  test('科目Bの擬似言語カテゴリでステップ実行ビジュアライザを操作し、解答できる', async ({ page }) => {
    await page.goto('/practice');
    await page.getByRole('tab', { name: '科目B' }).click();
    await page.getByText('擬似言語').first().click();

    // 出題数選択
    await page.getByRole('button', { name: '5問', exact: true }).click();

    // トレースビジュアライザが表示される
    const visualizer = page.getByTestId('trace-visualizer');
    await expect(visualizer).toBeVisible();

    const noteBefore = await visualizer.locator('.trace-note').innerText();

    // 次のステップを押すと状態が変化する
    await page.getByRole('button', { name: '次のステップ →' }).click();
    const noteAfter = await visualizer.locator('.trace-note').innerText();
    expect(noteAfter).not.toBe(noteBefore);

    // 最初からボタンで先頭に戻れる
    await page.getByRole('button', { name: '⏮ 最初から' }).click();
    const noteReset = await visualizer.locator('.trace-note').innerText();
    expect(noteReset).toBe(noteBefore);

    // 選択肢を選んで解答する
    await page.locator('.quiz-choice').first().click();
    await expect(page.locator('.quiz-feedback')).toBeVisible();

    // 5問答えて結果画面まで到達する
    for (let i = 0; i < 4; i++) {
      await page.getByRole('button', { name: /次の問題へ|結果を見る/ }).click();
      await page.locator('.quiz-choice').first().click();
      await expect(page.locator('.quiz-feedback')).toBeVisible();
    }
    await page.getByRole('button', { name: '結果を見る' }).click();
    await expect(page.getByText(/\d+ \/ 5 問正解/)).toBeVisible();
  });

  test('科目Aのカテゴリで復習フラグを付けられる', async ({ page }) => {
    await page.goto('/practice');
    await page.getByText('テクノロジ').first().click();
    await page.getByRole('button', { name: '5問', exact: true }).click();

    await page.getByRole('button', { name: '☆ 復習に追加' }).click();
    await expect(page.getByRole('button', { name: '★ 復習中' })).toBeVisible();
  });
});
