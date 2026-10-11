import { HttpClient } from '@angular/common/http';
import { Injectable, InjectionToken, inject } from '@angular/core';
import { Observable } from 'rxjs';

/** docs/detailed-designs/information/get-help-and-legal-content. */
export type ContentSlug = 'help' | 'terms' | 'privacy';

export interface ContentSection {
  readonly id: string;
  readonly heading: string;
  readonly paragraphs: readonly string[];
}

/** Approved product text: the help topics, or the current terms or privacy information. */
export interface PublishedContent {
  readonly slug: ContentSlug;
  readonly title: string;
  /** "2026-10-01" for legal text; null for help. */
  readonly effectiveDate: string | null;
  readonly sections: readonly ContentSection[];
  readonly supportEmail: string | null;
}

export interface ContentApi {
  get(slug: ContentSlug): Observable<PublishedContent>;
}

export const CONTENT_API = new InjectionToken<ContentApi>('CONTENT_API');

@Injectable()
export class HttpContentApi implements ContentApi {
  private readonly http = inject(HttpClient);

  get(slug: ContentSlug): Observable<PublishedContent> {
    return this.http.get<PublishedContent>(`/api/content/${encodeURIComponent(slug)}`);
  }
}
