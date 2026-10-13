import { HttpClient } from '@angular/common/http';
import { Injectable, InjectionToken, inject } from '@angular/core';
import { Observable, switchMap } from 'rxjs';
import { IsoDateTime, Range } from './common';
import { Csrf } from './csrf';

export interface BraiderRequest {
  readonly reference: string;
  readonly kind: 'booking' | 'change';
  readonly customer: { readonly name: string };
  readonly service: string;
  readonly start: IsoDateTime;
  readonly previousStart: IsoDateTime | null;
  readonly durationHours: number;
  readonly estimate: Range | null;
  readonly agreedAmount: number | null;
  readonly hairDetails: string;
  readonly version: number;
}

export interface BraiderRequestsApi {
  list(): Observable<{ data: readonly BraiderRequest[] }>;
  respond(
    reference: string,
    details: {
      decision: 'accept' | 'decline';
      agreedAmount: number | null;
      version: number;
    },
  ): Observable<{ status: 'confirmed' | 'declined' }>;
}

export const BRAIDER_REQUESTS_API = new InjectionToken<BraiderRequestsApi>('BRAIDER_REQUESTS_API');

@Injectable()
export class HttpBraiderRequestsApi implements BraiderRequestsApi {
  private readonly http = inject(HttpClient);
  private readonly csrf = inject(Csrf);

  list(): Observable<{ data: readonly BraiderRequest[] }> {
    return this.http.get<{ data: readonly BraiderRequest[] }>('/api/braider/requests');
  }

  respond(
    reference: string,
    details: {
      decision: 'accept' | 'decline';
      agreedAmount: number | null;
      version: number;
    },
  ): Observable<{ status: 'confirmed' | 'declined' }> {
    return this.csrf
      .ensure()
      .pipe(
        switchMap(() =>
          this.http.post<{ status: 'confirmed' | 'declined' }>(
            `/api/braider/requests/${encodeURIComponent(reference)}/responses`,
            details,
          ),
        ),
      );
  }
}
