import { buildBreadcrumbList } from "./structuredData.js";
import { cleanText, getSiteUrl, metaDescription, toAbsoluteUrl, toDateOnly } from "./site.js";

export const BLOGS_LISTING_SEO = {
  title: "All Blogs",
  description:
    "Articles on Mira-Bhayandar real estate: market insights, infrastructure news, and regulatory updates for home buyers.",
  canonical: "/blogs",
};

export function buildBlogsListingJsonLd() {
  const siteUrl = getSiteUrl();
  const breadcrumb = buildBreadcrumbList(
    [
      { name: "Home", path: "/" },
      { name: "All Blogs", path: "/blogs" },
    ],
    "/blogs",
  );

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${siteUrl}/blogs#webpage`,
        url: `${siteUrl}/blogs`,
        name: "All Blogs",
        description: BLOGS_LISTING_SEO.description,
        isPartOf: { "@id": `${siteUrl}/#website` },
      },
      ...(breadcrumb ? [breadcrumb] : []),
    ],
  };
}

function plainExcerpt(html, max = 160) {
  return cleanText(
    String(html ?? "")
      .replace(/<[^>]*>/g, " ")
      .replace(/&nbsp;/gi, " ")
      .replace(/&amp;/gi, "&")
      .replace(/&quot;/gi, '"')
      .replace(/&#39;|&apos;/gi, "'"),
  ).slice(0, max);
}

export function buildBlogSeo(blog, assetUrl = (p) => p ?? "") {
  const id = cleanText(blog?._id);
  const title = cleanText(blog?.title) || "Article";
  const description = metaDescription(
    plainExcerpt(blog?.content, 320),
    `Read ${title} on Mira Bhayandar Property.`,
  );
  const imagePath = cleanText(blog?.image);
  const ogImage = imagePath ? toAbsoluteUrl(assetUrl(imagePath)) || "/logo.png" : "/logo.png";

  return {
    title,
    description,
    canonical: id ? `/blogs/${id}` : "/blogs",
    ogImage,
    ogType: "article",
  };
}

export function buildBlogPostJsonLd(blog, assetUrl = (p) => p ?? "") {
  const id = cleanText(blog?._id);
  if (!id) return null;

  const siteUrl = getSiteUrl();
  const url = `${siteUrl}/blogs/${id}`;
  const title = cleanText(blog?.title) || "Article";
  const description = metaDescription(plainExcerpt(blog?.content, 320), "");
  const published = toDateOnly(blog?.date || blog?.createdAt);
  const modified = toDateOnly(blog?.updatedAt);
  const writer = cleanText(blog?.writer);
  const imagePath = cleanText(blog?.image);
  const image = imagePath ? toAbsoluteUrl(assetUrl(imagePath), siteUrl) : "";

  const article = {
    "@type": "BlogPosting",
    "@id": `${url}#article`,
    headline: title,
    mainEntityOfPage: url,
    url,
    publisher: { "@id": `${siteUrl}/#organization` },
  };
  if (description) article.description = description;
  if (published) article.datePublished = published;
  if (modified) article.dateModified = modified;
  if (writer) article.author = { "@type": "Person", name: writer };
  if (image) article.image = image;

  const breadcrumb = buildBreadcrumbList(
    [
      { name: "Home", path: "/" },
      { name: "All Blogs", path: "/blogs" },
      { name: title, path: `/blogs/${id}` },
    ],
    `/blogs/${id}`,
  );

  return {
    "@context": "https://schema.org",
    "@graph": [article, ...(breadcrumb ? [breadcrumb] : [])],
  };
}
