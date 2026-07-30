import { getCustomers } from "@/src/features/customers/queries";
import { createCustomerAction } from "@/src/features/customers/actions";
import { redirect } from "next/navigation";

export default async function CustomersPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; success?: string }>;
}) {
  const { error, success } = await searchParams;
  const customers = await getCustomers();

  if (customers === null) {
    redirect("/login");
  }

  return (
    <main className="dashboard-content">
      <header className="dashboard-header">
        <div className="dashboard-title">
          <h1>Customers</h1>
          <p>Manage your customer database</p>
        </div>
      </header>

      {error && (
        <div className="error-message" role="alert">
          {error}
        </div>
      )}

      {success && (
        <div className="success-message" role="status">
          Customer saved successfully.
        </div>
      )}

      <section className="dashboard-grid">
        <article className="dashboard-card customers-table-card">
          <header className="card-header">
            <span className="card-icon" aria-hidden="true">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM15.75 19.5a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM21 15.75a3.75 3.75 0 0 1-7.5 0H3a3.75 3.75 0 0 1 0-7.5h10.5a3.75 3.75 0 0 1 7.5 0Z" />
              </svg>
            </span>
            <h2>All Customers</h2>
          </header>

          <div className="table-wrapper">
            <table className="customers-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Phone</th>
                  <th>Email</th>
                  <th>Address</th>
                  <th>Created</th>
                </tr>
              </thead>
              <tbody>
                {customers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="empty-state">
                      No customers yet. Add your first customer using the form.
                    </td>
                  </tr>
                ) : (
                  customers.map((customer) => (
                    <tr key={customer.id}>
                      <td className="font-medium">{customer.customer_name}</td>
                      <td>{customer.phone ?? "—"}</td>
                      <td>{customer.email ?? "—"}</td>
                      <td>{customer.address ?? "—"}</td>
                      <td>{new Date(customer.created_at).toLocaleDateString()}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </article>

        <article className="dashboard-card invite-form-card">
          <header className="card-header">
            <span className="card-icon" aria-hidden="true">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
            </span>
            <h2>Add Customer</h2>
          </header>

          <form action={createCustomerAction} className="customer-form">
            <div className="form-group">
              <label className="form-label" htmlFor="customerName">Customer name *</label>
              <input
                id="customerName"
                name="customerName"
                required
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
              />
            </div>

            <button type="submit" className="btn btn-primary">
              Add Customer
            </button>
          </form>
        </article>
      </section>
    </main>
  );
}