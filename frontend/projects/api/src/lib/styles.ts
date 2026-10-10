import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, InjectionToken, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { Image, Page, Range } from './common';

/** docs/detailed-designs/discovery/browse-and-search-styles and inspect-style. */
export type StyleCategory = 'braids' | 'twists' | 'locs';

export const STYLE_CATEGORIES: readonly StyleCategory[] = ['braids', 'twists', 'locs'];

export interface StyleSummary {
  readonly slug: string;
  readonly name: string;
  readonly category: StyleCategory;
  readonly eyebrow: string;
  readonly image: Image | null;
  readonly typicalHours: Range | null;
  readonly typicalPrice: Range | null;
}

export interface StyleVariation {
  readonly name: string;
  readonly description: string;
}

export type StyleOptionalFact = 'typicalWear' | 'variations' | 'quoteFactors';

export interface StyleDetail extends StyleSummary {
  readonly intro: string;
  readonly typicalWear: Range | null;
  readonly variations: readonly StyleVariation[];
  readonly quoteFactors: readonly string[];
  /** Optional facts that failed to load (partial state). */
  readonly unavailable: readonly StyleOptionalFact[];
}

export interface StyleQuery {
  readonly search?: string | null;
  readonly category?: StyleCategory | null;
  readonly page?: number | null;
}

export interface StylesApi {
  list(query: StyleQuery): Observable<Page<StyleSummary>>;
  get(slug: string): Observable<StyleDetail>;
}

export const STYLES_API = new InjectionToken<StylesApi>('STYLES_API');

/** Builds query parameters, leaving out empty values. */
export function queryParams(
  values: Record<string, string | number | null | undefined>,
): HttpParams {
  let params = new HttpParams();
  for (const [key, value] of Object.entries(values)) {
    if (value !== null && value !== undefined && value !== '') {
      params = params.set(key, String(value));
    }
  }
  return params;
}

@Injectable()
export class HttpStylesApi implements StylesApi {
  private readonly http = inject(HttpClient);

  list(query: StyleQuery): Observable<Page<StyleSummary>> {
    return this.http.get<Page<StyleSummary>>('/api/styles', {
      params: queryParams({ search: query.search, category: query.category, page: query.page }),
    });
  }

  get(slug: string): Observable<StyleDetail> {
    return this.http.get<StyleDetail>(`/api/styles/${encodeURIComponent(slug)}`);
  }
}
