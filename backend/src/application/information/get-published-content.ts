import { findPublishedContent } from '@/infrastructure/content-repository';

export const CONTENT_SLUGS = ['help', 'terms', 'privacy'] as const;
export type ContentSlug = (typeof CONTENT_SLUGS)[number];

export interface ContentSection {
  readonly id: string;
  readonly heading: string;
  readonly paragraphs: readonly string[];
}

export interface PublishedContent {
  readonly slug: ContentSlug;
  readonly title: string;
  /** Calendar date (`YYYY-MM-DD`) legal copy took effect; null for Help. */
  readonly effectiveDate: string | null;
  readonly sections: readonly ContentSection[];
  readonly supportEmail: string | null;
}

/** Published Help, Terms or Privacy copy, or null when it is not published. */
export async function getPublishedContent(slug: ContentSlug): Promise<PublishedContent | null> {
  const page = await findPublishedContent(slug);
  if (!page) return null;
  return {
    slug,
    title: page.title,
    effectiveDate: page.effectiveDate?.toISOString().slice(0, 10) ?? null,
    sections: page.sections as unknown as ContentSection[],
    supportEmail: page.supportEmail,
  };
}
