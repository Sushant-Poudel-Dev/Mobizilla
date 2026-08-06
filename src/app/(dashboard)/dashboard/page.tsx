import { getCurrentAppUser } from "@/src/lib/data/currentUser";
import { getDashboardMetrics } from "@/src/features/dashboard/queries";
import { StatsSection } from "@/src/components/dashboard/StatsSection";
import { RevenueCard } from "@/src/components/dashboard/RevenueCard";
import { QuickActions } from "@/src/components/dashboard/QuickActions";

const roleLabels: Record<string, string> = {
  owner: "Owner",
  admin: "Admin",
  front_desk: "Front Desk",
  technician: "Technician",
  staff: "Staff",
};

function getQuickActions(role: string): {
  label: string;
  href: string;
  variant: "primary" | "secondary" | "ghost";
  icon?: React.ReactNode;
}[] {
  const baseActions = [
    {
      label: "New Repair Ticket",
      href: "/dashboard/repairs/new",
      variant: "primary" as const,
    },
    {
      label: "New Invoice",
      href: "/dashboard/invoices/new",
      variant: "secondary" as const,
    },
    {
      label: "New Customer",
      href: "/dashboard/customers/new",
      variant: "secondary" as const,
    },
  ];

  const adminActions = [
    {
      label: "Manage Inventory",
      href: "/dashboard/inventory",
      variant: "secondary" as const,
    },
    {
      label: "Purchase Orders",
      href: "/dashboard/purchases/new",
      variant: "secondary" as const,
    },
    {
      label: "Staff Management",
      href: "/dashboard/staff",
      variant: "ghost" as const,
    },
  ];

  const technicianActions = [
    {
      label: "My Tickets",
      href: "/dashboard/repairs?technician=me",
      variant: "secondary" as const,
    },
    {
      label: "Update Status",
      href: "/dashboard/repairs",
      variant: "ghost" as const,
    },
  ];

  if (role === "owner" || role === "admin") return [...baseActions, ...adminActions];
  if (role === "front_desk")
    return [
      ...baseActions,
      {
        label: "View Invoices",
        href: "/dashboard/invoices",
        variant: "secondary" as const,
      },
    ];
  if (role === "technician") return technicianActions;
  return [
    {
      label: "View Tickets",
      href: "/dashboard/repairs",
      variant: "secondary" as const,
    },
  ];
}

export default async function DashboardPage() {
  const appUser = await getCurrentAppUser();

  if (!appUser) return null;

  const metrics = await getDashboardMetrics();

  const role = roleLabels[appUser.role] ?? appUser.role;
  const quickActions = getQuickActions(appUser.role);

  return (
    <div className="space-y-4">
      {/* Header Section with Title and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <select className="px-3 py-1.5 text-sm border border-slate-300 rounded-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent">
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month" selected>This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
          </select>
          <button className="px-3 py-1.5 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-sm hover:bg-slate-50 transition-colors">
            Filter
          </button>
          <button className="px-3 py-1.5 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-sm hover:bg-slate-50 transition-colors">
            Export
          </button>
        </div>
      </div>

      {/* Stats Section - 3 cards in a row */}
      <StatsSection metrics={metrics} />

      {/* Main Content Grid - Revenue (2/3) + Quick Actions (1/3) */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column - Revenue Card */}
        <div className="lg:col-span-2">
          <RevenueCard metrics={metrics} />
        </div>

        {/* Right Column - Quick Actions as icon cards */}
        <div>
          <QuickActions actions={quickActions} />
        </div>
      </div>
    </div>
  );
}