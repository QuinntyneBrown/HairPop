import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  Button,
  Card,
  FormActions,
  FormField,
  FormFieldCounterText,
  FormLayout,
  FormLayoutSummaryTitle,
  FormRow,
  Icon,
  InlineMessage,
  Radio,
  RadioGroup,
  SearchBox,
  Select,
  TextField,
  Textarea,
} from '@hairpop/components';

import { Example } from '../shared';

/** Stories for the form layout (form-layout.md) with its form row and form actions. */
@Component({
  selector: 'hp-form-layout-examples',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    Button,
    Card,
    Example,
    FormActions,
    FormField,
    FormLayout,
    FormRow,
    Icon,
    InlineMessage,
    Radio,
    RadioGroup,
    ReactiveFormsModule,
    SearchBox,
    Select,
    TextField,
    Textarea,
  ],
  template: `
    <hp-example
      heading="Page form (interactive)"
      description="Send with no time chosen to see the linked error summary; fix the field and it closes."
    >
      <section hp-card class="demo" aria-labelledby="details-title">
        <h2 id="details-title" class="panel-title">Your details</h2>
        <form
          hp-form-layout
          [formGroup]="booking"
          [busy]="sending()"
          [summaryTitle]="checkBeforeSending"
          (submitted)="send()"
          (submitBlocked)="sent.set(false)"
        >
          <div hp-form-field label="Service">
            <select hp-select formControlName="service">
              <option value="knotless">Medium knotless braids · from $180</option>
              <option value="twists">Passion twists · from $160</option>
              <option value="cornrows">Cornrows · from $90</option>
            </select>
          </div>
          <fieldset hp-form-field label="Preferred time" [errorMessages]="timeMessages">
            <hp-radio-group cards required formControlName="time">
              <label hp-radio value="sat-10" description="About five hours · estimate $180–$240"
                >Sat 24 Oct, 10:00 am</label
              >
              <label hp-radio value="sat-13" description="About five hours · estimate $180–$240"
                >Sat 24 Oct, 1:00 pm</label
              >
            </hp-radio-group>
          </fieldset>
          <div hp-form-row>
            <div hp-form-field label="Your email" [errorMessages]="emailMessages">
              <input
                hp-text-field
                type="email"
                autocomplete="email"
                required
                formControlName="email"
              />
            </div>
            <div hp-form-field label="Phone" optionalMarker="(optional)">
              <input hp-text-field type="tel" autocomplete="tel" formControlName="phone" />
            </div>
          </div>
          <div
            hp-form-field
            label="Hair details"
            optionalMarker="(optional)"
            [maxLength]="200"
            [counterText]="counter"
            [errorMessages]="hairMessages"
          >
            <textarea hp-textarea autoGrow formControlName="hair"></textarea>
          </div>
          <p class="text-muted">
            Estimate: $180–$240 · about 5 hours. Nia confirms the final price and time.
          </p>
          <div hp-form-actions>
            <p
              hp-inline-message
              kind="status"
              [progress]="sending()"
              [tone]="sent() ? 'success' : 'neutral'"
            >
              {{ statusText() }}
            </p>
            <button hp-button variant="primary" type="submit" [busy]="sending()">
              Send request
            </button>
          </div>
        </form>
      </section>
    </hp-example>

    <hp-example
      heading="Submitting"
      description="busy cancels further submits; nothing in the form changes but the button and status."
    >
      <section hp-card class="demo" aria-labelledby="settings-title">
        <h2 id="settings-title" class="panel-title">Account settings</h2>
        <form hp-form-layout busy [summaryTitle]="checkBeforeSaving">
          <div hp-form-field label="Name">
            <input hp-text-field autocomplete="name" value="Maya Chen" />
          </div>
          <div hp-form-field label="Email">
            <input
              hp-text-field
              type="email"
              autocomplete="email"
              value="maya.chen&#64;example.com"
            />
          </div>
          <div hp-form-actions>
            <p hp-inline-message kind="status" progress>Saving…</p>
            <button hp-button variant="primary" type="submit" busy>Save changes</button>
          </div>
        </form>
      </section>
    </hp-example>

    <hp-example
      heading="Sign in (interactive)"
      description="Two fields; the summary title counts what to fix."
    >
      <section hp-card class="demo" aria-labelledby="sign-in-title">
        <h2 id="sign-in-title" class="panel-title">Sign in</h2>
        <form hp-form-layout [formGroup]="signIn" [summaryTitle]="checkBeforeSigningIn">
          <div hp-form-field label="Email" [errorMessages]="emailMessages">
            <input hp-text-field type="email" autocomplete="email" formControlName="email" />
          </div>
          <div hp-form-field label="Password" [errorMessages]="passwordMessages">
            <input
              hp-text-field
              type="password"
              autocomplete="current-password"
              formControlName="password"
            />
          </div>
          <div hp-form-actions>
            <button hp-button variant="primary" type="submit">Sign in</button>
          </div>
        </form>
      </section>
    </hp-example>

    <hp-example
      heading="Form row"
      description="Two short related fields: one column, two from 768 px."
    >
      <div hp-form-row class="demo">
        <div hp-form-field label="Distance from Toronto">
          <select hp-select>
            <option>Within 5 km</option>
            <option selected>Within 10 km</option>
            <option>Within 25 km</option>
          </select>
        </div>
        <div hp-form-field label="Sort braiders by">
          <select hp-select>
            <option>Highest rated</option>
            <option>Closest</option>
            <option>Lowest price</option>
          </select>
        </div>
      </div>
    </hp-example>

    <hp-example
      heading="Form actions"
      description="Status first, then buttons aligned to the end; below 768 px the primary is full width and first."
    >
      <div hp-form-actions class="demo">
        <p hp-inline-message kind="status" tone="success" [live]="false">
          <svg hp-icon name="check" size="sm"></svg>Saved just now
        </p>
        <button hp-button>Cancel</button>
        <button hp-button variant="primary">Save changes</button>
      </div>
    </hp-example>

    <hp-example
      heading="Inline"
      description="A search form in a filter row; it never shows a summary."
    >
      <form hp-form-layout layout="inline" role="search" class="demo">
        <div hp-search-box grow>
          <svg hp-icon name="search"></svg>
          <input hp-text-field type="search" name="q" aria-label="Search style gallery" />
        </div>
        <a hp-button href="#">Find braiders</a>
      </form>
    </hp-example>

    <hp-example
      heading="Submitted from outside"
      description="A dialog-style footer button submits the form through its form attribute."
    >
      <div class="demo stack">
        <form
          hp-form-layout
          id="filter-braiders-form"
          [formGroup]="filters"
          [summaryTitle]="checkBeforeShowing"
          (submitted)="filtered.set(true)"
        >
          <div hp-form-field label="Maximum price" [errorMessages]="priceMessages">
            <input
              hp-text-field
              type="number"
              inputmode="numeric"
              step="10"
              formControlName="price"
            />
          </div>
        </form>
        <div class="cluster cluster--end">
          <p hp-inline-message kind="status" tone="success">
            {{ filtered() ? 'Showing braiders up to $' + filters.value.price : '' }}
          </p>
          <button hp-button variant="primary" type="submit" form="filter-braiders-form">
            Show braiders
          </button>
        </div>
      </div>
    </hp-example>
  `,
  styles: `
    .demo {
      flex: 1 1 100%;
      max-width: var(--layout-form-max);
    }

    .panel-title {
      font: var(--text-h3);
      margin-bottom: var(--space-4);
    }
  `,
})
export class FormLayoutExamples {
  protected readonly counter: FormFieldCounterText = (n, max) => `${n} of ${max} characters`;

  protected readonly checkBeforeSending: FormLayoutSummaryTitle = (n) =>
    n === 1 ? 'Check 1 field before sending' : `Check ${n} fields before sending`;
  protected readonly checkBeforeSaving: FormLayoutSummaryTitle = (n) =>
    n === 1 ? 'Check 1 field before saving' : `Check ${n} fields before saving`;
  protected readonly checkBeforeSigningIn: FormLayoutSummaryTitle = (n) =>
    n === 1 ? 'Check 1 field before signing in' : `Check ${n} fields before signing in`;
  protected readonly checkBeforeShowing: FormLayoutSummaryTitle = (n) =>
    n === 1 ? 'Check 1 field before showing braiders' : `Check ${n} fields before showing braiders`;

  protected readonly timeMessages = {
    required: 'Choose a time Nia offers. Her first slot on Sat 24 Oct is 10:00 am.',
  };
  protected readonly emailMessages = {
    required: 'Enter your email.',
    email: 'Enter an email address like name@example.com.',
  };
  protected readonly passwordMessages = { required: 'Enter your password.' };
  protected readonly hairMessages = { maxlength: 'Shorten this to 200 characters or fewer.' };
  protected readonly priceMessages = {
    required: 'Enter a maximum price.',
    min: 'Enter a price of at least $160 for this style.',
  };

  protected readonly booking = new FormGroup({
    service: new FormControl('knotless', { nonNullable: true }),
    time: new FormControl<string | null>(null, Validators.required),
    email: new FormControl('maya.chen@example.com', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    phone: new FormControl('', { nonNullable: true }),
    hair: new FormControl('', { nonNullable: true, validators: [Validators.maxLength(200)] }),
  });

  protected readonly signIn = new FormGroup({
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    password: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
  });

  protected readonly filters = new FormGroup({
    price: new FormControl<number | null>(120, [Validators.required, Validators.min(160)]),
  });

  protected readonly sending = signal(false);
  protected readonly sent = signal(false);
  protected readonly filtered = signal(false);

  protected readonly statusText = computed(() => {
    if (this.sending()) return 'Sending your request to Nia…';
    return this.sent() ? 'Request HP-1048 sent to Nia' : '';
  });

  protected send(): void {
    this.sending.set(true);
    this.sent.set(false);
    setTimeout(() => {
      this.sending.set(false);
      this.sent.set(true);
    }, 1500);
  }
}
