"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useStore } from "@/store/nav-store";

import useAuthMiddleware from "@/hooks/useAuthMiddleware";
import { useEffect, useState, Suspense, useMemo } from "react";
import PageLayout from "@/app/components/Layout/PageLayout";
import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
} from "chart.js";
import ModalComponent from "@/app/components/ModalComponent";
import Link from "next/link";
import Image from "next/image";
import mtn from "@/app/asset/mtn.png";
import glo from "@/app/asset/glo.svg";
import airtel from "@/app/asset/airtel.svg";
import ninemobile from "@/app/asset/9mobile.svg";
import startimes from "@/app/asset/startimes.svg";
import dstv from "@/app/asset/dstv.svg";
import showmax from "@/app/asset/showmax.svg";
import gotv from "@/app/asset/gotv.svg";
import { useGetDatanew } from "@/hooks/useGetData";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import axios from "axios";
import Cookies from "js-cookie";
import Loading from "@/app/components/Loading";
import { redirect } from 'next/navigation'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale);

const ReportsPageContent = () => {
  const isNavbarOpen = useStore((state) => state.isNavbarOpen);
  const router = useRouter();
  const searchParams = useSearchParams();

  const formatNaira = (value: number) => {
    if (typeof value !== "number") return "₦0.00";
    return "₦" + value.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,");
  };

  const [topSortBy, setTopSortBy] = useState("all_time");
  const [topCustomStart, setTopCustomStart] = useState("");
  const [topCustomEnd, setTopCustomEnd] = useState("");
  const [currentTime, setCurrentTime] = useState<string>("");

  const [userToken, setUserToken] = useState(Cookies.get("token"));

  // Debounced filter values to prevent excessive API calls
  const [debouncedTopSortBy, setDebouncedTopSortBy] = useState("all_time");
  const [debouncedTopCustomStart, setDebouncedTopCustomStart] = useState("");
  const [debouncedTopCustomEnd, setDebouncedTopCustomEnd] = useState("");




  /*  useAuthMiddleware(router) */
  useAuthMiddleware(router);

  // Debounce filter changes to prevent excessive API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedTopSortBy(topSortBy);
      setDebouncedTopCustomStart(topCustomStart);
      setDebouncedTopCustomEnd(topCustomEnd);
    }, 500); // 500ms delay

    return () => clearTimeout(timer);
  }, [topSortBy, topCustomStart, topCustomEnd]);

  // Construct URL with query parameters based on filter selection
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

        // const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
        const todayStr = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, "0")}-${String(yesterday.getDate()).padStart(2, "0")}`;
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
        params.append("filter", "all_time");
    }

    return params.toString();
  };

  // Custom hook to prevent page refresh on filter changes
  const useStableReportData = (filterParams: string) => {
    return useQuery({
      queryKey: ["get_report_summary", filterParams], // Include filter params in query key
      queryFn: async () => {
        const url = `${process.env.NEXT_PUBLIC_BASE_URL}/admin/report_summary/?${filterParams}`;
        const response = await axios.get(url, {
          headers: {
            Authorization: `Token ${userToken}`
          }
        });
        return response.data;
      },
      refetchOnWindowFocus: false,
      staleTime: 5000, // Consider data fresh for 5 seconds
      placeholderData: keepPreviousData, // Avoid UI flicker; update in background
    });
  };

  const filterParams = getFilterParams();
  const allowTopRefetch = !(debouncedTopSortBy === "custom" && (!debouncedTopCustomStart || !debouncedTopCustomEnd));
  const {
    data: reportInfo,
    isLoading: reportLoading,
    isFetching: reportFetching,
    error,
  } = useStableReportData(allowTopRefetch ? filterParams : "");


  // Add null checks to prevent errors when reportInfo is undefined
  const uptimeSuccess = reportInfo?.data?.service_uptime?.success
    ? parseFloat(reportInfo.data.service_uptime.success.replace("%", ""))
    : 0; // Default value
  const uptimeFailure = reportInfo?.data?.service_uptime?.failure
    ? parseFloat(reportInfo.data.service_uptime.failure.replace("%", ""))
    : 0; // Default value

  // Chart data for Service Uptime Report
  const uptimeData = {
    labels: ["Success Rate", "Failure Rate"],
    datasets: [
      {
        data: [uptimeSuccess, uptimeFailure],
        backgroundColor: ["#10b981", "#ef4444"],
        borderColor: ["#10b981", "#ef4444"],
        borderWidth: 0,
        cutout: "70%",
      },
    ],
  };

  const uptimeOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: false,
      },
    },
  };

  // Modal state
  const [openReport, setOpenReport] = useState<null | "auction" | "regular">(
    null
  );

  // State to track if Regular Deals Transaction Report is clicked
  const [showRegularDealsReport, setShowRegularDealsReport] = useState(false);
  const [showAuctionCustomersReport, setShowAuctionCustomersReport] =
    useState(false);
  const [showRechargeTransactionReport, setShowRechargeTransactionReport] =
    useState(false);
  const [showCustomerStatistics, setShowCustomerStatistics] = useState(false);
  const [showRaffleDrawReport, setShowRaffleDrawReport] = useState(false);

  // If navigated with ?showCustomerStatistics=1, open that section by default
  useEffect(() => {
    const shouldShow = searchParams.get("showCustomerStatistics");
    if (shouldShow) {
      setShowCustomerStatistics(true);
    }
  }, [searchParams]);

  // Set current time
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

  // Modal content: two large, centered buttons
  const modalButtons = (
    <div className="flex flex-col sm:flex-row gap-6 justify-center items-center p-6">
      {/*  <button
        className="bg-white hover:bg-[#E84526] hover:text-[#FCFCFC] rounded-xl shadow font-semibold text-base px-2 py-2 text-gray-900  transition border border-gray-200  text-center"
        style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}
      >
        Auction Customers<br />Master Report
      </button> */}

      <Link
        href={`/auctioncustomersmaster`}
        className="bg-white hover:bg-[#E84526] hover:text-[#FCFCFC] rounded-xl shadow font-semibold text-base px-2 py-2 text-gray-900  transition border border-gray-200  text-center"
      >
        Auction Customers
        <br />
        Master Report
      </Link>
      <Link
        href={`/regularcustomersmaster`}
        className="bg-white rounded-xl hover:bg-[#E84526] hover:text-[#FCFCFC] shadow font-semibold text-base px-2 py-2 text-gray-900 transition border border-gray-200  text-center"
        style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}
      >
        Regular Customers
        <br />
        Master Report
      </Link>
    </div>
  );

  const RegularDealsReport = () => {
    const [sortBy, setSortBy] = useState("");
    const [customStart, setCustomStart] = useState("");
    const [customEnd, setCustomEnd] = useState("");

    // Debounced filter values
    const [debouncedSortBy, setDebouncedSortBy] = useState("");
    const [debouncedCustomStart, setDebouncedCustomStart] = useState("");
    const [debouncedCustomEnd, setDebouncedCustomEnd] = useState("");

    // Debounce filter changes
    useEffect(() => {
      const timer = setTimeout(() => {
        setDebouncedSortBy(sortBy);
        setDebouncedCustomStart(customStart);
        setDebouncedCustomEnd(customEnd);
      }, 500);

      return () => clearTimeout(timer);
    }, [sortBy, customStart, customEnd]);

    // Construct URL with query parameters based on filter selection
    const getRegularDealsFilterParams = () => {
      const params = new URLSearchParams();

      switch (debouncedSortBy) {
        case "yesterday": {
          const today = new Date();
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);

          // const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
          // const todayStr = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, "0")}-${String(yesterday.getDate()).padStart(2, "0")}`;
          const todayStr = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, "0")}-${String(yesterday.getDate()).padStart(2, "0")}`;
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
          // Only add custom filter if both start and end dates are provided
          if (debouncedCustomStart && debouncedCustomEnd) {
            params.append("filter", "custom");
            params.append("start_date", debouncedCustomStart);
            params.append("end_date", debouncedCustomEnd);
          }
          break;
        default:
          // No filter parameter for default (all time)
          break;
      }

      return params.toString();
    };

    const regularDealsFilterParams = getRegularDealsFilterParams();
    const regularDealsEnabled = !(debouncedSortBy === "custom" && (!debouncedCustomStart || !debouncedCustomEnd));

    const {
      data: regularDealsData,
      isLoading: regularDealsLoading,
      error: regularDealsError,
    } = useQuery({
      queryKey: ["get_regular_deals_summary", regularDealsFilterParams], // Include filter params
      queryFn: async () => {
        const url = `${process.env.NEXT_PUBLIC_BASE_URL}/admin/regular_deals_summary/?${regularDealsFilterParams}`;
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
      enabled: regularDealsEnabled,
    });


   

    if (regularDealsLoading) {
      return (
        <div className="w-full min-h-screen bg-gray-50 flex items-center justify-center">
          <Loading />
        </div>
      );
    }

    if (regularDealsError) {
      return (
        <div className="w-full min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-red-600 mb-2">Error Loading Data</h2>
            <p className="text-gray-600">Please try again later.</p>
          </div>
        </div>
      );
    }

    // Extract data from API response
    const summaryData = regularDealsData?.data || {
      total_revenue: 0,
      total_discount: 0,
      cost_price_total: 0,
      profit: 0
    };

    return (
      <div className="w-full min-h-screen bg-gray-50">
        <div className="bg-[#F6F6F6] px-4 sm:px-6 md:px-8 py-4 md:py-6">
          <span
            onClick={() => setShowRegularDealsReport(false)}
            className="text-[#F25E26] cursor-pointer text-xs sm:text-sm block mb-2 md:mb-3"
          >
            Back
          </span>
          <h1 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900 mb-1">
            Reports
          </h1>
          <p className="text-xs sm:text-sm md:text-base text-gray-700">
            Regular Transaction Deals
          </p>
        </div>
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

          {/* Main Content */}
          <div className="py-6 md:p-8">
            {/* Financial Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 lg:gap-8">
              <div className="bg-white shadow-lg  rounded-lg p-4 md:p-6 lg:p-8 border border-gray-200">
                <h3 className="text-xs sm:text-sm md:text-base text-gray-700 mb-3 md:mb-4 lg:mb-6 text-center">
                  Total Revenue
                </h3>
                <p className="text-base sm:text-lg md:text-xl lg:text-2xl font-semibold  text-center">
                  {formatNaira(summaryData.total_revenue)}
                </p>
              </div>
              <div className="bg-white shadow-lg  rounded-lg p-4 md:p-6 lg:p-8 border border-gray-200">
                <h3 className="text-xs sm:text-sm md:text-base text-gray-700 mb-3 md:mb-4 lg:mb-6 text-center">
                  Total Discount
                </h3>
                <p className="text-base sm:text-lg md:text-xl lg:text-2xl font-semibold text-center">
                  {formatNaira(summaryData.total_discount)}
                </p>
              </div>
              <div className="bg-white shadow-lg  rounded-lg p-4 md:p-6 lg:p-8 border border-gray-200">
                <h3 className="text-xs sm:text-sm md:text-base text-gray-700 mb-3 md:mb-4 lg:mb-6 text-center">
                  Cost of Sale
                </h3>
                <p className="text-base sm:text-lg md:text-xl lg:text-2xl font-semibold text-center">
                  {formatNaira(summaryData.cost_price_total)}
                </p>
              </div>
              <div className="bg-white shadow-lg  rounded-lg p-4 md:p-6 lg:p-8 border border-gray-200">
                <h3 className="text-xs sm:text-sm md:text-base text-gray-700 mb-3 md:mb-4 lg:mb-6 text-center">
                  Total Profit
                </h3>
                <p className="text-base sm:text-lg md:text-xl lg:text-2xl font-semibold text-center">
                  {formatNaira(summaryData.profit)}
                </p>
              </div>
            </div>

            {/* View Report Button */}
            <div className="flex justify-center mt-6 md:mt-8 lg:mt-10">
              <button
                className="bg-[#F25E26] hover:bg-[#E84526] text-white font-medium py-2 md:py-3 px-6 md:px-12 rounded-lg transition-colors duration-200 text-xs sm:text-sm md:text-base"
                onClick={() =>
                  router.push("/dashboard/regulartransactionreport")
                }
              >
                View Report
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const AuctionCustomersReport = () => {
    const [sortBy, setSortBy] = useState("");
    const [customStart, setCustomStart] = useState("");
    const [customEnd, setCustomEnd] = useState("");

    // Debounced filter values
    const [debouncedSortBy, setDebouncedSortBy] = useState("");
    const [debouncedCustomStart, setDebouncedCustomStart] = useState("");
    const [debouncedCustomEnd, setDebouncedCustomEnd] = useState("");

    // Debounce filter changes
    useEffect(() => {
      const timer = setTimeout(() => {
        setDebouncedSortBy(sortBy);
        setDebouncedCustomStart(customStart);
        setDebouncedCustomEnd(customEnd);
      }, 500);

      return () => clearTimeout(timer);
    }, [sortBy, customStart, customEnd]);

    // Construct URL with query parameters based on filter selection
    const getAuctionCustomersFilterParams = () => {
      const params = new URLSearchParams();

      switch (debouncedSortBy) {
        case "yesterday": {
          const today = new Date();
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);

          const todayStr =`${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, "0")}-${String(yesterday.getDate()).padStart(2, "0")}`;
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
          // Only add custom filter if both start and end dates are provided
          if (debouncedCustomStart && debouncedCustomEnd) {
            params.append("filter", "custom");
            params.append("start_date", debouncedCustomStart);
            params.append("end_date", debouncedCustomEnd);
          }
          break;
        default:
          // No filter parameter for default (all time)
          break;
      }

      return params.toString();
    };

    const auctionCustomersFilterParams = getAuctionCustomersFilterParams();
    const auctionEnabled = !(debouncedSortBy === "custom" && (!debouncedCustomStart || !debouncedCustomEnd));

    const {
      data: auctionCustomersData,
      isLoading: auctionCustomersLoading,
      error: auctionCustomersError,
    } = useQuery({
      queryKey: ["get_auction_customers_summary", auctionCustomersFilterParams], // Include filter params
      queryFn: async () => {
        const url = `${process.env.NEXT_PUBLIC_BASE_URL}/admin/auction_deals_summary/?${auctionCustomersFilterParams}`;
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
      enabled: auctionEnabled,
    });

  

    if (auctionCustomersLoading) {
      return (
        <div className="w-full min-h-screen bg-gray-50 flex items-center justify-center">
          <Loading />
        </div>
      );
    }

    if (auctionCustomersError) {
      return (
        <div className="w-full min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-red-600 mb-2">Error Loading Data</h2>
            <p className="text-gray-600">Please try again later.</p>
          </div>
        </div>
      );
    }

    // Extract data from API response
    const summaryData = auctionCustomersData?.data || {
      revenue: 0,
      total_tickets: 0,
      rda: 0,
      eca: 0
    };

    return (
      <div className="w-full min-h-screen bg-gray-50">
        <div className="bg-[#F6F6F6] px-4 sm:px-6 md:px-8 py-4 md:py-6">
          <span
            onClick={() => setShowAuctionCustomersReport(false)}
            className="text-[#F25E26] cursor-pointer text-xs sm:text-sm block mb-2 md:mb-3"
          >
            Back
          </span>
          <h1 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900 mb-1">
            Reports
          </h1>
          <p className="text-xs sm:text-sm md:text-base text-gray-700">
            Auction Transaction Report ({currentTime})
          </p>
        </div>
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

          {/* Main Content */}
          <div className="py-6 md:p-8">
            {/* Financial Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 lg:gap-8">
              <div className="bg-[#FFEFE980] shadow-lg  rounded-lg p-4 md:p-6 lg:p-8 border border-gray-200">
                <h3 className="text-xs sm:text-sm md:text-base text-gray-700 mb-3 md:mb-4 lg:mb-6 text-center">
                  Ticket GTV
                </h3>
                <p className="text-base sm:text-lg md:text-xl lg:text-2xl font-semibold text-center">
                  {formatNaira(summaryData.revenue || 0)}
                </p>
              </div>
              <div className="bg-[#EFE3FF80] shadow-lg  rounded-lg p-4 md:p-6 lg:p-8 border border-gray-200">
                <h3 className="text-xs sm:text-sm md:text-base text-gray-700 mb-3 md:mb-4 lg:mb-6 text-center">
                  Total No of Ticket Sold
                </h3>
                <p className="text-base sm:text-lg md:text-xl lg:text-2xl font-semibold text-center">
                  {summaryData.total_tickets}
                </p>
              </div>
              <div className="bg-[#F1FDFF80] shadow-lg  rounded-lg p-4 md:p-6 lg:p-8 border border-gray-200">
                <h3 className="text-xs sm:text-sm md:text-base text-gray-700 mb-3 md:mb-4 lg:mb-6 text-center">
                  RDA
                </h3>
                <p className="text-base sm:text-lg md:text-xl lg:text-2xl font-semibold text-center">
                  {formatNaira(summaryData.rda || 0)}
                </p>
              </div>
              <div className="bg-[#E8FFE699] shadow-lg  rounded-lg p-4 md:p-6 lg:p-8 border border-gray-200">
                <h3 className="text-xs sm:text-sm md:text-base text-gray-700 mb-3 md:mb-4 lg:mb-6 text-center">
                  ECA
                </h3>
                <p className="text-base sm:text-lg md:text-xl lg:text-2xl font-semibold text-center">
                  {formatNaira(summaryData.eca || 0)}
                </p>
              </div>
            </div>

            {/* View Report Button */}
            <div className="flex justify-center mt-6 md:mt-8 lg:mt-10">
              <button
                className="bg-[#F25E26] hover:bg-[#E84526] text-white font-medium py-2 md:py-3 px-6 md:px-12 rounded-lg transition-colors duration-200 text-xs sm:text-sm md:text-base"
                onClick={() =>
                  router.push("/dashboard/auctiontransactionreport")
                }
              >
                View Report
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const RechargeTransactionReport = () => {
    type ProviderMetrics = {
      gtv: number;
      commission: number;
      count: number;
      commission_rate?: string;
    };

    type RechargeCategory = Record<string, ProviderMetrics | { gtv: number; commission: number; count: number }>;

    interface RechargeApiResponse {
      status: string;
      message: string;
      current_datetime?: string;
      data?: {
        airtime?: RechargeCategory;
        data?: RechargeCategory;
        electricity?: RechargeCategory;
        cable?: RechargeCategory;
        [key: string]: RechargeCategory | undefined;
      };
    }

    const [sortBy, setSortBy] = useState("");
    const [customStart, setCustomStart] = useState("");
    const [customEnd, setCustomEnd] = useState("");
    const [activeTab, setActiveTab] = useState<string>("Airtime");

    // Debounced filter values
    const [debouncedSortBy, setDebouncedSortBy] = useState("");
    const [debouncedCustomStart, setDebouncedCustomStart] = useState("");
    const [debouncedCustomEnd, setDebouncedCustomEnd] = useState("");

    // Debounce filter changes
    useEffect(() => {
      const timer = setTimeout(() => {
        setDebouncedSortBy(sortBy);
        setDebouncedCustomStart(customStart);
        setDebouncedCustomEnd(customEnd);
      }, 500);

      return () => clearTimeout(timer);
    }, [sortBy, customStart, customEnd]);

    const getRechargeFilterParams = () => {
      const params = new URLSearchParams();
      switch (debouncedSortBy) {
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
          // all_time or no filter
          break;
      }
      return params.toString();
    };

    const rechargeFilterParams = getRechargeFilterParams();
    const rechargeEnabled = !(debouncedSortBy === "custom" && (!debouncedCustomStart || !debouncedCustomEnd));

    const { data: rechargeData, isLoading: rechargeLoading, isFetching: rechargeFetching, error: rechargeError } = useQuery({
      queryKey: ["get_recharge_transaction_report", rechargeFilterParams], // Include filter params
      queryFn: async () => {
        const url = `${process.env.NEXT_PUBLIC_BASE_URL}/admin/recharge_transaction_report/?${rechargeFilterParams}`;
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
      enabled: rechargeEnabled,
    });

    // Build dynamic tab data from API
    const api = rechargeData as unknown as RechargeApiResponse | undefined;
    const apiData = api?.data || {};

    // Update header time when available
    const headerTime = api?.current_datetime;

    const categoryDisplayName = (key: string) => {
      const map: Record<string, string> = {
        airtime: "Airtime",
        data: "Data",
        electricity: "Electricity",
        cable: "Cable",
      };
      return map[key] || key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
    };

    const providerLogo = (name: string) => {
      const key = name.toUpperCase();
      if (key.includes("MTN")) return mtn;
      if (key.includes("AIRTEL")) return airtel;
      if (key.includes("9MOBILE") || key.includes("ETISALAT")) return ninemobile;
      if (key.includes("GLO")) return glo;
      if (key.includes("DSTV")) return dstv;
      if (key.includes("GOTV")) return gotv;
      if (key.includes("STARTIMES") || key.includes("STARTIME")) return startimes;
      if (key.includes("SHOWMAX")) return showmax;
      return undefined;
    };

    const buildTabData = () => {
      const result: Record<
        string,
        {
          summary: { title: string; value: string }[];
          billersTitle: string;
          serviceProviders: { name: string; img?: any }[];
          dataColumns: string[][];
          dataColumnTitle: string;
        }
      > = {};

      Object.entries(apiData).forEach(([categoryKey, providers]) => {
        const displayName = categoryDisplayName(categoryKey);
        const total = (providers as any)?.total as { gtv: number; commission: number; count: number } | undefined;

        const providerEntries = Object.entries(providers || {}).filter(([k]) => k !== "total");

        const serviceProviders = providerEntries.map(([name]) => ({ name, img: providerLogo(name) }));

        const dataColumns = providerEntries.map(([name, metrics]) => {
          const m = metrics as ProviderMetrics;
          return [
            formatNaira(m.gtv || 0),
            formatNaira(m.commission || 0),
            String(m.count || 0),
            m.commission_rate || "0%",
          ];
        });

        result[displayName] = {
          summary: [
            { title: `${displayName} GTV`, value: formatNaira(total?.gtv || 0) },
            { title: "Total Commission Earned", value: formatNaira(total?.commission || 0) },
            { title: "Counts", value: String(total?.count || 0) },
          ],
          billersTitle: `Billers share of ${displayName} GTV`,
          serviceProviders,
          dataColumns,
          dataColumnTitle: `${displayName} GTV`,
        };
      });

      return result;
    };

    const tabData = buildTabData();

    // Client-side pagination for provider rows
    const [providerPage, setProviderPage] = useState(1);
    const providersPerPage = 7;

    // Ensure active tab exists
    const availableTabs = Object.keys(tabData);
    const currentTab = availableTabs.includes(activeTab) ? activeTab : availableTabs[0] || "";
    const currentTabData = currentTab ? tabData[currentTab] : undefined;

    // Reset to page 1 when tab or filters change
    useEffect(() => {
      setProviderPage(1);
    }, [currentTab, debouncedSortBy, debouncedCustomStart, debouncedCustomEnd]);

    const totalProviders = currentTabData?.serviceProviders.length || 0;
    const totalPages = Math.max(1, Math.ceil(totalProviders / providersPerPage));
    const spStart = (providerPage - 1) * providersPerPage;
    const spEnd = spStart + providersPerPage;
    const paginatedServiceProviders = (currentTabData?.serviceProviders || []).slice(spStart, spEnd);
    const paginatedDataColumns = (currentTabData?.dataColumns || []).slice(spStart, spEnd);

    if (rechargeLoading) {
      return (
        <div className="w-full min-h-screen bg-gray-50 flex items-center justify-center">
          <Loading />
        </div>
      );
    }

    if (rechargeError) {
      return (
        <div className="w-full min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-red-600 mb-2">Error Loading Data</h2>
            <p className="text-gray-600">Please try again later.</p>
          </div>
        </div>
      );
    }

    return (
      <div className="w-full min-h-screen bg-gray-100">
        {/* White Header Section */}
        <div className="bg-white px-6 pt-6 pb-4">
          <span
            onClick={() => setShowRechargeTransactionReport(false)}
            className="text-[#F25E26] text-sm font-medium cursor-pointer mb-2 block"
          >
            Back
          </span>
          <div className="flex items-center gap-2 mb-6">
            <h1 className="text-2xl font-semibold text-black">
              Recharge Transaction Report
            </h1>
            <span className="text-base text-gray-600 font-normal">
              {headerTime ? `(${headerTime})` : ""}
            </span>
            {rechargeFetching && (
              <span className="inline-flex items-center text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded animate-pulse">Updating…</span>
            )}
          </div>
        </div>

        {/* Main Content Section */}
        <div className="px-6 py-6">
          {/* Navigation and Sort Section */}
          <div className="mb-6">
            <div className="flex flex-wrap  gap-4">
              {availableTabs.map((tab: string) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-10 py-3 rounded-xl font-semibold transition-colors ${
                    currentTab === tab
                      ? "bg-[#F25E26] text-white font-semibold"
                      : "bg-[#EDEDED] text-gray-500"
                  }`}
                >
                  {tab === "Cable" ? "Cable Subscription" : tab}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end items-center mb-6">
            <div className="flex items-center gap-4">
              <Select value={sortBy} onValueChange={(val) => setSortBy(val)}>
                <SelectTrigger className="h-10 w-[160px] rounded border px-3 selector">
                  <SelectValue placeholder="All Time" />
                </SelectTrigger>
                <SelectContent style={{ backgroundColor: '#ffffff', color: '#2A2A2A' }}>
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
                    className="border border-gray-300 rounded px-2 py-1 text-sm"
                    value={customStart}
                    onChange={(e) => setCustomStart(e.target.value)}
                  />
                  <span className="mx-1">to</span>
                  <input
                    type="date"
                    className="border border-gray-300 rounded px-2 py-1 text-sm"
                    value={customEnd}
                    onChange={(e) => setCustomEnd(e.target.value)}
                  />
                </>
              )}
            </div>
          </div>

          {/* Summary Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mb-6">
            {currentTabData?.summary.map(
              (item: { title: string; value: string }, idx: number) => (
                <div
                  key={item.title}
                  className="bg-white shadow-lg rounded-lg border border-[#FEEAE2] flex flex-col justify-between"
                >
                  <div className="w-full h-6 bg-[#FEF6F3] rounded-t-lg"></div>
                  <div className="flex flex-col justify-center items-center p-3 md:p-4 lg:p-6 flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="flex items-center justify-center gap-2">
                        {/* You can keep your SVG here or use a different icon per card if needed */}
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#EF4444"
                          strokeWidth="2"
                        >
                          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                          <polyline points="3.27,6.96 12,12.01 20.73,6.96" />
                          <line x1="12" y1="22.08" x2="12" y2="12" />
                        </svg>
                        <h3 className="text-xs sm:text-sm md:text-base font-medium text-gray-700">
                          {item.title}
                        </h3>
                      </div>
                    </div>
                    <p className="text-base sm:text-lg md:text-xl lg:text-2xl font-semibold text-center">
                      {item.value}
                    </p>
                  </div>
                  <div className="w-full h-6 bg-[#FEF6F3] rounded-b-lg"></div>
                </div>
              )
            )}
          </div>

          <div className="flex justify-end mb-6">
            <span
              className="text-[#F25E26] text-sm cursor-pointer"
              onClick={() => {
                const tabToType: Record<string, string> = {
                  Airtime: 'airtime',
                  Data: 'data',
                  Electricity: 'electricity',
                  Cable: 'cable',
                };
                const typeParam = tabToType[currentTab] || 'airtime';
                router.push(`/dashboard/rechargetransactionreport?type=${typeParam}`);
              }}
            >
              See More &gt;
            </span>
          </div>

          {/* Billers Share Section */}
          <div className="bg-white shadow-lg rounded-2xl overflow-hidden mt-8">
            <div className="bg-[#F25E26] px-6 py-4 flex justify-center rounded-t-2xl">
              <h2 className="text-white font-semibold text-lg text-center">
                {currentTabData?.billersTitle}
              </h2>
            </div>
            <div className="p-4 md:p-8">
              <div className="flex flex-col md:flex-row gap-12 md:gap-0">
                {/* Service Providers Column */}
                <div className="md:w-1/4 w-full flex flex-col items-stretch border border-gray-300 rounded-2xl md:rounded-l-2xl md:rounded-r-none overflow-hidden mb-4 md:mb-0">
                  <div className="py-3 px-4 font-semibold text-lg text-gray-800 border-b border-gray-200 text-center">
                    Service Provider
                  </div>
                <div className="flex-1 flex flex-col">
                  {paginatedServiceProviders.map(
                      (provider: { name: string; img?: any }, idx: number) => (
                        <div
                          key={provider.name}
                          className={`flex items-center justify-center py-6 border-b border-gray-200 bg-white ${
                            idx === (paginatedServiceProviders.length || 1) - 1
                              ? "border-b-0"
                              : ""
                          }`}
                        >
                          {provider.img == null ? (
                            <button
                              className="bg-orange-500 text-white px-6 py-2 rounded-lg font-semibold text-base"
                              style={{ minWidth: 100 }}
                              disabled
                            >
                              {provider.name}
                            </button>
                          ) : (
                            <Image
                              src={provider.img}
                              alt={provider.name}
                              className="h-12 w-auto"
                            />
                          )}
                        </div>
                      )
                    )}
                  </div>
                </div>
                {/* Data Columns */}
                <div className="md:w-3/4 w-full border border-gray-300 rounded-2xl md:rounded-r-2xl md:rounded-l-none overflow-hidden">
                  <div className="grid grid-cols-4">
                    <div className="py-3 px-4 font-semibold text-gray-800 border-b border-gray-200 text-center">
                      {currentTabData?.dataColumnTitle}
                    </div>
                    <div className="py-3 px-4 font-semibold text-gray-800 border-b border-gray-200 text-center">
                      Commission
                    </div>
                    <div className="py-3 px-4 font-semibold text-gray-800 border-b border-gray-200 text-center">
                      Count
                    </div>
                    <div className="py-3 px-4 font-semibold text-gray-800 border-b border-gray-200 text-center">
                      Commission Rate
                    </div>
                  </div>
                  {/* Data Rows */}
                  {paginatedDataColumns.map(
                    (row: string[], idx: number) => (
                      <div className="grid grid-cols-4" key={idx}>
                        {row.map((cell: string, cidx: number) => (
                          <div
                            key={cidx}
                            className="py-6 px-4 text-center bg-gray-100 m-2 rounded-lg font-semibold text-gray-800 flex items-center justify-center"
                          >
                            {cell}
                          </div>
                        ))}
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Providers pagination */}
          {totalProviders > providersPerPage && (
            <div className="flex items-center justify-between mt-4">
              <button
                type="button"
                onClick={() => setProviderPage((p) => Math.max(1, p - 1))}
                disabled={providerPage <= 1}
                className={`px-4 py-2 rounded-md text-sm ${providerPage > 1 ? 'bg-gray-100 text-gray-800' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
              >
                Previous
              </button>
              <div className="text-xs text-gray-600">Page {providerPage} of {totalPages}</div>
              <button
                type="button"
                onClick={() => setProviderPage((p) => Math.min(totalPages, p + 1))}
                disabled={providerPage >= totalPages}
                className={`px-4 py-2 rounded-md text-sm ${providerPage < totalPages ? 'bg-gray-100 text-gray-800' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Customer Statistics Report Component
  const CustomerStatisticsReport = () => {
    interface CustomerStatsApiResponse {
      status: string;
      message: string;
      current_datetime?: string;
      data?: {
        registered_customers?: number;
        customer_wallet_balance?: number;
        customer_with_balance?: {
          customers_with_positive_balance?: number;
          customers_with_negative_balance?: number;
        };
        unredeemed_point?: number;
      };
    }

    const [sortBy, setSortBy] = useState("");
    const [customStart, setCustomStart] = useState("");
    const [customEnd, setCustomEnd] = useState("");

    // Debounced filter values
    const [debouncedSortBy, setDebouncedSortBy] = useState("");
    const [debouncedCustomStart, setDebouncedCustomStart] = useState("");
    const [debouncedCustomEnd, setDebouncedCustomEnd] = useState("");

    // Debounce filter changes
    useEffect(() => {
      const timer = setTimeout(() => {
        setDebouncedSortBy(sortBy);
        setDebouncedCustomStart(customStart);
        setDebouncedCustomEnd(customEnd);
      }, 500);

      return () => clearTimeout(timer);
    }, [sortBy, customStart, customEnd]);

    const getCustomerStatsParams = () => {
      const params = new URLSearchParams();
      switch (debouncedSortBy) {
        case "yesterday": {
          const today = new Date();
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);

          const todayStr = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, "0")}-${String(yesterday.getDate()).padStart(2, "0")}`;
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
          // all_time or default
          break;
      }
      return params.toString();
    };

    const customerStatsFilterParams = getCustomerStatsParams();
    const customerStatsEnabled = !(debouncedSortBy === "custom" && (!debouncedCustomStart || !debouncedCustomEnd));

    const { data: customerStatsRaw, isLoading: customerStatsLoading, error: customerStatsError } = useQuery({
      queryKey: ["get_customer_statistics_summary", customerStatsFilterParams], // Include filter params
      queryFn: async () => {
        const url = `${process.env.NEXT_PUBLIC_BASE_URL}/admin/customer_statistics_summary/?${customerStatsFilterParams}`;
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
      enabled: customerStatsEnabled,
    });

    const api = customerStatsRaw as unknown as CustomerStatsApiResponse | undefined;
    const headerTime = api?.current_datetime;
    const stats = api?.data;

    const registeredCustomers = stats?.registered_customers ?? 0;
    const customerWalletBalance = stats?.customer_wallet_balance ?? 0;
    const positiveBalance = stats?.customer_with_balance?.customers_with_positive_balance ?? 0;
    const negativeBalance = stats?.customer_with_balance?.customers_with_negative_balance ?? 0;
    const unredeemedPoint = stats?.unredeemed_point ?? 0;

    if (customerStatsLoading) {
      return (
        <div className="w-full min-h-screen bg-gray-50 flex items-center justify-center">
          <Loading />
        </div>
      );
    }

    if (customerStatsError) {
      return (
        <div className="w-full min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-red-600 mb-2">Error Loading Data</h2>
            <p className="text-gray-600">Please try again later.</p>
          </div>
        </div>
      );
    }

    return (
      <div className="w-full min-h-screen bg-gray-50">
        <div className="bg-[#F6F6F6] px-8 pt-8 pb-6">
          <span
            onClick={() => setShowCustomerStatistics(false)}
            className="text-[#F25E26] cursor-pointer text-sm block mb-4 ml-1"
            style={{ marginTop: "4px" }}
          >
            Back
          </span>
          <h1 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900 mb-1">
            Customer Statistics
          </h1>
          <p className="text-xs sm:text-sm md:text-base font-medium text-gray-700">
            Customer Statistic Summary{" "}
            <span className="text-xs sm:text-sm font-normal">{headerTime ? `(${headerTime})` : ""}</span>
          </p>
        </div>
        <div className="max-w-3xl mx-auto px-8">
          <div className="flex justify-end items-center mt-8 mb-8 gap-4">
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
                  className="border border-gray-300 rounded-lg px-2 py-2 text-gray-700 text-sm"
                  value={customStart}
                  onChange={(e) => setCustomStart(e.target.value)}
                  placeholder="Start date"
                />
                <span className="mx-1">to</span>
                <input
                  type="date"
                  className="border border-gray-300 rounded-lg px-2 py-2 text-gray-700 text-sm"
                  value={customEnd}
                  onChange={(e) => setCustomEnd(e.target.value)}
                  placeholder="End date"
                />
              </>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-8">
            <div className="rounded-xl border-2 border-green-200 bg-green-50 p-4 md:p-6 lg:p-8 flex flex-col items-center justify-center min-h-[160px]">
              <div className="text-xs sm:text-sm md:text-base font-medium text-gray-700 mb-2 text-center">
                Registered Customers
              </div>
              <div className="text-base sm:text-lg md:text-xl lg:text-2xl font-semibold text-gray-900 text-center">
                {registeredCustomers}
              </div>
            </div>
            <div className="rounded-xl border-2 border-red-200 bg-red-50 p-4 md:p-6 lg:p-8 flex flex-col items-center justify-center min-h-[160px]">
              <div className="text-xs sm:text-sm md:text-base font-medium text-gray-700 mb-2 text-center">
                Customer Wallet Balance
              </div>
              <div className="text-base sm:text-lg md:text-xl lg:text-2xl font-semibold text-gray-900 text-center">
                {formatNaira(customerWalletBalance)}
              </div>
            </div>
            <div className="rounded-xl border-2 border-purple-400 bg-purple-50 p-4 md:p-6 lg:p-8 flex flex-col items-center justify-center min-h-[160px]">
              <div className="text-xs sm:text-sm md:text-base font-medium text-gray-700 mb-2 text-center">
                Customers With Balance:
              </div>
              <div className="flex flex-col items-center justify-center h-full gap-2">
                <div className="flex items-center gap-2 text-sm sm:text-base md:text-lg font-semibold text-gray-900">
                  <span>&gt; 0:</span>{" "}
                  <span className="font-semibold">{positiveBalance}</span>
                </div>
                <div className="flex items-center gap-2 text-sm sm:text-base md:text-lg font-semibold text-gray-900">
                  <span>&lt; 0:</span> <span className="font-semibold">{negativeBalance}</span>
                </div>
              </div>
            </div>
            <div className="rounded-xl border-2 border-yellow-300 bg-yellow-50 p-4 md:p-6 lg:p-8 flex flex-col items-center justify-center min-h-[160px]">
              <div className="text-xs sm:text-sm md:text-base font-medium text-gray-700 mb-2 text-center">
                Unredeemed Ajiroba Points
              </div>
              <div className="text-base sm:text-lg md:text-xl lg:text-2xl font-semibold text-gray-900 text-center">
                {unredeemedPoint}
              </div>
            </div>
          </div>
          <div className="flex justify-center mt-8 mb-8">
            <button
              onClick={() => router.push("/dashboard/customersreport")}
              className="bg-[#F25E26] hover:bg-[#E84526] text-white font-medium py-2 md:py-3 px-6 md:px-12 rounded-lg transition-colors duration-200 text-xs sm:text-sm md:text-base"
            >
              View Report
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Raffle Draw Winning Report Component
  const RaffleDrawReport = () => {
    interface RaffleApiResponse {
      status: string;
      message: string;
      current_datetime?: string;
      data?: {
        gross_winning_value?: number;
        total_no_of_winners?: number;
        no_of_redemption?: number;
        value_of_redemption?: number;
        no_of_pending_redemption?: number;
        value_of_pending_redemption?: number;
      };
    }

    const [sortBy, setSortBy] = useState("");
    const [customStart, setCustomStart] = useState("");
    const [customEnd, setCustomEnd] = useState("");

    // Debounced filter values
    const [debouncedSortBy, setDebouncedSortBy] = useState("");
    const [debouncedCustomStart, setDebouncedCustomStart] = useState("");
    const [debouncedCustomEnd, setDebouncedCustomEnd] = useState("");

    // Debounce filter changes
    useEffect(() => {
      const timer = setTimeout(() => {
        setDebouncedSortBy(sortBy);
        setDebouncedCustomStart(customStart);
        setDebouncedCustomEnd(customEnd);
      }, 500);

      return () => clearTimeout(timer);
    }, [sortBy, customStart, customEnd]);

    const buildRaffleParams = () => {
      const params = new URLSearchParams();
      if (debouncedSortBy === "yesterday") params.append("filter", "yesterday");
      if (debouncedSortBy === "last_week") params.append("filter", "last_week");
      else if (debouncedSortBy === "last_month") params.append("filter", "last_month");
      else if (debouncedSortBy === "last_year") params.append("filter", "last_year");
      else if (debouncedSortBy === "custom" && debouncedCustomStart && debouncedCustomEnd) {
        params.append("filter", "custom");
        params.append("start_date", debouncedCustomStart);
        params.append("end_date", debouncedCustomEnd);
      }
      return params.toString();
    };

    const raffleFilterParams = buildRaffleParams();
    const raffleEnabled = !(debouncedSortBy === "custom" && (!debouncedCustomStart || !debouncedCustomEnd));

    const { data: raffleRaw, isLoading: raffleLoading, error: raffleError } = useQuery({
      queryKey: ["get_raffle_draw_summary", raffleFilterParams], // Include filter params
      queryFn: async () => {
        const url = `${process.env.NEXT_PUBLIC_BASE_URL}/admin/raffle_draw_summary/?${raffleFilterParams}`;
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
      enabled: raffleEnabled,
    });

    const api = raffleRaw as unknown as RaffleApiResponse | undefined;
    const headerTime = api?.current_datetime;
    const d = api?.data || {};

    return (
      <div className="w-full min-h-screen bg-gray-50">
        <div className="bg-[#F6F6F6] px-8 pt-8 pb-6">
          <span
            onClick={() => setShowRaffleDrawReport(false)}
            className="text-[#F25E26] cursor-pointer text-sm block mb-4 ml-1"
            style={{ marginTop: "4px" }}
          >
            Back
          </span>
          <h1 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900 mb-1">Reports</h1>
          <p className="text-xs sm:text-sm md:text-base font-medium text-gray-700">
            Raffle Draw Winning Report{" "}
            <span className="text-xs sm:text-sm font-normal">{headerTime ? `(${headerTime})` : ""}</span>
          </p>
        </div>
        <div className="max-w-5xl mx-auto px-8">
          <div className="flex justify-end items-center mt-8 mb-8 gap-4">
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
                  className="border border-gray-300 rounded-lg px-2 py-2 text-gray-700 text-sm"
                  value={customStart}
                  onChange={(e) => setCustomStart(e.target.value)}
                  placeholder="Start date"
                />
                <span className="mx-1">to</span>
                <input
                  type="date"
                  className="border border-gray-300 rounded-lg px-2 py-2 text-gray-700 text-sm"
                  value={customEnd}
                  onChange={(e) => setCustomEnd(e.target.value)}
                  placeholder="End date"
                />
              </>
            )}
          </div>
          {raffleLoading ? (
            <div className="flex justify-center items-center py-12">Loading...</div>
          ) : raffleError ? (
            <div className="flex justify-center items-center py-12 text-red-600">Error loading data.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
              <div className="rounded-xl border-2 border-red-200 bg-red-50 p-4 md:p-6 lg:p-8 flex flex-col items-center justify-center min-h-[120px]">
                <div className="text-xs sm:text-sm md:text-base font-medium text-gray-700 mb-2 text-center">
                  Gross Winning Value
                </div>
                <div className="text-base sm:text-lg md:text-xl lg:text-2xl font-semibold text-gray-900 text-center">
                  {formatNaira(d.gross_winning_value || 0)}
                </div>
              </div>
              <div className="rounded-xl border-2 border-purple-200 bg-purple-50 p-4 md:p-6 lg:p-8 flex flex-col items-center justify-center min-h-[120px]">
                <div className="text-xs sm:text-sm md:text-base font-medium text-gray-700 mb-2 text-center">
                  Total Number of Winners
                </div>
                <div className="text-base sm:text-lg md:text-xl lg:text-2xl font-semibold text-gray-900 text-center">
                  {d.total_no_of_winners || 0}
                </div>
              </div>
              <div className="rounded-xl border-2 border-yellow-200 bg-yellow-50 p-4 md:p-6 lg:p-8 flex flex-col items-center justify-center min-h-[120px]">
                <div className="text-xs sm:text-sm md:text-base font-medium text-gray-700 mb-2 text-center">
                  Number of Redemption
                </div>
                <div className="text-base sm:text-lg md:text-xl lg:text-2xl font-semibold text-gray-900 text-center">
                  {d.no_of_redemption || 0}
                </div>
              </div>
              <div className="rounded-xl border-2 border-blue-200 bg-blue-50 p-4 md:p-6 lg:p-8 flex flex-col items-center justify-center min-h-[120px]">
                <div className="text-xs sm:text-sm md:text-base font-medium text-gray-700 mb-2 text-center">
                  Value of Redemption
                </div>
                <div className="text-base sm:text-lg md:text-xl lg:text-2xl font-semibold text-gray-900 text-center">
                  {formatNaira(d.value_of_redemption || 0)}
                </div>
              </div>
              <div className="rounded-xl border-2 border-blue-200 bg-blue-50 p-4 md:p-6 lg:p-8 flex flex-col items-center justify-center min-h-[120px]">
                <div className="text-xs sm:text-sm md:text-base font-medium text-gray-700 mb-2 text-center">
                  Number of Pending Redemption
                </div>
                <div className="text-base sm:text-lg md:text-xl lg:text-2xl font-semibold text-gray-900 text-center">
                  {d.no_of_pending_redemption || 0}
                </div>
              </div>
              <div className="rounded-xl border-2 border-green-200 bg-green-50 p-4 md:p-6 lg:p-8 flex flex-col items-center justify-center min-h-[120px]">
                <div className="text-xs sm:text-sm md:text-base font-medium text-gray-700 mb-2 text-center">
                  Value of Pending Redemption
                </div>
                <div className="text-base sm:text-lg md:text-xl lg:text-2xl font-semibold text-gray-900 text-center">
                  {formatNaira(d.value_of_pending_redemption || 0)}
                </div>
              </div>
            </div>
          )}
          <div className="flex justify-center mt-8 mb-8">
            <button
              onClick={() => router.push("/dashboard/raffletickets")}
              className="bg-red-100 hover:bg-red-200 text-gray-900 font-medium py-2 md:py-3 px-6 md:px-12 rounded-lg transition-colors duration-200 text-xs sm:text-sm md:text-base border border-red-200"
            >
              View Report
            </button>
          </div>
        </div>
      </div>
    );
  };

  // If Regular Deals Report is active, show that content
  if (showRegularDealsReport) {
    return (
      <section>
        <PageLayout>
          <Suspense fallback={<Loading />}>
            <RegularDealsReport />
          </Suspense>
        </PageLayout>
      </section>
    );
  }

  if (showAuctionCustomersReport) {
    return (
      <section>
        <PageLayout>
          <Suspense fallback={<Loading />}>
            <AuctionCustomersReport />
          </Suspense>
        </PageLayout>
      </section>
    );
  }

  if (showRechargeTransactionReport) {
    return (
      <section>
        <PageLayout>
          <Suspense fallback={<Loading />}>
            <RechargeTransactionReport />
          </Suspense>
        </PageLayout>
      </section>
    );
  }

  if (showCustomerStatistics) {
    return (
      <section>
        <PageLayout>
          <Suspense fallback={<Loading />}>
            <CustomerStatisticsReport />
          </Suspense>
        </PageLayout>
      </section>
    );
  }

  if (showRaffleDrawReport) {
    return (
      <section>
        <PageLayout>
          <Suspense fallback={<Loading />}>
            <RaffleDrawReport />
          </Suspense>
        </PageLayout>
      </section>
    );
  }

  if (reportLoading) {
    return <Loading />
  }

  return (
    <section>
      <PageLayout>
        <Suspense fallback={<Loading />}>
        <div className="w-full px-4 md:w-5/6 md:mx-auto max-w-7xl overflow-hidden">
          <section
            className={` ${
              isNavbarOpen ? "justify-center items-center" : ""
            } flex-col flex w-full`}
          >
            {/* Header */}
            <div className="bg-[#F6F6F6] border border-b-[#e9dddd] h-20 flex justify-between items-center px-6 sticky top-0">
              <div className="flex items-center gap-3">
                <div>
                  <h1 className="text-xl font-semibold text-gray-900">
                    Report Summary Dashboard
                  </h1>
                  <p className="text-sm text-gray-600">({currentTime})</p>
                </div>
                {reportFetching && (
                  <span className="inline-flex items-center text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded animate-pulse">
                    Updating…
                  </span>
                )}
              </div>
              <div className="flex items-center gap-4">
                <Select value={topSortBy} onValueChange={(val) => setTopSortBy(val)}>
                  <SelectTrigger className="h-10 w-[160px] rounded border px-3 selector">
                    <SelectValue placeholder="All Time" />
                  </SelectTrigger>
                  <SelectContent style={{ backgroundColor: '#ffffff', color: '#2A2A2A' }}>
                    <SelectItem value="all_time" className='data-[highlighted]:bg-[#FCDFD4] data-[state=checked]:bg-[#FCDFD4] data-[state=checked]:text-[#111827]'>All Time</SelectItem>
                    <SelectItem value="yesterday" className='data-[highlighted]:bg-[#FCDFD4] data-[state=checked]:bg-[#FCDFD4] data-[state=checked]:text-[#111827]'>Yesterday</SelectItem>
                    <SelectItem value="last_7_days" className='data-[highlighted]:bg-[#FCDFD4] data-[state=checked]:bg-[#FCDFD4] data-[state=checked]:text-[#111827]'>Last 7 Days</SelectItem>
                    <SelectItem value="last_month" className='data-[highlighted]:bg-[#FCDFD4] data-[state=checked]:bg-[#FCDFD4] data-[state=checked]:text-[#111827]'>Last Month</SelectItem>
                    <SelectItem value="last_year" className='data-[highlighted]:bg-[#FCDFD4] data-[state=checked]:bg-[#FCDFD4] data-[state=checked]:text-[#111827]'>Last Year</SelectItem>
                    <SelectItem value="custom" className='data-[highlighted]:bg-[#FCDFD4] data-[state=checked]:bg-[#FCDFD4] data-[state=checked]:text-[#111827]'>Custom</SelectItem>
                  </SelectContent>
                </Select>
                {topSortBy === "custom" && (
                  <>
                    <input
                      type="date"
                      className="border border-gray-300 rounded px-2 py-1 text-sm"
                      value={topCustomStart}
                      onChange={(e) => setTopCustomStart(e.target.value)}
                    />
                    <span className="mx-1">to</span>
                    <input
                      type="date"
                      className="border border-gray-300 rounded px-2 py-1 text-sm"
                      value={topCustomEnd}
                      onChange={(e) => setTopCustomEnd(e.target.value)}
                    />
                  </>
                )}
              </div>
            </div>

            {/* Main Dashboard Content */}
            <div className="p-6 bg-gray-50">
              <div className="grid grid-cols-1  lg:grid-cols-2 gap-6 mb-6">
                <div
                  className="bg-teal-50 border-2 border-teal-300 rounded-lg p-6 hover:bg-teal-500 hover:text-white transition-all duration-300 cursor-pointer group"
                  onClick={() => setOpenReport("auction")}
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center group-hover:bg-teal-600">
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="text-gray-700 group-hover:text-white"
                      >
                        <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                        <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
                        <path d="M12 11h4" />
                        <path d="M12 16h4" />
                        <path d="M8 11h.01" />
                        <path d="M8 16h.01" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-white">
                      Customers Master Report
                    </h3>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="flex flex-wrap ">
                      <p className="text-xs text-gray-600 mb-1 group-hover:text-teal-100">
                        Auction Customers GTV.
                      </p>
                      <p className="text-lg font-semibold text-gray-900 group-hover:text-white">
                        {reportInfo?.data
                          ? formatNaira(
                              reportInfo.data.total_auction_customers_GTV || 0
                            )
                          : "₦0.00"}
                      </p>
                    </div>
                    <div className="flex gap-1 flex-wrap">
                      <p className="text-xs text-gray-600 mb-1 group-hover:text-teal-100">
                        Regular Customer GTV
                      </p>
                      <p className="text-lg font-semibold text-gray-900 group-hover:text-white">
                        {reportInfo?.data
                          ? formatNaira(
                              reportInfo.data.total_regular_customers_GTV || 0
                            )
                          : "₦0.00"}
                      </p>
                    </div>
                    <div className="flex gap-1 flex-wrap">
                      <p className="text-xs text-gray-600 mb-1 group-hover:text-teal-100">
                        No of Auction Customer.
                      </p>
                      <p className="text-base font-semibold text-gray-900 group-hover:text-white">
                        {reportInfo?.data?.total_auction_customers || 0}
                      </p>
                    </div>
                    <div className="flex gap-1 flex-wrap">
                      <p className="text-xs text-gray-600 mb-1 group-hover:text-teal-100">
                        No Of Regular Customer
                      </p>
                      <p className="text-base font-semibold text-gray-900 group-hover:text-white">
                        {reportInfo?.data?.total_regular_customers || 0}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Service Uptime Report */}
                <Link href="/serviceuptimereport" className="block">
                  <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-6 hover:bg-blue-600 hover:text-white transition-all duration-300 cursor-pointer group">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center group-hover:bg-blue-700">
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          className="text-gray-700 group-hover:text-white"
                        >
                          <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 group-hover:text-white">
                        Service Uptime Report
                      </h3>
                    </div>

                    <div className="flex items-center justify-center">
                      <div className="relative w-24 h-24">
                        <Doughnut data={uptimeData} options={uptimeOptions} />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-center">
                            <div className="text-xs text-gray-600 group-hover:text-blue-100">
                              Summary
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="ml-8">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-sm text-gray-700 group-hover:text-blue-100">
                            Success Rate
                          </span>
                        </div>
                        <div className="text-2xl font-semibold text-gray-900 group-hover:text-white mb-4">
                          {reportInfo?.data?.service_uptime?.success || "75%"}
                        </div>
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                          <span className="text-sm text-gray-700 group-hover:text-blue-100">
                            Failure Rate
                          </span>
                        </div>
                        <div className="text-2xl font-semibold text-gray-900 group-hover:text-white">
                          {reportInfo?.data?.service_uptime?.failure || "25%"}
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>

              {/* Middle Row - Transaction Reports */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                {/* Regular Deals Transaction Report */}
                <div
                  className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:bg-red-500 hover:text-white transition-all duration-300 cursor-pointer group"
                  onClick={() => setShowRegularDealsReport(true)}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-[#ffffff]">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="text-gray-700 group-hover:text-black"
                      >
                        <rect
                          x="2"
                          y="3"
                          width="20"
                          height="14"
                          rx="2"
                          ry="2"
                        />
                        <line x1="8" y1="21" x2="16" y2="21" />
                        <line x1="12" y1="17" x2="12" y2="21" />
                      </svg>
                    </div>
                    <h4 className="text-sm font-semibold text-gray-900 group-hover:text-white">
                      Regular Deals Transaction Report
                    </h4>
                  </div>
                  <div className="flex flex-col items-center justify-center flex-wrap">
                    <div className="text-sm text-gray-600 mb-2 group-hover:text-red-100">
                      Regular GTV
                    </div>
                    <div className="text-2xl font-semibold text-gray-900 group-hover:text-white">
                    {reportInfo?.data
                          ? formatNaira(
                              reportInfo.data.total_regular_customers_GTV || 0
                            )
                          : "₦0.00"}
                    </div>
                  </div>
                </div>

                {/* Auction Transaction Report */}
                <div
                  onClick={() => setShowAuctionCustomersReport(true)}
                  className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:bg-purple-500 hover:text-white transition-all duration-300 cursor-pointer group"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-purple-600">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="text-gray-700 group-hover:text-white"
                      >
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <polyline points="14,2 14,8 20,8" />
                        <line x1="16" y1="13" x2="8" y2="13" />
                        <line x1="16" y1="17" x2="8" y2="17" />
                        <polyline points="10,9 9,9 8,9" />
                      </svg>
                    </div>
                    <h4 className="text-sm font-semibold text-gray-900 group-hover:text-white">
                      Auction Transaction Report
                    </h4>
                  </div>
                  <div className="flex flex-col items-center justify-center flex-wrap">
                    <div className="text-sm text-gray-600 mb-2 group-hover:text-purple-100">
                      Auction GTV
                    </div>
                    <div className="text-2xl font-semibold text-gray-900 group-hover:text-white">
                    {reportInfo?.data
                          ? formatNaira(
                              reportInfo.data.total_auction_customers_GTV || 0
                            )
                          : "₦0.00"}
                    </div>
                  </div>
                </div>

                {/* Recharge Transaction Report */}
                <div
                  className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:bg-yellow-500 hover:text-white transition-all duration-300 cursor-pointer group"
                  onClick={() => setShowRechargeTransactionReport(true)}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-yellow-600">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="text-gray-700 group-hover:text-white"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12,6 12,12 16,14" />
                      </svg>
                    </div>
                    <h4 className="text-sm font-semibold text-gray-900 group-hover:text-white">
                      Recharge Transaction Report
                    </h4>
                  </div>
                  <div className="flex flex-col items-center justify-center flex-wrap">
                    <div className="text-sm text-gray-600 mb-2 group-hover:text-yellow-100">
                      Recharge GTV
                    </div>
                    <div className="text-2xl font-semibold text-gray-900 group-hover:text-white">
                    {reportInfo?.data
                          ? formatNaira(
                              reportInfo.data.total_bills_trans || 0
                            )
                          : "₦0.00"}
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Row - Statistics */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Customer Statistics */}
                <div
                  className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:bg-teal-500 hover:text-white transition-all duration-300 cursor-pointer group"
                  onClick={() => setShowCustomerStatistics(true)}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-teal-600">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="text-gray-700 group-hover:text-white"
                      >
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                      </svg>
                    </div>
                    <h4 className="text-sm font-semibold text-gray-900 group-hover:text-white">
                      Customer Statistics
                    </h4>
                  </div>
                  <div className="space-y-3">
                    <div className="flex gap-2 flex-wrap">
                      <div className="text-sm text-gray-600 group-hover:text-teal-100">
                        Customer Wallet Bal
                      </div>
                      <div className="text-2xl font-semibold text-gray-900 group-hover:text-white">
                      {reportInfo?.data
                          ? formatNaira(
                              reportInfo.data.total_wallet_balance || 0
                            )
                          : "₦0.00"}
                      </div>
                    </div>
                    <div className="flex gap-4 flex-wrap">
                      <div className="text-sm text-gray-600 group-hover:text-teal-100">
                        No of Customers
                      </div>
                      <div className="text-xl font-semibold text-gray-900 group-hover:text-white">
                        {reportInfo?.data?.no_of_customers}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Revenue Summary Report */}
                <div
                  className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:bg-blue-500 hover:text-white transition-all duration-300 cursor-pointer group"
                  onClick={() => router.push("/dashboard/revenuesummaryreport")}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-blue-600">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="text-gray-700 group-hover:text-white"
                      >
                        <polyline points="22,12 18,12 15,21 9,3 6,12 2,12" />
                      </svg>
                    </div>
                    <h4 className="text-sm font-semibold text-gray-900 group-hover:text-white">
                      Revenue Summary Report
                    </h4>
                  </div>
                  <div className="flex justify-center items-center flex-col flex-wrap">
                    <div className="text-sm text-gray-600 mb-2 group-hover:text-blue-100">
                      Consolidated Revenue
                    </div>
                    <div className="text-2xl font-semibold text-gray-900 group-hover:text-white">
                    {reportInfo?.data
                          ? formatNaira(
                              reportInfo.data.revenue_summary_report || 0
                            )
                          : "₦0.00"}
                    </div>
                  </div>
                </div>

                {/* Raffle Draw Winning Report */}
                <div
                  className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:bg-green-500 hover:text-white transition-all duration-300 cursor-pointer group"
                  onClick={() => setShowRaffleDrawReport(true)}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-green-600">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="text-gray-700 group-hover:text-white"
                      >
                        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                        <line x1="3" y1="6" x2="21" y2="6" />
                        <path d="M16 10a4 4 0 0 1-8 0" />
                      </svg>
                    </div>
                    <h4 className="text-sm font-semibold text-gray-900 group-hover:text-white">
                      Raffle Draw Winning Report
                    </h4>
                  </div>
                  <div className="space-y-3">
                    <div className="flex gap-1 flex-wrap">
                      <div className="text-sm text-gray-600 group-hover:text-green-100">
                        Gross Winning Volume
                      </div>
                      <div className="text-2xl font-semibold text-gray-900 group-hover:text-white">
                      {reportInfo?.data
                          ? formatNaira(
                              reportInfo.data.raffle_draw_winning_volume || 0
                            )
                          : "₦0.00"}
                      </div>
                    </div>
                    <div className="flex gap-4 flex-wrap">
                      <div className="text-sm text-gray-600 group-hover:text-green-100">
                        Total No of Winners
                      </div>
                      <div className="text-xl font-semibold text-gray-900 group-hover:text-white">
                        {reportInfo?.data?.total_raffle_winner}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
        {/* Modal for Master Reports */}
        <ModalComponent
          isModalOpen={openReport !== null}
          handleCancel={() => setOpenReport(null)}
          content={modalButtons}
        />
        </Suspense>
      </PageLayout>
    </section>
  );
};

const Page = () => (
  <Suspense fallback={<Loading />}>
    <ReportsPageContent />
  </Suspense>
);

export default Page;
