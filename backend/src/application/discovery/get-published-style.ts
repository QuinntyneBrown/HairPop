import { toStyleDetail, type StyleDetail } from '@/domain/style';
import { findPublishedStyle } from '@/infrastructure/style-repository';

/** A published style with its editorial facts, or null when unknown or unpublished (L2-003). */
export async function getPublishedStyle(slug: string): Promise<StyleDetail | null> {
  const style = await findPublishedStyle(slug);
  return style ? toStyleDetail(style) : null;
}
