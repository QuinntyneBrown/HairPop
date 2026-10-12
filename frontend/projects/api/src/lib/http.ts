import {
  HttpInterceptorFn,
  provideHttpClient,
  withFetch,
  withInterceptors,
  withXsrfConfiguration,
} from '@angular/common/http';
import { EnvironmentProviders, InjectionToken, REQUEST, inject } from '@angular/core';

/**
 * The API origin used by server-side rendering, for example `http://localhost:8000`. In the
 * browser it is not provided and requests stay same-origin (ADR 0002).
 */
export const API_ORIGIN = new InjectionToken<string>('API_ORIGIN');

const API_PATH = /^\/api\//;

/**
 * On the server, prefixes relative API URLs with `API_ORIGIN` and forwards the incoming request's
 * cookies so the API can identify the session (and, in e2e, the test's stub state).
 */
export const apiOriginInterceptor: HttpInterceptorFn = (req, next) => {
  const origin = inject(API_ORIGIN, { optional: true });
  if (!origin || !API_PATH.test(req.url)) {
    return next(req);
  }
  const cookie = inject(REQUEST, { optional: true })?.headers.get('cookie');
  return next(
    req.clone({
      url: origin.replace(/\/$/, '') + req.url,
      setHeaders: cookie ? { Cookie: cookie } : {},
    }),
  );
};

/** Asks for JSON responses from the API. */
const jsonInterceptor: HttpInterceptorFn = (req, next) =>
  next(API_PATH.test(req.url) ? req.clone({ setHeaders: { Accept: 'application/json' } }) : req);

/** HttpClient for HairPop APIs: fetch, XSRF cookie names (ADR 0008), origin handling. */
export function provideHairPopHttp(): EnvironmentProviders {
  return provideHttpClient(
    withFetch(),
    withXsrfConfiguration({ cookieName: 'XSRF-TOKEN', headerName: 'X-XSRF-TOKEN' }),
    withInterceptors([jsonInterceptor, apiOriginInterceptor]),
  );
}

/** A fresh idempotency key for one state-changing attempt (L2-017 AC2). */
export function idempotencyKey(): string {
  return globalThis.crypto.randomUUID();
}
