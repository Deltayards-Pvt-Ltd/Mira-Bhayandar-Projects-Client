import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, "..");
const outPath = path.join(rootDir, "public", "sitemap.xml");

function loadEnvFile(name) {
  const filePath = path.join(rootDir, name);
  if (!fs.existsSync(filePath)) return;
  for (const line of fs.readFileSync(filePath, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const i = trimmed.indexOf("=");
    if (i === -1) continue;
    const key = trimmed.slice(0, i).trim();
    let val = trimmed.slice(i + 1).trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    if (!(key in process.env)) process.env[key] = val;
  }
}

loadEnvFile(".env");
loadEnvFile(".env.local");

const siteUrl = (process.env.VITE_SITE_URL || "https://www.mirabhayandarproperty.com").replace(
  /\/+$/,
  "",
);
const backendUrl = (process.env.VITE_BACKEND_URL || "").replace(/\/+$/, "");

function xmlEscape(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function urlEntry(loc, lastmod, changefreq = "weekly", priority = "0.8") {
  const parts = [`  <url>`, `    <loc>${xmlEscape(loc)}</loc>`];
  if (lastmod) parts.push(`    <lastmod>${lastmod}</lastmod>`);
  parts.push(`    <changefreq>${changefreq}</changefreq>`);
  parts.push(`    <priority>${priority}</priority>`, `  </url>`);
  return parts.join("\n");
}

function toLastmod(date) {
  if (!date) return null;
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return null;
  return d.toISOString().slice(0, 10);
}

async function fetchJson(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return res.json();
}

const staticPages = [
  { path: "/", priority: "1.0", changefreq: "daily" },
  { path: "/projects", priority: "0.9", changefreq: "daily" },
  { path: "/blogs", priority: "0.7", changefreq: "weekly" },
];

const entries = staticPages.map((p) =>
  urlEntry(`${siteUrl}${p.path}`, null, p.changefreq, p.priority),
);

if (backendUrl) {
  try {
    const [projectsRes, blogsRes] = await Promise.all([
      fetchJson(`${backendUrl}/api/project/allProjects`),
      fetchJson(`${backendUrl}/api/blog/allBlogs`),
    ]);

    const projects = (projectsRes?.allProjects ?? []).filter(
      (p) => p?.active !== false && String(p?.status ?? "") !== "Upcoming",
    );

    for (const p of projects) {
      const slug = String(p?.slug ?? "").trim() || String(p?._id ?? "").trim();
      if (!slug) continue;
      entries.push(
        urlEntry(
          `${siteUrl}/projects/${slug}`,
          toLastmod(p.updatedAt || p.createdAt),
          "weekly",
          "0.8",
        ),
      );
    }

    for (const b of blogsRes?.allblogs ?? []) {
      const id = String(b?._id ?? "").trim();
      if (!id) continue;
      entries.push(
        urlEntry(
          `${siteUrl}/blogs/${id}`,
          toLastmod(b.updatedAt || b.date || b.createdAt),
          "monthly",
          "0.6",
        ),
      );
    }

    console.log(`Sitemap: ${projects.length} projects, ${(blogsRes?.allblogs ?? []).length} blogs`);
  } catch (err) {
    console.warn("Sitemap: could not fetch from backend, static pages only.", err.message);
  }
} else {
  console.warn("Sitemap: VITE_BACKEND_URL not set — static pages only.");
}

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.join("\n")}
</urlset>
`;

fs.writeFileSync(outPath, xml, "utf8");
console.log(`Wrote ${outPath}`);
