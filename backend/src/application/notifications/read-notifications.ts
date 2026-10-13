import { pageMeta, PER_PAGE, type Page } from '@/domain/common';
import { toCustomerNotification, type CustomerNotification } from '@/domain/notification';
import { countUnread } from '@/infrastructure/notification-repository';
import { prisma } from '@/infrastructure/prisma';

/** The customer's own notifications, newest first, with their unread count (L2-030 AC1). */
export async function listNotifications(
  userId: string,
  page: number,
): Promise<Page<CustomerNotification, { unreadCount: number }>> {
  const where = { userId };
  const [records, total, unreadCount] = await prisma.$transaction([
    prisma.customerNotification.findMany({
      where,
      orderBy: [{ createdAt: 'desc' }, { id: 'asc' }],
      skip: (page - 1) * PER_PAGE,
      take: PER_PAGE,
    }),
    prisma.customerNotification.count({ where }),
    prisma.customerNotification.count({ where: { userId, readAt: null } }),
  ]);
  return {
    data: records.map(toCustomerNotification),
    meta: { ...pageMeta(page, total), unreadCount },
  };
}

export function unreadCount(userId: string): Promise<number> {
  return countUnread(prisma, userId);
}

/**
 * Marks one of the customer's notifications read; repeating it changes nothing (L2-030 AC2).
 * Returns null when the notification is unknown or another customer's.
 */
export async function markRead(userId: string, id: string): Promise<number | null> {
  const owned = await prisma.customerNotification.findFirst({ where: { id, userId } });
  if (!owned) return null;
  await prisma.customerNotification.updateMany({
    where: { id, userId, readAt: null },
    data: { readAt: new Date() },
  });
  return countUnread(prisma, userId);
}

export async function markAllRead(userId: string): Promise<void> {
  await prisma.customerNotification.updateMany({
    where: { userId, readAt: null },
    data: { readAt: new Date() },
  });
}
