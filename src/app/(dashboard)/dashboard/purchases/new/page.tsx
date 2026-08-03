import {
  getSuppliersForPurchase,
  getBranchesForPurchase,
  getPaymentStatuses,
  getInventoryItemsForPurchase,
  getConditions,
} from "@/src/features/purchases/queries";
import { createPurchaseAction } from "@/src/features/purchases/actions";
import { redirect } from "next/navigation";
import { LineItemsForm } from "@/src/components/purchases/LineItemsForm";

export default async function NewPurchasePage() {
  const [suppliers, branches, paymentStatuses, inventoryItems, conditions] = await Promise.all([
    getSuppliersForPurchase(),
    getBranchesForPurchase(),
    getPaymentStatuses(),
    getInventoryItemsForPurchase(),
    getConditions(),
  ]);

  const appUser = await getCurrentAppUser();
  const canEdit = appUser?.role === "owner" || appUser?.role === "admin";

  if (!canEdit) {
    redirect("/dashboard/purchases");
  }

  return (
    <main className="dashboard-content">
      <header className="dashboard-header">
        <div className="dashboard-title">
          <h1>New Purchase</h1>
          <p>Create a purchase order with line items</p>
        </div>
      </header>

      <section className="dashboard-grid" style={{ gridTemplateColumns: "1fr", maxWidth: "900px" }}>
        <article className="dashboard-card">
          <header className="card-header">
            <span className="card-icon" aria-hidden="true">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
            </span>
            <h2>Purchase Details</h2>
          </header>

          <form action={createPurchaseAction} className="purchase-form">
            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="supplierId">Supplier *</label>
                <select
                  id="supplierId"
                  name="supplierId"
                  required
                  className="form-input form-select"
                >
                  <option value="">Select supplier</option>
                  {suppliers.map((s) => (
                    <option key={s.id} value={s.id}>{s.supplier_name}</option>
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

            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="purchaseNumber">Purchase # *</label>
                <input
                  id="purchaseNumber"
                  name="purchaseNumber"
                  required
                  autoComplete="off"
                  className="form-input"
                  placeholder="PO-2024-001"
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="purchaseDate">Purchase date *</label>
                <input
                  id="purchaseDate"
                  name="purchaseDate"
                  type="date"
                  required
                  defaultValue={new Date().toISOString().split("T")[0]}
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="paymentStatusId">Payment status *</label>
                <select
                  id="paymentStatusId"
                  name="paymentStatusId"
                  required
                  className="form-input form-select"
                >
                  <option value="">Select status</option>
                  {paymentStatuses.map((ps) => (
                    <option key={ps.id} value={ps.id}>{ps.name}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="additionalCost">Additional cost</label>
                <input
                  id="additionalCost"
                  name="additionalCost"
                  type="number"
                  step="0.01"
                  min="0"
                  defaultValue="0"
                  className="form-input"
                  placeholder="0.00"
                />
              </div>
            </div>

            <hr className="section-divider" />

            <LineItemsForm inventoryItems={inventoryItems} conditions={conditions} />

            <div className="form-actions">
              <button type="submit" className="btn btn-primary">
                Create Purchase
              </button>
              <a href="/dashboard/purchases" className="btn btn-secondary">
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