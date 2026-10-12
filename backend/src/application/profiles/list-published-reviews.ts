import { pageMeta, PER_PAGE, type Page } from '@/domain/common';
import { localDate, type Review } from '@/domain/review';
import { findPublishedBraiderId, findPublishedReviews } from '@/infrastructure/braider-repository';

/** A published braider's published reviews, newest first; null when the braider is not public (L2-007, L2-008). */
export async function listPublishedReviews(
  slug: string,
  page: number,
): Promise<Page<Review> | null> {
  const braider = await findPublishedBraiderId(slug);
  if (!braider) return null;
  const { reviews, total } = await findPublishedReviews(
    braider.id,
    (page - 1) * PER_PAGE,
    PER_PAGE,
  );
  return {
    data: reviews.map((review) => ({
      id: review.id,
      rating: review.rating,
      date: localDate(review.createdAt),
      text: review.text,
      author: review.author.name,
      service: review.service.name,
    })),
    meta: pageMeta(page, total),
  };
}
