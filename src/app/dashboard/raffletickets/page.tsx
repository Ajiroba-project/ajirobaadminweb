"use client";
import React, { useState, useEffect } from "react";
import { ProfileHeader } from "@/app/components/Header";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import Link from "next/link";
import Image from "next/image";
import Brand from "@/app/asset/logo.svg";

import { DownloadModal } from "@/app/components/DownloadModal";
import { exportToPDF, exportToXLS, exportToPDFTable, ExportData } from "@/utils/exportUtils";
import { ReportsTable } from "../components/ReportsTable";
import RaffleTicket from "../components/RaffleTicket";
import { useGetDatanew } from "@/hooks/useGetData";
import useAuthMiddleware from "@/hooks/useAuthMiddleware";

export default function Page() {
  const router = useRouter();
  useAuthMiddleware(router);

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
  const [showTicket, setShowTicket] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [userToken] = useState(Cookies.get("token"));

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

  // API integration
  interface RaffleReportItem {
    id: string;
    raffle_details: {
      name?: string;
      phone_number?: string;
      email?: string;
      raffle_date?: string; // human-readable
      raffle_time?: string;
      ticket_no?: string;
      ticket_price?: number;
      product?: string;
      product_no?: string | null;
      winning_value?: number;
      status?: string;
      redemption_date?: string; // ISO
      purchased_date?: string; // ISO
    };
  }

  interface RaffleReportApiResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: {
      status: string;
      message: string;
      current_datetime?: string;
      data: RaffleReportItem[];
    };
  }

  const buildQueryParams = () => {
    const params = new URLSearchParams();
    if (dateFilter === "yesterday") {
      const today = new Date();
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
      const yesterdayStr = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, "0")}-${String(yesterday.getDate()).padStart(2, "0")}`;
      params.append("filter", "custom");
      params.append("start_date", todayStr);
      params.append("end_date", yesterdayStr);
    }
    else if (dateFilter === "last_week") params.append("filter", "last_week");
    else if (dateFilter === "last_month") params.append("filter", "last_month");
    else if (dateFilter === "last_year") params.append("filter", "last_year");
    else if (dateFilter === "custom" && customDateRange.start && customDateRange.end) {
      params.append("filter", "custom");
      params.append("start_date", customDateRange.start);
      params.append("end_date", customDateRange.end);
    }
    params.append("page", String(currentPage));
    return params.toString();
  };

  const url = `${process.env.NEXT_PUBLIC_BASE_URL}/admin/raffle_draw_report/?${buildQueryParams()}`;

  const { data: apiRaw, isLoading, error } = useGetDatanew(
    url,
    "get_raffle_draw_report",
    userToken || " "
  );

  const api = apiRaw as unknown as RaffleReportApiResponse | undefined;

  useEffect(() => {
    if (api?.results?.current_datetime) {
      setCurrentTime(api.results.current_datetime);
    }
  }, [api]);

  const raffleData = (api?.results?.data || []).map((item, index) => {
    const d = item.raffle_details || {};
    const id = item.id;

    return {
      id: `${item.id}-${index}`, // Ensure unique ID by combining with index
      name: d.name || "",
      phone: d.phone_number || "",
      email: d.email || "",
      drawDate: d.raffle_date || "",
      drawTime: d.raffle_time || "",
      ticketNumber: d.ticket_no || "",
      ticketAmount: Number(d.ticket_price || 0),
      product: d.product || "",
      productId: d.product_no || "",
      productno: id,
      winningValue: Number(d.winning_value || 0),
      status: d.status ? d.status.charAt(0).toUpperCase() + d.status.slice(1) : "",
      redemptionDate: d.redemption_date
        ? new Date(d.redemption_date).toLocaleDateString("en-US")
        : "N/A",
      purchasedDateISO: d.purchased_date || "",
    };
  });

  // Table columns for Raffle Winning Report
  const columnsRaffle = [
    {
      key: "index",
      label: "S/N",
      render: (_row: any, idx: number) => (currentPage - 1) * pageSize + idx + 1,
    },
    { key: "name", label: "NAME" },
    { key: "phone", label: "PHONE NUMBER" },
    { key: "email", label: "EMAIL" },
    { key: "drawDate", label: "RAFFLE DRAW DATE" },
    { key: "drawTime", label: "RAFFLE DRAW TIME" },
    {
      key: "ticketNumber",
      label: "TICKET NUMBER",
      cellClassName: "text-[#F25E26] underline cursor-pointer",
      render: (row: any) => (
        <span 
          className="text-[#F25E26] underline cursor-pointer hover:text-[#d63918]"
          onClick={() => {
            setSelectedTicket(row);
            setShowTicket(true);
          }}
        >
          {row.ticketNumber}
        </span>
      ),
    },
    { key: "ticketAmount", label: "TICKET AMOUNT (NGN)", sum: true },
    { key: "product", label: "PRODUCT" },
    {
      key: "productId",
      label: "PRODUCT ID",
      cellClassName: "text-[#F25E26] underline cursor-pointer",
     /*  render: (row: any) => (
        <span className="text-[#F25E26] underline cursor-pointer">{row.productId}</span>
      ), */
      render: (row: any) => (
        <Link
          // href={`/dashboard/productdetails-product/${row.productno}`}
          href={`/dashboard/productdetails-auction-completed/${row.productno}`}
          className="bg-[#FFFFFF] text-[#F25E26] transition delay-300 duration-300 ease-in-out hover:bg-[#F25E26] hover:text-white hover:transition-all flex gap-2 rounded-lg p-2 font-Poppins text-sm items-center"
        >
          {row.productId}
        </Link>
      ),
    },
    { key: "winningValue", label: "WINNING VALUE (NGN)", sum: true },
    { key: "status", label: "STATUS" },
    { key: "redemptionDate", label: "REDEMPTION DATE" },
  ];

  // Filter and sort the data
  const getFilteredAndSortedData = () => {
    let filteredData = [...raffleData];

    // Apply search filter
    if (search) {
      filteredData = filteredData.filter(item =>
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.phone.includes(search) ||
        item.email.toLowerCase().includes(search.toLowerCase()) ||
        item.ticketNumber.includes(search) ||
        item.product.toLowerCase().includes(search.toLowerCase()) ||
        item.productId.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Apply filter by checkboxes
    if (filterBy.length > 0) {
      filteredData = filteredData.filter(item => {
        return filterBy.every(filter => {
          switch (filter) {
            case 'name':
              return search ? item.name.toLowerCase().includes(search.toLowerCase()) : true;
            case 'product':
              return search ? item.product.toLowerCase().includes(search.toLowerCase()) : true;
            case 'productId':
              return search ? item.productId.toLowerCase().includes(search.toLowerCase()) : true;
            case 'status':
              return search ? item.status.toLowerCase().includes(search.toLowerCase()) : true;
            default:
              return true;
          }
        });
      });
    }

    // Date filtering handled by backend via query params

    // Apply sorting
    if (sort) {
      filteredData.sort((a, b) => {
        switch (sort) {
          case 'name':
            return a.name.localeCompare(b.name);
          case 'date':
            if (a.drawDate === "N/A" && b.drawDate === "N/A") return 0;
            if (a.drawDate === "N/A") return 1;
            if (b.drawDate === "N/A") return -1;
            return new Date(b.drawDate).getTime() - new Date(a.drawDate).getTime();
          case 'ticketAmount':
            return b.ticketAmount - a.ticketAmount;
          case 'winningValue':
            return b.winningValue - a.winningValue;
          default:
            return 0;
        }
      });
    }

    return filteredData;
  };

  const displayData = getFilteredAndSortedData();

  // Totals for summary row
  const totalTicketAmount = displayData.reduce((sum, item) => sum + (item.ticketAmount || 0), 0);
  const totalWinningValue = displayData.reduce((sum, item) => sum + (item.winningValue || 0), 0);

  // Download handlers (PDF/XLS)
  const handleDownloadPDF = async () => {
    const exportData: ExportData[] = displayData.map((item) => ({
      name: item.name,
      phone: item.phone,
      email: item.email,
      drawDate: item.drawDate,
      drawTime: item.drawTime,
      ticketNumber: item.ticketNumber,
      ticketAmount: item.ticketAmount,
      product: item.product,
      productId: item.productId,
      winningValue: item.winningValue,
      status: item.status,
      redemptionDate: item.redemptionDate,
    }));
    setShowDownloadModal(false);
    await exportToPDFTable(exportData, {
      title: "Raffle Winning Report",
      fileName: "Raffle_Winning_Report",
      columns: [
        { key: 'name', header: 'Name' },
        { key: 'phone', header: 'Phone' },
        { key: 'email', header: 'Email' },
        { key: 'drawDate', header: 'Draw Date' },
        { key: 'drawTime', header: 'Draw Time' },
        { key: 'ticketNumber', header: 'Ticket Number' },
        { key: 'ticketAmount', header: 'Ticket Amount' },
        { key: 'product', header: 'Product' },
        { key: 'productId', header: 'Product ID' },
        { key: 'winningValue', header: 'Winning Value' },
        { key: 'status', header: 'Status' },
        { key: 'redemptionDate', header: 'Redemption Date' },
      ],
    });
  };

  const handleDownloadXLS = () => {
    const exportData: ExportData[] = displayData.map((item) => ({
      name: item.name,
      phone: item.phone,
      email: item.email,
      drawDate: item.drawDate,
      drawTime: item.drawTime,
      ticketNumber: item.ticketNumber,
      ticketAmount: item.ticketAmount,
      product: item.product,
      productId: item.productId,
      winningValue: item.winningValue,
      status: item.status,
      redemptionDate: item.redemptionDate,
    }));
    exportToXLS(exportData, {
      title: "Raffle Winning Report",
      fileName: "Raffle_Winning_Report",
      columns: [
        { key: 'name', header: 'Name', width: 20 },
        { key: 'phone', header: 'Phone Number', width: 15 },
        { key: 'email', header: 'Email', width: 25 },
        { key: 'drawDate', header: 'Raffle Draw Date', width: 15 },
        { key: 'drawTime', header: 'Raffle Draw Time', width: 12 },
        { key: 'ticketNumber', header: 'Ticket Number', width: 15 },
        { key: 'ticketAmount', header: 'Ticket Amount (NGN)', width: 15 },
        { key: 'product', header: 'Product', width: 15 },
        { key: 'productId', header: 'Product ID', width: 12 },
        { key: 'winningValue', header: 'Winning Value (NGN)', width: 18 },
        { key: 'status', header: 'Status', width: 20 },
        { key: 'redemptionDate', header: 'Redemption Date', width: 15 },
      ],
      summaryRows: [
        { label: 'TOTAL', value: '' },
        { label: 'Ticket Amount', value: totalTicketAmount },
        { label: 'Winning Value', value: totalWinningValue.toLocaleString() },
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
          <h1 className="text-[#111111] text-lg font-Poppins font-semibold">
            Raffle Winning Report
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
                    { key: 'name', label: 'Name' },
                    { key: 'product', label: 'Product' },
                    { key: 'productId', label: 'Product ID' },
                    { key: 'status', label: 'Status' }
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
          <span>RAFFLE WINNING REPORT</span>
          <span className="text-xs font-normal">({currentTime})</span>
        </div>
        <div className="overflow-x-auto">
          <ReportsTable 
            data={displayData} 
            columns={columnsRaffle} 
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
      {showTicket && selectedTicket && (
        <RaffleTicket
          onClose={() => setShowTicket(false)}
          ticket_number={selectedTicket.ticketNumber || 'N/A'}
          ticket_price={selectedTicket.ticketAmount || 'N/A'}
          purchase_date={selectedTicket.drawDate || 'N/A'}
          product={selectedTicket.product || 'N/A'}
          raffle_date={selectedTicket.drawDate || 'N/A'}
          raffle_time={selectedTicket.drawTime || 'N/A'}
        />
      )}
    </section>
  );
} 