import { ChangeDetectionStrategy, Component, afterNextRender, inject, signal } from '@angular/core';
import { BRAIDER_SLOTS_API, OfferedSlot, dateTime } from '@hairpop/api';
import { Alert, Button, DialogService, EmptyState, PageHeader, Spinner } from '@hairpop/components';
import { firstValueFrom } from 'rxjs';
import { AddSlotDialog } from './add-slot.dialog';
import { WithdrawSlotDialog } from './withdraw-slot.dialog';

@Component({
  selector: 'hp-braider-availability-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Alert, Button, EmptyState, PageHeader, Spinner],
  template: `
    <hp-page-header
      eyebrow="HairPop for braiders"
      heading="Availability"
      subtitle="Offered times customers can request. Times are in Toronto time."
    >
      <button hp-button slot="actions" variant="primary" type="button" (click)="openAdd()">
        Add offered time
      </button>
    </hp-page-header>
    @if (loading()) {
      <hp-spinner label="Loading offered times" />
    } @else if (failed()) {
      <hp-alert tone="danger" announce heading="We couldn’t load offered times">
        <p>Check your connection and try again.</p>
        <button hp-button slot="actions" type="button" (click)="load()">Try again</button>
      </hp-alert>
    } @else if (!slots().length) {
      <hp-empty-state
        heading="No offered times yet"
        text="Add a future time customers can request."
      />
    } @else {
      <section class="card card--flush" aria-label="Offered times">
        <ul class="list">
          @for (slot of slots(); track slot.id) {
            <li>
              <div class="list__item">
                <div class="list__body">
                  <span class="list__title">{{ date(slot.start) }}</span>
                  <span class="list__meta">Up to {{ slot.maxHours }} hours</span>
                </div>
                @if (slot.requestReference) {
                  <span class="badge badge--warning">Requested · {{ slot.requestReference }}</span>
                } @else {
                  <span class="badge">Open</span>
                  <button hp-button variant="ghost" type="button" (click)="openWithdraw(slot)">
                    Withdraw<span class="visually-hidden"> {{ date(slot.start) }}</span>
                  </button>
                }
              </div>
            </li>
          }
        </ul>
      </section>
    }
  `,
})
export class BraiderAvailabilityPage {
  private readonly api = inject(BRAIDER_SLOTS_API);
  private readonly dialogs = inject(DialogService);
  protected readonly slots = signal<readonly OfferedSlot[]>([]);
  protected readonly loading = signal(true);
  protected readonly failed = signal(false);
  protected readonly date = dateTime;

  constructor() {
    afterNextRender(() => void this.load());
  }

  protected openAdd(): void {
    this.dialogs.open<AddSlotDialog, void, boolean>(AddSlotDialog).closed.subscribe((added) => {
      if (added) void this.load();
    });
  }

  protected openWithdraw(slot: OfferedSlot): void {
    this.dialogs
      .open<WithdrawSlotDialog, OfferedSlot, boolean>(WithdrawSlotDialog, {
        variant: 'destructive',
        data: slot,
      })
      .closed.subscribe((withdrawn) => {
        if (withdrawn) void this.load();
      });
  }

  protected async load(): Promise<void> {
    this.loading.set(true);
    this.failed.set(false);
    try {
      this.slots.set((await firstValueFrom(this.api.list())).data);
    } catch {
      this.failed.set(true);
    } finally {
      this.loading.set(false);
    }
  }
}
