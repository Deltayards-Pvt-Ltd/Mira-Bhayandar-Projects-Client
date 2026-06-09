import { Fragment, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { formatPlans } from "../utils/projectPlans";
import { projectDetailPath } from "../utils/projectSlug";

function layoutPriceNum(layout) {
  const p = layout?.price;
  if (p === undefined || p === null || p === "") return null;
  const n = Number(p);
  return Number.isFinite(n) ? n : null;
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



function PhoneIcon({ className }) {
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
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

function WhatsAppIcon({ className }) {
  return (
    <svg
      className={className}
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="currentColor" 
      
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
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
  const builderLogoSrc = project?.builderLogo ? assetUrl(project.builderLogo) : "";

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
  const plansLine = formatPlans(project?.plans);
  const priceLine = formatPriceRange(layouts);
  const phone = project?.contactNumber;
  const telHref = phone ? `tel:+91${phone}` : "";
  const whatsAppHref = phone
    ? `https://wa.me/91${phone}?text=${encodeURIComponent(
        `Hi, I'm interested in ${name}. Please share more details.`,
      )}`
    : "";  

  console.log("phonep",phone);

  const detailPath = projectDetailPath(project);
  const statusBadge = getStatusBadge(
    typeof project?.status === "string" ? project.status : "",
  );
  const possessionLine = formatPossession(project?.reraPossession);

  return (
    <article
      className="group cursor-pointer flex h-full flex-col overflow-hidden rounded-2xl border border-navy/12 bg-white text-navy shadow-[0_2px_6px_rgba(10,22,40,0.09),0_14px_44px_-4px_rgba(10,22,40,0.18)] transition-[border-color,box-shadow] duration-300 hover:border-gold/55 hover:shadow-[0_4px_10px_rgba(10,22,40,0.1),0_24px_56px_-6px_rgba(10,22,40,0.22)]"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => navigate(detailPath)}
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-navy/5">
        {showVideo ? (
          <>
            <video
              ref={videoRef}
              className="absolute inset-0 z-0 h-full w-full object-cover "
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
        
      </div>

      <div
        className={`flex flex-1 flex-col px-5 sm:px-6 ${compact ? "pb-5 pt-5 sm:pb-5 sm:pt-5" : "pb-5 pt-5 sm:pb-6 sm:pt-6"}`}
      >
        <div className="flex min-w-0 items-center justify-between gap-4">
          <h3
            className="min-w-0 flex-1 line-clamp-2 text-[1.5rem] font-normal leading-[1.12] tracking-tight text-navy sm:text-[1.75rem]"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            {name}
          </h3>
          {!compact && builder  && (
           
              <p className="max-w-[38%] shrink-0 text-right text-[10px] font-semibold uppercase leading-snug tracking-[0.14em] text-gold-ink/90 sm:max-w-[42%] sm:text-[11px]">
                By {builder}
              </p>
            
          ) }
        </div>


        {!compact && locationRaw && (
         <div className="mt-2 border-t border-navy/[0.1] pt-4 flex items-center justify-between" >
           <p className="text-md font-medium leading-snug text-navy/80 flex items-center gap-2">
           <MapPinIcon className="shrink-0 text-black" /> {locationRaw}
          </p>
          <div className="flex items-center gap-4">
            {telHref ? (
              <a href={telHref} className="text-navy hover:text-gold">
                <PhoneIcon />
              </a>
            ) : null}
            {whatsAppHref ? (
              <a href={whatsAppHref} className="text-navy hover:text-gold">
                <WhatsAppIcon />
              </a>
            ) : null}
          </div>
         </div>
        )}



        {!compact ? (
          <>
            <div className="my-3.5 border-t border-navy/[0.1]" aria-hidden />

            {plansLine? (
              <p className="mb-0 min-h-[1.35rem] text-sm leading-relaxed text-navy/75">
                {[
                  plansLine && {
                    key: "plans",
                    node: (
                      <span className="font-medium tracking-tight">{plansLine}</span>
                    ),
                  },
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
                  to={detailPath}
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
