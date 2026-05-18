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
export function bhkCountsInTitle(title) {
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

/** @param {number} n */
export function bhkConfigId(n) {
  return `${String(n)}-bhk`;
}

/** @param {string} configId */
export function bhkConfigLabel(configId) {
  const m = String(configId).match(/^(\d+(?:\.\d+)?)-bhk$/i);
  return m ? `${m[1]} BHK` : null;
}

/** @param {string} title */
export function configIdsFromLayoutTitle(title) {
  const ids = new Set();
  const s = norm(title);
  if (s.includes("jodi")) ids.add("jodi");
  for (const n of bhkCountsInTitle(title)) {
    ids.add(bhkConfigId(n));
  }
  return [...ids];
}

/** @param {string} configId */
export function configIdToLabel(configId) {
  if (configId === "jodi") return "Jodi";
  return bhkConfigLabel(configId) || configId;
}

/** @param {string} a @param {string} b */
function compareConfigIds(a, b) {
  if (a === "jodi" && b === "jodi") return 0;
  if (a === "jodi") return 1;
  if (b === "jodi") return -1;
  const na = Number(a.replace(/-bhk$/i, ""));
  const nb = Number(b.replace(/-bhk$/i, ""));
  if (Number.isFinite(na) && Number.isFinite(nb)) return na - nb;
  return a.localeCompare(b);
}

/**
 * @param {Array<{ location?: string; layouts?: Array<{ title?: string }> }>} projects
 * @returns {{ localities: FilterOption[]; configurations: FilterOption[] }}
 */
export function buildProjectFilterOptions(projects) {
  /** @type {Map<string, string>} */
  const localityMap = new Map();
  /** @type {Set<string>} */
  const configIds = new Set();

  for (const project of projects || []) {
    const loc = String(project?.location || "").trim();
    if (loc) {
      const id = slugFromLabel(loc);
      if (id && !localityMap.has(id)) localityMap.set(id, loc);
    }
    for (const layout of project?.layouts || []) {
      const title = layout?.title;
      if (!title) continue;
      for (const cid of configIdsFromLayoutTitle(title)) {
        configIds.add(cid);
      }
    }
  }

  const localities = [...localityMap.entries()]
    .map(([id, label]) => ({ id, label }))
    .sort((a, b) => a.label.localeCompare(b.label, undefined, { sensitivity: "base" }));

  const configurations = [...configIds]
    .sort(compareConfigIds)
    .map((id) => ({ id, label: configIdToLabel(id) }));

  return { localities, configurations };
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
