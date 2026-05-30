import { formatPlans } from "../utils/projectPlans";

function MapPinIcon({ className }) {
  return (
    <svg
      className={className}
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function PhoneIcon({ className }) {
  return (
    <svg
      className={className}
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

function WhatsAppIcon({ className }) {
  return (
    <svg
      className={className}
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="currentColor" 
      
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  );
}   

function buildWhatsAppHref(contactNumber) {
  return `https://wa.me/91${contactNumber.replace(/\s/g, "")}`;
}

function formatConfigDisplay(plans) {
  return formatPlans(plans, " | ") || "";
}

function getStatusBadge(status) {
  const s = String(status || "").trim();
  if (s === "Ready to Move") {
    return {
      label: s,
      className:
        "bg-emerald-500/20 text-emerald-100 ring-1 ring-emerald-400/35",
    };
  }
  if (s === "Under Construction") {
    return {
      label: s,
      className: "bg-gold/15 text-gold ring-1 ring-gold/45",
    };
  }
  return null;
}

/**
 * @param {{
 *   project: Record<string, unknown>;
 *   assetUrl: (path: string) => string;
 * }} props
 */
export default function ProjectDetailIntro({ project, assetUrl }) {
  const address = String(project?.address || "").trim();
  const locationRaw = String(project?.location || "").trim();
  const addressLine = address || locationRaw;
  const propertyType = String(project?.propertyType || "").trim();
  const name = project?.name || "Project";
  const builder = String(project?.builder || "").trim();
  const configLine = formatConfigDisplay(project?.plans);
  const reraNo = String(project?.reraNo || "").trim();
  const contactNumber = String(project?.contactNumber || "").trim();
  const bannerImage = String(project?.bannerImage || "").trim();
  const bannerUrl = bannerImage ? assetUrl(bannerImage) : "";
  const statusBadge = getStatusBadge(project?.status);
  
  const telHref = contactNumber
    ? `tel:${contactNumber.replace(/\s/g, "")}`
    : "";

  return (
    <section className="relative overflow-hidden border-b border-white/10 text-cream">
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        {bannerUrl ? (
          <>
            <img
              src={bannerUrl}
              alt=""
              className="h-full w-full object-cover object-[55%_center] sm:object-[60%_25%] lg:object-[58%_20%]"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0a1628]/92 via-[#0a1628]/55 to-[#0a1628]/10" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a1628]/50 via-transparent to-[#0a1628]/30" />
          </>
        ) : (
          <div className="noise-overlay absolute inset-0 bg-navy-gradient" />
        )}
      </div>

      <div className="relative z-[2] mx-auto flex min-h-[clamp(26rem,56.25vw,40rem)] max-w-6xl flex-col justify-end px-4 pb-10 pt-[calc(5.5rem+env(safe-area-inset-top,0px))] sm:px-6 sm:pb-14 sm:pt-28 md:pt-32 lg:min-h-[clamp(30rem,62vw,48rem)] lg:px-8">
        <div className="w-full max-w-2xl lg:max-w-[58%]">
          <h1
            className="text-[2rem] font-normal leading-[1.12] tracking-tight text-white sm:text-5xl sm:leading-[1.08]"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            {name}
          </h1>

          {builder ? (
            <p className="mt-4 text-xs font-semibold uppercase tracking-[0.2em] text-white/55">
              <span className="text-gold">By -</span> {builder}
            </p>
          ) : null}

          {addressLine ? (
            <p className="mt-4 flex items-start gap-2 text-sm font-medium leading-snug text-white/70">
              <MapPinIcon className="mt-0.5 shrink-0 text-gold" aria-hidden />
              <span>{addressLine}</span>
            </p>
          ) : null}

          <div className="my-8 space-y-4 border-t border-white/10 pt-8">
            {/* Line 1: configurations + RERA */}
            <div className="-mx-1 flex items-end gap-x-6 overflow-x-auto px-1 pb-0.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              <div className="shrink-0">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-gold">
                  Configurations
                </p>
                <p className="mt-1 whitespace-nowrap text-sm font-medium text-white/90 sm:text-base">
                  {configLine || "-"}
                </p>
              </div>
              {reraNo ? (
                <div className="shrink-0 border-l border-white/15 pl-6">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-gold">
                    RERA
                  </p>
                  <p className="mt-1 whitespace-nowrap text-sm font-medium text-white/90 sm:text-base">
                    {reraNo}
                  </p>
                </div>
              ) : null}
            </div>

            {/* Line 2: status + property type */}
            {statusBadge || propertyType ? (
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
                {statusBadge ? (
                  <span
                    className={`inline-flex shrink-0 rounded-full px-2.5 py-1 text-[11px] font-bold uppercase leading-tight tracking-[0.08em] ${statusBadge.className}`}
                  >
                    {statusBadge.label}
                  </span>
                ) : null}
                {propertyType ? (
                  <p className="text-sm text-white/85">
                    <span className="ml-2 whitespace-nowrap font-medium uppercase tracking-[0.18em] text-white">
                      {propertyType}
                    </span>
                  </p>
                ) : null}
              </div>
            ) : null}
          </div>

          {telHref ? (
            <div className="mb-8 flex gap-2">
              <a
                href={telHref}
                className="inline-flex items-center gap-2 rounded-full border-2 border-white/35 bg-transparent px-5 py-2.5 text-[8px] md:text-[11px] font-semibold uppercase tracking-[0.14em] text-cream transition-colors hover:border-gold hover:bg-white/5"
              >
                <PhoneIcon className="text-gold-light" />
                {contactNumber}
              </a>
              <a
                href={buildWhatsAppHref(contactNumber)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border-2 border-white/35 bg-transparent px-5 py-2.5 text-[8px] md:text-[11px] font-semibold uppercase tracking-[0.14em] text-cream transition-colors hover:border-gold hover:bg-white/5"
              >
                <WhatsAppIcon className="text-gold-light" />
                {contactNumber}
              </a>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
