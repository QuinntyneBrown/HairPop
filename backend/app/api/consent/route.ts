import { NextResponse } from 'next/server';
import { z } from 'zod';
import { authenticate } from '@/application/auth/authenticate';
import { SESSION_COOKIE } from '@/application/auth/session-cookie';
import { saveOptionalConsent } from '@/application/privacy/save-consent';
import { route } from '@/http/route';
import { parseBody } from '@/http/validation';

const ConsentBody = z.object({ optionalUsage: z.boolean() });

/** Anonymous by design (L2-034 AC4); a signed-in customer's choice is also noted in their updates. */
export const PUT = route(
  async (request) => {
    const { optionalUsage } = await parseBody(request, ConsentBody);
    const user = await authenticate(request.cookies.get(SESSION_COOKIE)?.value);
    const customerId = user?.role === 'customer' ? user.id : null;
    return NextResponse.json(await saveOptionalConsent(optionalUsage, customerId));
  },
  { anonymous: true },
);
