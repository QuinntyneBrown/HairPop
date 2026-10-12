import { hashPassword } from '../../src/infrastructure/password';
import { db } from './db';

export const PASSWORD = 'correct horse battery';

/** Maya Chen, the customer cast in docs/mocks/README.md. */
export async function createCustomer(overrides: { email?: string; name?: string } = {}) {
  return db().user.create({
    data: {
      name: overrides.name ?? 'Maya Chen',
      email: overrides.email ?? 'maya.chen@example.com',
      emailVerifiedAt: new Date('2026-10-01T12:00:00Z'),
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
