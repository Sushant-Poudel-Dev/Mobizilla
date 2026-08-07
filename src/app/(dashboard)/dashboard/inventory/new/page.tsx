import { getCategories, getBrands, getConditions } from "@/src/features/inventory/queries";
import { createInventoryItemAction } from "@/src/features/inventory/actions";
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
  Textarea,
  Button,
} from "@/src/components/ui";
import { type SelectOption } from "@/src/components/ui";

export default async function NewInventoryItemPage() {
  const [categories, brands, conditions] = await Promise.all([
    getCategories(),
    getBrands(),
    getConditions(),
  ]);

  const appUser = await getCurrentAppUser();
  const canEdit = appUser?.role === "owner" || appUser?.role === "admin";

  if (!canEdit) {
    redirect("/dashboard/inventory");
  }

  const categoryOptions: SelectOption[] = [
    { value: "", label: "Select category" },
    ...categories.map((cat) => ({ value: cat.id, label: cat.name })),
  ];

  const brandOptions: SelectOption[] = [
    { value: "", label: "Select brand (optional)" },
    ...brands.map((brand) => ({ value: brand.id, label: brand.name })),
  ];

  const conditionOptions: SelectOption[] = [
    { value: "", label: "Select condition (optional)" },
    ...conditions.map((cond) => ({ value: cond.id, label: cond.name })),
  ];

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-fg">New Inventory Item</h1>
        <p className="text-fg-secondary mt-1">Add a new part to your catalog</p>
      </div>

      <Card padding="md" className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Item Details</CardTitle>
          <CardDescription>Enter the inventory item information</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={createInventoryItemAction} className="space-y-4">
            <Input
              label="Part name *"
              name="partName"
              required
              placeholder="iPhone 13 Screen Assembly"
              autoComplete="off"
            />

            <Input
              label="Part code"
              name="partCode"
              placeholder="IP13-SCR-001"
              autoComplete="off"
            />

            <Input
              label="Barcode"
              name="barcode"
              placeholder="Scan or enter barcode"
              autoComplete="off"
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <Select
                label="Category *"
                name="categoryId"
                required
                options={categoryOptions}
              />

              <Select
                label="Brand"
                name="brandId"
                options={brandOptions}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="Selling price *"
                name="sellingPrice"
                type="number"
                step="0.01"
                min="0"
                required
                placeholder="0.00"
              />

              <Select
                label="Condition"
                name="conditionId"
                options={conditionOptions}
              />
            </div>

            <Textarea
              label="Description"
              name="description"
              rows={3}
              placeholder="Additional details..."
            />

            <Input
              label="Image URL"
              name="imageUrl"
              type="url"
              placeholder="https://example.com/image.jpg"
            />

            <div className="flex gap-3 pt-4 border-t border-border">
              <Button type="submit" variant="primary">Create Item</Button>
              <Button asChild variant="secondary">
                <a href="/dashboard/inventory">Cancel</a>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
