import { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { AppContext } from "../context/AppContext";
import ProjectDetailIntro from "../components/ProjectDetailIntro";
import ProjectDetailQuickFacts from "../components/ProjectDetailQuickFacts";
import ProjectDetailAbout from "../components/ProjectDetailAbout";
import ProjectDetailPlans from "../components/ProjectDetailPlans";
import ProjectDetailGallery from "../components/ProjectDetailGallery";
import ProjectDetailEnquiry from "../components/ProjectDetailEnquiry";

export default function ProjectDetail() {
  const { id } = useParams();
  const ctx = useContext(AppContext);
  const backendUrl = ctx?.backendUrl ?? "";
  const assetUrl = ctx?.assetUrl ?? ((p) => p ?? "");

  const [project, setProject] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id || !backendUrl) {
      setLoading(false);
      if (!backendUrl) setError("");
      else setError("Missing project id.");
      setProject(null);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError("");
    (async () => {
      try {
        const { data } = await axios.get(`${backendUrl}/api/project/${id}`);
        if (cancelled) return;
        if (data?.success && data.project) {
          setProject(data.project);
          setError("");
        } else {
          setProject(null);
          setError(data?.message || "Could not load project.");
        }
      } catch (e) {
        if (cancelled) return;
        setProject(null);
        const msg = e?.response?.data?.message || e?.message || "Failed to load project.";
        setError(msg);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [id, backendUrl]);

  if (!backendUrl) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center text-cream/80">
        <p className="text-sm">
          Configure <code className="font-mono text-gold-light">VITE_BACKEND_URL</code> to load
          projects.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center px-4 pt-[calc(5.5rem+env(safe-area-inset-top,0px))] text-cream/70 sm:pt-28 md:pt-32">
        <p className="text-sm tracking-wide">Loading project…</p>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 pt-[calc(5.5rem+env(safe-area-inset-top,0px))] text-center sm:pt-28 md:pt-32">
        <p className="text-cream/80">{error || "Project not found."}</p>
        <Link
          to="/projects"
          className="mt-6 inline-block text-sm font-semibold uppercase tracking-wider text-gold-light hover:text-gold"
        >
          ← Back to projects
        </Link>
      </div>
    );
  }

  return (
    <>
      <ProjectDetailIntro project={project} assetUrl={assetUrl} />
      <ProjectDetailQuickFacts project={project} />
      <ProjectDetailAbout project={project} />
      <ProjectDetailGallery project={project} assetUrl={assetUrl} />
      <ProjectDetailPlans project={project} assetUrl={assetUrl} />
      <ProjectDetailEnquiry project={project} />
    </>
  );
}
