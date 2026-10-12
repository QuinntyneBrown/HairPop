import { randomBytes } from 'node:crypto';
import { NextResponse } from 'next/server';
import { ApiError, type ApiErrorBody } from './api-error';
import type { Handler } from './context';

/** Maps thrown failures to `ApiErrorBody` JSON. Unexpected failures become a 500 with a support reference. */
export function withErrors(inner: Handler): Handler {
  return async (request, context) => {
    try {
      return await inner(request, context);
    } catch (error) {
      if (error instanceof ApiError) {
        return NextResponse.json(error.body, { status: error.status, headers: error.headers });
      }
      const reference = `HP-ERR-${randomBytes(4).toString('hex').toUpperCase()}`;
      console.error(
        JSON.stringify({
          level: 'error',
          msg: 'unhandled',
          correlationId: context.correlationId,
          reference,
          error: error instanceof Error ? (error.stack ?? error.message) : String(error),
        }),
      );
      const body: ApiErrorBody = { message: 'Server Error', reference };
      return NextResponse.json(body, { status: 500 });
    }
  };
}
