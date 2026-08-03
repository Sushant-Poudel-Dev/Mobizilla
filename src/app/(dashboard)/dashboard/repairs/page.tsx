import {
  getRepairTickets,
  getRepairStatuses,
  getBranchesForRepair,
  getTechniciansForRepair,
} from "@/src/features/repairs/queries";
import { redirect } from "next/navigation";

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

  return (
    <main className="dashboard-content">
      <header className="dashboard-header">
        <div className="dashboard-title">
          <h1>Repair Tickets</h1>
          <p>Manage repair workflows</p>
        </div>
        {canCreate && (
          <a href="/dashboard/repairs/new" className="btn btn-primary">
            New Ticket
          </a>
        )}
      </header>

      {error && (
        <div className="error-message" role="alert">
          {error}
        </div>
      )}

      {success && (
        <div className="success-message" role="status">
          Operation completed successfully.
        </div>
      )}

      {/* Filters */}
      <section className="dashboard-card filters-card">
        <form className="filters-form">
          <div className="filters-row">
            <div className="form-group">
              <label className="form-label" htmlFor="statusId">Status</label>
              <select
                id="statusId"
                name="statusId"
                className="form-input form-select"
                defaultValue={statusId ?? ""}
              >
                <option value="">All statuses</option>
                {statuses.map((s) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="branchId">Branch</label>
              <select
                id="branchId"
                name="branchId"
                className="form-input form-select"
                defaultValue={branchId ?? ""}
              >
                <option value="">All branches</option>
                {branches.map((b) => (
                  <option key={b.id} value={b.id}>{b.branch_name}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="technicianId">Technician</label>
              <select
                id="technicianId"
                name="technicianId"
                className="form-input form-select"
                defaultValue={technicianId ?? ""}
              >
                <option value="">All technicians</option>
                {technicians.map((t) => (
                  <option key={t.id} value={t.id}>{t.full_name}</option>
                ))}
              </select>
            </div>

            <button type="submit" className="btn btn-primary filters-submit">
              Filter
            </button>
            <a href="/dashboard/repairs" className="btn btn-secondary filters-submit">
              Clear
            </a>
          </div>
        </form>
      </section>

      <section className="dashboard-grid" style={{ gridTemplateColumns: "1fr" }}>
        <article className="dashboard-card">
          <header className="card-header">
            <span className="card-icon" aria-hidden="true">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z" />
              </svg>
            </span>
            <h2>All Tickets</h2>
          </header>

          <div className="table-wrapper">
            <table className="repairs-table">
              <thead>
                <tr>
                  <th>Ticket #</th>
                  <th>Customer</th>
                  <th>Device</th>
                  <th>Status</th>
                  <th>Technician</th>
                  <th>Branch</th>
                  <th>Created</th>
                </tr>
              </thead>
              <tbody>
                {tickets.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="empty-state">
                      No repair tickets yet. Create your first ticket.
                    </td>
                  </tr>
                ) : (
                  tickets.map((ticket) => (
                    <tr key={ticket.id}>
                      <td className="font-medium">
                        <a href={`/dashboard/repairs/${ticket.id}`}>{ticket.ticket_number}</a>
                      </td>
                      <td>{ticket.customer?.full_name ?? "—"}</td>
                      <td>
                        {ticket.device_model?.name ?? "—"}
                        {ticket.device_model?.brand && ` (${ticket.device_model.brand.name})`}
                      </td>
                      <td><span className="status-badge">{ticket.status?.name ?? "—"}</span></td>
                      <td>{ticket.assigned_technician?.full_name ?? "—"}</td>
                      <td>{ticket.branch?.branch_name ?? "—"}</td>
                      <td>{new Date(ticket.created_at).toLocaleDateString()}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </article>
      </section>
    </main>
  );
}

async function getCurrentAppUser() {
  const { getCurrentAppUser } = await import("@/src/lib/data/currentUser");
  return getCurrentAppUser();
}