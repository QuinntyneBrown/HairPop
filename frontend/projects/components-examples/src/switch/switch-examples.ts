import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { Switch } from '@hairpop/components';

import { Example } from '../shared';

/** Stories for the switch (switch.md): layouts, states and a reverted save. */
@Component({
  selector: 'hp-switch-examples',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Example, Switch],
  template: `
    <hp-example heading="Inline" description="Label after the switch; applies at once.">
      <label hp-switch [(checked)]="emailMe">Email me when Nia replies</label>
      <span class="story-note">{{ emailMe() ? 'On' : 'Off' }}</span>
    </hp-example>

    <hp-example heading="Off and on">
      <label hp-switch>Reminders</label>
      <label hp-switch checked>Email updates</label>
    </hp-example>

    <hp-example heading="Disabled">
      <label hp-switch disabled>Reminders</label>
      <label hp-switch disabled checked>Email updates</label>
    </hp-example>

    <hp-example
      heading="Settings row with description"
      description="Label first, switch at the end; the description says what “on” means."
    >
      <div class="story-block">
        <label
          hp-switch
          layout="row"
          description="A text the day before Sat 24 Oct at 10:00 am."
          [(checked)]="reminders"
          >Appointment reminders</label
        >
        <label hp-switch layout="row" checked>Email me when Nia replies</label>
      </div>
    </hp-example>

    <hp-example
      heading="Reverted"
      description="The page writes the saved value back after a failed save; no event is emitted."
    >
      <label hp-switch [checked]="saved()" (checkedChange)="save($event)"
        >Appointment reminders</label
      >
      <span class="story-note" role="status">{{ status() }}</span>
    </hp-example>
  `,
  styles: `
    .story-block {
      flex: 1 1 100%;
      min-width: 0;
      display: flex;
      flex-direction: column;
      gap: var(--space-2);
    }

    .story-note {
      font: var(--text-body-sm);
      color: var(--color-fg-muted);
    }
  `,
})
export class SwitchExamples {
  protected readonly emailMe = signal(true);
  protected readonly reminders = signal(false);
  protected readonly saved = signal(false);
  protected readonly status = signal('');

  /** Applies the change optimistically, then writes the saved value back as if the save failed. */
  protected save(next: boolean): void {
    this.saved.set(next);
    this.status.set('Saving…');
    setTimeout(() => {
      this.saved.set(!next);
      this.status.set('Couldn’t save. Reminders are back to how they were.');
    }, 800);
  }
}
