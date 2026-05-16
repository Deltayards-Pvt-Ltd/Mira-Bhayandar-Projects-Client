import { useEffect, useMemo, useState } from "react";

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

/**
 * @param {{
 *   project: Record<string, unknown>;
 *   assetUrl: (path: string) => string;
 * }} props
 */
export default function ProjectDetailPlans({ project, assetUrl }) {
  const layouts = useMemo(() => {
    const raw = project?.layouts;
    if (!Array.isArray(raw)) return [];
    return raw.filter((l) => l && String(l.image || "").trim());
  }, [project?.layouts]);

  const [idx, setIdx] = useState(0);
  const brochure = String(project?.browcherPdf || "").trim();
  const brochureHref = brochure ? assetUrl(brochure) : "";

  useEffect(() => {
    setIdx((i) => (layouts.length ? Math.min(i, layouts.length - 1) : 0));
  }, [layouts.length]);

  if (layouts.length === 0) return null;

  const active = layouts[idx] ?? layouts[0];
  const title = String(active?.title || "Plan").trim() || "Plan";
  const areaLine = formatAreaSqft(active?.area);
  const imgSrc = assetUrl(String(active.image));

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
      <div className="relative z-[2] mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <header className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-light">
            Floor plans
          </p>
          <h2
            id="project-plans-heading"
            className="mt-2 text-3xl font-normal tracking-tight text-white sm:text-4xl md:text-[2.75rem] md:leading-tight"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Plans
            <span
              className="italic text-gold-light"
              style={{ fontFamily: "var(--font-editorial)" }}
              aria-hidden
            >
              .
            </span>
          </h2>
        </header>

        <div
          className="mt-8 flex flex-wrap gap-2.5"
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
                className={`rounded-full border-2 px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] transition-[background-color,border-color,color,box-shadow,transform] duration-200 ${
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

        <div className="mt-8 flex flex-col gap-4 border-t border-white/10 pt-8 sm:flex-row sm:items-end sm:justify-between sm:gap-8">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gold">
              Selected layout
            </p>
            <p className="mt-1.5 text-xl font-medium tracking-tight text-white sm:text-2xl">
              {title}
            </p>
          </div>
          <div className="sm:text-right">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gold">
              Super built-up area
            </p>
            <p className="mt-1.5 text-xl font-medium tabular-nums tracking-tight text-white/95 sm:text-2xl">
              {areaLine || "—"}
            </p>
            {!areaLine ? (
              <p className="mt-1.5 text-xs text-white/45">Details in brochure</p>
            ) : null}
          </div>
        </div>

        <div
          id="plan-panel"
          role="tabpanel"
          aria-labelledby={`plan-tab-${idx}`}
          className="mt-8 overflow-hidden rounded-2xl border border-white/15 bg-white/[0.04] p-1 shadow-[0_24px_80px_-28px_rgba(0,0,0,0.55)] ring-1 ring-white/10 backdrop-blur-sm sm:p-1.5"
        >
          <div className="flex min-h-[220px] items-center justify-center rounded-[14px] bg-white p-3 sm:p-5 md:p-8">
            <img
              key={imgSrc}
              src={imgSrc}
              alt={`${title} floor plan`}
              className="max-h-[min(70vh,560px)] w-full object-contain"
              loading="lazy"
              decoding="async"
            />
          </div>
        </div>

        {brochureHref ? (
          <a
            href={brochureHref}
            target="_blank"
            rel="noopener noreferrer"
            className="group mt-8 inline-flex items-center gap-2.5 text-sm font-semibold uppercase tracking-[0.14em] text-gold-light transition-colors hover:text-gold"
          >
            <DownloadIcon className="text-gold transition-colors group-hover:text-gold-light" />
            Download full brochure (PDF)
          </a>
        ) : null}
      </div>
    </section>
  );
}
