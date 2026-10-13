// Acceptance Test
// Traces to: L2-015, L2-016, L2-017, L2-028, L2-038, L2-039, L2-040, L2-044
import { randomUUID } from 'node:crypto';
import { describe, expect, it } from 'vitest';
import { Api } from '../support/api';
import { signedIn } from '../support/auth';
import { bookableNia, submitBooking } from '../support/booking';
import { db } from '../support/db';
import { createCustomer, createService, createSlot, daysFromNow } from '../support/factories';

const MAYA = 'maya.chen@example.com';

describe('POST /api/booking-requests', () => {
  it('Given a reviewed valid request, when the customer sends it, then one awaiting request is recorded with a stable reference and the terms they reviewed', async () => {
    const maya = await createCustomer();
    const { nia, service, slot } = await bookableNia();
    const api = await signedIn(MAYA);

    const response = await submitBooking(api, { serviceId: service.id, slotId: slot.id });

    expect(response.status).toBe(201);
    expect(response.body).toEqual({ reference: 'HP-1001', status: 'awaiting_reply' });
    const [request] = await db().appointment.findMany();
    expect(request).toMatchObject({
      number: 1001,
      customerId: maya.id,
      braiderId: nia.id,
      serviceId: service.id,
      slotId: slot.id,
      heldSlotId: slot.id,
      serviceName: 'Medium knotless braids',
      start: slot.start,
      durationHours: 5,
      estimateMin: 180,
      estimateMax: null,
      agreedAmount: null,
      email: MAYA,
      phone: '416-555-0148',
      hairDetails: 'Shoulder length; bringing my own extensions',
      changePolicy: 'Request a change at least 48 hours before.',
      cancellationPolicy: 'Free up to 48 hours before; later cancellations may be charged $40.',
      status: 'awaiting_reply',
    });
    expect(await db().customerNotification.findMany({ where: { userId: maya.id } })).toMatchObject([
      {
        title: 'Nia received your request',
        body: 'HP-1001 · Nia will confirm the time and final price.',
        link: '/appointments/HP-1001',
      },
    ]);
  });

  it('Given a repeated submission with the same idempotency key, when it reaches the server, then the same request is returned', async () => {
    await createCustomer();
    const { service, slot } = await bookableNia();
    const api = await signedIn(MAYA);
    const key = randomUUID();
    const choice = { serviceId: service.id, slotId: slot.id };

    const [first, second] = await Promise.all([
      submitBooking(api, choice, {}, key),
      submitBooking(api, choice, {}, key),
    ]);
    const retry = await submitBooking(api, choice, {}, key);

    expect([first.status, second.status, retry.status]).toEqual([201, 201, 201]);
    expect(second.body).toEqual(first.body);
    expect(retry.body).toEqual(first.body);
    expect(await db().appointment.count()).toBe(1);
  });

  it('Given a slot that another request holds, when a second customer requests it, then no request is created and the time must be reselected', async () => {
    await createCustomer();
    await createCustomer({ name: 'Kemi Adebayo', email: 'kemi.adebayo@example.com' });
    const { service, slot } = await bookableNia();
    const maya = await signedIn(MAYA);
    const kemi = await signedIn('kemi.adebayo@example.com');

    const results = await Promise.all([
      submitBooking(maya, { serviceId: service.id, slotId: slot.id }),
      submitBooking(kemi, { serviceId: service.id, slotId: slot.id }),
    ]);

    expect(results.map((r) => r.status).sort()).toEqual([201, 409]);
    expect(results.find((r) => r.status === 409)?.body).toMatchObject({ code: 'slot_unavailable' });
    expect(await db().appointment.count()).toBe(1);
    const options = await maya.get<{ slots: unknown[] }>(
      '/api/braiders/nia-okafor/booking-options',
    );
    expect(options.body.slots).toEqual([]);
  });

  it('Given a past, unknown, too-short or other braider’s slot, when it is requested, then the time must be reselected', async () => {
    await createCustomer();
    const { nia, service } = await bookableNia();
    const past = await createSlot(nia.id, daysFromNow(-2));
    const short = await createSlot(nia.id, daysFromNow(20), 3);
    const aisha = await db().braider.create({
      data: {
        slug: 'aisha-mensah',
        name: 'Aisha Mensah',
        area: 'North York',
        distanceKm: 18,
        published: true,
      },
    });
    const hers = await createSlot(aisha.id, daysFromNow(15));
    const api = await signedIn(MAYA);

    for (const slotId of [past.id, short.id, hers.id, 'nope']) {
      const response = await submitBooking(api, { serviceId: service.id, slotId });
      expect(response.status).toBe(409);
      expect(response.body).toMatchObject({ code: 'slot_unavailable' });
    }
    expect(await db().appointment.count()).toBe(0);
  });

  it('Given a service that is no longer published, when it is requested, then the service must be reselected', async () => {
    await createCustomer();
    const { nia, slot } = await bookableNia();
    const draft = await createService(nia.id, { name: 'Boho knotless braids', published: false });
    const api = await signedIn(MAYA);

    const response = await submitBooking(api, { serviceId: draft.id, slotId: slot.id });

    expect(response.status).toBe(409);
    expect(response.body).toMatchObject({ code: 'service_unavailable' });
    expect(await db().appointment.count()).toBe(0);
  });

  it('Given the terms changed after review, when the customer sends, then the request is refused for fresh review', async () => {
    await createCustomer();
    const { service, slot } = await bookableNia();
    const api = await signedIn(MAYA);

    const response = await submitBooking(
      api,
      { serviceId: service.id, slotId: slot.id },
      { policyVersion: '000000000000' },
    );

    expect(response.status).toBe(409);
    expect(response.body).toMatchObject({ code: 'terms_changed' });
    expect(await db().appointment.count()).toBe(0);
  });

  it('Given missing hair details, an invalid email and no time, when the customer sends, then the fields are named', async () => {
    await createCustomer();
    const { service } = await bookableNia();
    const api = await signedIn(MAYA);

    const response = await submitBooking(
      api,
      { serviceId: service.id, slotId: '' },
      { email: 'maya.chen@', hairDetails: '  ', phone: null },
    );

    expect(response.status).toBe(422);
    expect(response.body).toMatchObject({
      errors: {
        slotId: ['Choose one of the offered times.'],
        email: ['Enter a full email address, like name@example.com.'],
        hairDetails: [
          'Describe your hair, for example its length and whether you’re bringing extensions.',
        ],
      },
    });
    expect(await db().appointment.count()).toBe(0);
  });

  it('Given no idempotency key, when the request is sent, then it is refused', async () => {
    await createCustomer();
    const { service, slot } = await bookableNia();
    const api = await signedIn(MAYA);

    const response = await api.post('/api/booking-requests', {
      braiderSlug: 'nia-okafor',
      serviceId: service.id,
      slotId: slot.id,
      email: MAYA,
      phone: null,
      hairDetails: 'Shoulder length',
      policyVersion: 'x',
    });

    expect(response.status).toBe(422);
    expect(response.body).toMatchObject({ code: 'idempotency_key_required' });
  });

  it('Given no session, when a request is sent, then it is refused', async () => {
    const api = new Api();
    await api.csrf();

    const response = await api.post(
      '/api/booking-requests',
      {},
      { 'Idempotency-Key': randomUUID() },
    );

    expect(response.status).toBe(401);
  });

  it('Given repeated new submissions above the limit, when another is sent, then it is refused without a record', async () => {
    await createCustomer();
    const { nia, service } = await bookableNia();
    const api = await signedIn(MAYA);
    for (let i = 0; i < 10; i++) {
      const slot = await createSlot(nia.id, daysFromNow(30 + i));
      expect((await submitBooking(api, { serviceId: service.id, slotId: slot.id })).status).toBe(
        201,
      );
    }
    const slot = await createSlot(nia.id, daysFromNow(60));

    const limited = await submitBooking(api, { serviceId: service.id, slotId: slot.id });

    expect(limited.status).toBe(429);
    expect(limited.body).toMatchObject({ retryAfter: expect.any(Number) });
    expect(await db().appointment.count()).toBe(10);
  });
});
