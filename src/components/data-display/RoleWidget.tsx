"use client";

import { type ReactNode } from "react";
import { cn } from "@/src/lib/utils";
import { Card } from "../primitives/Card";
import { Button } from "../primitives/Button";
import { formatCurrency } from "@/src/lib/format";
import { Sparkline } from "./KPICard";

interface RoleWidgetProps {
  title: string;
  icon: ReactNode;
  children: ReactNode;
  href?: string;
  action?: { label: string; href?: string; onClick?: () => void; variant?: "primary" | "secondary" | "ghost" };
  className?: string;
}

export function RoleWidget({
  title,
  icon,
  children,
  href,
  action,
  className = "",
}: RoleWidgetProps) {
  return (
    <Card padding="md" className={cn("h-full", className)}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-accent/10 text-accent flex items-center justify-center">
            {icon}
          </div>
          <h3 className="text-lg font-semibold text-fg">{title}</h3>
        </div>
      </div>
      <div className="space-y-3">
        {children}
      </div>
      {(href || action) && (
        <div className="mt-4 pt-3 border-t border-border">
          {href ? (
            <a
              href={href}
              className="inline-flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-accent hover:underline"
            >
              View all
              <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </a>
          ) : action?.href ? (
            <a
              href={action.href}
              className="inline-flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-accent hover:underline"
            >
              {action.label}
              <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </a>
          ) : action?.onClick ? (
            <Button
              variant={action?.variant || "secondary"}
              className="w-full"
              onClick={action.onClick}
            >
              {action.label}
            </Button>
          ) : null}
        </div>
      )}
    </Card>
  );
}

interface RoleWidgetItemProps {
  label: string;
  value: string | number;
  trend?: { value: number; direction: "up" | "down" | "neutral" };
  sparklineData?: number[];
  icon?: React.ReactNode;
  className?: string;
}

export function RoleWidgetItem({
  label,
  value,
  trend,
  sparklineData,
  icon,
  className = "",
}: RoleWidgetItemProps) {
  return (
    <div className={cn("flex items-center justify-between gap-3 p-3 rounded-lg bg-bg/50", className)}>
      {icon && <span className="w-8 h-8 flex-shrink-0 flex items-center justify-center text-fg-tertiary">{icon}</span>}
      <div className="flex-1 min-w-0">
        <p className="text-xs text-fg-tertiary">{label}</p>
        <div className="flex items-baseline gap-2 flex-wrap">
          <span className="text-lg font-semibold text-fg tabular-nums">{value}</span>
          {trend && (
            <span
              className={`
                text-xs font-semibold px-1.5 py-0.5 rounded
                ${trend.direction === "up" ? "bg-success/10 text-success" : trend.direction === "down" ? "bg-error/10 text-error" : "bg-fg-tertiary/10 text-fg-tertiary"}
              `}
            >
              {trend.direction === "up" ? "↑" : trend.direction === "down" ? "↓" : "→"}{trend.value}%
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

interface RoleWidgetTableProps {
  columns: { key: string; header: string; width?: string }[];
  data: Array<Record<string, unknown>>;
  keyExtractor: (item: Array<Record<string, unknown>>[number]) => string;
  renderCell?: (item: Array<Record<string, unknown>>[number], columnKey: string) => ReactNode;
  emptyMessage?: string;
  className?: string;
}

export function RoleWidgetTable({
  columns,
  data,
  keyExtractor,
  renderCell,
  emptyMessage = "No data",
  className = "",
}: RoleWidgetTableProps) {
  if (!data.length) {
    return (
      <div className="text-center py-8 text-fg-tertiary">
        <svg className="w-12 h-12 mx-auto text-fg-tertiary/30 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <p className="text-sm">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border">
            {columns.map((col) => (
              <th
                key={col.key}
                className={`
                  px-3 py-2 text-left text-xs font-semibold text-fg-tertiary uppercase tracking-wider
                  ${col.width ? `w-[${col.width}]` : ""}
                `}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border/50">
          {data.map((item, rowIndex) => (
            <tr
              key={keyExtractor(item)}
              className={cn(
                "hover:bg-bg/50 transition-colors",
                rowIndex % 2 === 1 && "bg-bg/30"
              )}
            >
              {columns.map((col) => (
                <td key={col.key} className="px-3 py-2.5 text-fg">
                  {renderCell ? renderCell(item, col.key) : String(item[col.key] ?? "—")}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function RoleWidgetChart({
  data,
  label,
  color = "currentColor",
  className = "",
}: {
  data: number[];
  label?: string;
  color?: string;
  className?: string;
}) {
  if (!data.length) return null;

  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const width = 280;
  const height = 60;
  const padding = 8;
  const stepX = (width - padding * 2) / (data.length - 1);

  const points = data.map((value, i) => {
    const x = padding + i * stepX;
    const y = height - padding - ((value - min) / range) * (height - padding * 2);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(" ");

  const fillPoints = [
    `${width - padding},${height - padding}`,
    `${padding},${height - padding}`,
    ...data
      .map((value, i) => {
        const x = padding + i * stepX;
        const y = height - padding - ((value - min) / range) * (height - padding * 2);
        return `${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .reverse()
      .join(" "),
  ].join(" ");

  return (
    <div className={className}>
      {label && <p className="text-xs text-fg-tertiary mb-1">{label}</p>}
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full" aria-hidden="true">
        <defs>
          <linearGradient id="chart-gradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0.3" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
          </linearGradient>
        </defs>
        <polygon
          points={[
            `${width - padding},${height - padding}`,
            `${padding},${height - padding}`,
            ...data
              .map((value, i) => {
                const x = padding + i * stepX;
                const y = height - padding - ((value - min) / (max - min || 1)) * (height - padding * 2);
                return `${x.toFixed(1)},${y.toFixed(1)}`;
              })
              .reverse()
              .join(" "),
          ].join(" ")}
          fill="url(#chart-gradient)"
        />
        <polyline
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          points={data.map((value, i) => {
            const x = padding + i * stepX;
            const y = height - padding - ((value - min) / (max - min || 1)) * (height - padding * 2);
            return `${x.toFixed(1)},${y.toFixed(1)}`;
          }).join(" ")}
        />
        <circle
          cx={width - padding}
          cy={height - padding - ((data[data.length - 1]! - min) / (Math.max(...data) - min || 1)) * (height - padding * 2)}
          r={4}
          fill="currentColor"
        />
      </svg>
    </div>
  );
}

export function RoleWidgetSummary({
  items,
  className = "",
}: {
  items: Array<{ label: string; value: string | number; trend?: { value: number; direction: "up" | "down" | "neutral" } }>;
  className?: string;
}) {
  return (
    <div className={cn("grid gap-4 sm:grid-cols-2", className)}>
      {items.map((item, index) => (
        <div key={index} className="p-3 rounded-lg bg-bg/50">
          <p className="text-xs text-fg-tertiary mb-1">{item.label}</p>
          <div className="flex items-baseline gap-2 flex-wrap">
            <span className="text-xl font-bold text-fg tabular-nums">{item.value}</span>
            {item.trend && (
              <span
                className={`
                  text-xs font-semibold px-2 py-0.5 rounded
                  ${item.trend.direction === "up" ? "bg-success/10 text-success" : item.trend.direction === "down" ? "bg-error/10 text-error" : "bg-fg-tertiary/10 text-fg-tertiary"}
                `}
              >
                {item.trend.direction === "up" ? "↑" : item.trend.direction === "down" ? "↓" : "→"}{item.trend.value}%
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}