import { useReveal } from "../hooks/useReveal";

export default function Storytelling() {
  const [ref, visible] = useReveal();

  return (
    <section
      ref={ref}
      className="relative overflow-hidden bg-navy-gradient py-20 md:py-28"
      aria-labelledby="story-heading"
    >
      {/* Soft gold radial accent */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(212,168,83,0.06) 0%, transparent 70%)",
        }}
      />

      {/* Subtle noise — adds editorial grain without an image asset */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.05] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.65'/></svg>\")",
        }}
      />

      <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div
          className={`reveal mx-auto mb-8 h-px w-16 bg-white/20 md:mb-10 ${
            visible ? "is-visible" : ""
          }`}
        />

        <h2
          id="story-heading"
          className={`reveal text-center text-3xl leading-[1.15] text-white/90 md:text-4xl lg:text-5xl ${
            visible ? "is-visible" : ""
          }`}
          style={{
            fontFamily: "var(--font-heading)",
            transitionDelay: "100ms",
          }}
        >
          We don't just sell homes.
        </h2>

        <h2
          className={`reveal text-gradient-gold mt-4 text-center text-3xl leading-[1.15] md:text-4xl lg:text-5xl ${
            visible ? "is-visible" : ""
          }`}
          style={{
            fontFamily: "var(--font-heading)",
            transitionDelay: "280ms",
          }}
        >
          We help you find where your story begins.
        </h2>

        <p
          className={`reveal mx-auto mt-6 max-w-2xl text-center text-base leading-relaxed text-white/70 md:text-lg ${
            visible ? "is-visible" : ""
          }`}
          style={{ transitionDelay: "460ms" }}
        >
          We have been the trusted bridge between families and their dream
          homes in Mira-Bhayandar.
        </p>

        <div
          className={`reveal mx-auto mt-8 h-px w-16 bg-white/20 md:mt-10 ${
            visible ? "is-visible" : ""
          }`}
          style={{ transitionDelay: "600ms" }}
        />
      </div>
    </section>
  );
}
