import { buildBreadcrumbList } from "./structuredData.js";
import { getSiteUrl } from "./site.js";

export const PROJECTS_LISTING_SEO = {
  title: "All Projects in Mira Bhayandar",
  description:
    "Browse RERA-verified residential and commercial projects in Mira Bhayandar — luxury flats, premium townships, and budget-friendly homes with floor plans and direct developer partnerships.",
};

export function buildProjectsListingJsonLd() {
  const siteUrl = getSiteUrl();
  const breadcrumb = buildBreadcrumbList(
    [
      { name: "Home", path: "/" },
      { name: "All Projects", path: "/projects" },
    ],
    "/projects",
  );

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${siteUrl}/projects#webpage`,
        url: `${siteUrl}/projects`,
        name: PROJECTS_LISTING_SEO.title,
        description: PROJECTS_LISTING_SEO.description,
        isPartOf: { "@id": `${siteUrl}/#website` },
        about: { "@id": `${siteUrl}/#organization` },
      },
      ...(breadcrumb ? [breadcrumb] : []),
    ],
  };
}
