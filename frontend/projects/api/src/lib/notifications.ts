import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, InjectionToken, inject } from '@angular/core';
import { Observable, switchMap } from 'rxjs';

import { IsoDateTime, Page } from './common';
import { Csrf } from './csrf';

export interface CustomerNotification {
  readonly id: string;
  readonly title: string;
  readonly body: string;
  readonly createdAt: IsoDateTime;
  readonly read: boolean;
  readonly link: string | null;
}

export interface NotificationsApi {
  list(page: number): Observable<Page<CustomerNotification, { unreadCount: number }>>;
  unreadCount(): Observable<{ count: number }>;
  markRead(id: string): Observable<{ unreadCount: number }>;
  markAllRead(): Observable<{ unreadCount: number }>;
}

export const NOTIFICATIONS_API = new InjectionToken<NotificationsApi>('NOTIFICATIONS_API');

@Injectable()
export class HttpNotificationsApi implements NotificationsApi {
  private readonly http = inject(HttpClient);
  private readonly csrf = inject(Csrf);

  list(page: number): Observable<Page<CustomerNotification, { unreadCount: number }>> {
    return this.http.get<Page<CustomerNotification, { unreadCount: number }>>(
      '/api/notifications',
      {
        params: new HttpParams().set('page', page),
      },
    );
  }

  unreadCount(): Observable<{ count: number }> {
    return this.http.get<{ count: number }>('/api/notifications/unread-count');
  }

  markRead(id: string): Observable<{ unreadCount: number }> {
    return this.csrf
      .ensure()
      .pipe(
        switchMap(() =>
          this.http.post<{ unreadCount: number }>(
            `/api/notifications/${encodeURIComponent(id)}/read`,
            {},
          ),
        ),
      );
  }

  markAllRead(): Observable<{ unreadCount: number }> {
    return this.csrf
      .ensure()
      .pipe(
        switchMap(() => this.http.post<{ unreadCount: number }>('/api/notifications/read-all', {})),
      );
  }
}
