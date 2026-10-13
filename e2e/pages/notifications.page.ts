import { Page } from '@playwright/test';
import { CUSTOMER_URL } from '../fixtures/urls';

export class NotificationsPage {
  constructor(private readonly page: Page) {}

  readonly heading = this.page.getByRole('heading', { name: 'Notifications' });
  readonly updates = this.page.getByRole('region', { name: 'Updates' });
  readonly markAll = this.page.getByRole('button', { name: 'Mark all as read' });
  readonly readError = this.page
    .getByRole('main')
    .getByRole('alert')
    .filter({ hasText: 'Couldn’t mark this update as read' });
  readonly updatesLink = this.page.getByRole('banner').getByRole('link', { name: /Updates/ });
  readonly nextPage = this.page.getByRole('button', { name: 'Next page' });

  async open(): Promise<void> {
    await this.page.goto(`${CUSTOMER_URL}/notifications`);
  }

  item(title: string) {
    return this.updates.getByRole('listitem').filter({ hasText: title }).locator('.list__item');
  }

  async markRead(title: string): Promise<void> {
    await this.item(title)
      .getByRole('button', { name: `Mark as read ${title}` })
      .click();
  }
}
