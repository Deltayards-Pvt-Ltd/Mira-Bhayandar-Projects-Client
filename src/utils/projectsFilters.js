/** @typedef {{ id: string; label: string }} FilterOption */

/** @type {FilterOption[]} */
export const LOCALITY_OPTIONS = [
  { id: "bhayandar-east", label: "Bhayandar East" },
  { id: "bhayandar-west", label: "Bhayandar West" },
  { id: "mira-road", label: "Mira Road" },
];

/** @type {FilterOption[]} */
export const CONFIG_OPTIONS = [
  { id: "1-bhk", label: "1 BHK" },
  { id: "2-bhk", label: "2 BHK" },
  { id: "3-bhk", label: "3 BHK" },
  { id: "4-bhk", label: "4 BHK" },
  { id: "jodi", label: "Jodi" },
];

function norm(s) {
  return String(s || "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * @param {Record<string, unknown>} project
 * @param {string} localityId
 */
function localityMatch(project, localityId) {
  const loc = norm(project.location);
  switch (localityId) {
    case "bhayandar-east":
      return loc.includes("bhayandar east");
    case "bhayandar-west":
      return loc.includes("bhayandar west");
    case "mira-road":
      return (
        loc.includes("mira road") ||
        loc.includes("mira-road") ||
        loc.includes("miraroad")
      );
    default:
      return false;
  }
}

/**
 * Integers n for which this layout title reads as including "n BHK" (handles "1 & 2 & 3 BHK").
 * @param {string} title
 * @returns {Set<number>}
 */
function bhkCountsInTitle(title) {
  const s = norm(title);
  const out = new Set();
  const re = /(\d+)\s*bhk/g;
  let m;
  while ((m = re.exec(s)) !== null) {
    out.add(Number(m[1]));
  }
  if (out.size === 0 && s.includes("bhk")) {
    const head = s.split("bhk")[0];
    for (const part of head.split(/[&+/|]/)) {
      const d = part.match(/(\d+)/);
      if (d) out.add(Number(d[1]));
    }
  }
  return out;
}

/**
 * @param {string} title
 * @param {string} configId
 */
function configTitleMatch(title, configId) {
  const s = norm(title);
  if (configId === "jodi") return s.includes("jodi");
  const n = { "1-bhk": 1, "2-bhk": 2, "3-bhk": 3, "4-bhk": 4 }[configId];
  if (!Number.isFinite(n)) return false;
  return bhkCountsInTitle(title).has(n);
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
    const ok = cfgIds.some((cid) => titles.some((title) => configTitleMatch(String(title), cid)));
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
