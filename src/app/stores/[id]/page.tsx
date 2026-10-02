import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DrawGrid } from "@/components/DrawGrid";
import { ExternalIcon } from "@/components/DrawItemList";
import { getDrawsByStore, getStore, getStores, renderedAt } from "@/lib/data";

export function generateStaticParams() {
  return getStores().map((s) => ({ id: s.id }));
}

export const dynamicParams = false;

async function load(props: PageProps<"/stores/[id]">) {
  return getStore(decodeURIComponent((await props.params).id));
}

export async function generateMetadata(props: PageProps<"/stores/[id]">): Promise<Metadata> {
  const store = await load(props);
  return store ? { title: store.name, description: `${store.name}（${store.city}）的戰鬥陀螺抽籤紀錄。` } : {};
}

export default async function StorePage(props: PageProps<"/stores/[id]">) {
  const store = await load(props);
  if (!store) notFound();
  const draws = getDrawsByStore(store.id);

  return (
    <>
      <nav className="mb-4 text-sm text-muted">
        <Link href="/stores" className="hover:text-ink">門市</Link>
        <span className="mx-2 text-faint">/</span>
        <span>{store.city}</span>
      </nav>

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{store.name}</h1>
          <p className="mt-1 text-sm text-muted">
            {store.city} · {draws.length} 場抽籤紀錄{!store.enabled && " · 已停用追蹤"}
          </p>
          {(store.note || store.rawName) && (
            <p className="mt-2 text-xs text-faint">
              {store.note}
              {store.note && store.rawName && "；"}
              {store.rawName && `原始名稱：${store.rawName}`}
            </p>
          )}
        </div>
        <a
          href={store.fbUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-10 w-fit items-center gap-1.5 rounded-lg border border-line bg-surface px-3 text-sm hover:bg-surface-2"
        >
          Facebook 粉專 <ExternalIcon />
        </a>
      </div>

      {draws.length > 0 ? (
        <DrawGrid draws={draws} renderedAt={renderedAt} showStore={false} />
      ) : (
        <div className="rounded-xl border border-dashed border-line px-6 py-16 text-center text-sm text-muted">
          這間門市目前沒有抓到抽籤貼文，可直接到 Facebook 粉專查看最新公告。
        </div>
      )}
    </>
  );
}
