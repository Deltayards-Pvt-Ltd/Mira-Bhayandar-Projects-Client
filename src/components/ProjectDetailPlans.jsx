import { useContext, useEffect, useMemo, useState } from "react";
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

function Chevron({ dir, className }) {
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
      <path d={dir === "left" ? "m15 18-6-6 6-6" : "m9 18 6-6-6-6"} />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
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

export default function ProjectDetailPlans({ project, assetUrl }) {
  const backendUrl = useContext(AppContext)?.backendUrl ?? "";

  const layouts = useMemo(() => {
    const raw = project?.layouts;
    if (!Array.isArray(raw)) return [];
    return raw.filter((l) => l && String(l.title || "").trim());
  }, [project?.layouts]);

  const [idx, setIdx] = useState(0);
  const [imageIdx, setImageIdx] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const brochures = useMemo(() => {
    const raw = project?.browcherPdf;
    if (!raw) return [];
    if (typeof raw === "string" && raw.trim()) {
      return [{ title: "Brochure", href: assetUrl(raw.trim()) }];
    }
    if (!Array.isArray(raw)) return [];
    return raw
      .filter((b) => b?.file)
      .map((b) => ({
        title: String(b.title || "Brochure").trim() || "Brochure",
        href: assetUrl(String(b.file).trim()),
      }));
  }, [project?.browcherPdf, assetUrl]);

  useEffect(() => {
    setIdx((i) => (layouts.length ? Math.min(i, layouts.length - 1) : 0));
  }, [layouts.length]);

  useEffect(() => {
    setImageIdx(0);
    setLightboxOpen(false);
  }, [idx]);

  const active = layouts[idx] ?? null;
  const title = active ? String(active.title || "Plan").trim() : "";
  const areaLine = active?.area ? String(active.area).trim() : "";

  const images = useMemo(() => {
    if (!active) return [];
    if (Array.isArray(active.images) && active.images.length) {
      return active.images.map((u) => String(u || "").trim()).filter(Boolean);
    }
    const one = String(active.image || "").trim();
    return one ? [one] : [];
  }, [active]);

  const n = images.length;
  const safeIdx = n ? Math.min(imageIdx, n - 1) : 0;
  const imagePath = n ? images[safeIdx] : "";
  const imgSrc = imagePath ? assetUrl(imagePath) : "";
  const multi = n > 1;

  useEffect(() => {
    if (!lightboxOpen) return;
    const onKey = (e) => {
      if (e.key === "Escape") setLightboxOpen(false);
      if (e.key === "ArrowLeft" && multi) setImageIdx((i) => (i - 1 + n) % n);
      if (e.key === "ArrowRight" && multi) setImageIdx((i) => (i + 1) % n);
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [lightboxOpen, multi, n]);

  const step = (delta) => {
    if (!multi) return;
    setImageIdx((i) => (i + delta + n) % n);
  };

  const downloadPlanImage = async () => {
    if (!imgSrc || downloading) return;
    const ext =
      imagePath.match(/\.(jpe?g|png|webp|gif|avif)$/i)?.[1]?.toLowerCase() || "jpg";
    const filename =
      `${title.replace(/[^\w\s-]/g, "").replace(/\s+/g, "-").slice(0, 80) || "floor-plan"}.${ext}`;

    setDownloading(true);
    try {
      const res = await fetch(imgSrc, { mode: "cors" });
      if (!res.ok) throw new Error("fetch failed");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      if (!backendUrl) return;
      try {
        const assetParam = /^https?:\/\//i.test(imagePath)
          ? imagePath
          : imagePath.replace(/^\/+/, "");
        const { data } = await axios.get(`${backendUrl}/api/project/download-asset`, {
          params: { url: assetParam, filename },
          responseType: "blob",
        });
        const url = URL.createObjectURL(data);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
      } catch (err) {
        console.error("Floor plan download failed:", err?.message || err);
      }
    } finally {
      setDownloading(false);
    }
  };

  if (!layouts.length) return null;

  const navOffset = "calc(5.5rem + env(safe-area-inset-top, 0px))";
  const planMax =
    "min(calc(100dvh - 5.5rem - env(safe-area-inset-top, 0px) - 11.5rem), 28rem)";

  const navBtn =
    "absolute top-1/2 z-20 -translate-y-1/2 rounded-full border p-2 shadow-md transition";

  const lightbox =
    lightboxOpen && imgSrc ? (
      <div
        className="fixed inset-0 z-[200] flex items-center justify-center bg-navy/92 p-4 backdrop-blur-md"
        role="dialog"
        aria-modal="true"
        aria-label={`${title} floor plan`}
        onClick={() => setLightboxOpen(false)}
      >
        <button
          type="button"
          className="absolute right-4 top-4 z-20 flex h-11 w-11 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white hover:bg-white/20"
          aria-label="Close"
          onClick={(e) => {
            e.stopPropagation();
            setLightboxOpen(false);
          }}
        >
          <CloseIcon />
        </button>

        {multi ? (
          <>
            <button
              type="button"
              className="absolute left-2 top-1/2 z-20 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white hover:bg-white/20 sm:left-6"
              aria-label="Previous"
              onClick={(e) => {
                e.stopPropagation();
                step(-1);
              }}
            >
              <Chevron dir="left" />
            </button>
            <button
              type="button"
              className="absolute right-2 top-1/2 z-20 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white hover:bg-white/20 sm:right-6"
              aria-label="Next"
              onClick={(e) => {
                e.stopPropagation();
                step(1);
              }}
            >
              <Chevron dir="right" />
            </button>
          </>
        ) : null}

        <div
          className="relative z-10 mx-auto flex max-h-[92vh] w-full max-w-5xl flex-col items-center gap-4"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="w-full text-center">
            <h3 className="text-xl font-medium text-white sm:text-2xl">{title}</h3>
            {areaLine ? (
              <p className="mt-1 text-base text-gold-light sm:text-lg">{areaLine}</p>
            ) : null}
          </div>
          <div className="relative w-full overflow-hidden rounded-2xl border border-white/15 bg-navy-light/80 p-3 sm:p-6">
            <img
              src={imgSrc}
              alt={`${title} floor plan`}
              className="mx-auto max-h-[min(68vh,640px)] w-full object-contain"
            />
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4">
            {multi ? (
              <p className="text-sm text-white/80">
                <span className="text-gold-light">{safeIdx + 1}</span>
                <span className="text-white/40"> / </span>
                {n}
              </p>
            ) : null}
            <button
              type="button"
              onClick={downloadPlanImage}
              disabled={downloading}
              className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-white hover:bg-white/20 disabled:opacity-60"
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
      className="noise-overlay relative overflow-x-hidden border-b border-white/10 bg-navy-gradient text-cream"
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
      <div className="relative z-[2] mx-auto max-w-6xl overflow-x-hidden px-4 py-10 sm:px-6 sm:py-12 lg:px-8 lg:py-14">
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
          <div className="flex flex-wrap gap-2" role="tablist" aria-label="Layout plans">
            {layouts.map((layout, i) => (
              <button
                key={`${layout._id ?? ""}-${i}`}
                type="button"
                role="tab"
                aria-selected={i === idx}
                onClick={() => setIdx(i)}
                className={`rounded-full border-2 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.12em] transition sm:px-5 sm:py-2.5 sm:text-xs ${
                  i === idx
                    ? "border-gold bg-gold text-navy shadow-[0_8px_28px_-6px_rgba(212,168,83,0.45)]"
                    : "border-white/25 bg-white/[0.06] text-white/90 hover:border-gold/55 hover:bg-white/[0.1]"
                }`}
              >
                {String(layout.title || `Plan ${i + 1}`).trim()}
              </button>
            ))}
          </div>

          <div className="mt-3 flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gold">
                Selected layout
              </p>
              <p className="mt-0.5 text-lg font-medium text-white sm:text-xl">{title}</p>
            </div>
            {areaLine ? (
              <p className="text-lg font-medium text-white/95 sm:text-xl">{areaLine} sq.ft. <span className="text-xs text-white/50">(Carpet Area)</span></p>
            ) : null}
          </div>
        </div>

        {n > 0 ? (
          <div className="mt-4 overflow-hidden rounded-2xl border border-white/15 bg-white/[0.04] p-1 sm:mt-5">
            <div
              className="relative flex items-center justify-center rounded-[14px] bg-white p-2 sm:p-4"
              style={{ maxHeight: planMax }}
            >
              {multi ? (
                <>
                  <button
                    type="button"
                    onClick={() => step(-1)}
                    aria-label="Previous image"
                    className={`${navBtn} left-2 border-navy/15 bg-white/95 text-navy hover:bg-white sm:left-3`}
                  >
                    <Chevron dir="left" />
                  </button>
                  <button
                    type="button"
                    onClick={() => step(1)}
                    aria-label="Next image"
                    className={`${navBtn} right-2 border-navy/15 bg-white/95 text-navy hover:bg-white sm:right-3`}
                  >
                    <Chevron dir="right" />
                  </button>
                </>
              ) : null}

              <button
                type="button"
                onClick={() => setLightboxOpen(true)}
                className={`w-full cursor-zoom-in ${multi ? "px-10 sm:px-12" : ""}`}
                aria-label={`View ${title} full size`}
              >
                <img
                  src={imgSrc}
                  alt={`${title} floor plan`}
                  className="mx-auto w-full object-contain"
                  style={{ maxHeight: planMax }}
                  loading="lazy"
                />
              </button>

              {multi ? (
                <p className="absolute bottom-3 right-3 rounded-full bg-navy/75 px-2.5 py-1 text-[10px] font-semibold text-white sm:bottom-4 sm:right-4">
                  {safeIdx + 1} / {n}
                </p>
              ) : null}

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  downloadPlanImage();
                }}
                disabled={downloading}
                className="absolute bottom-3 left-3 inline-flex items-center gap-2 rounded-full border border-navy/15 bg-white/95 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-navy shadow-md hover:bg-white disabled:opacity-70 sm:bottom-4 sm:left-4"
              >
                <DownloadIcon className="text-navy" />
                {downloading ? "Saving…" : "Download"}
              </button>
            </div>
          </div>
        ) : (
          <p className="mt-5 text-sm text-white/50">No floor plan images for this layout.</p>
        )}

        {brochures.length === 1 ? (
          <a
            href={brochures[0].href}
            target="_blank"
            rel="noopener noreferrer"
            className="group mt-5 inline-flex items-center gap-2.5 text-sm font-semibold uppercase tracking-[0.14em] text-gold-light transition hover:text-gold sm:mt-6"
          >
            <DownloadIcon className="text-gold group-hover:text-gold-light" />
            Download full brochure (PDF)
          </a>
        ) : brochures.length > 1 ? (
          <ul
            className="mt-5 flex flex-col gap-3 sm:mt-6 md:flex-row md:flex-wrap md:gap-x-8 md:gap-y-3"
            role="list"
          >
            {brochures.map((b, i) => (
              <li key={`${b.title}-${i}`} className="min-w-0 md:shrink-0">
                <a
                  href={b.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex max-w-full items-center gap-2.5 whitespace-nowrap text-sm font-semibold uppercase text-gold-light transition hover:text-gold"
                >
                  <DownloadIcon className="shrink-0 text-gold group-hover:text-gold-light" />
                  Download {b.title} Brochure (PDF)
                </a>
              </li>
            ))}
          </ul>
        ) : null}
      </div>

      {typeof document !== "undefined" && lightbox
        ? createPortal(lightbox, document.body)
        : null}
    </section>
  );
}
