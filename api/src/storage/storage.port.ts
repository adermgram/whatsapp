/** Port. LocalStorage for dev; Cloudflare R2 (S3 API) is a drop-in adapter once a bucket exists. */
export abstract class StoragePort {
  abstract put(key: string, data: Buffer, contentType: string): Promise<void>;
  abstract get(key: string): Promise<Buffer | null>;
  /** Removes a file. Deleting something that is already gone is not an error. */
  abstract delete(key: string): Promise<void>;
  /** Public URL if the backend serves files directly (R2 public bucket); null for private/local storage. */
  abstract publicUrl(key: string): string | null;
}
