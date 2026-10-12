import { timingSafeEqual } from 'node:crypto';
import { CSRF_COOKIE, CSRF_HEADER } from '@/application/auth/csrf-token';
import { ApiError } from './api-error';
import type { Handler } from './context';

const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS']);

/** Double-submit check (ADR 0008): a mutation must echo the XSRF-TOKEN cookie in X-XSRF-TOKEN. */
export function withCsrf(inner: Handler): Handler {
  return async (request, context) => {
    if (!SAFE_METHODS.has(request.method)) {
      const cookie = request.cookies.get(CSRF_COOKIE)?.value ?? '';
      const header = request.headers.get(CSRF_HEADER) ?? '';
      if (!cookie || !sameToken(cookie, header)) {
        throw new ApiError(419, { message: 'CSRF token mismatch.', code: 'csrf_mismatch' });
      }
    }
    return inner(request, context);
  };
}

function sameToken(a: string, b: string): boolean {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  return left.length === right.length && timingSafeEqual(left, right);
}
