"use client";

import Link from "next/link";
import { useVisited } from "@/hooks/useVisited";
import { describeTiming, formatDateTime, getStatus } from "@/lib/time";
import type { Draw, DrawItem } from "@/lib/types";
import { DrawLinkButton } from "./DrawLinkButton";
import type { ProductOption } from "./DrawExplorer";
import { StatusBadge } from "./StatusBadge";

export interface ProductGroup {
  product: ProductOption;
  /** One row per draw that has this product, already filtered and sorted */
  rows: { draw: Draw; items: DrawItem[] }[];
}

/** One block per product, listing every store's draw link for it. */
export function ProductGroups({ groups, now }: { groups: ProductGroup[]; now: number }) {
  const { visited, clearVisited } = useVisited();
  const total = groups.reduce((n, g) => n + g.rows.length, 0);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-muted">
        <p>
          符合 <span className="font-medium text-ink">{groups.length}</span> 款商品，共{" "}
          <span className="font-medium text-ink">{total}</span> 場抽籤
        </p>
        {visited.size > 0 && (
          <button type="button" onClick={clearVisited} className="min-h-9 rounded-md px-2 text-accent-ink hover:bg-accent-soft">
            清除「已開啟」標記
          </button>
        )}
      </div>

      {groups.map(({ product, rows }) => {
        const links = rows.flatMap((r) => r.items.map((i) => i.url).filter((u): u is string => !!u));
        const opened = links.filter((u) => visited.has(u)).length;
        return (
          <section key={product.slug} className="overflow-hidden rounded-xl border border-line bg-surface">
            <header className="flex flex-wrap items-baseline gap-x-3 gap-y-1 border-b border-line bg-surface-2 px-4 py-3">
              <span className="font-mono text-xs text-faint">{product.code ?? "—"}</span>
              <h2 className="font-semibold">
                <Link href={`/products/${product.slug}`} className="hover:text-accent-ink hover:underline">
                  {product.name}
                </Link>
              </h2>
              <span className="ml-auto text-xs text-muted tabular">
                {rows.length} 場{links.length > 0 && ` · 已開啟 ${opened}/${links.length}`}
              </span>
            </header>

            {rows.length === 0 ? (
              <p className="px-4 py-6 text-center text-sm text-muted">目前篩選條件下沒有這款商品的抽籤。</p>
            ) : (
              <ul className="divide-y divide-line">
                {rows.map(({ draw, items }) => {
                  const status = getStatus(draw, now);
                  const timing = describeTiming(draw, now);
                  return (
                    <li key={draw.id} className="flex items-center gap-3 px-4 py-2.5">
                      <div className="min-w-0 flex-1">
                        <p className="flex items-center gap-2">
                          <Link
                            href={`/stores/${encodeURIComponent(draw.storeId)}`}
                            className="truncate text-sm font-medium hover:text-accent-ink hover:underline"
                          >
                            {draw.storeName}
                          </Link>
                          <span className="shrink-0 text-xs text-faint">{draw.city}</span>
                        </p>
                        <p className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted">
                          <StatusBadge status={status} />
                          <span className="tabular">
                            {timing ?? (draw.drawEnd ? `${formatDateTime(draw.drawEnd)} 截止` : "時間未定")}
                          </span>
                        </p>
                      </div>
                      <div className="flex shrink-0 flex-col items-end gap-1.5">
                        {items.map((item, i) =>
                          item.url ? (
                            <span key={i} className="flex items-center gap-2">
                              {/* Same product listed twice in one post: show how the store named each */}
                              {items.length > 1 && <span className="max-w-24 truncate text-xs text-faint">{item.rawName}</span>}
                              {item.price != null && <span className="text-xs text-muted tabular">${item.price}</span>}
                              <DrawLinkButton url={item.url} label={`${draw.storeName} ${item.name}`} muted={status === "ended"} />
                            </span>
                          ) : null,
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>
        );
      })}
    </div>
  );
}
