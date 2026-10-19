import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormField, Textarea } from '@hairpop/components';

import { Example } from '../shared';

const LONG_REVIEW =
  'Nia explained each step and the braids feel comfortable. She checked the parting twice, ' +
  'kept the tension gentle around my edges and told me how to wrap my hair at night. ' +
  'The appointment took about five hours, right in the estimate, and the price matched ' +
  'what she quoted. I already booked my next visit and would recommend her to anyone in ' +
  'Toronto looking for neat, lightweight knotless braids that last.';

/** Stories for the textarea: variants, the counter and every state. */
@Component({
  selector: 'hp-textarea-examples',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Example, FormField, Textarea],
  template: `
    <hp-example heading="Default" description="Fixed starting height; drag taller.">
      <div class="story-form">
        <div hp-form-field label="Hair details">
          <textarea hp-textarea rows="3" [value]="hairDetails"></textarea>
        </div>
      </div>
    </hp-example>

    <hp-example
      heading="Auto-grow with counter"
      description="Grows with the text from 100 px up to 240 px; type to see the counter."
    >
      <div class="story-form">
        <div
          hp-form-field
          label="Your review"
          hint="What should others know about your visit?"
          [maxLength]="500"
          [counterText]="counterText"
        >
          <textarea hp-textarea autoGrow [value]="review"></textarea>
        </div>
      </div>
    </hp-example>

    <hp-example heading="Optional with counter">
      <div class="story-form">
        <div
          hp-form-field
          label="Hair details"
          optionalMarker="(optional)"
          [maxLength]="200"
          [counterText]="counterText"
        >
          <textarea hp-textarea autoGrow></textarea>
        </div>
      </div>
    </hp-example>

    <hp-example heading="Invalid" description="An explicit error shows at once.">
      <div class="story-form">
        <div
          hp-form-field
          label="Your review"
          error="Write a few words about your visit with Nia."
          [maxLength]="500"
          [counterText]="counterText"
        >
          <textarea hp-textarea autoGrow></textarea>
        </div>
      </div>
    </hp-example>

    <hp-example
      heading="Over limit"
      description="The counter turns danger; every character is kept."
    >
      <div class="story-form">
        <div
          hp-form-field
          label="Reason"
          error="Shorten this to 200 characters or fewer."
          [maxLength]="200"
          [counterText]="counterText"
        >
          <textarea hp-textarea autoGrow [value]="longReview"></textarea>
        </div>
      </div>
    </hp-example>

    <hp-example heading="Capped" description="Auto-grow stops at 240 px; the text scrolls inside.">
      <div class="story-form">
        <div hp-form-field label="Your review">
          <textarea hp-textarea autoGrow [value]="longReview + ' ' + longReview"></textarea>
        </div>
      </div>
    </hp-example>

    <hp-example heading="Read-only and disabled">
      <div class="story-form">
        <div hp-form-field label="Your review">
          <textarea hp-textarea readonly [value]="short"></textarea>
        </div>
        <div hp-form-field label="Your review">
          <textarea hp-textarea disabled [value]="short"></textarea>
        </div>
      </div>
    </hp-example>
  `,
  styles: `
    .story-form {
      flex: 1 1 100%;
      display: flex;
      flex-direction: column;
      gap: var(--space-4);
      max-width: var(--layout-form-max);
    }
  `,
})
export class TextareaExamples {
  protected readonly hairDetails = 'Shoulder length; bringing my own extensions';
  protected readonly review = 'Nia explained each step and the braids feel comfortable.';
  protected readonly short = 'Comfortable and neat.';
  protected readonly longReview = LONG_REVIEW;
  protected readonly counterText = (count: number, max: number): string =>
    `${count} of ${max} characters`;
}
