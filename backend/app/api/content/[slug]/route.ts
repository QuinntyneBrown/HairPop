import { NextResponse } from 'next/server';
import {
  CONTENT_SLUGS,
  getPublishedContent,
} from '@/application/information/get-published-content';
import { notFound } from '@/http/api-error';
import { route } from '@/http/route';

const isContentSlug = (slug: unknown): slug is (typeof CONTENT_SLUGS)[number] =>
  CONTENT_SLUGS.includes(slug as (typeof CONTENT_SLUGS)[number]);

export const GET = route(
  async (_request, { params }) => {
    const content = isContentSlug(params.slug) ? await getPublishedContent(params.slug) : null;
    if (!content) throw notFound();
    return NextResponse.json(content);
  },
  { anonymous: true },
);
