import { NextResponse } from 'next/server';
import { z } from 'zod';
import { submitVisitReview } from '@/application/aftercare/submit-review';
import { ApiError, notFound } from '@/http/api-error';
import { idempotencyKey } from '@/http/idempotency';
import { route } from '@/http/route';
import { parseBody } from '@/http/validation';

const RATING = 'Choose a rating from 1 to 5 stars.';

const ReviewBody = z.object({
  rating: z
    .number({ invalid_type_error: RATING, required_error: RATING })
    .int(RATING)
    .min(1, RATING)
    .max(5, RATING),
  text: z
    .string({ required_error: 'Tell others how your visit went.' })
    .trim()
    .min(1, 'Tell others how your visit went.')
    .max(1000, 'Use at most 1,000 characters.'),
});

export const POST = route(
  async (request, { user, params }) => {
    const key = idempotencyKey(request);
    const body = await parseBody(request, ReviewBody);
    const result = await submitVisitReview({
      ...body,
      customerId: user.id,
      ref: String(params.ref),
      idempotencyKey: key,
    });
    switch (result.outcome) {
      case 'submitted':
        return NextResponse.json(
          { reviewId: result.reviewId, status: result.status },
          { status: 201 },
        );
      case 'not_found':
        throw notFound();
      case 'not_completed':
        throw new ApiError(403, {
          message: 'Only a completed visit can be reviewed.',
          code: 'not_completed',
        });
      case 'already_reviewed':
        throw new ApiError(409, {
          message: 'You have already reviewed this visit.',
          code: 'already_reviewed',
        });
    }
  },
  { role: 'customer' },
);
