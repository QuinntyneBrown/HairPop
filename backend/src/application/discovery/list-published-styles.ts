import { pageMeta, PER_PAGE, type Page } from '@/domain/common';
import { toStyleSummary, type StyleCategory, type StyleSummary } from '@/domain/style';
import { findPublishedStyles } from '@/infrastructure/style-repository';

export interface ListStylesQuery {
  readonly search?: string;
  readonly category?: StyleCategory;
  readonly page: number;
}

/** Published styles matching the search and category, a page at a time (L2-001, L2-002). */
export async function listPublishedStyles(query: ListStylesQuery): Promise<Page<StyleSummary>> {
  const { styles, total } = await findPublishedStyles(
    { search: query.search, category: query.category },
    (query.page - 1) * PER_PAGE,
    PER_PAGE,
  );
  return { data: styles.map(toStyleSummary), meta: pageMeta(query.page, total) };
}
