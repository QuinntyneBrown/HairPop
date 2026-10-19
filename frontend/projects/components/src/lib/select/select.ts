import { ChangeDetectionStrategy, Component, OnInit, input } from '@angular/core';
import { injectNativeFieldControl, optionalBooleanAttribute } from '../form-field/field-control';

/** Height and text size of a select. */
export type SelectSize = 'sm' | 'md' | 'lg';

/**
 * One value from a known list: the native `<select>` with the design system's chevron, sizes and
 * states, and the form field wiring. Projected `<option>` and `<optgroup>` children
 * stay in place.
 */
@Component({
  selector: 'select[hp-select]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content />',
  host: {
    class: 'select',
    '[class.select--sm]': "fieldSize() === 'sm'",
    '[class.select--lg]': "fieldSize() === 'lg'",
    '[attr.id]': 'control.id()',
    '[attr.aria-describedby]': 'control.describedBy()',
    '[attr.aria-invalid]': 'control.ariaInvalid()',
  },
  styles: `
    :host {
      --field-bg: var(--color-bg-surface);
      --field-fg: var(--color-fg-default);
      --field-border: var(--color-border-strong);
      --field-border-hover: var(--color-fg-muted);
      --field-height: var(--control-height-md);
      --select-chevron: 0.3125rem;
      box-sizing: border-box;
      appearance: none;
      width: 100%;
      min-height: var(--field-height);
      margin: 0;
      padding: var(--space-2) var(--space-10) var(--space-2) var(--space-3);
      font: var(--text-body);
      line-height: var(--line-height-snug);
      color: var(--field-fg);
      background-color: var(--field-bg);
      background-image:
        linear-gradient(45deg, transparent 50%, currentColor 50%),
        linear-gradient(135deg, currentColor 50%, transparent 50%);
      background-position:
        calc(100% - var(--space-5)) 50%,
        calc(100% - var(--space-4) + 1px) 50%;
      background-size: var(--select-chevron) var(--select-chevron);
      background-repeat: no-repeat;
      border: var(--border-width-hairline) solid var(--field-border);
      border-radius: var(--radius-md);
      transition:
        border-color var(--duration-fast) var(--ease-standard),
        box-shadow var(--duration-fast) var(--ease-standard);
    }

    :host(:hover) {
      border-color: var(--field-border-hover);
    }

    :host(:focus-visible) {
      outline: var(--focus-ring-width) solid var(--color-focus-ring);
      outline-offset: 0;
      border-color: var(--color-focus-ring);
    }

    :host([aria-invalid='true']) {
      border-color: var(--color-danger-solid);
      box-shadow: inset 0 0 0 1px var(--color-danger-solid);
    }

    :host(:disabled) {
      background-color: var(--color-bg-subtle);
      color: var(--color-fg-disabled);
      cursor: not-allowed;
      border-color: var(--color-border-default);
    }

    :host(.select--sm) {
      --field-height: var(--control-height-sm);
      padding-block: var(--space-1);
      font-size: var(--font-size-sm);
    }

    :host(.select--lg) {
      --field-height: var(--control-height-lg);
      font-size: var(--font-size-lg);
    }

    @media (forced-colors: active) {
      :host {
        forced-color-adjust: none;
        color: CanvasText;
        background-color: Canvas;
        border: var(--border-width-hairline) solid CanvasText;
      }

      :host(:focus-visible) {
        outline-color: Highlight;
        border-color: Highlight;
      }

      :host(:disabled) {
        color: GrayText;
        border-color: GrayText;
      }
    }
  `,
})
export class Select implements OnInit {
  /** Adds `.select--sm` or `.select--lg`; md adds no modifier. Not `size` (D-3). */
  readonly fieldSize = input<SelectSize>('md');
  /** Host id; defaults to the form field's control id, else `hp-select-{n}`. */
  // eslint-disable-next-line @angular-eslint/no-input-rename -- the native `id` attribute is the input (component API); `id` itself is the rendered-id getter.
  readonly idInput = input<string | undefined>(undefined, { alias: 'id' });
  /** Ids the consumer adds; the form field's ids are appended after them. */
  // eslint-disable-next-line @angular-eslint/no-input-rename -- aliased so a static `aria-describedby` reaches the component (text field D-8).
  readonly ariaDescribedBy = input<string | undefined>(undefined, { alias: 'aria-describedby' });
  /** For use outside a form field; inside one, the field's `invalid()` decides. */
  readonly ariaInvalid = input<boolean | undefined, unknown>(undefined, {
    alias: 'aria-invalid',
    transform: optionalBooleanAttribute,
  });

  protected readonly control = injectNativeFieldControl(
    'hp-select',
    this.idInput,
    this.ariaDescribedBy,
    this.ariaInvalid,
  );

  /** The rendered host id (the label's `for` target). */
  get id(): string {
    return this.control.id();
  }

  ngOnInit(): void {
    this.control.connect();
  }
}
