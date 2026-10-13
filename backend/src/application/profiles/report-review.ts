import { Prisma } from '@prisma/client';
import { prisma } from '@/infrastructure/prisma';
import { recordHit, retryAfterSeconds } from '@/infrastructure/rate-limiter';

export const REPORT_REASONS = ['not_real_visit', 'offensive', 'private_info', 'other'] as const;
export type ReportReason = (typeof REPORT_REASONS)[number];

/** New reports allowed per customer in the window (L2-040 AC2). */
export const REPORT_MAX = 10;
export const REPORT_WINDOW_SECONDS = 60 * 60;

export interface ReportCommand {
  readonly reviewId: string;
  readonly reporterId: string;
  readonly reason: ReportReason;
  readonly details: string | null;
}

export type ReportResult =
  | { readonly outcome: 'reported'; readonly reportId: string }
  | { readonly outcome: 'not_found' }
  | { readonly outcome: 'rate_limited'; readonly retryAfter: number };

/**
 * Records a report against a published review for moderation; the review stays as it is
 * (L2-009 AC1). A customer's repeat report of the same review returns their first one.
 */
export async function reportReview(command: ReportCommand): Promise<ReportResult> {
  const review = await prisma.review.findFirst({
    where: { id: command.reviewId, status: 'published', braider: { published: true } },
    select: { id: true },
  });
  if (!review) return { outcome: 'not_found' };

  const existing = await findReport(command.reviewId, command.reporterId);
  if (existing) return { outcome: 'reported', reportId: existing.id };

  const limitKey = `review-report:${command.reporterId}`;
  const retryAfter = await retryAfterSeconds(limitKey, REPORT_MAX);
  if (retryAfter !== null) return { outcome: 'rate_limited', retryAfter };

  try {
    const report = await prisma.reviewReport.create({
      data: {
        reviewId: command.reviewId,
        reporterId: command.reporterId,
        reason: command.reason,
        details: command.details,
      },
    });
    await recordHit(limitKey, REPORT_WINDOW_SECONDS);
    return { outcome: 'reported', reportId: report.id };
  } catch (error) {
    // A concurrent submission of the same report won the insert.
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      const raced = await findReport(command.reviewId, command.reporterId);
      if (raced) return { outcome: 'reported', reportId: raced.id };
    }
    throw error;
  }
}

function findReport(reviewId: string, reporterId: string) {
  return prisma.reviewReport.findUnique({
    where: { reviewId_reporterId: { reviewId, reporterId } },
    select: { id: true },
  });
}
