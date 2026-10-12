import { describe, expect, it } from 'vitest';
import { Api } from '../support/api';
import { cornrows, createStyle, passionTwists, starterLocs } from '../support/factories';

interface StylePage {
  data: { slug: string }[];
  meta: { page: number; perPage: number; total: number; lastPage: number };
}

const slugs = (body: unknown) => (body as StylePage).data.map((style) => style.slug);

async function castStyles() {
  await createStyle();
  await createStyle(passionTwists);
  await createStyle(cornrows);
  await createStyle(starterLocs);
}

describe('GET /api/styles', () => {
  it('Given published styles, when a visitor opens the gallery, then each style is summarised in gallery order', async () => {
    await castStyles();

    const response = await new Api().get('/api/styles');

    expect(response.status).toBe(200);
    expect(slugs(response.body)).toEqual([
      'knotless-braids',
      'passion-twists',
      'cornrows',
      'starter-locs',
    ]);
    const body = response.body as StylePage;
    expect(body.data[0]).toEqual({
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
    });
    expect(body.data[2]).toMatchObject({ slug: 'cornrows', image: null, typicalPrice: null });
    expect(body.meta).toEqual({ page: 1, perPage: 12, total: 4, lastPage: 1 });
  });

  it('Given an unpublished style, when the gallery is listed, then it is left out', async () => {
    await createStyle();
    await createStyle({ ...passionTwists, published: false });

    const response = await new Api().get('/api/styles');

    expect(slugs(response.body)).toEqual(['knotless-braids']);
  });

  it('Given a category, when the gallery is filtered, then only styles in that category are listed', async () => {
    await castStyles();

    const response = await new Api().get('/api/styles?category=braids');

    expect(slugs(response.body)).toEqual(['knotless-braids', 'cornrows']);
  });

  it('Given a search term in any case, when the gallery is searched, then styles whose name contains it are listed', async () => {
    await castStyles();

    const response = await new Api().get('/api/styles?search=TWIST');

    expect(slugs(response.body)).toEqual(['passion-twists']);
  });

  it('Given a search and a category together, when nothing matches both, then the page is empty', async () => {
    await castStyles();

    const response = await new Api().get('/api/styles?search=locs&category=braids');

    expect(response.body).toEqual({
      data: [],
      meta: { page: 1, perPage: 12, total: 0, lastPage: 1 },
    });
  });

  it('Given more styles than fit on a page, when the next page is requested, then it holds the rest', async () => {
    for (let i = 1; i <= 13; i++) {
      await createStyle({ slug: `style-${i}`, name: `Style ${i}`, sortOrder: i });
    }

    const response = await new Api().get('/api/styles?page=2');

    expect(slugs(response.body)).toEqual(['style-13']);
    expect((response.body as StylePage).meta).toEqual({
      page: 2,
      perPage: 12,
      total: 13,
      lastPage: 2,
    });
  });

  it('Given an invalid query, when the gallery is listed, then the API answers 422 naming each field', async () => {
    const response = await new Api().get(
      `/api/styles?search=${'a'.repeat(81)}&category=weaves&page=0`,
    );

    expect(response.status).toBe(422);
    expect(response.body).toMatchObject({
      message: 'The given data was invalid.',
      errors: {
        search: expect.any(Array),
        category: expect.any(Array),
        page: expect.any(Array),
      },
    });
  });
});
