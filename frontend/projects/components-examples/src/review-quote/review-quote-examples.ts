import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ReviewQuote } from '@hairpop/components';

import { Example } from '../shared';

/** Stories for the review quote (review-quote.md): a review and one with long unbroken text. */
@Component({
  selector: 'hp-review-quote-examples',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Example, ReviewQuote],
  template: `
    <hp-example
      heading="Review"
      description="Score, date, the customer’s words, and who wrote it for which service."
    >
      <figure
        hp-review-quote
        [rating]="5"
        date="2026-10-03"
        text="The parts were so neat and Nia checked that nothing felt too tight."
        author="Maya Chen"
        service="Medium knotless braids"
      ></figure>
    </hp-example>

    <hp-example
      heading="Long text"
      description="Unbroken text wraps inside the card rather than scrolling the page."
    >
      <figure
        hp-review-quote
        [rating]="4"
        date="2026-09-26"
        text="Photos are at https://example.com/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa if you want to see."
        author="Kemi Adebayo"
        service="Passion twists"
      ></figure>
    </hp-example>
  `,
})
export class ReviewQuoteExamples {}
