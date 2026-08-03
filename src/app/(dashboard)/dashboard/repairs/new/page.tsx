import {
  getCustomersForRepair,
  getDeviceModelsForRepair,
  getRepairStatuses,
  getBranchesForRepair,
} from "@/src/features/repairs/queries";
import { createRepairTicketAction } from "@/src/features/repairs/actions";
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
import { type SelectOption } from "@/src/components/ui/Select";

export default async function NewRepairTicketPage() {
  const [customers, deviceModels, statuses, branches] = await Promise.all([
    getCustomersForRepair(),
    getDeviceModelsForRepair(),
    getRepairStatuses(),
    getBranchesForRepair(),
  ]);

  const appUser = await getCurrentAppUser();
  const canCreate = appUser?.role === "owner" || appUser?.role === "admin" || appUser?.role === "front_desk";

  if (!canCreate) {
    redirect("/dashboard/repairs");
  }

  const customerOptions: SelectOption[] = [
    { value: "", label: "Select customer" },
    ...customers.map((c) => ({ value: c.id, label: `${c.customer_name} ${c.phone ? `(${c.phone})` : ""}` })),
  ];

  const branchOptions: SelectOption[] = [
    { value: "", label: "Select branch" },
    ...branches.map((b) => ({ value: b.id, label: b.branch_name })),
  ];

  const deviceModelOptions: SelectOption[] = [
    { value: "", label: "Select device (optional)" },
    ...deviceModels.map((d) => ({ value: d.id, label: `${d.name} ${d.brand ? `(${d.brand.name})` : ""}` })),
  ];

  const statusOptions: SelectOption[] = [
    { value: "", label: "Select status" },
    ...statuses.map((s) => ({ value: s.id, label: s.name })),
  ];

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-fg">New Repair Ticket</h1>
        <p className="text-fg-secondary mt-1">Create a new repair ticket for a customer</p>
      </div>

      <Card padding="md" className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Ticket Details</CardTitle>
          <CardDescription>Enter the repair ticket information</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={createRepairTicketAction} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Select
                label="Customer *"
                name="customerId"
                required
                options={customerOptions}
              />

              <Select
                label="Branch *"
                name="branchId"
                required
                options={branchOptions}
              />
            </div>

            <Select
              label="Device model"
              name="deviceModelId"
              options={deviceModelOptions}
            />

            <Textarea
              label="Issue description *"
              name="issueDescription"
              required
              rows={4}
              placeholder="Describe the issue reported by the customer..."
            />

            <Select
              label="Initial status *"
              name="statusId"
              required
              options={statusOptions}
            />

            <div className="flex gap-3 pt-4 border-t border-border">
              <Button type="submit" variant="primary">Create Ticket</Button>
              <Button asChild variant="secondary">
                <a href="/dashboard/repairs">Cancel</a>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}