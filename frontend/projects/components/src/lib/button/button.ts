import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  OnInit,
  booleanAttribute,
  computed,
  inject,
  input,
  isDevMode,
  model,
} from '@angular/core';

/** Emphasis levels of a button. `secondary` is the base `.btn` look. */
export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'link' | 'danger';

/** Button sizes. `md` is the base `.btn` size. */
export type ButtonSize = 'sm' | 'md' | 'lg';

/** Native `type` of a `<button>` host. */
export type ButtonType = 'button' | 'submit' | 'reset';

/**
 * The product's one action control (button.md). The host is the native `<button>` or `<a>`
 * and carries the `.btn` BEM classes, `type`, `disabled` and every ARIA attribute (D-1).
 */
@Component({
  selector: 'button[hp-button], a[hp-button]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content />',
  host: {
    class: 'btn',
    '[class.btn--primary]': "variant() === 'primary'",
    '[class.btn--ghost]': "variant() === 'ghost'",
    '[class.btn--link]': "variant() === 'link'",
    '[class.btn--danger]': "variant() === 'danger'",
    '[class.btn--sm]': "size() === 'sm'",
    '[class.btn--lg]': "size() === 'lg'",
    '[class.btn--block]': 'block()',
    '[class.btn--icon]': 'iconOnly()',
    '[attr.type]': 'hostType()',
    '[attr.disabled]': 'hostDisabled()',
    '[attr.aria-busy]': "busy() ? 'true' : null",
    '[attr.aria-pressed]': 'ariaPressed()',
  },
  styles: `
    :host {
      --btn-bg: var(--color-bg-surface);
      --btn-fg: var(--color-fg-default);
      --btn-border: var(--color-border-strong);
      --btn-bg-hover: var(--color-bg-subtle);
      --btn-bg-active: var(--color-bg-subtle-hover);
      --btn-height: var(--control-height-md);
      --btn-padding: var(--space-4);
      --btn-font-size: var(--font-size-md);
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: var(--space-2);
      box-sizing: border-box;
      min-height: var(--btn-height);
      padding: var(--space-1) var(--btn-padding);
      margin: 0;
      font: var(--text-label);
      font-size: var(--btn-font-size);
      line-height: var(--line-height-snug);
      text-align: center;
      overflow-wrap: anywhere;
      color: var(--btn-fg);
      background: var(--btn-bg);
      border: var(--border-width-hairline) solid var(--btn-border);
      border-radius: var(--radius-md);
      cursor: pointer;
      text-decoration: none;
      user-select: none;
      position: relative;
      transition:
        background-color var(--duration-fast) var(--ease-standard),
        border-color var(--duration-fast) var(--ease-standard),
        transform var(--duration-fast) var(--ease-standard),
        box-shadow var(--duration-fast) var(--ease-standard);
    }

    :host(:focus-visible) {
      outline: var(--focus-ring-width) solid var(--color-focus-ring);
      outline-offset: var(--focus-ring-offset);
    }

    :host(:focus:not(:focus-visible)) {
      outline: none;
    }

    :host(a:hover) {
      color: var(--btn-fg);
      text-decoration: none;
    }

    :host(:hover) {
      background: var(--btn-bg-hover);
    }

    :host(:active) {
      background: var(--btn-bg-active);
      transform: translateY(1px);
    }

    /* D-13: an open menu trigger holds its active fill without the press offset. */
    :host([aria-expanded='true']) {
      background: var(--btn-bg-active);
      transform: none;
    }

    :host(.btn--primary) {
      --btn-bg: var(--color-accent);
      --btn-fg: var(--color-fg-on-accent);
      --btn-border: var(--color-accent);
      --btn-bg-hover: var(--color-accent-hover);
      --btn-bg-active: var(--color-accent-active);
    }

    :host(.btn--primary:hover) {
      border-color: var(--color-accent-hover);
      box-shadow: var(--shadow-1);
    }

    :host(.btn--danger) {
      --btn-bg: var(--color-danger-solid);
      --btn-fg: var(--color-fg-on-danger);
      --btn-border: var(--color-danger-solid);
      --btn-bg-hover: var(--color-danger-solid-hover);
      --btn-bg-active: var(--color-danger-solid-hover);
    }

    :host(.btn--danger:hover) {
      border-color: var(--color-danger-solid-hover);
    }

    :host(.btn--ghost) {
      --btn-bg: transparent;
      --btn-border: transparent;
      --btn-fg: var(--color-fg-default);
    }

    :host(.btn--link) {
      --btn-bg: transparent;
      --btn-border: transparent;
      --btn-fg: var(--color-fg-link);
      --btn-bg-hover: var(--color-accent-subtle);
      --btn-bg-active: var(--color-accent-subtle-hover);
      text-decoration: underline;
      text-underline-offset: 0.15em;
    }

    :host(a.btn--link:hover) {
      text-decoration: underline;
    }

    :host(.btn--sm) {
      --btn-height: var(--control-height-sm);
      --btn-padding: var(--space-3);
      --btn-font-size: var(--font-size-sm);
    }

    :host(.btn--lg) {
      --btn-height: var(--control-height-lg);
      --btn-padding: var(--space-6);
      --btn-font-size: var(--font-size-lg);
    }

    :host(.btn--block) {
      display: flex;
      width: 100%;
    }

    :host(.btn--icon) {
      --btn-padding: 0;
      padding: 0;
      width: var(--btn-height);
    }

    :host ::ng-deep .icon {
      width: 1.25em;
      height: 1.25em;
      flex: none;
      stroke: currentColor;
    }

    :host([aria-pressed='true']) {
      --btn-bg: var(--color-accent-subtle);
      --btn-fg: var(--color-fg-accent);
      --btn-border: var(--color-accent);
      --btn-bg-hover: var(--color-accent-subtle-hover);
    }

    :host(:disabled),
    :host(:disabled:hover),
    :host(:disabled:active),
    :host([aria-disabled='true']),
    :host([aria-disabled='true']:hover),
    :host([aria-disabled='true']:active) {
      opacity: 0.5;
      cursor: not-allowed;
      transform: none;
      background: var(--btn-bg);
      border-color: var(--btn-border);
      box-shadow: none;
    }

    :host([aria-busy='true']) {
      color: transparent;
      pointer-events: none;
    }

    :host([aria-busy='true'])::after {
      content: '';
      position: absolute;
      inset: 0;
      margin: auto;
      box-sizing: border-box;
      width: 1.25em;
      height: 1.25em;
      border: var(--border-width-thick) solid var(--btn-fg);
      border-right-color: transparent;
      border-radius: var(--radius-full);
      animation: spin var(--duration-loop-spin) linear infinite;
    }

    @keyframes spin {
      to {
        rotate: 360deg;
      }
    }

    @media (forced-colors: active) {
      :host {
        border: var(--border-width-hairline) solid CanvasText;
      }

      :host(.btn--primary) {
        forced-color-adjust: none;
        background: Highlight;
        color: HighlightText;
      }

      :host(:focus-visible) {
        outline-color: Highlight;
      }
    }
  `,
})
export class Button implements OnInit {
  /** Emphasis: adds `.btn--{variant}`; secondary adds no modifier. */
  readonly variant = input<ButtonVariant>('secondary');
  /** Size: adds `.btn--sm` or `.btn--lg`; md adds no modifier. */
  readonly size = input<ButtonSize>('md');
  /** Full width of the container (`.btn--block`). */
  readonly block = input(false, { transform: booleanAttribute });
  /** Square, icon-only button (`.btn--icon`); requires `aria-label` or `aria-labelledby`. */
  readonly iconOnly = input(false, { transform: booleanAttribute });
  /** Native `type` of a `<button>` host (D-4). Ignored on `<a>` hosts. */
  readonly type = input<ButtonType>('button');
  /** Native `disabled` on a `<button>` host. Ignored on `<a>` hosts (D-3). */
  readonly disabled = input(false, { transform: booleanAttribute });
  /** Sets `aria-busy="true"` and swallows every activation while true (D-2, D-11). */
  readonly busy = input(false, { transform: booleanAttribute });
  /** Toggle state; `aria-pressed` mirrors it and each activation flips it when defined (D-8). */
  readonly pressed = model<boolean | undefined>(undefined);

  private readonly host =
    inject<ElementRef<HTMLButtonElement | HTMLAnchorElement>>(ElementRef).nativeElement;
  private readonly isAnchor = this.host.tagName === 'A';

  protected readonly hostType = computed(() => (this.isAnchor ? null : this.type()));
  protected readonly hostDisabled = computed(() => (!this.isAnchor && this.disabled() ? '' : null));
  protected readonly ariaPressed = computed(() => {
    const pressed = this.pressed();
    return pressed === undefined ? null : String(pressed);
  });

  constructor() {
    // Registered in the constructor so they run before any consumer `(click)` or router
    // listener on the host: a busy button cancels the activation before it bubbles.
    const onClick = (event: Event): void => {
      if (this.busy()) {
        event.preventDefault();
        event.stopImmediatePropagation();
        return;
      }
      const pressed = this.pressed();
      if (pressed !== undefined) {
        this.pressed.set(!pressed);
      }
    };
    const onKey = (event: Event): void => {
      const key = (event as KeyboardEvent).key;
      if (this.busy() && (key === 'Enter' || key === ' ' || key === 'Spacebar')) {
        event.preventDefault();
        event.stopImmediatePropagation();
      }
    };
    this.host.addEventListener('click', onClick);
    this.host.addEventListener('keydown', onKey);
    this.host.addEventListener('keyup', onKey);
    inject(DestroyRef).onDestroy(() => {
      this.host.removeEventListener('click', onClick);
      this.host.removeEventListener('keydown', onKey);
      this.host.removeEventListener('keyup', onKey);
    });
  }

  ngOnInit(): void {
    if (
      isDevMode() &&
      this.iconOnly() &&
      !this.host.hasAttribute('aria-label') &&
      !this.host.hasAttribute('aria-labelledby')
    ) {
      console.error(
        'hp-button: an iconOnly button needs an accessible name. Add aria-label (for example aria-label="Close dialog") or aria-labelledby to the host.',
      );
    }
  }
}
