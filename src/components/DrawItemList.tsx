import Link from "next/link";
import type { DrawItem } from "@/lib/types";

export function ExternalIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true" className="shrink-0">
      <path d="M4.5 2.5h5v5M9.5 2.5 3 9" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function DrawItemList({
  items,
  highlightSlug,
  disabled = false,
}: {
  items: DrawItem[];
  highlightSlug?: string;
  /** Draw has ended: keep links but de-emphasise them */
  disabled?: boolean;
}) {
  return (
    <ul className="divide-y divide-line">
      {items.map((item, i) => {
        const highlighted = item.productSlug === highlightSlug;
        return (
          <li
            key={`${item.productSlug}-${i}`}
            className={`flex items-center gap-3 py-2 ${highlighted ? "-mx-2 rounded-md bg-accent-soft px-2" : ""}`}
          >
            <span className="w-14 shrink-0 font-mono text-xs text-faint tabular">{item.code ?? "—"}</span>
            <div className="min-w-0 flex-1">
              <Link
                href={`/products/${item.productSlug}`}
                className="block truncate text-sm hover:text-accent-ink hover:underline"
                title={item.rawName !== item.name ? `原文：${item.rawName}` : undefined}
              >
                {item.name}
              </Link>
            </div>
            {item.price != null && <span className="shrink-0 text-xs text-muted tabular">${item.price}</span>}
            {item.url && (
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex min-h-8 shrink-0 items-center gap-1 rounded-md px-2.5 text-xs font-medium ${
                  disabled
                    ? "text-faint hover:text-muted"
                    : "bg-accent text-white hover:opacity-90"
                }`}
                aria-label={`${item.name} 抽籤連結`}
              >
                抽籤
                <ExternalIcon />
              </a>
            )}
          </li>
        );
      })}
    </ul>
  );
}
