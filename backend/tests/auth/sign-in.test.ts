import { describe, expect, it } from 'vitest';
import { Api } from '../support/api';
import { db } from '../support/db';
import { createBraiderUser, createCustomer, PASSWORD } from '../support/factories';

async function signIn(api: Api, body: unknown) {
  await api.csrf();
  return api.post('/api/auth/sign-in', body);
}

describe('POST /api/auth/sign-in', () => {
  it('Given valid customer credentials, when the customer signs in, then the session belongs to them', async () => {
    const maya = await createCustomer();
    const api = new Api();

    const response = await signIn(api, {
      email: 'maya.chen@example.com',
      password: PASSWORD,
      audience: 'customer',
    });

    const user = {
      id: maya.id,
      name: 'Maya Chen',
      firstName: 'Maya',
      email: 'maya.chen@example.com',
      emailVerified: true,
      role: 'customer',
    };
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ user });
    const cookie = response.cookies.get('hp_session') ?? '';
    expect(cookie).toMatch(/HttpOnly/i);
    expect(cookie).toMatch(/SameSite=Lax/i);
    expect(cookie).toMatch(/Path=\//i);

    const session = await api.get('/api/session');
    expect(session.status).toBe(200);
    expect(session.body).toEqual({ user });
  });

  it('Given an email in a different case with spaces, when the customer signs in, then it matches their account', async () => {
    await createCustomer();

    const response = await signIn(new Api(), {
      email: '  Maya.Chen@Example.com ',
      password: PASSWORD,
      audience: 'customer',
    });

    expect(response.status).toBe(200);
  });

  it.each([
    ['a wrong password', 'maya.chen@example.com', 'not the password'],
    ['an unknown email', 'nobody@example.com', PASSWORD],
  ])(
    'Given %s, when sign-in fails, then no session is created and the error names no credential',
    async (_case, email, password) => {
      await createCustomer();
      const api = new Api();

      const response = await signIn(api, { email, password, audience: 'customer' });

      expect(response.status).toBe(422);
      expect(response.body).toEqual({ message: 'These credentials do not match our records.' });
      expect(response.cookies.has('hp_session')).toBe(false);
      expect(await db().session.count()).toBe(0);
    },
  );

  it('Given customer credentials, when they are used on the braider app, then the API refuses with not_braider and creates no session', async () => {
    await createCustomer();
    const api = new Api();

    const response = await signIn(api, {
      email: 'maya.chen@example.com',
      password: PASSWORD,
      audience: 'braider',
    });

    expect(response.status).toBe(403);
    expect(response.body).toEqual({
      message: 'This app is for braider accounts.',
      code: 'not_braider',
    });
    expect(response.cookies.has('hp_session')).toBe(false);
    expect(await db().session.count()).toBe(0);
  });

  it('Given braider credentials, when the braider signs in to the braider app, then their session has the braider role', async () => {
    await createBraiderUser();
    const api = new Api();

    const response = await signIn(api, {
      email: 'nia.okafor@example.com',
      password: PASSWORD,
      audience: 'braider',
    });

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({ user: { name: 'Nia Okafor', role: 'braider' } });
  });

  it('Given no CSRF token header, when sign-in is posted, then the API refuses it before checking credentials', async () => {
    await createCustomer();
    const api = new Api();

    const response = await api.post('/api/auth/sign-in', {
      email: 'maya.chen@example.com',
      password: PASSWORD,
      audience: 'customer',
    });

    expect(response.status).toBe(419);
    expect(response.body).toEqual({ message: 'CSRF token mismatch.', code: 'csrf_mismatch' });
    expect(await db().session.count()).toBe(0);
  });

  it('Given a CSRF header that differs from the cookie, when sign-in is posted, then the API refuses it', async () => {
    await createCustomer();
    const api = new Api();
    await api.csrf();

    const response = await api.post(
      '/api/auth/sign-in',
      { email: 'maya.chen@example.com', password: PASSWORD, audience: 'customer' },
      { 'X-XSRF-TOKEN': 'forged' },
    );

    expect(response.status).toBe(419);
  });

  it('Given a malformed body, when sign-in is posted, then the API answers 422 with field errors', async () => {
    const response = await signIn(new Api(), { email: 'maya.chen@example.com', audience: 'admin' });

    expect(response.status).toBe(422);
    expect(response.body).toMatchObject({
      message: 'The given data was invalid.',
      errors: { password: expect.any(Array), audience: expect.any(Array) },
    });
  });
});
