"use client";

import { type ReactNode } from "react";
import { Card } from "../primitives/Card";
import { cn } from "@/src/lib/utils";

interface SimpleStatCardProps {
  label: string;
  value: string | number;
  icon: ReactNode;
  href?: string;
  trend?: { value: string; type: "up" | "down" | "neutral" };
  className?: string;
  style?: React.CSSProperties;
}

const trendStyles: Record<NonNullable<SimpleStatCardProps["trend"]>["type"], string> = {
  up: "bg-secondary-light text-secondary",
  down: "bg-error-light text-error",
  neutral: "bg-slate-100 text-slate-500",
};

export function SimpleStatCard({
  label,
  value,
  icon,
  href,
  trend,
  className = "",
}: SimpleStatCardProps) {
  const content = (
    <Card className={cn("hover:shadow-card-hover transition-all duration-300", className)}>
      <a href={href} className="block p-4 hover:bg-slate-50/50 transition-colors">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-500 truncate">{label}</p>
            <p className="text-3xl font-bold text-slate-900 mt-1">{value}</p>
            {trend && (
              <div className="flex items-center gap-2 mt-3">
                <span className={cn("text-sm font-medium px-2 py-0.5 rounded-full", trendStyles[trend.type])}>
                  {trend.value}
                </span>
                <span className="text-sm text-slate-400">vs last period</span>
              </div>
            )}
          </div>
          <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600" aria-hidden="true">
            {icon}
          </div>
        </div>
      </a>
    </Card>
  );

  return content;
}