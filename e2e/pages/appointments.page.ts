import { Locator, Page } from '@playwright/test';

/** Customer appointment list and detail. */
export class AppointmentsPage {
  readonly heading: Locator;
  readonly search: Locator;
  readonly pending: Locator;
  readonly detail: Locator;
  readonly cancel: Locator;
  readonly cancelDialog: Locator;
  readonly change: Locator;
  readonly changeDialog: Locator;
  readonly bookAgain: Locator;
  readonly careAndReview: Locator;
  readonly nextPage: Locator;

  constructor(readonly page: Page) {
    this.heading = page.getByRole('heading', { level: 1 });
    this.search = page.getByRole('textbox', { name: 'Search my appointments' });
    this.pending = page.getByRole('main').getByText('Awaiting reply');
    this.detail = page.getByRole('main').getByRole('link', { name: /HP-1048|View details/i });
    this.cancel = page
      .getByRole('main')
      .getByRole('button', { name: /Cancel request|Cancel appointment/ });
    this.cancelDialog = page.getByRole('alertdialog', { name: /Cancel/ });
    this.change = page.getByRole('main').getByRole('button', { name: 'Request a change' });
    this.changeDialog = page.getByRole('dialog', { name: 'Request a change' });
    this.bookAgain = page.getByRole('main').getByRole('button', { name: 'Book again' });
    this.careAndReview = page.getByRole('main').getByRole('link', { name: 'Care and review' });
    this.nextPage = page.getByRole('button', { name: 'Next page' });
  }

  async openList(): Promise<void> {
    await this.page.goto('/appointments');
  }

  async openDetail(ref = 'HP-1048'): Promise<void> {
    await this.page.goto(`/appointments/${ref}`);
  }
}
