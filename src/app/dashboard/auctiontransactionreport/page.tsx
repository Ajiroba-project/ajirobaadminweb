"use client";
import React, { useState, useEffect } from "react";
import { ProfileHeader } from "@/app/components/Header";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Brand from "@/app/asset/logo.svg";
import { ReportsTable } from "../components/ReportsTable";
import { DownloadModal } from "@/app/components/DownloadModal";
import { exportToPDF, exportToXLS, ExportData } from "@/utils/exportUtils";
import { useGetDatanew } from "@/hooks/useGetData";
import Cookies from "js-cookie";
import useAuthMiddleware from "@/hooks/useAuthMiddleware";
import Loading from "@/app/components/Loading";
// import Loading from "@/app/components/Loading";

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

  const [dateFilter, setDateFilter] = useState("");
  const [sort, setSort] = useState("");
  const [filterBy, setFilterBy] = useState<string[]>([]);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [customDateRange, setCustomDateRange] = useState({ start: "", end: "" });
  const [showCustomDatePicker, setShowCustomDatePicker] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [currentTime, setCurrentTime] = useState<string>("");
  const [userToken] = useState(Cookies.get("token"));


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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      const sortDropdown = target.closest(".sort-dropdown");
      const filterDropdown = target.closest(".filter-dropdown");
      
      // Only close dropdowns if clicking outside both dropdowns
      if (!sortDropdown && !filterDropdown) {
        setShowFilterDropdown(false);
        setShowSortDropdown(false);
        setShowCustomDatePicker(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);



 // Construct filter parameters for API
 const getFilterParams = () => {
  const params = new URLSearchParams();
  
  if (currentPage > 1) {
    params.append('page', currentPage.toString());
  }
  
  // Handle custom date range for raffle date filtering
  if (customDateRange.start && customDateRange.end) {
    params.append('raffle_start_date', customDateRange.start);
    params.append('raffle_end_date', customDateRange.end);
  } else if (dateFilter && dateFilter !== 'custom') {
    // Only add filter parameter if it's not custom and we have a dateFilter
    params.append('raffle_filter', dateFilter);
  }
  
  return params.toString();
};

// API integration
const url = `${process.env.NEXT_PUBLIC_BASE_URL}/admin/auction_transaction_report/?${getFilterParams()}`;
const {
  data: auctionTransactionData,
  isLoading: auctionTransactionLoading,
  error: auctionTransactionError,
} = useGetDatanew(url, "get_regular_transaction_report", userToken || " ");

// Debug logging
// useEffect(() => {
//   console.log('URL:', url);
//   console.log('Date Filter:', dateFilter);
//   console.log('Custom Date Range:', customDateRange);
//   console.log('Filter Params:', getFilterParams());
//   console.log('Auction Transaction Data:', auctionTransactionData);
// }, [url, dateFilter, customDateRange, auctionTransactionData]);

// Transform API data to match component structure
const transformApiData = (apiData: any): any[] => {
  if (!apiData) {
    return [];
  }

  // console.log(apiData, 'apiiiddd')
  
  return apiData?.map((item: any) => {
    const productInfo = item.auction_info?.[0] || {};
    const ticket_details = item.ticket_details || {};
    const settllement_details = item.settlement_details || {};
    return {
      productId: productInfo.product_no || 'N/A',
      productno: productInfo.product_id || 'N/A',
      productName: productInfo.product_name || 'N/A',
      ticketno: ticket_details.no_of_tickets || 0,
      ticketprice: ticket_details.ticket_price || 0,
      ticketgtv: ticket_details.ticket_gtv || 0,
      ticketrda: settllement_details.rda || 0,
      ticketeca: settllement_details?.eca || 0,
      raffledate: ticket_details.raffle_date || 'N/A', 
  
   
      id: item.id || 'N/A',
    };
  });
};





  // Update pagination state when data changes
  useEffect(() => {
    if (auctionTransactionData) {
      const apiResponse = auctionTransactionData as unknown as RegularTransactionApiResponse;
      setTotalPages(Math.ceil(apiResponse.count / pageSize));
      setHasNextPage(!!apiResponse.next);
      setHasPreviousPage(!!apiResponse.previous);
    }
  }, [auctionTransactionData, pageSize]);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [dateFilter, customDateRange, search, filterBy]);

  // Close dropdowns when filters change
  useEffect(() => {
    if (dateFilter && dateFilter !== 'custom') {
      setShowSortDropdown(false);
      setShowCustomDatePicker(false);
    }
  }, [dateFilter]);

  const transformedData = transformApiData((auctionTransactionData as unknown as RegularTransactionApiResponse)?.results?.data);

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



  // Handle ticket number click
  const handleTicketClick = (row: any) => {



    //  router.push(`/ticketdetailsreport/${row.productId}`);
    router.push(`/ticketdetailsreport/?productno=${row.productno}&itemid=${row.id}`);

  };

  // Table columns for Auction Transaction Report
  const columnsAuctionTransaction = [
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
    { 
      key: "ticketno", 
      label: "NUMBER OF TICKETS", 
      sum: true, 
      cellClassName: "text-[#F25E26] underline cursor-pointer",
      render: (row: any) => (
        <span 
          onClick={() => handleTicketClick(row)}
          className="text-[#F25E26] underline cursor-pointer hover:text-[#d63918]"
        >
          {row.ticketno}
        </span>
      )
    },
    { key: "ticketprice", label: "TICKET PRICE (NGN)", sum: true },
    { key: "ticketgtv", label: "TOTAL GTV (NGN)", sum: true },
    { key: "ticketrda", label: "RDA (NGN)", sum: true },
    { key: "ticketeca", label: "ECA (NGN)", sum: true },
    {key: "raffledate", label: "RAFFLE DATE"}
  ];

  // // Placeholder data matching the screenshot
  // const auctionTransactionData = [
  //   {
  //     productId: "5648T53",
  //     productName: "T-shirt",
  //     numberOfTickets: 300,
  //     ticketPrice: 2000,
  //     totalGtv: 2500,
  //     rda: 1500,
  //     eca: 1500,
  //     date: "23 May 2024"
  //   },
  //   {
  //     productId: "5648T53",
  //     productName: "Rice",
  //     numberOfTickets: 300,
  //     ticketPrice: 2000,
  //     totalGtv: 2500,
  //     rda: 1500,
  //     eca: 1500,
  //        date: "23 May 2025"
  //   },
  //   {
  //     productId: "5648T53",
  //     productName: "T-shirt",
  //     numberOfTickets: 300,
  //     ticketPrice: 2000,
  //     totalGtv: 2500,
  //     rda: 1500,
  //     eca: 1500,
  //        date: "02 August 2025"
  //   },
  //   {
  //     productId: "5648T53",
  //     productName: "Rice",
  //     numberOfTickets: 300,
  //     ticketPrice: 2000,
  //     totalGtv: 2500,
  //     rda: 1500,
  //     eca: 1500,
  //      date: "01 April 2023"
  //   },
  //   // Add more rows as needed for visual effect
  //   {
  //     productId: "5648T53",
  //     productName: "Rice",
  //     numberOfTickets: 300,
  //     ticketPrice: 2000,
  //     totalGtv: 2500,
  //     rda: 1500,
  //     eca: 1500,
  //         date: "01 April 2025"
  //   },
  //   {
  //     productId: "5648T53",
  //     productName: "Rice",
  //     numberOfTickets: 300,
  //     ticketPrice: 2000,
  //     totalGtv: 2500,
  //     rda: 1500,
  //     eca: 1500,
  //   },
  //   {
  //     productId: "5648T53",
  //     productName: "Rice",
  //     numberOfTickets: 300,
  //     ticketPrice: 2000,
  //     totalGtv: 2500,
  //     rda: 1500,
  //     eca: 1500,
  //   },
  //   {
  //     productId: "5648T53",
  //     productName: "Rice",
  //     numberOfTickets: 300,
  //     ticketPrice: 2000,
  //     totalGtv: 2500,
  //     rda: 1500,
  //     eca: 1500,
  //   },
  //   {
  //     productId: "5648T53",
  //     productName: "Rice",
  //     numberOfTickets: 300,
  //     ticketPrice: 2000,
  //     totalGtv: 2500,
  //     rda: 1500,
  //     eca: 1500,
  //   },
  //   {
  //     productId: "5648T53",
  //     productName: "Rice",
  //     numberOfTickets: 300,
  //     ticketPrice: 2000,
  //     totalGtv: 2500,
  //     rda: 1500,
  //     eca: 1500,
  //   },
  // ];

  // Filtering and sorting logic
  const getFilteredAndSortedData = () => {
    let filteredData = [...transformedData];

    // Search filtering
    if (search) {
      filteredData = filteredData.filter(
        (item) =>
          item.productId.toLowerCase().includes(search.toLowerCase()) ||
          item.productName.toLowerCase().includes(search.toLowerCase()) ||
          item.ticketno.toString().includes(search) ||
          item.ticketprice.toString().includes(search) ||
          item.ticketgtv.toString().includes(search) ||
          item.ticketrda.toString().includes(search) ||
          item.ticketeca.toString().includes(search)
      );
    }

    // Date filtering - filter by raffle date
    if (dateFilter === 'custom' && customDateRange.start && customDateRange.end) {
      filteredData = filteredData.filter((item) => {
        if (!item.raffledate || item.raffledate === 'N/A') return false;
        
        const raffleDate = new Date(item.raffledate);
        const startDate = new Date(customDateRange.start);
        const endDate = new Date(customDateRange.end);
        
        return raffleDate >= startDate && raffleDate <= endDate;
      });
    } else if (dateFilter && dateFilter !== 'custom') {
      // Handle predefined date ranges
      const now = new Date();
      let startDate, endDate;
      
      switch (dateFilter) {
        case 'last_week':
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          endDate = now;
          break;
        case 'last_month':
          startDate = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
          endDate = now;
          break;
        case 'last_year':
          startDate = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
          endDate = now;
          break;
        default:
          return filteredData;
      }
      
      filteredData = filteredData.filter((item) => {
        if (!item.raffledate || item.raffledate === 'N/A') return false;
        
        const raffleDate = new Date(item.raffledate);
        return raffleDate >= startDate && raffleDate <= endDate;
      });
    }

    return filteredData;
  };

  const displayData = getFilteredAndSortedData();
  
  // Debug logging for filtering
  // useEffect(() => {
  //   console.log('Transformed Data Length:', transformedData.length);
  //   console.log('Display Data Length:', displayData.length);
  //   console.log('Date Filter:', dateFilter);
  //   console.log('Custom Date Range:', customDateRange);
  //   console.log('Search:', search);
  // }, [transformedData.length, displayData.length, dateFilter, customDateRange, search]);

  // Download handlers
  const handleDownloadPDF = async () => {
    const exportData: ExportData[] = displayData.map((item) => ({
      productId: item.productId,
      productName: item.productName,
      numberOfTickets: item.ticketno,
      ticketprice: item.ticketprice,
      totalGtv: item.ticketgtv,
      rda: item.ticketrda,
      eca: item.ticketeca,
    }));
    setShowDownloadModal(false);
    await exportToPDF(exportData, {
      title: "Auction Transaction Report",
      fileName: "Auction_Transaction_Report",
    });
  };

  const handleDownloadXLS = () => {
    const exportData: ExportData[] = displayData.map((item) => ({
      productId: item.productId,
      productName: item.productName,
      numberOfTickets: item.ticketno,
      ticketprice: item.ticketprice,
      totalGtv: item.ticketgtv,
      rda: item.ticketrda,
      eca: item.ticketeca,
    }));
    exportToXLS(exportData, {
      title: "Auction Transaction Report",
      fileName: "Auction_Transaction_Report",
      columns: [
        { key: "productId", header: "Product ID", width: 15 },
        { key: "productName", header: "Product Name", width: 20 },
        { key: "numberOfTickets", header: "Number of Tickets", width: 15 },
        { key: "ticketPrice", header: "Ticket Price (NGN)", width: 15 },
        { key: "totalGtv", header: "Total GTV (NGN)", width: 15 },
        { key: "rda", header: "RDA (NGN)", width: 15 },
        { key: "eca", header: "ECA (NGN)", width: 15 },
      ],
      summaryRows: [
        { label: "Total Records", value: exportData.length },
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

  if (auctionTransactionLoading ){
    return   <Loading />
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
            Auction Transaction Report
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
          {/* Filter by dropdown (future) */}
         {/*  <div className="relative filter-dropdown">
            <button
              onClick={() => setShowFilterDropdown(!showFilterDropdown)}
              className="w-full md:w-auto px-4 py-2 border border-[#E9E9E9] rounded-md bg-white text-[#353131] text-sm font-Poppins focus:outline-none focus:ring-2 focus:ring-[#F25E26] flex items-center justify-between min-w-[120px]"
            >
              Filter by
              <svg
                className={`ml-2 h-4 w-4 transition-transform ${showFilterDropdown ? "rotate-180" : ""}`}
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
           
          </div> */}
          {/* Sort by dropdown (date range, placeholder) */}
     
                <div className="relative sort-dropdown">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setShowSortDropdown(!showSortDropdown);
              }}
              className="w-full md:w-auto px-4 py-2 border border-[#E9E9E9] rounded-md bg-white text-[#353131] text-sm font-Poppins focus:outline-none focus:ring-2 focus:ring-[#F25E26] flex items-center justify-between min-w-[120px]"
            >
              {dateFilter === 'custom' && customDateRange.start && customDateRange.end 
                ? `Custom (${customDateRange.start} - ${customDateRange.end})`
                : dateFilter 
                ? dateFilter.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()) 
                : 'Filter by Raffle Date'}
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
              <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-[#E9E9E9] rounded-md shadow-lg z-10 max-h-60 overflow-y-auto">
                <div className="p-2 space-y-1">
                  {[
                    { value: 'last_week', label: 'Last Week' },
                    { value: 'last_month', label: 'Last Month' },
                    { value: 'last_year', label: 'Last Year' },
                    { value: 'custom', label: 'Custom' }
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setDateFilter(option.value);
                        if (option.value === 'custom') {
                          setShowCustomDatePicker(true);
                          setShowSortDropdown(false);
                        } else {
                          setShowSortDropdown(false);
                        }
                      }}
                      className={`w-full text-left px-3 py-2 text-sm rounded hover:bg-gray-50 transition-colors ${
                        dateFilter === option.value ? 'bg-[#F25E26] text-white' : 'text-[#353131]'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                  {dateFilter && (
                    <div className="pt-2 border-t border-gray-200">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setDateFilter('');
                          setCustomDateRange({ start: '', end: '' });
                          setShowSortDropdown(false);
                          setShowCustomDatePicker(false);
                        }}
                        className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded transition-colors"
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
              <div 
                className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 sm:absolute sm:inset-auto sm:top-full sm:left-0 sm:mt-1 sm:bg-transparent"
                onClick={(e) => {
                  if (e.target === e.currentTarget) {
                    setShowCustomDatePicker(false);
                  }
                }}
              >
                <div className="w-11/12 max-w-sm bg-white border border-[#E9E9E9] rounded-md shadow-lg p-4 max-h-96 overflow-y-auto sm:w-72 md:w-80">
                  <div className="space-y-3">
                    <h3 className="text-sm font-medium text-[#353131]">Select Raffle Date Range</h3>
                    <div className="space-y-2">
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Start Raffle Date</label>
                        <input
                          type="date"
                          value={customDateRange.start}
                          max={new Date().toISOString().split('T')[0]}
                          onChange={(e) => setCustomDateRange({ ...customDateRange, start: e.target.value })}
                          className="w-full px-3 py-2 border border-[#E9E9E9] rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#F25E26]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">End Raffle Date</label>
                        <input
                          type="date"
                          value={customDateRange.end}
                          min={customDateRange.start || new Date().toISOString().split('T')[0]}
                          max={new Date().toISOString().split('T')[0]}
                          onChange={(e) => setCustomDateRange({ ...customDateRange, end: e.target.value })}
                          className="w-full px-3 py-2 border border-[#E9E9E9] rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#F25E26]"
                        />
                      </div>
                    </div>
                    <div className="flex gap-2 pt-2">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          if (customDateRange.start && customDateRange.end) {
                            // Validate that end date is not before start date
                            if (new Date(customDateRange.end) >= new Date(customDateRange.start)) {
                              setDateFilter('custom');
                              setShowCustomDatePicker(false);
                            } else {
                              alert('End date must be after or equal to start date');
                            }
                          } else {
                            alert('Please select both start and end dates');
                          }
                        }}
                        className="flex-1 px-3 py-2 bg-[#F25E26] text-white text-sm rounded-md hover:bg-[#d63918] transition-colors"
                      >
                        Apply
                      </button>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setCustomDateRange({ start: '', end: '' });
                          setDateFilter('');
                          setShowCustomDatePicker(false);
                        }}
                        className="flex-1 px-3 py-2 border border-[#E9E9E9] text-[#353131] text-sm rounded-md hover:bg-gray-50 transition-colors"
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
      <div className="flex justify-center ">
        <div className="w-7/12 ">
          <div className=" bg-white rounded-lg shadow border mt-6 mb-12 overflow-x-scroll overflow-y-scroll  py-4">
            <div className="flex flex-row items-center gap-4 px-4 md:px-8 pt-8 pb-2">
              <AjirobaLogo />
            </div>
            <div className="bg-[#F25E26] text-white font-Poppins font-medium px-4 md:px-8 py-2 flex items-center justify-between text-sm rounded-t">
              <span>Auction Transaction Report</span>
              <span className="text-xs font-normal">{currentTime}</span>
            </div>
            <div className="overflow-x-auto">
              <ReportsTable data={displayData} columns={columnsAuctionTransaction} />
            </div>
            {displayData && displayData.length > 0 && (
              <div className="flex flex-col items-center py-4">
                <div className="text-sm text-gray-600 mb-2">
                  Total: {((auctionTransactionData as unknown as RegularTransactionApiResponse)?.count) || 0} records
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