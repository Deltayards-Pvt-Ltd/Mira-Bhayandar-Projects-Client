import { useContext, useEffect } from "react";
import { AppContext } from "../context/AppContext";
import ProjectCard from "./ProjectCard";

function ProjectCardSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-navy/12 bg-white shadow-[0_2px_6px_rgba(10,22,40,0.09)]">
      <div className="aspect-[4/3] animate-pulse bg-navy/5" />
      <div className="px-5 py-5 sm:px-6">
        <div className="h-8 w-3/4 animate-pulse rounded bg-navy/10" />
      </div>
    </div>
  );
}

export default function UpcomingProjects() {
  const {
    upcomingProjects,
    upcomingProjectsLoading,
    refetchUpcomingProjects,
    backendUrl,
    assetUrl = (p) => p ?? "",
  } = useContext(AppContext);

  useEffect(() => {
    if (!backendUrl || !refetchUpcomingProjects) return;
    refetchUpcomingProjects();
  }, [backendUrl, refetchUpcomingProjects]);

  if (upcomingProjectsLoading) {
    return (
      <div className="border-b border-navy/[0.08] bg-[#fdfbf7] text-navy">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
          <div className="h-4 w-36 animate-pulse rounded bg-navy/10" />
          <div className="mt-3 h-10 w-56 animate-pulse rounded bg-navy/10" />
          <div className="mt-10 grid gap-6 sm:grid-cols-2 sm:gap-8 lg:grid-cols-3">
            <ProjectCardSkeleton />
            <ProjectCardSkeleton />
            <ProjectCardSkeleton />
          </div>
        </div>
      </div>
    );
  }

  if (!upcomingProjects?.length) return null;

  return (
    <div className="border-b border-navy/[0.08] bg-[#fdfbf7] text-navy">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        <section aria-labelledby="upcoming-projects-heading">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-ink">
            Upcoming Projects
          </p>
          <h2
            id="upcoming-projects-heading"
            className="mt-2 text-3xl font-normal tracking-tight text-navy sm:text-4xl"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            UPCOMING
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-base leading-[1.75] text-navy/78 sm:text-lg">
            New launches on the horizon — explore projects before they go live on
            the main listings.
          </p>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 sm:gap-8 lg:grid-cols-3">
            {upcomingProjects.map((project) => (
              <ProjectCard
                key={project._id}
                project={project}
                assetUrl={assetUrl}
                compact
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
