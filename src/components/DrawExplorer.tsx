"use client";

import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { useNow } from "@/hooks/useNow";
import { compareByRelevance, getStatus } from "@/lib/time";
import type { Draw, DrawStatus, Series } from "@/lib/types";
import { DrawCard } from "./DrawCard";

type StatusFilter = "open" | DrawStatus | "all";

const STATUS_TABS: { value: StatusFilter; label: string }[] = [
  { value: "open", label: "可參加" },
  { value: "active", label: "進行中" },
  { value: "upcoming", label: "即將開始" },
  { value: "ended", label: "已結束" },
  { value: "all", label: "全部" },
];

export interface ProductOption {
  slug: string;
  code: string | null;
  name: string;
  series: Series;
}

interface Filters {
  status: StatusFilter;
  city: string;
  product: string;
  q: string;
}

const DEFAULT_FILTERS: Filters = { status: "open", city: "", product: "", q: "" };

interface Props {
  draws: Draw[];
  cities: string[];
  products: ProductOption[];
  renderedAt: number;
}

function matchesStatus(filter: StatusFilter, status: DrawStatus) {
  if (filter === "all") return true;
  if (filter === "open") return status === "active" || status === "upcoming";
  return filter === status;
}

/** Reads the initial filters from the URL. Needs a Suspense boundary when prerendered. */
export function DrawExplorerFromUrl(props: Props) {
  const params = useSearchParams();
  const initial: Filters = {
    status: (STATUS_TABS.find((t) => t.value === params.get("status"))?.value ?? "open") as StatusFilter,
    city: params.get("city") ?? "",
    product: params.get("product") ?? "",
    q: params.get("q") ?? "",
  };
  return <DrawExplorer {...props} initial={initial} />;
}

export function DrawExplorer({ draws, cities, products, renderedAt, initial = DEFAULT_FILTERS }: Props & { initial?: Filters }) {
  const now = useNow(renderedAt);
  const [filters, setFilters] = useState<Filters>(initial);

  function update(patch: Partial<Filters>) {
    const next = { ...filters, ...patch };
    setFilters(next);
    const sp = new URLSearchParams();
    if (next.status !== "open") sp.set("status", next.status);
    if (next.city) sp.set("city", next.city);
    if (next.product) sp.set("product", next.product);
    if (next.q) sp.set("q", next.q);
    const qs = sp.toString();
    window.history.replaceState(null, "", qs ? `?${qs}` : window.location.pathname);
  }

  // Everything except the status filter, so the tab counts reflect the other filters
  const baseFiltered = useMemo(() => {
    const q = filters.q.trim().toLowerCase();
    return draws.filter((d) => {
      if (filters.city && d.city !== filters.city) return false;
      if (filters.product && !d.items.some((i) => i.productSlug === filters.product)) return false;
      if (q) {
        const haystack = [d.storeName, d.city, ...d.items.flatMap((i) => [i.name, i.code ?? "", i.rawName])]
          .join(" ")
          .toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
  }, [draws, filters.city, filters.product, filters.q]);

  const counts = useMemo(() => {
    const c: Record<StatusFilter, number> = { open: 0, active: 0, upcoming: 0, ended: 0, unscheduled: 0, all: baseFiltered.length };
    for (const d of baseFiltered) {
      const s = getStatus(d, now);
      c[s]++;
      if (s === "active" || s === "upcoming") c.open++;
    }
    return c;
  }, [baseFiltered, now]);

  const visible = useMemo(
    () =>
      baseFiltered
        .filter((d) => matchesStatus(filters.status, getStatus(d, now)))
        .sort((a, b) => compareByRelevance(a, b, now)),
    [baseFiltered, filters.status, now],
  );

  const hasFilters = filters.city || filters.product || filters.q;
  const productGroups = useMemo(() => {
    const groups = new Map<Series, ProductOption[]>();
    for (const p of products) {
      if (!groups.has(p.series)) groups.set(p.series, []);
      groups.get(p.series)!.push(p);
    }
    return [...groups];
  }, [products]);

  return (
    <div>
      <div className="mb-5 grid grid-cols-3 gap-2 sm:gap-3">
        <Kpi label="進行中" value={counts.active} tone="text-active" />
        <Kpi label="即將開始" value={counts.upcoming} tone="text-upcoming" />
        <Kpi label="已結束" value={counts.ended} tone="text-ended" />
      </div>

      <div className="sticky top-[92px] z-10 -mx-4 mb-5 border-b border-line bg-bg/95 px-4 pb-3 pt-2 backdrop-blur sm:static sm:mx-0 sm:border-0 sm:bg-transparent sm:px-0 sm:pt-0 sm:backdrop-blur-none">
        <div role="tablist" aria-label="活動狀態" className="no-scrollbar -mx-4 mb-3 flex gap-1.5 overflow-x-auto px-4 sm:mx-0 sm:px-0">
          {STATUS_TABS.map((t) => {
            const selected = filters.status === t.value;
            return (
              <button
                key={t.value}
                role="tab"
                aria-selected={selected}
                onClick={() => update({ status: t.value })}
                className={`inline-flex min-h-9 shrink-0 items-center gap-1.5 rounded-full border px-3.5 text-sm transition-colors ${
                  selected ? "border-ink bg-ink text-bg" : "border-line bg-surface text-muted hover:text-ink"
                }`}
              >
                {t.label}
                <span className={`tabular text-xs ${selected ? "opacity-80" : "text-faint"}`}>{counts[t.value]}</span>
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-[1fr_1fr_1.4fr_auto]">
          <select
            aria-label="縣市"
            value={filters.city}
            onChange={(e) => update({ city: e.target.value })}
            className="h-10 min-w-0 rounded-lg border border-line bg-surface px-3 text-sm"
          >
            <option value="">全部縣市</option>
            {cities.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <select
            aria-label="商品"
            value={filters.product}
            onChange={(e) => update({ product: e.target.value })}
            className="h-10 min-w-0 rounded-lg border border-line bg-surface px-3 text-sm"
          >
            <option value="">全部商品</option>
            {productGroups.map(([series, list]) => (
              <optgroup key={series} label={series}>
                {list.map((p) => (
                  <option key={p.slug} value={p.slug}>
                    {p.code ? `${p.code} ` : ""}
                    {p.name}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
          <input
            type="search"
            aria-label="搜尋"
            placeholder="搜尋門市、商品或型號"
            value={filters.q}
            onChange={(e) => update({ q: e.target.value })}
            className="col-span-2 h-10 min-w-0 rounded-lg border border-line bg-surface px-3 text-sm placeholder:text-faint sm:col-span-1"
          />
          {hasFilters ? (
            <button
              type="button"
              onClick={() => update({ city: "", product: "", q: "" })}
              className="col-span-2 h-10 rounded-lg px-3 text-sm text-accent-ink hover:bg-accent-soft sm:col-span-1"
            >
              清除篩選
            </button>
          ) : null}
        </div>
      </div>

      {visible.length === 0 ? (
        <div className="rounded-xl border border-dashed border-line px-6 py-16 text-center text-sm text-muted">
          <p>沒有符合條件的抽籤活動。</p>
          {filters.status !== "all" && (
            <button type="button" onClick={() => update({ status: "all" })} className="mt-3 text-accent-ink hover:underline">
              查看全部狀態
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {visible.map((d) => (
            <DrawCard key={d.id} draw={d} now={now} highlightSlug={filters.product || undefined} />
          ))}
        </div>
      )}
    </div>
  );
}

function Kpi({ label, value, tone }: { label: string; value: number; tone: string }) {
  return (
    <div className="rounded-xl border border-line bg-surface px-3 py-3 sm:px-4">
      <p className="text-xs text-muted">{label}</p>
      <p className={`mt-0.5 text-2xl font-bold sm:text-3xl ${tone}`}>{value}</p>
    </div>
  );
}
