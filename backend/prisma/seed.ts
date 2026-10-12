/**
 * Development seed: the cast and catalog from docs/mocks/README.md. Every write is an upsert on a
 * fixed key, so running `prisma db seed` again changes nothing. Passwords are hashed only when an
 * account is first created.
 */
import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../src/infrastructure/password';

const prisma = new PrismaClient();
const MEDIA = 'https://media.hairpop.example';
const PASSWORD = process.env.SEED_PASSWORD ?? 'hairpop-dev-password';

async function user(id: string, name: string, email: string, role: 'customer' | 'braider') {
  return prisma.user.upsert({
    where: { email },
    update: { name, role },
    create: {
      id,
      name,
      email,
      role,
      emailVerifiedAt: new Date('2026-09-01T12:00:00Z'),
      passwordHash: await hashPassword(PASSWORD),
    },
  });
}

async function styles() {
  const rows = [
    {
      slug: 'knotless-braids',
      name: 'Knotless braids',
      category: 'braids' as const,
      eyebrow: 'Most explored',
      imageSrc: `${MEDIA}/styles/knotless-braids.png`,
      imageAlt: 'Medium knotless braids shown from the back and side',
      typicalHoursMin: 4,
      typicalHoursMax: 7,
      typicalPriceMin: 160,
      typicalPriceMax: 300,
      intro:
        'Knotless braids start with your natural hair, then extensions are fed in gradually. The finish is flexible and usually feels lighter at the roots.',
      typicalWearMin: 4,
      typicalWearMax: 8,
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
      sortOrder: 0,
    },
    {
      slug: 'passion-twists',
      name: 'Passion twists',
      category: 'twists' as const,
      eyebrow: 'Twists',
      typicalHoursMin: 3,
      typicalHoursMax: 6,
      typicalPriceMin: 140,
      typicalPriceMax: 260,
      intro:
        'Passion twists are two-strand twists with soft, curly extensions for a bohemian finish.',
      sortOrder: 1,
    },
    {
      slug: 'cornrows',
      name: 'Cornrows',
      category: 'braids' as const,
      eyebrow: 'Classic',
      typicalHoursMin: 2,
      typicalHoursMax: 4,
      intro: 'Cornrows are braided flat to the scalp in straight or curved rows.',
      sortOrder: 2,
    },
    {
      slug: 'starter-locs',
      name: 'Starter locs',
      category: 'locs' as const,
      eyebrow: 'Locs',
      typicalHoursMin: 3,
      typicalHoursMax: 5,
      typicalPriceMin: 150,
      typicalPriceMax: 250,
      intro: 'Starter locs begin your loc journey with comb coils or two-strand twists.',
      sortOrder: 3,
    },
  ];
  for (const { slug, ...data } of rows) {
    await prisma.style.upsert({
      where: { slug },
      update: { ...data, published: true },
      create: { slug, ...data, published: true },
    });
  }
}

async function content() {
  const pages = [
    {
      slug: 'help',
      title: 'How can we help?',
      effectiveDate: null,
      supportEmail: 'support@hairpop.example',
      sections: [
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
        {
          id: 'changes',
          heading: 'Changing an appointment',
          paragraphs: ['Request a new offered time; your current time stays until accepted.'],
        },
        {
          id: 'reviews',
          heading: 'Reviews',
          paragraphs: ['Review a completed visit once. Report a review that breaks the rules.'],
        },
      ],
    },
    {
      slug: 'terms',
      title: 'Terms of use',
      effectiveDate: new Date('2026-10-01T00:00:00Z'),
      supportEmail: null,
      sections: [
        {
          id: 'using',
          heading: 'Using HairPop',
          paragraphs: [
            'HairPop helps customers discover independent braiders and send appointment requests. A request is pending until the braider accepts it.',
          ],
        },
        {
          id: 'prices',
          heading: 'Prices and appointments',
          paragraphs: [
            'Prices shown before acceptance are estimates. The braider confirms the time, place and final price when they accept.',
          ],
        },
        {
          id: 'reviews',
          heading: 'Reviews',
          paragraphs: [
            'Reviews describe real, completed visits. We may remove reviews that break these terms after moderation.',
          ],
        },
      ],
    },
    {
      slug: 'privacy',
      title: 'Privacy at HairPop',
      effectiveDate: new Date('2026-10-01T00:00:00Z'),
      supportEmail: 'support@hairpop.example',
      sections: [
        {
          id: 'information',
          heading: 'Your information',
          paragraphs: [
            'We use your name, email and phone to manage requests and let your braider reach you. Hair details are shared only with the braider you request.',
          ],
        },
        {
          id: 'cookies',
          heading: 'Cookies and storage',
          paragraphs: [
            'Essential storage keeps you signed in. Optional usage data is stored only if you allow it, and you can change that choice in Cookie preferences.',
          ],
        },
        {
          id: 'choices',
          heading: 'Your choices',
          paragraphs: [
            'Update your contact details in Account settings. Contact support@hairpop.example for help with your information.',
          ],
        },
      ],
    },
  ];
  for (const { slug, ...data } of pages) {
    await prisma.contentPage.upsert({
      where: { slug },
      update: { ...data, published: true },
      create: { slug, ...data, published: true },
    });
  }
}

async function braiders() {
  const niaUser = await user('user-nia', 'Nia Okafor', 'nia.okafor@example.com', 'braider');
  const braiderRows = [
    {
      id: 'braider-nia',
      slug: 'nia-okafor',
      userId: niaUser.id,
      name: 'Nia Okafor',
      photoSrc: `${MEDIA}/braiders/nia.jpg`,
      photoAlt: 'Nia Okafor smiling in her studio',
      area: 'Toronto West',
      distanceKm: 8,
      travelKm: 10,
      bio: 'I specialize in comfortable, neat braids. Bring inspiration photos and we’ll confirm the details together.',
      studioAddress: '214 Ossington Ave, Toronto',
      preparationPolicy: 'Arrive with washed, detangled hair.',
      changePolicy: 'Request a change at least 48 hours before.',
      cancellationPolicy: 'Free up to 48 hours before; later cancellations may be charged $40.',
    },
    {
      id: 'braider-aisha',
      slug: 'aisha-mensah',
      name: 'Aisha Mensah',
      area: 'North York',
      distanceKm: 18,
      bio: 'Long-lasting knotless braids with a light touch at the roots.',
    },
    {
      id: 'braider-jules',
      slug: 'jules-baptiste',
      name: 'Jules Baptiste',
      area: 'Scarborough',
      distanceKm: 24,
      bio: 'New to HairPop, with ten years of braiding behind the chair.',
    },
    {
      id: 'braider-amara',
      slug: 'amara-adeyemi-williams',
      name: 'Amara Nkiruka Adeyemi-Williams',
      area: 'Etobicoke, North York and Scarborough',
      distanceKm: 25,
      bio: 'Mobile braider covering the west, north and east of the city.',
    },
  ];
  for (const { id, ...data } of braiderRows) {
    await prisma.braider.upsert({
      where: { id },
      update: { ...data, published: true },
      create: { id, ...data, published: true },
    });
  }

  const services = [
    ['svc-nia-knotless-m', 'braider-nia', 'knotless-braids', 'Medium knotless braids', 180, 5],
    ['svc-nia-passion', 'braider-nia', 'passion-twists', 'Passion twists', 160, 4],
    ['svc-aisha-knotless', 'braider-aisha', 'knotless-braids', 'Knotless braids', 195, 6],
    ['svc-jules-knotless', 'braider-jules', 'knotless-braids', 'Knotless braids', 170, 5],
    ['svc-amara-knotless', 'braider-amara', 'knotless-braids', 'Knotless braids', 210, 6],
  ] as const;
  for (const [id, braiderId, styleSlug, name, startingPrice, typicalHours] of services) {
    const data = { braiderId, styleSlug, name, startingPrice, typicalHours, published: true };
    await prisma.braiderService.upsert({ where: { id }, update: data, create: { id, ...data } });
  }

  const portfolio = [
    [
      'work-1',
      `${MEDIA}/styles/knotless-braids.png`,
      'Medium knotless braids shown from the back, with neat square parts',
      'Medium knotless braids · Oct 2026',
      '2026-10-02T12:00:00Z',
    ],
    [
      'work-2',
      `${MEDIA}/braiders/nia.jpg`,
      'Nia Okafor smiling in her studio',
      'Nia at the studio · Sep 2026',
      '2026-09-20T12:00:00Z',
    ],
    ['work-3', null, null, 'Passion twists · Sep 2026', '2026-09-10T12:00:00Z'],
  ] as const;
  for (const [id, imageSrc, imageAlt, caption, createdAt] of portfolio) {
    const data = {
      braiderId: 'braider-nia',
      imageSrc,
      imageAlt,
      caption,
      createdAt: new Date(createdAt),
    };
    await prisma.portfolioItem.upsert({ where: { id }, update: data, create: { id, ...data } });
  }

  const slots = [
    ['slot-nia-1024', 'braider-nia', '2026-10-24T14:00:00Z', 6],
    ['slot-nia-1031', 'braider-nia', '2026-10-31T14:00:00Z', 6],
    ['slot-jules-1025', 'braider-jules', '2026-10-25T15:00:00Z', 6],
  ] as const;
  for (const [id, braiderId, start, maxHours] of slots) {
    const data = { braiderId, start: new Date(start), maxHours };
    await prisma.offeredSlot.upsert({ where: { id }, update: data, create: { id, ...data } });
  }
}

async function reviews() {
  const maya = await user('cust-maya', 'Maya Chen', 'maya.chen@example.com', 'customer');
  const kemi = await user('cust-kemi', 'Kemi Adebayo', 'kemi.adebayo@example.com', 'customer');
  const zara = await user('cust-zara', 'Zara Ali', 'zara.ali@example.com', 'customer');
  const rows = [
    [
      'review-1',
      'braider-nia',
      'svc-nia-knotless-m',
      maya.id,
      5,
      'The parts were so neat and Nia checked that nothing felt too tight.',
      '2026-10-03T20:00:00Z',
    ],
    [
      'review-2',
      'braider-nia',
      'svc-nia-passion',
      kemi.id,
      5,
      'Quick, gentle and my braids lasted seven weeks.',
      '2026-09-26T20:00:00Z',
    ],
    [
      'review-3',
      'braider-aisha',
      'svc-aisha-knotless',
      zara.id,
      5,
      'Light at the roots and lasted well past six weeks.',
      '2026-09-12T20:00:00Z',
    ],
  ] as const;
  for (const [id, braiderId, serviceId, authorId, rating, text, createdAt] of rows) {
    const data = {
      braiderId,
      serviceId,
      authorId,
      rating,
      text,
      status: 'published' as const,
      createdAt: new Date(createdAt),
    };
    await prisma.review.upsert({ where: { id }, update: data, create: { id, ...data } });
  }
}

async function main() {
  await styles();
  await content();
  await braiders();
  await reviews();
}

main()
  .then(() => console.log('Seeded the HairPop cast.'))
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
