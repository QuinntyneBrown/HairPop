import { NextResponse } from 'next/server';
import { z } from 'zod';
import { REPORT_REASONS, reportReview } from '@/application/profiles/report-review';
import { notFound, tooManyAttempts } from '@/http/api-error';
import { route } from '@/http/route';
import { parseBody } from '@/http/validation';

const ReportBody = z.object({
  reason: z.enum(REPORT_REASONS, {
    errorMap: () => ({ message: 'Choose why this review needs a closer look.' }),
  }),
  details: z
    .string()
    .trim()
    .max(1000, 'Use at most 1,000 characters.')
    .nullable()
    .default(null)
    .transform((details) => (details ? details : null)),
});

export const POST = route(
  async (request, { user, params }) => {
    const body = await parseBody(request, ReportBody);
    const result = await reportReview({
      reviewId: String(params.id),
      reporterId: user.id,
      ...body,
    });
    switch (result.outcome) {
      case 'not_found':
        throw notFound();
      case 'rate_limited':
        throw tooManyAttempts(result.retryAfter);
      case 'reported':
        return NextResponse.json({ reportId: result.reportId }, { status: 201 });
    }
  },
  { role: 'customer' },
);
