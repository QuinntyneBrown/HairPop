import type { Prisma } from '@prisma/client';
import type { StyleCategory } from '@/domain/style';
import { prisma } from './prisma';

export interface StyleCriteria {
  readonly search?: string;
  readonly category?: StyleCategory;
}

function publishedWhere(criteria: StyleCriteria): Prisma.StyleWhereInput {
  return {
    published: true,
    category: criteria.category,
    name: criteria.search ? { contains: criteria.search, mode: 'insensitive' } : undefined,
  };
}

/** One page of published styles in gallery order, and how many match in total. */
export async function findPublishedStyles(criteria: StyleCriteria, skip: number, take: number) {
  const where = publishedWhere(criteria);
  const [styles, total] = await prisma.$transaction([
    prisma.style.findMany({ where, orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }], skip, take }),
    prisma.style.count({ where }),
  ]);
  return { styles, total };
}
