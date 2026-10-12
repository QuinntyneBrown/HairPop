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

async function user(
  id: string,
  name: string,
  email: string,
  role: 'customer' | 'braider',
  phone: string | null = null,
) {
  return prisma.user.upsert({
    where: { email },
    update: { name, role, phone },
    create: {
      id,
      name,
      email,
      role,
      phone,
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
      studioAddress: '1246 Bloor Street West, Toronto',
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
    [
      'svc-nia-knotless-m',
      'braider-nia',
      'knotless-braids',
      'Medium knotless braids',
      180,
      5,
      true,
    ],
    ['svc-nia-passion', 'braider-nia', 'passion-twists', 'Passion twists', 160, 4, true],
    ['svc-nia-boho', 'braider-nia', 'knotless-braids', 'Boho knotless braids', 220, 6, false],
    ['svc-aisha-knotless', 'braider-aisha', 'knotless-braids', 'Knotless braids', 195, 6, true],
    ['svc-jules-knotless', 'braider-jules', 'knotless-braids', 'Knotless braids', 170, 5, true],
    ['svc-amara-knotless', 'braider-amara', 'knotless-braids', 'Knotless braids', 210, 6, true],
  ] as const;
  for (const [id, braiderId, styleSlug, name, startingPrice, typicalHours, published] of services) {
    const data = { braiderId, styleSlug, name, startingPrice, typicalHours, published };
    await prisma.braiderService.upsert({ where: { id }, update: data, create: { id, ...data } });
  }
  const knotlessCare = {
    preparation: 'Bring 6 packs of pre-stretched extensions in your colour.',
    careGuidance: [
      'Keep your scalp moisturized with a light oil twice a week.',
      'Sleep with a satin bonnet or pillowcase.',
      'Book a take-down within 8 weeks.',
    ],
  };
  await prisma.braiderService.update({ where: { id: 'svc-nia-knotless-m' }, data: knotlessCare });

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

  // Toronto times: 10:00 am on 24 and 31 Oct, 11:00 am and 1:00 pm on 25 Oct, 9:00 am on 16
  // and 17 Oct.
  const slots = [
    ['slot-nia-1016', 'braider-nia', '2026-10-16T13:00:00Z', 6],
    ['slot-nia-1017', 'braider-nia', '2026-10-17T13:00:00Z', 6],
    ['slot-nia-1024', 'braider-nia', '2026-10-24T14:00:00Z', 6],
    ['slot-nia-1025-am', 'braider-nia', '2026-10-25T15:00:00Z', 2],
    ['slot-nia-1025-pm', 'braider-nia', '2026-10-25T17:00:00Z', 4],
    ['slot-nia-1031', 'braider-nia', '2026-10-31T14:00:00Z', 6],
    ['slot-jules-1016', 'braider-jules', '2026-10-16T13:00:00Z', 6],
    ['slot-jules-1025', 'braider-jules', '2026-10-25T15:00:00Z', 6],
  ] as const;
  for (const [id, braiderId, start, maxHours] of slots) {
    const data = { braiderId, start: new Date(start), maxHours };
    await prisma.offeredSlot.upsert({ where: { id }, update: data, create: { id, ...data } });
  }
}

async function reviews() {
  const maya = await user(
    'cust-maya',
    'Maya Chen',
    'maya.chen@example.com',
    'customer',
    '416-555-0148',
  );
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

const NIA_POLICIES = {
  changePolicy: 'Request a change at least 48 hours before.',
  cancellationPolicy: 'Free up to 48 hours before; later cancellations may be charged $40.',
};

async function appointments() {
  const rows = [
    {
      id: 'appt-1048',
      number: 1048,
      customerId: 'cust-maya',
      braiderId: 'braider-nia',
      serviceId: 'svc-nia-knotless-m',
      slotId: 'slot-nia-1024',
      heldSlotId: 'slot-nia-1024',
      serviceName: 'Medium knotless braids',
      start: new Date('2026-10-24T14:00:00Z'),
      durationHours: 5,
      estimateMin: 180,
      estimateMax: 240,
      agreedAmount: null,
      email: 'maya.chen@example.com',
      phone: '416-555-0148',
      hairDetails: 'Shoulder length; bringing my own extensions',
      status: 'awaiting_reply' as const,
      createdAt: new Date('2026-10-10T13:42:00Z'),
    },
    {
      id: 'appt-0992',
      number: 992,
      customerId: 'cust-maya',
      braiderId: 'braider-nia',
      serviceId: 'svc-nia-knotless-m',
      slotId: null,
      heldSlotId: null,
      serviceName: 'Medium knotless braids',
      start: new Date('2026-10-03T14:00:00Z'),
      durationHours: 5,
      estimateMin: 180,
      estimateMax: 240,
      agreedAmount: 205,
      email: 'maya.chen@example.com',
      phone: '416-555-0148',
      hairDetails: 'Shoulder length; bringing my own extensions',
      status: 'confirmed' as const,
      createdAt: new Date('2026-09-20T15:00:00Z'),
    },
    {
      id: 'appt-1040',
      number: 1040,
      customerId: 'cust-maya',
      braiderId: 'braider-jules',
      serviceId: 'svc-jules-knotless',
      slotId: 'slot-jules-1016',
      heldSlotId: null,
      serviceName: 'Extra-long boho knotless braids with curly ends',
      start: new Date('2026-10-16T13:00:00Z'),
      durationHours: 5,
      estimateMin: 170,
      estimateMax: null,
      agreedAmount: null,
      email: 'maya.chen@example.com',
      phone: '416-555-0148',
      hairDetails: 'Waist length; extensions included',
      status: 'declined' as const,
      createdAt: new Date('2026-10-05T15:00:00Z'),
    },
    {
      id: 'appt-1052',
      number: 1052,
      customerId: 'cust-kemi',
      braiderId: 'braider-nia',
      serviceId: 'svc-nia-passion',
      slotId: 'slot-nia-1025-pm',
      heldSlotId: 'slot-nia-1025-pm',
      serviceName: 'Passion twists',
      start: new Date('2026-10-25T17:00:00Z'),
      durationHours: 4,
      estimateMin: 160,
      estimateMax: 220,
      agreedAmount: null,
      email: 'kemi.adebayo@example.com',
      phone: null,
      hairDetails: 'Mid-back length; no extensions',
      status: 'awaiting_reply' as const,
      createdAt: new Date('2026-10-10T16:00:00Z'),
    },
    {
      id: 'appt-1031',
      number: 1031,
      customerId: 'cust-zara',
      braiderId: 'braider-nia',
      serviceId: 'svc-nia-knotless-m',
      slotId: 'slot-nia-1016',
      heldSlotId: 'slot-nia-1016',
      serviceName: 'Medium knotless braids',
      start: new Date('2026-10-16T13:00:00Z'),
      durationHours: 5,
      estimateMin: 180,
      estimateMax: 240,
      agreedAmount: 210,
      email: 'zara.ali@example.com',
      phone: null,
      hairDetails: 'Wants a change of day',
      status: 'confirmed' as const,
      createdAt: new Date('2026-10-01T15:00:00Z'),
    },
  ];
  for (const { id, ...row } of rows) {
    const data = {
      ...row,
      ...NIA_POLICIES,
      policyVersion: 'seed',
      idempotencyKey: `seed-${id}`,
      version: 2,
    };
    await prisma.appointment.upsert({ where: { id }, update: data, create: { id, ...data } });
  }
  // Explicit references must not collide with the next generated one.
  await prisma.$executeRaw`SELECT setval('"Appointment_number_seq"', GREATEST((SELECT max("number") FROM "Appointment"), 1000))`;

  const change = {
    appointmentId: 'appt-1031',
    slotId: 'slot-nia-1017',
    heldSlotId: 'slot-nia-1017',
    start: new Date('2026-10-17T13:00:00Z'),
    note: 'Friday no longer works for me.',
    status: 'pending' as const,
  };
  await prisma.appointmentChange.upsert({
    where: { id: 'change-1031' },
    update: change,
    create: { id: 'change-1031', ...change },
  });
  // Maya's review of her 3 Oct visit belongs to that appointment.
  await prisma.review.update({ where: { id: 'review-1' }, data: { appointmentId: 'appt-0992' } });
}

async function notifications() {
  const rows = [
    {
      id: 'note-maya-1',
      title: 'Your email is verified',
      body: 'maya.chen@example.com is confirmed for appointment updates.',
      link: '/settings',
      createdAt: new Date('2026-10-08T14:00:00Z'),
      readAt: new Date('2026-10-08T14:05:00Z'),
    },
    {
      id: 'note-maya-2',
      title: 'Review your visit with Nia',
      body: 'Share how your knotless braids turned out.',
      link: '/appointments/HP-0992/care',
      createdAt: new Date('2026-10-09T22:10:00Z'),
      readAt: null,
    },
    {
      id: 'note-maya-3',
      title: 'Nia received your request',
      body: 'HP-1048 · Nia will confirm the time and final price.',
      link: '/appointments/HP-1048',
      createdAt: new Date('2026-10-10T13:42:00Z'),
      readAt: null,
    },
  ];
  for (const { id, ...row } of rows) {
    const data = { ...row, userId: 'cust-maya' };
    await prisma.customerNotification.upsert({
      where: { id },
      update: data,
      create: { id, ...data },
    });
  }
}

async function main() {
  await styles();
  await content();
  await braiders();
  await reviews();
  await appointments();
  await notifications();
}

main()
  .then(() => console.log('Seeded the HairPop cast.'))
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
