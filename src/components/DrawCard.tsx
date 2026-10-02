"use client";

import Link from "next/link";
import { useState } from "react";
import { describeTiming, formatDateTime, getStatus } from "@/lib/time";
import type { Draw } from "@/lib/types";
import { DrawItemList, ExternalIcon } from "./DrawItemList";
import { StatusBadge } from "./StatusBadge";

const COLLAPSED_COUNT = 6;

export function DrawCard({
  draw,
  now,
  highlightSlug,
  showStore = true,
}: {
  draw: Draw;
  now: number;
  highlightSlug?: string;
  showStore?: boolean;
}) {
  const [expanded, setExpanded] = useState(false);
  const status = getStatus(draw, now);
  const timing = describeTiming(draw, now);

  // Highlighted product first, so it stays visible when collapsed
  let items = highlightSlug
    ? [...draw.items.filter((i) => i.productSlug === highlightSlug), ...draw.items.filter((i) => i.productSlug !== highlightSlug)]
    : draw.items;
  if (!expanded) items = items.slice(0, COLLAPSED_COUNT);
  const hidden = draw.items.length - items.length;

  return (
    <article
      className={`flex min-w-0 flex-col rounded-xl border border-line bg-surface p-4 ${status === "ended" ? "opacity-80" : ""}`}
    >
      <header className="mb-3 flex items-start justify-between gap-3">
        <div className="min-w-0">
          {showStore ? (
            <Link href={`/stores/${encodeURIComponent(draw.storeId)}`} className="font-semibold leading-snug hover:text-accent-ink hover:underline">
              {draw.storeName}
            </Link>
          ) : (
            <Link href={`/draws/${draw.id}`} className="font-semibold leading-snug hover:text-accent-ink hover:underline">
              {draw.drawStart ? `${formatDateTime(draw.drawStart)} 場` : "未標示日期"}
            </Link>
          )}
          <p className="mt-0.5 text-xs text-muted">{draw.city}</p>
        </div>
        <StatusBadge status={status} />
      </header>

      <div className="mb-3 rounded-lg bg-surface-2 px-3 py-2 text-xs leading-relaxed">
        {draw.drawStart ? (
          <>
            <p className="tabular text-muted">
              {formatDateTime(draw.drawStart)} — {draw.drawEnd ? formatDateTime(draw.drawEnd) : "截止時間未標示"}
            </p>
            {timing && <p className="font-medium text-ink">{timing}</p>}
          </>
        ) : (
          <p className="text-muted">貼文未標示抽籤時間，請以門市公告為準</p>
        )}
      </div>

      <DrawItemList items={items} highlightSlug={highlightSlug} disabled={status === "ended"} />

      {hidden > 0 && (
        <button
          type="button"
          onClick={() => setExpanded(true)}
          className="mt-1 min-h-9 rounded-md text-sm text-accent-ink hover:bg-accent-soft"
        >
          顯示其餘 {hidden} 項
        </button>
      )}

      <footer className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-line pt-3 text-xs text-muted">
        <span className="mr-auto">{draw.items.length} 項商品</span>
        {draw.extraLinks.map((l) => (
          <a key={l.url} href={l.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 hover:text-ink">
            {l.label}
            <ExternalIcon />
          </a>
        ))}
        <a href={draw.postUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 hover:text-ink">
          FB 原文
          <ExternalIcon />
        </a>
        <Link href={`/draws/${draw.id}`} className="hover:text-ink">
          詳情 →
        </Link>
      </footer>
    </article>
  );
}
