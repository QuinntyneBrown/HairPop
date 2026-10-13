// Acceptance Test
// Traces to: L2-012, L2-013, L2-039, L2-044
import { describe, expect, it } from 'vitest';
import type { EmailMessage } from '../../src/domain/emails';
import { deliverDueEmails, MAX_ATTEMPTS } from '../../src/worker/deliver-emails';
import { db } from '../support/db';

const message = {
  to: 'maya.chen@example.com',
  subject: 'Verify your HairPop email',
  text: 'Open http://localhost:4200/verify-email?token=secret-token',
};

function recordingTransport() {
  const sent: EmailMessage[] = [];
  return { sent, send: async (email: EmailMessage) => void sent.push(email) };
}

describe('Outbox delivery (ADR 0009)', () => {
  it('Given queued emails, when the worker drains the outbox, then each is sent once and its text is cleared', async () => {
    await db().outboundEmail.create({ data: message });
    await db().outboundEmail.create({ data: { ...message, to: 'kemi.adebayo@example.com' } });
    const transport = recordingTransport();

    expect(await deliverDueEmails(db(), transport)).toBe(2);
    expect(await deliverDueEmails(db(), transport)).toBe(0);

    expect(transport.sent.map((email) => email.to).sort()).toEqual([
      'kemi.adebayo@example.com',
      'maya.chen@example.com',
    ]);
    expect(transport.sent[0]).toMatchObject({ subject: message.subject, text: message.text });
    const rows = await db().outboundEmail.findMany();
    expect(rows.every((row) => row.sentAt !== null && row.text === '')).toBe(true);
  });

  it('Given the mail server fails, when the worker drains, then the email waits for a later retry and keeps its text', async () => {
    await db().outboundEmail.create({ data: message });
    const failing = {
      send: async () => {
        throw new Error('Connection refused');
      },
    };

    expect(await deliverDueEmails(db(), failing)).toBe(0);
    const transport = recordingTransport();
    expect(await deliverDueEmails(db(), transport)).toBe(0);

    const row = await db().outboundEmail.findFirstOrThrow();
    expect(row).toMatchObject({ sentAt: null, attempts: 1, lastError: 'Connection refused' });
    expect(row.text).toBe(message.text);
    expect(row.nextAttemptAt.getTime()).toBeGreaterThan(Date.now());
    expect(transport.sent).toEqual([]);
  });

  it('Given a retry that has come due, when the worker drains, then it is sent', async () => {
    await db().outboundEmail.create({
      data: { ...message, attempts: 2, nextAttemptAt: new Date(Date.now() - 1000) },
    });
    const transport = recordingTransport();

    expect(await deliverDueEmails(db(), transport)).toBe(1);
    expect(transport.sent).toHaveLength(1);
  });

  it('Given an email that used every attempt, when the worker drains, then it is left unsent', async () => {
    await db().outboundEmail.create({ data: { ...message, attempts: MAX_ATTEMPTS } });
    const transport = recordingTransport();

    expect(await deliverDueEmails(db(), transport)).toBe(0);
    expect(transport.sent).toEqual([]);
  });
});
