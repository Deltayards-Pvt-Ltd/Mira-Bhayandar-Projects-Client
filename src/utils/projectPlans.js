/** Normalize admin `plans` array for display (e.g. "1 BHK · 2 BHK"). */
export function formatPlans(plans, separator = " · ") {
  const seen = new Set();
  const out = [];
  for (const item of plans || []) {
    const t = String(item || "").trim();
    if (t && !seen.has(t)) {
      seen.add(t);
      out.push(t);
    }
  }
  return out.join(separator);
}

/** Same as formatPlans but returns array (for chips, filters, etc.). */
export function normalizePlans(plans) {
  const seen = new Set();
  const out = [];
  for (const item of plans || []) {
    const t = String(item || "").trim();
    if (t && !seen.has(t)) {
      seen.add(t);
      out.push(t);
    }
  }
  return out;
}


