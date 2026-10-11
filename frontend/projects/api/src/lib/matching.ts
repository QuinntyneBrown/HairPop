import { HttpClient } from '@angular/common/http';
import { Injectable, InjectionToken, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { Image, IsoDateTime, Page } from './common';
import { queryParams } from './styles';

/** docs/detailed-designs/matching/find-braiders-for-style. */
export interface Rating {
  readonly average: number;
  readonly count: number;
}

export interface BraiderMatch {
  readonly braider: {
    readonly slug: string;
    readonly name: string;
    readonly area: string;
    readonly photo: Image | null;
  };
  /** Published reviews only (L2-008); null when there are none. */
  readonly rating: Rating | null;
  readonly service: {
    readonly id: string;
    readonly name: string;
    readonly startingPrice: number;
    readonly typicalHours: number;
  };
  /** The next offered slot, or null when none is offered (L2-004 AC2). */
  readonly nextAvailable: IsoDateTime | null;
}

export interface MatchingStyle {
  readonly slug: string;
  readonly name: string;
  readonly minPrice: number;
}

export type BraiderMatchPage = Page<BraiderMatch, { readonly style?: MatchingStyle }>;

export interface MatchQuery {
  readonly style: string | null;
  readonly search?: string | null;
  readonly maxPrice?: number | null;
  readonly distanceKm?: number | null;
  readonly page?: number | null;
}

export interface MatchingApi {
  find(query: MatchQuery): Observable<BraiderMatchPage>;
}

export const MATCHING_API = new InjectionToken<MatchingApi>('MATCHING_API');

@Injectable()
export class HttpMatchingApi implements MatchingApi {
  private readonly http = inject(HttpClient);

  find(query: MatchQuery): Observable<BraiderMatchPage> {
    const path = query.style
      ? `/api/styles/${encodeURIComponent(query.style)}/braiders`
      : '/api/braiders';
    return this.http.get<BraiderMatchPage>(path, {
      params: queryParams({
        search: query.search,
        maxPrice: query.maxPrice,
        distanceKm: query.distanceKm,
        page: query.page,
      }),
    });
  }
}
