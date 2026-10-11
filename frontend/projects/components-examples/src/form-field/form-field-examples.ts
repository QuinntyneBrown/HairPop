import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  Button,
  Checkbox,
  FieldAddon,
  FormField,
  FormFieldCounterText,
  Radio,
  RadioGroup,
  Select,
  TextField,
  Textarea,
} from '@hairpop/components';

import { Example } from '../shared';

const PREVIOUS_HAIR_DETAILS =
  'Shoulder-length natural hair, last braided Sat 3 Oct (HP-0992). Scalp is sensitive at the edges, so please keep the front parts loose. I would like medium knotless braids to mid-back with a little curl at the ends, and I can bring my own hair.';

/** Stories for the form field (form-field.md) and its field addon: every variant and state. */
@Component({
  selector: 'hp-form-field-examples',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    Button,
    Checkbox,
    Example,
    FieldAddon,
    FormField,
    Radio,
    RadioGroup,
    ReactiveFormsModule,
    Select,
    TextField,
    Textarea,
  ],
  template: `
    <hp-example
      heading="Label and control"
      description="A div host with a label for its one control."
    >
      <div hp-form-field class="demo" label="Your email">
        <input hp-text-field type="email" autocomplete="email" value="maya.chen&#64;example.com" />
      </div>
    </hp-example>

    <hp-example heading="With hint" description="A rule to know before typing.">
      <div hp-form-field class="demo" label="Password" hint="Use at least 12 characters.">
        <input hp-text-field type="password" autocomplete="new-password" />
      </div>
    </hp-example>

    <hp-example heading="Optional" description="The optional marker follows the label.">
      <div
        hp-form-field
        class="demo"
        label="Phone"
        optionalMarker="(optional)"
        hint="Braiders text this number."
      >
        <input hp-text-field type="tel" autocomplete="tel" />
      </div>
    </hp-example>

    <hp-example
      heading="Invalid"
      description="An explicit error shows at once; the control gets aria-invalid."
    >
      <div
        hp-form-field
        class="demo"
        label="Email"
        error="Enter an email address like name&#64;example.com."
      >
        <input hp-text-field type="email" value="maya.chen&#64;" />
      </div>
    </hp-example>

    <hp-example
      heading="Invalid with hint"
      description="The hint stays above the error; the error is read first."
    >
      <div
        hp-form-field
        class="demo"
        label="New password"
        hint="Use at least 12 characters."
        error="Use at least 12 characters."
      >
        <input hp-text-field type="password" value="braids24" />
      </div>
    </hp-example>

    <hp-example
      heading="Validation (interactive)"
      description="Validator errors show once the value has changed and the field is left."
    >
      <div hp-form-field class="demo" label="Your email" [errorMessages]="emailMessages">
        <input hp-text-field type="email" autocomplete="email" [formControl]="email" />
      </div>
    </hp-example>

    <hp-example
      heading="Counter"
      description="Counts characters against the limit; announced near the limit."
    >
      <div
        hp-form-field
        class="demo"
        label="Your review"
        hint="What should others know about your visit?"
        [maxLength]="500"
        [counterText]="counter"
        [errorMessages]="reviewMessages"
      >
        <textarea hp-textarea autoGrow [formControl]="review"></textarea>
      </div>
    </hp-example>

    <hp-example
      heading="Over limit"
      description="The counter turns danger at once; the error follows the timing rule."
    >
      <div
        hp-form-field
        class="demo"
        label="Hair details"
        optionalMarker="(optional)"
        [maxLength]="200"
        [counterText]="counter"
        [errorMessages]="hairMessages"
      >
        <textarea hp-textarea [formControl]="hair"></textarea>
      </div>
    </hp-example>

    <hp-example heading="Prefix addon" description="A hidden “$” prefix on a number field.">
      <div hp-form-field class="demo" label="Maximum price">
        <span hp-field-addon slot="prefix" aria-hidden="true">$</span>
        <input hp-text-field type="number" inputmode="numeric" min="0" step="10" value="240" />
      </div>
    </hp-example>

    <hp-example heading="Suffix addon" description="A described “km” unit after the control.">
      <div hp-form-field class="demo" label="Distance from Toronto">
        <input hp-text-field type="number" inputmode="numeric" min="0" value="10" />
        <span hp-field-addon slot="suffix">km</span>
      </div>
    </hp-example>

    <hp-example heading="Invalid with addon" description="A server-side minimum on the price.">
      <div
        hp-form-field
        class="demo"
        label="Maximum price"
        error="Enter a price of at least $160 for this style."
      >
        <span hp-field-addon slot="prefix" aria-hidden="true">$</span>
        <input hp-text-field type="number" inputmode="numeric" min="0" step="10" value="120" />
      </div>
    </hp-example>

    <hp-example
      heading="Suffix button (interactive)"
      description="An attached “Show” toggle reveals the password."
    >
      <div hp-form-field class="demo" label="Password" hint="Use at least 12 characters.">
        <input
          #pw
          hp-text-field
          type="password"
          autocomplete="current-password"
          value="knotless-braids-2026"
          [revealed]="shown()"
        />
        <button hp-button slot="suffix" [(pressed)]="shown" [attr.aria-controls]="pw.id">
          {{ shown() ? 'Hide' : 'Show' }}
        </button>
      </div>
    </hp-example>

    <hp-example heading="Select" description="A select in a field.">
      <div hp-form-field class="demo" label="Service">
        <select hp-select>
          <option>Medium knotless braids · from $180</option>
          <option>Passion twists · from $160</option>
          <option>Cornrows · from $90</option>
        </select>
      </div>
    </hp-example>

    <hp-example
      heading="Group"
      description="A fieldset host with a legend hosting a radio card group."
    >
      <fieldset hp-form-field class="demo" label="Preferred time">
        <hp-radio-group cards [formControl]="time">
          <label hp-radio value="sat-10" description="About five hours · estimate $180–$240"
            >Sat 24 Oct, 10:00 am</label
          >
          <label hp-radio value="sat-13" description="About five hours · estimate $180–$240"
            >Sat 24 Oct, 1:00 pm</label
          >
        </hp-radio-group>
      </fieldset>
    </hp-example>

    <hp-example
      heading="Group invalid"
      description="The error sits below the options; every option is aria-invalid."
    >
      <fieldset hp-form-field class="demo" label="Rating, 1 to 5" [errorMessages]="ratingMessages">
        <hp-radio-group orientation="horizontal" required [formControl]="rating">
          <label hp-radio value="1">1</label>
          <label hp-radio value="2">2</label>
          <label hp-radio value="3">3</label>
          <label hp-radio value="4">4</label>
          <label hp-radio value="5">5 (excellent)</label>
        </hp-radio-group>
      </fieldset>
    </hp-example>

    <hp-example heading="Choice" description="One checkbox whose own label asks the question.">
      <div hp-form-field class="demo" choice label="Remember my optional usage choices">
        <label hp-checkbox>Remember my optional usage choices</label>
      </div>
    </hp-example>

    <hp-example heading="Choice invalid">
      <div
        hp-form-field
        class="demo"
        choice
        label="I’ve read Nia’s cancellation policy"
        error="Confirm you’ve read the policy to send your request."
      >
        <label hp-checkbox>I’ve read Nia’s cancellation policy</label>
      </div>
    </hp-example>

    <hp-example
      heading="Read-only"
      description="The control’s sunken, dashed look; the field is unchanged."
    >
      <div hp-form-field class="demo" label="Request reference">
        <input hp-text-field value="HP-1048" readonly />
      </div>
    </hp-example>

    <hp-example
      heading="Disabled"
      description="The hint stays at full contrast so the reason is readable."
    >
      <div hp-form-field class="demo" label="Email" hint="Verify your email to change this.">
        <input hp-text-field type="email" value="maya.chen&#64;example.com" disabled />
      </div>
    </hp-example>

    <hp-example heading="Disabled group" description="disabled on the fieldset host.">
      <fieldset hp-form-field class="demo" label="Preferred time" disabled>
        <hp-radio-group>
          <label hp-radio value="sat-10">Sat 24 Oct, 10:00 am</label>
          <label hp-radio value="sat-13">Sat 24 Oct, 1:00 pm</label>
        </hp-radio-group>
      </fieldset>
    </hp-example>

    <hp-example
      heading="Narrow column"
      description="Label, hint and error wrap and break long words."
    >
      <div
        hp-form-field
        class="narrow"
        label="Email address for appointment updates from Nia Okafor"
        hint="We send updates to maya.chen.knotless&#64;example.com."
        error="Enter an email address like name&#64;example.com."
      >
        <input hp-text-field type="email" />
      </div>
    </hp-example>
  `,
  styles: `
    .demo {
      flex: 1 1 100%;
      max-width: var(--layout-form-max);
    }

    .narrow {
      max-width: var(--layout-sidebar-width);
    }
  `,
})
export class FormFieldExamples {
  protected readonly counter: FormFieldCounterText = (n, max) => `${n} of ${max} characters`;

  protected readonly emailMessages = {
    required: 'Enter your email.',
    email: 'Enter an email address like name@example.com.',
  };
  protected readonly reviewMessages = {
    required: 'Write a few words about your visit with Nia.',
    maxlength: 'Shorten this to 500 characters or fewer.',
  };
  protected readonly hairMessages = { maxlength: 'Shorten this to 200 characters or fewer.' };
  protected readonly ratingMessages = { required: 'Choose a rating from 1 to 5.' };

  protected readonly email = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.email],
  });
  protected readonly review = new FormControl(
    'Nia was patient, on time and the braids look neat. I would book her again.',
    { nonNullable: true, validators: [Validators.required, Validators.maxLength(500)] },
  );
  protected readonly hair = new FormControl(PREVIOUS_HAIR_DETAILS, {
    nonNullable: true,
    validators: [Validators.maxLength(200)],
  });
  protected readonly time = new FormControl<string | null>('sat-10');
  protected readonly rating = new FormControl<string | null>(null, Validators.required);

  protected readonly shown = signal(false);

  constructor() {
    // Show the group error as it appears after Maya leaves the rating unanswered.
    this.rating.markAsDirty();
    this.rating.markAsTouched();
  }
}
