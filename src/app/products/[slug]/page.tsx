import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DrawGrid } from "@/components/DrawGrid";
import { getDrawsByProduct, getProduct, getProductSummaries, getSpellings, renderedAt } from "@/lib/data";

export function generateStaticParams() {
  return getProductSummaries().map((p) => ({ slug: p.slug }));
}

export const dynamicParams = false;

export async function generateMetadata(props: PageProps<"/products/[slug]">): Promise<Metadata> {
  const product = getProduct((await props.params).slug);
  if (!product) return {};
  const title = `${product.code ? `${product.code} ` : ""}${product.name}`;
  return { title, description: `${title} 在 ${product.storeCount} 間門市共 ${product.drawCount} 場抽籤。` };
}

export default async function ProductPage(props: PageProps<"/products/[slug]">) {
  const product = getProduct((await props.params).slug);
  if (!product) notFound();
  const draws = getDrawsByProduct(product.slug);
  const spellings = getSpellings(product.slug);

  return (
    <>
      <nav className="mb-4 text-sm text-muted">
        <Link href="/products" className="hover:text-ink">商品</Link>
        <span className="mx-2 text-faint">/</span>
        <span>{product.series === "其他" ? "其他" : `${product.series} 系列`}</span>
      </nav>

      <p className="font-mono text-sm text-faint">{product.code ?? "未標型號"}</p>
      <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{product.name}</h1>

      <dl className="mt-5 grid grid-cols-3 gap-2 sm:max-w-lg sm:gap-3">
        <Stat label="抽籤場次" value={product.drawCount} />
        <Stat label="門市數" value={product.storeCount} />
        <Stat label="常見標價" value={product.price != null ? `$${product.price}` : "—"} />
      </dl>

      <div className="mt-4 flex flex-wrap gap-2">
        <Link
          href={`/?product=${product.slug}`}
          className="inline-flex min-h-10 items-center rounded-lg bg-accent px-4 text-sm font-medium text-white hover:opacity-90"
        >
          在抽籤活動中篩選這款
        </Link>
      </div>

      {spellings.length > 1 && (
        <details className="mt-5 rounded-xl border border-line bg-surface">
          <summary className="cursor-pointer px-4 py-3 text-sm">
            貼文中的 {spellings.length} 種寫法已合併為此商品
          </summary>
          <ul className="flex flex-wrap gap-1.5 border-t border-line px-4 py-3">
            {spellings.map((s) => (
              <li key={s.name} className="rounded-md bg-surface-2 px-2 py-1 text-xs text-muted">
                {s.name} <span className="text-faint tabular">×{s.count}</span>
              </li>
            ))}
          </ul>
        </details>
      )}

      <h2 className="mb-3 mt-8 text-lg font-semibold">抽籤紀錄</h2>
      <DrawGrid draws={draws} renderedAt={renderedAt} highlightSlug={product.slug} />
    </>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl border border-line bg-surface px-3 py-3">
      <dt className="text-xs text-muted">{label}</dt>
      <dd className="mt-0.5 text-xl font-bold sm:text-2xl">{value}</dd>
    </div>
  );
}
