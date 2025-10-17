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
import { useGetDatanew } from "@/hooks/useGetData";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import axios from "axios";
import useAuthMiddleware from "@/hooks/useAuthMiddleware";

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
  const [genderFilter, setGenderFilter] = useState("");

  const [userToken] = useState(Cookies.get("token"));
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [currentTime, setCurrentTime] = useState<string>("");
  const [hasNext, setHasNext] = useState(false);
  const [hasPrev, setHasPrev] = useState(false);

  useAuthMiddleware(router);

  // Build query params for backend filtering
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
    } else if (dateFilter === "last_week") params.append("filter", "last_week");
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

  const paramsString = buildQueryParams();
  const isClient = typeof window !== 'undefined';
  const enabled = (isClient && !!userToken) && (dateFilter !== 'custom' || (customDateRange.start && customDateRange.end));

  type CustomerApiItem = {
    id: string;
    customer_details: {
      customer_name?: string;
      waller_balance?: number;
      phone_no?: string;
      email?: string;
      gender?: boolean;
      address?: string;
      state?: string;
      user_id?: string;
      signup_date?: string;
    };
  };

  interface CustomerApiResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: {
      status: string;
      message: string;
      current_datetime?: string;
      data: CustomerApiItem[];
    };
  }

  const { data: apiRaw, isLoading, isFetching, error } = useQuery({
    queryKey: ["get_customer_statistics_report", paramsString],
    queryFn: async () => {
      const url = `${process.env.NEXT_PUBLIC_BASE_URL}/admin/customer_statistics_report/?${paramsString}`;
      const response = await axios.get(url, {
        headers: {
          Authorization: `Token ${userToken}`
        }
      });
      return response.data;
    },
    refetchOnWindowFocus: false,
    staleTime: 5000,
    placeholderData: keepPreviousData,
    enabled: !!enabled,
  });

  const api = apiRaw as unknown as CustomerApiResponse | undefined;

  // Update header time and pagination flags when API changes
  useEffect(() => {
    if (api?.results?.current_datetime) {
      setCurrentTime(api.results.current_datetime);
    }
    setHasNext(Boolean(api?.next));
    setHasPrev(Boolean(api?.previous));
  }, [api]);

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

  // --- Replace the filteredRegularCustomers and columnsRegular with customer-centric data and columns ---

  const customerData = (api?.results?.data || []).map((item) => {
    const d = item.customer_details || {};
    const genderStr = d.gender === true ? "Male" : d.gender === false ? "Female" : "N/A";
    // Keep ISO for potential sorting; render formatted in UI via column render if needed
    const isoDate = d.signup_date || "";
    const displayDate = isoDate
      ? new Date(isoDate).toLocaleString("en-US", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        })
      : "";
    return {
      customername: d.customer_name || "",
      walletbalance: Number(d.waller_balance || 0),
      phonenumber: d.phone_no || "",
      email: d.email || "",
      gender: genderStr.toLowerCase(),
      address: d.address || "",
      state: d.state || "",
      userid: d.user_id || "",
      signupdatetime: displayDate,
      signupdateISO: isoDate,
    } as any;
  });

  const columns = [
    { key: "index", label: "S/N", render: (_: any, idx: number) => idx + 1 },
    { key: "customername", label: "CUSTOMER NAME" },
    { key: "walletbalance", label: "WALLET BALANCE (₦)", render: (row: any) => row.walletbalance.toLocaleString() },
    { key: "phonenumber", label: "PHONE NUMBER" },
    { key: "email", label: "EMAIL" },
    { key: "gender", label: "GENDER" },
    { key: "address", label: "ADDRESS" },
    { key: "state", label: "STATE" },
    { key: "userid", label: "USER ID" },
    { key: "signupdatetime", label: "SIGN UP DATE & TIME" },
  ];

  

//   // --- Update search and sort logic for new data ---
//   const getFilteredAndSortedData = () => {
//     let filteredData = [...customerData];
//     if (search) {
//       filteredData = filteredData.filter(item =>
//         item.customername.toLowerCase().includes(search.toLowerCase()) ||
//         item.email.toLowerCase().includes(search.toLowerCase()) ||
//         item.phonenumber.includes(search) ||
//         item.userid.toLowerCase().includes(search.toLowerCase())
//       );
//     }
//     if (sort) {
//       filteredData.sort((a, b) => {
//         switch (sort) {
//           case 'name':
//             return a.customername.localeCompare(b.customername);
//           case 'wallet':
//             return b.walletbalance - a.walletbalance;
//           case 'date':
//             return new Date(b.signupdatetime).getTime() - new Date(a.signupdatetime).getTime();
//           default:
//             return 0;
//         }
//       });
//     }
//     return filteredData;
//   };

//   const displayData = getFilteredAndSortedData();

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

  // Filter and sort the data
  const getFilteredAndSortedData = () => {
    let filteredData = [...customerData];

    // Apply search filter
    if (search) {
      filteredData = filteredData.filter(item =>
        item.customername.toLowerCase().includes(search.toLowerCase()) ||
        item.email.toLowerCase().includes(search.toLowerCase()) ||
        item.phonenumber.includes(search) ||
        item.userid.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Apply gender filter if enabled
    if (filterBy.includes('gender') && genderFilter) {
      filteredData = filteredData.filter(item => item.gender.toLowerCase() === genderFilter.toLowerCase());
    }

    // Date filtering moved to backend; no client-side date filtering

    // Apply sorting
    if (sort) {
      filteredData.sort((a, b) => {
        switch (sort) {
          case 'name':
            return a.customername.localeCompare(b.customername);
          case 'date':
            return new Date(b.signupdatetime).getTime() - new Date(a.signupdatetime).getTime();
          default:
            return 0;
        }
      });
    }

    return filteredData;
  };

  const displayData = getFilteredAndSortedData();
  const totalWallet = displayData.reduce((sum, item) => sum + (Number(item.walletbalance) || 0), 0);


  // Download handlers
  const handleDownloadPDF = async () => {
    try {
      setShowDownloadModal(false);

      // Fetch all pages to export full dataset
      const allRows: any[] = [];
      const baseUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/admin/customer_statistics_report/`;
      let nextUrl: string | null = `${baseUrl}?${paramsString}`;
      const headers = { headers: { Authorization: `Token ${userToken}` } } as const;

      for (let i = 0; i < 200 && nextUrl; i++) {
        const resp: any = await axios.get(nextUrl, headers);
        const res: any = resp.data;
        const pageItems: any[] = res?.results?.data || [];

        // Map API items to export rows
        pageItems.forEach((item) => {
          const d = (item.customer_details || {}) as any;
          const genderStr = d.gender === true ? "Male" : d.gender === false ? "Female" : "N/A";
          const isoDate = d.signup_date || "";
          const displayDate = isoDate
            ? new Date(isoDate).toLocaleString("en-US", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
              })
            : "";

          allRows.push({
            customername: d.customer_name || "",
            walletbalance: Number(d.waller_balance || 0),
            phonenumber: d.phone_no || "",
            email: d.email || "",
            gender: genderStr.toLowerCase(),
            address: d.address || "",
            state: d.state || "",
            userid: d.user_id || "",
            signupdatetime: displayDate,
          });
        });

        nextUrl = res?.next || null;
      }

      if (allRows.length === 0) {
        alert("No data available to export");
        return;
      }

      // Convert to ExportData list with human-friendly headers
      const exportData: ExportData[] = allRows.map((row, idx) => ({
        S_N: idx + 1,
        Customer_Name: row.customername,
        Wallet_Balance: row.walletbalance,
        Phone_Number: row.phonenumber,
        Email: row.email,
        Gender: row.gender,
        Address: row.address,
        State: row.state,
        User_ID: row.userid,
        Sign_Up_Date_Time: row.signupdatetime,
      }));

      await exportToPDFTable(exportData, {
        title: "Customer Statistics Report",
        fileName: "Customer_Statistics_Report",
        columns: [
          { key: 'S_N', header: 'S/N' },
          { key: 'Customer_Name', header: 'Customer Name' },
          { key: 'Wallet_Balance', header: 'Wallet Balance (₦)' },
          { key: 'Phone_Number', header: 'Phone Number' },
          { key: 'Email', header: 'Email' },
          { key: 'Gender', header: 'Gender' },
          { key: 'Address', header: 'Address' },
          { key: 'State', header: 'State' },
          { key: 'User_ID', header: 'User ID' },
          { key: 'Sign_Up_Date_Time', header: 'Sign Up Date & Time' },
        ],
      });
    } catch (err) {
      alert('Failed to prepare PDF export.');
    }
  };

  const handleDownloadXLS = async () => {
    try {
      setShowDownloadModal(false);

      // Fetch all pages
      const allRows: any[] = [];
      const baseUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/admin/customer_statistics_report/`;
      let nextUrl: string | null = `${baseUrl}?${paramsString}`;
      const headers = { headers: { Authorization: `Token ${userToken}` } } as const;

      for (let i = 0; i < 200 && nextUrl; i++) {
        const resp: any = await axios.get(nextUrl, headers);
        const res: any = resp.data;
        const pageItems: any[] = res?.results?.data || [];
        pageItems.forEach((item) => {
          const d = (item.customer_details || {}) as any;
          const genderStr = d.gender === true ? "Male" : d.gender === false ? "Female" : "N/A";
          const isoDate = d.signup_date || "";
          const displayDate = isoDate
            ? new Date(isoDate).toLocaleString("en-US", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
              })
            : "";
          allRows.push({
            customername: d.customer_name || "",
            walletbalance: Number(d.waller_balance || 0),
            phonenumber: d.phone_no || "",
            email: d.email || "",
            gender: genderStr.toLowerCase(),
            address: d.address || "",
            state: d.state || "",
            userid: d.user_id || "",
            signupdatetime: displayDate,
          });
        });
        nextUrl = res?.next || null;
      }

      if (allRows.length === 0) {
        alert('No data available to export');
        return;
      }

      const exportData: ExportData[] = allRows.map((item, idx) => ({
        S_N: idx + 1,
        Customer_Name: item.customername,
        Wallet_Balance: item.walletbalance,
        Phone_Number: item.phonenumber,
        Email: item.email,
        Gender: item.gender,
        Address: item.address,
        State: item.state,
        User_ID: item.userid,
        Sign_Up_Date_Time: item.signupdatetime,
      }));

      exportToXLS(exportData, {
        title: "Customer Statistics Report",
        fileName: "Customer_Statistics_Report",
        columns: [
          { key: 'S_N', header: 'S/N', width: 8 },
          { key: 'Customer_Name', header: 'Customer Name', width: 20 },
          { key: 'Wallet_Balance', header: 'Wallet Balance (₦)', width: 18 },
          { key: 'Phone_Number', header: 'Phone Number', width: 15 },
          { key: 'Email', header: 'Email', width: 25 },
          { key: 'Gender', header: 'Gender', width: 10 },
          { key: 'Address', header: 'Address', width: 30 },
          { key: 'State', header: 'State', width: 12 },
          { key: 'User_ID', header: 'User ID', width: 12 },
          { key: 'Sign_Up_Date_Time', header: 'Sign Up Date & Time', width: 20 },
        ],
        summaryRows: [
          { label: 'Total Wallet Balance', value: `₦${allRows.reduce((sum, r) => sum + Number(r.walletbalance || 0), 0).toLocaleString()}` },
          { label: 'Total Records', value: exportData.length },
          { label: 'Generated', value: new Date().toLocaleString() },
        ]
      });
    } catch (err) {
      alert('Failed to prepare Excel export.');
    }
  };

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
          <div className="flex items-center gap-3">
            <h1 className="text-[#111111] text-lg font-Poppins font-semibold">
              Customer Statistics Report
            </h1>
            {isFetching && (
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

      <div className=" bg-white rounded-lg shadow border mt-6 mb-12 overflow-x-scroll px-4 md:px-14 py-4">
        <div className="flex flex-row items-center gap-4 px-4 md:px-8 pt-8 pb-2">
          <AjirobaLogo />
        </div>
        <div className="bg-[#F25E26] text-white font-Poppins font-medium px-4 md:px-8 py-2 flex items-center text-sm rounded-t">
          Customer Statistics Report
          <span className="ml-4 text-xs font-normal">{currentTime}</span>
        </div>
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="flex justify-center items-center py-12">Loading...</div>
          ) : error ? (
            <div className="flex justify-center items-center py-12 text-red-600">Error loading data.</div>
          ) : (
          <table className="min-w-full border text-xs md:text-sm table-auto">
            <thead>
              <tr>
                {columns.map(col => (
                  <th key={col.key} className="border px-2 py-2 font-semibold whitespace-nowrap bg-gray-50">{col.label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {displayData.map((row, idx) => (
                <tr key={idx}>
                  {columns.map((col, cidx) => (
                    <td key={col.key} className="border px-2 py-2 whitespace-nowrap">
                      {col.render ? col.render(row, idx) : row[col.key as keyof typeof row]}
                    </td>
                  ))}
                </tr>
              ))}
              {/* Empty rows for up to 8 rows as in the image */}
              {Array.from({ length: Math.max(0, 8 - displayData.length) }).map((_, i) => (
                <tr key={`empty-${i}`}>
                  {columns.map((col, cidx) => (
                    <td key={col.key} className="border px-2 py-2 whitespace-nowrap">&nbsp;</td>
                  ))}
                </tr>
              ))}
              {/* Total row */}
              <tr>
                <td className="border px-2 py-2 font-bold" colSpan={2}>TOTAL</td>
                <td className="border px-2 py-2 font-bold">{totalWallet.toLocaleString()}</td>
                {columns.slice(3).map((col, cidx) => (
                  <td key={col.key} className="border px-2 py-2">&nbsp;</td>
                ))}
              </tr>
            </tbody>
          </table>
          )}
        </div>
        {/* Pagination Controls */}
        <div className="flex justify-between items-center mt-4">
          <button
            className="px-3 py-1 border rounded disabled:opacity-50"
            disabled={!hasPrev || currentPage <= 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          >
            Previous
          </button>
          <div className="text-sm text-gray-600">Page {currentPage}</div>
          <button
            className="px-3 py-1 border rounded disabled:opacity-50"
            disabled={!hasNext}
            onClick={() => setCurrentPage((p) => p + 1)}
          >
            Next
          </button>
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