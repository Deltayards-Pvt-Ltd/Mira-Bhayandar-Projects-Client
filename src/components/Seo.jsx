import { Helmet } from "react-helmet-async";

const SITE_NAME = "Mira Bhayandar Property";
const DEFAULT_SITE_URL = "https://www.mirabhayandarproperty.com";

function getSiteUrl() {
  const raw = import.meta.env.VITE_SITE_URL || DEFAULT_SITE_URL;
  return String(raw).replace(/\/+$/, "");
}

function toAbsoluteUrl(path, siteUrl = getSiteUrl()) {
  if (!path) return siteUrl;
  if (/^https?:\/\//i.test(path)) return path;
  return `${siteUrl}${path.startsWith("/") ? path : `/${path}`}`;
}

function formatTitle(title) {
  const t = String(title ?? "").trim();
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
  const pageUrl = canonical
    ? toAbsoluteUrl(canonical, siteUrl)
    : typeof window !== "undefined"
      ? window.location.href
      : siteUrl;
  const imageUrl = toAbsoluteUrl(ogImage, siteUrl);

  const jsonLdBlocks = jsonLd == null ? [] : Array.isArray(jsonLd) ? jsonLd : [jsonLd];

  return (
    <Helmet>
      <title>{pageTitle}</title>
      {description ? <meta name="description" content={description} /> : null}
      <link rel="canonical" href={pageUrl} />

      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={pageTitle} />
      {description ? <meta property="og:description" content={description} /> : null}
      <meta property="og:url" content={pageUrl} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:image:alt" content={pageTitle} />
      <meta property="og:locale" content="en_IN" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={pageTitle} />
      {description ? <meta name="twitter:description" content={description} /> : null}
      <meta name="twitter:image" content={imageUrl} />

      {noindex ? <meta name="robots" content="noindex, nofollow" /> : null}

      {jsonLdBlocks.map((block, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(block)}
        </script>
      ))}
    </Helmet>
  );
}
