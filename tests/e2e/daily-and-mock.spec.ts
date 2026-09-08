import { expect, test } from '@playwright/test';

test.describe('今日の10問', () => {
  test('10問すべて回答すると結果画面が表示される', async ({ page }) => {
    await page.goto('/daily');
    for (let i = 0; i < 10; i++) {
      // トレース問題の有無で設問カードの高さが大きく変わり、直後のクリックが
      // 前フレームの要素（trace-source-line等）にヒットテストされてリトライが
      // 延々と続くことがある（AGENTS.md「既知の落とし穴」参照）。
      // click({force:true})は「隠れていないか」だけでなく「disabledでないか」の
      // チェックまで一緒にスキップしてしまい、直前の設問の disabled ボタンに
      // 空振りするリグレッションを起こしたため使わない。dispatchEvent('click')で
      // 座標ベースのヒットテストを回避しつつ、ブラウザ本来のclick()セマンティクス
      // （disabled要素へのclickは無視される）は維持する。
      await page.locator('.quiz-choice').first().dispatchEvent('click');
      await expect(page.locator('.quiz-feedback')).toBeVisible();
      // 「次の問題へ」ボタン自体はdisabledになることがないため、
      // 座標ヒットテストのゆらぎだけを避ければよく、同じくdispatchEvent('click')にしている。
      await page.getByRole('button', { name: /次の問題へ|結果を見る/ }).dispatchEvent('click');
    }
    await expect(page.getByText(/\d+ \/ 10 問正解/)).toBeVisible();
    await page.getByRole('button', { name: 'ホームに戻る' }).click();
    await expect(page.getByText('今日の10問をはじめる')).toBeVisible();
  });
});

test.describe('模擬試験', () => {
  test('科目Aの模試を開始し、途中で採点して結果を確認できる', async ({ page }) => {
    await page.goto('/mock-exam');
    await page.getByRole('link', { name: '科目Aの模試をはじめる' }).click();

    await expect(page.getByText('科目A 模擬試験')).toBeVisible();
    await expect(page.getByText(/残り \d{2}:\d{2}/)).toBeVisible();

    // 最初の問題に解答（上のテストと同じ理由でdispatchEvent('click')にしている）
    await page.locator('.quiz-choice').first().dispatchEvent('click');
    await expect(page.locator('.quiz-choice.is-selected')).toBeVisible();

    // 次へ進めることを確認
    await page.getByRole('button', { name: '次へ →' }).click();
    await expect(page.getByText('問2 /')).toBeVisible();

    // 採点して終了する
    await page.getByRole('button', { name: '採点する（試験を終了）' }).click();
    await expect(page.getByText('科目A 模擬試験 結果')).toBeVisible();
    await expect(page.getByText(/\d+ \/ \d+（/)).toBeVisible();

    await page.getByRole('button', { name: '模試トップに戻る' }).click();
    await expect(page.getByText('受験履歴')).toBeVisible();
  });
});
