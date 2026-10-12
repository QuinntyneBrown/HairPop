import { db } from './db';

/** Emails queued for an address, oldest first. */
export function emailsTo(address: string) {
  return db().outboundEmail.findMany({ where: { to: address }, orderBy: { createdAt: 'asc' } });
}

/** The `token` query parameter of the link in the newest email to an address. */
export async function tokenSentTo(address: string): Promise<string> {
  const emails = await emailsTo(address);
  const text = emails.at(-1)?.text ?? '';
  const token = /[?&]token=([\w-]+)/.exec(text)?.[1];
  if (!token) throw new Error(`No token link in the latest email to ${address}.`);
  return token;
}
