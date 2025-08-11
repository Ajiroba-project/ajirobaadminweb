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
import { exportToPDF, exportToXLS, ExportData } from "@/utils/exportUtils";
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
  const [customDateRange, setCustomDateRange] = useState({
    start: "",
    end: "",
  });
  const [showCustomDatePicker, setShowCustomDatePicker] = useState(false);

  const [userToken] = useState(Cookies.get("token"));
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [currentTime, setCurrentTime] = useState<string>("");

  // Build query params and fetch API
  const buildQueryParams = () => {
    const params = new URLSearchParams();
    if (sort === "last_week") params.append("filter", "last_week");
    else if (sort === "last_month") params.append("filter", "last_month");
    else if (sort === "last_year") params.append("filter", "last_year");
    else if (sort === "custom" && customDateRange.start && customDateRange.end) {
      params.append("filter", "custom");
      params.append("start_date", customDateRange.start);
      params.append("end_date", customDateRange.end);
    }
    return params.toString();
  };

  const url = `${process.env.NEXT_PUBLIC_BASE_URL}/admin/revenue_summary_report/?${buildQueryParams()}`;

  type RevenueCategory = { gtv?: number; profit?: number } | undefined;
  interface RevenueApiResponse {
    status: string;
    message: string;
    current_datetime?: string;
    data?: Record<string, RevenueCategory>;
  }

  const { data: apiRaw, isLoading, error } = useGetDatanew(
    url,
    "get_revenue_summary_report",
    userToken || " "
  );

  const api = apiRaw as unknown as RevenueApiResponse | undefined;

  useEffect(() => {
    if (api?.current_datetime) {
      setCurrentTime(api.current_datetime);
    }
  }, [api]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (
        !target.closest(".filter-dropdown") &&
        !target.closest(".sort-dropdown")
      ) {
        setShowFilterDropdown(false);
        setShowSortDropdown(false);
        setShowCustomDatePicker(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Download handlers
  const handleDownloadPDF = async () => {
    const exportData: ExportData[] = displayData.map((item) => ({
      items: item.items,
      gross: item.gross,
      profit: item.profit,
    }));

    setShowDownloadModal(false);
    await exportToPDF(exportData, {
      title: "Revenue Summary Report",
      fileName: "Service_Uptime_Report",
    });
  };

  const handleDownloadXLS = () => {
    const exportData: ExportData[] = displayData.map((item) => ({
      items: item.items,
      gross: item.gross,
      profit: item.profit,
    }));

    exportToXLS(exportData, {
      title: "Revenue Summary Report",
      fileName: "Service_Uptime_Report",
      columns: [
        { key: "items", header: "Items", width: 25 },
        { key: "gross", header: "Gross (₦)", width: 15 },
        { key: "profit", header: "Profit (₦)", width: 15 },
      ],
      summaryRows: [
        { label: "Total Services", value: exportData.length },
        { label: "Generated", value: new Date().toLocaleString() },
      ],
    });
    setShowDownloadModal(false);
  };

  const columnsServiceUptime = [
    {
      key: "index",
      label: "S/N",
      render: (row: any, idx: number) => (currentPage - 1) * pageSize + idx + 1,
    },
    { key: "items", label: "ITEMS" },
    {
      key: "gross",
      label: "GROSS TRANSACTION VOLUME (GTV) (₦)",
      sum: true,
    },
    { key: "profit", label: "Profit (₦)", sum: true },
  ];

  const toTitle = (s: string) => s.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  const filteredServiceUptime = React.useMemo(() => {
    const rows: { items: string; gross: number; profit: number }[] = [];
    const data = api?.data || {};
    Object.entries(data).forEach(([key, val]) => {
      if (key === "total") return; // skip total row
      const gtv = Number(val?.gtv || 0);
      const profit = Number(val?.profit || 0);
      rows.push({ items: toTitle(key), gross: gtv, profit });
    });
    return rows;
  }, [api]);

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

  // Filter and sort the data (search only; date filtering is handled by backend)
  const getFilteredAndSortedData = () => {
    let filteredData = [...filteredServiceUptime];

    // Apply search filter (search all columns)
    if (search) {
      filteredData = filteredData.filter(
        (item) =>
          item.items.toLowerCase().includes(search.toLowerCase()) ||
          item.gross.toString().includes(search) ||
          item.profit.toString().includes(search)
      );
    }

    // Apply filter by checkboxes (only 'items' for now)
    if (filterBy.length > 0) {
      filteredData = filteredData.filter((item) => {
        return filterBy.every((filter) => {
          switch (filter) {
            case "items":
              return search
                ? item.items.toLowerCase().includes(search.toLowerCase())
                : true;
            default:
              return true;
          }
        });
      });
    }

    // No client-side date filtering

    return filteredData;
  };

  const displayData = getFilteredAndSortedData();

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
            Revenue Summary Report
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
       

          {/* Sort by dropdown */}
          <div className="relative sort-dropdown">
            <button
              onClick={() => setShowSortDropdown(!showSortDropdown)}
              className="w-full md:w-auto px-4 py-2 border border-[#E9E9E9] rounded-md bg-white text-[#353131] text-sm font-Poppins focus:outline-none focus:ring-2 focus:ring-[#F25E26] flex items-center justify-between min-w-[120px]"
            >
              Date Range
              <svg
                className={`ml-2 h-4 w-4 transition-transform ${
                  showSortDropdown ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {showSortDropdown && (
              <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-[#E9E9E9] rounded-md shadow-lg z-10">
                <div className="p-2 space-y-1">
                  {[
                    { value: "last_week", label: "Last Week" },
                    { value: "last_month", label: "Last Month" },
                    { value: "last_year", label: "Last Year" },
                    { value: "custom", label: "Custom" },
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        setSort(option.value);
                        setShowSortDropdown(false);
                        if (option.value !== "custom") setShowCustomDatePicker(false);
                        if (option.value === "custom") setShowCustomDatePicker(true);
                      }}
                      className={`w-full text-left px-3 py-2 text-sm rounded hover:bg-gray-50 ${
                        sort === option.value
                          ? "bg-[#F25E26] text-white"
                          : "text-[#353131]"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                  {sort && (
                    <div className="pt-2 border-t border-gray-200">
                      <button
                        onClick={() => {
                          setSort("");
                          setShowSortDropdown(false);
                          setShowCustomDatePicker(false);
                          setCustomDateRange({ start: "", end: "" });
                        }}
                        className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded"
                      >
                        Clear date range
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          {showCustomDatePicker && (
            <div className="flex gap-2 items-center mt-2">
              <input
                type="date"
                value={customDateRange.start}
                onChange={(e) => setCustomDateRange({ ...customDateRange, start: e.target.value })}
                className="border rounded px-2 py-1 text-sm"
              />
              <span>to</span>
              <input
                type="date"
                value={customDateRange.end}
                onChange={(e) => setCustomDateRange({ ...customDateRange, end: e.target.value })}
                className="border rounded px-2 py-1 text-sm"
              />
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-center ">
        <div className="w-7/12 ">
          <div className=" bg-white rounded-lg shadow border mt-6 mb-12 overflow-x-scroll overflow-y-scroll  py-4">
            <div className="flex flex-row items-center gap-4 px-4 md:px-8 pt-8 pb-2">
              <AjirobaLogo />
            </div>
            <div className="bg-[#F25E26] text-white font-Poppins font-medium px-4 md:px-8 py-2 flex items-center justify-between text-sm rounded-t">
              <span>Revenue Summary Report</span>
              <span className="text-xs font-normal">{currentTime}</span>
            </div>
            <div className="overflow-x-auto">
              <ReportsTable data={displayData} columns={columnsServiceUptime} />
            </div>
            {displayData && displayData.length > 0 && (
              <div className="flex flex-col items-center py-4">
                <div className="text-sm text-gray-600 mb-2">
                  Total: {displayData.length} services
                  {(search || filterBy.length > 0 || sort) &&
                    ` | Filtered: ${displayData.length} services`}
                </div>
                {(search || filterBy.length > 0 || sort) && (
                  <button
                    onClick={() => {
                      setSearch("");
                      setFilterBy([]);
                      setSort("");
                    }}
                    className="text-xs text-[#F25E26] hover:underline"
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
