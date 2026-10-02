"use client";

import { useNow } from "@/hooks/useNow";
import { compareByRelevance } from "@/lib/time";
import type { Draw } from "@/lib/types";
import { DrawCard } from "./DrawCard";

export function DrawGrid({
  draws,
  renderedAt,
  highlightSlug,
  showStore = true,
}: {
  draws: Draw[];
  renderedAt: number;
  highlightSlug?: string;
  showStore?: boolean;
}) {
  const now = useNow(renderedAt);
  const sorted = [...draws].sort((a, b) => compareByRelevance(a, b, now));
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      {sorted.map((d) => (
        <DrawCard key={d.id} draw={d} now={now} highlightSlug={highlightSlug} showStore={showStore} />
      ))}
    </div>
  );
}
