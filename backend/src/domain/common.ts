/** Shared response shapes; they mirror `common.ts` in the frontend `api` library. */
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

export interface Page<T, M extends object = object> {
  readonly data: readonly T[];
  readonly meta: PageMeta & M;
}

export const PER_PAGE = 12;

export function pageMeta(page: number, total: number, perPage = PER_PAGE): PageMeta {
  return { page, perPage, total, lastPage: Math.max(1, Math.ceil(total / perPage)) };
}

/** A range from stored min/max columns; no minimum means the fact is not known. */
export function range(min: number | null, max: number | null): Range | null {
  return min === null ? null : { min, max };
}

export function image(src: string | null, alt: string | null): Image | null {
  return src === null ? null : { src, alt: alt ?? '' };
}
