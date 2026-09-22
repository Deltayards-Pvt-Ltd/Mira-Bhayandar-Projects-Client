function projectKey(project) {
  return project?.slug || project?._id || "project";
}

export function wasEnquirySubmitted(project) {
  try {
    return sessionStorage.getItem(`mbp-enquiry-submitted:${projectKey(project)}`) === "1";
  } catch {
    return false;
  }
}

export function markEnquirySubmitted(project) {
  try {
    sessionStorage.setItem(`mbp-enquiry-submitted:${projectKey(project)}`, "1");
  } catch {
    /* ignore quota / private mode */
  }
}

export function wasEnquiryPopupDismissed(project) {
  try {
    return sessionStorage.getItem(`mbp-enquiry-popup:${projectKey(project)}`) === "1";
  } catch {
    return false;
  }
}

export function markEnquiryPopupDismissed(project) {
  try {
    sessionStorage.setItem(`mbp-enquiry-popup:${projectKey(project)}`, "1");
  } catch {
    /* ignore quota / private mode */
  }
}

/** Follow a tel: or WhatsApp URL after the enquiry popup. */
export function followContactHref(href, newTab = false) {
  if (!href) return;
  if (newTab) {
    window.open(href, "_blank", "noopener,noreferrer");
    return;
  }
  window.location.assign(href);
}
