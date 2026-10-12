import { randomUUID } from 'node:crypto';
import type { NextRequest } from 'next/server';
import type { Handler, NextHandler } from './context';

const CORRELATION_HEADER = 'X-Correlation-Id';
const SAFE_CORRELATION_ID = /^[\w.:-]{1,128}$/;

/**
 * Outermost wrapper: assigns the correlation id, stamps it on the response and logs
 * every handled response (status, operation, duration). It never logs bodies, cookies
 * or query strings (L2-044).
 */
export function withRequestLog(inner: Handler): NextHandler {
  return async (request: NextRequest, segment) => {
    const started = performance.now();
    const supplied = request.headers.get(CORRELATION_HEADER);
    const correlationId = supplied && SAFE_CORRELATION_ID.test(supplied) ? supplied : randomUUID();
    const params = await segment.params;

    const response = await inner(request, { correlationId, params });
    response.headers.set(CORRELATION_HEADER, correlationId);

    console.log(
      JSON.stringify({
        level: 'info',
        msg: 'request',
        correlationId,
        operation: `${request.method} ${request.nextUrl.pathname}`,
        status: response.status,
        durationMs: Math.round(performance.now() - started),
      }),
    );
    return response;
  };
}
