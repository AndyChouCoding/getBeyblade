import type { ReactNode } from "react";

export function PageHeader({ title, description, children }: { title: ReactNode; description?: ReactNode; children?: ReactNode }) {
  return (
    <div className="mb-6">
      <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{title}</h1>
      {description && <p className="mt-1.5 text-sm leading-relaxed text-muted">{description}</p>}
      {children}
    </div>
  );
}
