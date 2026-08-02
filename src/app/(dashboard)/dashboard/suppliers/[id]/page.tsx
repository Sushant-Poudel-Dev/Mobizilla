import { getSupplierById } from "@/src/features/suppliers/queries";
import { updateSupplierAction, deleteSupplierAction } from "@/src/features/suppliers/actions";
import { notFound, redirect } from "next/navigation";

export default async function SupplierDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supplier = await getSupplierById(id);

  if (!supplier) {
    notFound();
  }

  const appUser = await getCurrentAppUser();
  const canEdit = appUser?.role === "owner" || appUser?.role === "admin";

  return (
    <main className="dashboard-content">
      <header className="dashboard-header">
        <div className="dashboard-title">
          <h1>{supplier.supplier_name}</h1>
          <p>Supplier details</p>
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
            <h2>Details</h2>
          </header>

          <dl className="card-fields">
            <div>
              <dt>Name</dt>
              <dd>{supplier.supplier_name}</dd>
            </div>
            <div>
              <dt>Contact Person</dt>
              <dd>{supplier.contact_person ?? <span className="muted">—</span>}</dd>
            </div>
            <div>
              <dt>Phone</dt>
              <dd>{supplier.phone_number ?? <span className="muted">—</span>}</dd>
            </div>
            <div>
              <dt>Email</dt>
              <dd>{supplier.email ?? <span className="muted">—</span>}</dd>
            </div>
            <div>
              <dt>Address</dt>
              <dd>{supplier.address ?? <span className="muted">—</span>}</dd>
            </div>
            <div>
              <dt>Notes</dt>
              <dd>{supplier.remarks ?? <span className="muted">—</span>}</dd>
            </div>
            <div>
              <dt>Created</dt>
              <dd>{new Date(supplier.created_at).toLocaleDateString()}</dd>
            </div>
            <div>
              <dt>Updated</dt>
              <dd>{new Date(supplier.updated_at).toLocaleDateString()}</dd>
            </div>
          </dl>
        </article>

        {canEdit && (
          <article className="dashboard-card">
            <header className="card-header">
              <span className="card-icon" aria-hidden="true">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                </svg>
              </span>
              <h2>Edit Supplier</h2>
            </header>

            <form action={updateSupplierAction} className="supplier-form">
              <input type="hidden" name="id" value={supplier.id} />

              <div className="form-group">
                <label className="form-label" htmlFor="supplierName">Supplier name *</label>
                <input
                  id="supplierName"
                  name="supplierName"
                  required
                  defaultValue={supplier.supplier_name}
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
                  defaultValue={supplier.contact_person ?? ""}
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
                    defaultValue={supplier.phone_number ?? ""}
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
                    defaultValue={supplier.email ?? ""}
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
                  defaultValue={supplier.address ?? ""}
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
                  defaultValue={supplier.remarks ?? ""}
                />
              </div>

              <div className="form-actions">
                <button type="submit" className="btn btn-primary">
                  Save Changes
                </button>
                <a href="/dashboard/suppliers" className="btn btn-secondary">
                  Cancel
                </a>
              </div>
            </form>

            <div className="danger-zone">
              <h3 className="danger-title">Danger Zone</h3>
              <form action={deleteSupplierAction} onSubmit={(e) => {
                if (!confirm("Delete this supplier? This action cannot be undone.")) {
                  e.preventDefault();
                }
              }}>
                <input type="hidden" name="id" value={supplier.id} />
                <button type="submit" className="btn btn-danger">
                  Delete Supplier
                </button>
              </form>
            </div>
          </article>
        )}

        {!canEdit && (
          <article className="dashboard-card">
            <header className="card-header">
              <span className="card-icon" aria-hidden="true">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
                </svg>
              </span>
              <h2>Permissions</h2>
            </header>
            <div className="card-fields">
              <div>
                <dt>Your Role</dt>
                <dd><span className={`role-badge role-${appUser?.role}`}>{appUser?.role}</span></dd>
              </div>
              <div>
                <dt>Edit Access</dt>
                <dd className="muted">Only owners and admins can edit suppliers</dd>
              </div>
            </div>
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