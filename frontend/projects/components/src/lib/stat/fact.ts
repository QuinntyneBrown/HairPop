import {
  ChangeDetectionStrategy,
  Component,
  booleanAttribute,
  computed,
  input,
} from '@angular/core';

import { Skeleton } from '../skeleton/skeleton';

/**
 * One fact tile: a short formatted value over its label (stat.md). The host is the native
 * `<div>` and carries `.fact`, so a fact grid places it directly (D-1). A fact with no value
 * omits itself with `hidden` (D-3); a loading tile keeps its loaded height with skeleton bars (D-5).
 */
@Component({
  selector: 'div[hp-fact]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Skeleton],
  host: {
    class: 'fact',
    '[attr.hidden]': "omitted() ? '' : null",
    '[attr.aria-hidden]': "loading() ? 'true' : null",
  },
  template: `
    @if (loading()) {
      <span class="fact__value"><span hp-skeleton shape="text" width="60%"></span></span>
      <span class="fact__label"><span hp-skeleton shape="text" width="80%"></span></span>
    } @else if (!omitted()) {
      <span class="fact__value">{{ value() }}</span>
      <span class="fact__label">{{ label() }}</span>
    }
  `,
  styles: `
    :host {
      display: flex;
      flex-direction: column;
      gap: var(--space-0-5);
      padding: var(--space-3);
      border-radius: var(--radius-md);
      background: var(--color-bg-subtle);
      min-width: 0;
    }

    :host([hidden]) {
      display: none;
    }

    /* Theming: on a sunken well the tile takes the surface fill. */
    :host-context(.well) {
      background: var(--color-bg-surface);
    }

    .fact__value {
      font: var(--text-h4);
      font-variant-numeric: tabular-nums;
      color: var(--color-fg-default);
      overflow-wrap: anywhere;
    }

    .fact__label {
      font: var(--text-body-sm);
      color: var(--color-fg-muted);
      overflow-wrap: anywhere;
    }

    /* D-5: one bar inside each line box keeps the loaded height; the tile's fill is the
       skeleton's own base, so the bar's gradient runs one step lighter. */
    .fact__value .skeleton,
    .fact__label .skeleton {
      display: inline-block;
      vertical-align: middle;
      margin-block: 0;
      background-image: linear-gradient(
        90deg,
        var(--color-bg-subtle-hover) 25%,
        var(--color-bg-surface) 37%,
        var(--color-bg-subtle-hover) 63%
      );
    }

    /* D-7: tiles stay distinct when forced colours remove the fill. */
    @media (forced-colors: active) {
      :host {
        border: var(--border-width-hairline) solid CanvasText;
      }
    }
  `,
})
export class Fact {
  /** The formatted value ("4–7 hours"). Null, empty or blank omits the tile (D-3). */
  readonly value = input.required<string | null>();
  /** What the value measures ("Typical time"). */
  readonly label = input.required<string>();
  /** Renders the loading tile: hidden from assistive technology, skeleton bars in both lines. */
  readonly loading = input(false, { transform: booleanAttribute });

  protected readonly omitted = computed(() => {
    if (this.loading()) {
      return false;
    }
    const value = this.value();
    return value === null || value === undefined || value.trim() === '';
  });
}
