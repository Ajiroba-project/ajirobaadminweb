import { exportToPDF, exportToXLS, ExportData, ExportConfig, ExcelExportConfig } from './exportUtils';

// Example 1: User Management System
interface UserData {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive';
  createdAt: string;
  lastLogin: string;
}

export const exportUserReport = async (users: UserData[]) => {
  // PDF Export
  await exportToPDF(users, {
    title: 'User Management Report',
    tableSelector: '.user-table-container',
    fileName: 'user_management_report',
    orientation: 'landscape',
    customStyles: {
      titleFontSize: 18,
      backgroundColor: '#f8f9fa'
    }
  });

  // Excel Export
  exportToXLS(users, {
    title: 'User Management Report',
    fileName: 'user_management_report',
    columns: [
      { key: 'id', header: 'User ID', width: 12 },
      { key: 'name', header: 'Full Name', width: 25 },
      { key: 'email', header: 'Email Address', width: 30 },
      { key: 'role', header: 'Role', width: 15 },
      { key: 'status', header: 'Status', width: 12 },
      { key: 'createdAt', header: 'Created Date', width: 18, 
        formatter: (value) => new Date(value).toLocaleDateString() },
      { key: 'lastLogin', header: 'Last Login', width: 18,
        formatter: (value) => new Date(value).toLocaleDateString() }
    ],
    summaryRows: [
      { label: 'Total Users', value: users.length },
      { label: 'Active Users', value: users.filter(u => u.status === 'active').length },
      { label: 'Inactive Users', value: users.filter(u => u.status === 'inactive').length },
      { label: 'Generated', value: new Date().toLocaleString() }
    ]
  });
};

// Example 2: Sales/Revenue Report
interface SalesData {
  orderId: string;
  customerName: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  orderDate: string;
  paymentStatus: 'paid' | 'pending' | 'failed';
}

export const exportSalesReport = async (sales: SalesData[]) => {
  const totalRevenue = sales.reduce((sum, sale) => sum + sale.totalAmount, 0);
  const paidOrders = sales.filter(s => s.paymentStatus === 'paid').length;

  // PDF Export
  await exportToPDF(sales, {
    title: 'Sales Revenue Report',
    tableSelector: '.sales-table-container',
    fileName: 'sales_revenue_report',
    orientation: 'landscape',
    margins: { top: 15, right: 10, bottom: 15, left: 10 },
    customStyles: {
      titleFontSize: 20,
      timestampFontSize: 12,
      backgroundColor: '#ffffff'
    }
  });

  // Excel Export
  exportToXLS(sales, {
    title: 'Sales Revenue Report',
    fileName: 'sales_revenue_report',
    columns: [
      { key: 'orderId', header: 'Order ID', width: 15 },
      { key: 'customerName', header: 'Customer Name', width: 25 },
      { key: 'productName', header: 'Product', width: 30 },
      { key: 'quantity', header: 'Quantity', width: 12 },
      { key: 'unitPrice', header: 'Unit Price (₦)', width: 15,
        formatter: (value) => `₦${value.toLocaleString()}` },
      { key: 'totalAmount', header: 'Total Amount (₦)', width: 18,
        formatter: (value) => `₦${value.toLocaleString()}` },
      { key: 'orderDate', header: 'Order Date', width: 18,
        formatter: (value) => new Date(value).toLocaleDateString() },
      { key: 'paymentStatus', header: 'Payment Status', width: 15,
        formatter: (value) => value.charAt(0).toUpperCase() + value.slice(1) }
    ],
    summaryRows: [
      { label: 'Total Orders', value: sales.length },
      { label: 'Total Revenue', value: `₦${totalRevenue.toLocaleString()}` },
      { label: 'Paid Orders', value: paidOrders },
      { label: 'Pending Orders', value: sales.filter(s => s.paymentStatus === 'pending').length },
      { label: 'Failed Orders', value: sales.filter(s => s.paymentStatus === 'failed').length },
      { label: 'Generated', value: new Date().toLocaleString() }
    ]
  });
};

// Example 3: Inventory Management
interface InventoryData {
  productId: string;
  productName: string;
  category: string;
  currentStock: number;
  minStockLevel: number;
  unitCost: number;
  lastUpdated: string;
  supplier: string;
}

export const exportInventoryReport = async (inventory: InventoryData[]) => {
  const lowStockItems = inventory.filter(item => item.currentStock <= item.minStockLevel);
  const totalValue = inventory.reduce((sum, item) => sum + (item.currentStock * item.unitCost), 0);

  // PDF Export
  await exportToPDF(inventory, {
    title: 'Inventory Management Report',
    tableSelector: '.inventory-table-container',
    fileName: 'inventory_report',
    orientation: 'landscape',
    pageSize: 'a4',
    customStyles: {
      titleFontSize: 16,
      backgroundColor: '#ffffff'
    }
  });

  // Excel Export
  exportToXLS(inventory, {
    title: 'Inventory Management Report',
    fileName: 'inventory_report',
    columns: [
      { key: 'productId', header: 'Product ID', width: 15 },
      { key: 'productName', header: 'Product Name', width: 30 },
      { key: 'category', header: 'Category', width: 20 },
      { key: 'currentStock', header: 'Current Stock', width: 15 },
      { key: 'minStockLevel', header: 'Min Stock Level', width: 15 },
      { key: 'unitCost', header: 'Unit Cost (₦)', width: 15,
        formatter: (value) => `₦${value.toLocaleString()}` },
      { key: 'lastUpdated', header: 'Last Updated', width: 18,
        formatter: (value) => new Date(value).toLocaleDateString() },
      { key: 'supplier', header: 'Supplier', width: 25 }
    ],
    summaryRows: [
      { label: 'Total Products', value: inventory.length },
      { label: 'Low Stock Items', value: lowStockItems.length },
      { label: 'Total Inventory Value', value: `₦${totalValue.toLocaleString()}` },
      { label: 'Generated', value: new Date().toLocaleString() }
    ]
  });
};

// Example 4: Analytics/Statistics Report
interface AnalyticsData {
  metric: string;
  currentValue: number;
  previousValue: number;
  change: number;
  changePercentage: number;
  period: string;
}

export const exportAnalyticsReport = async (analytics: AnalyticsData[]) => {
  // PDF Export
  await exportToPDF(analytics, {
    title: 'Analytics Dashboard Report',
    tableSelector: '.analytics-table-container',
    fileName: 'analytics_report',
    orientation: 'portrait',
    margins: { top: 20, right: 15, bottom: 20, left: 15 },
    customStyles: {
      titleFontSize: 22,
      timestampFontSize: 14,
      backgroundColor: '#f5f5f5'
    }
  });

  // Excel Export
  exportToXLS(analytics, {
    title: 'Analytics Dashboard Report',
    fileName: 'analytics_report',
    columns: [
      { key: 'metric', header: 'Metric', width: 25 },
      { key: 'currentValue', header: 'Current Value', width: 15,
        formatter: (value) => value.toLocaleString() },
      { key: 'previousValue', header: 'Previous Value', width: 15,
        formatter: (value) => value.toLocaleString() },
      { key: 'change', header: 'Change', width: 15,
        formatter: (value) => value > 0 ? `+${value}` : value.toString() },
      { key: 'changePercentage', header: 'Change %', width: 15,
        formatter: (value) => `${value > 0 ? '+' : ''}${value.toFixed(2)}%` },
      { key: 'period', header: 'Period', width: 20 }
    ],
    summaryRows: [
      { label: 'Total Metrics', value: analytics.length },
      { label: 'Positive Changes', value: analytics.filter(a => a.change > 0).length },
      { label: 'Negative Changes', value: analytics.filter(a => a.change < 0).length },
      { label: 'Generated', value: new Date().toLocaleString() }
    ]
  });
};

// Example 5: Simple Generic Export (minimal configuration)
export const exportSimpleReport = async (data: ExportData[], title: string) => {
  // PDF Export with minimal config
  await exportToPDF(data, { title });

  // Excel Export with minimal config
  exportToXLS(data, { title });
};

// Example 6: Custom Table Selector
export const exportCustomTable = async (data: ExportData[], tableSelector: string) => {
  await exportToPDF(data, {
    title: 'Custom Table Report',
    tableSelector,
    fileName: 'custom_table_report'
  });
};

// Example 7: Different Page Sizes
export const exportLargeReport = async (data: ExportData[]) => {
  await exportToPDF(data, {
    title: 'Large Format Report',
    pageSize: 'a3',
    orientation: 'landscape',
    fileName: 'large_format_report'
  });
}; 