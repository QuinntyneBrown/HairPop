import { NextResponse } from 'next/server';
import { getPublishedStyle } from '@/application/discovery/get-published-style';
import { notFound } from '@/http/api-error';
import { route } from '@/http/route';

export const GET = route(
  async (_request, { params }) => {
    const style = await getPublishedStyle(String(params.slug));
    if (!style) throw notFound();
    return NextResponse.json(style);
  },
  { anonymous: true },
);
