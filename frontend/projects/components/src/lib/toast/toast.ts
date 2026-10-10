import {
  ChangeDetectionStrategy,
  Component,
  DOCUMENT,
  DestroyRef,
  ElementRef,
  ViewEncapsulation,
  afterNextRender,
  booleanAttribute,
  computed,
  effect,
  inject,
  input,
  output,
  signal,
  untracked,
} from '@angular/core';

import { Icon } from '../icon/icon';
import { IconName } from '../icon/icons';

/** Toast tones. Danger goes to the assertive region. */
export type ToastTone = 'info' | 'success' | 'warning' | 'danger';

/** Why a toast component asks to leave. */
export type ToastCloseReason = 'timeout' | 'dismiss';

const TONE_ICONS: Record<ToastTone, IconName> = {
  info: 'info',
  success: 'check-circle',
  warning: 'warning',
  danger: 'alert-circle',
};

/** Reads `--duration-base` (the enter animation) from the host, in milliseconds. */
function enterDuration(el: HTMLElement): number {
  const raw = getComputedStyle(el).getPropertyValue('--duration-base').trim();
  const value = parseFloat(raw);
  if (Number.isNaN(value)) return 0;
  return raw.endsWith('ms') ? value : raw.endsWith('s') ? value * 1000 : value;
}

/**
 * One toast (toast.md). Rendered by `hp-toast-region`; applications call `ToastService`.
 * The host is the `.toast` element. Timed toasts run their own timer, which pauses while the
 * pointer rests on the toast, focus is inside it, or the page is hidden.
 */
@Component({
  selector: 'hp-toast',
  imports: [Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'toast',
    '[class.toast--info]': "tone() === 'info'",
    '[class.toast--success]': "tone() === 'success'",
    '[class.toast--warning]': "tone() === 'warning'",
    '[class.toast--danger]': "tone() === 'danger'",
    '[attr.data-state]': "leaving() ? 'leaving' : null",
    '[attr.data-timer]': "running() ? 'running' : 'paused'",
    '(pointerenter)': 'setPause("hover", true)',
    '(pointerleave)': 'setPause("hover", false)',
    '(focusin)': 'setPause("focus", true)',
    '(focusout)': 'onFocusOut($event)',
    '(keydown.escape)': 'onEscape($event)',
  },
  template: `<svg hp-icon [name]="icon()"></svg>
    <div class="toast__body">
      <strong class="toast__title">{{ heading() }}</strong>
      <span class="toast__text">{{ text() }}</span>
      @if (actionLabel()) {
        <button class="toast__action" type="button" (click)="actioned.emit()">
          {{ actionLabel() }}
        </button>
      }
    </div>
    <button
      class="close"
      type="button"
      [attr.aria-label]="dismissLabel()"
      (click)="close('dismiss')"
    >
      <svg hp-icon name="close" size="sm"></svg>
    </button>
    @if (duration() !== null) {
      @for (run of runs(); track run) {
        <span
          class="toast__progress"
          aria-hidden="true"
          [style.animation-duration.ms]="duration()"
        ></span>
      }
    }`,
  styles: `
    .toast {
      --toast-bg: var(--color-bg-inverse);
      --toast-fg: var(--color-fg-inverse);
      --toast-icon: var(--color-info-icon-inverse);
      position: relative;
      overflow: hidden;
      pointer-events: auto;
      display: flex;
      gap: var(--space-3);
      align-items: flex-start;
      padding: var(--space-4);
      background: var(--toast-bg);
      color: var(--toast-fg);
      border-radius: var(--radius-md);
      box-shadow: var(--shadow-3);
      animation: slide-up var(--duration-base) var(--ease-enter);
    }

    .toast--success {
      --toast-icon: var(--color-success-icon-inverse);
    }

    .toast--warning {
      --toast-icon: var(--color-warning-icon-inverse);
    }

    .toast--danger {
      --toast-icon: var(--color-danger-icon-inverse);
    }

    .toast > .icon {
      flex: none;
      color: var(--toast-icon);
      margin-top: var(--space-0-5);
    }

    .toast__body {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: var(--space-0-5);
      min-width: 0;
    }

    .toast__title {
      font: var(--text-label);
      overflow-wrap: anywhere;
    }

    .toast__text {
      font: var(--text-body-sm);
      overflow-wrap: anywhere;
    }

    .toast__action {
      align-self: flex-start;
      max-width: 100%;
      font: var(--text-label);
      color: inherit;
      background: none;
      border: 0;
      padding: var(--space-1) 0;
      min-height: var(--target-min);
      text-align: start;
      text-decoration: underline;
      text-underline-offset: 0.15em;
      overflow-wrap: anywhere;
      cursor: pointer;
    }

    .toast .close {
      flex: none;
      background: none;
      border: 0;
      padding: 0;
      color: inherit;
      cursor: pointer;
      width: var(--target-min);
      height: var(--target-min);
      display: grid;
      place-items: center;
      border-radius: var(--radius-sm);
    }

    .toast .close:hover {
      background: color-mix(in srgb, currentColor 12%, transparent);
    }

    /* D-6: the shared ring is under 3:1 on the inverse surface; the text colour is not. */
    .toast :focus-visible {
      outline: var(--focus-ring-width) solid var(--toast-fg);
      outline-offset: var(--focus-ring-offset);
    }

    .toast__progress {
      position: absolute;
      left: 0;
      bottom: 0;
      width: 100%;
      height: var(--border-width-thick);
      background: currentColor;
      opacity: 0.4;
      transform-origin: left center;
      animation-name: hp-toast-progress;
      animation-timing-function: linear;
      animation-fill-mode: forwards;
      animation-play-state: paused;
    }

    .toast[data-timer='running'] .toast__progress {
      animation-play-state: running;
    }

    .toast[data-state='leaving'] {
      animation: fade-out var(--duration-base) var(--ease-exit) forwards;
    }

    @keyframes hp-toast-progress {
      from {
        transform: scaleX(1);
      }

      to {
        transform: scaleX(0);
      }
    }

    @media (forced-colors: active) {
      .toast {
        border: var(--border-width-hairline) solid CanvasText;
      }

      .toast :focus-visible {
        outline-color: Highlight;
      }
    }
  `,
})
export class Toast {
  /** Tone: `.toast--{tone}` and the status icon. */
  readonly tone = input<ToastTone>('info');
  /** What happened, two to four words. */
  readonly heading = input.required<string>();
  /** The detail in one sentence. */
  readonly text = input.required<string>();
  /** Renders the one action button when not empty. */
  readonly actionLabel = input<string>('');
  /** The dismiss control's accessible name. */
  readonly dismissLabel = input.required<string>();
  /** Milliseconds until timeout; `null` is persistent and hides the timer bar. */
  readonly duration = input<number | null>(null);
  /** Set by the region while the toast plays its leaving animation (`data-state="leaving"`). */
  readonly leaving = input(false, { transform: booleanAttribute });

  /** The action was activated. */
  readonly actioned = output<void>();
  /** The timer ended, or the dismiss control or Esc was used. */
  readonly dismissed = output<ToastCloseReason>();

  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  private readonly document = inject(DOCUMENT);

  protected readonly icon = computed(() => TONE_ICONS[this.tone()] ?? TONE_ICONS.info);

  private readonly paused = signal({ hover: false, focus: false, hidden: false });
  private readonly entered = signal(false);
  /** Bumped when the timer restarts, so the timer bar restarts with it. */
  private readonly run = signal(0);
  protected readonly runs = computed(() => [this.run()]);

  protected readonly running = computed(() => {
    const p = this.paused();
    return (
      this.duration() !== null &&
      this.entered() &&
      !this.leaving() &&
      !p.hover &&
      !p.focus &&
      !p.hidden
    );
  });

  private remaining = 0;
  private startedAt = 0;
  private timer: ReturnType<typeof setTimeout> | undefined;
  private enterTimer: ReturnType<typeof setTimeout> | undefined;
  private closed = false;

  constructor() {
    const onVisibility = () => this.setPause('hidden', this.document.hidden);
    this.document.addEventListener('visibilitychange', onVisibility);
    this.setPause('hidden', this.document.hidden);

    inject(DestroyRef).onDestroy(() => {
      this.document.removeEventListener('visibilitychange', onVisibility);
      clearTimeout(this.timer);
      clearTimeout(this.enterTimer);
    });

    // The timer starts after the enter animation (--duration-base).
    afterNextRender({
      read: () => {
        this.enterTimer = setTimeout(() => this.entered.set(true), enterDuration(this.host));
      },
    });

    // A new duration or new content (a replaced toast) restarts the timer.
    effect(() => {
      const duration = this.duration();
      this.heading();
      this.text();
      this.actionLabel();
      untracked(() => this.restart(duration));
    });

    // Starts or stops the timeout as the running state changes; keeps the time left.
    effect(() => {
      const running = this.running();
      untracked(() => (running ? this.resume() : this.pause()));
    });
  }

  protected setPause(reason: 'hover' | 'focus' | 'hidden', value: boolean): void {
    this.paused.update((p) => (p[reason] === value ? p : { ...p, [reason]: value }));
  }

  protected onFocusOut(event: FocusEvent): void {
    const next = event.relatedTarget as Node | null;
    if (next && this.host.contains(next)) return;
    this.setPause('focus', false);
  }

  protected onEscape(event: Event): void {
    event.preventDefault();
    this.close('dismiss');
  }

  protected close(reason: ToastCloseReason): void {
    if (this.leaving()) return;
    this.dismissed.emit(reason);
  }

  private restart(duration: number | null): void {
    clearTimeout(this.timer);
    this.timer = undefined;
    this.closed = false;
    this.remaining = duration ?? 0;
    this.run.update((n) => n + 1);
    if (untracked(this.running)) this.resume();
  }

  private resume(): void {
    if (this.timer !== undefined || this.closed || this.duration() === null) return;
    this.startedAt = Date.now();
    this.timer = setTimeout(() => {
      this.timer = undefined;
      this.closed = true;
      this.close('timeout');
    }, this.remaining);
  }

  private pause(): void {
    if (this.timer === undefined) return;
    clearTimeout(this.timer);
    this.timer = undefined;
    this.remaining = Math.max(0, this.remaining - (Date.now() - this.startedAt));
  }
}
