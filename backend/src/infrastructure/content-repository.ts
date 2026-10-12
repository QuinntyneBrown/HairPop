import { prisma } from './prisma';

export function findPublishedContent(slug: string) {
  return prisma.contentPage.findFirst({ where: { slug, published: true } });
}
