"use client";
import React, { useState, useEffect } from "react";
import { ProfileHeader } from "@/app/components/Header";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import Link from "next/link";
import Image from "next/image";
import Brand from "@/app/asset/logo.svg";
import { ReportsTable } from "../dashboard/components/ReportsTable";
import { DownloadModal } from "@/app/components/DownloadModal";
import { exportToPDF, exportToXLS, exportToPDFTable, ExportData } from "@/utils/exportUtils";
import { useGetDatanew } from "@/hooks/useGetData";
import useAuthMiddleware from "@/hooks/useAuthMiddleware";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// TypeScript interfaces for API response
interface ServiceMetric {
  success?: string;
  failure?: string;
  reason?: string;
}

type ServiceUptimeData = Record<string, ServiceMetric | undefined>;

interface ServiceUptimeApiResponse {
  status: string;
  message: string;
  current_datetime: string;
  data: ServiceUptimeData;
}

export default function Page() {
  const router = useRouter();

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

  const [sortBy, setSortBy] = useState("");
  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd] = useState("");

  // Debounced filter values to avoid rapid refetches
  const [debouncedSortBy, setDebouncedSortBy] = useState("");
  const [debouncedCustomStart, setDebouncedCustomStart] = useState("");
  const [debouncedCustomEnd, setDebouncedCustomEnd] = useState("");
  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSortBy(sortBy);
      setDebouncedCustomStart(customStart);
      setDebouncedCustomEnd(customEnd);
    }, 500);
    return () => clearTimeout(t);
  }, [sortBy, customStart, customEnd]);

  const [userToken] = useState(Cookies.get("token"));
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [currentTime, setCurrentTime] = useState<string>("");

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

  // Build filter params similar to reports page
  const getFilterParams = () => {
    const params = new URLSearchParams();
    switch (debouncedSortBy) {
      case "yesterday": {
        const today = new Date();
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
        const yesterdayStr = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, "0")}-${String(yesterday.getDate()).padStart(2, "0")}`;
        params.append("filter", "custom");
        params.append("start_date", todayStr);
        params.append("end_date", yesterdayStr);
        break;
      }
      case "last_week":
        params.append("filter", "last_week");
        break;
      case "last_month":
        params.append("filter", "last_month");
        break;
      case "last_year":
        params.append("filter", "last_year");
        break;
      case "custom":
        if (debouncedCustomStart && debouncedCustomEnd) {
          params.append("filter", "custom");
          params.append("start_date", debouncedCustomStart);
          params.append("end_date", debouncedCustomEnd);
        }
        break;
      default:
        // all_time
        break;
    }
    return params.toString();
  };

  // Stable params to avoid refetch until custom range is complete
  const [stableParams, setStableParams] = useState("");
  useEffect(() => {
    const params = getFilterParams();
    const allowRefetch = !(debouncedSortBy === "custom" && (!debouncedCustomStart || !debouncedCustomEnd));
    if (allowRefetch) {
      setStableParams(params);
    }
  }, [debouncedSortBy, debouncedCustomStart, debouncedCustomEnd]);

  // API integration with params
  const url = `${process.env.NEXT_PUBLIC_BASE_URL}/admin/service_uptime_report/?${stableParams}`;
  const {
    data: serviceUptimeData,
    isLoading: serviceUptimeLoading,
    isFetching: serviceUptimeFetching,
    error: serviceUptimeError,
  } = useGetDatanew(url, "get_service_uptime", userToken || " ");

  // Prefer API time when available
  useEffect(() => {
    const apiTime = (serviceUptimeData as unknown as ServiceUptimeApiResponse)?.current_datetime;
    if (apiTime) {
      setCurrentTime(apiTime);
    }
  }, [serviceUptimeData]);

  // Transform API data to match component structure
  const transformApiData = (apiData: ServiceUptimeData): any[] => {
    if (!apiData) {
      return [];
    }

    const toTitleCase = (key: string) =>
      key
        .replace(/_/g, " ")
        .replace(/\s+/g, " ")
        .trim()
        .replace(/\b\w/g, (c) => c.toUpperCase());

    return Object.entries(apiData).map(([key, metric], index) => {
      const success = (metric?.success ?? "0").replace(/%/g, "");
      const failure = (metric?.failure ?? "0").replace(/%/g, "");
      const reason = metric?.reason ?? "N/A";
      return {
        service: toTitleCase(key),
        successrate: success,
        failurerate: failure,
        reasonforfailure: reason,
        id: String(index + 1).padStart(3, "0"),
      };
    });
  };

  const transformedData = transformApiData((serviceUptimeData as unknown as ServiceUptimeApiResponse)?.data);

  // Download handlers
  const handleDownloadPDF = async () => {
    const exportData: ExportData[] = filteredServiceUptime.map((item) => ({
      service: item.service,
      successrate: item.successrate,
      failurerate: item.failurerate,
      reasonforfailure: item.reasonforfailure,
    }));

    setShowDownloadModal(false);
    await exportToPDFTable(exportData, {
      title: "Service Uptime Report",
      fileName: "Service_Uptime_Report",
      columns: [
        { key: 'service', header: 'Service' },
        { key: 'successrate', header: 'Success Rate' },
        { key: 'failurerate', header: 'Failure Rate' },
        { key: 'reasonforfailure', header: 'Reason for Failure' },
      ],
    });
  };

  const handleDownloadXLS = () => {
    const exportData: ExportData[] = filteredServiceUptime.map((item) => ({
      service: item.service,
      successrate: item.successrate,
      failurerate: item.failurerate,
      reasonforfailure: item.reasonforfailure,
    }));

    exportToXLS(exportData, {
      title: "Service Uptime Report",
      fileName: "Service_Uptime_Report",
      columns: [
        { key: "service", header: "Service", width: 25 },
        { key: "successrate", header: "Success Rate (%)", width: 15 },
        { key: "failurerate", header: "Failure Rate (%)", width: 15 },
        { key: "reasonforfailure", header: "Reason for Failure", width: 35 },
      ],
      summaryRows: [
        { label: "Total Services", value: exportData.length },
        {
          label: "Average Success Rate",
          value: `${(
            exportData.reduce(
              (sum, item) => sum + parseFloat(item.successrate),
              0
            ) / exportData.length
          ).toFixed(1)}%`,
        },
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
    { key: "service", label: "SERVICE" },
    {
      key: "successrate",
      label: "SUCCESS RATE",
      render: (row: any) => (
        <span className="text-green-600 font-medium">{row.successrate}%</span>
      ),
    },
    {
      key: "failurerate",
      label: "FAILURE RATE",
      render: (row: any) => (
        <span className="text-red-600 font-medium">{row.failurerate}%</span>
      ),
    },
    { key: "reasonforfailure", label: "REASON FOR FAILURE" },
  ];

  // Filter and sort the data
  const getFilteredAndSortedData = () => {
    let filteredData = [...transformedData];

    // Apply search filter
    if (search) {
      filteredData = filteredData.filter(
        (item) =>
          item.service.toLowerCase().includes(search.toLowerCase()) ||
          item.reasonforfailure.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Apply filter by checkboxes
    if (filterBy.length > 0) {
      filteredData = filteredData.filter((item) => {
        return filterBy.every((filter) => {
          switch (filter) {
            case "service":
              return search
                ? item.service.toLowerCase().includes(search.toLowerCase())
                : true;
            case "reason":
              return search
                ? item.reasonforfailure
                    .toLowerCase()
                    .includes(search.toLowerCase())
                : true;
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
          case "service":
            return a.service.localeCompare(b.service);
          case "successrate":
            return parseFloat(b.successrate) - parseFloat(a.successrate);
          case "failurerate":
            return parseFloat(b.failurerate) - parseFloat(a.failurerate);
          default:
            return 0;
        }
      });
    }

    return filteredData;
  };

  const filteredServiceUptime = getFilteredAndSortedData();

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
  if (serviceUptimeLoading) {
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
              Service Uptime Report
            </h1>
          </div>
        </div>
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Loading service uptime data...</div>
        </div>
      </section>
    );
  }

  // Error state
  if (serviceUptimeError) {
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
              Service Uptime Report
            </h1>
          </div>
        </div>
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-red-600">Error loading service uptime data. Please try again.</div>
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
          <div className="flex items-center gap-2">
            <h1 className="text-[#111111] text-lg font-Poppins font-semibold">
              Service Uptime Report
            </h1>
            {serviceUptimeFetching && (
              <span className="inline-flex items-center text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded animate-pulse">Updating…</span>
            )}
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
          <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8">
            {/* Sort by section */}
            <div className="py-4 border-t border-gray-100">
              <div className="flex justify-end items-center gap-4">
                <Select value={sortBy} onValueChange={(val) => setSortBy(val)}>
                  <SelectTrigger className="h-10 w-[160px] rounded border px-3 selector">
                    <SelectValue placeholder="All Time" />
                  </SelectTrigger>
                  <SelectContent style={{ backgroundColor: '#ffffff', color: '#2A2A2A' }}>
                <SelectItem value="yesterday" className='data-[highlighted]:bg-[#FCDFD4] data-[state=checked]:bg-[#FCDFD4] data-[state=checked]:text-[#111827]'>Yesterday</SelectItem>
                    <SelectItem value="last_week" className='data-[highlighted]:bg-[#FCDFD4] data-[state=checked]:bg-[#FCDFD4] data-[state=checked]:text-[#111827]'>Last Week</SelectItem>
                    <SelectItem value="last_month" className='data-[highlighted]:bg-[#FCDFD4] data-[state=checked]:bg-[#FCDFD4] data-[state=checked]:text-[#111827]'>Last Month</SelectItem>
                    <SelectItem value="last_year" className='data-[highlighted]:bg-[#FCDFD4] data-[state=checked]:bg-[#FCDFD4] data-[state=checked]:text-[#111827]'>Last Year</SelectItem>
                    <SelectItem value="custom" className='data-[highlighted]:bg-[#FCDFD4] data-[state=checked]:bg-[#FCDFD4] data-[state=checked]:text-[#111827]'>Custom</SelectItem>
                  </SelectContent>
                </Select>
                {sortBy === "custom" && (
                  <>
                    <input
                      type="date"
                      className="border border-gray-300 rounded px-2 py-1 text-xs sm:text-sm"
                      value={customStart}
                      onChange={(e) => setCustomStart(e.target.value)}
                    />
                    <span className="mx-1 text-xs sm:text-sm">to</span>
                    <input
                      type="date"
                      className="border border-gray-300 rounded px-2 py-1 text-xs sm:text-sm"
                      value={customEnd}
                      onChange={(e) => setCustomEnd(e.target.value)}
                    />
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className=" bg-white rounded-lg shadow border mt-6 mb-12 overflow-x-scroll overflow-y-scroll px-4 md:px-14 py-4">
        <div className="flex flex-row items-center gap-4 px-4 md:px-8 pt-8 pb-2">
          <AjirobaLogo />
        </div>
        <div className="bg-[#F25E26] text-white font-Poppins font-medium px-4 md:px-8 py-2 flex items-center gap-4 text-sm rounded-t">
          <span>SERVICE UPTIME REPORT</span>
          <span className="text-xs font-normal">{currentTime}</span>
        </div>
        <div className="overflow-x-auto">
          <ReportsTable data={filteredServiceUptime} columns={columnsServiceUptime} />
        </div>
        {filteredServiceUptime && filteredServiceUptime.length > 0 && (
          <div className="flex flex-col items-center py-4">
            <div className="text-sm text-gray-600 mb-2">
              Total: {filteredServiceUptime.length} services
              {(search || filterBy.length > 0 || sort) &&
                ` | Filtered: ${filteredServiceUptime.length} services`}
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

      <DownloadModal
        isOpen={showDownloadModal}
        onClose={() => setShowDownloadModal(false)}
        onDownloadPDF={handleDownloadPDF}
        onDownloadXLS={handleDownloadXLS}
      />
    </section>
  );
}
