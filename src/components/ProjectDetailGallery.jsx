import { useCallback, useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";

function ChevronLeft({ className }) {
  return (
    <svg
      className={className}
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}

function ChevronRight({ className }) {
  return (
    <svg
      className={className}
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

function CloseIcon({ className }) {
  return (
    <svg
      className={className}
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}

/**
 * @param {{
 *   project: Record<string, unknown>;
 *   assetUrl: (path: string) => string;
 * }} props
 */
export default function ProjectDetailGallery({ project, assetUrl }) {
  const items = useMemo(() => {
    const raw = project?.galleryImages;
    if (!Array.isArray(raw)) return [];
    return raw
      .map((g) => ({
        title: String(g?.title || "").trim() || "Photo",
        src: String(g?.image || "").trim(),
      }))
      .filter((g) => g.src);
  }, [project?.galleryImages]);

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIdx, setLightboxIdx] = useState(0);

  const n = items.length;
  const goPrev = useCallback(() => {
    if (n < 2) return;
    setLightboxIdx((i) => (i - 1 + n) % n);
  }, [n]);
  const goNext = useCallback(() => {
    if (n < 2) return;
    setLightboxIdx((i) => (i + 1) % n);
  }, [n]);

  const openAt = useCallback((i) => {
    setLightboxIdx(i);
    setLightboxOpen(true);
  }, []);

  const close = useCallback(() => setLightboxOpen(false), []);

  useEffect(() => {
    if (!lightboxOpen) return;
    const onKey = (e) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [lightboxOpen, close, goPrev, goNext]);

  if (n === 0) return null;

  const current = items[lightboxIdx];
  const mainSrc = current ? assetUrl(current.src) : "";

  const lightbox =
    lightboxOpen && current ? (
      <div
        className="fixed inset-0 z-[200] flex items-center justify-center bg-navy/92 p-4 backdrop-blur-md"
        role="dialog"
        aria-modal="true"
        aria-label="Gallery"
        onClick={close}
      >
        <button
          type="button"
          className="absolute right-4 top-4 z-20 flex h-11 w-11 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white transition-colors hover:bg-white/20"
          aria-label="Close gallery"
          onClick={(e) => {
            e.stopPropagation();
            close();
          }}
        >
          <CloseIcon />
        </button>

        {n > 1 ? (
          <>
            <button
              type="button"
              className="absolute left-2 top-1/2 z-20 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white transition-colors hover:bg-white/20 sm:left-6 md:h-14 md:w-14"
              aria-label="Previous image"
              onClick={(e) => {
                e.stopPropagation();
                goPrev();
              }}
            >
              <ChevronLeft />
            </button>
            <button
              type="button"
              className="absolute right-2 top-1/2 z-20 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white transition-colors hover:bg-white/20 sm:right-6 md:h-14 md:w-14"
              aria-label="Next image"
              onClick={(e) => {
                e.stopPropagation();
                goNext();
              }}
            >
              <ChevronRight />
            </button>
          </>
        ) : null}

        <div
          className="relative z-10 mx-auto flex max-h-[90vh] w-full max-w-5xl flex-col items-center gap-4"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="relative w-full overflow-hidden rounded-2xl border border-white/15 bg-navy-light/80 shadow-2xl ring-1 ring-white/10">
            <div className="flex max-h-[min(78vh,720px)] min-h-[200px] items-center justify-center bg-black/20 p-3 sm:p-6">
              <img
                key={mainSrc}
                src={mainSrc}
                alt={current.title}
                className="max-h-[min(72vh,680px)] w-full object-contain"
              />
            </div>
          </div>
          <p className="text-center text-sm font-medium text-white/80">
            <span className="text-gold-light">{lightboxIdx + 1}</span>
            <span className="text-white/40"> / </span>
            <span>{n}</span>
            {current.title ? (
              <>
                <span className="mx-2 text-white/35" aria-hidden>
                  ·
                </span>
                <span className="text-white/70">{current.title}</span>
              </>
            ) : null}
          </p>
        </div>
      </div>
    ) : null;

  return (
    <section
      className="border-b border-navy/[0.08] bg-[#fdfbf7] text-navy"
      aria-labelledby="project-gallery-heading"
    >
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-ink">
          Gallery
        </p>
        <h2
          id="project-gallery-heading"
          className="mt-2 text-3xl font-normal tracking-tight text-navy sm:text-4xl"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Photos
        </h2>

        <ul className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
          {items.map((item, i) => (
            <li key={`${item.src}-${i}`}>
              <button
                type="button"
                className="group relative aspect-[4/3] w-full overflow-hidden rounded-2xl border-2 border-navy/[0.08] bg-navy/[0.04] text-left shadow-[0_8px_28px_-12px_rgba(10,22,40,0.12)] transition-[border-color,box-shadow,transform] duration-200 hover:border-gold/50 hover:shadow-[0_16px_40px_-16px_rgba(212,168,83,0.25)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold motion-safe:hover:scale-[1.02]"
                onClick={() => openAt(i)}
              >
                <img
                  src={assetUrl(item.src)}
                  alt={item.title}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                  decoding="async"
                />
                <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-navy/55 via-transparent to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
                <span className="pointer-events-none absolute bottom-2 left-2 right-2 truncate text-[11px] font-semibold uppercase tracking-[0.12em] text-white opacity-0 drop-shadow-sm transition-opacity duration-200 group-hover:opacity-100">
                  {item.title}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      {typeof document !== "undefined" && lightbox
        ? createPortal(lightbox, document.body)
        : null}
    </section>
  );
}
