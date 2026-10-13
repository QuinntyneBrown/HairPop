import { HttpClient } from '@angular/common/http';
import { Injectable, InjectionToken, inject } from '@angular/core';
import { Observable, switchMap } from 'rxjs';
import { IsoDateTime } from './common';
import { Csrf } from './csrf';

export interface OfferedSlot {
  readonly id: string;
  readonly start: IsoDateTime;
  readonly maxHours: number;
  readonly requestReference: string | null;
}

export interface BraiderSlotsApi {
  list(): Observable<{ data: readonly OfferedSlot[] }>;
  add(input: { date: string; time: string; maxHours: number }): Observable<OfferedSlot>;
  withdraw(id: string): Observable<void>;
}

export const BRAIDER_SLOTS_API = new InjectionToken<BraiderSlotsApi>('BRAIDER_SLOTS_API');

@Injectable()
export class HttpBraiderSlotsApi implements BraiderSlotsApi {
  private readonly http = inject(HttpClient);
  private readonly csrf = inject(Csrf);

  list(): Observable<{ data: readonly OfferedSlot[] }> {
    return this.http.get<{ data: readonly OfferedSlot[] }>('/api/braider/slots');
  }

  add(input: { date: string; time: string; maxHours: number }): Observable<OfferedSlot> {
    return this.csrf
      .ensure()
      .pipe(switchMap(() => this.http.post<OfferedSlot>('/api/braider/slots', input)));
  }

  withdraw(id: string): Observable<void> {
    return this.csrf
      .ensure()
      .pipe(
        switchMap(() => this.http.delete<void>(`/api/braider/slots/${encodeURIComponent(id)}`)),
      );
  }
}
