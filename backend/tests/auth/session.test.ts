import { describe, expect, it } from 'vitest';
import { Api } from '../support/api';

describe('GET /api/session', () => {
  it('Given no session cookie, when the session is read, then the API answers 401', async () => {
    const response = await new Api().get('/api/session');

    expect(response.status).toBe(401);
    expect(response.body).toEqual({ message: 'Unauthenticated.' });
  });

  it('Given a session cookie that matches no session, when the session is read, then the API answers 401', async () => {
    const api = new Api();
    api.setCookie('hp_session', 'not-a-real-session');

    const response = await api.get('/api/session');

    expect(response.status).toBe(401);
    expect(response.body).toEqual({ message: 'Unauthenticated.' });
  });
});
