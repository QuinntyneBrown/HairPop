// Acceptance Test
// Traces to: L2-029, L2-034
import { describe, expect, it } from 'vitest';
import { Api } from '../support/api';
import { signedIn } from '../support/auth';
import { db } from '../support/db';
import { createCustomer } from '../support/factories';

describe('Privacy updates', () => {
  it('Given a signed-in customer, when they save their cookie choice, then the saved choice is recorded in their updates', async () => {
    const maya = await createCustomer();
    const api = await signedIn('maya.chen@example.com');

    await api.put('/api/consent', { optionalUsage: false });

    expect(await db().customerNotification.findMany({ where: { userId: maya.id } })).toMatchObject([
      {
        title: 'Preferences saved',
        body: 'Essential only. You can change this in Cookie preferences.',
        link: null,
      },
    ]);
  });

  it('Given a visitor who is not signed in, when they save their choice, then no update is recorded', async () => {
    await createCustomer();
    const api = new Api();
    await api.csrf();

    expect((await api.put('/api/consent', { optionalUsage: true })).status).toBe(200);

    expect(await db().customerNotification.count()).toBe(0);
  });
});
