import type { NextResponse } from 'next/server';

/** HTTP-only cookie holding the opaque session token (ADR 0008). */
export const SESSION_COOKIE = 'hp_session';

export function setSessionCookie(response: NextResponse, token: string, expires: Date): void {
  response.cookies.set(SESSION_COOKIE, token, {
    path: '/',
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    expires,
  });
}
