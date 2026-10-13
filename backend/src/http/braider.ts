import { findBraiderForUser } from '@/application/braider/current-braider';
import { ApiError } from './api-error';

/** The signed-in braider's profile; an account without one is refused like a non-braider. */
export async function currentBraider(userId: string) {
  const braider = await findBraiderForUser(userId);
  if (!braider) {
    throw new ApiError(403, { message: 'This app is for braider accounts.', code: 'not_braider' });
  }
  return braider;
}
