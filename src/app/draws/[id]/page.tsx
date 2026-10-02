import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DrawItemList, ExternalIcon } from "@/components/DrawItemList";
import { LiveStatus } from "@/components/LiveStatus";
import { getDraw, getDraws, renderedAt } from "@/lib/data";
import { formatDate, formatDateTime } from "@/lib/time";

export function generateStaticParams() {
  return getDraws().map((d) => ({ id: d.id }));
}

export const dynamicParams = false;

export async function generateMetadata(props: PageProps<"/draws/[id]">): Promise<Metadata> {
  const draw = getDraw((await props.params).id);
  if (!draw) return {};
  return {
    title: `${draw.storeName} ${draw.drawStart ? formatDate(draw.drawStart) : ""} 抽籤`,
    description: `${draw.storeName} 抽籤品項：${draw.items.map((i) => i.name).join("、")}`,
  };
}

export default async function DrawPage(props: PageProps<"/draws/[id]">) {
  const draw = getDraw((await props.params).id);
  if (!draw) notFound();

  return (
    <div className="mx-auto max-w-3xl">
      <nav className="mb-4 text-sm text-muted">
        <Link href="/" className="hover:text-ink">抽籤活動</Link>
        <span className="mx-2 text-faint">/</span>
        <Link href={`/stores/${encodeURIComponent(draw.storeId)}`} className="hover:text-ink">{draw.storeName}</Link>
      </nav>

      <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{draw.storeName}</h1>
      <p className="mt-1 text-sm text-muted">{draw.city}</p>

      <section className="mt-5 rounded-xl border border-line bg-surface p-4 sm:p-5">
        <LiveStatus draw={draw} renderedAt={renderedAt} />
        <dl className="mt-3 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-sm">
          <dt className="text-muted">開始</dt>
          <dd className="tabular">{draw.drawStart ? formatDateTime(draw.drawStart) : "未標示"}</dd>
          <dt className="text-muted">截止</dt>
          <dd className="tabular">{draw.drawEnd ? formatDateTime(draw.drawEnd) : "未標示"}</dd>
        </dl>
        <div className="mt-4 flex flex-wrap gap-2 text-sm">
          <a href={draw.postUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-line px-3 hover:bg-surface-2">
            查看 FB 原文 <ExternalIcon />
          </a>
          {draw.extraLinks.map((l) => (
            <a key={l.url} href={l.url} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-line px-3 hover:bg-surface-2">
              {l.label} <ExternalIcon />
            </a>
          ))}
        </div>
      </section>

      <section className="mt-6">
        <h2 className="mb-2 text-lg font-semibold">抽籤品項（{draw.items.length}）</h2>
        <div className="rounded-xl border border-line bg-surface px-4 py-1">
          <DrawItemList items={draw.items} />
        </div>
        <p className="mt-2 text-xs text-faint">品名已統一為標準名稱，滑鼠移到品名上可看貼文原文寫法。</p>
      </section>

      <details className="mt-6 rounded-xl border border-line bg-surface">
        <summary className="cursor-pointer px-4 py-3 text-sm font-medium">貼文原文</summary>
        <pre className="max-h-[60vh] overflow-auto whitespace-pre-wrap break-words border-t border-line px-4 py-3 font-sans text-sm leading-relaxed text-muted">
          {draw.rawText}
        </pre>
      </details>
    </div>
  );
}
