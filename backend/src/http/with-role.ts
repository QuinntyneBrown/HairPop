import type { Role } from '@/domain/session-user';
import { ApiError } from './api-error';
import type { AuthenticatedContext, Handler } from './context';

const REFUSALS: Record<Role, ApiError> = {
  customer: new ApiError(403, { message: 'This is for customer accounts.', code: 'not_customer' }),
  braider: new ApiError(403, { message: 'This app is for braider accounts.', code: 'not_braider' }),
};

/** Admits only accounts with `role`; others get 403 without any record details (L2-038, L2-046). */
export function withRole(
  role: Role,
  inner: Handler<AuthenticatedContext>,
): Handler<AuthenticatedContext> {
  return async (request, context) => {
    if (context.user.role !== role) throw REFUSALS[role];
    return inner(request, context);
  };
}
