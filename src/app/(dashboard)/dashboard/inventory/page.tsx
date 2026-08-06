import { getInventoryItems, getCategories, getBrands, getConditions } from "@/src/features/inventory/queries";
import { createInventoryItemAction } from "@/src/features/inventory/actions";
import { getCurrentAppUser } from "@/src/lib/data/currentUser";
import { redirect } from "next/navigation";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Table,
  Button,
  Input,
  Select,
  Textarea,
  Badge,
} from "@/src/components/ui";
import { formatCurrency } from "@/src/lib/format";
import { type SelectOption } from "@/src/components/ui";

export default async function InventoryPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; success?: string }>;
}) {
  const { error, success } = await searchParams;
  const [items, categories, brands, conditions] = await Promise.all([
    getInventoryItems(),
    getCategories(),
    getBrands(),
    getConditions(),
  ]);

  if (items === null) {
    redirect("/login");
  }

  const appUser = await getCurrentAppUser();
  const canEdit = appUser?.role === "owner" || appUser?.role === "admin";

  const columns = [
    {
      key: "part_name",
      header: "Part Name",
      render: (item: typeof items[0]) => <span className="font-medium">{item.part_name}</span>,
    },
    {
      key: "part_code",
      header: "Part Code",
      render: (item: typeof items[0]) => item.part_code ?? "—",
    },
    {
      key: "category",
      header: "Category",
      render: (item: typeof items[0]) => item.category?.name ?? "—",
    },
    {
      key: "brand",
      header: "Brand",
      render: (item: typeof items[0]) => item.brand?.name ?? "—",
    },
    {
      key: "selling_price",
      header: "Selling Price",
      className: "font-mono font-medium",
      render: (item: typeof items[0]) => formatCurrency(item.selling_price, "PHP"),
    },
    {
      key: "condition",
      header: "Condition",
      render: () => <Badge variant="default" size="sm">—</Badge>,
    },
  ];

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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-fg">Inventory Catalog</h1>
          <p className="text-fg-secondary mt-1">Manage parts and components</p>
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
          Inventory item saved successfully.
        </div>
      )}

      {/* Inventory Table + Add Form */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Items Table - 2/3 width */}
        <div className="lg:col-span-2">
          <Card padding="none">
            <CardHeader className="pb-4">
              <CardTitle>All Items</CardTitle>
              <CardDescription>Parts and components catalog</CardDescription>
            </CardHeader>
            <Table
              columns={columns}
              data={items}
              keyExtractor={(item) => item.id}
              emptyState={
                <div className="text-center py-12">
                  <svg className="w-12 h-12 mx-auto text-fg-tertiary/50 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                  </svg>
                  <p className="text-fg-secondary">No inventory items yet.</p>
                  {canEdit && (
                    <p className="text-fg-tertiary text-sm mt-1">Add your first item using the form.</p>
                  )}
                </div>
              }
            />
          </Card>
        </div>

        {/* Add Item Form - 1/3 width */}
        {canEdit && (
          <Card padding="md">
            <CardHeader>
              <CardTitle>Add Inventory Item</CardTitle>
              <CardDescription>Create a new part or component</CardDescription>
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

                <Button type="submit" variant="primary" className="w-full">
                  Add Item
                </Button>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  );
}
