import { createContext, useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";

export const AppContext = createContext(null);

export default function AppContextProvider({ children }) {
  const [allProjects, setAllProjects] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [contactSettings, setContactSettings] = useState({
    phone1: "+91 98765 43210",
    phone2: "+91 98765 43211",
    whatsapp: "919876543210",
  });
  const [loading, setLoading] = useState(true);

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const getAllProjects = useCallback(async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/project/allProjects`);
      if (data?.success) setAllProjects(data.allProjects ?? []);
      else console.warn("getAllProjects:", data?.message);
    } catch (err) {
      console.error("getAllProjects failed:", err?.message || err);
    }
  }, [backendUrl]);

  const getTestimonials = useCallback(async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/testimonial/allTestimonials`);
      if (data?.success) setTestimonials(data.allTestimonials ?? []);
      else {
        console.warn("getTestimonials:", data?.message);
        setTestimonials([]);
      }
    } catch (err) {
      console.error("getTestimonials failed:", err?.message || err);
      setTestimonials([]);
    }
  }, [backendUrl]);

  const getBlogs = useCallback(async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/blog/allBlogs`);
      if (data?.success) setBlogs(data.allblogs ?? []);
      else {
        console.warn("getBlogs:", data?.message);
        setBlogs([]);
      }
    } catch (err) {
      console.error("getBlogs failed:", err?.message || err);
      setBlogs([]);
    }
  }, [backendUrl]);

  const getContactSettings = useCallback(async () => {
    const fallback = {
      phone1: "+91 98765 43210",
      phone2: "+91 98765 43211",
      whatsapp: "919876543210",
    };
    try {
      const { data } = await axios.get(`${backendUrl}/api/contact/settings`);
      if (data?.success && data.settings) {
        setContactSettings({
          phone1: data.settings.phone1 ?? "",
          phone2: data.settings.phone2 ?? "",
          whatsapp: String(data.settings.whatsapp ?? "").replace(/\D/g, "") || fallback.whatsapp,
        });
      } else {
        setContactSettings(fallback);
      }
    } catch (err) {
      console.error("getContactSettings failed:", err?.message || err);
      setContactSettings(fallback);
    }
  }, [backendUrl]);

  useEffect(() => {
    if (!backendUrl) {
      setTestimonials([]);
      setBlogs([]);
      setContactSettings({
        phone1: "+91 98765 43210",
        phone2: "+91 98765 43211",
        whatsapp: "919876543210",
      });
      setLoading(false);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        await Promise.all([
          getAllProjects(),
          getTestimonials(),
          getBlogs(),
          getContactSettings(),
        ]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [backendUrl, getAllProjects, getTestimonials, getBlogs, getContactSettings]);

  /** Build a full URL for an asset path stored in the DB (e.g. "uploads/projects/xyz.mp4"). */
  const assetUrl = useCallback(
    (path) => {
      if (!path) return "";
      if (/^https?:\/\//i.test(path)) return path;
      const clean = String(path).replace(/^\/+/, "");
      return backendUrl ? `${backendUrl}/${clean}` : `/${clean}`;
    },
    [backendUrl]
  );

  const value = useMemo(
    () => ({
      allProjects,
      testimonials,
      blogs,
      contactSettings,
      loading,
      backendUrl,
      assetUrl,
      refetchProjects: getAllProjects,
      refetchTestimonials: getTestimonials,
      refetchBlogs: getBlogs,
      refetchContactSettings: getContactSettings,
    }),
    [
      allProjects,
      testimonials,
      blogs,
      contactSettings,
      loading,
      backendUrl,
      assetUrl,
      getAllProjects,
      getTestimonials,
      getBlogs,
      getContactSettings,
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
