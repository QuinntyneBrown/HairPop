// Acceptance Test: L2-030 AC1–3
// Given owned read and unread updates, the newest appear first; acknowledging one changes
// both its state and the persisted unread count. An empty list has its own state.

import { expect, test } from '../fixtures/api';
import { maya, signedIn } from '../fixtures/session';
import { NotificationsPage } from '../pages/notifications.page';

const updates = [
  {
    id: 'new',
    title: 'Nia received your request',
    body: 'She will confirm the time and final price.',
    createdAt: '2026-10-10T09:42:00-04:00',
    read: false,
    link: '/appointments/HP-1048',
  },
  {
    id: 'old',
    title: 'Your email is verified',
    body: 'maya.chen@example.com is confirmed.',
    createdAt: '2026-10-08T12:00:00-04:00',
    read: true,
    link: '/settings',
  },
];

test('owned updates show newest first and a read action updates the count', async ({
  page,
  api,
}) => {
  await api.given(
    signedIn(maya),
    {
      method: 'GET',
      path: '/api/notifications',
      body: {
        data: updates,
        meta: { page: 1, perPage: 12, total: 2, lastPage: 1, unreadCount: 1 },
      },
    },
    {
      method: 'POST',
      path: '/api/notifications/new/read',
      body: { unreadCount: 0 },
    },
  );
  const notifications = new NotificationsPage(page);
  await notifications.open();
  await expect(notifications.heading).toBeVisible();
  await expect(notifications.updates.getByRole('listitem')).toHaveText([
    /Nia received your request/,
    /Your email is verified/,
  ]);
  await expect(notifications.item('Nia received your request')).toHaveClass(/list__item--unread/);
  await notifications.markRead('Nia received your request');
  await expect(notifications.item('Nia received your request')).not.toHaveClass(
    /list__item--unread/,
  );
  await expect(page.getByRole('main')).toContainText('All caught up');
  expect(api.requests('POST', '/api/notifications/new/read')).toHaveLength(1);
});

test('an empty center explains there are no updates', async ({ page, api }) => {
  await api.given(signedIn(maya), {
    method: 'GET',
    path: '/api/notifications',
    body: { data: [], meta: { page: 1, perPage: 12, total: 0, lastPage: 1, unreadCount: 0 } },
  });
  const notifications = new NotificationsPage(page);
  await notifications.open();
  await expect(page.getByRole('main')).toContainText('No notifications yet');
});

test('mark all acknowledges the persisted result and removes unread actions', async ({
  page,
  api,
}) => {
  await api.given(
    signedIn(maya),
    {
      method: 'GET',
      path: '/api/notifications',
      body: {
        data: updates,
        meta: { page: 1, perPage: 12, total: 2, lastPage: 1, unreadCount: 1 },
      },
    },
    {
      method: 'POST',
      path: '/api/notifications/read-all',
      body: { unreadCount: 0 },
    },
  );
  const notifications = new NotificationsPage(page);
  await notifications.open();
  await notifications.markAll.click();
  await expect(notifications.item('Nia received your request')).not.toHaveClass(
    /list__item--unread/,
  );
  await expect(notifications.markAll).toBeHidden();
  await expect(page.getByRole('main')).toContainText('All caught up');
  expect(api.requests('POST', '/api/notifications/read-all')).toHaveLength(1);
});

test('a failed read leaves the update unread and offers a retry', async ({ page, api }) => {
  await api.given(
    signedIn(maya),
    {
      method: 'GET',
      path: '/api/notifications',
      body: {
        data: updates,
        meta: { page: 1, perPage: 12, total: 2, lastPage: 1, unreadCount: 1 },
      },
    },
    {
      method: 'POST',
      path: '/api/notifications/new/read',
      status: 503,
      body: { message: 'Unavailable.' },
    },
  );
  const notifications = new NotificationsPage(page);
  await notifications.open();
  await notifications.markRead('Nia received your request');
  await expect(notifications.item('Nia received your request')).toHaveClass(/list__item--unread/);
  await expect(notifications.readError).toBeVisible();
});

test('the top bar shows the persisted unread count and refreshes it after reading', async ({
  page,
  api,
}) => {
  await api.given(
    signedIn(maya),
    {
      method: 'GET',
      path: '/api/notifications/unread-count',
      body: { count: 1 },
    },
    {
      method: 'GET',
      path: '/api/notifications',
      body: {
        data: updates,
        meta: { page: 1, perPage: 12, total: 2, lastPage: 1, unreadCount: 1 },
      },
    },
    {
      method: 'POST',
      path: '/api/notifications/new/read',
      body: { unreadCount: 0 },
    },
  );
  const notifications = new NotificationsPage(page);
  await notifications.open();
  await expect(notifications.updatesLink).toContainText('1');
  await notifications.markRead('Nia received your request');
  await expect(notifications.updatesLink).toHaveText('Updates');
  expect(api.requests('GET', '/api/notifications/unread-count')).toHaveLength(1);
});

test('the center pages through older owned updates', async ({ page, api }) => {
  await api.given(
    signedIn(maya),
    {
      method: 'GET',
      path: '/api/notifications',
      query: { page: '1' },
      body: {
        data: [updates[0]],
        meta: { page: 1, perPage: 12, total: 13, lastPage: 2, unreadCount: 1 },
      },
    },
    {
      method: 'GET',
      path: '/api/notifications',
      query: { page: '2' },
      body: {
        data: [updates[1]],
        meta: { page: 2, perPage: 12, total: 13, lastPage: 2, unreadCount: 1 },
      },
    },
  );
  const notifications = new NotificationsPage(page);
  await notifications.open();
  await expect(notifications.updates).toContainText('Nia received your request');
  await notifications.nextPage.click();
  await expect(notifications.updates).toContainText('Your email is verified');
  await expect(notifications.updates).not.toContainText('Nia received your request');
  expect(api.requests('GET', '/api/notifications').map((r) => r.query.get('page'))).toEqual([
    '1',
    '2',
  ]);
});
