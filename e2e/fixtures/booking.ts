import type { BookingOptions } from '../../frontend/projects/api/src/public-api';
import type { ApiRule } from './api';

/** Nia's current bookable offerings and terms, using the mock cast. */
export const niaBooking: BookingOptions = {
  braider: { slug: 'nia-okafor', name: 'Nia Okafor', area: 'Toronto' },
  services: [
    {
      id: 'svc-knotless',
      name: 'Medium knotless braids',
      startingPrice: 180,
      typicalHours: 5,
      estimate: { min: 180, max: null },
    },
    {
      id: 'svc-twists',
      name: 'Passion twists',
      startingPrice: 160,
      typicalHours: 4,
      estimate: { min: 160, max: null },
    },
  ],
  slots: [{ id: 'slot-24', start: '2026-10-24T10:00:00-04:00' }],
  policy: {
    version: 'policy-123456',
    changes: 'Request a change at least 48 hours ahead.',
    cancellation: 'Cancel before the visit starts.',
  },
  contact: { email: 'maya.chen@example.com', phone: '416-555-0148' },
  timeZone: 'America/Toronto',
};

export function bookingOptions(options = niaBooking): ApiRule {
  return { method: 'GET', path: '/api/braiders/nia-okafor/booking-options', body: options };
}
