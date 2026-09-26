import { Link } from "react-router-dom";

/**
 * @param {{ items: { to?: string; label: string }[] }} props
 */
export default function Breadcrumbs({ items, align = "start" }) {
  const crumbs = (items || []).filter((item) => String(item?.label ?? "").trim());
  if (crumbs.length < 2) return null;

  return (
    <nav aria-label="Breadcrumb" className="mb-4">
      <ol
        className={`flex flex-wrap items-center gap-x-2 gap-y-1 font-sans text-xs font-medium text-white/55 ${
          align === "center" ? "justify-center" : ""
        }`}
      >
        {crumbs.map((item, index) => {
          const label = String(item.label).trim();
          const last = index === crumbs.length - 1;
          return (
            <li key={`${label}-${index}`} className="flex items-center gap-2">
              {index > 0 ? (
                <span aria-hidden className="text-white/35">
                  /
                </span>
              ) : null}
              {last || !item.to ? (
                <span aria-current={last ? "page" : undefined} className="text-white/80">
                  {label}
                </span>
              ) : (
                <Link to={item.to} className="text-gold-light no-underline hover:text-gold">
                  {label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
