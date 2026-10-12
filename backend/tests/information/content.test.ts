import { describe, expect, it } from 'vitest';
import { Api } from '../support/api';
import { db } from '../support/db';

const helpSections = [
  {
    id: 'requests',
    heading: 'How requests work',
    paragraphs: ['A request becomes an appointment only when the braider accepts it.'],
  },
  {
    id: 'estimates',
    heading: 'Prices and estimates',
    paragraphs: ['Typical ranges guide you; your braider confirms the final price.'],
  },
];

const termsSections = [
  {
    id: 'using',
    heading: 'Using HairPop',
    paragraphs: [
      'HairPop helps customers discover independent braiders and send appointment requests. A request is pending until the braider accepts it.',
    ],
  },
];

describe('GET /api/content/{slug}', () => {
  it('Given published help content, when a visitor opens Help, then the sections and support email are returned', async () => {
    await db().contentPage.create({
      data: {
        slug: 'help',
        title: 'How can we help?',
        sections: helpSections,
        supportEmail: 'support@hairpop.example',
        published: true,
      },
    });

    const response = await new Api().get('/api/content/help');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      slug: 'help',
      title: 'How can we help?',
      effectiveDate: null,
      sections: helpSections,
      supportEmail: 'support@hairpop.example',
    });
  });

  it('Given published terms, when a visitor opens Terms, then the effective date is a calendar date', async () => {
    await db().contentPage.create({
      data: {
        slug: 'terms',
        title: 'Terms of use',
        effectiveDate: new Date('2026-10-01T00:00:00Z'),
        sections: termsSections,
        published: true,
      },
    });

    const response = await new Api().get('/api/content/terms');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      slug: 'terms',
      title: 'Terms of use',
      effectiveDate: '2026-10-01',
      sections: termsSections,
      supportEmail: null,
    });
  });

  it('Given privacy content that is not published, when a visitor opens Privacy, then the API answers 404', async () => {
    await db().contentPage.create({
      data: { slug: 'privacy', title: 'Privacy', sections: [], published: false },
    });

    const response = await new Api().get('/api/content/privacy');

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ message: 'Not found.' });
  });

  it('Given a slug that is not help, terms or privacy, when it is requested, then the API answers 404', async () => {
    const response = await new Api().get('/api/content/careers');

    expect(response.status).toBe(404);
  });
});
