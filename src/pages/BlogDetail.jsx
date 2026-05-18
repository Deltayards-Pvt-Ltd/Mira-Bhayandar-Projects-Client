import { useContext, useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { AppContext } from "../context/AppContext";
import BlogCard, { formatBlogDate } from "../components/BlogCard";
import DreamHomeCta from "../components/DreamHomeCta";

function looksLikeHtml(text) {
  return /<[a-z][\s\S]*>/i.test(String(text ?? ""));
}

function BlogContent({ content }) {
  const raw = String(content ?? "").trim();
  if (!raw) return null;

  const bodyClass =
    "blog-article-body font-sans text-base leading-[1.75] text-navy/80 md:text-[17px] [&_a]:text-gold-ink [&_a]:underline [&_h2]:mb-4 [&_h2]:mt-10 [&_h2]:text-2xl [&_h2]:font-normal [&_h2]:text-navy [&_h3]:mb-3 [&_h3]:mt-8 [&_h3]:text-xl [&_h3]:text-navy [&_li]:mb-2 [&_ol]:my-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:mb-5 [&_ul]:my-4 [&_ul]:list-disc [&_ul]:pl-6";

  if (looksLikeHtml(raw)) {
    return <div className={bodyClass} dangerouslySetInnerHTML={{ __html: raw }} />;
  }

  const paragraphs = raw.split(/\n{2,}/).filter((p) => p.trim());
  if (paragraphs.length <= 1) {
    return (
      <div className="whitespace-pre-line font-sans text-base leading-[1.75] text-navy/80 md:text-[17px]">
        {raw}
      </div>
    );
  }

  return (
    <div className="space-y-5 font-sans text-base leading-[1.75] text-navy/80 md:text-[17px]">
      {paragraphs.map((para, i) => (
        <p key={i}>{para.trim()}</p>
      ))}
    </div>
  );
}

export default function BlogDetail() {
  const { id } = useParams();
  const ctx = useContext(AppContext);
  const backendUrl = ctx?.backendUrl ?? "";
  const assetUrl = ctx?.assetUrl ?? ((p) => p ?? "");
  const allBlogs = useMemo(() => ctx?.blogs ?? [], [ctx?.blogs]);

  const [blog, setBlog] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  useEffect(() => {
    if (!id || !backendUrl) {
      setLoading(false);
      if (!backendUrl) setError("");
      else setError("Missing blog id.");
      setBlog(null);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError("");
    (async () => {
      try {
        const { data } = await axios.get(`${backendUrl}/api/blog/${id}`);
        if (cancelled) return;
        if (data?.success && data.blog) {
          setBlog(data.blog);
          setError("");
        } else {
          setBlog(null);
          setError(data?.message || "Could not load article.");
        }
      } catch (e) {
        if (cancelled) return;
        setBlog(null);
        const msg = e?.response?.data?.message || e?.message || "Failed to load article.";
        setError(msg);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [id, backendUrl]);

  const related = useMemo(() => {
    if (!blog?._id) {
      return allBlogs.filter((b) => String(b._id) !== String(id)).slice(0, 3);
    }
    return allBlogs
      .filter((b) => String(b._id) !== String(blog._id))
      .slice(0, 3);
  }, [allBlogs, blog, id]);

  if (!backendUrl) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center text-navy/70">
        <p className="text-sm">
          Configure <code className="font-mono text-gold-ink">VITE_BACKEND_URL</code> to load
          articles.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center bg-[#fdfbf7] px-4 pt-[calc(5.5rem+env(safe-area-inset-top,0px))] text-navy/55 sm:pt-28 md:pt-32">
        <p className="text-sm tracking-wide">Loading article…</p>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="mx-auto max-w-2xl bg-[#fdfbf7] px-4 py-16 pt-[calc(5.5rem+env(safe-area-inset-top,0px))] text-center sm:pt-28 md:pt-32">
        <p className="text-navy/75">{error || "Article not found."}</p>
        <Link
          to="/blogs"
          className="mt-6 inline-block text-sm font-semibold uppercase tracking-wider text-gold-ink hover:text-gold-dark"
        >
          ← Back to blogs
        </Link>
      </div>
    );
  }

  const imgSrc = blog.image ? assetUrl(String(blog.image)) : "";
  const badge = String(blog.tagline ?? "").trim() || "Update";
  const dateStr = formatBlogDate(blog);

  return (
    <div className="min-h-full bg-[#fdfbf7] text-navy">
      <article>
        <header className="bg-navy-gradient noise-overlay relative border-b border-white/10">
          <div className="relative z-[2] mx-auto max-w-4xl px-4 pb-10 pt-[calc(5.5rem+env(safe-area-inset-top,0px))] sm:px-6 sm:pb-12 sm:pt-28 md:pt-32 md:pb-14 lg:px-8">
            <span className="mb-4 inline-block rounded-md bg-gold px-2.5 py-1 font-sans text-[10px] font-bold uppercase tracking-wide text-navy md:text-xs">
              {badge}
            </span>

            <h1
              className="mb-5 text-3xl font-normal leading-tight tracking-tight text-gradient-gold sm:text-4xl md:text-5xl"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              {blog.title}
            </h1>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 font-sans text-sm text-white/55">
              {dateStr ? (
                <time dateTime={String(blog.date ?? blog.createdAt ?? "")}>{dateStr}</time>
              ) : null}
              {blog.writer ? (
                <>
                  {dateStr ? <span aria-hidden>·</span> : null}
                  <span>By {blog.writer}</span>
                </>
              ) : null}
            </div>
          </div>
        </header>

        {imgSrc ? (
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <div className="-mt-6 overflow-hidden rounded-2xl border border-navy/[0.08] bg-white shadow-[0_16px_48px_-20px_rgba(10,22,40,0.2)] sm:-mt-8 md:-mt-10">
              <img
                src={imgSrc}
                alt={blog.title ? String(blog.title) : "Article cover"}
                className="aspect-[21/9] w-full object-cover"
              />
            </div>
          </div>
        ) : null}

        <div
          className={`mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 ${imgSrc ? "py-10 md:py-14" : "py-10 md:py-12"}`}
        >
          <BlogContent content={blog.content} />
        </div>
      </article>

      {related.length > 0 ? (
        <section
          className="border-t border-navy/[0.08] bg-white py-14 md:py-20"
          aria-labelledby="related-blogs-heading"
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2
              id="related-blogs-heading"
              className="mb-8 text-center text-2xl tracking-tight text-navy md:mb-10 md:text-3xl"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              More to read
            </h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-6 lg:grid-cols-3 lg:gap-8">
              {related.map((b, index) => (
                <BlogCard
                  key={b._id ?? b.id ?? index}
                  blog={b}
                  assetUrl={assetUrl}
                />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <DreamHomeCta />
    </div>
  );
}
