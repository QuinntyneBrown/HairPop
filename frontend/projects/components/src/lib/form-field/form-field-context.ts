import { InjectionToken, Signal } from '@angular/core';
import type { NgControl } from '@angular/forms';

/** What a control inside a form field registers with it (form field CRD, *Control contract*). */
export interface FormFieldControl {
  /** Id of the element the label targets and the summary link moves to: the input itself, or the checked (else first) option of a group. */
  readonly id: Signal<string>;
  /** The forms directive on the control (FormControlName, FormControlDirective, NgModel), or null outside Angular forms. */
  readonly ngControl: NgControl | null;
  /** Moves focus to the control; used by error-summary links. */
  focus(): void;
}

/** What a form field offers the one control projected into it. */
export interface FormFieldContext {
  /** Generated id `hp-field-{n}-control`. A control uses it unless its own `id` input is set, and then registers its own id. */
  readonly controlId: Signal<string>;
  /** Space-separated ids in this order: error, hint, described addons, counter; null when there are none. */
  readonly describedBy: Signal<string | null>;
  /** True while the field shows its error. */
  readonly invalid: Signal<boolean>;
  /** True on a fieldset host. */
  readonly group: boolean;
  /** Registers the one control; returns the function that unregisters it (call it on destroy). */
  register(control: FormFieldControl): () => void;
}

export const HP_FORM_FIELD = new InjectionToken<FormFieldContext>('HP_FORM_FIELD');
