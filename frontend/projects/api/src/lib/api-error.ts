import { HttpErrorResponse } from '@angular/common/http';

import { ApiErrorBody } from './common';

/**
 * A failed API call in the shape pages need: the HTTP status, the contract's error `code`,
 * field errors for forms and the retry hint for rate limits. Status 0 means the request never
 * reached the API (offline or network failure).
 */
export class ApiError extends Error {
  constructor(
    readonly status: number,
    readonly code: string | null,
    message: string,
    readonly fieldErrors: Readonly<Record<string, readonly string[]>>,
    readonly retryAfter: number | null,
    readonly reference: string | null,
  ) {
    super(message);
    this.name = 'ApiError';
  }

  /** True when the request did not reach the API. */
  get offline(): boolean {
    return this.status === 0;
  }

  /** The first message for a field, or null. */
  field(name: string): string | null {
    return this.fieldErrors[name]?.[0] ?? null;
  }

  static from(error: unknown): ApiError {
    if (error instanceof ApiError) {
      return error;
    }
    if (error instanceof HttpErrorResponse) {
      const body = (
        typeof error.error === 'object' && error.error ? error.error : {}
      ) as Partial<ApiErrorBody>;
      const header = Number(error.headers?.get('Retry-After'));
      return new ApiError(
        error.status,
        body.code ?? null,
        body.message ?? error.message,
        body.errors ?? {},
        body.retryAfter ?? (Number.isFinite(header) && header > 0 ? header : null),
        body.reference ?? null,
      );
    }
    return new ApiError(
      0,
      null,
      error instanceof Error ? error.message : String(error),
      {},
      null,
      null,
    );
  }
}
