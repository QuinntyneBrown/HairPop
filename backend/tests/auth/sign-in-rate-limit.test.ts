import { describe, expect, it } from 'vitest';
import { Api } from '../support/api';
import { db } from '../support/db';
import { createCustomer, PASSWORD } from '../support/factories';

const MAX_FAILURES = 5;

async function attempt(api: Api, password: string, email = 'maya.chen@example.com') {
  return api.post('/api/auth/sign-in', { email, password, audience: 'customer' });
}

async function failRepeatedly(api: Api, times: number, email?: string) {
  for (let i = 0; i < times; i++) {
    expect((await attempt(api, 'wrong password', email)).status).toBe(422);
  }
}

describe('Sign-in rate limit (L2-040)', () => {
  it('Given repeated sign-in failures, when another attempt is made, then it is refused with a retry indication', async () => {
    await createCustomer();
    const api = new Api();
    await api.csrf();
    await failRepeatedly(api, MAX_FAILURES);

    const response = await attempt(api, PASSWORD);

    expect(response.status).toBe(429);
    expect(response.body).toEqual({
      message: 'Too many attempts.',
      retryAfter: expect.any(Number),
    });
    const retryAfter = (response.body as { retryAfter: number }).retryAfter;
    expect(retryAfter).toBeGreaterThan(0);
    expect(response.headers.get('Retry-After')).toBe(String(retryAfter));
    expect(response.cookies.has('hp_session')).toBe(false);
    expect(await db().session.count()).toBe(0);
  });

  it('Given an unknown email, when it is limited, then the answer is the same as for a real account', async () => {
    const api = new Api();
    await api.csrf();
    await failRepeatedly(api, MAX_FAILURES, 'nobody@example.com');

    const response = await attempt(api, PASSWORD, 'nobody@example.com');

    expect(response.status).toBe(429);
    expect(response.body).toEqual({
      message: 'Too many attempts.',
      retryAfter: expect.any(Number),
    });
  });

  it('Given fewer failures than the limit, when the customer then signs in correctly, then sign-in succeeds', async () => {
    await createCustomer();
    const api = new Api();
    await api.csrf();
    await failRepeatedly(api, MAX_FAILURES - 1);

    expect((await attempt(api, PASSWORD)).status).toBe(200);
  });

  it('Given one account is limited, when a different account signs in, then it is not affected', async () => {
    await createCustomer();
    await createCustomer({ email: 'kemi.adebayo@example.com', name: 'Kemi Adebayo' });
    const api = new Api();
    await api.csrf();
    await failRepeatedly(api, MAX_FAILURES);

    expect((await attempt(api, PASSWORD, 'kemi.adebayo@example.com')).status).toBe(200);
  });

  it('Given a limited account, when the recovery interval has passed, then a valid sign-in works again', async () => {
    await createCustomer();
    const api = new Api();
    await api.csrf();
    await failRepeatedly(api, MAX_FAILURES);
    expect((await attempt(api, PASSWORD)).status).toBe(429);

    await db().rateLimit.updateMany({ data: { resetAt: new Date(Date.now() - 1000) } });

    expect((await attempt(api, PASSWORD)).status).toBe(200);
  });
});
