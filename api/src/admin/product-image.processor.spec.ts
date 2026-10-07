import { describe, expect, it } from 'vitest';
import sharp from 'sharp';
import { InvalidImageError, MAX_IMAGE_EDGE, MAX_IMAGE_UPLOAD_BYTES, processProductImage } from './product-image.processor.js';

const solid = (width: number, height: number, format: 'jpeg' | 'png' | 'webp' = 'jpeg', alpha = false) =>
  sharp({ create: { width, height, channels: alpha ? 4 : 3, background: alpha ? { r: 255, g: 0, b: 0, alpha: 0 } : { r: 200, g: 40, b: 40 } } })
    [format]()
    .toBuffer();

const reason = async (p: Promise<unknown>) => {
  try {
    await p;
    return 'accepted';
  } catch (e) {
    return e instanceof InvalidImageError ? e.reason : `other: ${String(e)}`;
  }
};

describe('processProductImage', () => {
  it('accepts JPEG, PNG and WebP and always returns a JPEG', async () => {
    for (const format of ['jpeg', 'png', 'webp'] as const) {
      const out = await processProductImage(await solid(300, 200, format));
      const meta = await sharp(out.data).metadata();
      expect(meta.format).toBe('jpeg');
      expect([out.width, out.height]).toEqual([300, 200]);
    }
  });

  it('shrinks a big photo to fit inside 1280px, keeping its shape, and never enlarges a small one', async () => {
    const big = await processProductImage(await solid(4000, 3000));
    expect([big.width, big.height]).toEqual([MAX_IMAGE_EDGE, 960]);
    const small = await processProductImage(await solid(200, 100));
    expect([small.width, small.height]).toEqual([200, 100]);
  });

  it('produces files small enough for a free storage plan', async () => {
    const out = await processProductImage(await solid(3000, 2000));
    expect(out.data.length).toBeLessThan(300 * 1024);
  });

  it('turns transparent areas white instead of black', async () => {
    const out = await processProductImage(await solid(20, 20, 'png', true));
    const { data } = await sharp(out.data).raw().toBuffer({ resolveWithObject: true });
    expect([data[0], data[1], data[2]].every((v) => v! > 240)).toBe(true);
  });

  it('applies the camera orientation and drops metadata such as location data', async () => {
    const withMeta = await sharp(await solid(100, 50))
      .withMetadata({ orientation: 6, exif: { IFD0: { Copyright: 'secret@example.com' } } })
      .jpeg()
      .toBuffer();
    const before = await sharp(withMeta).metadata();
    expect(before.orientation).toBe(6); // the test photo really carries the tag and the hidden text
    expect(before.exif).toBeDefined();
    const out = await processProductImage(withMeta);
    const meta = await sharp(out.data).metadata();
    expect(meta.exif).toBeUndefined(); // nothing hidden survives
    expect([out.width, out.height]).toEqual([50, 100]); // orientation 6 = rotated a quarter turn
  });

  it('refuses anything that is not a real image, whatever it is called', async () => {
    expect(await reason(processProductImage(Buffer.from('MZ\u0090 pretend this is photo.jpg')))).toBe('unsupported');
    expect(await reason(processProductImage(Buffer.from('%PDF-1.4 a pdf, not a photo, padding padding')))).toBe('unsupported'); // PDFs are fine as payment proof, not as product photos
    expect(await reason(processProductImage(Buffer.from('<svg xmlns="http://www.w3.org/2000/svg"><script>alert(1)</script></svg>')))).toBe('unsupported');
    expect(await reason(processProductImage(Buffer.alloc(0)))).toBe('unsupported');
  });

  it('refuses a file that starts like a JPEG but is not one (corrupt)', async () => {
    const fake = Buffer.concat([Buffer.from([0xff, 0xd8, 0xff, 0xe0]), Buffer.from('this is not really image data at all')]);
    expect(await reason(processProductImage(fake))).toBe('corrupt');
  });

  it('refuses files over the upload size cap', async () => {
    const huge = Buffer.alloc(MAX_IMAGE_UPLOAD_BYTES + 1);
    huge.set([0xff, 0xd8, 0xff]);
    expect(await reason(processProductImage(huge))).toBe('too_large');
  });

  it('refuses an image with an absurd number of pixels (a decompression bomb)', async () => {
    // Small on disk, but ~56 million pixels once decoded.
    const bomb = await sharp({ create: { width: 8000, height: 7000, channels: 3, background: '#fff' } }).png({ compressionLevel: 9 }).toBuffer();
    expect(bomb.length).toBeLessThan(MAX_IMAGE_UPLOAD_BYTES);
    expect(await reason(processProductImage(bomb))).toBe('too_many_pixels');
  }, 60_000);
});
