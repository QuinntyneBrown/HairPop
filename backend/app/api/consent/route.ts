import { NextResponse } from 'next/server';
import { z } from 'zod';
import { saveOptionalConsent } from '@/application/privacy/save-consent';
import { route } from '@/http/route';
import { parseBody } from '@/http/validation';

const ConsentBody = z.object({ optionalUsage: z.boolean() });

export const PUT = route(
  async (request) => {
    const { optionalUsage } = await parseBody(request, ConsentBody);
    return NextResponse.json(await saveOptionalConsent(optionalUsage));
  },
  { anonymous: true },
);
