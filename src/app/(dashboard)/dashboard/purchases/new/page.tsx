import {
  getSuppliersForPurchase,
  getBranchesForPurchase,
  getPaymentStatuses,
  getInventoryItemsForPurchase,
  getConditions,
} from "@/src/features/purchases/queries";
import { createPurchaseAction } from "@/src/features/purchases/actions";
import { getCurrentAppUser } from "@/src/lib/data/currentUser";
import { redirect } from "next/navigation";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Input,
  Select,
  Button,
} from "@/src/components/ui";
import { type SelectOption } from "@/src/components/ui";
import { LineItemsForm } from "@/src/components/purchases/LineItemsForm";

export default async function NewPurchasePage() {
  const [suppliers, branches, paymentStatuses, inventoryItems, conditions] = await Promise.all([
    getSuppliersForPurchase(),
    getBranchesForPurchase(),
    getPaymentStatuses(),
    getInventoryItemsForPurchase(),
    getConditions(),
  ]);

  const appUser = await getCurrentAppUser();
  const canEdit = appUser?.role === "owner" || appUser?.role === "admin";

  if (!canEdit) {
    redirect("/dashboard/purchases");
  }

  const supplierOptions: SelectOption[] = [
    { value: "", label: "Select supplier" },
    ...suppliers.map((s) => ({ value: s.id, label: s.supplier_name })),
  ];

  const branchOptions: SelectOption[] = [
    { value: "", label: "Select branch" },
    ...branches.map((b) => ({ value: b.id, label: b.branch_name })),
  ];

  const paymentStatusOptions: SelectOption[] = [
    { value: "", label: "Select status" },
    ...paymentStatuses.map((ps) => ({ value: ps.id, label: ps.name })),
  ];

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-fg">New Purchase</h1>
        <p className="text-fg-secondary mt-1">Create a purchase order with line items</p>
      </div>

      <Card padding="md" className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>Purchase Details</CardTitle>
          <CardDescription>Enter purchase order information and line items</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={createPurchaseAction} className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <Select
                label="Supplier *"
                name="supplierId"
                required
                options={supplierOptions}
              />

              <Select
                label="Branch *"
                name="branchId"
                required
                options={branchOptions}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="Purchase # *"
                name="purchaseNumber"
                required
                placeholder="PO-2024-001"
                autoComplete="off"
              />

              <Input
                label="Purchase date *"
                name="purchaseDate"
                type="date"
                required
                defaultValue={new Date().toISOString().split("T")[0]}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Select
                label="Payment status *"
                name="paymentStatusId"
                required
                options={paymentStatusOptions}
              />

              <Input
                label="Additional cost"
                name="additionalCost"
                type="number"
                step="0.01"
                min="0"
                defaultValue="0"
                placeholder="0.00"
              />
            </div>

            <hr className="border-border" />

            <LineItemsForm inventoryItems={inventoryItems} conditions={conditions} />

            <div className="flex gap-3 pt-4 border-t border-border">
              <Button type="submit" variant="primary">Create Purchase</Button>
              <Button asChild variant="secondary">
                <a href="/dashboard/purchases">Cancel</a>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
