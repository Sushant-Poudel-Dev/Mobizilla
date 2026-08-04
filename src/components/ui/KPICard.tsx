"use client";

import { type ReactNode } from "react";

interface SparklineProps {
  data: number[];
  color?: string;
  strokeWidth?: number;
  className?: string;
  fill?: boolean;
  fillOpacity?: number;
}

export function Sparkline({
  data,
  color = "currentColor",
  strokeWidth = 2,
  className = "",
  fill = false,
  fillOpacity = 0.1,
}: SparklineProps) {
  if (!data.length) return null;

  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const width = 100;
  const height = 32;
  const padding = 4;
  const stepX = (width - padding * 2) / (data.length - 1);

  const lastValue = data[data.length - 1];

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
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className={`w-full h-full ${className}`}
      aria-hidden="true"
      role="img"
      aria-label="Trend chart"
    >
      {fill && (
        <polygon
          points={fillPoints}
          fill={color}
          fillOpacity={fillOpacity}
        />
      )}
      <polyline
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
      <circle
        cx={width - padding}
        cy={height - padding - ((lastValue! - min) / Math.max(1, Math.max(...data) - min)) * (height - padding * 2)}
        r={3}
        fill={color}
      />
    </svg>
  );
}

interface TrendBadgeProps {
  value: number;
  direction: "up" | "down" | "neutral";
  label?: string;
  className?: string;
}

export function TrendBadge({ value, direction, label, className = "" }: TrendBadgeProps) {
  if (direction === "neutral") {
    return (
      <span className={`inline-flex items-center gap-1 text-xs font-medium text-fg-tertiary ${className}`}>
        <span aria-hidden="true">—</span>
        {label && <span>{label}</span>}
      </span>
    );
  }

  const isUp = direction === "up";
  return (
    <span
      className={`
        inline-flex items-center gap-1 text-xs font-semibold
        ${isUp ? "text-success" : "text-error"} ${className}
      `}
    >
      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        {isUp ? (
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
        ) : (
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V5" />
        )}
      </svg>
      <span>{value}%</span>
      {label && <span className="text-fg-tertiary">{label}</span>}
    </span>
  );
}

interface KPICardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  href: string;
  trend?: { value: number; direction: "up" | "down" | "neutral"; previousValue?: number };
  iconBg: string;
  iconColor: string;
  sparklineData?: number[];
  delay?: number;
  alert?: { message: string; severity: "warning" | "critical" | "info" };
}

export function KPICard({
  label,
  value,
  icon,
  href,
  trend,
  iconBg,
  iconColor,
  sparklineData,
  delay = 0,
  alert,
}: KPICardProps) {
  return (
    <a
      href={href}
      className={`
        block animate-fade-in-up delay-${Math.min(delay, 8)}
        group
      `}
    >
      <article className="bg-bg-elevated border border-border rounded-xl p-5 hover:shadow-lg hover:border-accent/30 transition-all duration-200">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-fg-tertiary uppercase tracking-wider mb-1">{label}</p>
            <div className="flex items-baseline gap-2 flex-wrap">
              <span className="text-3xl font-bold text-fg tabular-nums">{value}</span>
              {trend && (
                <TrendBadge
                  value={trend.value}
                  direction={trend.direction}
                  label={trend.previousValue !== undefined ? `vs last period` : undefined}
                />
              )}
            </div>
            {sparklineData && sparklineData.length > 1 && (
              <div className="mt-2 h-8 w-full max-w-xs" aria-hidden="true">
                <Sparkline data={sparklineData} color="currentColor" strokeWidth={2} fill fillOpacity={0.08} />
              </div>
            )}
            {alert && (
              <div className="mt-2 flex items-center gap-1.5 text-xs">
                <span className={`
                  px-2 py-0.5 rounded-full font-medium
                  ${alert.severity === "critical" ? "bg-error/10 text-error" : alert.severity === "warning" ? "bg-warning/10 text-warning" : "bg-accent/10 text-accent"}
                `}>
                  {alert.message}
                </span>
              </div>
            )}
          </div>
          <div className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center text-2xl" style={{ backgroundColor: `var(--color-${iconBg.replace("bg-", "")})`, color: `var(--color-${iconColor.replace("text-", "")})` }}>
            {icon}
          </div>
        </div>
        <div className="mt-4 pt-3 border-t border-border flex items-center justify-between text-xs text-fg-tertiary">
          <span>View details</span>
          <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </article>
    </a>
  );
}