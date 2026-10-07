/* eslint-disable @next/next/no-img-element -- these pictures come from our own authenticated API, not a public URL, so the image optimiser cannot fetch them */

/** A product's main photo, or a tidy placeholder when it has none yet. */
export function ProductThumb({ imageId, name, className = "size-16" }: { imageId: string | null; name: string; className?: string }) {
  if (!imageId) {
    return (
      <div className={`${className} grid shrink-0 place-items-center rounded-lg border border-dashed border-line bg-bg text-muted`} aria-label={`${name}: no photo yet`}>
        <svg viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <rect x="3" y="4" width="18" height="16" rx="2" />
          <circle cx="9" cy="10" r="1.5" />
          <path d="M21 16l-5-5-8 8" />
        </svg>
      </div>
    );
  }
  return <img src={`/api/images/${imageId}`} alt={name} loading="lazy" className={`${className} shrink-0 rounded-lg border border-line object-cover`} />;
}
