import { randomUUID } from 'node:crypto';
import type { Api } from './api';
import { createBraider, createService, createSlot, createStyle, daysFromNow } from './factories';

/** Nia with a published knotless service and an offered slot two weeks out. */
export async function bookableNia() {
  await createStyle();
  const nia = await createBraider();
  const service = await createService(nia.id);
  const slot = await createSlot(nia.id, daysFromNow(14));
  return { nia, service, slot };
}

interface Options {
  policy: { version: string };
}

/** Sends a booking request the way the review dialog does, with current options. */
export async function submitBooking(
  api: Api,
  choice: { serviceId: string; slotId: string },
  overrides: Record<string, unknown> = {},
  key: string = randomUUID(),
) {
  const options = await api.get<Options>('/api/braiders/nia-okafor/booking-options');
  return api.post<{ reference: string; status: string }>(
    '/api/booking-requests',
    {
      braiderSlug: 'nia-okafor',
      serviceId: choice.serviceId,
      slotId: choice.slotId,
      email: 'maya.chen@example.com',
      phone: '416-555-0148',
      hairDetails: 'Shoulder length; bringing my own extensions',
      policyVersion: options.body.policy?.version ?? 'unknown',
      ...overrides,
    },
    { 'Idempotency-Key': key },
  );
}
