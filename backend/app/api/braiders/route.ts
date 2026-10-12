import { NextResponse } from 'next/server';
import { findEligibleBraiders } from '@/application/matching/find-eligible-braiders';
import { MatchQuery } from '@/http/match-query';
import { route } from '@/http/route';
import { parseQuery } from '@/http/validation';

export const GET = route(
  async (request) => NextResponse.json(await findEligibleBraiders(parseQuery(request, MatchQuery))),
  { anonymous: true },
);
