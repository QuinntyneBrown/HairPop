import { hashPassword } from '../../src/infrastructure/password';
import { db } from './db';

export const PASSWORD = 'correct horse battery';

/** Maya Chen, the customer cast in docs/mocks/README.md. */
export async function createCustomer(overrides: { email?: string; name?: string } = {}) {
  return db().user.create({
    data: {
      name: overrides.name ?? 'Maya Chen',
      email: overrides.email ?? 'maya.chen@example.com',
      emailVerifiedAt: new Date('2026-10-01T12:00:00Z'),
      passwordHash: await hashPassword(PASSWORD),
      role: 'customer',
    },
  });
}

/** Nia Okafor, the braider cast in docs/mocks/README.md. */
export async function createBraiderUser(overrides: { email?: string; name?: string } = {}) {
  return db().user.create({
    data: {
      name: overrides.name ?? 'Nia Okafor',
      email: overrides.email ?? 'nia.okafor@example.com',
      emailVerifiedAt: new Date('2026-10-01T12:00:00Z'),
      passwordHash: await hashPassword(PASSWORD),
      role: 'braider',
    },
  });
}
