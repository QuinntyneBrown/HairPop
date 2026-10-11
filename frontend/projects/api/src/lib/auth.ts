import { HttpClient } from '@angular/common/http';
import { Injectable, InjectionToken, inject } from '@angular/core';
import { Observable, switchMap } from 'rxjs';

import { Csrf } from './csrf';

/** docs/detailed-designs/identity/manage-session. */
export interface SessionUser {
  readonly id: string;
  readonly name: string;
  readonly firstName: string;
  readonly email: string;
  readonly emailVerified: boolean;
  readonly role: 'customer' | 'braider';
}

export interface SignInCredentials {
  readonly email: string;
  readonly password: string;
  /** Which app is being signed in to: a customer on the braider app is refused (L2-046). */
  readonly audience: 'customer' | 'braider';
}

export interface AuthApi {
  /** Who is signed in; a 401 error when nobody is. */
  session(): Observable<{ user: SessionUser }>;
  /** Signs in. A 422 never names the wrong credential; 403 `not_braider`; 429 `retryAfter`. */
  signIn(credentials: SignInCredentials): Observable<{ user: SessionUser }>;
  /** Ends the session. */
  signOut(): Observable<void>;
}

export const AUTH_API = new InjectionToken<AuthApi>('AUTH_API');

@Injectable()
export class HttpAuthApi implements AuthApi {
  private readonly http = inject(HttpClient);
  private readonly csrf = inject(Csrf);

  session(): Observable<{ user: SessionUser }> {
    return this.http.get<{ user: SessionUser }>('/api/session');
  }

  signIn(credentials: SignInCredentials): Observable<{ user: SessionUser }> {
    return this.csrf
      .ensure()
      .pipe(
        switchMap(() => this.http.post<{ user: SessionUser }>('/api/auth/sign-in', credentials)),
      );
  }

  signOut(): Observable<void> {
    return this.csrf
      .ensure()
      .pipe(switchMap(() => this.http.post<void>('/api/auth/sign-out', null)));
  }
}
