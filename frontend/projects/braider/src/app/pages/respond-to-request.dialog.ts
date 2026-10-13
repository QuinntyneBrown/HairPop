import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ApiError, BRAIDER_REQUESTS_API, BraiderRequest } from '@hairpop/api';
import { Alert, Button, Dialog, DialogClose } from '@hairpop/components';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'hp-respond-to-request-dialog',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Alert, Button, Dialog, DialogClose],
  template: `
    <hp-dialog
      [heading]="'Respond to request ' + request.reference"
      [description]="request.customer.name + ' asked for ' + request.service + '.'"
      [busy]="saving()"
      busyLabel="Sending your reply…"
    >
      @if (failure() === 'stale') {
        <hp-alert tone="warning" announce heading="This request has changed">
          <p>Refresh requests to see the current details before replying again.</p>
          <button hp-button slot="actions" type="button" (click)="refresh()">
            Refresh requests
          </button>
        </hp-alert>
      } @else if (failure()) {
        <hp-alert tone="danger" announce heading="We couldn’t send your reply">
          <p>
            {{
              failure() === 'invalid'
                ? 'Enter a valid agreed amount.'
                : 'Check your connection and try again.'
            }}
          </p>
        </hp-alert>
      }
      <dl class="dl">
        <dt>Customer</dt>
        <dd>{{ request.customer.name }}</dd>
        <dt>Service</dt>
        <dd>{{ request.service }}</dd>
        <dt>Hair details</dt>
        <dd>{{ request.hairDetails }}</dd>
      </dl>
      <fieldset class="field">
        <legend class="field__label">Your reply</legend>
        <div class="choice-group">
          <label class="choice choice--card">
            <input
              type="radio"
              name="reply"
              value="accept"
              [checked]="decision() === 'accept'"
              (change)="decision.set('accept')"
            />
            <span class="choice__text">Accept</span>
          </label>
          <label class="choice choice--card">
            <input
              type="radio"
              name="reply"
              value="decline"
              [checked]="decision() === 'decline'"
              (change)="decision.set('decline')"
            />
            <span class="choice__text">Decline</span>
          </label>
        </div>
      </fieldset>
      @if (decision() === 'accept' && request.kind === 'booking') {
        <div class="field">
          <label class="field__label" for="agreed-amount">Agreed amount</label>
          <input
            class="input"
            id="agreed-amount"
            type="number"
            min="0"
            step="1"
            [value]="amount()"
            (input)="amount.set($any($event.target).value)"
          />
          <span class="field__help">Leave blank to confirm the estimate.</span>
        </div>
      }
      <button hp-button slot="footer" type="button" hpDialogClose>Cancel</button>
      <button
        hp-button
        slot="footer"
        variant="primary"
        type="button"
        [busy]="saving()"
        (click)="send()"
      >
        Send reply
      </button>
    </hp-dialog>
  `,
})
export class RespondToRequestDialog {
  protected readonly request = inject<BraiderRequest>(DIALOG_DATA);
  private readonly ref = inject<DialogRef<boolean>>(DialogRef);
  private readonly api = inject(BRAIDER_REQUESTS_API);
  protected readonly decision = signal<'accept' | 'decline'>('accept');
  protected readonly amount = signal('');
  protected readonly saving = signal(false);
  protected readonly failure = signal<'stale' | 'invalid' | 'failed' | null>(null);

  protected async send(): Promise<void> {
    if (this.saving()) return;
    const raw = this.amount().trim();
    const agreedAmount = this.decision() === 'decline' || !raw ? null : Number(raw);
    if (agreedAmount !== null && (!Number.isInteger(agreedAmount) || agreedAmount < 0)) {
      this.failure.set('invalid');
      return;
    }
    this.saving.set(true);
    this.failure.set(null);
    try {
      await firstValueFrom(
        this.api.respond(this.request.reference, {
          decision: this.decision(),
          agreedAmount,
          version: this.request.version,
        }),
      );
      this.ref.close(true);
    } catch (error) {
      const api = ApiError.from(error);
      this.failure.set(api.status === 409 ? 'stale' : api.status === 422 ? 'invalid' : 'failed');
    } finally {
      this.saving.set(false);
    }
  }

  protected refresh(): void {
    this.ref.close(true);
  }
}
