import { getCustomerById } from "@/src/features/customers/queries";
import { updateCustomerAction, deleteCustomerAction } from "@/src/features/customers/actions";
import { notFound } from "next/navigation";

export default async function CustomerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const customer = await getCustomerById(id);

  if (!customer) {
    notFound();
  }

  return (
    <main className="dashboard-content">
      <header className="dashboard-header">
        <div className="dashboard-title">
          <h1>{customer.customer_name}</h1>
          <p>Customer details</p>
        </div>
      </header>

      <section className="dashboard-grid">
        <article className="dashboard-card">
          <header className="card-header">
            <span className="card-icon" aria-hidden="true">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
              </svg>
            </span>
            <h2>Details</h2>
          </header>

          <dl className="card-fields">
            <div>
              <dt>Name</dt>
              <dd>{customer.customer_name}</dd>
            </div>
            <div>
              <dt>Phone</dt>
              <dd>{customer.phone ?? <span className="muted">—</span>}</dd>
            </div>
            <div>
              <dt>Email</dt>
              <dd>{customer.email ?? <span className="muted">—</span>}</dd>
            </div>
            <div>
              <dt>Address</dt>
              <dd>{customer.address ?? <span className="muted">—</span>}</dd>
            </div>
            <div>
              <dt>Notes</dt>
              <dd>{customer.notes ?? <span className="muted">—</span>}</dd>
            </div>
            <div>
              <dt>Created</dt>
              <dd>{new Date(customer.created_at).toLocaleDateString()}</dd>
            </div>
            <div>
              <dt>Updated</dt>
              <dd>{new Date(customer.updated_at).toLocaleDateString()}</dd>
            </div>
          </dl>
        </article>

        <article className="dashboard-card">
          <header className="card-header">
            <span className="card-icon" aria-hidden="true">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
              </svg>
            </span>
            <h2>Edit Customer</h2>
          </header>

          <form action={updateCustomerAction} className="customer-form">
            <input type="hidden" name="id" value={customer.id} />

            <div className="form-group">
              <label className="form-label" htmlFor="customerName">Customer name *</label>
              <input
                id="customerName"
                name="customerName"
                required
                defaultValue={customer.customer_name}
                autoComplete="name"
                className="form-input"
                placeholder="John Doe"
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="phone">Phone</label>
              <input
                id="phone"
                name="phone"
                type="tel"
                defaultValue={customer.phone ?? ""}
                autoComplete="tel"
                className="form-input"
                placeholder="+63 9XX XXX XXXX"
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                defaultValue={customer.email ?? ""}
                autoComplete="email"
                className="form-input"
                placeholder="john@example.com"
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="address">Address</label>
              <textarea
                id="address"
                name="address"
                rows={3}
                className="form-input form-textarea"
                placeholder="123 Main St, City, Province"
                defaultValue={customer.address ?? ""}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="notes">Notes</label>
              <textarea
                id="notes"
                name="notes"
                rows={2}
                className="form-input form-textarea"
                placeholder="Preferred contact time, special instructions..."
                defaultValue={customer.notes ?? ""}
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="btn btn-primary">
                Save Changes
              </button>
              <a href="/dashboard/customers" className="btn btn-secondary">
                Cancel
              </a>
            </div>
          </form>

          <div className="danger-zone">
            <h3 className="danger-title">Danger Zone</h3>
            <form action={deleteCustomerAction} onSubmit={(e) => {
              if (!confirm("Delete this customer? This action cannot be undone.")) {
                e.preventDefault();
              }
            }}>
              <input type="hidden" name="id" value={customer.id} />
              <button type="submit" className="btn btn-danger">
                Delete Customer
              </button>
            </form>
          </div>
        </article>
      </section>
    </main>
  );
}