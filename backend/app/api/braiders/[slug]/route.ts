import { NextResponse } from 'next/server';
import { getPublishedBraider } from '@/application/profiles/get-published-braider';
import { notFound } from '@/http/api-error';
import { route } from '@/http/route';

export const GET = route(
  async (_request, { params }) => {
    const profile = await getPublishedBraider(String(params.slug));
    if (!profile) throw notFound();
    return NextResponse.json(profile);
  },
  { anonymous: true },
);
