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

function toggleId(list, id) {
  if (list.includes(id)) return list.filter((x) => x !== id);
  return [...list, id];
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
  const [localitySel, setLocalitySel] = useState([]);
  const [configSel, setConfigSel] = useState([]);

  useEffect(() => {
    const { q, localityIds, configIds } = parseProjectsSearchParams(searchParams);
    setSearchInput(q);
    setAppliedSearch(q);
    setLocalitySel(localityIds);
    setConfigSel(configIds);
  }, [searchParams]);

  const syncUrl = useCallback(
    (overrides = {}) => {
      const q = overrides.q !== undefined ? overrides.q : appliedSearch;
      const localityIds =
        overrides.localityIds !== undefined ? overrides.localityIds : localitySel;
      const configIds =
        overrides.configIds !== undefined ? overrides.configIds : configSel;
      setSearchParams(
        buildProjectsSearchParams({ q, localityIds, configIds }),
        { replace: true },
      );
    },
    [appliedSearch, localitySel, configSel, setSearchParams],
  );

  const handleSearchSubmit = useCallback(() => {
    const q = searchInput.trim();
    setAppliedSearch(q);
    syncUrl({ q });
  }, [searchInput, syncUrl]);

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
              onToggleLocality={(id) => {
                const next = toggleId(localitySel, id);
                setLocalitySel(next);
                syncUrl({ localityIds: next });
              }}
              onClearLocality={() => {
                setLocalitySel([]);
                syncUrl({ localityIds: [] });
              }}
              configSelection={configSel}
              onToggleConfig={(id) => {
                const next = toggleId(configSel, id);
                setConfigSel(next);
                syncUrl({ configIds: next });
              }}
              onClearConfig={() => {
                setConfigSel([]);
                syncUrl({ configIds: [] });
              }}
              onClearAll={() => {
                setLocalitySel([]);
                setConfigSel([]);
                syncUrl({ localityIds: [], configIds: [] });
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
