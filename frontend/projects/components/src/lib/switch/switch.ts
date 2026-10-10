import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  Injector,
  OnInit,
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
import { CHOICE_TEXT_STYLES } from '../choice/choice-styles';
import { FormFieldControl, HP_FORM_FIELD } from '../form-field/form-field-context';

/** `inline`: label after the switch. `row`: full-width settings row, switch at the end (D-5). */
export type SwitchLayout = 'inline' | 'row';

let nextSwitchId = 0;

/**
 * An on/off setting that applies the moment it changes (switch.md). The host is the native
 * `<label class="switch">` (D-1) around a native checkbox with `role="switch"` (D-2).
 */
@Component({
  selector: 'label[hp-switch]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgTemplateOutlet],
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => Switch), multi: true }],
  host: {
    class: 'switch',
    '[class.switch--end]': "layout() === 'row'",
  },
  template: `
    <ng-template #label><ng-content /></ng-template>
    <input
      #track
      type="checkbox"
      role="switch"
      [attr.id]="inputId()"
      [checked]="checkedState()"
      [disabled]="isDisabled()"
      [attr.name]="name() ?? null"
      [attr.aria-labelledby]="labelId"
      [attr.aria-describedby]="ariaDescribedBy()"
      (change)="onChange($event)"
      (blur)="onTouchedFn()"
    />
    @if (description()) {
      <span class="choice__text">
        <span [id]="labelId"><ng-container [ngTemplateOutlet]="label" /></span>
        <small class="text-muted" [id]="descriptionId">{{ description() }}</small>
      </span>
    } @else {
      <span [id]="labelId"><ng-container [ngTemplateOutlet]="label" /></span>
    }
  `,
  styles: [
    CHOICE_TEXT_STYLES,
    `
      :host {
        --switch-width: 2.75rem;
        --switch-height: 1.5rem;
        --switch-thumb: 1.25rem;
        --switch-track: var(--color-border-strong);
        --switch-track-on: var(--color-accent);
        --switch-thumb-bg: var(--color-bg-surface);
        display: inline-flex;
        align-items: center;
        gap: var(--space-3);
        cursor: pointer;
        min-height: var(--target-min);
        font: var(--text-body);
        color: var(--color-fg-default);
      }

      :host input {
        appearance: none;
        margin: 0;
        flex: none;
        box-sizing: border-box;
        width: var(--switch-width);
        height: var(--switch-height);
        border: 0;
        border-radius: var(--radius-full);
        background: var(--switch-track);
        position: relative;
        cursor: pointer;
        transition: background-color var(--duration-base) var(--ease-standard);
      }

      :host input::before {
        content: '';
        position: absolute;
        top: var(--space-0-5);
        left: var(--space-0-5);
        width: var(--switch-thumb);
        height: var(--switch-thumb);
        border-radius: var(--radius-full);
        background: var(--switch-thumb-bg);
        box-shadow: var(--shadow-1);
        transition: translate var(--duration-base) var(--ease-standard);
      }

      :host input:checked {
        background: var(--switch-track-on);
      }

      :host input:checked::before {
        translate: calc(var(--switch-width) - var(--switch-thumb) - 2 * var(--space-0-5)) 0;
      }

      /* Hover (off) re-points the track token; the on track keeps --switch-track-on. */
      :host(:hover:not(:has(input:disabled))) {
        --switch-track: var(--color-fg-muted);
      }

      :host input:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }

      :host input:disabled ~ * {
        color: var(--color-fg-disabled);
      }

      :host:has(input:disabled) {
        cursor: not-allowed;
      }

      :host(.switch--end) {
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: space-between;
        width: 100%;
      }

      :host(.switch--end) input {
        order: 1;
      }

      :host(.switch--end) > span {
        flex: 1 1 10em;
        min-width: 0;
      }

      @media (forced-colors: active) {
        :host input {
          forced-color-adjust: none;
          box-shadow: inset 0 0 0 var(--border-width-hairline) CanvasText;
          background: Canvas;
        }

        :host input::before {
          background: CanvasText;
          box-shadow: none;
        }

        :host input:checked {
          background: Highlight;
        }

        :host input:checked::before {
          background: HighlightText;
        }
      }
    `,
  ],
})
export class Switch implements ControlValueAccessor, OnInit {
  /**
   * On or off; two-way with `checkedChange` (`[(checked)]`), and a bare `checked` attribute works.
   * Setting it from the template or `writeValue` never emits (D-4).
   */
  readonly checked = input(false, { transform: booleanAttribute });
  readonly checkedChange = output<boolean>();
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly layout = input<SwitchLayout>('inline');
  /** What "on" means, rendered as the accessible description (D-7). */
  readonly description = input<string | undefined>(undefined);
  readonly name = input<string | undefined>(undefined);

  private readonly field = inject(HP_FORM_FIELD, { optional: true });
  private readonly injector = inject(Injector);
  private readonly destroyRef = inject(DestroyRef);
  private readonly track = viewChild.required<ElementRef<HTMLInputElement>>('track');

  private readonly uid = `hp-switch-${++nextSwitchId}`;
  readonly labelId = `${this.uid}-label`;
  readonly descriptionId = `${this.uid}-description`;

  /** On state as last set by the template, the person or `writeValue` (which never emits). */
  protected readonly checkedState = linkedSignal(() => this.checked());
  private readonly formDisabled = signal(false);
  private onChangeFn: (value: boolean) => void = () => undefined;
  protected onTouchedFn: () => void = () => undefined;

  /** Inside a form field the input takes the field's control id; outside it needs none. */
  protected readonly inputId = computed(() => this.field?.controlId() ?? null);
  protected readonly isDisabled = computed(() => this.disabled() || this.formDisabled());

  protected readonly ariaDescribedBy = computed(() => {
    const ids: string[] = [];
    if (this.description()) ids.push(this.descriptionId);
    const fieldIds = this.field?.describedBy();
    if (fieldIds) ids.push(fieldIds);
    return ids.length ? ids.join(' ') : null;
  });

  ngOnInit(): void {
    const field = this.field;
    if (!field) return;
    // Read lazily: injecting NgControl into a value accessor's constructor is a cycle.
    const ngControl = this.injector.get(NgControl, null, { self: true, optional: true });
    const control: FormFieldControl = {
      id: computed(() => field.controlId()),
      ngControl,
      focus: () => this.focus(),
    };
    const unregister = field.register(control);
    this.destroyRef.onDestroy(unregister);
  }

  /** Moves focus to the native switch. */
  focus(): void {
    this.track().nativeElement.focus();
  }

  protected onChange(event: Event): void {
    const next = (event.target as HTMLInputElement).checked;
    this.checkedState.set(next);
    this.checkedChange.emit(next);
    this.onChangeFn(next);
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
