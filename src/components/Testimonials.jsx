import { useContext, useEffect, useMemo, useState } from "react";
import { AppContext } from "../context/AppContext";

/** Time between automatic slide changes (ms). */
const ROTATE_MS = 3000;

function initialsFromName(name) {
  const parts = String(name ?? "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (parts.length === 0) return "?";
  const a = parts[0][0] ?? "";
  const b =
    parts.length > 1 ? (parts[parts.length - 1][0] ?? "") : (parts[0][1] ?? "");
  return `${a}${b}`.toUpperCase();
}

function purchasedLine(t) {
  const p = t?.purchasedAtProject;
  const name = typeof p === "object" && p != null && p.name ? p.name : null;
  if (name) return `Purchased at ${name}`;
  return "";
}

function StarRow({ count }) {
  const n = Math.min(5, Math.max(0, Number(count) || 0));
  return (
    <div className="flex gap-0.5" role="img" aria-label={`${n} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) => {
        const filled = i < n;
        return (
          <svg
            key={i}
            width="18"
            height="18"
            viewBox="0 0 24 24"
            className={filled ? "text-gold" : "text-white/22"}
            aria-hidden
          >
            <path
              fill="currentColor"
              d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
            />
          </svg>
        );
      })}
    </div>
  );
}

function ChevronLeft({ className }) {
  return (
    <svg
      className={className}
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
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
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

export default function Testimonials() {
  const { testimonials } = useContext(AppContext) ?? {};
  const list = useMemo(
    () => (Array.isArray(testimonials) ? testimonials : []),
    [testimonials],
  );
  const [index, setIndex] = useState(0);
  const len = list.length;

  useEffect(() => {
    if (len === 0) return;
    setIndex((i) => Math.min(i, len - 1));
  }, [len]);

  useEffect(() => {
    if (len < 2) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % len);
    }, ROTATE_MS);
    return () => clearInterval(id);
  }, [len]);

  if (len === 0) return null;

  const t = list[index];
  const stars = t?.starCount ?? 5;
  const subline = purchasedLine(t);

  return (
    <section
      className="noise-overlay relative overflow-hidden bg-navy-gradient py-20 text-white md:py-28"
      aria-labelledby="testimonials-heading"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(212,168,83,0.06) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 mx-auto max-w-3xl px-4 sm:px-6 lg:max-w-4xl lg:px-8">
        <header className="mb-10 text-center md:mb-12">
          <p className="mb-3 font-sans text-xs font-semibold uppercase tracking-[0.2em] text-gold">
            Happy families
          </p>
          <h2
            id="testimonials-heading"
            className="mb-4 text-4xl tracking-tight text-white md:text-5xl"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            What Our Clients Say
          </h2>
          <p className="mx-auto max-w-xl font-sans text-base leading-relaxed text-white/55 md:text-lg">
            Stories from families who found their dream home
          </p>
        </header>

        <article
          className="rounded-2xl border border-white/10 bg-white/[0.05] px-6 py-8 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.35)] backdrop-blur-md md:px-10 md:py-10"
          aria-roledescription="carousel"
        >
          <div className="mb-6 flex flex-wrap items-center gap-4 md:mb-8">
            <span
              className="font-serif text-5xl leading-none text-gold/70 md:text-6xl"
              aria-hidden
            >
              &ldquo;
            </span>
            <StarRow count={stars} />
          </div>

          <blockquote className="mb-8 font-sans text-lg italic leading-relaxed text-white/80 md:text-xl md:leading-relaxed">
            {t?.message ?? ""}
          </blockquote>

          <footer className="flex items-center gap-4 border-t border-white/10 pt-6 md:pt-8">
            <div
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gold text-sm font-bold text-navy md:h-14 md:w-14 md:text-base"
              aria-hidden
            >
              {initialsFromName(t?.name)}
            </div>
            <div className="min-w-0">
              <p className="font-sans text-base font-bold text-white md:text-lg">
                {t?.name ?? ""}
              </p>
              {subline ? (
                <p className="mt-0.5 font-sans text-sm text-white/50 md:text-[0.9375rem]">
                  {subline}
                </p>
              ) : null}
            </div>
          </footer>
        </article>

        {len > 1 ? (
          <div className="mt-8 flex items-center justify-center gap-5 md:mt-10 md:gap-8">
            <button
              type="button"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/[0.06] text-white shadow-sm transition-colors hover:border-gold/35 hover:bg-white/[0.12] md:h-11 md:w-11"
              aria-label="Previous testimonial"
              onClick={() => setIndex((i) => (i - 1 + len) % len)}
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-2.5" role="tablist" aria-label="Testimonial slides">
              {list.map((item, i) => (
                <button
                  key={item._id ?? i}
                  type="button"
                  role="tab"
                  aria-selected={i === index}
                  aria-label={`Go to testimonial ${i + 1}`}
                  className={
                    i === index
                      ? "h-2 w-8 rounded-full bg-gold transition-all"
                      : "h-2 w-2 rounded-full bg-white/25 transition-all hover:bg-white/45"
                  }
                  onClick={() => setIndex(i)}
                />
              ))}
            </div>

            <button
              type="button"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/[0.06] text-white shadow-sm transition-colors hover:border-gold/35 hover:bg-white/[0.12] md:h-11 md:w-11"
              aria-label="Next testimonial"
              onClick={() => setIndex((i) => (i + 1) % len)}
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        ) : null}
      </div>
    </section>
  );
}
