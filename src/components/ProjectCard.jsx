import { Fragment, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function layoutAreaNums(layout) {
  const a = layout?.area;
  if (a === undefined || a === null || a === "") return [];
  const s = String(a).trim();
  const single = Number(s);
  if (Number.isFinite(single) && /^\d+(\.\d+)?$/.test(s)) return [single];
  const matches = s.match(/\d+(?:\.\d+)?/g);
  if (!matches) return [];
  return matches.map(Number).filter((n) => Number.isFinite(n));
}

function layoutPriceNum(layout) {
  const p = layout?.price;
  if (p === undefined || p === null || p === "") return null;
  const n = Number(p);
  return Number.isFinite(n) ? n : null;
}

/** Unique layout titles in order, for "1 BHK · 2 BHK". */
function formatLayoutTitles(layouts) {
  const seen = new Set();
  const out = [];
  for (const l of layouts || []) {
    const t = (l?.title || "").trim();
    if (t && !seen.has(t)) {
      seen.add(t);
      out.push(t);
    }
  }
  return out;
}

/** Min–max sqft from numeric layout areas; single layout → one number. */
function formatAreaRange(layouts) {
  const nums = (layouts || []).flatMap(layoutAreaNums);
  if (nums.length === 0) return "";
  const lo = Math.min(...nums);
  const hi = Math.max(...nums);
  if (lo === hi) return `${lo} sqft`;
  return `${lo} - ${hi} sqft`;
}

/** Min–max price in Lacs from layout prices. */
function formatPriceRange(layouts) {
  const nums = (layouts || []).map(layoutPriceNum).filter((n) => n != null);
  if (nums.length === 0) return "";
  const lo = Math.min(...nums);
  const hi = Math.max(...nums);
  if (lo === hi) return `₹${lo} L`;
  return `₹${lo} - ${hi} L`;
}

function MapPinIcon({ className }) {
  return (
    <svg
      className={className}
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

/** @param {Record<string, unknown> | undefined} reraPossession */
function formatPossession(reraPossession) {
  if (!reraPossession || typeof reraPossession !== "object") return "";
  const m =
    typeof reraPossession.month === "string" ? reraPossession.month.trim() : "";
  const y = reraPossession.year;
  const hasY = y != null && y !== "" && Number.isFinite(Number(y));
  if (!m && !hasY) return "";
  if (m && hasY) return `${m} ${y}`;
  if (hasY) return String(y);
  return m;
}

/** @param {string} [status] */
function getStatusBadge(status) {
  const s = (status || "").trim();
  if (s === "Ready to Move") {
    return { label: s, className: "bg-green-600 text-white" };
  }
  if (s === "Under Construction") {
    return { label: s, className: "bg-yellow-400 text-navy" };
  }
  if (s === "Upcoming") {
    return { label: s, className: "bg-gold text-navy" };
  }
  return null;
}

function ArrowIcon({ className }) {
  return (
    <svg
      className={className}
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}
function CertificateIcon({ className }) {
  return (
    <svg
      className={className}
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {/* Card */}
      <rect x="3" y="5" width="18" height="14" rx="2" />

      {/* Lines */}
      <line x1="6" y1="9" x2="12" y2="9" />
      <line x1="6" y1="12" x2="11" y2="12" />

      {/* Badge */}
      <circle cx="16.5" cy="10" r="2.5" />

      {/* Ribbon */}
      <path d="M15.5 12.2v3l1-0.7 1 0.7v-3" />
    </svg>
  );
}

/**
 * @param {{ project: Record<string, unknown>; assetUrl: (path: string) => string; compact?: boolean }} props
 */
export default function ProjectCard({ project, assetUrl, compact = false }) {
  const [videoFailed, setVideoFailed] = useState(false);
  const [hovered, setHovered] = useState(false);
  const videoRef = useRef(null);
  const navigate = useNavigate();
  const coverVideo = project?.coverVideo;
  const coverImage = project?.coverImage;
  const showVideo = Boolean(coverVideo) && !videoFailed;
  const poster = coverImage ? assetUrl(coverImage) : undefined;
  const imgSrc = coverImage ? assetUrl(coverImage) : "";

  useEffect(() => {
    const v = videoRef.current;
    if (!v || !showVideo) return;
    if (hovered) {
      const p = v.play();
      if (p && typeof p.catch === "function") p.catch(() => {});
    } else {
      v.pause();
      try {
        v.currentTime = 0;
      } catch {
        /* ignore */
      }
    }
  }, [hovered, showVideo]);

  const locationRaw = (project?.location || "").trim();
  const name = project?.name || "Project";
  const builder = (project?.builder || "").trim();
  const layouts = project?.layouts;
  const titles = formatLayoutTitles(layouts);
  const layoutLine = titles.join(" · ");
  const areaLine = formatAreaRange(layouts);
  const priceLine = formatPriceRange(layouts);

  const id = project?._id != null ? String(project._id) : "";
  const statusBadge = getStatusBadge(
    typeof project?.status === "string" ? project.status : "",
  );
  const possessionLine = formatPossession(project?.reraPossession);

  return (
    <article
      className="group cursor-pointer flex h-full flex-col overflow-hidden rounded-2xl border border-navy/12 bg-white text-navy shadow-[0_2px_6px_rgba(10,22,40,0.09),0_14px_44px_-4px_rgba(10,22,40,0.18)] transition-[border-color,box-shadow] duration-300 hover:border-gold/55 hover:shadow-[0_4px_10px_rgba(10,22,40,0.1),0_24px_56px_-6px_rgba(10,22,40,0.22)]"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => navigate(`/projects/${id}`)}
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-navy/5">
        {showVideo ? (
          <>
            <video
              ref={videoRef}
              className="absolute inset-0 z-0 h-full w-full object-cover"
              muted
              loop
              playsInline
              poster={poster}
              preload="metadata"
              onError={() => setVideoFailed(true)}
            >
              <source src={assetUrl(coverVideo)} type="video/mp4" />
            </video>
            {imgSrc ? (
              <img
                src={imgSrc}
                alt=""
                aria-hidden
                className={`absolute inset-0 z-[1] h-full w-full object-cover transition-opacity duration-300 ${
                  hovered ? "pointer-events-none opacity-0" : "opacity-100"
                }`}
              />
            ) : null}
          </>
        ) : imgSrc ? (
          <img
            src={imgSrc}
            alt={name}
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-navy/10 text-[15px] text-navy/40">
            No media
          </div>
        )}
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-navy/55 via-navy/10 to-transparent"
          aria-hidden
        />
        {statusBadge ? (
          <span
            className={`absolute left-3 top-3 z-[2] max-w-[calc(100%-1.5rem)] rounded-full px-2.5 py-1 text-[11px] font-bold uppercase leading-tight tracking-[0.08em] shadow-md ${statusBadge.className}`}
          >
            {statusBadge.label}
          </span>
        ) : null}
        {locationRaw ? (
          <div className="absolute bottom-3 left-3 z-[1] flex max-w-[calc(100%-1.5rem)] items-center gap-1.5 rounded-full border border-white/20 bg-navy/55 px-2.5 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-white backdrop-blur-sm">
            <MapPinIcon className="shrink-0 text-gold-light" />
            <span className="truncate">{locationRaw}</span>
          </div>
        ) : null}
      </div>

      <div
        className={`flex flex-1 flex-col px-5 sm:px-6 ${compact ? "pb-5 pt-5 sm:pb-5 sm:pt-5" : "pb-5 pt-5 sm:pb-6 sm:pt-6"}`}
      >
        <div className="flex min-w-0 items-baseline justify-between gap-3">
          <h3
            className="min-w-0 flex-1 truncate text-[1.65rem] font-normal leading-[1.15] tracking-tight text-navy sm:text-[1.85rem]"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            {name}
          </h3>
          {!compact && builder ? (
            <p className="max-w-[42%] shrink-0 text-right text-[11px] font-semibold uppercase leading-snug tracking-[0.14em] text-gold-ink/90 sm:text-xs">
              By {builder}
            </p>
          ) : null}
        </div>

        {!compact ? (
          <>
            <div className="my-3.5 border-t border-navy/[0.1]" aria-hidden />

            {layoutLine || areaLine || priceLine ? (
              <p className="mb-0 min-h-[1.35rem] text-sm leading-relaxed text-navy/75">
                {[
                  layoutLine && {
                    key: "layout",
                    node: (
                      <span className="font-medium tracking-tight">{layoutLine}</span>
                    ),
                  },
                  areaLine && { key: "area", node: <span>{areaLine}</span> },
                  priceLine && { key: "price", node: <span>{priceLine}</span> },
                ]
                  .filter(Boolean)
                  .map((seg, i) => (
                    <Fragment key={seg.key}>
                      {i > 0 ? (
                        <span className="mx-2 text-navy/35" aria-hidden>
                          |
                        </span>
                      ) : null}
                      {seg.node}
                    </Fragment>
                  ))}
              </p>
            ) : (
              <span className="whitespace-nowrap text-sm tracking-[0.06em] text-navy/80">
                Contact for layout details
              </span>
            )}

            <div className="mt-auto border-t border-navy/[0.1] pt-4 ">
              <div className="flex min-h-[44px] items-center gap-3">
                {possessionLine ? (
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-gold-ink">
                      Possession
                    </p>
                    <p className="mt-0.5 truncate text-sm font-medium leading-snug text-navy/80">
                      {possessionLine}
                    </p>
                  </div>
                ) : (
                  <div className="inline-flex shrink-0 items-center gap-1.5">
                    <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gold/12 text-gold-ink">
                      <CertificateIcon className="h-4 w-4" />
                    </span>
                    <span className="whitespace-nowrap text-sm font-semibold uppercase tracking-[0.06em] text-navy/80">
                      RERA Certified
                    </span>
                  </div>
                )}
                <Link
                  to={id ? `/projects/${id}` : "/projects"}
                  className="relative ml-auto inline-flex min-h-[44px] shrink-0 items-center justify-end"
                  aria-label={`View project: ${name}`}
                >
                  <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gold text-navy shadow-sm transition-all duration-300 group-hover:scale-90 group-hover:opacity-0">
                    <ArrowIcon />
                  </span>
                  <span className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 whitespace-nowrap rounded-full bg-gold px-5 py-2.5 text-center text-xs font-semibold uppercase leading-none tracking-[0.16em] text-navy opacity-0 shadow-sm transition-all duration-300 group-hover:pointer-events-auto group-hover:opacity-100">
                    View project
                  </span>
                </Link>
              </div>
            </div>
          </>
        ) : null}
      </div>
    </article>
  );
}
