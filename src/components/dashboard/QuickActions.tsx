"use client";

import { Card, CardContent } from "../primitives/Card";
import { cn } from "@/src/lib/utils";

interface QuickAction {
  label: string;
  href: string;
  icon?: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost";
}

interface QuickActionsProps {
  actions: QuickAction[];
}

const actionIcons: Record<string, React.ReactNode> = {
  "New Repair Ticket": (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
  ),
  "New Invoice": (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m-16.5 0a2.25 2.25 0 012.25-2.25H19.5A2.25 2.25 0 0121.75 5.25V12m-18 0v4.5m0 0H6.75m13.5-4.5H18a2.25 2.25 0 00-2.25 2.25v3.375m-1.5 3.75h.008v.008H12v-.008h-.008V16.5h-.008v-.008H8.25v.008H8.242v.008H5.25" />
    </svg>
  ),
  "New Customer": (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm-6 3a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0z" />
    </svg>
  ),
  "Manage Inventory": (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
    </svg>
  ),
  "Purchase Orders": (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
    </svg>
  ),
  "Staff Management": (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0ZM15.75 19.5a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0ZM21 15.75a3.75 3.75 0 01-7.5 0H3a3.75 3.75 0 010-7.5h10.5a3.75 3.75 0 017.5 0Z" />
    </svg>
  ),
  "View Invoices": (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m-16.5 0a2.25 2.25 0 012.25-2.25H19.5A2.25 2.25 0 0121.75 5.25V12m-18 0v4.5m0 0H6.75m13.5-4.5H18a2.25 2.25 0 00-2.25 2.25v3.375m-1.5 3.75h.008v.008H12v-.008h-.008V16.5h-.008v-.008H8.25v.008H8.242v.008H5.25" />
    </svg>
  ),
  "My Tickets": (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 012 2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
    </svg>
  ),
  "Update Status": (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
    </svg>
  ),
  "View Tickets": (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  ),
};

export function QuickActions({ actions }: QuickActionsProps) {
  return (
    <Card>
      <div className="p-4 pb-2">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">Quick Actions</h3>
            <p className="text-sm text-slate-500 mt-0.5">Common tasks for your role</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {actions.slice(0, 4).map((action) => {
            const Icon = actionIcons[action.label] || action.icon;
            const isPrimary = action.variant === "primary";
            const isGhost = action.variant === "ghost";
            return (
              <a
                key={action.label}
                href={action.href}
                className={cn(
                  "relative p-4 rounded-xl transition-all duration-200 border",
                  isPrimary
                    ? "bg-primary-light border-primary/30 hover:bg-primary/10 hover:border-primary/50"
                    : isGhost
                    ? "bg-transparent border-slate-200 hover:bg-slate-50 hover:border-slate-300"
                    : "bg-slate-50 border-slate-200 hover:bg-slate-100 hover:border-slate-300"
                )}
              >
                <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center mb-3", isPrimary ? "bg-primary text-white" : isGhost ? "bg-white text-slate-500 border border-slate-200" : "bg-white text-slate-600 border border-slate-200")}>
                  {Icon}
                </div>
                <p className={cn("text-sm font-medium", isPrimary ? "text-primary" : isGhost ? "text-slate-500" : "text-slate-700")}>
                  {action.label}
                </p>
              </a>
            );
          })}
        </div>
      </div>
    </Card>
  );
}