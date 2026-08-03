import { getCustomers } from "@/src/features/customers/queries";
import { createCustomerAction } from "@/src/features/customers/actions";
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

export default async function CustomersPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; success?: string }>;
}) {
  const { error, success } = await searchParams;
  const customers = await getCustomers();

  if (customers === null) {
    redirect("/login");
  }

  const columns = [
    {
      key: "customer_name",
      header: "Name",
      render: (customer: typeof customers[0]) => <span className="font-medium">{customer.customer_name}</span>,
    },
    {
      key: "phone",
      header: "Phone",
      render: (customer: typeof customers[0]) => customer.phone ?? "—",
    },
    {
      key: "email",
      header: "Email",
      render: (customer: typeof customers[0]) => customer.email ?? "—",
    },
    {
      key: "address",
      header: "Address",
      render: (customer: typeof customers[0]) => customer.address ?? "—",
    },
    {
      key: "created_at",
      header: "Created",
      render: (customer: typeof customers[0]) => formatDate(customer.created_at),
    },
  ];

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-fg">Customers</h1>
          <p className="text-fg-secondary mt-1">Manage your customer database</p>
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
          Customer saved successfully.
        </div>
      )}

      {/* Customers Table + Add Form */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Customers Table - 2/3 width */}
        <div className="lg:col-span-2">
          <Card padding="none">
            <CardHeader className="pb-4">
              <CardTitle>All Customers</CardTitle>
              <CardDescription>Customer database</CardDescription>
            </CardHeader>
            <Table
              columns={columns}
              data={customers}
              keyExtractor={(customer) => customer.id}
              emptyState={
                <div className="text-center py-12">
                  <svg className="w-12 h-12 mx-auto text-fg-tertiary/50 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0ZM15.75 19.5a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0ZM21 15.75a3.75 3.75 0 01-7.5 0H3a3.75 3.75 0 010-7.5h10.5a3.75 3.75 0 017.5 0Z" />
                  </svg>
                  <p className="text-fg-secondary">No customers yet.</p>
                  <p className="text-fg-tertiary text-sm mt-1">Add your first customer using the form.</p>
                </div>
              }
            />
          </Card>
        </div>

        {/* Add Customer Form - 1/3 width */}
        <Card padding="md">
          <CardHeader>
            <CardTitle>Add Customer</CardTitle>
            <CardDescription>Create a new customer record</CardDescription>
          </CardHeader>
          <CardContent>
            <form action={createCustomerAction} className="space-y-4">
              <Input
                label="Customer name *"
                name="customerName"
                required
                placeholder="John Doe"
                autoComplete="name"
              />

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
                placeholder="john@example.com"
                autoComplete="email"
              />

              <Textarea
                label="Address"
                name="address"
                rows={3}
                placeholder="123 Main St, City, Province"
              />

              <Textarea
                label="Notes"
                name="notes"
                rows={2}
                placeholder="Preferred contact time, special instructions..."
              />

              <Button type="submit" variant="primary" className="w-full">
                Add Customer
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}