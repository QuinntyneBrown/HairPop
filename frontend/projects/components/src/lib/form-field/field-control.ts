import { DestroyRef, ElementRef, Signal, computed, inject } from '@angular/core';
import { NgControl } from '@angular/forms';
import { FormFieldControl, HP_FORM_FIELD } from './form-field-context';

const nextIds = new Map<string, number>();

/** The wiring a native-host control (text field, textarea, select) derives from its form field. */
export interface NativeFieldControl {
  /** The id rendered on the host: own `id` input, else the field's `controlId()`, else a generated one. */
  readonly id: Signal<string>;
  /** Own ids first, then the field's `describedBy()`; null when empty. */
  readonly describedBy: Signal<string | null>;
  /** `'true'` while invalid, otherwise null (the attribute is removed). */
  readonly ariaInvalid: Signal<'true' | null>;
  /** Registers the control with its form field; call from `ngOnInit`. Unregisters on destroy. */
  connect(): void;
}

/**
 * Implements the single-control rules of the form field contract for a component whose host is
 * the native form element. Call in an injection context.
 */
export function injectNativeFieldControl(
  prefix: string,
  ownId: Signal<string | undefined>,
  ownDescribedBy: Signal<string | undefined>,
  ownInvalid: Signal<boolean | undefined>,
): NativeFieldControl {
  const field = inject(HP_FORM_FIELD, { optional: true });
  const ngControl = inject(NgControl, { self: true, optional: true });
  const host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  const destroyRef = inject(DestroyRef);
  const n = (nextIds.get(prefix) ?? 0) + 1;
  nextIds.set(prefix, n);
  const generated = `${prefix}-${n}`;

  const id = computed(() => ownId() || (field ? field.controlId() : generated));
  const describedBy = computed(() => {
    const ids = [ownDescribedBy(), field?.describedBy()].filter((v): v is string => !!v);
    return ids.length ? ids.join(' ') : null;
  });
  const ariaInvalid = computed<'true' | null>(() =>
    (field ? field.invalid() : ownInvalid()) ? 'true' : null,
  );

  return {
    id,
    describedBy,
    ariaInvalid,
    connect(): void {
      if (!field) return;
      const control: FormFieldControl = {
        id,
        ngControl,
        focus: () => {
          host.focus();
          host.scrollIntoView({ block: 'center' });
        },
      };
      destroyRef.onDestroy(field.register(control));
    },
  };
}

/** Parses a boolean-ish attribute value, keeping `undefined` when the attribute is absent. */
export function optionalBooleanAttribute(value: unknown): boolean | undefined {
  if (value === undefined || value === null) return undefined;
  return typeof value === 'boolean' ? value : value !== 'false';
}
