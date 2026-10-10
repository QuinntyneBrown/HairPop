import type { ApiRule, Method } from './api';

/** A 500 for any endpoint, with the contract's error body. */
export function serverError(method: Method, path: string, extra: Partial<ApiRule> = {}): ApiRule {
  return {
    method,
    path,
    status: 500,
    body: { message: 'Server Error', reference: 'HP-ERR-7F3K2Q' },
    ...extra,
  };
}

export function notFound(method: Method, path: string): ApiRule {
  return { method, path, status: 404, body: { message: 'Not found.' } };
}

export function validation(
  method: Method,
  path: string,
  errors: Record<string, string[]>,
  message = 'The given data was invalid.',
): ApiRule {
  return { method, path, status: 422, body: { message, errors } };
}

export function conflict(method: Method, path: string, code: string, extra: object = {}): ApiRule {
  return { method, path, status: 409, body: { message: 'Conflict.', code, ...extra } };
}
