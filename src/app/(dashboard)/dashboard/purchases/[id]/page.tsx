import { getPurchaseById } from "@/src/features/purchases/queries";
import { notFound, redirect } from "next/navigation";

export default async function PurchaseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const purchase = await getPurchaseById(id);

  if (!purchase) {
    notFound();
  }

  const appUser = await getCurrentAppUser();

  return (
    <main className="dashboard-content">
      <header className="dashboard-header">
        <div className="dashboard-title">
          <h1>{purchase.purchase_number}</h1>
          <p>{new Date(purchase.purchase_date).toLocaleDateString()}</p>
        </div>
      </header>

      <section className="dashboard-grid">
        <article className="dashboard-card">
          <header className="card-header">
            <span className="card-icon" aria-hidden="true">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m-16.5 0a2.25 2.25 0 0 1 2.25-2.25H19.5A2.25 2.25 0 0 1 21.75 5.25V12m-18 0v4.5m0 0H6.75m13.5-4.5H18a2.25 2.25 0 0 0-2.25 2.25v3.375m-1.5 3.75h.008v.008H12v-.008h-.008V16.5h-.008v-.008H8.25v.008H8.242v.008H5.25" />
              </svg>
            </span>
            <h2>Purchase Details</h2>
          </header>

          <dl className="card-fields">
            <div>
              <dt>Purchase #</dt>
              <dd>{purchase.purchase_number}</dd>
            </div>
            <div>
              <dt>Date</dt>
              <dd>{new Date(purchase.purchase_date).toLocaleDateString()}</dd>
            </div>
            <div>
              <dt>Supplier</dt>
              <dd>{purchase.supplier?.supplier_name ?? "—"}</dd>
            </div>
            <div>
              <dt>Branch</dt>
              <dd>{purchase.branch?.branch_name ?? "—"}</dd>
            </div>
            <div>
              <dt>Payment Status</dt>
              <dd><span className="status-badge">{purchase.payment_status?.name ?? "—"}</span></dd>
            </div>
            <div>
              <dt>Additional Cost</dt>
              <dd>₱{Number(purchase.additional_cost || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</dd>
            </div>
            <div>
              <dt>Created By</dt>
              <dd>{purchase.created_by_user_id ?? "—"}</dd>
            </div>
            <div>
              <dt>Created</dt>
              <dd>{new Date(purchase.created_at).toLocaleDateString()}</dd>
            </div>
            <div>
              <dt>Updated</dt>
              <dd>{new Date(purchase.updated_at).toLocaleDateString()}</dd>
            </div>
          </dl>
        </article>

        <article className="dashboard-card">
          <header className="card-header">
            <span className="card-icon" aria-hidden="true">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m-16.5 0a2.25 2.25 0 0 1 2.25-2.25H19.5A2.25 2.25 0 0 1 21.75 5.25V12m-18 0v4.5m0 0H6.75m13.5-4.5H18a2.25 2.25 0 0 0-2.25 2.25v3.375m-1.5 3.75h.008v.008H12v-.008h-.008V16.5h-.008v-.008H8.25v.008H8.242v.008H5.25" />
              </svg>
            </span>
            <h2>Line Items ({purchase.items?.length ?? 0})</h2>
          </header>

          {purchase.items && purchase.items.length > 0 ? (
            <div className="table-wrapper">
              <table className="purchase-items-table">
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Part Code</th>
                    <th>Category</th>
                    <th>Brand</th>
                    <th>Condition</th>
                    <th>Qty</th>
                    <th>Unit Cost</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {purchase.items.map((item) => (
                    <tr key={item.id}>
                      <td className="font-medium">{item.inventory_item?.part_name ?? "—"}</td>
                      <td>{item.inventory_item?.part_code ?? "—"}</td>
                      <td>{item.inventory_item?.category?.name ?? "—"}</td>
                      <td>{item.inventory_item?.brand?.name ?? "—"}</td>
                      <td>{item.condition?.name ?? "—"}</td>
                      <td className="text-right font-mono">{item.quantity}</td>
                      <td className="text-right font-mono">₱{Number(item.unit_cost).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                      <td className="text-right font-mono font-medium">₱{Number(item.total_cost).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="muted">No line items on this purchase.</p>
          )}

          {purchase.items && purchase.items.length > 0 && (
            <div className="purchase-totals">
              <div className="total-row">
                <span>Subtotal</span>
                <span>₱{purchase.items.reduce((sum, i) => sum + Number(i.total_cost), 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="total-row">
                <span>Additional Cost</span>
                <span>₱{Number(purchase.additional_cost || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="total-row grand-total">
                <span>Total</span>
                <span>₱{(purchase.items.reduce((sum, i) => sum + Number(i.total_cost), 0) + Number(purchase.additional_cost || 0)).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
              </div>
            </div>
          )}
        </article>
      </section>
    </main>
  );
}

async function getCurrentAppUser() {
  const { getCurrentAppUser } = await import("@/src/lib/data/currentUser");
  return getCurrentAppUser();
}