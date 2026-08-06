import { getInventoryItemById, getCategories, getBrands, getConditions, getDeviceModels, getCompatibilityByItem } from "@/src/features/inventory/queries";
import { updateInventoryItemAction, linkCompatibilityAction, unlinkCompatibilityAction } from "@/src/features/inventory/actions";
import { getCurrentAppUser } from "@/src/lib/data/currentUser";
import { notFound, redirect } from "next/navigation";
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
  Badge,
} from "@/src/components/ui";
import { formatCurrency, formatDate } from "@/src/lib/format";
import { type SelectOption } from "@/src/components/ui";

export default async function InventoryItemDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [item, categories, brands, conditions, deviceModels, compatibility] = await Promise.all([
    getInventoryItemById(id),
    getCategories(),
    getBrands(),
    getConditions(),
    getDeviceModels(),
    getCompatibilityByItem(id),
  ]);

  if (!item) {
    notFound();
  }

  const appUser = await getCurrentAppUser();
  const canEdit = appUser?.role === "owner" || appUser?.role === "admin";

  const linkedModelIds = new Set(compatibility.map((c) => c.device_model_id));
  const availableModels = deviceModels.filter((m) => !linkedModelIds.has(m.id));

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

  const deviceModelOptions: SelectOption[] = [
    { value: "", label: "Select device model" },
    ...availableModels.map((model) => ({ value: model.id, label: `${model.name} ${model.brand ? `(${model.brand.name})` : ""}` })),
  ];

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-fg">{item.part_name}</h1>
          <p className="text-fg-secondary mt-1">{item.part_code ?? "No part code"}</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column - 2/3 width */}
        <div className="lg:col-span-2 space-y-6">
          {/* Details */}
          <Card padding="md">
            <CardHeader>
              <CardTitle>Details</CardTitle>
              <CardDescription>Item specifications and information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <dl className="grid gap-4 sm:grid-cols-2">
                <div>
                  <dt className="text-sm text-fg-secondary">Part Name</dt>
                  <dd className="font-medium text-fg">{item.part_name}</dd>
                </div>
                <div>
                  <dt className="text-sm text-fg-secondary">Part Code</dt>
                  <dd className="font-medium text-fg">{item.part_code ?? <span className="text-fg-tertiary">—</span>}</dd>
                </div>
                <div>
                  <dt className="text-sm text-fg-secondary">Barcode</dt>
                  <dd className="font-medium text-fg">{item.barcode ?? <span className="text-fg-tertiary">—</span>}</dd>
                </div>
                <div>
                  <dt className="text-sm text-fg-secondary">Category</dt>
                  <dd className="font-medium text-fg">{item.category?.name ?? <span className="text-fg-tertiary">—</span>}</dd>
                </div>
                <div>
                  <dt className="text-sm text-fg-secondary">Brand</dt>
                  <dd className="font-medium text-fg">{item.brand?.name ?? <span className="text-fg-tertiary">—</span>}</dd>
                </div>
                <div>
                  <dt className="text-sm text-fg-secondary">Selling Price</dt>
                  <dd className="font-medium font-mono text-fg">{formatCurrency(item.selling_price, "PHP")}</dd>
                </div>
                <div>
                  <dt className="text-sm text-fg-secondary">Description</dt>
                  <dd className="font-medium text-fg">{item.description ?? <span className="text-fg-tertiary">—</span>}</dd>
                </div>
                <div>
                  <dt className="text-sm text-fg-secondary">Image URL</dt>
                  <dd className="font-medium text-fg">{item.image_url ?? <span className="text-fg-tertiary">—</span>}</dd>
                </div>
                <div>
                  <dt className="text-sm text-fg-secondary">Created</dt>
                  <dd className="font-medium text-fg">{formatDate(item.created_at)}</dd>
                </div>
                <div>
                  <dt className="text-sm text-fg-secondary">Updated</dt>
                  <dd className="font-medium text-fg">{formatDate(item.updated_at)}</dd>
                </div>
              </dl>
            </CardContent>
          </Card>

          {/* Edit Form */}
          {canEdit && (
            <Card padding="md">
              <CardHeader>
                <CardTitle>Edit Item</CardTitle>
                <CardDescription>Update item specifications</CardDescription>
              </CardHeader>
              <CardContent>
                <form action={updateInventoryItemAction} className="space-y-4">
                  <input type="hidden" name="id" value={item.id} />

                  <Input
                    label="Part name *"
                    name="partName"
                    required
                    defaultValue={item.part_name}
                    placeholder="iPhone 13 Screen Assembly"
                    autoComplete="off"
                  />

                  <Input
                    label="Part code"
                    name="partCode"
                    defaultValue={item.part_code ?? ""}
                    placeholder="IP13-SCR-001"
                    autoComplete="off"
                  />

                  <Input
                    label="Barcode"
                    name="barcode"
                    defaultValue={item.barcode ?? ""}
                    placeholder="Scan or enter barcode"
                    autoComplete="off"
                  />

                  <div className="grid gap-4 sm:grid-cols-2">
                    <Select
                      label="Category *"
                      name="categoryId"
                      required
                      defaultValue={item.category_id}
                      options={categoryOptions}
                    />

                    <Select
                      label="Brand"
                      name="brandId"
                      defaultValue={item.brand_id ?? ""}
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
                      defaultValue={item.selling_price}
                      placeholder="0.00"
                    />

                    <Select
                      label="Condition"
                      name="conditionId"
                      defaultValue=""
                      options={conditionOptions}
                    />
                  </div>

                  <Textarea
                    label="Description"
                    name="description"
                    rows={3}
                    defaultValue={item.description ?? ""}
                    placeholder="Additional details..."
                  />

                  <Input
                    label="Image URL"
                    name="imageUrl"
                    type="url"
                    defaultValue={item.image_url ?? ""}
                    placeholder="https://example.com/image.jpg"
                  />

                  <div className="flex gap-3 pt-4 border-t border-border">
                    <Button type="submit" variant="primary">Save Changes</Button>
                    <Button asChild variant="secondary">
                      <a href="/dashboard/inventory">Cancel</a>
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Compatibility */}
          <Card padding="md">
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <CardTitle>Compatible Device Models</CardTitle>
                  <CardDescription>{compatibility.length} model(s) linked</CardDescription>
                </div>
                {canEdit && availableModels.length > 0 && (
                  <Button asChild variant="ghost" size="sm">
                    <a href={`#add-compatibility`}>+ Add Model</a>
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {compatibility.length > 0 ? (
                <div className="space-y-2">
                  {compatibility.map((comp) => (
                    <div key={comp.id} className="flex items-center justify-between p-3 bg-bg-hover rounded-md">
                      <div>
                        <p className="font-medium text-fg">{comp.device_model?.name ?? "Unknown Model"}</p>
                        <p className="text-sm text-fg-secondary">{comp.device_model?.brand?.name ?? ""}</p>
                      </div>
                      {canEdit && (
                        <form action={unlinkCompatibilityAction} className="inline">
                          <input type="hidden" name="inventoryItemId" value={item.id} />
                          <input type="hidden" name="deviceModelId" value={comp.device_model_id} />
                          <Button type="submit" variant="ghost" size="sm" className="text-error" onClick={(e) => {
                            if (!confirm("Remove this compatibility?")) e.preventDefault();
                          }}>
                            Remove
                          </Button>
                        </form>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-fg-tertiary text-center py-4">No compatible device models linked yet.</p>
              )}

              {/* Add Compatibility Form */}
              {canEdit && availableModels.length > 0 && (
                <div id="add-compatibility" className="pt-4 border-t border-border">
                  <h3 className="text-lg font-semibold text-fg mb-4">Add Compatible Model</h3>
                  <form action={linkCompatibilityAction} className="space-y-4">
                    <input type="hidden" name="inventoryItemId" value={item.id} />
                    <Select
                      label="Device Model"
                      name="deviceModelId"
                      required
                      options={deviceModelOptions}
                    />
                    <Button type="submit" variant="primary">Link Model</Button>
                  </form>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column - 1/3 width */}
        <div className="space-y-6">
          {/* Quick Actions / Permissions */}
          {canEdit ? (
            <Card padding="md">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button asChild variant="secondary" className="w-full justify-start">
                  <a href="/dashboard/inventory">← Back to Catalog</a>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card padding="md">
              <CardHeader>
                <CardTitle>Permissions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <dl className="space-y-2">
                  <div className="flex justify-between">
                    <dt className="text-fg-secondary">Your Role</dt>
                    <dd className="font-medium text-fg">
                      <Badge variant="default" size="sm">{appUser?.role}</Badge>
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-fg-secondary">Edit Access</dt>
                    <dd className="text-fg-tertiary text-sm">Only owners and admins can edit inventory items</dd>
                  </div>
                </dl>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </main>
  );
}
