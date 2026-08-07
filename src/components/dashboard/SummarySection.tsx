"use client";

import { DashboardMetrics } from "@/src/features/dashboard/queries";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../primitives/Card";

interface SummarySectionProps {
  metrics: DashboardMetrics;
}

export function SummarySection({ metrics }: SummarySectionProps) {
  const summaryItems = [
    { label: "Open Tickets", value: metrics.openTickets },
    { label: "In Progress", value: metrics.inProgressTickets },
    { label: "Completed", value: metrics.completedThisMonth },
    { label: "Revenue", value: `$${(metrics.revenueThisMonth / 100).toLocaleString()}` },
    { label: "Pending Invoices", value: metrics.pendingInvoices },
    { label: "Low Stock", value: metrics.lowStockItems },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Summary</CardTitle>
        <CardDescription>Key metrics at a glance</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {summaryItems.map((item, i) => (
          <div key={item.label} className="flex items-center justify-between py-3 border-t border-slate-100 first:border-0 first:pt-0">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
                <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <span className="text-sm text-slate-600">{item.label}</span>
            </div>
            <span className="text-sm font-semibold text-slate-900">{item.value}</span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}