import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

/** Drop your file in `client/public/videos/` and set the filename here. */
const HERO_VIDEO_SRC = "/videos/hero.mp4";

const FLOAT_GAP_PX = 8;
const FLOAT_MARGIN_PX = 12;
const FLOAT_LOCALITY_MAX_W = 448;
const FLOAT_FLAT_MAX_W = 416;

const LOCALITIES = [
  "Bhayandar West",
  "Bhayandar East",
  "Mira Road",
];
const FLAT_OPTIONS = ["1 bhk", "2 bhk", "3 bhk", "4 bhk", "5 bhk", "jodi"];

const LOCALITY_SHORT = {
  "Bhayandar West": "B. West",
  "Bhayandar East": "B. East",
  "Mira Road": "Mira",
};

function shortLocalityLabel(full) {
  return LOCALITY_SHORT[full] ?? (full.length > 11 ? `${full.slice(0, 10)}…` : full);
}

function shortFlatLabel(name) {
  if (name === "jodi") return "Jodi";
  const m = /^(\d+)\s*bhk$/i.exec(name.trim());
  return m ? `${m[1]}b` : name;
}

export default function HeroCarousel() {
  const [videoFailed, setVideoFailed] = useState(false);
  const [openPanel, setOpenPanel] = useState(null);
  const [localities, setLocalities] = useState(() => new Set());
  const [flats, setFlats] = useState(() => new Set());
  const [floatBox, setFloatBox] = useState(null);
  const searchBarRef = useRef(null);
  const localityTriggerRef = useRef(null);
  const flatTriggerRef = useRef(null);
  const floatingLayerRef = useRef(null);

  function measureLocalityFloat() {
    const el = localityTriggerRef.current;
    if (!el) return null;
    const r = el.getBoundingClientRect();
    const vw = window.innerWidth;
    const maxW = Math.min(FLOAT_LOCALITY_MAX_W, vw - 2 * FLOAT_MARGIN_PX);
    const left = Math.max(
      FLOAT_MARGIN_PX,
      Math.min(r.left, vw - FLOAT_MARGIN_PX - maxW),
    );
    return { top: r.bottom + FLOAT_GAP_PX, left, width: maxW };
  }

  function measureFlatFloat() {
    const el = flatTriggerRef.current;
    if (!el) return null;
    const r = el.getBoundingClientRect();
    const vw = window.innerWidth;
    const maxW = Math.min(FLOAT_FLAT_MAX_W, vw - 2 * FLOAT_MARGIN_PX);
    let left = r.right - maxW;
    left = Math.max(
      FLOAT_MARGIN_PX,
      Math.min(left, vw - FLOAT_MARGIN_PX - maxW),
    );
    return { top: r.bottom + FLOAT_GAP_PX, left, width: maxW };
  }

  useLayoutEffect(() => {
    if (!openPanel) {
      setFloatBox(null);
      return;
    }
    function update() {
      setFloatBox(
        openPanel === "locality" ? measureLocalityFloat() : measureFlatFloat(),
      );
    }
    update();
    window.addEventListener("scroll", update, true);
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update, true);
      window.removeEventListener("resize", update);
    };
  }, [openPanel, localities, flats]);

  useEffect(() => {
    if (!openPanel) return;
    const onPointerDown = (e) => {
      if (
        searchBarRef.current?.contains(e.target) ||
        floatingLayerRef.current?.contains(e.target)
      ) {
        return;
      }
      setOpenPanel(null);
    };
    document.addEventListener("pointerdown", onPointerDown, true);
    return () =>
      document.removeEventListener("pointerdown", onPointerDown, true);
  }, [openPanel]);

  function toggleLocality(name) {
    setLocalities((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  }

  function toggleFlat(name) {
    setFlats((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  }

  return (
    <section className="relative z-20 min-h-[100dvh] w-full overflow-x-hidden bg-navy">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 animate-kenburns">
          {!videoFailed ? (
            <video
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              className="absolute inset-0 h-full w-full object-cover"
              onError={() => setVideoFailed(true)}
            >
              <source src={HERO_VIDEO_SRC} type="video/mp4" />
            </video>
          ) : (
            <div className="absolute inset-0 bg-navy" aria-hidden />
          )}
        </div>

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-navy/70 via-navy/15 to-navy/95" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-navy/65 via-transparent to-navy/30" />
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at center, transparent 40%, rgba(10,22,40,0.55) 100%)",
          }}
        />
      </div>

      <div className="relative z-10 mx-auto flex min-h-[100dvh] max-w-7xl flex-col justify-end gap-8 px-4 pt-[calc(5.5rem+env(safe-area-inset-top,0px))] pb-8 sm:gap-10 sm:px-6 sm:pb-10 sm:pt-28 md:pt-36 md:pb-14 lg:px-8">
        <div className="flex min-h-0 flex-col gap-8 sm:gap-10">
          <div className="max-w-3xl text-left">
            <h1
              className="leading-[0.86] tracking-[-0.04em] text-white"
              style={{
                fontFamily: "var(--font-heading)",
                fontWeight: 400,
                fontSize: "clamp(36px, 11vw, 132px)",
                fontOpticalSizing: "auto",
              }}
            >
              Place,
              <span
                className="italic text-gold"
                style={{ fontFamily: "var(--font-editorial)" }}
              >
                {" "}
                not
              </span>
              <br />
              product.
              <br />
              <span className="text-cream/55">Curated,</span>
              <br />
              <span className="text-cream/55">never listed.</span>
            </h1>
            <p className="mt-5 max-w-lg text-sm leading-relaxed text-white/55 sm:mt-7 md:text-base">
              The handpicked residences of Mira-Bhayandar — every project verified,
              every developer vetted. We connect families directly to the sales
              team. No noise.
            </p>
          </div>

          <div className="flex flex-col gap-6 sm:gap-8">
            <form
              ref={searchBarRef}
              onSubmit={(e) => e.preventDefault()}
              className="mx-auto w-full max-w-3xl"
            >
              <div className="flex flex-col gap-2 rounded-2xl border border-white/20 bg-white/[0.12] p-2 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.55)] backdrop-blur-md sm:flex-row sm:items-stretch sm:rounded-full sm:p-1.5 sm:pl-3">
                <div
                  ref={localityTriggerRef}
                  className="flex min-h-11 min-w-0 flex-1 items-center gap-2 rounded-xl px-3 py-2 sm:min-h-0 sm:rounded-full sm:py-2"
                >
                  <PinIcon className="shrink-0 text-gold" />
                  <div className="min-w-0 flex-1">
                    <span className="block text-[9px] font-semibold uppercase tracking-[0.2em] text-white/45">
                      Locality
                    </span>
                    {localities.size === 0 ? (
                      <button
                        type="button"
                        className="mt-0.5 block w-full truncate text-left text-sm font-medium text-white hover:text-white/90"
                        onClick={() =>
                          setOpenPanel((p) =>
                            p === "locality" ? null : "locality",
                          )
                        }
                      >
                        Add area
                      </button>
                    ) : (
                      <div
                        className="mt-0.5 flex min-w-0 flex-wrap items-center gap-1"
                        onClick={() => setOpenPanel("locality")}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            setOpenPanel("locality");
                          }
                        }}
                        role="presentation"
                      >
                        {Array.from(localities).map((name) => (
                          <span
                            key={name}
                            className="inline-flex max-w-[5.5rem] shrink-0 items-center gap-0.5 rounded-full border border-white/25 bg-white/10 py-0.5 pl-2 pr-0.5 text-[11px] font-medium text-white"
                            title={name}
                          >
                            <span className="min-w-0 truncate">
                              {shortLocalityLabel(name)}
                            </span>
                            <button
                              type="button"
                              className="flex shrink-0 rounded-full p-0.5 text-white/70 hover:bg-white/15 hover:text-white"
                              aria-label={`Remove ${name}`}
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleLocality(name);
                              }}
                            >
                              <XIcon className="size-3.5" />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <button
                    type="button"
                    aria-expanded={openPanel === "locality"}
                    aria-haspopup="listbox"
                    aria-label="Open locality options"
                    className="shrink-0 rounded-full p-1 text-white/40 transition-colors hover:bg-white/10 hover:text-white/70"
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenPanel((p) => (p === "locality" ? null : "locality"));
                    }}
                  >
                    <ChevronIcon
                      className={
                        openPanel === "locality" ? "rotate-180" : undefined
                      }
                    />
                  </button>
                </div>

                <div className="hidden h-10 w-px shrink-0 self-center bg-white/15 sm:block" />

                <div
                  ref={flatTriggerRef}
                  className="flex min-h-11 min-w-0 flex-1 items-center gap-2 rounded-xl px-3 py-2 sm:min-h-0 sm:rounded-full sm:py-2"
                >
                  <HomeIcon className="shrink-0 text-gold" />
                  <div className="min-w-0 flex-1">
                    <span className="block text-[9px] font-semibold uppercase tracking-[0.2em] text-white/45">
                      Flat
                    </span>
                    {flats.size === 0 ? (
                      <button
                        type="button"
                        className="mt-0.5 block w-full truncate text-left text-sm font-medium text-white hover:text-white/90"
                        onClick={() =>
                          setOpenPanel((p) => (p === "flat" ? null : "flat"))
                        }
                      >
                        BHK / type
                      </button>
                    ) : (
                      <div
                        className="mt-0.5 flex min-w-0 flex-wrap items-center gap-1"
                        onClick={() => setOpenPanel("flat")}
                        role="presentation"
                      >
                        {Array.from(flats).map((name) => (
                          <span
                            key={name}
                            className="inline-flex max-w-[3.75rem] shrink-0 items-center gap-0.5 rounded-full border border-white/25 bg-white/10 py-0.5 pl-2 pr-0.5 text-[11px] font-medium capitalize text-white"
                            title={name}
                          >
                            <span className="min-w-0 truncate">
                              {shortFlatLabel(name)}
                            </span>
                            <button
                              type="button"
                              className="flex shrink-0 rounded-full p-0.5 text-white/70 hover:bg-white/15 hover:text-white"
                              aria-label={`Remove ${name}`}
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleFlat(name);
                              }}
                            >
                              <XIcon className="size-3.5" />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <button
                    type="button"
                    aria-expanded={openPanel === "flat"}
                    aria-haspopup="listbox"
                    aria-label="Open flat options"
                    className="shrink-0 rounded-full p-1 text-white/40 transition-colors hover:bg-white/10 hover:text-white/70"
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenPanel((p) => (p === "flat" ? null : "flat"));
                    }}
                  >
                    <ChevronIcon
                      className={openPanel === "flat" ? "rotate-180" : undefined}
                    />
                  </button>
                </div>

                <button
                  type="submit"
                  className="inline-flex w-full shrink-0 items-center justify-center gap-2 rounded-xl bg-gold px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-navy sm:w-auto sm:rounded-full sm:px-5 sm:py-2.5"
                >
                  <SearchIconSolid className="text-navy" />
                  Search
                </button>
              </div>
            </form>

            {openPanel &&
              floatBox &&
              typeof document !== "undefined" &&
              createPortal(
                <div
                  ref={floatingLayerRef}
                  className="fixed z-[105] rounded-2xl border border-white/20 bg-navy/55 p-4 text-cream shadow-[0_24px_60px_-12px_rgba(0,0,0,0.55)] ring-1 ring-white/10 backdrop-blur-xl"
                  style={{
                    top: floatBox.top,
                    left: floatBox.left,
                    width: floatBox.width,
                  }}
                >
                  {openPanel === "locality" ? (
                    <div
                      role="listbox"
                      aria-label="Locality"
                      aria-multiselectable="true"
                    >
                      <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-gold">
                        Select area
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {LOCALITIES.map((name) => {
                          const on = localities.has(name);
                          return (
                            <button
                              key={name}
                              type="button"
                              role="option"
                              aria-selected={on}
                              onClick={() => toggleLocality(name)}
                              className={`rounded-full border px-3.5 py-2 text-left text-xs font-medium transition-colors sm:text-[13px] ${
                                on
                                  ? "border-gold/80 bg-gold/20 text-white ring-1 ring-gold/40"
                                  : "border-white/20 bg-white/5 text-cream/95 hover:border-white/35 hover:bg-white/10"
                              }`}
                            >
                              {name}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    <div
                      role="listbox"
                      aria-label="Flat type"
                      aria-multiselectable="true"
                    >
                      <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-gold">
                        BHK &amp; type
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {FLAT_OPTIONS.map((name) => {
                          const on = flats.has(name);
                          return (
                            <button
                              key={name}
                              type="button"
                              role="option"
                              aria-selected={on}
                              onClick={() => toggleFlat(name)}
                              className={`rounded-full border px-3.5 py-2 text-left text-xs font-medium capitalize transition-colors sm:text-[13px] ${
                                on
                                  ? "border-gold/80 bg-gold/20 text-white ring-1 ring-gold/40"
                                  : "border-white/20 bg-white/5 text-cream/95 hover:border-white/35 hover:bg-white/10"
                              }`}
                            >
                              {name}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>,
                document.body,
              )}
          </div>
        </div>
      </div>
    </section>
  );
}

function PinIcon({ className }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function HomeIcon({ className }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}

function ChevronIcon({ className }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`shrink-0 transition-transform ${className ?? ""}`}
      aria-hidden
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function XIcon({ className }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}

function SearchIconSolid({ className }) {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.25"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}
