import { hashPassword } from '../../src/infrastructure/password';
import { db } from './db';

export const PASSWORD = 'correct horse battery';

/** Maya Chen, the customer cast in docs/mocks/README.md. */
export async function createCustomer(
  overrides: { email?: string; name?: string; verified?: boolean; phone?: string | null } = {},
) {
  return db().user.create({
    data: {
      name: overrides.name ?? 'Maya Chen',
      email: overrides.email ?? 'maya.chen@example.com',
      emailVerifiedAt: overrides.verified === false ? null : new Date('2026-10-01T12:00:00Z'),
      phone: overrides.phone === undefined ? '416-555-0148' : overrides.phone,
      passwordHash: await hashPassword(PASSWORD),
      role: 'customer',
    },
  });
}

/** Nia Okafor, the braider cast in docs/mocks/README.md. */
export async function createBraiderUser(overrides: { email?: string; name?: string } = {}) {
  return db().user.create({
    data: {
      name: overrides.name ?? 'Nia Okafor',
      email: overrides.email ?? 'nia.okafor@example.com',
      emailVerifiedAt: new Date('2026-10-01T12:00:00Z'),
      passwordHash: await hashPassword(PASSWORD),
      role: 'braider',
    },
  });
}

type StyleData = Parameters<ReturnType<typeof db>['style']['create']>[0]['data'];

/** Knotless braids from the cast, published; override any field. */
export function createStyle(overrides: Partial<StyleData> = {}) {
  return db().style.create({
    data: {
      slug: 'knotless-braids',
      name: 'Knotless braids',
      category: 'braids',
      eyebrow: 'Most explored',
      imageSrc: 'https://media.hairpop.example/styles/knotless-braids.png',
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
      published: true,
      ...overrides,
    },
  });
}

export const passionTwists = {
  slug: 'passion-twists',
  name: 'Passion twists',
  category: 'twists',
  eyebrow: 'Twists',
  imageSrc: null,
  imageAlt: null,
  typicalHoursMin: 3,
  typicalHoursMax: 6,
  typicalPriceMin: 140,
  typicalPriceMax: 260,
  sortOrder: 1,
} satisfies Partial<StyleData>;

export const cornrows = {
  slug: 'cornrows',
  name: 'Cornrows',
  category: 'braids',
  eyebrow: 'Classic',
  imageSrc: null,
  imageAlt: null,
  typicalHoursMin: 2,
  typicalHoursMax: 4,
  typicalPriceMin: null,
  typicalPriceMax: null,
  sortOrder: 2,
} satisfies Partial<StyleData>;

export const starterLocs = {
  slug: 'starter-locs',
  name: 'Starter locs',
  category: 'locs',
  eyebrow: 'Locs',
  imageSrc: null,
  imageAlt: null,
  typicalHoursMin: 3,
  typicalHoursMax: 5,
  typicalPriceMin: 150,
  typicalPriceMax: 250,
  sortOrder: 3,
} satisfies Partial<StyleData>;

type BraiderData = Parameters<ReturnType<typeof db>['braider']['create']>[0]['data'];

/** A published braider, Nia Okafor from the cast unless overridden. */
export function createBraider(overrides: Partial<BraiderData> = {}) {
  return db().braider.create({
    data: {
      slug: 'nia-okafor',
      name: 'Nia Okafor',
      photoSrc: 'https://media.hairpop.example/braiders/nia.jpg',
      photoAlt: 'Nia Okafor smiling in her studio',
      area: 'Toronto West',
      distanceKm: 8,
      travelKm: 10,
      bio: 'I specialize in comfortable, neat braids. Bring inspiration photos and we’ll confirm the details together.',
      studioAddress: '214 Ossington Ave, Toronto',
      preparationPolicy: 'Arrive with washed, detangled hair.',
      changePolicy: 'Request a change at least 48 hours before.',
      cancellationPolicy: 'Free up to 48 hours before; later cancellations may be charged $40.',
      published: true,
      ...overrides,
    },
  });
}

/** A published service the braider offers for a style. */
export function createService(
  braiderId: string,
  overrides: Partial<{
    id: string;
    styleSlug: string;
    name: string;
    startingPrice: number;
    typicalHours: number;
    published: boolean;
    preparation: string | null;
  }> = {},
) {
  return db().braiderService.create({
    data: {
      braiderId,
      styleSlug: 'knotless-braids',
      name: 'Medium knotless braids',
      startingPrice: 180,
      typicalHours: 5,
      published: true,
      ...overrides,
    },
  });
}

export function createSlot(braiderId: string, start: Date, maxHours = 6) {
  return db().offeredSlot.create({ data: { braiderId, start, maxHours } });
}

let reviewers = 0;

/** A review of the service by a new customer; published unless a status is given. */
export async function createReview(
  service: { id: string; braiderId: string },
  overrides: Partial<{
    rating: number;
    text: string;
    status: 'published' | 'pending' | 'removed';
    createdAt: Date;
    authorName: string;
  }> = {},
) {
  reviewers += 1;
  const author = await db().user.create({
    data: {
      name: overrides.authorName ?? `Reviewer ${reviewers}`,
      email: `reviewer${reviewers}-${Date.now()}@example.com`,
      passwordHash: 'not-used',
    },
  });
  return db().review.create({
    data: {
      braiderId: service.braiderId,
      serviceId: service.id,
      authorId: author.id,
      rating: overrides.rating ?? 5,
      text: overrides.text ?? 'Neat parts and a gentle touch.',
      status: overrides.status ?? 'published',
      createdAt: overrides.createdAt,
    },
  });
}

/** An update in a customer's notification center; unread unless `readAt` is given. */
export function createNotification(
  userId: string,
  overrides: Partial<{
    title: string;
    body: string;
    link: string | null;
    createdAt: Date;
    readAt: Date;
  }> = {},
) {
  return db().customerNotification.create({
    data: {
      userId,
      title: overrides.title ?? 'Nia received your request',
      body: overrides.body ?? 'She will confirm the time and final price.',
      link: overrides.link === undefined ? '/appointments/HP-1048' : overrides.link,
      createdAt: overrides.createdAt,
      readAt: overrides.readAt,
    },
  });
}

/** An instant `days` from now at `hourUtc`:00 UTC, with no milliseconds. */
export function daysFromNow(days: number, hourUtc = 14): Date {
  const date = new Date();
  date.setUTCDate(date.getUTCDate() + days);
  date.setUTCHours(hourUtc, 0, 0, 0);
  return date;
}

type AppointmentData = Parameters<ReturnType<typeof db>['appointment']['create']>[0]['data'];

let attempts = 0;

/** A request for the service by the customer; awaiting reply two weeks out unless overridden. */
export function createAppointment(
  customerId: string,
  service: {
    id: string;
    braiderId: string;
    name: string;
    startingPrice: number;
    typicalHours: number;
  },
  overrides: Partial<{
    number: number;
    status: 'awaiting_reply' | 'confirmed' | 'declined' | 'cancelled';
    start: Date;
    slotId: string | null;
    agreedAmount: number | null;
    estimateMax: number | null;
    version: number;
  }> = {},
) {
  attempts += 1;
  const status = overrides.status ?? 'awaiting_reply';
  const slotId = overrides.slotId ?? null;
  const active = status === 'awaiting_reply' || status === 'confirmed';
  const data: AppointmentData = {
    customerId,
    braiderId: service.braiderId,
    serviceId: service.id,
    slotId,
    heldSlotId: active ? slotId : null,
    serviceName: service.name,
    start: overrides.start ?? daysFromNow(14),
    durationHours: service.typicalHours,
    estimateMin: service.startingPrice,
    estimateMax: overrides.estimateMax ?? null,
    agreedAmount: overrides.agreedAmount ?? null,
    email: 'maya.chen@example.com',
    phone: '416-555-0148',
    hairDetails: 'Shoulder length; bringing my own extensions',
    policyVersion: 'test',
    changePolicy: 'Request a change at least 48 hours before.',
    cancellationPolicy: 'Free up to 48 hours before; later cancellations may be charged $40.',
    status,
    version: overrides.version ?? 1,
    idempotencyKey: `attempt-${attempts}`,
    ...(overrides.number === undefined ? {} : { number: overrides.number }),
  };
  return db().appointment.create({ data });
}
