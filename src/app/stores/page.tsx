import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { StoreDirectory } from "@/components/StoreDirectory";
import { getCities, getStoreSummaries } from "@/lib/data";

export const metadata: Metadata = { title: "門市列表" };

export default function StoresPage() {
  const stores = getStoreSummaries();
  const withDraws = stores.filter((s) => s.drawCount > 0).length;
  return (
    <>
      <PageHeader
        title="門市列表"
        description={`共 ${stores.length} 間門市／粉專，其中 ${withDraws} 間有抽籤紀錄。`}
      />
      <StoreDirectory stores={stores} cities={getCities()} />
    </>
  );
}
