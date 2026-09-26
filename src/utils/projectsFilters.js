/** Split comma-separated URL values (decodeURIComponent applied by URLSearchParams). */
function splitParam(value) {
  if (!value) return [];
  return value
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

/**
 * @param {Record<string, unknown>[]} projects
 * @param {string} nameQuery
 * @param {string[]} areas
 * @param {string[]} configurations
 * @param {string[]} propertyTypes
 */
export function filterProjects(
  projects,
  nameQuery,
  areas = [],
  configurations = [],
  propertyTypes = [],
) {
  const q = String(nameQuery || "")
    .trim()
    .toLowerCase();

  return (projects || []).filter((p) => {
    if (q && !String(p.name || "").toLowerCase().includes(q)) return false;

    if (areas.length) {
      const loc = String(p.location || "").trim();
      if (!areas.includes(loc)) return false;
    }

    if (propertyTypes.length) {
      const type = String(p.propertyType || "").trim();
      if (!propertyTypes.includes(type)) return false;
    }

    if (configurations.length) {
      const plans = (p.plans || []).map((t) => String(t || "").trim());
      if (!configurations.some((c) => plans.includes(c))) return false;
    }

    return true;
  });
}

/**
 * @param {{ q?: string; areas?: string[]; configurations?: string[]; propertyTypes?: string[] }} filters
 */
const TRACKING_PARAM =
  /^(utm_|gclid$|fbclid$|gbraid$|wbraid$|msclkid$|gad_source$|gad_campaignid$|ttclid$|li_fat_id$|twclid$|mc_eid$)/i;

export function buildProjectsSearchParams({
  q = "",
  areas = [],
  configurations = [],
  propertyTypes = [],
}) {
  const params = new URLSearchParams();
  const trimmed = String(q || "").trim();
  if (trimmed) params.set("q", trimmed);
  if (areas.length) params.set("area", areas.join(","));
  if (configurations.length) params.set("config", configurations.join(","));
  if (propertyTypes.length) params.set("propertyType", propertyTypes.join(","));
  return params;
}

/** Keep ads/analytics params when filter state rewrites the query string. */
export function withPreservedTracking(currentParams, nextParams) {
  const next = new URLSearchParams(nextParams);
  const current =
    currentParams instanceof URLSearchParams
      ? currentParams
      : new URLSearchParams(currentParams || "");
  for (const [key, value] of current.entries()) {
    if (TRACKING_PARAM.test(key) && !next.has(key)) next.append(key, value);
  }
  return next;
}

export function parsePageParam(searchParams) {
  const n = Number(searchParams?.get?.("page"));
  if (!Number.isInteger(n) || n < 1) return 1;
  return n;
}

export function hrefWithPage(pathname, searchParams, page) {
  const next = new URLSearchParams(searchParams);
  if (page <= 1) next.delete("page");
  else next.set("page", String(page));
  const qs = next.toString();
  return qs ? `${pathname}?${qs}` : pathname;
}

/**
 * @param {{ q?: string; areas?: string[]; configurations?: string[]; propertyTypes?: string[] }} filters
 */
export function buildProjectsPath(filters) {
  const params = buildProjectsSearchParams(filters);
  const qs = params.toString();
  return qs ? `/projects?${qs}` : "/projects";
}

/**
 * @param {URLSearchParams} searchParams
 */
export function parseProjectsSearchParams(searchParams) {
  const q = (searchParams.get("q") || "").trim();
  const areas = splitParam(searchParams.get("area"));
  const configurations = splitParam(searchParams.get("config"));
  const propertyTypes = splitParam(searchParams.get("propertyType"));
  return { q, areas, configurations, propertyTypes };
}
