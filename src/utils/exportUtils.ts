
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import html2canvas from 'html2canvas';

// Generic interface for export data
export interface ExportData {
  [key: string]: any;
}

// Interface for export configuration
export interface ExportConfig {
  title?: string;
  tableSelector?: string;
  fileName?: string;
  orientation?: 'portrait' | 'landscape';
  pageSize?: 'a4' | 'a3' | 'letter' | 'legal';
  margins?: {
    top?: number;
    right?: number;
    bottom?: number;
    left?: number;
  };
  customStyles?: {
    titleFontSize?: number;
    timestampFontSize?: number;
    backgroundColor?: string;
  };
}

// Interface for Excel export configuration
export interface ExcelExportConfig extends ExportConfig {
  columns?: {
    key: string;
    header: string;
    width?: number;
    formatter?: (value: any) => string;
  }[];
  summaryRows?: {
    label: string;
    value: string | number;
    formatter?: (value: any) => string;
  }[];
}

// Interface for CSV export configuration (reuses the columns shape)
export interface CSVExportConfig extends ExportConfig {
  columns?: {
    key: string;
    header: string;
    formatter?: (value: any) => string;
  }[];
}

// Default configuration
const defaultConfig: ExportConfig = {
  title: 'Report',
  tableSelector: '.bg-white.rounded-lg.shadow.border',
  fileName: 'export',
  orientation: 'landscape',
  pageSize: 'a4',
  margins: {
    top: 10,
    right: 10,
    bottom: 10,
    left: 10,
  },
  customStyles: {
    titleFontSize: 16,
    timestampFontSize: 10,
    backgroundColor: '#ffffff',
  },
};

/**
 * Export table to PDF with full customization options
 * 
 * @example
 * // Basic usage with default settings
 * await exportToPDF(data);
 * 
 * @example
 * // Custom configuration
 * await exportToPDF(data, {
 *   title: 'Sales Report',
 *   tableSelector: '.my-table-container',
 *   fileName: 'sales_report',
 *   orientation: 'portrait',
 *   pageSize: 'a4',
 *   margins: { top: 15, right: 10, bottom: 15, left: 10 },
 *   customStyles: {
 *     titleFontSize: 18,
 *     timestampFontSize: 12,
 *     backgroundColor: '#f5f5f5'
 *   }
 * });
 * 
 * @param data - Array of data objects to export
 * @param config - Configuration options for the export
 */
export const exportToPDF = async (
  data: ExportData[], 
  config: ExportConfig = {}
) => {
  try {
    const finalConfig = { ...defaultConfig, ...config };
    const { 
      title, 
      tableSelector, 
      fileName, 
      orientation, 
      pageSize, 
      margins, 
      customStyles 
    } = finalConfig;

    // Get the table element to capture
    const tableContainer = document.querySelector(tableSelector!) as HTMLElement;
    
    if (!tableContainer) {
      throw new Error(`Could not find table container with selector: ${tableSelector}`);
    }
    
    // Create a loading indicator
    const loadingDiv = createLoadingIndicator();
    document.body.appendChild(loadingDiv);

    // Store original styles to restore later
    const originalStyles = storeOriginalStyles(tableContainer);

    // Temporarily modify the container for capture
    modifyContainerForCapture(tableContainer);

    // Use html2canvas to capture the exact layout
    const canvas = await html2canvas(tableContainer, {
      scale: 2, // Higher scale for better quality
      useCORS: true,
      allowTaint: true,
      scrollX: 0,
      scrollY: 0,
      windowWidth: document.documentElement.offsetWidth,
      windowHeight: document.documentElement.offsetHeight,
      backgroundColor: customStyles?.backgroundColor || '#ffffff',
      onclone: (clonedDoc) => {
        const clonedElement = clonedDoc.querySelector(tableSelector!) as HTMLElement;
        if (clonedElement) {
          prepareElementForCapture(clonedElement);
        }
      }
    });

    // Restore original styles
    restoreOriginalStyles(tableContainer, originalStyles);

    // Calculate PDF dimensions
    const pdfPageWidth = orientation === 'landscape' ? 297 : 210; // A4 dimensions in mm
    const pdfPageHeight = orientation === 'landscape' ? 210 : 297;
    const margin = margins?.left || 10;
    const imgWidth = pdfPageWidth - (margins?.left || 10) - (margins?.right || 10);
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    // Create PDF with appropriate orientation
    const pdf = new jsPDF({
      orientation,
      unit: 'mm',
      format: pageSize,
    });

    // Add title
    pdf.setFontSize(customStyles?.titleFontSize || 16);
    pdf.setFont('helvetica', 'bold');
    pdf.text(title!, margin + 4, 20);
    
    // Add timestamp
    pdf.setFontSize(customStyles?.timestampFontSize || 10);
    pdf.setFont('helvetica', 'normal');
    const timestamp = new Date().toLocaleString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
    pdf.text(`Generated: ${timestamp}`, margin + 4, 28);

    // Calculate available space for content
    const titleSpace = 35; // Space for title and timestamp
    const availableHeight = pdfPageHeight - titleSpace - (margins?.bottom || 10);
    
    // If content fits on one page
    if (imgHeight <= availableHeight) {
      pdf.addImage(
        canvas.toDataURL('image/png'),
        'PNG',
        margin,
        titleSpace,
        imgWidth,
        imgHeight
      );
    } else {
      // Paginate the content
      paginateContent(pdf, canvas, imgWidth, availableHeight, titleSpace, margin);
    }

    // Save the PDF
    const finalFileName = `${fileName}_${new Date().toISOString().split('T')[0]}.pdf`;
    pdf.save(finalFileName);
    
    // Remove loading indicator
    document.body.removeChild(loadingDiv);
  } catch (error) {
    console.error('Error generating PDF:', error);
    alert('Failed to generate PDF. Please try again.');
    // Remove loading indicator if it exists
    const loadingDiv = document.querySelector('div[style*="position: fixed"]');
    if (loadingDiv && loadingDiv.parentNode) {
      loadingDiv.parentNode.removeChild(loadingDiv);
    }
  }
};

/**
 * Export data to Excel with full customization options
 * 
 * @example
 * // Basic usage with default settings
 * exportToXLS(data);
 * 
 * @example
 * // Custom configuration with column definitions
 * exportToXLS(data, {
 *   title: 'User Report',
 *   fileName: 'user_report',
 *   columns: [
 *     { key: 'name', header: 'Full Name', width: 20 },
 *     { key: 'email', header: 'Email Address', width: 25 },
 *     { key: 'age', header: 'Age', width: 10 },
 *     { key: 'createdAt', header: 'Join Date', width: 15, 
 *       formatter: (value) => new Date(value).toLocaleDateString() }
 *   ],
 *   summaryRows: [
 *     { label: 'Total Users', value: data.length },
 *     { label: 'Average Age', value: averageAge },
 *     { label: 'Generated', value: new Date().toLocaleString() }
 *   ]
 * });
 * 
 * @param data - Array of data objects to export
 * @param config - Configuration options for the export
 */
export const exportToXLS = (
  data: ExportData[], 
  config: ExcelExportConfig = {}
) => {
  try {
    const finalConfig = { ...defaultConfig, ...config };
    const { title, fileName, columns, summaryRows } = finalConfig;

    // Prepare data for Excel
    const excelData = data.map((item, index) => {
      const row: any = { 'S/N': index + 1 };
      
      if (columns) {
        columns.forEach(col => {
          const value = item[col.key];
          row[col.header] = col.formatter ? col.formatter(value) : value;
        });
      } else {
        // Default behavior - use all keys from first item
        Object.keys(item).forEach(key => {
          row[key] = item[key];
        });
      }
      
      return row;
    });
    
    // Create workbook and worksheet
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(excelData);
    
    // Set column widths if provided
    if (columns) {
      const colWidths = columns.map(col => ({ wch: col.width || 15 }));
      ws['!cols'] = colWidths;
    }
    
    // Add summary rows if provided
    if (summaryRows && summaryRows.length > 0) {
      const summaryRow = excelData.length + 2;
      summaryRows.forEach((summary, index) => {
        const value = summary.formatter ? summary.formatter(summary.value) : summary.value;
        ws[`A${summaryRow + index}`] = { v: `${summary.label}: ${value}`, t: 's' };
      });
    }
    
    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, title || 'Report');
    
    // Save the file
    const finalFileName = `${fileName}_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(wb, finalFileName);
  } catch (error) {
    console.error('Error generating Excel:', error);
    alert('Failed to generate Excel file. Please try again.');
  }
};

/**
 * Export data to CSV
 * @param data - Array of data objects to export
 * @param config - Configuration options (columns, filename, title)
 */
export const exportToCSV = (
  data: ExportData[],
  config: CSVExportConfig = {}
) => {
  try {
    const finalConfig = { ...defaultConfig, ...config } as Required<CSVExportConfig>;
    const { fileName, columns } = finalConfig;

    if (!data || data.length === 0) {
      alert('No data to export');
      return;
    }

    // Build headers
    const headers: string[] = columns
      ? columns.map(c => c.header)
      : Object.keys(data[0]);

    // Build rows
    const rows: string[][] = data.map(item => {
      if (columns) {
        return columns.map(col => {
          const raw = item[col.key];
          const value = col.formatter ? col.formatter(raw) : raw;
          return csvEscape(value);
        });
      }
      return Object.keys(item).map(key => csvEscape((item as any)[key]));
    });

    const csvContent = [headers.map(csvEscape).join(','), ...rows.map(r => r.join(','))].join('\n');

    // Prepend BOM to properly open in Excel
    const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${fileName}_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error generating CSV:', error);
    alert('Failed to generate CSV file. Please try again.');
  }
};

function csvEscape(value: unknown): string {
  if (value === null || value === undefined) return '""';
  const str = String(value);
  // Escape double quotes by doubling them
  const escaped = str.replace(/"/g, '""');
  // Wrap in quotes to preserve commas/newlines
  return `"${escaped}"`;
}

// Helper functions
function createLoadingIndicator(): HTMLDivElement {
  const loadingDiv = document.createElement('div');
  loadingDiv.style.position = 'fixed';
  loadingDiv.style.top = '0';
  loadingDiv.style.left = '0';
  loadingDiv.style.width = '100%';
  loadingDiv.style.height = '100%';
  loadingDiv.style.backgroundColor = 'rgba(0,0,0,0.5)';
  loadingDiv.style.display = 'flex';
  loadingDiv.style.justifyContent = 'center';
  loadingDiv.style.alignItems = 'center';
  loadingDiv.style.zIndex = '9999';
  loadingDiv.innerHTML = '<div style="background: white; padding: 20px; border-radius: 8px;">Generating PDF...</div>';
  return loadingDiv;
}

function storeOriginalStyles(element: HTMLElement) {
  return {
    overflow: element.style.overflow,
    overflowX: element.style.overflowX,
    overflowY: element.style.overflowY,
    maxHeight: element.style.maxHeight,
    height: element.style.height,
    width: element.style.width,
    transform: element.style.transform,
    transformOrigin: element.style.transformOrigin,
  };
}

function modifyContainerForCapture(element: HTMLElement) {
  element.style.overflow = 'visible';
  element.style.overflowX = 'visible';
  element.style.overflowY = 'visible';
  element.style.maxHeight = 'none';
  element.style.height = 'auto';
  element.style.width = 'auto';
}

function restoreOriginalStyles(element: HTMLElement, originalStyles: any) {
  element.style.overflow = originalStyles.overflow;
  element.style.overflowX = originalStyles.overflowX;
  element.style.overflowY = originalStyles.overflowY;
  element.style.maxHeight = originalStyles.maxHeight;
  element.style.height = originalStyles.height;
  element.style.width = originalStyles.width;
  element.style.transform = originalStyles.transform;
  element.style.transformOrigin = originalStyles.transformOrigin;
}

function prepareElementForCapture(element: HTMLElement) {
  // Ensure the main container is fully visible
  element.style.overflow = 'visible';
  element.style.overflowX = 'visible';
  element.style.overflowY = 'visible';
  element.style.maxHeight = 'none';
  element.style.height = 'auto';
  element.style.width = 'auto';
  element.style.position = 'relative';
  element.style.zIndex = '1';

  // Fix all overflow containers within the table
  const overflowElements = element.querySelectorAll('.overflow-x-auto, .overflow-y-auto, .overflow-x-scroll, .overflow-y-scroll, .overflow-auto');
  overflowElements.forEach((el) => {
    const element = el as HTMLElement;
    element.style.overflow = 'visible';
    element.style.overflowX = 'visible';
    element.style.overflowY = 'visible';
    element.style.maxHeight = 'none';
    element.style.maxWidth = 'none';
    element.style.height = 'auto';
    element.style.width = 'auto';
    element.style.position = 'relative';
  });

  // Ensure table elements are fully visible
  const tables = element.querySelectorAll('table');
  tables.forEach((table) => {
    const tableElement = table as HTMLElement;
    tableElement.style.width = 'auto';
    tableElement.style.minWidth = 'auto';
    tableElement.style.maxWidth = 'none';
    tableElement.style.tableLayout = 'auto';
  });

  // Fix any scrollable divs
  const scrollableDivs = element.querySelectorAll('div[style*="overflow"]');
  scrollableDivs.forEach((div) => {
    const divElement = div as HTMLElement;
    if (divElement.style.overflow || divElement.style.overflowX || divElement.style.overflowY) {
      divElement.style.overflow = 'visible';
      divElement.style.overflowX = 'visible';
      divElement.style.overflowY = 'visible';
      divElement.style.maxHeight = 'none';
      divElement.style.maxWidth = 'none';
    }
  });

  // Ensure all content is visible by removing any clipping
  const allElements = element.querySelectorAll('*');
  allElements.forEach((el) => {
    const element = el as HTMLElement;
    if (element.style.overflow === 'hidden' || 
        element.style.overflowX === 'hidden' || 
        element.style.overflowY === 'hidden') {
      element.style.overflow = 'visible';
      element.style.overflowX = 'visible';
      element.style.overflowY = 'visible';
    }
  });
}

function paginateContent(
  pdf: jsPDF, 
  canvas: HTMLCanvasElement, 
  imgWidth: number, 
  availableHeight: number, 
  titleSpace: number, 
  margin: number
) {
  let pageCanvasTop = 0;
  let pageNum = 0;
  const pageHeightPx = (canvas.width / imgWidth) * availableHeight;
  
  while (pageCanvasTop < canvas.height) {
    // Create a temporary canvas for the current page
    const pageCanvas = document.createElement('canvas');
    pageCanvas.width = canvas.width;
    pageCanvas.height = Math.min(pageHeightPx, canvas.height - pageCanvasTop);
    const ctx = pageCanvas.getContext('2d');
    
    if (ctx) {
      ctx.drawImage(
        canvas,
        0,
        pageCanvasTop,
        canvas.width,
        pageCanvas.height,
        0,
        0,
        canvas.width,
        pageCanvas.height
      );
    }
    
    const imgData = pageCanvas.toDataURL('image/png');
    
    if (pageNum > 0) {
      pdf.addPage();
    }
    
    // For the first page, leave space for title/timestamp
    const yOffset = pageNum === 0 ? titleSpace : margin;
    pdf.addImage(
      imgData,
      'PNG',
      margin,
      yOffset,
      imgWidth,
      (pageCanvas.height * imgWidth) / canvas.width
    );
    
    pageCanvasTop += pageHeightPx;
    pageNum++;
  }
}

// Legacy interface for backward compatibility
export interface LegacyExportData {
  customername: string;
  email: string;
  phone: string;
  gender: string;
  userid: string;
  productId: string;
  productname: string;
  nooftickets: string[];
  ticketunit: number;
  quantity: number;
  ticketprice: number;
  ticketpurdate: string;
  raffledrawdate: string;
  raffledrawtime: string;
}

/**
 * Legacy function for backward compatibility - exports auction transaction data to PDF
 * @deprecated Use exportToPDF with custom configuration instead
 */
export const exportToPDFLegacy = async (data: LegacyExportData[], title: string = 'Auction Transaction Report') => {
  return exportToPDF(data, { title, fileName: 'Auction_Transaction_Report' });
};

/**
 * Legacy function for backward compatibility - exports auction transaction data to Excel
 * @deprecated Use exportToXLS with custom configuration instead
 */
export const exportToXLSLegacy = (data: LegacyExportData[], title: string = 'Auction Transaction Report') => {
  const columns = [
    { key: 'customername', header: 'Customer Name', width: 20 },
    { key: 'email', header: 'Email Address', width: 25 },
    { key: 'phone', header: 'Phone Number', width: 15 },
    { key: 'gender', header: 'Gender', width: 10 },
    { key: 'userid', header: 'User ID', width: 12 },
    { key: 'productId', header: 'Product ID', width: 12 },
    { key: 'productname', header: 'Product Name', width: 25 },
    { key: 'nooftickets', header: 'Number of Tickets', width: 20, formatter: (value: string[]) => value.join(', ') },
    { key: 'ticketunit', header: 'Unit Ticket Rate (NGN)', width: 15 },
    { key: 'quantity', header: 'Quantity', width: 10 },
    { key: 'ticketprice', header: 'Ticket Price (NGN)', width: 15 },
    { key: 'ticketpurdate', header: 'Ticket Purchase Date', width: 18, formatter: (value: string) => new Date(value).toLocaleDateString() },
    { key: 'raffledrawdate', header: 'Raffle Draw Date', width: 15, formatter: (value: string) => new Date(value).toLocaleDateString() },
    { key: 'raffledrawtime', header: 'Raffle Draw Time', width: 12 },
  ];

  const totalAmount = data.reduce((sum, item) => sum + item.ticketprice, 0);
  const summaryRows = [
    { label: 'Total Records', value: data.length },
    { label: 'Total Amount', value: `₦${totalAmount.toLocaleString()}` },
    { label: 'Generated', value: new Date().toLocaleString() },
  ];

  return exportToXLS(data, { 
    title, 
    fileName: 'Auction_Transaction_Report',
    columns,
    summaryRows
  });
};