import { describe, expect, it } from 'vitest';
import { Api } from '../support/api';
import { signedIn } from '../support/auth';
import { db } from '../support/db';
import { createCustomer } from '../support/factories';

describe('POST /api/auth/sign-out', () => {
  it('Given a signed-in customer, when they sign out, then the session ends and its cookie no longer works', async () => {
    await createCustomer();
    const api = await signedIn('maya.chen@example.com');
    const token = api.cookie('hp_session') ?? '';

    const response = await api.post('/api/auth/sign-out');

    expect(response.status).toBe(204);
    expect(response.cookies.get('hp_session')).toMatch(
      /hp_session=;|Max-Age=0|Expires=Thu, 01 Jan 1970/i,
    );
    expect(await db().session.count()).toBe(0);

    const replay = new Api();
    replay.setCookie('hp_session', token);
    expect((await replay.get('/api/session')).status).toBe(401);
  });

  it('Given two signed-in browsers, when one signs out, then the other stays signed in', async () => {
    await createCustomer();
    const laptop = await signedIn('maya.chen@example.com');
    const phone = await signedIn('maya.chen@example.com');

    await laptop.post('/api/auth/sign-out');

    expect((await phone.get('/api/session')).status).toBe(200);
  });

  it('Given no session, when sign-out is posted, then the API answers 401', async () => {
    const api = new Api();
    await api.csrf();

    const response = await api.post('/api/auth/sign-out');

    expect(response.status).toBe(401);
  });

  it('Given a signed-in customer, when sign-out is posted without the CSRF header, then the session stays active', async () => {
    await createCustomer();
    const api = await signedIn('maya.chen@example.com');

    const response = await api.post('/api/auth/sign-out', undefined, { 'X-XSRF-TOKEN': '' });

    expect(response.status).toBe(419);
    expect((await api.get('/api/session')).status).toBe(200);
  });
});
