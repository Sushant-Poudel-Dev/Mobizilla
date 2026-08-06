"use client";

import { DashboardMetrics } from "@/src/features/dashboard/queries";
import { SimpleStatCard } from "../data-display/SimpleStatCard";

interface StatsSectionProps {
  metrics: DashboardMetrics;
}

export function StatsSection({ metrics }: StatsSectionProps) {
  const stats = [
    {
      label: "Open Tickets",
      value: metrics.openTickets,
      href: "/dashboard/repairs",
      icon: (
        <svg
          className='w-5 h-5'
          fill='none'
          viewBox='0 0 24 24'
          stroke='currentColor'
          strokeWidth={1.5}
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
          />
        </svg>
      ),
      trend: { value: "+2", type: "up" as const },
    },
    {
      label: "In Progress",
      value: metrics.inProgressTickets,
      href: "/dashboard/repairs",
      icon: (
        <svg
          className='w-5 h-5'
          fill='none'
          viewBox='0 0 24 24'
          stroke='currentColor'
          strokeWidth={1.5}
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            d='M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z'
          />
        </svg>
      ),
      trend: { value: "+1", type: "up" as const },
    },
    {
      label: "Completed This Month",
      value: metrics.completedThisMonth,
      href: "/dashboard/repairs",
      icon: (
        <svg
          className='w-5 h-5'
          fill='none'
          viewBox='0 0 24 24'
          stroke='currentColor'
          strokeWidth={1.5}
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            d='M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z'
          />
        </svg>
      ),
      trend: { value: "+12%", type: "up" as const },
    },
  ];

  return (
    <div className='grid gap-4 sm:grid-cols-3'>
      {stats.map((stat, index) => (
        <SimpleStatCard
          key={stat.label}
          label={stat.label}
          value={stat.value}
          icon={stat.icon}
          href={stat.href}
          trend={stat.trend}
          style={{ animationDelay: `${(index + 1) * 60}ms` }}
        />
      ))}
    </div>
  );
}
