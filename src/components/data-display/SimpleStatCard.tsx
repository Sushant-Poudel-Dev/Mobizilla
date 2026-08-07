"use client";

import { type ReactNode } from "react";
import { Card } from "../primitives/Card";
import { cn } from "@/src/lib/utils";

const infoIcon = (
  <svg
    className='w-4 h-4 text-slate-400 hover:text-slate-600 transition-colors'
    fill='none'
    viewBox='0 0 24 24'
    stroke='currentColor'
    strokeWidth={1.5}
  >
    <path
      strokeLinecap='round'
      strokeLinejoin='round'
      d='M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V12z'
    />
  </svg>
);

const upArrow = (
  <svg
    className='w-3.5 h-3.5'
    fill='none'
    viewBox='0 0 24 24'
    stroke='currentColor'
    strokeWidth={2}
  >
    <path
      strokeLinecap='round'
      strokeLinejoin='round'
      d='M4.5 15.75l7.5-7.5 7.5 7.5'
    />
  </svg>
);

const downArrow = (
  <svg
    className='w-3.5 h-3.5'
    fill='none'
    viewBox='0 0 24 24'
    stroke='currentColor'
    strokeWidth={2}
  >
    <path
      strokeLinecap='round'
      strokeLinejoin='round'
      d='M19.5 8.25l-7.5 7.5-7.5-7.5'
    />
  </svg>
);

const trendStyles: Record<"up" | "down" | "neutral", string> = {
  up: "bg-teal-100 text-teal-700",
  down: "bg-error-light text-error",
  neutral: "bg-slate-100 text-slate-500",
};

interface SimpleStatCardProps {
  label: string;
  value: string | number;
  icon: ReactNode;
  href?: string;
  trend?: { value: string; type: "up" | "down" | "neutral" };
  className?: string;
  style?: React.CSSProperties;
}

export function SimpleStatCard({
  label,
  value,
  icon,
  href,
  trend,
  className = "",
  style,
}: SimpleStatCardProps) {
  return (
    <Card
      className={cn(
        "hover:shadow-card-hover transition-all duration-300",
        className,
      )}
      style={style}
    >
      <a
        href={href}
        className='block hover:bg-slate-50/50 transition-colors'
      >
        <div className='flex items-start justify-between gap-3'>
          <div className='flex items-center gap-2 min-w-0 flex-1'>
            <div
              className='shrink-0 w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600'
              aria-hidden='true'
            >
              {icon}
            </div>
            <div className='min-w-0'>
              <h3 className='text-base font-medium text-slate-900 truncate'>
                {label}
              </h3>
            </div>
          </div>
          <div className='shrink-0'>{infoIcon}</div>
        </div>
        <div className='flex items-baseline justify-between gap-3 mt-2'>
          <span className='text-2xl font-semibold text-slate-900 tabular-nums'>
            {value}
          </span>
          {trend && (
            <span
              className={cn(
                "flex items-center gap-1 text-sm font-medium px-2 py-0.5 rounded-full whitespace-nowrap",
                trendStyles[trend.type],
              )}
            >
              {trend.value}
              {trend.type === "up"
                ? upArrow
                : trend.type === "down"
                  ? downArrow
                  : null}
            </span>
          )}
        </div>
      </a>
    </Card>
  );
}
