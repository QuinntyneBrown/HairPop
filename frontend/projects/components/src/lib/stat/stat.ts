import {
  ChangeDetectionStrategy,
  Component,
  booleanAttribute,
  computed,
  input,
} from '@angular/core';

import { Icon } from '../icon/icon';
import { IconName } from '../icon/icons';
import { Skeleton } from '../skeleton/skeleton';

/** Direction of a stat's change: `up` is better, `down` is worse (D-6). */
export type StatTrend = 'up' | 'down';

/**
 * One figure with presence: a label, a large value and an optional delta in words (stat.md).
 * The host is the native `<div>` and carries `.stat` (D-1). The arrow only reinforces the words.
 */
@Component({
  selector: 'div[hp-stat]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon, Skeleton],
  host: {
    class: 'stat',
    '[attr.aria-hidden]': "loading() ? 'true' : null",
  },
  template: `
    @if (loading()) {
      <span class="stat__label"><span hp-skeleton shape="text" width="60%"></span></span>
      <span class="stat__value"><span hp-skeleton shape="text" width="40%"></span></span>
    } @else {
      <span class="stat__label">{{ label() }}</span>
      <span class="stat__value">{{ value() }}</span>
      @if (delta()) {
        <span
          class="stat__delta"
          [class.stat__delta--up]="trend() === 'up'"
          [class.stat__delta--down]="trend() === 'down'"
        >
          @if (arrow(); as arrow) {
            <svg hp-icon [name]="arrow" size="sm"></svg>
          }
          {{ delta() }}
        </span>
      }
    }
  `,
  styles: `
    :host {
      display: flex;
      flex-direction: column;
      gap: var(--space-1);
    }

    .stat__label {
      font: var(--text-label);
      color: var(--color-fg-muted);
    }

    .stat__value {
      font: var(--text-h2);
      font-variant-numeric: tabular-nums;
      color: var(--color-fg-default);
      overflow-wrap: anywhere;
    }

    .stat__delta {
      font: var(--text-body-sm);
      display: inline-flex;
      align-items: center;
      gap: var(--space-1);
    }

    .stat__delta--up {
      color: var(--color-success-fg);
    }

    .stat__delta--down {
      color: var(--color-danger-fg);
    }

    /* Loading bars sit inside the line boxes so the stat keeps its loaded height. */
    .stat__label .skeleton,
    .stat__value .skeleton {
      display: inline-block;
      vertical-align: middle;
      margin-block: 0;
    }
  `,
})
export class Stat {
  /** What the figure is ("Requests this month"). */
  readonly label = input.required<string>();
  /** The formatted value ("24", "3 h", "1,284"); "0" is a value. */
  readonly value = input.required<string>();
  /** The change in words ("+6 from September"); omitted when null. */
  readonly delta = input<string | null>(null);
  /** Better (`up`) or worse (`down`); null adds no modifier and no arrow. Requires `delta`. */
  readonly trend = input<StatTrend | null>(null);
  /** Hides the stat from assistive technology and shows skeleton bars; no delta. */
  readonly loading = input(false, { transform: booleanAttribute });

  protected readonly arrow = computed<IconName | null>(() => {
    const trend = this.trend();
    return trend === 'up' ? 'arrow-up' : trend === 'down' ? 'arrow-down' : null;
  });
}
