import { randomBytes } from 'node:crypto';

export const CSRF_COOKIE = 'XSRF-TOKEN';
export const CSRF_HEADER = 'X-XSRF-TOKEN';

/** A fresh double-submit token (ADR 0008). */
export function issueCsrfToken(): string {
  return randomBytes(32).toString('base64url');
}
