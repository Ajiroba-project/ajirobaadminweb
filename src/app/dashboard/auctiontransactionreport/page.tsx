"use client";
import React, { useState, useEffect } from "react";
import { ProfileHeader } from "@/app/components/Header";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Brand from "@/app/asset/logo.svg";
import { ReportsTable } from "../components/ReportsTable";
import { DownloadModal } from "@/app/components/DownloadModal";
import { exportToPDF, exportToXLS, exportToPDFTable, ExportData } from "@/utils/exportUtils";
import { useGetDatanew } from "@/hooks/useGetData";
import Cookies from "js-cookie";
import useAuthMiddleware from "@/hooks/useAuthMiddleware";
import Loading from "@/app/components/Loading";
// import Loading from "@/app/components/Loading";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import axios from "axios";

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

  // Debounce filter changes (to avoid rapid refetches)
  const [debouncedDateFilter, setDebouncedDateFilter] = useState("");
  const [debouncedStart, setDebouncedStart] = useState("");
  const [debouncedEnd, setDebouncedEnd] = useState("");

  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedDateFilter(dateFilter);
      setDebouncedStart(customDateRange.start);
      setDebouncedEnd(customDateRange.end);
    }, 500);
    return () => clearTimeout(t);
  }, [dateFilter, customDateRange.start, customDateRange.end]);



 // Construct filter parameters for API (uses debounced values)
 const getFilterParams = () => {
  const params = new URLSearchParams();
  if (currentPage > 1) {
    params.append('page', currentPage.toString());
  }

  if (debouncedDateFilter === 'yesterday') {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yStr = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, "0")}-${String(yesterday.getDate()).padStart(2, "0")}`;
    // Use the same date for start and end to represent "yesterday"
    params.append('start_date', yStr);
    params.append('end_date', yStr);
  } else if (debouncedDateFilter === 'custom') {
    if (debouncedStart && debouncedEnd) {
      params.append('start_date', debouncedStart);
      params.append('end_date', debouncedEnd);
    }
  } else if (debouncedDateFilter) {
    // last_week, last_month, last_year
    params.append('raffle_filter', debouncedDateFilter);
  }

  return params.toString();
};

// API integration
const url = `${process.env.NEXT_PUBLIC_BASE_URL}/admin/auction_transaction_report/?${getFilterParams()}`;
const {
  data: auctionTransactionData,
  isLoading: auctionTransactionLoading,
  isFetching: auctionTransactionFetching,
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
   /*  router.push(`/dashboard/ticketdetails/${row.productno}?itemid=${row.id}`); */

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
          href={`/dashboard/productdetails-auction-completed/${row.productno}`}
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

  // Date filtering handled by backend via raffle_filter/start_date/end_date

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

  // Download handlers (export ALL pages with S/N)
  const handleDownloadPDF = async () => {
    try {
      setShowDownloadModal(false);

      const allRows: any[] = [];
      const baseUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/admin/auction_transaction_report/`;
      const buildExportParams = () => {
        const params = new URLSearchParams();
        if (dateFilter === 'yesterday') {
          const y = new Date();
          y.setDate(y.getDate() - 1);
          const yStr = `${y.getFullYear()}-${String(y.getMonth() + 1).padStart(2, '0')}-${String(y.getDate()).padStart(2, '0')}`;
          params.append('start_date', yStr);
          params.append('end_date', yStr);
        } else if (dateFilter === 'custom' && customDateRange.start && customDateRange.end) {
          params.append('start_date', customDateRange.start);
          params.append('end_date', customDateRange.end);
        } else if (dateFilter) {
          params.append('raffle_filter', dateFilter);
        }
        return params.toString();
      };

      let nextUrl: string | null = `${baseUrl}?${buildExportParams()}`;
      const headers = { headers: { Authorization: `Token ${userToken}` } } as const;

      for (let i = 0; i < 200 && nextUrl; i++) {
        const resp: any = await axios.get(nextUrl, headers);
        const res: any = resp.data;
        const pageItems: any[] = res?.results?.data || [];

        pageItems.forEach((item) => {
          const p: any = item.auction_info?.[0] || {};
          const t: any = item.ticket_details || {};
          const s: any = item.settlement_details || {};
          allRows.push({
            productId: p?.product_no || 'N/A',
            productName: p?.product_name || 'N/A',
            numberOfTickets: Number(t?.no_of_tickets || 0),
            ticketprice: Number(t?.ticket_price || 0),
            totalGtv: Number(t?.ticket_gtv || 0),
            rda: Number(s?.rda || 0),
            eca: Number(s?.eca || 0),
          });
        });

        nextUrl = res?.next || null;
      }

      if (allRows.length === 0) {
        alert('No data available to export');
        return;
      }

      const exportData: ExportData[] = allRows.map((row, idx) => ({
        S_N: idx + 1,
        productId: row.productId,
        productName: row.productName,
        numberOfTickets: row.numberOfTickets,
        ticketprice: row.ticketprice,
        totalGtv: row.totalGtv,
        rda: row.rda,
        eca: row.eca,
      }));

      await exportToPDFTable(exportData, {
        title: 'Auction Transaction Report',
        fileName: 'Auction_Transaction_Report',
        columns: [
          { key: 'S_N', header: 'S/N' },
          { key: 'productId', header: 'Product ID' },
          { key: 'productName', header: 'Product Name' },
          { key: 'numberOfTickets', header: 'Number of Tickets' },
          { key: 'ticketprice', header: 'Ticket Price (NGN)' },
          { key: 'totalGtv', header: 'Total GTV (NGN)' },
          { key: 'rda', header: 'RDA (NGN)' },
          { key: 'eca', header: 'ECA (NGN)' },
        ],
      });
    } catch (err) {
      alert('Failed to prepare PDF export.');
    }
  };

  const handleDownloadXLS = async () => {
    try {
      setShowDownloadModal(false);

      const allRows: any[] = [];
      const baseUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/admin/auction_transaction_report/`;
      const buildExportParams = () => {
        const params = new URLSearchParams();
        if (dateFilter === 'yesterday') {
          const y = new Date();
          y.setDate(y.getDate() - 1);
          const yStr = `${y.getFullYear()}-${String(y.getMonth() + 1).padStart(2, '0')}-${String(y.getDate()).padStart(2, '0')}`;
          params.append('start_date', yStr);
          params.append('end_date', yStr);
        } else if (dateFilter === 'custom' && customDateRange.start && customDateRange.end) {
          params.append('start_date', customDateRange.start);
          params.append('end_date', customDateRange.end);
        } else if (dateFilter) {
          params.append('raffle_filter', dateFilter);
        }
        return params.toString();
      };

      let nextUrl: string | null = `${baseUrl}?${buildExportParams()}`;
      const headers = { headers: { Authorization: `Token ${userToken}` } } as const;

      for (let i = 0; i < 200 && nextUrl; i++) {
        const resp: any = await axios.get(nextUrl, headers);
        const res: any = resp.data;
        const pageItems: any[] = res?.results?.data || [];
        pageItems.forEach((item) => {
          const p: any = item.auction_info?.[0] || {};
          const t: any = item.ticket_details || {};
          const s: any = item.settlement_details || {};
          allRows.push({
            productId: p?.product_no || 'N/A',
            productName: p?.product_name || 'N/A',
            numberOfTickets: Number(t?.no_of_tickets || 0),
            ticketprice: Number(t?.ticket_price || 0),
            totalGtv: Number(t?.ticket_gtv || 0),
            rda: Number(s?.rda || 0),
            eca: Number(s?.eca || 0),
          });
        });
        nextUrl = res?.next || null;
      }

      if (allRows.length === 0) {
        alert('No data available to export');
        return;
      }

      const exportData: ExportData[] = allRows.map((row, idx) => ({
        S_N: idx + 1,
        productId: row.productId,
        productName: row.productName,
        numberOfTickets: row.numberOfTickets,
        ticketprice: row.ticketprice,
        totalGtv: row.totalGtv,
        rda: row.rda,
        eca: row.eca,
      }));

      exportToXLS(exportData, {
        title: 'Auction Transaction Report',
        fileName: 'Auction_Transaction_Report',
        columns: [
          { key: 'S_N', header: 'S/N', width: 8 },
          { key: 'productId', header: 'Product ID', width: 15 },
          { key: 'productName', header: 'Product Name', width: 20 },
          { key: 'numberOfTickets', header: 'Number of Tickets', width: 15 },
          { key: 'ticketprice', header: 'Ticket Price (NGN)', width: 15 },
          { key: 'totalGtv', header: 'Total GTV (NGN)', width: 15 },
          { key: 'rda', header: 'RDA (NGN)', width: 15 },
          { key: 'eca', header: 'ECA (NGN)', width: 15 },
        ],
        summaryRows: [
          { label: 'Total Records', value: exportData.length },
          { label: 'Generated', value: new Date().toLocaleString() },
        ]
      });
    } catch (err) {
      alert('Failed to prepare Excel export.');
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

  if (auctionTransactionLoading ){
    return   <Loading />
  }

  return (
    <section className="flex flex-col min-h-screen bg-gray-100">
      <div className="w-full">
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
              Auction Transaction Report
            </h1>
            {auctionTransactionFetching && (
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
        <div className="w-full md:w-auto flex gap-4 items-center justify-end">
          <Select value={dateFilter} onValueChange={(val) => setDateFilter(val)}>
            <SelectTrigger className="h-10 w-[200px] rounded border px-3 selector">
              <SelectValue placeholder="Filter by Raffle Date" />
            </SelectTrigger>
            <SelectContent style={{ backgroundColor: '#ffffff', color: '#2A2A2A' }}>
              <SelectItem value="yesterday" className='data-[highlighted]:bg-[#FCDFD4] data-[state=checked]:bg-[#FCDFD4] data-[state=checked]:text-[#111827]'>Yesterday</SelectItem>
              <SelectItem value="last_week" className='data-[highlighted]:bg-[#FCDFD4] data-[state=checked]:bg-[#FCDFD4] data-[state=checked]:text-[#111827]'>Last Week</SelectItem>
              <SelectItem value="last_month" className='data-[highlighted]:bg-[#FCDFD4] data-[state=checked]:bg-[#FCDFD4] data-[state=checked]:text-[#111827]'>Last Month</SelectItem>
              <SelectItem value="last_year" className='data-[highlighted]:bg-[#FCDFD4] data-[state=checked]:bg-[#FCDFD4] data-[state=checked]:text-[#111827]'>Last Year</SelectItem>
              <SelectItem value="custom" className='data-[highlighted]:bg-[#FCDFD4] data-[state=checked]:bg-[#FCDFD4] data-[state=checked]:text-[#111827]'>Custom</SelectItem>
            </SelectContent>
          </Select>

          {dateFilter === 'custom' && (
            <>
              <input
                type="date"
                className="border border-gray-300 rounded px-2 py-1 text-sm"
                value={customDateRange.start}
                onChange={(e) => setCustomDateRange({ ...customDateRange, start: e.target.value })}
              />
              <span className="mx-1">to</span>
              <input
                type="date"
                className="border border-gray-300 rounded px-2 py-1 text-sm"
                value={customDateRange.end}
                onChange={(e) => setCustomDateRange({ ...customDateRange, end: e.target.value })}
              />
            </>
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