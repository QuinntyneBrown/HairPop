import { Locator, Page } from '@playwright/test';

/** The Filter braiders dialog (docs/mocks/dialogs/filter-braiders). */
export class FilterBraidersDialog {
  readonly root: Locator;
  readonly maxPrice: Locator;
  readonly distance: Locator;
  readonly apply: Locator;
  readonly cancel: Locator;
  readonly summary: Locator;
  readonly fieldErrors: Locator;
  readonly failure: Locator;

  constructor(readonly page: Page) {
    this.root = page.getByRole('dialog', { name: 'Filter braiders' });
    this.maxPrice = this.root.getByRole('spinbutton', { name: 'Maximum price' });
    this.distance = this.root.getByRole('combobox', { name: 'Distance from Toronto' });
    this.apply = this.root.getByRole('button', { name: 'Show braiders' });
    this.cancel = this.root.getByRole('button', { name: 'Cancel' });
    this.summary = this.root.locator('.form-summary');
    this.fieldErrors = this.root.locator('.field__error');
    this.failure = this.root.getByRole('alert').filter({ hasText: 'We couldn’t save this' });
  }

  /** Enters the criteria without applying them; an empty price leaves it unset. */
  async fill(criteria: { maxPrice?: string; distance?: string }): Promise<void> {
    if (criteria.maxPrice !== undefined) await this.maxPrice.fill(criteria.maxPrice);
    if (criteria.distance !== undefined) await this.distance.selectOption(criteria.distance);
  }
}
