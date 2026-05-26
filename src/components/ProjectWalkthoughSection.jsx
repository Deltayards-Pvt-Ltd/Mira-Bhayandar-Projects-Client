export default function ProjectWalkthoughSection({ project, assetUrl }) {
  const src = project?.walkthroughVideo
    ? assetUrl(project.walkthroughVideo)
    : "";
  if (!src) return null;

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
          Experience
        </h2>

        <div className="mt-6 space-y-2 text-center text-gray-600">
          <p className="text-xl font-semibold sm:text-2xl text-navy/78">
            Experience The Project
          </p>
          <p className="text-base sm:text-lg">
            Take a walkthrough and explore every detail
          </p>
        </div>

        <figure className="mx-auto mt-10 w-full max-w-4xl px-2 sm:px-0">
          <div className="overflow-hidden rounded-2xl border-2 border-navy/[0.08] bg-white shadow-[0_8px_28px_-12px_rgba(10,22,40,0.12),0_20px_50px_-24px_rgba(10,22,40,0.16)] ring-1 ring-navy/[0.04]">
            <div className="relative aspect-video w-full overflow-hidden bg-navy/[0.04]">
              <video
                className="absolute inset-0 h-full w-full object-cover"
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                aria-label="Project walkthrough video"
              >
                <source src={src} type="video/mp4" />
              </video>
            </div>
          </div>
        </figure>
      </div>
    </div>
  );
}
