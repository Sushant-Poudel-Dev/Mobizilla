import { createCustomerAction } from "@/src/features/customers/actions";
import { getCurrentAppUser } from "@/src/lib/data/currentUser";
import { redirect } from "next/navigation";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Input,
  Textarea,
  Button,
} from "@/src/components/ui";

export default async function NewCustomerPage() {
  const appUser = await getCurrentAppUser();

  if (!appUser) {
    redirect("/login");
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-fg">New Customer</h1>
        <p className="text-fg-secondary mt-1">Add a new customer to your database</p>
      </div>

      <Card padding="md" className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Customer Details</CardTitle>
          <CardDescription>Enter the customer information</CardDescription>
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

            <div className="flex gap-3 pt-4 border-t border-border">
              <Button type="submit" variant="primary">Create Customer</Button>
              <Button asChild variant="secondary">
                <a href="/dashboard/customers">Cancel</a>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}