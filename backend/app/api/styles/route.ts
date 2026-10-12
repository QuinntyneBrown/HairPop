import { NextResponse } from 'next/server';
import { z } from 'zod';
import { listPublishedStyles } from '@/application/discovery/list-published-styles';
import { STYLE_CATEGORIES } from '@/domain/style';
import { route } from '@/http/route';
import { pageParam } from '@/http/query';
import { parseQuery } from '@/http/validation';

const StylesQuery = z.object({
  search: z.string().trim().max(80).optional(),
  category: z.enum(STYLE_CATEGORIES).optional(),
  page: pageParam,
});

export const GET = route(
  async (request) => NextResponse.json(await listPublishedStyles(parseQuery(request, StylesQuery))),
  { anonymous: true },
);
