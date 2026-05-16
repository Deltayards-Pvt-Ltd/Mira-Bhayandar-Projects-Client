import { useLayoutEffect, useState } from "react";
import { useReveal } from "../hooks/useReveal";

const TRUST_ITEMS = [
  {
    id: "rera",
    anim: "shield",
    title: "100% RERA Verified",
    description:
      "Every project we recommend is RERA registered and verified.",
    Icon: ShieldIcon,
  },
  {
    id: "partners",
    anim: "building",
    title: "100+ Developer Partners",
    description: "Direct partnerships with every major developer in the region.",
    Icon: BuildingIcon,
  },
  {
    id: "price",
    anim: "award",
    title: "Best Price Guarantee",
    description: "We ensure you get the best deal — no middleman markups.",
    Icon: AwardIcon,
  },
  {
    id: "support",
    anim: "clock",
    title: "End-to-End Support",
    description: "From site visits to registration — we're with you at every step.",
    Icon: ClockIcon,
  },
];

function ShieldIcon({ className }) {
  return (
    <svg
      className={className}
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="currentColor"
      stroke="none"
      aria-hidden
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
    </svg>
  );
}

function BuildingIcon({ className }) {
  const windows = [
    [8, 6],
    [16, 6],
    [12, 6],
    [12, 10],
    [12, 14],
    [16, 10],
    [16, 14],
    [8, 10],
    [8, 14],
  ];
  return (
    <svg
      className={className}
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
    >
      <g className="mini-about-building-rise">
        <rect
          width="16"
          height="20"
          x="4"
          y="2"
          rx="2"
          ry="2"
          fill="currentColor"
        />
        <rect
          x="9"
          y="18"
          width="6"
          height="4"
          rx="0.75"
          fill="currentColor"
          fillOpacity="0.38"
        />
      </g>
      <g>
        {windows.map(([cx, cy], wi) => (
          <circle
            key={wi}
            cx={cx}
            cy={cy}
            r="1.35"
            className="mini-about-building-window"
            fill="#f5f2eb"
            fillOpacity="0.85"
            style={{ "--mini-about-window-i": wi }}
          />
        ))}
      </g>
    </svg>
  );
}

function AwardIcon({ className }) {
  return (
    <svg
      className={className}
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="currentColor"
      stroke="none"
      aria-hidden
    >
      <path d="m15.477 12.89 1.515 8.526a.5.5 0 0 1-.81.47l-3.58-2.687a1 1 0 0 0-1.197 0l-3.586 2.686a.5.5 0 0 1-.81-.469l1.514-8.526" />
      <circle cx="12" cy="8" r="6" />
    </svg>
  );
}

function ClockIcon({ className }) {
  return (
    <svg
      className={className}
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
    >
      <circle cx="12" cy="12" r="10" fill="currentColor" />
      <g className="mini-about-clock-hands">
        <path
          d="M12 6v6l4 2"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
}

export default function MiniAbout() {
  const [sectionRef, visible] = useReveal();

  const [revealChildren, setRevealChildren] = useState(false);
  useLayoutEffect(() => {
    if (!visible) {
      setRevealChildren(false);
      return undefined;
    }
    setRevealChildren(false);
    let cancelled = false;
    let raf1 = 0;
    let raf2 = 0;
    raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => {
        if (!cancelled) setRevealChildren(true);
      });
    });
    return () => {
      cancelled = true;
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
    };
  }, [visible]);

  const fadeClass = (base) =>
    `${base} featured-fade${revealChildren ? " is-visible" : ""}`;

  const iconWrapClass = (anim) => {
    switch (anim) {
      case "shield":
        return "mini-about-icon-shield-wrap";
      case "building":
        return "mini-about-icon-building-wrap";
      case "award":
        return "mini-about-icon-award-wrap";
      case "clock":
        return "mini-about-icon-clock-wrap";
      default:
        return "";
    }
  };

  return (
    <section
      ref={sectionRef}
      className="bg-white pt-6 pb-16 md:pt-8 md:pb-24"
      aria-labelledby="mini-about-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <header
          className={fadeClass("mx-auto mb-10 max-w-3xl text-center md:mb-14")}
          style={{ "--featured-fade-delay": "0ms" }}
        >
          <p className="mb-3 font-sans text-sm font-semibold uppercase tracking-[0.2em] text-gold-ink">
            Why MiraBhayandar
          </p>
          <h2
            id="mini-about-heading"
            className="text-5xl tracking-tight text-navy md:text-6xl lg:text-7xl"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Your Trusted Partner
          </h2>
        </header>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {TRUST_ITEMS.map((item, i) => {
            const { Icon } = item;
            return (
              <div
                key={item.id}
                className={fadeClass("")}
                style={{
                  "--featured-fade-delay": `${80 + i * 90}ms`,
                }}
              >
                <article className="mini-about-card flex h-full gap-3 rounded-xl border border-navy/[0.06] bg-white p-4 shadow-[0_4px_24px_-8px_rgba(10,22,40,0.08)] transition-shadow duration-300 hover:shadow-[0_12px_32px_-10px_rgba(10,22,40,0.12)] md:gap-4 md:p-5">
                  <div className="mini-about-card-icon-well flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gold/12 md:h-14 md:w-14">
                    <span
                      className={`flex h-full w-full items-center justify-center ${iconWrapClass(item.anim)}`}
                    >
                      <Icon className="h-6 w-6 md:h-7 md:w-7" />
                    </span>
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-sans text-base font-bold leading-snug text-navy md:text-[1.05rem]">
                      {item.title}
                    </h3>
                    <p className="mt-2 font-sans text-base leading-relaxed text-navy/75 md:text-[1.0625rem] md:leading-[1.55] md:text-navy/80">
                      {item.description}
                    </p>
                  </div>
                </article>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
