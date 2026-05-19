import { useContext, useMemo } from "react";
import { Link } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import BlogCard from "./BlogCard";

const HOME_BLOG_COUNT = 3;

function ArrowRightIcon() {
  return (
    <svg
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

export default function LatestUpdates() {
  const { blogs, assetUrl } = useContext(AppContext) ?? {};
  const allBlogs = useMemo(() => (Array.isArray(blogs) ? blogs : []), [blogs]);
  const list = useMemo(() => allBlogs.slice(0, HOME_BLOG_COUNT), [allBlogs]);
  if (list.length === 0) return null;

  return (
    <section
      className="bg-white py-16 md:py-24"
      aria-labelledby="latest-updates-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <header className="mb-12 text-center md:mb-14">
          <p className="mb-3 font-sans text-xs font-semibold uppercase tracking-[0.2em] text-gold-ink">
            Stay informed
          </p>
          <h2
            id="latest-updates-heading"
            className="mb-4 text-4xl tracking-tight text-navy md:text-5xl lg:text-6xl"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Whats Up?
          </h2>
          <p className="mx-auto max-w-2xl font-sans text-base leading-relaxed text-navy/70 md:text-lg">
            Market insights, infrastructure news, and regulatory updates for smart
            home buyers.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-6 lg:grid-cols-3 lg:gap-8">
          {list.map((blog, index) => (
            <BlogCard
              key={blog._id ?? blog.id ?? index}
              blog={blog}
              assetUrl={assetUrl}
            />
          ))}
        </div>

        <div className="mt-12 flex justify-center md:mt-14">
          <Link
              to="/blogs"
              className="group/btn relative inline-flex items-center gap-2.5 overflow-hidden rounded-full border-2 border-gold-dark bg-white/80 px-8 py-3.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-gold-ink shadow-sm backdrop-blur-sm transition-[color,background-color,border-color,box-shadow,gap,transform] duration-300 ease-out hover:border-gold hover:bg-gold hover:text-navy hover:shadow-[0_8px_28px_-6px_rgba(212,168,83,0.55)] motion-safe:hover:gap-3.5 active:scale-[0.98]"
            >
              <span className="relative z-10">Explore more</span>
              <span
                className="relative z-10 inline-flex transition-transform duration-300 ease-out motion-safe:group-hover/btn:translate-x-1"
                aria-hidden
              >
                <ArrowRightIcon />
              </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
