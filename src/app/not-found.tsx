import Link from "next/link";

export default function NotFound() {
  return (
    <div className="py-24 text-center">
      <p className="font-mono text-sm text-faint">404</p>
      <h1 className="mt-2 text-2xl font-bold">找不到這個頁面</h1>
      <p className="mt-2 text-sm text-muted">抽籤活動可能已從資料中移除。</p>
      <Link href="/" className="mt-6 inline-flex min-h-10 items-center rounded-lg bg-accent px-4 text-sm font-medium text-white hover:opacity-90">
        回到抽籤活動
      </Link>
    </div>
  );
}
