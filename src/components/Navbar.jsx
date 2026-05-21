import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useScrollToSiteContact } from "../hooks/useScrollToSiteContact";

const NAV_LINKS = [
  { to: "/", label: "Home" },
  { to: "/projects", label: "Projects" },
  { to: "/blogs", label: "Blogs" },
];

const LANGS = [
  { code: "EN", label: "English" },
  { code: "हि", label: "Hindi" },
];

function MenuIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 7h16M4 12h16M4 17h16"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M6 6l12 12M18 6L6 18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function desktopNavLinkClass() {
  return ({ isActive }) =>
    `text-sm font-medium transition-colors drop-shadow-[0_1px_2px_rgba(0,0,0,0.45)] ${
      isActive
        ? "text-gold"
        : "text-white/90 hover:text-white"
    }`;
}

const mobileNavLinkClass = ({ isActive }) =>
  `block rounded-xl px-4 py-3 text-base font-medium transition-colors ${
    isActive
      ? "bg-white/10 text-gold"
      : "text-white/90 hover:bg-white/10 hover:text-white"
  }`;

const SCROLL_SOLID_NAV_PX = 56;

export function Navbar() {
  const [lang, setLang] = useState("EN");
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const scrollToContact = useScrollToSiteContact();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > SCROLL_SOLID_NAV_PX);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  return (
    <header className="fixed inset-x-0 top-0 z-[110] w-full pt-[env(safe-area-inset-top,0px)]">
        <div
          className={`w-full transition-[background-color,border-color,box-shadow,backdrop-filter] duration-300 ${
            scrolled
              ? "border-b border-white/15 bg-navy/40 shadow-[0_8px_32px_-12px_rgba(0,0,0,0.35)] backdrop-blur-xl backdrop-saturate-150 supports-[backdrop-filter]:bg-navy/35"
              : "border-b border-transparent bg-transparent shadow-none backdrop-blur-none backdrop-saturate-100"
          }`}
        >
          <div className="relative mx-auto max-w-7xl px-4 pt-3 pb-3 sm:px-6 sm:pt-4 sm:pb-4 lg:px-8">
            <div className="flex min-h-16 w-full items-center gap-3 sm:min-h-16 sm:gap-6">
              <Link
                to="/"
                className="flex min-w-0 shrink items-center gap-2 sm:gap-3"
                aria-label="MiraBhayandar — Home"
                onClick={() => setMenuOpen(false)}
              >
                <img
                  src="/logo.png"
                  alt="MiraBhayandar"
                  className="h-12 w-auto sm:h-14 md:h-14 lg:h-14 "
                  draggable={false}
                />
              </Link>

              <nav
                className="ml-auto hidden items-center gap-7 md:flex"
                aria-label="Main"
              >
                {NAV_LINKS.map((l) => (
                  <NavLink
                    key={l.to}
                    to={l.to}
                    end={l.to === "/"}
                    className={desktopNavLinkClass()}
                  >
                    {l.label}
                  </NavLink>
                ))}
                <button
                  type="button"
                  onClick={scrollToContact}
                  className={`${desktopNavLinkClass()({ isActive: false })} cursor-pointer border-0 bg-transparent p-0 font-[inherit]`}
                >
                  Contact
                </button>
              </nav>

              <div className="ml-auto flex shrink-0 items-center gap-2 md:ml-0">
                <div
                  className="flex items-center gap-0.5 rounded-full border border-white/25 bg-white/10 p-0.5 text-[11px] transition-colors sm:gap-1 sm:p-1 sm:text-xs"
                >
                  {LANGS.map((l) => {
                    const active = lang === l.code;
                    return (
                      <button
                        key={l.code}
                        type="button"
                        onClick={() => setLang(l.code)}
                        aria-pressed={active}
                        aria-label={l.label}
                        className={`min-w-[30px] rounded-full px-2 py-1 font-semibold transition-colors sm:min-w-[34px] sm:px-2.5 ${
                          active
                            ? "bg-gold text-navy"
                            : "text-white/60 hover:text-white"
                        }`}
                      >
                        {l.code}
                      </button>
                    );
                  })}
                </div>

                <button
                  type="button"
                  className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white transition-colors hover:bg-white/20 md:hidden"
                  aria-expanded={menuOpen}
                  aria-controls="mobile-nav"
                  onClick={() => setMenuOpen((o) => !o)}
                >
                  {menuOpen ? <CloseIcon /> : <MenuIcon />}
                </button>
              </div>
            </div>

            {menuOpen && (
              <nav
                id="mobile-nav"
                className="absolute left-4 right-4 top-[calc(100%+0.25rem)] z-[120] rounded-2xl border border-white/40 bg-navy/95 p-2 shadow-[0_24px_80px_-20px_rgba(0,0,0,0.65)] ring-1 ring-white/10 backdrop-blur-xl sm:left-6 sm:right-6 md:hidden"
                aria-label="Main"
              >
                <ul className="flex flex-col gap-0.5">
                  {NAV_LINKS.map((l) => (
                    <li key={l.to}>
                      <NavLink
                        to={l.to}
                        end={l.to === "/"}
                        className={mobileNavLinkClass}
                        onClick={() => setMenuOpen(false)}
                      >
                        {l.label}
                      </NavLink>
                    </li>
                  ))}
                  <li>
                    <button
                      type="button"
                      className={`${mobileNavLinkClass({ isActive: false })} w-full border-0 bg-transparent text-left font-[inherit]`}
                      onClick={(e) => {
                        scrollToContact(e);
                        setMenuOpen(false);
                      }}
                    >
                      Contact
                    </button>
                  </li>
                </ul>
              </nav>
            )}
          </div>
        </div>
    </header>
  );
}
