import { useCallback, useContext, useEffect, useMemo, useState } from "react";
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

function formatAreaSqft(area) {
  if (area === undefined || area === null || area === "") return "";
  const n = Number(area);
  if (!Number.isFinite(n) || n <= 0) return "";
  return `${n.toLocaleString("en-IN")} sq ft`;
}

function formatPriceLacs(price) {
  if (price === undefined || price === null || price === "") return "";
  const n = Number(price);
  if (!Number.isFinite(n) || n <= 0) return "";
  return `₹${n} L`;
}

function layoutHasImage(layout) {
  return Boolean(layout && String(layout.image || "").trim());
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

/**
 * @param {{
 *   project: Record<string, unknown>;
 *   assetUrl: (path: string) => string;
 * }} props
 */
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
  const [downloading, setDownloading] = useState(false);
  const brochure = String(project?.browcherPdf || "").trim();
  const brochureHref = brochure ? assetUrl(brochure) : "";

  useEffect(() => {
    setIdx((i) => (layouts.length ? Math.min(i, layouts.length - 1) : 0));
  }, [layouts.length]);

  const active = layouts.length ? layouts[idx] ?? layouts[0] : null;
  const title = active
    ? String(active?.title || "Plan").trim() || "Plan"
    : "";
  const areaLine = active ? formatAreaSqft(active?.area) : "";
  const priceLine = active ? formatPriceLacs(active?.price) : "";
  const hasImage = active ? layoutHasImage(active) : false;
  const imgSrc =
    active && hasImage ? assetUrl(String(active.image)) : "";
  const imagePath = active ? String(active?.image || "") : "";

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
  const planViewportMax =
    "min(calc(100dvh - 5.5rem - env(safe-area-inset-top, 0px) - 11.5rem), 28rem)";

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
              {!areaLine && !priceLine && brochureHref ? (
                <p className="mt-0.5 text-xs text-white/45">Details in brochure</p>
              ) : null}
            </div>
          </div>
        </div>

        {hasImage ? (
          <div
            id="plan-panel"
            role="tabpanel"
            aria-labelledby={`plan-tab-${idx}`}
            className="mt-4 overflow-hidden rounded-2xl border border-white/15 bg-white/[0.04] p-1 shadow-[0_24px_80px_-28px_rgba(0,0,0,0.55)] ring-1 ring-white/10 backdrop-blur-sm sm:mt-5 sm:p-1.5"
          >
            <div
              className="relative flex items-center justify-center overflow-auto rounded-[14px] bg-white p-2 sm:p-4"
              style={{ maxHeight: planViewportMax }}
            >
              <img
                key={imgSrc}
                src={imgSrc}
                alt={`${title} floor plan`}
                className="mx-auto w-full max-w-full object-contain"
                style={{ maxHeight: planViewportMax }}
                loading="lazy"
                decoding="async"
              />
              <button
                type="button"
                onClick={downloadPlanImage}
                disabled={downloading || !imgSrc}
                aria-label="Download floor plan image"
                className="absolute bottom-3 left-3 z-10 inline-flex items-center gap-2 rounded-full border border-navy/15 bg-white/95 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-navy shadow-[0_8px_24px_-8px_rgba(0,0,0,0.35)] backdrop-blur-sm transition-[background-color,box-shadow] hover:bg-white hover:shadow-[0_10px_28px_-8px_rgba(0,0,0,0.4)] disabled:cursor-wait disabled:opacity-70 sm:bottom-4 sm:left-4 sm:px-3.5 sm:py-2.5 sm:text-[11px]"
              >
                <DownloadIcon className="shrink-0 text-navy" />
                {downloading ? "Saving…" : "Download"}
              </button>
            </div>
          </div>
        ) : null}

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
    </section>
  );
}
