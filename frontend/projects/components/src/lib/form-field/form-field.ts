import { NgTemplateOutlet } from '@angular/common';
import {
  AfterContentChecked,
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  OnInit,
  booleanAttribute,
  computed,
  contentChild,
  contentChildren,
  effect,
  inject,
  input,
  isDevMode,
  signal,
  untracked,
} from '@angular/core';
import {
  AbstractControl,
  PristineChangeEvent,
  StatusChangeEvent,
  TouchedChangeEvent,
  ValidationErrors,
  ValueChangeEvent,
} from '@angular/forms';
import { Button } from '../button/button';
import { HP_FORM_LAYOUT } from '../form-layout/form-layout-context';
import { InlineMessage } from '../inline-message/inline-message';
import { FieldAddon, HP_FIELD_ADDON_HOST } from './field-addon';
import { FormFieldContext, FormFieldControl, HP_FORM_FIELD } from './form-field-context';

/** Pause after the last keystroke before the counter is announced (D-10). */
export const COUNTER_ANNOUNCE_DELAY_MS = 1000;

/** How long an announcement stays in the status span before it is cleared. */
const COUNTER_ANNOUNCE_CLEAR_MS = 500;

/** Share of the limit from which the counter is announced (D-10). */
const COUNTER_ANNOUNCE_THRESHOLD = 0.9;

/** Builds the counter copy, e.g. `(n, max) => \`${n} of ${max} characters\``. */
export type FormFieldCounterText = (count: number, max: number) => string;

let nextFieldId = 0;

/**
 * Keeps one question together: label (or legend), the projected control, hint, error and
 * counter, wired so assistive technology hears all of it (form field CRD). The host is the
 * native `<div>` (one control) or `<fieldset>` (a checkbox or radio group) and carries `.field`.
 */
@Component({
  selector: 'div[hp-form-field], fieldset[hp-form-field]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgTemplateOutlet, InlineMessage],
  providers: [
    { provide: HP_FORM_FIELD, useExisting: FormField },
    { provide: HP_FIELD_ADDON_HOST, useExisting: FormField },
  ],
  host: {
    class: 'field',
    '[attr.aria-describedby]': 'group ? describedBy() : null',
    '(input)': 'onInput()',
  },
  template: `
    <ng-template #marker>
      @if (optionalMarker()) {
        &ngsp;<span class="optional">{{ optionalMarker() }}</span>
      }
    </ng-template>
    @if (group) {
      <legend>{{ label() }}<ng-container [ngTemplateOutlet]="marker" /></legend>
    } @else if (!choice()) {
      <label class="field__label" [attr.for]="labelFor()"
        >{{ label() }}<ng-container [ngTemplateOutlet]="marker"
      /></label>
    }
    <ng-template #control>
      <ng-content select="[slot=prefix]" />
      <ng-content />
      <ng-content select="[slot=suffix]" />
    </ng-template>
    @if (hasAddons()) {
      <div class="input-group"><ng-container [ngTemplateOutlet]="control" /></div>
    } @else {
      <ng-container [ngTemplateOutlet]="control" />
    }
    @if (hint()) {
      <span hp-inline-message kind="hint" [attr.id]="hintId">{{ hint() }}</span>
    }
    @if (showError()) {
      <span hp-inline-message kind="error" [attr.id]="errorId">{{ message() }}</span>
    }
    @if (hasCounter()) {
      <span hp-inline-message kind="counter" [attr.id]="counterId" [over]="over()">{{
        counterCopy()
      }}</span>
      <span class="visually-hidden" role="status">{{ announcement() }}</span>
    }
  `,
  styles: `
    :host {
      display: flex;
      flex-direction: column;
      gap: var(--space-1);
      min-width: 0;
    }

    :host(fieldset) {
      border: 0;
      padding: 0;
      margin: 0;
    }

    .field__label {
      display: flex;
      flex-wrap: wrap;
      gap: var(--space-1);
      font: var(--text-label);
      color: var(--color-fg-default);
      overflow-wrap: anywhere;
    }

    legend {
      font: var(--text-label);
      color: var(--color-fg-default);
      padding: 0;
      margin-bottom: var(--space-2);
      overflow-wrap: anywhere;
    }

    .optional {
      color: var(--color-fg-muted);
      font-weight: var(--font-weight-regular);
    }

    .input-group {
      display: flex;
      align-items: stretch;
    }

    :host ::ng-deep .input-group > .input {
      flex: 1 1 auto;
      border-radius: 0;
      min-width: 0;
    }

    :host ::ng-deep .input-group > .addon,
    :host ::ng-deep .input-group > .btn {
      flex: none;
    }

    :host ::ng-deep .input-group > :first-child {
      border-radius: var(--radius-md) 0 0 var(--radius-md);
    }

    :host ::ng-deep .input-group > :last-child {
      border-radius: 0 var(--radius-md) var(--radius-md) 0;
    }

    :host ::ng-deep .input-group > .addon + .input,
    :host ::ng-deep .input-group > .input + .addon {
      margin-left: calc(var(--border-width-hairline) * -1);
    }
  `,
})
export class FormField implements FormFieldContext, OnInit, AfterContentInit, AfterContentChecked {
  /** Text of the `<label>` or `<legend>`, and of the field's line in the error summary. */
  readonly label = input.required<string>();
  /** Renders `<span class="optional">` with this text after the label: "(optional)". */
  readonly optionalMarker = input<string | undefined>(undefined);
  /** Renders the hint below the control; it stays visible while an error shows. */
  readonly hint = input<string | undefined>(undefined);
  /** Message for each validator key; the first key of the control's errors with an entry wins. */
  readonly errorMessages = input<Readonly<Record<string, string>>>({});
  /** An explicit message, shown at once and ahead of any validator message. */
  readonly error = input<string | undefined>(undefined);
  /** Shows the counter; counts Unicode code points of the control's value. */
  readonly maxLength = input<number | undefined>(undefined);
  /** Builds the counter copy. Required when `maxLength` is set. */
  readonly counterText = input<FormFieldCounterText | undefined>(undefined);
  /** For a single checkbox or switch that carries its own label: no `.field__label`. */
  readonly choice = input(false, { transform: booleanAttribute });

  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  private readonly layout = inject(HP_FORM_LAYOUT, { optional: true });
  private readonly destroyRef = inject(DestroyRef);

  /** True on a `<fieldset>` host. */
  readonly group = this.host.tagName === 'FIELDSET';
  /** The field's generated id, `hp-field-{n}`. */
  readonly fieldId = `hp-field-${++nextFieldId}`;
  protected readonly hintId = `${this.fieldId}-hint`;
  protected readonly errorId = `${this.fieldId}-error`;
  protected readonly counterId = `${this.fieldId}-counter`;

  readonly controlId = signal(`${this.fieldId}-control`).asReadonly();

  private readonly addons = contentChildren(FieldAddon);
  private readonly suffixButton = contentChild(Button);
  protected readonly hasAddons = computed(
    () => !this.group && (this.addons().length > 0 || !!this.suffixButton()),
  );

  private readonly control = signal<FormFieldControl | null>(null);
  /** Bumped on every status, value, touched and pristine event of the registered control. */
  private readonly version = signal(0);
  /** Bumped on every native `input` event inside the field (counter outside Angular forms). */
  private readonly inputVersion = signal(0);
  private connected: AbstractControl | null = null;
  private subscription: { unsubscribe(): void } | null = null;

  protected readonly labelFor = computed(() => this.control()?.id() ?? this.controlId());

  private readonly errors = computed<ValidationErrors | null>(() => {
    this.version();
    return this.control()?.ngControl?.errors ?? null;
  });

  /** The message the field shows or would show now (D-11). */
  readonly message = computed<string | null>(() => {
    const explicit = this.error();
    if (explicit) return explicit;
    const errors = this.errors();
    if (!errors) return null;
    const messages = this.errorMessages();
    for (const key of Object.keys(errors)) {
      if (messages[key]) return messages[key];
    }
    for (const key of Object.keys(errors)) {
      const value: unknown = errors[key];
      if (typeof value === 'string' && value) return value;
    }
    return null;
  });

  /** True while the control has errors or an explicit error is set (what blocks a submit). */
  readonly hasError = computed(() => !!this.error() || !!this.errors());

  /** D-3: an explicit error at once; otherwise after a submit, or once changed and left. */
  protected readonly showError = computed(() => {
    if (this.error()) return true;
    if (!this.errors() || this.message() === null) return false;
    this.version();
    const ngControl = this.control()?.ngControl;
    const submitted = this.layout?.submitted() ?? false;
    return submitted || (!!ngControl?.dirty && !!ngControl?.touched);
  });

  readonly invalid = this.showError;

  protected readonly hasCounter = computed(() => this.maxLength() !== undefined);

  private readonly count = computed(() => {
    this.version();
    this.inputVersion();
    const control = this.control();
    if (!control) return 0;
    let value: unknown = control.ngControl ? control.ngControl.value : undefined;
    if (!control.ngControl) {
      const el = this.host.querySelector<HTMLInputElement>(`#${CSS.escape(control.id())}`);
      value = el?.value;
    }
    return [...String(value ?? '')].length;
  });

  protected readonly over = computed(() => this.count() > (this.maxLength() ?? Infinity));

  protected readonly counterCopy = computed(() => {
    const max = this.maxLength();
    const text = this.counterText();
    return max === undefined || !text ? '' : text(this.count(), max);
  });

  readonly describedBy = computed<string | null>(() => {
    const ids: string[] = [];
    if (this.showError()) ids.push(this.errorId);
    if (this.hint()) ids.push(this.hintId);
    if (!this.group) {
      for (const addon of this.addons()) {
        const id = addon.id();
        if (addon.described && id) ids.push(id);
      }
    }
    if (this.hasCounter()) ids.push(this.counterId);
    return ids.length ? ids.join(' ') : null;
  });

  protected readonly announcement = signal('');
  private lastAnnounced = '';
  private announceTimer: ReturnType<typeof setTimeout> | undefined;
  private clearTimer: ReturnType<typeof setTimeout> | undefined;

  constructor() {
    this.destroyRef.onDestroy(() => {
      this.subscription?.unsubscribe();
      clearTimeout(this.announceTimer);
      clearTimeout(this.clearTimer);
    });

    if (isDevMode()) {
      const reported = new Set<string>();
      effect(() => {
        const errors = this.errors();
        if (!errors || this.error() || this.message() !== null) return;
        const keys = Object.keys(errors).join(', ');
        if (reported.has(keys)) return;
        reported.add(keys);
        const label = untracked(this.label);
        console.error(
          `hp-form-field "${label}": no message for the validation error key(s) ${keys}. ` +
            'Add an entry to errorMessages, set error, or set a string-valued error.',
        );
      });
    }
  }

  ngOnInit(): void {
    if (isDevMode()) {
      if (this.maxLength() !== undefined && !this.counterText()) {
        console.error(
          `hp-form-field "${this.label()}": maxLength is set without counterText. ` +
            'Pass counterText, e.g. (n, max) => `${n} of ${max} characters`.',
        );
      }
      if (this.choice() && this.group) {
        console.error(
          `hp-form-field "${this.label()}": choice applies to div hosts only, not fieldset.`,
        );
      }
    }
    const layout = this.layout;
    if (layout) {
      const unregister = layout.register({
        label: this.label,
        message: this.message,
        invalid: this.hasError,
        controlId: this.labelFor,
        element: this.host,
        focus: () => this.focus(),
        control: this.formControl,
      });
      this.destroyRef.onDestroy(unregister);
    }
  }

  ngAfterContentInit(): void {
    this.connect();
  }

  ngAfterContentChecked(): void {
    this.connect();
  }

  register(control: FormFieldControl): () => void {
    if (this.control() && isDevMode()) {
      console.error(
        `hp-form-field "${untracked(this.label)}": a second control registered; a field holds exactly one control.`,
      );
    }
    this.control.set(control);
    this.connect();
    return () => {
      if (this.control() === control) {
        this.control.set(null);
        this.connect();
      }
    };
  }

  /** Moves focus to the registered control (error-summary links). */
  focus(): void {
    this.control()?.focus();
  }

  protected onInput(): void {
    this.inputVersion.update((v) => v + 1);
    if (this.maxLength() !== undefined) this.scheduleAnnouncement();
  }

  /** The registered control's forms control, for the form layout's submit. */
  private readonly formControl = computed(() => this.control()?.ngControl?.control ?? null);

  /** Subscribes to the registered control's events, resubscribing when the control changes. */
  private connect(): void {
    const control = untracked(this.control)?.ngControl?.control ?? null;
    if (control === this.connected) return;
    this.subscription?.unsubscribe();
    this.subscription = null;
    this.connected = control;
    if (control) {
      this.subscription = control.events.subscribe((event) => {
        if (
          event instanceof StatusChangeEvent ||
          event instanceof ValueChangeEvent ||
          event instanceof TouchedChangeEvent ||
          event instanceof PristineChangeEvent
        ) {
          this.version.update((v) => v + 1);
        }
      });
    }
    this.version.update((v) => v + 1);
  }

  private scheduleAnnouncement(): void {
    clearTimeout(this.announceTimer);
    this.announceTimer = setTimeout(() => {
      const max = this.maxLength();
      if (max === undefined) return;
      const text = this.counterCopy();
      if (this.count() < COUNTER_ANNOUNCE_THRESHOLD * max || !text || text === this.lastAnnounced)
        return;
      this.lastAnnounced = text;
      this.announcement.set(text);
      clearTimeout(this.clearTimer);
      this.clearTimer = setTimeout(() => this.announcement.set(''), COUNTER_ANNOUNCE_CLEAR_MS);
    }, COUNTER_ANNOUNCE_DELAY_MS);
  }
}
