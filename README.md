# World Countries Explorer

A **server-side rendered (SSR)** Next.js website built for SEO. It shows country and region pages with dynamic meta tags, JSON-LD schema, and OpenGraph for search and social sharing. Data comes from a **static JSON file** (no external API needed).

---

## What This Project Does (In Simple Terms)

1. **Home page** — Lists many countries in a grid. You can search by name/capital and filter by region (Americas, Europe, Asia, etc.).
2. **Country pages** — Click any country to see a detail page: population, capital, languages, currencies, flag, and a link to its region.
3. **Region pages** — Click “Regions” or a region link to see all countries in that region (e.g. “Countries in Europe”).
4. **SEO** — Every page has a unique title and description, plus JSON-LD and OpenGraph so search engines and social shares look good.

All of this is **server-rendered**: the HTML is built on the server so it’s good for SEO and fast to load.

---

## What Was Built (For Someone Reviewing the Code)

### 1. **Data layer**

- **`lib/data/countries.json`** — Static list of ~35 countries. Each has: name, codes (cca2/cca3), region, population, capital, flag URL, languages, currencies, area, etc. Same shape as the old REST Countries API so the rest of the app doesn’t care where data comes from.
- **`lib/countries.ts`** — Single source of truth for “get countries data”:
  - Imports the JSON and caches it in memory.
  - **`getAllCountries()`** — Returns all countries (used on home and for regions).
  - **`getCountryByCode(code)`** — Returns one country by 2-letter or 3-letter code (e.g. `US`, `USA`).
  - **`getCountriesByRegion(region)`** — Returns countries in a region (e.g. `Europe`).
  - **`getRegions()`** — Returns the list of unique regions (for the regions index page).
  - **`toCardData()`** / **`formatPopulation()`** — Helpers for the UI.
- **`types/country.ts`** — TypeScript types for a country (name, cca2, cca3, region, population, capital, flags, languages, currencies, etc.) and for the card view.

So: **data lives in JSON → read by `lib/countries.ts` → used by pages and components.** No API calls at runtime.

### 2. **Pages (App Router, server-rendered)**

- **`app/layout.tsx`** — Root layout: default SEO metadata, font (DM Sans), global header, and main content area.
- **`app/page.tsx`** — **Home**: calls `getAllCountries()`, maps to card data, renders **CountryGrid** (list + search/filter).
- **`app/country/[code]/page.tsx`** — **Dynamic country page** (e.g. `/country/fr`, `/country/usa`):
  - Uses **`generateMetadata()`** to set title, description, OpenGraph, and Twitter from the country data.
  - Fetches the country with **`getCountryByCode(params.code)`**.
  - Renders JSON-LD (Schema.org `Country`) and the country detail (flag, name, region, population, capital, languages, currencies, etc.). Links to the region page.
- **`app/region/[region]/page.tsx`** — **Dynamic region page** (e.g. `/region/Europe`):
  - **`generateMetadata()`** for title/description/OG for that region.
  - **`getCountriesByRegion(region)`** to get the list, then renders JSON-LD (Schema.org `Place`) and **CountryGrid** (no search/filter on this page).
- **`app/regions/page.tsx`** — **Regions index**: lists all regions (from **`getRegions()`**) as links to `/region/[region]`.
- **`app/not-found.tsx`** — Simple 404 with a link back home.

So: **each URL is tied to a page that loads data on the server and renders HTML + metadata.** That’s the “SSR” and “programmatic SEO” part.

### 3. **SEO**

- **`lib/seo.ts`** — Helpers used by the pages:
  - **`buildCountryMetadata()`** — Builds Next.js `Metadata` (title, description, openGraph, twitter, canonical) for a country page.
  - **`buildRegionMetadata()`** — Same for a region page.
  - **`buildCountryJsonLd()`** / **`buildRegionJsonLd()`** — Build JSON-LD objects for Schema.org (Country and Place).
  - **`defaultMetadata`** — Default site title/description and base URL for the layout.

So: **every country and region page gets the right meta tags and JSON-LD** so search engines and social previews understand the content.

### 4. **UI components**

- **`components/Header.tsx`** — Sticky header with “World Countries” and links to “All countries” and “Regions”.
- **`components/CountryCard.tsx`** — One country card: flag image, name, region, capital, population, link to `/country/[cca2]`.
- **`components/CountryGrid.tsx`** — Client component: renders a grid of **CountryCard** and optionally a **search input** and **region dropdown** to filter the list (used on home; region page uses the same grid without filters).

So: **home and region pages show cards; country page shows one country’s details.** Search/filter is client-side for interactivity; data loading is server-side.

### 5. **Styling and config**

- **`app/globals.css`** — Tailwind setup, CSS variables for light/dark, focus styles for accessibility.
- **`next.config.ts`** — Next.js config; **`images.remotePatterns`** allows loading flag images from `flagcdn.com` (and similar) so **next/image** works.
- **`tsconfig.json`** — **`resolveJsonModule: true`** so we can `import countriesData from "./data/countries.json"`.

---

## How Data Flows (Quick Summary)

```
lib/data/countries.json
        ↓
lib/countries.ts (getAllCountries, getCountryByCode, getCountriesByRegion, getRegions)
        ↓
app/page.tsx, app/country/[code]/page.tsx, app/region/[region]/page.tsx, app/regions/page.tsx
        ↓
components (Header, CountryCard, CountryGrid)
        ↓
HTML + metadata sent to the browser (SSR)
```

- **Home:** Load all countries → show grid with search/filter.
- **Country page:** Load one country by code → show detail + SEO metadata + JSON-LD.
- **Region page:** Load countries in that region → show grid + SEO metadata + JSON-LD.
- **Regions page:** Load list of regions → show links to each region page.

---

## Tech stack

- **Next.js 16** (App Router) — Routing and server rendering.
- **React 19** — UI.
- **TypeScript** — Types in `types/country.ts` and across the app.
- **Tailwind CSS 4** — Styling.

---

## How to Run This Project

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Start the dev server**
   ```bash
   npm run dev
   ```
   Then open [http://localhost:3000](http://localhost:3000).

3. **Build for production**
   ```bash
   npm run build
   npm start
   ```

No API keys or env vars are required; everything runs off the JSON file.

---

## Project structure (reference)

```
kraftlab/
├── app/
│   ├── layout.tsx              # Root layout + default SEO
│   ├── page.tsx                # Home: all countries + search/filter
│   ├── not-found.tsx           # 404 page
│   ├── country/[code]/page.tsx # One country (SSR, JSON-LD, OG)
│   ├── region/[region]/page.tsx# One region (SSR, JSON-LD, OG)
│   └── regions/page.tsx        # List of regions
├── components/
│   ├── Header.tsx
│   ├── CountryCard.tsx
│   └── CountryGrid.tsx         # Grid + optional search/filter
├── lib/
│   ├── countries.ts            # Data access (JSON + helpers)
│   ├── seo.ts                  # Metadata + JSON-LD builders
│   └── data/
│       └── countries.json      # Static country data
├── types/
│   └── country.ts              # Country + CountryCardData types
├── public/
├── next.config.ts
├── package.json
└── README.md
```

---

## SEO (what’s implemented)

- **Per-page title and meta description** (e.g. “France - Population, Capital & Facts | World Countries Explorer”).
- **JSON-LD** — Country pages: Schema.org `Country`; region pages: `Place`.
- **OpenGraph** — title, description, image (country flag where relevant), URL, type.
- **Twitter cards** — summary/summary_large_image with title, description, image.
- **Canonical URLs** — So search engines know the preferred URL for each page.

---

## Deployment (e.g. Vercel)

1. Push the repo to GitHub.
2. In Vercel, import the repo and deploy (default Next.js settings are fine).
3. Optional: set **`NEXT_PUBLIC_BASE_URL`** to your live URL (e.g. `https://your-app.vercel.app`) for correct canonical and OpenGraph URLs.

---

## License

MIT.
