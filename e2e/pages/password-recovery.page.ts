import { Locator, Page } from '@playwright/test';

/** The two password-recovery screens. */
export class PasswordRecoveryPage {
  readonly email: Locator;
  readonly password: Locator;
  readonly confirmation: Locator;
  readonly submit: Locator;
  readonly done: Locator;
  readonly error: Locator;

  constructor(readonly page: Page) {
    this.email = page.getByRole('textbox', { name: 'Email' });
    this.password = page.locator('input[formcontrolname="password"]');
    this.confirmation = page.getByLabel('Confirm password');
    this.submit = page
      .getByRole('main')
      .getByRole('button', { name: /send reset link|save password/i });
    this.done = page.getByRole('main').getByText(/check your inbox|password updated/i);
    this.error = page.getByRole('main').locator('hp-alert');
  }

  async openForgot(): Promise<void> {
    await this.page.goto('/forgot-password');
  }

  async openReset(token = 'valid-token', email = 'maya.chen@example.com'): Promise<void> {
    await this.page.goto(`/reset-password?token=${token}&email=${encodeURIComponent(email)}`);
  }
}
