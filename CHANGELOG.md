# Changelog

## [Unreleased]
### Added
- Initialize Next.js (App Router) + TypeScript + Tailwind CSS project
- Add raw source data `data/stores.json` and `data/draws.json`
- Add data layer: product catalog with canonical names per code, store name fixes, draw status helpers
- Add site layout, header navigation, light/dark theme tokens and shared draw components
- Add draws page with status tabs, city/product filters, search and live countdowns
- Add draw detail page with full item list and original post text
- Add store directory grouped by city with search, and store detail pages listing each store's draws
- Add product catalog grouped by series with open-draw counts, and product detail pages with merged spelling variants

### Fixed
- Correct 4 draws whose end time was scraped as equal to the start time (end time taken from the post text); treat any end time not after the start as unknown

### Changed
