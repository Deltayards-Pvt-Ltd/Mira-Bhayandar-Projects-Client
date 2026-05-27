import { Link } from "react-router-dom";

const locations = [
  {
    to: "/projects?area=Bhayandar+East",
    img: "/bhayandar east.png",
    alt: "Bhayandar East",
    name: "Bhayandar East",
  },
  {
    to: "/projects?area=Bhayandar+West",
    img: "/bhayandar west.png",
    alt: "Bhayandar West",
    name: "Bhayandar West",
  },
  {
    to: "/projects?area=Mira+Road",
    img: "/mira road east.png",
    alt: "Mira Road",
    name: "Mira Road",
  },
];

export default function ExploreByLocation() {
  return (
    <section className="bg-[#faf9f6] pt-16 pb-10 md:pt-28 md:pb-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <header className="mb-12 text-center md:mb-16">
          <p className="mb-3 font-sans text-xs font-semibold uppercase tracking-[0.2em] text-gold-ink">
            Discover areas
          </p>
          <h2
            className="mb-4 text-4xl tracking-tight text-navy md:text-5xl lg:text-6xl"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Pick Your Pick!
          </h2>
          <p className="mx-auto max-w-2xl font-sans text-base leading-relaxed text-navy/72 md:text-lg">
            Each neighborhood has its own character. Find the one that fits you best
          </p>
        </header>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {locations.map(({ to, img, alt, name }) => (
            <Link
              key={to}
              to={to}
              className="group block overflow-hidden rounded-2xl shadow-md"
            >
              <div className="relative h-64 md:h-80">
                <img
                  src={img}
                  alt={alt}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div
                  className="absolute inset-0 bg-gradient-to-t from-navy/80 to-transparent transition-opacity duration-300 group-hover:opacity-0"
                  aria-hidden
                />
                <div
                  className="absolute inset-0 bg-gold/65 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  aria-hidden
                />
                <div className="absolute inset-0 z-10 flex items-center justify-center">
                  <h3
                    className="text-center text-2xl text-white transition-opacity duration-300 group-hover:opacity-0 md:text-3xl"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    {name}
                  </h3>
                  <span className="pointer-events-none absolute text-center font-sans text-sm font-semibold uppercase tracking-[0.3em] text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100 md:text-base">
                    EXPLORE
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
