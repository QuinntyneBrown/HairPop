import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { ChangeDetectionStrategy, Component, Directive, inject, signal } from '@angular/core';
import {
  Alert,
  Badge,
  Button,
  Checkbox,
  CheckboxGroup,
  DescriptionList,
  DIALOG_CONTEXT,
  Dialog,
  DialogClose,
  DialogContext,
  DialogService,
  FormField,
  Icon,
} from '@hairpop/components';

import { Example } from '../shared';

/** Waits like a network call so the busy state is visible. */
function settle(): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, 1200));
}

let nextFrameId = 0;

/** A dialog context for an inline documentation frame, as `DialogService` would provide it. */
function inlineContext(variant: DialogContext['variant']): DialogContext {
  const id = `hp-dialog-example-${++nextFrameId}`;
  return {
    variant,
    size: variant === 'destructive' ? 'sm' : 'md',
    titleId: `${id}-title`,
    descriptionId: `${id}-desc`,
  };
}

/** Renders the `hp-dialog` inside it as a confirmation dialog, in flow. */
@Directive({
  selector: '[hpExampleConfirmationFrame]',
  providers: [{ provide: DIALOG_CONTEXT, useFactory: () => inlineContext('confirmation') }],
})
export class ExampleConfirmationFrame {}

/** Renders the `hp-dialog` inside it as a destructive dialog, in flow. */
@Directive({
  selector: '[hpExampleDestructiveFrame]',
  providers: [{ provide: DIALOG_CONTEXT, useFactory: () => inlineContext('destructive') }],
})
export class ExampleDestructiveFrame {}

/** Form dialog: one question and apply, with a busy apply. */
@Component({
  selector: 'hp-example-filter-braiders-dialog',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Button, Checkbox, CheckboxGroup, Dialog, FormField],
  template: `
    <hp-dialog
      heading="Filter braiders"
      description="Choose the styles that work for you."
      closeLabel="Close dialog"
      [busy]="applying()"
      busyLabel="Finding braiders…"
    >
      <form id="example-filter-braiders-form" (submit)="apply($event)">
        <fieldset hp-form-field label="Styles to include">
          <hp-checkbox-group [(value)]="styles">
            <label hp-checkbox value="knotless">Knotless braids</label>
            <label hp-checkbox value="passion-twists">Passion twists</label>
            <label hp-checkbox value="cornrows">Cornrows</label>
          </hp-checkbox-group>
        </fieldset>
      </form>
      <button hp-button slot="footer" (click)="styles.set([])">Clear filters</button>
      <button
        hp-button
        slot="footer"
        variant="primary"
        type="submit"
        form="example-filter-braiders-form"
        [busy]="applying()"
      >
        Show braiders
      </button>
    </hp-dialog>
  `,
})
export class ExampleFilterBraidersDialog {
  private readonly ref = inject<DialogRef<string>>(DialogRef);

  protected readonly styles = signal<string[]>(['knotless']);
  protected readonly applying = signal(false);

  protected async apply(event: Event): Promise<void> {
    event.preventDefault();
    if (this.applying()) return;
    this.applying.set(true);
    await settle();
    this.applying.set(false);
    this.ref.close(`Showing braiders for: ${this.styles().join(', ') || 'every style'}`);
  }
}

/** Confirmation dialog: check the details of HP-1048 before sending. */
@Component({
  selector: 'hp-example-review-request-dialog',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Badge, Button, DescriptionList, Dialog, DialogClose],
  template: `
    <hp-dialog
      heading="Review request"
      description="Nia will see these details and reply within a day."
      closeLabel="Close dialog"
    >
      <dl hp-description-list>
        <dt>Service</dt>
        <dd>Medium knotless braids</dd>
        <dt>Preferred time</dt>
        <dd>Sat 24 Oct · 10:00 am · about 5 hours</dd>
        <dt>Estimate</dt>
        <dd>$180–$240</dd>
        <dt>Status</dt>
        <dd><span hp-badge tone="warning">Not sent yet</span></dd>
      </dl>
      <button hp-button slot="footer" hpDialogClose>Edit request</button>
      <button hp-button slot="footer" variant="primary" hpDialogClose="Request HP-1048 sent to Nia">
        Send request
      </button>
    </hp-dialog>
  `,
})
export class ExampleReviewRequestDialog {}

/** Destructive dialog: cancel HP-1048, busy, failing once when asked to. */
@Component({
  selector: 'hp-example-cancel-request-dialog',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Alert, Button, Dialog, DialogClose],
  template: `
    <hp-dialog
      heading="Cancel request HP-1048?"
      description="Nia will see that you no longer need Sat 24 Oct at 10:00 am. You can send a new request later."
      [busy]="cancelling()"
      busyLabel="Cancelling your request…"
    >
      @if (failed()) {
        <hp-alert tone="danger" announce heading="We couldn’t cancel this request.">
          <p>Your request is unchanged. Check your connection and try again.</p>
        </hp-alert>
      }
      <button hp-button slot="footer" hpDialogClose>Keep request</button>
      <button hp-button slot="footer" variant="danger" [busy]="cancelling()" (click)="cancel()">
        {{ failed() ? 'Try again' : 'Cancel request' }}
      </button>
    </hp-dialog>
  `,
})
export class ExampleCancelRequestDialog {
  private readonly ref = inject<DialogRef<string>>(DialogRef);
  private failuresLeft = inject<{ failFirst: boolean } | undefined>(DIALOG_DATA)?.failFirst ? 1 : 0;

  protected readonly cancelling = signal(false);
  protected readonly failed = signal(false);

  protected async cancel(): Promise<void> {
    this.cancelling.set(true);
    await settle();
    this.cancelling.set(false);
    if (this.failuresLeft > 0) {
      this.failuresLeft--;
      this.failed.set(true);
      return;
    }
    this.ref.close('Request cancelled. Nia has been told you no longer need Sat 24 Oct.');
  }
}

/** Destructive dialog with its own chip icon. */
@Component({
  selector: 'hp-example-sign-out-dialog',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Button, Dialog, DialogClose, Icon],
  template: `
    <hp-dialog
      heading="Sign out?"
      description="You can return to browse styles at any time."
      [busy]="signingOut()"
      busyLabel="Signing you out…"
    >
      <svg hp-icon slot="icon" name="log-out"></svg>
      <button hp-button slot="footer" hpDialogClose>Stay signed in</button>
      <button hp-button slot="footer" variant="danger" [busy]="signingOut()" (click)="signOut()">
        Sign out
      </button>
    </hp-dialog>
  `,
})
export class ExampleSignOutDialog {
  private readonly ref = inject<DialogRef<string>>(DialogRef);

  protected readonly signingOut = signal(false);

  protected async signOut(): Promise<void> {
    this.signingOut.set(true);
    await settle();
    this.ref.close('Signed out. See you soon, Maya.');
  }
}

/** Large, reading-heavy form dialog whose body scrolls under a pinned footer. */
@Component({
  selector: 'hp-example-cookie-preferences-dialog',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Button, Checkbox, Dialog, DialogClose, FormField],
  template: `
    <hp-dialog
      heading="Cookie preferences"
      description="Choose which optional cookies HairPop may use. Required cookies keep you signed in."
      closeLabel="Close dialog"
    >
      @for (paragraph of paragraphs; track $index) {
        <p>{{ paragraph }}</p>
      }
      <div hp-form-field choice label="Remember my optional usage choices">
        <label
          hp-checkbox
          [(checked)]="optionalUsage"
          description="Helps us improve search. You can change this any time."
          >Remember my optional usage choices</label
        >
      </div>
      <button hp-button slot="footer" hpDialogClose>Cancel</button>
      <button hp-button slot="footer" variant="primary" (click)="save()">Save preferences</button>
    </hp-dialog>
  `,
})
export class ExampleCookiePreferencesDialog {
  private readonly ref = inject<DialogRef<string>>(DialogRef);

  protected readonly optionalUsage = signal(false);
  protected readonly paragraphs = [
    'Required cookies keep you signed in, remember your request HP-1048 while you finish it, and protect your account. They cannot be turned off.',
    'Optional usage cookies tell us which searches lead to a booking, so braiders like Nia Okafor, Aisha Mensah and Jules Baptiste show up for the styles you look for.',
    'We never sell this information or share it with advertisers. Usage data is kept for 13 months and then deleted.',
    'You can change your choice at any time from the footer link “Cookie preferences”. Your choice applies to this browser only.',
    'If you use HairPop on another device, choose your preferences there too.',
  ];

  protected save(): void {
    this.ref.close(
      this.optionalUsage() ? 'Optional usage cookies on' : 'Optional usage cookies off',
    );
  }
}

/**
 * Stories for the dialog (dialog.md): each variant opened through `DialogService`, plus inline
 * frames that show the layout in flow.
 */
@Component({
  selector: 'hp-dialog-examples',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    Alert,
    Button,
    Dialog,
    Example,
    ExampleConfirmationFrame,
    ExampleDestructiveFrame,
    Icon,
  ],
  template: `
    <hp-example
      heading="Open a dialog"
      description="Opened with DialogService: focus moves in, the page goes inert, Esc closes."
    >
      <button hp-button (click)="openFilter()">
        <svg hp-icon name="filter"></svg>
        Filter braiders
      </button>
      <button hp-button variant="primary" (click)="openReview()">Review request</button>
      <button hp-button variant="link" (click)="openCancel(false)">Cancel request</button>
      <button hp-button variant="link" (click)="openCancel(true)">
        Cancel request (fails once)
      </button>
      <button hp-button (click)="openSignOut()">
        <svg hp-icon name="log-out"></svg>
        Sign out
      </button>
      <button hp-button (click)="openCookies()">Cookie preferences (lg)</button>
      @if (result(); as result) {
        <hp-alert announce heading="Last result" class="result">
          <p>{{ result }}</p>
        </hp-alert>
      }
    </hp-example>

    <hp-example heading="Form" description="No icon chip; a close control in the header.">
      <div class="dialog dialog--inline">
        <div class="dialog__panel">
          <hp-dialog
            heading="Request a change"
            description="Ask Nia for a different time. Your current time stays booked until she replies."
            closeLabel="Close dialog"
          >
            <p>Your current time: Sat 24 Oct · 10:00 am.</p>
            <button hp-button slot="footer">Keep current time</button>
            <button hp-button slot="footer" variant="primary">Send request</button>
          </hp-dialog>
        </div>
      </div>
    </hp-example>

    <hp-example heading="Confirmation" description="Info chip and a close control.">
      <div class="dialog dialog--inline" hpExampleConfirmationFrame>
        <div class="dialog__panel">
          <hp-dialog
            heading="Review request"
            description="Nia will see these details and reply within a day."
            closeLabel="Close dialog"
          >
            <p>Medium knotless braids · Sat 24 Oct · 10:00 am · $180–$240.</p>
            <button hp-button slot="footer">Edit request</button>
            <button hp-button slot="footer" variant="primary">Send request</button>
          </hp-dialog>
        </div>
      </div>
    </hp-example>

    <hp-example heading="Destructive" description="Danger chip, no close control, sm width.">
      <div class="dialog dialog--inline" hpExampleDestructiveFrame>
        <div class="dialog__panel dialog__panel--sm">
          <hp-dialog
            heading="Cancel request HP-1048?"
            description="Nia will see that you no longer need Sat 24 Oct at 10:00 am. You can send a new request later."
          >
            <button hp-button slot="footer">Keep request</button>
            <button hp-button slot="footer" variant="danger">Cancel request</button>
          </hp-dialog>
        </div>
      </div>
    </hp-example>

    <hp-example
      heading="Busy"
      description="The confirm shows its spinner; nothing closes the dialog."
    >
      <div class="dialog dialog--inline" hpExampleDestructiveFrame>
        <div class="dialog__panel dialog__panel--sm">
          <hp-dialog
            heading="Cancel request HP-1048?"
            description="Nia will see that you no longer need Sat 24 Oct at 10:00 am. You can send a new request later."
            busy
            busyLabel="Cancelling your request…"
          >
            <button hp-button slot="footer">Keep request</button>
            <button hp-button slot="footer" variant="danger" busy>Cancel request</button>
          </hp-dialog>
        </div>
      </div>
    </hp-example>

    <hp-example
      heading="Failed"
      description="A danger alert first in the body; the confirm says “Try again”."
    >
      <div class="dialog dialog--inline" hpExampleDestructiveFrame>
        <div class="dialog__panel dialog__panel--sm">
          <hp-dialog
            heading="Cancel request HP-1048?"
            description="Nia will see that you no longer need Sat 24 Oct at 10:00 am. You can send a new request later."
          >
            <hp-alert tone="danger" heading="We couldn’t cancel this request.">
              <p>Your request is unchanged. Check your connection and try again.</p>
            </hp-alert>
            <button hp-button slot="footer">Keep request</button>
            <button hp-button slot="footer" variant="danger">Try again</button>
          </hp-dialog>
        </div>
      </div>
    </hp-example>

    <hp-example
      heading="Custom icon"
      description="A destructive dialog projecting its own chip icon."
    >
      <div class="dialog dialog--inline" hpExampleDestructiveFrame>
        <div class="dialog__panel dialog__panel--sm">
          <hp-dialog heading="Sign out?" description="You can return to browse styles at any time.">
            <svg hp-icon slot="icon" name="log-out"></svg>
            <button hp-button slot="footer">Stay signed in</button>
            <button hp-button slot="footer" variant="danger">Sign out</button>
          </hp-dialog>
        </div>
      </div>
    </hp-example>
  `,
  styles: `
    .dialog--inline,
    .result {
      flex: 1 1 100%;
    }
  `,
})
export class DialogExamples {
  private readonly dialogs = inject(DialogService);

  protected readonly result = signal<string | null>(null);

  protected openFilter(): void {
    this.track(
      this.dialogs.open<ExampleFilterBraidersDialog, unknown, string>(ExampleFilterBraidersDialog),
    );
  }

  protected openReview(): void {
    this.track(
      this.dialogs.open<ExampleReviewRequestDialog, unknown, string>(ExampleReviewRequestDialog, {
        variant: 'confirmation',
      }),
    );
  }

  protected openCancel(failFirst: boolean): void {
    this.track(
      this.dialogs.open<ExampleCancelRequestDialog, { failFirst: boolean }, string>(
        ExampleCancelRequestDialog,
        { variant: 'destructive', data: { failFirst } },
      ),
    );
  }

  protected openSignOut(): void {
    this.track(
      this.dialogs.open<ExampleSignOutDialog, unknown, string>(ExampleSignOutDialog, {
        variant: 'destructive',
      }),
    );
  }

  protected openCookies(): void {
    this.track(
      this.dialogs.open<ExampleCookiePreferencesDialog, unknown, string>(
        ExampleCookiePreferencesDialog,
        { size: 'lg' },
      ),
    );
  }

  private track<C>(ref: DialogRef<string, C>): void {
    ref.closed.subscribe((value) => this.result.set(value ?? 'Dismissed without a result'));
  }
}
