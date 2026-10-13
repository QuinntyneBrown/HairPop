import { NextResponse } from 'next/server';
import { z } from 'zod';
import { verifyEmail } from '@/application/identity/verify-email';
import { ApiError } from '@/http/api-error';
import { route } from '@/http/route';
import { parseBody } from '@/http/validation';

const VerifyBody = z.object({ token: z.string().min(1).max(256) });

export const POST = route(
  async (request) => {
    const result = await verifyEmail((await parseBody(request, VerifyBody)).token);
    if (result.outcome === 'invalid_token') throw invalidToken();
    return NextResponse.json({ email: result.email });
  },
  { anonymous: true },
);

function invalidToken() {
  return new ApiError(422, {
    message: 'This link has expired or was already used.',
    code: 'invalid_token',
  });
}
