"use client";
import React, { useState, useEffect, useMemo } from "react";
import { ProfileHeader } from "@/app/components/Header";
import { useRouter, useSearchParams } from "next/navigation";
import Cookies from "js-cookie";
import Link from "next/link";
import Image from "next/image";
import Brand from "@/app/asset/logo.svg";
import axios from "axios";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { DownloadModal } from "@/app/components/DownloadModal";
import { exportToPDF, exportToXLS, exportToPDFTable, ExportData } from "@/utils/exportUtils";
import { ReportsTable } from "../components/ReportsTable";
import useAuthMiddleware from "@/hooks/useAuthMiddleware";




function RechargeReportPage() {
  const router = useRouter();
  useAuthMiddleware(router);
  const searchParams = useSearchParams();
 
  const token = Cookies.get('token')


  const [search, setSearch] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [filterBy, setFilterBy] = useState<string[]>([]);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [customDateRange, setCustomDateRange] = useState({ start: '', end: '' });
  const [showCustomDatePicker, setShowCustomDatePicker] = useState(false);
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [currentTime, setCurrentTime] = useState<string>("");

  const [serverPage, setServerPage] = useState<number>(1);

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
      if (!target.closest('.filter-dropdown') && !target.closest('.sort-dropdown') && !target.closest('.custom-date-picker')) {
        setShowFilterDropdown(false);
        setShowSortDropdown(false);
        setShowCustomDatePicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Determine report type from query param
  const typeParam = (searchParams.get("type") || "airtime").toLowerCase();
  const typeLabel = useMemo(() => {
    if (typeParam === "data") return "Data";
    if (typeParam === "electricity") return "Electricity";
    if (typeParam === "cable") return "Cable Subscription";
    return "Airtime";
  }, [typeParam]);

  // Build API base URL based on type
  const baseUrl = useMemo(() => {
    switch (typeParam) {
      case "airtime":
        return `${process.env.NEXT_PUBLIC_BASE_URL}/admin/airtime_transaction_report/`;
      case "data":
        return `${process.env.NEXT_PUBLIC_BASE_URL}/admin/data_transaction_report/`;
      case "electricity":
        return `${process.env.NEXT_PUBLIC_BASE_URL}/admin/electricity_transaction_report/`;
      case "cable":
        return `${process.env.NEXT_PUBLIC_BASE_URL}/admin/cable_transaction_report/`;
      default:
        return `${process.env.NEXT_PUBLIC_BASE_URL}/admin/airtime_transaction_report/`;
    }
  }, [typeParam]);

  // Compute filter params for API
  const buildQueryString = () => {
    const params = new URLSearchParams();
    if (dateFilter === "last_week" || dateFilter === "last_month" || dateFilter === "last_year") {
      params.append("filter", dateFilter);
    } else if (dateFilter === "custom") {
      if (customDateRange.start && customDateRange.end) {
        params.append("filter", "custom");
        params.append("start_date", customDateRange.start);
        params.append("end_date", customDateRange.end);
      }
    } else if (dateFilter === "yesterday") {
      const y = new Date();
      y.setDate(y.getDate() - 1);
      const yyyy = y.getFullYear();
      const mm = String(y.getMonth() + 1).padStart(2, "0");
      const dd = String(y.getDate()).padStart(2, "0");
      const dstr = `${yyyy}-${mm}-${dd}`;
      params.append("filter", "custom");
      params.append("start_date", dstr);
      params.append("end_date", dstr);
    }
    params.append("page", String(serverPage));
    return params.toString();
  };

  // token already ensured above

  // React Query fetcher with Suspense
  const fetchRechargeReport = async () => {
    try {
      // Get fresh token from cookies
      const currentToken = Cookies.get('token');


      if (!currentToken || currentToken.trim() === '') {
     
        // console.log('Available cookies:', document.cookie);
        
        if (typeof window !== 'undefined') {
          router.push("/signin");
        }
        throw new Error("No authentication token found. Please sign in.");
      }
      
      const finalUrl = `${baseUrl}?${buildQueryString()}`;
      const resp = await axios.get(finalUrl, { headers: { Authorization: `Token ${currentToken}` } });
      const root = resp.data || {};
      const wrapper = root.results ? root : { count: root.count, next: root.next, previous: root.previous, results: root };
      const results = wrapper.results || {};

      const dataArray: any[] = Array.isArray(results.data) ? results.data : [];
      const rows = dataArray.map((item: any, idx: number) => {
        const core = item.airtime_transactions || item.data_transactions || item.electricity_transactions || item.electicity_transactions || item.cable_transactions || item;
        return {
          id: item.id || idx,
          date: core?.date ?? "N/A",
          time: core?.time ?? "N/A",
          biller: core?.biller ?? "N/A",
          amount: Number(core?.amount ?? 0),
          commission: core?.commission ?? "0%",
          commission_profit: Number(core?.commission_profit ?? 0),
          phone_number: core?.phone_number ?? "N/A",
          channel: core?.channel ?? "N/A",
          token: core?.token,
          meter_type: core?.meter_type,
          iuc_number: core?.iuc_number,
        };
      });

      return {
        rows,
        count: wrapper.count || (results.data ? results.data.length : 0) || 0,
        next: wrapper.next || null,
        previous: wrapper.previous || null,
        current_datetime: results.current_datetime,
        total: results.total || null,
      } as const;
    } catch (error: any) {
      if (error.response?.status === 401) {
        // Token is invalid or expired, redirect to login
        if (typeof window !== 'undefined') {
          Cookies.remove("token");
          router.push("/signin");
        }
        throw new Error("Authentication failed. Please sign in again.");
      }
      throw error;
    }
  };

  type RechargeQueryResult = {
    rows: any[];
    count: number;
    next: string | null;
    previous: string | null;
    current_datetime?: string;
    total: { total_amount?: number; total_commission?: number } | null;
  };

  // Check if we're on the client side and have a token before running the query
  const isClient = typeof window !== 'undefined';
  const hasToken = isClient && Cookies.get('token');

  const filterParams = buildQueryString();
  const enabled = (isClient && !!hasToken) && (dateFilter !== 'custom' || (customDateRange.start && customDateRange.end));

  const { data: queryData, error, isLoading, isFetching } = useQuery<RechargeQueryResult>({
    queryKey: ["recharge-report", typeParam, filterParams, serverPage] as const,
    queryFn: fetchRechargeReport,
    retry: false, // Don't retry on auth errors
    refetchOnWindowFocus: false,
    placeholderData: keepPreviousData,
    enabled: !!enabled,
  });

  // All hooks must be called before any conditional returns
  useEffect(() => {
    const anyData: any = queryData as any;
    if (anyData?.current_datetime) setCurrentTime(anyData.current_datetime);
  }, [queryData]);

  // Reset to page 1 when type changes
  useEffect(() => {
    setServerPage(1);
  }, [typeParam]);

  // Table columns based on type
  const columnsRecharge = useMemo(() => {
    const base = [
      {
        key: "index",
        label: "S/N",
        render: (_row: any, idx: number) => idx + 1,
      },
      { key: "date", label: "DATE" },
      { key: "time", label: "TIME" },
      { key: "biller", label: "BILLER" },
      { key: "amount", label: "AMOUNT (NGN)", sum: true },
      { key: "commission", label: "COMMISSION" },
      { key: "commission_profit", label: "COMMISSION/PROFIT (NGN)", sum: true },
      { key: "phone_number", label: "CUSTOMER PHONE NUMBER" },
      { key: "channel", label: "PAYMENT CHANNEL" },
    ];
    if (typeParam === "electricity") {
      base.splice(8, 0, { key: "meter_type", label: "METER TYPE" } as any);
      base.splice(8, 0, { key: "token", label: "TOKEN" } as any);
    }
    if (typeParam === "cable") {
      base.splice(8, 0, { key: "iuc_number", label: "IUC NUMBER" } as any);
    }
    return base;
  }, [typeParam]);

  // Show loading state if not on client, no token, or query is loading
  if (!isClient || !hasToken || isLoading) {
    return <div className="w-full py-8 text-center text-sm text-gray-600">Loading...</div>;
  }

  // Handle authentication errors
  if (error) {
    // console.log('Query error:', error);
    if (typeof window !== 'undefined') {
      // router.push("/signin");
      alert('An error occurred while fetching the data. Please try again later.');
      router.push("/dashboard/reports");
    }
    return <div className="w-full py-8 text-center text-sm text-red-600">Authentication failed. Redirecting to sign in...</div>;
  }

  // Filter the data locally (search + filterBy)
  const getFilteredAndSortedData = () => {
    const anyData: any = queryData as any;
    let filteredData = [...((anyData?.rows) || [])];

    // Apply search filter
    if (search) {
      filteredData = filteredData.filter(item =>
        (item.biller || "").toLowerCase().includes(search.toLowerCase()) ||
        (item.phone_number || "").includes(search) ||
        (item.channel || "").toLowerCase().includes(search.toLowerCase()) ||
        item.date.includes(search) ||
        item.time.includes(search)
      );
    }

    // Apply filter by checkboxes - these work independently of search
    if (filterBy.length > 0) {
      filteredData = filteredData.filter(item => {
        return filterBy.some(filter => {
          switch (filter) {
            case 'biller':
              // Show all items with biller information
              return item.biller && item.biller !== 'N/A';
            case 'paymentChannel':
              // Show all items with payment channel information
              return item.channel && item.channel !== 'N/A';
            case 'commission':
              // Show all items with commission information (not 0.00%)
              return item.commission && 
                     item.commission !== '0%' && 
                     item.commission !== '0.00%' &&
                     parseFloat(item.commission.replace('%', '')) > 0;
            default:
              return true;
          }
        });
      });
    }

    return filteredData;
  };

  const displayData = getFilteredAndSortedData();
  
  // Debug: Log filter state and data
  // console.log('Filter state:', { search, filterBy, displayDataLength: displayData.length });
  // if (filterBy.includes('commission')) {
  //   // console.log('Commission filter active. Sample data:', displayData.slice(0, 3).map(item => ({
  //   //   commission: item.commission,
  //   //   commission_profit: item.commission_profit
  //   // })));
  // }

  // Totals for summary row (fallback to client calc if server not provided)
  const anyTotals: any = queryData as any;
  const totalAmount = anyTotals?.total?.total_amount ?? displayData.reduce((sum, item) => sum + (item.amount || 0), 0);
  const totalCommission = anyTotals?.total?.total_commission ?? displayData.reduce((sum, item) => sum + (item.commission_profit || 0), 0);

  // Download handlers (PDF/XLS)
  const handleDownloadPDF = async () => {
    try {
      setShowDownloadModal(false);

      const headers = { headers: { Authorization: `Token ${Cookies.get('token')}` } } as const;
      // Start from page=1 regardless of current serverPage
      const initialParams = new URLSearchParams(buildQueryString());
      initialParams.set('page', '1');
      let nextUrl: string | null = `${baseUrl}?${initialParams.toString()}`;

      const allRows: any[] = [];
      for (let i = 0; i < 200 && nextUrl; i++) {
        const resp: any = await axios.get(nextUrl, headers);
        const root = resp.data || {};
        const wrapper = root.results ? root : { count: root.count, next: root.next, previous: root.previous, results: root };
        const results = wrapper.results || {};
        const dataArray: any[] = Array.isArray(results.data) ? results.data : [];

        dataArray.forEach((item: any, idx: number) => {
          const core = item.airtime_transactions || item.data_transactions || item.electricity_transactions || item.electicity_transactions || item.cable_transactions || item;
          allRows.push({
            date: core?.date ?? 'N/A',
            time: core?.time ?? 'N/A',
            biller: core?.biller ?? 'N/A',
            amount: Number(core?.amount ?? 0),
            commission: core?.commission ?? '0%',
            commission_profit: Number(core?.commission_profit ?? 0),
            phone_number: core?.phone_number ?? 'N/A',
            channel: core?.channel ?? 'N/A',
            token: core?.token,
            meter_type: core?.meter_type,
            iuc_number: core?.iuc_number,
          });
        });

        nextUrl = wrapper.next || null;
      }

      if (allRows.length === 0) {
        alert('No data available to export');
        return;
      }

      const exportData: ExportData[] = allRows.map((item) => ({
        date: item.date,
        time: item.time,
        biller: item.biller,
        amount: item.amount,
        commission: item.commission,
        commission_profit: item.commission_profit,
        phone_number: item.phone_number,
        channel: item.channel,
        ...(typeParam === 'electricity' ? { token: item.token, meter_type: item.meter_type } : {}),
        ...(typeParam === 'cable' ? { iuc_number: item.iuc_number } : {}),
      }));

      await exportToPDFTable(exportData, {
        title: `Recharge Transaction Report - ${typeLabel}`,
        fileName: `Recharge_Transaction_Report_${typeLabel.replace(/\s+/g, '_')}`,
        columns: [
          { key: 'date', header: 'Date' },
          { key: 'time', header: 'Time' },
          { key: 'biller', header: 'Biller' },
          { key: 'amount', header: 'Amount (NGN)' },
          { key: 'commission', header: 'Commission' },
          { key: 'commission_profit', header: 'Commission/Profit (NGN)' },
          { key: 'phone_number', header: 'Customer Phone Number' },
          { key: 'channel', header: 'Payment Channel' },
          ...(typeParam === 'electricity' ? [ { key: 'token', header: 'Token' }, { key: 'meter_type', header: 'Meter Type' } ] : []),
          ...(typeParam === 'cable' ? [ { key: 'iuc_number', header: 'IUC Number' } ] : []),
        ] as any,
      });
    } catch (err) {
      alert('Failed to prepare PDF export.');
    }
  };

  const handleDownloadXLS = async () => {
    try {
      const headers = { headers: { Authorization: `Token ${Cookies.get('token')}` } } as const;
      const initialParams = new URLSearchParams(buildQueryString());
      initialParams.set('page', '1');
      let nextUrl: string | null = `${baseUrl}?${initialParams.toString()}`;

      const allRows: any[] = [];
      for (let i = 0; i < 200 && nextUrl; i++) {
        const resp: any = await axios.get(nextUrl, headers);
        const root = resp.data || {};
        const wrapper = root.results ? root : { count: root.count, next: root.next, previous: root.previous, results: root };
        const results = wrapper.results || {};
        const dataArray: any[] = Array.isArray(results.data) ? results.data : [];

        dataArray.forEach((item: any, idx: number) => {
          const core = item.airtime_transactions || item.data_transactions || item.electricity_transactions || item.electicity_transactions || item.cable_transactions || item;
          allRows.push({
            date: core?.date ?? 'N/A',
            time: core?.time ?? 'N/A',
            biller: core?.biller ?? 'N/A',
            amount: Number(core?.amount ?? 0),
            commission: core?.commission ?? '0%',
            commission_profit: Number(core?.commission_profit ?? 0),
            phone_number: core?.phone_number ?? 'N/A',
            channel: core?.channel ?? 'N/A',
            token: core?.token,
            meter_type: core?.meter_type,
            iuc_number: core?.iuc_number,
          });
        });

        nextUrl = wrapper.next || null;
      }

      if (allRows.length === 0) {
        alert('No data available to export');
        return;
      }

      const exportData: ExportData[] = allRows.map((item) => ({
        date: item.date,
        time: item.time,
        biller: item.biller,
        amount: item.amount,
        commission: item.commission,
        commission_profit: item.commission_profit,
        phone_number: item.phone_number,
        channel: item.channel,
        ...(typeParam === 'electricity' ? { token: item.token, meter_type: item.meter_type } : {}),
        ...(typeParam === 'cable' ? { iuc_number: item.iuc_number } : {}),
      }));

      const baseColumns = [
        { key: 'date', header: 'Date', width: 15 },
        { key: 'time', header: 'Time', width: 12 },
        { key: 'biller', header: 'Biller', width: 15 },
        { key: 'amount', header: 'Amount (NGN)', width: 20 },
        { key: 'commission', header: 'Commission', width: 12 },
        { key: 'commission_profit', header: 'Commission/Profit (NGN)', width: 20 },
        { key: 'phone_number', header: 'Customer Phone Number', width: 20 },
        { key: 'channel', header: 'Payment Channel', width: 18 },
      ];
      if (typeParam === 'electricity') {
        baseColumns.splice(3, 0, { key: 'token', header: 'Token', width: 25 } as any);
        baseColumns.splice(4, 0, { key: 'meter_type', header: 'Meter Type', width: 12 } as any);
      }
      if (typeParam === 'cable') {
        baseColumns.splice(3, 0, { key: 'iuc_number', header: 'IUC Number', width: 18 } as any);
      }

      exportToXLS(exportData, {
        title: `Recharge Report - ${typeLabel}`,
        fileName: `Recharge_Transaction_Report_${typeLabel.replace(/\s+/g, '_')}`,
        columns: baseColumns as any,
        summaryRows: [
          { label: 'TOTAL', value: '' },
          { label: 'Amount', value: Number(allRows.reduce((s, r) => s + (Number(r.amount) || 0), 0)).toLocaleString() },
          { label: 'Commission/Profit', value: Number(allRows.reduce((s, r) => s + (Number(r.commission_profit) || 0), 0)).toFixed(2) },
        ],
      });
      setShowDownloadModal(false);
    } catch (error) {
      alert(`Error preparing data for export: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
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
    <section 
      className="flex flex-col"
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
        }
      }}
    >
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
            <p className="text-[#666666] text-sm font-Poppins">{typeLabel}</p>
          </div>
          <button
            type="button"
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
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
              }
            }}
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
              type="button"
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
                        type="button"
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
              type="button"
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
                      type="button"
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
                        type="button"
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
              <div className="custom-date-picker absolute top-full right-0 mt-1 w-80 bg-white border border-[#E9E9E9] rounded-md shadow-lg z-20 p-4">
                <div className="space-y-3">
                  <h3 className="text-sm font-medium text-[#353131]">Select Date Range</h3>
                  <div className="flex gap-3 items-end flex-wrap">
                    <div className="flex-1">
                      <label className="block text-xs text-gray-600 mb-1">Start Date</label>
                      <input
                        type="date"
                        value={customDateRange.start}
                        onChange={(e) => setCustomDateRange({ ...customDateRange, start: e.target.value })}
                        className="w-full px-3 py-2 border border-[#E9E9E9] rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#F25E26]"
                      />
                    </div>
                    <div className="flex-1 flex-wrap">
                      <label className="block text-xs text-gray-600 mb-1">End Date</label>
                      <input
                        type="date"
                        value={customDateRange.end}
                        onChange={(e) => setCustomDateRange({ ...customDateRange, end: e.target.value })}
                        className="w-full px-3 py-2 border border-[#E9E9E9] rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#F25E26]"
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          if (customDateRange.start && customDateRange.end) {
                            setShowCustomDatePicker(false);
                          }
                        }}
                        className="px-4 py-2 bg-[#F25E26] text-white text-sm rounded-md hover:bg-[#d63918] whitespace-nowrap"
                      >
                        Apply
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setCustomDateRange({ start: '', end: '' });
                          setShowCustomDatePicker(false);
                        }}
                        className="px-4 py-2 border border-[#E9E9E9] text-[#353131] text-sm rounded-md hover:bg-gray-50 whitespace-nowrap"
                      >
                        Cancel
                      </button>
                    </div>
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
          <span>{`${typeLabel.toUpperCase()}`} TRANSACTION REPORT</span>
          <div className="flex items-center gap-2">
            <span className="text-xs font-normal">({currentTime})</span>
            {isFetching && (
              <span className="inline-flex items-center text-[10px] bg-white/20 px-2 py-1 rounded animate-pulse">Updating…</span>
            )}
          </div>
        </div>
        <div className="overflow-x-auto">
          <ReportsTable 
            data={displayData} 
            columns={columnsRecharge as any} 
            showPagination={false}
            emptyRowCount={8}
          />
        </div>
        {/* Server pagination controls */}
        <div className="flex items-center justify-between px-4 md:px-8 py-4">
          <button
            type="button"
            disabled={!((queryData as any)?.previous)}
            onClick={() => {
              if ((queryData as any)?.previous) {
                setServerPage((p) => Math.max(1, p - 1));
              }
            }}
            className={`px-4 py-2 rounded-md text-sm ${(queryData as any)?.previous ? 'bg-gray-100 text-gray-800' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
          >
            Previous
          </button>
          <div className="text-xs text-gray-600">{(queryData as any)?.count ? `Total Records: ${(queryData as any).count}` : ''}</div>
          <button
            type="button"
            disabled={!((queryData as any)?.next)}
            onClick={() => {
              if ((queryData as any)?.next) {
                setServerPage((p) => p + 1);
              }
            }}
            className={`px-4 py-2 rounded-md text-sm ${(queryData as any)?.next ? 'bg-gray-100 text-gray-800' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
          >
            Next
          </button>
        </div>
        {displayData && displayData.length > 0 && (
          <div className="flex flex-col items-center py-4">
            <div className="text-sm text-gray-600 mb-2">
              Showing: {displayData.length} records
              {(search || filterBy.length > 0 || dateFilter) &&
                ` | Filtered (current page): ${displayData.length} records`}
            </div>
            {(search || filterBy.length > 0 || dateFilter) && (
              <button
                type="button"
                onClick={() => {
                  setSearch('');
                  setFilterBy([]);
                  setDateFilter('');
                  setCustomDateRange({ start: '', end: '' });
                  setServerPage(1);
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

export default function Page() {
  return <RechargeReportPage />;
}