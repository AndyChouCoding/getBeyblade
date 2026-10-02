import Link from "next/link";

export interface BarRow {
  label: string;
  value: number;
  href?: string;
}

/**
 * Single-series horizontal bar chart. Bars share one hue; the value sits at the
 * bar tip, and the same numbers are available in a table view below.
 */
export function BarChart({ title, rows, unit, caption }: { title: string; rows: BarRow[]; unit: string; caption?: string }) {
  const max = Math.max(...rows.map((r) => r.value), 1);
  return (
    <figure className="min-w-0 rounded-xl border border-line bg-surface p-4 sm:p-5">
      <figcaption className="mb-4">
        <h3 className="font-semibold">{title}</h3>
        {caption && <p className="mt-0.5 text-xs text-muted">{caption}</p>}
      </figcaption>
      <ul className="space-y-0.5">
        {rows.map((r) => {
          const label = (
            <span className="block truncate text-sm" title={r.label}>
              {r.label}
            </span>
          );
          return (
            <li
              key={r.label}
              title={`${r.label}：${r.value} ${unit}`}
              className="grid grid-cols-[minmax(0,7.5rem)_1fr] items-center gap-3 rounded-md px-1 py-1 hover:bg-surface-2 sm:grid-cols-[minmax(0,11rem)_1fr]"
            >
              {r.href ? (
                <Link href={r.href} className="min-w-0 hover:text-accent-ink hover:underline">
                  {label}
                </Link>
              ) : (
                label
              )}
              <span className="flex min-w-0 items-center gap-2">
                <span
                  className="h-4 shrink-0 rounded-r bg-chart"
                  style={{ width: `calc((100% - 2.5rem) * ${r.value / max})`, minWidth: 2 }}
                />
                <span className="text-xs text-muted tabular">{r.value}</span>
              </span>
            </li>
          );
        })}
      </ul>
      <details className="mt-4 text-sm">
        <summary className="cursor-pointer text-xs text-muted hover:text-ink">以表格檢視</summary>
        <table className="mt-2 w-full text-left text-sm">
          <thead>
            <tr className="border-b border-line text-xs text-muted">
              <th className="py-1.5 font-normal">項目</th>
              <th className="py-1.5 text-right font-normal">{unit}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.label} className="border-b border-line last:border-0">
                <td className="py-1.5">{r.label}</td>
                <td className="py-1.5 text-right tabular">{r.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </details>
    </figure>
  );
}
