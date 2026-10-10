/** Shapes shared by every endpoint (docs/detailed-designs/experience/handle-page-states). */

/** An ISO 8601 date-time with offset, for example `2026-10-24T10:00:00-04:00`. */
export type IsoDateTime = string;

/** A whole-number range of CAD dollars, hours or weeks; `max` is null for "from" values. */
export interface Range {
  readonly min: number;
  readonly max: number | null;
}

export interface Image {
  readonly src: string;
  readonly alt: string;
}

export interface PageMeta {
  readonly page: number;
  readonly perPage: number;
  readonly total: number;
  readonly lastPage: number;
}

/** A page of a paginated list. */
export interface Page<T, M extends object = object> {
  readonly data: readonly T[];
  readonly meta: PageMeta & M;
}

/** The body of every error response. */
export interface ApiErrorBody {
  readonly message: string;
  readonly code?: string;
  readonly errors?: Readonly<Record<string, readonly string[]>>;
  readonly reference?: string;
  readonly retryAfter?: number;
}
