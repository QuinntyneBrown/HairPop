import { Locator, Page } from '@playwright/test';

/** Email verification and resend at `/verify-email`. */
export class VerifyEmailPage {
  readonly status: Locator;
  readonly resend: Locator;
  readonly email: Locator;

  constructor(readonly page: Page) {
    this.status = page.getByRole('main').locator('hp-alert, hp-empty-state');
    this.resend = page.getByRole('main').getByRole('button', { name: 'Resend email' });
    this.email = page.getByRole('main').getByRole('textbox', { name: 'Email' });
  }

  async open(token?: string): Promise<void> {
    await this.page.goto(
      token ? `/verify-email?token=${encodeURIComponent(token)}` : '/verify-email',
    );
  }
}
