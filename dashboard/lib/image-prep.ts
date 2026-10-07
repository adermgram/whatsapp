/**
 * Shrinks a phone photo in the browser BEFORE uploading it. Phone cameras make 4-12 MB pictures; sending those over
 * mobile data is slow and can exceed the upload limit. 2000px at 85% quality is ~300-800 KB and still sharp.
 * The server re-checks and re-encodes everything anyway, so this is purely for speed: if anything goes wrong
 * (or the browser cannot decode the format, e.g. iPhone HEIC in Chrome) the original file is sent unchanged.
 */
export async function prepareImage(file: File, maxEdge = 2000): Promise<File> {
  if (!/^image\/(jpeg|png|webp)$/.test(file.type)) return file;
  try {
    const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
    const scale = Math.min(1, maxEdge / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(bitmap.width * scale));
    canvas.height = Math.max(1, Math.round(bitmap.height * scale));
    const ctx = canvas.getContext("2d");
    if (!ctx) return file;
    ctx.fillStyle = "#ffffff"; // transparent areas become white, as on the server
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    bitmap.close();

    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.85));
    if (!blob || (scale === 1 && blob.size >= file.size)) return file; // no gain: keep the original
    return new File([blob], `${file.name.replace(/\.[^.]+$/, "") || "photo"}.jpg`, { type: "image/jpeg" });
  } catch {
    return file;
  }
}
