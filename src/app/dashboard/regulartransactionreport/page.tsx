"use client";
import React, { useState, useEffect } from "react";
import { ProfileHeader } from "@/app/components/Header";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import Link from "next/link";
import Image from "next/image";
import Brand from "@/app/asset/logo.svg";
import { ReportsTable } from "../components/ReportsTable";
import { DownloadModal } from "@/app/components/DownloadModal";
import { exportToPDF, exportToXLS, exportToPDFTable, ExportData } from "@/utils/exportUtils";
import { useGetDatanew } from "@/hooks/useGetData";
import useAuthMiddleware from "@/hooks/useAuthMiddleware";
import { formatCurrency } from "@/utils/formatCurrency";

// TypeScript interfaces for API response
interface ProductInfo {
  product_id: string;
  product_no: string;
  product_name: string;
  selling_price: number;
  discount_price: number;
  cost_price: number;
  profit: number;
  number_in_stock: number;
  payment_method: string;
}

interface RegularTransactionData {
  id: string;
  order_id: string;
  product_info: ProductInfo[];
  date_created: string;
}

interface RegularTransactionTotals {
  total_price: number;
  selling_price: number;
  items_cost_price: number;
}

interface RegularTransactionResults {
  status: string;
  message: string;
  current_datetime: string;
  totals: RegularTransactionTotals;
  total_profit: number;
  data: RegularTransactionData[];
}

interface RegularTransactionApiResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: RegularTransactionResults;
}

export default function Page() {
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [filterBy, setFilterBy] = useState<string[]>([]);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [customDateRange, setCustomDateRange] = useState({ start: '', end: '' });
  const [showCustomDatePicker, setShowCustomDatePicker] = useState(false);

  const [userToken] = useState(Cookies.get("token"));
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [currentTime, setCurrentTime] = useState<string>("");


  const [debouncedTopSortBy, setDebouncedTopSortBy] = useState("last_month");
  const [debouncedTopCustomStart, setDebouncedTopCustomStart] = useState("");
  const [debouncedTopCustomEnd, setDebouncedTopCustomEnd] = useState("");

  // Pagination state
  const [totalPages, setTotalPages] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPreviousPage, setHasPreviousPage] = useState(false);

  useAuthMiddleware(router);

  useEffect(() => {
    setCurrentTime(
      new Date().toLocaleString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      })
    );
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.filter-dropdown') && !target.closest('.sort-dropdown')) {
        setShowFilterDropdown(false);
        setShowSortDropdown(false);
        setShowCustomDatePicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);


  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedTopSortBy(sort);
      setDebouncedTopCustomStart(customDateRange.start);
      setDebouncedTopCustomEnd(customDateRange.end);
    }, 500); // 500ms delay

    return () => clearTimeout(timer);
  }, [sort, customDateRange.start, customDateRange.end]);

  // Construct filter parameters for API
  // const getFilterParams = () => {
  //   const params = new URLSearchParams();
    
  //   if (currentPage > 1) {
  //     params.append('page', currentPage.toString());
  //   }
    
  //   // Handle custom date range
  //   if (customDateRange.start && customDateRange.end) {
  //     params.append('start_date', customDateRange.start);
  //     params.append('end_date', customDateRange.end);
  //   } else if (dateFilter && dateFilter !== 'custom') {
  //     // Only add filter parameter if it's not custom and we have a dateFilter
  //     params.append('filter', dateFilter);
  //   }
    
  //   return params.toString();
  // };

  const getFilterParams = () => {
    const params = new URLSearchParams();

    switch (debouncedTopSortBy) {
      case "last_7_days":
        params.append("filter", "last_7_days");
        break;
      case "yesterday":
        const today = new Date();
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);

        const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
        const yesterdayStr = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, "0")}-${String(yesterday.getDate()).padStart(2, "0")}`;

        params.append("filter", "custom");
        params.append("start_date", todayStr);
        params.append("end_date", yesterdayStr);
        break;
  
      case "last_year":
        params.append("filter", "last_year");
        break;
      case "custom":
        // Only send custom filter when BOTH dates are available
        if (debouncedTopCustomStart && debouncedTopCustomEnd) {
          params.append("filter", "custom");
          params.append("start_date", debouncedTopCustomStart);
          params.append("end_date", debouncedTopCustomEnd);
        }
        break;
      default:
        params.append("filter", "last_month");
    }

    return params.toString();
  };

  // API integration
  const url = `${process.env.NEXT_PUBLIC_BASE_URL}/admin/regular_transaction_report/?${getFilterParams()}`;
  const {
    data: regularTransactionData,
    isLoading: regularTransactionLoading,
    error: regularTransactionError,
  } = useGetDatanew(url, "get_regular_transaction_report", userToken || " ");

  // Transform API data to match component structure
  const transformApiData = (apiData: any): any[] => {
    if (!apiData) {
      return [];
    }
    
    return apiData?.map((item: any) => {
      const productInfo = item.product_info?.[0] || {};
      return {
        productId: productInfo.product_no || 'N/A',
        productno: productInfo.product_id || 'N/A',
        productName: productInfo.product_name || 'N/A',
        sellingPrice: productInfo.selling_price || 0,
        discount: productInfo.discount_price || 0,
        costPrice: productInfo.cost_price || 0,
        profit: productInfo.profit || 0,
        paymentMethod: productInfo.payment_method || 'N/A',
        stock: productInfo.number_in_stock || 0,
        orderId: item.order_id || 'N/A',
        dateCreated: item.date_created ? new Date(item.date_created).toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'short',
          year: 'numeric'
        }).toUpperCase() : 'N/A',
        id: item.id || 'N/A',
      };
    });
  };

  // Update pagination state when data changes
  useEffect(() => {
    if (regularTransactionData) {
      const apiResponse = regularTransactionData as unknown as RegularTransactionApiResponse;
      setTotalPages(Math.ceil(apiResponse.count / pageSize));
      setHasNextPage(!!apiResponse.next);
      setHasPreviousPage(!!apiResponse.previous);
    }
  }, [regularTransactionData, pageSize]);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [dateFilter, customDateRange, search, filterBy]);

  const transformedData = transformApiData((regularTransactionData as unknown as RegularTransactionApiResponse)?.results?.data);

  // Pagination handlers
  const handleNextPage = () => {
    if (hasNextPage) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const handlePreviousPage = () => {
    if (hasPreviousPage) {
      setCurrentPage(prev => prev - 1);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Table columns for Regular Transaction Report
  const columnsRegularTransaction = [
    {
      key: "index",
      label: "S/N",
      render: (row: any, idx: number) => (currentPage - 1) * pageSize + idx + 1,
    },
    {
      key: "productno",
      label: "PRODUCT ID",
      cellClassName: "text-[#F25E26] underline cursor-pointer",
      render: (row: any) => (
        <Link
          href={`/dashboard/productdetails-product/${row.productno}`}
          className="bg-[#FFFFFF] text-[#F25E26] transition delay-300 duration-300 ease-in-out hover:bg-[#F25E26] hover:text-white hover:transition-all flex gap-2 rounded-lg p-2 font-Poppins text-sm items-center"
        >
          {row.productId}
        </Link>
      ),
    },
    { key: "productName", label: "PRODUCT NAME" },
    { key: "sellingPrice", label: "SELLING PRICE (NGN)", sum: true },
    { key: "discount", label: "DISCOUNT (NGN)", sum: true },
    { key: "costPrice", label: "COST PRICE", sum: true },
    { key: "profit", label: "PROFIT (NGN)", sum: true },
    { key: "paymentMethod", label: "METHOD OF PAYMENT" },
    { key: "stock", label: "NUMBER IN STOCK", sum: true },
  ];

  // Filter and sort the data
  const getFilteredAndSortedData = () => {
    let filteredData = [...transformedData];

    // Apply search filter
    if (search) {
      filteredData = filteredData.filter(item =>
        item.productId.toLowerCase().includes(search.toLowerCase()) ||
        item.productName.toLowerCase().includes(search.toLowerCase()) ||
        item.sellingPrice.toString().includes(search) ||
        item.discount.toString().includes(search) ||
        item.costPrice.toString().includes(search) ||
        item.profit.toString().includes(search) ||
        item.paymentMethod.toLowerCase().includes(search.toLowerCase()) ||
        item.stock.toString().includes(search)
      );
    }

    // Apply filter by checkboxes
    if (filterBy.length > 0) {
      filteredData = filteredData.filter(item => {
        return filterBy.every(filter => {
          switch (filter) {
            case 'productId':
              return search ? item.productId.toLowerCase().includes(search.toLowerCase()) : true;
            case 'productName':
              return search ? item.productName.toLowerCase().includes(search.toLowerCase()) : true;
            case 'paymentMethod':
              return search ? item.paymentMethod.toLowerCase().includes(search.toLowerCase()) : true;
            default:
              return true;
          }
        });
      });
    }

    // Apply sorting
    if (sort) {
      filteredData.sort((a, b) => {
        switch (sort) {
          case 'productName':
            return a.productName.localeCompare(b.productName);
          case 'date':
            if (a.dateCreated === "N/A" && b.dateCreated === "N/A") return 0;
            if (a.dateCreated === "N/A") return 1;
            if (b.dateCreated === "N/A") return -1;
            return new Date(b.dateCreated).getTime() - new Date(a.dateCreated).getTime();
          case 'profit':
            return b.profit - a.profit;
          default:
            return 0;
        }
      });
    }

    return filteredData;
  };

  const displayData = getFilteredAndSortedData();

  // Download handlers
  const handleDownloadPDF = async () => {
    const exportData: ExportData[] = displayData.map((item) => ({
      productId: item.productId,
      productName: item.productName,
      sellingPrice: formatCurrency(item.sellingPrice),
      discount: formatCurrency(item.discount),
      costPrice: formatCurrency(item.costPrice),
      profit: formatCurrency(item.profit),
      paymentMethod: item.paymentMethod,
      stock: item.stock,
    }));
    setShowDownloadModal(false);
    await exportToPDFTable(exportData, {
      title: "Regular Transaction Report",
      fileName: "Regular_Transaction_Report",
      columns: [
        { key: 'productId', header: 'Product ID' },
        { key: 'productName', header: 'Product Name' },
        { key: 'sellingPrice', header: 'Selling Price' },
        { key: 'discount', header: 'Discount' },
        { key: 'costPrice', header: 'Cost Price' },
        { key: 'profit', header: 'Profit' },
        { key: 'paymentMethod', header: 'Payment Method' },
        { key: 'stock', header: 'Stock' },
      ],
    });
  };

  const handleDownloadXLS = () => {
    const exportData: ExportData[] = displayData.map((item) => ({
      productId: item.productId,
      productName: item.productName,
      sellingPrice: formatCurrency(item.sellingPrice),
      discount: formatCurrency(item.discount),
      costPrice: formatCurrency(item.costPrice),
      profit: formatCurrency(item.profit),
      paymentMethod: item.paymentMethod,
      stock: item.stock,
    }));
    exportToXLS(exportData, {
      title: "Regular Transaction Report",
      fileName: "Regular_Transaction_Report",
      columns: [
        { key: "productId", header: "Product ID", width: 15 },
        { key: "productName", header: "Product Name", width: 20 },
        { key: "sellingPrice", header: "Selling Price (NGN)", width: 15 },
        { key: "discount", header: "Discount (NGN)", width: 15 },
        { key: "costPrice", header: "Cost Price", width: 15 },
        { key: "profit", header: "Profit (NGN)", width: 15 },
        { key: "paymentMethod", header: "Method of Payment", width: 20 },
        { key: "stock", header: "Number in Stock", width: 15 },
      ],
      summaryRows: [
        { label: "Total Records", value: exportData.length },
        { label: "Total Profit", value: formatCurrency(exportData.reduce((sum, item) => sum + item.profit, 0)) },
        { label: "Generated", value: new Date().toLocaleString() },
      ],
    });
    setShowDownloadModal(false);
  };

  const AjirobaLogo = ({
    className = "h-4 w-4 sm:h-6 sm:w-6 md:h-8 md:w-8",
    textClassName = "text-base sm:text-lg md:text-xl",
  }) => (
    <div className="flex items-center bg-white  py-1 px-2 md:px-3 rounded-md shadow-md">
      <Link href={"/"} className={``}>
        <Image src={Brand} alt="brand-logo" />
      </Link>
    </div>
  );

  // Loading state
  if (regularTransactionLoading) {
    return (
      <section className="flex flex-col">
        <div className="w-full bg-gray-100">
          <ProfileHeader />
          <div className="px-4 md:px-14 py-4">
            <p
              className="text-[#F25E26] underline cursor-pointer"
              onClick={() => router.back()}
            >
              Back
            </p>
          </div>
        </div>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#F25E26] mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading regular transaction data...</p>
          </div>
        </div>
      </section>
    );
  }

  // Error state
  if (regularTransactionError) {
    return (
      <section className="flex flex-col">
        <div className="w-full bg-gray-100">
          <ProfileHeader />
          <div className="px-4 md:px-14 py-4">
            <p
              className="text-[#F25E26] underline cursor-pointer"
              onClick={() => router.back()}
            >
              Back
            </p>
          </div>
        </div>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <p className="text-red-600">Error loading data. Please try again.</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-[#F25E26] text-white rounded-md hover:bg-[#d63918]"
            >
              Retry
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="flex flex-col">
      <div className="w-full bg-gray-100">
        <ProfileHeader />
        <div className="px-4 md:px-14 py-4">
          <p
            className="text-[#F25E26] underline cursor-pointer"
            onClick={() => router.back()}
          >
            Back
          </p>
        </div>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center px-4 md:px-14 py-4 gap-2">
          <h1 className="text-[#111111] text-lg font-Poppins font-semibold">
            Regular Transaction Report
          </h1>
          <button
            onClick={() => setShowDownloadModal(true)}
            className="rounded-md bg-[#f25e26] px-6 py-2 text-white text-sm hover:bg-[#d63918] transition-colors"
          >
            Download
          </button>
        </div>
      </div>
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 px-4 md:px-14 mt-6 mb-4">
        <div className="relative w-full md:w-72">
          <input
            type="text"
            placeholder="Search here..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 pl-10 pr-4 rounded-md border border-[#E9E9E9] bg-[#F6F6F6] text-sm focus:outline-none focus:ring-2 focus:ring-[#F25E26]"
          />
          <span className="absolute left-3 top-2.5 text-gray-400">
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
              <path
                stroke="#A09F9F"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M11.5 21c5.247 0 9.5-4.253 9.5-9.5S16.747 2 11.5 2 2 6.253 2 11.5 6.253 21 11.5 21Z"
              />
              <path
                stroke="#A09F9F"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m22 22-2-2"
              />
            </svg>
          </span>
        </div>
        <div className="w-full md:w-auto flex gap-4">
          {/* Filter by dropdown */}
          <div className="relative filter-dropdown">
            <button
              onClick={() => setShowFilterDropdown(!showFilterDropdown)}
              className="w-full md:w-auto px-4 py-2 border border-[#E9E9E9] rounded-md bg-white text-[#353131] text-sm font-Poppins focus:outline-none focus:ring-2 focus:ring-[#F25E26] flex items-center justify-between min-w-[120px]"
            >
              Filter by {filterBy.length > 0 && `(${filterBy.length})`}
              <svg
                className={`ml-2 h-4 w-4 transition-transform ${showFilterDropdown ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {showFilterDropdown && (
              <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-[#E9E9E9] rounded-md shadow-lg z-10">
                <div className="p-2 space-y-2">
                  {[
                    { key: 'productId', label: 'Product ID' },
                    { key: 'productName', label: 'Product Name' },
                    { key: 'paymentMethod', label: 'Payment Method' }
                  ].map((filter) => (
                    <label key={filter.key} className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
                      <input
                        type="checkbox"
                        checked={filterBy.includes(filter.key)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFilterBy([...filterBy, filter.key]);
                          } else {
                            setFilterBy(filterBy.filter(f => f !== filter.key));
                          }
                        }}
                        className="rounded border-gray-300 text-[#F25E26] focus:ring-[#F25E26]"
                      />
                      <span className="text-sm text-[#353131]">{filter.label}</span>
                    </label>
                  ))}
                  {filterBy.length > 0 && (
                    <div className="pt-2 border-t border-gray-200">
                      <button
                        onClick={() => setFilterBy([])}
                        className="w-full text-left px-2 py-1 text-xs text-red-600 hover:bg-red-50 rounded"
                      >
                        Clear all filters
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Sort by dropdown */}
          <div className="relative sort-dropdown">
            <button
              onClick={() => setShowSortDropdown(!showSortDropdown)}
              className="w-full md:w-auto px-4 py-2 border border-[#E9E9E9] rounded-md bg-white text-[#353131] text-sm font-Poppins focus:outline-none focus:ring-2 focus:ring-[#F25E26] flex items-center justify-between min-w-[120px]"
            >
              {dateFilter === 'custom' && customDateRange.start && customDateRange.end 
                ? `Custom (${customDateRange.start} - ${customDateRange.end})`
                : dateFilter 
                ? dateFilter.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()) 
                : 'Date Range'}
              <svg
                className={`ml-2 h-4 w-4 transition-transform ${showSortDropdown ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {showSortDropdown && (
              <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-[#E9E9E9] rounded-md shadow-lg z-10">
                <div className="p-2 space-y-1">
                  {[
                    { value: 'yesterday', label: 'Yesterday' },
                    { value: 'last_week', label: 'Last Week' },
                    { value: 'last_month', label: 'Last Month' },
                    { value: 'last_year', label: 'Last Year' },
                    { value: 'custom', label: 'Custom' }
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        setDateFilter(option.value);
                        setSort(option.value);
                        if (option.value === 'custom') {
                          setShowCustomDatePicker(true);
                          setShowSortDropdown(false);
                        } else {
                          setShowSortDropdown(false);
                        }
                      }}
                      className={`w-full text-left px-3 py-2 text-sm rounded hover:bg-gray-50 ${
                        dateFilter === option.value ? 'bg-[#F25E26] text-white' : 'text-[#353131]'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                  {dateFilter && (
                    <div className="pt-2 border-t border-gray-200">
                      <button
                        onClick={() => {
                          setDateFilter('');
                          setSort('');
                          setCustomDateRange({ start: '', end: '' });
                          setShowSortDropdown(false);
                          setShowCustomDatePicker(false);
                        }}
                        className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded"
                      >
                        Clear filter
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Custom Date Picker */}
            {showCustomDatePicker && (
              <div className="absolute top-full left-0 mt-1 w-64 bg-white border border-[#E9E9E9] rounded-md shadow-lg z-20 p-4">
                <div className="space-y-3">
                  <h3 className="text-sm font-medium text-[#353131]">Select Date Range</h3>
                  <div className="space-y-2">
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Start Date</label>
                      <input
                        type="date"
                        value={customDateRange.start}
                        onChange={(e) => setCustomDateRange({ ...customDateRange, start: e.target.value })}
                        className="w-full px-3 py-2 border border-[#E9E9E9] rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#F25E26]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">End Date</label>
                      <input
                        type="date"
                        value={customDateRange.end}
                        onChange={(e) => setCustomDateRange({ ...customDateRange, end: e.target.value })}
                        className="w-full px-3 py-2 border border-[#E9E9E9] rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#F25E26]"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={() => {
                        if (customDateRange.start && customDateRange.end) {
                          setDateFilter('custom');
                          setSort('custom');
                          setShowCustomDatePicker(false);
                        }
                      }}
                      className="flex-1 px-3 py-2 bg-[#F25E26] text-white text-sm rounded-md hover:bg-[#d63918]"
                    >
                      Apply
                    </button>
                    <button
                      onClick={() => {
                        setCustomDateRange({ start: '', end: '' });
                        setDateFilter('');
                        setShowCustomDatePicker(false);
                      }}
                      className="flex-1 px-3 py-2 border border-[#E9E9E9] text-[#353131] text-sm rounded-md hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="flex justify-center ">
        <div className="w-7/12 ">
          <div className=" bg-white rounded-lg shadow border mt-6 mb-12 overflow-x-scroll overflow-y-scroll  py-4">
            <div className="flex flex-row items-center gap-4 px-4 md:px-8 pt-8 pb-2">
              <AjirobaLogo />
            </div>
            <div className="bg-[#F25E26] text-white font-Poppins font-medium px-4 md:px-8 py-2 flex items-center justify-between text-sm rounded-t">
              <span>Regular Transaction Report</span>
              <span className="text-xs font-normal">{currentTime}</span>
            </div>
            <div className="overflow-x-auto">
              <ReportsTable data={displayData} columns={columnsRegularTransaction} />
            </div>
            {displayData && displayData.length > 0 && (
              <div className="flex flex-col items-center py-4">
                <div className="text-sm text-gray-600 mb-2">
                  Total: {((regularTransactionData as unknown as RegularTransactionApiResponse)?.count) || 0} records
                  {(search || filterBy.length > 0 || dateFilter || (customDateRange.start && customDateRange.end)) &&
                    ` | Filtered: ${displayData.length} records`}
                </div>
                
                {/* Pagination Controls */}
                <div className="flex items-center gap-2 mt-4">
                  <button
                    onClick={handlePreviousPage}
                    disabled={!hasPreviousPage}
                    className={`px-3 py-1 text-sm rounded ${
                      hasPreviousPage
                        ? 'bg-[#F25E26] text-white hover:bg-[#d63918]'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    Previous
                  </button>
                  
                  <span className="text-sm text-gray-600">
                    Page {currentPage} of {totalPages}
                  </span>
                  
                  <button
                    onClick={handleNextPage}
                    disabled={!hasNextPage}
                    className={`px-3 py-1 text-sm rounded ${
                      hasNextPage
                        ? 'bg-[#F25E26] text-white hover:bg-[#d63918]'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    Next
                  </button>
                </div>
                
                {(search || filterBy.length > 0 || dateFilter || (customDateRange.start && customDateRange.end)) && (
                  <button
                    onClick={() => {
                      setSearch('');
                      setFilterBy([]);
                      setDateFilter('');
                      setCustomDateRange({ start: '', end: '' });
                    }}
                    className="text-xs text-[#F25E26] hover:underline mt-2"
                  >
                    Clear all filters
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      <DownloadModal
        isOpen={showDownloadModal}
        onClose={() => setShowDownloadModal(false)}
        onDownloadPDF={handleDownloadPDF}
        onDownloadXLS={handleDownloadXLS}
      />
    </section>
  );
} 