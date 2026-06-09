/** Public project detail path — prefers slug, falls back to Mongo id. */
export function projectDetailPath(project) {
  const slug = String(project?.slug ?? "").trim();
  if (slug) return `/projects/${slug}`;

  const id = project?._id ?? project?.id;
  return id != null ? `/projects/${String(id)}` : "/projects";
}
