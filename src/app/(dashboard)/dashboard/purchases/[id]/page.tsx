import { getPurchaseById } from "@/src/features/purchases/queries";
import { getCurrentAppUser } from "@/src/lib/data/currentUser";
import { notFound, redirect } from "next/navigation";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Table,
  StatusBadge,
  Button,
} from "@/src/components/ui";
import { formatCurrency, formatDate } from "@/src/lib/format";

export default async function PurchaseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const purchase = await getPurchaseById(id);

  if (!purchase) {
    notFound();
  }

  const appUser = await getCurrentAppUser();
  const canEdit = appUser?.role === "owner" || appUser?.role === "admin";

  const subtotal = purchase.items?.reduce((sum, i) => sum + Number(i.total_cost), 0) ?? 0;
  const additionalCost = Number(purchase.additional_cost ?? 0);
  const grandTotal = subtotal + additionalCost;

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-fg">{purchase.purchase_number}</h1>
          <p className="text-fg-secondary mt-1">{formatDate(purchase.purchase_date)}</p>
        </div>
        <div className="flex items-center gap-2">
          <StatusBadge status={purchase.payment_status?.name ?? "—"} />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column - 2/3 width */}
        <div className="lg:col-span-2 space-y-6">
          {/* Purchase Details */}
          <Card padding="md">
            <CardHeader>
              <CardTitle>Purchase Details</CardTitle>
              <CardDescription>Purchase order information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <dl className="grid gap-4 sm:grid-cols-2">
                <div>
                  <dt className="text-sm text-fg-secondary">Purchase #</dt>
                  <dd className="font-medium text-fg">{purchase.purchase_number}</dd>
                </div>
                <div>
                  <dt className="text-sm text-fg-secondary">Date</dt>
                  <dd className="font-medium text-fg">{formatDate(purchase.purchase_date)}</dd>
                </div>
                <div>
                  <dt className="text-sm text-fg-secondary">Supplier</dt>
                  <dd className="font-medium text-fg">{purchase.supplier?.supplier_name ?? "—"}</dd>
                </div>
                <div>
                  <dt className="text-sm text-fg-secondary">Branch</dt>
                  <dd className="font-medium text-fg">{purchase.branch?.branch_name ?? "—"}</dd>
                </div>
                <div>
                  <dt className="text-sm text-fg-secondary">Created By</dt>
                  <dd className="font-medium text-fg">{purchase.created_by_user_id ?? "—"}</dd>
                </div>
                <div>
                  <dt className="text-sm text-fg-secondary">Created</dt>
                  <dd className="font-medium text-fg">{formatDate(purchase.created_at)}</dd>
                </div>
                <div>
                  <dt className="text-sm text-fg-secondary">Updated</dt>
                  <dd className="font-medium text-fg">{formatDate(purchase.updated_at)}</dd>
                </div>
              </dl>
            </CardContent>
          </Card>

          {/* Line Items */}
          <Card padding="none">
            <CardHeader className="pb-4">
              <CardTitle>Line Items</CardTitle>
              <CardDescription>{purchase.items?.length ?? 0} item(s)</CardDescription>
            </CardHeader>
            {purchase.items && purchase.items.length > 0 ? (
              <Table
                columns={[
                  { key: "item", header: "Item", render: (item: typeof purchase.items[0]) => <span className="font-medium">{item.inventory_item?.part_name ?? "—"}</span> },
                  { key: "part_code", header: "Part Code", render: (item: typeof purchase.items[0]) => item.inventory_item?.part_code ?? "—" },
                  { key: "category", header: "Category", render: (item: typeof purchase.items[0]) => item.inventory_item?.category?.name ?? "—" },
                  { key: "brand", header: "Brand", render: (item: typeof purchase.items[0]) => item.inventory_item?.brand?.name ?? "—" },
                  { key: "condition", header: "Condition", render: (item: typeof purchase.items[0]) => item.condition?.name ?? "—" },
                  { key: "quantity", header: "Qty", className: "text-right font-mono", render: (item: typeof purchase.items[0]) => item.quantity },
                  { key: "unit_cost", header: "Unit Cost", className: "text-right font-mono", render: (item: typeof purchase.items[0]) => formatCurrency(item.unit_cost, "PHP") },
                  { key: "total_cost", header: "Total", className: "text-right font-mono font-medium", render: (item: typeof purchase.items[0]) => formatCurrency(item.total_cost, "PHP") },
                ]}
                data={purchase.items}
                keyExtractor={(item) => item.id}
              />
            ) : (
              <CardContent className="py-12 text-center">
                <p className="text-fg-tertiary">No line items on this purchase.</p>
              </CardContent>
            )}

            {/* Totals */}
            {purchase.items && purchase.items.length > 0 && (
              <CardContent className="pb-6">
                <dl className="space-y-2 border-t border-border pt-4">
                  <div className="flex justify-between">
                    <dt className="text-fg-secondary">Subtotal</dt>
                    <dd className="font-medium font-mono">{formatCurrency(subtotal, "PHP")}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-fg-secondary">Additional Cost</dt>
                    <dd className="font-medium font-mono">{formatCurrency(additionalCost, "PHP")}</dd>
                  </div>
                  <div className="flex justify-between text-lg border-t border-border pt-3">
                    <dt className="font-semibold">Total</dt>
                    <dd className="font-bold font-mono">{formatCurrency(grandTotal, "PHP")}</dd>
                  </div>
                </dl>
              </CardContent>
            )}
          </Card>
        </div>

        {/* Right Column - 1/3 width */}
        <div className="space-y-6">
          <Card padding="md">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button asChild variant="secondary" className="w-full justify-start">
                <a href="/dashboard/purchases">← Back to Purchases</a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}