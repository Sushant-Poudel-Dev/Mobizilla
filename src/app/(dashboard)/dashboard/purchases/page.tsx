import { getPurchases } from "@/src/features/purchases/queries";
import { getCurrentAppUser } from "@/src/lib/data/currentUser";
import { redirect } from "next/navigation";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  Table,
  Button,
  StatusBadge,
} from "@/src/components/ui";
import { formatDate, formatCurrency } from "@/src/lib/format";

export default async function PurchasesPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; success?: string }>;
}) {
  const { error, success } = await searchParams;
  const purchases = await getPurchases();

  if (purchases === null) {
    redirect("/login");
  }

  const appUser = await getCurrentAppUser();
  const canCreate = appUser?.role === "owner" || appUser?.role === "admin";

  const columns = [
    {
      key: "purchase_number",
      header: "Purchase #",
      render: (purchase: typeof purchases[0]) => (
        <a href={`/dashboard/purchases/${purchase.id}`} className="font-medium text-accent hover:underline">
          {purchase.purchase_number}
        </a>
      ),
    },
    {
      key: "purchase_date",
      header: "Date",
      render: (purchase: typeof purchases[0]) => formatDate(purchase.purchase_date),
    },
    {
      key: "supplier",
      header: "Supplier",
      render: (purchase: typeof purchases[0]) => purchase.supplier?.supplier_name ?? "—",
    },
    {
      key: "branch",
      header: "Branch",
      render: (purchase: typeof purchases[0]) => purchase.branch?.branch_name ?? "—",
    },
    {
      key: "payment_status",
      header: "Payment Status",
      render: (purchase: typeof purchases[0]) => (
        <StatusBadge status={purchase.payment_status?.name ?? "—"} />
      ),
    },
    {
      key: "additional_cost",
      header: "Additional Cost",
      className: "font-mono font-medium",
      render: (purchase: typeof purchases[0]) => formatCurrency(purchase.additional_cost ?? 0, "PHP"),
    },
    {
      key: "created_at",
      header: "Created",
      render: (purchase: typeof purchases[0]) => formatDate(purchase.created_at),
    },
  ];

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-fg">Purchases</h1>
          <p className="text-fg-secondary mt-1">Manage purchase orders</p>
        </div>
        {canCreate && (
          <Button asChild variant="primary">
            <a href="/dashboard/purchases/new">New Purchase</a>
          </Button>
        )}
      </div>

      {/* Messages */}
      {error && (
        <div className="mb-6 p-4 bg-error-light border border-error/20 rounded-md text-error text-sm" role="alert">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-6 p-4 bg-success-light border border-success/20 rounded-md text-success text-sm" role="status">
          Purchase created successfully.
        </div>
      )}

      {/* Purchases Table */}
      <Card padding="none">
        <CardHeader className="pb-4">
          <CardTitle>All Purchases</CardTitle>
          <CardDescription>Purchase orders and their status</CardDescription>
        </CardHeader>
        <Table
          columns={columns}
          data={purchases}
          keyExtractor={(purchase) => purchase.id}
          emptyState={
            <div className="text-center py-12">
              <svg className="w-12 h-12 mx-auto text-fg-tertiary/50 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
              </svg>
              <p className="text-fg-secondary">No purchases yet.</p>
              {canCreate && (
                <Button asChild variant="primary" className="mt-4 w-auto">
                  <a href="/dashboard/purchases/new">Create your first purchase</a>
                </Button>
              )}
            </div>
          }
        />
      </Card>
    </main>
  );
}