import { NextResponse } from 'next/server';
import { z } from 'zod';
import { proposeChange } from '@/application/appointments/change-appointment';
import { notFound } from '@/http/api-error';
import { notChangeable, slotUnavailable } from '@/http/appointment-errors';
import { route } from '@/http/route';
import { parseBody } from '@/http/validation';

const CHOOSE_TIME = 'Choose one of the offered times.';

const ChangeBody = z.object({
  slotId: z.string({ required_error: CHOOSE_TIME }).min(1, CHOOSE_TIME).max(64),
  note: z
    .string()
    .trim()
    .max(500, 'Use at most 500 characters.')
    .nullable()
    .default(null)
    .transform((note) => (note ? note : null)),
});

export const POST = route(
  async (request, { user, params }) => {
    const body = await parseBody(request, ChangeBody);
    const result = await proposeChange({ ...body, customerId: user.id, ref: String(params.ref) });
    switch (result.outcome) {
      case 'proposed':
        return NextResponse.json({ pendingChange: { start: result.start } }, { status: 201 });
      case 'not_found':
        throw notFound();
      case 'not_changeable':
        throw notChangeable();
      case 'slot_unavailable':
        throw slotUnavailable();
    }
  },
  { role: 'customer' },
);
