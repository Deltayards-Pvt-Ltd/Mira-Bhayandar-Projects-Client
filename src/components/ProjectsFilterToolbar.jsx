import { useId, useState } from "react";
import { CONFIG_OPTIONS, LOCALITY_OPTIONS } from "../utils/projectsFilters";

function SearchIcon({ className }) {
  return (
    <svg
      className={className}
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

function SlidersIcon({ className }) {
  return (
    <svg
      className={className}
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <line x1="4" x2="4" y1="21" y2="14" />
      <line x1="4" x2="4" y1="10" y2="3" />
      <line x1="12" x2="12" y1="21" y2="12" />
      <line x1="12" x2="12" y1="8" y2="3" />
      <line x1="20" x2="20" y1="21" y2="16" />
      <line x1="20" x2="20" y1="12" y2="3" />
      <line x1="2" x2="6" y1="14" y2="14" />
      <line x1="10" x2="14" y1="8" y2="8" />
      <line x1="18" x2="22" y1="16" y2="16" />
    </svg>
  );
}

function FilterPill({ label, selected, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`min-h-[36px] rounded-full border px-4 py-2 text-xs font-medium tracking-tight transition-colors ${
        selected
          ? "border-gold/80 bg-gold/20 text-navy ring-1 ring-gold/40"
          : "border-navy/15 bg-white text-navy hover:border-gold/45 hover:bg-gold/5"
      }`}
    >
      {label}
    </button>
  );
}

/**
 * @param {{
 *   searchInput: string;
 *   onSearchInputChange: (v: string) => void;
 *   onSearchSubmit: () => void;
 *   localitySelection: string[];
 *   onToggleLocality: (id: string) => void;
 *   onClearLocality: () => void;
 *   configSelection: string[];
 *   onToggleConfig: (id: string) => void;
 *   onClearConfig: () => void;
 * }} props
 */
export default function ProjectsFilterToolbar({
  searchInput,
  onSearchInputChange,
  onSearchSubmit,
  localitySelection,
  onToggleLocality,
  onClearLocality,
  configSelection,
  onToggleConfig,
  onClearConfig,
}) {
  const [filtersOpen, setFiltersOpen] = useState(false);
  const searchFieldId = useId();
  const panelId = useId();

  const localityAll = localitySelection.length === 0;
  const configAll = configSelection.length === 0;

  return (
    <div className="w-full">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-stretch sm:gap-3">
        <div className="flex min-w-0 flex-1 flex-col gap-2 sm:flex-row sm:items-center sm:gap-2">
          <label htmlFor={searchFieldId} className="sr-only">
            Search projects by name
          </label>
          <div className="flex min-h-[48px] min-w-0 flex-1 items-center gap-2.5 rounded-full border-2 border-navy/[0.08] bg-white px-4 shadow-sm">
            <SearchIcon className="shrink-0 text-navy/35" aria-hidden />
            <input
              id={searchFieldId}
              type="search"
              value={searchInput}
              onChange={(e) => onSearchInputChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") onSearchSubmit();
              }}
              placeholder="Search projects…"
              autoComplete="off"
              className="min-w-0 flex-1 bg-transparent py-2.5 text-sm text-navy outline-none placeholder:text-navy/35"
            />
          </div>
          <button
            type="button"
            onClick={onSearchSubmit}
            className="inline-flex h-12 shrink-0 items-center justify-center rounded-full border-2 border-navy bg-navy px-6 text-[11px] font-semibold uppercase tracking-[0.14em] text-cream transition-colors hover:bg-navy-light sm:h-auto sm:min-h-[48px]"
          >
            Search
          </button>
        </div>

        <button
          type="button"
          onClick={() => setFiltersOpen((o) => !o)}
          aria-expanded={filtersOpen}
          aria-controls={panelId}
          className="inline-flex h-12 shrink-0 items-center justify-center gap-2 self-stretch rounded-full border-2 border-navy/[0.12] bg-white px-5 text-[11px] font-semibold uppercase tracking-[0.14em] text-navy transition-colors hover:border-navy/30 sm:h-auto sm:min-h-[48px] sm:self-auto"
        >
          <SlidersIcon className="text-navy/55" />
          Filters
        </button>
      </div>

      <div
        id={panelId}
        role="region"
        aria-label="Project filters"
        className={`overflow-hidden transition-[max-height,opacity,margin] duration-300 ease-out ${
          filtersOpen ? "mt-4 max-h-[560px] opacity-100" : "mt-0 max-h-0 opacity-0"
        }`}
      >
        <div className="rounded-2xl border-2 border-navy/[0.08] bg-white p-5 shadow-sm sm:p-6">
          <div className="grid gap-8 md:grid-cols-2 md:gap-10">
              <div>
                <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-gold-ink">
                  Locality
                </p>
                <div className="flex flex-wrap gap-2">
                  <FilterPill
                    label="All"
                    selected={localityAll}
                    onClick={onClearLocality}
                  />
                  {LOCALITY_OPTIONS.map((opt) => (
                    <FilterPill
                      key={opt.id}
                      label={opt.label}
                      selected={localitySelection.includes(opt.id)}
                      onClick={() => onToggleLocality(opt.id)}
                    />
                  ))}
                </div>
              </div>
              <div>
                <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-gold-ink">
                  Configuration
                </p>
                <div className="flex flex-wrap gap-2">
                  <FilterPill label="All" selected={configAll} onClick={onClearConfig} />
                  {CONFIG_OPTIONS.map((opt) => (
                    <FilterPill
                      key={opt.id}
                      label={opt.label}
                      selected={configSelection.includes(opt.id)}
                      onClick={() => onToggleConfig(opt.id)}
                    />
                  ))}
                </div>
              </div>
          </div>
        </div>
      </div>
    </div>
  );
}
