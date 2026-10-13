import { HttpClient } from '@angular/common/http';
import { Injectable, InjectionToken, inject } from '@angular/core';
import { Observable, switchMap } from 'rxjs';

import { Csrf } from './csrf';

/** Contact details the customer can view and change (L2-014). */
export interface Account {
  readonly name: string;
  readonly email: string;
  readonly emailVerified: boolean;
  readonly pendingEmail: string | null;
  readonly phone: string | null;
}

export interface AccountApi {
  get(): Observable<Account>;
  update(details: { name: string; email: string; phone: string | null }): Observable<Account>;
}

export const ACCOUNT_API = new InjectionToken<AccountApi>('ACCOUNT_API');

@Injectable()
export class HttpAccountApi implements AccountApi {
  private readonly http = inject(HttpClient);
  private readonly csrf = inject(Csrf);

  get(): Observable<Account> {
    return this.http.get<Account>('/api/account');
  }

  update(details: { name: string; email: string; phone: string | null }): Observable<Account> {
    return this.csrf
      .ensure()
      .pipe(switchMap(() => this.http.patch<Account>('/api/account', details)));
  }
}
