import { NextResponse } from 'next/server';
import { z } from 'zod';
import { resendVerification } from '@/application/identity/resend-verification';
import { tooManyAttempts } from '@/http/api-error';
import { emailField } from '@/http/fields';
import { route } from '@/http/route';
import { parseBody } from '@/http/validation';

const ResendBody = z.object({ email: emailField });

export const POST = route(
  async (request) => {
    const result = await resendVerification((await parseBody(request, ResendBody)).email);
    if (result.outcome === 'rate_limited') throw tooManyAttempts(result.retryAfter);
    return new NextResponse(null, { status: 202 });
  },
  { anonymous: true },
);
