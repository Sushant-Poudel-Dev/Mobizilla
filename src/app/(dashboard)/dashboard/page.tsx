import { getCurrentAppUser } from "@/src/lib/data/currentUser";
import { getDashboardMetrics, getRecentActivity, getQuickStats, getStatIcon } from "@/src/features/dashboard/queries";
import { generateSparklineData, formatCurrency, calculateTrend } from "@/src/lib/dashboard-utils";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  KPICard,
  AlertStrip,
  RoleWidget,
  RoleWidgetItem,
  RoleWidgetSummary,
  Badge,
} from "@/src/components/ui";
import { ActivityFeed, type ActivityItem } from "@/src/components/ui/ActivityFeed";
import { type ReactNode } from "react";

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

  // Generate sparkline data for trends
  const sparklines = {
    openTickets: generateSparklineData(metrics.openTickets),
    inProgress: generateSparklineData(metrics.inProgressTickets),
    completed: generateSparklineData(metrics.completedThisMonth),
    revenue: generateSparklineData(metrics.revenueThisMonth / 1000),
    pendingInvoices: generateSparklineData(metrics.pendingInvoices),
    lowStock: generateSparklineData(metrics.lowStockItems),
  };

  // Calculate trends (mock previous period for demo)
  const trends = {
    openTickets: calculateTrend(metrics.openTickets, Math.max(0, metrics.openTickets - 2)),
    inProgress: calculateTrend(metrics.inProgressTickets, Math.max(0, metrics.inProgressTickets - 1)),
    completed: calculateTrend(metrics.completedThisMonth, Math.max(0, metrics.completedThisMonth - 3)),
    revenue: calculateTrend(metrics.revenueThisMonth, metrics.revenueThisMonth * 0.85),
    pendingInvoices: calculateTrend(metrics.pendingInvoices, Math.max(0, metrics.pendingInvoices - 1)),
    lowStock: calculateTrend(metrics.lowStockItems, Math.max(0, metrics.lowStockItems - 1)),
  };

  // Generate alerts based on metrics
  const alerts = [
    metrics.lowStockItems > 5
      ? {
          id: "low-stock",
          type: "critical" as const,
          title: "Critical Low Stock",
          message: `${metrics.lowStockItems} items below minimum threshold`,
          action: { label: "View Stock", href: "/dashboard/inventory/stock" },
        }
      : null,
    metrics.pendingInvoices > 10
      ? {
          id: "pending-invoices",
          type: "warning" as const,
          title: "High Pending Invoices",
          message: `${metrics.pendingInvoices} invoices awaiting payment`,
          action: { label: "View Invoices", href: "/dashboard/invoices" },
        }
      : null,
    metrics.openTickets > 20
      ? {
          id: "high-tickets",
          type: "warning" as const,
          title: "High Ticket Volume",
          message: `${metrics.openTickets} open tickets need attention`,
          action: { label: "View Repairs", href: "/dashboard/repairs" },
        }
      : null,
  ].filter(Boolean) as Array<{ id: string; type: "critical" | "warning" | "info"; title: string; message: string; action: { label: string; href: string } }>;

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
    <>
      {/* Welcome Section */}
      <div className="animate-fade-in-up delay-1 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-fg">Dashboard</h1>
            <p className="text-fg-secondary mt-1">Here's what's happening with your repair shop today.</p>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-sm text-fg-secondary">
            <Badge variant="default" size="sm">{roleLabels[appUser.role] ?? appUser.role}</Badge>
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

      {/* Alert Strip */}
      <AlertStrip alerts={alerts as any} />

      {/* KPI Bar - 6 cards with trends and sparklines */}
      <div className="grid gap-4 mb-8" style={{ gridTemplateColumns: "repeat(6, minmax(0, 1fr))" }}>
        <KPICard
          label="Open Tickets"
          value={metrics.openTickets}
          icon={
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          }
          href="/dashboard/repairs"
          trend={trends.openTickets}
          sparklineData={sparklines.openTickets}
          iconBg="accent"
          iconColor="accent"
          delay={1}
          alert={metrics.openTickets > 20 ? { message: "High volume", severity: "warning" } : undefined}
        />
        <KPICard
          label="In Progress"
          value={metrics.inProgressTickets}
          icon={
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
          href="/dashboard/repairs"
          trend={trends.inProgress}
          sparklineData={sparklines.inProgress}
          iconBg="warning"
          iconColor="warning"
          delay={2}
        />
        <KPICard
          label="Completed This Month"
          value={metrics.completedThisMonth}
          icon={
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
            </svg>
          }
          href="/dashboard/repairs"
          trend={trends.completed}
          sparklineData={sparklines.completed}
          iconBg="success"
          iconColor="success"
          delay={3}
        />
        <KPICard
          label="Revenue This Month"
          value={formatCurrency(metrics.revenueThisMonth)}
          icon={
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12M12 6a2 2 0 11-4 0 2 2 0 014 0ZM12 18a2 2 0 11-4 0 2 2 0 014 0ZM4.93 6.493a10.73 10.73 0 012.837-1.811M19.07 17.507a10.73 10.73 0 01-2.837 1.81M9.283 4.046a13.968 13.968 0 015.434 0M9.283 19.954a13.968 13.968 0 01-5.434 0" />
            </svg>
          }
          href="/dashboard/invoices"
          trend={trends.revenue}
          sparklineData={sparklines.revenue}
          iconBg="accent"
          iconColor="accent"
          delay={4}
        />
        <KPICard
          label="Pending Invoices"
          value={metrics.pendingInvoices}
          icon={
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m-16.5 0a2.25 2.25 0 012.25-2.25H19.5A2.25 2.25 0 0121.75 5.25V12m-18 0v4.5m0 0H6.75m13.5-4.5H18a2.25 2.25 0 00-2.25 2.25v3.375m-1.5 3.75h.008v.008H12v-.008h-.008V16.5h-.008v-.008H8.25v.008H8.242v.008H5.25" />
            </svg>
          }
          href="/dashboard/invoices"
          trend={trends.pendingInvoices}
          sparklineData={sparklines.pendingInvoices}
          iconBg="accent"
          iconColor="accent"
          delay={5}
          alert={metrics.pendingInvoices > 10 ? { message: "High pending", severity: "warning" } : undefined}
        />
        <KPICard
          label="Low Stock Items"
          value={metrics.lowStockItems}
          icon={
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
          }
          href="/dashboard/inventory/stock"
          trend={trends.lowStock}
          sparklineData={sparklines.lowStock}
          iconBg="warning"
          iconColor="warning"
          delay={6}
          alert={metrics.lowStockItems > 5 ? { message: "Critical stock", severity: "critical" } : undefined}
        />
      </div>

      {/* Alert Strip */}
      <div className="mb-8">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className={`
              flex items-start gap-3 px-4 py-3 rounded-lg border mb-2
              ${alert.type === "critical" ? "bg-error/5 border-error/20 text-error" :
                alert.type === "warning" ? "bg-warning/5 border-warning/20 text-warning" :
                "bg-accent/5 border-accent/20 text-accent"}
              animate-slide-in-right
            `}
            role="alert"
          >
            <span className="flex-shrink-0 mt-0.5" aria-hidden="true">
              {alert.type === "critical" && (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                </svg>
              )}
              {alert.type === "warning" && (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                </svg>
              )}
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold">{alert.title}</p>
              <p className="text-sm opacity-90 mt-0.5">{alert.message}</p>
            </div>
            <a
              href={alert.action.href}
              className="flex-shrink-0 mt-1 inline-flex items-center gap-1 text-sm font-medium underline hover:no-underline"
            >
              {alert.action.label}
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </a>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left Column - Activity Feed (2/3 width) */}
        <div className="lg:col-span-2 animate-fade-in-up delay-5">
          <ActivityFeed activities={activityItems} maxItems={8} />
        </div>

        {/* Right Column - Quick Actions & Role Widgets (1/3 width) */}
        <div className="animate-fade-in-up delay-6 space-y-6">
          {/* Quick Actions */}
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

          {/* Role-aware Summary Cards */}
          <RoleWidgetSummary
            items={[
              { label: "Open Tickets", value: metrics.openTickets, trend: trends.openTickets },
              { label: "In Progress", value: metrics.inProgressTickets, trend: trends.inProgress },
              { label: "Completed", value: metrics.completedThisMonth, trend: trends.completed },
              { label: "Revenue", value: formatCurrency(metrics.revenueThisMonth), trend: trends.revenue },
              { label: "Pending Invoices", value: metrics.pendingInvoices, trend: trends.pendingInvoices },
              { label: "Low Stock", value: metrics.lowStockItems, trend: trends.lowStock },
            ]}
          />

          {/* Role-specific Widget */}
          {role === "owner" || role === "admin" ? (
            <RoleWidget
              title="Overview"
              icon={
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              }
              action={{ label: "View Reports", href: "/dashboard/reports", variant: "ghost" }}
            >
              <RoleWidgetItem
                label="Total Revenue"
                value={formatCurrency(metrics.revenueThisMonth)}
                trend={trends.revenue}
                sparklineData={sparklines.revenue}
              />
              <RoleWidgetItem
                label="Avg Ticket Value"
                value={metrics.completedThisMonth > 0 ? formatCurrency(metrics.revenueThisMonth / metrics.completedThisMonth) : formatCurrency(0)}
                trend={calculateTrend(metrics.revenueThisMonth / Math.max(1, metrics.completedThisMonth), 0)}
              />
              <RoleWidgetItem
                label="Conversion Rate"
                value={`${metrics.completedThisMonth > 0 ? Math.round((metrics.completedThisMonth / (metrics.openTickets + metrics.completedThisMonth)) * 100) : 0}%`}
                trend={calculateTrend(metrics.completedThisMonth / Math.max(1, metrics.openTickets + metrics.completedThisMonth), 0)}
              />
            </RoleWidget>
          ) : role === "technician" ? (
            <RoleWidget
              title="My Assignments"
              icon={
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 012 2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              }
              action={{ label: "My Tickets", href: "/dashboard/repairs?technician=me", variant: "secondary" }}
            >
              <RoleWidgetItem
                label="Assigned"
                value={metrics.inProgressTickets}
                trend={trends.inProgress}
              />
              <RoleWidgetItem
                label="Completed This Month"
                value={metrics.completedThisMonth}
                trend={trends.completed}
              />
              <RoleWidgetItem
                label="Avg Resolution"
                value="2.3 days"
                trend={{ value: 12, direction: "down" }}
              />
            </RoleWidget>
          ) : role === "front_desk" ? (
            <RoleWidget
              title="Front Desk"
              icon={
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0ZM15.75 19.5a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0ZM21 15.75a3.75 3.75 0 01-7.5 0H3a3.75 3.75 0 010-7.5h10.5a3.75 3.75 0 017.5 0Z" />
                </svg>
              }
              action={{ label: "All Customers", href: "/dashboard/customers", variant: "secondary" }}
            >
              <RoleWidgetItem
                label="Total Customers"
                value={metrics.totalCustomers}
              />
              <RoleWidgetItem
                label="New This Month"
                value={Math.max(0, metrics.totalCustomers - 50)}
                trend={{ value: 8, direction: "up" }}
              />
              <RoleWidgetItem
                label="Active Tickets"
                value={metrics.openTickets}
                trend={trends.openTickets}
              />
            </RoleWidget>
          ) : (
            <RoleWidget
              title="Quick Links"
              icon={
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h15A2.25 2.25 0 0021 18.75V8.25A2.25 2.25 0 0018.75 6H7.5m0 0l3-3m0 0l-3-3m3 3H3" />
                </svg>
              }
              action={{ label: "View All", href: "/dashboard", variant: "ghost" }}
            >
              <RoleWidgetItem
                label="Open Tickets"
                value={metrics.openTickets}
                trend={trends.openTickets}
              />
              <RoleWidgetItem
                label="Pending Invoices"
                value={metrics.pendingInvoices}
                trend={trends.pendingInvoices}
              />
              <RoleWidgetItem
                label="Low Stock"
                value={metrics.lowStockItems}
                trend={trends.lowStock}
              />
            </RoleWidget>
          )}
        </div>
      </div>
    </>
  );
}