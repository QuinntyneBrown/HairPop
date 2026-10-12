// Acceptance Test
// Traces to: L2-028, L2-038, L2-046, L2-047
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
  createSlot,
  daysFromNow,
} from '../support/factories';

interface Slot {
  id: string;
  start: string;
  maxHours: number;
  requestReference: string | null;
}

describe('Braider availability', () => {
  it('Given offered times, when the braider opens Availability, then their future times are listed with any request holding them', async () => {
    const { nia, service } = await niaWithAccount();
    const maya = await createCustomer();
    const free = await createSlot(nia.id, new Date('2030-10-27T15:00:00Z'), 6);
    const held = await createSlot(nia.id, new Date('2030-10-26T14:00:00Z'), 6);
    await createSlot(nia.id, daysFromNow(-1));
    await createAppointment(maya.id, service, { number: 1048, slotId: held.id, start: held.start });

    const response = await (await signedIn(NIA, 'braider')).get('/api/braider/slots');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      data: [
        { id: held.id, start: held.start.toISOString(), maxHours: 6, requestReference: 'HP-1048' },
        { id: free.id, start: free.start.toISOString(), maxHours: 6, requestReference: null },
      ],
    });
  });

  it('Given a future date and time in Toronto, when the braider adds it, then customers can see and select it', async () => {
    await niaWithAccount();
    await createCustomer();
    const api = await signedIn(NIA, 'braider');

    const response = await api.post<Slot>('/api/braider/slots', {
      date: '2030-11-01',
      time: '10:00',
      maxHours: 6,
    });

    expect(response.status).toBe(201);
    // 1 Nov 2030 is in daylight time: 10:00 in Toronto is 14:00 UTC.
    expect(response.body).toEqual({
      id: expect.any(String),
      start: '2030-11-01T14:00:00.000Z',
      maxHours: 6,
      requestReference: null,
    });
    const winter = await api.post<Slot>('/api/braider/slots', {
      date: '2030-12-02',
      time: '13:00',
      maxHours: 4,
    });
    expect(winter.body.start).toBe('2030-12-02T18:00:00.000Z');
    const options = await (
      await signedIn('maya.chen@example.com')
    ).get<{ slots: { id: string }[] }>('/api/braiders/nia-okafor/booking-options');
    expect(options.body.slots.map((s) => s.id)).toEqual([response.body.id, winter.body.id]);
  });

  it('Given a past date, when the braider adds it, then the date is refused', async () => {
    await niaWithAccount();

    const response = await (
      await signedIn(NIA, 'braider')
    ).post('/api/braider/slots', {
      date: '2020-10-09',
      time: '10:00',
      maxHours: 6,
    });

    expect(response.status).toBe(422);
    expect(response.body).toMatchObject({
      errors: { date: ['Choose a date from today onwards.'] },
    });
    expect(await db().offeredSlot.count()).toBe(0);
  });

  it('Given malformed values, when the braider adds a time, then each field is named', async () => {
    await niaWithAccount();

    const response = await (
      await signedIn(NIA, 'braider')
    ).post('/api/braider/slots', {
      date: '2030-13-40',
      time: '25:00',
      maxHours: 0,
    });

    expect(response.status).toBe(422);
    expect(response.body).toMatchObject({
      errors: { date: expect.any(Array), time: expect.any(Array), maxHours: expect.any(Array) },
    });
  });

  it('Given a time that overlaps an offered one, when the braider adds it, then it is refused as a conflict', async () => {
    const { nia } = await niaWithAccount();
    await createSlot(nia.id, new Date('2030-11-01T14:00:00Z'), 6);

    const response = await (
      await signedIn(NIA, 'braider')
    ).post('/api/braider/slots', {
      date: '2030-11-01',
      time: '13:00',
      maxHours: 2,
    });

    expect(response.status).toBe(409);
    expect(response.body).toMatchObject({ code: 'overlap' });
    expect(await db().offeredSlot.count()).toBe(1);
  });

  it('Given a free time, when the braider withdraws it, then customers can no longer request it', async () => {
    const { nia } = await niaWithAccount();
    await createCustomer();
    const slot = await createSlot(nia.id, new Date('2030-11-01T14:00:00Z'));
    const api = await signedIn(NIA, 'braider');

    expect((await api.delete(`/api/braider/slots/${slot.id}`)).status).toBe(204);

    const customer = await signedIn('maya.chen@example.com');
    const options = await customer.get<{ slots: unknown[] }>(
      '/api/braiders/nia-okafor/booking-options',
    );
    expect(options.body.slots).toEqual([]);
  });

  it('Given a requested time, when the braider tries to withdraw it, then it stays offered to that request', async () => {
    const { nia, service } = await niaWithAccount();
    const maya = await createCustomer();
    const slot = await createSlot(nia.id, new Date('2030-11-01T14:00:00Z'));
    await createAppointment(maya.id, service, { number: 1048, slotId: slot.id, start: slot.start });

    const response = await (await signedIn(NIA, 'braider')).delete(`/api/braider/slots/${slot.id}`);

    expect(response.status).toBe(409);
    expect(response.body).toMatchObject({ code: 'requested' });
    expect(await db().offeredSlot.count()).toBe(1);
  });

  it('Given another braider’s time, when a braider withdraws it, then it is denied', async () => {
    await niaWithAccount();
    const aishaUser = await createBraiderUser({
      email: 'aisha.mensah@example.com',
      name: 'Aisha Mensah',
    });
    const aisha = await createBraider({
      slug: 'aisha-mensah',
      name: 'Aisha Mensah',
      userId: aishaUser.id,
    });
    const hers = await createSlot(aisha.id, new Date('2030-11-01T14:00:00Z'));

    const response = await (await signedIn(NIA, 'braider')).delete(`/api/braider/slots/${hers.id}`);

    expect(response.status).toBe(403);
    expect(await db().offeredSlot.count()).toBe(1);
  });

  it('Given a customer or no session, when availability is opened, then it is refused', async () => {
    await niaWithAccount();
    await createCustomer();

    expect((await new Api().get('/api/braider/slots')).status).toBe(401);
    expect((await (await signedIn('maya.chen@example.com')).get('/api/braider/slots')).status).toBe(
      403,
    );
  });
});
