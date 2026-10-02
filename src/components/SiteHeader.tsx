"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { href: "/", label: "抽籤活動", match: (p: string) => p === "/" || p.startsWith("/draws") },
  { href: "/stores", label: "門市", match: (p: string) => p.startsWith("/stores") },
  { href: "/products", label: "商品", match: (p: string) => p.startsWith("/products") },
  { href: "/stats", label: "統計", match: (p: string) => p.startsWith("/stats") },
];

export function SiteHeader() {
  const pathname = usePathname();
  return (
    <header className="sticky top-0 z-20 border-b border-line bg-bg/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 pt-3 sm:h-14 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:pt-0">
        <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
          <Spinner />
          <span>陀螺抽籤情報</span>
        </Link>
        <nav className="no-scrollbar -mx-4 flex overflow-x-auto px-4 sm:mx-0 sm:px-0" aria-label="主選單">
          {NAV.map((item) => {
            const active = item.match(pathname);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`shrink-0 border-b-2 px-3 py-2.5 text-sm transition-colors sm:py-4 ${
                  active ? "border-accent font-medium text-ink" : "border-transparent text-muted hover:text-ink"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}

function Spinner() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true" className="text-accent">
      <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="M12 2a10 10 0 0 1 8.66 5L12 12Z" fill="currentColor" />
      <path d="M12 22a10 10 0 0 1-8.66-5L12 12Z" fill="currentColor" />
      <circle cx="12" cy="12" r="2.5" fill="var(--surface)" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}
