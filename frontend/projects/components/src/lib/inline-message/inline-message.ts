import {
  ChangeDetectionStrategy,
  Component,
  booleanAttribute,
  computed,
  input,
} from '@angular/core';

/** Which message an inline message is: a field hint, a field error, a character counter or a short status. */
export type InlineMessageKind = 'hint' | 'error' | 'counter' | 'status';

/** Colour of a status message. Ignored for every other kind. */
export type InlineMessageTone = 'neutral' | 'success' | 'warning' | 'danger';

/**
 * A small, non-interactive message placed right next to what it describes:
 * a field's hint, error or counter, or a status beside a form's actions.
 * The host is the native `<span>` or `<p>`, so it carries the classes and the id.
 */
@Component({
  selector: 'span[hp-inline-message], p[hp-inline-message]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.field__help]': "kind() === 'hint'",
    '[class.field__error]': "kind() === 'error'",
    '[class.field__counter]': "kind() === 'counter'",
    '[class.inline-status]': 'isStatus()',
    '[class.inline-status--success]': "isStatus() && tone() === 'success'",
    '[class.inline-status--warning]': "isStatus() && tone() === 'warning'",
    '[class.inline-status--danger]': "isStatus() && tone() === 'danger'",
    '[attr.data-over]': "kind() === 'counter' && over() ? 'true' : null",
    '[attr.role]': "isStatus() && live() ? 'status' : null",
  },
  template: `@if (isStatus() && progress()) {
      <span class="dot dot--pulse" aria-hidden="true"></span>
    }
    <ng-content />`,
  styles: `
    :host {
      overflow-wrap: anywhere;
    }

    :host(.field__help) {
      font: var(--text-body-sm);
      color: var(--color-fg-muted);
    }

    :host(.field__error) {
      display: flex;
      gap: var(--space-1);
      align-items: flex-start;
      font: var(--text-body-sm);
      color: var(--color-danger-fg);
    }

    :host(.field__error)::before {
      content: '⚠';
      content: '⚠' / '';
      flex: none;
    }

    :host(.field__counter) {
      font: var(--text-caption);
      color: var(--color-fg-subtle);
      text-align: right;
      font-variant-numeric: tabular-nums;
    }

    :host(.field__counter[data-over='true']) {
      color: var(--color-danger-fg);
    }

    :host(.inline-status) {
      display: inline-flex;
      align-items: center;
      gap: var(--space-2);
      margin: 0;
      font: var(--text-body-sm);
      color: var(--color-fg-muted);
    }

    :host(.inline-status--success) {
      color: var(--color-success-fg);
    }

    :host(.inline-status--warning) {
      color: var(--color-warning-fg);
    }

    :host(.inline-status--danger) {
      color: var(--color-danger-fg);
    }

    :host(.inline-status) ::ng-deep > .icon {
      flex: none;
      color: currentColor;
    }

    .dot {
      width: 0.5rem;
      height: 0.5rem;
      border-radius: var(--radius-full);
      background: currentColor;
      flex: none;
    }

    .dot--pulse {
      animation: pulse var(--duration-loop-pulse) var(--ease-standard) infinite;
      animation-play-state: var(--motion-loop-state);
    }

    @media (prefers-reduced-motion: reduce) {
      .dot--pulse {
        animation: none;
        opacity: 1;
      }
    }

    @media (forced-colors: active) {
      .dot {
        background: CanvasText;
      }
    }

    @keyframes pulse {
      0%,
      100% {
        opacity: 1;
      }
      50% {
        opacity: 0.35;
      }
    }
  `,
})
export class InlineMessage {
  /** Adds `.field__help`, `.field__error`, `.field__counter` or `.inline-status`. */
  readonly kind = input<InlineMessageKind>('hint');
  /** Status only: adds `.inline-status--success`, `--warning` or `--danger`. */
  readonly tone = input<InlineMessageTone>('neutral');
  /** Status only: renders the pulsing dot before the text. */
  readonly progress = input(false, { transform: booleanAttribute });
  /** Status only: `role="status"` from the first render so text changes are announced politely. */
  readonly live = input(true, { transform: booleanAttribute });
  /** Counter only: sets `data-over="true"`. */
  readonly over = input(false, { transform: booleanAttribute });

  protected readonly isStatus = computed(() => this.kind() === 'status');
}
