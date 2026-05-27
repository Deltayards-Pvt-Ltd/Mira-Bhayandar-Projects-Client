import { useEffect, useRef } from "react";
import { toast } from "react-toastify";

function ShareIcon({ className }) {
  return (
    <svg
      className={className}
      width="24"
      height="24"
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
      <path d="m15.41 6.51-6.82 3.98" />
    </svg>
  );
}

// no link of the assest , we need to share our page link onlu
export default function ProjectWalkthoughSection({ project, assetUrl }) {
  const src = project?.walkthroughVideo
    ? assetUrl(project.walkthroughVideo)
    : "";
  const videoRef = useRef(null);

  useEffect(() => {
    const v = videoRef.current;
    if (!v || !src) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const p = v.play();
          if (p?.catch) p.catch(() => {});
        }
      },
      { threshold: 0.25 },
    );
    io.observe(v);
    return () => io.disconnect();
  }, [src]);

  if (!src) return null;

  const shareVideo = async () => {
    const title = project?.name
      ? `${project.name} — Walkthrough`
      : "Project walkthrough";

    try {
      console.log(window.location.href);
      if (navigator.share) {
        await navigator.share({ title, url: window.location.href });
        return;
      }
      await navigator.clipboard.writeText(window.location.href);
      toast.success("link copied");
    } catch (err) {
      if (err?.name === "AbortError") return;
      try {
        console.log(window.location.href);
        await navigator.clipboard.writeText(window.location.href);
        toast.success("link copied");
      } catch {
        toast.error("Could not share  link");
      }
    }
  };
  return (
    <div className="border-b border-navy/[0.08] bg-[#fdfbf7] text-navy">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-ink">
          Walkthrough Video
        </p>

        <h2
          id="project-walkthrough-heading"
          className="mt-2 text-3xl font-normal tracking-tight text-navy sm:text-4xl"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Fasten Your Seatbelts!
        </h2>

        <div className="mt-6 space-y-2 text-center text-gray-600">
          <p className="text-xl font-semibold sm:text-2xl text-navy/78">
            See It Before You Live It
          </p>
          <p className="text-base sm:text-lg">
            Come take a quick virtual tour of the lifestyle waiting for you
          </p>
        </div>

        <figure className="mx-auto mt-10 w-full max-w-4xl px-2 sm:px-0">
          <div className="overflow-hidden rounded-2xl border-2 border-navy/[0.08] bg-white shadow-[0_8px_28px_-12px_rgba(10,22,40,0.12),0_20px_50px_-24px_rgba(10,22,40,0.16)] ring-1 ring-navy/[0.04]">
            <div className="relative aspect-video w-full overflow-hidden bg-navy/[0.04]">
              <video
                ref={videoRef}
                className="absolute inset-0 h-full w-full object-cover"
                autoPlay
                loop
                playsInline
                controls
                preload="metadata"
                aria-label="Project walkthrough video"
              >
                <source src={src} type="video/mp4" />
              </video>
            </div>
          </div>
          <button
            type="button"
            onClick={shareVideo}
            className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-navy/80 transition hover:text-navy"
            aria-label="Share walkthrough video"
          >
            <span>Share:</span>
            <ShareIcon className="h-5 w-5 cursor-pointer text-navy/80 hover:text-navy" />
          </button>
        </figure>
      </div>
    </div>
  );
}
