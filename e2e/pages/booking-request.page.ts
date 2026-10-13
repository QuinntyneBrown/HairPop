import { Locator, Page } from '@playwright/test';

/** The customer booking screen and review dialog. */
export class BookingRequestPage {
  readonly service: Locator;
  readonly time: Locator;
  readonly email: Locator;
  readonly phone: Locator;
  readonly hairDetails: Locator;
  readonly review: Locator;
  readonly dialog: Locator;

  constructor(readonly page: Page) {
    this.service = page.getByRole('radio', { name: /Medium knotless braids/ });
    this.time = page.getByRole('radio', { name: /Sat 24 Oct/ });
    this.email = page.getByRole('main').getByRole('textbox', { name: 'Your email' });
    this.phone = page.getByRole('main').getByRole('textbox', { name: /Phone/ });
    this.hairDetails = page.getByRole('main').getByRole('textbox', { name: 'Hair details' });
    this.review = page.getByRole('main').getByRole('button', { name: 'Review request' });
    this.dialog = page.getByRole('dialog', { name: 'Review request' });
  }

  async open(): Promise<void> {
    await this.page.goto('/book/nia-okafor');
  }
}
