export default function DreamHomeCta() {
  return (
    <section
      className="noise-overlay relative overflow-hidden bg-navy-gradient py-20 text-center text-white md:py-28"
      aria-labelledby="dream-home-cta-heading"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(212,168,83,0.07) 0%, transparent 65%)",
        }}
      />

      <div className="relative z-10 mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <h2
          id="dream-home-cta-heading"
          className="text-4xl leading-[1.12] tracking-tight md:text-5xl lg:text-6xl"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          <span className="text-white">Ready to Find Your </span>
          <span className="text-gold">Dream Home?</span>
        </h2>
      </div>
    </section>
  );
}
