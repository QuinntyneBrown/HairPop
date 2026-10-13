// Acceptance Test: L2-026 AC1, AC3 and L2-047 AC4.
// Given an owned service, a publish-state change sends only state and version. New service
// details are edited in a dialog; stale saves preserve the entry for review.

import { expect, test } from '../fixtures/api';
import { signedIn } from '../fixtures/session';
import { BraiderServicesPage } from '../pages/braider-services.page';

const nia = {
  id: 'braider-nia',
  name: 'Nia Okafor',
  firstName: 'Nia',
  email: 'nia.okafor@example.com',
  emailVerified: true,
  role: 'braider' as const,
};
const service = {
  id: 'svc-1',
  styleSlug: 'knotless-braids',
  styleName: 'Knotless braids',
  name: 'Medium knotless braids',
  startingPrice: 180,
  typicalHours: 5,
  preparation: 'Bring extensions.',
  published: true,
  version: 2,
};
const styles = [{ slug: 'knotless-braids', name: 'Knotless braids' }];

test('an owned published service can be unpublished with its version', async ({ page, api }) => {
  await api.given(
    signedIn(nia),
    { method: 'GET', path: '/api/braider/services', body: { data: [service], styles } },
    {
      method: 'PATCH',
      path: '/api/braider/services/svc-1',
      body: { ...service, published: false, version: 3 },
    },
  );
  const services = new BraiderServicesPage(page);
  await services.open();
  await expect(services.services).toContainText('Medium knotless braids');
  await services.services.getByRole('button', { name: 'Unpublish Medium knotless braids' }).click();
  await expect(services.services).toContainText('Unpublished');
  expect(api.requests('PATCH', '/api/braider/services/svc-1').map((r) => r.body)).toEqual([
    {
      published: false,
      version: 2,
    },
  ]);
});

test('a stale new edit stays in the dialog with a refresh path', async ({ page, api }) => {
  await api.given(
    signedIn(nia),
    { method: 'GET', path: '/api/braider/services', body: { data: [service], styles } },
    {
      method: 'PATCH',
      path: '/api/braider/services/svc-1',
      status: 409,
      body: { code: 'stale', message: 'Service changed.' },
    },
  );
  const services = new BraiderServicesPage(page);
  await services.open();
  await services.services.getByRole('button', { name: 'Edit Medium knotless braids' }).click();
  await services.serviceName.fill('Long knotless braids');
  await services.dialog.getByRole('button', { name: 'Save service' }).click();
  await expect(services.dialog).toContainText('This service has changed');
  await expect(services.serviceName).toHaveValue('Long knotless braids');
  expect(api.requests('PATCH', '/api/braider/services/svc-1')).toHaveLength(1);
});

test('a new service is published from the add dialog', async ({ page, api }) => {
  await api.given(
    signedIn(nia),
    { method: 'GET', path: '/api/braider/services', body: { data: [], styles } },
    {
      method: 'POST',
      path: '/api/braider/services',
      status: 201,
      body: service,
    },
  );
  const services = new BraiderServicesPage(page);
  await services.open();
  await expect(services.main).toContainText('No services yet');
  await api.given({
    method: 'GET',
    path: '/api/braider/services',
    body: { data: [service], styles },
  });
  await services.create();
  await expect(services.services).toContainText('Medium knotless braids');
  expect(api.requests('POST', '/api/braider/services').map((r) => r.body)).toEqual([
    {
      styleSlug: 'knotless-braids',
      name: 'Medium knotless braids',
      startingPrice: 180,
      typicalHours: 5,
      preparation: null,
      published: true,
    },
  ]);
});

test('removing a service asks for confirmation before calling the API', async ({ page, api }) => {
  await api.given(
    signedIn(nia),
    { method: 'GET', path: '/api/braider/services', body: { data: [service], styles } },
    {
      method: 'DELETE',
      path: '/api/braider/services/svc-1',
      status: 204,
    },
  );
  const services = new BraiderServicesPage(page);
  await services.open();
  await services.services.getByRole('button', { name: 'Remove Medium knotless braids' }).click();
  await expect(services.removeDialog).toContainText('Medium knotless braids');
  await services.removeDialog.getByRole('button', { name: 'Keep service' }).click();
  expect(api.requests('DELETE', '/api/braider/services/svc-1')).toHaveLength(0);
  await services.services.getByRole('button', { name: 'Remove Medium knotless braids' }).click();
  await api.given({ method: 'GET', path: '/api/braider/services', body: { data: [], styles } });
  await services.removeDialog.getByRole('button', { name: 'Remove service' }).click();
  await expect(services.main).toContainText('No services yet');
  expect(api.requests('DELETE', '/api/braider/services/svc-1')).toHaveLength(1);
});
