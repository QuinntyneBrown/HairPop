import { describe, expect, it } from 'vitest';
import { Api } from '../support/api';
import { db } from '../support/db';

async function saveConsent(api: Api, body: unknown) {
  await api.csrf();
  return api.put('/api/consent', body);
}

describe('PUT /api/consent', () => {
  it.each([true, false])(
    'Given a visitor, when they save optional usage %s, then the choice is recorded and returned with when it was saved',
    async (optionalUsage) => {
      const before = Date.now();

      const response = await saveConsent(new Api(), { optionalUsage });

      expect(response.status).toBe(200);
      const body = response.body as { optionalUsage: boolean; savedAt: string };
      expect(body.optionalUsage).toBe(optionalUsage);
      expect(new Date(body.savedAt).getTime()).toBeGreaterThanOrEqual(before - 1000);
      const saved = await db().consentPreference.findMany();
      expect(saved).toHaveLength(1);
      expect(saved[0]?.optionalUsage).toBe(optionalUsage);
    },
  );

  it('Given a visitor who accepted, when they revise to decline, then the latest choice is returned', async () => {
    const api = new Api();
    await saveConsent(api, { optionalUsage: true });

    const response = await saveConsent(api, { optionalUsage: false });

    expect(response.body).toMatchObject({ optionalUsage: false });
  });

  it('Given a choice that is not a boolean, when it is saved, then the API answers 422 and records nothing', async () => {
    const response = await saveConsent(new Api(), { optionalUsage: 'yes' });

    expect(response.status).toBe(422);
    expect(response.body).toMatchObject({ errors: { optionalUsage: expect.any(Array) } });
    expect(await db().consentPreference.count()).toBe(0);
  });

  it('Given no CSRF header, when consent is saved, then the API refuses it', async () => {
    const response = await new Api().put('/api/consent', { optionalUsage: true });

    expect(response.status).toBe(419);
  });
});
