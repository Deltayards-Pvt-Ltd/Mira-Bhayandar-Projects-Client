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
  const [appLoading, setAppLoading] = useState(true);
  const [projectsLoading, setProjectsLoading] = useState(false);
  const [blogsLoading, setBlogsLoading] = useState(false);
  const [testimonialsLoading, setTestimonialsLoading] = useState(false);
  const [upcomingProjectsLoading, setUpcomingProjectsLoading] = useState(false);
  const [upcomingProjects, setUpcomingProjects] = useState([]);
  const [filterOptions, setFilterOptions] = useState({
    areas: [],
    configurations: [],
    propertyTypes: [],
  });

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const fetchFilterOptions = useCallback(async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/project/filter-options`);
      if (data?.success && data.filterOptions) {
        setFilterOptions({
          areas: data.filterOptions.areas ?? [],
          configurations: data.filterOptions.configurations ?? [],
          propertyTypes: data.filterOptions.propertyTypes ?? [],
        });
      } else {
        console.warn("fetchFilterOptions:", data?.message);
      }
    } catch (err) {
      console.error("fetchFilterOptions failed:", err?.message || err);
    }
  }, [backendUrl]);

  const getAllProjects = useCallback(async () => {
    if (!backendUrl) return;
    setProjectsLoading(true);
    try {
      const { data } = await axios.get(`${backendUrl}/api/project/allProjects`);
      if (data?.success) {
        setAllProjects(data.allProjects ?? []);
      } else {
        console.warn("getAllProjects:", data?.message);
      }
    } catch (err) {
      console.error("getAllProjects failed:", err?.message || err);
    } finally {
      setProjectsLoading(false);
    }
  }, [backendUrl]);

  const getTestimonials = useCallback(async () => {
    if (!backendUrl) return;
    setTestimonialsLoading(true);
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
    } finally {
      setTestimonialsLoading(false);
    }
  }, [backendUrl]);

  const getBlogs = useCallback(async () => {
    if (!backendUrl) return;
    setBlogsLoading(true);
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
    } finally {
      setBlogsLoading(false);
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


  const getUpcomingProjects = useCallback(async () => {
    if (!backendUrl) return;
    setUpcomingProjectsLoading(true);
    try {
      const { data } = await axios.get(`${backendUrl}/api/project/upcomingProjects`);
      if (data?.success) setUpcomingProjects(data.upcomingProjects ?? []);
    }
    catch (err) {
      console.error("getUpcomingProjects failed:", err?.message || err);
      setUpcomingProjects([]);
    }
    finally {
      setUpcomingProjectsLoading(false);
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
      setAppLoading(false);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        await Promise.all([fetchFilterOptions(), getContactSettings()]);
      } finally {
        if (!cancelled) setAppLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [backendUrl, fetchFilterOptions, getContactSettings]);

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
      upcomingProjects,
      upcomingProjectsLoading,
      filterOptions,
      appLoading,
      projectsLoading,
      blogsLoading,
      testimonialsLoading,
      /** @deprecated use appLoading / projectsLoading / blogsLoading instead */
      loading: appLoading,
      backendUrl,
      assetUrl,
      refetchProjects: getAllProjects,
      refetchFilterOptions: fetchFilterOptions,
      refetchTestimonials: getTestimonials,
      refetchBlogs: getBlogs,
      refetchContactSettings: getContactSettings,
      refetchUpcomingProjects: getUpcomingProjects,
    }),
    [
      allProjects,
      testimonials,
      blogs,
      contactSettings,
      upcomingProjects,
      upcomingProjectsLoading,
      filterOptions,
      appLoading,
      projectsLoading,
      blogsLoading,
      testimonialsLoading,
      backendUrl,
      assetUrl,
      getAllProjects,
      fetchFilterOptions,
      getTestimonials,
      getBlogs,
      getContactSettings,
      getUpcomingProjects,
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
