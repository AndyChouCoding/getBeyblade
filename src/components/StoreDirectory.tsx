"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { formatDate } from "@/lib/time";
import type { StoreSummary } from "@/lib/data";

export function StoreDirectory({ stores, cities }: { stores: StoreSummary[]; cities: string[] }) {
  const [city, setCity] = useState("");
  const [q, setQ] = useState("");

  const groups = useMemo(() => {
    const query = q.trim().toLowerCase();
    const filtered = stores.filter(
      (s) => (!city || s.city === city) && (!query || `${s.name} ${s.city} ${s.id}`.toLowerCase().includes(query)),
    );
    // Stores with draws first; the list is already name-sorted, and sort is stable
    return cities
      .map((c) => [c, filtered.filter((s) => s.city === c).sort((a, b) => Number(b.drawCount > 0) - Number(a.drawCount > 0))] as const)
      .filter(([, list]) => list.length > 0);
  }, [stores, cities, city, q]);

  return (
    <div>
      <div className="mb-6 space-y-3">
        <input
          type="search"
          aria-label="搜尋門市"
          placeholder="搜尋門市名稱"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="h-10 w-full rounded-lg border border-line bg-surface px-3 text-sm placeholder:text-faint sm:max-w-sm"
        />
        <div className="no-scrollbar -mx-4 flex gap-1.5 overflow-x-auto px-4 sm:mx-0 sm:flex-wrap sm:px-0">
          {["", ...cities].map((c) => {
            const selected = city === c;
            return (
              <button
                key={c || "all"}
                type="button"
                aria-pressed={selected}
                onClick={() => setCity(c)}
                className={`min-h-9 shrink-0 rounded-full border px-3.5 text-sm ${
                  selected ? "border-ink bg-ink text-bg" : "border-line bg-surface text-muted hover:text-ink"
                }`}
              >
                {c || "全部"}
              </button>
            );
          })}
        </div>
      </div>

      {groups.length === 0 && <p className="py-16 text-center text-sm text-muted">沒有符合的門市。</p>}

      <div className="space-y-8">
        {groups.map(([c, list]) => (
          <section key={c}>
            <h2 className="mb-3 flex items-baseline gap-2 text-lg font-semibold">
              {c}
              <span className="text-sm font-normal text-faint">{list.length} 間</span>
            </h2>
            <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {list.map((s) => (
                <li key={s.id}>
                  <Link
                    href={`/stores/${encodeURIComponent(s.id)}`}
                    className="flex h-full min-w-0 flex-col rounded-xl border border-line bg-surface p-4 transition-colors hover:border-accent"
                  >
                    <span className="flex items-start justify-between gap-2">
                      <span className="font-medium leading-snug">{s.name}</span>
                      {!s.enabled && (
                        <span className="shrink-0 rounded-full bg-ended-soft px-2 py-0.5 text-xs text-ended">停用</span>
                      )}
                    </span>
                    <span className="mt-auto pt-3 text-xs text-muted">
                      {s.drawCount > 0 ? (
                        <>
                          <span className="font-medium text-ink tabular">{s.drawCount}</span> 場抽籤
                          {s.lastDrawStart && <> · 最近 {formatDate(s.lastDrawStart)}</>}
                        </>
                      ) : (
                        "目前沒有抽籤紀錄"
                      )}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
