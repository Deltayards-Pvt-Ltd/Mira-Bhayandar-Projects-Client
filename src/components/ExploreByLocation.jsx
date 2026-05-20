import { Link } from "react-router-dom";

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
          <Link
            to="/projects?locality=bhayandar-east"
            className="block overflow-hidden rounded-2xl shadow-md"
          >
            <div className="relative h-64 md:h-80">
              <img
                src="/bhayandar east.png"
                alt="Bhayandar East"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy/80 to-transparent" />
              <h3
                className="absolute bottom-0 left-0 right-0 p-5 text-center text-2xl text-white md:text-3xl"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Bhayandar East
              </h3>
            </div>
          </Link>

          <Link
            to="/projects?locality=bhayandar-west"
            className="block overflow-hidden rounded-2xl shadow-md"
          >
            <div className="relative h-64 md:h-80">
              <img
                src="/bhayandar west.png"
                alt="Bhayandar West"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy/80 to-transparent" />
              <h3
                className="absolute bottom-0 left-0 right-0 p-5 text-center text-2xl text-white md:text-3xl"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Bhayandar West
              </h3>
            </div>
          </Link>

          <Link
            to="/projects?locality=mira-road"
            className="block overflow-hidden rounded-2xl shadow-md"
          >
            <div className="relative h-64 md:h-80">
              <img
                src="/mira road east.png"
                alt="Mira Road"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy/80 to-transparent" />
              <h3
                className="absolute bottom-0 left-0 right-0 p-5 text-center text-2xl text-white md:text-3xl"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Mira Road
              </h3>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
