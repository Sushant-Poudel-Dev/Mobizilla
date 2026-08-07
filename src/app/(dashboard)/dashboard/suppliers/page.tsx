import { getSuppliers } from "@/src/features/suppliers/queries";
import { createSupplierAction } from "@/src/features/suppliers/actions";
import { getCurrentAppUser } from "@/src/lib/data/currentUser";
import { redirect } from "next/navigation";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Table,
  Input,
  Textarea,
  Button,
} from "@/src/components/ui";
import { formatDate } from "@/src/lib/format";

export default async function SuppliersPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; success?: string }>;
}) {
  const { error, success } = await searchParams;
  const suppliers = await getSuppliers();

  if (suppliers === null) {
    redirect("/login");
  }

  const appUser = await getCurrentAppUser();
  const canEdit = appUser?.role === "owner" || appUser?.role === "admin";

  const columns = [
    {
      key: "supplier_name",
      header: "Name",
      render: (supplier: typeof suppliers[0]) => <span className="font-medium">{supplier.supplier_name}</span>,
    },
    {
      key: "contact_person",
      header: "Contact Person",
      render: (supplier: typeof suppliers[0]) => supplier.contact_person ?? "—",
    },
    {
      key: "phone_number",
      header: "Phone",
      render: (supplier: typeof suppliers[0]) => supplier.phone_number ?? "—",
    },
    {
      key: "email",
      header: "Email",
      render: (supplier: typeof suppliers[0]) => supplier.email ?? "—",
    },
    {
      key: "address",
      header: "Address",
      render: (supplier: typeof suppliers[0]) => supplier.address ?? "—",
    },
    {
      key: "created_at",
      header: "Created",
      render: (supplier: typeof suppliers[0]) => formatDate(supplier.created_at),
    },
  ];

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-fg">Suppliers</h1>
          <p className="text-fg-secondary mt-1">Manage your supplier database</p>
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
          Supplier saved successfully.
        </div>
      )}

      {/* Suppliers Table + Add Form */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Suppliers Table - 2/3 width */}
        <div className="lg:col-span-2">
          <Card padding="none">
            <CardHeader className="pb-4">
              <CardTitle>All Suppliers</CardTitle>
              <CardDescription>Supplier database</CardDescription>
            </CardHeader>
            <Table
              columns={columns}
              data={suppliers}
              keyExtractor={(supplier) => supplier.id}
              emptyState={
                <div className="text-center py-12">
                  <svg className="w-12 h-12 mx-auto text-fg-tertiary/50 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m-16.5 0a2.25 2.25 0 012.25-2.25H19.5A2.25 2.25 0 0121.75 5.25V12m-18 0v4.5m0 0H6.75m13.5-4.5H18a2.25 2.25 0 00-2.25 2.25v3.375m-1.5 3.75h.008v.008H12v-.008h-.008V16.5h-.008v-.008H8.25v.008H8.242v.008H5.25" />
                  </svg>
                  <p className="text-fg-secondary">No suppliers yet.</p>
                  {canEdit && <p className="text-fg-tertiary text-sm mt-1">Add your first supplier using the form.</p>}
                </div>
              }
            />
          </Card>
        </div>

        {/* Add Supplier Form - 1/3 width */}
        {canEdit && (
          <Card padding="md">
            <CardHeader>
              <CardTitle>Add Supplier</CardTitle>
              <CardDescription>Create a new supplier record</CardDescription>
            </CardHeader>
            <CardContent>
              <form action={createSupplierAction} className="space-y-4">
                <Input
                  label="Supplier name *"
                  name="supplierName"
                  required
                  placeholder="ABC Parts Co."
                  autoComplete="name"
                />

                <Input
                  label="Contact person"
                  name="contactPerson"
                  placeholder="John Smith"
                  autoComplete="name"
                />

                <div className="grid gap-4 sm:grid-cols-2">
                  <Input
                    label="Phone"
                    name="phone"
                    type="tel"
                    placeholder="+63 9XX XXX XXXX"
                    autoComplete="tel"
                  />

                  <Input
                    label="Email"
                    name="email"
                    type="email"
                    placeholder="contact@abcpco.com"
                    autoComplete="email"
                  />
                </div>

                <Textarea
                  label="Address"
                  name="address"
                  rows={3}
                  placeholder="123 Industrial Ave, City, Province"
                />

                <Textarea
                  label="Notes"
                  name="remarks"
                  rows={2}
                  placeholder="Payment terms, preferred contact time..."
                />

                <Button type="submit" variant="primary" className="w-full">
                  Add Supplier
                </Button>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  );
}
