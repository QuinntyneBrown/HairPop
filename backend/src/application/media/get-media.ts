import { prisma } from '@/infrastructure/prisma';

/** A stored image by id, or null. */
export function getMedia(id: string) {
  return prisma.mediaFile.findUnique({ where: { id } });
}
