import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Injectable,
  Injector,
  Signal,
  afterNextRender,
  booleanAttribute,
  computed,
  effect,
  inject,
  input,
  isDevMode,
  output,
  signal,
  untracked,
  viewChild,
} from '@angular/core';
import { AbstractControl, ControlContainer } from '@angular/forms';

import { Alert } from '../alert/alert';
import { FormLayoutContext, FormLayoutField, HP_FORM_LAYOUT } from './form-layout-context';

/** Form layouts: one column of fields, or the inline search row. */
export type FormLayoutKind = 'stack' | 'inline';

/** Builds the error summary's title from the number of fields to fix. */
export type FormLayoutSummaryTitle = (invalidCount: number) => string;

let nextFormId = 0;

/** The registry the form layout offers the form fields inside it (`HP_FORM_LAYOUT`). */
@Injectable()
export class FormLayoutRegistry implements FormLayoutContext {
  private readonly submittedState = signal(false);
  private readonly registered = signal<readonly FormLayoutField[]>([]);

  readonly submitted: Signal<boolean> = this.submittedState.asReadonly();
  /** The registered fields in document order. */
  readonly fields = computed(() => [...this.registered()].sort(byDocumentPosition));

  register(field: FormLayoutField): () => void {
    this.registered.update((fields) => [...fields, field]);
    return () => this.registered.update((fields) => fields.filter((f) => f !== field));
  }

  markSubmitted(): void {
    this.submittedState.set(true);
  }
}

function byDocumentPosition(a: FormLayoutField, b: FormLayoutField): number {
  if (a.element === b.element) return 0;
  return a.element.compareDocumentPosition(b.element) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1;
}

/**
 * Arranges a form and makes it safe to submit (form-layout.md). The host is the native
 * `<form novalidate>`. After a blocked submit it shows a linked error summary as its first
 * child, focuses it, and keeps it live until every field is fixed.
 */
@Component({
  selector: 'form[hp-form-layout]',
  exportAs: 'hpFormLayout',
  imports: [Alert],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [FormLayoutRegistry, { provide: HP_FORM_LAYOUT, useExisting: FormLayoutRegistry }],
  host: {
    novalidate: '',
    '[class.stack]': "layout() === 'stack'",
    '[class.filter-row]': "layout() === 'inline'",
    '(submit)': 'onSubmit($event)',
  },
  template: `@if (showsSummary()) {
      <hp-alert
        #summary
        tone="danger"
        class="form-summary"
        tabindex="-1"
        role="group"
        [attr.aria-labelledby]="title() ? titleId : null"
      >
        @if (title()) {
          <strong [id]="titleId">{{ title() }}</strong>
        }
        <ul>
          @for (field of invalidFields(); track field) {
            <li>
              <a [href]="'#' + field.controlId()" (click)="go($event, field)"
                >{{ field.label() }}: {{ field.message() }}</a
              >
            </li>
          }
        </ul>
      </hp-alert>
    }
    <ng-content />`,
  styles: `
    :host(.filter-row) {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: var(--space-3);
      margin-bottom: var(--space-4);
    }

    .form-summary {
      border-left-width: var(--border-width-accent);
    }

    .form-summary ul {
      margin-top: var(--space-1);
      padding-left: var(--space-5);
    }

    .form-summary a {
      color: inherit;
      font-weight: var(--font-weight-semibold);
      overflow-wrap: anywhere;
    }

    .form-summary:focus-visible {
      outline-offset: var(--focus-ring-offset);
    }

    @media (forced-colors: active) {
      .form-summary a {
        color: LinkText;
        text-decoration: underline;
      }
    }
  `,
})
export class FormLayout {
  /** `stack` adds `.stack`; `inline` adds `.filter-row` and never shows a summary. */
  readonly layout = input<FormLayoutKind>('stack');
  /** Builds the summary title from the count: `n => \`Check ${n} fields before sending\``. */
  readonly summaryTitle = input<FormLayoutSummaryTitle | undefined>(undefined);
  /** While true every submit is cancelled and nothing is emitted (D-10). */
  readonly busy = input(false, { transform: booleanAttribute });

  /** A submit found every registered field valid. Once per submit. */
  readonly submitted = output<void>();
  /** A submit found invalid fields; the payload is how many. */
  readonly submitBlocked = output<number>();

  private readonly registry = inject(FormLayoutRegistry);
  private readonly container = inject(ControlContainer, { self: true, optional: true });
  private readonly injector = inject(Injector);
  private readonly summary = viewChild('summary', { read: ElementRef });

  protected readonly titleId = `hp-form-${++nextFormId}-summary-title`;

  private readonly summaryOpen = signal(false);

  protected readonly invalidFields = computed(() =>
    this.registry.fields().filter((field) => field.invalid()),
  );

  protected readonly showsSummary = computed(
    () => this.layout() === 'stack' && this.summaryOpen() && this.invalidFields().length > 0,
  );

  protected readonly title = computed(() => {
    const build = this.summaryTitle();
    return build ? build(this.invalidFields().length) : '';
  });

  /** Submits currently being judged, so a newer submit supersedes a pending one. */
  private attempt = 0;

  constructor() {
    // D-6: the summary is live; when its count reaches 0 it closes, and if it held focus,
    // focus moves to the first field before it leaves the DOM.
    effect(() => {
      if (!this.summaryOpen() || this.invalidFields().length > 0) return;
      untracked(() => {
        const summary = this.summary()?.nativeElement as HTMLElement | undefined;
        const active = summary?.ownerDocument.activeElement;
        this.summaryOpen.set(false);
        if (summary && active && summary.contains(active)) {
          this.registry.fields()[0]?.focus();
        }
      });
    });

    if (isDevMode()) {
      let reported = false;
      effect(() => {
        if (!this.showsSummary() || this.summaryTitle() || reported) return;
        reported = true;
        console.error(
          'hp-form-layout: summaryTitle is required to show the error summary. ' +
            'Pass e.g. n => n === 1 ? "Check 1 field before sending" : `Check ${n} fields before sending`.',
        );
      });
    }
  }

  /**
   * Shows and focuses the summary for the fields that are invalid now, as a blocked submit does,
   * without emitting. Does nothing when no field is invalid.
   */
  showSummary(): void {
    this.markAllTouched();
    this.registry.markSubmitted();
    const count = untracked(this.invalidFields).length;
    if (count > 0) this.openSummary();
  }

  protected onSubmit(event: Event): void {
    event.preventDefault();
    if (this.busy()) return;
    const attempt = ++this.attempt;
    this.markAllTouched();
    this.registry.markSubmitted();
    const control = this.container?.control;
    if (control && control.pending) {
      this.whenSettled(control, () => {
        if (attempt === this.attempt) this.judge();
      });
      return;
    }
    this.judge();
  }

  protected go(event: Event, field: FormLayoutField): void {
    event.preventDefault();
    field.focus();
  }

  private judge(): void {
    const count = untracked(this.invalidFields).length;
    if (count > 0) {
      this.openSummary();
      this.submitBlocked.emit(count);
    } else {
      this.summaryOpen.set(false);
      this.submitted.emit();
    }
  }

  private openSummary(): void {
    if (this.layout() !== 'stack') return;
    this.summaryOpen.set(true);
    afterNextRender(
      {
        write: () => {
          (this.summary()?.nativeElement as HTMLElement | undefined)?.focus();
        },
      },
      { injector: this.injector },
    );
  }

  private markAllTouched(): void {
    this.container?.control?.markAllAsTouched();
  }

  private whenSettled(control: AbstractControl, done: () => void): void {
    const subscription = control.statusChanges.subscribe((status) => {
      if (status !== 'PENDING') {
        subscription.unsubscribe();
        done();
      }
    });
  }
}
