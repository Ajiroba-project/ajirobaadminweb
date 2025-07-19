
import React, { useState } from 'react';

// Define a generic RowData type to represent the data structure
interface RowData {
  id?: string | number; 
  [key: string]: any; 


}

// Define Column interface with stricter types
interface Column<T extends RowData> {
  key: string; // Required for unique identification
  label: string; // Required for header display
  render?: (row: T, index: number) => React.ReactNode; // Optional render function
  cellClassName?: string;
  headerClassName?: string;
  sum?: boolean; // <-- Add this
}

// Define ScrollableTableProps with generics
interface ScrollableTableProps<T extends RowData> {
  columns: Column<T>[]; // Only Column objects, no strings
  data: T[];
  onRowAction?: (row: T, index: number) => void;
  emptyRowCount?: number;
  className?: string;
  tableClassName?: string;
  headerClassName?: string;
  rowClassName?: string;
  cellClassName?: string;
}





// Use generics in the component
export const ReportsTable = <T extends RowData>({
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
  
      const [modalOpen, setModalOpen] = useState(false);
      const [selectedRow, setSelectedRow] = useState<T | null>(null);
  
      const handleModalOk = () => {
          if (selectedRow) {
            console.log('Confirmed redemption for:', selectedRow);
            // Add your redemption logic here (e.g., API call)
          }
          setModalOpen(false);
          setSelectedRow(null);
        };
  
    const getColumnSum = (key: string) => {
      return data.reduce((acc, row) => {
        const value = Number(row[key]);
        return !isNaN(value) ? acc + value : acc;
      }, 0);
    };
  
    return (
      <div className={`overflow-x-auto ${className}`}>
        <table className={`min-w-full border-collapse font-Poppins text-sm ${tableClassName}`}>
          <thead>
            <tr className={`bg-[#fff] border-b border-[#E9E9E9] ${headerClassName}`}>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`px-3 py-3 text-left font-semibold whitespace-nowrap border-r border-[#E9E9E9] last:border-r-0 ${col.headerClassName || ''} text-sm`}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, idx) => (
              <tr
                key={row.id ?? idx} // Fallback to index if id is undefined
                className={`border-b border-[#E9E9E9] hover:bg-[#F6F6F6] ${rowClassName}`}
                onClick={onRowAction ? () => onRowAction(row, idx) : undefined}
              >
                {columns.map((col, colIdx) => {
                  const isLastColumn = colIdx === columns.length - 1;
                  return (
                    <td
                      key={col.key}
                      className={`px-3 py-2 ${!isLastColumn ? 'border-r border-[#E9E9E9]' : ''} whitespace-nowrap ${cellClassName} ${col.cellClassName || ''} text-sm`}
                    >
                      {col.render ? col.render(row, idx) : row[col.key] ?? 'N/A'}
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
                      className={`px-3 py-2 ${j !== columns.length - 1 ? 'border-r border-[#E9E9E9]' : ''} whitespace-nowrap text-sm`}
                    >
                      &nbsp;
                    </td>
                  ))}
                </tr>
              ))}
  
            <tr className="font-semibold">
              {columns.map((col, idx) => (
                <td
                  key={col.key}
                  className={`px-3 py-8 ${idx !== columns.length - 1 ? 'border-r border-[#E9E9E9]' : ''} whitespace-nowrap text-sm`}
                >
                  {idx === 0
                    ? 'TOTAL'
                    : col.sum
                    ? getColumnSum(col.key)
                    : ''}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
  
  
       
      </div>
    );
  };