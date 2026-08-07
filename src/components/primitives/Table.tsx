import { type ReactNode, type HTMLAttributes } from "react";

export interface TableColumn<T> {
  key: string;
  header: string;
  render?: (item: T, index: number) => ReactNode;
  className?: string;
  headerClassName?: string;
  sortable?: boolean;
}

export interface TableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  keyExtractor: (item: T) => string;
  emptyState?: ReactNode;
  striped?: boolean;
  hoverable?: boolean;
  className?: string;
}

export function Table<T>({
  columns,
  data,
  keyExtractor,
  emptyState,
  striped = true,
  hoverable = true,
  className = "",
}: TableProps<T>) {
  return (
    <div className="overflow-x-auto">
      <table className={`w-full border-collapse ${className}`}>
        <thead>
          <tr className="border-b border-border-bright">
            {columns.map((col) => (
              <th
                key={col.key}
                className={`
                  px-4 py-3 text-left text-xs font-semibold text-fg-tertiary uppercase tracking-wider
                  border-b border-border
                  ${col.headerClassName ?? ""}
                `}
                scope="col"
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-4 py-12 text-center text-fg-secondary">
                {emptyState ?? "No data available"}
              </td>
            </tr>
          ) : (
            data.map((item, rowIndex) => (
              <tr
                key={keyExtractor(item)}
                className={`
                  border-b border-border
                  ${striped && rowIndex % 2 === 1 ? "bg-bg-hover/50" : ""}
                  ${hoverable ? "transition-colors hover:bg-bg-hover" : ""}
                `}
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={`
                      px-4 py-3 text-sm text-fg
                      ${col.className ?? ""}
                    `}
                  >
                    {col.render ? col.render(item, rowIndex) : String(item[col.key as keyof T] ?? "—")}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export interface TableToolbarProps {
  children: ReactNode;
  className?: string;
}

export function TableToolbar({ children, className = "" }: TableToolbarProps) {
  return (
    <div className={`flex flex-wrap items-center justify-between gap-3 mb-4 ${className}`}>
      {children}
    </div>
  );
}