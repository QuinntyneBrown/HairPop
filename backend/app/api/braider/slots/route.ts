import { NextResponse } from 'next/server';
import { z } from 'zod';
import { addSlot, listManagedSlots } from '@/application/braider/slots';
import { isCalendarDate, torontoInstant } from '@/domain/local-time';
import { ApiError } from '@/http/api-error';
import { currentBraider } from '@/http/braider';
import { route } from '@/http/route';
import { parseBody } from '@/http/validation';

const SlotBody = z.object({
  date: z.string().refine(isCalendarDate, 'Choose a date, like 2026-11-01.'),
  time: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'Choose a start time.'),
  maxHours: z
    .number({ invalid_type_error: 'Choose how long this time is.' })
    .gt(0, 'Choose how long this time is.')
    .max(12, 'Choose 12 hours or less.'),
});

export const GET = route(
  async (_request, { user }) => {
    const braider = await currentBraider(user.id);
    return NextResponse.json({ data: await listManagedSlots(braider.id) });
  },
  { role: 'braider' },
);

export const POST = route(
  async (request, { user }) => {
    const braider = await currentBraider(user.id);
    const body = await parseBody(request, SlotBody);
    const start = torontoInstant(body.date, body.time);
    if (start.getTime() <= Date.now()) {
      throw new ApiError(422, {
        message: 'The given data was invalid.',
        errors: { date: ['Choose a date from today onwards.'] },
      });
    }
    const result = await addSlot(braider.id, start, body.maxHours);
    if (result.outcome === 'overlap') {
      throw new ApiError(409, {
        message: 'This time overlaps another time you offer. Choose a different time.',
        code: 'overlap',
      });
    }
    return NextResponse.json(result.slot, { status: 201 });
  },
  { role: 'braider' },
);
