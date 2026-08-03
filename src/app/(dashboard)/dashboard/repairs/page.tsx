import {
  getRepairTickets,
  getRepairStatuses,
  getBranchesForRepair,
  getTechniciansForRepair,
} from "@/src/features/repairs/queries";
import { getCurrentAppUser } from "@/src/lib/data/currentUser";
import { redirect } from "next/navigation";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Table,
  TableToolbar,
  Button,
  Select,
  Badge,
  StatusBadge,
} from "@/src/components/ui";
import { formatDate } from "@/src/lib/format";
import { type SelectOption } from "@/src/components/ui/Select";

export default async function RepairsPage({
  searchParams,
}: {
  searchParams: Promise<{
    error?: string;
    success?: string;
    statusId?: string;
    branchId?: string;
    technicianId?: string;
  }>;
}) {
  const { error, success, statusId, branchId, technicianId } = await searchParams;
  const [tickets, statuses, branches, technicians] = await Promise.all([
    getRepairTickets({ statusId, branchId, technicianId }),
    getRepairStatuses(),
    getBranchesForRepair(),
    getTechniciansForRepair(),
  ]);

  if (tickets === null) {
    redirect("/login");
  }

  const appUser = await getCurrentAppUser();
  const canCreate = appUser?.role === "owner" || appUser?.role === "admin" || appUser?.role === "front_desk";

  const statusOptions: SelectOption[] = [
    { value: "", label: "All statuses" },
    ...statuses.map((s) => ({ value: s.id, label: s.name })),
  ];

  const branchOptions: SelectOption[] = [
    { value: "", label: "All branches" },
    ...branches.map((b) => ({ value: b.id, label: b.branch_name })),
  ];

  const technicianOptions: SelectOption[] = [
    { value: "", label: "All technicians" },
    ...technicians.map((t) => ({ value: t.id, label: t.full_name })),
  ];

  const columns = [
    {
      key: "ticket_number",
      header: "Ticket #",
      render: (ticket: typeof tickets[0]) => (
        <a href={`/dashboard/repairs/${ticket.id}`} className="font-medium text-accent hover:underline">
          {ticket.ticket_number}
        </a>
      ),
    },
    {
      key: "customer",
      header: "Customer",
      render: (ticket: typeof tickets[0]) => ticket.customer?.full_name ?? "—",
    },
    {
      key: "device",
      header: "Device",
      render: (ticket: typeof tickets[0]) => {
        if (!ticket.device_model) return "—";
        return (
          <>
            {ticket.device_model.name}
            {ticket.device_model.brand && <span className="text-fg-secondary ml-1">({ticket.device_model.brand.name})</span>}
          </>
        );
      },
    },
    {
      key: "status",
      header: "Status",
      render: (ticket: typeof tickets[0]) => (
        <StatusBadge status={ticket.status?.name ?? "—"} />
      ),
    },
    {
      key: "technician",
      header: "Technician",
      render: (ticket: typeof tickets[0]) => ticket.assigned_technician?.full_name ?? "—",
    },
    {
      key: "branch",
      header: "Branch",
      render: (ticket: typeof tickets[0]) => ticket.branch?.branch_name ?? "—",
    },
    {
      key: "created_at",
      header: "Created",
      render: (ticket: typeof tickets[0]) => formatDate(ticket.created_at),
    },
  ];

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-fg">Repair Tickets</h1>
          <p className="text-fg-secondary mt-1">Manage repair workflows</p>
        </div>
        {canCreate && (
          <Button asChild variant="primary">
            <a href="/dashboard/repairs/new">New Ticket</a>
          </Button>
        )}
      </div>

      {/* Messages */}
      {error && (
        <div className="mb-6 p-4 bg-error-light border border-error/20 rounded-md text-error text-sm" role="alert">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-6 p-4 bg-success-light border border-success/20 rounded-md text-success text-sm" role="status">
          Operation completed successfully.
        </div>
      )}

      {/* Filters */}
      <Card padding="md" className="mb-6">
        <CardHeader>
          <CardTitle>Filters</CardTitle>
          <CardDescription>Filter tickets by status, branch, or technician</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="flex flex-wrap items-end gap-4">
            <Select
              label="Status"
              placeholder="All statuses"
              options={statusOptions}
              defaultValue={statusId ?? ""}
              name="statusId"
            />
            <Select
              label="Branch"
              placeholder="All branches"
              options={branchOptions}
              defaultValue={branchId ?? ""}
              name="branchId"
            />
            <Select
              label="Technician"
              placeholder="All technicians"
              options={technicianOptions}
              defaultValue={technicianId ?? ""}
              name="technicianId"
            />
            <Button type="submit" variant="primary">Filter</Button>
            <Button asChild variant="secondary">
              <a href="/dashboard/repairs">Clear</a>
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Tickets Table */}
      <Card padding="none">
        <Table
          columns={columns}
          data={tickets}
          keyExtractor={(ticket) => ticket.id}
          emptyState={
            <div className="text-center py-12">
              <svg className="w-12 h-12 mx-auto text-fg-tertiary/50 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-fg-secondary">No repair tickets yet.</p>
              {canCreate && (
                <Button asChild variant="primary" className="mt-4 w-auto">
                  <a href="/dashboard/repairs/new">Create your first ticket</a>
                </Button>
              )}
            </div>
          }
        />
      </Card>
    </main>
  );
}