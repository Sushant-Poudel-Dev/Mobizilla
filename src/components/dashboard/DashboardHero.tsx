"use client";

import { Badge } from "../primitives/Badge";

interface DashboardHeroProps {
  role: string;
  orgId: string;
  branchId: string | null;
}

export function DashboardHero({ role, orgId, branchId }: DashboardHeroProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-primary p-8 text-white">
      <div className="relative z-10">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-primary-light mt-2 text-lg opacity-90">
          Here&apos;s what&apos;s happening with your repair shop today.
        </p>
        <div className="flex flex-wrap items-center gap-3 mt-6">
          <Badge variant="accent" size="md" className="bg-white/20 text-white border-white/30 hover:bg-white/30">
            {role}
          </Badge>
          <span className="px-3 py-1.5 bg-white/10 border border-white/20 rounded-lg font-mono text-sm">
            {orgId.slice(0, 8)}...
          </span>
          {branchId && (
            <span className="px-3 py-1.5 bg-white/10 border border-white/20 rounded-lg font-mono text-sm">
              {branchId.slice(0, 8)}...
            </span>
          )}
        </div>
      </div>
      <div className="absolute top-0 right-0 w-72 h-72 bg-white/5 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2" aria-hidden="true" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/20 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" aria-hidden="true" />
    </div>
  );
}