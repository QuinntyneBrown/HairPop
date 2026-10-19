import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ReviewQuote } from '@hairpop/components';

/** One of Nia's published reviews on her profile. */
@Component({
  selector: 'hp-review-quote-scenario',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReviewQuote],
  template: `
    <figure
      hp-review-quote
      [rating]="5"
      date="2026-10-03"
      text="The parts were so neat and Nia checked that nothing felt too tight."
      author="Maya Chen"
      service="Medium knotless braids"
    ></figure>
  `,
})
export default class ReviewQuoteScenario {}
