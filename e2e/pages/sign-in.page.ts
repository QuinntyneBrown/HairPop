import { Locator, Page } from '@playwright/test';

import { Shell } from './shell';

/** Sign in at `/sign-in` (docs/mocks/pages/sign-in). */
export class SignInPage {
  readonly shell: Shell;
  readonly heading: Locator;
  readonly form: Locator;
  readonly email: Locator;
  readonly password: Locator;
  readonly submit: Locator;
  readonly summary: Locator;
  readonly fieldErrors: Locator;
  readonly failure: Locator;
  readonly rateLimited: Locator;
  readonly forgotPassword: Locator;
  readonly createAccount: Locator;

  constructor(readonly page: Page) {
    this.shell = new Shell(page);
    this.heading = page.getByRole('heading', { level: 1 });
    this.form = page.locator('form').filter({ has: page.getByLabel('Password') });
    this.email = page.getByRole('textbox', { name: 'Email' });
    this.password = page.getByLabel('Password');
    this.submit = this.form.getByRole('button', { name: 'Sign in' });
    this.summary = this.form.locator('.form-summary');
    this.fieldErrors = this.form.locator('.field__error');
    this.failure = page.getByRole('alert').filter({ hasText: 'Check your email and password' });
    this.rateLimited = page.locator('hp-alert', { hasText: 'Too many sign-in attempts' });
    this.forgotPassword = page.getByRole('link', { name: 'Forgot your password?' });
    this.createAccount = page.getByRole('link', { name: 'Create an account' });
  }

  async open(returnUrl?: string): Promise<void> {
    await this.page.goto(
      returnUrl ? `/sign-in?returnUrl=${encodeURIComponent(returnUrl)}` : '/sign-in',
    );
  }

  /** Fills the form and submits it. */
  async signIn(email: string, password: string): Promise<void> {
    await this.email.fill(email);
    await this.password.fill(password);
    await this.submit.click();
  }
}
