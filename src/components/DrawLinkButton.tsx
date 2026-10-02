"use client";

import { useVisited } from "@/hooks/useVisited";
import { ExternalIcon } from "./ExternalIcon";

/** The "抽籤" button; turns into "已開啟" once the viewer has opened that link. */
export function DrawLinkButton({ url, label, muted = false }: { url: string; label: string; muted?: boolean }) {
  const { visited, markVisited } = useVisited();
  const opened = visited.has(url);
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => markVisited(url)}
      onAuxClick={() => markVisited(url)}
      className={`inline-flex min-h-8 shrink-0 items-center gap-1 rounded-md px-2.5 text-xs font-medium ${
        opened
          ? "border border-line text-muted hover:text-ink"
          : muted
            ? "text-faint hover:text-muted"
            : "bg-accent text-white hover:opacity-90"
      }`}
      aria-label={`${label} 抽籤連結${opened ? "（已開啟）" : ""}`}
    >
      {opened ? (
        <>
          <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true" className="shrink-0">
            <path d="M2.5 6.2 5 8.5l4.5-5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          已開啟
        </>
      ) : (
        <>
          抽籤
          <ExternalIcon />
        </>
      )}
    </a>
  );
}
