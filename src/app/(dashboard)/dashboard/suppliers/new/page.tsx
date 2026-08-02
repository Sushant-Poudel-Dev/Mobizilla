import { createSupplierAction } from "@/src/features/suppliers/actions";
import { redirect } from "next/navigation";

export default async function NewSupplierPage() {
  const appUser = await getCurrentAppUser();
  const canEdit = appUser?.role === "owner" || appUser?.role === "admin";

  if (!canEdit) {
    redirect("/dashboard/suppliers");
  }

  return (
    <main className="dashboard-content">
      <header className="dashboard-header">
        <div className="dashboard-title">
          <h1>New Supplier</h1>
          <p>Add a new supplier to your database</p>
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
            <h2>Supplier Details</h2>
          </header>

          <form action={createSupplierAction} className="supplier-form">
            <div className="form-group">
              <label className="form-label" htmlFor="supplierName">Supplier name *</label>
              <input
                id="supplierName"
                name="supplierName"
                required
                autoComplete="name"
                className="form-input"
                placeholder="ABC Parts Co."
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="contactPerson">Contact person</label>
              <input
                id="contactPerson"
                name="contactPerson"
                autoComplete="name"
                className="form-input"
                placeholder="John Smith"
              />
            </div>

            <div className="form-row">
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
                  placeholder="contact@abcpco.com"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="address">Address</label>
              <textarea
                id="address"
                name="address"
                rows={3}
                className="form-input form-textarea"
                placeholder="123 Industrial Ave, City, Province"
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="remarks">Notes</label>
              <textarea
                id="remarks"
                name="remarks"
                rows={2}
                className="form-input form-textarea"
                placeholder="Payment terms, preferred contact time..."
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="btn btn-primary">
                Create Supplier
              </button>
              <a href="/dashboard/suppliers" className="btn btn-secondary">
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