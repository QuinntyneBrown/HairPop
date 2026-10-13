import { ChangeDetectionStrategy, Component, afterNextRender, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CustomerNotification, NOTIFICATIONS_API, Page } from '@hairpop/api';
import { Alert, Button, EmptyState, PageHeader, Spinner } from '@hairpop/components';
import { firstValueFrom } from 'rxjs';
import { UnreadCountStore } from '../../shared/unread-count.store';

@Component({
  selector: 'hp-notifications-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Alert, Button, EmptyState, PageHeader, RouterLink, Spinner],
  template: `
    <hp-page-header eyebrow="Your HairPop" heading="Notifications" [subtitle]="subtitle()">
      @if (result()?.meta?.unreadCount) {
        <button hp-button slot="actions" type="button" [disabled]="busy()" (click)="markAll()">
          Mark all as read
        </button>
      }
    </hp-page-header>
    @if (loading()) {
      <hp-spinner label="Loading notifications" />
    } @else if (failed()) {
      <hp-alert tone="danger" announce heading="We couldn’t load notifications">
        <p>Check your connection and try again.</p>
        <button hp-button slot="actions" type="button" (click)="load()">Try again</button>
      </hp-alert>
    } @else if (result(); as page) {
      @if (page.data.length) {
        <section class="card card--flush" aria-label="Updates">
          <ul class="list">
            @for (item of page.data; track item.id) {
              <li>
                <div class="list__item" [class.list__item--unread]="!item.read">
                  <div class="list__body">
                    @if (item.link) {
                      <a class="list__title" [routerLink]="item.link">{{ item.title }}</a>
                    } @else {
                      <strong class="list__title">{{ item.title }}</strong>
                    }
                    <span class="list__meta">{{ item.body }}</span>
                  </div>
                  @if (!item.read) {
                    <button
                      hp-button
                      variant="ghost"
                      size="sm"
                      type="button"
                      [disabled]="busy()"
                      (click)="markRead(item)"
                    >
                      Mark as read<span class="visually-hidden"> {{ item.title }}</span>
                    </button>
                  }
                </div>
              </li>
            }
          </ul>
        </section>
        @if (page.meta.lastPage > 1) {
          <nav class="cluster" aria-label="Notification pages">
            <button
              hp-button
              type="button"
              [disabled]="page.meta.page <= 1 || loading()"
              (click)="load(page.meta.page - 1)"
            >
              Previous page
            </button>
            <span>Page {{ page.meta.page }} of {{ page.meta.lastPage }}</span>
            <button
              hp-button
              type="button"
              [disabled]="page.meta.page >= page.meta.lastPage || loading()"
              (click)="load(page.meta.page + 1)"
            >
              Next page
            </button>
          </nav>
        }
      } @else {
        <hp-empty-state
          heading="No notifications yet"
          text="Updates about your appointments will appear here."
        />
      }
    }
    @if (actionFailed()) {
      <hp-alert tone="danger" announce heading="Couldn’t mark this update as read">
        <p>Try again when your connection is available.</p>
      </hp-alert>
    }
  `,
})
export class NotificationsPage {
  private readonly api = inject(NOTIFICATIONS_API);
  private readonly unread = inject(UnreadCountStore);
  protected readonly result = signal<Page<CustomerNotification, { unreadCount: number }> | null>(
    null,
  );
  protected readonly loading = signal(true);
  protected readonly failed = signal(false);
  protected readonly busy = signal(false);
  protected readonly actionFailed = signal(false);

  constructor() {
    afterNextRender(() => void this.load());
  }

  protected subtitle(): string {
    const count = this.result()?.meta.unreadCount ?? 0;
    return count
      ? `${count} unread update${count === 1 ? '' : 's'} about your appointments.`
      : 'All caught up.';
  }

  protected async load(pageNumber = 1): Promise<void> {
    this.loading.set(true);
    this.failed.set(false);
    try {
      const page = await firstValueFrom(this.api.list(pageNumber));
      this.result.set(page);
      this.unread.set(page.meta.unreadCount);
    } catch {
      this.failed.set(true);
    } finally {
      this.loading.set(false);
    }
  }

  protected async markRead(item: CustomerNotification): Promise<void> {
    if (this.busy()) return;
    this.busy.set(true);
    this.actionFailed.set(false);
    try {
      const { unreadCount } = await firstValueFrom(this.api.markRead(item.id));
      const page = this.result();
      if (page)
        this.result.set({
          ...page,
          data: page.data.map((entry) => (entry.id === item.id ? { ...entry, read: true } : entry)),
          meta: { ...page.meta, unreadCount },
        });
      this.unread.set(unreadCount);
    } catch {
      this.actionFailed.set(true);
    } finally {
      this.busy.set(false);
    }
  }

  protected async markAll(): Promise<void> {
    if (this.busy()) return;
    this.busy.set(true);
    this.actionFailed.set(false);
    try {
      const { unreadCount } = await firstValueFrom(this.api.markAllRead());
      const page = this.result();
      if (page)
        this.result.set({
          ...page,
          data: page.data.map((entry) => ({ ...entry, read: true })),
          meta: { ...page.meta, unreadCount },
        });
      this.unread.set(unreadCount);
    } catch {
      this.actionFailed.set(true);
    } finally {
      this.busy.set(false);
    }
  }
}
