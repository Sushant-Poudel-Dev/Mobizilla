import { getStockByBranch } from "@/src/features/inventory/queries";
import { redirect } from "next/navigation";

export default async function StockPage({
  searchParams,
}: {
  searchParams: Promise<{ branchId?: string }>;
}) {
  const { branchId } = await searchParams;
  const stock = await getStockByBranch(branchId);

  if (stock === null) {
    redirect("/login");
  }

  return (
    <main className="dashboard-content">
      <header className="dashboard-header">
        <div className="dashboard-title">
          <h1>Stock Levels</h1>
          <p>Read-only view of inventory stock by branch</p>
        </div>
      </header>

      <section className="dashboard-grid" style={{ gridTemplateColumns: "1fr" }}>
        <article className="dashboard-card">
          <header className="card-header">
            <span className="card-icon" aria-hidden="true">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m-16.5 0a2.25 2.25 0 0 1 2.25-2.25H19.5A2.25 2.25 0 0 1 21.75 5.25V12m-18 0v4.5m0 0H6.75m13.5-4.5H18a2.25 2.25 0 0 0-2.25 2.25v3.375m-1.5 3.75h.008v.008H12v-.008h-.008V16.5h-.008v-.008H8.25v.008H8.242v.008H5.25" />
              </svg>
            </span>
            <h2>Stock by Branch</h2>
          </header>

          {stock.length === 0 ? (
            <p className="muted">No stock records found.</p>
          ) : (
            <div className="table-wrapper">
              <table className="stock-table">
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Part Code</th>
                    <th>Category</th>
                    <th>Brand</th>
                    <th>Condition</th>
                    <th>Status</th>
                    <th>Branch</th>
                    <th>Current Qty</th>
                    <th>Reserved</th>
                    <th>Available</th>
                    <th>Min / Max</th>
                    <th>Location</th>
                  </tr>
                </thead>
                <tbody>
                  {stock.map((record) => {
                    const available = record.current_quantity - record.reserved_quantity;
                    return (
                      <tr key={record.id}>
                        <td className="font-medium">{record.inventory_item?.part_name ?? "—"}</td>
                        <td>{record.inventory_item?.part_code ?? "—"}</td>
                        <td>{record.inventory_item?.category?.name ?? "—"}</td>
                        <td>{record.inventory_item?.brand?.name ?? "—"}</td>
                        <td>{record.condition?.name ?? "—"}</td>
                        <td>{record.status?.name ?? "—"}</td>
                        <td>{record.branch?.branch_name ?? "—"}</td>
                        <td className="text-right font-mono">{record.current_quantity}</td>
                        <td className="text-right font-mono">{record.reserved_quantity}</td>
                        <td className="text-right font-mono font-medium" style={{ color: available < 0 ? "#d93025" : "inherit" }}>
                          {available}
                        </td>
                        <td className="text-right font-mono">
                          {record.min_stock_level} / {record.max_stock_level ?? "—"}
                        </td>
                        <td>{record.location_note ?? "—"}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </article>
      </section>
    </main>
  );
}