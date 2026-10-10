import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Button, FormField, Radio, RadioGroup } from '@hairpop/components';

import { Example } from '../shared';

/** One time Nia offers for request HP-1048. */
/** Stories for the radio group and its radio options (radio-group.md): every variant and state. */
@Component({
  selector: 'hp-radio-group-examples',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Button, Example, FormField, Radio, RadioGroup, ReactiveFormsModule],
  template: `
    <hp-example
      heading="Vertical"
      description="The default layout, two-way bound to a signal. The fieldset’s legend names the group."
    >
      <fieldset hp-form-field label="Braid size">
        <hp-radio-group [(value)]="size">
          <label hp-radio value="small">Small</label>
          <label hp-radio value="medium">Medium</label>
          <label hp-radio value="large">Large</label>
        </hp-radio-group>
      </fieldset>
      <span>Value: {{ size() ?? 'none' }}</span>
    </hp-example>

    <hp-example
      heading="Horizontal rating"
      description="Short ordered labels side by side; they wrap at every width. Post with no rating to see the error."
    >
      <fieldset hp-form-field label="Rating, 1 to 5" [error]="ratingError()">
        <hp-radio-group orientation="horizontal" required [(value)]="rating">
          <label hp-radio value="1">1</label>
          <label hp-radio value="2">2</label>
          <label hp-radio value="3">3</label>
          <label hp-radio value="4">4</label>
          <label hp-radio value="5">5 (excellent)</label>
        </hp-radio-group>
      </fieldset>
      <button hp-button variant="primary" (click)="postReview()">Post review</button>
    </hp-example>

    <hp-example
      heading="Cards"
      description="Each option framed with a title and a description. Sun 25 Oct is withdrawn, so it is disabled."
    >
      <fieldset hp-form-field label="Preferred time">
        <hp-radio-group cards required [(value)]="slot">
          <label hp-radio value="sat-24-1000" description="About five hours · estimate $180–$240"
            >Sat 24 Oct · 10:00 am</label
          >
          <label hp-radio value="sat-24-1300" description="About five hours · estimate $180–$240"
            >Sat 24 Oct · 1:00 pm</label
          >
          <label
            hp-radio
            value="sun-25-1100"
            description="About five hours · estimate $180–$240"
            disabled
            >Sun 25 Oct · 11:00 am</label
          >
        </hp-radio-group>
      </fieldset>
    </hp-example>

    <hp-example
      heading="Invalid"
      description="Every option shows the danger ring; cards keep their own edge."
    >
      <fieldset hp-form-field label="Rating, 1 to 5" error="Choose a rating from 1 to 5.">
        <hp-radio-group orientation="horizontal" required>
          <label hp-radio value="1">1</label>
          <label hp-radio value="2">2</label>
          <label hp-radio value="3">3</label>
          <label hp-radio value="4">4</label>
          <label hp-radio value="5">5 (excellent)</label>
        </hp-radio-group>
      </fieldset>
      <fieldset
        hp-form-field
        label="Preferred time"
        error="Choose a time Nia offers. Her first slot on Sat 24 Oct is 10:00 am."
      >
        <hp-radio-group cards required>
          <label hp-radio value="sat" description="About five hours · estimate $180–$240"
            >Sat 24 Oct · 10:00 am</label
          >
          <label hp-radio value="sun" description="About five hours · estimate $180–$240"
            >Sun 25 Oct · 11:00 am</label
          >
        </hp-radio-group>
      </fieldset>
    </hp-example>

    <hp-example heading="Disabled" description="A disabled group, including its checked option.">
      <fieldset hp-form-field label="Braid size">
        <hp-radio-group disabled value="medium">
          <label hp-radio value="small">Small</label>
          <label hp-radio value="medium">Medium</label>
          <label hp-radio value="large">Large</label>
        </hp-radio-group>
      </fieldset>
    </hp-example>

    <hp-example
      heading="Named by aria-labelledby"
      description="Outside a fieldset the host takes role radiogroup, named by a visible heading."
    >
      <div>
        <p id="radio-group-examples-length">Braid length</p>
        <hp-radio-group aria-labelledby="radio-group-examples-length" value="mid-back">
          <label hp-radio value="shoulder">Shoulder</label>
          <label hp-radio value="mid-back">Mid-back</label>
          <label hp-radio value="waist">Waist</label>
        </hp-radio-group>
      </div>
    </hp-example>

    <hp-example
      heading="Angular forms"
      description="A FormControl restores the value without emitting, resets it and disables every option."
    >
      <fieldset hp-form-field label="Rating, 1 to 5">
        <hp-radio-group orientation="horizontal" [formControl]="ratingControl">
          <label hp-radio value="1">1</label>
          <label hp-radio value="2">2</label>
          <label hp-radio value="3">3</label>
          <label hp-radio value="4">4</label>
          <label hp-radio value="5">5 (excellent)</label>
        </hp-radio-group>
      </fieldset>
      <span>Value: {{ ratingValue() ?? 'none' }}</span>
      <button hp-button (click)="ratingControl.reset()">Reset</button>
      <button hp-button (click)="toggleDisabled()">
        {{ formDisabled() ? 'Enable' : 'Disable' }}
      </button>
    </hp-example>

    <hp-example
      heading="Long labels"
      description="Labels and descriptions wrap under themselves; a card’s text moves under the radio when narrow."
    >
      <fieldset hp-form-field label="Preferred braider">
        <hp-radio-group cards value="nia">
          <label
            hp-radio
            value="nia"
            description="Knotless braids · Sat 24 Oct · 10:00 am · about five hours · estimate $180–$240 · 4.9 from 212 reviews"
            >Nia Okafor, knotless and box braids specialist in Toronto</label
          >
          <label
            hp-radio
            value="aisha"
            description="Knotless braids · Sun 25 Oct · 11:00 am · about five hours · estimate $190–$250"
            >Aisha Mensah, braider and loc stylist in Toronto</label
          >
        </hp-radio-group>
      </fieldset>
    </hp-example>
  `,
})
export class RadioGroupExamples {
  protected readonly size = signal<string | null>('medium');
  protected readonly rating = signal<string | null>(null);
  private readonly posted = signal(false);
  protected readonly ratingError = computed(() =>
    this.posted() && this.rating() === null ? 'Choose a rating from 1 to 5.' : undefined,
  );
  protected readonly slot = signal<string | null>('sat-24-1000');

  protected readonly ratingControl = new FormControl<string | null>('5');
  protected readonly ratingValue = toSignal(this.ratingControl.valueChanges, {
    initialValue: this.ratingControl.value,
  });
  protected readonly formDisabled = signal(false);

  protected postReview(): void {
    this.posted.set(true);
  }

  protected toggleDisabled(): void {
    const disabled = !this.formDisabled();
    this.formDisabled.set(disabled);
    if (disabled) {
      this.ratingControl.disable();
    } else {
      this.ratingControl.enable();
    }
  }
}
