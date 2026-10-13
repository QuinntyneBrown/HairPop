// Acceptance Test
// Traces to: L2-015, L2-016
// Given a signed-in customer and current offerings, when she completes and reviews the form,
// then the review shows current terms and closing it preserves every answer.

import { expect, test } from '../fixtures/api';
import { bookingOptions } from '../fixtures/booking';
import { maya, signedIn } from '../fixtures/session';
import { BookingRequestPage } from '../pages/booking-request.page';

test('an anonymous customer is sent to sign-in before booking options are requested', async ({
  page,
  api,
}) => {
  const booking = new BookingRequestPage(page);
  await booking.open();
  await expect(page).toHaveURL(/\/sign-in\?returnUrl=%2Fbook%2Fnia-okafor/);
  expect(api.requests('GET', '/api/braiders/nia-okafor/booking-options')).toEqual([]);
});

test('review shows the selected service, time, terms, and details; edit retains entries', async ({
  page,
  api,
}) => {
  await api.given(signedIn(maya), bookingOptions());
  const booking = new BookingRequestPage(page);
  await booking.open();
  await booking.service.check();
  await booking.time.check();
  await booking.hairDetails.fill('Shoulder length hair; bringing extensions.');
  await booking.review.click();

  await expect(booking.dialog).toContainText('Medium knotless braids');
  await expect(booking.dialog).toContainText('Sat 24 Oct');
  await expect(booking.dialog).toContainText('$180');
  await expect(booking.dialog).toContainText('Cancel before the visit starts.');
  await expect(booking.dialog).toContainText('Shoulder length hair; bringing extensions.');
  await booking.dialog.getByRole('button', { name: 'Edit details' }).click();
  await expect(booking.hairDetails).toHaveValue('Shoulder length hair; bringing extensions.');
  expect(api.requests('POST', '/api/booking-requests')).toEqual([]);
});

test('missing required choices and hair details block review', async ({ page, api }) => {
  await api.given(signedIn(maya), bookingOptions());
  const booking = new BookingRequestPage(page);
  await booking.open();
  await booking.review.click();

  await expect(booking.dialog).toHaveCount(0);
  await expect(page.getByRole('main')).toContainText('Choose a service');
  await expect(page.getByRole('main')).toContainText('Choose one of the offered times');
  expect(api.requests('POST', '/api/booking-requests')).toEqual([]);
});

test('sending the reviewed request creates one pending reference', async ({ page, api }) => {
  await api.given(signedIn(maya), bookingOptions(), {
    method: 'POST',
    path: '/api/booking-requests',
    status: 201,
    body: { reference: 'HP-1048', status: 'awaiting_reply' },
  });
  const booking = new BookingRequestPage(page);
  await booking.open();
  await booking.service.check();
  await booking.time.check();
  await booking.hairDetails.fill('Shoulder length hair; bringing extensions.');
  await booking.review.click();
  await booking.dialog.getByRole('button', { name: 'Send request' }).click();

  await expect(page.getByRole('main')).toContainText('Request HP-1048 sent to Nia');
  await expect(page.getByRole('main')).toContainText('Awaiting reply');
  const requests = api.requests('POST', '/api/booking-requests');
  expect(requests).toHaveLength(1);
  expect(requests[0].headers['idempotency-key']).toBeTruthy();
  expect(requests[0].body).toEqual({
    braiderSlug: 'nia-okafor',
    serviceId: 'svc-knotless',
    slotId: 'slot-24',
    email: 'maya.chen@example.com',
    phone: '416-555-0148',
    hairDetails: 'Shoulder length hair; bringing extensions.',
    policyVersion: 'policy-123456',
  });
});

test('a failed send can retry with the same idempotency key', async ({ page, api }) => {
  await api.given(
    signedIn(maya),
    bookingOptions(),
    {
      method: 'POST',
      path: '/api/booking-requests',
      status: 201,
      body: { reference: 'HP-1048', status: 'awaiting_reply' },
    },
    {
      method: 'POST',
      path: '/api/booking-requests',
      status: 503,
      body: { message: 'Unavailable.' },
      times: 1,
    },
  );
  const booking = new BookingRequestPage(page);
  await booking.open();
  await booking.service.check();
  await booking.time.check();
  await booking.hairDetails.fill('Shoulder length hair; bringing extensions.');
  await booking.review.click();
  await booking.dialog.getByRole('button', { name: 'Send request' }).click();
  await expect(booking.dialog).toContainText('We couldn’t send your request');
  await booking.dialog.getByRole('button', { name: 'Send request' }).click();

  await expect(page.getByRole('main')).toContainText('Request HP-1048 sent to Nia');
  const keys = api
    .requests('POST', '/api/booking-requests')
    .map((request) => request.headers['idempotency-key']);
  expect(keys).toHaveLength(2);
  expect(keys[0]).toBe(keys[1]);
});

test('changed terms return the customer to current choices without claiming success', async ({
  page,
  api,
}) => {
  await api.given(signedIn(maya), bookingOptions(), {
    method: 'POST',
    path: '/api/booking-requests',
    status: 409,
    body: { code: 'terms_changed', message: 'Terms changed.' },
  });
  const booking = new BookingRequestPage(page);
  await booking.open();
  await booking.service.check();
  await booking.time.check();
  await booking.hairDetails.fill('Shoulder length hair; bringing extensions.');
  await booking.review.click();
  await booking.dialog.getByRole('button', { name: 'Send request' }).click();

  await expect(booking.dialog).toHaveCount(0);
  await expect(page.getByRole('main')).toContainText('terms changed');
  await expect(booking.hairDetails).toHaveValue('Shoulder length hair; bringing extensions.');
  expect(api.requests('GET', '/api/braiders/nia-okafor/booking-options')).toHaveLength(2);
});

test('a server-rejected hair detail returns to the form with the entry intact', async ({
  page,
  api,
}) => {
  await api.given(signedIn(maya), bookingOptions(), {
    method: 'POST',
    path: '/api/booking-requests',
    status: 422,
    body: {
      message: 'Invalid details.',
      errors: { hairDetails: ['Please describe your hair more clearly.'] },
    },
  });
  const booking = new BookingRequestPage(page);
  await booking.open();
  await booking.service.check();
  await booking.time.check();
  await booking.hairDetails.fill('Shoulder length hair; bringing extensions.');
  await booking.review.click();
  await booking.dialog.getByRole('button', { name: 'Send request' }).click();

  await expect(booking.dialog).toHaveCount(0);
  await expect(page.getByRole('main')).toContainText('Please describe your hair more clearly.');
  await expect(booking.hairDetails).toHaveValue('Shoulder length hair; bringing extensions.');
});
