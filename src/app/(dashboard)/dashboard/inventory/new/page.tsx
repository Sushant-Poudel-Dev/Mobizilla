import { getCategories, getBrands, getConditions } from "@/src/features/inventory/queries";
import { createInventoryItemAction } from "@/src/features/inventory/actions";
import { redirect } from "next/navigation";

export default async function NewInventoryItemPage() {
  const [categories, brands, conditions] = await Promise.all([
    getCategories(),
    getBrands(),
    getConditions(),
  ]);

  const appUser = await getCurrentAppUser();
  const canEdit = appUser?.role === "owner" || appUser?.role === "admin";

  if (!canEdit) {
    redirect("/dashboard/inventory");
  }

  return (
    <main className="dashboard-content">
      <header className="dashboard-header">
        <div className="dashboard-title">
          <h1>New Inventory Item</h1>
          <p>Add a new part to your catalog</p>
        </div>
      </header>

      <section className="dashboard-grid" style={{ gridTemplateColumns: "1fr", maxWidth: "720px" }}>
        <article className="dashboard-card">
          <header className="card-header">
            <span className="card-icon" aria-hidden="true">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
            </span>
            <h2>Item Details</h2>
          </header>

          <form action={createInventoryItemAction} className="inventory-form">
            <div className="form-group">
              <label className="form-label" htmlFor="partName">Part name *</label>
              <input
                id="partName"
                name="partName"
                required
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
                  className="form-input"
                  placeholder="0.00"
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="conditionId">Condition</label>
                <select
                  id="conditionId"
                  name="conditionId"
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
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="btn btn-primary">
                Create Item
              </button>
              <a href="/dashboard/inventory" className="btn btn-secondary">
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