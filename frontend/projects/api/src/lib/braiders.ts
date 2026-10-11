import { HttpClient } from '@angular/common/http';
import { Injectable, InjectionToken, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { Image, Page } from './common';
import { Rating } from './matching';
import { queryParams } from './styles';

/** docs/detailed-designs/profiles/inspect-braider. */
export interface BraiderService {
  readonly id: string;
  readonly name: string;
  readonly styleSlug: string;
  /** Whole dollars. */
  readonly startingPrice: number;
  readonly typicalHours: number;
}

export interface PortfolioItem {
  readonly id: string;
  readonly image: Image | null;
  readonly caption: string;
}

/** What the braider has written for customers; any of them can be missing. */
export interface BraiderPolicies {
  readonly preparation: string | null;
  readonly changes: string | null;
  readonly cancellation: string | null;
}

/** The public profile: never the private studio address (L2-027 AC3). */
export interface BraiderProfile {
  readonly slug: string;
  readonly name: string;
  readonly initials: string;
  readonly photo: Image | null;
  readonly area: string;
  readonly travelKm: number | null;
  readonly bio: string;
  /** Derived from published reviews only; null when there are none (L2-008). */
  readonly rating: Rating | null;
  readonly services: readonly BraiderService[];
  readonly portfolio: readonly PortfolioItem[];
  readonly policies: BraiderPolicies;
}

/** One published review; removed and pending-moderation ones are never returned (L2-008). */
export interface Review {
  readonly id: string;
  /** 1–5. */
  readonly rating: number;
  /** `YYYY-MM-DD`. */
  readonly date: string;
  readonly text: string;
  readonly author: string;
  readonly service: string;
}

export interface BraidersApi {
  /** A published braider's profile; a 404 error for an unknown or unpublished one. */
  get(slug: string): Observable<BraiderProfile>;
  /** A page of the braider's published reviews, newest first. */
  reviews(slug: string, page?: number): Observable<Page<Review>>;
}

export const BRAIDERS_API = new InjectionToken<BraidersApi>('BRAIDERS_API');

@Injectable()
export class HttpBraidersApi implements BraidersApi {
  private readonly http = inject(HttpClient);

  get(slug: string): Observable<BraiderProfile> {
    return this.http.get<BraiderProfile>(`/api/braiders/${encodeURIComponent(slug)}`);
  }

  reviews(slug: string, page?: number): Observable<Page<Review>> {
    return this.http.get<Page<Review>>(`/api/braiders/${encodeURIComponent(slug)}/reviews`, {
      params: queryParams({ page }),
    });
  }
}
