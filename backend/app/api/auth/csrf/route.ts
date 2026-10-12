import { NextResponse } from 'next/server';
import { CSRF_COOKIE, issueCsrfToken } from '@/application/auth/csrf-token';
import { route } from '@/http/route';

export const GET = route(
  async () => {
    const response = new NextResponse(null, { status: 204 });
    response.cookies.set(CSRF_COOKIE, issueCsrfToken(), {
      path: '/',
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      httpOnly: false,
    });
    return response;
  },
  { anonymous: true },
);
