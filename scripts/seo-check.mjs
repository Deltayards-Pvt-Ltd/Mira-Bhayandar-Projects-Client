import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { DEFAULT_SITE_URL, toCanonicalUrl } from "../src/seo/site.js";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const errors = [];
const notes = [];

function fail(message) {
  errors.push(message);
}

function note(message) {
  notes.push(message);
}

function read(rel) {
  return fs.readFileSync(path.join(root, rel), "utf8");
}

const REQUIRED_SITEMAP_PATHS = [
  "/",
  "/projects",
  "/blogs",
  "/privacy",
  "/terms",
  "/projects/windermere",
  "/projects/mukundam",
  "/projects/ayodhya",
  "/projects/sky-avenue",
  "/projects/windsor",
  "/projects/sai-plaza",
  "/projects/sky-heights",
];

const INDEXABLE_PAGES = [
  "src/pages/Home.jsx",
  "src/pages/Projects.jsx",
  "src/pages/Blogs.jsx",
  "src/pages/BlogDetail.jsx",
  "src/pages/ProjectDetail.jsx",
  "src/pages/Privacy.jsx",
  "src/pages/Terms.jsx",
];

const robots = read("public/robots.txt");
if (!/User-agent:\s*\*/i.test(robots)) fail("robots.txt is missing User-agent: *");
if (!/Allow:\s*\//i.test(robots)) fail("robots.txt does not allow public crawling");
if (!robots.includes(`Sitemap: ${DEFAULT_SITE_URL}/sitemap.xml`)) {
  fail(`robots.txt sitemap is not ${DEFAULT_SITE_URL}/sitemap.xml`);
}
if (/Disallow:\s*\/(projects|blogs|assets|src)\b/i.test(robots)) {
  fail("robots.txt disallows a public or rendering path");
}

const html = read("index.html");
if (!html.includes("GTM-MWDMGRHK")) fail("GTM container ID changed");
if (!html.includes("G-W5YDNHQ7ND")) fail("GA4 measurement ID changed");
if (!html.includes("xpfksi2dqp")) fail("Microsoft Clarity ID changed");
if (/<meta[^>]+name=["']robots["'][^>]+noindex/i.test(html)) {
  fail("index.html has a noindex robots meta");
}
if (!/<title>[^<]+<\/title>/.test(html)) fail("index.html is missing a title");
if (!/name=["']description["']/.test(html)) fail("index.html is missing a meta description");

for (const rel of INDEXABLE_PAGES) {
  const source = read(rel);
  if (!source.includes("<Seo")) fail(`${rel} does not render <Seo>`);
}

const notFound = read("src/pages/NotFound.jsx");
if (!notFound.includes("noindex")) fail("NotFound page is missing noindex");
if (!notFound.includes("<h1")) fail("NotFound page is missing an H1");

const card = read("src/components/ProjectCard.jsx");
if (!card.includes("<Link") || !card.includes("detailPath")) {
  fail("ProjectCard is missing a crawlable project link");
}
if (card.includes('console.log("phonep"')) fail("ProjectCard still logs phone numbers");

for (const rel of ["src/components/ContactSection.jsx", "src/components/ProjectDetailEnquiry.jsx"]) {
  const source = read(rel);
  if (!source.includes("Thanks") || !source.includes("get back to you shortly")) {
    fail(`${rel} success message no longer matches GTM detection text`);
  }
}

const canonicalCases = [
  ["/", `${DEFAULT_SITE_URL}/`],
  ["/projects", `${DEFAULT_SITE_URL}/projects`],
  ["/projects/", `${DEFAULT_SITE_URL}/projects`],
  [`${DEFAULT_SITE_URL}/projects/windermere?utm_source=google&gclid=abc`, `${DEFAULT_SITE_URL}/projects/windermere`],
  ["/blogs/abc?fbclid=1#section", `${DEFAULT_SITE_URL}/blogs/abc`],
];
for (const [input, expected] of canonicalCases) {
  const actual = toCanonicalUrl(input, DEFAULT_SITE_URL);
  if (actual !== expected) fail(`canonical ${input} => ${actual}, expected ${expected}`);
}

const sitemapPath = path.join(root, "public", "sitemap.xml");
if (!fs.existsSync(sitemapPath)) {
  fail("public/sitemap.xml is missing");
} else {
  const xml = fs.readFileSync(sitemapPath, "utf8");
  const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
  const counts = new Map();
  for (const loc of locs) {
    counts.set(loc, (counts.get(loc) || 0) + 1);
    if (!loc.startsWith(`${DEFAULT_SITE_URL}/`)) fail(`sitemap URL is not on the preferred host: ${loc}`);
    if (loc.includes("?")) fail(`sitemap URL contains a query string: ${loc}`);
    if (/\/(admin|api|login|preview)\b/i.test(loc)) fail(`sitemap includes a non-public URL: ${loc}`);
  }
  for (const [loc, count] of counts) {
    if (count > 1) fail(`duplicate sitemap URL: ${loc}`);
  }
  for (const routePath of REQUIRED_SITEMAP_PATHS) {
    const loc = routePath === "/" ? `${DEFAULT_SITE_URL}/` : `${DEFAULT_SITE_URL}${routePath}`;
    if (!locs.includes(loc)) fail(`sitemap is missing ${loc}`);
  }
  note(`sitemap URLs: ${locs.length}`);
}

const srcDir = path.join(root, "src");
function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else if (entry.name.endsWith(".jsx")) out.push(full);
  }
  return out;
}

for (const file of walk(srcDir)) {
  const source = fs.readFileSync(file, "utf8");
  const imgs = source.match(/<img\b[\s\S]*?\/>/g) || [];
  for (const tag of imgs) {
    if (!/\balt=/.test(tag)) {
      fail(`img missing alt in ${path.relative(root, file)}`);
    }
  }
}

if (errors.length) {
  console.error("SEO check failed:");
  for (const message of errors) console.error(`- ${message}`);
} else {
  console.log("SEO check passed.");
}
for (const message of notes) console.log(`- ${message}`);
console.log(`Preferred host: ${DEFAULT_SITE_URL}`);
process.exit(errors.length ? 1 : 0);
