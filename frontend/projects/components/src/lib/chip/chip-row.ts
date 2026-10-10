import {
  afterNextRender,
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  contentChildren,
  effect,
  ElementRef,
  forwardRef,
  inject,
  Injector,
  input,
  isDevMode,
  model,
} from '@angular/core';

import { Chip, CHIP_ROW, ChipRowContext } from './chip';

/** Elements in a row that can take focus after a removal. */
const FOCUSABLE =
  'button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Groups chips under one accessible name (chip.md). A `single` row keeps exactly one chip pressed
 * through its `value` model (D-3), and after an input chip is removed it moves focus to what took
 * its place, never to the top of the page (D-5).
 */
@Component({
  selector: 'hp-chip-row',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content />',
  host: {
    class: 'chip-row',
    role: 'group',
  },
  providers: [{ provide: CHIP_ROW, useExisting: forwardRef(() => ChipRow) }],
  styles: `
    :host {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: var(--space-2);
    }
  `,
})
export class ChipRow implements ChipRowContext {
  /** A single-choice set: exactly one child filter chip is pressed. */
  readonly single = input(false, { transform: booleanAttribute });
  /** The pressed chip's value in a single-choice row. */
  readonly value = model<string | null>(null);
  /** Where focus goes when the removed chip leaves no focusable element in the row. */
  readonly focusFallback = input<HTMLElement | undefined>(undefined);

  private readonly chips = contentChildren(Chip, { descendants: true });
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  private readonly injector = inject(Injector);
  private pending: { chip: Chip; index: number } | null = null;

  constructor() {
    if (isDevMode()) {
      afterNextRender(() => {
        if (!this.host.hasAttribute('aria-label') && !this.host.hasAttribute('aria-labelledby')) {
          console.error(
            'hp-chip-row: the row needs an aria-label or aria-labelledby that names the group.',
          );
        }
      });
      effect(() => {
        if (!this.single()) {
          return;
        }
        const seen = new Set<string>();
        for (const chip of this.chips()) {
          if (chip.element.tagName !== 'BUTTON') {
            continue;
          }
          const value = chip.value();
          if (value === undefined || value === '') {
            console.error('hp-chip-row: every filter chip in a single row needs a value.');
          } else if (seen.has(value)) {
            console.error(`hp-chip-row: duplicate chip value "${value}" in a single row.`);
          } else {
            seen.add(value);
          }
        }
      });
    }
  }

  select(value: string | undefined): void {
    if (value === undefined || value === this.value()) {
      return;
    }
    this.value.set(value);
  }

  noteRemoval(chip: Chip): void {
    const button = chip.removeButtonElement();
    const index = button ? this.focusables().indexOf(button) : -1;
    this.pending = { chip, index: Math.max(0, index) };
  }

  chipDestroyed(chip: Chip): void {
    const pending = this.pending;
    if (!pending || pending.chip !== chip) {
      return;
    }
    this.pending = null;
    afterNextRender(() => this.restoreFocus(pending.index), { injector: this.injector });
  }

  private focusables(): HTMLElement[] {
    return Array.from(this.host.querySelectorAll<HTMLElement>(FOCUSABLE));
  }

  private restoreFocus(index: number): void {
    const active = this.host.ownerDocument.activeElement;
    const focusLost =
      !active || active === this.host.ownerDocument.body || this.host.contains(active);
    if (!focusLost) {
      return;
    }
    const focusables = this.focusables();
    const next = focusables[index] ?? focusables[focusables.length - 1];
    if (next) {
      next.focus();
      return;
    }
    const fallback = this.focusFallback();
    if (fallback) {
      fallback.focus();
      return;
    }
    const host = this.host;
    host.setAttribute('tabindex', '-1');
    host.addEventListener('blur', () => host.removeAttribute('tabindex'), { once: true });
    host.focus();
  }
}
