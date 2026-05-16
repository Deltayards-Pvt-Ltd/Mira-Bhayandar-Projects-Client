import { useLayoutEffect, useState } from "react";
import { useReveal } from "../hooks/useReveal";
import { locationAreas } from "../data/locationAreas";
import { LOCALITY_OPTIONS, buildProjectsPath } from "../utils/projectsFilters";
import LocationCard from "./LocationCard";

const LOCALITY_ID_BY_LABEL = Object.fromEntries(
  LOCALITY_OPTIONS.map((o) => [o.label, o.id]),
);

export default function ExploreByLocation() {
  const [sectionRef, visible] = useReveal();

  const [revealChildren, setRevealChildren] = useState(false);
  useLayoutEffect(() => {
    if (!visible) {
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
  }, [visible]);

  const fadeClass = (base) =>
    `${base} featured-fade${revealChildren ? " is-visible" : ""}`;

  return (
    <section
      ref={sectionRef}
      className="bg-[#faf9f6] pt-16 pb-10 md:pt-28 md:pb-12"
      aria-labelledby="explore-location-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <header
          className={fadeClass("mb-12 text-center md:mb-16")}
          style={{ "--featured-fade-delay": "0ms" }}
        >
          <p className="mb-3 font-sans text-xs font-semibold uppercase tracking-[0.2em] text-gold-ink">
            Discover areas
          </p>
          <h2
            id="explore-location-heading"
            className="mb-4 text-4xl tracking-tight text-navy md:text-5xl lg:text-6xl"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Explore by Location
          </h2>
          <p className="mx-auto max-w-2xl font-sans text-base leading-relaxed text-navy/72 md:text-lg">
            Each neighborhood has its own character. Find the one that fits your
            lifestyle.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-6">
          {locationAreas.map((area, i) => (
            <div
              key={area.name}
              className={fadeClass("")}
              style={{
                "--featured-fade-delay": `${90 + i * 100}ms`,
              }}
            >
              <LocationCard
                name={area.name}
                image={area.image}
                to={buildProjectsPath({
                  localityIds: LOCALITY_ID_BY_LABEL[area.name]
                    ? [LOCALITY_ID_BY_LABEL[area.name]]
                    : [],
                })}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
