import { useContext, useState } from "react";
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

export default function ContactSection() {
  const { backendUrl } = useContext(AppContext) ?? {};

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await submitLead(backendUrl, {
        name,
        email,
        phone,
        message,
      });
      setName("");
      setPhone("");
      setEmail("");
      setMessage("");
      toast.success("Thanks — we’ll get back to you shortly.");
    } catch (err) {
      console.error("submitLead failed:", err);
      const msg =
        err?.response?.data?.message ||
        (typeof err?.message === "string"
          ? err.message
          : "Could not send right now. Please try again.");
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section
      id="site-contact"
      className="bg-[#fdf8f1] py-20 text-navy md:py-28"
      aria-labelledby="contact-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-2 lg:gap-16 xl:gap-20">
          <div>
            <p className="mb-3 font-sans text-xs font-semibold uppercase tracking-[0.2em] text-gold-ink">
              Get in touch
            </p>
            <h2
              id="contact-heading"
              className="mb-6 text-4xl leading-[1.1] tracking-tight md:text-5xl lg:text-[3.25rem]"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              <span className="text-navy">Can't wait to hear </span>
              <span className="text-gold">from you!</span>
            </h2>
            <p className="mb-10 max-w-lg font-sans text-base leading-relaxed text-navy/65 md:text-lg">
              Whether you&apos;re a first-time buyer or looking to upgrade, our
              experts are here to help. Get personalized recommendations based on
              your budget and preferences.
            </p>
          </div>

          <div className="rounded-3xl border border-navy/[0.06] bg-white p-8 shadow-[0_16px_48px_-20px_rgba(10,22,40,0.18)] md:p-10">
            <h3 className="mb-8 font-sans text-xl font-bold text-navy md:text-2xl">
              Quick Enquiry
            </h3>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div className="space-y-2">
                  <label
                    htmlFor="contact-name"
                    className="block font-sans text-[10px] font-semibold uppercase tracking-[0.15em] text-gold-ink"
                  >
                    Name
                  </label>
                  <input
                    id="contact-name"
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
                    htmlFor="contact-phone"
                    className="block font-sans text-[10px] font-semibold uppercase tracking-[0.15em] text-gold-ink"
                  >
                    Phone
                  </label>
                  <input
                    id="contact-phone"
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
                  htmlFor="contact-email"
                  className="block font-sans text-[10px] font-semibold uppercase tracking-[0.15em] text-gold-ink"
                >
                  Email
                </label>
                <input
                  id="contact-email"
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
                  htmlFor="contact-message"
                  className="block font-sans text-[10px] font-semibold uppercase tracking-[0.15em] text-gold-ink"
                >
                  Message
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  rows={4}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full resize-y rounded-lg border border-navy/[0.12] bg-white px-4 py-3 font-sans text-sm text-navy outline-none ring-gold/30 transition placeholder:text-navy/35 focus:border-gold/50 focus:ring-2"
                  placeholder="Tell us what you're looking for…"
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
                <p className="max-w-[220px] font-sans text-xs leading-relaxed text-navy/45 sm:max-w-none">
                  No spam. A real advisor calls within the hour.
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
