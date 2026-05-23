import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import axios from "axios";
import { AppContext } from "../context/AppContext";

function DownloadIcon({ className }) {
  return (
    <svg
      className={className}
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" x2="12" y1="15" y2="3" />
    </svg>
  );
}

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

function formatAreaSqft(area) {
  if (area === undefined || area === null || area === "") return "";
  const s = String(area).trim();
  if (!s) return "";
  if (/sq\s*ft/i.test(s)) return s;
  if (/^\d+(\.\d+)?$/.test(s)) {
    const n = Number(s);
    if (Number.isFinite(n) && n > 0) {
      return `${n.toLocaleString("en-IN")} sq ft`;
    }
    return "";
  }
  if (/\d/.test(s)) return `${s} sq ft`;
  return "";
}

function formatPriceLacs(price) {
  if (price === undefined || price === null || price === "") return "";
  const n = Number(price);
  if (!Number.isFinite(n) || n <= 0) return "";
  return `₹${n} L`;
}

function layoutImageUrls(layout) {
  if (!layout) return [];
  const fromArray = Array.isArray(layout.images)
    ? layout.images.map((u) => String(u || "").trim()).filter(Boolean)
    : [];
  if (fromArray.length) return fromArray;
  const single = String(layout.image || "").trim();
  return single ? [single] : [];
}

function planDownloadFilename(title, imagePath) {
  const ext =
    String(imagePath).match(/\.(jpe?g|png|webp|gif|avif)$/i)?.[1]?.toLowerCase() || "jpg";
  const safe =
    String(title)
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .slice(0, 80) || "floor-plan";
  return `${safe}.${ext}`;
}

function saveBlobAsFile(blob, filename) {
  const objectUrl = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = objectUrl;
  link.download = filename;
  link.rel = "noopener";
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(objectUrl);
}

export default function ProjectDetailPlans({ project, assetUrl }) {
  const backendUrl = useContext(AppContext)?.backendUrl ?? "";
  const layouts = useMemo(() => {
    const raw = project?.layouts;
    if (!Array.isArray(raw)) return [];
    return raw.filter((l) => l && String(l.title || "").trim());
  }, [project?.layouts]);

  const [idx, setIdx] = useState(0);
  const [previewIdx, setPreviewIdx] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIdx, setLightboxIdx] = useState(0);
  const [downloading, setDownloading] = useState(false);
  const brochure = String(project?.browcherPdf || "").trim();
  const brochureHref = brochure ? assetUrl(brochure) : "";

  useEffect(() => {
    setIdx((i) => (layouts.length ? Math.min(i, layouts.length - 1) : 0));
  }, [layouts.length]);

  const active = layouts.length ? layouts[idx] ?? layouts[0] : null;
  const images = useMemo(() => layoutImageUrls(active), [active]);
  const n = images.length;

  useEffect(() => {
    setPreviewIdx(0);
    setLightboxIdx(0);
    setLightboxOpen(false);
  }, [idx]);

  const title = active
    ? String(active?.title || "Plan").trim() || "Plan"
    : "";
  const areaLine = active ? formatAreaSqft(active?.area) : "";
  const priceLine = active ? formatPriceLacs(active?.price) : "";

  const goPrev = useCallback(() => {
    if (n < 2) return;
    const step = (i) => (i - 1 + n) % n;
    if (lightboxOpen) setLightboxIdx(step);
    else setPreviewIdx(step);
  }, [lightboxOpen, n]);

  const goNext = useCallback(() => {
    if (n < 2) return;
    const step = (i) => (i + 1) % n;
    if (lightboxOpen) setLightboxIdx(step);
    else setPreviewIdx(step);
  }, [lightboxOpen, n]);

  const openLightbox = useCallback(() => {
    setLightboxIdx(previewIdx);
    setLightboxOpen(true);
  }, [previewIdx]);

  const closeLightbox = useCallback(() => setLightboxOpen(false), []);

  useEffect(() => {
    if (!lightboxOpen) return;
    const onKey = (e) => {
      if (e.key === "Escape") closeLightbox();
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
  }, [lightboxOpen, closeLightbox, goPrev, goNext]);

  const safePreviewIdx = n ? Math.min(previewIdx, n - 1) : 0;
  const safeLbIdx = n ? Math.min(lightboxIdx, n - 1) : 0;
  const activeImageIdx = lightboxOpen ? safeLbIdx : safePreviewIdx;
  const imagePath = n ? images[activeImageIdx] : "";
  const previewSrc = n ? assetUrl(images[safePreviewIdx]) : "";
  const imgSrc = imagePath ? assetUrl(imagePath) : "";
  const multiImages = n > 1;

  const planViewportMax =
    "min(calc(100dvh - 5.5rem - env(safe-area-inset-top, 0px) - 11.5rem), 28rem)";

  const downloadPlanImage = useCallback(async () => {
    if (!imgSrc || downloading) return;
    const filename = planDownloadFilename(title, imagePath);
    const assetParam = /^https?:\/\//i.test(imagePath)
      ? imagePath
      : imagePath.replace(/^\/+/, "");

    setDownloading(true);
    try {
      const res = await fetch(imgSrc, { mode: "cors" });
      if (!res.ok) throw new Error(`fetch failed (${res.status})`);
      saveBlobAsFile(await res.blob(), filename);
    } catch {
      if (!backendUrl) {
        console.error("Floor plan download failed: backend URL not configured");
        return;
      }
      try {
        const { data } = await axios.get(`${backendUrl}/api/project/download-asset`, {
          params: { url: assetParam, filename },
          responseType: "blob",
        });
        if (data?.type?.includes("application/json")) {
          const err = JSON.parse(await data.text());
          throw new Error(err?.message || "Download failed");
        }
        saveBlobAsFile(data, filename);
      } catch (err) {
        console.error("Floor plan download failed:", err?.message || err);
      }
    } finally {
      setDownloading(false);
    }
  }, [backendUrl, downloading, imagePath, imgSrc, title]);

  if (layouts.length === 0) return null;

  const navOffset = "calc(5.5rem + env(safe-area-inset-top, 0px))";

  const lightbox =
    lightboxOpen && n > 0 ? (
      <div
        className="fixed inset-0 z-[200] flex items-center justify-center bg-navy/92 p-4 backdrop-blur-md"
        role="dialog"
        aria-modal="true"
        aria-label={`${title} floor plan`}
        onClick={closeLightbox}
      >
        <button
          type="button"
          className="absolute right-4 top-4 z-20 flex h-11 w-11 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white transition-colors hover:bg-white/20"
          aria-label="Close floor plan viewer"
          onClick={(e) => {
            e.stopPropagation();
            closeLightbox();
          }}
        >
          <CloseIcon />
        </button>

        {n > 1 ? (
          <>
            <button
              type="button"
              className="absolute left-2 top-1/2 z-20 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white transition-colors hover:bg-white/20 sm:left-6 md:h-14 md:w-14"
              aria-label="Previous floor plan"
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
              aria-label="Next floor plan"
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
          className="relative z-10 mx-auto flex max-h-[92vh] w-full max-w-5xl flex-col items-center gap-4"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="w-full text-center">
            <h3 className="text-xl font-medium tracking-tight text-white sm:text-2xl">
              {title}
            </h3>
            {areaLine ? (
              <p className="mt-1 text-base tabular-nums text-gold-light sm:text-lg">
                {areaLine}
              </p>
            ) : null}
            {priceLine ? (
              <p className="mt-0.5 text-sm text-white/70">{priceLine}</p>
            ) : null}
          </div>

          <div className="relative w-full overflow-hidden rounded-2xl border border-white/15 bg-navy-light/80 shadow-2xl ring-1 ring-white/10">
            <div className="flex max-h-[min(72vh,680px)] min-h-[200px] items-center justify-center bg-black/20 p-3 sm:p-6">
              <img
                key={imgSrc}
                src={imgSrc}
                alt={`${title} floor plan`}
                className="max-h-[min(68vh,640px)] w-full object-contain"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4">
            {n > 1 ? (
              <p className="text-sm font-medium text-white/80">
                <span className="text-gold-light">{safeLbIdx + 1}</span>
                <span className="text-white/40"> / </span>
                <span>{n}</span>
              </p>
            ) : null}
            <button
              type="button"
              onClick={downloadPlanImage}
              disabled={downloading}
              className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-white transition hover:bg-white/20 disabled:opacity-60"
            >
              <DownloadIcon />
              {downloading ? "Saving…" : "Download"}
            </button>
          </div>
        </div>
      </div>
    ) : null;

  return (
    <section
      className="noise-overlay relative border-b border-white/10 bg-navy-gradient text-cream"
      aria-labelledby="project-plans-heading"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 55% at 50% -10%, rgba(212,168,83,0.08) 0%, transparent 55%)",
        }}
      />
      <div className="relative z-[2] mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8 lg:py-14">
        <header className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-light">
            Floor plans
          </p>
          <h2
            id="project-plans-heading"
            className="mt-1.5 text-2xl font-normal tracking-tight text-white sm:text-3xl md:text-[2.35rem] md:leading-tight"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Plans
          </h2>
        </header>

        <div
          className="sticky z-20 -mx-4 mt-5 border-b border-white/10 bg-navy-gradient/95 px-4 pb-4 pt-1 backdrop-blur-md sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8"
          style={{ top: navOffset }}
        >
          <div
            className="flex flex-wrap gap-2"
            role="tablist"
            aria-label="Layout plans"
          >
            {layouts.map((layout, i) => {
              const label = String(layout?.title || `Plan ${i + 1}`).trim();
              const selected = i === idx;
              return (
                <button
                  key={`${String(layout?._id ?? "")}-${i}`}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  id={`plan-tab-${i}`}
                  aria-controls="plan-panel"
                  onClick={() => setIdx(i)}
                  className={`rounded-full border-2 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.12em] transition-[background-color,border-color,color,box-shadow] duration-200 sm:px-5 sm:py-2.5 sm:text-xs sm:tracking-[0.14em] ${
                    selected
                      ? "border-gold bg-gold text-navy shadow-[0_8px_28px_-6px_rgba(212,168,83,0.45)]"
                      : "border-white/25 bg-white/[0.06] text-white/90 backdrop-blur-sm hover:border-gold/55 hover:bg-white/[0.1] hover:text-white"
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>

          <div className="mt-3 flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gold">
                Selected layout
              </p>
              <p className="mt-0.5 text-lg font-medium tracking-tight text-white sm:text-xl">
                {title}
              </p>
            </div>
            <div className="sm:text-right">
              {areaLine ? (
                <p className="mt-0.5 text-lg font-medium tabular-nums tracking-tight text-white/95 sm:text-xl">
                  {areaLine}
                </p>
              ) : null}
              {priceLine ? (
                <p className="mt-0.5 text-lg font-medium tabular-nums tracking-tight text-gold-light sm:text-xl">
                  {priceLine}
                </p>
              ) : null}
              {!areaLine && !priceLine ? (
                <p className="mt-0.5 text-lg font-medium tracking-tight text-white/50 sm:text-xl">
                  —
                </p>
              ) : null}
            </div>
          </div>
        </div>

        {n > 0 ? (
          <div
            id="plan-panel"
            role="tabpanel"
            aria-labelledby={`plan-tab-${idx}`}
            className="mt-4 overflow-hidden rounded-2xl border border-white/15 bg-white/[0.04] p-1 shadow-[0_24px_80px_-28px_rgba(0,0,0,0.55)] ring-1 ring-white/10 backdrop-blur-sm sm:mt-5 sm:p-1.5"
          >
            <div
              className="relative flex items-center justify-center overflow-hidden rounded-[14px] bg-white p-2 sm:p-4"
              style={{ maxHeight: planViewportMax }}
            >
              {multiImages ? (
                <>
                  <button
                    type="button"
                    onClick={goPrev}
                    aria-label="Previous floor plan image"
                    className="absolute left-2 top-1/2 z-20 -translate-y-1/2 rounded-full border border-navy/15 bg-white/95 p-2 text-navy shadow-md transition hover:bg-white sm:left-3"
                  >
                    <ChevronLeft />
                  </button>
                  <button
                    type="button"
                    onClick={goNext}
                    aria-label="Next floor plan image"
                    className="absolute right-2 top-1/2 z-20 -translate-y-1/2 rounded-full border border-navy/15 bg-white/95 p-2 text-navy shadow-md transition hover:bg-white sm:right-3"
                  >
                    <ChevronRight />
                  </button>
                </>
              ) : null}

              <button
                type="button"
                onClick={openLightbox}
                className={`relative w-full cursor-zoom-in overflow-hidden text-left ${multiImages ? "px-10 sm:px-12" : ""}`}
                aria-label={`View ${title} floor plan full size`}
              >
                <div
                  className="flex transition-transform duration-300 ease-out"
                  style={{ transform: `translateX(-${safePreviewIdx * 100}%)` }}
                >
                  {images.map((path, i) => (
                    <div
                      key={`${path}-${i}`}
                      className="flex min-w-full shrink-0 justify-center"
                    >
                      <img
                        src={assetUrl(path)}
                        alt={`${title} floor plan ${i + 1}`}
                        className="mx-auto w-full max-w-full object-contain"
                        style={{ maxHeight: planViewportMax }}
                        loading={i === 0 ? "lazy" : "eager"}
                        decoding="async"
                      />
                    </div>
                  ))}
                </div>
              </button>

              {multiImages ? (
                <p className="absolute bottom-3 right-3 z-10 rounded-full bg-navy/75 px-2.5 py-1 text-[10px] font-semibold tabular-nums text-white sm:bottom-4 sm:right-4">
                  {safePreviewIdx + 1} / {n}
                </p>
              ) : null}

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  downloadPlanImage();
                }}
                disabled={downloading || !previewSrc}
                aria-label="Download floor plan image"
                className="absolute bottom-3 left-3 z-10 inline-flex items-center gap-2 rounded-full border border-navy/15 bg-white/95 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-navy shadow-[0_8px_24px_-8px_rgba(0,0,0,0.35)] backdrop-blur-sm transition hover:bg-white disabled:cursor-wait disabled:opacity-70 sm:bottom-4 sm:left-4 sm:px-3.5 sm:py-2.5 sm:text-[11px]"
              >
                <DownloadIcon className="shrink-0 text-navy" />
                {downloading ? "Saving…" : "Download"}
              </button>
            </div>
          </div>
        ) : (
          <p className="mt-5 text-sm text-white/50">No floor plan images for this layout.</p>
        )}

        {brochureHref ? (
          <a
            href={brochureHref}
            target="_blank"
            rel="noopener noreferrer"
            className="group mt-5 inline-flex items-center gap-2.5 text-sm font-semibold uppercase tracking-[0.14em] text-gold-light transition-colors hover:text-gold sm:mt-6"
          >
            <DownloadIcon className="text-gold transition-colors group-hover:text-gold-light" />
            Download full brochure (PDF)
          </a>
        ) : null}
      </div>

      {typeof document !== "undefined" && lightbox
        ? createPortal(lightbox, document.body)
        : null}
    </section>
  );
}
