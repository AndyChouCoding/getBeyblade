"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useNow } from "@/hooks/useNow";
import { getStatus } from "@/lib/time";
import type { ProductSummary } from "@/lib/data";
import type { Series } from "@/lib/types";

export interface DrawWindow {
  drawStart: string | null;
  drawEnd: string | null;
  slugs: string[];
}

type SortKey = "code" | "popular";

export function ProductCatalog({
  products,
  windows,
  seriesOrder,
  renderedAt,
}: {
  products: ProductSummary[];
  windows: DrawWindow[];
  seriesOrder: Series[];
  renderedAt: number;
}) {
  const now = useNow(renderedAt);
  const [q, setQ] = useState("");
  const [sort, setSort] = useState<SortKey>("code");

  const openCount = useMemo(() => {
    const m = new Map<string, number>();
    for (const w of windows) {
      const s = getStatus(w, now);
      if (s !== "active" && s !== "upcoming") continue;
      for (const slug of new Set(w.slugs)) m.set(slug, (m.get(slug) ?? 0) + 1);
    }
    return m;
  }, [windows, now]);

  const groups = useMemo(() => {
    const query = q.trim().toLowerCase();
    const list = products
      .filter((p) => !query || `${p.code ?? ""} ${p.name}`.toLowerCase().includes(query))
      .sort((a, b) => (sort === "popular" ? b.drawCount - a.drawCount : 0));
    return seriesOrder.map((s) => [s, list.filter((p) => p.series === s)] as const).filter(([, l]) => l.length);
  }, [products, q, sort, seriesOrder]);

  return (
    <div>
      <div className="mb-6 flex flex-col gap-2 sm:flex-row">
        <input
          type="search"
          aria-label="搜尋商品"
          placeholder="搜尋型號或品名"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="h-10 w-full rounded-lg border border-line bg-surface px-3 text-sm placeholder:text-faint sm:max-w-sm"
        />
        <div className="flex gap-1.5" role="group" aria-label="排序">
          {(
            [
              ["code", "依型號"],
              ["popular", "依抽籤場次"],
            ] as const
          ).map(([key, label]) => (
            <button
              key={key}
              type="button"
              aria-pressed={sort === key}
              onClick={() => setSort(key)}
              className={`h-10 rounded-lg border px-3 text-sm ${
                sort === key ? "border-ink bg-ink text-bg" : "border-line bg-surface text-muted hover:text-ink"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {groups.length === 0 && <p className="py-16 text-center text-sm text-muted">沒有符合的商品。</p>}

      <div className="space-y-8">
        {groups.map(([series, list]) => (
          <section key={series}>
            <h2 className="mb-3 flex items-baseline gap-2 text-lg font-semibold">
              {series === "其他" ? "其他" : `${series} 系列`}
              <span className="text-sm font-normal text-faint">{list.length} 款</span>
            </h2>
            <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {list.map((p) => {
                const open = openCount.get(p.slug) ?? 0;
                return (
                  <li key={p.slug}>
                    <Link
                      href={`/products/${p.slug}`}
                      className="flex h-full min-w-0 flex-col rounded-xl border border-line bg-surface p-4 transition-colors hover:border-accent"
                    >
                      <span className="flex items-center justify-between gap-2">
                        <span className="font-mono text-xs text-faint">{p.code ?? "—"}</span>
                        {open > 0 && (
                          <span className="rounded-full bg-active-soft px-2 py-0.5 text-xs font-medium text-active">
                            {open} 場可參加
                          </span>
                        )}
                      </span>
                      <span className="mt-1 font-medium leading-snug">{p.name}</span>
                      <span className="mt-auto flex flex-wrap gap-x-3 pt-3 text-xs text-muted">
                        <span>
                          <span className="font-medium text-ink tabular">{p.drawCount}</span> 場抽籤
                        </span>
                        <span>
                          <span className="font-medium text-ink tabular">{p.storeCount}</span> 間門市
                        </span>
                        {p.price != null && <span className="tabular">${p.price}</span>}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
