import { useContext, useEffect, useMemo, useState } from "react";
import { AppContext } from "../context/AppContext";
import BlogCard from "../components/BlogCard";
import DreamHomeCta from "../components/DreamHomeCta";
import ProjectsPagination, { DEFAULT_PROJECTS_LIMIT } from "../components/ProjectsPagination";

export default function Blogs() {
  const ctx = useContext(AppContext);
  const blogs = useMemo(() => ctx?.blogs ?? [], [ctx?.blogs]);
  const loading = ctx?.blogsLoading ?? false;
  const assetUrl = ctx?.assetUrl ?? ((p) => p ?? "");
  const backendUrl = ctx?.backendUrl ?? "";
  const refetchBlogs = ctx?.refetchBlogs;

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(DEFAULT_PROJECTS_LIMIT);

  useEffect(() => {
    if (!backendUrl || !refetchBlogs) return;
    refetchBlogs();
  }, [backendUrl, refetchBlogs]);

  const total = blogs.length;
  const totalPages = Math.max(1, Math.ceil(total / limit));

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const paginatedBlogs = useMemo(() => {
    const start = (page - 1) * limit;
    return blogs.slice(start, start + limit);
  }, [blogs, page, limit]);

  const handleLimitChange = (nextLimit) => {
    setLimit(nextLimit);
    setPage(1);
  };

  const subline = useMemo(() => {
    if (total === 0) return "Market insights and updates for Mira-Bhayandar";
    if (total === 1) return "1 article on Mira-Bhayandar real estate";
    return `${total} articles on Mira-Bhayandar real estate`;
  }, [total]);

  return (
    <div className="min-h-full bg-[#fdfbf7] text-navy">
      <section
        className="bg-navy-gradient noise-overlay relative border-b border-white/10"
        aria-labelledby="blogs-page-heading"
      >
        <div className="relative z-[2] mx-auto max-w-7xl px-4 pb-12 pt-[calc(5.5rem+env(safe-area-inset-top,0px))] text-center sm:px-6 sm:pb-14 sm:pt-28 md:pt-32 md:pb-16 lg:px-8">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-gold-light">
            Stay informed
          </p>
          <h1
            id="blogs-page-heading"
            className="mb-4 text-4xl font-normal tracking-tight text-gradient-gold md:text-5xl lg:text-6xl"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            All Blogs
          </h1>
          <p className="mx-auto max-w-xl text-sm leading-relaxed text-white/55 md:text-base">
            {subline}
          </p>
        </div>
      </section>

      <section
        className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8 lg:py-14"
        aria-label="Blog listings"
      >
        {loading ? (
          <p className="text-center text-sm text-navy/50">Loading blogs…</p>
        ) : total === 0 ? (
          <p className="text-center text-sm text-navy/50">
            No blogs yet. Add blogs in the admin panel.
          </p>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-6 lg:grid-cols-3 lg:gap-8">
              {paginatedBlogs.map((blog, index) => (
                <BlogCard
                  key={blog._id ?? blog.id ?? index}
                  blog={blog}
                  assetUrl={assetUrl}
                />
              ))}
            </div>
            <ProjectsPagination
              page={page}
              limit={limit}
              total={total}
              onPageChange={setPage}
              onLimitChange={handleLimitChange}
            />
          </>
        )}
      </section>

      {!loading && total > 0 ? <DreamHomeCta /> : null}
    </div>
  );
}
