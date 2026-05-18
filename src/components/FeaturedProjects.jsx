import { useContext, useLayoutEffect, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import ProjectCard from "./ProjectCard";
import { useReveal } from "../hooks/useReveal";

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
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}

const FEATURED_COUNT = 3;

function pickRandomProjects(projects, count) {
  const pool = projects.filter((p) => p?.coverVideo || p?.coverImage);
  if (pool.length <= count) return pool;
  const shuffled = [...pool];
  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.slice(0, count);
}

export default function FeaturedProjects() {
  const ctx = useContext(AppContext);
  const allProjects = ctx?.allProjects ?? [];
  const loading = ctx?.loading ?? false;
  const assetUrl = ctx?.assetUrl ?? ((p) => p ?? "");
  /** Same pattern as ArchitecturalVision: observe the whole section, default IO options. */
  const [sectionRef, visible] = useReveal();
  const [featured, setFeatured] = useState([]);
  const hasPickedRef = useRef(false);

  useEffect(() => {
    if (loading || hasPickedRef.current) return;
    hasPickedRef.current = true;
    setFeatured(pickRandomProjects(allProjects, FEATURED_COUNT));
  }, [loading, allProjects]);

  const showGrid = !loading && featured.length > 0;

  /**
   * If the section was already intersecting during loading, `visible` is true
   * when the grid first mounts — without a paint at opacity 0 the fade is skipped.
   * Two rAFs after (showGrid && visible) match a minimal flush so CSS transition runs.
   */
  const [revealChildren, setRevealChildren] = useState(false);
  useLayoutEffect(() => {
    if (!showGrid || !visible) {
      setRevealChildren(false);
      return undefined;
    }
    setRevealChildren(false);
    let cancelled = false;
    let raf1 = 0;
    let raf2 = 0;
    raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => {
        if (!cancelled) setRevealChildren(true);
      });
    });
    return () => {
      cancelled = true;
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
    };
  }, [showGrid, visible]);

  const fadeClass = (base) =>
    showGrid
      ? `${base} featured-fade${revealChildren ? " is-visible" : ""}`
      : base;

  return (
    <section
      ref={sectionRef}
      className="bg-[#fdfbf7] py-16 md:py-24"
      aria-labelledby="featured-projects-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {loading ? (
          <p className="text-center text-sm text-navy/50">Loading projects…</p>
        ) : featured.length === 0 ? (
          <p className="text-center text-sm text-navy/50">
            No projects with a cover image or cover video yet.
          </p>
        ) : (
          <>
            <header
              className={fadeClass("mb-12 text-center md:mb-16 ")}
              style={
                showGrid ? { "--featured-fade-delay": "0ms" } : undefined
              }
            >
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-gold-ink">
                Our projects
              </p>
              <h2
                id="featured-projects-heading"
                className="mb-4 text-4xl tracking-tight text-navy md:text-5xl lg:text-6xl"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Featured Projects
              </h2>
              <p className="mx-auto max-w-2xl text-base leading-relaxed text-navy/72 md:text-lg">
                Discover exceptional living spaces across Mira-Bhayandar
              </p>
            </header>

            <div className="grid gap-6 sm:grid-cols-2 sm:gap-8 lg:grid-cols-3">
              {featured.map((p, i) => (
                <div
                  key={String(p._id)}
                  className={fadeClass("")}
                  style={{
                    "--featured-fade-delay": `${100 + i * 100}ms`,
                  }}
                >
                  <ProjectCard project={p} assetUrl={assetUrl} />
                </div>
              ))}
            </div>
            <div
              className={fadeClass("mt-12 flex justify-center md:mt-14 ")}
              style={{
                "--featured-fade-delay": `${100 + featured.length * 100 + 60}ms`,
              }}
            >
              <Link
                to="/projects"
                className="group/btn relative inline-flex items-center gap-2.5 overflow-hidden rounded-full border-2 border-gold-dark bg-white/80 px-8 py-3.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-gold-ink shadow-sm backdrop-blur-sm transition-[color,background-color,border-color,box-shadow,gap,transform] duration-300 ease-out hover:border-gold hover:bg-gold hover:text-navy hover:shadow-[0_8px_28px_-6px_rgba(212,168,83,0.55)] motion-safe:hover:gap-3.5 active:scale-[0.98]"
              >
                <span className="relative z-10">View all projects</span>
                <span
                  className="relative z-10 inline-flex transition-transform duration-300 ease-out motion-safe:group-hover/btn:translate-x-1"
                  aria-hidden
                >
                  <ArrowRightIcon />
                </span>
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
