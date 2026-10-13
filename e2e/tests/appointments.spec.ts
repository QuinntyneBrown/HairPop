// Acceptance Test
// Traces to: L2-018, L2-019, L2-024, L2-037
// Given customer-owned appointments, when their list and details load, then the lifecycle facts
// are accurate and private location is disclosed only after acceptance.

import { expect, test } from '../fixtures/api';
import {
  appointmentDetail,
  appointmentList,
  confirmedAppointment,
  pendingAppointment,
} from '../fixtures/appointments';
import { maya, signedIn } from '../fixtures/session';
import { bookingOptions } from '../fixtures/booking';
import { AppointmentsPage } from '../pages/appointments.page';

test('an anonymous visitor is sent to sign-in before loading appointments', async ({
  page,
  api,
}) => {
  const appointments = new AppointmentsPage(page);
  await appointments.openList();
  await expect(page).toHaveURL(/\/sign-in\?returnUrl=%2Fappointments/);
  expect(api.requests('GET', '/api/appointments')).toEqual([]);
});

test('the list shows the customer’s pending request and opens its detail', async ({
  page,
  api,
}) => {
  await api.given(signedIn(maya), appointmentList(), appointmentDetail());
  const appointments = new AppointmentsPage(page);
  await appointments.openList();
  await expect(appointments.heading).toHaveText('My appointments');
  await expect(page.getByRole('main')).toContainText('Nia Okafor');
  await expect(appointments.pending).toBeVisible();
  await appointments.detail.click();
  await expect(page).toHaveURL('/appointments/HP-1048');
});

test('pending detail keeps the studio address private and calls price an estimate', async ({
  page,
  api,
}) => {
  await api.given(signedIn(maya), appointmentDetail(pendingAppointment));
  const appointments = new AppointmentsPage(page);
  await appointments.openDetail();
  await expect(page.getByRole('main')).toContainText('Awaiting reply');
  await expect(page.getByRole('main')).toContainText(/estimate/i);
  await expect(page.getByRole('main')).toContainText('Bring extensions.');
  await expect(page.getByRole('main')).not.toContainText('42 Queen Street West');
});

test('confirmed detail shows the agreed amount and authorized address', async ({ page, api }) => {
  await api.given(signedIn(maya), appointmentDetail(confirmedAppointment));
  const appointments = new AppointmentsPage(page);
  await appointments.openDetail();
  await expect(page.getByRole('main')).toContainText('Confirmed');
  await expect(page.getByRole('main')).toContainText('$205');
  await expect(page.getByRole('main')).toContainText('42 Queen Street West');
});

test('an unknown or other-customer reference reveals no details', async ({ page, api }) => {
  await api.given(signedIn(maya), {
    method: 'GET',
    path: '/api/appointments/HP-1048',
    status: 404,
    body: { message: 'Not found.' },
  });
  const appointments = new AppointmentsPage(page);
  await appointments.openDetail();
  await expect(page.getByRole('main')).toContainText('You can’t open this page');
  await expect(page.getByRole('main')).not.toContainText('Medium knotless braids');
});

test('the customer reviews cancellation terms, can dismiss, then confirms once', async ({
  page,
  api,
}) => {
  await api.given(signedIn(maya), appointmentDetail(pendingAppointment), {
    method: 'POST',
    path: '/api/appointments/HP-1048/cancellation',
    body: { status: 'cancelled' },
  });
  const appointments = new AppointmentsPage(page);
  await appointments.openDetail();
  await appointments.cancel.click();
  await expect(appointments.cancelDialog).toContainText('HP-1048');
  await expect(appointments.cancelDialog).toContainText('Cancel before the visit starts.');
  await appointments.cancelDialog.getByRole('button', { name: 'Keep request' }).click();
  expect(api.requests('POST', '/api/appointments/HP-1048/cancellation')).toEqual([]);

  await api.given(
    appointmentDetail({
      ...pendingAppointment,
      status: 'cancelled',
      allowed: { ...pendingAppointment.allowed, cancel: false },
    }),
  );
  await appointments.cancel.click();
  await appointments.cancelDialog.getByRole('button', { name: 'Cancel request' }).click();
  await expect(page.getByRole('main')).toContainText('Cancelled');
  expect(api.requests('POST', '/api/appointments/HP-1048/cancellation')).toHaveLength(1);
});

test('a proposed offered time stays separate from the current agreed time', async ({
  page,
  api,
}) => {
  await api.given(
    signedIn(maya),
    appointmentDetail(confirmedAppointment),
    {
      method: 'GET',
      path: '/api/appointments/HP-1048/change-options',
      body: { slots: [{ id: 'slot-new', start: '2026-10-31T10:00:00-04:00' }] },
    },
    {
      method: 'POST',
      path: '/api/appointments/HP-1048/change-requests',
      status: 201,
      body: { pendingChange: { start: '2026-10-31T10:00:00-04:00' } },
    },
  );
  const appointments = new AppointmentsPage(page);
  await appointments.openDetail();
  await appointments.change.click();
  await appointments.changeDialog.getByRole('radio', { name: /Sat 31 Oct/ }).check();
  await api.given(
    appointmentDetail({
      ...confirmedAppointment,
      pendingChange: { start: '2026-10-31T10:00:00-04:00' },
      allowed: { ...confirmedAppointment.allowed, change: false },
    }),
  );
  await appointments.changeDialog.getByRole('button', { name: 'Send change request' }).click();

  await expect(page.getByRole('main')).toContainText('Sat 24 Oct');
  await expect(page.getByRole('main')).toContainText('Proposed new time');
  await expect(page.getByRole('main')).toContainText('Sat 31 Oct');
  expect(
    api
      .requests('POST', '/api/appointments/HP-1048/change-requests')
      .map((request) => request.body),
  ).toEqual([{ slotId: 'slot-new', note: null }]);
});

test('rebooking a completed visit selects the current service but no old time', async ({
  page,
  api,
}) => {
  await api.given(
    signedIn(maya),
    appointmentDetail({
      ...confirmedAppointment,
      status: 'completed',
      allowed: { change: false, cancel: false, rebook: true, review: true },
    }),
    {
      method: 'GET',
      path: '/api/appointments/HP-1048/repeat-booking',
      body: { braiderSlug: 'nia-okafor', serviceId: 'svc-knotless' },
    },
    bookingOptions(),
  );
  const appointments = new AppointmentsPage(page);
  await appointments.openDetail();
  await appointments.bookAgain.click();

  await expect(page).toHaveURL('/book/nia-okafor?service=svc-knotless');
  await expect(page.getByRole('radio', { name: /Medium knotless braids/ })).toBeChecked();
  await expect(page.getByRole('radio', { name: /Sat 24 Oct/ })).not.toBeChecked();
});

test('a completed visit opens its care and review screen', async ({ page, api }) => {
  await api.given(
    signedIn(maya),
    appointmentDetail({
      ...confirmedAppointment,
      status: 'completed',
      allowed: { change: false, cancel: false, rebook: true, review: true },
    }),
    {
      method: 'GET',
      path: '/api/appointments/HP-1048/care',
      body: {
        reference: 'HP-1048',
        service: 'Medium knotless braids',
        braider: { slug: 'nia-okafor', name: 'Nia Okafor' },
        date: '2026-10-24',
        guidance: { items: ['Wrap your braids before bed.'], source: 'Nia Okafor' },
        review: 'open',
      },
    },
  );
  const appointments = new AppointmentsPage(page);
  await appointments.openDetail();
  await appointments.careAndReview.click();
  await expect(page).toHaveURL('/appointments/HP-1048/care');
});

test('an unavailable detail shows only the last saved summary with its update time', async ({
  page,
  api,
}) => {
  await api.given(signedIn(maya), appointmentDetail(confirmedAppointment));
  const appointments = new AppointmentsPage(page);
  await appointments.openDetail();
  await expect(page.getByRole('main')).toContainText('42 Queen Street West');
  await api.given({
    method: 'GET',
    path: '/api/appointments/HP-1048',
    status: 503,
    body: { message: 'Unavailable.' },
  });
  await page.reload();
  await expect(page.getByRole('main')).toContainText('Last saved summary');
  await expect(page.getByRole('main')).toContainText('Medium knotless braids');
  await expect(page.getByRole('main')).toContainText('Updated');
  await expect(page.getByRole('main')).not.toContainText('42 Queen Street West');
});

test('the appointment list pages to older owned visits', async ({ page, api }) => {
  await api.given(
    signedIn(maya),
    {
      method: 'GET',
      path: '/api/appointments',
      query: { page: '1' },
      body: { data: [pendingAppointment], meta: { page: 1, perPage: 12, total: 13, lastPage: 2 } },
    },
    {
      method: 'GET',
      path: '/api/appointments',
      query: { page: '2' },
      body: {
        data: [{ ...confirmedAppointment, reference: 'HP-0992', status: 'completed' }],
        meta: { page: 2, perPage: 12, total: 13, lastPage: 2 },
      },
    },
  );
  const appointments = new AppointmentsPage(page);
  await appointments.openList();
  await expect(appointments.detail).toContainText('HP-1048');
  await appointments.nextPage.click();
  await expect(appointments.detail).toContainText('HP-0992');
  expect(api.requests('GET', '/api/appointments').map((r) => r.query.get('page'))).toEqual([
    '1',
    '2',
  ]);
});
