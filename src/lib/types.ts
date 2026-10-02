// Raw shapes as produced by the scraper (data/*.json)

export interface RawStore {
  id: string;
  name: string;
  city: string;
  fbUrl: string;
  enabled: boolean;
  note?: string;
}

export interface RawItem {
  code: string | null;
  name: string;
  price: number | null;
  url: string | null;
}

export interface RawDraw {
  id: string;
  storeId: string;
  storeName: string;
  city: string;
  postUrl: string;
  drawStart: string | null;
  drawEnd: string | null;
  items: RawItem[];
  rawText: string;
  scrapedAt: string;
}

export interface RawDrawsFile {
  updatedAt: string;
  draws: RawDraw[];
}

// Normalized shapes used by the UI

export type Series = "BX" | "UX" | "CX" | "BXG" | "其他";

export interface Product {
  slug: string;
  code: string | null;
  name: string;
  series: Series;
}

export interface DrawItem {
  productSlug: string;
  code: string | null;
  name: string;
  /** Name as written in the original post */
  rawName: string;
  price: number | null;
  url: string | null;
}

export interface Store {
  id: string;
  name: string;
  /** Name as written in stores.json, when it was cleaned up */
  rawName: string | null;
  city: string;
  fbUrl: string;
  enabled: boolean;
  note: string | null;
}

export interface Draw {
  id: string;
  storeId: string;
  storeName: string;
  city: string;
  postUrl: string;
  drawStart: string | null;
  drawEnd: string | null;
  items: DrawItem[];
  /** Links in the post that are not products (e.g. the LINE official account) */
  extraLinks: { label: string; url: string }[];
  scrapedAt: string;
}

export type DrawStatus = "active" | "upcoming" | "ended" | "unscheduled";
