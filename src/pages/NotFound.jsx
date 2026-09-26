import { Link, useLocation } from "react-router-dom";
import Seo from "../components/Seo";

export default function NotFound() {
  const { pathname } = useLocation();

  return (
    <div className="min-h-full bg-[#fdfbf7] text-navy">
      <Seo
        title="Page not found"
        description="This page does not exist on Mira Bhayandar Property."
        canonical={pathname || "/"}
        noindex
      />
      <section className="bg-navy-gradient noise-overlay relative border-b border-white/10">
        <div className="relative z-[2] mx-auto max-w-3xl px-4 pb-16 pt-[calc(5.5rem+env(safe-area-inset-top,0px))] text-center sm:px-6 sm:pb-20 sm:pt-28 md:pt-32">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-gold-light">
            404
          </p>
          <h1
            className="mb-4 text-4xl font-normal tracking-tight text-gradient-gold md:text-5xl"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Page not found
          </h1>
          <p className="mx-auto max-w-xl text-sm leading-relaxed text-white/55 md:text-base">
            That address is not a page on this site.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/"
              className="inline-flex rounded-full bg-gold px-6 py-3 text-xs font-bold uppercase tracking-[0.14em] text-navy no-underline hover:bg-gold-light"
            >
              Home
            </Link>
            <Link
              to="/projects"
              className="inline-flex rounded-full border-2 border-white/35 px-6 py-3 text-xs font-bold uppercase tracking-[0.14em] text-cream no-underline hover:border-gold"
            >
              All projects
            </Link>
            <Link
              to="/blogs"
              className="inline-flex rounded-full border-2 border-white/35 px-6 py-3 text-xs font-bold uppercase tracking-[0.14em] text-cream no-underline hover:border-gold"
            >
              All blogs
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
