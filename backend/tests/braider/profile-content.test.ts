// Acceptance Test
// Traces to: L2-007, L2-027, L2-038, L2-039, L2-046, L2-047
import { describe, expect, it } from 'vitest';
import { Api } from '../support/api';
import { signedIn } from '../support/auth';
import { NIA, niaWithAccount } from '../support/braider';
import { db } from '../support/db';
import { API_URL } from '../support/env';
import { createBraider, createBraiderUser, createCustomer } from '../support/factories';

const PNG = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
  'base64',
);
const GIF = Buffer.from('R0lGODlhAQABAAAAACw=', 'base64');

const profileInput = {
  bio: 'I specialize in comfortable, neat braids.',
  area: 'Toronto West · travels up to 10 km',
  studioAddress: '1246 Bloor Street West, Toronto',
  preparation: 'Arrive with washed, detangled hair. Bring the extensions we discussed.',
  changePolicy: 'Request a change at least 48 hours before.',
  cancellationPolicy: 'Free up to 72 hours before.',
};

function photoForm(
  file: Buffer,
  type: string,
  name: string,
  caption = 'Medium knotless braids · Oct 2026',
) {
  const form = new FormData();
  form.set('photo', new Blob([file], { type }), name);
  form.set('caption', caption);
  form.set('styleSlug', 'knotless-braids');
  return form;
}

interface Profile {
  version: number;
  portfolio: {
    id: string;
    image: { src: string; alt: string } | null;
    caption: string;
    styleSlug: string | null;
  }[];
}

describe('Braider profile content', () => {
  it('Given a braider, when they open their profile content, then their editable fields, portfolio and styles are returned', async () => {
    const { nia } = await niaWithAccount();
    const item = await db().portfolioItem.create({
      data: {
        braiderId: nia.id,
        caption: 'Passion twists · Sep 2026',
        imageSrc: null,
        imageAlt: null,
      },
    });

    const response = await (await signedIn(NIA, 'braider')).get('/api/braider/profile');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      bio: 'I specialize in comfortable, neat braids. Bring inspiration photos and we’ll confirm the details together.',
      area: 'Toronto West',
      studioAddress: '214 Ossington Ave, Toronto',
      preparation: 'Arrive with washed, detangled hair.',
      changePolicy: 'Request a change at least 48 hours before.',
      cancellationPolicy: 'Free up to 48 hours before; later cancellations may be charged $40.',
      version: 1,
      portfolio: [
        { id: item.id, image: null, caption: 'Passion twists · Sep 2026', styleSlug: null },
      ],
      styles: [{ slug: 'knotless-braids', name: 'Knotless braids' }],
    });
  });

  it('Given valid updates, when the braider saves, then the public profile reflects them and the address stays private', async () => {
    await niaWithAccount();
    const api = await signedIn(NIA, 'braider');

    const response = await api.patch<Profile>('/api/braider/profile', {
      ...profileInput,
      version: 1,
    });

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({ ...profileInput, version: 2 });
    const profile = await new Api().get('/api/braiders/nia-okafor');
    expect(profile.body).toMatchObject({
      area: 'Toronto West · travels up to 10 km',
      policies: { cancellation: 'Free up to 72 hours before.' },
    });
    expect(JSON.stringify(profile.body)).not.toContain('1246 Bloor');
  });

  it('Given a changed policy, when a new customer opens booking, then the current policy is shown', async () => {
    await niaWithAccount();
    await createCustomer();
    await (
      await signedIn(NIA, 'braider')
    ).patch('/api/braider/profile', { ...profileInput, version: 1 });

    const options = await (
      await signedIn('maya.chen@example.com')
    ).get('/api/braiders/nia-okafor/booking-options');

    expect(options.body).toMatchObject({ policy: { cancellation: 'Free up to 72 hours before.' } });
  });

  it('Given a profile changed in another window, when an older version is saved, then it is refused and the newer values stay', async () => {
    await niaWithAccount();
    const api = await signedIn(NIA, 'braider');
    await api.patch('/api/braider/profile', { ...profileInput, version: 1 });

    const stale = await api.patch('/api/braider/profile', {
      ...profileInput,
      area: 'Etobicoke',
      version: 1,
    });

    expect(stale.status).toBe(409);
    expect(stale.body).toMatchObject({ code: 'stale' });
    expect((await api.get('/api/braider/profile')).body).toMatchObject({ area: profileInput.area });
  });

  it('Given a blank area, when the braider saves, then the area is named and nothing changes', async () => {
    await niaWithAccount();
    const api = await signedIn(NIA, 'braider');

    const response = await api.patch('/api/braider/profile', {
      ...profileInput,
      area: ' ',
      version: 1,
    });

    expect(response.status).toBe(422);
    expect(response.body).toMatchObject({
      errors: { area: ['Enter the area you serve, like Toronto West.'] },
    });
    expect((await api.get<Profile>('/api/braider/profile')).body.version).toBe(1);
  });

  it('Given a PNG photo, when the braider adds it, then it appears newest first on the public profile and its image is served', async () => {
    await niaWithAccount();
    const api = await signedIn(NIA, 'braider');

    const response = await api.postForm<Profile['portfolio'][number]>(
      '/api/braider/portfolio',
      photoForm(PNG, 'image/png', 'braids.png'),
    );

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({
      caption: 'Medium knotless braids · Oct 2026',
      styleSlug: 'knotless-braids',
      image: {
        src: expect.stringMatching(/^\/api\/media\/\w+$/),
        alt: 'Medium knotless braids · Oct 2026',
      },
    });
    const profile = await new Api().get<{ portfolio: { id: string }[] }>(
      '/api/braiders/nia-okafor',
    );
    expect(profile.body.portfolio.map((item) => item.id)).toEqual([response.body.id]);
    const image = await fetch(`${API_URL}${response.body.image?.src}`);
    expect(image.status).toBe(200);
    expect(image.headers.get('content-type')).toBe('image/png');
    expect(image.headers.get('x-content-type-options')).toBe('nosniff');
    expect(Buffer.from(await image.arrayBuffer()).equals(PNG)).toBe(true);
  });

  it('Given a GIF, a file mislabelled as PNG or one over 5 MB, when the braider adds it, then it is rejected without publishing', async () => {
    await niaWithAccount();
    const api = await signedIn(NIA, 'braider');
    const big = Buffer.concat([PNG, Buffer.alloc(5 * 1024 * 1024)]);

    for (const form of [
      photoForm(GIF, 'image/gif', 'nia-braids.gif'),
      photoForm(GIF, 'image/png', 'pretend.png'),
      photoForm(big, 'image/png', 'huge.png'),
    ]) {
      const response = await api.postForm('/api/braider/portfolio', form);
      expect(response.status).toBe(422);
      expect(response.body).toMatchObject({
        errors: { photo: ['Upload a JPG, PNG or WebP image up to 5 MB.'] },
      });
    }
    expect(await db().portfolioItem.count()).toBe(0);
    expect(await db().mediaFile.count()).toBe(0);
  });

  it('Given a missing caption, when the braider adds a photo, then the caption is named', async () => {
    await niaWithAccount();

    const response = await (
      await signedIn(NIA, 'braider')
    ).postForm('/api/braider/portfolio', photoForm(PNG, 'image/png', 'braids.png', ' '));

    expect(response.status).toBe(422);
    expect(response.body).toMatchObject({ errors: { caption: expect.any(Array) } });
  });

  it('Given a portfolio photo, when its braider removes it, then it leaves the profile; another braider is denied', async () => {
    await niaWithAccount();
    const api = await signedIn(NIA, 'braider');
    const added = await api.postForm<{ id: string; image: { src: string } }>(
      '/api/braider/portfolio',
      photoForm(PNG, 'image/png', 'braids.png'),
    );
    const aishaUser = await createBraiderUser({
      email: 'aisha.mensah@example.com',
      name: 'Aisha Mensah',
    });
    await createBraider({ slug: 'aisha-mensah', name: 'Aisha Mensah', userId: aishaUser.id });
    const aisha = await signedIn('aisha.mensah@example.com', 'braider');

    expect((await aisha.delete(`/api/braider/portfolio/${added.body.id}`)).status).toBe(403);
    expect((await api.delete(`/api/braider/portfolio/${added.body.id}`)).status).toBe(204);
    expect(await db().portfolioItem.count()).toBe(0);
    expect((await new Api().get(added.body.image.src)).status).toBe(404);
  });

  it('Given a customer session, when profile content is opened, then it is refused', async () => {
    await niaWithAccount();
    await createCustomer();

    expect(
      (await (await signedIn('maya.chen@example.com')).get('/api/braider/profile')).status,
    ).toBe(403);
  });
});
