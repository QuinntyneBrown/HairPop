// Acceptance Test
// Traces to: L2-032, L2-035
// Description: Help explains requests, estimates, changes and reviews and gives a support path that can carry a request reference.

import { expect, test } from '../fixtures/api';
import { getContent, helpContent } from '../fixtures/content';
import { serverError } from '../fixtures/errors';
import { gallery, listStyles } from '../fixtures/styles';
import { HelpPage } from '../pages/help.page';
import { StyleGalleryPage } from '../pages/style-gallery.page';

test.describe('Help', () => {
  test('shows the four topics and an email support action', async ({ page, api }) => {
    await api.given(getContent(helpContent));
    const help = new HelpPage(page);

    await help.open();

    await expect(help.heading).toHaveText('How can we help?');
    expect(await help.topicTitles()).toEqual([
      'How requests work',
      'Prices and estimates',
      'Changing an appointment',
      'Reviews',
    ]);
    await expect(help.topics.first()).toContainText(
      'A request becomes an appointment only when the braider accepts it.',
    );
    await expect(help.contactAction).toHaveAttribute('href', 'mailto:support@hairpop.example');
    await expect(help.shell.navLink('Help')).toHaveAttribute('aria-current', 'page');
  });

  test('a request reference in the address goes into the support email subject', async ({
    page,
    api,
  }) => {
    await api.given(getContent(helpContent));
    const help = new HelpPage(page);

    await help.open('/help?ref=HP-1048');

    await expect(help.contactAction).toHaveAttribute(
      'href',
      'mailto:support@hairpop.example?subject=Help%20with%20HP-1048',
    );
  });

  test('a reference that is not a plain code is ignored', async ({ page, api }) => {
    await api.given(getContent(helpContent));
    const help = new HelpPage(page);

    await help.open('/help?ref=HP-1048%0D%0ABcc:someone@example.com');

    await expect(help.contactAction).toHaveAttribute('href', 'mailto:support@hairpop.example');
  });

  test('a failed load explains the problem and retries', async ({ page, api }) => {
    await api.given(getContent(helpContent), serverError('GET', '/api/content/help', { times: 1 }));
    const help = new HelpPage(page);

    await help.open();

    await expect(help.emptyHeading()).toHaveText('We couldn’t load help');
    await expect(help.topics).toHaveCount(0);

    await help.retry().click();

    await expect(help.topics).toHaveCount(4);
  });

  test('offline, help offers a retry and still offers the support email', async ({ page, api }) => {
    await api.given(getContent(helpContent), serverError('GET', '/api/content/help', { times: 1 }));
    const help = new HelpPage(page);
    await help.open();
    await expect(help.emptyHeading()).toHaveText('We couldn’t load help');
    await api.setOffline(true);

    await help.retry().click();

    await expect(help.offline).toBeVisible();
    await expect(help.retry()).toBeVisible();
    await expect(help.contactAction).toHaveAttribute('href', 'mailto:support@hairpop.example');
  });

  test('while help loads the topics are replaced by a labelled loading state', async ({
    page,
    api,
  }) => {
    await api.given(listStyles(gallery), getContent(helpContent, { delayMs: 1500 }));
    const galleryPage = new StyleGalleryPage(page);
    await galleryPage.open();

    await galleryPage.shell.navLink('Help').click();

    const help = new HelpPage(page);
    await expect(help.loading).toBeVisible();
    await expect(help.topics).toHaveCount(4);
  });
});
