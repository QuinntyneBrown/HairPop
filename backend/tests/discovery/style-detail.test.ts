import { describe, expect, it } from 'vitest';
import { Api } from '../support/api';
import { cornrows, createStyle } from '../support/factories';

describe('GET /api/styles/{slug}', () => {
  it('Given a published style, when a visitor opens it, then its editorial facts are returned', async () => {
    await createStyle();

    const response = await new Api().get('/api/styles/knotless-braids');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      slug: 'knotless-braids',
      name: 'Knotless braids',
      category: 'braids',
      eyebrow: 'Most explored',
      image: {
        src: 'https://media.hairpop.example/styles/knotless-braids.png',
        alt: 'Medium knotless braids shown from the back and side',
      },
      typicalHours: { min: 4, max: 7 },
      typicalPrice: { min: 160, max: 300 },
      intro:
        'Knotless braids start with your natural hair, then extensions are fed in gradually. The finish is flexible and usually feels lighter at the roots.',
      typicalWear: { min: 4, max: 8 },
      variations: [
        { name: 'Small', description: 'Finer braids, about 6–7 hours' },
        { name: 'Medium', description: 'The most requested size, about 5 hours' },
        { name: 'Large', description: 'Quicker install, about 4 hours' },
      ],
      quoteFactors: [
        'Length and braid size',
        'Hair density and current length',
        'Whether you bring extensions',
        'Add-ons such as curly ends or colour',
      ],
      unavailable: [],
    });
  });

  it('Given a style without optional facts, when it is opened, then those facts are empty rather than missing', async () => {
    await createStyle({
      ...cornrows,
      intro: 'Cornrows are braided flat to the scalp.',
      typicalWearMin: null,
      typicalWearMax: null,
      variations: [],
      quoteFactors: [],
    });

    const response = await new Api().get('/api/styles/cornrows');

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      typicalPrice: null,
      typicalWear: null,
      variations: [],
      quoteFactors: [],
      unavailable: [],
    });
  });

  it('Given an unpublished style, when its slug is opened, then the API answers 404', async () => {
    await createStyle({ published: false });

    const response = await new Api().get('/api/styles/knotless-braids');

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ message: 'Not found.' });
  });

  it('Given an unknown slug, when it is opened, then the API answers 404', async () => {
    const response = await new Api().get('/api/styles/goddess-locs');

    expect(response.status).toBe(404);
  });
});
