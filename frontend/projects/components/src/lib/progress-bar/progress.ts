import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnInit,
  computed,
  inject,
  input,
  isDevMode,
} from '@angular/core';

/** Where the task stands. An ended bar is never indeterminate (D-3). */
export type ProgressStatus = 'running' | 'success' | 'danger';

/**
 * The progress bar track and fill (progress-bar.md). The host is the native `<div>` with
 * `.progress` and `role="progressbar"` (D-1); it is named by `aria-label` or `aria-labelledby`.
 */
@Component({
  selector: 'div[hp-progress]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'progress',
    role: 'progressbar',
    '[class.progress--indeterminate]': 'indeterminate()',
    '[class.progress--success]': "status() === 'success'",
    '[class.progress--danger]': "status() === 'danger'",
    '[attr.aria-valuemin]': 'indeterminate() ? null : 0',
    '[attr.aria-valuemax]': 'indeterminate() ? null : safeMax()',
    '[attr.aria-valuenow]': 'valueNow()',
    '[attr.aria-valuetext]': 'valueText()',
  },
  template: `<div class="progress__bar" [style.--value]="percent()"></div>`,
  styles: `
    :host {
      --progress-fill: var(--color-accent);
      display: block;
      box-sizing: border-box;
      width: 100%;
      height: var(--space-2);
      border-radius: var(--radius-full);
      background: var(--color-bg-subtle-hover);
      overflow: hidden;
    }

    .progress__bar {
      height: 100%;
      width: var(--value, 0%);
      background: var(--progress-fill);
      border-radius: inherit;
      transition: width var(--duration-deliberate) var(--ease-standard);
    }

    :host(.progress--indeterminate) .progress__bar {
      width: 40%;
      transition: none;
      animation: indeterminate var(--duration-loop-shimmer) var(--ease-standard) infinite;
      animation-play-state: var(--motion-loop-state);
    }

    :host(.progress--success) {
      --progress-fill: var(--color-success-solid);
    }

    :host(.progress--danger) {
      --progress-fill: var(--color-danger-solid);
    }

    :host-context(.toast) {
      --progress-fill: var(--color-fg-inverse);
    }

    @keyframes indeterminate {
      from {
        translate: -100% 0;
      }
      to {
        translate: 350% 0;
      }
    }

    /* Reduced motion pauses the sweep through --motion-loop-state; a paused first frame sits
       off the track, so the segment rests still at the track's start instead. */
    @media (prefers-reduced-motion: reduce) {
      :host(.progress--indeterminate) .progress__bar {
        animation: none;
      }
    }

    @media (forced-colors: active) {
      :host {
        outline: var(--border-width-hairline) solid CanvasText;
      }

      .progress__bar {
        forced-color-adjust: none;
        background: Highlight;
      }
    }
  `,
})
export class Progress implements OnInit {
  /** Progress from 0 to `max`; null means the length is unknown. Clamped to 0–`max`. */
  readonly value = input<number | null>(null);
  /** `aria-valuemax`; the countable unit when a count reads better than a percentage. */
  readonly max = input<number>(100);
  /** `success` adds `.progress--success`, `danger` adds `.progress--danger`. */
  readonly status = input<ProgressStatus>('running');
  /** `aria-valuetext` ("2 of 3 photos"); null leaves assistive technology to read the number. */
  readonly valueText = input<string | null>(null);

  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;

  protected readonly safeMax = computed(() => {
    const max = this.max();
    return Number.isFinite(max) && max > 0 ? max : 100;
  });

  protected readonly indeterminate = computed(
    () => this.value() === null && this.status() === 'running',
  );

  /** The reached value; an ended task with an unknown length shows a full bar (D-3). */
  protected readonly valueNow = computed(() => {
    const value = this.value();
    const max = this.safeMax();
    if (value === null) {
      return this.status() === 'running' ? null : max;
    }
    return Math.min(Math.max(value, 0), max);
  });

  protected readonly percent = computed(() => {
    const now = this.valueNow();
    if (now === null) {
      return null;
    }
    return `${Math.round((now / this.safeMax()) * 10000) / 100}%`;
  });

  ngOnInit(): void {
    if (
      isDevMode() &&
      !this.host.closest('hp-progress-field') &&
      !this.host.hasAttribute('aria-label') &&
      !this.host.hasAttribute('aria-labelledby')
    ) {
      console.error(
        'hp-progress: a progress bar needs an accessible name. Add aria-label naming the task (for example aria-label="Uploading braids-front.jpg") or aria-labelledby, or use hp-progress-field.',
      );
    }
  }
}
