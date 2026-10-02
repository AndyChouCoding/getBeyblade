import Link from "next/link";
import { DrawLinkButton } from "./DrawLinkButton";
import type { DrawItem } from "@/lib/types";

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
            {item.url && <DrawLinkButton url={item.url} label={item.name} muted={disabled} />}
          </li>
        );
      })}
    </ul>
  );
}
