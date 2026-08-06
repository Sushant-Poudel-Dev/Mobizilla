import {
  getRepairTicketById,
  getRepairStatuses,
  getTechniciansForRepair,
  getInventoryItemsForRepair,
  getConditionsForRepair,
} from "@/src/features/repairs/queries";
import { updateTicketStatusAction, assignTechnicianAction, addRepairPartAction, addRepairServiceAction } from "@/src/features/repairs/actions";
import { getCurrentAppUser } from "@/src/lib/data/currentUser";
import { notFound } from "next/navigation";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Table,
  Select,
  Button,
  StatusBadge,
  Badge,
  Input,
  Textarea,
} from "@/src/components/ui";
import { formatCurrency, formatDate } from "@/src/lib/format";
import { type SelectOption } from "@/src/components/ui";

export default async function RepairTicketDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const ticket = await getRepairTicketById(id);

  if (!ticket) {
    notFound();
  }

  const [statuses, technicians, inventoryItems, conditions] = await Promise.all([
    getRepairStatuses(),
    getTechniciansForRepair(),
    getInventoryItemsForRepair(),
    getConditionsForRepair(),
  ]);

  const appUser = await getCurrentAppUser();
  const canEdit = appUser?.role === "owner" || appUser?.role === "admin" || appUser?.role === "technician" || appUser?.role === "front_desk";
  const canAssign = appUser?.role === "owner" || appUser?.role === "admin";

  const partsTotal = ticket.parts?.reduce((sum, p) => sum + Number(p.total_price), 0) ?? 0;
  const servicesTotal = ticket.services?.reduce((sum, s) => sum + Number(s.service_price), 0) ?? 0;
  const grandTotal = partsTotal + servicesTotal;

  const statusOptions: SelectOption[] = statuses.map((s) => ({ value: s.id, label: s.name }));
  const technicianOptions: SelectOption[] = [
    { value: "", label: "Unassign" },
    ...technicians.map((t) => ({ value: t.id, label: t.full_name })),
  ];
  const inventoryOptions: SelectOption[] = inventoryItems.map((item) => ({
    value: item.id,
    label: `${item.part_name} ${item.part_code ? `(${item.part_code})` : ""}`,
  }));
  const conditionOptions: SelectOption[] = conditions.map((c) => ({ value: c.id, label: c.name }));

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-fg">{ticket.ticket_number}</h1>
          <p className="text-fg-secondary mt-1">{ticket.customer?.full_name ?? "Unknown customer"}</p>
        </div>
        <div className="flex items-center gap-2">
          <StatusBadge status={ticket.status?.name ?? "—"} />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column - 2/3 width */}
        <div className="lg:col-span-2 space-y-6">
          {/* Ticket Details */}
          <Card padding="md">
            <CardHeader>
              <CardTitle>Ticket Details</CardTitle>
              <CardDescription>Customer and device information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <dl className="grid gap-4 sm:grid-cols-2">
                <div>
                  <dt className="text-sm text-fg-secondary">Customer</dt>
                  <dd className="font-medium text-fg">{ticket.customer?.full_name ?? "—"}</dd>
                </div>
                <div>
                  <dt className="text-sm text-fg-secondary">Phone</dt>
                  <dd className="font-medium text-fg">{ticket.customer?.phone_number ?? "—"}</dd>
                </div>
                <div>
                  <dt className="text-sm text-fg-secondary">Device</dt>
                  <dd className="font-medium text-fg">
                    {ticket.device_model?.name ?? "—"}
                    {ticket.device_model?.brand && <span className="text-fg-secondary ml-1">({ticket.device_model.brand.name})</span>}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm text-fg-secondary">Issue</dt>
                  <dd className="font-medium text-fg">{ticket.issue_description ?? <span className="text-fg-tertiary">—</span>}</dd>
                </div>
                <div>
                  <dt className="text-sm text-fg-secondary">Branch</dt>
                  <dd className="font-medium text-fg">{ticket.branch?.branch_name ?? "—"}</dd>
                </div>
                <div>
                  <dt className="text-sm text-fg-secondary">Technician</dt>
                  <dd className="font-medium text-fg">{ticket.assigned_technician?.full_name ?? "—"}</dd>
                </div>
                <div>
                  <dt className="text-sm text-fg-secondary">Created</dt>
                  <dd className="font-medium text-fg">{formatDate(ticket.created_at)}</dd>
                </div>
                <div>
                  <dt className="text-sm text-fg-secondary">Closed</dt>
                  <dd className="font-medium text-fg">{ticket.closed_at ? formatDate(ticket.closed_at) : <span className="text-fg-tertiary">—</span>}</dd>
                </div>
              </dl>
            </CardContent>
          </Card>

          {/* Parts */}
          <Card padding="none">
            <CardHeader className="pb-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <CardTitle>Parts Used</CardTitle>
                  <CardDescription>{ticket.parts?.length ?? 0} part(s) added</CardDescription>
                </div>
                {canEdit && (
                  <Button asChild variant="ghost" size="sm">
                    <a href={`#add-part`}>+ Add Part</a>
                  </Button>
                )}
              </div>
            </CardHeader>
            {ticket.parts && ticket.parts.length > 0 ? (
              <Table
                columns={[
                  { key: "part", header: "Part", render: (part: typeof ticket.parts[0]) => part.inventory_stock?.inventory_item?.part_name ?? "—" },
                  { key: "condition", header: "Condition", render: (part: typeof ticket.parts[0]) => part.inventory_stock?.condition?.name ?? "—" },
                  { key: "quantity", header: "Qty", className: "text-right font-mono", render: (part: typeof ticket.parts[0]) => part.quantity },
                  { key: "unit_price", header: "Unit Price", className: "text-right font-mono", render: (part: typeof ticket.parts[0]) => formatCurrency(part.unit_price, "PHP") },
                  { key: "total_price", header: "Total", className: "text-right font-mono font-medium", render: (part: typeof ticket.parts[0]) => formatCurrency(part.total_price, "PHP") },
                ]}
                data={ticket.parts}
                keyExtractor={(part) => part.id}
              />
            ) : (
              <CardContent className="py-12 text-center">
                <p className="text-fg-tertiary">No parts added yet.</p>
              </CardContent>
            )}

            {/* Add Part Form */}
            {canEdit && (
              <div id="add-part">
                <CardContent className="pb-6">
                  <h3 className="text-lg font-semibold text-fg mb-4">Add Part</h3>
                <form action={addRepairPartAction} className="space-y-4">
                  <input type="hidden" name="repairTicketId" value={ticket.id} />
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Select
                      label="Inventory Item *"
                      name="inventoryStockId"
                      required
                      options={inventoryOptions}
                    />
                    <Select
                      label="Condition *"
                      name="conditionId"
                      required
                      options={conditionOptions}
                    />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Input
                      label="Quantity *"
                      name="quantity"
                      type="number"
                      min="1"
                      required
                      placeholder="1"
                    />
                    <Input
                      label="Unit price *"
                      name="unitPrice"
                      type="number"
                      step="0.01"
                      min="0"
                      required
                      placeholder="0.00"
                    />
                  </div>
                  <Button type="submit" variant="primary">Add Part</Button>
</form>
                </CardContent>
              </div>
            )}
          </Card>

          {/* Services */}
          <Card padding="none">
            <CardHeader className="pb-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <CardTitle>Services</CardTitle>
                  <CardDescription>{ticket.services?.length ?? 0} service(s) added</CardDescription>
                </div>
                {canEdit && (
                  <Button asChild variant="ghost" size="sm">
                    <a href={`#add-service`}>+ Add Service</a>
                  </Button>
                )}
              </div>
            </CardHeader>
            {ticket.services && ticket.services.length > 0 ? (
              <Table
                columns={[
                  { key: "service_name", header: "Service", render: (service: typeof ticket.services[0]) => service.service_name },
                  { key: "service_price", header: "Price", className: "text-right font-mono font-medium", render: (service: typeof ticket.services[0]) => formatCurrency(service.service_price, "PHP") },
                ]}
                data={ticket.services}
                keyExtractor={(service) => service.id}
              />
            ) : (
              <CardContent className="py-12 text-center">
                <p className="text-fg-tertiary">No services added yet.</p>
              </CardContent>
            )}

            {/* Add Service Form */}
            {canEdit && (
              <div id="add-service">
                <CardContent className="pb-6">
                  <h3 className="text-lg font-semibold text-fg mb-4">Add Service</h3>
                <form action={addRepairServiceAction} className="space-y-4">
                  <input type="hidden" name="repairTicketId" value={ticket.id} />
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Input
                      label="Service name *"
                      name="serviceName"
                      required
                      placeholder="Screen replacement"
                    />
                    <Input
                      label="Price *"
                      name="servicePrice"
                      type="number"
                      step="0.01"
                      min="0"
                      required
                      placeholder="0.00"
                    />
                  </div>
                  <Button type="submit" variant="primary">Add Service</Button>
                </form>
              </CardContent>
            </div>
          )}
          </Card>
        </div>

        {/* Right Column - 1/3 width */}
        <div className="space-y-6">
          {/* Status & Assignment */}
          <Card padding="md">
            <CardHeader>
              <CardTitle>Status & Assignment</CardTitle>
              <CardDescription>Update ticket progress</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm text-fg-secondary block mb-1">Current Status</label>
                <StatusBadge status={ticket.status?.name ?? "—"} className="inline-block" />
              </div>

              {canEdit && (
                <form action={updateTicketStatusAction} className="space-y-3">
                  <input type="hidden" name="id" value={ticket.id} />
                  <Select
                    label="Update Status"
                    name="statusId"
                    required
                    options={statusOptions}
                    defaultValue={ticket.status_id}
                  />
                  <Button type="submit" variant="primary" className="w-full">Update Status</Button>
                </form>
              )}

              {canAssign && (
                <form action={assignTechnicianAction} className="space-y-3 pt-4 border-t border-border">
                  <input type="hidden" name="id" value={ticket.id} />
                  <Select
                    label="Assign Technician"
                    name="technicianId"
                    options={technicianOptions}
                    defaultValue={ticket.assigned_technician_id ?? ""}
                  />
                  <Button type="submit" variant="primary" className="w-full">Assign</Button>
                </form>
              )}
            </CardContent>
          </Card>

          {/* Totals */}
          <Card padding="md">
            <CardHeader>
              <CardTitle>Totals</CardTitle>
              <CardDescription>Financial summary</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <dl className="space-y-2">
                <div className="flex justify-between">
                  <dt className="text-fg-secondary">Parts Total</dt>
                  <dd className="font-medium font-mono">{formatCurrency(partsTotal, "PHP")}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-fg-secondary">Services Total</dt>
                  <dd className="font-medium font-mono">{formatCurrency(servicesTotal, "PHP")}</dd>
                </div>
              </dl>
              <div className="pt-3 border-t border-border">
                <div className="flex justify-between text-lg">
                  <dt className="font-semibold">Grand Total</dt>
                  <dd className="font-bold font-mono">{formatCurrency(grandTotal, "PHP")}</dd>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
