import { Link } from "react-router-dom";

function ArrowRightIcon({ className }) {
  return (
    <svg
      className={className}
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}

/**
 * @param {{
 *   name: string;
 *   image: string;
 *   to: string;
 * }} props
 */
export default function LocationCard({ name, image, to }) {
  return (
    <Link
      to={to}
      className="group block outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-[#faf9f6]"
    >
      <div className="relative h-64 overflow-hidden rounded-2xl shadow-[0_12px_40px_-12px_rgba(10,22,40,0.18)] transition-[transform,box-shadow] duration-300 motion-safe:group-hover:-translate-y-1.5 motion-safe:group-hover:shadow-[0_20px_48px_-12px_rgba(10,22,40,0.22)] md:h-80">
        <img
          src={image}
          alt={name}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 motion-safe:group-hover:scale-[1.04]"
          loading="lazy"
          decoding="async"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/35 to-transparent transition-opacity duration-300 group-hover:opacity-0" />
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-navy/55 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
          <span className="flex items-center gap-2 font-sans text-sm font-semibold uppercase tracking-[0.14em] text-gold transition-[gap] duration-300 group-hover:gap-3">
            Explore
            <ArrowRightIcon className="transition-transform duration-300 group-hover:translate-x-1" />
          </span>
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6">
          <h3
            className="text-2xl tracking-tight text-white transition-opacity duration-300 group-hover:opacity-0 md:text-3xl lg:text-4xl"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            {name}
          </h3>
        </div>
      </div>
    </Link>
  );
}
