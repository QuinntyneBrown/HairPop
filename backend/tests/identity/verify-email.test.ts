// Acceptance Test
// Traces to: L2-010, L2-013, L2-029, L2-039, L2-040
import { randomUUID } from 'node:crypto';
import { describe, expect, it } from 'vitest';
import { Api } from '../support/api';
import { db } from '../support/db';
import { emailsTo, tokenSentTo } from '../support/emails';
import { createCustomer } from '../support/factories';

const MAYA = 'maya.chen@example.com';

async function verify(token: string) {
  const api = new Api();
  await api.csrf();
  return api.post('/api/email/verify', { token });
}

async function resend(email: string, api = new Api()) {
  await api.csrf();
  return api.post('/api/email/verification-notification', { email });
}

describe('Email verification', () => {
  it('Given a new registration, when it is accepted, then a verification link is emailed', async () => {
    const api = new Api();
    await api.csrf();
    await api.post(
      '/api/auth/register',
      { name: 'Maya Chen', email: MAYA, password: 'a fresh long password' },
      { 'Idempotency-Key': randomUUID() },
    );

    const emails = await emailsTo(MAYA);
    expect(emails).toHaveLength(1);
    expect(emails[0]?.subject).toBe('Verify your HairPop email');
    expect(emails[0]?.text).toMatch(/\/verify-email\?token=[\w-]{20,}/);
  });

  it('Given an email already registered, when someone registers with it, then a sign-in reminder is emailed instead of a link', async () => {
    await createCustomer();
    const api = new Api();
    await api.csrf();
    await api.post(
      '/api/auth/register',
      { name: 'Someone Else', email: MAYA, password: 'a fresh long password' },
      { 'Idempotency-Key': randomUUID() },
    );

    const emails = await emailsTo(MAYA);
    expect(emails).toHaveLength(1);
    expect(emails[0]?.subject).toBe('You already have a HairPop account');
    expect(emails[0]?.text).not.toMatch(/token=/);
  });

  it('Given a valid unused link, when it is opened, then the email is verified once and an update is recorded', async () => {
    const maya = await createCustomer({ verified: false });
    await resend(MAYA);
    const token = await tokenSentTo(MAYA);

    const response = await verify(token);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ email: MAYA });
    const user = await db().user.findUniqueOrThrow({ where: { id: maya.id } });
    expect(user.emailVerifiedAt).not.toBeNull();
    const notes = await db().customerNotification.findMany({ where: { userId: maya.id } });
    expect(notes).toMatchObject([
      { title: 'Your email is verified', body: `${MAYA} is confirmed for appointment updates.` },
    ]);

    const reused = await verify(token);
    expect(reused.status).toBe(422);
    expect(reused.body).toMatchObject({ code: 'invalid_token' });
  });

  it('Given an altered or expired link, when it is opened, then no account changes', async () => {
    const maya = await createCustomer({ verified: false });
    await resend(MAYA);
    const token = await tokenSentTo(MAYA);

    const altered = await verify(`${token}x`);
    expect(altered.status).toBe(422);
    expect(altered.body).toMatchObject({ code: 'invalid_token' });

    await db().emailVerification.updateMany({ data: { expiresAt: new Date(Date.now() - 1000) } });
    const expired = await verify(token);
    expect(expired.status).toBe(422);
    expect(expired.body).toMatchObject({ code: 'invalid_token' });

    const user = await db().user.findUniqueOrThrow({ where: { id: maya.id } });
    expect(user.emailVerifiedAt).toBeNull();
  });

  it('Given a stored verification, when it is inspected, then only a hash of the token is kept', async () => {
    await createCustomer({ verified: false });
    await resend(MAYA);
    const token = await tokenSentTo(MAYA);

    const rows = await db().emailVerification.findMany();
    expect(rows).toHaveLength(1);
    expect(rows[0]?.id).not.toBe(token);
    expect(JSON.stringify(rows)).not.toContain(token);
  });

  it('Given an unknown or verified email, when a resend is requested, then the answer is the same and no link is sent', async () => {
    await createCustomer();

    const verified = await resend(MAYA);
    const unknown = await resend('nobody@example.com');

    expect(verified.status).toBe(202);
    expect(unknown.status).toBe(202);
    expect(verified.body).toEqual(unknown.body);
    expect(await db().outboundEmail.count()).toBe(0);
  });

  it('Given repeated resend requests, when the limit is passed, then the next is refused with a retry indication', async () => {
    await createCustomer({ verified: false });
    const api = new Api();
    for (let i = 0; i < 3; i++) expect((await resend(MAYA, api)).status).toBe(202);

    const limited = await resend(MAYA, api);

    expect(limited.status).toBe(429);
    expect(limited.body).toMatchObject({ retryAfter: expect.any(Number) });
    expect(await emailsTo(MAYA)).toHaveLength(3);
  });

  it('Given an invalid email, when a resend is requested, then the email field is refused', async () => {
    const response = await resend('maya@');

    expect(response.status).toBe(422);
    expect(response.body).toMatchObject({ errors: { email: expect.any(Array) } });
  });
});
