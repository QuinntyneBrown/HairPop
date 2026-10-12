import { randomUUID } from 'node:crypto';
import { describe, expect, it } from 'vitest';
import { verifyPassword } from '../../src/infrastructure/password';
import { Api } from '../support/api';
import { db } from '../support/db';
import { createCustomer, PASSWORD } from '../support/factories';

const NEW_PASSWORD = 'a fresh long password';

async function register(api: Api, body: unknown, key = randomUUID()) {
  await api.csrf();
  return api.post('/api/auth/register', body, { 'Idempotency-Key': key });
}

describe('POST /api/auth/register', () => {
  it('Given valid new account details, when the customer registers, then one unverified customer account is created', async () => {
    const response = await register(new Api(), {
      name: 'Kemi Adebayo',
      email: '  Kemi.Adebayo@Example.com ',
      password: NEW_PASSWORD,
    });

    expect(response.status).toBe(202);
    expect(response.body).toEqual({ email: 'kemi.adebayo@example.com' });
    const users = await db().user.findMany();
    expect(users).toHaveLength(1);
    expect(users[0]).toMatchObject({
      name: 'Kemi Adebayo',
      email: 'kemi.adebayo@example.com',
      role: 'customer',
      emailVerifiedAt: null,
    });
    expect(users[0]?.passwordHash).toMatch(/^\$argon2id\$/);
    expect(response.cookies.has('hp_session')).toBe(false);
  });

  it('Given an email already registered, when someone registers with it, then the answer is the same and the account is untouched', async () => {
    const maya = await createCustomer();

    const response = await register(new Api(), {
      name: 'Someone Else',
      email: 'MAYA.CHEN@example.com',
      password: NEW_PASSWORD,
    });

    expect(response.status).toBe(202);
    expect(response.body).toEqual({ email: 'maya.chen@example.com' });
    const users = await db().user.findMany();
    expect(users).toHaveLength(1);
    expect(users[0]?.name).toBe('Maya Chen');
    expect(await verifyPassword(users[0]?.passwordHash ?? '', PASSWORD)).toBe(true);
    expect(users[0]?.id).toBe(maya.id);
  });

  it('Given a retry with the same idempotency key, when it is submitted again, then no duplicate account is created', async () => {
    const api = new Api();
    const key = randomUUID();
    const body = {
      name: 'Kemi Adebayo',
      email: 'kemi.adebayo@example.com',
      password: NEW_PASSWORD,
    };

    const first = await register(api, body, key);
    const retry = await register(api, body, key);

    expect(first.status).toBe(202);
    expect(retry.status).toBe(202);
    expect(retry.body).toEqual(first.body);
    expect(await db().user.count()).toBe(1);
  });

  it('Given an invalid email and a short password, when the customer registers, then field errors name both and no account is created', async () => {
    const response = await register(new Api(), {
      name: 'Kemi Adebayo',
      email: 'kemi@',
      password: 'too short',
    });

    expect(response.status).toBe(422);
    expect(response.body).toEqual({
      message: 'The given data was invalid.',
      errors: {
        email: ['Enter a full email address, like name@example.com.'],
        password: ['Use at least 12 characters.'],
      },
    });
    expect(await db().user.count()).toBe(0);
  });

  it('Given a blank name, when the customer registers, then the name is refused', async () => {
    const response = await register(new Api(), {
      name: '   ',
      email: 'kemi.adebayo@example.com',
      password: NEW_PASSWORD,
    });

    expect(response.status).toBe(422);
    expect(response.body).toMatchObject({ errors: { name: ['Enter your name.'] } });
    expect(await db().user.count()).toBe(0);
  });

  it('Given repeated registrations for one email, when the limit is passed, then the next is refused with a retry indication', async () => {
    const api = new Api();
    const body = {
      name: 'Kemi Adebayo',
      email: 'kemi.adebayo@example.com',
      password: NEW_PASSWORD,
    };
    for (let i = 0; i < 5; i++) expect((await register(api, body)).status).toBe(202);

    const response = await register(api, body);

    expect(response.status).toBe(429);
    expect(response.body).toEqual({
      message: 'Too many attempts.',
      retryAfter: expect.any(Number),
    });
    expect(response.headers.get('Retry-After')).toBeTruthy();
    expect(await db().user.count()).toBe(1);
  });
});
