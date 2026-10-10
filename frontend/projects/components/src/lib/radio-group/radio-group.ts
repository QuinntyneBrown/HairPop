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
  effect,
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
import { HP_RADIO_GROUP, Radio, RadioGroupContext } from './radio';

/** Layout of a radio group. Horizontal wraps at every width (D-8). */
export type RadioGroupOrientation = 'vertical' | 'horizontal';

let nextRadioGroupId = 0;

/**
 * Exactly one answer from a short list (radio-group.md). Native radios sharing one `name` give
 * the roving tab stop and arrow keys (D-2); the host carries `.choice-group` and renders inside
 * the form field's `<fieldset>` (D-3).
 */
@Component({
  selector: 'hp-radio-group',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => RadioGroup), multi: true },
    { provide: HP_RADIO_GROUP, useExisting: forwardRef(() => RadioGroup) },
  ],
  host: {
    class: 'choice-group',
    '[class.choice-group--inline]': "orientation() === 'horizontal'",
    '[style.gap]': "cards() ? 'var(--space-2)' : null",
    '[attr.role]': "named() ? 'radiogroup' : null",
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

    :host(.choice-group--inline) {
      flex-direction: row;
      flex-wrap: wrap;
      gap: var(--space-2) var(--space-6);
    }
  `,
})
export class RadioGroup implements RadioGroupContext, ControlValueAccessor, OnInit {
  /** The checked option's value, or `null`. Two-way; a value no option has checks none (D-4). */
  readonly value = model<string | null>(null);
  readonly orientation = input<RadioGroupOrientation>('vertical');
  /** Frames every option as a card and sets the group gap to `--space-2` (D-6). */
  readonly cards = input(false, { transform: booleanAttribute });
  /** Native `name` for every option; generated per instance by default (D-2). */
  readonly name = input<string | undefined>(undefined);
  readonly invalid = input(false, { transform: booleanAttribute });
  readonly disabled = input(false, { transform: booleanAttribute });
  /** Native `required` on every option, meaning "choose one" (D-13). */
  readonly required = input(false, { transform: booleanAttribute });

  private readonly field = inject(HP_FORM_FIELD, { optional: true });
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly injector = inject(Injector);
  private readonly destroyRef = inject(DestroyRef);
  private readonly options = contentChildren(Radio, { descendants: true });

  private readonly generatedName = `hp-radio-group-${++nextRadioGroupId}`;
  private readonly formDisabled = signal(false);
  /** True when the host takes `role="radiogroup"`: named by `aria-labelledby`, outside a fieldset. */
  protected readonly named = signal(false);
  private onChangeFn: (value: string | null) => void = () => undefined;
  private onTouchedFn: () => void = () => undefined;

  readonly groupName = computed(() => this.name() ?? this.generatedName);
  /** Value as last set by the template, the person or `writeValue` (which never emits). */
  readonly selected = linkedSignal(() => this.value());
  readonly optionsInvalid = computed(() => this.invalid() || (this.field?.invalid() ?? false));
  readonly optionsDisabled = computed(() => this.disabled() || this.formDisabled());

  /** Option the form field targets: the checked one, else the first enabled one. */
  private readonly target = computed(() => {
    const options = this.options();
    const value = this.selected();
    return (
      options.find((option) => option.value() === value) ??
      options.find((option) => !option.isDisabled()) ??
      options[0]
    );
  });

  constructor() {
    if (isDevMode()) {
      effect(() => {
        const seen = new Set<string>();
        for (const option of this.options()) {
          const value = option.value();
          if (seen.has(value)) {
            console.error(
              `hp-radio-group: two options share the value "${value}"; make each value unique.`,
            );
          }
          seen.add(value);
        }
      });
    }
    afterNextRender(() => {
      const el = this.host.nativeElement;
      const fieldset = el.closest('fieldset');
      const inLegendFieldset = !!fieldset?.querySelector(':scope > legend');
      const labelled = el.hasAttribute('aria-labelledby');
      this.named.set(labelled && !fieldset);
      if (isDevMode() && !inLegendFieldset && !labelled) {
        console.error(
          'hp-radio-group: render the group inside a fieldset with a legend (fieldset[hp-form-field]) or name it with aria-labelledby.',
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
      id: computed(() => this.target()?.inputId ?? ''),
      ngControl,
      focus: () => this.target()?.focus(),
    };
    const unregister = field.register(control);
    this.destroyRef.onDestroy(unregister);
  }

  select(option: Radio): void {
    const next = option.value();
    if (next === this.selected()) return;
    this.value.set(next);
    this.selected.set(next);
    this.onChangeFn(next);
  }

  protected onFocusOut(event: FocusEvent): void {
    const next = event.relatedTarget as Node | null;
    if (!next || !this.host.nativeElement.contains(next)) this.onTouchedFn();
  }

  writeValue(value: string | null): void {
    this.selected.set(value ?? null);
  }

  registerOnChange(fn: (value: string | null) => void): void {
    this.onChangeFn = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouchedFn = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.formDisabled.set(isDisabled);
  }
}
