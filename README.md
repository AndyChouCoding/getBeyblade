# 陀螺抽籤情報 getBeyblade

彙整全台 Funbox 門市「戰鬥陀螺 BEYBLADE X」抽籤活動的 Next.js 網站。資料來自各門市 Facebook 公開貼文的爬蟲結果（`data/*.json`），網站在建置時清理、整併後輸出成靜態頁面，部署於 Vercel。

## 功能

| 頁面 | 路徑 | 說明 |
|---|---|---|
| 抽籤活動 | `/` | 依狀態（可參加／進行中／即將開始／已結束）分頁，可依縣市、商品篩選與搜尋；倒數時間即時更新；篩選條件同步到網址，可直接分享。搜尋商品（型號、品名或貼文中的寫法，如 `ux15`、`鯊魚包`）或從下拉選單選商品時，結果改為「每款商品一個區塊」，直接列出所有門市的抽籤按鈕 |
| 抽籤詳情 | `/draws/[id]` | 完整品項、抽籤連結、FB 原文與貼文全文 |
| 門市 | `/stores`、`/stores/[id]` | 依縣市分組、搜尋；每間門市的抽籤紀錄 |
| 商品 | `/products`、`/products/[slug]` | 依系列分組，顯示場次、門市數、常見標價與目前可參加場次；列出被合併的原始寫法 |
| 統計 | `/stats` | 數量統計、圖表與資料核對清單 |

- RWD：手機單欄、平板兩欄、桌機三欄；手機上篩選列固定在頂部
- 自動深色模式（跟隨系統設定）
- 點過的抽籤按鈕會標記為「已開啟」（只存在自己的瀏覽器）
- 抽籤狀態在瀏覽器端依當下時間計算，靜態頁面也會顯示正確狀態

## 資料清理

清理規則集中在 `src/lib/catalog.ts`，原始 JSON 不會被修改：

- **標準品名**：`CATALOG` 為每個型號定義一個標準名稱（例如 UX-15 有 12 種寫法，統一為「鮫鯊狂鱗 改造組」）。`-00` 型號底下有多種商品（如 CX-00 有 EVA 聯名與超人力霸王聯名），會依品名再細分
- **缺少型號的品項**：依品名歸類（`UNCODED_RULES`）；「抽籤連結」這類非商品的連結會另外顯示為說明連結
- **門市名稱**：誤抓成貼文標題的店名用 `STORE_NAME_OVERRIDES` 修正
- **抽籤時間**：結束時間被抓成與開始時間相同的活動，依貼文內容用 `DRAW_END_OVERRIDES` 修正；沒有時間的活動顯示為「時間未定」
- 型錄裡還沒有的新型號會自動使用清理過的原始品名，不需要先改程式也能顯示

## 開發

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # 正式建置（含型別檢查與靜態頁面產生）
npm run lint
```

技術：Next.js 16（App Router）、React 19、TypeScript、Tailwind CSS 4。

## 更新資料

1. 用新的爬蟲結果覆蓋 `data/draws.json`、`data/stores.json`（格式需相同）
2. 如果出現新型號或新的錯字，視需要更新 `src/lib/catalog.ts`
3. Commit 並 push，Vercel 會自動重新建置

## 部署到 Vercel

1. 在 [Vercel](https://vercel.com/new) 匯入此 GitHub repo
2. Framework Preset 選 Next.js，其餘使用預設值（Build Command `next build`）
3. Production Branch 設為 `main`

也可以用 CLI：`npx vercel`（預覽）、`npx vercel --prod`（正式）。

## 專案結構

```
data/                 原始 JSON（爬蟲輸出）
src/app/              頁面（App Router）
src/components/       UI 元件
src/hooks/useNow.ts   每 30 秒更新的現在時間（與伺服器渲染結果一致）
src/lib/catalog.ts    商品型錄與資料修正規則
src/lib/data.ts       讀取、清理、彙整資料（僅在伺服器端執行）
src/lib/time.ts       抽籤狀態與台灣時間格式化
```

## 免責聲明

本站資料彙整自各門市 Facebook 公開貼文，實際活動內容以門市公告為準。本站與 Funbox、TAKARA TOMY 無關。
