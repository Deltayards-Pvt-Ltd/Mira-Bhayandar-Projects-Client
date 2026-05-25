import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import ProjectCard from "../components/ProjectCard";
import DreamHomeCta from "../components/DreamHomeCta";
import ProjectsFilterToolbar from "../components/ProjectsFilterToolbar";
import {
  buildProjectsSearchParams,
  filterProjects,
  parseProjectsSearchParams,
} from "../utils/projectsFilters";

function toggle(list, value) {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
}

export default function Projects() {
  const ctx = useContext(AppContext);
  const [searchParams, setSearchParams] = useSearchParams();
  const allProjects = useMemo(() => ctx?.allProjects ?? [], [ctx?.allProjects]);
  const loading = ctx?.projectsLoading ?? false;
  const assetUrl = ctx?.assetUrl ?? ((p) => p ?? "");
  const backendUrl = ctx?.backendUrl ?? "";
  const refetchProjects = ctx?.refetchProjects;

  useEffect(() => {
    if (!backendUrl || !refetchProjects) return;
    refetchProjects();
  }, [backendUrl, refetchProjects]);

  const [searchInput, setSearchInput] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");
  const [areaSel, setAreaSel] = useState([]);
  const [configSel, setConfigSel] = useState([]);
  const [statusSel, setStatusSel] = useState([]);

  useEffect(() => {
    const { q, areas, configurations, statuses } =
      parseProjectsSearchParams(searchParams);
    setSearchInput(q);
    setAppliedSearch(q);
    setAreaSel(areas);
    setConfigSel(configurations);
    setStatusSel(statuses);
  }, [searchParams]);

  const syncUrl = useCallback(
    (overrides = {}) => {
      const q = overrides.q !== undefined ? overrides.q : appliedSearch;
      const areas = overrides.areas !== undefined ? overrides.areas : areaSel;
      const configurations =
        overrides.configurations !== undefined ? overrides.configurations : configSel;
      const statuses = overrides.statuses !== undefined ? overrides.statuses : statusSel;
      setSearchParams(
        buildProjectsSearchParams({ q, areas, configurations, statuses }),
        { replace: true },
      );
    },
    [appliedSearch, areaSel, configSel, statusSel, setSearchParams],
  );

  const handleSearchSubmit = useCallback(() => {
    const q = searchInput.trim();
    setAppliedSearch(q);
    syncUrl({ q });
  }, [searchInput, syncUrl]);

  const visibleProjects = useMemo(
    () => filterProjects(allProjects, appliedSearch, areaSel, configSel, statusSel),
    [allProjects, appliedSearch, areaSel, configSel, statusSel],
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
              areaSelection={areaSel}
              onToggleArea={(name) => {
                const next = toggle(areaSel, name);
                setAreaSel(next);
                syncUrl({ areas: next });
              }}
              onClearAreas={() => {
                setAreaSel([]);
                syncUrl({ areas: [] });
              }}
              configSelection={configSel}
              onToggleConfig={(name) => {
                const next = toggle(configSel, name);
                setConfigSel(next);
                syncUrl({ configurations: next });
              }}
              onClearConfig={() => {
                setConfigSel([]);
                syncUrl({ configurations: [] });
              }}
              statusSelection={statusSel}
              onToggleStatus={(name) => {
                const next = toggle(statusSel, name);
                setStatusSel(next);
                syncUrl({ statuses: next });
              }}
              onClearStatus={() => {
                setStatusSel([]);
                syncUrl({ statuses: [] });
              }}
              onClearAll={() => {
                setAreaSel([]);
                setConfigSel([]);
                setStatusSel([]);
                syncUrl({ areas: [], configurations: [], statuses: [] });
              }}
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
