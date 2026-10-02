"use client";

import { useNow } from "@/hooks/useNow";
import { describeTiming, getStatus } from "@/lib/time";
import type { Draw } from "@/lib/types";
import { StatusBadge } from "./StatusBadge";

export function LiveStatus({ draw, renderedAt }: { draw: Pick<Draw, "drawStart" | "drawEnd">; renderedAt: number }) {
  const now = useNow(renderedAt);
  const timing = describeTiming(draw, now);
  return (
    <span className="inline-flex flex-wrap items-center gap-2">
      <StatusBadge status={getStatus(draw, now)} />
      {timing && <span className="text-sm font-medium">{timing}</span>}
    </span>
  );
}
