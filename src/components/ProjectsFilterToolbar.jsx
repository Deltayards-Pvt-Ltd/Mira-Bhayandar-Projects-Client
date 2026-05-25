import { useContext, useEffect, useId, useMemo, useState } from "react";
import { AppContext } from "../context/AppContext";

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

function ActiveChip({ label, onRemove }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-gold/50 bg-gold/15 py-1 pl-3 pr-1 text-xs font-medium text-navy">
      {label}
      <button
        type="button"
        onClick={onRemove}
        className="rounded-full p-0.5 text-navy/55 transition-colors hover:bg-gold/25 hover:text-navy"
        aria-label={`Remove ${label} filter`}
      >
        <XIcon className="size-3.5" />
      </button>
    </span>
  );
}

function XIcon({ className }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
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
 *   areaSelection: string[];
 *   onToggleArea: (name: string) => void;
 *   onClearAreas: () => void;
 *   configSelection: string[];
 *   onToggleConfig: (name: string) => void;
 *   onClearConfig: () => void;
 *   propertyTypeSelection: string[];
 *   onTogglePropertyType: (name: string) => void;
 *   onClearPropertyType: () => void;
 *   onClearAll: () => void;
 * }} props
 */
export default function ProjectsFilterToolbar({
  searchInput,
  onSearchInputChange,
  onSearchSubmit,
  areaSelection,
  onToggleArea,
  onClearAreas,
  configSelection,
  onToggleConfig,
  onClearConfig,
  propertyTypeSelection,
  onTogglePropertyType,
  onClearPropertyType,
  onClearAll,
}) {
  const { filterOptions } = useContext(AppContext) ?? {};
  const areaOptions = filterOptions?.areas ?? [];
  const configOptions = filterOptions?.configurations ?? [];
  const propertyTypeOptions = filterOptions?.propertyTypes ?? [];

  const hasActiveFilters =
    areaSelection.length > 0 ||
    configSelection.length > 0 ||
    propertyTypeSelection.length > 0;
  const [filtersOpen, setFiltersOpen] = useState(hasActiveFilters);
  const searchFieldId = useId();
  const panelId = useId();

  useEffect(() => {
    if (hasActiveFilters) setFiltersOpen(true);
  }, [hasActiveFilters]);

  const activeChips = useMemo(() => {
    const chips = [];
    for (const name of areaSelection) {
      chips.push({ key: `area-${name}`, label: name, onRemove: () => onToggleArea(name) });
    }
    for (const name of configSelection) {
      chips.push({ key: `cfg-${name}`, label: name, onRemove: () => onToggleConfig(name) });
    }
    for (const name of propertyTypeSelection) {
      chips.push({ key: `type-${name}`, label: name, onRemove: () => onTogglePropertyType(name) });
    }
    return chips;
  }, [areaSelection, configSelection, propertyTypeSelection, onToggleArea, onToggleConfig, onTogglePropertyType]);

  const areasAll = areaSelection.length === 0;
  const configAll = configSelection.length === 0;
  const propertyTypeAll = propertyTypeSelection.length === 0;

  return (
    <div className="flex w-full flex-col gap-3">
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
            
            className="inline-flex h-12 shrink-0 cursor-pointer items-center justify-center rounded-full border-2 border-navy bg-navy px-6 text-[11px] font-semibold uppercase tracking-[0.14em] text-cream transition-colors hover:bg-navy-light sm:h-auto sm:min-h-[48px]"
          >
            Search
          </button>
        </div>

        <button
          type="button"
          onClick={() => setFiltersOpen((o) => !o)}
          aria-expanded={filtersOpen}
          aria-controls={panelId}
          className={`inline-flex h-12 shrink-0 items-center justify-center gap-2 self-stretch rounded-full border-2 px-5 text-[11px] font-semibold uppercase tracking-[0.14em] transition-colors sm:h-auto sm:min-h-[48px] sm:self-auto ${
            hasActiveFilters
              ? "border-gold/50 bg-gold/10 text-navy hover:border-gold/70"
              : "border-navy/[0.12] bg-white text-navy hover:border-navy/30"
          }`}
        >
          <SlidersIcon className="text-navy/55" />
          Filters
          {hasActiveFilters ? (
            <span className="flex size-5 items-center justify-center rounded-full bg-gold text-[10px] font-bold text-navy">
              {areaSelection.length + configSelection.length + propertyTypeSelection.length}
            </span>
          ) : null}
        </button>
      </div>

      {activeChips.length > 0 ? (
        <div className="flex flex-wrap items-center gap-2" aria-label="Active filters">
          <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-navy/45">
            Applied
          </span>
          {activeChips.map((chip) => (
            <ActiveChip key={chip.key} label={chip.label} onRemove={chip.onRemove} />
          ))}
          <button
            type="button"
            onClick={onClearAll}
            className="text-[11px] font-medium text-navy/45 underline-offset-2 hover:text-navy hover:underline"
          >
            Clear all
          </button>
        </div>
      ) : null}

      <div
        id={panelId}
        role="region"
        aria-label="Project filters"
        className={`overflow-hidden transition-[max-height,opacity,margin] duration-300 ease-out ${
          filtersOpen ? "mt-4 max-h-[560px] opacity-100" : "mt-0 max-h-0 opacity-0"
        }`}
      >
        <div className="rounded-2xl border-2 border-navy/[0.08] bg-white p-5 shadow-sm sm:p-6">
          <div className="grid gap-8 md:grid-cols-3 md:gap-10">
              <div>
                <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-gold-ink">
                  Area
                </p>
                <div className="flex flex-wrap gap-2">
                  <FilterPill label="All" selected={areasAll} onClick={onClearAreas} />
                  {areaOptions.map((name) => (
                    <FilterPill
                      key={name}
                      label={name}
                      selected={areaSelection.includes(name)}
                      onClick={() => onToggleArea(name)}
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
                  {configOptions.map((name) => (
                    <FilterPill
                      key={name}
                      label={name}
                      selected={configSelection.includes(name)}
                      onClick={() => onToggleConfig(name)}
                    />
                  ))}
                </div>
              </div>
              <div>
                <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-gold-ink">
                  Property type
                </p>
                <div className="flex flex-wrap gap-2">
                  <FilterPill label="All" selected={propertyTypeAll} onClick={onClearPropertyType} />
                  {propertyTypeOptions.map((name) => (
                    <FilterPill
                      key={name}
                      label={name}
                      selected={propertyTypeSelection.includes(name)}
                      onClick={() => onTogglePropertyType(name)}
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
