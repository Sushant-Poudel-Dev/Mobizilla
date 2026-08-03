import { getInventoryItemById, getCategories, getBrands, getConditions, getDeviceModels, getCompatibilityByItem } from "@/src/features/inventory/queries";
import { updateInventoryItemAction, linkCompatibilityAction, unlinkCompatibilityAction } from "@/src/features/inventory/actions";
import { notFound, redirect } from "next/navigation";

export default async function InventoryItemDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [item, categories, brands, conditions, deviceModels, compatibility] = await Promise.all([
    getInventoryItemById(id),
    getCategories(),
    getBrands(),
    getConditions(),
    getDeviceModels(),
    getCompatibilityByItem(id),
  ]);

  if (!item) {
    notFound();
  }

  const appUser = await getCurrentAppUser();
  const canEdit = appUser?.role === "owner" || appUser?.role === "admin";

  const linkedModelIds = new Set(compatibility.map((c) => c.device_model_id));
  const availableModels = deviceModels.filter((m) => !linkedModelIds.has(m.id));

  return (
    <main className="dashboard-content">
      <header className="dashboard-header">
        <div className="dashboard-title">
          <h1>{item.part_name}</h1>
          <p>{item.part_code ?? "No part code"}</p>
        </div>
      </header>

      <section className="dashboard-grid">
        <article className="dashboard-card">
          <header className="card-header">
            <span className="card-icon" aria-hidden="true">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
              </svg>
            </span>
            <h2>Details</h2>
          </header>

          <dl className="card-fields">
            <div>
              <dt>Part Name</dt>
              <dd>{item.part_name}</dd>
            </div>
            <div>
              <dt>Part Code</dt>
              <dd>{item.part_code ?? <span className="muted">—</span>}</dd>
            </div>
            <div>
              <dt>Barcode</dt>
              <dd>{item.barcode ?? <span className="muted">—</span>}</dd>
            </div>
            <div>
              <dt>Category</dt>
              <dd>{item.category?.name ?? <span className="muted">—</span>}</dd>
            </div>
            <div>
              <dt>Brand</dt>
              <dd>{item.brand?.name ?? <span className="muted">—</span>}</dd>
            </div>
            <div>
              <dt>Selling Price</dt>
              <dd>₱{Number(item.selling_price).toLocaleString(undefined, { minimumFractionDigits: 2 })}</dd>
            </div>
            <div>
              <dt>Description</dt>
              <dd>{item.description ?? <span className="muted">—</span>}</dd>
            </div>
            <div>
              <dt>Image URL</dt>
              <dd>{item.image_url ?? <span className="muted">—</span>}</dd>
            </div>
            <div>
              <dt>Created</dt>
              <dd>{new Date(item.created_at).toLocaleDateString()}</dd>
            </div>
            <div>
              <dt>Updated</dt>
              <dd>{new Date(item.updated_at).toLocaleDateString()}</dd>
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
              <h2>Edit Item</h2>
            </header>

            <form action={updateInventoryItemAction} className="inventory-form">
              <input type="hidden" name="id" value={item.id} />

              <div className="form-group">
                <label className="form-label" htmlFor="partName">Part name *</label>
                <input
                  id="partName"
                  name="partName"
                  required
                  defaultValue={item.part_name}
                  autoComplete="off"
                  className="form-input"
                  placeholder="iPhone 13 Screen Assembly"
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="partCode">Part code</label>
                <input
                  id="partCode"
                  name="partCode"
                  defaultValue={item.part_code ?? ""}
                  autoComplete="off"
                  className="form-input"
                  placeholder="IP13-SCR-001"
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="barcode">Barcode</label>
                <input
                  id="barcode"
                  name="barcode"
                  defaultValue={item.barcode ?? ""}
                  autoComplete="off"
                  className="form-input"
                  placeholder="Scan or enter barcode"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label" htmlFor="categoryId">Category *</label>
                  <select
                    id="categoryId"
                    name="categoryId"
                    required
                    defaultValue={item.category_id}
                    className="form-input form-select"
                  >
                    <option value="">Select category</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="brandId">Brand</label>
                  <select
                    id="brandId"
                    name="brandId"
                    defaultValue={item.brand_id ?? ""}
                    className="form-input form-select"
                  >
                    <option value="">Select brand (optional)</option>
                    {brands.map((brand) => (
                      <option key={brand.id} value={brand.id}>
                        {brand.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label" htmlFor="sellingPrice">Selling price *</label>
                  <input
                    id="sellingPrice"
                    name="sellingPrice"
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    defaultValue={item.selling_price}
                    className="form-input"
                    placeholder="0.00"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="conditionId">Condition</label>
                  <select
                    id="conditionId"
                    name="conditionId"
                    defaultValue=""
                    className="form-input form-select"
                  >
                    <option value="">Select condition (optional)</option>
                    {conditions.map((cond) => (
                      <option key={cond.id} value={cond.id}>
                        {cond.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="description">Description</label>
                <textarea
                  id="description"
                  name="description"
                  rows={3}
                  className="form-input form-textarea"
                  placeholder="Additional details..."
                  defaultValue={item.description ?? ""}
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="imageUrl">Image URL</label>
                <input
                  id="imageUrl"
                  name="imageUrl"
                  type="url"
                  className="form-input"
                  placeholder="https://example.com/image.jpg"
                  defaultValue={item.image_url ?? ""}
                />
              </div>

              <div className="form-actions">
                <button type="submit" className="btn btn-primary">
                  Save Changes
                </button>
                <a href="/dashboard/inventory" className="btn btn-secondary">
                  Cancel
                </a>
              </div>
            </form>
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
                <dd className="muted">Only owners and admins can edit inventory items</dd>
              </div>
            </div>
          </article>
        )}

        {/* Compatibility Section */}
        <article className="dashboard-card">
          <header className="card-header">
            <span className="card-icon" aria-hidden="true">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6.75a4.5 4.5 0 0 0-9 0v3.75a3.75 3.75 0 1 0 9 0v-3.75Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5h15a2.25 2.25 0 0 0 2.25-2.25V7.5a2.25 2.25 0 0 0-2.25-2.25H4.5A2.25 2.25 0 0 0 2.25 7.5v9.75a2.25 2.25 0 0 0 2.25 2.25Z" />
              </svg>
            </span>
            <h2>Compatible Device Models</h2>
          </header>

          {compatibility.length > 0 && (
            <div className="compatibility-list">
              {compatibility.map((comp) => (
                <div key={comp.id} className="compatibility-item">
                  <div className="compatibility-info">
                    <span className="compatibility-name">{comp.device_model?.name ?? "Unknown Model"}</span>
                    <span className="compatibility-brand">{comp.device_model?.brand?.name ?? ""}</span>
                  </div>
                  {canEdit && (
                    <form action={unlinkCompatibilityAction}>
                      <input type="hidden" name="inventoryItemId" value={item.id} />
                      <input type="hidden" name="deviceModelId" value={comp.device_model_id} />
                      <button type="submit" className="btn btn-ghost btn-sm" onClick={(e) => {
                        if (!confirm("Remove this compatibility?")) e.preventDefault();
                      }}>
                        Remove
                      </button>
                    </form>
                  )}
                </div>
              ))}
            </div>
          )}

          {compatibility.length === 0 && (
            <p className="muted">No compatible device models linked yet.</p>
          )}

          {canEdit && availableModels.length > 0 && (
            <div className="compatibility-add">
              <h3 className="compatibility-add-title">Add Compatible Model</h3>
              <form action={linkCompatibilityAction} className="compatibility-form">
                <input type="hidden" name="inventoryItemId" value={item.id} />
                <div className="form-group">
                  <label className="form-label" htmlFor="deviceModelId">Device Model</label>
                  <select
                    id="deviceModelId"
                    name="deviceModelId"
                    required
                    className="form-input form-select"
                  >
                    <option value="">Select device model</option>
                    {availableModels.map((model) => (
                      <option key={model.id} value={model.id}>
                        {model.name} {model.brand && `(${model.brand.name})`}
                      </option>
                    ))}
                  </select>
                </div>
                <button type="submit" className="btn btn-primary btn-sm">
                  Link Model
                </button>
              </form>
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