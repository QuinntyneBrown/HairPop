import type { Prisma } from '@prisma/client';

/** Locks an offered slot row until the transaction ends, so competing bookings serialize. */
export async function lockSlot(tx: Prisma.TransactionClient, slotId: string): Promise<void> {
  await tx.$queryRaw`SELECT "id" FROM "OfferedSlot" WHERE "id" = ${slotId} FOR UPDATE`;
}
