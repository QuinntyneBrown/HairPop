import { HttpClient } from '@angular/common/http';
import { Injectable, InjectionToken, inject } from '@angular/core';
import { Observable, switchMap } from 'rxjs';
import { Csrf } from './csrf';

export interface ServiceInput {
  readonly styleSlug: string;
  readonly name: string;
  readonly startingPrice: number;
  readonly typicalHours: number;
  readonly preparation: string | null;
  readonly published: boolean;
}

export interface ManagedService extends ServiceInput {
  readonly id: string;
  readonly styleName: string;
  readonly version: number;
}

export interface BraiderServicesApi {
  list(): Observable<{
    data: readonly ManagedService[];
    styles: readonly { slug: string; name: string }[];
  }>;
  create(input: ServiceInput): Observable<ManagedService>;
  edit(id: string, input: Partial<ServiceInput> & { version: number }): Observable<ManagedService>;
  remove(id: string): Observable<void>;
}

export const BRAIDER_SERVICES_API = new InjectionToken<BraiderServicesApi>('BRAIDER_SERVICES_API');

@Injectable()
export class HttpBraiderServicesApi implements BraiderServicesApi {
  private readonly http = inject(HttpClient);
  private readonly csrf = inject(Csrf);

  list(): Observable<{
    data: readonly ManagedService[];
    styles: readonly { slug: string; name: string }[];
  }> {
    return this.http.get<{
      data: readonly ManagedService[];
      styles: readonly { slug: string; name: string }[];
    }>('/api/braider/services');
  }

  create(input: ServiceInput): Observable<ManagedService> {
    return this.csrf
      .ensure()
      .pipe(switchMap(() => this.http.post<ManagedService>('/api/braider/services', input)));
  }

  edit(id: string, input: Partial<ServiceInput> & { version: number }): Observable<ManagedService> {
    return this.csrf
      .ensure()
      .pipe(
        switchMap(() =>
          this.http.patch<ManagedService>(`/api/braider/services/${encodeURIComponent(id)}`, input),
        ),
      );
  }

  remove(id: string): Observable<void> {
    return this.csrf
      .ensure()
      .pipe(
        switchMap(() => this.http.delete<void>(`/api/braider/services/${encodeURIComponent(id)}`)),
      );
  }
}
