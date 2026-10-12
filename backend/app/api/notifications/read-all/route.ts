import { NextResponse } from 'next/server';
import { markAllRead } from '@/application/notifications/read-notifications';
import { route } from '@/http/route';

export const POST = route(
  async (_request, { user }) => {
    await markAllRead(user.id);
    return NextResponse.json({ unreadCount: 0 });
  },
  { role: 'customer' },
);
