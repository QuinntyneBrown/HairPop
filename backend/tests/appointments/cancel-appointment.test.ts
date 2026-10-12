// Acceptance Test
// Traces to: L2-020, L2-022, L2-029, L2-038, L2-044
import { describe, expect, it } from 'vitest';
import { Api } from '../support/api';
import { signedIn } from '../support/auth';
import { NIA, niaWithAccount } from '../support/braider';
import { db } from '../support/db';
import { createAppointment, createCustomer, createSlot, daysFromNow } from '../support/factories';

const MAYA = 'maya.chen@example.com';

async function pendingRequest() {
  const maya = await createCustomer();
  const { nia, service } = await niaWithAccount();
  const slot = await createSlot(nia.id, new Date('2030-10-26T14:00:00Z'));
  const request = await createAppointment(maya.id, service, {
    number: 1048,
    slotId: slot.id,
    start: slot.start,
  });
  return { maya, nia, service, slot, request };
}

const cancel = (api: Api, ref = 'HP-1048') => api.post(`/api/appointments/${ref}/cancellation`, {});

describe('POST /api/appointments/{ref}/cancellation', () => {
  it('Given a cancellable request, when its owner confirms, then it is cancelled once, the slot is offered again and both views reflect it', async () => {
    const { maya, slot } = await pendingRequest();
    const api = await signedIn(MAYA);

    const response = await cancel(api);
    const repeat = await cancel(api);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: 'cancelled' });
    expect(repeat.status).toBe(200);
    expect(repeat.body).toEqual({ status: 'cancelled' });
    expect((await api.get('/api/appointments/HP-1048')).body).toMatchObject({
      status: 'cancelled',
      allowed: { change: false, cancel: false },
    });
    const options = await api.get<{ slots: { id: string }[] }>(
      '/api/braiders/nia-okafor/booking-options',
    );
    expect(options.body.slots.map((s) => s.id)).toEqual([slot.id]);
    const braider = await signedIn(NIA, 'braider');
    expect((await braider.get('/api/braider/requests')).body).toEqual({ data: [] });
    const stale = await braider.post('/api/braider/requests/HP-1048/responses', {
      decision: 'accept',
      agreedAmount: 210,
      version: 1,
    });
    expect(stale.status).toBe(409);
    expect(await db().customerNotification.findMany({ where: { userId: maya.id } })).toMatchObject([
      {
        title: 'Request cancelled',
        body: 'HP-1048 is cancelled. Nia can see that you no longer need this time.',
      },
    ]);
  });

  it('Given a confirmed appointment with a pending change, when its owner cancels, then the change is withdrawn and its slot freed', async () => {
    const { maya, nia, service } = await pendingRequest();
    const confirmedSlot = await createSlot(nia.id, new Date('2030-11-02T14:00:00Z'));
    await createAppointment(maya.id, service, {
      number: 1031,
      status: 'confirmed',
      slotId: confirmedSlot.id,
      start: confirmedSlot.start,
    });
    const proposed = await createSlot(nia.id, new Date('2030-11-03T14:00:00Z'));
    const api = await signedIn(MAYA);
    await api.post('/api/appointments/HP-1031/change-requests', {
      slotId: proposed.id,
      note: null,
    });

    expect((await cancel(api, 'HP-1031')).body).toEqual({ status: 'cancelled' });

    expect(await db().appointmentChange.findFirstOrThrow()).toMatchObject({
      status: 'withdrawn',
      heldSlotId: null,
    });
    const options = await api.get<{ slots: { id: string }[] }>(
      '/api/braiders/nia-okafor/booking-options',
    );
    expect(options.body.slots.map((s) => s.id)).toEqual(
      expect.arrayContaining([confirmedSlot.id, proposed.id]),
    );
  });

  it('Given a declined request or a completed visit, when cancellation is attempted, then it stays as it was', async () => {
    const { maya, service } = await pendingRequest();
    await createAppointment(maya.id, service, { number: 1049, status: 'declined' });
    await createAppointment(maya.id, service, {
      number: 992,
      status: 'confirmed',
      start: daysFromNow(-7),
    });
    const api = await signedIn(MAYA);

    for (const ref of ['HP-1049', 'HP-0992']) {
      const response = await cancel(api, ref);
      expect(response.status).toBe(409);
      expect(response.body).toMatchObject({ code: 'not_cancellable' });
    }
    expect((await db().appointment.findUniqueOrThrow({ where: { number: 992 } })).status).toBe(
      'confirmed',
    );
  });

  it('Given another customer’s request, when they try to cancel it, then nothing is disclosed or changed', async () => {
    const { request } = await pendingRequest();
    await createCustomer({ name: 'Kemi Adebayo', email: 'kemi.adebayo@example.com' });

    const response = await cancel(await signedIn('kemi.adebayo@example.com'));

    expect(response.status).toBe(404);
    expect((await db().appointment.findUniqueOrThrow({ where: { id: request.id } })).status).toBe(
      'awaiting_reply',
    );
  });

  it('Given no session, when cancellation is attempted, then it is refused', async () => {
    const api = new Api();
    await api.csrf();
    expect((await cancel(api)).status).toBe(401);
  });
});
