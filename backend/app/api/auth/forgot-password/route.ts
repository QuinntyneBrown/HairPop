import { NextResponse } from 'next/server';
import { z } from 'zod';
import { requestPasswordReset } from '@/application/identity/request-password-reset';
import { tooManyAttempts } from '@/http/api-error';
import { route } from '@/http/route';
import { parseBody } from '@/http/validation';

const ForgotBody = z.object({
  email: z
    .string()
    .trim()
    .max(254, 'Use at most 254 characters.')
    .email('Enter the email address on your account, like name@example.com.'),
});

export const POST = route(
  async (request) => {
    const result = await requestPasswordReset((await parseBody(request, ForgotBody)).email);
    if (result.outcome === 'rate_limited') throw tooManyAttempts(result.retryAfter);
    return new NextResponse(null, { status: 202 });
  },
  { anonymous: true },
);
