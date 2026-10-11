import { Locator, Page } from '@playwright/test';

import { Shell } from './shell';

/** Create an account at `/sign-up` (docs/mocks/pages/sign-up). */
export class SignUpPage {
  readonly shell: Shell;
  readonly heading: Locator;
  readonly form: Locator;
  readonly name: Locator;
  readonly email: Locator;
  readonly password: Locator;
  readonly submit: Locator;
  readonly summary: Locator;
  readonly fieldErrors: Locator;
  readonly failure: Locator;
  readonly rateLimited: Locator;
  readonly done: Locator;
  readonly verifyEmail: Locator;
  readonly signIn: Locator;
  readonly terms: Locator;
  readonly privacy: Locator;

  constructor(readonly page: Page) {
    this.shell = new Shell(page);
    this.heading = page.getByRole('heading', { level: 1 });
    this.form = page.locator('form').filter({ has: page.getByLabel('Password') });
    this.name = page.getByRole('textbox', { name: 'Name' });
    this.email = page.getByRole('textbox', { name: 'Email' });
    this.password = page.getByLabel('Password');
    this.submit = this.form.getByRole('button', { name: 'Create account' });
    this.summary = this.form.locator('.form-summary');
    this.fieldErrors = this.form.locator('.field__error');
    this.failure = page.locator('hp-alert', { hasText: 'We couldn’t create your account' });
    this.rateLimited = page.locator('hp-alert', { hasText: 'Too many attempts' });
    this.done = page.locator('hp-empty-state', { hasText: 'Your account is ready' });
    this.verifyEmail = this.done.getByRole('link', { name: 'Verify email' });
    this.signIn = page.getByRole('link', { name: 'Sign in', exact: true }).last();
    this.terms = page.getByRole('main').getByRole('link', { name: 'Terms' });
    this.privacy = page.getByRole('main').getByRole('link', { name: 'Privacy' });
  }

  async open(): Promise<void> {
    await this.page.goto('/sign-up');
  }

  /** Fills every field; the form is submitted separately. */
  async fill(details: { name: string; email: string; password: string }): Promise<void> {
    await this.name.fill(details.name);
    await this.email.fill(details.email);
    await this.password.fill(details.password);
  }
}
