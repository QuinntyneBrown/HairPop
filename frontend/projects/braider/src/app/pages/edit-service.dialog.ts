import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ApiError, BRAIDER_SERVICES_API, ManagedService, ServiceInput } from '@hairpop/api';
import { Alert, Button, Dialog, DialogClose } from '@hairpop/components';
import { firstValueFrom } from 'rxjs';

export interface EditServiceData {
  readonly service: ManagedService | null;
  readonly styles: readonly { slug: string; name: string }[];
}

@Component({
  selector: 'hp-edit-service-dialog',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Alert, Button, Dialog, DialogClose],
  template: `
    <hp-dialog
      [heading]="data.service ? 'Edit service' : 'Add service'"
      description="Set the service customers can request."
      [busy]="saving()"
      busyLabel="Saving service…"
    >
      @if (error() === 'stale') {
        <hp-alert tone="warning" announce heading="This service has changed">
          <p>Refresh services to see the current version before editing again.</p>
          <button hp-button slot="actions" type="button" (click)="refresh()">
            Refresh services
          </button>
        </hp-alert>
      } @else if (error()) {
        <hp-alert tone="danger" announce heading="We couldn’t save this service">
          <p>
            {{
              error() === 'invalid'
                ? 'Check the service details and try again.'
                : 'Check your connection and try again.'
            }}
          </p>
        </hp-alert>
      }
      <div class="field">
        <label class="field__label" for="service-style">Style</label>
        <select
          class="select"
          id="service-style"
          [value]="styleSlug()"
          (change)="styleSlug.set($any($event.target).value)"
        >
          <option value="">Choose a style</option>
          @for (style of data.styles; track style.slug) {
            <option [value]="style.slug">{{ style.name }}</option>
          }
        </select>
      </div>
      <div class="field">
        <label class="field__label" for="service-name">Service name</label>
        <input
          class="input"
          id="service-name"
          type="text"
          [value]="name()"
          (input)="name.set($any($event.target).value)"
        />
      </div>
      <div class="field">
        <label class="field__label" for="service-price">Starting price</label>
        <input
          class="input"
          id="service-price"
          type="number"
          min="0"
          step="1"
          [value]="price()"
          (input)="price.set($any($event.target).value)"
        />
      </div>
      <div class="field">
        <label class="field__label" for="service-hours">Typical hours</label>
        <input
          class="input"
          id="service-hours"
          type="number"
          min="0.5"
          max="24"
          step="0.5"
          [value]="hours()"
          (input)="hours.set($any($event.target).value)"
        />
      </div>
      <div class="field">
        <label class="field__label" for="service-preparation">Preparation details</label>
        <textarea
          class="textarea"
          id="service-preparation"
          [value]="preparation()"
          (input)="preparation.set($any($event.target).value)"
        ></textarea>
      </div>
      <button hp-button slot="footer" type="button" hpDialogClose>Cancel</button>
      <button
        hp-button
        slot="footer"
        variant="primary"
        type="button"
        [busy]="saving()"
        (click)="save()"
      >
        Save service
      </button>
    </hp-dialog>
  `,
})
export class EditServiceDialog {
  protected readonly data = inject<EditServiceData>(DIALOG_DATA);
  private readonly ref = inject<DialogRef<boolean>>(DialogRef);
  private readonly api = inject(BRAIDER_SERVICES_API);
  protected readonly styleSlug = signal(this.data.service?.styleSlug ?? '');
  protected readonly name = signal(this.data.service?.name ?? '');
  protected readonly price = signal(
    this.data.service ? String(this.data.service.startingPrice) : '',
  );
  protected readonly hours = signal(
    this.data.service ? String(this.data.service.typicalHours) : '',
  );
  protected readonly preparation = signal(this.data.service?.preparation ?? '');
  protected readonly saving = signal(false);
  protected readonly error = signal<'stale' | 'invalid' | 'failed' | null>(null);

  protected async save(): Promise<void> {
    const startingPrice = Number(this.price());
    const typicalHours = Number(this.hours());
    if (
      !this.styleSlug() ||
      !this.name().trim() ||
      !this.price() ||
      !this.hours() ||
      !Number.isInteger(startingPrice) ||
      startingPrice < 0 ||
      typicalHours <= 0 ||
      typicalHours > 24
    ) {
      this.error.set('invalid');
      return;
    }
    const input: ServiceInput = {
      styleSlug: this.styleSlug(),
      name: this.name().trim(),
      startingPrice,
      typicalHours,
      preparation: this.preparation().trim() || null,
      published: this.data.service?.published ?? true,
    };
    this.saving.set(true);
    this.error.set(null);
    try {
      if (this.data.service) {
        await firstValueFrom(
          this.api.edit(this.data.service.id, { ...input, version: this.data.service.version }),
        );
      } else {
        await firstValueFrom(this.api.create(input));
      }
      this.ref.close(true);
    } catch (error) {
      const api = ApiError.from(error);
      this.error.set(api.status === 409 ? 'stale' : api.status === 422 ? 'invalid' : 'failed');
    } finally {
      this.saving.set(false);
    }
  }

  protected refresh(): void {
    this.ref.close(true);
  }
}
