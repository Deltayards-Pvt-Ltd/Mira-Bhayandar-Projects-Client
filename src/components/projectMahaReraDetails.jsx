import { useEffect, useState } from "react";

const CERTS_PAGE = 3;

function ShieldCheckIcon({ className }) {
  return (
    <svg
      className={className}
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function PhoneScanIcon({ className }) {
  return (
    <svg
      className={className}
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <rect width="14" height="20" x="5" y="2" rx="2" />
      <path d="M12 18h.01" />
    </svg>
  );
}

/** Crops MAHARERA PNG frame so only the QR shows. */
function QrImage({ src, alt }) {
  return (
    <div className="h-28 w-28 shrink-0 overflow-hidden sm:h-32 sm:w-32">
      <img
        src={src}
        alt={alt}
        className="block size-full border-0 object-cover object-center outline-none [clip-path:inset(14%)] scale-[2.15] sm:scale-[2.25]"
        loading="lazy"
        decoding="async"
      />
    </div>
  );
}

function ReraInfoFooter({ multi }) {
  return (
    <div className="mt-6 flex gap-3 rounded-xl border border-navy/[0.08] bg-cream/60 px-4 py-3.5 sm:px-5 sm:py-4">
      <ShieldCheckIcon className="mt-0.5 shrink-0 text-gold-dark" />
      <p className="text-sm leading-relaxed text-navy/70">
        {multi ? (
          <>
            All certificates are registered under MahaRERA. Use your phone camera to scan and
            verify the project details on the official Maharashtra RERA portal.
          </>
        ) : (
          <>
            This project is registered under MahaRERA. Scan the QR code with your phone camera
            to verify on the official Maharashtra RERA portal.
          </>
        )}
      </p>
    </div>
  );
}

function ReraCertificateCard({ title, src }) {
  return (
    <article className="relative overflow-hidden rounded-xl border border-navy/[0.1] bg-white shadow-[0_4px_20px_-8px_rgba(10,22,40,0.14)]">
      <div className="relative bg-navy px-4 pb-5 pt-3">
        <div className="mx-auto flex size-9 items-center justify-center rounded-full border-2 border-gold/40 bg-navy-light text-gold-light">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            aria-hidden
          >
            <path d="M3 21h18" />
            <path d="M5 21V7l8-4v18" />
            <path d="M19 21V11l-6-3" />
            <path d="M9 9v.01" />
            <path d="M9 12v.01" />
            <path d="M9 15v.01" />
          </svg>
        </div>
      </div>

      <div className="flex gap-3 px-3 pb-4 pt-1 sm:gap-4 sm:px-4">
        <QrImage src={src} alt={`${title} — MAHARERA QR code`} />
        <div className="flex min-w-0 flex-1 flex-col justify-center border-l border-navy/[0.06] pl-3 sm:pl-4">
          <h3 className="font-sans text-sm font-bold uppercase tracking-wide text-navy sm:text-base">
            {title}
          </h3>
          <p className="mt-1 font-sans text-[10px] font-semibold uppercase tracking-[0.14em] text-gold-ink">
            RERA Registration
          </p>
          <p className="mt-2 flex items-start gap-1.5 text-[11px] leading-snug text-navy/55">
            <PhoneScanIcon className="mt-0.5 shrink-0 text-navy/40" />
            Scan to verify on Maharashtra RERA Portal
          </p>
        </div>
      </div>

      <div className="flex justify-center border-t border-navy/[0.06] py-2">
        <ShieldCheckIcon className="text-gold-dark/80" />
      </div>
    </article>
  );
}

/**
 * @param {{
 *   project: Record<string, unknown>;
 *   assetUrl: (path: string) => string;
 * }} props
 */
export default function ProjectMahaReraDetails({ project, assetUrl }) {
  const resolve = assetUrl ?? ((p) => p ?? "");

  const scanners = (Array.isArray(project?.reraScannerImage) ? project.reraScannerImage : [])
    .map((s) => ({
      title: String(s?.title || "").trim() || "RERA QR",
      src: String(s?.image || "").trim(),
    }))
    .filter((s) => s.src)
    .map((s) => ({ ...s, src: resolve(s.src) }));

  if (!scanners.length) return null;

  const multi = scanners.length > 1;
  const [visibleCount, setVisibleCount] = useState(() =>
    Math.min(CERTS_PAGE, scanners.length)
  );

  useEffect(() => {
    setVisibleCount(Math.min(CERTS_PAGE, scanners.length));
  }, [scanners.length]);

  const visibleScanners = scanners.slice(0, visibleCount);
  const hasMore = visibleCount < scanners.length;

  return (
    <section
      className="border-b border-navy/[0.08] bg-[#fdfbf7] text-navy"
      aria-labelledby="project-maharera-heading"
    >
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-ink">
          RERA Details
        </p>
        <h2
          id="project-maharera-heading"
          className="mt-2 text-3xl font-normal tracking-tight text-navy sm:text-4xl"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          MAHARERA
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-navy/60">
          Use your phone camera to scan the QR code and verify the project&apos;s official
          registration on the Maharashtra RERA portal.
        </p>

        <div className="mt-8">
          <div className="flex items-center gap-2">
            <ShieldCheckIcon className="text-gold-dark" />
            <h3 className="font-sans text-sm font-bold uppercase tracking-wide text-navy sm:text-base">
              RERA Certificates
            </h3>
          </div>

          <div
            className={`mt-5 grid gap-4 sm:gap-5 ${
              multi
                ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                : "max-w-md grid-cols-1"
            }`}
          >
            {visibleScanners.map((s, i) => (
              <ReraCertificateCard key={`${s.src}-${i}`} title={s.title} src={s.src} />
            ))}
          </div>

          {hasMore ? (
            <div className="mt-5 flex justify-center">
              <button
                type="button"
                onClick={() =>
                  setVisibleCount((n) => Math.min(n + CERTS_PAGE, scanners.length))
                }
                className="rounded-full border border-navy/15 bg-white px-8 py-2.5 font-sans text-xs font-semibold uppercase tracking-[0.14em] text-navy shadow-sm transition hover:border-gold/50 hover:bg-gold/10 hover:text-gold-ink"
              >
                See more
              </button>
            </div>
          ) : null}

          <ReraInfoFooter multi={multi} />
        </div>
      </div>
    </section>
  );
}
