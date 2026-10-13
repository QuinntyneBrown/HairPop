import type { NextRequest } from 'next/server';
import { ApiError } from './api-error';

const KEY = /^[\w-]{1,100}$/;

/** The `Idempotency-Key` a record-creating mutation must send (L2-017 AC2, L2-044). */
export function idempotencyKey(request: NextRequest): string {
  const key = request.headers.get('Idempotency-Key');
  if (!key || !KEY.test(key)) {
    throw new ApiError(422, {
      message: 'Send an Idempotency-Key header for this attempt.',
      code: 'idempotency_key_required',
    });
  }
  return key;
}
