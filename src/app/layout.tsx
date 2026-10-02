import type { Metadata, Viewport } from "next";
import { SiteHeader } from "@/components/SiteHeader";
import { dataUpdatedAt } from "@/lib/data";
import { formatDateTime } from "@/lib/time";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "陀螺抽籤情報｜Funbox 戰鬥陀螺抽籤彙整",
    template: "%s｜陀螺抽籤情報",
  },
  description: "彙整全台 Funbox 門市的戰鬥陀螺 BEYBLADE X 抽籤活動、品項與抽籤連結。",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f5f5f2" },
    { media: "(prefers-color-scheme: dark)", color: "#111113" },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="zh-Hant-TW" className="h-full antialiased">
      <body className="flex min-h-full flex-col font-sans">
        <SiteHeader />
        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-6 sm:py-8">{children}</main>
        <footer className="border-t border-line">
          <div className="mx-auto max-w-6xl px-4 py-6 text-xs leading-relaxed text-faint sm:px-6">
            <p>資料更新：{formatDateTime(dataUpdatedAt)}（台灣時間）</p>
            <p>資料彙整自各門市 Facebook 公開貼文，實際活動內容以門市公告為準。本站與 Funbox、TAKARA TOMY 無關。</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
