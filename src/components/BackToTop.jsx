import { useEffect, useState } from "react";
import { useScrollToSiteContact } from "../hooks/useScrollToSiteContact";

const SCROLL_THRESHOLD = 400;

function ChevronUpIcon({ className }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden
    >
      <path
        d="M12 5v14M5 12l7-7 7 7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ContactIcon({ className }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden
    >
      <path
        d="M4 6h16v12H4z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="m4 7 8 6 8-6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const fabClass =
  "flex h-11 w-11 items-center justify-center rounded-full border border-gold/60 bg-navy/90 text-gold shadow-[0_8px_32px_-8px_rgba(0,0,0,0.5)] ring-1 ring-white/10 backdrop-blur-sm transition-colors duration-300 hover:border-gold hover:bg-gold hover:text-navy focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold";

export default function BackToTop() {
  const [visible, setVisible] = useState(false);
  const scrollToContact = useScrollToSiteContact();

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > SCROLL_THRESHOLD);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={`fixed bottom-[max(1.5rem,env(safe-area-inset-bottom))] right-4 z-[100] flex flex-col items-center gap-2 sm:right-6 ${
        visible
          ? "pointer-events-auto translate-y-0 opacity-100"
          : "pointer-events-none translate-y-2 opacity-0"
      } transition-all duration-300`}
    >
      <button
        type="button"
        onClick={scrollToContact}
        aria-label="Go to contact section"
        title="Contact"
        className={fabClass}
      >
        <ContactIcon />
      </button>
      <button
        type="button"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label="Back to top"
        title="Back to top"
        className={fabClass}
      >
        <ChevronUpIcon />
      </button>
    </div>
  );
}
