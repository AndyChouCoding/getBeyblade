import type { Draw, DrawStatus } from "./types";

export function getStatus(draw: Pick<Draw, "drawStart" | "drawEnd">, now: number): DrawStatus {
  if (!draw.drawStart || !draw.drawEnd) return "unscheduled";
  if (now < Date.parse(draw.drawStart)) return "upcoming";
  if (now > Date.parse(draw.drawEnd)) return "ended";
  return "active";
}

export const STATUS_LABEL: Record<DrawStatus, string> = {
  active: "進行中",
  upcoming: "即將開始",
  ended: "已結束",
  unscheduled: "時間未定",
};

const STATUS_RANK: Record<DrawStatus, number> = { active: 0, upcoming: 1, ended: 2, unscheduled: 3 };

/** Active (ending soonest) → upcoming (starting soonest) → ended (most recent) → undated. */
export function compareByRelevance(a: Draw, b: Draw, now: number) {
  const sa = getStatus(a, now);
  const sb = getStatus(b, now);
  if (sa !== sb) return STATUS_RANK[sa] - STATUS_RANK[sb];
  if (sa === "active") return a.drawEnd!.localeCompare(b.drawEnd!);
  if (sa === "upcoming") return a.drawStart!.localeCompare(b.drawStart!);
  if (sa === "ended") return b.drawEnd!.localeCompare(a.drawEnd!);
  return 0;
}

// Always format in Taiwan time so server and browser render the same text.
const dateTimeFmt = new Intl.DateTimeFormat("zh-TW", {
  timeZone: "Asia/Taipei",
  month: "numeric",
  day: "numeric",
  weekday: "short",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

const dateFmt = new Intl.DateTimeFormat("zh-TW", {
  timeZone: "Asia/Taipei",
  year: "numeric",
  month: "numeric",
  day: "numeric",
});

export function formatDateTime(iso: string) {
  return dateTimeFmt.format(new Date(iso));
}

export function formatDate(iso: string) {
  return dateFmt.format(new Date(iso));
}

/** "2 天 3 小時" / "5 小時 12 分" / "8 分鐘" */
export function formatDuration(ms: number) {
  const mins = Math.max(0, Math.floor(ms / 60000));
  const d = Math.floor(mins / 1440);
  const h = Math.floor((mins % 1440) / 60);
  const m = mins % 60;
  if (d > 0) return `${d} 天${h ? ` ${h} 小時` : ""}`;
  if (h > 0) return `${h} 小時${m ? ` ${m} 分` : ""}`;
  return `${m} 分鐘`;
}

/** Short relative description for a draw's timing. */
export function describeTiming(draw: Pick<Draw, "drawStart" | "drawEnd">, now: number): string | null {
  const status = getStatus(draw, now);
  if (status === "active") return `剩 ${formatDuration(Date.parse(draw.drawEnd!) - now)}截止`;
  if (status === "upcoming") return `${formatDuration(Date.parse(draw.drawStart!) - now)}後開始`;
  return null;
}
