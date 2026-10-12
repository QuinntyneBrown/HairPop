import { NextResponse } from 'next/server';
import { z } from 'zod';
import { listNotifications } from '@/application/notifications/read-notifications';
import { pageParam } from '@/http/query';
import { route } from '@/http/route';
import { parseQuery } from '@/http/validation';

const NotificationsQuery = z.object({ page: pageParam });

export const GET = route(
  async (request, { user }) => {
    const { page } = parseQuery(request, NotificationsQuery);
    return NextResponse.json(await listNotifications(user.id, page));
  },
  { role: 'customer' },
);
