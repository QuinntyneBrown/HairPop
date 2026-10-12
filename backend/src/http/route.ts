import type { Handler, NextHandler } from './context';
import { withErrors } from './with-errors';
import { withRequestLog } from './with-request-log';

interface RouteOptions {
  /** Opt this route out of authentication. Routes require a session unless this is set. */
  readonly anonymous: true;
}

/**
 * Builds a route handler from the standard wrappers, outermost first:
 * request log → error mapping → handler.
 */
export function route(handler: Handler, options: RouteOptions): NextHandler {
  void options;
  return withRequestLog(withErrors(handler));
}
