import { Prisma } from '@prisma/client';
import { lifecycle, referenceNumber } from '@/domain/appointment';
import { needsChecks } from '@/domain/review';
import { recordNotification } from '@/infrastructure/notification-repository';
import { prisma } from '@/infrastructure/prisma';

export interface SubmitReviewCommand {
  readonly customerId: string;
  readonly ref: string;
  readonly idempotencyKey: string;
  readonly rating: number;
  readonly text: string;
}

export type SubmitReviewResult =
  | {
      readonly outcome: 'submitted';
      readonly reviewId: string;
      readonly status: 'published' | 'pending';
    }
  | { readonly outcome: 'not_found' | 'not_completed' | 'already_reviewed' };

/**
 * Saves one review for the owner's completed visit, tied to its braider, service and appointment
 * (L2-025). A retry with the same key returns the first review; any other second review is
 * refused (AC4). Text with links or contact details is held for checks.
 */
export async function submitVisitReview(command: SubmitReviewCommand): Promise<SubmitReviewResult> {
  const number = referenceNumber(command.ref);
  if (number === null) return { outcome: 'not_found' };
  const visit = await prisma.appointment.findFirst({
    where: { number, customerId: command.customerId },
    include: { review: true, braider: { select: { slug: true } } },
  });
  if (!visit) return { outcome: 'not_found' };
  if (visit.review) return earlier(visit.review, command.idempotencyKey);
  if (lifecycle(visit) !== 'completed') return { outcome: 'not_completed' };

  const status = needsChecks(command.text) ? 'pending' : 'published';
  try {
    return await prisma.$transaction(async (tx) => {
      const review = await tx.review.create({
        data: {
          braiderId: visit.braiderId,
          serviceId: visit.serviceId,
          authorId: command.customerId,
          appointmentId: visit.id,
          idempotencyKey: command.idempotencyKey,
          rating: command.rating,
          text: command.text,
          status,
        },
      });
      await recordNotification(tx, {
        userId: command.customerId,
        ...(status === 'published'
          ? { title: 'Review posted', body: 'Thank you for helping others choose.' }
          : { title: 'Review held for checks', body: 'It appears once our team has checked it.' }),
        link: `/braiders/${visit.braider.slug}`,
      });
      return { outcome: 'submitted', reviewId: review.id, status } as const;
    });
  } catch (error) {
    // A concurrent submission for this appointment won the insert.
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      const raced = await prisma.review.findUnique({ where: { appointmentId: visit.id } });
      if (raced) return earlier(raced, command.idempotencyKey);
    }
    throw error;
  }
}

function earlier(
  review: { id: string; idempotencyKey: string | null; status: string },
  key: string,
): SubmitReviewResult {
  if (review.idempotencyKey !== key) return { outcome: 'already_reviewed' };
  return {
    outcome: 'submitted',
    reviewId: review.id,
    status: review.status === 'published' ? 'published' : 'pending',
  };
}
