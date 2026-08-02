"use client";

import { type ReactNode } from "react";
import { Card, CardHeader, CardTitle } from "./Card";
import { formatRelativeTime } from "@/src/lib/format";

export interface ActivityItem {
  id: string;
  type: "repair_created" | "repair_updated" | "invoice_created" | "payment_received" | "purchase_received" | "stock_adjusted" | "customer_created";
  description: string;
  timestamp: string;
  href?: string;
  metadata?: Record<string, unknown>;
}

const typeIcons: Record<ActivityItem["type"], ReactNode> = {
  repair_created: (
    <svg className="w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
  ),
  repair_updated: (
    <svg className="w-5 h-5 text-warning" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
    </svg>
  ),
  invoice_created: (
    <svg className="w-5 h-5 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m-16.5 0a2.25 2.25 0 012.25-2.25H19.5A2.25 2.25 0 0121.75 5.25V12m-18 0v4.5m0 0H6.75m13.5-4.5H18a2.25 2.25 0 00-2.25 2.25v3.375m-1.5 3.75h.008v.008H12v-.008h-.008V16.5h-.008v-.008H8.25v.008H8.242v.008H5.25" />
    </svg>
  ),
  payment_received: (
    <svg className="w-5 h-5 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12M12 6a2 2 0 11-4 0 2 2 0 014 0ZM12 18a2 2 0 11-4 0 2 2 0 014 0ZM4.93 6.493a10.73 10.73 0 012.837-1.811M19.07 17.507a10.73 10.73 0 01-2.837 1.81M9.283 4.046a13.968 13.968 0 015.434 0M9.283 19.954a13.968 13.968 0 01-5.434 0" />
    </svg>
  ),
  purchase_received: (
    <svg className="w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
    </svg>
  ),
  stock_adjusted: (
    <svg className="w-5 h-5 text-error" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
    </svg>
  ),
  customer_created: (
    <svg className="w-5 h-5 text-info" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm-6 3a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0z" />
    </svg>
  ),
};

const typeColors: Record<ActivityItem["type"], string> = {
  repair_created: "bg-accent-light text-accent",
  repair_updated: "bg-warning-light text-warning",
  invoice_created: "bg-success-light text-success",
  payment_received: "bg-success-light text-success",
  purchase_received: "bg-accent-light text-accent",
  stock_adjusted: "bg-error-light text-error",
  customer_created: "bg-blue-50 text-blue-700",
};

interface ActivityFeedProps {
  activities: ActivityItem[];
  maxItems?: number;
  className?: string;
}

export function ActivityFeed({ activities, maxItems = 8, className = "" }: ActivityFeedProps) {
  const displayActivities = activities.slice(0, maxItems);

  if (displayActivities.length === 0) {
    return (
      <Card padding="md" className={className}>
        <div className="text-center py-8">
          <svg className="w-12 h-12 mx-auto text-fg-tertiary/50 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="text-fg-secondary">No recent activity</p>
        </div>
      </Card>
    );
  }

  return (
    <Card padding="none" className={className}>
      <CardHeader className="px-6 py-4">
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <div className="divide-y divide-border">
        {displayActivities.map((activity, index) => (
          <a
            key={activity.id}
            href={activity.href ?? "#"}
            className={`flex items-start gap-4 px-6 py-4 transition-colors hover:bg-bg-hover ${index === displayActivities.length - 1 ? "pb-4" : ""}`}
            onClick={(e) => { if (!activity.href) e.preventDefault(); }}
          >
            <div className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${typeColors[activity.type]}`}>
              {typeIcons[activity.type]}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-fg">{activity.description}</p>
              <p className="text-xs text-fg-tertiary mt-1">{formatRelativeTime(activity.timestamp)}</p>
            </div>
            <svg className="w-4 h-4 text-fg-tertiary flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </a>
        ))}
      </div>
    </Card>
  );
}

export type { ActivityFeedProps };