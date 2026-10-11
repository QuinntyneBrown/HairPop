import { Locator } from '@playwright/test';

/**
 * The text of every match, read once the first one exists. A server-rendered page can swap its
 * content for a loading state for a moment while it hydrates, so reading the instant a
 * navigation resolves can see an empty list.
 */
export async function textsOf(locator: Locator): Promise<string[]> {
  await locator.first().waitFor();
  return locator.allInnerTexts();
}
