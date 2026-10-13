// Acceptance Test
// Traces to: L2-015, L2-016, L2-028, L2-038
import { describe, expect, it } from 'vitest';
import { Api } from '../support/api';
import { signedIn } from '../support/auth';
import { db } from '../support/db';
import {
  createBraider,
  createBraiderUser,
  createCustomer,
  createService,
  createSlot,
  createStyle,
  daysFromNow,
  passionTwists,
} from '../support/factories';

const MAYA = 'maya.chen@example.com';

interface Options {
  braider: unknown;
  services: { id: string }[];
  slots: { id: string; start: string }[];
  policy: { version: string; changes: string; cancellation: string };
  contact: unknown;
  timeZone: string;
}

describe('GET /api/braiders/{slug}/booking-options', () => {
  it('Given a published braider with services and offered times, when a signed-in customer opens booking, then current services, future free times, policy and their contact are returned', async () => {
    await createCustomer();
    await createStyle();
    await createStyle(passionTwists);
    await createStyle({ ...passionTwists, slug: 'hidden-style', name: 'Hidden', published: false });
    const nia = await createBraider();
    const knotless = await createService(nia.id);
    await createService(nia.id, { name: 'Draft service', published: false });
    await createService(nia.id, { styleSlug: 'hidden-style', name: 'Unpublished style' });
    const later = await createSlot(nia.id, daysFromNow(21));
    const sooner = await createSlot(nia.id, daysFromNow(14));
    await createSlot(nia.id, daysFromNow(-1));

    const response = await (
      await signedIn(MAYA)
    ).get<Options>('/api/braiders/nia-okafor/booking-options');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      braider: { slug: 'nia-okafor', name: 'Nia Okafor', area: 'Toronto West' },
      services: [
        {
          id: knotless.id,
          name: 'Medium knotless braids',
          startingPrice: 180,
          typicalHours: 5,
          estimate: { min: 180, max: null },
        },
      ],
      slots: [
        { id: sooner.id, start: sooner.start.toISOString() },
        { id: later.id, start: later.start.toISOString() },
      ],
      policy: {
        version: expect.stringMatching(/^[0-9a-f]{12}$/),
        changes: 'Request a change at least 48 hours before.',
        cancellation: 'Free up to 48 hours before; later cancellations may be charged $40.',
      },
      contact: { email: MAYA, phone: '416-555-0148' },
      timeZone: 'America/Toronto',
    });
  });

  it('Given the braider changes a policy or a price, when booking options are read again, then the policy version changes', async () => {
    await createCustomer();
    await createStyle();
    const nia = await createBraider();
    const service = await createService(nia.id);
    const api = await signedIn(MAYA);
    const path = '/api/braiders/nia-okafor/booking-options';

    const before = (await api.get<Options>(path)).body.policy.version;
    expect((await api.get<Options>(path)).body.policy.version).toBe(before);

    await db().braider.update({
      where: { id: nia.id },
      data: { cancellationPolicy: 'No refunds.' },
    });
    const afterPolicy = (await api.get<Options>(path)).body.policy.version;
    expect(afterPolicy).not.toBe(before);

    await db().braiderService.update({ where: { id: service.id }, data: { startingPrice: 200 } });
    expect((await api.get<Options>(path)).body.policy.version).not.toBe(afterPolicy);
  });

  it('Given an unpublished or unknown braider, when booking options are requested, then they are not found', async () => {
    await createCustomer();
    await createBraider({ published: false });
    const api = await signedIn(MAYA);

    expect((await api.get('/api/braiders/nia-okafor/booking-options')).status).toBe(404);
    expect((await api.get('/api/braiders/nobody/booking-options')).status).toBe(404);
  });

  it('Given no session or a braider session, when booking options are requested, then they are refused', async () => {
    await createBraider();
    await createBraiderUser({ email: 'aisha.mensah@example.com', name: 'Aisha Mensah' });

    expect((await new Api().get('/api/braiders/nia-okafor/booking-options')).status).toBe(401);
    const braider = await signedIn('aisha.mensah@example.com');
    expect((await braider.get('/api/braiders/nia-okafor/booking-options')).status).toBe(403);
  });
});
