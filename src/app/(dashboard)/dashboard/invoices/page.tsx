import { getInvoices } from "@/src/features/invoices/queries";
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
  Badge,
} from "@/src/components/ui";
import { formatDate, formatCurrency } from "@/src/lib/format";

export default async function InvoicesPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; success?: string }>;
}) {
  const { error, success } = await searchParams;
  const invoices = await getInvoices();

  if (invoices === null) {
    redirect("/login");
  }

  const appUser = await getCurrentAppUser();
  const canCreate = appUser?.role === "owner" || appUser?.role === "admin" || appUser?.role === "front_desk";

  const columns = [
    {
      key: "invoice_number",
      header: "Invoice #",
      render: (invoice: typeof invoices[0]) => (
        <a href={`/dashboard/invoices/${invoice.id}`} className="font-medium text-accent hover:underline">
          {invoice.invoice_number}
        </a>
      ),
    },
    {
      key: "invoice_date",
      header: "Date",
      render: (invoice: typeof invoices[0]) => formatDate(invoice.invoice_date),
    },
    {
      key: "customer",
      header: "Customer",
      render: (invoice: typeof invoices[0]) => invoice.customer?.full_name ?? "—",
    },
    {
      key: "repair_ticket",
      header: "Ticket",
      render: (invoice: typeof invoices[0]) => invoice.repair_ticket?.ticket_number ?? "—",
    },
    {
      key: "branch",
      header: "Branch",
      render: (invoice: typeof invoices[0]) => invoice.branch?.branch_name ?? "—",
    },
    {
      key: "total_amount",
      header: "Total",
      className: "text-right font-mono font-medium",
      render: (invoice: typeof invoices[0]) => formatCurrency(invoice.total_amount, "PHP"),
    },
    {
      key: "payment_status",
      header: "Payment Status",
      render: (invoice: typeof invoices[0]) => (
        <StatusBadge status={invoice.payment_status?.name ?? "—"} />
      ),
    },
    {
      key: "created_at",
      header: "Created",
      render: (invoice: typeof invoices[0]) => formatDate(invoice.created_at),
    },
  ];

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-fg">Invoices</h1>
          <p className="text-fg-secondary mt-1">Manage customer invoices</p>
        </div>
      </div>

      {/* Messages */}
      {error && (
        <div className="mb-6 p-4 bg-error-light border border-error/20 rounded-md text-error text-sm" role="alert">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-6 p-4 bg-success-light border border-success/20 rounded-md text-success text-sm" role="status">
          Invoice created successfully.
        </div>
      )}

      {/* Invoices Table */}
      <Card padding="none">
        <CardHeader className="pb-4">
          <CardTitle>All Invoices</CardTitle>
          <CardDescription>Invoices generated from completed repair tickets</CardDescription>
        </CardHeader>
        <Table
          columns={columns}
          data={invoices}
          keyExtractor={(invoice) => invoice.id}
          emptyState={
            <div className="text-center py-12">
              <svg className="w-12 h-12 mx-auto text-fg-tertiary/50 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m-16.5 0a2.25 2.25 0 012.25-2.25H19.5A2.25 2.25 0 0121.75 5.25V12m-18 0v4.5m0 0H6.75m13.5-4.5H18a2.25 2.25 0 00-2.25 2.25v3.375m-1.5 3.75h.008v.008H12v-.008h-.008V16.5h-.008v-.008H8.25v.008H8.242v.008H5.25" />
              </svg>
              <p className="text-fg-secondary">No invoices yet.</p>
              <p className="text-fg-tertiary text-sm mt-1">Create an invoice from a completed repair ticket.</p>
            </div>
          }
        />
      </Card>
    </main>
  );
}