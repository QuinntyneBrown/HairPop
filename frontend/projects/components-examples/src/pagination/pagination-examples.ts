import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { Pagination } from '@hairpop/components';

import { Example } from '../shared';

/** Results per page in the style gallery story. */
const RESULTS_PER_PAGE = 12;
/** Results in the style gallery story. */
const RESULTS_TOTAL = 126;
/** Reviews per page in the braider profile story. */
const REVIEWS_PER_PAGE = 5;
/** Reviews on Nia's profile. */
const REVIEWS_TOTAL = 18;

/** Reads a 1-based page number from a query parameter; absent or invalid means page 1. */
function toPage(value: string | undefined): number {
  const page = Number(value);
  return Number.isInteger(page) && page >= 1 ? page : 1;
}

/**
 * Stories for pagination (pagination.md). Page links set a query parameter on this route;
 * the router binds `page` and `reviews` to the inputs below, so the interactive stories follow
 * the links like a real results page.
 */
@Component({
  selector: 'hp-pagination-examples',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Example, Pagination],
  template: `
    <hp-example
      heading="Numbered, interactive"
      description="Bound to the page query parameter. Below 768 px only the first, current and last pages show."
    >
      <div class="pagination-examples__frame">
        <p class="pagination-examples__state">Current page: {{ resultsPage() }}</p>
        <hp-pagination
          label="Results pages"
          [page]="resultsPage()"
          [pageCount]="resultsPageCount"
          [summary]="resultsSummary()"
          previousLabel="Previous"
          nextLabel="Next"
          [pageLabel]="pageLabel"
        />
      </div>
    </hp-example>

    <hp-example
      heading="Simple, interactive"
      description="Previous and next chevrons with visually hidden labels, on the reviews query parameter."
    >
      <div class="pagination-examples__frame">
        <p class="pagination-examples__state">Current review page: {{ reviewsPage() }}</p>
        <hp-pagination
          variant="simple"
          label="Review pages"
          queryParam="reviews"
          [page]="reviewsPage()"
          [pageCount]="reviewsPageCount"
          [summary]="reviewsSummary()"
          previousLabel="Previous reviews"
          nextLabel="Next reviews"
        />
      </div>
    </hp-example>

    <hp-example heading="First page" description="Previous is an unavailable end: dimmed, no href.">
      <hp-pagination
        label="First page example"
        queryParam="first"
        [page]="1"
        [pageCount]="11"
        summary="Showing 1–12 of 126"
        previousLabel="Previous"
        nextLabel="Next"
      />
    </hp-example>

    <hp-example heading="Middle page" description="Ellipses on both sides of the window.">
      <hp-pagination
        label="Middle page example"
        queryParam="middle"
        [page]="6"
        [pageCount]="11"
        summary="Showing 61–72 of 126"
        previousLabel="Previous"
        nextLabel="Next"
      />
    </hp-example>

    <hp-example heading="Last page" description="Next is an unavailable end.">
      <hp-pagination
        label="Last page example"
        queryParam="last"
        [page]="11"
        [pageCount]="11"
        summary="Showing 121–126 of 126"
        previousLabel="Previous"
        nextLabel="Next"
      />
    </hp-example>

    <hp-example
      heading="Few pages"
      description="A gap of exactly one page shows that page instead of an ellipsis."
    >
      <hp-pagination
        label="Few pages example"
        queryParam="few"
        [page]="2"
        [pageCount]="5"
        summary="Showing 13–24 of 54"
        previousLabel="Previous"
        nextLabel="Next"
      />
    </hp-example>

    <hp-example
      heading="Simple, last page"
      description="Next reviews is unavailable on the last page."
    >
      <hp-pagination
        variant="simple"
        label="Last review page example"
        queryParam="lastReviews"
        [page]="4"
        [pageCount]="4"
        summary="Reviews 16–18 of 18"
        previousLabel="Previous reviews"
        nextLabel="Next reviews"
      />
    </hp-example>

    <hp-example
      heading="One page"
      description="With a page count of 1 the component renders nothing."
    >
      <hp-pagination
        label="One page example"
        queryParam="single"
        [page]="1"
        [pageCount]="1"
        summary="Showing 1–3 of 3"
        previousLabel="Previous"
        nextLabel="Next"
      />
      <span class="pagination-examples__state">(nothing rendered)</span>
    </hp-example>
  `,
  styles: `
    .pagination-examples__frame {
      display: flex;
      flex-direction: column;
      gap: var(--space-3);
    }

    .pagination-examples__state {
      margin: 0;
      font: var(--text-body-sm);
      color: var(--color-fg-muted);
    }
  `,
})
export class PaginationExamples {
  /** The `page` query parameter, bound by the router. */
  readonly page = input<string | undefined>(undefined);
  /** The `reviews` query parameter, bound by the router. */
  readonly reviews = input<string | undefined>(undefined);

  protected readonly resultsPageCount = Math.ceil(RESULTS_TOTAL / RESULTS_PER_PAGE);
  protected readonly reviewsPageCount = Math.ceil(REVIEWS_TOTAL / REVIEWS_PER_PAGE);

  protected readonly resultsPage = computed(() =>
    Math.min(toPage(this.page()), this.resultsPageCount),
  );
  protected readonly reviewsPage = computed(() =>
    Math.min(toPage(this.reviews()), this.reviewsPageCount),
  );

  protected readonly resultsSummary = computed(() => {
    const first = (this.resultsPage() - 1) * RESULTS_PER_PAGE + 1;
    const last = Math.min(this.resultsPage() * RESULTS_PER_PAGE, RESULTS_TOTAL);
    return `Showing ${first}–${last} of ${RESULTS_TOTAL}`;
  });

  protected readonly reviewsSummary = computed(() => {
    const first = (this.reviewsPage() - 1) * REVIEWS_PER_PAGE + 1;
    const last = Math.min(this.reviewsPage() * REVIEWS_PER_PAGE, REVIEWS_TOTAL);
    return `Reviews ${first}–${last} of ${REVIEWS_TOTAL}`;
  });

  protected readonly pageLabel = (page: number): string => `Page ${page}`;
}
