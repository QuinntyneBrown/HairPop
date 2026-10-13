// Acceptance Test
// Traces to: L2-014, L2-029, L2-038, L2-039
import { describe, expect, it } from 'vitest';
import { Api } from '../support/api';
import { signedIn } from '../support/auth';
import { db } from '../support/db';
import { emailsTo, tokenSentTo } from '../support/emails';
import { createBraiderUser, createCustomer } from '../support/factories';

const MAYA = 'maya.chen@example.com';

describe('Account details', () => {
  it('Given a signed-in customer, when they open their account, then only their own details are returned', async () => {
    await createCustomer();
    await createCustomer({ name: 'Kemi Adebayo', email: 'kemi.adebayo@example.com', phone: null });

    const response = await (await signedIn(MAYA)).get('/api/account');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      name: 'Maya Chen',
      email: MAYA,
      emailVerified: true,
      pendingEmail: null,
      phone: '416-555-0148',
    });
  });

  it('Given no session, when the account is requested or changed, then it is refused', async () => {
    const api = new Api();
    await api.csrf();

    expect((await api.get('/api/account')).status).toBe(401);
    expect((await api.patch('/api/account', { name: 'X', email: MAYA, phone: null })).status).toBe(
      401,
    );
  });

  it('Given a braider session, when the customer account is requested, then it is refused', async () => {
    await createBraiderUser();

    const response = await (await signedIn('nia.okafor@example.com')).get('/api/account');

    expect(response.status).toBe(403);
  });

  it('Given valid changed name and phone, when the customer saves, then their account reflects them and an update is recorded', async () => {
    const maya = await createCustomer();
    const api = await signedIn(MAYA);

    const response = await api.patch('/api/account', {
      name: '  Maya L. Chen ',
      email: MAYA,
      phone: ' 647-555-0199 ',
    });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      name: 'Maya L. Chen',
      email: MAYA,
      emailVerified: true,
      pendingEmail: null,
      phone: '647-555-0199',
    });
    expect((await api.get('/api/account')).body).toEqual(response.body);
    expect(await db().customerNotification.findMany({ where: { userId: maya.id } })).toMatchObject([
      { title: 'Details updated', link: '/settings' },
    ]);
    expect(await db().outboundEmail.count()).toBe(0);
  });

  it('Given a blank phone, when the customer saves, then the phone is removed', async () => {
    await createCustomer();
    const api = await signedIn(MAYA);

    const response = await api.patch('/api/account', { name: 'Maya Chen', email: MAYA, phone: '' });

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({ phone: null });
  });

  it('Given a changed email, when it is saved, then it stays pending and unverified until its link is opened', async () => {
    const maya = await createCustomer();
    const api = await signedIn(MAYA);

    const response = await api.patch('/api/account', {
      name: 'Maya Chen',
      email: 'Maya.Chen@NewMail.example',
      phone: null,
    });

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      email: MAYA,
      emailVerified: true,
      pendingEmail: 'maya.chen@newmail.example',
    });
    expect(await db().customerNotification.findMany({ where: { userId: maya.id } })).toMatchObject([
      { title: 'Verify your new email', body: 'Updates go to your old address until you do.' },
    ]);

    await api.post('/api/email/verify', { token: await tokenSentTo('maya.chen@newmail.example') });

    expect((await api.get('/api/account')).body).toMatchObject({
      email: 'maya.chen@newmail.example',
      emailVerified: true,
      pendingEmail: null,
    });
  });

  it('Given a new email that belongs to another account, when it is saved, then the answer is the same but no link is sent', async () => {
    await createCustomer();
    await createCustomer({ name: 'Kemi Adebayo', email: 'kemi.adebayo@example.com' });
    const api = await signedIn(MAYA);

    const response = await api.patch('/api/account', {
      name: 'Maya Chen',
      email: 'kemi.adebayo@example.com',
      phone: null,
    });

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({ email: MAYA, pendingEmail: 'kemi.adebayo@example.com' });
    const emails = await emailsTo('kemi.adebayo@example.com');
    expect(emails).toHaveLength(1);
    expect(emails[0]?.text).not.toMatch(/token=/);
  });

  it('Given an invalid email, phone or blank name, when the customer saves, then the fields are named and nothing is stored', async () => {
    await createCustomer();
    const api = await signedIn(MAYA);

    const response = await api.patch('/api/account', {
      name: ' ',
      email: 'maya.chen@example',
      phone: 'call me <script>',
    });

    expect(response.status).toBe(422);
    expect(response.body).toEqual({
      message: 'The given data was invalid.',
      errors: {
        name: ['Enter your name.'],
        email: ['Enter an email address like name@example.com.'],
        phone: ['Enter a phone number, like 416-555-0148.'],
      },
    });
    expect((await api.get('/api/account')).body).toMatchObject({ name: 'Maya Chen', email: MAYA });
  });
});
