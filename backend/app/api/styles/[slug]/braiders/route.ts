import { NextResponse } from 'next/server';
import { findEligibleBraidersForStyle } from '@/application/matching/find-eligible-braiders';
import { ApiError, notFound } from '@/http/api-error';
import { MatchQuery } from '@/http/match-query';
import { route } from '@/http/route';
import { parseQuery } from '@/http/validation';

export const GET = route(
  async (request, { params }) => {
    const result = await findEligibleBraidersForStyle(
      String(params.slug),
      parseQuery(request, MatchQuery),
    );
    switch (result.outcome) {
      case 'unknown_style':
        throw notFound();
      case 'price_below_minimum':
        throw new ApiError(422, {
          message: 'The given data was invalid.',
          errors: {
            maxPrice: [
              `Enter a maximum price of at least $${result.minPrice}, the lowest price for this style.`,
            ],
          },
        });
      case 'found':
        return NextResponse.json(result.page);
    }
  },
  { anonymous: true },
);
