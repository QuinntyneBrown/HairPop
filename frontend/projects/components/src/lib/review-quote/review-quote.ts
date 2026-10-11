import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { RatingSummary } from '../rating-summary/rating-summary';

const dateFormat = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  timeZone: 'UTC',
});

/**
 * One published review (review-quote.md): its score and date, the customer's words, and who
 * wrote it and for which service. The text is interpolated, never rendered as HTML (L2-039).
 */
@Component({
  selector: 'figure[hp-review-quote]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RatingSummary],
  host: { class: 'review' },
  template: `
    <div class="review__header">
      <span hp-rating-summary [value]="rating()"></span>
      <time class="review__date" [attr.datetime]="date()">{{ dateText() }}</time>
    </div>
    <blockquote class="review__quote">
      <p>{{ text() }}</p>
    </blockquote>
    <figcaption class="review__author">{{ author() }} · {{ service() }}</figcaption>
  `,
  styles: `
    :host {
      display: flex;
      flex-direction: column;
      gap: var(--space-2);
      margin: 0;
      padding-block: var(--space-4);
      border-bottom: var(--border-width-hairline) solid var(--color-border-default);
    }

    :host(:last-of-type) {
      border-bottom: 0;
    }

    .review__header {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: var(--space-2);
    }

    .review__date {
      font: var(--text-caption);
      color: var(--color-fg-subtle);
    }

    .review__quote {
      margin: 0;
      padding: 0;
      border: 0;
      font: var(--text-body);
      color: var(--color-fg-default);
      overflow-wrap: anywhere;
    }

    .review__quote p {
      margin: 0;
    }

    .review__author {
      font: var(--text-body-sm);
      color: var(--color-fg-muted);
    }
  `,
})
export class ReviewQuote {
  /** The review's score, 1–5, shown as the score only. */
  readonly rating = input.required<number>();
  /** ISO date `YYYY-MM-DD`: the `datetime` attribute, shown as "3 Oct 2026". */
  readonly date = input.required<string>();
  /** The review's words. */
  readonly text = input.required<string>();
  /** The published reviewer name. */
  readonly author = input.required<string>();
  /** The booked service's name. */
  readonly service = input.required<string>();

  protected readonly dateText = computed(() => dateFormat.format(new Date(this.date())));
}
