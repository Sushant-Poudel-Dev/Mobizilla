import { getCurrentAppUser } from "@/src/lib/data/currentUser";
import {
  getDashboardMetrics,
  getRecentActivity,
} from "@/src/features/dashboard/queries";
import { StatsSection } from "@/src/components/dashboard/StatsSection";
import { ActivitySection } from "@/src/components/dashboard/ActivitySection";
import { QuickActions } from "@/src/components/dashboard/QuickActions";

const roleLabels: Record<string, string> = {
  owner: "Owner",
  admin: "Admin",
  front_desk: "Front Desk",
  technician: "Technician",
  staff: "Staff",
};

function getQuickActions(
  role: string,
): {
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

  const [metrics, activities] = await Promise.all([
    getDashboardMetrics(),
    getRecentActivity(10),
  ]);

  const role = roleLabels[appUser.role] ?? appUser.role;
  const quickActions = getQuickActions(appUser.role);

  const activityItems = activities.map((activity) => ({
    id: activity.id,
    type: activity.type,
    description: activity.description,
    timestamp: activity.timestamp,
    href: activity.metadata?.ticketNumber
      ? `/dashboard/repairs/${activity.metadata.ticketNumber}`
      : activity.metadata?.invoiceNumber
        ? `/dashboard/invoices/${activity.metadata.invoiceNumber}`
        : undefined,
  }));

  return (
    <div className="space-y-8">
      {/* Stats Section - 3 cards in a row */}
      <StatsSection metrics={metrics} />

      {/* Main Content Grid - Activity (2/3) + Quick Actions (1/3) */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column - Activity Feed */}
        <div className="lg:col-span-2">
          <ActivitySection activities={activityItems} />
        </div>

        {/* Right Column - Quick Actions as icon cards */}
        <div>
          <QuickActions actions={quickActions} />
        </div>
      </div>
    </div>
  );
}