import { NextResponse } from 'next/server';
import { clearSessionCookie, SESSION_COOKIE } from '@/application/auth/session-cookie';
import { signOut } from '@/application/auth/sign-out';
import { route } from '@/http/route';

export const POST = route(async (request) => {
  // withAuth has already confirmed this cookie names a live session.
  await signOut(request.cookies.get(SESSION_COOKIE)?.value ?? '');
  const response = new NextResponse(null, { status: 204 });
  clearSessionCookie(response);
  return response;
});
