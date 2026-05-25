import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import ProjectCard from "../components/ProjectCard";
import DreamHomeCta from "../components/DreamHomeCta";
import ProjectsFilterToolbar from "../components/ProjectsFilterToolbar";
import ProjectsPagination, { DEFAULT_PROJECTS_LIMIT } from "../components/ProjectsPagination";
import {
  buildProjectsSearchParams,
  filterProjects,
  parseProjectsSearchParams,
} from "../utils/projectsFilters";
import UpcomingProjects from "../components/upcomingProjects";

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

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(DEFAULT_PROJECTS_LIMIT);

  useEffect(() => {
    if (!backendUrl || !refetchProjects) return;
    refetchProjects();
  }, [backendUrl, refetchProjects]);

  const [searchInput, setSearchInput] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");
  const [areaSel, setAreaSel] = useState([]);
  const [configSel, setConfigSel] = useState([]);
  const [propertyTypeSel, setPropertyTypeSel] = useState([]);

  useEffect(() => {
    const { q, areas, configurations, propertyTypes } =
      parseProjectsSearchParams(searchParams);
    setSearchInput(q);
    setAppliedSearch(q);
    setAreaSel(areas);
    setConfigSel(configurations);
    setPropertyTypeSel(propertyTypes);
  }, [searchParams]);

  const syncUrl = useCallback(
    (overrides = {}) => {
      const q = overrides.q !== undefined ? overrides.q : appliedSearch;
      const areas = overrides.areas !== undefined ? overrides.areas : areaSel;
      const configurations =
        overrides.configurations !== undefined ? overrides.configurations : configSel;
      const propertyTypes =
        overrides.propertyTypes !== undefined ? overrides.propertyTypes : propertyTypeSel;
      setSearchParams(
        buildProjectsSearchParams({ q, areas, configurations, propertyTypes }),
        { replace: true },
      );
    },
    [appliedSearch, areaSel, configSel, propertyTypeSel, setSearchParams],
  );

  const handleSearchSubmit = useCallback(() => {
    const q = searchInput.trim();
    setAppliedSearch(q);
    syncUrl({ q });
  }, [searchInput, syncUrl]);

  const visibleProjects = useMemo(
    () => filterProjects(allProjects, appliedSearch, areaSel, configSel, propertyTypeSel),
    [allProjects, appliedSearch, areaSel, configSel, propertyTypeSel],
  );

  const visibleCount = visibleProjects.length;
  const total = allProjects.length;
  const totalPages = Math.max(1, Math.ceil(visibleCount / limit));

  useEffect(() => {
    setPage(1);
  }, [appliedSearch, areaSel, configSel, propertyTypeSel]);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const paginatedProjects = useMemo(() => {
    const start = (page - 1) * limit;
    return visibleProjects.slice(start, start + limit);
  }, [visibleProjects, page, limit]);

  const handleLimitChange = (nextLimit) => {
    setLimit(nextLimit);
    setPage(1);
  };

  const subline = useMemo(() => {
    if (total === 0) return "Handpicked projects in Mira-Bhayandar";
    if (total === 1) return "1 handpicked project in Mira-Bhayandar";
    return `${total} handpicked projects in Mira-Bhayandar`;
  }, [total]);

  const resultsLine =
    total === 0
      ? "Showing 0 projects"
      : visibleCount === total
        ? `${visibleCount} project${visibleCount === 1 ? "" : "s"} match`
        : `${visibleCount} of ${total} projects match your filters`;

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
              propertyTypeSelection={propertyTypeSel}
              onTogglePropertyType={(name) => {
                const next = toggle(propertyTypeSel, name);
                setPropertyTypeSel(next);
                syncUrl({ propertyTypes: next });
              }}
              onClearPropertyType={() => {
                setPropertyTypeSel([]);
                syncUrl({ propertyTypes: [] });
              }}
              onClearAll={() => {
                setAreaSel([]);
                setConfigSel([]);
                setPropertyTypeSel([]);
                syncUrl({ areas: [], configurations: [], propertyTypes: [] });
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
          <>
            <div className="grid gap-6 sm:grid-cols-2 sm:gap-8 lg:grid-cols-3">
              {paginatedProjects.map((p) => (
                <ProjectCard key={String(p._id)} project={p} assetUrl={assetUrl} />
              ))}
            </div>
            <ProjectsPagination
              page={page}
              limit={limit}
              total={visibleCount}
              onPageChange={setPage}
              onLimitChange={handleLimitChange}
            />
          </>
        )}
      </section>

        <UpcomingProjects  />

       <DreamHomeCta /> 
    </div>
  );
}
