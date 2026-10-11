import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { Badge, Button } from '@hairpop/components';

import { Example } from '../shared';

/** Stories for the badge (badge.md): every tone, solid emphasis and the unread count. */
@Component({
  selector: 'hp-badge-examples',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Badge, Button, Example],
  template: `
    <hp-example heading="Tones" description="Neutral is the base look.">
      <span hp-badge>Completed</span>
      <span hp-badge tone="info">Unread</span>
      <span hp-badge tone="success">Confirmed</span>
      <span hp-badge tone="warning">Awaiting reply</span>
      <span hp-badge tone="danger">Cancelled</span>
    </hp-example>

    <hp-example
      heading="Appointment lifecycle"
      description="The statuses HP-1048 and HP-0992 move through."
    >
      <span hp-badge tone="warning">Awaiting reply</span>
      <span hp-badge tone="success">Confirmed</span>
      <span hp-badge>Completed</span>
      <span hp-badge tone="danger">Cancelled</span>
      <span hp-badge tone="danger">Declined</span>
    </hp-example>

    <hp-example heading="Solid" description="Emphasis on media or a busy card; ignores the tone.">
      <span hp-badge solid>New</span>
      <span hp-badge solid tone="danger">New</span>
    </hp-example>

    <hp-example heading="Count" description="Above max shows “99+”; zero or less hides the badge.">
      <span hp-badge [count]="2"></span>
      <span hp-badge [count]="12"></span>
      <span hp-badge [count]="120"></span>
      <span hp-badge [count]="12" [max]="9"></span>
      <span hp-badge [count]="0"></span>
    </hp-example>

    <hp-example
      heading="Count in a link"
      description="Hidden text after the badge gives the number its meaning."
    >
      <a class="account-link" href="#notifications"
        >Updates <span hp-badge [count]="unread()"></span>
        @if (unread() > 0) {
          <span class="visually-hidden">, {{ unread() }} unread</span>
        }
      </a>
      <button hp-button size="sm" (click)="unread.set(unread() + 1)">New update</button>
      <button hp-button size="sm" (click)="unread.set(0)">Mark all read</button>
      <button hp-button size="sm" (click)="unread.set(120)">Set to 120</button>
    </hp-example>

    <hp-example heading="Number as tone content" description="A plain count inside a tab label.">
      <span class="label">Upcoming <span hp-badge tone="info">1</span></span>
      <span class="label">Past <span hp-badge>3</span></span>
      <span class="label">Reviews <span hp-badge>86</span></span>
    </hp-example>

    <hp-example heading="Narrow container" description="The label wraps inside the pill.">
      <div class="narrow">
        <span hp-badge tone="warning">Awaiting reply from Amara Nkiruka Adeyemi-Williams</span>
      </div>
    </hp-example>
  `,
  styles: `
    .account-link,
    .label {
      display: inline-flex;
      align-items: center;
      gap: var(--space-2);
      font: var(--text-label);
      color: var(--color-fg-default);
    }

    .narrow {
      max-width: var(--space-24);
    }
  `,
})
export class BadgeExamples {
  protected readonly unread = signal(2);
}
