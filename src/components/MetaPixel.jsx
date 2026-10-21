import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

/** Send Meta PageView on client-side navigations. The first view is sent from index.html. */
export function MetaPixel() {
  const { pathname, search } = useLocation();
  const skipInitial = useRef(true);

  useEffect(() => {
    if (skipInitial.current) {
      skipInitial.current = false;
      return;
    }
    if (typeof window.fbq === "function") {
      window.fbq("track", "PageView");
    }
  }, [pathname, search]);

  return null;
}
