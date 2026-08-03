import { getSuppliers } from "@/src/features/suppliers/queries";
import { createSupplierAction } from "@/src/features/suppliers/actions";
import { redirect } from "next/navigation";

export default async function SuppliersPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; success?: string }>;
}) {
  const { error, success } = await searchParams;
  const suppliers = await getSuppliers();

  if (suppliers === null) {
    redirect("/login");
  }

  const appUser = await getCurrentAppUser();
  const canEdit = appUser?.role === "owner" || appUser?.role === "admin";

  return (
    <main className="dashboard-content">
      <header className="dashboard-header">
        <div className="dashboard-title">
          <h1>Suppliers</h1>
          <p>Manage your supplier database</p>
        </div>
      </header>

      {error && (
        <div className="error-message" role="alert">
          {error}
        </div>
      )}

      {success && (
        <div className="success-message" role="status">
          Supplier saved successfully.
        </div>
      )}

      <section className="dashboard-grid">
        <article className="dashboard-card suppliers-table-card">
          <header className="card-header">
            <span className="card-icon" aria-hidden="true">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m-16.5 0a2.25 2.25 0 0 1 2.25-2.25H19.5A2.25 2.25 0 0 1 21.75 5.25V12m-18 0v4.5m0 0H6.75m13.5-4.5H18a2.25 2.25 0 0 0-2.25 2.25v3.375m-1.5 3.75h.008v.008H12v-.008h-.008V16.5h-.008v-.008H8.25v.008H8.242v.008H5.25" />
              </svg>
            </span>
            <h2>All Suppliers</h2>
          </header>

          <div className="table-wrapper">
            <table className="suppliers-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Contact Person</th>
                  <th>Phone</th>
                  <th>Email</th>
                  <th>Address</th>
                  <th>Created</th>
                </tr>
              </thead>
              <tbody>
                {suppliers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="empty-state">
                      No suppliers yet. Add your first supplier using the form.
                    </td>
                  </tr>
                ) : (
                  suppliers.map((supplier) => (
                    <tr key={supplier.id}>
                      <td className="font-medium">{supplier.supplier_name}</td>
                      <td>{supplier.contact_person ?? "—"}</td>
                      <td>{supplier.phone_number ?? "—"}</td>
                      <td>{supplier.email ?? "—"}</td>
                      <td>{supplier.address ?? "—"}</td>
                      <td>{new Date(supplier.created_at).toLocaleDateString()}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </article>

        {canEdit && (
          <article className="dashboard-card invite-form-card">
            <header className="card-header">
              <span className="card-icon" aria-hidden="true">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
              </span>
              <h2>Add Supplier</h2>
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

              <button type="submit" className="btn btn-primary">
                Add Supplier
              </button>
            </form>
          </article>
        )}
      </section>
    </main>
  );
}

async function getCurrentAppUser() {
  const { getCurrentAppUser } = await import("@/src/lib/data/currentUser");
  return getCurrentAppUser();
}