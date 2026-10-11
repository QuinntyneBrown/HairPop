import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, map, shareReplay, throwError } from 'rxjs';

/**
 * Fetches Sanctum's CSRF cookie once per page load (ADR 0003). Angular echoes it as
 * `X-XSRF-TOKEN` on the mutating request that follows, so every state-changing API call waits
 * for {@link ensure} first. A failed fetch is forgotten, so the next attempt asks again.
 */
@Injectable({ providedIn: 'root' })
export class Csrf {
  private readonly http = inject(HttpClient);
  private ready: Observable<void> | null = null;

  ensure(): Observable<void> {
    this.ready ??= this.http.get('/sanctum/csrf-cookie', { responseType: 'text' }).pipe(
      map(() => undefined),
      shareReplay({ bufferSize: 1, refCount: false }),
      catchError((error) => {
        this.ready = null;
        return throwError(() => error);
      }),
    );
    return this.ready;
  }
}
