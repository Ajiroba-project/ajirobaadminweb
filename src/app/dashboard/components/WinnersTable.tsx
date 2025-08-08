import React from 'react';

// Define a generic RowData type to represent the data structure
interface RowData {
  id?: string | number;
  [key: string]: any;
}

// Define Column interface with stricter types
interface Column<T extends RowData> {
  key: string;
  label: string;
  render?: (row: T, index: number) => React.ReactNode;
  cellClassName?: string;
  headerClassName?: string;
}

// Define ScrollableTableProps with generics
interface ScrollableTableProps<T extends RowData> {
  columns: Column<T>[];
  data: T[];
  onRowAction?: (row: T, index: number) => void;
  emptyRowCount?: number;
  className?: string;
  tableClassName?: string;
  headerClassName?: string;
  rowClassName?: string;
  cellClassName?: string;
}

export const WinnersTable = <T extends RowData>({
  columns,
  data,
  onRowAction,
  emptyRowCount = 0,
  className = '',
  tableClassName = '',
  headerClassName = '',
  rowClassName = '',
  cellClassName = '',
}: ScrollableTableProps<T>) => {
  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className={`w-full min-w-[800px] border-collapse font-Poppins text-xs ${tableClassName}`}>
        <thead>
          <tr className={`bg-[#fff] border-b border-[#E9E9E9] ${headerClassName}`}>
            {columns.map((col) => (
              <th
                key={col.key}
                className={`px-3 py-3 text-left font-semibold whitespace-nowrap border-r border-[#E9E9E9] last:border-r-0 sticky top-0 bg-white z-10 ${col.headerClassName || ''}`}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data?.map((row, idx) => (
            <tr
              key={`${row.id}-${idx}`}
              className={`border-b border-[#E9E9E9] hover:bg-[#F6F6F6] ${rowClassName}`}
              onClick={onRowAction ? () => onRowAction(row, idx) : undefined}
            >
              {columns.map((col, colIdx) => {
                const isLastColumn = colIdx === columns.length - 1;
                return (
                  <td
                    key={col.key}
                    className={`px-3 py-2 ${!isLastColumn ? 'border-r border-[#E9E9E9]' : ''} ${cellClassName} ${col.cellClassName || ''}`}
                  >
                    <div className="max-w-[200px] truncate" title={col.render ? undefined : (row[col.key] ?? 'N/A')}>
                      {col.render ? col.render(row, idx) : row[col.key] ?? 'N/A'}
                    </div>
                  </td>
                );
              })}
            </tr>
          ))}

          {/* Empty rows for consistent height */}
          {emptyRowCount > 0 &&
            Array.from({ length: Math.max(0, emptyRowCount - data.length) }).map((_, i) => (
              <tr key={`empty-${i}`} className="h-10 border-b border-[#E9E9E9]">
                {columns.map((col, j) => (
                  <td
                    key={`${col.key}-${j}`}
                    className={`px-3 py-2 ${j !== columns.length - 1 ? 'border-r border-[#E9E9E9]' : ''} whitespace-nowrap`}
                  >
                    &nbsp;
                  </td>
                ))}
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export const RedeemedTable = <T extends RowData>({
  columns,
  data,
  onRowAction,
  emptyRowCount = 0,
  className = '',
  tableClassName = '',
  headerClassName = '',
  rowClassName = '',
  cellClassName = '',
}: ScrollableTableProps<T>) => {
  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className={`w-full min-w-[800px] border-collapse font-Poppins text-xs ${tableClassName}`}>
        <thead>
          <tr className={`bg-[#fff] border-b border-[#E9E9E9] ${headerClassName}`}>
            {columns.map((col) => (
              <th
                key={col.key}
                className={`px-3 py-3 text-left font-semibold whitespace-nowrap border-r border-[#E9E9E9] last:border-r-0 sticky top-0 bg-white z-10 ${col.headerClassName || ''}`}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data?.map((row, idx) => (
            <tr
              key={`${row.id}-${idx}`}
              className={`border-b border-[#E9E9E9] hover:bg-[#F6F6F6] ${rowClassName}`}
              onClick={onRowAction ? () => onRowAction(row, idx) : undefined}
            >
              {columns.map((col, colIdx) => {
                const isLastColumn = colIdx === columns.length - 1;
                return (
                  <td
                    key={col.key}
                    className={`px-3 py-2 ${!isLastColumn ? 'border-r border-[#E9E9E9]' : ''} ${cellClassName} ${col.cellClassName || ''}`}
                  >
                    <div className="max-w-[200px] truncate" title={col.render ? undefined : (row[col.key] ?? 'N/A')}>
                      {col.render ? col.render(row, idx) : row[col.key] ?? 'N/A'}
                    </div>
                  </td>
                );
              })}
            </tr>
          ))}

          {/* Empty rows for consistent height */}
          {emptyRowCount > 0 &&
            Array.from({ length: Math.max(0, emptyRowCount - data.length) }).map((_, i) => (
              <tr key={`empty-${i}`} className="h-10 border-b border-[#E9E9E9]">
                {columns.map((col, j) => (
                  <td
                    key={`${col.key}-${j}`}
                    className={`px-3 py-2 ${j !== columns.length - 1 ? 'border-r border-[#E9E9E9]' : ''} whitespace-nowrap`}
                  >
                    &nbsp;
                  </td>
                ))}
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};