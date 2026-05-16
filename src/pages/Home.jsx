import { useContext } from "react";
import { AppContext } from "../context/AppContext";
import HeroCarousel from "../components/HeroCarousel";
import Storytelling from "../components/Storytelling";
import ArchitecturalVision from "../components/ArchitecturalVision";
import FeaturedProjects from "../components/FeaturedProjects";
import MiniAbout from "../components/MiniAbout";
import WhyMiraBhayandar from "../components/WhyMiraBhayandar";
import ExploreByLocation from "../components/ExploreByLocation";
import Testimonials from "../components/Testimonials";
import LatestUpdates from "../components/LatestUpdates";
import DreamHomeCta from "../components/DreamHomeCta";
import ContactSection from "../components/ContactSection";

export default function Home() {
  const { backendUrl, usingDevBackendDefault } = useContext(AppContext) ?? {};

  return (
    <>
      <HeroCarousel />
      <Storytelling />
      <ArchitecturalVision />
      <FeaturedProjects />
      <WhyMiraBhayandar />
      <ExploreByLocation />
      <MiniAbout />
      <Testimonials />
      <LatestUpdates />
      <ContactSection />
      <DreamHomeCta />

      {!backendUrl && (
        <div className="break-words bg-amber-500/10 px-3 py-3 text-center text-xs text-amber-200 sm:px-4 sm:text-sm">
          Set <code className="font-mono">VITE_BACKEND_URL</code> in{" "}
          <code className="font-mono">client/.env</code> for production. Local dev
          defaults to <code className="font-mono">http://localhost:5000</code>.
        </div>
      )}
      {usingDevBackendDefault && (
        <div className="break-words border-t border-white/10 bg-navy/90 px-3 py-2 text-center text-[11px] text-white/50 sm:px-4 sm:text-xs">
          Using dev API default <code className="font-mono text-white/70">http://localhost:5000</code>
          {" — "}add <code className="font-mono">VITE_BACKEND_URL</code> in{" "}
          <code className="font-mono">.env</code> to override.
        </div>
      )}
    </>
  );
}
