import { useContext, useLayoutEffect, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
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

// const FEATURED_COUNT = 3;

export default function FeaturedProjects() {
  const { backendUrl, assetUrl: ctxAssetUrl, appLoading } = useContext(AppContext) ?? {};
  const assetUrl = ctxAssetUrl ?? ((p) => p ?? "");
  const [sectionRef, visible] = useReveal({
    threshold: 0.05,
    rootMargin: "0px",
  });
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const limit = 6;

  useEffect(() => {
    if (appLoading || !backendUrl) return;
    let cancelled = false;
    setLoading(true);
    setError("");
    (async () => {
      try {
        const { data } = await axios.get(
          `${backendUrl}/api/project/featured`,
          {
            params: {
              limit,
            },
          },
        );
        if (cancelled) return;
        if (data?.success) {
          setFeatured((data.featuredProjects ?? []).slice(0, limit));
        } else {
          setFeatured([]);
          setError(data?.message || "Could not load featured projects.");
        }
      } catch (err) {
        if (cancelled) return;
        setFeatured([]);
        setError(err?.message || "Failed to load featured projects.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [appLoading, backendUrl]);

  const showGrid = !loading && !appLoading && featured.length > 0;

  const [revealChildren, setRevealChildren] = useState(false);
  useLayoutEffect(() => {
    if (!showGrid) {
      setRevealChildren(false);
      return undefined;
    }
    let cancelled = false;
    const reveal = () => {
      if (!cancelled) setRevealChildren(true);
    };
    // Double rAF so opacity transition runs; fallback if IO threshold never fires (common on tall desktop sections).
    let raf1 = 0;
    let raf2 = 0;
    let fallbackId = 0;
    if (visible) {
      raf1 = requestAnimationFrame(() => {
        raf2 = requestAnimationFrame(reveal);
      });
    } else {
      fallbackId = window.setTimeout(reveal, 120);
    }
    return () => {
      cancelled = true;
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
      clearTimeout(fallbackId);
    };
  }, [showGrid, visible]);

  const fadeClass = (base) =>
    showGrid
      ? `${base} featured-fade${revealChildren ? " is-visible" : ""}`
      : base;

  const busy = appLoading || loading;

  return (
    <section
      ref={sectionRef}
      className="bg-[#fdfbf7] py-10 text-navy md:py-16"
      aria-labelledby="featured-projects-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {busy ? (
          <p className="text-center text-sm text-navy/50">Loading projects…</p>
        ) : error ? (
          <p className="text-center text-sm text-navy/50">{error}</p>
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
