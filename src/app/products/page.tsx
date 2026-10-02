import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { ProductCatalog, type DrawWindow } from "@/components/ProductCatalog";
import { SERIES_ORDER, getDraws, getProductSummaries, renderedAt } from "@/lib/data";

export const metadata: Metadata = { title: "商品列表" };

export default function ProductsPage() {
  const products = getProductSummaries();
  const windows: DrawWindow[] = getDraws().map((d) => ({
    drawStart: d.drawStart,
    drawEnd: d.drawEnd,
    slugs: d.items.map((i) => i.productSlug),
  }));
  return (
    <>
      <PageHeader
        title="商品列表"
        description={`抽籤中出現過的 ${products.length} 款商品。同型號不同寫法已合併為標準品名；價格為門市貼文中最常見的標價。`}
      />
      <ProductCatalog products={products} windows={windows} seriesOrder={SERIES_ORDER} renderedAt={renderedAt} />
    </>
  );
}
