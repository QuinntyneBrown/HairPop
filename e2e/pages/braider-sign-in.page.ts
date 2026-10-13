import { Page } from '@playwright/test';
import { BRAIDER_URL } from '../fixtures/urls';

export class BraiderSignInPage {
  constructor(private readonly page: Page) {}

  readonly heading = this.page.getByRole('heading', { name: 'Sign in to manage your bookings' });
  readonly requestsHeading = this.page.getByRole('heading', { name: 'Requests', exact: true });
  readonly email = this.page.getByRole('textbox', { name: 'Email' });
  readonly password = this.page.getByLabel('Password');
  readonly submit = this.page.getByRole('button', { name: 'Sign in' });

  async open(): Promise<void> {
    await this.page.goto(`${BRAIDER_URL}/manage/sign-in`);
  }

  async openRequests(): Promise<void> {
    await this.page.goto(`${BRAIDER_URL}/manage/requests`);
  }

  async signIn(email: string, password: string): Promise<void> {
    await this.email.fill(email);
    await this.password.fill(password);
    await this.submit.click();
  }
}
