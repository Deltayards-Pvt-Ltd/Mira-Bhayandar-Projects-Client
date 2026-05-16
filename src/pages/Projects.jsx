import { useCallback, useContext, useMemo, useState } from "react";
import { AppContext } from "../context/AppContext";
import ProjectCard from "../components/ProjectCard";
import DreamHomeCta from "../components/DreamHomeCta";
import ProjectsFilterToolbar from "../components/ProjectsFilterToolbar";
import { filterProjects } from "../utils/projectsFilters";

function toggleId(list, id) {
  if (list.includes(id)) return list.filter((x) => x !== id);
  return [...list, id];
}

export default function Projects() {
  const ctx = useContext(AppContext);
  const allProjects = useMemo(() => ctx?.allProjects ?? [], [ctx?.allProjects]);
  const loading = ctx?.loading ?? false;
  const assetUrl = ctx?.assetUrl ?? ((p) => p ?? "");

  const [searchInput, setSearchInput] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");
  const [localitySel, setLocalitySel] = useState([]);
  const [configSel, setConfigSel] = useState([]);

  const handleSearchSubmit = useCallback(() => {
    setAppliedSearch(searchInput.trim());
  }, [searchInput]);

  const visibleProjects = useMemo(
    () =>
      filterProjects(
        allProjects,
        appliedSearch,
        localitySel,
        configSel
      ),
    [allProjects, appliedSearch, localitySel, configSel]
  );

  const total = allProjects.length;
  const visibleCount = visibleProjects.length;

  const subline = useMemo(() => {
    if (total === 0) return "Handpicked projects in Mira-Bhayandar";
    if (total === 1) return "1 handpicked project in Mira-Bhayandar";
    return `${total} handpicked projects in Mira-Bhayandar`;
  }, [total]);

  const resultsLine =
    total === 0
      ? "Showing 0 projects"
      : visibleCount === total
        ? `Showing ${visibleCount} project${visibleCount === 1 ? "" : "s"}`
        : `Showing ${visibleCount} of ${total} projects`;

  return (
    <div className="min-h-full bg-[#fdfbf7] text-navy">
      <section
        className="bg-navy-gradient noise-overlay relative border-b border-white/10"
        aria-labelledby="projects-page-heading"
      >
        <div className="relative z-[2] mx-auto max-w-7xl px-4 pb-12 pt-[calc(5.5rem+env(safe-area-inset-top,0px))] text-center sm:px-6 sm:pb-14 sm:pt-28 md:pt-32 md:pb-16 lg:px-8">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-gold-light">
            Our portfolio
          </p>
          <h1
            id="projects-page-heading"
            className="mb-4 text-4xl font-normal tracking-tight text-gradient-gold md:text-5xl lg:text-6xl"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            All Projects
          </h1>
          <p className="mx-auto max-w-xl text-sm leading-relaxed text-white/55 md:text-base">
            {subline}
          </p>
        </div>
      </section>

      <section
        className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8 lg:py-14"
        aria-label="Project listings"
      >
        {!loading && total > 0 ? (
          <div className="mb-8">
            <ProjectsFilterToolbar
              searchInput={searchInput}
              onSearchInputChange={setSearchInput}
              onSearchSubmit={handleSearchSubmit}
              localitySelection={localitySel}
              onToggleLocality={(id) =>
                setLocalitySel((prev) => toggleId(prev, id))
              }
              onClearLocality={() => setLocalitySel([])}
              configSelection={configSel}
              onToggleConfig={(id) => setConfigSel((prev) => toggleId(prev, id))}
              onClearConfig={() => setConfigSel([])}
            />
            <p className="mt-6 text-sm text-navy/55">{resultsLine}</p>
          </div>
        ) : null}

        {loading ? (
          <p className="text-center text-sm text-navy/50">Loading projects…</p>
        ) : total === 0 ? (
          <p className="text-center text-sm text-navy/50">
            No projects yet. Add projects in the admin panel.
          </p>
        ) : visibleCount === 0 ? (
          <p className="text-center text-sm text-navy/55">
            No projects match your search or filters.
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 sm:gap-8 lg:grid-cols-3">
            {visibleProjects.map((p) => (
              <ProjectCard key={String(p._id)} project={p} assetUrl={assetUrl} />
            ))}
          </div>
        )}
      </section>

      {!loading && visibleCount > 0 ? <DreamHomeCta /> : null}
    </div>
  );
}
