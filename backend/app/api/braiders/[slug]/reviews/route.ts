import { NextResponse } from 'next/server';
import { z } from 'zod';
import { listPublishedReviews } from '@/application/profiles/list-published-reviews';
import { notFound } from '@/http/api-error';
import { pageParam } from '@/http/query';
import { route } from '@/http/route';
import { parseQuery } from '@/http/validation';

const ReviewsQuery = z.object({ page: pageParam });

export const GET = route(
  async (request, { params }) => {
    const { page } = parseQuery(request, ReviewsQuery);
    const reviews = await listPublishedReviews(String(params.slug), page);
    if (!reviews) throw notFound();
    return NextResponse.json(reviews);
  },
  { anonymous: true },
);
