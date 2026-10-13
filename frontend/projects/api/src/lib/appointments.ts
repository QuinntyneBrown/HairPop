import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, InjectionToken, inject } from '@angular/core';
import { Observable, switchMap } from 'rxjs';

import { IsoDateTime, Page } from './common';
import { Csrf } from './csrf';

export type AppointmentStatus =
  'awaiting_reply' | 'confirmed' | 'declined' | 'cancelled' | 'completed';

export interface AppointmentSummary {
  readonly reference: string;
  readonly status: AppointmentStatus;
  readonly service: string;
  readonly braider: { readonly slug: string; readonly name: string };
  readonly start: IsoDateTime;
  readonly timeZone: string;
  readonly price: {
    readonly kind: 'estimate' | 'agreed';
    readonly min: number;
    readonly max: number | null;
  };
}

export interface AppointmentDetail extends AppointmentSummary {
  readonly durationHours: number;
  readonly location: { readonly area: string; readonly address: string | null };
  readonly contact: { readonly email: string; readonly phone: string | null };
  readonly policy: { readonly changes: string; readonly cancellation: string };
  readonly preparation: readonly string[] | null;
  readonly pendingChange: { readonly start: IsoDateTime } | null;
  readonly allowed: {
    readonly change: boolean;
    readonly cancel: boolean;
    readonly rebook: boolean;
    readonly review: boolean;
  };
  readonly unavailable: readonly 'preparation'[];
  readonly updatedAt: IsoDateTime;
}

export interface CareDetail {
  readonly reference: string;
  readonly service: string;
  readonly braider: { readonly slug: string; readonly name: string };
  readonly date: string;
  readonly guidance: { readonly items: readonly string[]; readonly source: string } | null;
  readonly review: 'open' | 'submitted' | 'not_allowed';
}

export interface AppointmentsApi {
  list(
    filter: 'all' | 'upcoming' | 'past',
    search: string,
    page: number,
  ): Observable<Page<AppointmentSummary>>;
  detail(reference: string): Observable<AppointmentDetail>;
  cancel(reference: string): Observable<{ status: 'cancelled' }>;
  changeOptions(
    reference: string,
  ): Observable<{ slots: readonly { id: string; start: IsoDateTime }[] }>;
  requestChange(
    reference: string,
    details: { slotId: string; note: string | null },
  ): Observable<{ pendingChange: { start: IsoDateTime } }>;
  repeatBooking(reference: string): Observable<{ braiderSlug: string; serviceId: string }>;
  care(reference: string): Observable<CareDetail>;
  submitReview(
    reference: string,
    details: { rating: number; text: string },
    idempotencyKey: string,
  ): Observable<{ reviewId: string; status: 'published' | 'pending' }>;
}

export const APPOINTMENTS_API = new InjectionToken<AppointmentsApi>('APPOINTMENTS_API');

@Injectable()
export class HttpAppointmentsApi implements AppointmentsApi {
  private readonly http = inject(HttpClient);
  private readonly csrf = inject(Csrf);

  list(
    filter: 'all' | 'upcoming' | 'past',
    search: string,
    page: number,
  ): Observable<Page<AppointmentSummary>> {
    let params = new HttpParams().set('filter', filter).set('page', page);
    if (search.trim()) params = params.set('search', search.trim());
    return this.http.get<Page<AppointmentSummary>>('/api/appointments', { params });
  }

  detail(reference: string): Observable<AppointmentDetail> {
    return this.http.get<AppointmentDetail>(`/api/appointments/${encodeURIComponent(reference)}`);
  }

  cancel(reference: string): Observable<{ status: 'cancelled' }> {
    return this.csrf
      .ensure()
      .pipe(
        switchMap(() =>
          this.http.post<{ status: 'cancelled' }>(
            `/api/appointments/${encodeURIComponent(reference)}/cancellation`,
            {},
          ),
        ),
      );
  }

  changeOptions(
    reference: string,
  ): Observable<{ slots: readonly { id: string; start: IsoDateTime }[] }> {
    return this.http.get<{ slots: readonly { id: string; start: IsoDateTime }[] }>(
      `/api/appointments/${encodeURIComponent(reference)}/change-options`,
    );
  }

  requestChange(
    reference: string,
    details: { slotId: string; note: string | null },
  ): Observable<{ pendingChange: { start: IsoDateTime } }> {
    return this.csrf
      .ensure()
      .pipe(
        switchMap(() =>
          this.http.post<{ pendingChange: { start: IsoDateTime } }>(
            `/api/appointments/${encodeURIComponent(reference)}/change-requests`,
            details,
          ),
        ),
      );
  }

  repeatBooking(reference: string): Observable<{ braiderSlug: string; serviceId: string }> {
    return this.http.get<{ braiderSlug: string; serviceId: string }>(
      `/api/appointments/${encodeURIComponent(reference)}/repeat-booking`,
    );
  }

  care(reference: string): Observable<CareDetail> {
    return this.http.get<CareDetail>(`/api/appointments/${encodeURIComponent(reference)}/care`);
  }

  submitReview(
    reference: string,
    details: { rating: number; text: string },
    idempotencyKey: string,
  ): Observable<{ reviewId: string; status: 'published' | 'pending' }> {
    return this.csrf
      .ensure()
      .pipe(
        switchMap(() =>
          this.http.post<{ reviewId: string; status: 'published' | 'pending' }>(
            `/api/appointments/${encodeURIComponent(reference)}/review`,
            details,
            { headers: { 'Idempotency-Key': idempotencyKey } },
          ),
        ),
      );
  }
}
