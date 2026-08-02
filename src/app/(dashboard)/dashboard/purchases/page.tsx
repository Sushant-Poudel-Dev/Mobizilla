import { getPurchases } from "@/src/features/purchases/queries";
import { redirect } from "next/navigation";

export default async function PurchasesPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; success?: string }>;
}) {
  const { error, success } = await searchParams;
  const purchases = await getPurchases();

  if (purchases === null) {
    redirect("/login");
  }

  const appUser = await getCurrentAppUser();
  const canEdit = appUser?.role === "owner" || appUser?.role === "admin";

  return (
    <main className="dashboard-content">
      <header className="dashboard-header">
        <div className="dashboard-title">
          <h1>Purchases</h1>
          <p>Manage purchase orders</p>
        </div>
        {canEdit && (
          <a href="/dashboard/purchases/new" className="btn btn-primary">
            New Purchase
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
          Purchase created successfully.
        </div>
      )}

      <section className="dashboard-grid" style={{ gridTemplateColumns: "1fr" }}>
        <article className="dashboard-card">
          <header className="card-header">
            <span className="card-icon" aria-hidden="true">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m-16.5 0a2.25 2.25 0 0 1 2.25-2.25H19.5A2.25 2.25 0 0 1 21.75 5.25V12m-18 0v4.5m0 0H6.75m13.5-4.5H18a2.25 2.25 0 0 0-2.25 2.25v3.375m-1.5 3.75h.008v.008H12v-.008h-.008V16.5h-.008v-.008H8.25v.008H8.242v.008H5.25" />
              </svg>
            </span>
            <h2>All Purchases</h2>
          </header>

          <div className="table-wrapper">
            <table className="purchases-table">
              <thead>
                <tr>
                  <th>Purchase #</th>
                  <th>Date</th>
                  <th>Supplier</th>
                  <th>Branch</th>
                  <th>Payment Status</th>
                  <th>Additional Cost</th>
                  <th>Created</th>
                </tr>
              </thead>
              <tbody>
                {purchases.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="empty-state">
                      No purchases yet. Create your first purchase order.
                    </td>
                  </tr>
                ) : (
                  purchases.map((purchase) => (
                    <tr key={purchase.id}>
                      <td className="font-medium">{purchase.purchase_number}</td>
                      <td>{new Date(purchase.purchase_date).toLocaleDateString()}</td>
                      <td>{purchase.supplier?.supplier_name ?? "—"}</td>
                      <td>{purchase.branch?.branch_name ?? "—"}</td>
                      <td><span className="status-badge">{purchase.payment_status?.name ?? "—"}</span></td>
                      <td>₱{Number(purchase.additional_cost || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                      <td>{new Date(purchase.created_at).toLocaleDateString()}</td>
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