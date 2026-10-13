import { Locator, Page } from '@playwright/test';

/** Care guidance and the completed-visit review form. */
export class CareAndReviewPage {
  readonly heading: Locator;
  readonly rating: Locator;
  readonly review: Locator;
  readonly submit: Locator;
  readonly success: Locator;

  constructor(readonly page: Page) {
    this.heading = page.getByRole('heading', { level: 1 });
    this.rating = page.getByRole('radio', { name: /5/ });
    this.review = page.getByRole('textbox', { name: 'Your review' });
    this.submit = page.getByRole('button', { name: 'Post review' });
    this.success = page.getByRole('main').getByText(/Your review is posted|held for checks/);
  }

  async open(ref = 'HP-0992'): Promise<void> {
    await this.page.goto(`/appointments/${ref}/care`);
  }
}
