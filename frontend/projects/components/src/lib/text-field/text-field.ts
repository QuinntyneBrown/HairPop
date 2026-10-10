import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  booleanAttribute,
  computed,
  input,
} from '@angular/core';
import { injectNativeFieldControl, optionalBooleanAttribute } from '../form-field/field-control';

/** Native input types a text field offers (date and time types are not offered, D-6). */
export type TextFieldType = 'text' | 'email' | 'password' | 'tel' | 'number' | 'search' | 'url';

/** Height and text size of a text field. */
export type TextFieldSize = 'sm' | 'md' | 'lg';

/**
 * One short typed answer: the native `<input>` with the design system's look and the
 * form field wiring (text field CRD). The host is the input; the template is empty.
 */
@Component({
  selector: 'input[hp-text-field]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '',
  host: {
    class: 'input',
    '[class.input--sm]': "fieldSize() === 'sm'",
    '[class.input--lg]': "fieldSize() === 'lg'",
    '[attr.type]': 'renderedType()',
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
      box-sizing: border-box;
      width: 100%;
      min-height: var(--field-height);
      margin: 0;
      padding: var(--space-2) var(--space-3);
      font: var(--text-body);
      line-height: var(--line-height-snug);
      color: var(--field-fg);
      background-color: var(--field-bg);
      border: var(--border-width-hairline) solid var(--field-border);
      border-radius: var(--radius-md);
      transition:
        border-color var(--duration-fast) var(--ease-standard),
        box-shadow var(--duration-fast) var(--ease-standard);
    }

    :host::placeholder {
      color: var(--color-fg-subtle);
      opacity: 1;
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

    :host(:read-only:not(:disabled)) {
      background-color: var(--color-bg-surface-sunken);
      border-style: dashed;
    }

    :host(.input--sm) {
      --field-height: var(--control-height-sm);
      padding-block: var(--space-1);
      font-size: var(--font-size-sm);
    }

    :host(.input--lg) {
      --field-height: var(--control-height-lg);
      font-size: var(--font-size-lg);
    }

    @media (forced-colors: active) {
      :host {
        border: var(--border-width-hairline) solid CanvasText;
      }

      :host(:read-only:not(:disabled)) {
        border-style: dashed;
      }

      :host(:focus-visible) {
        outline-color: Highlight;
        border-color: Highlight;
      }
    }
  `,
})
export class TextField implements OnInit {
  /** Native `type`; a revealed password renders `text`. Write it as a static attribute (D-2). */
  readonly type = input<TextFieldType>('text');
  /** Adds `.input--sm` or `.input--lg`; md adds no modifier (D-3). */
  readonly fieldSize = input<TextFieldSize>('md');
  /** With `type="password"`, renders `type="text"` so the password is visible (D-5). */
  readonly revealed = input(false, { transform: booleanAttribute });
  /** Host id; defaults to the form field's control id, else `hp-text-field-{n}`. */
  // eslint-disable-next-line @angular-eslint/no-input-rename -- the native `id` attribute is the input (CRD API); `id` itself is the rendered-id getter.
  readonly idInput = input<string | undefined>(undefined, { alias: 'id' });
  /** Ids the consumer adds; the form field's ids are appended after them (D-8). */
  // eslint-disable-next-line @angular-eslint/no-input-rename -- aliased so a static `aria-describedby` reaches the component (text field D-8).
  readonly ariaDescribedBy = input<string | undefined>(undefined, { alias: 'aria-describedby' });
  /** For use outside a form field; inside one, the field's `invalid()` decides. */
  readonly ariaInvalid = input<boolean | undefined, unknown>(undefined, {
    alias: 'aria-invalid',
    transform: optionalBooleanAttribute,
  });

  protected readonly control = injectNativeFieldControl(
    'hp-text-field',
    this.idInput,
    this.ariaDescribedBy,
    this.ariaInvalid,
  );

  /** The rendered host id (the label's `for` target), e.g. for `[attr.aria-controls]="pw.id"`. */
  get id(): string {
    return this.control.id();
  }

  protected readonly renderedType = computed(() =>
    this.revealed() && this.type() === 'password' ? 'text' : this.type(),
  );

  ngOnInit(): void {
    this.control.connect();
  }
}
