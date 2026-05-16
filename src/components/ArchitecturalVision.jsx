import { useReveal } from "../hooks/useReveal";

export default function ArchitecturalVision() {
  const [ref, visible] = useReveal();

  return (
    <section
      ref={ref}
      className="bg-white py-16 md:py-24"
      aria-labelledby="arch-vision-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-8 lg:grid-cols-5 lg:gap-12">
          <div className="lg:col-span-3">
            <div className="relative aspect-[16/10] overflow-hidden rounded-2xl shadow-2xl">
              <img
                src="/aria.jpg"
                alt="Aerial view of a modern residential development in Mira-Bhayandar"
                className="h-full w-full object-cover"
                width={1600}
                height={1000}
                loading="lazy"
                decoding="async"
              />
              <div
                className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-t from-navy/40 to-transparent"
                aria-hidden
              />
              <div
                aria-hidden
                className={`arch-vision-cover pointer-events-none absolute inset-0 z-[2] bg-gold/85 ${
                  visible ? "is-visible" : ""
                }`}
              />
            </div>
          </div>

          <div
            className={`arch-vision-text lg:col-span-2 ${
              visible ? "is-visible" : ""
            }`}
          >
            <p className="mb-3 block font-sans text-xs font-semibold uppercase tracking-[0.2em] text-gold">
              Architectural vision
            </p>
            <h2
              id="arch-vision-heading"
              className="mb-4 text-4xl tracking-tight text-navy md:text-5xl"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Building the{" "}
              <span className="text-gradient-gold">Future</span>
            </h2>
            <p className="max-w-xl text-base leading-relaxed text-navy/60 md:text-lg">
              From visionary blueprints to landmark residences — discover
              projects that redefine modern living in Mira-Bhayandar. Every
              detail is crafted for families who expect the extraordinary.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
