import { useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";

/** Navigate home and scroll to contact section (id site-contact). */
export function useScrollToSiteContact() {
  const navigate = useNavigate();
  const location = useLocation();

  return useCallback(
    (e) => {
      e?.preventDefault?.();
      const run = () => {
        document
          .getElementById("site-contact")
          ?.scrollIntoView({ behavior: "smooth", block: "start" });
      };
      if (location.pathname === "/") {
        run();
      } else {
        navigate("/");
        window.setTimeout(run, 200);
      }
    },
    [location.pathname, navigate]
  );
}
