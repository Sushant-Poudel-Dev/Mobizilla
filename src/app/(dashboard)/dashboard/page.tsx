import { getCurrentAppUser } from "@/src/lib/data/currentUser";
import { getDashboardMetrics, getRecentActivity, getQuickStats, getStatIcon } from "@/src/features/dashboard/queries";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  StatCard,
  StatCardGrid,
  ActivityFeed,
  Badge,
  UserMenu,
} from "@/src/components/ui";
import { ActivityItem } from "@/src/components/ui/ActivityFeed";

const roleLabels: Record<string, string> = {
  owner: "Owner",
  admin: "Admin",
  front_desk: "Front Desk",
  technician: "Technician",
  staff: "Staff",
};

const roleBadges: Record<string, "default" | "success" | "warning" | "danger" | "accent" | "info"> = {
  owner: "accent",
  admin: "default",
  front_desk: "success",
  technician: "warning",
  staff: "info",
};

function getQuickActions(role: string): { label: string; href: string; variant: "primary" | "secondary" | "ghost" }[] {
  const baseActions = [
    { label: "New Repair Ticket", href: "/dashboard/repairs/new", variant: "primary" as const },
    { label: "New Invoice", href: "/dashboard/invoices/new", variant: "secondary" as const },
    { label: "New Customer", href: "/dashboard/customers/new", variant: "secondary" as const },
  ];

  const adminActions = [
    { label: "Manage Inventory", href: "/dashboard/inventory", variant: "secondary" as const },
    { label: "Purchase Orders", href: "/dashboard/purchases/new", variant: "secondary" as const },
    { label: "Staff Management", href: "/dashboard/staff", variant: "ghost" as const },
    { label: "Settings", href: "/dashboard/settings", variant: "ghost" as const },
  ];

  const technicianActions = [
    { label: "My Tickets", href: "/dashboard/repairs?technician=me", variant: "secondary" as const },
    { label: "Update Status", href: "/dashboard/repairs", variant: "ghost" as const },
  ];

  if (role === "owner" || role === "admin") {
    return [...baseActions, ...adminActions];
  }
  if (role === "front_desk") {
    return [...baseActions, { label: "View Invoices", href: "/dashboard/invoices", variant: "secondary" as const }];
  }
  if (role === "technician") {
    return technicianActions;
  }
  return [{ label: "View Tickets", href: "/dashboard/repairs", variant: "secondary" as const }];
}

function SummaryCard({
  label,
  value,
  icon,
  href,
  iconBg,
  iconColor,
}: {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  href: string;
  iconBg: string;
  iconColor: string;
}) {
  return (
    <a href={href} className="block">
      <Card padding="md" hover>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-fg-secondary">{label}</p>
            <p className="text-2xl font-bold text-fg mt-1">{value}</p>
          </div>
          <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${iconBg} ${iconColor}`}>
            {icon}
          </div>
        </div>
      </Card>
    </a>
  );
}

export default async function DashboardPage() {
  const appUser = await getCurrentAppUser();

  if (!appUser) {
    return null;
  }

  const [metrics, activities, quickStats] = await Promise.all([
    getDashboardMetrics(),
    getRecentActivity(10),
    getQuickStats(),
  ]);

  const role = roleLabels[appUser.role] ?? appUser.role;
  const roleBadgeVariant = roleBadges[appUser.role] ?? "default";
  const quickActions = getQuickActions(appUser.role);

  const statCards = quickStats.map((stat, index) => ({
    label: stat.label,
    value: stat.value,
    icon: getStatIcon(stat.icon),
    change: stat.change,
    changeType: stat.changeType,
    href: stat.href,
    delay: index + 1,
  }));

  const activityItems: ActivityItem[] = activities.map((activity) => ({
    id: activity.id,
    type: activity.type,
    description: activity.description,
    timestamp: activity.timestamp,
    href: activity.metadata?.ticketNumber ? `/dashboard/repairs/${activity.metadata.ticketNumber}` :
           activity.metadata?.invoiceNumber ? `/dashboard/invoices/${activity.metadata.invoiceNumber}` : undefined,
  }));

  return (
    <main className="min-h-screen bg-bg">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-bg/80 backdrop-blur-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-semibold text-fg">Dashboard</h1>
              <Badge variant={roleBadgeVariant} size="sm">{role}</Badge>
            </div>
            <div className="flex items-center gap-4">
              <UserMenu
                name={appUser.full_name}
                email={appUser.email}
                role={appUser.role}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8 animate-fade-in-up delay-1">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-fg">Welcome back, {appUser.full_name.split(" ")[0]}</h2>
              <p className="text-fg-secondary mt-1">Here's what's happening with your repair shop today.</p>
            </div>
            <div className="hidden sm:flex items-center gap-2 text-sm text-fg-secondary">
              <span className="px-3 py-1 bg-bg-elevated border border-border rounded-md font-mono">
                {appUser.organization_id.slice(0, 8)}...
              </span>
              {appUser.branch_id && (
                <span className="px-3 py-1 bg-bg-elevated border border-border rounded-md font-mono">
                  {appUser.branch_id.slice(0, 8)}...
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <StatCardGrid stats={statCards} columns={{ base: 1, sm: 2, lg: 3, xl: 6 }} className="mb-8" />

        {/* Two Column Layout */}
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Recent Activity - 2/3 width */}
          <div className="lg:col-span-2 animate-fade-in-up delay-5">
            <ActivityFeed activities={activityItems} maxItems={8} />
          </div>

          {/* Quick Actions - 1/3 width */}
          <div className="animate-fade-in-up delay-6">
            <Card padding="md">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common tasks for your role</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {quickActions.map((action) => (
                  <a
                    key={action.label}
                    href={action.href}
                    className={`
                      inline-flex items-center justify-center w-full px-4 py-2.5 text-base font-medium rounded-md
                      transition-all duration-120 ease-out
                      focus:outline-none focus:ring-2 focus:ring-offset-2
                      ${action.variant === "primary" ? "bg-accent text-white hover:bg-accent-hover focus:ring-accent" : ""}
                      ${action.variant === "secondary" ? "bg-bg-elevated text-fg border border-border hover:bg-bg-hover hover:border-border-bright focus:ring-border-bright" : ""}
                      ${action.variant === "ghost" ? "bg-transparent text-fg-secondary hover:bg-bg-hover hover:text-fg focus:ring-border-bright" : ""}
                    `}
                  >
                    {action.label}
                  </a>
                ))}
              </CardContent>
            </Card>

            {/* Summary Cards */}
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <SummaryCard
                label="Open Tickets"
                value={metrics.openTickets}
                icon={
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                }
                href="/dashboard/repairs"
                iconBg="bg-accent-light"
                iconColor="text-accent"
              />

              <SummaryCard
                label="Low Stock Items"
                value={metrics.lowStockItems}
                icon={
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                  </svg>
                }
                href="/dashboard/inventory/stock"
                iconBg="bg-warning-light"
                iconColor="text-warning"
              />

              <SummaryCard
                label="Pending Invoices"
                value={metrics.pendingInvoices}
                icon={
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m-16.5 0a2.25 2.25 0 012.25-2.25H19.5A2.25 2.25 0 0121.75 5.25V12m-18 0v4.5m0 0H6.75m13.5-4.5H18a2.25 2.25 0 00-2.25 2.25v3.375m-1.5 3.75h.008v.008H12v-.008h-.008V16.5h-.008v-.008H8.25v.008H8.242v.008H5.25" />
                  </svg>
                }
                href="/dashboard/invoices"
                iconBg="bg-blue-50"
                iconColor="text-blue-700"
              />

              <SummaryCard
                label="Total Customers"
                value={metrics.totalCustomers}
                icon={
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm-6 3a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0z" />
                  </svg>
                }
                href="/dashboard/customers"
                iconBg="bg-success-light"
                iconColor="text-success"
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}