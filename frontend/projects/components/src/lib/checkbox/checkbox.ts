import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  InjectionToken,
  Injector,
  OnInit,
  Signal,
  booleanAttribute,
  computed,
  forwardRef,
  inject,
  input,
  linkedSignal,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, NgControl } from '@angular/forms';
import { CHOICE_STYLES, CHOICE_TEXT_STYLES } from '../choice/choice-styles';
import { FormFieldControl, HP_FORM_FIELD } from '../form-field/form-field-context';

/**
 * What a `hp-checkbox-group` offers its `label[hp-checkbox]` children (checkbox.md, implementation
 * notes: the group provides an injection token each checkbox injects optionally).
 */
export interface CheckboxGroupContext {
  /** True while a child with this value is checked. */
  isChecked(value: string): boolean;
  /** True while the whole group is disabled (input or `setDisabledState`). */
  readonly groupDisabled: Signal<boolean>;
  /** True while every child shows `aria-invalid="true"` (D-13). */
  readonly groupInvalid: Signal<boolean>;
  /** Reports a person's toggle of a child; the group updates its value and the form. */
  toggle(child: Checkbox, checked: boolean): void;
}

/** Provided by `hp-checkbox-group`; injected optionally by every `label[hp-checkbox]`. */
export const HP_CHECKBOX_GROUP = new InjectionToken<CheckboxGroupContext>('HP_CHECKBOX_GROUP');

let nextCheckboxId = 0;

/**
 * A checkbox for an independent option that applies on save (checkbox.md). The host is the
 * native `<label class="choice">` (D-1); the template renders the native checkbox and its text.
 */
@Component({
  selector: 'label[hp-checkbox]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgTemplateOutlet],
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => Checkbox), multi: true }],
  host: {
    class: 'choice',
    '[class.choice--card]': 'card()',
  },
  template: `
    <ng-template #label><ng-content /></ng-template>
    <input
      #box
      type="checkbox"
      [id]="inputId()"
      [checked]="isChecked()"
      [indeterminate]="indeterminateState()"
      [disabled]="isDisabled()"
      [required]="required()"
      [attr.value]="value()"
      [attr.name]="name() ?? null"
      [attr.aria-invalid]="isInvalid() ? 'true' : null"
      [attr.aria-labelledby]="labelId"
      [attr.aria-describedby]="ariaDescribedBy()"
      (change)="onChange($event)"
      (blur)="onBlur()"
    />
    @if (description()) {
      <span class="choice__text">
        <span [id]="labelId" [class.visually-hidden]="hideLabel()"
          ><ng-container [ngTemplateOutlet]="label"
        /></span>
        <small [id]="descriptionId">{{ description() }}</small>
      </span>
    } @else {
      <span [id]="labelId" [class.visually-hidden]="hideLabel()"
        ><ng-container [ngTemplateOutlet]="label"
      /></span>
    }
  `,
  styles: [CHOICE_STYLES, CHOICE_TEXT_STYLES],
})
export class Checkbox implements ControlValueAccessor, OnInit {
  /**
   * Checked state; two-way with `checkedChange` (`[(checked)]`), and a bare `checked` attribute
   * works. Ignored inside a group, which owns the value (D-5).
   */
  readonly checked = input(false, { transform: booleanAttribute });
  readonly checkedChange = output<boolean>();
  /**
   * Mixed state, rendered through the native property; two-way with `indeterminateChange`.
   * A user activation clears it and emits `false` (D-8).
   */
  readonly indeterminate = input(false, { transform: booleanAttribute });
  readonly indeterminateChange = output<boolean>();
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly invalid = input(false, { transform: booleanAttribute });
  /** Ids added to `aria-describedby` after the description's id (D-6). */
  readonly describedBy = input<string | undefined>(undefined);
  readonly required = input(false, { transform: booleanAttribute });
  /** Consequence sentence rendered as the accessible description (D-2, D-3). */
  readonly description = input<string | undefined>(undefined);
  readonly card = input(false, { transform: booleanAttribute });
  /** Visually hides the label span; the accessible name stays (D-11). */
  readonly hideLabel = input(false, { transform: booleanAttribute });
  readonly value = input('on');
  readonly name = input<string | undefined>(undefined);

  private readonly group = inject(HP_CHECKBOX_GROUP, { optional: true });
  private readonly field = this.group ? null : inject(HP_FORM_FIELD, { optional: true });
  private readonly injector = inject(Injector);
  private readonly destroyRef = inject(DestroyRef);
  private readonly box = viewChild.required<ElementRef<HTMLInputElement>>('box');

  private readonly uid = `hp-checkbox-${++nextCheckboxId}`;
  readonly labelId = `${this.uid}-label`;
  readonly descriptionId = `${this.uid}-description`;

  /** Checked state as last set by the template, the person or `writeValue` (which never emits). */
  private readonly checkedState = linkedSignal(() => this.checked());
  /** Mixed state as last set by the template or cleared by the person. */
  protected readonly indeterminateState = linkedSignal(() => this.indeterminate());
  private readonly formDisabled = signal(false);
  private onChangeFn: (value: boolean) => void = () => undefined;
  private onTouchedFn: () => void = () => undefined;

  /** Id of the native input: the form field's control id, else the generated one. */
  readonly inputId = computed(() => (this.field ? this.field.controlId() : this.uid));

  protected readonly isChecked = computed(() =>
    this.group ? this.group.isChecked(this.value()) : this.checkedState(),
  );

  readonly isDisabled = computed(
    () => this.disabled() || this.formDisabled() || (this.group?.groupDisabled() ?? false),
  );

  protected readonly isInvalid = computed(() =>
    this.group ? this.group.groupInvalid() : this.invalid() || (this.field?.invalid() ?? false),
  );

  protected readonly ariaDescribedBy = computed(() => {
    const ids: string[] = [];
    if (this.description()) ids.push(this.descriptionId);
    if (!this.group) {
      const own = this.describedBy();
      if (own) ids.push(own);
      const fieldIds = this.field?.describedBy();
      if (fieldIds) ids.push(fieldIds);
    }
    return ids.length ? ids.join(' ') : null;
  });

  ngOnInit(): void {
    const field = this.field;
    if (!field) return;
    // Read lazily: injecting NgControl into a value accessor's constructor is a cycle.
    const ngControl = this.injector.get(NgControl, null, { self: true, optional: true });
    const control: FormFieldControl = { id: this.inputId, ngControl, focus: () => this.focus() };
    const unregister = field.register(control);
    this.destroyRef.onDestroy(unregister);
  }

  /** Moves focus to the native checkbox. */
  focus(): void {
    this.box().nativeElement.focus();
  }

  protected onChange(event: Event): void {
    const next = (event.target as HTMLInputElement).checked;
    if (this.indeterminateState()) {
      this.indeterminateState.set(false);
      this.indeterminateChange.emit(false);
    }
    if (this.group) {
      this.group.toggle(this, next);
      return;
    }
    this.checkedState.set(next);
    this.checkedChange.emit(next);
    this.onChangeFn(next);
  }

  protected onBlur(): void {
    if (!this.group) this.onTouchedFn();
  }

  writeValue(value: boolean | null): void {
    this.checkedState.set(!!value);
  }

  registerOnChange(fn: (value: boolean) => void): void {
    this.onChangeFn = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouchedFn = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.formDisabled.set(isDisabled);
  }
}
