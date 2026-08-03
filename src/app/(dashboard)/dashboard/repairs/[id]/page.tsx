import {
  getRepairTicketById,
  getRepairStatuses,
  getTechniciansForRepair,
  getInventoryItemsForRepair,
  getConditionsForRepair,
} from "@/src/features/repairs/queries";
import { updateTicketStatusAction, assignTechnicianAction, addRepairPartAction, addRepairServiceAction } from "@/src/features/repairs/actions";
import { notFound, redirect } from "next/navigation";

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

  return (
    <main className="dashboard-content">
      <header className="dashboard-header">
        <div className="dashboard-title">
          <h1>{ticket.ticket_number}</h1>
          <p>{ticket.customer?.full_name ?? "Unknown customer"}</p>
        </div>
      </header>

      <section className="dashboard-grid">
        <article className="dashboard-card">
          <header className="card-header">
            <span className="card-icon" aria-hidden="true">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z" />
              </svg>
            </span>
            <h2>Ticket Details</h2>
          </header>

          <dl className="card-fields">
            <div>
              <dt>Customer</dt>
              <dd>{ticket.customer?.full_name ?? "—"}</dd>
            </div>
            <div>
              <dt>Phone</dt>
              <dd>{ticket.customer?.phone_number ?? "—"}</dd>
            </div>
            <div>
              <dt>Device</dt>
              <dd>
                {ticket.device_model?.name ?? "—"}
                {ticket.device_model?.brand && ` (${ticket.device_model.brand.name})`}
              </dd>
            </div>
            <div>
              <dt>Issue</dt>
              <dd>{ticket.issue_description ?? <span className="muted">—</span>}</dd>
            </div>
            <div>
              <dt>Branch</dt>
              <dd>{ticket.branch?.branch_name ?? "—"}</dd>
            </div>
            <div>
              <dt>Technician</dt>
              <dd>{ticket.assigned_technician?.full_name ?? "—"}</dd>
            </div>
            <div>
              <dt>Created</dt>
              <dd>{new Date(ticket.created_at).toLocaleDateString()}</dd>
            </div>
            <div>
              <dt>Closed</dt>
              <dd>{ticket.closed_at ? new Date(ticket.closed_at).toLocaleDateString() : <span className="muted">—</span>}</dd>
            </div>
          </dl>
        </article>

        {/* Status & Assignment */}
        <article className="dashboard-card">
          <header className="card-header">
            <span className="card-icon" aria-hidden="true">
              <svg xmlns="http://www.w3.org/2000.svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M3 21V9a6 6 0 0 1 12 0v12" />
              </svg>
            </span>
            <h2>Status & Assignment</h2>
          </header>

          <div className="card-fields">
            <div>
              <dt>Current Status</dt>
              <dd><span className="status-badge">{ticket.status?.name ?? "—"}</span></dd>
            </div>
          </div>

          {canEdit && (
            <form action={updateTicketStatusAction} className="inline-form">
              <input type="hidden" name="id" value={ticket.id} />
              <div className="form-row">
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label" htmlFor="statusId">Update Status</label>
                  <select
                    id="statusId"
                    name="statusId"
                    required
                    defaultValue={ticket.status_id}
                    className="form-input form-select"
                  >
                    {statuses.map((s) => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>
                <button type="submit" className="btn btn-primary" style={{ height: "fit-content", marginBottom: "1.5rem" }}>
                  Update Status
                </button>
              </div>
            </form>
          )}

          {canAssign && (
            <form action={assignTechnicianAction} className="inline-form">
              <input type="hidden" name="id" value={ticket.id} />
              <div className="form-row">
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label" htmlFor="technicianId">Assign Technician</label>
                  <select
                    id="technicianId"
                    name="technicianId"
                    className="form-input form-select"
                    defaultValue={ticket.assigned_technician_id ?? ""}
                  >
                    <option value="">Unassign</option>
                    {technicians.map((t) => (
                      <option key={t.id} value={t.id}>{t.full_name}</option>
                    ))}
                  </select>
                </div>
                <button type="submit" className="btn btn-primary" style={{ height: "fit-content" }}>
                  Assign
                </button>
              </div>
            </form>
          )}
        </article>

        {/* Parts */}
        <article className="dashboard-card">
          <header className="card-header">
            <span className="card-icon" aria-hidden="true">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
              </svg>
            </span>
            <h2>Parts Used</h2>
          </header>

          {ticket.parts && ticket.parts.length > 0 ? (
            <div className="table-wrapper">
              <table className="repair-parts-table">
                <thead>
                  <tr>
                    <th>Part</th>
                    <th>Condition</th>
                    <th>Qty</th>
                    <th>Unit Price</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {ticket.parts.map((part) => (
                    <tr key={part.id}>
                      <td>{part.inventory_stock?.inventory_item?.part_name ?? "—"}</td>
                      <td>{part.inventory_stock?.condition?.name ?? "—"}</td>
                      <td className="text-right font-mono">{part.quantity}</td>
                      <td className="text-right font-mono">₱{Number(part.unit_price).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                      <td className="text-right font-mono font-medium">₱{Number(part.total_price).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="muted">No parts added yet.</p>
          )}

          {canEdit && (
            <form action={addRepairPartAction} className="repair-part-form">
              <input type="hidden" name="repairTicketId" value={ticket.id} />
              <h3 className="repair-form-title">Add Part</h3>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label" htmlFor="inventoryStockId">Inventory Item *</label>
                  <select
                    id="inventoryStockId"
                    name="inventoryStockId"
                    required
                    className="form-input form-select"
                  >
                    <option value="">Select inventory item</option>
                    {inventoryItems.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.part_name} {item.part_code && `(${item.part_code})`}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="conditionId">Condition *</label>
                  <select
                    id="conditionId"
                    name="conditionId"
                    required
                    className="form-input form-select"
                  >
                    <option value="">Select condition</option>
                    {conditions.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label" htmlFor="quantity">Quantity *</label>
                  <input
                    id="quantity"
                    name="quantity"
                    type="number"
                    min="1"
                    required
                    className="form-input"
                    placeholder="1"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="unitPrice">Unit price *</label>
                  <input
                    id="unitPrice"
                    name="unitPrice"
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    className="form-input"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <button type="submit" className="btn btn-primary btn-sm">
                Add Part
              </button>
            </form>
          )}
        </article>

        {/* Services */}
        <article className="dashboard-card">
          <header className="card-header">
            <span className="card-icon" aria-hidden="true">
              <svg xmlns="http://www.w3.org/2000.svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M3 21V9a6 6 0 0 1 12 0v12" />
              </svg>
            </span>
            <h2>Services</h2>
          </header>

          {ticket.services && ticket.services.length > 0 ? (
            <div className="table-wrapper">
              <table className="repair-services-table">
                <thead>
                  <tr>
                    <th>Service</th>
                    <th>Price</th>
                  </tr>
                </thead>
                <tbody>
                  {ticket.services.map((service) => (
                    <tr key={service.id}>
                      <td>{service.service_name}</td>
                      <td className="text-right font-mono font-medium">₱{Number(service.service_price).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="muted">No services added yet.</p>
          )}

          {canEdit && (
            <form action={addRepairServiceAction} className="repair-service-form">
              <input type="hidden" name="repairTicketId" value={ticket.id} />
              <h3 className="repair-form-title">Add Service</h3>
              <div className="form-row">
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label" htmlFor="serviceName">Service name *</label>
                  <input
                    id="serviceName"
                    name="serviceName"
                    required
                    className="form-input"
                    placeholder="Screen replacement"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="servicePrice">Price *</label>
                  <input
                    id="servicePrice"
                    name="servicePrice"
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    className="form-input"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <button type="submit" className="btn btn-primary btn-sm">
                Add Service
              </button>
            </form>
          )}
        </article>

        {/* Totals */}
        <article className="dashboard-card">
          <header className="card-header">
            <span className="card-icon" aria-hidden="true">
              <svg xmlns="http://www.w3.org/2000.svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12M15 6v12m-6 0h6m-3 3h6" />
              </svg>
            </span>
            <h2>Totals</h2>
          </header>

          <div className="card-fields">
            <div>
              <dt>Parts Total</dt>
              <dd>₱{ticket.parts?.reduce((sum, p) => sum + Number(p.total_price), 0).toLocaleString(undefined, { minimumFractionDigits: 2 }) ?? "0.00"}</dd>
            </div>
            <div>
              <dt>Services Total</dt>
              <dd>₱{ticket.services?.reduce((sum, s) => sum + Number(s.service_price), 0).toLocaleString(undefined, { minimumFractionDigits: 2 }) ?? "0.00"}</dd>
            </div>
            <div className="grand-total">
              <dt>Grand Total</dt>
              <dd>
                ₱{(
                  (ticket.parts?.reduce((sum, p) => sum + Number(p.total_price), 0) ?? 0) +
                  (ticket.services?.reduce((sum, s) => sum + Number(s.service_price), 0) ?? 0)
                ).toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </dd>
            </div>
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