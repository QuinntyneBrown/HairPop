import { hash, verify } from '@node-rs/argon2';

// @node-rs/argon2 defaults to argon2id (ADR 0008).
export function hashPassword(password: string): Promise<string> {
  return hash(password);
}

export function verifyPassword(passwordHash: string, password: string): Promise<boolean> {
  return verify(passwordHash, password);
}

let dummyHash: Promise<string> | undefined;

/** Spends the same time as a real check, so an unknown email is not revealed by timing. */
export async function verifyAgainstDummy(password: string): Promise<false> {
  dummyHash ??= hash('hairpop-dummy-password');
  await verify(await dummyHash, password);
  return false;
}
