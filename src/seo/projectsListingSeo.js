const SITE_URL = "https://www.mirabhayandarproperty.com";

export const PROJECTS_LISTING_SEO = {
  title: "All Projects in Mira Bhayandar",
  description:
    "Browse RERA-verified residential and commercial projects in Mira Bhayandar — luxury flats, premium townships, and budget-friendly homes with floor plans and direct developer partnerships.",
};

export const PROJECTS_LISTING_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "@id": `${SITE_URL}/projects#webpage`,
  url: `${SITE_URL}/projects`,
  name: PROJECTS_LISTING_SEO.title,
  description: PROJECTS_LISTING_SEO.description,
  isPartOf: { "@id": `${SITE_URL}/#website` },
  about: { "@id": `${SITE_URL}/#organization` },
};
