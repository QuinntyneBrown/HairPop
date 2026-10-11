import { HttpClient } from '@angular/common/http';
import { Injectable, InjectionToken, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { IsoDateTime } from './common';

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

  save(optionalUsage: boolean): Observable<SavedConsent> {
    return this.http.put<SavedConsent>('/api/consent', { optionalUsage });
  }
}
