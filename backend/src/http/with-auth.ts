import { authenticate } from '@/application/auth/authenticate';
import { SESSION_COOKIE } from '@/application/auth/session-cookie';
import { unauthenticated } from './api-error';
import type { AuthenticatedContext, Handler } from './context';

/** Requires a live session; the handler receives the signed-in user. */
export function withAuth(inner: Handler<AuthenticatedContext>): Handler {
  return async (request, context) => {
    const user = await authenticate(request.cookies.get(SESSION_COOKIE)?.value);
    if (!user) throw unauthenticated();
    return inner(request, { ...context, user });
  };
}
