import { test, expect } from '@playwright/test';

test.describe('HairPop Admin App', () => {
  test('should display the page title', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/HairpopAdmin/i);
  });

  test('should display the welcome message', async ({ page }) => {
    await page.goto('/');
    const heading = page.locator('h1');
    await expect(heading).toContainText('Hello, hairpop-admin');
  });

  test('should display congratulations message', async ({ page }) => {
    await page.goto('/');
    const message = page.locator('p');
    await expect(message.first()).toContainText('Congratulations');
  });

  test('should have navigation links', async ({ page }) => {
    await page.goto('/');
    const links = page.locator('.pill-group a');
    await expect(links.first()).toBeVisible();
  });
});
