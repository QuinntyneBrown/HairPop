import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  input,
  isDevMode,
} from '@angular/core';

import { Icon } from '../icon/icon';

const averageFormat = new Intl.NumberFormat('en-CA', {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});
const wholeFormat = new Intl.NumberFormat('en-CA', { maximumFractionDigits: 0 });
const countFormat = new Intl.NumberFormat('en-CA');

/**
 * A braider's score from published reviews with the count behind it, the score of one review,
 * or the honest unrated state (rating-summary.md, L2-008). The visual group is hidden from
 * assistive technology and one sentence is read instead.
 */
@Component({
  selector: 'span[hp-rating-summary]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon],
  host: {
    class: 'rating',
    '[class.rating--unrated]': 'unrated()',
  },
  template: `@if (unrated()) {
      {{ unratedText() }}
    } @else {
      <span aria-hidden="true" class="rating__visual"
        ><svg hp-icon name="star" size="sm" fill class="rating__star"></svg
        ><span class="rating__value">{{ valueText() }}</span>
        @if (countText(); as count) {
          <span class="rating__count">· {{ count }}</span>
        }</span
      ><span class="visually-hidden">{{ spoken() }}</span>
    }`,
  styles: `
    :host {
      --rating-star: var(--color-warning-icon);
      display: inline-flex;
      flex-wrap: wrap;
      align-items: center;
      gap: var(--space-1);
      font: var(--text-body-sm);
      color: var(--color-fg-muted);
    }

    :host(.rating--unrated) {
      font-style: italic;
    }

    .rating__visual {
      display: inline-flex;
      flex-wrap: wrap;
      align-items: center;
      gap: var(--space-1);
    }

    .rating__star {
      color: var(--rating-star);
    }

    .rating__value {
      font: var(--text-label);
      color: var(--color-fg-default);
      font-variant-numeric: tabular-nums;
    }

    .rating__count {
      font-variant-numeric: tabular-nums;
    }

    @media (forced-colors: active) {
      .rating__star {
        color: CanvasText;
      }
    }
  `,
})
export class RatingSummary {
  /** Average of published reviews, 1–5; null means unrated. */
  readonly value = input.required<number | null>();
  /** Number of published reviews; null renders score only (one review); 0 is unrated (D-1). */
  readonly count = input<number | null>(null);
  /** Visible and spoken unrated copy. */
  readonly unratedText = input('Not yet rated');

  private readonly outOfRange = computed(() => {
    const value = this.value();
    return value !== null && (value < 1 || value > 5 || Number.isNaN(value));
  });

  protected readonly unrated = computed(
    () => this.value() === null || this.count() === 0 || this.outOfRange(),
  );

  protected readonly valueText = computed(() => {
    const value = this.value() ?? 0;
    return this.count() === null ? wholeFormat.format(value) : averageFormat.format(value);
  });

  protected readonly countText = computed(() => {
    const count = this.count();
    if (count === null) return null;
    return `${countFormat.format(count)} ${count === 1 ? 'review' : 'reviews'}`;
  });

  protected readonly spoken = computed(() => {
    const count = this.countText();
    return `Rated ${this.valueText()} out of 5${count ? ` from ${count}` : ''}`;
  });

  constructor() {
    if (isDevMode()) {
      effect(() => {
        if (this.outOfRange()) {
          console.error(
            `hp-rating-summary: value ${this.value()} is outside 1–5; rendering the unrated state (D-3).`,
          );
        }
      });
    }
  }
}
