import { type ReactNode } from "react";
import { Card } from "../primitives/Card";
import { Button } from "../primitives/Button";

export type StatCardChangeType = "up" | "down" | "neutral";

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: ReactNode;
  change?: string;
  changeType?: StatCardChangeType;
  href?: string;
  trend?: number[]; // for sparkline
  className?: string;
  delay?: number;
}

const changeTypeColors: Record<StatCardChangeType, string> = {
  up: "text-success",
  down: "text-error",
  neutral: "text-fg-tertiary",
};

export function StatCard({
  label,
  value,
  icon,
  change,
  changeType = "neutral",
  href,
  trend,
  className = "",
  delay = 0,
}: StatCardProps) {
  const content = (
    <Card padding="md" hover={!!href} className={`animate-fade-in-up delay-${Math.min(delay, 8)} ${className}`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-fg-secondary tracking-wide">{label}</p>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-semibold text-fg tabular-nums">{value}</span>
            {change && (
              <span className={`text-sm font-medium ${changeTypeColors[changeType]}`}>
                {change}
              </span>
            )}
          </div>
          {trend && trend.length > 1 && (
            <div className="mt-2 h-4" aria-hidden="true">
              <Sparkline data={trend} color={changeType === "up" ? "var(--color-success)" : changeType === "down" ? "var(--color-error)" : "var(--color-fg-tertiary)"} />
            </div>
          )}
        </div>
        {icon && (
          <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-accent-light text-accent flex items-center justify-center">
            {icon}
          </div>
        )}
      </div>
      {href && (
        <a
          href={href}
          className="mt-4 block text-sm font-medium text-accent hover:text-accent-hover transition-colors"
        >
          View details →
        </a>
      )}
    </Card>
  );

  return content;
}

function Sparkline({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const width = 100;
  const height = 16;
  const stepX = width / (data.length - 1);

  const points = data.map((value, i) => {
    const x = i * stepX;
    const y = height - ((value - min) / range) * (height - 2) - 1;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(" ");

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full" aria-hidden="true">
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
    </svg>
  );
}

export function StatCardGrid({
  stats,
  columns = { base: 1, sm: 2, lg: 3, xl: 6 },
  className = "",
}: {
  stats: StatCardProps[];
  columns?: { base?: number; sm?: number; lg?: number; xl?: number };
  className?: string;
}) {
  return (
    <div
      className={`
        grid gap-4
        grid-cols-${columns.base ?? 1}
        sm:grid-cols-${columns.sm ?? 2}
        lg:grid-cols-${columns.lg ?? 3}
        xl:grid-cols-${columns.xl ?? 6}
        ${className}
      `}
    >
      {stats.map((stat, index) => (
        <StatCard key={stat.label} {...stat} delay={index + 1} />
      ))}
    </div>
  );
}

export type { StatCardProps };