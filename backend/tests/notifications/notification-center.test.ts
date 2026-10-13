// Acceptance Test
// Traces to: L2-029, L2-030, L2-038
import { describe, expect, it } from 'vitest';
import { Api } from '../support/api';
import { signedIn } from '../support/auth';
import { createCustomer, createNotification } from '../support/factories';

const MAYA = 'maya.chen@example.com';

async function twoCustomers() {
  const maya = await createCustomer();
  const kemi = await createCustomer({ name: 'Kemi Adebayo', email: 'kemi.adebayo@example.com' });
  return { maya, kemi };
}

describe('Notification center', () => {
  it('Given read and unread notifications, when their owner opens the center, then the newest comes first with its state and unread count', async () => {
    const { maya, kemi } = await twoCustomers();
    const older = await createNotification(maya.id, {
      title: 'Your email is verified',
      body: 'maya.chen@example.com is confirmed.',
      link: '/settings',
      createdAt: new Date('2026-10-08T14:00:00Z'),
      readAt: new Date('2026-10-08T15:00:00Z'),
    });
    const newer = await createNotification(maya.id, {
      createdAt: new Date('2026-10-10T13:42:00Z'),
    });
    await createNotification(kemi.id, { title: 'Kemi’s update' });

    const response = await (await signedIn(MAYA)).get('/api/notifications');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      data: [
        {
          id: newer.id,
          title: 'Nia received your request',
          body: 'She will confirm the time and final price.',
          createdAt: '2026-10-10T13:42:00.000Z',
          read: false,
          link: '/appointments/HP-1048',
        },
        {
          id: older.id,
          title: 'Your email is verified',
          body: 'maya.chen@example.com is confirmed.',
          createdAt: '2026-10-08T14:00:00.000Z',
          read: true,
          link: '/settings',
        },
      ],
      meta: { page: 1, perPage: 12, total: 2, lastPage: 1, unreadCount: 1 },
    });
  });

  it('Given no notifications, when the center loads, then it is empty', async () => {
    await createCustomer();

    const response = await (await signedIn(MAYA)).get('/api/notifications');

    expect(response.body).toEqual({
      data: [],
      meta: { page: 1, perPage: 12, total: 0, lastPage: 1, unreadCount: 0 },
    });
  });

  it('Given more notifications than a page holds, when the next page is requested, then it holds the oldest', async () => {
    const maya = await createCustomer();
    for (let day = 1; day <= 13; day++) {
      await createNotification(maya.id, {
        title: `Update ${day}`,
        createdAt: new Date(Date.UTC(2026, 8, day)),
      });
    }

    const response = await (await signedIn(MAYA)).get('/api/notifications?page=2');

    expect(response.body).toMatchObject({
      data: [{ title: 'Update 1' }],
      meta: { page: 2, total: 13, lastPage: 2, unreadCount: 13 },
    });
  });

  it('Given an unread notification, when its owner marks it read twice, then the unread count drops once and it stays listed as read', async () => {
    const maya = await createCustomer();
    const first = await createNotification(maya.id);
    await createNotification(maya.id);
    const api = await signedIn(MAYA);

    expect((await api.get('/api/notifications/unread-count')).body).toEqual({ count: 2 });
    const once = await api.post(`/api/notifications/${first.id}/read`);
    const twice = await api.post(`/api/notifications/${first.id}/read`);

    expect(once.status).toBe(200);
    expect(once.body).toEqual({ unreadCount: 1 });
    expect(twice.body).toEqual({ unreadCount: 1 });
    const list = await api.get<{ data: { id: string; read: boolean }[] }>('/api/notifications');
    expect(list.body.data.find((item) => item.id === first.id)?.read).toBe(true);
  });

  it('Given another customer’s notification, when someone marks it read, then it is not found and stays unread', async () => {
    const { maya, kemi } = await twoCustomers();
    const kemis = await createNotification(kemi.id);
    const api = await signedIn(MAYA);

    const response = await api.post(`/api/notifications/${kemis.id}/read`);
    const unknown = await api.post('/api/notifications/nope/read');

    expect(response.status).toBe(404);
    expect(unknown.status).toBe(404);
    const kemiApi = await signedIn('kemi.adebayo@example.com');
    expect((await kemiApi.get('/api/notifications/unread-count')).body).toEqual({ count: 1 });
    expect(maya.id).not.toBe(kemi.id);
  });

  it('Given several unread notifications, when the owner marks all read, then only theirs are read', async () => {
    const { maya, kemi } = await twoCustomers();
    await createNotification(maya.id);
    await createNotification(maya.id);
    await createNotification(kemi.id);
    const api = await signedIn(MAYA);

    const response = await api.post('/api/notifications/read-all');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ unreadCount: 0 });
    const kemiApi = await signedIn('kemi.adebayo@example.com');
    expect((await kemiApi.get('/api/notifications/unread-count')).body).toEqual({ count: 1 });
  });

  it('Given no session, when notifications are requested, then they are refused', async () => {
    expect((await new Api().get('/api/notifications')).status).toBe(401);
    expect((await new Api().get('/api/notifications/unread-count')).status).toBe(401);
  });
});
