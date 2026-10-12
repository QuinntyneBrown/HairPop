/**
 * Background worker (ADR 0009): delivers queued emails. Run it beside the API with
 * `npm run worker`; several can run at once.
 */
import { PrismaClient } from '@prisma/client';
import { deliverDueEmails } from '../src/worker/deliver-emails';
import { smtpTransport } from '../src/worker/smtp-transport';

const POLL_MS = 2000;

const smtpUrl = process.env.SMTP_URL;
if (!smtpUrl) {
  console.error(JSON.stringify({ level: 'error', msg: 'SMTP_URL is not set' }));
  process.exit(1);
}

const db = new PrismaClient();
const transport = smtpTransport(
  smtpUrl,
  process.env.MAIL_FROM ?? 'HairPop <no-reply@hairpop.example>',
);
let running = true;

async function loop(): Promise<void> {
  while (running) {
    try {
      const sent = await deliverDueEmails(db, transport);
      if (sent > 0) console.log(JSON.stringify({ level: 'info', msg: 'emails sent', count: sent }));
    } catch (error) {
      console.error(
        JSON.stringify({
          level: 'error',
          msg: 'email delivery failed',
          error: error instanceof Error ? error.message : String(error),
        }),
      );
    }
    if (running) await new Promise((resolve) => setTimeout(resolve, POLL_MS));
  }
  await db.$disconnect();
}

for (const signal of ['SIGINT', 'SIGTERM'] as const) {
  process.on(signal, () => {
    running = false;
  });
}

void loop();
