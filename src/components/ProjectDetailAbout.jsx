/**
 * @param {{ project: Record<string, unknown> }} props
 */
export default function ProjectDetailAbout({ project }) {
  const description = typeof project?.description === "string" ? project.description.trim() : "";
  const rawFeatures = project?.features;
  const features = Array.isArray(rawFeatures)
    ? rawFeatures.map((f) => String(f).trim()).filter(Boolean)
    : [];

  if (!description && features.length === 0) return null;

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
              {features.map((label) => (
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
          </section>
        ) : null}
      </div>
    </div>
  );
}
