# Technical SEO audit

Production site audited: the public Vite + React client (`Mira-Bhayandar-Projects-Client`). Admin and API apps were inspected only to confirm they are not public indexable routes.

Preferred origin, verified live on 26 Sep 2026:

- `http://mirabhayandarproperty.com` → `https://mirabhayandarproperty.com` (308)
- `https://mirabhayandarproperty.com` → `https://www.mirabhayandarproperty.com` (307)
- `http://www.mirabhayandarproperty.com` → `https://www.mirabhayandarproperty.com` (308)
- `https://www.mirabhayandarproperty.com` → 200

Canonical host used everywhere: `https://www.mirabhayandarproperty.com`

## 1. Architecture found

- Public site: React 19.2, Vite 8, React Router 7, Tailwind 4, `react-helmet-async`
- Data: Axios against `VITE_BACKEND_URL` (`/api/project`, `/api/blog`, leads, contact settings)
- Hosting: Vercel SPA. `vercel.json` rewrites every path except `robots.txt` and `sitemap.xml` to `index.html`
- Head: GTM `GTM-MWDMGRHK`, GA4 `G-W5YDNHQ7ND`, Clarity `xpfksi2dqp` in `index.html`. Not modified
- Metadata: `src/components/Seo.jsx` plus `src/seo/*`
- Sitemap: `scripts/generate-sitemap.mjs` on `prebuild`, output `public/sitemap.xml`

## 2. Rendering method found

Fully client-side rendered. There is no SSR, SSG, or prerender step. Googlebot can render the JS bundle. The HTML shell is the same document for every route until React Helmet runs.

Prerendering was **not** added. Project and blog HTML depends on the API at request time. A build-time prerender would ship empty or stale pages whenever the API is down, which is worse than CSR. No bot-specific HTML was added.

## 3. Problems found

- Blog listing and blog posts had no `<Seo>`: no unique title, description, canonical, Open Graph, or Article schema
- Unknown URLs rendered an empty outlet under the homepage shell (soft 200). Live check: `GET /this-page-does-not-exist-seo-audit` returned `200 text/html`
- Missing project/article responses inherited the homepage `<title>` and had no `noindex`
- Canonical fallback used `window.location.href`, so UTMs and `gclid` could become the canonical
- Project cards navigated with `article onClick` + `navigate()`. Compact upcoming cards had **no** `<a href>`
- Listing pagination was `<button>` state, not a URL, so page 2+ links were invisible to crawlers
- Filter updates rebuilt the query string and dropped tracking parameters
- Blog listing was absent from the metadata system; privacy and terms were absent from the sitemap
- Sitemap generation replaced `sitemap.xml` with static URLs only when the API fetch failed
- Duplicate id `project-gallery-heading` on Quick Facts and Gallery
- Homepage storytelling used two `<h2>` elements for one headline
- Icon-only call / WhatsApp / menu controls lacked accessible names
- Gallery “Download Images” was a `<div onClick>`
- `index.html` title/description did not match the homepage Helmet tags
- Project and blog pages had no breadcrumb links or `BreadcrumbList`

Already in good shape before this pass: one `<main>`, nav/footer `<Link>`s, project/listing/legal H1s, project JSON-LD, homepage Organization + WebSite schema, `robots.txt` allow-all plus sitemap, self-canonicals on home/projects/privacy/terms, location cards as real links, form labels, success toast copy.

## 4. Files changed

- `index.html`
- `package.json`
- `public/sitemap.xml`
- `scripts/generate-sitemap.mjs`
- `scripts/seo-check.mjs` (new)
- `src/App.jsx`
- `src/components/Seo.jsx`
- `src/components/Breadcrumbs.jsx` (new)
- `src/components/BlogCard.jsx`
- `src/components/ExploreByLocation.jsx`
- `src/components/HeroCarousel.jsx`
- `src/components/Navbar.jsx`
- `src/components/ProjectCard.jsx`
- `src/components/ProjectDetailGallery.jsx`
- `src/components/ProjectDetailIntro.jsx`
- `src/components/ProjectDetailQuickFacts.jsx`
- `src/components/ProjectsPagination.jsx`
- `src/components/Storytelling.jsx`
- `src/pages/BlogDetail.jsx`
- `src/pages/Blogs.jsx`
- `src/pages/NotFound.jsx` (new)
- `src/pages/Privacy.jsx`
- `src/pages/ProjectDetail.jsx`
- `src/pages/Projects.jsx`
- `src/pages/Terms.jsx`
- `src/seo/blogSeo.js` (new)
- `src/seo/buildProjectJsonLd.js`
- `src/seo/projectsListingSeo.js`
- `src/seo/site.js` (new)
- `src/seo/structuredData.js` (new)
- `src/utils/projectsFilters.js`
- `SEO_TECHNICAL_AUDIT.md` (this file)

## 5. Fixes implemented

- Central canonical helper: absolute `https://www.mirabhayandarproperty.com`, no query, no hash, no trailing slash except `/`
- Browser URL is not rewritten, so `utm_*`, `gclid`, and `fbclid` stay available to GTM/GA4
- Filter changes on `/projects` keep those tracking params
- Unique metadata for blogs, blog posts, and the not-found states
- `noindex, follow` only for the real 404 route and for project/article responses that failed to load
- Crawlable `<Link>` on every project card title, including compact upcoming cards
- Card click ignores clicks that start on `<a>` or `<button>`, so `tel:` and WhatsApp clicks still bubble to GTM
- Pagination is `<a href>` (`/projects?page=2`, `/blogs?page=2`). Canonical stays the clean listing URL
- Breadcrumbs on project, blog, listing, privacy, and terms templates
- `BreadcrumbList` added beside existing schema, not instead of it
- Blog posts get `BlogPosting` only from real title, body, date, writer, and image fields
- JSON-LD is sanitized (no `undefined` / `null` / `[object Object]`) and `<` is escaped
- Invalid `datePosted` values are omitted
- Sitemap keeps previously generated project/blog URLs if the API is down, and now includes `/privacy` and `/terms`
- `npm run seo:check`

## 6. Routes audited

Indexable:

| Route | Notes |
| --- | --- |
| `/` | Homepage |
| `/projects` | All projects. `?area=`, `?config=`, `?propertyType=`, `?q=`, `?page=` are filters, canonical `/projects` |
| `/projects/:slug` | Live slugs in the sitemap, including windermere, mukundam, ayodhya, sky-avenue, windsor, sai-plaza, sky-heights, anandam, anjani-bliss, the-pentagon, anjani-one, skyline, opulence, kasturi-van |
| `/blogs` | Listing |
| `/blogs/:id` | Existing Mongo ids left unchanged |
| `/privacy` | |
| `/terms` | |

Not indexable:

- `*` client 404 (`noindex, follow`)
- Failed `/projects/:slug` and `/blogs/:id` (`noindex, follow`)
- Upcoming projects stay out of the sitemap (they are not on the main live listing). Their cards now have real links

There is no public admin, auth, preview, or search-results route on this client. Location “pages” are homepage links into `/projects?area=...`, not separate URLs.

## 7. Metadata changes

- Shell `<title>` and description now match the homepage Helmet copy, so the first HTML response and the rendered homepage agree
- `/blogs`: `All Blogs | Mira Bhayandar Property`
- Blog posts: article title, excerpt from the visible body, canonical `/blogs/:id`, cover image when the post has one
- Projects: existing data-built titles kept (`Name by Builder - plans in location`)
- Canonicals ignore `utm_*`, `gclid`, `fbclid`, and `page`
- Open Graph and Twitter tags follow the same title, description, URL, and image
- No extra GA/GTM tag was added

## 8. Heading fixes

- Homepage still has one H1: “The Ultimate Buffet Of Properties In Mira Bhayandar”
- The second storytelling line is a `<p>` with the same classes, not a second H2
- Project H1 stays the project name. Location stays in the address line under it. The H1 was not rewritten
- Blog H1 stays the article title
- Listing H1s stay “All Projects” and “All Blogs”
- Missing project/article/404 views now have one H1
- Quick Facts heading id is `project-quick-facts-heading` so it no longer duplicates the gallery id

## 9. Internal linking fixes

- Project name on every card is `<a href="/projects/{slug}">`
- Phone and WhatsApp hrefs are unchanged (`tel:+91…`, `https://wa.me/91…`)
- Pagination prev/next/page numbers are links
- Breadcrumbs: Home → Projects → project, and Home → All Blogs → article
- Nav, footer, location cards, featured “View all projects”, and blog cards were already `<Link>`
- Hero search stays a form submit. It is a filter action, not a page

## 10. Sitemap changes

`public/sitemap.xml` now has 23 URLs:

- Previous live project and blog URLs kept, including their existing `<lastmod>` values
- Added `https://www.mirabhayandarproperty.com/privacy` with `lastmod` `2026-06-11` (the effective date printed on the page)
- Added `/terms` with no `lastmod` (the page only says “July 2026”, so a day was not invented)
- Generator no longer wipes project URLs when `VITE_BACKEND_URL` is down or returns an empty payload
- Upcoming status is still excluded
- No query-string URLs

## 11. robots.txt changes

No edit. Current file already allows `/` and points at `https://www.mirabhayandarproperty.com/sitemap.xml`. It does not block JS, CSS, images, `/projects/`, or `/blogs/`.

## 12. Canonical changes

Every indexable template passes an explicit path. `Seo` turns that into:

`https://www.mirabhayandarproperty.com{path}`

Verified in the browser on the preview build:

- `/` → `https://www.mirabhayandarproperty.com/`
- `/projects?utm_source=seo-check&gclid=test` stayed in the address bar; canonical was `https://www.mirabhayandarproperty.com/projects`
- `/blogs` → `https://www.mirabhayandarproperty.com/blogs`

Project pages are not canonicalised to the homepage.

## 13. Structured-data changes

- Homepage `RealEstateAgent` + `WebSite` + `WebPage` graph left as-is
- Existing per-project `RealEstateListing` overrides left as-is
- `BreadcrumbList` appended on project pages, both generated and override graphs
- Projects and blogs listings: `CollectionPage` + `BreadcrumbList`
- Blog posts: `BlogPosting` + `BreadcrumbList` (headline, description, dates, author, image only when those fields exist)
- Privacy and terms: `WebPage` + `BreadcrumbList`
- No ratings, reviews, prices, offers, or Product schema were added
- Broken dates are dropped instead of emitting `Invalid Date`

## 14. Performance / CWV safe fixes

- Project banner and the first visible blog/project card image: `fetchpriority="high"`, not lazy
- Other card, blog, and location images: `loading="lazy"` plus width/height
- Decorative hero video: `aria-hidden`
- No image bytes were recompressed or replaced
- The existing Vite chunk-size warning was already present before this work

## 15. Deliberately not changed

- Routes, slugs, and blog Mongo ids
- Colours, spacing, type scale, and marketing copy
- GTM, GA4, Clarity, and the success toast `Thanks — we’ll get back to you shortly.`
- `tel:` and WhatsApp hrefs
- Vercel rewrite to `index.html` (see recommendations)
- Framework. No Next.js migration and no prerender
- Floor-plan tabs still show one layout image at a time. Dumping every plan into the page would change the layout
- Amenities “Show more” still hides items past 10 until clicked
- Upcoming projects stay out of the sitemap
- Client-side replace of a Mongo id URL with the slug was left as-is. A server 301 map was not added
- Partner marquee images stay `alt=""` (decorative duplicates of the same logos)
- Pre-existing ESLint `react-hooks/set-state-in-effect` findings were not refactored

## 16. Remaining recommendations

1. **HTTP status for unknown URLs.** Vercel serves `index.html` with 200 for every path so React Router refreshes work. The new 404 view is `noindex`, but the status is still 200. A true 404 needs an edge check against the live slug list. That was not added: if the API lookup fails, deep links would 404 for real users.
2. **Prerender or SSR** only if the API is a hard dependency of the build and failures abort the deploy instead of publishing empty HTML. Do not dynamic-render for Googlebot only.
3. **Server 301s** from `/projects/{mongoId}` to `/projects/{slug}` if those id URLs have impressions. The client already replaces them after fetch and canonicalises to the slug.
4. **Floor plans:** render inactive layout images in the DOM only if design can show them without a second visual state.
5. **Regenerate the sitemap in CI** with production `VITE_BACKEND_URL` so new projects enter `sitemap.xml` on deploy. Local builds now keep the last good file instead of deleting it.

## 17. Commands run

From `Mira-Bhayandar-Projects-Client`, before edits:

- `npx eslint .` — 26 errors, all pre-existing (`react-hooks/set-state-in-effect`, unused vars, `react-refresh/only-export-components`)
- `npx vite build` — success. Chunk larger than 500 kB (pre-existing warning)
- No `test` script exists

Live header checks:

- `curl.exe -sI` against apex and www, HTTP and HTTPS
- `curl.exe -sI` on `/robots.txt`, `/sitemap.xml`, and a nonsense path (200)

After edits:

- `node scripts/generate-sitemap.mjs` — API unreachable (`localhost:5000`); existing URLs preserved; 23 URLs written
- `node scripts/seo-check.mjs` — passed
- `npm run build` — success after the gallery JSX tag fix
- Preview at `http://127.0.0.1:4173` for `/`, `/projects?utm_source=seo-check&gclid=test`, `/blogs`, `/privacy`, `/projects/windermere`, `/this-page-does-not-exist`

## 18. Test / build results

- `npm run build`: success
- `npm run seo:check`: passed (23 sitemap URLs, preferred host, canonical helper, GTM/GA4/Clarity ids, success-toast strings, required project URLs)
- Lint on the edited surface: the 8 remaining errors in those files are the same pre-existing rules (BlogCard extra exports, unused `builderLogoSrc` / `priceLine`, setState-in-effect on project/blog fetch and project filters). The two pagination `setPage` effects that ESLint flagged were removed because page now comes from the URL
- Browser preview confirmed one H1, unique titles, clean canonicals, parsed JSON-LD, and `noindex` on the 404 and on a project URL while the API was down
- `/projects/windermere` could not render live project content in this environment because `VITE_BACKEND_URL` is `http://localhost:5000` and that server was not running. The success template itself was not redesigned: it still mounts the existing intro, facts, about, gallery, plans, RERA, and enquiry sections, now with breadcrumbs and the existing project SEO helpers

Tracking left intact:

- GTM `GTM-MWDMGRHK`
- GA4 `G-W5YDNHQ7ND`
- Clarity `xpfksi2dqp`
- Toast text containing “Thanks” and “get back to you shortly”
- `tel:+91` and `https://wa.me/91` hrefs
