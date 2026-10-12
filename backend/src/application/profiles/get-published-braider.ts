import { initials, rating, type BraiderProfile } from '@/domain/braider-profile';
import { image } from '@/domain/common';
import { findPublishedBraider, publishedRatingTotals } from '@/infrastructure/braider-repository';

/** A published braider's public profile, or null when unknown or unpublished (L2-007, L2-008). */
export async function getPublishedBraider(slug: string): Promise<BraiderProfile | null> {
  const braider = await findPublishedBraider(slug);
  if (!braider) return null;
  const totals = await publishedRatingTotals(braider.id);

  return {
    slug: braider.slug,
    name: braider.name,
    initials: initials(braider.name),
    photo: image(braider.photoSrc, braider.photoAlt),
    area: braider.area,
    travelKm: braider.travelKm,
    bio: braider.bio,
    rating: rating(totals.sum, totals.count),
    services: braider.services.map((service) => ({
      id: service.id,
      name: service.name,
      styleSlug: service.styleSlug,
      startingPrice: service.startingPrice,
      typicalHours: service.typicalHours,
    })),
    portfolio: braider.portfolio.map((item) => ({
      id: item.id,
      image: image(item.imageSrc, item.imageAlt),
      caption: item.caption,
    })),
    policies: {
      preparation: braider.preparationPolicy,
      changes: braider.changePolicy,
      cancellation: braider.cancellationPolicy,
    },
  };
}
