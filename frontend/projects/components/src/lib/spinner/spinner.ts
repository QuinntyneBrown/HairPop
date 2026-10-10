import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  InjectionToken,
  afterNextRender,
  booleanAttribute,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';

/** Spinner sizes. `md` is the base `.spinner` ring. */
export type SpinnerSize = 'sm' | 'md' | 'lg';

/** When a spinner reveals and how long it stays once revealed. */
export interface SpinnerTiming {
  /** Delay before the ring paints after `active` becomes true. */
  showDelayMs: number;
  /** Minimum time the ring stays visible once revealed. */
  minVisibleMs: number;
}

/**
 * Spinner timing. The default follows the design-system *States* rules for the spinner:
 * show after about 300 ms, and once shown stay at least 500 ms. Applications never override
 * it; the perf-test scenario sets both to zero so the ring renders in the measured frame (D-9).
 */
export const SPINNER_TIMING = new InjectionToken<SpinnerTiming>('SPINNER_TIMING', {
  providedIn: 'root',
  factory: () => ({ showDelayMs: 300, minVisibleMs: 500 }),
});

/**
 * A turning ring with text that names the work, inside a polite status region (spinner.md).
 * The host is the `role="status"` region from the first render; the ring and label are
 * written into it only when the spinner reveals (D-3).
 */
@Component({
  selector: 'hp-spinner',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    role: 'status',
    '[class.spinner-inline]': 'inline()',
  },
  // Kept compact: whitespace around the inline label would become part of its text.
  // prettier-ignore
  template: `@if (revealed()) {<span class="spinner" [class.spinner--sm]="size() === 'sm'" [class.spinner--lg]="size() === 'lg'" aria-hidden="true"></span>@if (inline()) {{{ label() }}} @else {<span class="visually-hidden">{{ label() }}</span>}}`,
  styles: `
    :host {
      display: inline;
    }

    :host(.spinner-inline) {
      display: inline-flex;
      align-items: center;
      gap: var(--space-2);
      max-width: 100%;
      font: var(--text-body-sm);
      color: var(--color-fg-muted);
    }

    .spinner {
      --spinner-size: 1.25rem;
      display: inline-block;
      box-sizing: border-box;
      width: var(--spinner-size);
      height: var(--spinner-size);
      border: var(--border-width-thick) solid var(--color-border-default);
      border-top-color: var(--color-accent);
      border-radius: var(--radius-full);
      animation: spin var(--duration-loop-spin) linear infinite;
      flex: none;
      vertical-align: middle;
    }

    .spinner--sm {
      --spinner-size: 1rem;
    }

    .spinner--lg {
      --spinner-size: 2.5rem;
      border-width: calc(var(--border-width-thick) * 1.5);
    }

    :host-context(.toast) .spinner {
      border-color: var(--color-border-inverse);
      border-top-color: var(--color-fg-inverse);
    }

    @keyframes spin {
      to {
        rotate: 360deg;
      }
    }

    @media (forced-colors: active) {
      .spinner,
      :host-context(.toast) .spinner {
        forced-color-adjust: none;
        border-color: GrayText;
        border-top-color: Highlight;
      }
    }
  `,
})
export class Spinner {
  /** Names the work: "Loading Nia’s reviews". Written into the region when the spinner reveals. */
  readonly label = input.required<string>();
  /** Ring size: adds `.spinner--sm` or `.spinner--lg`; md adds no modifier. */
  readonly size = input<SpinnerSize>('md');
  /** Ring plus visible label in one row (`.spinner-inline` on the host). */
  readonly inline = input(false, { transform: booleanAttribute });
  /** Whether the work is in progress; drives the show delay and minimum visible time (D-2). */
  readonly active = input(true, { transform: booleanAttribute });

  /** Whether the ring and label are painted. */
  protected readonly revealed = signal(false);

  private readonly timing = inject(SPINNER_TIMING);
  /** True once the browser has rendered; the server never starts timers. */
  private readonly inBrowser = signal(false);
  private showTimer: ReturnType<typeof setTimeout> | undefined;
  private hideTimer: ReturnType<typeof setTimeout> | undefined;
  private revealedAt = 0;

  constructor() {
    afterNextRender(() => this.inBrowser.set(true));

    effect(() => {
      if (!this.inBrowser()) {
        return;
      }
      if (this.active()) {
        this.cancelHide();
        if (!this.revealed() && this.showTimer === undefined) {
          this.scheduleReveal();
        }
      } else {
        this.cancelShow();
        if (this.revealed() && this.hideTimer === undefined) {
          this.scheduleHide();
        }
      }
    });

    inject(DestroyRef).onDestroy(() => {
      this.cancelShow();
      this.cancelHide();
    });
  }

  private scheduleReveal(): void {
    const reveal = (): void => {
      this.showTimer = undefined;
      this.revealedAt = performance.now();
      this.revealed.set(true);
    };
    if (this.timing.showDelayMs <= 0) {
      reveal();
    } else {
      this.showTimer = setTimeout(reveal, this.timing.showDelayMs);
    }
  }

  private scheduleHide(): void {
    const hide = (): void => {
      this.hideTimer = undefined;
      this.revealed.set(false);
    };
    const remaining = this.timing.minVisibleMs - (performance.now() - this.revealedAt);
    if (remaining <= 0) {
      hide();
    } else {
      this.hideTimer = setTimeout(hide, remaining);
    }
  }

  private cancelShow(): void {
    if (this.showTimer !== undefined) {
      clearTimeout(this.showTimer);
      this.showTimer = undefined;
    }
  }

  private cancelHide(): void {
    if (this.hideTimer !== undefined) {
      clearTimeout(this.hideTimer);
      this.hideTimer = undefined;
    }
  }
}
