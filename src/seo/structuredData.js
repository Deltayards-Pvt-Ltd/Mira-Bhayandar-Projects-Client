import { cleanText, getSiteUrl, toCanonicalUrl } from "./site.js";

export function buildBreadcrumbList(crumbs, idPath) {
  const siteUrl = getSiteUrl();
  const items = (crumbs || [])
    .map((crumb) => ({
      name: cleanText(crumb?.name),
      item: crumb?.path ? toCanonicalUrl(crumb.path, siteUrl) : "",
    }))
    .filter((crumb) => crumb.name && crumb.item);

  if (!items.length) return null;

  const id = idPath ? `${toCanonicalUrl(idPath, siteUrl)}#breadcrumb` : undefined;

  return {
    "@type": "BreadcrumbList",
    ...(id ? { "@id": id } : {}),
    itemListElement: items.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: crumb.item,
    })),
  };
}

export function buildInfoPageJsonLd({ path, name, description, crumbs }) {
  const siteUrl = getSiteUrl();
  const url = toCanonicalUrl(path, siteUrl);
  const breadcrumb = buildBreadcrumbList(
    crumbs || [
      { name: "Home", path: "/" },
      { name, path },
    ],
    path,
  );

  const page = {
    "@type": "WebPage",
    "@id": `${url}#webpage`,
    url,
    name: cleanText(name),
    isPartOf: { "@id": `${siteUrl}/#website` },
  };
  const desc = cleanText(description);
  if (desc) page.description = desc;

  const graph = [page];
  if (breadcrumb) graph.push(breadcrumb);

  return {
    "@context": "https://schema.org",
    "@graph": graph,
  };
}
