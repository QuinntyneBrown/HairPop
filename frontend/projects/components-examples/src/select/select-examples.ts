import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormField, Select } from '@hairpop/components';

import { Example } from '../shared';

/** Stories for the select (select.md): every variant, size and state. */
@Component({
  selector: 'hp-select-examples',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Example, FormField, Select],
  template: `
    <hp-example
      heading="Native"
      description="A value is always chosen. Bound to a signal through the native change event."
    >
      <div class="select-examples__field" hp-form-field label="Distance from Toronto">
        <select hp-select [value]="distance()" (change)="distance.set($any($event.target).value)">
          <option value="5">Within 5 km</option>
          <option value="10">Within 10 km</option>
          <option value="25">Within 25 km</option>
          <option value="50">Within 50 km</option>
        </select>
      </div>
      <span>Value: {{ distance() }} km</span>
    </hp-example>

    <hp-example
      heading="With placeholder option"
      description="A disabled first option when no sensible default exists."
    >
      <div class="select-examples__field" hp-form-field label="New preferred time">
        <select hp-select required>
          <option value="" disabled selected>Choose a time</option>
          <option value="sat-24-1000">Sat 24 Oct · 10:00 am</option>
          <option value="sat-24-1300">Sat 24 Oct · 1:00 pm</option>
        </select>
      </div>
    </hp-example>

    <hp-example heading="With option groups" description="Times grouped by day.">
      <div class="select-examples__field" hp-form-field label="New preferred time">
        <select hp-select>
          <optgroup label="Sat 24 Oct">
            <option value="sat-24-1000">10:00 am</option>
            <option value="sat-24-1300">1:00 pm</option>
          </optgroup>
          <optgroup label="Sun 25 Oct">
            <option value="sun-25-1100">11:00 am</option>
            <option value="sun-25-1400">2:00 pm</option>
          </optgroup>
        </select>
      </div>
    </hp-example>

    <hp-example heading="Sizes" description="fieldSize sm, md (default) and lg.">
      <div class="select-examples__field" hp-form-field label="Service, small">
        <select hp-select fieldSize="sm">
          <option>Knotless braids</option>
          <option>Box braids</option>
        </select>
      </div>
      <div class="select-examples__field" hp-form-field label="Service, medium">
        <select hp-select>
          <option>Knotless braids</option>
          <option>Box braids</option>
        </select>
      </div>
      <div class="select-examples__field" hp-form-field label="Service, large">
        <select hp-select fieldSize="lg">
          <option>Knotless braids</option>
          <option>Box braids</option>
        </select>
      </div>
    </hp-example>

    <hp-example
      heading="Invalid"
      description="The field’s error sets aria-invalid and leads the description."
    >
      <div
        class="select-examples__field"
        hp-form-field
        label="New preferred time"
        error="Choose one of the times Nia has offered."
      >
        <select hp-select required>
          <option value="" disabled selected>Choose a time</option>
          <option value="sat-24-1000">Sat 24 Oct · 10:00 am</option>
        </select>
      </div>
    </hp-example>

    <hp-example heading="Disabled" description="Skipped by Tab.">
      <div class="select-examples__field" hp-form-field label="Service">
        <select hp-select disabled>
          <option>Knotless braids</option>
        </select>
      </div>
    </hp-example>

    <hp-example heading="With a hint" description="The hint stays below the control.">
      <div
        class="select-examples__field"
        hp-form-field
        label="Braider"
        hint="Only braiders who offer knotless braids are listed."
      >
        <select hp-select>
          <option>Nia Okafor</option>
          <option>Aisha Mensah</option>
          <option>Jules Baptiste</option>
        </select>
      </div>
    </hp-example>

    <hp-example
      heading="Long value"
      description="The closed value is cut at the chevron; the opened list shows it whole."
    >
      <div class="select-examples__narrow" hp-form-field label="Appointment">
        <select hp-select>
          <option>
            Knotless braids with Nia Okafor · Sat 24 Oct · 10:00 am · about five hours
          </option>
          <option>Previous appointment HP-0992 · Sat 3 Oct</option>
        </select>
      </div>
    </hp-example>

    <hp-example
      heading="Outside a form field"
      description="A standalone select labelled by its own label, marked invalid with aria-invalid."
    >
      <div class="select-examples__field">
        <label for="select-examples-sort">Sort braiders</label>
        <select hp-select id="select-examples-sort" aria-invalid="true">
          <option>Best match</option>
          <option>Lowest price</option>
        </select>
      </div>
    </hp-example>
  `,
  styles: `
    .select-examples__field {
      flex: 1 1 var(--layout-card-min);
    }

    .select-examples__narrow {
      flex: 0 1 var(--layout-sidebar-width);
    }
  `,
})
export class SelectExamples {
  protected readonly distance = signal('10');
}
