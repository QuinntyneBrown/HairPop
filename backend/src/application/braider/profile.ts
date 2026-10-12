import { image, type Image } from '@/domain/common';
import type { ImageType } from '@/domain/media';
import { prisma } from '@/infrastructure/prisma';
import { offerableStyles, type EditResult } from './services';

/** The profile fields the braider edits (L2-027). Empty text means "not given". */
export interface ProfileInput {
  readonly bio: string;
  readonly area: string;
  readonly studioAddress: string;
  readonly preparation: string;
  readonly changePolicy: string;
  readonly cancellationPolicy: string;
}

export interface ManagedPortfolioItem {
  readonly id: string;
  readonly image: Image | null;
  readonly caption: string;
  readonly styleSlug: string | null;
}

export interface ProfileContent extends ProfileInput {
  readonly version: number;
  readonly portfolio: readonly ManagedPortfolioItem[];
  readonly styles: readonly { readonly slug: string; readonly name: string }[];
}

function toItem(item: {
  id: string;
  imageSrc: string | null;
  imageAlt: string | null;
  caption: string;
  styleSlug: string | null;
}): ManagedPortfolioItem {
  return {
    id: item.id,
    image: image(item.imageSrc, item.imageAlt),
    caption: item.caption,
    styleSlug: item.styleSlug,
  };
}

/** The braider's editable profile with their portfolio, newest first. */
export async function getProfileContent(braiderId: string): Promise<ProfileContent> {
  const [braider, styles] = await Promise.all([
    prisma.braider.findUniqueOrThrow({
      where: { id: braiderId },
      include: { portfolio: { orderBy: [{ createdAt: 'desc' }, { id: 'asc' }] } },
    }),
    offerableStyles(),
  ]);
  return {
    bio: braider.bio,
    area: braider.area,
    studioAddress: braider.studioAddress ?? '',
    preparation: braider.preparationPolicy ?? '',
    changePolicy: braider.changePolicy ?? '',
    cancellationPolicy: braider.cancellationPolicy ?? '',
    version: braider.version,
    portfolio: braider.portfolio.map(toItem),
    styles,
  };
}

/**
 * Saves the braider's profile against the version they loaded (L2-047 AC4). The public profile
 * and new booking reviews use the new values; existing requests keep the policies they were sent
 * with (L2-027 AC2). The studio address stays private (AC3).
 */
export async function updateProfile(
  braiderId: string,
  version: number,
  input: ProfileInput,
): Promise<EditResult<ProfileContent>> {
  const optional = (text: string) => (text === '' ? null : text);
  const { count } = await prisma.braider.updateMany({
    where: { id: braiderId, version },
    data: {
      bio: input.bio,
      area: input.area,
      studioAddress: optional(input.studioAddress),
      preparationPolicy: optional(input.preparation),
      changePolicy: optional(input.changePolicy),
      cancellationPolicy: optional(input.cancellationPolicy),
      version: { increment: 1 },
    },
  });
  if (count === 0) return { outcome: 'stale' };
  return { outcome: 'saved', value: await getProfileContent(braiderId) };
}

export interface NewPhoto {
  readonly bytes: Uint8Array;
  readonly contentType: ImageType;
  readonly caption: string;
  readonly styleSlug: string | null;
}

/** Stores a checked photo and adds it to the braider's public portfolio (L2-027 AC1, AC4). */
export async function addPortfolioItem(
  braiderId: string,
  photo: NewPhoto,
): Promise<ManagedPortfolioItem> {
  return prisma.$transaction(async (tx) => {
    const media = await tx.mediaFile.create({
      data: { contentType: photo.contentType, bytes: Buffer.from(photo.bytes) },
    });
    const item = await tx.portfolioItem.create({
      data: {
        braiderId,
        caption: photo.caption,
        styleSlug: photo.styleSlug,
        mediaId: media.id,
        imageSrc: `/api/media/${media.id}`,
        imageAlt: photo.caption,
      },
    });
    return toItem(item);
  });
}

/** Removes the braider's own photo from their portfolio, and its stored image. */
export async function removePortfolioItem(
  braiderId: string,
  id: string,
): Promise<EditResult<null>> {
  const item = await prisma.portfolioItem.findUnique({ where: { id } });
  if (!item) return { outcome: 'not_found' };
  if (item.braiderId !== braiderId) return { outcome: 'forbidden' };
  await prisma.$transaction(async (tx) => {
    await tx.portfolioItem.delete({ where: { id } });
    if (item.mediaId) await tx.mediaFile.delete({ where: { id: item.mediaId } });
  });
  return { outcome: 'saved', value: null };
}
