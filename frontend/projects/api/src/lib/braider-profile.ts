import { HttpClient } from '@angular/common/http';
import { Injectable, InjectionToken, inject } from '@angular/core';
import { Observable, switchMap } from 'rxjs';
import { Image } from './common';
import { Csrf } from './csrf';

export interface ProfileInput {
  readonly bio: string;
  readonly area: string;
  readonly studioAddress: string;
  readonly preparation: string;
  readonly changePolicy: string;
  readonly cancellationPolicy: string;
}

export interface ManagedPortfolioItem {
  readonly id: string;
  readonly image: Image | null;
  readonly caption: string;
  readonly styleSlug: string | null;
}

export interface BraiderProfileContent extends ProfileInput {
  readonly version: number;
  readonly portfolio: readonly ManagedPortfolioItem[];
  readonly styles: readonly { slug: string; name: string }[];
}

export interface BraiderProfileApi {
  get(): Observable<BraiderProfileContent>;
  save(input: ProfileInput & { version: number }): Observable<BraiderProfileContent>;
  addPhoto(photo: File, caption: string, styleSlug: string): Observable<ManagedPortfolioItem>;
  removePhoto(id: string): Observable<void>;
}

export const BRAIDER_PROFILE_API = new InjectionToken<BraiderProfileApi>('BRAIDER_PROFILE_API');

@Injectable()
export class HttpBraiderProfileApi implements BraiderProfileApi {
  private readonly http = inject(HttpClient);
  private readonly csrf = inject(Csrf);

  get(): Observable<BraiderProfileContent> {
    return this.http.get<BraiderProfileContent>('/api/braider/profile');
  }

  save(input: ProfileInput & { version: number }): Observable<BraiderProfileContent> {
    return this.csrf
      .ensure()
      .pipe(switchMap(() => this.http.patch<BraiderProfileContent>('/api/braider/profile', input)));
  }

  addPhoto(photo: File, caption: string, styleSlug: string): Observable<ManagedPortfolioItem> {
    const form = new FormData();
    form.append('photo', photo);
    form.append('caption', caption);
    form.append('styleSlug', styleSlug);
    return this.csrf
      .ensure()
      .pipe(switchMap(() => this.http.post<ManagedPortfolioItem>('/api/braider/portfolio', form)));
  }

  removePhoto(id: string): Observable<void> {
    return this.csrf
      .ensure()
      .pipe(
        switchMap(() => this.http.delete<void>(`/api/braider/portfolio/${encodeURIComponent(id)}`)),
      );
  }
}
