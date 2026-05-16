export function excerptFromContent(html, max = 130) {
  const plain = String(html ?? "")
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (plain.length <= max) return plain;
  return `${plain.slice(0, max).trim()}…`;
}

export function formatBlogDate(blog) {
  const raw = blog?.date ?? blog?.createdAt;
  if (!raw) return "";
  try {
    return new Date(raw).toLocaleDateString("en-IN", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return "";
  }
}

function CalendarIcon({ className }) {
  return (
    <svg
      className={className}
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  );
}

/**
 * @param {{ blog: Record<string, unknown>; assetUrl: (path: string) => string }} props
 */
export default function BlogCard({ blog, assetUrl }) {
  const imgSrc = blog?.image ? assetUrl(String(blog.image)) : "";
  const badge = String(blog?.tagline ?? "").trim() || "Update";
  const dateStr = formatBlogDate(blog);

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-navy/[0.06] bg-white shadow-[0_8px_32px_-14px_rgba(10,22,40,0.12)] transition-shadow duration-300 hover:shadow-[0_16px_40px_-12px_rgba(10,22,40,0.16)]">
      <div className="relative aspect-[16/10] w-full shrink-0 overflow-hidden bg-navy/5">
        {imgSrc ? (
          <img
            src={imgSrc}
            alt={blog?.title ? String(blog.title) : "Blog cover"}
            className="h-full w-full object-cover transition-transform duration-500 motion-safe:group-hover:scale-[1.03]"
            loading="lazy"
            decoding="async"
          />
        ) : (
          <div
            className="flex h-full w-full items-center justify-center bg-gradient-to-br from-navy/[0.08] to-gold/10"
            aria-hidden
          />
        )}
        <span className="absolute left-3 top-3 rounded-md bg-gold px-2.5 py-1 font-sans text-[10px] font-bold uppercase tracking-wide text-navy md:text-xs">
          {badge}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5 md:p-6">
        {dateStr ? (
          <div className="mb-3 flex items-center gap-1.5 font-sans text-xs text-navy/50 md:text-sm">
            <CalendarIcon className="shrink-0 text-navy/45" />
            <time dateTime={String(blog?.date ?? blog?.createdAt ?? "")}>{dateStr}</time>
          </div>
        ) : null}

        <h3
          className="mb-2 text-xl font-bold leading-snug text-navy transition-colors duration-300 group-hover:text-gold md:text-2xl"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          {blog?.title ?? ""}
        </h3>

        <p className="mb-3 line-clamp-3 flex-1 font-sans text-sm leading-relaxed text-navy/60 md:text-[15px]">
          {excerptFromContent(blog?.content)}
        </p>

        {blog?.writer ? (
          <p className="mt-auto font-sans text-xs font-medium text-navy/45 md:text-sm">
            By {blog.writer}
          </p>
        ) : null}
      </div>
    </article>
  );
}