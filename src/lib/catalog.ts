import type { Product, Series } from "./types";

/**
 * Canonical product names, keyed by product code.
 *
 * Store posts spell the same product many ways (typos, prices, "售價" suffixes,
 * "抽抽包" nicknames), so the UI shows the canonical name and keeps the original
 * spelling as `rawName`. A few codes (the "-00" collabs/limited items) cover
 * several different products; those are told apart by matching the raw name.
 */
interface Variant {
  slug: string;
  name: string;
  match?: RegExp;
}

const CATALOG: Record<string, Variant[]> = {
  "BX-00": [
    { slug: "bx-00-dransword-v2", name: "蒼龍神劍 3-60F V2", match: /蒼龍神劍/ },
    { slug: "bx-00-pegasus", name: "暴風天馬 3-70RA", match: /天馬/ },
  ],
  "BX-08": [{ slug: "bx-08", name: "三合一對戰組" }],
  "BX-09": [{ slug: "bx-09", name: "戰鬥陀螺X 通行證" }],
  "BX-10": [{ slug: "bx-10", name: "極限衝擊戰鬥盤" }],
  "BX-13": [{ slug: "bx-13", name: "騎士長槍" }],
  "BX-16": [{ slug: "bx-16", name: "王蛇鞭尾 隨機強化組" }],
  "BX-18": [{ slug: "bx-18", name: "X旋風發射器" }],
  "BX-26": [{ slug: "bx-26", name: "獨角刺心" }],
  "BX-33": [{ slug: "bx-33", name: "皓戰猛虎" }],
  "BX-35": [{ slug: "bx-35", name: "隨機強化組 Vol.4" }],
  "BX-36": [{ slug: "bx-36", name: "巨鯨怒濤 隨機強化組" }],
  "BX-37": [{ slug: "bx-37", name: "雙重極限衝擊戰鬥盤 豪華組" }],
  "BX-38": [{ slug: "bx-38", name: "赫燃天鳳" }],
  "BX-40": [{ slug: "bx-40", name: "發射器（酒紅・左迴旋）" }],
  "BX-44": [{ slug: "bx-44", name: "三角強襲" }],
  "BX-45": [{ slug: "bx-45", name: "武士魂斬" }],
  "BX-48": [{ slug: "bx-48", name: "隨機強化組 Vol.9" }],
  "BX-50": [{ slug: "bx-50", name: "天堂日輪 隨機強化組" }],
  "BX-51": [{ slug: "bx-51", name: "旋風發射器（黑綠）" }],
  "BXG-01": [{ slug: "bxg-01", name: "烈焰飛鳳S" }],
  "BXG-04": [{ slug: "bxg-04", name: "銀牙烈虎S" }],
  "BXG-22": [{ slug: "bxg-22", name: "龍騎士S" }],
  "CX-00": [
    { slug: "cx-00-eva", name: "新世紀福音戰士改造組", match: /福音|EVA/i },
    { slug: "cx-00-ultraman", name: "迪卡狂怒 FT3-60T（超人力霸王聯名）", match: /迪卡|迪迦|超人力霸王|狂怒/ },
  ],
  "CX-01": [{ slug: "cx-01", name: "蒼龍勇氣" }],
  "CX-02": [{ slug: "cx-02", name: "魔導至尊" }],
  "CX-03": [{ slug: "cx-03", name: "英仙幽冥" }],
  "CX-05": [{ slug: "cx-05", name: "隨機強化組 Vol.6" }],
  "CX-06": [{ slug: "cx-06", name: "極狐九尾 隨機強化組" }],
  "CX-07": [{ slug: "cx-07", name: "天馬爆擊" }],
  "CX-08": [{ slug: "cx-08", name: "隨機強化組 Vol.7" }],
  "CX-11": [{ slug: "cx-11", name: "帝王威能" }],
  "CX-12": [{ slug: "cx-12", name: "鳳凰閃焰" }],
  "CX-13": [{ slug: "cx-13", name: "龍王閃擊" }],
  "CX-14": [{ slug: "cx-14", name: "騎士堡壘" }],
  "CX-15": [{ slug: "cx-15", name: "邪神狂怒" }],
  "CX-16": [{ slug: "cx-16", name: "極限衝擊對戰組 C" }],
  "CX-17": [{ slug: "cx-17", name: "隨機強化組 Vol.10" }],
  "CX-18": [{ slug: "cx-18", name: "腕龍鞭打 隨機強化組" }],
  "CX-19": [{ slug: "cx-19", name: "鱷魚裂甲 隨機強化組" }],
  "UX-00": [{ slug: "ux-00-eva", name: "新世紀福音戰士改造組" }],
  "UX-01": [{ slug: "ux-01", name: "蒼龍爆刃" }],
  "UX-02": [{ slug: "ux-02", name: "惡魔戰錘" }],
  "UX-03": [{ slug: "ux-03", name: "魔導神杖" }],
  "UX-11": [{ slug: "ux-11", name: "衝擊龍神 豪華組" }],
  "UX-13": [{ slug: "ux-13", name: "魔像奇岩" }],
  "UX-14": [{ slug: "ux-14", name: "天蠍長矛 0-70Z" }],
  "UX-15": [{ slug: "ux-15", name: "鮫鯊狂鱗 改造組" }],
  "UX-16": [{ slug: "ux-16", name: "時鐘幻象 隨機強化組" }],
  "UX-17": [{ slug: "ux-17", name: "隕星龍騎士 3-70J" }],
  "UX-19": [{ slug: "ux-19", name: "子彈獅鷲H" }],
  "UX-20": [{ slug: "ux-20", name: "榮耀武神LF" }],
  "UX-21": [{ slug: "ux-21", name: "惡魔冥界改造組" }],
};

/** Items the scraper could not attach a code to, recognised by name. */
const UNCODED_RULES: { match: RegExp; code: string }[] = [
  { match: /雙重極限衝擊/, code: "BX-37" },
  { match: /蒼龍神劍/, code: "BX-00" },
  { match: /超人力霸王|迪卡狂怒/, code: "CX-00" },
  // "CX16 極限衝擊豪華對戰組\n(藍色龍王那包)" was split across two lines
  { match: /藍色龍王/, code: "CX-16" },
];

/** Links that are not products at all (e.g. "add our LINE account"). */
const NON_PRODUCT = /^抽籤連結$/;

export const OTHER_PRODUCT: Product = {
  slug: "other",
  code: null,
  name: "其他／未標型號",
  series: "其他",
};

export function seriesOf(code: string | null): Series {
  const prefix = code?.split("-")[0];
  if (prefix === "BX" || prefix === "UX" || prefix === "CX" || prefix === "BXG") return prefix;
  return "其他";
}

/** Strip prices and filler words the posts put in product names. */
export function cleanName(name: string): string {
  return name
    .replace(/[（(]\s*原價.*?[)）]/g, "")
    .replace(/\$\s*\d+元?/g, "")
    .replace(/售價|限購\s*\*?\s*\d+/g, "")
    .replace(/\s+/g, " ")
    .replace(/^[\s\-–]+|[\s\-–]+$/g, "");
}

/** Price written into the item name, e.g. "蒼龍爆刃 $395" or "(原價$395)". */
export function priceFromName(name: string): number | null {
  const m = name.match(/\$\s*(\d{2,5})/);
  return m ? Number(m[1]) : null;
}

export type Resolved = { kind: "product"; product: Product } | { kind: "link"; label: string };

export function resolveItem(code: string | null, rawName: string): Resolved {
  if (!code && NON_PRODUCT.test(rawName.trim())) {
    return { kind: "link", label: "抽籤說明／LINE 官方帳號" };
  }

  const effectiveCode = code ?? UNCODED_RULES.find((r) => r.match.test(rawName))?.code ?? null;
  if (!effectiveCode) return { kind: "product", product: OTHER_PRODUCT };

  const series = seriesOf(effectiveCode);
  const variants = CATALOG[effectiveCode];
  if (variants) {
    const v =
      variants.length === 1
        ? variants[0]
        : (variants.find((x) => x.match?.test(rawName)) ?? variants[0]);
    return { kind: "product", product: { slug: v.slug, code: effectiveCode, name: v.name, series } };
  }

  // A code we have not catalogued yet (new data): fall back to the cleaned raw name.
  return {
    kind: "product",
    product: {
      slug: effectiveCode.toLowerCase(),
      code: effectiveCode,
      name: cleanName(rawName) || effectiveCode,
      series,
    },
  };
}

/** Store names that the scraper took from a page/post title instead of the shop name. */
export const STORE_NAME_OVERRIDES: Record<string, string> = {
  "feds.hualien": "Funbox 遠東百貨花蓮店",
  TarokoSquare: "大魯閣湳雅廣場",
  "taimall.tw": "台茂購物中心",
};
