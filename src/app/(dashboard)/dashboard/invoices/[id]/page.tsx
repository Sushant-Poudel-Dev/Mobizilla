import { getInvoiceById } from "@/src/features/invoices/queries";
import { getPaymentMethods } from "@/src/features/payments/queries";
import { recordPaymentAction } from "@/src/features/payments/actions";
import { notFound } from "next/navigation";

export default async function InvoiceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const invoice = await getInvoiceById(id);

  if (!invoice) {
    notFound();
  }

  const [appUser, paymentMethods] = await Promise.all([
    getCurrentAppUser(),
    getPaymentMethods(),
  ]);
  const canCreatePayment = appUser?.role === "owner" || appUser?.role === "admin" || appUser?.role === "front_desk";

  const partsTotal = invoice.line_items
    ?.filter((li) => li.repair_part_id)
    .reduce((sum, li) => sum + Number(li.total_price), 0) ?? 0;

  const servicesTotal = invoice.line_items
    ?.filter((li) => li.repair_service_id)
    .reduce((sum, li) => sum + Number(li.total_price), 0) ?? 0;

  const paymentsTotal = invoice.payments?.reduce((sum, p) => sum + Number(p.amount_paid), 0) ?? 0;
  const balanceDue = Number(invoice.total_amount) - paymentsTotal;

  return (
    <main className="dashboard-content">
      <header className="dashboard-header">
        <div className="dashboard-title">
          <h1>{invoice.invoice_number}</h1>
          <p>{invoice.customer?.full_name ?? "Unknown customer"}</p>
        </div>
      </header>

      <section className="dashboard-grid">
        <article className="dashboard-card">
          <header className="card-header">
            <span className="card-icon" aria-hidden="true">
              <svg xmlns="http://www.w3.org/2000.svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m-16.5 0a2.25 2.25 0 0 1 2.25-2.25H19.5A2.25 2.25 0 0 1 21.75 5.25V12m-18 0v4.5m0 0H6.75m13.5-4.5H18a2.25 2.25 0 0 0-2.25 2.25v3.375m-1.5 3.75h.008v.008H12v-.008h-.008V16.5h-.008v-.008H8.25v.008H8.242v.008H5.25" />
              </svg>
            </span>
            <h2>Invoice Details</h2>
          </header>

          <dl className="card-fields">
            <div>
              <dt>Invoice #</dt>
              <dd>{invoice.invoice_number}</dd>
            </div>
            <div>
              <dt>Date</dt>
              <dd>{new Date(invoice.invoice_date).toLocaleDateString()}</dd>
            </div>
            <div>
              <dt>Customer</dt>
              <dd>{invoice.customer?.full_name ?? "—"}</dd>
            </div>
            <div>
              <dt>Phone</dt>
              <dd>{invoice.customer?.phone_number ?? "—"}</dd>
            </div>
            <div>
              <dt>Ticket</dt>
              <dd>
                {invoice.repair_ticket?.ticket_number ? (
                  <a href={`/dashboard/repairs/${invoice.repair_ticket.id}`}>{invoice.repair_ticket.ticket_number}</a>
                ) : (
                  "—"
                )}
              </dd>
            </div>
            <div>
              <dt>Branch</dt>
              <dd>{invoice.branch?.branch_name ?? "—"}</dd>
            </div>
            <div>
              <dt>Payment Status</dt>
              <dd><span className="status-badge">{invoice.payment_status?.name ?? "—"}</span></dd>
            </div>
            <div>
              <dt>Created</dt>
              <dd>{new Date(invoice.created_at).toLocaleDateString()}</dd>
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
            <h2>Line Items</h2>
          </header>

          {invoice.line_items && invoice.line_items.length > 0 ? (
            <div className="table-wrapper">
              <table className="invoice-line-items-table">
                <thead>
                  <tr>
                    <th>Description</th>
                    <th>Type</th>
                    <th>Qty</th>
                    <th>Unit Price</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.line_items.map((item) => (
                    <tr key={item.id}>
                      <td>{item.description}</td>
                      <td>
                        {item.repair_part_id ? "Part" : item.repair_service_id ? "Service" : "—"}
                      </td>
                      <td className="text-right font-mono">{item.quantity}</td>
                      <td className="text-right font-mono">₱{Number(item.unit_price).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                      <td className="text-right font-mono font-medium">₱{Number(item.total_price).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="muted">No line items found.</p>
          )}
        </article>

        <article className="dashboard-card">
          <header className="card-header">
            <span className="card-icon" aria-hidden="true">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12M15 6v12m-6 0h6m-3 3h6" />
              </svg>
            </span>
            <h2>Totals</h2>
          </header>

          <div className="card-fields">
            <div>
              <dt>Subtotal</dt>
              <dd>₱{Number(invoice.total_amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}</dd>
            </div>
            <div>
              <dt>Tax</dt>
              <dd>₱{Number(invoice.tax_amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}</dd>
            </div>
            <div>
              <dt>Discount</dt>
              <dd>₱{Number(invoice.discount_amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}</dd>
            </div>
            <div className="grand-total">
              <dt>Total</dt>
              <dd>₱{Number(invoice.total_amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}</dd>
            </div>
            <div className="grand-total" style={{ color: balanceDue >= 0 ? "#d93025" : "#188038" }}>
              <dt>Balance Due</dt>
              <dd>
                ₱{Math.max(0, balanceDue).toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </dd>
            </div>
          </div>
        </article>

        <article className="dashboard-card">
          <header className="card-header">
            <span className="card-icon" aria-hidden="true">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12M15 6v12m-6 0h6m-3 3h6" />
              </svg>
            </span>
            <h2>Payment History</h2>
          </header>

          {invoice.payments && invoice.payments.length > 0 ? (
            <div className="table-wrapper">
              <table className="payments-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Method</th>
                    <th>Amount</th>
                    <th>Received By</th>
                    <th>Remarks</th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.payments.map((payment) => (
                    <tr key={payment.id}>
                      <td>{new Date(payment.payment_date).toLocaleDateString()}</td>
                      <td>{payment.payment_method?.name ?? "—"}</td>
                      <td className="text-right font-mono font-medium">₱{Number(payment.amount_paid).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                      <td>{payment.received_by?.full_name ?? "—"}</td>
                      <td>{payment.remarks ?? "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="muted">No payments recorded yet.</p>
          )}

          {canCreatePayment && balanceDue > 0 && (
            <form action={recordPaymentAction} className="payment-form" style={{ marginTop: "1.5rem", paddingTop: "1rem", borderTop: "1px solid var(--color-border)" }}>
              <input type="hidden" name="invoiceId" value={invoice.id} />
              <h3 className="repair-form-title">Record Payment</h3>
              <div className="form-row">
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label" htmlFor="amountPaid">Amount *</label>
                  <input
                    id="amountPaid"
                    name="amountPaid"
                    type="number"
                    step="0.01"
                    min="0.01"
                    max={balanceDue}
                    required
                    className="form-input"
                    placeholder={balanceDue.toFixed(2)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="paymentMethodId">Method *</label>
                  <select
                    id="paymentMethodId"
                    name="paymentMethodId"
                    required
                    className="form-input form-select"
                  >
                    <option value="">Select method</option>
                    {paymentMethods.map((m) => (
                      <option key={m.id} value={m.id}>{m.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label" htmlFor="paymentDate">Date *</label>
                  <input
                    id="paymentDate"
                    name="paymentDate"
                    type="date"
                    required
                    defaultValue={new Date().toISOString().split("T")[0]}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="remarks">Remarks</label>
                  <input
                    id="remarks"
                    name="remarks"
                    className="form-input"
                    placeholder="Optional notes"
                  />
                </div>
              </div>

              <button type="submit" className="btn btn-primary btn-sm">
                Record Payment
              </button>
            </form>
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