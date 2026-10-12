import type { Db } from './db';

export interface NewNotification {
  readonly userId: string;
  readonly title: string;
  readonly body: string;
  readonly link: string | null;
}

/** Records an update for the customer's notification center (L2-029). */
export async function recordNotification(db: Db, notification: NewNotification): Promise<void> {
  await db.customerNotification.create({ data: notification });
}
