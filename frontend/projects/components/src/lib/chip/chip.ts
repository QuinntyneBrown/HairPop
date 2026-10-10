import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  ElementRef,
  inject,
  InjectionToken,
  input,
  isDevMode,
  model,
  output,
  Signal,
  viewChild,
} from '@angular/core';

import { Icon } from '../icon/icon';

/** Chip sizes: sm 32 px (no modifier), md 40 px. */
export type ChipSize = 'sm' | 'md';

/** What a chip needs from the row it sits in; provided by `hp-chip-row` (chip-row.ts). */
export interface ChipRowContext {
  /** True for a single-choice row, which owns its chips' pressed state (D-3). */
  readonly single: Signal<boolean>;
  /** The pressed chip's value in a single-choice row. */
  readonly value: Signal<string | null>;
  /** Presses the chip with this value in a single-choice row; no-op when it is already pressed. */
  select(value: string | undefined): void;
  /** Records where focus should go before an input chip's removal (D-5). */
  noteRemoval(chip: Chip): void;
  /** Called when a chip is destroyed, so the row can restore focus after a removal (D-5). */
  chipDestroyed(chip: Chip): void;
}

/** Injection token through which chips find their row. */
export const CHIP_ROW = new InjectionToken<ChipRowContext>('CHIP_ROW');

/**
 * A compact pill that narrows what is on screen (chip.md). On a `<button>` host it is a filter
 * chip, always a toggle with `aria-pressed` (D-2); on a `<span>` host it is static, or an input
 * chip with a remove button when `removeLabel` is set (D-7).
 */
@Component({
  selector: 'button[hp-chip], span[hp-chip]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon],
  host: {
    class: 'chip',
    '[class.chip--md]': "size() === 'md'",
    '[class.chip--static]': '!isButton',
    '[attr.type]': "isButton ? 'button' : null",
    '[attr.aria-pressed]': 'isButton ? (isPressed() ? "true" : "false") : null',
    '[attr.disabled]': "isButton && disabled() ? '' : null",
    '(click)': 'toggle()',
  },
  template: `<ng-content />
    @if (isRemovable()) {
      <button
        #remove
        class="remove"
        type="button"
        [attr.aria-label]="removeLabel()"
        [disabled]="disabled()"
        (click)="emitRemoved()"
        (keydown.backspace)="onDeleteKey($event)"
        (keydown.delete)="onDeleteKey($event)"
      >
        <svg hp-icon name="close" size="sm"></svg>
      </button>
    }`,
  styles: `
    :host {
      --chip-bg: var(--color-bg-surface);
      --chip-fg: var(--color-fg-default);
      --chip-border: var(--color-border-strong);
      --chip-height: var(--control-height-sm);
      display: inline-flex;
      align-items: center;
      gap: var(--space-1);
      min-height: var(--chip-height);
      max-width: 100%;
      min-width: 0;
      margin: 0;
      padding: 0 var(--space-3);
      border-radius: var(--radius-full);
      border: var(--border-width-hairline) solid var(--chip-border);
      background: var(--chip-bg);
      color: var(--chip-fg);
      font: var(--text-label);
      text-align: center;
      white-space: normal;
      overflow-wrap: anywhere;
      cursor: pointer;
      transition:
        background-color var(--duration-fast) var(--ease-standard),
        border-color var(--duration-fast) var(--ease-standard);
    }

    /* A sunken well re-skins the chip (component tokens: .well .chip). */
    :host-context(.well) {
      --chip-bg: var(--color-bg-surface-raised);
    }

    /* Static and input chips are not controls: hover and press change nothing. */
    :host(:not(.chip--static):hover) {
      --chip-bg: var(--color-bg-subtle);
    }

    :host(:not(.chip--static):active) {
      --chip-bg: var(--color-bg-subtle-hover);
    }

    :host([aria-pressed='true']) {
      --chip-bg: var(--color-accent-subtle);
      --chip-border: var(--color-accent);
      --chip-fg: var(--color-fg-accent);
    }

    :host([aria-pressed='true']:hover) {
      --chip-bg: var(--color-accent-subtle-hover);
    }

    :host(:disabled) {
      opacity: 0.5;
      cursor: not-allowed;
    }

    :host(.chip--static) {
      cursor: default;
      --chip-border: var(--color-border-default);
    }

    :host(.chip--md) {
      --chip-height: var(--control-height-md);
      padding-inline: var(--space-4);
      font-size: var(--font-size-md);
    }

    .remove {
      display: inline-grid;
      place-items: center;
      flex: none;
      width: var(--target-min);
      height: var(--target-min);
      margin-right: calc(-1 * var(--space-2));
      padding: 0;
      border-radius: var(--radius-full);
      border: 0;
      background: transparent;
      color: inherit;
      cursor: pointer;
    }

    .remove:hover {
      background: var(--color-bg-subtle-hover);
    }

    .remove:disabled {
      cursor: not-allowed;
    }

    .remove:disabled:hover {
      background: transparent;
    }

    :host(:has(.remove:disabled)) {
      opacity: 0.5;
    }

    @media (forced-colors: active) {
      :host {
        border: var(--border-width-hairline) solid CanvasText;
      }

      :host([aria-pressed='true']) {
        outline: var(--border-width-thick) solid Highlight;
      }

      :host(:focus-visible),
      .remove:focus-visible {
        outline-color: Highlight;
      }
    }
  `,
})
export class Chip {
  /** `md` adds `.chip--md` (40 px). */
  readonly size = input<ChipSize>('sm');
  /** Filter chips only: the toggle state; owned by the row in a `single` row. */
  readonly pressed = model(false);
  /** Filter chips only: the value a `single` row reports when this chip is pressed. */
  readonly value = input<string | undefined>(undefined);
  /** Native `disabled` on a filter chip; disables the remove button on an input chip. */
  readonly disabled = input(false, { transform: booleanAttribute });
  /** Input chips only: the remove button's name ("Remove filter: under $150"). Unset: static. */
  readonly removeLabel = input<string | undefined>(undefined);
  /** An input chip's remove button was activated. The page removes the chip. */
  readonly removed = output<void>();

  /** The host element, read by the row to find focusable elements. */
  readonly element = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  protected readonly isButton = this.element.tagName === 'BUTTON';
  private readonly row = inject(CHIP_ROW, { optional: true });
  private readonly removeButton = viewChild<ElementRef<HTMLButtonElement>>('remove');

  protected readonly isRemovable = computed(() => {
    const label = this.removeLabel();
    return !this.isButton && label !== undefined && label !== null;
  });

  protected readonly isPressed = computed(() => {
    const row = this.row;
    if (row && row.single()) {
      const value = this.value();
      return value !== undefined && row.value() === value;
    }
    return this.pressed();
  });

  constructor() {
    if (this.row) {
      const row = this.row;
      inject(DestroyRef).onDestroy(() => row.chipDestroyed(this));
    }
    if (isDevMode() && !this.isButton) {
      effect(() => {
        if (this.removeLabel() === '') {
          console.error(
            'hp-chip: an input chip has an empty removeLabel, so its remove button has no name.',
          );
        }
      });
    }
  }

  /** The remove button element, if this is an input chip. */
  removeButtonElement(): HTMLButtonElement | null {
    return this.removeButton()?.nativeElement ?? null;
  }

  protected toggle(): void {
    if (!this.isButton || this.disabled()) {
      return;
    }
    const row = this.row;
    if (row && row.single()) {
      row.select(this.value());
      return;
    }
    this.pressed.set(!this.pressed());
  }

  protected emitRemoved(): void {
    if (this.disabled()) {
      return;
    }
    this.row?.noteRemoval(this);
    this.removed.emit();
  }

  protected onDeleteKey(event: Event): void {
    event.preventDefault();
    this.emitRemoved();
  }
}
