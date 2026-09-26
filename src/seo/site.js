/** Preferred production origin. Verified: apex and HTTP redirect here. */
export const DEFAULT_SITE_URL = "https://www.mirabhayandarproperty.com";

export const SITE_NAME = "Mira Bhayandar Property";

export function getSiteUrl() {
  const raw = import.meta.env?.VITE_SITE_URL || DEFAULT_SITE_URL;
  return String(raw).replace(/\/+$/, "");
}

export function cleanText(value) {
  const t = String(value ?? "")
    .replace(/\s+/g, " ")
    .trim();
  if (!t || t === "undefined" || t === "null" || t === "[object Object]") return "";
  return t;
}

/** Self-referencing canonical: absolute HTTPS, no query, no hash, no trailing slash except `/`. */
export function toCanonicalUrl(path, siteUrl = getSiteUrl()) {
  const base = String(siteUrl || DEFAULT_SITE_URL).replace(/\/+$/, "");
  let pathname = "/";
  const raw = cleanText(path);
  if (raw) {
    if (/^https?:\/\//i.test(raw)) {
      try {
        pathname = new URL(raw).pathname || "/";
      } catch {
        pathname = "/";
      }
    } else {
      pathname = raw.split("?")[0].split("#")[0] || "/";
    }
  }
  if (!pathname.startsWith("/")) pathname = `/${pathname}`;
  pathname = pathname.replace(/\/{2,}/g, "/");
  if (pathname !== "/") pathname = pathname.replace(/\/+$/, "");
  return pathname === "/" ? `${base}/` : `${base}${pathname}`;
}

export function toAbsoluteUrl(path, siteUrl = getSiteUrl()) {
  const raw = cleanText(path);
  if (!raw) return "";
  if (/^https?:\/\//i.test(raw)) return raw;
  const base = String(siteUrl || DEFAULT_SITE_URL).replace(/\/+$/, "");
  return `${base}${raw.startsWith("/") ? raw : `/${raw}`}`;
}

export function metaDescription(text, fallback = "", max = 160) {
  const source = cleanText(text) || cleanText(fallback);
  if (!source) return "";
  if (source.length <= max) return source;
  const cut = source.slice(0, max - 1);
  const lastSpace = cut.lastIndexOf(" ");
  const trimmed = (lastSpace > 80 ? cut.slice(0, lastSpace) : cut).trim();
  return `${trimmed}…`;
}

export function toDateOnly(value) {
  if (value == null || value === "") return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return d.toISOString().slice(0, 10);
}

function sanitizeJsonLd(value) {
  if (value == null) return undefined;
  if (typeof value === "string") {
    const t = cleanText(value);
    return t || undefined;
  }
  if (typeof value === "number") return Number.isFinite(value) ? value : undefined;
  if (typeof value === "boolean") return value;
  if (Array.isArray(value)) {
    const arr = value.map(sanitizeJsonLd).filter((v) => v !== undefined);
    return arr.length ? arr : undefined;
  }
  if (typeof value === "object") {
    const out = {};
    for (const [key, child] of Object.entries(value)) {
      const next = sanitizeJsonLd(child);
      if (next !== undefined) out[key] = next;
    }
    return Object.keys(out).length ? out : undefined;
  }
  return undefined;
}

export function serializeJsonLd(data) {
  const clean = sanitizeJsonLd(data);
  if (!clean) return "";
  return JSON.stringify(clean).replace(/</g, "\\u003c");
}
