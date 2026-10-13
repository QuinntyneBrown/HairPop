import { Page } from '@playwright/test';
import { BRAIDER_URL } from '../fixtures/urls';

export class BraiderRequestsPage {
  constructor(private readonly page: Page) {}

  readonly heading = this.page.getByRole('heading', { name: 'Requests', exact: true });
  readonly dialog = this.page.getByRole('dialog', { name: 'Respond to request HP-1048' });
  readonly respond = this.page.getByRole('button', { name: 'Respond to HP-1048' });
  readonly main = this.page.getByRole('main');
  readonly amount = this.dialog.getByRole('spinbutton', { name: 'Agreed amount' });
  readonly refresh = this.dialog.getByRole('button', { name: 'Refresh requests' });
  readonly menu = this.page.getByRole('button', { name: 'Menu' });
  readonly managementNav = this.page.getByRole('navigation', { name: 'Management' });

  async horizontalOverflow(): Promise<boolean> {
    return this.page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
  }

  async open(): Promise<void> {
    await this.page.goto(`${BRAIDER_URL}/manage/requests`);
  }

  async accept(amount: string): Promise<void> {
    await this.dialog.getByRole('radio', { name: /Accept/ }).check();
    await this.amount.fill(amount);
    await this.dialog.getByRole('button', { name: 'Send reply' }).click();
  }
}
