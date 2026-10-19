import { ChangeDetectionStrategy, Component, OnInit, booleanAttribute, input } from '@angular/core';
import { injectNativeFieldControl, optionalBooleanAttribute } from '../form-field/field-control';

/**
 * A few sentences in the customer's own words: the native `<textarea>` with the design system's
 * look, an auto-grow variant and the form field wiring. The template is empty.
 */
@Component({
  selector: 'textarea[hp-textarea]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '',
  host: {
    class: 'textarea',
    '[class.textarea--auto-grow]': 'autoGrow()',
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
      display: block;
      width: 100%;
      min-height: calc(var(--control-height-md) * 2.5);
      margin: 0;
      padding: var(--space-2) var(--space-3);
      font: var(--text-body);
      color: var(--field-fg);
      background-color: var(--field-bg);
      border: var(--border-width-hairline) solid var(--field-border);
      border-radius: var(--radius-md);
      resize: vertical;
      transition:
        border-color var(--duration-fast) var(--ease-standard),
        box-shadow var(--duration-fast) var(--ease-standard);
    }

    :host(.textarea--auto-grow) {
      field-sizing: content;
      max-height: calc(var(--control-height-md) * 6);
      resize: none;
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
export class Textarea implements OnInit {
  /** Adds `.textarea--auto-grow`: grows with the text from 100 px up to 240 px, no resize handle. */
  readonly autoGrow = input(false, { transform: booleanAttribute });
  /** Host id; defaults to the form field's control id, else `hp-textarea-{n}`. */
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
    'hp-textarea',
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
