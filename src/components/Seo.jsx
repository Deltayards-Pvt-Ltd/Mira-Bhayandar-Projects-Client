import { Helmet } from "react-helmet-async";
import {
  SITE_NAME,
  cleanText,
  getSiteUrl,
  serializeJsonLd,
  toAbsoluteUrl,
  toCanonicalUrl,
} from "../seo/site";

function formatTitle(title) {
  const t = cleanText(title);
  if (!t) return SITE_NAME;
  if (t.toLowerCase().includes("mira bhayandar")) return t;
  return `${t} | ${SITE_NAME}`;
}

/**
 * @param {{
 *   title?: string;
 *   description?: string;
 *   canonical?: string;
 *   ogImage?: string;
 *   ogType?: string;
 *   noindex?: boolean;
 *   jsonLd?: object | object[] | null;
 * }} props
 */
export default function Seo({
  title,
  description,
  canonical,
  ogImage = "/logo.png",
  ogType = "website",
  noindex = false,
  jsonLd = null,
}) {
  const siteUrl = getSiteUrl();
  const pageTitle = formatTitle(title);
  const pageDescription = cleanText(description);
  const path =
    cleanText(canonical) ||
    (typeof window !== "undefined" ? window.location.pathname : "/");
  const pageUrl = toCanonicalUrl(path, siteUrl);
  const imageUrl = toAbsoluteUrl(ogImage, siteUrl) || toAbsoluteUrl("/logo.png", siteUrl);

  const jsonLdBlocks = (jsonLd == null ? [] : Array.isArray(jsonLd) ? jsonLd : [jsonLd])
    .map((block) => serializeJsonLd(block))
    .filter(Boolean);

  return (
    <Helmet>
      <title>{pageTitle}</title>
      {pageDescription ? <meta name="description" content={pageDescription} /> : null}
      <link rel="canonical" href={pageUrl} />

      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={pageTitle} />
      {pageDescription ? <meta property="og:description" content={pageDescription} /> : null}
      <meta property="og:url" content={pageUrl} />
      {imageUrl ? <meta property="og:image" content={imageUrl} /> : null}
      {imageUrl ? <meta property="og:image:alt" content={pageTitle} /> : null}
      <meta property="og:locale" content="en_IN" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={pageTitle} />
      {pageDescription ? <meta name="twitter:description" content={pageDescription} /> : null}
      <meta name="twitter:url" content={pageUrl} />
      {imageUrl ? <meta name="twitter:image" content={imageUrl} /> : null}

      {noindex ? <meta name="robots" content="noindex, follow" /> : null}

      {jsonLdBlocks.map((json, index) => (
        <script key={index} type="application/ld+json">
          {json}
        </script>
      ))}
    </Helmet>
  );
}
