import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { Checkbox, CheckboxGroup, FormField } from '@hairpop/components';

import { Example } from '../shared';

/** One row of the selection-column story. */
interface AppointmentRow {
  readonly reference: string;
  readonly selected: boolean;
}

/** Stories for the checkbox (checkbox.md): every variant and state, alone and in a group. */
@Component({
  selector: 'hp-checkbox-examples',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Checkbox, CheckboxGroup, Example, FormField],
  template: `
    <hp-example heading="Single" description="Two-way bound with [(checked)].">
      <label hp-checkbox [(checked)]="policyRead">I’ve read Nia’s cancellation policy</label>
      <p class="note">{{ policyRead() ? 'Checked' : 'Not checked' }}</p>
    </hp-example>

    <hp-example heading="With description" description="A consequence sentence under the label.">
      <label
        hp-checkbox
        [(checked)]="optionalUsage"
        description="Helps us improve search. You can change this any time."
        >Remember my optional usage choices</label
      >
    </hp-example>

    <hp-example heading="Card" description="A weightier choice that reads as a block.">
      <label
        hp-checkbox
        card
        [(checked)]="emailReplies"
        description="Updates about HP-1048 go to maya.chen&#64;example.com."
        >Email me when Nia replies</label
      >
    </hp-example>

    <hp-example heading="States" description="Unchecked, checked, disabled and disabled checked.">
      <label hp-checkbox>Unchecked</label>
      <label hp-checkbox checked>Checked</label>
      <label hp-checkbox disabled>Disabled</label>
      <label hp-checkbox disabled checked>Disabled checked</label>
      <label hp-checkbox invalid>Invalid</label>
      <label hp-checkbox indeterminate>Indeterminate</label>
    </hp-example>

    <hp-example
      heading="Invalid in a form field"
      description="The field shows the error, marks the box invalid and describes it."
    >
      <div
        hp-form-field
        choice
        label="Cancellation policy"
        error="Confirm you’ve read the policy to send your request."
      >
        <label hp-checkbox required>I’ve read Nia’s cancellation policy</label>
      </div>
    </hp-example>

    <hp-example
      heading="Indeterminate"
      description="A selection column: select all is mixed while some rows are selected."
    >
      <div class="stack stack--sm">
        <label
          hp-checkbox
          hideLabel
          [checked]="allSelected()"
          [indeterminate]="someSelected()"
          (checkedChange)="selectAll($event)"
          >Select all appointments</label
        >
        @for (row of rows(); track row.reference) {
          <div class="row">
            <label
              hp-checkbox
              hideLabel
              [checked]="row.selected"
              (checkedChange)="select(row.reference, $event)"
              >Select {{ row.reference }}</label
            >
            <span>{{ row.reference }}</span>
          </div>
        }
      </div>
    </hp-example>

    <hp-example heading="Group" description="The checked values as one list, inside a fieldset.">
      <fieldset hp-form-field label="Styles to include">
        <hp-checkbox-group [(value)]="styles">
          <label hp-checkbox value="knotless">Knotless braids</label>
          <label hp-checkbox value="passion-twists">Passion twists</label>
          <label hp-checkbox value="cornrows">Cornrows</label>
        </hp-checkbox-group>
      </fieldset>
      <p class="note">Value: {{ styles().join(', ') || 'none' }}</p>
    </hp-example>

    <hp-example heading="Group, horizontal" description="Inline from 768 px.">
      <fieldset hp-form-field label="Days that work">
        <hp-checkbox-group orientation="horizontal" [value]="['sat']">
          <label hp-checkbox value="fri">Fri</label>
          <label hp-checkbox value="sat">Sat</label>
          <label hp-checkbox value="sun">Sun</label>
        </hp-checkbox-group>
      </fieldset>
    </hp-example>

    <hp-example heading="Group, invalid" description="The field’s error marks every child invalid.">
      <fieldset hp-form-field label="Styles to include" error="Choose at least one style.">
        <hp-checkbox-group>
          <label hp-checkbox value="knotless">Knotless braids</label>
          <label hp-checkbox value="passion-twists">Passion twists</label>
          <label hp-checkbox value="cornrows">Cornrows</label>
        </hp-checkbox-group>
      </fieldset>
    </hp-example>

    <hp-example heading="Group, disabled">
      <fieldset hp-form-field label="Styles to include">
        <hp-checkbox-group disabled [value]="['knotless']">
          <label hp-checkbox value="knotless">Knotless braids</label>
          <label hp-checkbox value="passion-twists">Passion twists</label>
        </hp-checkbox-group>
      </fieldset>
    </hp-example>

    <hp-example
      heading="Group named by a heading"
      description="Outside a fieldset the group takes role group and aria-labelledby."
    >
      <div class="stack stack--sm">
        <p id="checkbox-example-reminders" class="note">Reminders for HP-1048</p>
        <hp-checkbox-group aria-labelledby="checkbox-example-reminders" [value]="['day-before']">
          <label hp-checkbox value="week-before">A week before</label>
          <label hp-checkbox value="day-before">The day before</label>
        </hp-checkbox-group>
      </div>
    </hp-example>

    <hp-example
      heading="Long label"
      description="The text wraps under itself, never under the box."
    >
      <div class="narrow">
        <label
          hp-checkbox
          description="Nia can see this note before she accepts Sat 24 Oct at 10:00 am."
          >Share my previous appointment notes from Sat 3 Oct (HP-0992) with Amara Nkiruka
          Adeyemi-Williams</label
        >
      </div>
    </hp-example>
  `,
  styles: `
    .note {
      margin: 0;
      font: var(--text-body-sm);
      color: var(--color-fg-muted);
    }

    .row {
      display: flex;
      align-items: center;
      gap: var(--space-3);
    }

    .narrow {
      max-width: var(--layout-card-min);
    }
  `,
})
export class CheckboxExamples {
  protected readonly policyRead = signal(false);
  protected readonly optionalUsage = signal(true);
  protected readonly emailReplies = signal(true);
  protected readonly styles = signal<string[]>(['knotless']);

  protected readonly rows = signal<readonly AppointmentRow[]>([
    { reference: 'HP-1048', selected: true },
    { reference: 'HP-0992', selected: false },
  ]);
  protected readonly allSelected = computed(() => this.rows().every((row) => row.selected));
  protected readonly someSelected = computed(
    () => !this.allSelected() && this.rows().some((row) => row.selected),
  );

  protected selectAll(selected: boolean): void {
    this.rows.update((rows) => rows.map((row) => ({ ...row, selected })));
  }

  protected select(reference: string, selected: boolean): void {
    this.rows.update((rows) =>
      rows.map((row) => (row.reference === reference ? { ...row, selected } : row)),
    );
  }
}
