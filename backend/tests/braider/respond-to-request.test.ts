// Acceptance Test
// Traces to: L2-019, L2-020, L2-028, L2-029, L2-038, L2-046, L2-047
import { describe, expect, it } from 'vitest';
import { Api } from '../support/api';
import { signedIn } from '../support/auth';
import { NIA, niaWithAccount } from '../support/braider';
import { db } from '../support/db';
import {
  createAppointment,
  createBraider,
  createBraiderUser,
  createCustomer,
  createService,
  createSlot,
  daysFromNow,
} from '../support/factories';

const MAYA = 'maya.chen@example.com';

async function pendingRequest() {
  const maya = await createCustomer();
  const { nia, service } = await niaWithAccount();
  // Sat 26 Oct 2030, 10:00 am in Toronto: far enough ahead for any test run.
  const slot = await createSlot(nia.id, new Date('2030-10-26T14:00:00Z'));
  const request = await createAppointment(maya.id, service, {
    number: 1048,
    slotId: slot.id,
    start: slot.start,
    estimateMax: 240,
  });
  return { maya, nia, service, slot, request };
}

function respond(api: Api, body: Record<string, unknown>, ref = 'HP-1048') {
  return api.post<{ status: string }>(`/api/braider/requests/${ref}/responses`, body);
}

describe('GET /api/braider/requests', () => {
  it('Given pending requests, when the braider opens Requests, then their own awaiting requests are listed soonest first', async () => {
    const { request } = await pendingRequest();
    const other = await createBraider({ slug: 'aisha-mensah', name: 'Aisha Mensah' });
    const hers = await createService(other.id, { name: 'Knotless braids' });
    const maya = await db().user.findUniqueOrThrow({ where: { email: MAYA } });
    await createAppointment(maya.id, hers, { number: 1060 });
    const service = await db().braiderService.findUniqueOrThrow({
      where: { id: request.serviceId },
    });
    await createAppointment(maya.id, service, { number: 1070, status: 'confirmed' });

    const response = await (await signedIn(NIA, 'braider')).get('/api/braider/requests');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      data: [
        {
          reference: 'HP-1048',
          kind: 'booking',
          customer: { name: 'Maya Chen' },
          service: 'Medium knotless braids',
          start: request.start.toISOString(),
          previousStart: null,
          durationHours: 5,
          estimate: { min: 180, max: 240 },
          agreedAmount: null,
          hairDetails: 'Shoulder length; bringing my own extensions',
          version: 1,
        },
      ],
    });
  });

  it('Given a customer session or no session, when braider requests are opened, then they are refused', async () => {
    await pendingRequest();

    expect((await new Api().get('/api/braider/requests')).status).toBe(401);
    const customer = await signedIn(MAYA);
    const response = await customer.get('/api/braider/requests');
    expect(response.status).toBe(403);
    expect(response.body).toMatchObject({ code: 'not_braider' });
  });

  it('Given a braider account without a profile, when requests are opened, then it is refused', async () => {
    await createBraiderUser({ email: 'new.braider@example.com', name: 'New Braider' });

    const response = await (
      await signedIn('new.braider@example.com', 'braider')
    ).get('/api/braider/requests');

    expect(response.status).toBe(403);
  });
});

describe('POST /api/braider/requests/{ref}/responses', () => {
  it('Given a pending request, when its braider accepts with an agreed amount, then it is confirmed and its owner sees the amount, address and an update', async () => {
    const { maya } = await pendingRequest();
    const nia = await signedIn(NIA, 'braider');

    const response = await respond(nia, { decision: 'accept', agreedAmount: 210, version: 1 });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: 'confirmed' });
    const detail = await (await signedIn(MAYA)).get('/api/appointments/HP-1048');
    expect(detail.body).toMatchObject({
      status: 'confirmed',
      price: { kind: 'agreed', min: 210, max: 210 },
      location: { address: '214 Ossington Ave, Toronto' },
    });
    expect(await db().customerNotification.findMany({ where: { userId: maya.id } })).toMatchObject([
      {
        title: 'Time confirmed',
        body: 'Nia confirmed HP-1048 for Sat 26 Oct at 10:00 am.',
        link: '/appointments/HP-1048',
      },
    ]);
  });

  it('Given a pending request, when its braider accepts without an amount, then the estimate stands as confirmed', async () => {
    await pendingRequest();

    await respond(await signedIn(NIA, 'braider'), {
      decision: 'accept',
      agreedAmount: null,
      version: 1,
    });

    const detail = await (await signedIn(MAYA)).get('/api/appointments/HP-1048');
    expect(detail.body).toMatchObject({
      status: 'confirmed',
      price: { kind: 'estimate', min: 180, max: 240 },
    });
  });

  it('Given a pending request, when its braider declines, then the owner sees it declined and the slot is offered again', async () => {
    const { maya, slot } = await pendingRequest();

    const response = await respond(await signedIn(NIA, 'braider'), {
      decision: 'decline',
      agreedAmount: null,
      version: 1,
    });

    expect(response.body).toEqual({ status: 'declined' });
    const customer = await signedIn(MAYA);
    expect((await customer.get('/api/appointments/HP-1048')).body).toMatchObject({
      status: 'declined',
    });
    const options = await customer.get<{ slots: { id: string }[] }>(
      '/api/braiders/nia-okafor/booking-options',
    );
    expect(options.body.slots.map((s) => s.id)).toEqual([slot.id]);
    expect(await db().customerNotification.findMany({ where: { userId: maya.id } })).toMatchObject([
      {
        title: 'Request declined',
        body: 'Nia can’t take HP-1048. You can request another time or braider.',
      },
    ]);
  });

  it('Given a request already answered or cancelled, when an old response arrives, then the status is unchanged and the braider is told it is stale', async () => {
    const { request } = await pendingRequest();
    const nia = await signedIn(NIA, 'braider');
    await respond(nia, { decision: 'accept', agreedAmount: 210, version: 1 });

    const late = await respond(nia, { decision: 'decline', agreedAmount: null, version: 1 });

    expect(late.status).toBe(409);
    expect(late.body).toMatchObject({ code: 'stale' });
    expect((await db().appointment.findUniqueOrThrow({ where: { id: request.id } })).status).toBe(
      'confirmed',
    );

    await db().appointment.update({
      where: { id: request.id },
      data: { status: 'cancelled', version: 3 },
    });
    const afterCancel = await respond(nia, { decision: 'accept', agreedAmount: 210, version: 3 });
    expect(afterCancel.status).toBe(409);
    expect(afterCancel.body).toMatchObject({ code: 'stale' });
  });

  it('Given a different braider, when they respond, then it is denied without request details', async () => {
    const { request } = await pendingRequest();
    const aishaUser = await createBraiderUser({
      email: 'aisha.mensah@example.com',
      name: 'Aisha Mensah',
    });
    await createBraider({ slug: 'aisha-mensah', name: 'Aisha Mensah', userId: aishaUser.id });
    const aisha = await signedIn('aisha.mensah@example.com', 'braider');

    const response = await respond(aisha, { decision: 'accept', agreedAmount: 1, version: 1 });

    expect(response.status).toBe(403);
    expect(JSON.stringify(response.body)).not.toContain('Maya');
    expect((await db().appointment.findUniqueOrThrow({ where: { id: request.id } })).status).toBe(
      'awaiting_reply',
    );
    expect(
      (await respond(aisha, { decision: 'accept', agreedAmount: 1, version: 1 }, 'HP-9999')).status,
    ).toBe(404);
  });

  it('Given a negative or fractional agreed amount, when the braider accepts, then the amount is refused', async () => {
    await pendingRequest();
    const nia = await signedIn(NIA, 'braider');

    for (const agreedAmount of [-5, 20.5]) {
      const response = await respond(nia, { decision: 'accept', agreedAmount, version: 1 });
      expect(response.status).toBe(422);
      expect(response.body).toMatchObject({
        errors: { agreedAmount: ['Enter the agreed amount, like 210.'] },
      });
    }
  });

  it('Given a customer session, when it tries to respond, then it is refused', async () => {
    await pendingRequest();

    const response = await respond(await signedIn(MAYA), {
      decision: 'accept',
      agreedAmount: 1,
      version: 1,
    });

    expect(response.status).toBe(403);
  });

  it('Given a request whose time has passed, when the braider accepts, then it is stale', async () => {
    const maya = await createCustomer();
    const { service } = await niaWithAccount();
    await createAppointment(maya.id, service, { number: 1049, start: daysFromNow(-1) });

    const response = await respond(
      await signedIn(NIA, 'braider'),
      { decision: 'accept', agreedAmount: null, version: 1 },
      'HP-1049',
    );

    expect(response.status).toBe(409);
  });
});
