import { NextResponse } from 'next/server';
import { getVisitCare } from '@/application/aftercare/care';
import { notFound } from '@/http/api-error';
import { route } from '@/http/route';

export const GET = route(
  async (_request, { user, params }) => {
    const care = await getVisitCare(user.id, String(params.ref));
    if (!care) throw notFound();
    return NextResponse.json(care);
  },
  { role: 'customer' },
);
