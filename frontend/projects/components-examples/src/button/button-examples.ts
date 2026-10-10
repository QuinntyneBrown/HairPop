import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { Button, Icon } from '@hairpop/components';

import { Example } from '../shared';

/** Stories for the button (button.md): every variant, size and state. */
@Component({
  selector: 'hp-button-examples',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Button, Example, Icon],
  template: `
    <hp-example heading="Variants" description="Secondary is the default emphasis.">
      <button hp-button variant="primary">Request booking</button>
      <button hp-button>Message Nia</button>
      <button hp-button variant="ghost">Save style</button>
      <button hp-button variant="link">View all reviews</button>
      <button hp-button variant="danger">Cancel appointment</button>
    </hp-example>

    <hp-example heading="Sizes">
      <button hp-button variant="primary" size="sm">Book</button>
      <button hp-button variant="primary">Book</button>
      <button hp-button variant="primary" size="lg">Book</button>
    </hp-example>

    <hp-example heading="With icon">
      <button hp-button variant="primary">
        <svg hp-icon name="calendar"></svg>
        Choose a date
      </button>
      <button hp-button iconOnly aria-label="Filter braiders">
        <svg hp-icon name="filter"></svg>
      </button>
    </hp-example>

    <hp-example heading="States">
      <button hp-button variant="primary" disabled>Request booking</button>
      <button hp-button variant="primary" busy>Request booking</button>
      <button hp-button [(pressed)]="saved">
        <svg hp-icon name="star"></svg>
        {{ saved() ? 'Saved' : 'Save' }}
      </button>
    </hp-example>

    <hp-example heading="Link host">
      <a hp-button variant="primary" href="#">See Nia’s profile</a>
    </hp-example>

    <hp-example heading="Block">
      <button hp-button variant="primary" block>Send request to Nia</button>
    </hp-example>
  `,
})
export class ButtonExamples {
  protected readonly saved = signal(false);
}
