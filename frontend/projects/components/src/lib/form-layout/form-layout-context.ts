import { InjectionToken, Signal } from '@angular/core';
import { AbstractControl } from '@angular/forms';

/** What each form field registers with its enclosing form layout (form layout CRD, *Field contract*). */
export interface FormLayoutField {
  /** The field's label text. */
  readonly label: Signal<string>;
  /** The message the field shows or would show now. */
  readonly message: Signal<string | null>;
  /** The control has errors (or an explicit error is set). */
  readonly invalid: Signal<boolean>;
  /** The id the summary link targets. */
  readonly controlId: Signal<string>;
  /** The field host, for document order. */
  readonly element: HTMLElement;
  /** Focuses the control and scrolls it to the middle. */
  focus(): void;
  /**
   * The field's forms control, when it has one. The form marks it touched and waits for its pending
   * validators on submit, so a field outside the form's `FormGroup` is judged like any other.
   */
  readonly control?: Signal<AbstractControl | null>;
}

/** What a form layout offers the form fields inside it. */
export interface FormLayoutContext {
  /** True from the first submit attempt (or showSummary) until the component is destroyed. */
  readonly submitted: Signal<boolean>;
  register(field: FormLayoutField): () => void;
}

export const HP_FORM_LAYOUT = new InjectionToken<FormLayoutContext>('HP_FORM_LAYOUT');
