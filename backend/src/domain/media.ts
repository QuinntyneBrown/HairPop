/** Portfolio photos may be at most 5 MB (L2-027 AC4). */
export const MAX_PHOTO_BYTES = 5 * 1024 * 1024;

export type ImageType = 'image/jpeg' | 'image/png' | 'image/webp';

/** The image type from the file's own bytes, whatever its name or declared type says. */
export function detectImageType(bytes: Uint8Array): ImageType | null {
  const starts = (offset: number, ...signature: number[]) =>
    signature.every((byte, i) => bytes[offset + i] === byte);
  if (starts(0, 0xff, 0xd8, 0xff)) return 'image/jpeg';
  if (starts(0, 0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a)) return 'image/png';
  // "RIFF" <size> "WEBP"
  if (starts(0, 0x52, 0x49, 0x46, 0x46) && starts(8, 0x57, 0x45, 0x42, 0x50)) return 'image/webp';
  return null;
}
