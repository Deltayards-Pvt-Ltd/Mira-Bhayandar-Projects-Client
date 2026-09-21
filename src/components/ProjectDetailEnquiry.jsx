import { useContext, useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { toast } from "react-toastify";
import { AppContext } from "../context/AppContext";
import { submitLead } from "../utils/submitLead";

const POPUP_DELAY_MS = 5000;

function popupDismissKey(project) {
  return `mbp-enquiry-popup:${project?.slug || project?._id || "project"}`;
}

function wasPopupDismissed(project) {
  try {
    return sessionStorage.getItem(popupDismissKey(project)) === "1";
  } catch {
    return false;
  }
}

function markPopupDismissed(project) {
  try {
    sessionStorage.setItem(popupDismissKey(project), "1");
  } catch {
    /* ignore quota / private mode */
  }
}

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

function ShareIcon({ className }) {
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
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <path d="m8.59 13.51 6.83 3.98" />
      <path d="M15.41 6.51l-6.82 3.98" />
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

function CloseIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      aria-hidden
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
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

function EnquiryForm({
  projectName,
  locationText,
  idPrefix,
  heading = "Quick enquiry",
  compact = false,
  onSuccess,
}) {
  const { backendUrl } = useContext(AppContext) ?? {};
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
      onSuccess?.();
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

  const fieldClass = compact
    ? "w-full rounded-md border border-navy/[0.12] bg-white px-2.5 py-1.5 font-sans text-xs text-navy outline-none ring-gold/30 transition placeholder:text-navy/35 focus:border-gold/50 focus:ring-1"
    : "w-full rounded-lg border border-navy/[0.12] bg-white px-4 py-3 font-sans text-sm text-navy outline-none ring-gold/30 transition placeholder:text-navy/35 focus:border-gold/50 focus:ring-2";
  const labelClass = compact
    ? "block font-sans text-[9px] font-semibold uppercase tracking-[0.12em] text-gold-ink"
    : "block font-sans text-[10px] font-semibold uppercase tracking-[0.15em] text-gold-ink";
  const fieldWrapClass = compact ? "space-y-1" : "space-y-2";

  return (
    <>
      {heading ? (
        <h3
          className={
            compact
              ? "mb-4 font-sans text-base font-bold text-navy"
              : "mb-7 font-sans text-lg font-bold text-navy md:text-xl"
          }
        >
          {heading}
        </h3>
      ) : null}
      <form onSubmit={handleSubmit} className={compact ? "space-y-2" : "space-y-5"}>
        <div className={compact ? "grid grid-cols-2 gap-2" : "grid grid-cols-1 gap-5 sm:grid-cols-2"}>
          <div className={fieldWrapClass}>
            <label htmlFor={`${idPrefix}-name`} className={labelClass}>
              Name
            </label>
            <input
              id={`${idPrefix}-name`}
              name="name"
              type="text"
              autoComplete="name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={fieldClass}
              placeholder="Your name"
            />
          </div>
          <div className={fieldWrapClass}>
            <label htmlFor={`${idPrefix}-phone`} className={labelClass}>
              Phone
            </label>
            <input
              id={`${idPrefix}-phone`}
              name="phone"
              type="tel"
              autoComplete="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className={fieldClass}
              placeholder="+91 …"
            />
          </div>
        </div>
        <div className={fieldWrapClass}>
          <label htmlFor={`${idPrefix}-email`} className={labelClass}>
            Email
          </label>
          <input
            id={`${idPrefix}-email`}
            name="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={fieldClass}
            placeholder="you@example.com"
          />
        </div>
        <div className={fieldWrapClass}>
          <label htmlFor={`${idPrefix}-message`} className={labelClass}>
            Message
          </label>
          <textarea
            id={`${idPrefix}-message`}
            name="message"
            rows={compact ? 2 : 4}
            required
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className={`${fieldClass} resize-y`}
            placeholder="Tell us what you need…"
          />
        </div>
        <div className={`flex flex-col sm:flex-row sm:flex-wrap sm:items-center ${compact ? "gap-2 pt-0.5" : "gap-4 pt-2 sm:gap-6"}`}>
          <button
            type="submit"
            disabled={submitting}
            className={
              compact
                ? "inline-flex w-full items-center justify-center gap-1.5 rounded-full bg-gold px-5 py-2 font-sans text-[10px] font-bold uppercase tracking-[0.12em] text-navy shadow-sm transition hover:bg-gold-light enabled:cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
                : "inline-flex items-center justify-center gap-2 rounded-full bg-gold px-8 py-3.5 font-sans text-xs font-bold uppercase tracking-[0.12em] text-navy shadow-sm transition hover:bg-gold-light enabled:cursor-pointer disabled:cursor-not-allowed disabled:opacity-60 md:text-[13px]"
            }
          >
            {submitting ? "Sending…" : "Send enquiry"}
            {!submitting ? <SendIcon className="text-navy" /> : null}
          </button>
        </div>
      </form>
    </>
  );
}

function EnquiryPopup({ open, onClose, projectName, locationText, onSuccess }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-navy/30 p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="project-enquiry-popup-heading"
      onClick={onClose}
    >
      <div
        className="relative mx-auto max-h-[min(90vh,720px)] w-full max-w-lg overflow-y-auto rounded-3xl border border-navy/[0.08] bg-white p-6 shadow-[0_24px_60px_-20px_rgba(10,22,40,0.4)] sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full border border-navy/10 bg-navy/[0.04] text-navy transition-colors hover:bg-navy/[0.08]"
          aria-label="Close enquiry form"
          onClick={onClose}
        >
          <CloseIcon />
        </button>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-ink">
          Talk to sales
        </p>
        <h2
          id="project-enquiry-popup-heading"
          className="mt-2 pr-12 text-2xl font-normal tracking-tight text-navy sm:text-3xl"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Enquire about {projectName}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-navy/65">
          Share your details and we&apos;ll connect you with the sales team.
        </p>
        <div className="mt-6">
          <EnquiryForm
            projectName={projectName}
            locationText={locationText}
            idPrefix="project-enquiry-popup"
            heading={null}
            onSuccess={onSuccess}
          />
        </div>
      </div>
    </div>,
    document.body,
  );
}

/**
 * @param {{ project: Record<string, unknown> }} props
 */
export default function ProjectDetailEnquiry({ project }) {
  const projectName = String(project?.name || "this project").trim() || "this project";
  const locationText = String(project?.location || "").trim();
  const [popupOpen, setPopupOpen] = useState(false);

  const embedSrc = useMemo(() => {
    return mapsEmbedUrl(project?.latitude, project?.longitude);
  }, [project?.latitude, project?.longitude]);

  const locationShareUrl = mapsSearchUrl(`${projectName} ${locationText}`.trim());

  useEffect(() => {
    if (wasPopupDismissed(project)) return undefined;
    const timer = window.setTimeout(() => {
      if (!wasPopupDismissed(project)) setPopupOpen(true);
    }, POPUP_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, [project]);

  function closePopup() {
    markPopupDismissed(project);
    setPopupOpen(false);
  }

  async function shareLocationLink() {
    const title = project?.name ? `${project.name} — Location` : "Project location";

    try {
      if (navigator.share) {
        await navigator.share({ title, url: locationShareUrl });
        return;
      }
      await navigator.clipboard.writeText(locationShareUrl);
      toast.success("Location link copied");
    } catch (err) {
      if (err?.name === "AbortError") return;
      try {
        await navigator.clipboard.writeText(locationShareUrl);
        toast.success("Location link copied");
      } catch {
        toast.error("Could not share location link");
      }
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
            <EnquiryForm
              projectName={projectName}
              locationText={locationText}
              idPrefix="project-enquiry"
              onSuccess={closePopup}
            />
          </div>

          <div className="flex min-h-[280px] flex-col lg:min-h-[420px]">
            <div className="mb-3 flex items-center justify-between gap-3">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-gold-ink">
                Location
              </p>
              {embedSrc ? (
                <a
                  href={locationShareUrl}
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
                  Location still to be added
                </p>
              </div>
            )}
            <div className="mt-5 flex flex-wrap items-center md:justify-start justify-center gap-4">
              <button
                type="button"
                onClick={shareLocationLink}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-gold px-8 py-3.5 font-sans text-xs font-bold uppercase tracking-[0.12em] text-navy shadow-sm transition hover:bg-gold-light enabled:cursor-pointer disabled:cursor-not-allowed disabled:opacity-60 md:text-[13px]"
              >
                Share location link
                <ShareIcon className="text-navy" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <EnquiryPopup
        open={popupOpen}
        onClose={closePopup}
        projectName={projectName}
        locationText={locationText}
        onSuccess={closePopup}
      />
    </section>
  );
}
