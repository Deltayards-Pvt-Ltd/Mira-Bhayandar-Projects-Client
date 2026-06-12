import { formatPlans } from "../utils/projectPlans";
import { PROJECT_JSON_LD_OVERRIDES } from "./projectJsonLdOverrides";

const DEFAULT_SITE_URL = "https://www.mirabhayandarproperty.com";

function getSiteUrl() {
  const raw = import.meta.env.VITE_SITE_URL || DEFAULT_SITE_URL;
  return String(raw).replace(/\/+$/, "");
}

function parseReraIds(reraNo) {
  const raw = String(reraNo ?? "").trim();
  if (!raw) return [];
  return raw
    .split(/[,;/|]+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function projectSlug(project) {
  const slug = String(project?.slug ?? "").trim();
  if (slug) return slug;
  const id = project?._id ?? project?.id;
  return id ? String(id) : "";
}

/** Label for listing title — matches propertyType from admin */
function unitLabel(propertyType) {
  const t = String(propertyType ?? "").trim().toLowerCase();
  if (t === "commercial") return "Commercial spaces";
  if (t === "residential & commercial") return "Residential & Commercial";
  return "Apartments";
}

/**
 * Listing title from backend fields: name, builder, plans, location, propertyType
 * e.g. "Anjani Bliss by Bhutra Group - 1 BHK & 2 BHK Apartments on Kanakia Road"
 */
export function buildProjectListingName(project) {
  const name = String(project?.name ?? "").trim();
  const builder = String(project?.builder ?? "").trim();
  const location = String(project?.location ?? "").trim();
  const plans = formatPlans(project?.plans, " & ");
  const units = unitLabel(project?.propertyType);

  const headline = name && builder ? `${name} by ${builder}` : name || builder;
  if (!headline) return "Property in Mira Bhayandar";

  if (plans && location) return `${headline} - ${plans} ${units} in ${location}`;
  if (location) return `${headline} - ${units} in ${location}`;
  if (plans) return `${headline} - ${plans}`;
  return headline;
}

function mainEntityType(propertyType) {
  const t = String(propertyType ?? "").trim().toLowerCase();
  return t === "commercial" ? "Place" : "ApartmentComplex";
}

/**
 * Project JSON-LD — only fields available on Project model (API GET /api/project/:slug).
 *
 * Used: slug, name, builder, location, plans, propertyType, description,
 *       reraNo, latitude, longitude, features, createdAt, updatedAt, coverImage
 *
 * Not in model (omitted): postalCode, separate address line, per-project agent block
 * (organization schema lives on homepage only).
 */
export function buildProjectJsonLd(project, assetUrl = (p) => p ?? "") {
  const slug = projectSlug(project);
  if (!slug) return null;

  const override = PROJECT_JSON_LD_OVERRIDES[slug];
  if (override) return override;

  const siteUrl = getSiteUrl();
  const projectUrl = `${siteUrl}/projects/${slug}`;
  const location = String(project.location ?? "").trim();
  const description = String(project.description ?? "").trim();

  const mainEntity = {
    "@type": mainEntityType(project.propertyType),
    "@id": `${projectUrl}#project`,
    name: String(project.name ?? "").trim() || undefined,
  };

  if (description) mainEntity.description = description;

  const reraIds = parseReraIds(project.reraNo);
  if (reraIds.length === 1) mainEntity.identifier = reraIds[0];
  else if (reraIds.length > 1) mainEntity.identifier = reraIds;

  if (location) {
    mainEntity.address = {
      "@type": "PostalAddress",
      streetAddress: location,
      addressLocality: "Mira Bhayandar",
      addressRegion: "Maharashtra",
      addressCountry: "IN",
    };
  }

  if (project.latitude != null && project.longitude != null) {
    mainEntity.geo = {
      "@type": "GeoCoordinates",
      latitude: String(project.latitude),
      longitude: String(project.longitude),
    };
  }

  const amenities = (project.features ?? [])
    .map((f) => String(f ?? "").trim())
    .filter(Boolean)
    .map((name) => ({
      "@type": "LocationFeatureSpecification",
      name,
      value: true,
    }));
  if (amenities.length) mainEntity.amenityFeature = amenities;

  const listing = {
    "@type": "RealEstateListing",
    "@id": projectUrl,
    url: projectUrl,
    name: buildProjectListingName(project),
    mainEntity,
  };

  const posted = project.createdAt || project.updatedAt;
  if (posted) listing.datePosted = new Date(posted).toISOString().slice(0, 10);

  if (project.coverImage) {
    const img = assetUrl(String(project.coverImage));
    if (img) listing.image = img.startsWith("http") ? img : `${siteUrl}${img.startsWith("/") ? "" : "/"}${img}`;
  }

  return {
    "@context": "https://schema.org",
    "@graph": [listing],
  };
}

export function buildProjectSeo(project, assetUrl = (p) => p ?? "") {
  const slug = projectSlug(project);
  const title = buildProjectListingName(project);
  const description =
    String(project?.description ?? "").trim().slice(0, 160) ||
    `Explore ${project?.name ?? "this project"} in Mira Bhayandar. RERA-verified listings with floor plans and amenities.`;

  return {
    title,
    description,
    canonical: `/projects/${slug}`,
    ogImage: project?.coverImage ? assetUrl(String(project.coverImage)) : "/logo.png",
  };
}
