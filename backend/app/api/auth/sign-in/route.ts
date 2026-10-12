import { NextResponse } from 'next/server';
import { z } from 'zod';
import { setSessionCookie } from '@/application/auth/session-cookie';
import { signIn } from '@/application/auth/sign-in';
import { ApiError, tooManyAttempts } from '@/http/api-error';
import { route } from '@/http/route';
import { parseBody } from '@/http/validation';

const SignInBody = z.object({
  email: z.string().min(1).max(254),
  password: z.string().min(1).max(1024),
  audience: z.enum(['customer', 'braider']),
});

export const POST = route(
  async (request) => {
    const result = await signIn(await parseBody(request, SignInBody));

    switch (result.outcome) {
      case 'rate_limited':
        throw tooManyAttempts(result.retryAfter);
      case 'invalid_credentials':
        throw new ApiError(422, { message: 'These credentials do not match our records.' });
      case 'not_braider':
        throw new ApiError(403, {
          message: 'This app is for braider accounts.',
          code: 'not_braider',
        });
      case 'signed_in': {
        const response = NextResponse.json({ user: result.user });
        setSessionCookie(response, result.token, result.expiresAt);
        return response;
      }
    }
  },
  { anonymous: true },
);
