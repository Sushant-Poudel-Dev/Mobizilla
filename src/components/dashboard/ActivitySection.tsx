"use client";

import { ActivityFeed } from "../data-display/ActivityFeed";
import { Card, CardContent } from "../primitives/Card";
import type { ActivityItem } from "../data-display/ActivityFeed";

interface ActivitySectionProps {
  activities: ActivityItem[];
}

export function ActivitySection({ activities }: ActivitySectionProps) {
  return (
    <Card className="h-full">
      <div className="px-4 py-3 border-b border-border flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Recent Activity</h3>
          <p className="text-sm text-slate-500 mt-0.5">Latest actions across your shop</p>
        </div>
        <a 
          href="/dashboard/activity" 
          className="text-sm text-primary hover:text-primary-hover font-medium transition-colors whitespace-nowrap"
        >
          View all
        </a>
      </div>
      <CardContent className="p-0">
        <ActivityFeed activities={activities} maxItems={10} hideHeader />
      </CardContent>
    </Card>
  );
}