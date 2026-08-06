"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/src/lib/utils";
import { SearchInput } from "../primitives/SearchInput";
import { InlineUserInfo } from "./InlineUserInfo";

const routeLabels: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/dashboard/repairs": "Repairs",
  "/dashboard/invoices": "Invoices",
  "/dashboard/inventory": "Inventory",
  "/dashboard/inventory/stock": "Stock",
  "/dashboard/customers": "Customers",
  "/dashboard/suppliers": "Suppliers",
  "/dashboard/purchases": "Purchases",
  "/dashboard/staff": "Staff",
};

function getBreadcrumbs(pathname: string) {
  const segments = pathname.split("/").filter(Boolean);
  const breadcrumbs = [{ label: "Dashboard", href: "/dashboard" }];

  let currentPath = "";
  for (let i = 1; i < segments.length; i++) {
    const segment = segments[i];
    if (!segment) continue;
    currentPath += "/" + segment;
    const label = routeLabels[currentPath] || segment.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
    breadcrumbs.push({ label, href: currentPath });
  }

  return breadcrumbs;
}

export function DashboardHeader({
  user,
  onMenuClick,
}: {
  user: { full_name: string; role: string };
  onMenuClick?: () => void;
}) {
  const pathname = usePathname();
  const breadcrumbs = getBreadcrumbs(pathname);

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-border shadow-sm">
      <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
        {/* Left: Menu button + Search + Breadcrumbs */}
        <div className="flex items-center gap-4 min-w-0 flex-1">
          <button
            className="lg:hidden p-2 rounded-md text-fg-secondary hover:bg-bg-hover hover:text-fg transition-colors"
            onClick={onMenuClick}
            aria-label="Open menu"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>

          {/* Search Input - replaces "Dashboard" breadcrumb */}
          <SearchInput />

          {/* Remaining Breadcrumbs (skip first "Dashboard") */}
          <nav className="hidden sm:flex items-center gap-2 flex-wrap min-w-0" aria-label="Breadcrumb">
            {breadcrumbs.slice(1).map((crumb, index) => (
              <span key={crumb.href} className="flex items-center gap-2">
                {index > 0 && (
                  <svg className="w-4 h-4 text-fg-tertiary flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                )}
                {index === breadcrumbs.length - 2 ? (
                  <span className="text-sm font-medium text-fg truncate">{crumb.label}</span>
                ) : (
                  <Link
                    href={crumb.href}
                    className="text-sm text-fg-secondary hover:text-fg transition-colors truncate max-w-[150px]"
                  >
                    {crumb.label}
                  </Link>
                )}
              </span>
            ))}
          </nav>
        </div>

        {/* Right: User info (desktop only) */}
        <div className="hidden lg:flex items-center gap-3">
          <InlineUserInfo name={user.full_name} role={user.role} />
        </div>
      </div>
    </header>
  );
}