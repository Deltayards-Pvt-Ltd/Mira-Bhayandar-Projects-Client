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
  { path: "/privacy", priority: "0.3", changefreq: "yearly", lastmod: "2026-06-11" },
  { path: "/terms", priority: "0.3", changefreq: "yearly" },
];

function parseExistingEntries(xml) {
  const entries = [];
  const blocks = String(xml || "").match(/<url>[\s\S]*?<\/url>/g) || [];
  for (const block of blocks) {
    const loc = block.match(/<loc>([^<]+)<\/loc>/)?.[1];
    if (!loc) continue;
    entries.push({
      loc,
      lastmod: block.match(/<lastmod>([^<]+)<\/lastmod>/)?.[1] || null,
      changefreq: block.match(/<changefreq>([^<]+)<\/changefreq>/)?.[1] || "weekly",
      priority: block.match(/<priority>([^<]+)<\/priority>/)?.[1] || "0.5",
    });
  }
  return entries;
}

const entries = [];
const seen = new Set();

function pushEntry(loc, lastmod, changefreq, priority) {
  if (!loc || seen.has(loc)) return;
  seen.add(loc);
  entries.push(urlEntry(loc, lastmod, changefreq, priority));
}

for (const p of staticPages) {
  pushEntry(`${siteUrl}${p.path}`, p.lastmod || null, p.changefreq, p.priority);
}

let fetched = false;
let dynamicCount = 0;

if (backendUrl) {
  try {
    const [projectsRes, blogsRes] = await Promise.all([
      fetchJson(`${backendUrl}/api/project/allProjects`),
      fetchJson(`${backendUrl}/api/blog/allBlogs`),
    ]);

    const projects = (projectsRes?.allProjects ?? []).filter(
      (p) => p?.active !== false && String(p?.status ?? "") !== "Upcoming",
    );
    const blogs = blogsRes?.allblogs ?? [];

    if (projects.length === 0 && blogs.length === 0) {
      throw new Error("API returned no projects or blogs");
    }

    for (const p of projects) {
      const slug = String(p?.slug ?? "").trim() || String(p?._id ?? "").trim();
      if (!slug) continue;
      pushEntry(
        `${siteUrl}/projects/${slug}`,
        toLastmod(p.updatedAt || p.createdAt),
        "weekly",
        "0.8",
      );
      dynamicCount += 1;
    }

    for (const b of blogs) {
      const id = String(b?._id ?? "").trim();
      if (!id) continue;
      pushEntry(
        `${siteUrl}/blogs/${id}`,
        toLastmod(b.updatedAt || b.date || b.createdAt),
        "monthly",
        "0.6",
      );
      dynamicCount += 1;
    }

    fetched = true;
    console.log(`Sitemap: ${projects.length} projects, ${blogs.length} blogs`);
  } catch (err) {
    console.warn("Sitemap: could not fetch from backend, keeping existing URLs.", err.message);
  }
} else {
  console.warn("Sitemap: VITE_BACKEND_URL not set — keeping existing project and blog URLs.");
}

if (!fetched && fs.existsSync(outPath)) {
  const existing = parseExistingEntries(fs.readFileSync(outPath, "utf8"));
  for (const entry of existing) {
    if (!entry.loc.startsWith(`${siteUrl}/`)) continue;
    pushEntry(entry.loc, entry.lastmod, entry.changefreq, entry.priority);
    dynamicCount += 1;
  }
  console.log(`Sitemap: preserved existing URLs (${entries.length} total).`);
}

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.join("\n")}
</urlset>
`;

fs.writeFileSync(outPath, xml, "utf8");
console.log(`Wrote ${outPath}`);
