import { describe, expect, it } from 'vitest';
import { Api } from '../support/api';

describe('GET /api/auth/csrf', () => {
  it('Given a visitor, when they ask for a CSRF token, then a script-readable XSRF-TOKEN cookie is set and nothing is returned', async () => {
    const api = new Api();

    const response = await api.get('/api/auth/csrf');

    expect(response.status).toBe(204);
    const cookie = response.cookies.get('XSRF-TOKEN') ?? '';
    expect(cookie).toMatch(/^XSRF-TOKEN=[A-Za-z0-9_-]{32,};/);
    expect(cookie).toMatch(/Path=\//i);
    expect(cookie).toMatch(/SameSite=Lax/i);
    expect(cookie).not.toMatch(/HttpOnly/i);
  });

  it('Given two visitors, when each asks for a CSRF token, then each gets a different token', async () => {
    const first = new Api();
    const second = new Api();

    await first.csrf();
    await second.csrf();

    expect(first.cookie('XSRF-TOKEN')).not.toBe(second.cookie('XSRF-TOKEN'));
  });
});
