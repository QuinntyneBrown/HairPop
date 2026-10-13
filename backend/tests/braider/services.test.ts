// Acceptance Test
// Traces to: L2-026, L2-038, L2-039, L2-046, L2-047
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
  createStyle,
  passionTwists,
} from '../support/factories';

interface Service {
  id: string;
  version: number;
  published: boolean;
}

const input = {
  styleSlug: 'passion-twists',
  name: 'Passion twists',
  startingPrice: 160,
  typicalHours: 4,
  preparation: 'Bring 4 packs of curly hair.',
  published: true,
};

describe('Braider services', () => {
  it('Given a braider with services, when they open Services, then their own services (not removed) and the styles they can offer are listed', async () => {
    const { nia, service } = await niaWithAccount();
    await createStyle(passionTwists);
    await createStyle({
      ...passionTwists,
      slug: 'draft-style',
      name: 'Draft style',
      published: false,
    });
    const removed = await createService(nia.id, { name: 'Old service' });
    await db().braiderService.update({
      where: { id: removed.id },
      data: { removedAt: new Date() },
    });
    const aisha = await createBraider({ slug: 'aisha-mensah', name: 'Aisha Mensah' });
    await createService(aisha.id, { name: 'Aisha’s braids' });

    const response = await (await signedIn(NIA, 'braider')).get('/api/braider/services');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      data: [
        {
          id: service.id,
          styleSlug: 'knotless-braids',
          styleName: 'Knotless braids',
          name: 'Medium knotless braids',
          startingPrice: 180,
          typicalHours: 5,
          preparation: null,
          published: true,
          version: 1,
        },
      ],
      styles: [
        { slug: 'knotless-braids', name: 'Knotless braids' },
        { slug: 'passion-twists', name: 'Passion twists' },
      ],
    });
  });

  it('Given valid details, when the braider adds a published service, then it can appear in matching and booking', async () => {
    await niaWithAccount();
    await createStyle(passionTwists);
    const api = await signedIn(NIA, 'braider');

    const response = await api.post<Service>('/api/braider/services', input);

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({ ...input, styleName: 'Passion twists', version: 1 });
    const matches = await new Api().get<{ data: { service: { id: string } }[] }>(
      '/api/styles/passion-twists/braiders',
    );
    expect(matches.body.data.map((m) => m.service.id)).toEqual([response.body.id]);
  });

  it('Given a negative price, nonpositive duration or unknown style, when the braider saves, then nothing invalid becomes public', async () => {
    await niaWithAccount();
    const api = await signedIn(NIA, 'braider');

    const response = await api.post('/api/braider/services', {
      ...input,
      styleSlug: 'no-such-style',
      name: ' ',
      startingPrice: -20,
      typicalHours: 0,
    });

    expect(response.status).toBe(422);
    expect(response.body).toMatchObject({
      errors: {
        styleSlug: ['Choose a style.'],
        name: ['Enter a service name.'],
        startingPrice: ['Enter a starting price of $0 or more.'],
        typicalHours: ['Enter a typical time longer than 0 hours.'],
      },
    });
    expect(await db().braiderService.count()).toBe(1);
  });

  it('Given an unpublish with the current version, when it is saved, then the service leaves matching while past appointments keep their details', async () => {
    const { service } = await niaWithAccount();
    const maya = await createCustomer();
    await createAppointment(maya.id, service, {
      number: 992,
      status: 'confirmed',
      start: new Date('2026-10-03T14:00:00Z'),
    });
    const api = await signedIn(NIA, 'braider');

    const response = await api.patch<Service>(`/api/braider/services/${service.id}`, {
      published: false,
      version: 1,
    });

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      published: false,
      version: 2,
      name: 'Medium knotless braids',
    });
    const matches = await new Api().get<{ data: unknown[] }>(
      '/api/styles/knotless-braids/braiders',
    );
    expect(matches.body.data).toEqual([]);
    const customer = await signedIn('maya.chen@example.com');
    expect((await customer.get('/api/appointments/HP-0992')).body).toMatchObject({
      service: 'Medium knotless braids',
    });
  });

  it('Given an edit based on an old version, when it is saved, then it is refused as stale and the newer values stay', async () => {
    const { service } = await niaWithAccount();
    const api = await signedIn(NIA, 'braider');
    await api.patch(`/api/braider/services/${service.id}`, {
      ...input,
      styleSlug: 'knotless-braids',
      startingPrice: 190,
      version: 1,
    });

    const stale = await api.patch(`/api/braider/services/${service.id}`, {
      startingPrice: 150,
      version: 1,
    });

    expect(stale.status).toBe(409);
    expect(stale.body).toMatchObject({ code: 'stale' });
    expect(
      (await db().braiderService.findUniqueOrThrow({ where: { id: service.id } })).startingPrice,
    ).toBe(190);
  });

  it('Given a service, when the braider removes it, then it disappears from their list and from booking, and history is kept', async () => {
    const { service } = await niaWithAccount();
    const maya = await createCustomer();
    await createAppointment(maya.id, service, {
      number: 992,
      status: 'confirmed',
      start: new Date('2026-10-03T14:00:00Z'),
    });
    const api = await signedIn(NIA, 'braider');

    const response = await api.delete(`/api/braider/services/${service.id}`);

    expect(response.status).toBe(204);
    expect((await api.get<{ data: unknown[] }>('/api/braider/services')).body.data).toEqual([]);
    expect(await db().appointment.count()).toBe(1);
    expect((await api.delete(`/api/braider/services/${service.id}`)).status).toBe(404);
  });

  it('Given another braider’s service, when a braider edits or removes it, then it is denied', async () => {
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
    const hers = await createService(aisha.id, { name: 'Aisha’s braids' });
    const api = await signedIn(NIA, 'braider');

    expect(
      (await api.patch(`/api/braider/services/${hers.id}`, { published: false, version: 1 }))
        .status,
    ).toBe(403);
    expect((await api.delete(`/api/braider/services/${hers.id}`)).status).toBe(403);
    expect(
      (await db().braiderService.findUniqueOrThrow({ where: { id: hers.id } })).published,
    ).toBe(true);
  });

  it('Given a customer session, when braider services are opened, then they are refused', async () => {
    await niaWithAccount();
    await createCustomer();

    expect(
      (await (await signedIn('maya.chen@example.com')).get('/api/braider/services')).status,
    ).toBe(403);
    expect((await new Api().get('/api/braider/services')).status).toBe(401);
  });
});
