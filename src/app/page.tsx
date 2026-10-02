import { Suspense } from "react";
import { DrawExplorer, DrawExplorerFromUrl, type ProductOption } from "@/components/DrawExplorer";
import { PageHeader } from "@/components/PageHeader";
import { getCities, getDraws, getProductSummaries, renderedAt } from "@/lib/data";

export default function Home() {
  const draws = getDraws();
  const cities = getCities().filter((c) => draws.some((d) => d.city === c));
  const products: ProductOption[] = getProductSummaries().map(({ slug, code, name, series }) => ({ slug, code, name, series }));
  const props = { draws, cities, products, renderedAt };

  return (
    <>
      <PageHeader
        title="戰鬥陀螺抽籤活動"
        description={`彙整 ${new Set(draws.map((d) => d.storeId)).size} 間 Funbox 門市的 ${draws.length} 場抽籤，點「抽籤」直接前往該品項的 LINE 抽籤頁。`}
      />
      <Suspense fallback={<DrawExplorer {...props} />}>
        <DrawExplorerFromUrl {...props} />
      </Suspense>
    </>
  );
}
