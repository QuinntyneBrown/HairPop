import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Button, FieldAddon, FormField, Icon, SearchBox, TextField } from '@hairpop/components';

import { Example } from '../shared';

/** Stories for the text field (text field CRD): types, sizes, states and the search box. */
@Component({
  selector: 'hp-text-field-examples',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    Button,
    Example,
    FieldAddon,
    FormField,
    Icon,
    ReactiveFormsModule,
    SearchBox,
    TextField,
  ],
  template: `
    <hp-example heading="Types" description="Each type with its autocomplete token.">
      <div class="story-form">
        <div hp-form-field label="Name">
          <input hp-text-field type="text" autocomplete="name" value="Maya Chen" />
        </div>
        <div hp-form-field label="Email" hint="Nia uses this to reply about your request.">
          <input hp-text-field type="email" autocomplete="email" value="maya.chen@example.com" />
        </div>
        <div hp-form-field label="Phone" optionalMarker="(optional)">
          <input hp-text-field type="tel" autocomplete="tel" value="416-555-0148" />
        </div>
        <div hp-form-field label="Website" optionalMarker="(optional)">
          <input hp-text-field type="url" autocomplete="url" placeholder="https://" />
        </div>
      </div>
    </hp-example>

    <hp-example
      heading="Password with Show"
      description="The suffix button toggles revealed; its label stays “Show” and aria-pressed carries the state."
    >
      <div class="story-form">
        <div hp-form-field label="Password">
          <input
            #pw
            hp-text-field
            type="password"
            autocomplete="current-password"
            value="correcthorse"
            [revealed]="shown()"
          />
          <button hp-button slot="suffix" [(pressed)]="shown" [attr.aria-controls]="pw.id">
            Show
          </button>
        </div>
      </div>
    </hp-example>

    <hp-example
      heading="Number with addons"
      description="A hidden $ prefix; a described km suffix."
    >
      <div class="story-form">
        <div hp-form-field label="Maximum price">
          <span hp-field-addon slot="prefix" aria-hidden="true">$</span>
          <input hp-text-field type="number" inputmode="numeric" min="0" step="10" value="150" />
        </div>
        <div hp-form-field label="Distance from Toronto">
          <input hp-text-field type="number" inputmode="numeric" min="0" value="10" />
          <span hp-field-addon slot="suffix">km</span>
        </div>
      </div>
    </hp-example>

    <hp-example heading="Sizes" description="Small for dense filter rows; large for a hero search.">
      <div class="story-form">
        <input hp-text-field fieldSize="sm" aria-label="City" value="Toronto" />
        <input hp-text-field aria-label="City" value="Toronto" />
        <input
          hp-text-field
          fieldSize="lg"
          type="search"
          aria-label="Search styles"
          value="knotless braids"
        />
      </div>
    </hp-example>

    <hp-example heading="States">
      <div class="story-form">
        <div hp-form-field label="Your email">
          <input hp-text-field type="email" autocomplete="email" placeholder="name@example.com" />
        </div>
        <div hp-form-field label="Email" error="Enter an email address like name@example.com.">
          <input hp-text-field type="email" autocomplete="email" value="maya.chen@" />
        </div>
        <div hp-form-field label="Request number">
          <input hp-text-field readonly value="HP-1048" />
        </div>
        <div hp-form-field label="Phone" optionalMarker="(optional)">
          <input hp-text-field type="tel" disabled value="416-555-0148" />
        </div>
        <input hp-text-field aria-label="Name" aria-invalid="true" value="" />
      </div>
    </hp-example>

    <hp-example
      heading="Validation"
      description="Reactive forms: the error shows once the value is changed and the field is left."
    >
      <div class="story-form">
        <div
          hp-form-field
          label="Email"
          [errorMessages]="{
            required: 'Enter your email.',
            email: 'Enter an email address like name@example.com.',
          }"
        >
          <input hp-text-field type="email" autocomplete="email" required [formControl]="email" />
        </div>
      </div>
    </hp-example>

    <hp-example heading="Search box" description="Icon at the start; grow fills a filter row.">
      <div class="story-row">
        <div hp-search-box grow>
          <svg hp-icon name="search"></svg>
          <input
            hp-text-field
            type="search"
            aria-label="Search style gallery"
            enterkeyhint="search"
            value="knotless braids"
          />
        </div>
        <button hp-button variant="primary">Find braiders</button>
      </div>
      <div hp-search-box>
        <svg hp-icon name="search"></svg>
        <input hp-text-field type="search" aria-label="Search styles" />
      </div>
    </hp-example>
  `,
  styles: `
    .story-form {
      flex: 1 1 100%;
      display: flex;
      flex-direction: column;
      gap: var(--space-4);
      max-width: var(--layout-form-max);
    }

    .story-row {
      flex: 1 1 100%;
      display: flex;
      flex-wrap: wrap;
      gap: var(--space-3);
    }
  `,
})
export class TextFieldExamples {
  protected readonly shown = signal(false);
  protected readonly email = new FormControl('maya.chen@example.com', {
    nonNullable: true,
    validators: [Validators.required, Validators.email],
  });
}
