"use client";
import React, { useState, useEffect } from "react";
import { ProfileHeader } from "@/app/components/Header";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import Link from "next/link";
import Image from "next/image";
import Brand from "@/app/asset/logo.svg";

import { DownloadModal } from "@/app/components/DownloadModal";
import { exportToPDF, exportToXLS, ExportData } from "@/utils/exportUtils";
import { ReportsTable } from "../components/ReportsTable";

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
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [currentTime, setCurrentTime] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);

  useEffect(() => {
    setCurrentTime(
      new Date().toLocaleString("en-US", {
        year: "numeric",
        month: "short",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
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

  // Recharge Transaction Report Data (from image)
  const rechargeData = [
    {
      date: "7-Aug-2024",
      time: "6:29 PM",
      biller: "MTN",
      amountRecharge: 2000,
      commission: "2%",
      commissionProfit: 40.00,
      customerPhone: "081346719865",
      paymentChannel: "Wallet",
      id: 1,
    },
    {
      date: "17-Aug-2024",
      time: "6:29 AM",
      biller: "SMOBILE",
      amountRecharge: 2000,
      commission: "3%",
      commissionProfit: 60.00,
      customerPhone: "081246719865",
      paymentChannel: "Bank Transfer",
      id: 2,
    },
    {
      date: "23-Aug-2024",
      time: "8:29 PM",
      biller: "AIRTEL",
      amountRecharge: 2000,
      commission: "4%",
      commissionProfit: 80.00,
      customerPhone: "081646719865",
      paymentChannel: "Ajiroba Point",
      id: 3,
    },
    {
      date: "7-Sep-2024",
      time: "6:29 PM",
      biller: "GLO",
      amountRecharge: 2000,
      commission: "4%",
      commissionProfit: 80.00,
      customerPhone: "081046719865",
      paymentChannel: "Wallet",
      id: 4,
    },
  ];

  // Table columns for Recharge Transaction Report
  const columnsRecharge = [
    {
      key: "index",
      label: "S/N",
      render: (_row: any, idx: number) => (currentPage - 1) * pageSize + idx + 1,
    },
    { key: "date", label: "DATE" },
    { key: "time", label: "TIME" },
    { key: "biller", label: "BILLER" },
    { key: "amountRecharge", label: "AMOUNT RECHARGE (NGN)", sum: true },
    { key: "commission", label: "COMMISSION" },
    { key: "commissionProfit", label: "COMMISSION/PROFIT (NGN)", sum: true },
    { key: "customerPhone", label: "CUSTOMER PHONE NUMBER" },
    { key: "paymentChannel", label: "PAYMENT CHANNEL" },
  ];

  // Filter and sort the data
  const getFilteredAndSortedData = () => {
    let filteredData = [...rechargeData];

    // Apply search filter
    if (search) {
      filteredData = filteredData.filter(item =>
        item.biller.toLowerCase().includes(search.toLowerCase()) ||
        item.customerPhone.includes(search) ||
        item.paymentChannel.toLowerCase().includes(search.toLowerCase()) ||
        item.date.includes(search) ||
        item.time.includes(search)
      );
    }

    // Apply filter by checkboxes
    if (filterBy.length > 0) {
      filteredData = filteredData.filter(item => {
        return filterBy.every(filter => {
          switch (filter) {
            case 'biller':
              return search ? item.biller.toLowerCase().includes(search.toLowerCase()) : true;
            case 'paymentChannel':
              return search ? item.paymentChannel.toLowerCase().includes(search.toLowerCase()) : true;
            case 'commission':
              return search ? item.commission.includes(search) : true;
            default:
              return true;
          }
        });
      });
    }

    // Apply date filtering
    if (dateFilter) {
      const now = new Date();
      let startDate: Date | null = null;
      let endDate: Date | null = null;
      
      switch (dateFilter) {
        case 'yesterday':
          const yesterday = new Date(now);
          yesterday.setDate(yesterday.getDate() - 1);
          startDate = new Date(yesterday.setHours(0, 0, 0, 0));
          endDate = new Date(yesterday.setHours(23, 59, 59, 999));
          break;
        case 'last_week':
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          endDate = now;
          break;
        case 'last_month':
          startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          endDate = now;
          break;
        case 'last_year':
          const currentYear = now.getFullYear();
          const previousYear = currentYear - 1;
          startDate = new Date(previousYear, 0, 1);
          endDate = new Date(previousYear, 11, 31, 23, 59, 59, 999);
          break;
        case 'custom':
          if (customDateRange.start && customDateRange.end) {
            startDate = new Date(customDateRange.start);
            endDate = new Date(customDateRange.end);
            endDate.setHours(23, 59, 59, 999);
          }
          break;
        default:
          return filteredData;
      }
      
      if (startDate && endDate) {
        filteredData = filteredData.filter(item => {
          if (item.date === "N/A") return false;
          const itemDate = new Date(item.date);
          return itemDate >= startDate! && itemDate <= endDate!;
        });
      }
    }

    // Apply sorting
    if (sort) {
      filteredData.sort((a, b) => {
        switch (sort) {
          case 'date':
            if (a.date === "N/A" && b.date === "N/A") return 0;
            if (a.date === "N/A") return 1;
            if (b.date === "N/A") return -1;
            return new Date(b.date).getTime() - new Date(a.date).getTime();
          case 'amountRecharge':
            return b.amountRecharge - a.amountRecharge;
          case 'commissionProfit':
            return b.commissionProfit - a.commissionProfit;
          case 'biller':
            return a.biller.localeCompare(b.biller);
          default:
            return 0;
        }
      });
    }

    return filteredData;
  };

  const displayData = getFilteredAndSortedData();

  // Totals for summary row
  const totalAmountRecharge = displayData.reduce((sum, item) => sum + (item.amountRecharge || 0), 0);
  const totalCommissionProfit = displayData.reduce((sum, item) => sum + (item.commissionProfit || 0), 0);

  // Download handlers (PDF/XLS)
  const handleDownloadPDF = async () => {
    const exportData: ExportData[] = displayData.map((item) => ({
      date: item.date,
      time: item.time,
      biller: item.biller,
      amountRecharge: item.amountRecharge,
      commission: item.commission,
      commissionProfit: item.commissionProfit,
      customerPhone: item.customerPhone,
      paymentChannel: item.paymentChannel,
    }));
    setShowDownloadModal(false);
    await exportToPDF(exportData, {
      title: "Recharge Transaction Report - Airtime",
      fileName: "Recharge_Transaction_Report_Airtime",
    });
  };

  const handleDownloadXLS = () => {
    const exportData: ExportData[] = displayData.map((item) => ({
      date: item.date,
      time: item.time,
      biller: item.biller,
      amountRecharge: item.amountRecharge,
      commission: item.commission,
      commissionProfit: item.commissionProfit,
      customerPhone: item.customerPhone,
      paymentChannel: item.paymentChannel,
    }));
    exportToXLS(exportData, {
      title: "Recharge Transaction Report - Airtime",
      fileName: "Recharge_Transaction_Report_Airtime",
      columns: [
        { key: 'date', header: 'Date', width: 15 },
        { key: 'time', header: 'Time', width: 12 },
        { key: 'biller', header: 'Biller', width: 15 },
        { key: 'amountRecharge', header: 'Amount Recharge (NGN)', width: 20 },
        { key: 'commission', header: 'Commission', width: 12 },
        { key: 'commissionProfit', header: 'Commission/Profit (NGN)', width: 20 },
        { key: 'customerPhone', header: 'Customer Phone Number', width: 20 },
        { key: 'paymentChannel', header: 'Payment Channel', width: 18 },
      ],
      summaryRows: [
        { label: 'TOTAL', value: '' },
        { label: 'Amount Recharge', value: totalAmountRecharge.toLocaleString() },
        { label: 'Commission/Profit', value: totalCommissionProfit.toFixed(2) },
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
          <div>
            <h1 className="text-[#111111] text-lg font-Poppins font-semibold">
              Recharge Transaction Report
            </h1>
            <p className="text-[#666666] text-sm font-Poppins">
              Airtime
            </p>
          </div>
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
                    { key: 'biller', label: 'Biller' },
                    { key: 'paymentChannel', label: 'Payment Channel' },
                    { key: 'commission', label: 'Commission' }
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
              {dateFilter ? dateFilter.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'Sort by'}
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
                          setCustomDateRange({ start: '', end: '' });
                          setShowSortDropdown(false);
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

      <div className="bg-white rounded-lg shadow border mt-6 mb-12 overflow-x-scroll overflow-y-scroll px-4 md:px-14 py-4">
        <div className="flex flex-row items-center gap-4 px-4 md:px-8 pt-8 pb-2">
          <AjirobaLogo />
        </div>
        <div className="bg-[#F25E26] text-white font-Poppins font-medium px-4 md:px-8 py-2 flex items-center justify-between text-sm rounded-t">
          <span>AIRTIME TRANSACTION REPORT</span>
          <span className="text-xs font-normal">({currentTime})</span>
        </div>
        <div className="overflow-x-auto">
          <ReportsTable 
            data={displayData} 
            columns={columnsRecharge} 
            currentPage={currentPage}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
            showPagination={true}
            emptyRowCount={8}
          />
        </div>
        {displayData && displayData.length > 0 && (
          <div className="flex flex-col items-center py-4">
            <div className="text-sm text-gray-600 mb-2">
              Total: {displayData.length} records
              {(search || filterBy.length > 0 || dateFilter) &&
                ` | Filtered: ${displayData.length} records`}
            </div>
            {(search || filterBy.length > 0 || dateFilter) && (
              <button
                onClick={() => {
                  setSearch('');
                  setFilterBy([]);
                  setDateFilter('');
                  setCustomDateRange({ start: '', end: '' });
                }}
                className="text-xs text-[#F25E26] hover:underline"
              >
                Clear all filters
              </button>
            )}
          </div>
        )}
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