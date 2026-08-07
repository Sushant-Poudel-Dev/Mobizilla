import { createSupplierAction } from "@/src/features/suppliers/actions";
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

export default async function NewSupplierPage() {
  const appUser = await getCurrentAppUser();
  const canEdit = appUser?.role === "owner" || appUser?.role === "admin";

  if (!canEdit) {
    redirect("/dashboard/suppliers");
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-fg">New Supplier</h1>
        <p className="text-fg-secondary mt-1">Add a new supplier to your database</p>
      </div>

      <Card padding="md" className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Supplier Details</CardTitle>
          <CardDescription>Enter the supplier information</CardDescription>
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

            <div className="flex gap-3 pt-4 border-t border-border">
              <Button type="submit" variant="primary">Create Supplier</Button>
              <Button asChild variant="secondary">
                <a href="/dashboard/suppliers">Cancel</a>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
