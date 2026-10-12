import type { EmailMessage } from '@/domain/emails';
import type { Db } from './db';

/** Queues an email for the worker in the caller's transaction (ADR 0009). */
export async function queueEmail(db: Db, message: EmailMessage): Promise<void> {
  await db.outboundEmail.create({ data: message });
}
