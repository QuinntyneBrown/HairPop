import { ChangeDetectionStrategy, Component, afterNextRender, inject, signal } from '@angular/core';
import { ApiError, BRAIDER_SERVICES_API, ManagedService, money } from '@hairpop/api';
import { Alert, Button, DialogService, EmptyState, PageHeader, Spinner } from '@hairpop/components';
import { firstValueFrom } from 'rxjs';
import { EditServiceData, EditServiceDialog } from './edit-service.dialog';
import { RemoveServiceDialog } from './remove-service.dialog';

@Component({
  selector: 'hp-braider-services-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Alert, Button, EmptyState, PageHeader, Spinner],
  template: `
    <hp-page-header
      eyebrow="HairPop for braiders"
      heading="Services"
      subtitle="What customers can request from you, with starting prices and typical time."
    >
      <button hp-button slot="actions" variant="primary" type="button" (click)="openEditor(null)">
        Add service
      </button>
    </hp-page-header>
    @if (actionError()) {
      <hp-alert tone="danger" announce heading="We couldn’t update this service"
        ><p>{{ actionError() }}</p></hp-alert
      >
    }
    @if (loading()) {
      <hp-spinner label="Loading services" />
    } @else if (failed()) {
      <hp-alert tone="danger" announce heading="We couldn’t load services">
        <p>Check your connection and try again.</p>
        <button hp-button slot="actions" type="button" (click)="load()">Try again</button>
      </hp-alert>
    } @else if (!services().length) {
      <hp-empty-state
        heading="No services yet"
        text="Add a service to start offering appointments."
      />
    } @else {
      <section class="card card--flush" aria-label="Services">
        <ul class="list">
          @for (service of services(); track service.id) {
            <li>
              <div class="list__item">
                <div class="list__body">
                  <span class="list__title">{{ service.name }}</span>
                  <span class="list__meta"
                    >{{ service.styleName }} · from {{ money(service.startingPrice) }} · about
                    {{ service.typicalHours }} hours</span
                  >
                </div>
                <span class="badge" [class.badge--success]="service.published">{{
                  service.published ? 'Published' : 'Unpublished'
                }}</span>
                <div class="cluster">
                  <button hp-button type="button" (click)="openEditor(service)">
                    Edit<span class="visually-hidden"> {{ service.name }}</span>
                  </button>
                  <button hp-button variant="ghost" type="button" (click)="toggle(service)">
                    {{ service.published ? 'Unpublish' : 'Publish'
                    }}<span class="visually-hidden"> {{ service.name }}</span>
                  </button>
                  <button hp-button variant="ghost" type="button" (click)="openRemove(service)">
                    Remove<span class="visually-hidden"> {{ service.name }}</span>
                  </button>
                </div>
              </div>
            </li>
          }
        </ul>
      </section>
    }
  `,
})
export class BraiderServicesPage {
  private readonly api = inject(BRAIDER_SERVICES_API);
  private readonly dialogs = inject(DialogService);
  protected readonly services = signal<readonly ManagedService[]>([]);
  protected readonly styles = signal<readonly { slug: string; name: string }[]>([]);
  protected readonly loading = signal(true);
  protected readonly failed = signal(false);
  protected readonly actionError = signal<string | null>(null);
  protected readonly money = money;

  constructor() {
    afterNextRender(() => void this.load());
  }

  protected openEditor(service: ManagedService | null): void {
    const data: EditServiceData = { service, styles: this.styles() };
    this.dialogs
      .open<EditServiceDialog, EditServiceData, boolean>(EditServiceDialog, { data })
      .closed.subscribe((changed) => {
        if (changed) void this.load();
      });
  }

  protected openRemove(service: ManagedService): void {
    this.dialogs
      .open<RemoveServiceDialog, ManagedService, boolean>(RemoveServiceDialog, {
        variant: 'destructive',
        data: service,
      })
      .closed.subscribe((removed) => {
        if (removed) void this.load();
      });
  }

  protected async toggle(service: ManagedService): Promise<void> {
    this.actionError.set(null);
    try {
      const updated = await firstValueFrom(
        this.api.edit(service.id, {
          published: !service.published,
          version: service.version,
        }),
      );
      this.services.update((items) =>
        items.map((item) => (item.id === service.id ? updated : item)),
      );
    } catch (error) {
      this.actionError.set(
        ApiError.from(error).status === 409
          ? 'This service has changed. Refresh the list before trying again.'
          : 'Check your connection and try again.',
      );
    }
  }

  protected async load(): Promise<void> {
    this.loading.set(true);
    this.failed.set(false);
    try {
      const result = await firstValueFrom(this.api.list());
      this.services.set(result.data);
      this.styles.set(result.styles);
    } catch {
      this.failed.set(true);
    } finally {
      this.loading.set(false);
    }
  }
}
