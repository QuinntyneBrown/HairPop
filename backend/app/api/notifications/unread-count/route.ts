import { NextResponse } from 'next/server';
import { unreadCount } from '@/application/notifications/read-notifications';
import { route } from '@/http/route';

export const GET = route(
  async (_request, { user }) => NextResponse.json({ count: await unreadCount(user.id) }),
  { role: 'customer' },
);
