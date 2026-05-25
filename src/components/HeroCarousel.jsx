import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { buildProjectsPath } from "../utils/projectsFilters";

const HERO_VIDEO_SRC = "/videos/hero.mp4";

function toggle(list, value) {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
}

function selectedLabel(count, noun) {
  if (!count) return null;
  if (count === 1) return `1 ${noun} selected`;
  return `${count} selected`;
}

export default function HeroCarousel() {
  const navigate = useNavigate();
  const { filterOptions } = useContext(AppContext) ?? {};
  const areas = filterOptions?.areas ?? [];
  const configurations = filterOptions?.configurations ?? [];
  const statuses = filterOptions?.statuses ?? [];

  const [videoFailed, setVideoFailed] = useState(false);
  const [pickedAreas, setPickedAreas] = useState([]);
  const [pickedConfigs, setPickedConfigs] = useState([]);
  const [pickedStatuses, setPickedStatuses] = useState([]);
  const [openMenu, setOpenMenu] = useState(null);
  const searchRef = useRef(null);

  useEffect(() => {
    if (!openMenu) return;
    const close = (e) => {
      if (!searchRef.current?.contains(e.target)) setOpenMenu(null);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [openMenu]);

  const menus = {
    area: { title: "Select area", options: areas, picked: pickedAreas, set: setPickedAreas, noun: "area" },
    config: { title: "BHK & type", options: configurations, picked: pickedConfigs, set: setPickedConfigs, noun: "type" },
    status: { title: "Project status", options: statuses, picked: pickedStatuses, set: setPickedStatuses, noun: "status" },
  };
  const menu = openMenu ? menus[openMenu] : null;

  function handleSearch(e) {
    e.preventDefault();
    setOpenMenu(null);
    navigate(
      buildProjectsPath({
        areas: pickedAreas,
        configurations: pickedConfigs,
        statuses: pickedStatuses,
      }),
    );
  }

  return (
    <section className="relative z-20 min-h-[100dvh] w-full overflow-x-hidden bg-navy">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 animate-kenburns">
          {!videoFailed ? (
            <video
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              className="absolute inset-0 h-full w-full object-cover"
              onError={() => setVideoFailed(true)}
            >
              <source src={HERO_VIDEO_SRC} type="video/mp4" />
            </video>
          ) : (
            <div className="absolute inset-0 bg-navy" aria-hidden />
          )}
        </div>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-navy/70 via-navy/15 to-navy/95" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-navy/65 via-transparent to-navy/30" />
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at center, transparent 40%, rgba(10,22,40,0.55) 100%)",
          }}
        />
      </div>

      <div className="relative z-10 mx-auto flex min-h-[100dvh] max-w-7xl flex-col justify-end gap-8 px-4 pt-[calc(5rem+env(safe-area-inset-top,0px))] pb-[max(2rem,env(safe-area-inset-bottom,0px))] sm:gap-10 sm:px-6 sm:pb-10 sm:pt-28 md:pb-14 md:pt-32 lg:px-8">
        <div className="flex min-h-0 flex-col gap-8 sm:gap-10">
          <div className="max-w-4xl text-left">
            <h1 className="font-hero-title flex flex-col gap-3 text-white">
              <span>The Ultimate Buffet </span>
              <span>Of Properties In</span>
              <span className="font-hero-accent block text-gold">Mira Bhayandar</span>
            </h1>
            <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-white/65 sm:mt-6 sm:text-base md:mt-7">
              We&apos;re not here to overwhelm you with hundreds of irrelevant listings. We focus
              on showcasing projects that genuinely matter to Mira Bhayandar buyers, helping you
              save time, compare better, and make smarter property decisions.
            </p>
          </div>

          <form
            ref={searchRef}
            onSubmit={handleSearch}
            className="mx-auto w-full max-w-3xl"
          >
            <div className="flex flex-col gap-2 rounded-2xl border border-white/20 bg-white/[0.12] p-2 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.55)] backdrop-blur-md sm:flex-row sm:items-stretch sm:rounded-full sm:p-1.5 sm:pl-3">
              <SearchField
                label="Locality"
                placeholder="Add area"
                icon={PinIcon}
                summary={selectedLabel(pickedAreas.length, "area")}
                open={openMenu === "area"}
                onOpen={() => setOpenMenu((m) => (m === "area" ? null : "area"))}
              />
              <div className="hidden h-10 w-px shrink-0 self-center bg-white/15 sm:block" />
              <SearchField
                label="Flat"
                placeholder="BHK / Type"
                icon={HomeIcon}
                summary={selectedLabel(pickedConfigs.length, "type")}
                open={openMenu === "config"}
                onOpen={() => setOpenMenu((m) => (m === "config" ? null : "config"))}
              />
              <div className="hidden h-10 w-px shrink-0 self-center bg-white/15 sm:block" />
              <SearchField
                label="Status"
                placeholder="Any status"
                icon={StatusIcon}
                summary={selectedLabel(pickedStatuses.length, "status")}
                open={openMenu === "status"}
                onOpen={() => setOpenMenu((m) => (m === "status" ? null : "status"))}
              />
              <button
                type="submit"
                className="inline-flex w-full shrink-0 cursor-pointer items-center justify-center gap-2 rounded-xl bg-gold px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-navy sm:w-auto sm:rounded-full sm:px-5 sm:py-2.5"
              >
                <SearchIconSolid className="text-navy" />
                Search
              </button>
            </div>

            {menu && menu.options.length > 0 ? (
              <div className="mt-2 rounded-2xl border border-white/20 bg-navy/90 p-4 text-cream shadow-lg backdrop-blur-xl">
                <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-gold">
                  {menu.title}
                </p>
                <div className="flex flex-wrap gap-2">
                  {menu.options.map((name) => {
                    const on = menu.picked.includes(name);
                    return (
                      <button
                        key={name}
                        type="button"
                        onClick={() => menu.set((prev) => toggle(prev, name))}
                        className={`rounded-full border px-3.5 py-2 text-xs font-medium transition-colors sm:text-[13px] ${
                          on
                            ? "border-gold/80 bg-gold/20 text-white ring-1 ring-gold/40"
                            : "border-white/20 bg-white/5 text-cream/95 hover:border-white/35 hover:bg-white/10"
                        }`}
                      >
                        {name}
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : null}
          </form>
        </div>
      </div>
    </section>
  );
}

function SearchField({ label, placeholder, icon: Icon, summary, open, onOpen }) {
  return (
    <div className="flex min-h-11 min-w-0 flex-1 items-center gap-2 rounded-xl px-3 py-2 sm:min-h-0 sm:rounded-full sm:py-2">
      <Icon className="shrink-0 text-gold" />
      <button type="button" className="min-w-0 flex-1 text-left" onClick={onOpen}>
        <span className="block text-[9px] font-semibold uppercase tracking-[0.2em] text-white/45">
          {label}
        </span>
        {summary ? (
          <span className="mt-0.5 block truncate text-sm font-medium text-gold">{summary}</span>
        ) : (
          <span className="mt-0.5 block truncate text-sm font-medium text-white">{placeholder}</span>
        )}
      </button>
      <button
        type="button"
        aria-expanded={open}
        className="shrink-0 rounded-full p-1 text-white/40 hover:bg-white/10 hover:text-white/70"
        onClick={onOpen}
      >
        <ChevronIcon className={open ? "rotate-180" : ""} />
      </button>
    </div>
  );
}

function PinIcon({ className }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className} aria-hidden>
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function HomeIcon({ className }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className} aria-hidden>
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}

function StatusIcon({ className }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className} aria-hidden>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6v6l4 2" />
    </svg>
  );
}

function ChevronIcon({ className }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`shrink-0 transition-transform ${className}`} aria-hidden>
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function SearchIconSolid({ className }) {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" className={className} aria-hidden>
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}
