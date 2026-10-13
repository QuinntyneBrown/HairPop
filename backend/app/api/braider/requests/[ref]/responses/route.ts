import { NextResponse } from 'next/server';
import { z } from 'zod';
import { respondToRequest } from '@/application/braider/requests';
import { ApiError, notFound } from '@/http/api-error';
import { currentBraider } from '@/http/braider';
import { route } from '@/http/route';
import { parseBody } from '@/http/validation';

const AMOUNT = 'Enter the agreed amount, like 210.';

const ResponseBody = z.object({
  decision: z.enum(['accept', 'decline'], { errorMap: () => ({ message: 'Choose a reply.' }) }),
  agreedAmount: z
    .number({ invalid_type_error: AMOUNT })
    .int(AMOUNT)
    .min(0, AMOUNT)
    .max(100_000, AMOUNT)
    .nullable()
    .default(null),
  version: z.number().int().min(1),
});

export const POST = route(
  async (request, { user, params }) => {
    const braider = await currentBraider(user.id);
    const body = await parseBody(request, ResponseBody);
    const result = await respondToRequest({
      ...body,
      braiderId: braider.id,
      braiderName: braider.name,
      ref: String(params.ref),
    });
    switch (result.outcome) {
      case 'responded':
        return NextResponse.json({ status: result.status });
      case 'not_found':
        throw notFound();
      case 'forbidden':
        throw new ApiError(403, { message: 'This request isn’t yours to answer.' });
      case 'stale':
        throw new ApiError(409, {
          message: 'This request changed after you opened it. Refresh to see current requests.',
          code: 'stale',
        });
    }
  },
  { role: 'braider' },
);
