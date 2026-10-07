import sharp from 'sharp';
import { detectFileType } from '../conversations/proof-files.js';

export const MAX_IMAGE_UPLOAD_BYTES = 8 * 1024 * 1024; // 8 MB per file as uploaded
export const MAX_IMAGE_EDGE = 1280; // longest side after processing, in pixels
const MAX_INPUT_PIXELS = 50_000_000; // refuses decompression bombs (a tiny file that expands to gigabytes)

export type InvalidImageReason = 'unsupported' | 'too_large' | 'too_many_pixels' | 'corrupt';

export class InvalidImageError extends Error {
  constructor(public readonly reason: InvalidImageReason) {
    super(reason);
  }
}

export interface ProcessedImage {
  data: Buffer;
  width: number;
  height: number;
}

/**
 * Turns an uploaded picture into the one safe format we store and send to customers.
 *
 *  - judged by its real bytes (JPEG, PNG or WebP only), never by its name or claimed type
 *  - decoded and RE-ENCODED, so anything hidden in the file (metadata, location data, scripts appended to
 *    an image, files that are valid as two formats at once) does not survive
 *  - rotated upright from the camera's orientation, fitted inside 1280px, transparent areas turned white
 *  - ~100-200 KB each, so a free 1 GB bucket holds thousands of products
 */
export async function processProductImage(input: Buffer): Promise<ProcessedImage> {
  if (input.length > MAX_IMAGE_UPLOAD_BYTES) throw new InvalidImageError('too_large');
  const type = detectFileType(input);
  if (!type || type.kind !== 'image') throw new InvalidImageError('unsupported');

  try {
    const { data, info } = await sharp(input, { limitInputPixels: MAX_INPUT_PIXELS, failOn: 'error' })
      .rotate() // honour the EXIF orientation, then drop all metadata (sharp strips it by default)
      .resize({ width: MAX_IMAGE_EDGE, height: MAX_IMAGE_EDGE, fit: 'inside', withoutEnlargement: true })
      .flatten({ background: '#ffffff' })
      .jpeg({ quality: 82, progressive: true, mozjpeg: true })
      .toBuffer({ resolveWithObject: true });
    return { data, width: info.width, height: info.height };
  } catch (err) {
    const message = err instanceof Error ? err.message : '';
    throw new InvalidImageError(/pixel limit/i.test(message) ? 'too_many_pixels' : 'corrupt');
  }
}
