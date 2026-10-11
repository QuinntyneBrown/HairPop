// Acceptance Test
// Traces to: L2-033, L2-035
// Description: Terms and Privacy show the current approved text with its effective date, or an honest error, without signing in.

import { expect, test } from '../fixtures/api';
import { getContent, privacyContent, termsContent } from '../fixtures/content';
import { serverError } from '../fixtures/errors';
import { LegalPage } from '../pages/legal.page';

test.describe('Terms of use', () => {
  test('shows the approved text and its effective date without signing in', async ({
    page,
    api,
  }) => {
    await api.given(getContent(termsContent));
    const terms = new LegalPage(page);

    await terms.open('/terms');

    await expect(terms.heading).toHaveText('Terms of use');
    await expect(terms.effectiveDate).toHaveText('Effective 1 Oct 2026');
    expect(await terms.sectionHeadings()).toEqual([
      'Using HairPop',
      'Prices and appointments',
      'Reviews',
    ]);
    await expect(terms.copy).toContainText(
      'Prices shown before acceptance are estimates. The braider confirms the time, place and final price when they accept.',
    );
    await expect(terms.shell.accountLink).toHaveText('Sign in');
  });

  test('is reachable from the footer on every page', async ({ page, api }) => {
    await api.given(getContent(termsContent));
    const terms = new LegalPage(page);
    await terms.open('/404');

    await terms.shell.footerLink('Terms').click();

    await expect(terms.heading).toHaveText('Terms of use');
  });

  test('when the text cannot load an error is shown and no policy text is invented', async ({
    page,
    api,
  }) => {
    await api.given(
      getContent(termsContent),
      serverError('GET', '/api/content/terms', { times: 1 }),
    );
    const terms = new LegalPage(page);

    await terms.open('/terms');

    await expect(terms.emptyHeading()).toHaveText('We couldn’t load terms of use');
    await expect(terms.copy).toHaveCount(0);

    await terms.retry().click();

    await expect(terms.copy).toContainText('Using HairPop');
  });
});

test.describe('Privacy', () => {
  test('shows the approved text and its effective date without signing in', async ({
    page,
    api,
  }) => {
    await api.given(getContent(privacyContent));
    const privacy = new LegalPage(page);

    await privacy.open('/privacy');

    await expect(privacy.heading).toHaveText('Privacy at HairPop');
    await expect(privacy.effectiveDate).toHaveText('Effective 1 Oct 2026');
    expect(await privacy.sectionHeadings()).toEqual([
      'Your information',
      'Cookies and storage',
      'Your choices',
    ]);
  });

  test('when the text cannot load an error is shown and no policy text is invented', async ({
    page,
    api,
  }) => {
    await api.given(serverError('GET', '/api/content/privacy'));
    const privacy = new LegalPage(page);

    await privacy.open('/privacy');

    await expect(privacy.emptyHeading()).toHaveText('We couldn’t load privacy');
    await expect(privacy.copy).toHaveCount(0);
  });
});
