import { normalizeEmail } from '@/domain/email';
import { hashPassword } from '@/infrastructure/password';
import { recordHit, retryAfterSeconds } from '@/infrastructure/rate-limiter';
import { createCustomerIfNew } from '@/infrastructure/user-repository';

/** Registrations allowed per email in the window (L2-040). */
export const REGISTER_MAX_ATTEMPTS = 5;
export const REGISTER_WINDOW_SECONDS = 60 * 60;

export interface RegisterCommand {
  readonly name: string;
  readonly email: string;
  readonly password: string;
}

export type RegisterResult =
  | { readonly outcome: 'accepted'; readonly email: string }
  | { readonly outcome: 'rate_limited'; readonly retryAfter: number };

/**
 * Creates one customer account per normalized email (L2-010). An email that is already
 * registered gets the same answer and its account is left untouched, so a retry or a probe
 * learns nothing and creates nothing.
 */
export async function registerCustomer(command: RegisterCommand): Promise<RegisterResult> {
  const email = normalizeEmail(command.email);
  const limitKey = `register:${email}`;
  const retryAfter = await retryAfterSeconds(limitKey, REGISTER_MAX_ATTEMPTS);
  if (retryAfter !== null) return { outcome: 'rate_limited', retryAfter };

  // Hash even for a known email so both paths take the same time.
  const passwordHash = await hashPassword(command.password);
  await createCustomerIfNew({ name: command.name, email, passwordHash });
  await recordHit(limitKey, REGISTER_WINDOW_SECONDS);
  return { outcome: 'accepted', email };
}
