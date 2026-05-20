import { useContext, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { AppContext } from "../context/AppContext";
import { submitLead } from "../utils/submitLead";

function SendIcon({ className }) {
  return (
    <svg
      className={className}
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="m22 2-7 20-4-9-9-4Z" />
      <path d="M22 2 11 13" />
    </svg>
  );
}

function MapPinIcon({ className }) {
  return (
    <svg
      className={className}
      width="40"
      height="40"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

/** @returns {string | null} Google Maps embed URL, or null if invalid */
function mapsEmbedUrl(lat, lng) {
  const la = Number(lat);
  const lo = Number(lng);
  if (!Number.isFinite(la) || !Number.isFinite(lo)) return null;
  if (la < -90 || la > 90 || lo < -180 || lo > 180) return null;
  return `https://www.google.com/maps?q=${la},${lo}&z=16&hl=en&output=embed`;
}

function mapsSearchUrl(query) {
  const q = String(query || "").trim();
  if (!q) return "https://www.google.com/maps/search/Mira+Bhayandar";
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;
}

/**
 * @param {{ project: Record<string, unknown> }} props
 */
export default function ProjectDetailEnquiry({ project }) {
  const { backendUrl } = useContext(AppContext) ?? {};

  const projectName = String(project?.name || "this project").trim() || "this project";
  const locationText = String(project?.location || "").trim();

  const embedSrc = useMemo(() => {
    return mapsEmbedUrl(project?.latitude, project?.longitude);
  }, [project?.latitude, project?.longitude]);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState(
    () => `I'm interested in ${projectName}.${locationText ? ` Location: ${locationText}.` : ""}`,
  );
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    try {
      const body = message.trim();
      const withProject =
        body.startsWith(`[Project: ${projectName}]`) || !projectName
          ? body
          : `[Project: ${projectName}]\n\n${body}`;

      await submitLead(backendUrl, {
        name,
        email,
        phone,
        message: withProject,
      });
      setName("");
      setPhone("");
      setEmail("");
      setMessage(
        `I'm interested in ${projectName}.${locationText ? ` Location: ${locationText}.` : ""}`,
      );
      toast.success("Thanks — we’ll get back to you shortly.");
    } catch (err) {
      console.error("submitLead failed:", err);
      const msg =
        err?.response?.data?.message ||
        (typeof err?.message === "string"
          ? err.message
          : "Could not send right now. Please try again or call us.");
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section
      className="border-b border-navy/[0.08] bg-[#fdf8f1] py-16 text-navy md:py-16"
      aria-labelledby="project-enquiry-heading"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-ink">
          Talk to sales
        </p>
        <h2
          id="project-enquiry-heading"
          className="mt-2 text-3xl font-normal tracking-tight text-navy sm:text-4xl"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Enquire about {projectName}
        </h2>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-navy/65 sm:text-base">
          Share your details and we&apos;ll connect you with the sales team for this project.
        </p>

        <div className="mt-12 grid grid-cols-1 items-stretch gap-10 lg:grid-cols-2 lg:gap-14">
          <div className="rounded-3xl border border-navy/[0.08] bg-white p-7 shadow-[0_16px_48px_-24px_rgba(10,22,40,0.2)] sm:p-9">
            <h3 className="mb-7 font-sans text-lg font-bold text-navy md:text-xl">
              Quick enquiry
            </h3>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div className="space-y-2">
                  <label
                    htmlFor="project-enquiry-name"
                    className="block font-sans text-[10px] font-semibold uppercase tracking-[0.15em] text-gold-ink"
                  >
                    Name
                  </label>
                  <input
                    id="project-enquiry-name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-lg border border-navy/[0.12] bg-white px-4 py-3 font-sans text-sm text-navy outline-none ring-gold/30 transition placeholder:text-navy/35 focus:border-gold/50 focus:ring-2"
                    placeholder="Your name"
                  />
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="project-enquiry-phone"
                    className="block font-sans text-[10px] font-semibold uppercase tracking-[0.15em] text-gold-ink"
                  >
                    Phone
                  </label>
                  <input
                    id="project-enquiry-phone"
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full rounded-lg border border-navy/[0.12] bg-white px-4 py-3 font-sans text-sm text-navy outline-none ring-gold/30 transition placeholder:text-navy/35 focus:border-gold/50 focus:ring-2"
                    placeholder="+91 …"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="project-enquiry-email"
                  className="block font-sans text-[10px] font-semibold uppercase tracking-[0.15em] text-gold-ink"
                >
                  Email
                </label>
                <input
                  id="project-enquiry-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-navy/[0.12] bg-white px-4 py-3 font-sans text-sm text-navy outline-none ring-gold/30 transition placeholder:text-navy/35 focus:border-gold/50 focus:ring-2"
                  placeholder="you@example.com"
                />
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="project-enquiry-message"
                  className="block font-sans text-[10px] font-semibold uppercase tracking-[0.15em] text-gold-ink"
                >
                  Message
                </label>
                <textarea
                  id="project-enquiry-message"
                  name="message"
                  rows={4}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full resize-y rounded-lg border border-navy/[0.12] bg-white px-4 py-3 font-sans text-sm text-navy outline-none ring-gold/30 transition placeholder:text-navy/35 focus:border-gold/50 focus:ring-2"
                  placeholder="Tell us what you need…"
                />
              </div>
              <div className="flex flex-col gap-4 pt-2 sm:flex-row sm:flex-wrap sm:items-center sm:gap-6">
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-gold px-8 py-3.5 font-sans text-xs font-bold uppercase tracking-[0.12em] text-navy shadow-sm transition hover:bg-gold-light enabled:cursor-pointer disabled:cursor-not-allowed disabled:opacity-60 md:text-[13px]"
                >
                  {submitting ? "Sending…" : "Send enquiry"}
                  {!submitting ? <SendIcon className="text-navy" /> : null}
                </button>
              </div>
            </form>
          </div>

          <div className="min-h-[280px] lg:min-h-[420px]">
            <div className="mb-3 flex items-center justify-between gap-3">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-gold-ink">
                Location
              </p>
              {embedSrc ? (
                <a
                  href={mapsSearchUrl(`${projectName} ${locationText}`.trim())}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] font-semibold uppercase tracking-[0.12em] text-navy/55 transition-colors hover:text-gold-dark"
                >
                  Open in Maps
                </a>
              ) : null}
            </div>
            {embedSrc ? (
              <div className="h-[min(52vh,440px)] min-h-[280px] overflow-hidden rounded-3xl border-2 border-navy/[0.1] bg-navy/[0.04] shadow-[0_20px_50px_-24px_rgba(10,22,40,0.25)]">
                <iframe
                  title={`Map — ${projectName}`}
                  src={embedSrc}
                  className="h-full w-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />
              </div>
            ) : (
              <div className="flex h-[min(52vh,440px)] min-h-[280px] flex-col items-center justify-center gap-4 rounded-3xl border-2 border-dashed border-navy/15 bg-white/80 px-6 text-center">
                <span className="flex h-16 w-16 items-center justify-center rounded-full bg-gold/15 text-gold-dark">
                  <MapPinIcon className="h-9 w-9" />
                </span>
                <p className="max-w-sm text-sm leading-relaxed text-navy/65">
                  Add <strong className="font-semibold text-navy/85">latitude</strong> and{" "}
                  <strong className="font-semibold text-navy/85">longitude</strong> on this project
                  in the admin panel to show an embedded map here. Values are WGS84 decimals (e.g.
                  19.28, 72.85).
                </p>
                <a
                  href={mapsSearchUrl(locationText || projectName)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex rounded-full border-2 border-navy bg-navy px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-cream transition-colors hover:bg-navy-light"
                >
                  Search area in Google Maps
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
