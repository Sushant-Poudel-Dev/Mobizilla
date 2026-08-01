import { createCustomerAction } from "@/src/features/customers/actions";
import { redirect } from "next/navigation";

export default function NewCustomerPage() {
  return (
    <main className="dashboard-content">
      <header className="dashboard-header">
        <div className="dashboard-title">
          <h1>New Customer</h1>
          <p>Add a new customer to your database</p>
        </div>
      </header>

      <section className="dashboard-grid" style={{ gridTemplateColumns: "1fr", maxWidth: "640px" }}>
        <article className="dashboard-card">
          <header className="card-header">
            <span className="card-icon" aria-hidden="true">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
            </span>
            <h2>Customer Details</h2>
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

            <div className="form-actions">
              <button type="submit" className="btn btn-primary">
                Create Customer
              </button>
              <a href="/dashboard/customers" className="btn btn-secondary">
                Cancel
              </a>
            </div>
          </form>
        </article>
      </section>
    </main>
  );
}