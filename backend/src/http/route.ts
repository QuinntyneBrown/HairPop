import type { AuthenticatedContext, Handler, NextHandler } from './context';
import { withAuth } from './with-auth';
import { withCsrf } from './with-csrf';
import { withErrors } from './with-errors';
import { withRequestLog } from './with-request-log';

interface AnonymousRoute {
  /** Opt this route out of authentication. */
  readonly anonymous: true;
}

/**
 * Builds a route handler from the standard wrappers, outermost first:
 * request log → error mapping → CSRF (mutations only) → auth → handler.
 *
 * Routes require a session (deny by default). A public route opts out with `{ anonymous: true }`.
 */
export function route(handler: Handler<AuthenticatedContext>): NextHandler;
export function route(handler: Handler, options: AnonymousRoute): NextHandler;
export function route(
  handler: Handler<AuthenticatedContext> | Handler,
  options?: AnonymousRoute,
): NextHandler {
  const guarded = options?.anonymous
    ? (handler as Handler)
    : withAuth(handler as Handler<AuthenticatedContext>);
  return withRequestLog(withErrors(withCsrf(guarded)));
}
