import {
  getCustomersForRepair,
  getDeviceModelsForRepair,
  getRepairStatuses,
  getBranchesForRepair,
} from "@/src/features/repairs/queries";
import { createRepairTicketAction } from "@/src/features/repairs/actions";
import { redirect } from "next/navigation";

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

  return (
    <main className="dashboard-content">
      <header className="dashboard-header">
        <div className="dashboard-title">
          <h1>New Repair Ticket</h1>
          <p>Create a new repair ticket for a customer</p>
        </div>
      </header>

      <section className="dashboard-grid" style={{ gridTemplateColumns: "1fr", maxWidth: "720px" }}>
        <article className="dashboard-card">
          <header className="card-header">
            <span className="card-icon" aria-hidden="true">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
            </span>
            <h2>Ticket Details</h2>
          </header>

          <form action={createRepairTicketAction} className="repair-form">
            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="customerId">Customer *</label>
                <select
                  id="customerId"
                  name="customerId"
                  required
                  className="form-input form-select"
                >
                  <option value="">Select customer</option>
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.customer_name} {c.phone && `(${c.phone})`}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="branchId">Branch *</label>
                <select
                  id="branchId"
                  name="branchId"
                  required
                  className="form-input form-select"
                >
                  <option value="">Select branch</option>
                  {branches.map((b) => (
                    <option key={b.id} value={b.id}>{b.branch_name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="deviceModelId">Device model</label>
              <select
                id="deviceModelId"
                name="deviceModelId"
                className="form-input form-select"
              >
                <option value="">Select device (optional)</option>
                {deviceModels.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name} {d.brand && `(${d.brand.name})`}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="issueDescription">Issue description *</label>
              <textarea
                id="issueDescription"
                name="issueDescription"
                required
                rows={4}
                className="form-input form-textarea"
                placeholder="Describe the issue reported by the customer..."
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="statusId">Initial status *</label>
              <select
                id="statusId"
                name="statusId"
                required
                className="form-input form-select"
              >
                <option value="">Select status</option>
                {statuses.map((s) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn btn-primary">
                Create Ticket
              </button>
              <a href="/dashboard/repairs" className="btn btn-secondary">
                Cancel
              </a>
            </div>
          </form>
        </article>
      </section>
    </main>
  );
}

async function getCurrentAppUser() {
  const { getCurrentAppUser } = await import("@/src/lib/data/currentUser");
  return getCurrentAppUser();
}