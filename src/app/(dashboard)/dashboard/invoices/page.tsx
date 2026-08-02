import { getInvoices } from "@/src/features/invoices/queries";
import { redirect } from "next/navigation";

export default async function InvoicesPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; success?: string }>;
}) {
  const { error, success } = await searchParams;
  const invoices = await getInvoices();

  if (invoices === null) {
    redirect("/login");
  }

  const appUser = await getCurrentAppUser();
  const canCreate = appUser?.role === "owner" || appUser?.role === "admin" || appUser?.role === "front_desk";

  return (
    <main className="dashboard-content">
      <header className="dashboard-header">
        <div className="dashboard-title">
          <h1>Invoices</h1>
          <p>Manage customer invoices</p>
        </div>
      </header>

      {error && (
        <div className="error-message" role="alert">
          {error}
        </div>
      )}

      {success && (
        <div className="success-message" role="status">
          Invoice created successfully.
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
            <h2>All Invoices</h2>
          </header>

          <div className="table-wrapper">
            <table className="invoices-table">
              <thead>
                <tr>
                  <th>Invoice #</th>
                  <th>Date</th>
                  <th>Customer</th>
                  <th>Ticket</th>
                  <th>Branch</th>
                  <th>Total</th>
                  <th>Payment Status</th>
                  <th>Created</th>
                </tr>
              </thead>
              <tbody>
                {invoices.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="empty-state">
                      No invoices yet. Create an invoice from a completed repair ticket.
                    </td>
                  </tr>
                ) : (
                  invoices.map((invoice) => (
                    <tr key={invoice.id}>
                      <td className="font-medium">
                        <a href={`/dashboard/invoices/${invoice.id}`}>{invoice.invoice_number}</a>
                      </td>
                      <td>{new Date(invoice.invoice_date).toLocaleDateString()}</td>
                      <td>{invoice.customer?.full_name ?? "—"}</td>
                      <td>{invoice.repair_ticket?.ticket_number ?? "—"}</td>
                      <td>{invoice.branch?.branch_name ?? "—"}</td>
                      <td className="text-right font-mono font-medium">₱{Number(invoice.total_amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                      <td><span className="status-badge">{invoice.payment_status?.name ?? "—"}</span></td>
                      <td>{new Date(invoice.created_at).toLocaleDateString()}</td>
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