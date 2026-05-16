import { areaHighlights } from "../data/areaHighlights";

function IconFrame({ children }) {
  return (
    <svg
      className="h-6 w-6 md:h-7 md:w-7"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {children}
    </svg>
  );
}

const ICONS = {
  Train: () => (
    <IconFrame>
      <path d="M4 11V9a2 2 0 0 1 2-2h2" />
      <path d="M10 7h4" />
      <path d="M18 9v2a2 2 0 0 1-2 2h-2" />
      <path d="M8 21v-2" />
      <path d="M16 21v-2" />
      <rect width="16" height="10" x="4" y="3" rx="2" />
    </IconFrame>
  ),
  GraduationCap: () => (
    <IconFrame>
      <path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12 3.17 2.58 9.084a1 1 0 0 0 0 1.832l9.42 5.916a1 1 0 0 0 .96 0l9.42-5.916a1 1 0 0 0-.02-.838z" />
      <path d="M22 10v6" />
      <path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5" />
    </IconFrame>
  ),
  Heart: () => (
    <IconFrame>
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    </IconFrame>
  ),
  ShoppingBag: () => (
    <IconFrame>
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
      <path d="M3 6h18" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </IconFrame>
  ),
  Car: () => (
    <IconFrame>
      <path d="M14 16H9m10 0h3v-3.15a1 1 0 0 0-.84-.99L16 11l-2.7-3.6a1 1 0 0 0-.8-.4H8.7a1 1 0 0 0-.8.4L5.35 11 2.84 12.86A1 1 0 0 0 2 13.85V16h3" />
      <circle cx="6.5" cy="16.5" r="2.5" />
      <circle cx="16.5" cy="16.5" r="2.5" />
    </IconFrame>
  ),
  Trees: () => (
    <IconFrame>
      <path d="M12 22v-7" />
      <path d="M9 8a3 3 0 0 0 6 0c0-3-3-5-3-5s-3 2-3 5" />
      <path d="M12 15a3 3 0 0 0 3-3c0-2-2-3.5-2-3.5S11 10 11 12a3 3 0 0 0 3 3Z" />
    </IconFrame>
  ),
};

export default function WhyMiraBhayandar() {
  return (
    <section
      className="noise-overlay relative overflow-hidden bg-navy-gradient py-20 text-white md:py-28"
      aria-labelledby="why-area-heading"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(212,168,83,0.05) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <header className="mb-12 text-center md:mb-16">
          <p className="mb-3 font-sans text-xs font-semibold uppercase tracking-[0.2em] text-gold">
            Discover the area
          </p>
          <h2
            id="why-area-heading"
            className="mb-4 text-4xl tracking-tight md:text-5xl lg:text-6xl"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Why Mira-Bhayandar?
          </h2>
          <p className="mx-auto max-w-2xl font-sans text-base leading-relaxed text-white/55 md:text-lg">
            Everything you need, minutes away
          </p>
        </header>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 md:gap-6 lg:grid-cols-3">
          {areaHighlights.map((item) => {
            const Icon = ICONS[item.icon] ?? ICONS.Train;
            return (
              <div
                key={item.title}
                className="group rounded-xl border border-white/10 bg-white/[0.05] p-5 backdrop-blur-md transition-all duration-300 motion-safe:hover:-translate-y-1 hover:border-gold/25 hover:bg-white/[0.08] md:p-7"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gold/15 text-gold transition-all duration-300 group-hover:bg-gold/25 group-hover:shadow-[0_0_20px_rgba(212,168,83,0.15)] md:mb-5 md:h-14 md:w-14">
                  <Icon />
                </div>
                <h3
                  className="mb-2 text-2xl tracking-tight md:text-3xl lg:text-4xl"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  {item.title}
                </h3>
                <p className="font-sans text-sm leading-relaxed text-white/50 md:text-[15px]">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
