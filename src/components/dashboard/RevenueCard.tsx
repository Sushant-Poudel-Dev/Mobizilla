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

const revenueIcon = (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12M12 6a2 2 0 11-4 0 2 2 0 014 0ZM12 18a2 2 0 11-4 0 2 2 0 014 0ZM4.93 6.493a10.73 10.73 0 012.837-1.811M19.07 17.507a10.73 10.73 0 01-2.837 1.81M9.283 4.046a13.968 13.968 0 015.434 0M9.283 19.954a13.968 13.968 0 01-5.434 0" />
  </svg>
);

export function RevenueCard({ metrics }: RevenueCardProps) {
  const avgTicket = metrics.completedThisMonth > 0 
    ? metrics.revenueThisMonth / metrics.completedThisMonth 
    : 0;

  return (
    <Card className="h-full">
      <div className="px-4 py-3 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary-light flex items-center justify-center">
            {revenueIcon}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-900">Revenue Overview</h3>
            <p className="text-sm text-slate-500 mt-0.5">This month performance</p>
          </div>
        </div>
        <span className="text-sm text-slate-500">This Month</span>
      </div>
      <CardContent className="p-4 pt-4">
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="sm:col-span-2 space-y-3">
            <div>
              <p className="text-sm text-slate-500">Total Revenue</p>
              <p className="text-3xl font-semibold text-slate-900 tabular-nums mt-1">
                ${(metrics.revenueThisMonth / 100).toLocaleString()}
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm text-teal-700 bg-teal-50 px-3 py-1.5 rounded-full w-fit">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
              </svg>
              <span>+12% vs last month</span>
            </div>
          </div>
          <div className="space-y-3 p-4 bg-slate-50 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500">Avg. Ticket Value</span>
              <span className="text-lg font-semibold text-slate-900 tabular-nums">
                ${avgTicket.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500">Pending Invoices</span>
              <span className="text-lg font-semibold text-slate-900 tabular-nums">
                {metrics.pendingInvoices}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500">Completed Jobs</span>
              <span className="text-lg font-semibold text-slate-900 tabular-nums">
                {metrics.completedThisMonth}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}