import { NextResponse } from 'next/server';
import { z } from 'zod';
import { submitBookingRequest } from '@/application/booking/submit-booking-request';
import { ApiError, notFound, tooManyAttempts } from '@/http/api-error';
import { emailField, phoneField } from '@/http/fields';
import { idempotencyKey } from '@/http/idempotency';
import { route } from '@/http/route';
import { parseBody } from '@/http/validation';

const CHOOSE_TIME = 'Choose one of the offered times.';

const BookingBody = z.object({
  braiderSlug: z.string().min(1).max(120),
  serviceId: z.string({ required_error: 'Choose a service.' }).min(1, 'Choose a service.').max(64),
  slotId: z.string({ required_error: CHOOSE_TIME }).min(1, CHOOSE_TIME).max(64),
  email: emailField,
  phone: phoneField,
  hairDetails: z
    .string()
    .trim()
    .min(1, 'Describe your hair, for example its length and whether you’re bringing extensions.')
    .max(500, 'Use at most 500 characters.'),
  policyVersion: z.string().min(1).max(64),
});

const CONFLICTS = {
  service_unavailable: 'This service is no longer offered. Choose another service.',
  slot_unavailable: 'This time is no longer offered. Choose another time.',
  terms_changed: 'The braider’s terms changed. Review the current terms before sending.',
} as const;

export const POST = route(
  async (request, { user }) => {
    const key = idempotencyKey(request);
    const body = await parseBody(request, BookingBody);
    const result = await submitBookingRequest({
      ...body,
      customerId: user.id,
      idempotencyKey: key,
    });
    switch (result.outcome) {
      case 'submitted':
        return NextResponse.json(
          { reference: result.reference, status: 'awaiting_reply' },
          { status: 201 },
        );
      case 'not_found':
        throw notFound();
      case 'rate_limited':
        throw tooManyAttempts(result.retryAfter);
      default:
        throw new ApiError(409, { message: CONFLICTS[result.outcome], code: result.outcome });
    }
  },
  { role: 'customer' },
);
