import { Link } from "react-router-dom";

const LIMIT_OPTIONS = [10, 20, 50];

function getPageNumbers(currentPage, totalPages) {
  if (totalPages <= 0) return [];
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }
  const set = new Set([1, totalPages, currentPage, currentPage - 1, currentPage + 1]);
  return [...set].filter((p) => p >= 1 && p <= totalPages).sort((a, b) => a - b);
}

/**
 * @param {{
 *   page: number;
 *   limit: number;
 *   total: number;
 *   onPageChange?: (page: number) => void;
 *   onLimitChange: (limit: number) => void;
 *   hrefForPage?: (page: number) => string;
 * }} props
 */
export default function ProjectsPagination({
  page,
  limit,
  total,
  onPageChange,
  onLimitChange,
  hrefForPage,
}) {
  if (total === 0) return null;

  const totalPages = Math.max(1, Math.ceil(total / limit));
  const from = (page - 1) * limit + 1;
  const to = Math.min(page * limit, total);
  const pages = getPageNumbers(page, totalPages);

  return (
    <nav
      className="mt-10 flex flex-col gap-4 border-t border-navy/10 pt-8 sm:flex-row sm:items-center sm:justify-between"
      aria-label="Pagination"
    >
      <p className="text-sm text-navy/55">
        <span className="font-medium text-navy/75">
          {from}–{to}
        </span>{" "}
        of {total}
      </p>
      <div className="flex flex-wrap items-center gap-3">
        <label className="flex items-center gap-2 text-sm text-navy/55">
          Per page
          <select
            value={limit}
            onChange={(e) => onLimitChange(Number(e.target.value))}
            className="rounded-lg border border-navy/15 bg-white px-2.5 py-1.5 text-sm text-navy outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/30"
          >
            {LIMIT_OPTIONS.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </label>
        <div className="flex flex-wrap items-center gap-1">
          <PageControl
            href={hrefForPage?.(page - 1)}
            disabled={page <= 1}
            className="rounded-lg border border-navy/15 px-3 py-1.5 text-sm text-navy no-underline transition hover:border-gold/40 hover:text-gold"
            onClick={() => onPageChange?.(page - 1)}
          >
            Prev
          </PageControl>
          {pages.map((n, i) => {
            const prev = pages[i - 1];
            const showEllipsis = i > 0 && prev != null && n - prev > 1;
            const current = n === page;
            return (
              <span key={n} className="flex items-center gap-1">
                {showEllipsis ? (
                  <span className="px-1 text-sm text-navy/40">…</span>
                ) : null}
                <PageControl
                  href={hrefForPage?.(n)}
                  current={current}
                  className={
                    current
                      ? "min-w-[2.25rem] rounded-lg border border-gold/50 bg-gold/10 px-2 py-1.5 text-center text-sm font-medium text-gold no-underline"
                      : "min-w-[2.25rem] rounded-lg border border-navy/15 px-2 py-1.5 text-center text-sm text-navy no-underline transition hover:border-gold/40 hover:text-gold"
                  }
                  onClick={() => onPageChange?.(n)}
                >
                  {n}
                </PageControl>
              </span>
            );
          })}
          <PageControl
            href={hrefForPage?.(page + 1)}
            disabled={page >= totalPages}
            className="rounded-lg border border-navy/15 px-3 py-1.5 text-sm text-navy no-underline transition hover:border-gold/40 hover:text-gold"
            onClick={() => onPageChange?.(page + 1)}
          >
            Next
          </PageControl>
        </div>
      </div>
    </nav>
  );
}

function PageControl({ href, disabled, current, className, children, onClick }) {
  if (disabled) {
    return (
      <span className={`${className} cursor-not-allowed opacity-40`} aria-disabled="true">
        {children}
      </span>
    );
  }

  if (href) {
    return (
      <Link to={href} className={className} aria-current={current ? "page" : undefined}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={current ? "page" : undefined}
      className={className}
    >
      {children}
    </button>
  );
}

export const DEFAULT_PROJECTS_LIMIT = 12;
