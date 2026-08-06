"use client";

import { type ReactNode } from "react";
import Link from "next/link";
import { Card } from "../primitives/Card";
import { cn } from "@/src/lib/utils";

interface MetricCardProps {
  label: string;
  value: string | number;
  icon: ReactNode;
  href?: string;
  color?: "primary" | "secondary" | "warning" | "error";
  trend?: { value: string; type: "up" | "down" | "neutral" };
  className?: string;
  style?: React.CSSProperties;
}

type ColorKey = "primary" | "secondary" | "warning" | "error";

const colorStyles: Record<ColorKey, { bg: string; text: string; bar: string }> =
  {
    primary: {
      bg: "bg-primary-light",
      text: "text-primary",
      bar: "bg-primary",
    },
    secondary: {
      bg: "bg-secondary-light",
      text: "text-secondary",
      bar: "bg-secondary",
    },
    warning: {
      bg: "bg-warning-light",
      text: "text-warning",
      bar: "bg-warning",
    },
    error: { bg: "bg-error-light", text: "text-error", bar: "bg-error" },
  };

const trendStyles: Record<
  NonNullable<MetricCardProps["trend"]>["type"],
  string
> = {
  up: "bg-secondary-light text-secondary",
  down: "bg-error-light text-error",
  neutral: "bg-slate-100 text-slate-500",
};

export function MetricCard({
  label,
  value,
  icon,
  href,
  color = "primary",
  trend,
  className = "",
  style,
}: MetricCardProps) {
  const styles = colorStyles[color as ColorKey];

  const content = (
    <Card
      className={cn(
        "relative overflow-hidden hover:shadow-card-hover transition-all duration-300",
        className,
      )}
    >
      <a
        href={href}
        className='block p-6 hover:bg-slate-50/50 transition-colors'
      >
        <div className='flex items-start justify-between gap-4'>
          <div className='flex-1 min-w-0'>
            <p className='text-sm font-medium text-slate-500 truncate'>
              {label}
            </p>
            <p className='text-3xl font-bold text-slate-900 mt-1'>{value}</p>
            {trend && (
              <div className='flex items-center gap-2 mt-3'>
                <span
                  className={cn(
                    "text-sm font-medium px-2 py-0.5 rounded-full",
                    trendStyles[trend.type],
                  )}
                >
                  {trend.value}
                </span>
                <span className='text-sm text-slate-400'>vs last period</span>
              </div>
            )}
          </div>
          <div
            className={cn(
              "shrink-0 w-12 h-12 rounded-xl flex items-center justify-center",
              styles.bg,
              styles.text,
            )}
            aria-hidden='true'
          >
            {icon}
          </div>
        </div>
        {/* Accent bar at bottom */}
        <div
          className={cn("absolute bottom-0 left-0 right-0 h-1", styles.bar)}
          aria-hidden='true'
        />
      </a>
    </Card>
  );

  return content;
}

export type { MetricCardProps };
