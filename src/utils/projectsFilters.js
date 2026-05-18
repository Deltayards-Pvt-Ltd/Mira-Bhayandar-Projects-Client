/** @typedef {{ id: string; label: string }} FilterOption */

function norm(s) {
  return String(s || "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * @param {string} label
 */
export function slugFromLabel(label) {
  return norm(label)
    .replace(/[^a-z0-9.]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

/**
 * @param {FilterOption[]} options
 */
export function idToLabelMap(options) {
  return Object.fromEntries((options || []).map((o) => [o.id, o.label]));
}

/**
 * @param {string} title
 * @returns {Set<number>}
 */
function bhkCountsInTitle(title) {
  const s = norm(title);
  const out = new Set();
  const add = (n) => {
    if (Number.isFinite(n) && n > 0) out.add(n);
  };

  if (s.includes("bhk")) {
    const head = s.split("bhk")[0];
    for (const part of head.split(/[&+/|]/)) {
      const d = part.match(/(\d+(?:\.\d+)?)/);
      if (d) add(Number(d[1]));
    }
  }

  const re = /(\d+(?:\.\d+)?)\s*bhk/gi;
  let m;
  while ((m = re.exec(s)) !== null) {
    add(Number(m[1]));
  }

  return out;
}

/**
 * @param {Record<string, unknown>} project
 * @param {string} localityId
 */
function localityMatch(project, localityId) {
  const loc = String(project?.location || "").trim();
  if (!loc) return false;
  return slugFromLabel(loc) === localityId;
}

/**
 * @param {string} title
 * @param {string} configId
 */
function configTitleMatch(title, configId) {
  const s = norm(title);
  if (configId === "jodi") return s.includes("jodi");
  const m = /^(\d+(?:\.\d+)?)-bhk$/i.exec(configId);
  if (!m) return false;
  return bhkCountsInTitle(title).has(Number(m[1]));
}

/**
 * @param {Record<string, unknown>} project
 * @param {string[]} localityIds
 * @param {string[]} configIds
 */
export function projectPassesFilters(project, localityIds, configIds) {
  const locIds = localityIds ?? [];
  const cfgIds = configIds ?? [];

  if (locIds.length > 0) {
    const ok = locIds.some((id) => localityMatch(project, id));
    if (!ok) return false;
  }

  if (cfgIds.length > 0) {
    const titles = (project.layouts || []).map((l) => l?.title || "");
    const ok = cfgIds.some((cid) =>
      titles.some((title) => configTitleMatch(String(title), cid)),
    );
    if (!ok) return false;
  }

  return true;
}

/**
 * @param {Record<string, unknown>[]} projects
 * @param {string} nameQuery trimmed, lowercased applied query (empty = no name filter)
 * @param {string[]} localityIds
 * @param {string[]} configIds
 */
export function filterProjects(projects, nameQuery, localityIds, configIds) {
  const q = norm(nameQuery);
  return (projects || []).filter((p) => {
    if (q) {
      const name = norm(p.name);
      if (!name.includes(q)) return false;
    }
    return projectPassesFilters(p, localityIds, configIds);
  });
}

/**
 * @param {Iterable<string>} labels
 * @param {FilterOption[]} options
 */
function idsFromLabels(labels, options) {
  const byLabel = Object.fromEntries((options || []).map((o) => [norm(o.label), o.id]));
  return [...labels].map((l) => byLabel[norm(l)]).filter(Boolean);
}

/** @param {Iterable<string>} labels @param {FilterOption[]} options */
export function localityIdsFromLabels(labels, options) {
  return idsFromLabels(labels, options);
}

/** @param {Iterable<string>} labels @param {FilterOption[]} options */
export function configIdsFromLabels(labels, options) {
  return idsFromLabels(labels, options);
}

/**
 * @param {{ q?: string; localityIds?: string[]; configIds?: string[] }} filters
 */
export function buildProjectsSearchParams({
  q = "",
  localityIds = [],
  configIds = [],
}) {
  const params = new URLSearchParams();
  const trimmed = String(q || "").trim();
  if (trimmed) params.set("q", trimmed);
  if (localityIds.length) params.set("locality", localityIds.join(","));
  if (configIds.length) params.set("config", configIds.join(","));
  return params;
}

/**
 * @param {{ q?: string; localityIds?: string[]; configIds?: string[] }} filters
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
  const localityIds = (searchParams.get("locality") || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const configIds = (searchParams.get("config") || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  return { q, localityIds, configIds };
}
