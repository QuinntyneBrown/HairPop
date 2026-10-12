import { NextResponse } from 'next/server';
import { addPortfolioItem } from '@/application/braider/profile';
import { offerableStyleSlugs } from '@/application/braider/services';
import { detectImageType, MAX_PHOTO_BYTES, type ImageType } from '@/domain/media';
import { ApiError } from '@/http/api-error';
import { currentBraider } from '@/http/braider';
import { route } from '@/http/route';

const INVALID = 'The given data was invalid.';
const PHOTO = 'Upload a JPG, PNG or WebP image up to 5 MB.';

/** Multipart: `photo` (JPG, PNG or WebP up to 5 MB, checked by its bytes), `caption`, `styleSlug`. */
export const POST = route(
  async (request, { user }) => {
    const braider = await currentBraider(user.id);
    let form: FormData;
    try {
      form = await request.formData();
    } catch {
      throw new ApiError(422, { message: INVALID, errors: { photo: [PHOTO] } });
    }

    const errors: Record<string, string[]> = {};
    const photo = form.get('photo');
    let bytes: Uint8Array | null = null;
    let contentType: ImageType | null = null;
    if (photo instanceof File && photo.size > 0 && photo.size <= MAX_PHOTO_BYTES) {
      bytes = new Uint8Array(await photo.arrayBuffer());
      contentType = detectImageType(bytes);
    }
    if (!bytes || !contentType) errors.photo = [PHOTO];

    const caption = String(form.get('caption') ?? '').trim();
    if (caption === '') errors.caption = ['Enter a caption.'];
    else if (caption.length > 120) errors.caption = ['Use at most 120 characters.'];

    const styleSlug = String(form.get('styleSlug') ?? '').trim() || null;
    if (styleSlug !== null && !(await offerableStyleSlugs()).includes(styleSlug)) {
      errors.styleSlug = ['Choose a style.'];
    }

    if (Object.keys(errors).length > 0 || !bytes || !contentType) {
      throw new ApiError(422, { message: INVALID, errors });
    }
    const item = await addPortfolioItem(braider.id, { bytes, contentType, caption, styleSlug });
    return NextResponse.json(item, { status: 201 });
  },
  { role: 'braider' },
);
