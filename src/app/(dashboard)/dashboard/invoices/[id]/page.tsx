import { getInvoiceById } from "@/src/features/invoices/queries";
import { getPaymentMethods } from "@/src/features/payments/queries";
import { recordPaymentAction } from "@/src/features/payments/actions";
import { getCurrentAppUser } from "@/src/lib/data/currentUser";
import { notFound } from "next/navigation";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Table,
  Button,
  StatusBadge,
  Input,
  Select,
  Badge,
} from "@/src/components/ui";
import { formatCurrency, formatDate } from "@/src/lib/format";
import { type SelectOption } from "@/src/components/ui";

export default async function InvoiceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const invoice = await getInvoiceById(id);

  if (!invoice) {
    notFound();
  }

  const [appUser, paymentMethods] = await Promise.all([
    getCurrentAppUser(),
    getPaymentMethods(),
  ]);
  const canCreatePayment = appUser?.role === "owner" || appUser?.role === "admin" || appUser?.role === "front_desk";

  const partsTotal = invoice.line_items
    ?.filter((li) => li.repair_part_id)
    .reduce((sum, li) => sum + Number(li.total_price), 0) ?? 0;

  const servicesTotal = invoice.line_items
    ?.filter((li) => li.repair_service_id)
    .reduce((sum, li) => sum + Number(li.total_price), 0) ?? 0;

  const paymentsTotal = invoice.payments?.reduce((sum, p) => sum + Number(p.amount_paid), 0) ?? 0;
  const balanceDue = Number(invoice.total_amount) - paymentsTotal;

  const paymentMethodOptions: SelectOption[] = [
    { value: "", label: "Select method" },
    ...paymentMethods.map((m) => ({ value: m.id, label: m.name })),
  ];

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-fg">{invoice.invoice_number}</h1>
          <p className="text-fg-secondary mt-1">{invoice.customer?.full_name ?? "Unknown customer"}</p>
        </div>
        <div className="flex items-center gap-2">
          <StatusBadge status={invoice.payment_status?.name ?? "—"} />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column - 2/3 width */}
        <div className="lg:col-span-2 space-y-6">
          {/* Invoice Details */}
          <Card padding="md">
            <CardHeader>
              <CardTitle>Invoice Details</CardTitle>
              <CardDescription>Invoice information and customer details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <dl className="grid gap-4 sm:grid-cols-2">
                <div>
                  <dt className="text-sm text-fg-secondary">Invoice #</dt>
                  <dd className="font-medium text-fg">{invoice.invoice_number}</dd>
                </div>
                <div>
                  <dt className="text-sm text-fg-secondary">Date</dt>
                  <dd className="font-medium text-fg">{formatDate(invoice.invoice_date)}</dd>
                </div>
                <div>
                  <dt className="text-sm text-fg-secondary">Customer</dt>
                  <dd className="font-medium text-fg">{invoice.customer?.full_name ?? "—"}</dd>
                </div>
                <div>
                  <dt className="text-sm text-fg-secondary">Phone</dt>
                  <dd className="font-medium text-fg">{invoice.customer?.phone_number ?? "—"}</dd>
                </div>
                <div>
                  <dt className="text-sm text-fg-secondary">Ticket</dt>
                  <dd className="font-medium text-fg">
                    {invoice.repair_ticket?.ticket_number ? (
                      <a href={`/dashboard/repairs/${invoice.repair_ticket.id}`} className="text-accent hover:underline">
                        {invoice.repair_ticket.ticket_number}
                      </a>
                    ) : (
                      "—"
                    )}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm text-fg-secondary">Branch</dt>
                  <dd className="font-medium text-fg">{invoice.branch?.branch_name ?? "—"}</dd>
                </div>
                <div>
                  <dt className="text-sm text-fg-secondary">Created</dt>
                  <dd className="font-medium text-fg">{formatDate(invoice.created_at)}</dd>
                </div>
              </dl>
            </CardContent>
          </Card>

          {/* Line Items */}
          <Card padding="none">
            <CardHeader className="pb-4">
              <CardTitle>Line Items</CardTitle>
              <CardDescription>{invoice.line_items?.length ?? 0} item(s)</CardDescription>
            </CardHeader>
            {invoice.line_items && invoice.line_items.length > 0 ? (
              <Table
                columns={[
                  { key: "description", header: "Description", render: (item: typeof invoice.line_items[0]) => item.description },
                  { key: "type", header: "Type", render: (item: typeof invoice.line_items[0]) => (
                    <Badge variant="default" size="sm">
                      {item.repair_part_id ? "Part" : item.repair_service_id ? "Service" : "—"}
                    </Badge>
                  )},
                  { key: "quantity", header: "Qty", className: "text-right font-mono", render: (item: typeof invoice.line_items[0]) => item.quantity },
                  { key: "unit_price", header: "Unit Price", className: "text-right font-mono", render: (item: typeof invoice.line_items[0]) => formatCurrency(item.unit_price, "PHP") },
                  { key: "total_price", header: "Total", className: "text-right font-mono font-medium", render: (item: typeof invoice.line_items[0]) => formatCurrency(item.total_price, "PHP") },
                ]}
                data={invoice.line_items}
                keyExtractor={(item) => item.id}
              />
            ) : (
              <CardContent className="py-12 text-center">
                <p className="text-fg-tertiary">No line items found.</p>
              </CardContent>
            )}
          </Card>

          {/* Payment History */}
          <Card padding="none">
            <CardHeader className="pb-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <CardTitle>Payment History</CardTitle>
                  <CardDescription>{invoice.payments?.length ?? 0} payment(s) recorded</CardDescription>
                </div>
                {canCreatePayment && balanceDue > 0 && (
                  <Button asChild variant="ghost" size="sm">
                    <a href={`#record-payment`}>+ Record Payment</a>
                  </Button>
                )}
              </div>
            </CardHeader>
            {invoice.payments && invoice.payments.length > 0 ? (
              <Table
                columns={[
                  { key: "payment_date", header: "Date", render: (payment: typeof invoice.payments[0]) => formatDate(payment.payment_date) },
                  { key: "payment_method", header: "Method", render: (payment: typeof invoice.payments[0]) => payment.payment_method?.name ?? "—" },
                  { key: "amount_paid", header: "Amount", className: "text-right font-mono font-medium", render: (payment: typeof invoice.payments[0]) => formatCurrency(payment.amount_paid, "PHP") },
                  { key: "received_by", header: "Received By", render: (payment: typeof invoice.payments[0]) => payment.received_by?.full_name ?? "—" },
                  { key: "remarks", header: "Remarks", render: (payment: typeof invoice.payments[0]) => payment.remarks ?? "—" },
                ]}
                data={invoice.payments}
                keyExtractor={(payment) => payment.id}
              />
            ) : (
              <CardContent className="py-12 text-center">
                <p className="text-fg-tertiary">No payments recorded yet.</p>
              </CardContent>
            )}

            {/* Record Payment Form */}
            {canCreatePayment && balanceDue > 0 && (
              <div id="record-payment">
                <CardContent className="pb-6">
                  <h3 className="text-lg font-semibold text-fg mb-4">Record Payment</h3>
                <form action={recordPaymentAction} className="space-y-4">
                  <input type="hidden" name="invoiceId" value={invoice.id} />
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Input
                      label="Amount *"
                      name="amountPaid"
                      type="number"
                      step="0.01"
                      min="0.01"
                      max={balanceDue}
                      required
                      placeholder={balanceDue.toFixed(2)}
                    />
                    <Select
                      label="Method *"
                      name="paymentMethodId"
                      required
                      options={paymentMethodOptions}
                    />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Input
                      label="Date *"
                      name="paymentDate"
                      type="date"
                      required
                      defaultValue={new Date().toISOString().split("T")[0]}
                    />
                    <Input
                      label="Remarks"
                      name="remarks"
                      placeholder="Optional notes"
                    />
                  </div>
                  <Button type="submit" variant="primary">Record Payment</Button>
                </form>
              </CardContent>
            </div>
          )}
          </Card>
        </div>

        {/* Right Column - 1/3 width */}
        <div className="space-y-6">
          {/* Totals */}
          <Card padding="md">
            <CardHeader>
              <CardTitle>Totals</CardTitle>
              <CardDescription>Financial summary</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <dl className="space-y-2">
                <div className="flex justify-between">
                  <dt className="text-fg-secondary">Subtotal</dt>
                  <dd className="font-medium font-mono">{formatCurrency(invoice.total_amount, "PHP")}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-fg-secondary">Tax</dt>
                  <dd className="font-medium font-mono">{formatCurrency(invoice.tax_amount, "PHP")}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-fg-secondary">Discount</dt>
                  <dd className="font-medium font-mono">{formatCurrency(invoice.discount_amount, "PHP")}</dd>
                </div>
              </dl>
              <div className="pt-3 border-t border-border">
                <div className="flex justify-between text-lg">
                  <dt className="font-semibold">Total</dt>
                  <dd className="font-bold font-mono">{formatCurrency(invoice.total_amount, "PHP")}</dd>
                </div>
              </div>
              <div className="pt-2">
                <div className={`flex justify-between text-lg ${balanceDue > 0 ? "text-error" : "text-success"}`}>
                  <dt className="font-semibold">Balance Due</dt>
                  <dd className="font-bold font-mono">{formatCurrency(Math.max(0, balanceDue), "PHP")}</dd>
                </div>
                <p className="text-xs text-fg-tertiary mt-1">
                  {paymentsTotal > 0 ? `Paid: ${formatCurrency(paymentsTotal, "PHP")}` : "No payments yet"}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
