import { createClient } from "@/src/lib/supabase/server";
import { getCurrentAppUser } from "@/src/lib/data/currentUser";
import { formatCurrency } from "@/src/lib/format";

export type DashboardMetrics = {
  openTickets: number;
  inProgressTickets: number;
  completedThisMonth: number;
  revenueThisMonth: number;
  pendingInvoices: number;
  lowStockItems: number;
  totalCustomers: number;
  totalStaff: number;
};

export type RecentActivity = {
  id: string;
  type: "repair_created" | "repair_updated" | "invoice_created" | "payment_received" | "purchase_received" | "stock_adjusted";
  description: string;
  timestamp: string;
  metadata?: Record<string, unknown>;
};

export type QuickStat = {
  label: string;
  value: string | number;
  change?: string;
  changeType?: "up" | "down" | "neutral";
  icon: string;
  href?: string;
};

export async function getDashboardMetrics(): Promise<DashboardMetrics> {
  const appUser = await getCurrentAppUser();

  if (!appUser) {
    return {
      openTickets: 0,
      inProgressTickets: 0,
      completedThisMonth: 0,
      revenueThisMonth: 0,
      pendingInvoices: 0,
      lowStockItems: 0,
      totalCustomers: 0,
      totalStaff: 0,
    };
  }

  const supabase = await createClient();
  const orgId = appUser.organization_id;
  const branchId = appUser.branch_id;
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);
  const startOfMonthISO = startOfMonth.toISOString();

  const [
    openTicketsResult,
    inProgressResult,
    completedResult,
    revenueResult,
    pendingInvoicesResult,
    lowStockResult,
    customersResult,
    staffResult,
  ] = await Promise.all([
    supabase
      .from("repair_tickets")
      .select("id", { count: "exact", head: true })
      .eq("organization_id", orgId)
      .is("deleted_at", null)
      .in("status_id", (await getOpenStatusIds())),
    supabase
      .from("repair_tickets")
      .select("id", { count: "exact", head: true })
      .eq("organization_id", orgId)
      .is("deleted_at", null)
      .in("status_id", (await getInProgressStatusIds())),
    supabase
      .from("repair_tickets")
      .select("id", { count: "exact", head: true })
      .eq("organization_id", orgId)
      .is("deleted_at", null)
      .in("status_id", (await getCompletedStatusIds()))
      .gte("closed_at", startOfMonthISO),
    supabase
      .from("invoices")
      .select("total_amount")
      .eq("organization_id", orgId)
      .is("deleted_at", null)
      .gte("invoice_date", startOfMonth.toISOString().split("T")[0]),
    supabase
      .from("invoices")
      .select("id", { count: "exact", head: true })
      .eq("organization_id", orgId)
      .is("deleted_at", null)
      .in("payment_status_id", (await getPendingPaymentStatusIds())),
    supabase
      .from("inventory_stock")
      .select("id", { count: "exact", head: true })
      .eq("organization_id", orgId)
      .is("deleted_at", null)
      .filter("current_quantity", "lt", "min_stock_level"),
    supabase
      .from("customers")
      .select("id", { count: "exact", head: true })
      .eq("organization_id", orgId)
      .is("deleted_at", null),
    supabase
      .from("app_users")
      .select("id", { count: "exact", head: true })
      .eq("organization_id", orgId)
      .is("deleted_at", null),
  ]);

  const revenue = revenueResult.data?.reduce((sum, inv) => sum + Number(inv.total_amount), 0) ?? 0;

  return {
    openTickets: openTicketsResult.count ?? 0,
    inProgressTickets: inProgressResult.count ?? 0,
    completedThisMonth: completedResult.count ?? 0,
    revenueThisMonth: revenue,
    pendingInvoices: pendingInvoicesResult.count ?? 0,
    lowStockItems: lowStockResult.count ?? 0,
    totalCustomers: customersResult.count ?? 0,
    totalStaff: staffResult.count ?? 0,
  };
}

async function getOpenStatusIds(): Promise<string[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("repair_statuses")
    .select("id")
    .ilike("name", "%open%")
    .or("name.ilike.%new%,name.ilike.%pending%,name.ilike.%received%")
    .is("deleted_at", null);
  return data?.map(d => d.id) ?? [];
}

async function getInProgressStatusIds(): Promise<string[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("repair_statuses")
    .select("id")
    .ilike("name", "%progress%")
    .or("name.ilike.%diagnos%,name.ilike.%repair%,name.ilike.%waiting%")
    .is("deleted_at", null);
  return data?.map(d => d.id) ?? [];
}

async function getCompletedStatusIds(): Promise<string[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("repair_statuses")
    .select("id")
    .ilike("name", "%complete%")
    .or("name.ilike.%done%,name.ilike.%finished%,name.ilike.%closed%")
    .is("deleted_at", null);
  return data?.map(d => d.id) ?? [];
}

async function getPendingPaymentStatusIds(): Promise<string[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("payment_statuses")
    .select("id")
    .ilike("name", "%pending%")
    .or("name.ilike.%unpaid%,name.ilike.%partial%")
    .is("deleted_at", null);
  return data?.map(d => d.id) ?? [];
}

export async function getRecentActivity(limit = 10): Promise<RecentActivity[]> {
  const appUser = await getCurrentAppUser();

  if (!appUser) return [];

  const supabase = await createClient();
  const orgId = appUser.organization_id;

  const [repairs, invoices, payments, purchases] = await Promise.all([
    supabase
      .from("repair_tickets")
      .select("id, ticket_number, status_id, created_at, updated_at, customer:customers(full_name)")
      .eq("organization_id", orgId)
      .is("deleted_at", null)
      .order("updated_at", { ascending: false })
      .limit(limit),
    supabase
      .from("invoices")
      .select("id, invoice_number, total_amount, created_at, customer:customers(full_name)")
      .eq("organization_id", orgId)
      .is("deleted_at", null)
      .order("created_at", { ascending: false })
      .limit(limit),
    supabase
      .from("payments")
      .select("id, amount_paid, payment_date, created_at, invoice:invoices(invoice_number)")
      .eq("organization_id", orgId)
      .is("deleted_at", null)
      .order("created_at", { ascending: false })
      .limit(limit),
    supabase
      .from("purchases")
      .select("id, purchase_number, created_at, supplier:suppliers(supplier_name)")
      .eq("organization_id", orgId)
      .is("deleted_at", null)
      .order("created_at", { ascending: false })
      .limit(limit),
  ]);

  const activities: RecentActivity[] = [];

  repairs.data?.forEach(r => {
    activities.push({
      id: `repair-${r.id}`,
      type: r.created_at === r.updated_at ? "repair_created" : "repair_updated",
      description: `Ticket ${r.ticket_number} ${r.created_at === r.updated_at ? "created" : "updated"} for ${r.customer?.full_name ?? "Unknown"}`,
      timestamp: r.updated_at,
      metadata: { ticketNumber: r.ticket_number, statusId: r.status_id },
    });
  });

  invoices.data?.forEach(i => {
    activities.push({
      id: `invoice-${i.id}`,
      type: "invoice_created",
      description: `Invoice ${i.invoice_number} created for ${i.customer?.full_name ?? "Unknown"} - ${formatCurrency(i.total_amount)}`,
      timestamp: i.created_at,
      metadata: { invoiceNumber: i.invoice_number, amount: i.total_amount },
    });
  });

  payments.data?.forEach(p => {
    activities.push({
      id: `payment-${p.id}`,
      type: "payment_received",
      description: `Payment ${formatCurrency(p.amount_paid)} received for ${p.invoice?.invoice_number ?? "Unknown"}`,
      timestamp: p.created_at,
      metadata: { amount: p.amount_paid, invoiceNumber: p.invoice?.invoice_number },
    });
  });

  purchases.data?.forEach(p => {
    activities.push({
      id: `purchase-${p.id}`,
      type: "purchase_received",
      description: `Purchase ${p.purchase_number} from ${p.supplier?.supplier_name ?? "Unknown"} created`,
      timestamp: p.created_at,
      metadata: { purchaseNumber: p.purchase_number, supplier: p.supplier?.supplier_name },
    });
  });

  return activities
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, limit);
}

export async function getQuickStats(): Promise<QuickStat[]> {
  const metrics = await getDashboardMetrics();
  const appUser = await getCurrentAppUser();

  if (!appUser) return [];

  const currency = await getOrganizationCurrency();

  return [
    {
      label: "Open Tickets",
      value: metrics.openTickets,
      icon: "ticket",
      href: "/dashboard/repairs",
      change: "+0%",
      changeType: "neutral",
    },
    {
      label: "In Progress",
      value: metrics.inProgressTickets,
      icon: "wrench",
      href: "/dashboard/repairs",
      change: "+0%",
      changeType: "neutral",
    },
    {
      label: "Completed This Month",
      value: metrics.completedThisMonth,
      icon: "check",
      href: "/dashboard/repairs",
      change: "+0%",
      changeType: "neutral",
    },
    {
      label: "Revenue This Month",
      value: formatCurrency(metrics.revenueThisMonth, currency),
      icon: "dollar",
      href: "/dashboard/invoices",
      change: "+0%",
      changeType: "neutral",
    },
    {
      label: "Pending Invoices",
      value: metrics.pendingInvoices,
      icon: "alert",
      href: "/dashboard/invoices",
      change: metrics.pendingInvoices > 0 ? "↑" : "—",
      changeType: metrics.pendingInvoices > 0 ? "up" : "neutral",
    },
    {
      label: "Low Stock Items",
      value: metrics.lowStockItems,
      icon: "box",
      href: "/dashboard/inventory/stock",
      change: metrics.lowStockItems > 0 ? "⚠" : "—",
      changeType: metrics.lowStockItems > 0 ? "up" : "neutral",
    },
  ];
}

async function getOrganizationCurrency(): Promise<string> {
  const appUser = await getCurrentAppUser();
  if (!appUser) return "USD";

  const supabase = await createClient();
  const { data } = await supabase
    .from("organizations")
    .select("currency")
    .eq("id", appUser.organization_id)
    .single();

  return data?.currency ?? "USD";
}

export function getStatIcon(icon: string): React.ReactNode {
  const icons: Record<string, React.ReactNode> = {
    ticket: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15.182a4.5 4.5 0 0 1-6.364 0M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75Zm10.585-1.965a9.005 9.005 0 0 1-1.851 1.26 9 9 0 0 0-7.465 1.647c-.357.068-.72-.142-.914-.52a.75.75 0 0 1 0-1.06c.512-.955 1.24-1.791 2.115-2.115a.75.75 0 1 1 1.06 0c.194.194.557.376.914.52a9 9 0 0 0 7.465-1.647 9.005 9.005 0 0 1 1.851-1.26.75.75 0 1 1 .97.25Z" />
      </svg>
    ),
    wrench: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.021-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
      </svg>
    ),
    check: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
      </svg>
    ),
    dollar: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12M12 6a2 2 0 1 1-4 0 2 2 0 0 1 4 0ZM12 18a2 2 0 1 1-4 0 2 2 0 0 1 4 0ZM4.93 6.493a10.73 10.73 0 0 1 2.837-1.811M19.07 17.507a10.73 10.73 0 0 1-2.837 1.81M9.283 4.046a13.968 13.968 0 0 1 5.434 0M9.283 19.954a13.968 13.968 0 0 1-5.434 0" />
      </svg>
    ),
    alert: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
      </svg>
    ),
    box: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m-16.5 0a2.25 2.25 0 0 1 2.25-2.25H19.5A2.25 2.25 0 0 1 21.75 5.25V12m-18 0v4.5m0 0H6.75m13.5-4.5H18a2.25 2.25 0 0 0-2.25 2.25v3.375m-1.5 3.75h.008v.008H12v-.008h-.008V16.5h-.008v-.008H8.25v.008H8.242v.008H5.25" />
      </svg>
    ),
  };
  return icons[icon] ?? icons.ticket;
}