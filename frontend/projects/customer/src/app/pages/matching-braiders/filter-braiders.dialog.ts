import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
} from '@angular/forms';
import { ApiError, MATCHING_API, money } from '@hairpop/api';
import {
  Alert,
  Button,
  Dialog,
  DialogClose,
  FieldAddon,
  FormField,
  FormLayout,
  Select,
  TextField,
} from '@hairpop/components';
import { firstValueFrom } from 'rxjs';

/** What the dialog needs to know about the results it filters. */
export interface FilterBraidersData {
  readonly style: string | null;
  /** The style's lowest price; null when no style is selected. */
  readonly minPrice: number | null;
  readonly search: string | null;
  readonly maxPrice: number | null;
  readonly distanceKm: number | null;
}

/** The criteria the visitor applied: null leaves a filter off. */
export interface FilterBraidersResult {
  readonly maxPrice: number | null;
  readonly distanceKm: number | null;
}

const FORM_ID = 'filter-braiders-form';

/** Distances the API accepts, in km (L2-005). */
const DISTANCES = [5, 10, 25] as const;

/**
 * FilterBraidersDialog (docs/detailed-designs/matching/find-braiders-for-style). Checks the
 * criteria against the style's lowest price, asks the API for the results, and closes with the
 * criteria only when that request succeeds. A busy dialog accepts no second submit and a
 * failure keeps every entry (L2-005 AC2, AC4).
 */
@Component({
  selector: 'hp-filter-braiders-dialog',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    Alert,
    Button,
    Dialog,
    DialogClose,
    FieldAddon,
    FormField,
    FormLayout,
    ReactiveFormsModule,
    Select,
    TextField,
  ],
  template: `
    <hp-dialog
      heading="Filter braiders"
      description="Choose the price and travel distance that work for you."
      closeLabel="Close dialog"
      [busy]="applying()"
      busyLabel="Finding braiders…"
    >
      @if (failed()) {
        <hp-alert tone="danger" announce heading="We couldn’t save this">
          <p>Nothing was changed. Your entries are still here, so you can try again.</p>
        </hp-alert>
      }
      <form
        hp-form-layout
        [id]="formId"
        [formGroup]="form"
        [busy]="applying()"
        [summaryTitle]="summaryTitle"
        (submitted)="apply()"
      >
        <div
          hp-form-field
          label="Maximum price"
          [errorMessages]="priceMessages()"
          [error]="serverErrors().maxPrice"
        >
          <span hp-field-addon slot="prefix" aria-hidden="true">$</span>
          <input
            hp-text-field
            type="number"
            inputmode="numeric"
            min="0"
            step="1"
            formControlName="maxPrice"
          />
        </div>
        <div hp-form-field label="Distance from Toronto" [error]="serverErrors().distanceKm">
          <select hp-select formControlName="distanceKm">
            @for (km of distances; track km) {
              <option [value]="km">Within {{ km }} km</option>
            }
            <option value="">Any distance</option>
          </select>
        </div>
      </form>
      <button hp-button slot="footer" hpDialogClose>Cancel</button>
      <button
        hp-button
        slot="footer"
        variant="primary"
        type="submit"
        [attr.form]="formId"
        [busy]="applying()"
      >
        Show braiders
      </button>
    </hp-dialog>
  `,
})
export class FilterBraidersDialog {
  private readonly api = inject(MATCHING_API);
  private readonly ref = inject<DialogRef<FilterBraidersResult>>(DialogRef);
  private readonly data = inject<FilterBraidersData>(DIALOG_DATA);

  protected readonly formId = FORM_ID;
  protected readonly distances = DISTANCES;

  protected readonly form = new FormGroup({
    maxPrice: new FormControl<number | null>(this.data.maxPrice, {
      validators: [(control) => this.validatePrice(control)],
    }),
    distanceKm: new FormControl(this.data.distanceKm === null ? '' : String(this.data.distanceKm), {
      nonNullable: true,
    }),
  });

  protected readonly applying = signal(false);
  protected readonly failed = signal(false);
  protected readonly serverErrors = signal<{ maxPrice?: string; distanceKm?: string }>({});

  protected readonly priceMessages = computed(() => ({
    whole: 'Enter a maximum price in whole dollars.',
    min: `Enter a maximum price of at least ${money(this.data.minPrice ?? 0)}, the lowest price for this style.`,
  }));

  protected readonly summaryTitle = (count: number): string =>
    count === 1 ? 'Check 1 answer' : `Check ${count} answers`;

  constructor() {
    // An entry the visitor changes no longer carries the server's verdict on the old one.
    this.form.valueChanges.subscribe(() => this.serverErrors.set({}));
  }

  protected async apply(): Promise<void> {
    const { maxPrice, distanceKm } = this.form.getRawValue();
    const criteria: FilterBraidersResult = {
      maxPrice,
      distanceKm: distanceKm === '' ? null : Number(distanceKm),
    };
    this.applying.set(true);
    this.failed.set(false);
    try {
      await firstValueFrom(
        this.api.find({
          style: this.data.style,
          search: this.data.search,
          ...criteria,
          page: 1,
        }),
      );
      this.ref.close(criteria);
    } catch (error) {
      const api = ApiError.from(error);
      const maxPriceError = api.field('maxPrice');
      const distanceError = api.field('distanceKm');
      if (maxPriceError || distanceError) {
        this.serverErrors.set({
          maxPrice: maxPriceError ?? undefined,
          distanceKm: distanceError ?? undefined,
        });
      } else {
        this.failed.set(true);
      }
    } finally {
      this.applying.set(false);
    }
  }

  /** An empty price is no filter; otherwise whole dollars, at least the style's lowest price. */
  private validatePrice(control: AbstractControl<number | null>): ValidationErrors | null {
    const value = control.value;
    if (value === null || value === undefined) return null;
    if (!Number.isInteger(value) || value < 1) return { whole: true };
    const minPrice = this.data.minPrice;
    return minPrice !== null && value < minPrice ? { min: true } : null;
  }
}
