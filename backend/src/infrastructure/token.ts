import { createHash, randomBytes } from 'node:crypto';

/** SHA-256 of a link or session token; only the hash is ever stored (L2-039). */
export function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

/** A fresh URL-safe secret and its hash. */
export function newToken(): { token: string; hash: string } {
  const token = randomBytes(32).toString('base64url');
  return { token, hash: hashToken(token) };
}
