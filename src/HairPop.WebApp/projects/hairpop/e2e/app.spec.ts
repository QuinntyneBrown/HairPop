import { test, expect } from '@playwright/test';

test.describe('HairPop App', () => {
  test('should display the page title', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/HairPop/i);
  });

  test('should display the braiders section', async ({ page }) => {
    await page.goto('/');
    const heading = page.locator('h1');
    await expect(heading).toContainText('BRAIDERS');
  });

  test('should display braider cards', async ({ page }) => {
    await page.goto('/');
    const braiderCards = page.locator('hp-braider');
    await expect(braiderCards).toHaveCount(6);
  });

  test('should have header component', async ({ page }) => {
    await page.goto('/');
    const header = page.locator('hp-header');
    await expect(header).toBeVisible();
  });

  test('should have footer component', async ({ page }) => {
    await page.goto('/');
    const footer = page.locator('hp-footer');
    await expect(footer).toBeVisible();
  });
});
