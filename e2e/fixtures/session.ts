import type { SessionUser } from '../../frontend/projects/api/src/public-api';

import type { ApiRule } from './api';

/** Maya Chen, the customer in the cast (docs/mocks/README.md). */
export const maya: SessionUser = {
  id: 'cust-maya',
  name: 'Maya Chen',
  firstName: 'Maya',
  email: 'maya.chen@example.com',
  emailVerified: true,
  role: 'customer',
};

/** GET /api/session for a signed-in person: the browser carries a valid session cookie. */
export function signedIn(user: SessionUser): ApiRule {
  return { method: 'GET', path: '/api/session', body: { user } };
}

/** POST /api/auth/sign-in accepts the credentials. */
export function signInAccepted(user: SessionUser, extra: Partial<ApiRule> = {}): ApiRule {
  return { method: 'POST', path: '/api/auth/sign-in', body: { user }, ...extra };
}

/** POST /api/auth/sign-in refuses the credentials without saying which one was wrong. */
export function signInRefused(): ApiRule {
  return {
    method: 'POST',
    path: '/api/auth/sign-in',
    status: 422,
    body: { message: 'These credentials do not match our records.' },
  };
}

/** POST /api/auth/sign-in is rate limited. */
export function signInRateLimited(retryAfter: number): ApiRule {
  return {
    method: 'POST',
    path: '/api/auth/sign-in',
    status: 429,
    headers: { 'Retry-After': String(retryAfter) },
    body: { message: 'Too many attempts.', retryAfter },
  };
}

/** POST /api/auth/register answers the same whether or not the email was already registered. */
export function registerAccepted(email: string): ApiRule {
  return { method: 'POST', path: '/api/auth/register', status: 202, body: { email } };
}

/** POST /api/auth/register refuses fields, with the API's own wording. */
export function registerRejected(errors: Record<string, string[]>): ApiRule {
  return {
    method: 'POST',
    path: '/api/auth/register',
    status: 422,
    body: { message: 'The given data was invalid.', errors },
  };
}

/** POST /api/auth/register is rate limited. */
export function registerRateLimited(retryAfter: number): ApiRule {
  return {
    method: 'POST',
    path: '/api/auth/register',
    status: 429,
    headers: { 'Retry-After': String(retryAfter) },
    body: { message: 'Too many attempts.', retryAfter },
  };
}
