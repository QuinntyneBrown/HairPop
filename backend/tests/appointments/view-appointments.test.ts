// Acceptance Test
// Traces to: L2-018, L2-019, L2-024, L2-027, L2-038, L2-039
import { describe, expect, it } from 'vitest';
import { Api } from '../support/api';
import { signedIn } from '../support/auth';
import { db } from '../support/db';
import {
  createAppointment,
  createBraider,
  createCustomer,
  createService,
  createStyle,
  daysFromNow,
  passionTwists,
} from '../support/factories';

const MAYA = 'maya.chen@example.com';

async function cast() {
  const maya = await createCustomer();
  const kemi = await createCustomer({ name: 'Kemi Adebayo', email: 'kemi.adebayo@example.com' });
  await createStyle();
  await createStyle(passionTwists);
  const nia = await createBraider();
  const knotless = await createService(nia.id, {
    preparation: 'Bring 6 packs of pre-stretched extensions.',
  });
  const passion = await createService(nia.id, {
    styleSlug: 'passion-twists',
    name: 'Passion twists',
    startingPrice: 160,
    typicalHours: 4,
  });
  return { maya, kemi, nia, knotless, passion };
}

interface Summary {
  reference: string;
}

describe('GET /api/appointments', () => {
  it('Given pending and completed items, when the owner opens My Appointments, then each shows service, braider, time, price and status', async () => {
    const { maya, kemi, knotless, passion } = await cast();
    const pending = await createAppointment(maya.id, knotless, {
      number: 1048,
      start: daysFromNow(14),
      estimateMax: 240,
    });
    const completed = await createAppointment(maya.id, knotless, {
      number: 992,
      status: 'confirmed',
      start: daysFromNow(-7),
      agreedAmount: 205,
    });
    await createAppointment(kemi.id, passion, { number: 1052 });

    const response = await (await signedIn(MAYA)).get('/api/appointments');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      data: [
        {
          reference: 'HP-1048',
          status: 'awaiting_reply',
          service: 'Medium knotless braids',
          braider: { slug: 'nia-okafor', name: 'Nia Okafor' },
          start: pending.start.toISOString(),
          timeZone: 'America/Toronto',
          price: { kind: 'estimate', min: 180, max: 240 },
        },
        {
          reference: 'HP-0992',
          status: 'completed',
          service: 'Medium knotless braids',
          braider: { slug: 'nia-okafor', name: 'Nia Okafor' },
          start: completed.start.toISOString(),
          timeZone: 'America/Toronto',
          price: { kind: 'agreed', min: 205, max: 205 },
        },
      ],
      meta: { page: 1, perPage: 12, total: 2, lastPage: 1 },
    });
  });

  it('Given upcoming and past items, when the owner filters, then only the matching items appear in time order', async () => {
    const { maya, knotless } = await cast();
    await createAppointment(maya.id, knotless, { number: 1101, start: daysFromNow(21) });
    await createAppointment(maya.id, knotless, { number: 1102, start: daysFromNow(7) });
    await createAppointment(maya.id, knotless, {
      number: 1103,
      status: 'confirmed',
      start: daysFromNow(-3),
    });
    await createAppointment(maya.id, knotless, {
      number: 1104,
      status: 'cancelled',
      start: daysFromNow(-10),
    });
    const api = await signedIn(MAYA);

    const upcoming = await api.get<{ data: Summary[] }>('/api/appointments?filter=upcoming');
    const past = await api.get<{ data: Summary[] }>('/api/appointments?filter=past');

    expect(upcoming.body.data.map((a) => a.reference)).toEqual(['HP-1102', 'HP-1101']);
    expect(past.body.data.map((a) => a.reference)).toEqual(['HP-1103', 'HP-1104']);
  });

  it('Given a search term, when it is applied, then items match by service, braider or reference, and no match is empty', async () => {
    const { maya, knotless, passion } = await cast();
    await createAppointment(maya.id, knotless, { number: 1048 });
    await createAppointment(maya.id, passion, { number: 1060, start: daysFromNow(20) });
    const api = await signedIn(MAYA);

    const byService = await api.get<{ data: Summary[] }>('/api/appointments?search=passion');
    const byReference = await api.get<{ data: Summary[] }>('/api/appointments?search=hp-1048');
    const byBraider = await api.get<{ data: Summary[] }>('/api/appointments?search=okafor');
    const none = await api.get<{ data: Summary[]; meta: { total: number } }>(
      '/api/appointments?search=locs',
    );

    expect(byService.body.data.map((a) => a.reference)).toEqual(['HP-1060']);
    expect(byReference.body.data.map((a) => a.reference)).toEqual(['HP-1048']);
    expect(byBraider.body.data).toHaveLength(2);
    expect(none.body).toMatchObject({ data: [], meta: { total: 0 } });
  });

  it('Given an invalid filter, when it is applied, then the API answers 422', async () => {
    await cast();

    const response = await (await signedIn(MAYA)).get('/api/appointments?filter=soon');

    expect(response.status).toBe(422);
    expect(response.body).toMatchObject({ errors: { filter: expect.any(Array) } });
  });

  it('Given no session, when appointments are requested, then they are refused', async () => {
    expect((await new Api().get('/api/appointments')).status).toBe(401);
  });
});

describe('GET /api/appointments/{ref}', () => {
  it('Given a pending request, when its owner opens it, then it is awaiting reply with an estimate, the area but no studio address, and the allowed actions', async () => {
    const { maya, knotless } = await cast();
    const pending = await createAppointment(maya.id, knotless, { number: 1048, estimateMax: 240 });

    const response = await (await signedIn(MAYA)).get('/api/appointments/HP-1048');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      reference: 'HP-1048',
      status: 'awaiting_reply',
      service: 'Medium knotless braids',
      braider: { slug: 'nia-okafor', name: 'Nia Okafor' },
      start: pending.start.toISOString(),
      timeZone: 'America/Toronto',
      price: { kind: 'estimate', min: 180, max: 240 },
      durationHours: 5,
      location: { area: 'Toronto West', address: null },
      contact: { email: MAYA, phone: '416-555-0148' },
      policy: {
        changes: 'Request a change at least 48 hours before.',
        cancellation: 'Free up to 48 hours before; later cancellations may be charged $40.',
      },
      preparation: [
        'Arrive with washed, detangled hair.',
        'Bring 6 packs of pre-stretched extensions.',
      ],
      pendingChange: null,
      allowed: { change: true, cancel: true, rebook: false, review: false },
      unavailable: [],
      updatedAt: pending.updatedAt.toISOString(),
    });
  });

  it('Given an accepted request, when its owner opens it, then it is confirmed with the agreed amount and the studio address', async () => {
    const { maya, knotless } = await cast();
    await createAppointment(maya.id, knotless, {
      number: 1048,
      status: 'confirmed',
      agreedAmount: 210,
    });

    const response = await (await signedIn(MAYA)).get('/api/appointments/HP-1048');

    expect(response.body).toMatchObject({
      status: 'confirmed',
      price: { kind: 'agreed', min: 210, max: 210 },
      location: { area: 'Toronto West', address: '214 Ossington Ave, Toronto' },
      allowed: { change: true, cancel: true, rebook: false, review: false },
    });
  });

  it('Given a completed visit, when its owner opens it, then it can be rebooked and reviewed but not changed or cancelled', async () => {
    const { maya, knotless } = await cast();
    await createAppointment(maya.id, knotless, {
      number: 992,
      status: 'confirmed',
      start: daysFromNow(-7),
      agreedAmount: 205,
    });

    const response = await (await signedIn(MAYA)).get('/api/appointments/HP-0992');

    expect(response.body).toMatchObject({
      status: 'completed',
      allowed: { change: false, cancel: false, rebook: true, review: true },
    });
  });

  it('Given a request within the change notice or already declined, when its owner opens it, then changes are not allowed', async () => {
    const { maya, knotless } = await cast();
    await createAppointment(maya.id, knotless, {
      number: 1201,
      start: new Date(Date.now() + 24 * 3600 * 1000),
    });
    await createAppointment(maya.id, knotless, { number: 1202, status: 'declined' });
    const api = await signedIn(MAYA);

    expect((await api.get('/api/appointments/HP-1201')).body).toMatchObject({
      allowed: { change: false, cancel: true },
    });
    expect((await api.get('/api/appointments/HP-1202')).body).toMatchObject({
      status: 'declined',
      location: { address: null },
      allowed: { change: false, cancel: false, rebook: false, review: false },
    });
  });

  it('Given no preparation guidance, when detail loads, then preparation is null rather than invented', async () => {
    const { maya, nia, passion } = await cast();
    await db().braider.update({ where: { id: nia.id }, data: { preparationPolicy: null } });
    await createAppointment(maya.id, passion, { number: 1052 });

    const response = await (await signedIn(MAYA)).get('/api/appointments/HP-1052');

    expect(response.body).toMatchObject({ preparation: null });
  });

  it('Given another customer’s or an unknown reference, when it is requested, then nothing is disclosed', async () => {
    const { kemi, passion } = await cast();
    await createAppointment(kemi.id, passion, { number: 1052 });
    const api = await signedIn(MAYA);

    for (const ref of ['HP-1052', 'HP-9999', 'not-a-ref']) {
      const response = await api.get(`/api/appointments/${ref}`);
      expect(response.status).toBe(404);
      expect(response.body).toEqual({ message: 'Not found.' });
    }
  });
});
