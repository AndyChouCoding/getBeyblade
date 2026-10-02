import "server-only";

import rawDrawsFile from "../../data/draws.json";
import rawStoresFile from "../../data/stores.json";
import { OTHER_PRODUCT, STORE_NAME_OVERRIDES, cleanName, priceFromName, resolveItem } from "./catalog";
import type { Draw, Product, RawDrawsFile, RawStore, Series, Store } from "./types";

const rawDraws = (rawDrawsFile as RawDrawsFile).draws;
const rawStores = rawStoresFile as RawStore[];

export const dataUpdatedAt = (rawDrawsFile as RawDrawsFile).updatedAt;

/** When the pages were rendered; client components use it until the real clock takes over. */
export const renderedAt = Date.now();

/** North → south, outlying islands last; unknown cities sort after these. */
export const CITY_ORDER = [
  "基隆市", "臺北市", "新北市", "桃園市", "新竹市", "新竹縣", "苗栗縣", "臺中市",
  "彰化縣", "南投縣", "雲林縣", "嘉義市", "嘉義縣", "臺南市", "高雄市", "屏東縣",
  "宜蘭縣", "花蓮縣", "臺東縣", "澎湖縣", "金門縣", "連江縣", "全台",
];

export function compareCity(a: string, b: string) {
  const ia = CITY_ORDER.indexOf(a);
  const ib = CITY_ORDER.indexOf(b);
  return (ia < 0 ? 999 : ia) - (ib < 0 ? 999 : ib) || a.localeCompare(b, "zh-Hant");
}

export const SERIES_ORDER: Series[] = ["UX", "CX", "BX", "BXG", "其他"];

// ---------- normalisation ----------

const stores: Store[] = rawStores
  .map((s) => ({
    id: s.id,
    name: STORE_NAME_OVERRIDES[s.id] ?? s.name,
    rawName: STORE_NAME_OVERRIDES[s.id] ? s.name : null,
    city: s.city,
    fbUrl: s.fbUrl,
    enabled: s.enabled,
    note: s.note ?? null,
  }))
  .sort((a, b) => compareCity(a.city, b.city) || a.name.localeCompare(b.name, "zh-Hant"));

const storeById = new Map(stores.map((s) => [s.id, s]));
const productBySlug = new Map<string, Product>();

const draws: Draw[] = rawDraws.map((d) => {
  const store = storeById.get(d.storeId);
  const draw: Draw = {
    id: d.id,
    storeId: d.storeId,
    storeName: store?.name ?? d.storeName,
    city: store?.city ?? d.city,
    postUrl: d.postUrl,
    drawStart: d.drawStart,
    drawEnd: d.drawEnd,
    items: [],
    extraLinks: [],
    scrapedAt: d.scrapedAt,
  };
  for (const item of d.items) {
    const resolved = resolveItem(item.code, item.name);
    if (resolved.kind === "link") {
      if (item.url) draw.extraLinks.push({ label: resolved.label, url: item.url });
      continue;
    }
    const p = resolved.product;
    if (!productBySlug.has(p.slug)) productBySlug.set(p.slug, p);
    draw.items.push({
      productSlug: p.slug,
      code: p.code,
      name: p === OTHER_PRODUCT ? cleanName(item.name) : p.name,
      rawName: item.name,
      price: item.price ?? priceFromName(item.name),
      url: item.url,
    });
  }
  return draw;
});

/** Newest draw first by start time; undated draws last. */
draws.sort((a, b) => (b.drawStart ?? "").localeCompare(a.drawStart ?? ""));

const rawTextById = new Map(rawDraws.map((d) => [d.id, d.rawText]));

// ---------- queries ----------

export function getDraws() {
  return draws;
}

export function getDraw(id: string) {
  const draw = draws.find((d) => d.id === id);
  return draw ? { ...draw, rawText: rawTextById.get(id) ?? "" } : null;
}

export function getStores() {
  return stores;
}

export function getStore(id: string) {
  return storeById.get(id) ?? null;
}

export function getDrawsByStore(storeId: string) {
  return draws.filter((d) => d.storeId === storeId);
}

export interface StoreSummary extends Store {
  drawCount: number;
  lastDrawStart: string | null;
}

export function getStoreSummaries(): StoreSummary[] {
  return stores.map((s) => {
    const own = draws.filter((d) => d.storeId === s.id);
    return { ...s, drawCount: own.length, lastDrawStart: own.find((d) => d.drawStart)?.drawStart ?? null };
  });
}

export interface ProductSummary extends Product {
  drawCount: number;
  storeCount: number;
  /** Most frequently quoted price, when any store listed one */
  price: number | null;
  lastDrawStart: string | null;
}

function mode(values: number[]): number | null {
  if (!values.length) return null;
  const counts = new Map<number, number>();
  for (const v of values) counts.set(v, (counts.get(v) ?? 0) + 1);
  return [...counts].sort((a, b) => b[1] - a[1] || a[0] - b[0])[0][0];
}

export function getProductSummaries(): ProductSummary[] {
  return [...productBySlug.values()]
    .map((p) => {
      const withItem = draws.filter((d) => d.items.some((i) => i.productSlug === p.slug));
      const prices = withItem.flatMap((d) =>
        d.items.filter((i) => i.productSlug === p.slug && i.price != null).map((i) => i.price!),
      );
      return {
        ...p,
        drawCount: withItem.length,
        storeCount: new Set(withItem.map((d) => d.storeId)).size,
        price: mode(prices),
        lastDrawStart: withItem.find((d) => d.drawStart)?.drawStart ?? null,
      };
    })
    .sort(
      (a, b) =>
        SERIES_ORDER.indexOf(a.series) - SERIES_ORDER.indexOf(b.series) ||
        (a.code ?? "").localeCompare(b.code ?? "", "en", { numeric: true }) ||
        a.slug.localeCompare(b.slug),
    );
}

export function getProduct(slug: string) {
  return getProductSummaries().find((p) => p.slug === slug) ?? null;
}

export function getDrawsByProduct(slug: string) {
  return draws.filter((d) => d.items.some((i) => i.productSlug === slug));
}

export function getCities() {
  return [...new Set(stores.map((s) => s.city))].sort(compareCity);
}

// ---------- data audit (shown on /stats) ----------

export function getAudit() {
  const drawStoreIds = new Set(rawDraws.map((d) => d.storeId));
  const items = rawDraws.flatMap((d) => d.items);
  const namesByCode = new Map<string, Set<string>>();
  for (const i of items) {
    if (!i.code) continue;
    if (!namesByCode.has(i.code)) namesByCode.set(i.code, new Set());
    namesByCode.get(i.code)!.add(i.name);
  }
  const dup = <T,>(xs: T[]) => xs.length - new Set(xs).size;

  return {
    storeCount: rawStores.length,
    enabledStoreCount: rawStores.filter((s) => s.enabled).length,
    drawCount: rawDraws.length,
    storesWithDraws: drawStoreIds.size,
    itemCount: items.length,
    codeCount: namesByCode.size,
    productCount: productBySlug.size,
    duplicateStoreIds: dup(rawStores.map((s) => s.id)),
    duplicateDrawIds: dup(rawDraws.map((d) => d.id)),
    duplicatePostUrls: dup(rawDraws.map((d) => d.postUrl)),
    orphanDraws: rawDraws.filter((d) => !storeById.has(d.storeId)).length,
    nameOrCityMismatch: rawDraws.filter((d) => {
      const s = rawStores.find((x) => x.id === d.storeId);
      return s && (s.name !== d.storeName || s.city !== d.city);
    }).length,
    storesWithoutDraws: stores.filter((s) => !drawStoreIds.has(s.id)),
    renamedStores: stores.filter((s) => s.rawName),
    undatedDraws: draws.filter((d) => !d.drawStart || !d.drawEnd),
    uncodedItems: items.filter((i) => !i.code).length,
    codesWithSpellingVariants: [...namesByCode.values()].filter((s) => s.size > 1).length,
    itemsWithoutPrice: items.filter((i) => i.price == null).length,
  };
}
