import type { PrismaClient } from '@prisma/client';
import type { EmailMessage } from '@/domain/emails';

/** Sends one email; it throws when the mail server refuses or cannot be reached. */
export interface MailTransport {
  send(message: EmailMessage): Promise<void>;
}

export const MAX_ATTEMPTS = 8;
/** Emails claimed per pass. */
const BATCH = 20;
/** A claimed email is not claimed again for this long, even if its worker dies mid-send. */
const LEASE_SECONDS = 5 * 60;

interface ClaimedEmail extends EmailMessage {
  readonly id: string;
  readonly attempts: number;
}

/** One minute doubling per attempt, at most an hour. */
export function backoffSeconds(attempts: number): number {
  return Math.min(60 * 2 ** (attempts - 1), 60 * 60);
}

/**
 * Sends due outbox emails once each (ADR 0009). Rows are claimed with SKIP LOCKED and leased,
 * so concurrent workers never send one twice. Returns how many were sent.
 */
export async function deliverDueEmails(
  db: PrismaClient,
  transport: MailTransport,
): Promise<number> {
  const claimed = await db.$queryRaw<ClaimedEmail[]>`
    UPDATE "OutboundEmail" SET
      "attempts" = "attempts" + 1,
      "nextAttemptAt" = now() + make_interval(secs => ${LEASE_SECONDS})
    WHERE "id" IN (
      SELECT "id" FROM "OutboundEmail"
      WHERE "sentAt" IS NULL AND "nextAttemptAt" <= now() AND "attempts" < ${MAX_ATTEMPTS}
      ORDER BY "createdAt"
      LIMIT ${BATCH}
      FOR UPDATE SKIP LOCKED
    )
    RETURNING "id", "to", "subject", "text", "attempts"`;

  let sent = 0;
  for (const email of claimed) {
    try {
      await transport.send({ to: email.to, subject: email.subject, text: email.text });
      // The text can hold a link token; it is not kept once delivered (L2-039 AC3).
      await db.outboundEmail.update({
        where: { id: email.id },
        data: { sentAt: new Date(), text: '', lastError: null },
      });
      sent += 1;
    } catch (error) {
      await db.outboundEmail.update({
        where: { id: email.id },
        data: {
          nextAttemptAt: new Date(Date.now() + backoffSeconds(email.attempts) * 1000),
          lastError: (error instanceof Error ? error.message : String(error)).slice(0, 500),
        },
      });
    }
  }
  return sent;
}
