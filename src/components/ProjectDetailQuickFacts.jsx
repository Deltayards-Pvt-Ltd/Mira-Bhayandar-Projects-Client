import { formatPlans } from "../utils/projectPlans";

function ClipboardIcon({ className }) {
  return (
    <svg
      className={className}
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
    </svg>
  );
}

function formatPossessionShort(reraPossession) {
  if (!reraPossession) return "";
  const m = typeof reraPossession.month === "string" ? reraPossession.month.trim() : "";
  const y = reraPossession.year;
  const hasY = y != null && y !== "" && Number.isFinite(Number(y));
  const shortMonth = m ? m.slice(0, 3) : "";
  if (shortMonth && hasY) return `${shortMonth} ${y}`;
  if (hasY) return String(y);
  return shortMonth || m;
}

/**
 * @param {{ project: Record<string, unknown> }} props
 */
export default function ProjectDetailQuickFacts({ project }) {
  const name = String(project?.name || "Project").trim();
  const builder = String(project?.builder || "").trim();
  const address = String(project?.address || "").trim();
  const location = String(project?.location || "").trim();
  const locationDisplay = address || location;
  const reraNo = String(project?.reraNo || "").trim();
  const possession = formatPossessionShort(project?.reraPossession);
  const status = String(project?.status || "").trim();
  const propertyType = String(project?.propertyType || "").trim();
  const configurations = formatPlans(project?.plans, " – ");

  const rows = [
    { label: "Developer", value: builder },
    { label: "Location", value: locationDisplay },
    { label: "RERA number", value: reraNo },
    { label: "Possession date", value: possession },
    { label: "Project status", value: status },
    { label: "Project type", value: propertyType },
    { label: "Configurations", value: configurations },
  ];

  const visibleRows = rows.filter((r) => r.value);
  if (!visibleRows.length) return null;

  return (
    <section
      className="border-b border-navy/[0.08] bg-[#fdfbf7] text-navy"
      aria-labelledby="project-quick-facts-heading"
    >
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-ink">
          Quick facts
        </p>
        <h2
          id="project-gallery-heading"
          className="mt-2 text-3xl font-normal tracking-tight text-navy sm:text-4xl"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Details
        </h2>

        <div
          className="mt-8 overflow-hidden rounded-xl border border-navy/[0.1] bg-white shadow-[0_4px_24px_-12px_rgba(10,22,40,0.12)]"
          role="list"
        >
          {visibleRows.map(({ label, value }, i) => (
            <div
              key={label}
              role="listitem"
              className={`grid grid-cols-1 gap-1 px-4 py-4 sm:grid-cols-[minmax(9rem,32%)_1fr] sm:gap-6 sm:px-6 sm:py-4 ${
                i < visibleRows.length - 1 ? "border-b border-navy/[0.08]" : ""
              }`}
            >
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-navy/45">
                {label}
              </p>
              <p className="text-[15px] font-medium leading-snug text-navy sm:text-base">
                {label === "Developer" ? (
                  <span className="font-semibold text-navy">{value}</span>
                ) : (
                  value
                )}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
