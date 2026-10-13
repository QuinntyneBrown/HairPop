// Acceptance Test
// Traces to: L2-020, L2-021, L2-028, L2-029, L2-038
import { describe, expect, it } from 'vitest';
import { Api } from '../support/api';
import { signedIn } from '../support/auth';
import { NIA, niaWithAccount } from '../support/braider';
import { db } from '../support/db';
import { createAppointment, createCustomer, createSlot, daysFromNow } from '../support/factories';

const MAYA = 'maya.chen@example.com';

async function confirmedAppointment() {
  const maya = await createCustomer();
  const { nia, service } = await niaWithAccount();
  const current = await createSlot(nia.id, new Date('2030-10-26T14:00:00Z'));
  const appointment = await createAppointment(maya.id, service, {
    number: 1031,
    status: 'confirmed',
    slotId: current.id,
    start: current.start,
    agreedAmount: 210,
  });
  const offered = await createSlot(nia.id, new Date('2030-10-27T15:00:00Z'));
  return { maya, nia, service, current, appointment, offered };
}

function propose(
  api: Api,
  slotId: string,
  note: string | null = 'Saturday morning no longer works for me.',
) {
  return api.post(`/api/appointments/HP-1031/change-requests`, { slotId, note });
}

describe('Appointment change requests', () => {
  it('Given a changeable appointment, when its owner opens change options, then free offered times other than the current one are listed', async () => {
    const { nia, offered } = await confirmedAppointment();
    await createSlot(nia.id, daysFromNow(-1));
    await createSlot(nia.id, new Date('2030-10-28T15:00:00Z'), 2);

    const response = await (await signedIn(MAYA)).get('/api/appointments/HP-1031/change-options');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      slots: [{ id: offered.id, start: offered.start.toISOString() }],
    });
  });

  it('Given a valid offered time, when the owner proposes it, then the change is pending and the agreed time stays authoritative', async () => {
    const { appointment, offered } = await confirmedAppointment();
    const api = await signedIn(MAYA);

    const response = await propose(api, offered.id);

    expect(response.status).toBe(201);
    expect(response.body).toEqual({ pendingChange: { start: offered.start.toISOString() } });
    expect((await api.get('/api/appointments/HP-1031')).body).toMatchObject({
      status: 'confirmed',
      start: appointment.start.toISOString(),
      pendingChange: { start: offered.start.toISOString() },
      allowed: { change: false, cancel: true },
    });
    const options = await api.get<{ slots: unknown[] }>('/api/braiders/nia-okafor/booking-options');
    expect(options.body.slots).toEqual([]);
  });

  it('Given an unavailable or unknown time, when the owner proposes it, then no change is recorded', async () => {
    const { nia, current } = await confirmedAppointment();
    const past = await createSlot(nia.id, daysFromNow(-1));
    const api = await signedIn(MAYA);

    for (const slotId of [past.id, current.id, 'nope']) {
      const response = await propose(api, slotId);
      expect(response.status).toBe(409);
      expect(response.body).toMatchObject({ code: 'slot_unavailable' });
    }
    const missing = await propose(api, '');
    expect(missing.status).toBe(422);
    expect(missing.body).toMatchObject({
      errors: { slotId: ['Choose one of the offered times.'] },
    });
    expect(await db().appointmentChange.count()).toBe(0);
  });

  it('Given a pending change, a declined appointment or too little notice, when another change is attempted, then it is rejected without altering the time', async () => {
    const { nia, appointment, offered } = await confirmedAppointment();
    const api = await signedIn(MAYA);
    await propose(api, offered.id);
    const another = await createSlot(nia.id, new Date('2030-11-02T15:00:00Z'));

    const again = await propose(api, another.id);
    expect(again.status).toBe(409);
    expect(again.body).toMatchObject({ code: 'not_changeable' });

    await db().appointmentChange.deleteMany();
    await db().appointment.update({
      where: { id: appointment.id },
      data: { start: new Date(Date.now() + 3600_000) },
    });
    expect((await propose(api, another.id)).body).toMatchObject({ code: 'not_changeable' });
    expect((await api.get('/api/appointments/HP-1031/change-options')).status).toBe(409);

    await db().appointment.update({
      where: { id: appointment.id },
      data: { start: appointment.start, status: 'declined', heldSlotId: null },
    });
    expect((await propose(api, another.id)).body).toMatchObject({ code: 'not_changeable' });
  });

  it('Given a pending change, when the braider opens Requests, then it is listed as a change with the current and proposed times', async () => {
    const { appointment, offered } = await confirmedAppointment();
    await propose(await signedIn(MAYA), offered.id);

    const response = await (await signedIn(NIA, 'braider')).get('/api/braider/requests');

    expect(response.body).toEqual({
      data: [
        expect.objectContaining({
          reference: 'HP-1031',
          kind: 'change',
          start: offered.start.toISOString(),
          previousStart: appointment.start.toISOString(),
          agreedAmount: 210,
          version: 2,
        }),
      ],
    });
  });

  it('Given a pending change, when the braider accepts it, then the appointment moves to the new time, the old slot is offered again and the owner is told', async () => {
    const { maya, current, offered } = await confirmedAppointment();
    const customer = await signedIn(MAYA);
    await propose(customer, offered.id);

    const response = await (
      await signedIn(NIA, 'braider')
    ).post('/api/braider/requests/HP-1031/responses', {
      decision: 'accept',
      agreedAmount: null,
      version: 2,
    });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: 'confirmed' });
    expect((await customer.get('/api/appointments/HP-1031')).body).toMatchObject({
      status: 'confirmed',
      start: offered.start.toISOString(),
      pendingChange: null,
      price: { kind: 'agreed', min: 210 },
    });
    const options = await customer.get<{ slots: { id: string }[] }>(
      '/api/braiders/nia-okafor/booking-options',
    );
    expect(options.body.slots.map((s) => s.id)).toEqual([current.id]);
    expect(await db().customerNotification.findMany({ where: { userId: maya.id } })).toMatchObject([
      {
        title: 'New time confirmed',
        body: 'Nia moved HP-1031 to Sun 27 Oct at 11:00 am.',
        link: '/appointments/HP-1031',
      },
    ]);
  });

  it('Given a pending change, when the braider declines it, then the agreed time stays and the owner is told', async () => {
    const { maya, appointment, offered } = await confirmedAppointment();
    const customer = await signedIn(MAYA);
    await propose(customer, offered.id);

    await (
      await signedIn(NIA, 'braider')
    ).post('/api/braider/requests/HP-1031/responses', {
      decision: 'decline',
      agreedAmount: null,
      version: 2,
    });

    expect((await customer.get('/api/appointments/HP-1031')).body).toMatchObject({
      status: 'confirmed',
      start: appointment.start.toISOString(),
      pendingChange: null,
    });
    expect(await db().customerNotification.findMany({ where: { userId: maya.id } })).toMatchObject([
      {
        title: 'Change declined',
        body: 'Nia can’t move HP-1031. Your time stays Sat 26 Oct at 10:00 am.',
      },
    ]);
  });

  it('Given another customer’s appointment, when change options or a change are requested, then nothing is disclosed', async () => {
    const { offered } = await confirmedAppointment();
    await createCustomer({ name: 'Kemi Adebayo', email: 'kemi.adebayo@example.com' });
    const kemi = await signedIn('kemi.adebayo@example.com');

    expect((await kemi.get('/api/appointments/HP-1031/change-options')).status).toBe(404);
    expect((await propose(kemi, offered.id)).status).toBe(404);
    expect(await db().appointmentChange.count()).toBe(0);
  });

  it('Given no session, when a change is requested, then it is refused', async () => {
    const api = new Api();
    await api.csrf();
    expect((await propose(api, 'x')).status).toBe(401);
  });
});
