# Changelog

## [Unreleased]
### Added
- Group search results by product: searching a code/name/spelling (e.g. "ux15", "鯊魚包") or picking a product shows one block per product listing every store's draw link; blocks follow the status tabs and city filter
- Mark opened draw links as "已開啟" (stored in the browser), with a button to clear the marks

### Fixed

### Changed
- Search ignores case, spaces and hyphens in product codes

## [v1.0.0] - 2026-10-02
### Added
- Initialize Next.js (App Router) + TypeScript + Tailwind CSS project
- Add raw source data `data/stores.json` and `data/draws.json`
- Add data layer: product catalog with canonical names per code, store name fixes, draw status helpers
- Add site layout, header navigation, light/dark theme tokens and shared draw components
- Add draws page with status tabs, city/product filters, search and live countdowns
- Add draw detail page with full item list and original post text
- Add store directory grouped by city with search, and store detail pages listing each store's draws
- Add product catalog grouped by series with open-draw counts, and product detail pages with merged spelling variants
- Add stats page with summary tiles, bar charts (draws by city/day, top products, items by series) and a data audit checklist
- Add 404 page and site icon
- Add README with data cleaning rules, data update and Vercel deployment steps

### Fixed
- Correct 4 draws whose end time was scraped as equal to the start time (end time taken from the post text); treat any end time not after the start as unknown

