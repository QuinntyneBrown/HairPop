import { HttpClient } from '@angular/common/http';
import { Injectable, InjectionToken, inject } from '@angular/core';
import { Observable, switchMap } from 'rxjs';

import { IsoDateTime } from './common';
import { Csrf } from './csrf';

/** docs/detailed-designs/privacy/manage-cookie-choice. */
export interface SavedConsent {
  readonly optionalUsage: boolean;
  readonly savedAt: IsoDateTime;
}

export interface ConsentApi {
  /** Saves whether optional usage data may be stored. */
  save(optionalUsage: boolean): Observable<SavedConsent>;
}

export const CONSENT_API = new InjectionToken<ConsentApi>('CONSENT_API');

@Injectable()
export class HttpConsentApi implements ConsentApi {
  private readonly http = inject(HttpClient);
  private readonly csrf = inject(Csrf);

  save(optionalUsage: boolean): Observable<SavedConsent> {
    return this.csrf
      .ensure()
      .pipe(switchMap(() => this.http.put<SavedConsent>('/api/consent', { optionalUsage })));
  }
}
