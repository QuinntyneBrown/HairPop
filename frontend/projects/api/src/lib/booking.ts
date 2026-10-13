import { HttpClient } from '@angular/common/http';
import { Injectable, InjectionToken, inject } from '@angular/core';
import { Observable, switchMap } from 'rxjs';

import { IsoDateTime, Range } from './common';
import { Csrf } from './csrf';

export interface BookingOptions {
  readonly braider: { readonly slug: string; readonly name: string; readonly area: string };
  readonly services: readonly {
    readonly id: string;
    readonly name: string;
    readonly startingPrice: number;
    readonly typicalHours: number;
    readonly estimate: Range;
  }[];
  readonly slots: readonly { readonly id: string; readonly start: IsoDateTime }[];
  readonly policy: {
    readonly version: string;
    readonly changes: string;
    readonly cancellation: string;
  };
  readonly contact: { readonly email: string; readonly phone: string | null };
  readonly timeZone: string;
}

export interface BookingRequest {
  readonly braiderSlug: string;
  readonly serviceId: string;
  readonly slotId: string;
  readonly email: string;
  readonly phone: string | null;
  readonly hairDetails: string;
  readonly policyVersion: string;
}

export interface BookingApi {
  options(braiderSlug: string): Observable<BookingOptions>;
  submit(
    request: BookingRequest,
    idempotencyKey: string,
  ): Observable<{ reference: string; status: 'awaiting_reply' }>;
}

export const BOOKING_API = new InjectionToken<BookingApi>('BOOKING_API');

@Injectable()
export class HttpBookingApi implements BookingApi {
  private readonly http = inject(HttpClient);
  private readonly csrf = inject(Csrf);

  options(braiderSlug: string): Observable<BookingOptions> {
    return this.http.get<BookingOptions>(
      `/api/braiders/${encodeURIComponent(braiderSlug)}/booking-options`,
    );
  }

  submit(
    request: BookingRequest,
    idempotencyKey: string,
  ): Observable<{ reference: string; status: 'awaiting_reply' }> {
    return this.csrf
      .ensure()
      .pipe(
        switchMap(() =>
          this.http.post<{ reference: string; status: 'awaiting_reply' }>(
            '/api/booking-requests',
            request,
            { headers: { 'Idempotency-Key': idempotencyKey } },
          ),
        ),
      );
  }
}
