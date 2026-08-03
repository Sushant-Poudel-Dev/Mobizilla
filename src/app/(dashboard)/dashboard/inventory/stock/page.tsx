import { getStockByBranch } from "@/src/features/inventory/queries";
import { getCurrentAppUser } from "@/src/lib/data/currentUser";
import { redirect } from "next/navigation";
import { Card, CardHeader, CardTitle, CardDescription, Table, Badge } from "@/src/components/ui";
import { formatNumber } from "@/src/lib/format";

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

  const columns = [
    {
      key: "item",
      header: "Item",
      render: (record: typeof stock[0]) => <span className="font-medium">{record.inventory_item?.part_name ?? "—"}</span>,
    },
    {
      key: "part_code",
      header: "Part Code",
      render: (record: typeof stock[0]) => record.inventory_item?.part_code ?? "—",
    },
    {
      key: "category",
      header: "Category",
      render: (record: typeof stock[0]) => record.inventory_item?.category?.name ?? "—",
    },
    {
      key: "brand",
      header: "Brand",
      render: (record: typeof stock[0]) => record.inventory_item?.brand?.name ?? "—",
    },
    {
      key: "condition",
      header: "Condition",
      render: (record: typeof stock[0]) => record.condition?.name ?? "—",
    },
    {
      key: "status",
      header: "Status",
      render: (record: typeof stock[0]) => <Badge variant="default" size="sm">{record.status?.name ?? "—"}</Badge>,
    },
    {
      key: "branch",
      header: "Branch",
      render: (record: typeof stock[0]) => record.branch?.branch_name ?? "—",
    },
    {
      key: "current_quantity",
      header: "Current Qty",
      className: "text-right font-mono",
      render: (record: typeof stock[0]) => formatNumber(record.current_quantity),
    },
    {
      key: "reserved_quantity",
      header: "Reserved",
      className: "text-right font-mono",
      render: (record: typeof stock[0]) => formatNumber(record.reserved_quantity),
    },
    {
      key: "available",
      header: "Available",
      className: "text-right font-mono font-medium",
      render: (record: typeof stock[0]) => {
        const available = record.current_quantity - record.reserved_quantity;
        return (
          <span className={available < 0 ? "text-error" : "inherit"}>
            {formatNumber(available)}
          </span>
        );
      },
    },
    {
      key: "min_max",
      header: "Min / Max",
      className: "text-right font-mono",
      render: (record: typeof stock[0]) => (
        <>
          {formatNumber(record.min_stock_level)} / {record.max_stock_level ? formatNumber(record.max_stock_level) : "—"}
        </>
      ),
    },
    {
      key: "location",
      header: "Location",
      render: (record: typeof stock[0]) => record.location_note ?? "—",
    },
  ];

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-fg">Stock Levels</h1>
        <p className="text-fg-secondary mt-1">Read-only view of inventory stock by branch</p>
      </div>

      {/* Stock Table */}
      <Card padding="none">
        <CardHeader className="pb-4">
          <CardTitle>Stock by Branch</CardTitle>
          <CardDescription>Current quantities, reservations, and availability</CardDescription>
        </CardHeader>
        <Table
          columns={columns}
          data={stock}
          keyExtractor={(record) => record.id}
          emptyState={
            <div className="text-center py-12">
              <svg className="w-12 h-12 mx-auto text-fg-tertiary/50 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m-16.5 0a2.25 2.25 0 012.25-2.25H19.5A2.25 2.25 0 0121.75 5.25V12m-18 0v4.5m0 0H6.75m13.5-4.5H18a2.25 2.25 0 00-2.25 2.25v3.375m-1.5 3.75h.008v.008H12v-.008h-.008V16.5h-.008v-.008H8.25v.008H8.242v.008H5.25" />
              </svg>
              <p className="text-fg-secondary">No stock records found.</p>
            </div>
          }
        />
      </Card>
    </main>
  );
}