"use client";

import { Card, CardContent } from "../primitives/Card";
import { cn } from "@/src/lib/utils";

interface RevenueCardProps {
  metrics: {
    revenueThisMonth: number;
    completedThisMonth: number;
    pendingInvoices: number;
  };
}

const coinIcon = (
  <svg
    className='w-5 h-5'
    fill='none'
    viewBox='0 0 24 24'
    stroke='currentColor'
    strokeWidth={1.5}
  >
    <circle
      cx='12'
      cy='12'
      r='10'
      stroke='currentColor'
      strokeWidth={1.5}
    />
    <path
      strokeLinecap='round'
      strokeLinejoin='round'
      d='M12 6v12M12 6a2 2 0 11-4 0 2 2 0 014 0ZM12 18a2 2 0 11-4 0 2 2 0 014 0Z'
      strokeWidth={1.5}
    />
  </svg>
);

const filterOptions = [
  { value: "today", label: "Today" },
  { value: "week", label: "This Week" },
  { value: "month", label: "This Month" },
  { value: "quarter", label: "This Quarter" },
  { value: "year", label: "This Year" },
];

const statCards = [
  {
    label: "Orders",
    value: "1,234",
    icon: (
      <svg
        className='w-4 h-4'
        fill='none'
        viewBox='0 0 24 24'
        stroke='currentColor'
        strokeWidth={2}
      >
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          d='M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z'
        />
      </svg>
    ),
  },
  {
    label: "Earnings",
    value: "Rs 45,678",
    icon: (
      <svg
        className='w-4 h-4'
        fill='none'
        viewBox='0 0 24 24'
        stroke='currentColor'
        strokeWidth={2}
      >
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          d='M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
        />
      </svg>
    ),
  },
  {
    label: "Refunds",
    value: "23",
    icon: (
      <svg
        className='w-4 h-4'
        fill='none'
        viewBox='0 0 24 24'
        stroke='currentColor'
        strokeWidth={2}
      >
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          d='M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 012 2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4'
        />
      </svg>
    ),
  },
  {
    label: "Ratio",
    value: "3.2x",
    icon: (
      <svg
        className='w-4 h-4'
        fill='none'
        viewBox='0 0 24 24'
        stroke='currentColor'
        strokeWidth={2}
      >
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          d='M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z'
        />
      </svg>
    ),
  },
];

export function RevenueCard({ metrics }: RevenueCardProps) {
  const avgTicket =
    metrics.completedThisMonth > 0
      ? metrics.revenueThisMonth / metrics.completedThisMonth
      : 0;

  return (
    <Card className='h-full'>
      <div className='px-4 py-3 border-b border-border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3'>
        <div className='flex items-center gap-3'>
          <div className='w-10 h-10 rounded-lg bg-primary-light flex items-center justify-center'>
            {coinIcon}
          </div>
          <div>
            <h3 className='text-lg font-semibold text-slate-900'>
              Revenue Overview
            </h3>
            <p className='text-sm text-slate-500 mt-0.5'>Performance metrics</p>
          </div>
        </div>
        <div className='flex flex-wrap items-center gap-2'>
          <select
            defaultValue="month"
            className='px-3 py-1.5 text-sm border border-slate-300 rounded-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent'
          >
            {filterOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      <CardContent className='p-4 pt-4 space-y-4'>
        {/* 4 Stat Cards - Orders, Earnings, Refunds, Ratio */}
        <div className='border-b border-border pb-4'>
          <div className='grid grid-cols-4 gap-0'>
            {statCards.map((stat, index) => (
              <div
                key={stat.label}
                className={cn(
                  "flex flex-col items-center p-4",
                  index < 3 && "border-r border-border",
                )}
              >
                <div className='w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 mb-2'>
                  {stat.icon}
                </div>
                <span className='text-2xl font-semibold text-slate-900 tabular-nums mb-1'>
                  {stat.value}
                </span>
                <span className='text-sm text-slate-500'>{stat.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Main Revenue Stats */}
        <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
          <div className='lg:col-span-2 space-y-3'>
            <div>
              <p className='text-sm text-slate-500'>Total Revenue</p>
              <p className='text-3xl font-semibold text-slate-900 tabular-nums mt-1'>
                Rs {(metrics.revenueThisMonth / 100).toLocaleString()}
              </p>
            </div>
            <div className='flex items-center gap-2 text-sm text-teal-700 bg-teal-50 px-3 py-1.5 rounded-full w-fit'>
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
              <span>+12% vs last month</span>
            </div>
          </div>
          <div className='space-y-3 p-4 bg-slate-50 rounded-lg'>
            <div className='flex items-center justify-between'>
              <span className='text-sm text-slate-500'>Avg. Ticket Value</span>
              <span className='text-lg font-semibold text-slate-900 tabular-nums'>
                Rs {avgTicket.toLocaleString()}
              </span>
            </div>
            <div className='flex items-center justify-between'>
              <span className='text-sm text-slate-500'>Pending Invoices</span>
              <span className='text-lg font-semibold text-slate-900 tabular-nums'>
                {metrics.pendingInvoices}
              </span>
            </div>
            <div className='flex items-center justify-between'>
              <span className='text-sm text-slate-500'>Completed Jobs</span>
              <span className='text-lg font-semibold text-slate-900 tabular-nums'>
                {metrics.completedThisMonth}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
