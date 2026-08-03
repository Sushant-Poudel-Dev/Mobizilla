import { getSupplierById } from "@/src/features/suppliers/queries";
import { updateSupplierAction, deleteSupplierAction } from "@/src/features/suppliers/actions";
import { getCurrentAppUser } from "@/src/lib/data/currentUser";
import { notFound, redirect } from "next/navigation";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Input,
  Textarea,
  Button,
  Badge,
} from "@/src/components/ui";
import { formatDate } from "@/src/lib/format";

export default async function SupplierDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supplier = await getSupplierById(id);

  if (!supplier) {
    notFound();
  }

  const appUser = await getCurrentAppUser();
  const canEdit = appUser?.role === "owner" || appUser?.role === "admin";

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-fg">{supplier.supplier_name}</h1>
          <p className="text-fg-secondary mt-1">Supplier details</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column - 2/3 width */}
        <div className="lg:col-span-2 space-y-6">
          {/* Details */}
          <Card padding="md">
            <CardHeader>
              <CardTitle>Details</CardTitle>
              <CardDescription>Supplier information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <dl className="grid gap-4 sm:grid-cols-2">
                <div>
                  <dt className="text-sm text-fg-secondary">Name</dt>
                  <dd className="font-medium text-fg">{supplier.supplier_name}</dd>
                </div>
                <div>
                  <dt className="text-sm text-fg-secondary">Contact Person</dt>
                  <dd className="font-medium text-fg">{supplier.contact_person ?? <span className="text-fg-tertiary">—</span>}</dd>
                </div>
                <div>
                  <dt className="text-sm text-fg-secondary">Phone</dt>
                  <dd className="font-medium text-fg">{supplier.phone_number ?? <span className="text-fg-tertiary">—</span>}</dd>
                </div>
                <div>
                  <dt className="text-sm text-fg-secondary">Email</dt>
                  <dd className="font-medium text-fg">{supplier.email ?? <span className="text-fg-tertiary">—</span>}</dd>
                </div>
                <div>
                  <dt className="text-sm text-fg-secondary">Address</dt>
                  <dd className="font-medium text-fg">{supplier.address ?? <span className="text-fg-tertiary">—</span>}</dd>
                </div>
                <div>
                  <dt className="text-sm text-fg-secondary">Notes</dt>
                  <dd className="font-medium text-fg">{supplier.remarks ?? <span className="text-fg-tertiary">—</span>}</dd>
                </div>
                <div>
                  <dt className="text-sm text-fg-secondary">Created</dt>
                  <dd className="font-medium text-fg">{formatDate(supplier.created_at)}</dd>
                </div>
                <div>
                  <dt className="text-sm text-fg-secondary">Updated</dt>
                  <dd className="font-medium text-fg">{formatDate(supplier.updated_at)}</dd>
                </div>
              </dl>
            </CardContent>
          </Card>

          {/* Edit Form */}
          {canEdit && (
            <Card padding="md">
              <CardHeader>
                <CardTitle>Edit Supplier</CardTitle>
                <CardDescription>Update supplier information</CardDescription>
              </CardHeader>
              <CardContent>
                <form action={updateSupplierAction} className="space-y-4">
                  <input type="hidden" name="id" value={supplier.id} />

                  <Input
                    label="Supplier name *"
                    name="supplierName"
                    required
                    defaultValue={supplier.supplier_name}
                    placeholder="ABC Parts Co."
                    autoComplete="name"
                  />

                  <Input
                    label="Contact person"
                    name="contactPerson"
                    defaultValue={supplier.contact_person ?? ""}
                    placeholder="John Smith"
                    autoComplete="name"
                  />

                  <div className="grid gap-4 sm:grid-cols-2">
                    <Input
                      label="Phone"
                      name="phone"
                      type="tel"
                      defaultValue={supplier.phone_number ?? ""}
                      placeholder="+63 9XX XXX XXXX"
                      autoComplete="tel"
                    />

                    <Input
                      label="Email"
                      name="email"
                      type="email"
                      defaultValue={supplier.email ?? ""}
                      placeholder="contact@abcpco.com"
                      autoComplete="email"
                    />
                  </div>

                  <Textarea
                    label="Address"
                    name="address"
                    rows={3}
                    defaultValue={supplier.address ?? ""}
                    placeholder="123 Industrial Ave, City, Province"
                  />

                  <Textarea
                    label="Notes"
                    name="remarks"
                    rows={2}
                    defaultValue={supplier.remarks ?? ""}
                    placeholder="Payment terms, preferred contact time..."
                  />

                  <div className="flex gap-3 pt-4 border-t border-border">
                    <Button type="submit" variant="primary">Save Changes</Button>
                    <Button asChild variant="secondary">
                      <a href="/dashboard/suppliers">Cancel</a>
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Danger Zone */}
          {canEdit && (
            <Card padding="md">
              <CardHeader>
                <CardTitle>Danger Zone</CardTitle>
                <CardDescription>Irreversible actions</CardDescription>
              </CardHeader>
              <CardContent>
                <form action={deleteSupplierAction} onSubmit={(e) => {
                  if (!confirm("Delete this supplier? This action cannot be undone.")) {
                    e.preventDefault();
                  }
                }}>
                  <input type="hidden" name="id" value={supplier.id} />
                  <Button type="submit" variant="danger">Delete Supplier</Button>
                </form>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column - 1/3 width */}
        <div className="space-y-6">
          <Card padding="md">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button asChild variant="secondary" className="w-full justify-start">
                <a href="/dashboard/suppliers">← Back to Suppliers</a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}