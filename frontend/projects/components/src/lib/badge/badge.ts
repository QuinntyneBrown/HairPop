import {
  ChangeDetectionStrategy,
  Component,
  booleanAttribute,
  computed,
  input,
} from '@angular/core';

/** Badge tones. `neutral` is the base `.badge` look. */
export type BadgeTone = 'neutral' | 'info' | 'success' | 'warning' | 'danger';

/**
 * A read-only status label in a word or two, or an unread count (badge.md). The host is the
 * native `<span>` and carries the `.badge` classes and the `hidden` attribute (D-1).
 */
@Component({
  selector: 'span[hp-badge]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'badge',
    '[class.badge--info]': "toneClass() === 'info'",
    '[class.badge--success]': "toneClass() === 'success'",
    '[class.badge--warning]': "toneClass() === 'warning'",
    '[class.badge--danger]': "toneClass() === 'danger'",
    '[class.badge--solid]': 'isSolid()',
    '[class.badge--count]': 'isCount()',
    '[attr.hidden]': 'isHidden() ? "" : null',
  },
  // Kept on one line: whitespace around the count would become part of its text.
  // prettier-ignore
  template: `<ng-content />@if (isCount() && !isHidden()) {{{ display() }}}`,
  styles: `
    :host {
      --badge-bg: var(--color-bg-subtle);
      --badge-fg: var(--color-fg-muted);
      --badge-height: 1.5rem;
      display: inline-flex;
      align-items: center;
      gap: var(--space-1);
      box-sizing: border-box;
      padding: 0 var(--space-2);
      min-height: var(--badge-height);
      width: fit-content;
      max-width: 100%;
      border-radius: var(--radius-full);
      font: var(--text-overline);
      letter-spacing: var(--letter-spacing-wide);
      text-transform: uppercase;
      text-align: center;
      white-space: normal;
      overflow-wrap: break-word;
      background: var(--badge-bg);
      color: var(--badge-fg);
    }

    :host::before {
      content: '';
      width: 0.5rem;
      height: 0.5rem;
      border-radius: var(--radius-full);
      background: currentColor;
      flex: none;
    }

    :host([hidden]) {
      display: none;
    }

    :host(.badge--info) {
      --badge-bg: var(--color-info-bg);
      --badge-fg: var(--color-info-fg);
    }

    :host(.badge--success) {
      --badge-bg: var(--color-success-bg);
      --badge-fg: var(--color-success-fg);
    }

    :host(.badge--warning) {
      --badge-bg: var(--color-warning-bg);
      --badge-fg: var(--color-warning-fg);
    }

    :host(.badge--danger) {
      --badge-bg: var(--color-danger-bg);
      --badge-fg: var(--color-danger-fg);
    }

    :host(.badge--solid) {
      --badge-bg: var(--color-info-solid);
      --badge-fg: var(--color-fg-on-accent);
    }

    :host(.badge--count) {
      --badge-bg: var(--color-danger-solid);
      --badge-fg: var(--color-fg-on-danger);
      min-width: var(--badge-height);
      justify-content: center;
      padding-inline: var(--space-1);
      font-variant-numeric: tabular-nums;
      letter-spacing: var(--letter-spacing-normal);
      white-space: nowrap;
      align-self: center;
    }

    :host(.badge--count)::before {
      display: none;
    }

    @media (forced-colors: active) {
      :host {
        border: var(--border-width-hairline) solid CanvasText;
        color: CanvasText;
      }

      :host::before {
        forced-color-adjust: none;
        background: CanvasText;
      }
    }
  `,
})
export class Badge {
  /** Tone: adds `.badge--{tone}`; neutral adds no modifier. Ignored when solid or a count. */
  readonly tone = input<BadgeTone>('neutral');
  /** Emphasis look (`.badge--solid`); ignores the tone (D-6). Ignored for a count. */
  readonly solid = input(false, { transform: booleanAttribute });
  /** When a number, the badge is the count form; 0 or less hides it (D-7). */
  readonly count = input<number | null>(null);
  /** Count form only: the largest number shown before `{max}+`. */
  readonly max = input<number>(99);

  protected readonly isCount = computed(() => this.count() !== null);
  protected readonly isSolid = computed(() => this.solid() && !this.isCount());
  protected readonly toneClass = computed(() =>
    this.isCount() || this.solid() ? null : this.tone(),
  );
  protected readonly isHidden = computed(() => {
    const count = this.count();
    return count !== null && Math.floor(count) <= 0;
  });
  protected readonly display = computed(() => {
    const count = Math.floor(this.count() ?? 0);
    const max = this.max();
    return count > max ? `${max}+` : String(count);
  });
}
