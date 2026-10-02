import { STATUS_LABEL } from "@/lib/time";
import type { DrawStatus } from "@/lib/types";

const STYLE: Record<DrawStatus, string> = {
  active: "bg-active-soft text-active",
  upcoming: "bg-upcoming-soft text-upcoming",
  ended: "bg-ended-soft text-ended",
  unscheduled: "bg-ended-soft text-ended",
};

export function StatusBadge({ status }: { status: DrawStatus }) {
  return (
    <span className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium ${STYLE[status]}`}>
      <StatusIcon status={status} />
      {STATUS_LABEL[status]}
    </span>
  );
}

function StatusIcon({ status }: { status: DrawStatus }) {
  if (status === "active") {
    return (
      <span className="relative flex h-2 w-2" aria-hidden="true">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-current opacity-60 motion-reduce:hidden" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-current" />
      </span>
    );
  }
  if (status === "upcoming") {
    return (
      <svg width="10" height="10" viewBox="0 0 12 12" aria-hidden="true">
        <circle cx="6" cy="6" r="5" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <path d="M6 3.2V6l2 1.3" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    );
  }
  if (status === "ended") {
    return (
      <svg width="10" height="10" viewBox="0 0 12 12" aria-hidden="true">
        <path d="M2.5 6.2 5 8.5l4.5-5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  return (
    <svg width="10" height="10" viewBox="0 0 12 12" aria-hidden="true">
      <text x="6" y="10" textAnchor="middle" fontSize="10" fontWeight="700" fill="currentColor">?</text>
    </svg>
  );
}
