import { getCustomerById } from "@/src/features/customers/queries";
import { updateCustomerAction, deleteCustomerAction } from "@/src/features/customers/actions";
import { getCurrentAppUser } from "@/src/lib/data/currentUser";
import { notFound } from "next/navigation";
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

export default async function CustomerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const customer = await getCustomerById(id);

  if (!customer) {
    notFound();
  }

  const appUser = await getCurrentAppUser();
  const canEdit = appUser?.role === "owner" || appUser?.role === "admin";

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-fg">{customer.customer_name}</h1>
          <p className="text-fg-secondary mt-1">Customer details</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column - 2/3 width */}
        <div className="lg:col-span-2 space-y-6">
          {/* Details */}
          <Card padding="md">
            <CardHeader>
              <CardTitle>Details</CardTitle>
              <CardDescription>Customer information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <dl className="grid gap-4 sm:grid-cols-2">
                <div>
                  <dt className="text-sm text-fg-secondary">Name</dt>
                  <dd className="font-medium text-fg">{customer.customer_name}</dd>
                </div>
                <div>
                  <dt className="text-sm text-fg-secondary">Phone</dt>
                  <dd className="font-medium text-fg">{customer.phone ?? <span className="text-fg-tertiary">—</span>}</dd>
                </div>
                <div>
                  <dt className="text-sm text-fg-secondary">Email</dt>
                  <dd className="font-medium text-fg">{customer.email ?? <span className="text-fg-tertiary">—</span>}</dd>
                </div>
                <div>
                  <dt className="text-sm text-fg-secondary">Address</dt>
                  <dd className="font-medium text-fg">{customer.address ?? <span className="text-fg-tertiary">—</span>}</dd>
                </div>
                <div>
                  <dt className="text-sm text-fg-secondary">Notes</dt>
                  <dd className="font-medium text-fg">{customer.notes ?? <span className="text-fg-tertiary">—</span>}</dd>
                </div>
                <div>
                  <dt className="text-sm text-fg-secondary">Created</dt>
                  <dd className="font-medium text-fg">{formatDate(customer.created_at)}</dd>
                </div>
                <div>
                  <dt className="text-sm text-fg-secondary">Updated</dt>
                  <dd className="font-medium text-fg">{formatDate(customer.updated_at)}</dd>
                </div>
              </dl>
            </CardContent>
          </Card>

          {/* Edit Form */}
          {canEdit && (
            <Card padding="md">
              <CardHeader>
                <CardTitle>Edit Customer</CardTitle>
                <CardDescription>Update customer information</CardDescription>
              </CardHeader>
              <CardContent>
                <form action={updateCustomerAction} className="space-y-4">
                  <input type="hidden" name="id" value={customer.id} />

                  <Input
                    label="Customer name *"
                    name="customerName"
                    required
                    defaultValue={customer.customer_name}
                    placeholder="John Doe"
                    autoComplete="name"
                  />

                  <Input
                    label="Phone"
                    name="phone"
                    type="tel"
                    defaultValue={customer.phone ?? ""}
                    placeholder="+63 9XX XXX XXXX"
                    autoComplete="tel"
                  />

                  <Input
                    label="Email"
                    name="email"
                    type="email"
                    defaultValue={customer.email ?? ""}
                    placeholder="john@example.com"
                    autoComplete="email"
                  />

                  <Textarea
                    label="Address"
                    name="address"
                    rows={3}
                    defaultValue={customer.address ?? ""}
                    placeholder="123 Main St, City, Province"
                  />

                  <Textarea
                    label="Notes"
                    name="notes"
                    rows={2}
                    defaultValue={customer.notes ?? ""}
                    placeholder="Preferred contact time, special instructions..."
                  />

                  <div className="flex gap-3 pt-4 border-t border-border">
                    <Button type="submit" variant="primary">Save Changes</Button>
                    <Button asChild variant="secondary">
                      <a href="/dashboard/customers">Cancel</a>
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
                <form action={deleteCustomerAction} onSubmit={(e) => {
                  if (!confirm("Delete this customer? This action cannot be undone.")) {
                    e.preventDefault();
                  }
                }}>
                  <input type="hidden" name="id" value={customer.id} />
                  <Button type="submit" variant="danger">Delete Customer</Button>
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
                <a href="/dashboard/customers">← Back to Customers</a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}