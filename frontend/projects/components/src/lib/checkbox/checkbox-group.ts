import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  Injector,
  OnInit,
  afterNextRender,
  booleanAttribute,
  computed,
  contentChildren,
  forwardRef,
  inject,
  input,
  isDevMode,
  linkedSignal,
  model,
  signal,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, NgControl } from '@angular/forms';
import { FormFieldControl, HP_FORM_FIELD } from '../form-field/form-field-context';
import { Checkbox, CheckboxGroupContext, HP_CHECKBOX_GROUP } from './checkbox';

/** Layout of a checkbox group. Horizontal runs inline from 768 px only (D-9). */
export type CheckboxGroupOrientation = 'vertical' | 'horizontal';

/**
 * Several related checkboxes reporting their checked values as one list (checkbox.md). The host
 * carries `.choice-group` and renders inside the form field's `<fieldset>` (D-10).
 */
@Component({
  selector: 'hp-checkbox-group',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => CheckboxGroup), multi: true },
    { provide: HP_CHECKBOX_GROUP, useExisting: forwardRef(() => CheckboxGroup) },
  ],
  host: {
    class: 'choice-group',
    '[class.choice-group--inline]': "orientation() === 'horizontal'",
    '[attr.role]': "named() ? 'group' : null",
    '(focusout)': 'onFocusOut($event)',
  },
  template: '<ng-content />',
  styles: `
    :host {
      display: flex;
      flex-direction: column;
      gap: var(--space-1);
      min-width: 0;
    }

    @media (min-width: 48rem) {
      :host(.choice-group--inline) {
        flex-direction: row;
        flex-wrap: wrap;
        gap: var(--space-2) var(--space-6);
      }
    }
  `,
})
export class CheckboxGroup implements CheckboxGroupContext, ControlValueAccessor, OnInit {
  /** The `value` of every checked child, in DOM order. Two-way. */
  readonly value = model<string[]>([]);
  readonly orientation = input<CheckboxGroupOrientation>('vertical');
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly invalid = input(false, { transform: booleanAttribute });

  private readonly field = inject(HP_FORM_FIELD, { optional: true });
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly injector = inject(Injector);
  private readonly destroyRef = inject(DestroyRef);
  private readonly children = contentChildren(Checkbox, { descendants: true });

  /** Value as last set by the template, the person or `writeValue` (which never emits). */
  private readonly state = linkedSignal(() => this.value());
  private readonly formDisabled = signal(false);
  /** True when the host takes `role="group"`: named by `aria-labelledby`, outside a fieldset. */
  protected readonly named = signal(false);
  private onChangeFn: (value: string[]) => void = () => undefined;
  private onTouchedFn: () => void = () => undefined;

  readonly groupDisabled = computed(() => this.disabled() || this.formDisabled());
  readonly groupInvalid = computed(() => this.invalid() || (this.field?.invalid() ?? false));

  /** Child whose input the form field targets: the first checked, else the first. */
  private readonly target = computed(() => {
    const children = this.children();
    const value = this.state();
    return children.find((child) => value.includes(child.value())) ?? children[0];
  });

  constructor() {
    afterNextRender(() => {
      const el = this.host.nativeElement;
      const fieldset = el.closest('fieldset');
      const inLegendFieldset = !!fieldset?.querySelector(':scope > legend');
      const labelled = el.hasAttribute('aria-labelledby');
      this.named.set(labelled && !fieldset);
      if (isDevMode() && !inLegendFieldset && !labelled) {
        console.error(
          'hp-checkbox-group: render the group inside a fieldset with a legend (fieldset[hp-form-field]) or name it with aria-labelledby.',
        );
      }
    });
  }

  ngOnInit(): void {
    const field = this.field;
    if (!field) return;
    // Read lazily: injecting NgControl into a value accessor's constructor is a cycle.
    const ngControl = this.injector.get(NgControl, null, { self: true, optional: true });
    const control: FormFieldControl = {
      id: computed(() => this.target()?.inputId() ?? ''),
      ngControl,
      focus: () => this.target()?.focus(),
    };
    const unregister = field.register(control);
    this.destroyRef.onDestroy(unregister);
  }

  isChecked(value: string): boolean {
    return this.state().includes(value);
  }

  toggle(child: Checkbox, checked: boolean): void {
    const current = this.state();
    const next = this.children()
      .filter((c) => (c === child ? checked : current.includes(c.value())))
      .map((c) => c.value());
    this.value.set(next);
    this.state.set(next);
    this.onChangeFn(next);
  }

  protected onFocusOut(event: FocusEvent): void {
    const next = event.relatedTarget as Node | null;
    if (!next || !this.host.nativeElement.contains(next)) this.onTouchedFn();
  }

  writeValue(value: string[] | null): void {
    this.state.set(value ?? []);
  }

  registerOnChange(fn: (value: string[]) => void): void {
    this.onChangeFn = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouchedFn = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.formDisabled.set(isDisabled);
  }
}
