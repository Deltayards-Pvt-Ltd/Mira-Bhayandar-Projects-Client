function MapPinIcon({ className }) {
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
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

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

/** Layout titles for display (e.g. `1 BHK – 2 BHK`). */
function formatConfigDisplay(layouts) {
  const titles = formatLayoutTitles(layouts);
  return titles.length ? titles.join(" – ") : "";
}

function formatPossession(reraPossession) {
  if (!reraPossession) return "";
  const m = typeof reraPossession.month === "string" ? reraPossession.month.trim() : "";
  const y = reraPossession.year;
  const hasY = y != null && y !== "" && Number.isFinite(Number(y));
  if (!m && !hasY) return "";
  if (m && hasY) return `${m} ${y}`;
  if (hasY) return String(y);
  return m;
}

/**
 * @param {{
 *   project: Record<string, unknown>;
 *   assetUrl: (path: string) => string;
 * }} props
 */
export default function ProjectDetailIntro({ project, assetUrl }) {
  const locationRaw = (project?.location || "").trim();
  const name = project?.name || "Project";
  const builder = (project?.builder || "").trim();
  const layouts = project?.layouts;
  const configLine = formatConfigDisplay(layouts);
  const possession = formatPossession(project?.reraPossession);
  const reraNo = String(project?.reraNo || "").trim();
  const brochure = (project?.browcherPdf || "").trim();
  const reraCert = (project?.reraCertificate || "").trim();
  const contactNumber = String(project?.contactNumber || "").trim();
  const bannerImage = (project?.bannerImage || "").trim();
  const bannerUrl = bannerImage ? assetUrl(bannerImage) : "";

  const brochureHref = brochure ? assetUrl(brochure) : "";
  const reraHref = reraCert ? assetUrl(reraCert) : "";
  const telHref = contactNumber ? `tel:${contactNumber.replace(/\s/g, "")}` : "";

  return (
    <section className="relative overflow-hidden border-b border-white/10 text-cream">
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        {bannerUrl ? (
          <>
            <img
              src={bannerUrl}
              alt=""
              className="h-full w-full object-cover object-[55%_center] sm:object-[60%_25%] lg:object-[58%_20%]"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0a1628]/92 via-[#0a1628]/55 to-[#0a1628]/10" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a1628]/50 via-transparent to-[#0a1628]/30" />
          </>
        ) : (
          <div className="noise-overlay absolute inset-0 bg-navy-gradient" />
        )}
      </div>

      <div className="relative z-[2] mx-auto flex min-h-[clamp(26rem,56.25vw,40rem)] max-w-6xl flex-col justify-end px-4 pb-10 pt-[calc(5.5rem+env(safe-area-inset-top,0px))] sm:px-6 sm:pb-14 sm:pt-28 md:pt-32 lg:min-h-[clamp(30rem,62vw,48rem)] lg:px-8">
        <div className="w-full max-w-xl lg:max-w-[46%]">
            {locationRaw ? (
              <p className="mb-4 flex items-center gap-2 text-sm font-medium text-white/70">
                <MapPinIcon className="shrink-0 text-gold" aria-hidden />
                <span>{locationRaw}</span>
              </p>
            ) : null}

            <h1
              className="text-[2rem] font-normal leading-[1.12] tracking-tight text-white sm:text-5xl sm:leading-[1.08]"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              {name}
              <span
                className="italic text-gold-light"
                style={{ fontFamily: "var(--font-editorial)" }}
                aria-hidden
              >
                .
              </span>
            </h1>

            {builder ? (
              <p className="mt-4 text-xs font-semibold uppercase tracking-[0.2em] text-white/55">
                {builder}
              </p>
            ) : null}

            <div className="my-8 grid gap-4 border-t border-white/10 pt-8 sm:grid-cols-2 sm:gap-x-8">
              <div className="min-w-0">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-gold">
                  Configurations
                </p>
                <p className="mt-1.5 text-base font-medium leading-snug tracking-tight text-white/90">
                  {configLine || "—"}
                </p>
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-gold">
                  RERA
                </p>
                <p className="mt-1.5 text-base font-medium leading-snug tracking-tight text-white/90">
                  {reraNo || "—"}
                </p>
              </div>
              {possession ? (
                <div className="min-w-0 sm:col-span-2">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-gold">
                    Possession
                  </p>
                  <p className="mt-1.5 text-base font-medium leading-snug text-white/85">
                    {possession}
                  </p>
                </div>
              ) : null}
            </div>

            <div className="mb-8 flex flex-wrap gap-3">
              {brochureHref ? (
                <a
                  href={brochureHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border-2 border-gold bg-gold px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-navy transition-colors hover:border-gold-light hover:bg-gold-light"
                >
                  <DownloadIcon className="text-navy" />
                  Download brochure
                </a>
              ) : null}
              {reraHref ? (
                <a
                  href={reraHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border-2 border-white/35 bg-transparent px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-cream transition-colors hover:border-gold hover:bg-white/5"
                >
                  <DownloadIcon className="text-gold-light" />
                  RERA certificate
                </a>
              ) : null}
              {telHref ? (
                <a
                  href={telHref}
                  className="inline-flex items-center gap-2 rounded-full border-2 border-white/35 bg-transparent px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-cream transition-colors hover:border-gold hover:bg-white/5"
                >
                  <PhoneIcon className="text-gold-light" />
                  {contactNumber}
                </a>
              ) : null}
            </div>
        </div>
      </div>
    </section>
  );
}
