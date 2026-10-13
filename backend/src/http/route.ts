import type { Role } from '@/domain/session-user';
import type { AuthenticatedContext, Handler, NextHandler } from './context';
import { withAuth } from './with-auth';
import { withCsrf } from './with-csrf';
import { withErrors } from './with-errors';
import { withRequestLog } from './with-request-log';
import { withRole } from './with-role';

interface AnonymousRoute {
  /** Opt this route out of authentication. */
  readonly anonymous: true;
}

interface RoleRoute {
  /** Admit only accounts with this role. */
  readonly role: Role;
}

/**
 * Builds a route handler from the standard wrappers, outermost first:
 * request log → error mapping → CSRF (mutations only) → auth → role → handler.
 *
 * Routes require a session (deny by default). A public route opts out with `{ anonymous: true }`;
 * a customer- or braider-only route adds `{ role }`.
 */
export function route(handler: Handler<AuthenticatedContext>, options?: RoleRoute): NextHandler;
export function route(handler: Handler, options: AnonymousRoute): NextHandler;
export function route(
  handler: Handler<AuthenticatedContext> | Handler,
  options?: AnonymousRoute | RoleRoute,
): NextHandler {
  let guarded: Handler;
  if (options && 'anonymous' in options) {
    guarded = handler as Handler;
  } else {
    const authed = handler as Handler<AuthenticatedContext>;
    guarded = withAuth(options ? withRole(options.role, authed) : authed);
  }
  return withRequestLog(withErrors(withCsrf(guarded)));
}
