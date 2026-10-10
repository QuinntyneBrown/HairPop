import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Progress, ProgressStatus } from './progress';

let nextLabelId = 0;

/**
 * A progress bar with its visible label, an optional count and an optional projected action
 * (progress-bar.md). The label names the bar through `aria-labelledby`.
 */
@Component({
  selector: 'hp-progress-field',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Progress],
  host: {
    class: 'progress-field',
  },
  template: `
    <div class="progress-field__label">
      <span [id]="labelId">{{ label() }}</span>
      @if (displayValue() !== null) {
        <output>{{ displayValue() }}</output>
      }
      <ng-content select="[slot=action]" />
    </div>
    <div
      hp-progress
      [attr.aria-labelledby]="labelId"
      [value]="value()"
      [max]="max()"
      [status]="status()"
      [valueText]="valueText()"
    ></div>
  `,
  styles: `
    :host {
      display: flex;
      flex-direction: column;
      gap: var(--space-1);
      min-width: 0;
    }

    .progress-field__label {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: var(--space-3);
      font: var(--text-label);
      color: var(--color-fg-default);
    }

    .progress-field__label > span {
      flex: 1 1 auto;
      min-width: 0;
      overflow-wrap: anywhere;
    }

    .progress-field__label output {
      color: var(--color-fg-muted);
      font-variant-numeric: tabular-nums;
      font-weight: var(--font-weight-regular);
    }
  `,
})
export class ProgressField {
  /** The visible label and the bar's name. */
  readonly label = input.required<string>();
  /** The `<output>` text ("2 of 3"); null renders no output. */
  readonly displayValue = input<string | null>(null);
  /** Progress from 0 to `max`; null means the length is unknown. */
  readonly value = input<number | null>(null);
  /** The bar's maximum. */
  readonly max = input<number>(100);
  /** Where the task stands. */
  readonly status = input<ProgressStatus>('running');
  /** `aria-valuetext` of the bar ("2 of 3 photos"). */
  readonly valueText = input<string | null>(null);

  protected readonly labelId = `hp-progress-label-${++nextLabelId}`;
}
