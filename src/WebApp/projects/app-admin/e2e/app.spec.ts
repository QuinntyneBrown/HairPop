import { test, expect } from '@playwright/test';

test.describe('HairPop Admin - Authentication', () => {
  test.beforeEach(async ({ page }) => {
    // Clear any stored auth state before each test
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
  });

  test('should redirect to login page when not authenticated', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL(/\/login/);
  });

  test('should display login page with proper elements', async ({ page }) => {
    await page.goto('/login');

    // Check page title
    await expect(page).toHaveTitle(/HairPop Admin/i);

    // Check login form elements
    await expect(page.getByTestId('email-input')).toBeVisible();
    await expect(page.getByTestId('password-input')).toBeVisible();
    await expect(page.getByTestId('submit-button')).toBeVisible();

    // Check logo and branding
    await expect(page.locator('text=HairPop Admin')).toBeVisible();
    await expect(page.locator('text=Sign in to your account')).toBeVisible();
  });

  test('should show validation error with empty form submission', async ({ page }) => {
    await page.goto('/login');

    // Click submit without filling form
    const submitButton = page.getByTestId('submit-button');
    await expect(submitButton).toBeDisabled();
  });

  test('should enable submit button when form is valid', async ({ page }) => {
    await page.goto('/login');

    // Fill in the form
    await page.getByTestId('email-input').fill('admin@hairpop.com');
    await page.getByTestId('password-input').fill('password123');

    // Submit button should be enabled
    const submitButton = page.getByTestId('submit-button');
    await expect(submitButton).toBeEnabled();
  });

  test('should toggle password visibility', async ({ page }) => {
    await page.goto('/login');

    const passwordInput = page.getByTestId('password-input');
    await passwordInput.fill('secretpassword');

    // Initially password should be hidden
    await expect(passwordInput).toHaveAttribute('type', 'password');

    // Click visibility toggle
    await page.getByLabel(/show password/i).click();

    // Password should now be visible
    await expect(passwordInput).toHaveAttribute('type', 'text');

    // Click again to hide
    await page.getByLabel(/hide password/i).click();
    await expect(passwordInput).toHaveAttribute('type', 'password');
  });

  test('should display error message for invalid credentials', async ({ page }) => {
    await page.goto('/login');

    // Fill in invalid credentials
    await page.getByTestId('email-input').fill('wrong@email.com');
    await page.getByTestId('password-input').fill('wrongpassword');

    // Submit the form
    await page.getByTestId('submit-button').click();

    // Wait for error message (API will return error or connection error)
    await expect(page.locator('.error-message')).toBeVisible({ timeout: 10000 });
  });

  test('should allow dismissing error message', async ({ page }) => {
    await page.goto('/login');

    // Fill in invalid credentials
    await page.getByTestId('email-input').fill('wrong@email.com');
    await page.getByTestId('password-input').fill('wrongpassword');

    // Submit the form
    await page.getByTestId('submit-button').click();

    // Wait for error message
    const errorMessage = page.locator('.error-message');
    await expect(errorMessage).toBeVisible({ timeout: 10000 });

    // Click to dismiss
    await errorMessage.click();

    // Error should be hidden
    await expect(errorMessage).not.toBeVisible();
  });
});

test.describe('HairPop Admin - Login Integration', () => {
  // These tests require backend to be running

  test.skip('should successfully login with valid credentials', async ({ page }) => {
    await page.goto('/login');

    // Fill in valid credentials (requires backend)
    await page.getByTestId('email-input').fill('admin@hairpop.com');
    await page.getByTestId('password-input').fill('Admin123!');

    // Submit the form
    await page.getByTestId('submit-button').click();

    // Should redirect to dashboard
    await expect(page).toHaveURL('/');
    await expect(page.locator('text=Dashboard')).toBeVisible();
  });

  test.skip('should display dashboard after successful login', async ({ page }) => {
    // This test assumes user is logged in
    await page.goto('/login');
    await page.getByTestId('email-input').fill('admin@hairpop.com');
    await page.getByTestId('password-input').fill('Admin123!');
    await page.getByTestId('submit-button').click();

    // Wait for dashboard
    await expect(page).toHaveURL('/');

    // Check dashboard elements
    await expect(page.locator('text=Dashboard')).toBeVisible();
    await expect(page.locator('text=Welcome back')).toBeVisible();
  });

  test.skip('should persist login state across page refresh', async ({ page }) => {
    // Login first
    await page.goto('/login');
    await page.getByTestId('email-input').fill('admin@hairpop.com');
    await page.getByTestId('password-input').fill('Admin123!');
    await page.getByTestId('submit-button').click();

    // Wait for dashboard
    await expect(page).toHaveURL('/');

    // Refresh the page
    await page.reload();

    // Should still be on dashboard (not redirected to login)
    await expect(page).toHaveURL('/');
    await expect(page.locator('text=Dashboard')).toBeVisible();
  });

  test.skip('should logout successfully', async ({ page }) => {
    // Login first
    await page.goto('/login');
    await page.getByTestId('email-input').fill('admin@hairpop.com');
    await page.getByTestId('password-input').fill('Admin123!');
    await page.getByTestId('submit-button').click();

    // Wait for dashboard
    await expect(page).toHaveURL('/');

    // Click user menu and logout
    await page.getByLabel('User menu').click();
    await page.getByTestId('logout-button').click();

    // Should be redirected to login
    await expect(page).toHaveURL(/\/login/);
  });
});

test.describe('HairPop Admin - Shell Navigation', () => {
  test.beforeEach(async ({ page, context }) => {
    // Set up auth state to simulate logged in user
    await context.addCookies([]);
    await page.goto('/');
    await page.evaluate(() => {
      localStorage.setItem('hpa_auth', JSON.stringify({
        user: {
          userId: 'test-user-id',
          email: 'admin@hairpop.com',
          displayName: 'Admin User',
          roles: ['Admin']
        },
        accessToken: 'fake-token-for-testing',
        refreshToken: 'fake-refresh-token'
      }));
    });
  });

  test('should display shell with navigation when authenticated', async ({ page }) => {
    await page.goto('/');

    // Check shell elements
    await expect(page.locator('text=HairPop Admin').first()).toBeVisible();
    await expect(page.locator('text=Dashboard')).toBeVisible();
    await expect(page.locator('text=Users')).toBeVisible();
  });

  test('should toggle sidenav', async ({ page }) => {
    await page.goto('/');

    // Get sidenav
    const sidenav = page.locator('.shell-sidenav');

    // Initially expanded
    await expect(sidenav).not.toHaveClass(/collapsed/);

    // Click menu toggle
    await page.locator('button').filter({ has: page.locator('mat-icon:has-text("menu")') }).first().click();

    // Should be collapsed
    await expect(sidenav).toHaveClass(/collapsed/);
  });

  test('should navigate to different sections', async ({ page }) => {
    await page.goto('/');

    // Click on Users in navigation
    await page.locator('a:has-text("Users")').click();
    await expect(page).toHaveURL(/\/users/);

    // Click on Braiders
    await page.locator('a:has-text("Braiders")').click();
    await expect(page).toHaveURL(/\/braiders/);

    // Click on Dashboard to go back
    await page.locator('a:has-text("Dashboard")').click();
    await expect(page).toHaveURL('/');
  });

  test('should highlight active navigation item', async ({ page }) => {
    await page.goto('/users');

    // Users nav item should have active class
    const usersNavItem = page.locator('a:has-text("Users")');
    await expect(usersNavItem).toHaveClass(/active/);

    // Dashboard should not have active class
    const dashboardNavItem = page.locator('a:has-text("Dashboard")');
    await expect(dashboardNavItem).not.toHaveClass(/active/);
  });
});
