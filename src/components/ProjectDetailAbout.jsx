import { useEffect, useState } from "react";

const AMENITIES_INITIAL = 10;

const amenitiesToggleBtnClass =
  "group/btn relative inline-flex items-center gap-2.5 overflow-hidden rounded-full border-2 border-gold-dark bg-white/80 px-8 py-3.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-gold-ink shadow-sm backdrop-blur-sm transition-[color,background-color,border-color,box-shadow,gap,transform] duration-300 ease-out hover:border-gold hover:bg-gold hover:text-navy hover:shadow-[0_8px_28px_-6px_rgba(212,168,83,0.55)] motion-safe:hover:gap-3.5 active:scale-[0.98]";

/**
 * @param {{ project: Record<string, unknown> }} props
 */
export default function ProjectDetailAbout({ project }) {
  const description = typeof project?.description === "string" ? project.description.trim() : "";
  const rawFeatures = project?.features;
  const features = Array.isArray(rawFeatures)
    ? rawFeatures.map((f) => String(f).trim()).filter(Boolean)
    : [];

  const projectKey = String(project?.id ?? project?._id ?? project?.slug ?? "");
  const [amenitiesExpanded, setAmenitiesExpanded] = useState(false);

  useEffect(() => {
    setAmenitiesExpanded(false);
  }, [projectKey]);

  if (!description && features.length === 0) return null;

  const hasMoreAmenities = features.length > AMENITIES_INITIAL;
  const displayedFeatures =
    !hasMoreAmenities || amenitiesExpanded ? features : features.slice(0, AMENITIES_INITIAL);
  const remainingAmenities = features.length - AMENITIES_INITIAL;

  return (
    <div className="border-b border-navy/[0.08] bg-[#fdfbf7] text-navy">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        {description ? (
          <section className={features.length > 0 ? "mb-14 sm:mb-16" : ""} aria-labelledby="project-about-heading">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-ink">
              About the project
            </p>
            <h2
              id="project-about-heading"
              className="mt-2 text-3xl font-normal tracking-tight text-navy sm:text-4xl"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Overview
            </h2>
            <div className="mt-6 max-w-3xl text-base leading-[1.75] text-navy/78 sm:text-lg">
              <p className="whitespace-pre-line">{description}</p>
            </div>
          </section>
        ) : null}

        {features.length > 0 ? (
          <section aria-labelledby="project-amenities-heading">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-ink">
              What you get
            </p>
            <h2
              id="project-amenities-heading"
              className="mt-2 text-3xl font-normal tracking-tight text-navy sm:text-4xl"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Amenities
            </h2>
            <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {displayedFeatures.map((label) => (
                <li
                  key={label}
                  className="flex items-start gap-3 rounded-2xl border-2 border-navy/[0.08] bg-white px-4 py-3.5 text-sm font-medium leading-snug text-navy/85 shadow-[0_4px_20px_-8px_rgba(10,22,40,0.08)] transition-[border-color,box-shadow] duration-200 hover:border-gold/50 hover:shadow-[0_8px_28px_-10px_rgba(212,168,83,0.2)]"
                >
                  <span
                    className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold"
                    aria-hidden
                  />
                  <span>{label}</span>
                </li>
              ))}
            </ul>
            {hasMoreAmenities ? (
              <div className="mt-8 flex justify-center sm:justify-start">
                <button
                  type="button"
                  onClick={() => setAmenitiesExpanded((expanded) => !expanded)}
                  className={amenitiesToggleBtnClass}
                  aria-expanded={amenitiesExpanded}
                >
                  {amenitiesExpanded ? (
                    "Show less"
                  ) : (
                    <>
                      Show more
                      <span className="tabular-nums text-navy/55 group-hover/btn:text-navy/70">
                        ({remainingAmenities} remaining)
                      </span>
                    </>
                  )}
                </button>
              </div>
            ) : null}
          </section>
        ) : null}
      </div>
    </div>
  );
}
