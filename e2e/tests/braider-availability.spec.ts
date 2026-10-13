// Acceptance Test: L2-028 AC1–2 and L2-047.
// Given offered times, requested slots cannot be withdrawn; adding a future time calls the
// owned API and refreshes the list only after a durable success.

import { expect, test } from '../fixtures/api';
import { signedIn } from '../fixtures/session';
import { BraiderAvailabilityPage } from '../pages/braider-availability.page';

const nia = {
  id: 'braider-nia',
  name: 'Nia Okafor',
  firstName: 'Nia',
  email: 'nia.okafor@example.com',
  emailVerified: true,
  role: 'braider' as const,
};
const requested = {
  id: 'slot-1',
  start: '2026-10-24T10:00:00-04:00',
  maxHours: 6,
  requestReference: 'HP-1048',
};
const open = {
  id: 'slot-2',
  start: '2026-10-25T11:00:00-04:00',
  maxHours: 6,
  requestReference: null,
};

test('requested slots stay protected while an open time can be withdrawn', async ({
  page,
  api,
}) => {
  await api.given(
    signedIn(nia),
    { method: 'GET', path: '/api/braider/slots', body: { data: [requested, open] } },
    {
      method: 'DELETE',
      path: '/api/braider/slots/slot-2',
      status: 204,
    },
  );
  const availability = new BraiderAvailabilityPage(page);
  await availability.open();
  await expect(availability.offeredTimes).toContainText('Requested · HP-1048');
  await expect(availability.offeredTimes.getByRole('button', { name: /Withdraw/ })).toHaveCount(1);
  await availability.offeredTimes.getByRole('button', { name: /Withdraw/ }).click();
  await expect(availability.withdrawDialog).toContainText('Sun 25 Oct');
  await api.given({ method: 'GET', path: '/api/braider/slots', body: { data: [requested] } });
  await availability.withdrawDialog.getByRole('button', { name: 'Withdraw time' }).click();
  await expect(availability.withdrawDialog).toBeHidden();
  await expect(availability.offeredTimes.getByRole('button', { name: /Withdraw/ })).toHaveCount(0);
  expect(api.requests('DELETE', '/api/braider/slots/slot-2')).toHaveLength(1);
});

test('a future offered time is added and shown after the save', async ({ page, api }) => {
  const added = {
    id: 'slot-3',
    start: '2026-10-31T10:00:00-04:00',
    maxHours: 5,
    requestReference: null,
  };
  await api.given(
    signedIn(nia),
    { method: 'GET', path: '/api/braider/slots', body: { data: [] } },
    {
      method: 'POST',
      path: '/api/braider/slots',
      status: 201,
      body: added,
    },
  );
  const availability = new BraiderAvailabilityPage(page);
  await availability.open();
  await expect(availability.main).toContainText('No offered times yet');
  await api.given({ method: 'GET', path: '/api/braider/slots', body: { data: [added] } });
  await availability.addTime('2026-10-31', '10:00', '5');
  await expect(availability.offeredTimes).toContainText('Sat 31 Oct');
  expect(api.requests('POST', '/api/braider/slots').map((r) => r.body)).toEqual([
    {
      date: '2026-10-31',
      time: '10:00',
      maxHours: 5,
    },
  ]);
});
