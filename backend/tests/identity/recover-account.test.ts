// Acceptance Test
// Traces to: L2-012, L2-029, L2-039, L2-040
import { describe, expect, it } from 'vitest';
import { verifyPassword } from '../../src/infrastructure/password';
import { Api } from '../support/api';
import { signedIn } from '../support/auth';
import { db } from '../support/db';
import { emailsTo, tokenSentTo } from '../support/emails';
import { createCustomer, PASSWORD } from '../support/factories';

const MAYA = 'maya.chen@example.com';
const NEW_PASSWORD = 'a brand new long password';

async function forgot(email: string, api = new Api()) {
  await api.csrf();
  return api.post('/api/auth/forgot-password', { email });
}

async function reset(body: Record<string, unknown>) {
  const api = new Api();
  await api.csrf();
  return api.post('/api/auth/reset-password', {
    email: MAYA,
    password: NEW_PASSWORD,
    passwordConfirmation: NEW_PASSWORD,
    ...body,
  });
}

async function storedHash(id: string) {
  return (await db().user.findUniqueOrThrow({ where: { id } })).passwordHash;
}

describe('Password recovery', () => {
  it('Given a known and an unknown email, when a reset is requested, then both get the same neutral answer and only the account is emailed', async () => {
    await createCustomer();

    const known = await forgot(' Maya.Chen@example.com ');
    const unknown = await forgot('nobody@example.com');

    expect(known.status).toBe(202);
    expect(unknown.status).toBe(202);
    expect(known.body).toEqual(unknown.body);
    const emails = await emailsTo(MAYA);
    expect(emails).toHaveLength(1);
    expect(emails[0]?.subject).toBe('Reset your HairPop password');
    expect(emails[0]?.text).toMatch(
      /\/reset-password\?token=[\w-]{20,}&email=maya\.chen%40example\.com/,
    );
    expect(await emailsTo('nobody@example.com')).toHaveLength(0);
  });

  it('Given a valid unused link and matching passwords, when they are saved, then the password changes, other sessions end and the link cannot be reused', async () => {
    const maya = await createCustomer();
    const elsewhere = await signedIn(MAYA);
    await forgot(MAYA);
    const token = await tokenSentTo(MAYA);

    const response = await reset({ token });

    expect(response.status).toBe(200);
    expect(await verifyPassword(await storedHash(maya.id), NEW_PASSWORD)).toBe(true);
    expect((await elsewhere.get('/api/session')).status).toBe(401);
    const notes = await db().customerNotification.findMany({ where: { userId: maya.id } });
    expect(notes).toMatchObject([{ title: 'Your password was changed' }]);

    const reused = await reset({
      token,
      password: 'another long password',
      passwordConfirmation: 'another long password',
    });
    expect(reused.status).toBe(422);
    expect(reused.body).toMatchObject({ code: 'invalid_token' });
    expect(await verifyPassword(await storedHash(maya.id), NEW_PASSWORD)).toBe(true);
  });

  it('Given an expired link or a link for another email, when a reset is attempted, then the password stays unchanged', async () => {
    const maya = await createCustomer();
    await forgot(MAYA);
    const token = await tokenSentTo(MAYA);

    const wrongEmail = await reset({ token, email: 'kemi.adebayo@example.com' });
    expect(wrongEmail.status).toBe(422);
    expect(wrongEmail.body).toMatchObject({ code: 'invalid_token' });

    await db().passwordReset.updateMany({ data: { expiresAt: new Date(Date.now() - 1000) } });
    const expired = await reset({ token });
    expect(expired.status).toBe(422);
    expect(expired.body).toMatchObject({ code: 'invalid_token' });

    expect(await verifyPassword(await storedHash(maya.id), PASSWORD)).toBe(true);
  });

  it('Given mismatched or short passwords, when a reset is attempted, then field errors appear and the link still works', async () => {
    const maya = await createCustomer();
    await forgot(MAYA);
    const token = await tokenSentTo(MAYA);

    const short = await reset({ token, password: 'too short', passwordConfirmation: 'too short' });
    expect(short.status).toBe(422);
    expect(short.body).toMatchObject({ errors: { password: ['Use at least 12 characters.'] } });

    const mismatched = await reset({ token, passwordConfirmation: 'a different long password' });
    expect(mismatched.status).toBe(422);
    expect(mismatched.body).toMatchObject({
      errors: { passwordConfirmation: ['Enter the same password again.'] },
    });

    expect(await verifyPassword(await storedHash(maya.id), PASSWORD)).toBe(true);
    expect((await reset({ token })).status).toBe(200);
  });

  it('Given a stored reset, when it is inspected, then only a hash of the token is kept', async () => {
    await createCustomer();
    await forgot(MAYA);
    const token = await tokenSentTo(MAYA);

    expect(JSON.stringify(await db().passwordReset.findMany())).not.toContain(token);
  });

  it('Given repeated reset requests, when the limit is passed, then the next is refused with a retry indication', async () => {
    await createCustomer();
    const api = new Api();
    for (let i = 0; i < 3; i++) expect((await forgot(MAYA, api)).status).toBe(202);

    const limited = await forgot(MAYA, api);

    expect(limited.status).toBe(429);
    expect(limited.body).toMatchObject({ retryAfter: expect.any(Number) });
    expect(await emailsTo(MAYA)).toHaveLength(3);
  });

  it('Given a syntactically invalid email, when a reset is requested, then the email field is refused', async () => {
    const response = await forgot('maya.chen@');

    expect(response.status).toBe(422);
    expect(response.body).toMatchObject({ errors: { email: expect.any(Array) } });
  });
});
