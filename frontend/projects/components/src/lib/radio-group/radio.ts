import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  InjectionToken,
  Signal,
  booleanAttribute,
  computed,
  inject,
  input,
  isDevMode,
  viewChild,
} from '@angular/core';
import { CHOICE_STYLES, CHOICE_TEXT_STYLES } from '../choice/choice-styles';

/**
 * What a `hp-radio-group` offers its `label[hp-radio]` options (radio-group.md, implementation
 * notes: the group exposes its name, value, invalid, disabled and required state as signals).
 */
export interface RadioGroupContext {
  /** The native `name` every option shares (D-2). */
  readonly groupName: Signal<string>;
  /** The checked value, including values written by Angular forms. */
  readonly selected: Signal<string | null>;
  /** True while every option shows `aria-invalid="true"`. */
  readonly optionsInvalid: Signal<boolean>;
  /** True while every option is disabled. */
  readonly optionsDisabled: Signal<boolean>;
  readonly required: Signal<boolean>;
  readonly cards: Signal<boolean>;
  /** Reports that the person checked this option. */
  select(option: Radio): void;
}

/** Provided by `hp-radio-group`; required by every `label[hp-radio]`. */
export const HP_RADIO_GROUP = new InjectionToken<RadioGroupContext>('HP_RADIO_GROUP');

let nextRadioId = 0;

/**
 * One option of a radio group (radio-group.md). The host is the native `<label class="choice">`
 * around a native radio (D-1); options never stand alone.
 */
@Component({
  selector: 'label[hp-radio]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgTemplateOutlet],
  host: {
    class: 'choice',
    '[class.choice--card]': 'group?.cards() ?? false',
  },
  template: `
    <ng-template #label><ng-content /></ng-template>
    <input
      #control
      type="radio"
      [id]="inputId"
      [name]="group?.groupName() ?? ''"
      [value]="value()"
      [checked]="isChecked()"
      [disabled]="isDisabled()"
      [required]="group?.required() ?? false"
      [attr.aria-invalid]="group?.optionsInvalid() ? 'true' : null"
      [attr.aria-labelledby]="labelId"
      [attr.aria-describedby]="description() ? descriptionId : null"
      (change)="onChange()"
    />
    @if (description()) {
      <span class="choice__text">
        <span [id]="labelId"><ng-container [ngTemplateOutlet]="label" /></span>
        <small [id]="descriptionId">{{ description() }}</small>
      </span>
    } @else {
      <span [id]="labelId"><ng-container [ngTemplateOutlet]="label" /></span>
    }
  `,
  styles: [CHOICE_STYLES, CHOICE_TEXT_STYLES],
})
export class Radio {
  /** Native value; what the group reports when this option is checked. Unique in the group. */
  readonly value = input.required<string>();
  /** Accessible description, e.g. "About 5 hours · estimate $180–$240" (D-10). */
  readonly description = input<string | undefined>(undefined);
  /** Disables this option only. */
  readonly disabled = input(false, { transform: booleanAttribute });

  protected readonly group = inject(HP_RADIO_GROUP, { optional: true });
  private readonly control = viewChild.required<ElementRef<HTMLInputElement>>('control');

  readonly inputId = `hp-radio-${++nextRadioId}`;
  readonly labelId = `${this.inputId}-label`;
  readonly descriptionId = `${this.inputId}-description`;

  protected readonly isChecked = computed(() => this.group?.selected() === this.value());
  readonly isDisabled = computed(() => this.disabled() || (this.group?.optionsDisabled() ?? false));

  constructor() {
    if (!this.group && isDevMode()) {
      console.error('hp-radio: place every label[hp-radio] option inside a hp-radio-group.');
    }
  }

  /** Moves focus to the native radio. */
  focus(): void {
    this.control().nativeElement.focus();
  }

  protected onChange(): void {
    this.group?.select(this);
  }
}
