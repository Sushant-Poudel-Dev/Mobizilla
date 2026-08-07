"use client";

import { DashboardMetrics } from "@/src/features/dashboard/queries";
import { MetricCard } from "../data-display/MetricCard";

interface MetricsGridProps {
  metrics: DashboardMetrics;
}

export function MetricsGrid({ metrics }: MetricsGridProps) {
  const statConfigs = [
    {
      label: "Open Tickets",
      value: metrics.openTickets,
      href: "/dashboard/repairs",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      color: "primary" as const,
      trend: { value: "+2", type: "up" as const },
    },
    {
      label: "In Progress",
      value: metrics.inProgressTickets,
      href: "/dashboard/repairs",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: "warning" as const,
      trend: { value: "+1", type: "up" as const },
    },
    {
      label: "Completed",
      value: metrics.completedThisMonth,
      href: "/dashboard/repairs",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
        </svg>
      ),
      color: "secondary" as const,
      trend: { value: "+12%", type: "up" as const },
    },
    {
      label: "Revenue",
      value: `$${(metrics.revenueThisMonth / 100).toLocaleString()}`,
      href: "/dashboard/invoices",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12M12 6a2 2 0 11-4 0 2 2 0 014 0ZM12 18a2 2 0 11-4 0 2 2 0 014 0ZM4.93 6.493a10.73 10.73 0 012.837-1.811M19.07 17.507a10.73 10.73 0 01-2.837 1.81M9.283 4.046a13.968 13.968 0 015.434 0M9.283 19.954a13.968 13.968 0 01-5.434 0" />
        </svg>
      ),
      color: "primary" as const,
      trend: { value: "+8%", type: "up" as const },
    },
    {
      label: "Pending Invoices",
      value: metrics.pendingInvoices,
      href: "/dashboard/invoices",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m-16.5 0a2.25 2.25 0 012.25-2.25H19.5A2.25 2.25 0 0121.75 5.25V12m-18 0v4.5m0 0H6.75m13.5-4.5H18a2.25 2.25 0 00-2.25 2.25v3.375m-1.5 3.75h.008v.008H12v-.008h-.008V16.5h-.008v-.008H8.25v.008H8.242v.008H5.25" />
        </svg>
      ),
      color: "warning" as const,
      trend: { value: "-3", type: "down" as const },
    },
    {
      label: "Low Stock",
      value: metrics.lowStockItems,
      href: "/dashboard/inventory/stock",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
        </svg>
      ),
      color: (metrics.lowStockItems > 5 ? "error" : "secondary") as "primary" | "secondary" | "warning" | "error",
      trend: { value: metrics.lowStockItems > 0 ? "⚠" : "—", type: (metrics.lowStockItems > 0 ? "up" : "neutral") as "up" | "down" | "neutral" },
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {statConfigs.map((stat, index) => (
        <MetricCard
          key={stat.label}
          label={stat.label}
          value={stat.value}
          icon={stat.icon}
          href={stat.href}
          color={stat.color}
          trend={stat.trend}
          style={{ animationDelay: `${(index + 1) * 60}ms` }}
        />
      ))}
    </div>
  );
}