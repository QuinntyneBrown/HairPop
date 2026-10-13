import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import {
  ApiError,
  BOOKING_API,
  BookingOptions,
  BookingRequest,
  dateTime,
  money,
} from '@hairpop/api';
import { Alert, Button, DescriptionList, Dialog, DialogClose } from '@hairpop/components';
import { firstValueFrom } from 'rxjs';

export interface ReviewData {
  readonly options: BookingOptions;
  readonly request: BookingRequest;
  readonly idempotencyKey: string;
}

export type ReviewResult =
  | { reference: string }
  | { conflict: 'terms_changed' | 'slot_unavailable' | 'service_unavailable' }
  | { validation: Readonly<Record<string, readonly string[]>> };

/** Reviews current terms before the single retry-safe request is sent (L2-016, L2-017). */
@Component({
  selector: 'hp-request-review-dialog',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Alert, Button, DescriptionList, Dialog, DialogClose],
  template: `
    <hp-dialog
      heading="Review request"
      description="Check your details and the current terms before sending."
      closeLabel="Close dialog"
      [busy]="sending()"
      busyLabel="Sending your request…"
    >
      @if (failure()) {
        <hp-alert tone="danger" announce heading="We couldn’t send your request"
          ><p>{{ failure() }}</p></hp-alert
        >
      }
      <dl hp-description-list>
        <dt>Braider</dt>
        <dd>{{ data.options.braider.name }}</dd>
        <dt>Service</dt>
        <dd>{{ service()?.name }}</dd>
        <dt>Time</dt>
        <dd>{{ selectedTime() }}</dd>
        <dt>Estimated price</dt>
        <dd>From {{ estimate() }} · not confirmed until the braider accepts</dd>
        <dt>Estimated duration</dt>
        <dd>About {{ service()?.typicalHours }} hours</dd>
        <dt>Area</dt>
        <dd>{{ data.options.braider.area }} · studio address shared after acceptance</dd>
        <dt>Contact</dt>
        <dd>{{ data.request.email }}{{ data.request.phone ? ' · ' + data.request.phone : '' }}</dd>
        <dt>Hair details</dt>
        <dd>{{ data.request.hairDetails }}</dd>
        <dt>Changes</dt>
        <dd>{{ data.options.policy.changes || 'Ask the braider about changes.' }}</dd>
        <dt>Cancellation</dt>
        <dd>{{ data.options.policy.cancellation || 'Ask the braider about cancellation.' }}</dd>
      </dl>
      <button hp-button slot="footer" hpDialogClose>Edit details</button>
      <button
        hp-button
        slot="footer"
        variant="primary"
        type="button"
        [busy]="sending()"
        (click)="send()"
      >
        Send request
      </button>
    </hp-dialog>
  `,
})
export class RequestReviewDialog {
  protected readonly data = inject<ReviewData>(DIALOG_DATA);
  private readonly ref = inject<DialogRef<ReviewResult>>(DialogRef);
  private readonly api = inject(BOOKING_API);
  protected readonly sending = signal(false);
  protected readonly failure = signal<string | null>(null);

  protected service() {
    return this.data.options.services.find((service) => service.id === this.data.request.serviceId);
  }

  protected selectedTime(): string {
    const slot = this.data.options.slots.find((item) => item.id === this.data.request.slotId);
    return slot ? dateTime(slot.start, this.data.options.timeZone) : 'Choose another time';
  }

  protected estimate(): string {
    return money(this.service()?.startingPrice ?? 0);
  }

  protected async send(): Promise<void> {
    if (this.sending()) return;
    this.sending.set(true);
    this.failure.set(null);
    try {
      const result = await firstValueFrom(
        this.api.submit(this.data.request, this.data.idempotencyKey),
      );
      this.ref.close({ reference: result.reference });
    } catch (error) {
      const api = ApiError.from(error);
      if (
        api.code === 'terms_changed' ||
        api.code === 'slot_unavailable' ||
        api.code === 'service_unavailable'
      ) {
        this.ref.close({ conflict: api.code });
      } else if (api.status === 422) {
        this.ref.close({ validation: api.fieldErrors });
      } else if (api.status === 429) {
        this.failure.set('Too many requests. Try again later.');
      } else {
        this.failure.set(
          'Check your connection and try again. If a request was received, this retry will return the same reference.',
        );
      }
    } finally {
      this.sending.set(false);
    }
  }
}
