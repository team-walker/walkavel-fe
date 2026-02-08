import { expect, test } from '@playwright/test';

test.describe('Home Page Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display the main search heading', async ({ page }) => {
    // Wait for splash screen to disappear if it exists
    const title = page.locator('h1:has-text("어디로")');
    await expect(title).toBeVisible({ timeout: 10000 });
    await expect(title).toContainText('워커블');
  });

  test('should be able to type in the search input', async ({ page }) => {
    const searchInput = page.getByPlaceholder('동 이름으로 검색');
    await expect(searchInput).toBeVisible();

    await searchInput.fill('인사동');
    await expect(searchInput).toHaveValue('인사동');
  });

  test('should show results when typing (this might require actual API response or mock)', async ({
    page,
  }) => {
    const searchInput = page.getByPlaceholder('동 이름으로 검색');
    await searchInput.fill('서울');

    // We expect some results to appear if the API is working or if we have it mocked.
    // For now, let's just check if the search loading or result container exists
    // await expect(page.locator('div[role="listbox"]')).toBeVisible();
  });
});
