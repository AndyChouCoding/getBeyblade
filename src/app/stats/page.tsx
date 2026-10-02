import type { Metadata } from "next";
import Link from "next/link";
import { BarChart } from "@/components/BarChart";
import { PageHeader } from "@/components/PageHeader";
import { SERIES_ORDER, compareCity, getAudit, getDraws, getProductSummaries } from "@/lib/data";
import { formatMonthDay, taipeiDayKey } from "@/lib/time";

export const metadata: Metadata = { title: "統計與資料核對" };

function countBy<T>(xs: T[], key: (x: T) => string) {
  const m = new Map<string, number>();
  for (const x of xs) m.set(key(x), (m.get(key(x)) ?? 0) + 1);
  return m;
}

export default function StatsPage() {
  const audit = getAudit();
  const draws = getDraws();
  const products = getProductSummaries();
  const items = draws.flatMap((d) => d.items);

  const byCity = [...countBy(draws, (d) => d.city)].sort((a, b) => b[1] - a[1] || compareCity(a[0], b[0]));

  const topProducts = [...products].sort((a, b) => b.drawCount - a.drawCount).slice(0, 15);

  const byDay = [...countBy(draws.filter((d) => d.drawStart), (d) => taipeiDayKey(d.drawStart!))].sort((a, b) =>
    a[0].localeCompare(b[0]),
  );

  const itemsBySeries = countBy(items, (i) => products.find((p) => p.slug === i.productSlug)?.series ?? "其他");

  return (
    <>
      <PageHeader title="統計與資料核對" description="stores.json 與 draws.json 的數量統計、交叉核對結果，以及清理時做過的修正。" />

      <dl className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">
        <Tile label="門市／粉專" value={audit.storeCount} note={`啟用 ${audit.enabledStoreCount}`} />
        <Tile label="抽籤活動" value={audit.drawCount} note={`來自 ${audit.storesWithDraws} 間門市`} />
        <Tile label="商品品項" value={audit.itemCount} note="所有活動加總" />
        <Tile label="商品款式" value={audit.productCount} note={`${audit.codeCount} 種型號`} />
      </dl>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <BarChart
          title="各縣市抽籤場次"
          unit="場"
          rows={byCity.map(([city, n]) => ({ label: city, value: n }))}
        />
        <BarChart
          title="最常被抽的商品 Top 15"
          caption="出現在幾場抽籤中"
          unit="場"
          rows={topProducts.map((p) => ({ label: `${p.code ?? ""} ${p.name}`.trim(), value: p.drawCount, href: `/products/${p.slug}` }))}
        />
        <BarChart
          title="每日開抽場次"
          caption="依抽籤開始日（台灣時間）"
          unit="場"
          rows={byDay.map(([day, n]) => ({ label: formatMonthDay(`${day}T12:00:00+08:00`), value: n }))}
        />
        <BarChart
          title="各系列品項數"
          caption="所有活動中的商品品項加總（不含非商品的抽籤說明連結）"
          unit="項"
          rows={SERIES_ORDER.filter((s) => itemsBySeries.has(s)).map((s) => ({ label: s, value: itemsBySeries.get(s)! }))}
        />
      </div>

      <section className="mt-10">
        <h2 className="mb-1 text-xl font-bold">資料核對</h2>
        <p className="mb-4 text-sm text-muted">以原始 JSON 檢查，「已處理」表示網站顯示時已修正或歸類。</p>
        <div className="overflow-hidden rounded-xl border border-line bg-surface">
          <ul className="divide-y divide-line">
            <Check ok label="門市 id 重複" value={audit.duplicateStoreIds} />
            <Check ok label="抽籤 id 重複" value={audit.duplicateDrawIds} />
            <Check ok label="同一則貼文重複收錄" value={audit.duplicatePostUrls} />
            <Check ok label="抽籤對應不到門市（storeId 不存在）" value={audit.orphanDraws} />
            <Check ok label="抽籤上的店名／縣市與門市資料不一致" value={audit.nameOrCityMismatch} />
            <Check
              label="沒有任何抽籤紀錄的門市"
              value={audit.storesWithoutDraws.length}
              detail={
                <span className="flex flex-wrap gap-x-3 gap-y-1">
                  {audit.storesWithoutDraws.map((s) => (
                    <Link key={s.id} href={`/stores/${encodeURIComponent(s.id)}`} className="hover:text-ink hover:underline">
                      {s.name}
                      {!s.enabled && "（停用）"}
                    </Link>
                  ))}
                </span>
              }
            />
            <Check handled label="店名誤抓為貼文標題（已改為正確店名）" value={audit.renamedStores.length} detail={audit.renamedStores.map((s) => s.name).join("、")} />
            <Check handled label="結束時間等於開始時間（已依貼文內容修正）" value={audit.zeroLengthDraws.length} />
            <Check
              handled
              label="缺少抽籤時間（顯示為「時間未定」）"
              value={audit.undatedDraws.length}
              detail={audit.undatedDraws.map((d) => d.storeName).join("、")}
            />
            <Check handled label="品項缺少型號（已依品名歸類）" value={audit.uncodedItems} />
            <Check handled label="同型號有多種品名寫法（已統一為標準品名）" value={audit.codesWithSpellingVariants} unit="個型號" />
            <Check label="品項沒有標示價格" value={audit.itemsWithoutPrice} unit={`項（共 ${audit.itemCount}）`} />
          </ul>
        </div>
      </section>
    </>
  );
}

function Tile({ label, value, note }: { label: string; value: number; note: string }) {
  return (
    <div className="rounded-xl border border-line bg-surface px-4 py-3">
      <dt className="text-xs text-muted">{label}</dt>
      <dd className="mt-0.5 text-3xl font-bold">{value.toLocaleString("en-US")}</dd>
      <dd className="mt-0.5 text-xs text-faint">{note}</dd>
    </div>
  );
}

function Check({
  label,
  value,
  unit = "筆",
  ok = false,
  handled = false,
  detail,
}: {
  label: string;
  value: number;
  unit?: string;
  /** A check that should come out as zero */
  ok?: boolean;
  handled?: boolean;
  detail?: React.ReactNode;
}) {
  const state = value === 0 ? "pass" : handled ? "handled" : ok ? "fail" : "note";
  const badge = {
    pass: { text: "通過", cls: "bg-active-soft text-active", icon: "✓" },
    handled: { text: "已處理", cls: "bg-accent-soft text-accent-ink", icon: "↻" },
    fail: { text: "異常", cls: "bg-upcoming-soft text-upcoming", icon: "!" },
    note: { text: "注意", cls: "bg-ended-soft text-ended", icon: "i" },
  }[state];
  return (
    <li className="flex flex-col gap-1 px-4 py-3 sm:flex-row sm:items-start sm:gap-4">
      <span className={`inline-flex w-fit shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium sm:mt-0.5 ${badge.cls}`}>
        <span aria-hidden="true">{badge.icon}</span>
        {badge.text}
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm">
          {label}
          <span className="ml-2 font-semibold tabular">
            {value} {unit}
          </span>
        </p>
        {detail && value > 0 && <div className="mt-1 text-xs leading-relaxed text-muted">{detail}</div>}
      </div>
    </li>
  );
}
